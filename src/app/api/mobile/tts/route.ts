import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Language mapping for TTS
const languageMapping: { [key: string]: string } = {
  'en': 'en',
  'hi': 'hi',
  'kn': 'kn',
  'ta': 'ta',
  'te': 'te',
  'bn': 'bn',
  'mr': 'mr',
  'gu': 'gu',
  'pa': 'pa',
  'ml': 'ml',
  'or': 'or',
  'as': 'as'
};

// In-memory cache for TTS responses
const ttsCache = new Map<string, Buffer>();

function createCacheKey(text: string, language: string, voice: string): string {
  return `${text.substring(0, 100)}_${language}_${voice}`;
}

function manageCacheSize() {
  if (ttsCache.size > 100) {
    const keysToDelete = Array.from(ttsCache.keys()).slice(0, 20);
    keysToDelete.forEach(key => ttsCache.delete(key));
  }
}

export async function POST(request: NextRequest) {
  try {
    const { text, language = 'en', voice = 'alloy' } = await request.json();

    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { 
          success: false,
          error: 'Text is required and must be a string',
          code: 'MISSING_TEXT'
        },
        { status: 400 }
      );
    }

    // Check if OpenAI is available
    if (!openai) {
      return NextResponse.json(
        { 
          success: false,
          error: 'OpenAI TTS service not configured',
          code: 'SERVICE_UNAVAILABLE'
        },
        { status: 503 }
      );
    }

    // Validate voice
    const validVoices = ['alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer'];
    if (!validVoices.includes(voice)) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Invalid voice. Must be one of: alloy, echo, fable, onyx, nova, shimmer',
          code: 'INVALID_VOICE'
        },
        { status: 400 }
      );
    }

    // Map language code
    const mappedLanguage = languageMapping[language] || 'en';

    console.log(`Generating mobile TTS for language: ${language} (mapped to: ${mappedLanguage})`);
    console.log(`Text length: ${text.length} characters`);

    // Check cache first
    const cacheKey = createCacheKey(text, mappedLanguage, voice);
    if (ttsCache.has(cacheKey)) {
      console.log('Mobile TTS cache hit!');
      const cachedBuffer = ttsCache.get(cacheKey)!;
      return new NextResponse(cachedBuffer, {
        headers: {
          'Content-Type': 'audio/mpeg',
          'Content-Length': cachedBuffer.length.toString(),
          'Cache-Control': 'public, max-age=86400', // Cache for 24 hours
          'X-Cache': 'HIT',
          'X-Success': 'true',
        },
      });
    }

    // For long texts, chunk them and process in parallel
    const maxChunkLength = 2000; // Reduced for mobile
    let audioChunks: Buffer[] = [];
    
    if (text.length > maxChunkLength) {
      const chunks = [];
      for (let i = 0; i < text.length; i += maxChunkLength) {
        chunks.push(text.slice(i, i + maxChunkLength));
      }
      
      // Process chunks in parallel
      const chunkPromises = chunks.map(async (chunk) => {
        try {
          const response = await openai.audio.speech.create({
            model: "tts-1",
            voice: voice as any,
            input: chunk,
            response_format: "mp3"
          });
          
          const arrayBuffer = await response.arrayBuffer();
          return Buffer.from(arrayBuffer);
        } catch (error) {
          console.error('TTS chunk error:', error);
          return Buffer.alloc(0);
        }
      });
      
      audioChunks = await Promise.all(chunkPromises);
    } else {
      // Single chunk
      const response = await openai.audio.speech.create({
        model: "tts-1",
        voice: voice as any,
        input: text,
        response_format: "mp3"
      });
      
      const arrayBuffer = await response.arrayBuffer();
      audioChunks = [Buffer.from(arrayBuffer)];
    }

    // Combine audio chunks
    const combinedBuffer = Buffer.concat(audioChunks);
    
    // Cache the result
    ttsCache.set(cacheKey, combinedBuffer);
    manageCacheSize();

    console.log(`Mobile TTS generated successfully: ${combinedBuffer.length} bytes`);

    return new NextResponse(combinedBuffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': combinedBuffer.length.toString(),
        'Cache-Control': 'public, max-age=86400', // Cache for 24 hours
        'X-Cache': 'MISS',
        'X-Success': 'true',
      },
    });

  } catch (error) {
    console.error('Mobile TTS API error:', error);
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to generate speech. Please try again.',
        code: 'TTS_GENERATION_ERROR'
      },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

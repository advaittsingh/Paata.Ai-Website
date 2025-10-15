import { NextRequest, NextResponse } from 'next/server';

// Only initialize OpenAI if API key is available
let openai: any = null;
if (process.env.OPENAI_API_KEY) {
  const OpenAI = require('openai').default;
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

// OpenAI TTS language mapping
const languageMapping: { [key: string]: string } = {
  'hi': 'hi', // Hindi
  'kn': 'kn', // Kannada
  'ta': 'ta', // Tamil
  'te': 'te', // Telugu
  'bn': 'bn', // Bengali
  'mr': 'mr', // Marathi
  'gu': 'gu', // Gujarati
  'pa': 'pa', // Punjabi
  'ml': 'ml', // Malayalam
  'or': 'or', // Odia
  'as': 'as', // Assamese
  'en': 'en'  // English
};

// In-memory cache for TTS responses
const ttsCache = new Map<string, Buffer>();
const MAX_CACHE_SIZE = 100; // Maximum number of cached responses

// Helper function to create cache key
function createCacheKey(text: string, language: string, voice: string): string {
  return `${text.substring(0, 100)}_${language}_${voice}`;
}

// Helper function to chunk long text
function chunkText(text: string, maxLength: number = 200): string[] {
  if (text.length <= maxLength) {
    return [text];
  }
  
  const chunks: string[] = [];
  const sentences = text.split(/[.!?]+/);
  let currentChunk = '';
  
  for (const sentence of sentences) {
    if (currentChunk.length + sentence.length <= maxLength) {
      currentChunk += sentence + '.';
    } else {
      if (currentChunk) {
        chunks.push(currentChunk.trim());
      }
      currentChunk = sentence + '.';
    }
  }
  
  if (currentChunk) {
    chunks.push(currentChunk.trim());
  }
  
  return chunks;
}

// Helper function to manage cache size
function manageCacheSize() {
  if (ttsCache.size > MAX_CACHE_SIZE) {
    const keys = Array.from(ttsCache.keys());
    const keysToDelete = keys.slice(0, ttsCache.size - MAX_CACHE_SIZE);
    keysToDelete.forEach(key => ttsCache.delete(key));
  }
}

export async function POST(request: NextRequest) {
  try {
    const { text, language = 'en', voice = 'alloy' } = await request.json();

    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: 'Text is required and must be a string' },
        { status: 400 }
      );
    }

    // Check if OpenAI is available
    if (!openai) {
      return NextResponse.json(
        { error: 'OpenAI TTS service not configured. Please set OPENAI_API_KEY environment variable.' },
        { status: 503 }
      );
    }

    // Validate voice
    const validVoices = ['alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer'];
    if (!validVoices.includes(voice)) {
      return NextResponse.json(
        { error: 'Invalid voice. Must be one of: alloy, echo, fable, onyx, nova, shimmer' },
        { status: 400 }
      );
    }

    // Map language code
    const mappedLanguage = languageMapping[language] || 'en';

    console.log(`Generating TTS for language: ${language} (mapped to: ${mappedLanguage})`);
    console.log(`Text length: ${text.length} characters`);

    // Check cache first
    const cacheKey = createCacheKey(text, mappedLanguage, voice);
    if (ttsCache.has(cacheKey)) {
      console.log('TTS cache hit!');
      const cachedBuffer = ttsCache.get(cacheKey)!;
      return new NextResponse(cachedBuffer, {
        headers: {
          'Content-Type': 'audio/mpeg',
          'Content-Length': cachedBuffer.length.toString(),
          'Cache-Control': 'public, max-age=86400', // Cache for 24 hours
          'X-Cache': 'HIT',
        },
      });
    }

    // For long texts, chunk them and process in parallel
    if (text.length > 200) {
      const chunks = chunkText(text, 200);
      console.log(`Processing ${chunks.length} chunks in parallel`);
      
      // Process chunks in parallel
      const chunkPromises = chunks.map(async (chunk) => {
        const chunkCacheKey = createCacheKey(chunk, mappedLanguage, voice);
        
        // Check chunk cache
        if (ttsCache.has(chunkCacheKey)) {
          return ttsCache.get(chunkCacheKey)!;
        }
        
        // Generate TTS for chunk
        const mp3 = await openai.audio.speech.create({
          model: "tts-1",
          voice: voice as any,
          input: chunk,
          response_format: "mp3",
        });
        
        const buffer = Buffer.from(await mp3.arrayBuffer());
        
        // Cache the chunk
        ttsCache.set(chunkCacheKey, buffer);
        manageCacheSize();
        
        return buffer;
      });
      
      const chunkBuffers = await Promise.all(chunkPromises);
      
      // Combine all chunks into one buffer
      const totalLength = chunkBuffers.reduce((sum, buffer) => sum + buffer.length, 0);
      const combinedBuffer = Buffer.concat(chunkBuffers, totalLength);
      
      // Cache the combined result
      ttsCache.set(cacheKey, combinedBuffer);
      manageCacheSize();
      
      return new NextResponse(combinedBuffer, {
        headers: {
          'Content-Type': 'audio/mpeg',
          'Content-Length': combinedBuffer.length.toString(),
          'Cache-Control': 'public, max-age=86400', // Cache for 24 hours
          'X-Cache': 'MISS',
        },
      });
    }

    // For short texts, process normally
    const mp3 = await openai.audio.speech.create({
      model: "tts-1",
      voice: voice as any,
      input: text,
      response_format: "mp3",
    });

    // Convert the response to a buffer
    const buffer = Buffer.from(await mp3.arrayBuffer());
    
    // Cache the result
    ttsCache.set(cacheKey, buffer);
    manageCacheSize();

    // Return the audio file
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': buffer.length.toString(),
        'Cache-Control': 'public, max-age=86400', // Cache for 24 hours
        'X-Cache': 'MISS',
      },
    });

  } catch (error) {
    console.error('TTS API error:', error);
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Handle preflight requests
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

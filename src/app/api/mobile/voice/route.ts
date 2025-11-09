import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { PrismaDatabase } from '@/lib/prisma-database';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function verifyToken(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  
  const token = authHeader.substring(7);
  try {
    return jwt.verify(token, JWT_SECRET) as any;
  } catch {
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verify JWT token
    const decoded = verifyToken(request);
    if (!decoded) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Authentication required',
          code: 'AUTH_REQUIRED'
        },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const audioFile = formData.get('audio') as File;
    const sessionId = formData.get('sessionId') as string || 'mobile-session';
    const conversationHistory = JSON.parse(formData.get('conversationHistory') as string || '[]');
    const sessionContext = formData.get('sessionContext') as string || '';
    const contextMetadata = JSON.parse(formData.get('contextMetadata') as string || '{}');

    if (!audioFile) {
      return NextResponse.json(
        { 
          success: false,
          error: 'No audio file provided',
          code: 'MISSING_AUDIO'
        },
        { status: 400 }
      );
    }

    // Validate audio format
    const allowedTypes = ['audio/mp3', 'audio/mp4', 'audio/wav', 'audio/mpeg', 'audio/webm'];
    if (!allowedTypes.includes(audioFile.type)) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Invalid audio format. Supported: MP3, MP4, WAV, WebM',
          code: 'INVALID_AUDIO_FORMAT'
        },
        { status: 400 }
      );
    }

    // Check file size (25MB limit)
    const maxSize = 25 * 1024 * 1024; // 25MB
    if (audioFile.size > maxSize) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Audio file too large. Maximum size: 25MB',
          code: 'AUDIO_TOO_LARGE'
        },
        { status: 400 }
      );
    }

    // Get user to check plan limits
    const user = await PrismaDatabase.getUserById(decoded.userId);
    if (!user) {
      return NextResponse.json(
        { 
          success: false,
          error: 'User not found',
          code: 'USER_NOT_FOUND'
        },
        { status: 404 }
      );
    }

    console.log('🎤 Mobile voice processing:', {
      fileName: audioFile.name,
      size: audioFile.size,
      type: audioFile.type,
      sessionId,
      userId: user.id
    });

    // Step 1: Convert speech to text using OpenAI Whisper
    const transcribedText = await convertSpeechToText(audioFile);
    
    if (!transcribedText || transcribedText.trim().length === 0) {
      return NextResponse.json({
        success: false,
        error: 'Could not transcribe the audio. Please try speaking more clearly.',
        code: 'TRANSCRIPTION_FAILED',
        transcribedText: '',
        aiResponse: 'I apologize, but I couldn\'t understand what you said. Please try speaking more clearly or type your question instead.'
      });
    }

    console.log('📝 Mobile transcribed text:', transcribedText);

    // Step 2: Generate AI response
    const aiResponse = await generateMobileAIResponse(
      transcribedText,
      conversationHistory,
      sessionContext,
      user.plan
    );

    // Step 3: Update user stats
    const today = new Date().toISOString().split('T')[0];
    const currentStats = user.stats as any || {};
    const dailyUsage = currentStats.dailyUsage || {};
    const todayUsage = dailyUsage[today] || {
      interactions: 0,
      timeSpent: 0,
      textMessages: 0,
      imageUploads: 0,
      voiceInputs: 0
    };
    
    const updatedTodayUsage = {
      ...todayUsage,
      interactions: todayUsage.interactions + 1,
      voiceInputs: todayUsage.voiceInputs + 1,
      timeSpent: todayUsage.timeSpent + 3 // Add 3 minutes for voice interaction
    };
    
    const updatedStats = {
      totalInteractions: (currentStats.totalInteractions || 0) + 1,
      voiceInputs: (currentStats.voiceInputs || 0) + 1,
      totalTimeSpent: formatTimeSpent((parseInt(currentStats.totalTimeSpent?.replace(/[^\d]/g, '') || '0') + 3)),
      dailyUsage: {
        ...dailyUsage,
        [today]: updatedTodayUsage
      },
      lastActiveDate: today
    };
    
    const updatedUser = await PrismaDatabase.updateUser(user.id, {
      stats: {
        ...currentStats,
        ...updatedStats
      }
    });

    return NextResponse.json({
      success: true,
      transcribedText: transcribedText,
      aiResponse: aiResponse,
      sessionId,
      user: {
        id: updatedUser?.id,
        plan: updatedUser?.plan,
        stats: updatedStats
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Mobile voice API error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to process voice input. Please try again.',
      code: 'VOICE_PROCESSING_ERROR',
      transcribedText: '',
      aiResponse: ''
    }, { status: 500 });
  }
}

async function convertSpeechToText(audioFile: File): Promise<string> {
  try {
    console.log('🎤 Starting OpenAI Whisper speech-to-text processing...');
    
    // Convert audio file to buffer
    const audioBuffer = Buffer.from(await audioFile.arrayBuffer());
    
    // Create a File object for OpenAI API with proper MIME type
    const mimeType = audioFile.type || 'audio/mp4';
    const audioBlob = new File([audioBuffer], audioFile.name, { type: mimeType });
    
    console.log('📡 Sending audio to OpenAI Whisper API...', { mimeType, fileName: audioFile.name });
    const transcription = await openai.audio.transcriptions.create({
      file: audioBlob,
      model: "whisper-1",
      language: "en",
      response_format: "text"
    });
    
    const transcribedText = transcription.toString().trim();
    
    if (!transcribedText) {
      console.log('⚠️ No speech detected in audio');
      return '';
    }
    
    console.log('✅ Speech-to-text successful:', transcribedText);
    return transcribedText;
    
  } catch (error) {
    console.error('❌ Speech-to-text error:', error);
    return '';
  }
}

async function generateMobileAIResponse(
  transcribedText: string,
  conversationHistory: any[],
  sessionContext: string,
  userPlan: string
): Promise<string> {
  try {
    const messages = [
      {
        role: "system" as const,
        content: `You are PAATA.AI, an intelligent homework assistant optimized for mobile voice interactions. 

Your role is to:
1. Provide clear, concise educational explanations perfect for voice responses
2. Guide students through step-by-step solutions
3. Encourage understanding rather than just giving answers
4. Adapt your response to the student's academic level
5. Be encouraging and supportive
6. Remember previous questions and maintain conversation flow
7. Provide mobile-friendly responses optimized for voice output
8. Handle different types of questions intelligently
9. Be especially helpful for students using voice input on mobile

VOICE OPTIMIZATION:
- Keep responses clear and well-structured for voice output
- Use natural speech patterns and pauses
- Avoid overly complex sentences
- Use <strong> for important terms and <em> for emphasis
- Structure responses with clear headings for better readability

RESPONSE GUIDELINES:
- For simple greetings, respond briefly and ask what they'd like help with
- For complex topics, break down into digestible voice-friendly chunks
- Use bullet points and short paragraphs for better mobile readability
- Match the complexity to the user's input
- Be especially clear since this is a voice input

Current conversation context:${sessionContext ? `\n\nSession Summary: ${sessionContext}` : ''}`
      }
    ];

    // Add conversation history
    if (conversationHistory && conversationHistory.length > 0) {
      conversationHistory.forEach((msg: any) => {
        messages.push({
          role: msg.isUser ? "user" as const : "assistant" as const,
          content: msg.text
        });
      });
    }

    // Add the current voice input
    messages.push({
      role: "user" as const,
      content: `Student voice input: "${transcribedText}"`
    });

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: messages,
      max_tokens: 600, // Shorter for voice
      temperature: 0.7,
    });

    return completion.choices[0]?.message?.content || 'I apologize, but I could not generate a response. Please try again.';

  } catch (error) {
    console.error('AI response generation error:', error);
    return `I'm here to help with your homework! I can assist with various subjects including math, science, English, history, and more. What would you like help with today?`;
  }
}

function formatTimeSpent(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
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

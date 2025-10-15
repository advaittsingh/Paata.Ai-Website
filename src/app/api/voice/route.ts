import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { contextManager } from '@/utils/contextManager';
import { detectLanguage, formatLanguagePrompt, cleanMessageForLanguage } from '@/utils/languageDetector';
import { PrismaDatabase } from '@/lib/prisma-database';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const audioFile = formData.get('audio') as File;
    const sessionId = formData.get('sessionId') as string || 'default-session';
    const conversationHistory = JSON.parse(formData.get('conversationHistory') as string || '[]');
    const sessionContext = formData.get('sessionContext') as string || '';
    const userId = formData.get('userId') as string;

    if (!audioFile) {
      return NextResponse.json(
        { error: 'No audio file provided' },
        { status: 400 }
      );
    }

    console.log('🎤 Processing voice input:', {
      fileName: audioFile.name,
      size: audioFile.size,
      type: audioFile.type,
      sessionId
    });

    // Log supported audio formats for debugging
    console.log('🎵 Audio file details:', {
      name: audioFile.name,
      type: audioFile.type,
      size: audioFile.size,
      lastModified: audioFile.lastModified
    });

    // Step 1: Convert speech to text using Google Speech-to-Text
    const transcribedText = await convertSpeechToText(audioFile);
    
    if (!transcribedText || transcribedText.trim().length === 0) {
      return NextResponse.json({
        success: false,
        error: 'Could not transcribe the audio. Please try speaking more clearly or check your microphone.',
        transcribedText: '',
        aiResponse: 'I apologize, but I couldn\'t understand what you said. Please try speaking more clearly or type your question instead.'
      });
    }

    console.log('📝 Transcribed text:', transcribedText);

    // Step 2: Add context to the context manager
    const contextItem = contextManager.addContext(
      sessionId, 
      'voice', 
      transcribedText, 
      {
        audioFileName: audioFile.name,
        audioSize: audioFile.size,
        audioType: audioFile.type,
        transcriptionLength: transcribedText.length,
        messageCount: conversationHistory.length
      }
    );

    // Step 3: Get relevant context for this conversation
    const { primaryContext, relatedContexts, contextSummary } = contextManager.getRelevantContext(sessionId, transcribedText);

    // Step 4: Generate AI response using Gemini
    const aiResponse = await generateAIResponse(
      transcribedText,
      conversationHistory,
      sessionContext,
      contextSummary,
      relatedContexts,
      primaryContext
    );

    // Step 5: Update user stats if user is authenticated
    let updatedUser = null;
    if (userId) {
      const user = await PrismaDatabase.getUserById(userId);
      if (user) {
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
        
        // Update today's usage for voice input
        const updatedTodayUsage = {
          ...todayUsage,
          interactions: todayUsage.interactions + 1,
          voiceInputs: todayUsage.voiceInputs + 1,
          timeSpent: todayUsage.timeSpent + 2 // Add 2 minutes for voice interaction
        };
        
        const updatedStats = {
          totalInteractions: (currentStats.totalInteractions || 0) + 1,
          voiceInputs: (currentStats.voiceInputs || 0) + 1,
          totalTimeSpent: formatTimeSpent((parseInt(currentStats.totalTimeSpent?.replace(/[^\d]/g, '') || '0') + 2)),
          dailyUsage: {
            ...dailyUsage,
            [today]: updatedTodayUsage
          },
          lastActiveDate: today
        };
        
        updatedUser = await PrismaDatabase.updateUser(user.id, {
          stats: {
            ...currentStats,
            ...updatedStats
          }
        });
      }
    }

    // Step 6: Get context switching suggestions
    const suggestions = contextManager.getContextSwitchingSuggestions(sessionId, transcribedText);
    const sessionStats = contextManager.getSessionStats(sessionId);

    return NextResponse.json({
      success: true,
      transcribedText: transcribedText,
      aiResponse: aiResponse,
      updatedUser: updatedUser,
      context: {
        currentContextId: contextItem.id,
        contextType: 'voice',
        relatedContexts: relatedContexts.length,
        suggestions: suggestions,
        sessionStats: sessionStats
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Voice API error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to process voice input. Please try again.',
      transcribedText: '',
      aiResponse: ''
    }, { status: 500 });
  }
}

async function convertSpeechToText(audioFile: File): Promise<string> {
  try {
    console.log('🎤 Starting OpenAI Whisper speech-to-text processing...');
    
    // Initialize OpenAI client
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY || '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',
    });

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
    
    // Return empty string instead of mock data to avoid confusion
    console.log('🔄 Speech-to-text failed, returning empty transcription...');
    return '';
  }
}

async function generateAIResponse(
  transcribedText: string,
  conversationHistory: any[],
  sessionContext: string,
  contextSummary: string,
  relatedContexts: any[],
  primaryContext: any[]
): Promise<string> {
  try {
    // Initialize OpenAI client
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY || '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',
    });

    // Detect language from the transcribed text
    const languageInfo = detectLanguage(transcribedText);
    const cleanedText = cleanMessageForLanguage(transcribedText, languageInfo);
    const languagePrompt = formatLanguagePrompt(languageInfo, transcribedText);

    // Build conversation messages for GPT
    const messages = [
      {
        role: "system" as const,
        content: `You are PAATA.AI, an intelligent homework assistant designed to help students learn and understand academic concepts. 

Your role is to:
1. Provide clear, educational explanations
2. Guide students through step-by-step solutions
3. Encourage understanding rather than just giving answers
4. Adapt your response to the student's academic level
5. Be encouraging and supportive
6. Remember previous questions and maintain conversation flow
7. Build upon previous discussions to provide continuity
8. Handle different types of questions intelligently
9. Provide seamless, natural responses
10. Be especially attentive to voice inputs as they often indicate confusion or need for clarification

RESPONSE GUIDELINES:
- For simple greetings (hello, hi, hey), respond briefly and ask what they'd like help with
- For casual conversation, keep responses conversational and not overly academic
- Only bring up previous topics if directly relevant to the current question
- Don't over-explain or provide extensive context for simple interactions
- Match the complexity and length of your response to the user's input
- Voice inputs should be clear and concise, not overly verbose

TRANSLATION AND LANGUAGE INSTRUCTIONS:
- When a student asks for translation to English, ALWAYS respond in English
- If the content contains text in other languages, provide the English translation
- Do not respond in the source language when English translation is requested
- For translation requests, provide both the translation and explanation in English

FORMATTING INSTRUCTIONS:
- Use <strong>text</strong> for bold headings and important terms
- Use <em>text</em> for emphasis
- Use bullet points with * or - at the start of lines for lists
- Structure your responses with clear headings using <strong> tags
- Break up long explanations with line breaks for better readability

VOICE INPUT CONTEXT: The student has spoken their question, which often indicates:
- They may be confused or need clarification
- They prefer verbal communication
- They might be multitasking or have accessibility needs
- The question might be more complex or urgent

CONVERSATION AWARENESS: You have access to the conversation history and can:
- Reference previous questions and answers naturally
- Build upon concepts already discussed
- Provide personalized assistance based on the full conversation history
- Maintain continuity in the learning process
- Respond naturally to any question without mentioning topic changes
- Avoid repeating information already covered
- Be especially clear and detailed since this is a voice input

Current conversation context:${sessionContext ? `\n\nSession Summary: ${sessionContext}` : ''}`
      }
    ];

    // Add conversation history if available
    if (conversationHistory && conversationHistory.length > 0) {
      conversationHistory.forEach((msg: any) => {
        messages.push({
          role: msg.isUser ? "user" as const : "assistant" as const,
          content: msg.text
        });
      });
    }

    // Add context switching information
    if (relatedContexts.length > 0) {
      let contextInfo = "\n\nRelated Contexts:\n";
      relatedContexts.forEach((ctx) => {
        contextInfo += `${ctx.type.toUpperCase()}: ${ctx.content.substring(0, 100)}...\n`;
      });
      messages[messages.length - 1].content += contextInfo;
    }

    // Add the current voice input
    messages.push({
      role: "user" as const,
      content: `Current student voice input: "${cleanedText}"

Please provide a helpful, educational response that:
1. Builds upon our previous conversation naturally
2. Is clear and well-structured since the student will likely hear this response
3. Helps the student learn and understand the concept
4. Guides them through solutions step by step if it's a specific problem
5. Maintains continuity with previous discussions
6. Provides comprehensive explanations
7. Responds directly to the question without mentioning topic changes or transitions
8. Never says phrases like "shifting gears", "changing topics", or "moving from X to Y"${languagePrompt ? `\n\n${languagePrompt}` : ''}`
    });

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: messages,
      max_tokens: 1000,
      temperature: 0.7,
    });

    return completion.choices[0]?.message?.content || 'I apologize, but I could not generate a response. Please try again.';

  } catch (error) {
    console.error('AI response generation error:', error);
    
    // Fallback response for voice input
    return `I'm here to help with your homework! I can assist with various subjects including math, science, English, history, and more. Could you please repeat your question or ask me about a specific topic you're studying?`;
  }
}

// Handle OPTIONS request for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

// Helper function to format time spent
function formatTimeSpent(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
}

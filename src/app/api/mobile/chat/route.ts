import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { contextManager } from '@/utils/contextManager';
import { PrismaDatabase } from '@/lib/prisma-database';
import { getPlanFeatures, hasReachedConversationLimit, canUseFeature } from '@/utils/planLimits';
import { detectLanguage, formatLanguagePrompt, cleanMessageForLanguage } from '@/utils/languageDetector';
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

    const { 
      message, 
      conversationHistory = [],
      sessionContext = '',
      sessionId = 'mobile-session',
      inputType = 'text',
      contextMetadata = {},
      pushNotification = false
    } = await request.json();

    if (!message) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Message is required',
          code: 'MISSING_MESSAGE'
        },
        { status: 400 }
      );
    }

    // Get user data and check plan restrictions
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
    
    const planFeatures = getPlanFeatures(user.plan);
        
    // Check conversation limit
    if (hasReachedConversationLimit(user.plan, user.stats.totalInteractions || 0)) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Conversation limit reached for your plan',
          code: 'LIMIT_REACHED',
          plan: user.plan,
          limit: planFeatures.limits.maxConversations
        },
        { status: 403 }
      );
    }

    // Check feature access
    if (inputType === 'image' && !canUseFeature(user.plan, 'imageAnalysis')) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Image analysis not available in your plan',
          code: 'FEATURE_UNAVAILABLE',
          plan: user.plan
        },
        { status: 403 }
      );
    }

    // Language detection and processing
    const languageInfo = detectLanguage(message);
    const cleanedMessage = cleanMessageForLanguage(message, languageInfo);
    const languagePrompt = formatLanguagePrompt(languageInfo, cleanedMessage);

    // Add context to context manager
    const contextItem = contextManager.addContext(
      sessionId, 
      inputType, 
      cleanedMessage, 
      {
        ...contextMetadata,
        userId: user.id,
        plan: user.plan,
        deviceInfo: decoded.deviceInfo || 'mobile-app'
      }
    );

    // Get relevant context
    const { primaryContext, relatedContexts, contextSummary } = contextManager.getRelevantContext(sessionId, cleanedMessage);

    // Generate AI response
    const aiResponse = await generateMobileAIResponse(
      cleanedMessage,
      conversationHistory,
      sessionContext,
      contextSummary,
      relatedContexts,
      primaryContext,
      languagePrompt,
      user.plan
    );

    // Update user stats
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
      textMessages: todayUsage.textMessages + 1,
      timeSpent: todayUsage.timeSpent + 1 // Add 1 minute for text interaction
    };
    
    const updatedStats = {
      totalInteractions: (currentStats.totalInteractions || 0) + 1,
      textMessages: (currentStats.textMessages || 0) + 1,
      totalTimeSpent: formatTimeSpent((parseInt(currentStats.totalTimeSpent?.replace(/[^\d]/g, '') || '0') + 1)),
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

    // Get context switching suggestions
    const suggestions = contextManager.getContextSwitchingSuggestions(sessionId, cleanedMessage);
    const sessionStats = contextManager.getSessionStats(sessionId);

    return NextResponse.json({
      success: true,
      response: aiResponse,
      context: {
        currentContextId: contextItem.id,
        contextType: inputType,
        relatedContexts: relatedContexts.length,
        suggestions: suggestions,
        sessionStats: sessionStats
      },
      user: {
        id: updatedUser?.id,
        plan: updatedUser?.plan,
        stats: updatedUser?.stats
      },
      language: {
        detected: languageInfo.language,
        confidence: languageInfo.confidence,
        isExplicitlyRequested: languageInfo.isExplicitlyRequested
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Mobile chat API error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to process message. Please try again.',
      code: 'PROCESSING_ERROR'
    }, { status: 500 });
  }
}

async function generateMobileAIResponse(
  message: string,
  conversationHistory: any[],
  sessionContext: string,
  contextSummary: string,
  relatedContexts: any[],
  primaryContext: any[],
  languagePrompt: string,
  userPlan: string
): Promise<string> {
  try {
    const messages = [
      {
        role: "system" as const,
        content: `You are PAATA.AI, an intelligent homework assistant designed for mobile users. 

Your role is to:
1. Provide clear, concise educational explanations optimized for mobile screens
2. Guide students through step-by-step solutions
3. Encourage understanding rather than just giving answers
4. Adapt your response to the student's academic level
5. Be encouraging and supportive
6. Remember previous questions and maintain conversation flow
7. Provide mobile-friendly responses (shorter paragraphs, clear formatting)
8. Handle different types of questions intelligently
9. Be especially helpful for students using mobile devices

MOBILE OPTIMIZATION:
- Keep responses concise but comprehensive
- Use clear formatting with bullet points and short paragraphs
- Avoid overly long explanations that are hard to read on mobile
- Use <strong> for important terms and <em> for emphasis
- Structure responses with clear headings

RESPONSE GUIDELINES:
- For simple greetings, respond briefly and ask what they'd like help with
- For complex topics, break down into digestible mobile-friendly chunks
- Use bullet points and short paragraphs for better mobile readability
- Match the complexity to the user's input

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

    // Add context information
    if (relatedContexts.length > 0) {
      let contextInfo = "\n\nRelated Contexts:\n";
      relatedContexts.forEach((ctx) => {
        contextInfo += `${ctx.type.toUpperCase()}: ${ctx.content.substring(0, 100)}...\n`;
      });
      messages[messages.length - 1].content += contextInfo;
    }

    // Add the current message
    messages.push({
      role: "user" as const,
      content: `Student question: "${message}"${languagePrompt ? `\n\n${languagePrompt}` : ''}`
    });

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: messages,
      max_tokens: 800, // Shorter for mobile
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

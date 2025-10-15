import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { contextManager } from '@/utils/contextManager';
import { PrismaDatabase } from '@/lib/prisma-database';
import { getPlanFeatures, hasReachedConversationLimit, canUseFeature } from '@/utils/planLimits';
import { detectLanguage, formatLanguagePrompt, cleanMessageForLanguage } from '@/utils/languageDetector';

export async function POST(request: NextRequest) {
  try {
    const { 
      message, 
      conversationHistory, 
      sessionContext, 
      sessionId = 'default-session',
      inputType = 'text',
      contextMetadata = {},
      userId
    } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Require authentication - userId is mandatory
    if (!userId) {
      return NextResponse.json(
        { 
          error: 'Authentication required',
          message: 'Please sign in to use the chat feature. Sign up or log in to continue.',
          requiresAuth: true
        },
        { status: 401 }
      );
    }

    // Get user data and check plan restrictions
    let user = null;
    let planFeatures = null;
    
    user = await PrismaDatabase.getUserById(userId);
    if (!user) {
      return NextResponse.json(
        { 
          error: 'User not found',
          message: 'Please sign in to use the chat feature.',
          requiresAuth: true
        },
        { status: 401 }
      );
    }
    
    planFeatures = getPlanFeatures(user.plan);
        
    // Check conversation limit
    if (hasReachedConversationLimit(user.plan, user.stats?.totalInteractions || 0)) {
      return NextResponse.json(
        { 
          error: 'Conversation limit reached',
          message: `You have reached your monthly limit of ${planFeatures.limits.maxConversations} conversations. Please upgrade your plan to continue.`,
          upgradeRequired: true,
          currentPlan: user.plan,
          limit: planFeatures.limits.maxConversations
        },
        { status: 403 }
      );
    }

    // Check feature restrictions
    if (inputType === 'image' && !canUseFeature(user.plan, 'imageAnalysis')) {
      return NextResponse.json(
        { 
          error: 'Feature not available',
          message: 'Image analysis is not available in your current plan. Please upgrade to Pro or Enterprise.',
          upgradeRequired: true,
          currentPlan: user.plan,
          requiredFeature: 'imageAnalysis'
        },
        { status: 403 }
      );
    }

    if (inputType === 'voice' && !canUseFeature(user.plan, 'voiceInput')) {
      return NextResponse.json(
        { 
          error: 'Feature not available',
          message: 'Voice input is not available in your current plan. Please upgrade to Pro or Enterprise.',
          upgradeRequired: true,
          currentPlan: user.plan,
          requiredFeature: 'voiceInput'
        },
        { status: 403 }
      );
    }

    // Add context to the context manager
    const contextItem = contextManager.addContext(
      sessionId, 
      inputType as 'text' | 'image' | 'voice', 
      message, 
      contextMetadata
    );

    // Get relevant context for this conversation
    const { primaryContext, relatedContexts, contextSummary } = contextManager.getRelevantContext(sessionId, message);

    // Initialize OpenAI client
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY || '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',
    });

    // Detect language from the user's message
    const languageInfo = detectLanguage(message);
    const cleanedMessage = cleanMessageForLanguage(message, languageInfo);
    const languagePrompt = formatLanguagePrompt(languageInfo, message);

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

RESPONSE GUIDELINES:
- For simple greetings (hello, hi, hey), respond briefly and ask what they'd like help with
- For casual conversation, keep responses conversational and not overly academic
- Only bring up previous topics if directly relevant to the current question
- Don't over-explain or provide extensive context for simple interactions
- Match the complexity and length of your response to the user's input

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

CONVERSATION AWARENESS: You have access to the conversation history and can:
- Reference previous questions and answers naturally
- Build upon concepts already discussed
- Provide personalized assistance based on the full conversation history
- Maintain continuity in the learning process
- Respond naturally to any question without mentioning topic changes
- Avoid repeating information already covered

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

    // Add the current input
    messages.push({
      role: "user" as const,
      content: `Current student ${inputType} input: ${cleanedMessage}

Please provide a helpful, educational response that:
1. Builds upon our previous conversation naturally
2. Helps the student learn and understand the concept
3. Guides them through solutions step by step if it's a specific problem
4. Maintains continuity with previous discussions
5. Provides clear, comprehensive explanations
6. Responds directly to the question without mentioning topic changes or transitions
7. Never says phrases like "shifting gears", "changing topics", or "moving from X to Y"${languagePrompt ? `\n\n${languagePrompt}` : ''}`
    });

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: messages,
        max_tokens: 1000,
        temperature: 0.7,
      });

      const aiResponse = completion.choices[0]?.message?.content || 'I apologize, but I could not generate a response. Please try again.';

      // Update user stats if user is authenticated
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
        
        // Update today's usage
        const updatedTodayUsage = {
          ...todayUsage,
          interactions: todayUsage.interactions + 1,
          textMessages: inputType === 'text' ? todayUsage.textMessages + 1 : todayUsage.textMessages,
          imageUploads: inputType === 'image' ? todayUsage.imageUploads + 1 : todayUsage.imageUploads,
          voiceInputs: inputType === 'voice' ? todayUsage.voiceInputs + 1 : todayUsage.voiceInputs,
          timeSpent: todayUsage.timeSpent + 1 // Add 1 minute for this interaction
        };
        
        const updatedStats = {
          totalInteractions: (currentStats.totalInteractions || 0) + 1,
          textMessages: inputType === 'text' ? (currentStats.textMessages || 0) + 1 : currentStats.textMessages || 0,
          imageUploads: inputType === 'image' ? (currentStats.imageUploads || 0) + 1 : currentStats.imageUploads || 0,
          voiceInputs: inputType === 'voice' ? (currentStats.voiceInputs || 0) + 1 : currentStats.voiceInputs || 0,
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
        
        // Get context switching suggestions for authenticated users
        const suggestions = contextManager.getContextSwitchingSuggestions(sessionId, message);
        const sessionStats = contextManager.getSessionStats(sessionId);
        
        // Return updated user data so frontend can update context
        return NextResponse.json({
          response: aiResponse,
          timestamp: new Date().toISOString(),
          context: {
            currentContextId: contextItem.id,
            contextType: inputType,
            relatedContexts: relatedContexts.length,
            suggestions: suggestions,
            sessionStats: sessionStats
          },
          usage: updatedUser ? {
            currentPlan: updatedUser.plan,
            totalInteractions: updatedUser.stats?.totalInteractions || 0,
            remainingConversations: planFeatures ? (planFeatures.limits.maxConversations === 'unlimited' ? 'unlimited' : Math.max(0, planFeatures.limits.maxConversations - (updatedUser.stats?.totalInteractions || 0))) : null
          } : null,
          updatedUser: updatedUser // Include updated user data
        }, {
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        });
      } else {
        // Get context switching suggestions
        const suggestions = contextManager.getContextSwitchingSuggestions(sessionId, message);
        const sessionStats = contextManager.getSessionStats(sessionId);

        return NextResponse.json({
          response: aiResponse,
          timestamp: new Date().toISOString(),
          context: {
            currentContextId: contextItem.id,
            contextType: inputType,
            relatedContexts: relatedContexts.length,
            suggestions: suggestions,
            sessionStats: sessionStats
          },
          usage: user ? {
            currentPlan: user.plan,
            totalInteractions: (user.stats?.totalInteractions || 0) + 1,
            remainingConversations: planFeatures ? (planFeatures.limits.maxConversations === 'unlimited' ? 'unlimited' : Math.max(0, planFeatures.limits.maxConversations - ((user.stats?.totalInteractions || 0) + 1))) : null
          } : null
        }, {
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        });
      }
    } catch (openaiError) {
      console.error('OpenAI API error:', openaiError);
      
      // Fallback to simple AI response if OpenAI fails
      const fallbackResponse = await generateFallbackResponse(message);
      
      return NextResponse.json({
        response: fallbackResponse,
        timestamp: new Date().toISOString()
      }, {
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });
    }

  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function generateFallbackResponse(userMessage: string): Promise<string> {
  // Simple AI response logic for homework assistance
  const message = userMessage.toLowerCase();
  
  // Math-related responses
  if (message.includes('math') || message.includes('calculate') || message.includes('solve')) {
    return `I'd be happy to help you with your math problem! Please provide the specific question or equation you're working on, and I'll guide you through the solution step by step. Remember, understanding the process is more important than just getting the answer.`;
  }
  
  // Science-related responses
  if (message.includes('science') || message.includes('physics') || message.includes('chemistry') || message.includes('biology')) {
    return `Great! I can help you with science concepts and problems. Whether it's physics equations, chemistry reactions, or biology concepts, I'll explain the underlying principles and help you understand the material. What specific topic are you studying?`;
  }
  
  // Writing-related responses
  if (message.includes('write') || message.includes('essay') || message.includes('paragraph') || message.includes('story')) {
    return `I can help you with your writing assignment! I can assist with brainstorming ideas, structuring your essay, improving grammar and style, or explaining writing techniques. What type of writing are you working on?`;
  }
  
  // History-related responses
  if (message.includes('history') || message.includes('historical') || message.includes('war') || message.includes('ancient')) {
    return `History is fascinating! I can help you understand historical events, analyze causes and effects, or explain the significance of different periods. What historical topic or period are you studying?`;
  }
  
  // General homework help
  if (message.includes('homework') || message.includes('assignment') || message.includes('help')) {
    return `I'm here to help with your homework! I can assist with various subjects including math, science, English, history, and more. I'll guide you through the concepts and help you understand the material rather than just giving you answers. What subject or topic do you need help with?`;
  }
  
  // Default response for other queries
  return `I'm PAATA.AI, your intelligent homework assistant! I can help you with various subjects including:

* 📚 <strong>Math</strong>: Algebra, geometry, calculus, statistics
* 🔬 <strong>Science</strong>: Physics, chemistry, biology, earth science
* 📝 <strong>English</strong>: Writing, grammar, literature analysis
* 🏛️ <strong>History</strong>: World history, historical analysis
* 🌍 <strong>Geography</strong>: Countries, cultures, physical geography
* 💻 <strong>Computer Science</strong>: Programming concepts, algorithms

Please ask me a specific question about your homework, and I'll provide detailed explanations and step-by-step guidance to help you learn and understand the material better!`;
}

// Helper function to format time spent
function formatTimeSpent(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
}

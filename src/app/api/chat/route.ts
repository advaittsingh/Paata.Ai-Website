import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { contextManager } from '@/utils/contextManager';
import { PrismaDatabase } from '@/lib/prisma-database';
import { getPlanFeatures, hasReachedConversationLimit, canUseFeature } from '@/utils/planLimits';
import { detectLanguage, formatLanguagePrompt, cleanMessageForLanguage } from '@/utils/languageDetector';
import { gatherResearchData } from '@/utils/webSearch';
import { checkRateLimitEnhanced } from '@/lib/rate-limit-enhanced';
import { categorizeQuestion } from '@/utils/aiCategorizer';
import { checkAndAwardAchievements } from '@/lib/achievement-system';

export async function POST(request: NextRequest) {
  try {
    // Check rate limit for chat endpoint
    const rateLimit = checkRateLimitEnhanced(request, 'chat');
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { 
          error: 'Too many requests. Please slow down.',
          retryAfter: rateLimit.retryAfter
        },
        { 
          status: 429,
          headers: {
            'Retry-After': rateLimit.retryAfter?.toString() || '60',
            'X-RateLimit-Remaining': rateLimit.remaining?.toString() || '0'
          }
        }
      );
    }

    const { 
      message, 
      conversationHistory, 
      sessionContext, 
      sessionId = 'default-session',
      inputType = 'text',
      contextMetadata = {},
      userId,
      mode = 'standard', // 'standard', 'reasoning', 'explain_why'
      questionType = 'general' // 'general', 'pdf_question', 'exam_question'
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

    // Add context to the context manager (simplified to avoid potential issues)
    let contextItem;
    let relatedContexts = [];
    try {
      contextItem = contextManager.addContext(
        sessionId, 
        inputType as 'text' | 'image' | 'voice', 
        message, 
        contextMetadata
      );

      // Get relevant context for this conversation
      const contextData = contextManager.getRelevantContext(sessionId, message);
      relatedContexts = contextData.relatedContexts;
    } catch (contextError) {
      console.error('Context manager error:', contextError);
      // Continue without context management
    }

    // Initialize OpenAI client
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // Detect if this is an exam paper to solve
    // Only trigger for explicit exam paper requests or very specific keywords
    // Store in a variable that's accessible in catch block
    let isExamPaper = false;
    try {
      // Only treat as exam paper if:
      // 1. Explicitly marked as exam_question from frontend
      // 2. contextMetadata explicitly says it's an exam paper
      // 3. Very specific exam paper keywords (NOT just "solve question")
      const hasExplicitExamContext = questionType === 'exam_question' || contextMetadata?.isExamPaper;
      const hasSpecificExamKeywords = /solve.*entire.*paper|solve.*all.*questions.*paper|solve.*entire.*exam|previous.*year.*paper|previous.*year.*question.*paper|pyq.*paper|exam.*paper.*solve/i.test(message);
      
      isExamPaper = hasExplicitExamContext || hasSpecificExamKeywords;
    } catch (detectionError) {
      console.error('Error detecting exam paper:', detectionError);
      isExamPaper = false;
    }
    
    if (isExamPaper) {
      console.log('📝 Exam paper detected - will solve ALL questions');
      console.log('   Detection reason:', {
        questionType,
        contextMetadata: contextMetadata?.isExamPaper,
        messagePreview: message.substring(0, 200)
      });
    }
    
    // Detect language from the user's message
    const languageInfo = detectLanguage(message);
    const cleanedMessage = cleanMessageForLanguage(message, languageInfo);
    const languagePrompt = formatLanguagePrompt(languageInfo, message);

    // Build system prompt based on mode
    const systemPrompt = mode === 'reasoning' || mode === 'explain_why'
      ? `You are PAATA.AI operating in RESEARCH MODE - an advanced research and reasoning assistant.

Your capabilities in this mode:
1. **Deep Research**: Access to the latest information and academic research
2. **Comprehensive Analysis**: Provide in-depth, well-researched explanations
3. **Critical Thinking**: Analyze problems from multiple angles and perspectives
4. **Academic Context**: Reference theories, research, and scholarly knowledge
5. **Detailed Reasoning**: Show step-by-step thought processes
6. **Evidence-Based**: Support explanations with facts, data, and examples
7. **Comprehensive Coverage**: Leave no stone unturned in explaining concepts

RESEARCH MODE PROTOCOL:
- Synthesize information from multiple sources when available
- Provide comprehensive, well-structured responses
- Break down complex topics systematically
- Include relevant historical context, scientific principles, or academic theories
- Use analogies, examples, and case studies to illustrate concepts
- Explain both the "what" and "why" in detail
- Connect current topic to broader academic knowledge
- Provide actionable insights and practical applications

RESPONSE FORMAT:
- Start with a brief overview or summary
- Provide detailed explanation with reasoning
- Include relevant facts, data, or research findings
- Use clear structure (headings, bullet points)
- End with key takeaways or synthesis
- Be thorough but clear and accessible

You have access to web-researched information when available. Use this information to provide authoritative, comprehensive answers that demonstrate deep understanding.`
      : `You are PAATA.AI, an intelligent homework assistant designed to help students learn and understand academic concepts. 

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

Current conversation context:${sessionContext ? `\n\nSession Summary: ${sessionContext}` : ''}`;

    // Special handling for exam papers - solve ALL questions
    let examPaperPrompt = '';
    if (isExamPaper) {
      examPaperPrompt = `\n\n🚨 CRITICAL EXAM PAPER SOLVING INSTRUCTIONS:

You are solving a complete exam paper. You MUST:
1. Count the total number of questions in the paper first
2. Extract and solve EVERY question from question 1 to the last question
3. If you see questions numbered 9, 10, 11, 12, etc., you MUST include them all
4. Do NOT stop after question 3, 8, or any number - continue until the end
5. Process ALL sections of the paper (Section A, B, C, etc. if present)

For EACH AND EVERY question found in the paper, provide:
1. Question number (if available)
2. The complete question text
3. Question type (Multiple Choice, Short Answer, Long Answer, etc.)
4. Options (if MCQ)
5. The correct answer
6. Detailed step-by-step explanation/solution

VERY IMPORTANT:
- The paper may have 10, 15, 20, or more questions - extract ALL of them
- If the last question you extract is number 3 or 8, you are missing questions - continue reading
- Look for question numbers: 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, etc.
- Process the ENTIRE document from start to finish
- Your response must include solutions for ALL questions, not just the first few

Format your response clearly with each question numbered and fully solved.`;
    }

    // Build conversation messages for GPT
    const messages = [
      {
        role: "system" as const,
        content: systemPrompt
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

    // Add reasoning-specific prompt if mode is reasoning
    if (mode === 'reasoning' || mode === 'explain_why') {
      // In advanced reasoning mode, gather web research data
      // Add timeout to prevent blocking for too long
      let researchData = '';
      try {
        console.log('🔍 Advanced reasoning mode: Gathering research data...');
        const researchPromise = gatherResearchData(cleanedMessage, 5);
        const researchTimeout = new Promise<string>((resolve) => 
          setTimeout(() => resolve(''), 8000) // 8 second timeout
        );
        researchData = await Promise.race([researchPromise, researchTimeout]);
        console.log('📚 Research data gathered:', researchData ? 'Yes' : 'No');
      } catch (error) {
        console.error('Research data gathering error:', error);
        // Continue without research data if it fails
      }
      
      const reasoningPrompt = `RESEARCH MODE ACTIVATED - Think deeply and comprehensively.

You are operating in advanced research and reasoning mode. This means:
1. You have access to web-researched information (if available)
2. You should provide highly detailed, well-reasoned explanations
3. Think step-by-step, showing your work
4. Connect concepts to the broader academic context
5. Cite specific principles, theories, and examples
6. Provide in-depth analysis, not surface-level answers
7. Take your time to build a comprehensive understanding

${researchData ? `\n${researchData}` : ''}

STUDENT QUESTION: ${cleanedMessage}

Your task:
- Provide a comprehensive, research-backed explanation
- Explain the fundamental principles and underlying concepts
- Show detailed step-by-step reasoning
- Connect to related academic concepts
- Provide examples and analogies to illustrate understanding
- Reference academic theories, research, or historical context where relevant
- Ensure your answer demonstrates deep understanding, not just memorization

Take your time to think through this carefully and provide a thorough, well-reasoned response.`;
      
      messages.push({
        role: "user" as const,
        content: reasoningPrompt
      });
    } else {
      // Add the current input for standard mode
      const userMessageContent = isExamPaper
        ? `${examPaperPrompt}\n\n${cleanedMessage}`
        : `Current student ${inputType} input: ${cleanedMessage}

Please provide a helpful, educational response that:
1. Builds upon our previous conversation naturally
2. Helps the student learn and understand the concept
3. Guides them through solutions step by step if it's a specific problem
4. Maintains continuity with previous discussions
5. Provides clear, comprehensive explanations
6. Responds directly to the question without mentioning topic changes or transitions
7. Never says phrases like "shifting gears", "changing topics", or "moving from X to Y"${languagePrompt ? `\n\n${languagePrompt}` : ''}`;
      
      messages.push({
        role: "user" as const,
        content: userMessageContent
      });
    }

    try {
      console.log('Starting OpenAI API call...');
      
      // In reasoning mode or exam paper mode, increase timeout and tokens for deeper analysis
      const isAdvancedReasoning = mode === 'reasoning' || mode === 'explain_why';
      const timeout = isAdvancedReasoning || isExamPaper ? 180000 : 30000; // 180s for exam papers/reasoning, 30s for standard
      const maxTokens = isExamPaper ? 32000 : (isAdvancedReasoning ? 2500 : 1000); // 32k tokens for exam papers (full paper solutions)
      
      if (isExamPaper) {
        console.log('📊 Exam paper API call config:', {
          timeout: timeout / 1000 + 's',
          maxTokens: maxTokens,
          model: 'gpt-4o'
        });
      }
      
      // Add timeout to prevent hanging
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('OpenAI API timeout')), timeout);
      });
      
      let completionPromise;
      try {
        completionPromise = openai.chat.completions.create({
          model: "gpt-4o",
          messages: messages,
          max_tokens: maxTokens,
          temperature: isAdvancedReasoning ? 0.6 : 0.7, // Lower temperature for more focused reasoning
        });
      } catch (createError: any) {
        console.error('Error creating OpenAI completion:', createError);
        throw new Error(`Failed to create OpenAI request: ${createError?.message || 'Unknown error'}`);
      }
      
      let completion;
      try {
        completion = await Promise.race([completionPromise, timeoutPromise]) as any;
      } catch (raceError: any) {
        console.error('Error in Promise.race:', raceError);
        if (raceError.message === 'OpenAI API timeout') {
          throw new Error('Request timed out. The exam paper might be too large. Please try breaking it into smaller sections.');
        }
        throw raceError;
      }

      console.log('OpenAI API call completed successfully');
      const aiResponse = completion.choices[0]?.message?.content || 'I apologize, but I could not generate a response. Please try again.';

      // Update user stats if user is authenticated
      let updatedUser = null;
      if (user) {
        try {
          console.log('Updating user stats...');
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
          
          updatedUser = await PrismaDatabase.updateUser(user.id, {
            stats: {
              ...currentStats,
              ...updatedStats
            }
          });
          console.log('User stats updated successfully');

          // Check achievements after updating stats (non-blocking)
          // Run this asynchronously so it doesn't delay the response
          (async () => {
          try {
            await checkAndAwardAchievements(user.id, {
              ...currentStats,
              ...updatedStats
            });
          } catch (error) {
            console.error('Error checking achievements:', error);
            // Don't fail the request if achievement check fails
          }
          })();
        } catch (error) {
          console.error('Error updating user stats:', error);
          // Continue without updating stats
        }
      }
        
      // Get context switching suggestions (simplified)
      let suggestions = [];
      let sessionStats = { totalContexts: 0, contextTypes: {}, lastActivity: null };
      try {
        suggestions = contextManager.getContextSwitchingSuggestions(sessionId, message);
        sessionStats = contextManager.getSessionStats(sessionId);
      } catch (contextError) {
        console.error('Context suggestions error:', contextError);
        // Continue without suggestions
      }
      
      // Return response immediately - don't block on categorization
      const responseData = {
        response: aiResponse,
        timestamp: new Date().toISOString(),
        mode: mode,
        questionType: questionType,
        context: {
          currentContextId: contextItem?.id || 'default',
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
      };
      
      // Save question context with automatic AI-powered categorization (non-blocking)
      // This runs asynchronously after response is sent to avoid blocking
      (async () => {
        try {
          // Use AI to automatically categorize the question
          // Add timeout to prevent it from taking too long
          const categorizationPromise = categorizeQuestion(message, aiResponse);
          const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Categorization timeout')), 5000)
          );
          
          const categorization = await Promise.race([categorizationPromise, timeoutPromise]) as any;
          
          await PrismaDatabase.saveQuestionContext(userId, {
            question: message,
            answer: aiResponse,
            reason: aiResponse,
            category: contextMetadata?.category || categorization.category,
            topic: contextMetadata?.topic || categorization.topic
          });
          
          console.log('✅ Question automatically categorized:', {
            category: categorization.category,
            topic: categorization.topic,
            subject: categorization.subject
          });
        } catch (err) {
          // Use fallback categorization if AI categorization fails or times out
          try {
            // Save with basic categorization from metadata or defaults
            await PrismaDatabase.saveQuestionContext(userId, {
              question: message,
              answer: aiResponse,
              reason: aiResponse,
              category: contextMetadata?.category || 'General',
              topic: contextMetadata?.topic || 'General'
            });
            console.log('✅ Question saved with fallback categorization');
          } catch (saveError) {
            console.error('Error saving question context:', saveError);
          }
        }
      })();
      
      return NextResponse.json(responseData, {
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });
    } catch (openaiError: any) {
      console.error('OpenAI API error:', openaiError);
      console.error('Error details:', {
        message: openaiError.message,
        name: openaiError.name,
        isExamPaper: isExamPaper
      });
      
      // For exam papers, don't use generic fallback - return a helpful error
      if (isExamPaper) {
        const errorDetails = openaiError?.message || 'Unknown error occurred';
        const isTimeout = errorDetails.includes('timeout') || errorDetails.includes('timed out');
        const isRateLimit = errorDetails.includes('rate') || errorDetails.includes('quota') || errorDetails.includes('limit');
        const isTooLarge = errorDetails.includes('too large') || errorDetails.includes('token') || errorDetails.includes('length');
        
        let errorMessage = `I apologize, but I encountered an error while processing your exam paper.\n\n`;
        
        if (isTimeout) {
          errorMessage += `The request timed out. This usually means the paper is too large or complex.\n\n`;
        } else if (isRateLimit) {
          errorMessage += `API rate limit reached. Please try again in a few moments.\n\n`;
        } else if (isTooLarge) {
          errorMessage += `The paper content is too large to process in one request.\n\n`;
        } else {
          errorMessage += `Error: ${errorDetails}\n\n`;
        }
        
        errorMessage += `Please try:\n`;
        errorMessage += `- Breaking the paper into smaller sections (e.g., solve questions 1-5, then 6-10)\n`;
        errorMessage += `- Ensuring the PDF text was extracted correctly\n`;
        errorMessage += `- Trying again in a moment\n`;
        errorMessage += `- Using the "Exam Mode" feature which is specifically designed for solving papers\n\n`;
        errorMessage += `If the issue persists, please contact support.`;
        
        return NextResponse.json({
          response: errorMessage,
          error: true,
          timestamp: new Date().toISOString()
        }, {
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        });
      }
      
      // Fallback to simple AI response if OpenAI fails (only for non-exam papers)
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

import { NextRequest, NextResponse } from 'next/server';
import { PrismaDatabase } from '@/lib/prisma-database';
import { verifyAuth } from '@/lib/auth-middleware';
import { checkRateLimitEnhanced } from '@/lib/rate-limit-enhanced';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const rateLimit = checkRateLimitEnhanced(request, 'notes-generate');
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Too many requests. Please slow down.' },
        { status: 429 }
      );
    }

    const authResult = await verifyAuth(request);
    if (authResult.error || !authResult.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { topic, conversationHistory, sourceType, format } = await request.json();

    if (!topic && !conversationHistory) {
      return NextResponse.json(
        { error: 'Either topic or conversationHistory is required' },
        { status: 400 }
      );
    }

    // Check if OpenAI API key is configured
    const openaiApiKey = process.env.OPENAI_API_KEY;
    if (!openaiApiKey) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 503 }
      );
    }

    // Generate notes using AI
    let generatedNotes;
    try {
      if (conversationHistory && conversationHistory.length > 0) {
        // Generate from conversation history
        generatedNotes = await generateNotesFromConversation(conversationHistory, format);
      } else if (topic) {
        // Generate from topic
        generatedNotes = await generateNotesFromTopic(topic, format);
      } else {
        throw new Error('No valid input provided');
      }

      // Optionally save the note automatically
      const { autoSave, category, tags } = await request.json().catch(() => ({}));
      
      if (autoSave && generatedNotes.title && generatedNotes.content) {
        try {
          const savedNote = await PrismaDatabase.createNote({
            title: generatedNotes.title,
            content: generatedNotes.content,
            category: category || 'AI Generated',
            tags: tags || ['AI Generated'],
            userId: authResult.user.id,
            metadata: {
              sourceType: sourceType || 'ai_generation',
              generatedAt: new Date().toISOString(),
              format: format || 'structured'
            }
          });

          return NextResponse.json({
            success: true,
            note: generatedNotes,
            savedNote: savedNote,
            autoSaved: true
          });
        } catch (saveError) {
          console.error('Error auto-saving note:', saveError);
          // Return generated notes even if save fails
        }
      }

      return NextResponse.json({
        success: true,
        note: generatedNotes,
        autoSaved: false
      });

    } catch (genError: any) {
      console.error('Error generating notes:', genError);
      return NextResponse.json(
        { error: 'Failed to generate notes: ' + genError.message },
        { status: 500 }
      );
    }

  } catch (error: any) {
    console.error('Notes generation API error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error.message || 'Unknown error') },
      { status: 500 }
    );
  }
}

/**
 * Generate notes from a conversation history
 */
async function generateNotesFromConversation(
  conversationHistory: any[],
  format: string = 'structured'
): Promise<{ title: string; content: string; summary?: string }> {
  // Extract key information from conversation
  const conversationText = conversationHistory
    .slice(-20) // Last 20 messages
    .map((msg: any) => {
      const role = msg.isUser ? 'Student' : 'Assistant';
      const text = msg.text || msg.content || msg.message || '';
      return `${role}: ${text}`;
    })
    .join('\n\n');

  const prompt = `You are an expert at creating educational notes from conversations.

Conversation History:
${conversationText}

Create comprehensive study notes from this conversation. The notes should:
1. Have a clear, descriptive title
2. Include all key concepts discussed
3. Organize information logically
4. Include examples and explanations
5. Be well-structured and easy to study from

${format === 'outline' 
  ? 'Format as a detailed outline with headings and bullet points.'
  : format === 'summary'
  ? 'Format as a concise summary with key points.'
  : 'Format as structured notes with clear sections, headings, and detailed explanations.'}

Return ONLY a JSON object with this structure:
{
  "title": "Clear, descriptive title for the notes",
  "content": "The full notes content with proper formatting (use markdown-style formatting)",
  "summary": "A brief 2-3 sentence summary of the main topics covered"
}

Rules:
- Use markdown-style formatting (## for headings, ** for bold, - for bullets)
- Make content comprehensive but well-organized
- Include all important concepts from the conversation
- Return ONLY valid JSON, no explanations`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are an expert at creating educational notes. Return only valid JSON.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      max_tokens: 3000,
      temperature: 0.7,
    });

    const responseText = completion.choices[0]?.message?.content || '{}';
    
    // Clean the response
    const cleanedResponse = responseText
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();

    const notes = JSON.parse(cleanedResponse);
    
    // Validate
    if (!notes.title || !notes.content) {
      throw new Error('Invalid notes structure generated');
    }

    return notes;
  } catch (error: any) {
    console.error('Error generating notes from conversation:', error);
    throw new Error('Failed to generate notes: ' + error.message);
  }
}

/**
 * Generate notes from a topic
 */
async function generateNotesFromTopic(
  topic: string,
  format: string = 'structured'
): Promise<{ title: string; content: string; summary?: string }> {
  const prompt = `Create comprehensive study notes for the topic: "${topic}"

The notes should:
1. Have a clear, descriptive title
2. Cover all important aspects of the topic
3. Include key concepts, definitions, and explanations
4. Provide examples where relevant
5. Be well-organized and easy to study from

${format === 'outline' 
  ? 'Format as a detailed outline with headings and bullet points.'
  : format === 'summary'
  ? 'Format as a concise summary with key points.'
  : 'Format as structured notes with clear sections, headings, and detailed explanations.'}

Return ONLY a JSON object with this structure:
{
  "title": "Clear, descriptive title for the notes",
  "content": "The full notes content with proper formatting (use markdown-style formatting)",
  "summary": "A brief 2-3 sentence summary of the main topics covered"
}

Rules:
- Use markdown-style formatting (## for headings, ** for bold, - for bullets)
- Make content comprehensive and educational
- Include definitions, explanations, and examples
- Return ONLY valid JSON, no explanations`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are an expert educator creating study notes. Return only valid JSON.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      max_tokens: 3000,
      temperature: 0.7,
    });

    const responseText = completion.choices[0]?.message?.content || '{}';
    
    // Clean the response
    const cleanedResponse = responseText
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();

    const notes = JSON.parse(cleanedResponse);
    
    // Validate
    if (!notes.title || !notes.content) {
      throw new Error('Invalid notes structure generated');
    }

    return notes;
  } catch (error: any) {
    console.error('Error generating notes from topic:', error);
    throw new Error('Failed to generate notes: ' + error.message);
  }
}


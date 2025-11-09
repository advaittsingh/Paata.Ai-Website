import { NextRequest, NextResponse } from 'next/server';
import { PrismaDatabase } from '@/lib/prisma-database';
import { verifyAuth } from '@/lib/auth-middleware';
import { checkRateLimitEnhanced } from '@/lib/rate-limit-enhanced';
import { checkAndAwardAchievements } from '@/lib/achievement-system';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// GET - Retrieve user mind maps
export async function GET(request: NextRequest) {
  try {
    const rateLimit = checkRateLimitEnhanced(request, 'mindmaps');
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

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || authResult.user.id;
    const category = searchParams.get('category');

    // Ensure user can only access their own mind maps
    if (userId !== authResult.user.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const mindMaps = await PrismaDatabase.getMindMaps(userId, category || undefined);

    return NextResponse.json({
      success: true,
      mindMaps,
      count: mindMaps.length
    });

  } catch (error) {
    console.error('Error fetching mind maps:', error);
    return NextResponse.json(
      { error: 'Failed to fetch mind maps' },
      { status: 500 }
    );
  }
}

// POST - Create new mind map or generate from topic
export async function POST(request: NextRequest) {
  try {
    const rateLimit = checkRateLimitEnhanced(request, 'mindmaps');
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

    const body = await request.json();
    const { title, structure, category, colorScheme, metadata, generateFromTopic, topic, conversationHistory } = body;

    // If generating from topic, use AI to create the mind map structure
    if (generateFromTopic && topic) {
      try {
        const generatedStructure = await generateMindMapFromTopic(topic, conversationHistory);
        
        const mindMap = await PrismaDatabase.createMindMap({
          title: title || `Mind Map: ${topic}`,
          structure: JSON.stringify(generatedStructure),
          category: category || 'AI Generated',
          colorScheme: colorScheme || 'default',
          userId: authResult.user.id,
          metadata: metadata || {}
        });

        // Check achievements after creating mind map
        try {
          const user = await PrismaDatabase.getUserById(authResult.user.id);
          if (user) {
            await checkAndAwardAchievements(authResult.user.id, user.stats || {});
          }
        } catch (error) {
          console.error('Error checking achievements:', error);
        }

        return NextResponse.json({
          success: true,
          mindMap,
          generated: true
        });
      } catch (genError: any) {
        console.error('Error generating mind map:', genError);
        return NextResponse.json(
          { error: 'Failed to generate mind map: ' + genError.message },
          { status: 500 }
        );
      }
    }

    // Manual creation
    if (!title || !structure) {
      return NextResponse.json(
        { error: 'title and structure are required' },
        { status: 400 }
      );
    }

    const mindMap = await PrismaDatabase.createMindMap({
      title,
      structure: typeof structure === 'string' ? structure : JSON.stringify(structure),
      category: category || 'General',
      colorScheme: colorScheme || 'default',
      userId: authResult.user.id,
      metadata: metadata || {}
    });

    // Check achievements after creating mind map
    try {
      const user = await PrismaDatabase.getUserById(authResult.user.id);
      if (user) {
        await checkAndAwardAchievements(authResult.user.id, user.stats || {});
      }
    } catch (error) {
      console.error('Error checking achievements:', error);
    }

    return NextResponse.json({
      success: true,
      mindMap
    });

  } catch (error: any) {
    console.error('Error creating mind map:', error);
    return NextResponse.json(
      { error: 'Failed to create mind map: ' + (error.message || 'Unknown error') },
      { status: 500 }
    );
  }
}

// PUT - Update existing mind map
export async function PUT(request: NextRequest) {
  try {
    const rateLimit = checkRateLimitEnhanced(request, 'mindmaps');
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

    const { id, title, structure, category, colorScheme, metadata } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: 'Mind map id is required' },
        { status: 400 }
      );
    }

    // Verify ownership
    const existingMindMap = await PrismaDatabase.getMindMapById(id);
    if (!existingMindMap || existingMindMap.userId !== authResult.user.id) {
      return NextResponse.json(
        { error: 'Mind map not found or unauthorized' },
        { status: 404 }
      );
    }

    const mindMap = await PrismaDatabase.updateMindMap(id, {
      title,
      structure: structure ? (typeof structure === 'string' ? structure : JSON.stringify(structure)) : undefined,
      category,
      colorScheme,
      metadata
    });

    return NextResponse.json({
      success: true,
      mindMap
    });

  } catch (error: any) {
    console.error('Error updating mind map:', error);
    return NextResponse.json(
      { error: 'Failed to update mind map: ' + (error.message || 'Unknown error') },
      { status: 500 }
    );
  }
}

// DELETE - Delete mind map
export async function DELETE(request: NextRequest) {
  try {
    const rateLimit = checkRateLimitEnhanced(request, 'mindmaps');
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

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Mind map id is required' },
        { status: 400 }
      );
    }

    // Verify ownership
    const existingMindMap = await PrismaDatabase.getMindMapById(id);
    if (!existingMindMap || existingMindMap.userId !== authResult.user.id) {
      return NextResponse.json(
        { error: 'Mind map not found or unauthorized' },
        { status: 404 }
      );
    }

    await PrismaDatabase.deleteMindMap(id);

    return NextResponse.json({
      success: true,
      message: 'Mind map deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting mind map:', error);
    return NextResponse.json(
      { error: 'Failed to delete mind map' },
      { status: 500 }
    );
  }
}

/**
 * Generate mind map structure from a topic using AI
 */
async function generateMindMapFromTopic(
  topic: string,
  conversationHistory?: any[]
): Promise<any> {
  const prompt = `Create a comprehensive and detailed mind map structure for the topic: "${topic}"

CRITICAL REQUIREMENT: Make this mind map COMPREHENSIVE. For every main branch (heading), you MUST include ALL related sub-headings and sub-concepts. Do not leave any important aspects out.

Generate a hierarchical mind map with:
1. Central topic (the main subject)
2. Main branches (4-8 major subtopics/headings) - each with a brief explanation
3. Sub-branches (3-6 points under each main branch) - covering ALL important sub-headings and concepts
4. Sub-sub-branches (2-4 points under each sub-branch where relevant) - for detailed breakdown
5. Ensure completeness: if a branch covers a topic, include ALL its key aspects, sub-topics, and related concepts

${conversationHistory && conversationHistory.length > 0 
  ? `\nContext from conversation:\n${conversationHistory.slice(-5).map((m: any) => m.text || m.content).join('\n')}`
  : ''}

Return ONLY a valid JSON object with this structure:
{
  "centralTopic": "The main topic",
  "branches": [
    {
      "id": "branch1",
      "label": "Main branch/heading name",
      "description": "Brief explanation of this branch and what it covers (1-2 sentences)",
      "color": "#hexcolor",
      "children": [
        {
          "id": "sub1",
          "label": "Sub-heading or key concept",
          "description": "Brief explanation of this sub-heading (1 sentence)",
          "color": "#hexcolor",
          "children": [
            {
              "id": "subsub1",
              "label": "Detailed point or sub-concept",
              "description": "Brief explanation (1 sentence)",
              "color": "#hexcolor",
              "children": []
            }
          ]
        }
      ]
    }
  ]
}

Rules:
- Use clear, educational labels that match academic terminology
- Include brief descriptions (1-2 sentences) for main branches explaining what they cover
- Include brief descriptions (1 sentence) for sub-branches explaining the key concept
- COMPREHENSIVE COVERAGE: For each main branch, include ALL related sub-headings, sub-topics, and important concepts
- If a branch is about "Key Concepts", include ALL key concepts, not just a few
- If a branch is about "Types", include ALL types, not just some
- If a branch is about "Applications", include ALL major applications
- Organize hierarchically (up to 4 levels: central topic → branch → sub-branch → sub-sub-branch)
- Include 4-8 main branches to ensure comprehensive coverage
- Each branch should have 3-6 sub-branches covering all important aspects
- Sub-branches can have 2-4 sub-sub-branches for detailed breakdown
- Use educational color scheme (blues, greens, purples, oranges)
- Descriptions should be educational and help understand the topic
- Return ONLY valid JSON, no explanations`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are an expert at creating educational mind maps. Return only valid JSON.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      max_tokens: 4000,
      temperature: 0.7,
    });

    const responseText = completion.choices[0]?.message?.content || '{}';
    
    // Clean the response
    const cleanedResponse = responseText
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();

    const structure = JSON.parse(cleanedResponse);
    
    // Validate structure
    if (!structure.centralTopic || !structure.branches) {
      throw new Error('Invalid mind map structure generated');
    }

    return structure;
  } catch (error: any) {
    console.error('Error generating mind map structure:', error);
    // Return a simple fallback structure
    return {
      centralTopic: topic,
      branches: [
        {
          id: 'branch1',
          label: 'Key Concepts',
          description: 'Fundamental ideas and principles related to this topic',
          color: '#3b82f6',
          children: []
        },
        {
          id: 'branch2',
          label: 'Applications',
          description: 'Practical uses and real-world applications',
          color: '#10b981',
          children: []
        },
        {
          id: 'branch3',
          label: 'Examples',
          description: 'Illustrative examples and case studies',
          color: '#8b5cf6',
          children: []
        }
      ]
    };
  }
}

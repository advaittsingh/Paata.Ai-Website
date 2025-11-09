import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth-middleware';
import { checkRateLimitEnhanced } from '@/lib/rate-limit-enhanced';

export async function POST(request: NextRequest) {
  try {
    // Check rate limit for exam generation
    const rateLimit = checkRateLimitEnhanced(request, 'exam-generate');
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { 
          error: 'Too many exam generation requests. Please wait a moment.',
          retryAfter: rateLimit.retryAfter
        },
        { 
          status: 429,
          headers: {
            'Retry-After': rateLimit.retryAfter?.toString() || '60'
          }
        }
      );
    }

    const authResult = await verifyAuth(request);
    if (authResult.error || !authResult.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { subject, topic, difficulty, count = 5, questionType = 'multiple_choice', questionTypes } = await request.json();

    if (!subject || !topic) {
      return NextResponse.json(
        { error: 'Subject and topic are required' },
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

    // If questionTypes is provided, use it; otherwise fall back to old format
    let allQuestions: any[] = [];
    
    if (questionTypes && Object.keys(questionTypes).length > 0) {
      // Generate questions for each type
      for (const [typeKey, typeConfig] of Object.entries(questionTypes)) {
        const config = typeConfig as { count: number; marks: number };
        if (config.count > 0) {
          let questionTypePrompt = '';
          let questionFormat = '';
          
          if (typeKey === 'mcq') {
            questionTypePrompt = `Generate ${config.count} ${difficulty || 'medium'} difficulty multiple choice questions (MCQ) worth ${config.marks} mark${config.marks > 1 ? 's' : ''} each about ${topic} in the subject of ${subject}.

CRITICAL REQUIREMENTS:
1. The correctAnswer index MUST match the option that the explanation describes as correct
2. The finalAnswer MUST be the actual text/content of the correct option (not the index)
3. The explanation MUST provide step-by-step reasoning showing why the correct option is right
4. Double-check that correctAnswer index, finalAnswer text, and explanation are all in sync

For each question, provide:
1. A clear question
2. Exactly 4 multiple choice options (marked as A, B, C, D)
3. The correct answer index (0 for A, 1 for B, 2 for C, 3 for D)
4. The final answer - this should be the actual text/content of the correct option
5. A step-by-step explanation showing why this option is correct

Format the response as JSON array:
[
  {
    "question": "Question text here",
    "options": ["Option A text", "Option B text", "Option C text", "Option D text"],
    "correctAnswer": 0,
    "finalAnswer": "The actual text/content of Option A (the correct option)",
    "explanation": "Step 1: [reasoning]\\nStep 2: [reasoning]\\nStep 3: [conclusion - why Option A is correct]",
    "marks": ${config.marks}
  }
]

VERIFY: Before finalizing each question, ensure:
- correctAnswer index (0-3) matches the option described in explanation
- finalAnswer is the actual text of the correct option
- explanation provides step-by-step reasoning`;
            questionFormat = 'mcq';
          } else if (typeKey === 'twoMarker' || typeKey === 'fiveMarker' || typeKey === 'tenMarker') {
            const marks = config.marks;
            questionTypePrompt = `Generate ${config.count} ${difficulty || 'medium'} difficulty short answer questions worth ${marks} marks each about ${topic} in the subject of ${subject}.

CRITICAL REQUIREMENTS:
1. The finalAnswer MUST be the concise final answer/solution (just the result, not the steps)
2. The explanation MUST provide detailed step-by-step solution showing how to arrive at the final answer
3. For ${marks}-mark questions, ensure appropriate depth and detail

For each question, provide:
1. A clear question that requires a detailed answer (appropriate for ${marks} marks)
2. The final answer - this should be the concise final result/solution (e.g., "x = 5" or "The derivative is 6x + 5")
3. A detailed step-by-step explanation showing all working steps
4. Key points that should be covered in the answer

Format the response as JSON array:
[
  {
    "question": "Question text here",
    "finalAnswer": "The concise final answer/solution (e.g., 'x = 5', 'f'(x) = 6x + 5', 'The area is 25 cm²')",
    "explanation": "Step 1: [detailed step]\\nStep 2: [detailed step]\\nStep 3: [detailed step]\\nFinal Answer: [conclusion]",
    "marks": ${marks},
    "keyPoints": ["Key point 1", "Key point 2", "Key point 3"]
  }
]

IMPORTANT: 
- finalAnswer should be concise (just the result)
- explanation should be detailed with all steps
- For ${marks} marks, provide ${marks === 2 ? '2-3' : marks === 5 ? '4-5' : '6-8'} key steps in the explanation`;
            questionFormat = 'short_answer';
          }

          try {
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${openaiApiKey}`,
              },
              body: JSON.stringify({
                model: 'gpt-4o-mini',
                messages: [
                  {
                    role: 'system',
                    content: 'You are an expert educator creating educational questions. Always respond with valid JSON only. CRITICAL: Ensure the correctAnswer index matches the option described in the explanation. The explanation must explicitly state which option (A, B, C, or D) is correct.',
                  },
                  {
                    role: 'user',
                    content: questionTypePrompt,
                  },
                ],
                temperature: 0.7,
                max_tokens: questionFormat === 'mcq' ? 2000 : 4000,
              }),
            });

            if (!response.ok) {
              const error = await response.json();
              console.error('OpenAI API error:', error);
              continue; // Skip this question type if it fails
            }

            const data = await response.json();
            const content = data.choices[0]?.message?.content || '[]';

            // Parse JSON response
            let questions;
            try {
              const cleanedContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
              questions = JSON.parse(cleanedContent);
            } catch (parseError) {
              console.error('Failed to parse OpenAI response:', parseError);
              continue; // Skip this question type if parsing fails
            }

            // Format questions based on type
            const formattedQuestions = questions.map((q: any, index: number) => {
              if (questionFormat === 'mcq') {
                // Validate correctAnswer is within valid range
                let correctAnswer = q.correctAnswer !== undefined ? q.correctAnswer : 0;
                const options = q.options || ['Option A', 'Option B', 'Option C', 'Option D'];
                
                // Ensure correctAnswer is a valid index
                if (typeof correctAnswer !== 'number' || correctAnswer < 0 || correctAnswer >= options.length) {
                  console.warn(`Invalid correctAnswer ${correctAnswer} for question ${index + 1}, defaulting to 0`);
                  correctAnswer = 0;
                }
                
                // Get final answer - use provided finalAnswer or extract from correct option
                const finalAnswer = q.finalAnswer || options[correctAnswer] || 'No answer provided';
                let explanation = q.explanation || 'No explanation provided';
                
                // Ensure explanation is step-by-step
                if (!explanation.includes('Step') && !explanation.includes('step')) {
                  const optionLetters = ['A', 'B', 'C', 'D'];
                  const correctOptionLetter = optionLetters[correctAnswer];
                  explanation = `Step 1: Analyze the question\nStep 2: Evaluate each option\nStep 3: The correct answer is Option ${correctOptionLetter} because ${explanation}`;
                }
                
                return {
                  id: `q_${allQuestions.length + index + 1}`,
                  question: q.question || `Question ${allQuestions.length + index + 1}`,
                  options: options,
                  correctAnswer: correctAnswer, // Keep index for checking
                  finalAnswer: finalAnswer, // Store actual answer text
                  explanation: explanation,
                  marks: q.marks || config.marks,
                  type: 'mcq'
                };
              } else {
                // For short answer questions, extract final answer
                const finalAnswer = q.finalAnswer || q.correctAnswer || 'No answer provided';
                let explanation = q.explanation || 'No explanation provided';
                
                // Ensure explanation is step-by-step
                if (!explanation.includes('Step') && !explanation.includes('step')) {
                  explanation = `Step 1: ${explanation}`;
                }
                
                return {
                  id: `q_${allQuestions.length + index + 1}`,
                  question: q.question || `Question ${allQuestions.length + index + 1}`,
                  correctAnswer: finalAnswer, // Store final answer for display
                  finalAnswer: finalAnswer, // Also store as finalAnswer for consistency
                  explanation: explanation,
                  marks: q.marks || config.marks,
                  type: 'short_answer',
                  keyPoints: q.keyPoints || []
                };
              }
            });

            allQuestions = [...allQuestions, ...formattedQuestions];
          } catch (error) {
            console.error(`Error generating ${typeKey} questions:`, error);
            // Continue with other question types
          }
        }
      }
    } else {
      // Fallback to old format for backward compatibility
      const prompt = `Generate ${count} ${difficulty || 'medium'} difficulty ${questionType} questions about ${topic} in the subject of ${subject}.

CRITICAL REQUIREMENTS:
1. The correctAnswer index MUST match the option that the explanation describes as correct
2. The finalAnswer MUST be the actual text/content of the correct option (not the index)
3. The explanation MUST provide step-by-step reasoning showing why the correct option is right
4. Double-check that correctAnswer index, finalAnswer text, and explanation are all in sync

For each question, provide:
1. A clear question
2. Exactly 4 multiple choice options (marked as A, B, C, D)
3. The correct answer index (0 for A, 1 for B, 2 for C, 3 for D)
4. The final answer - this should be the actual text/content of the correct option
5. A step-by-step explanation showing why this option is correct

Format the response as JSON array:
[
  {
    "question": "Question text here",
    "options": ["Option A text", "Option B text", "Option C text", "Option D text"],
    "correctAnswer": 0,
    "finalAnswer": "The actual text/content of Option A (the correct option)",
    "explanation": "Step 1: [reasoning]\\nStep 2: [reasoning]\\nStep 3: [conclusion - why Option A is correct]"
  }
]

VERIFY: Before finalizing each question, ensure:
- correctAnswer index (0-3) matches the option described in explanation
- finalAnswer is the actual text of the correct option
- explanation provides step-by-step reasoning
Make sure the questions are educational, appropriate, and test understanding of the topic.`;

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openaiApiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: 'You are an expert educator creating educational questions. Always respond with valid JSON only. CRITICAL: Ensure the correctAnswer index matches the option described in the explanation. The explanation must explicitly state which option (A, B, C, or D) is correct.',
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
          temperature: 0.7,
          max_tokens: 2000,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('OpenAI API error:', error);
        return NextResponse.json(
          { error: 'Failed to generate questions', details: error },
          { status: 500 }
        );
      }

      const data = await response.json();
      const content = data.choices[0]?.message?.content || '[]';

      // Parse JSON response
      let questions;
      try {
        const cleanedContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        questions = JSON.parse(cleanedContent);
      } catch (parseError) {
        console.error('Failed to parse OpenAI response:', parseError);
        return NextResponse.json(
          { error: 'Failed to parse generated questions' },
          { status: 500 }
        );
      }

      // Validate and format questions
      allQuestions = questions.map((q: any, index: number) => {
        // Validate correctAnswer is within valid range
        let correctAnswer = q.correctAnswer !== undefined ? q.correctAnswer : 0;
        const options = q.options || ['Option A', 'Option B', 'Option C', 'Option D'];
        
        // Ensure correctAnswer is a valid index
        if (typeof correctAnswer !== 'number' || correctAnswer < 0 || correctAnswer >= options.length) {
          console.warn(`Invalid correctAnswer ${correctAnswer} for question ${index + 1}, defaulting to 0`);
          correctAnswer = 0;
        }
        
        // Get final answer - use provided finalAnswer or extract from correct option
        const finalAnswer = q.finalAnswer || options[correctAnswer] || 'No answer provided';
        let explanation = q.explanation || 'No explanation provided';
        
        // Ensure explanation is step-by-step
        if (!explanation.includes('Step') && !explanation.includes('step')) {
          const optionLetters = ['A', 'B', 'C', 'D'];
          const correctOptionLetter = optionLetters[correctAnswer];
          explanation = `Step 1: Analyze the question\nStep 2: Evaluate each option\nStep 3: The correct answer is Option ${correctOptionLetter} because ${explanation}`;
        }
        
        return {
          id: `q_${index + 1}`,
          question: q.question || `Question ${index + 1}`,
          options: options,
          correctAnswer: correctAnswer, // Keep index for checking
          finalAnswer: finalAnswer, // Store actual answer text
          explanation: explanation,
          marks: 1,
          type: 'mcq'
        };
      });
    }

    if (allQuestions.length === 0) {
      return NextResponse.json(
        { error: 'No questions were generated. Please check your question type selections.' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      questions: allQuestions,
      count: allQuestions.length,
      subject,
      topic,
      difficulty: difficulty || 'medium',
    });
  } catch (error) {
    console.error('Generate exam questions error:', error);
    return NextResponse.json(
      { error: 'Failed to generate exam questions' },
      { status: 500 }
    );
  }
}

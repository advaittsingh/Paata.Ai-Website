import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface CategorizationResult {
  category: string;
  topic: string;
  chapter?: string;
  subject?: string;
}

/**
 * Automatically categorizes a question using AI
 * Extracts subject, category, topic, and chapter information
 */
export async function categorizeQuestion(
  question: string,
  answer?: string
): Promise<CategorizationResult> {
  try {
    const prompt = `Analyze the following educational question and categorize it.

Question: ${question}
${answer ? `Answer: ${answer.substring(0, 500)}` : ''}

Extract and return ONLY a JSON object with the following structure:
{
  "subject": "The main subject (e.g., Mathematics, Science, English, History, Geography, Computer Science, Physics, Chemistry, Biology, etc.)",
  "category": "The subject category (same as subject if not more specific)",
  "topic": "The specific topic or concept (e.g., Algebra, Photosynthesis, World War II, etc.)",
  "chapter": "The chapter or unit name if identifiable (optional, can be null)"
}

Rules:
- If the subject cannot be determined, use "General"
- Topic should be specific (e.g., "Quadratic Equations" not just "Math")
- Chapter is optional - only include if clearly identifiable
- Return ONLY valid JSON, no explanations or additional text
- Use null for chapter if not identifiable

Example output:
{"subject": "Mathematics", "category": "Mathematics", "topic": "Quadratic Equations", "chapter": "Algebra"}`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an expert at categorizing educational content. Return only valid JSON.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      max_tokens: 200,
      temperature: 0.3,
    });

    const responseText = completion.choices[0]?.message?.content || '{}';
    
    // Clean the response (remove markdown code blocks if present)
    const cleanedResponse = responseText
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();

    const result: CategorizationResult = JSON.parse(cleanedResponse);

    // Validate and set defaults
    return {
      category: result.category || result.subject || 'General',
      topic: result.topic || 'General',
      chapter: result.chapter || undefined,
      subject: result.subject || result.category || 'General',
    };
  } catch (error: any) {
    console.error('AI categorization error:', error);
    
    // Fallback: Simple keyword-based categorization
    return fallbackCategorization(question);
  }
}

/**
 * Fallback categorization using keyword matching
 */
function fallbackCategorization(question: string): CategorizationResult {
  const lowerQuestion = question.toLowerCase();
  
  // Subject detection
  let subject = 'General';
  let topic = 'General';
  
  if (
    lowerQuestion.includes('math') ||
    lowerQuestion.includes('algebra') ||
    lowerQuestion.includes('geometry') ||
    lowerQuestion.includes('calculus') ||
    lowerQuestion.includes('trigonometry') ||
    lowerQuestion.includes('equation') ||
    lowerQuestion.includes('solve') ||
    lowerQuestion.includes('calculate')
  ) {
    subject = 'Mathematics';
    topic = extractMathTopic(lowerQuestion);
  } else if (
    lowerQuestion.includes('science') ||
    lowerQuestion.includes('physics') ||
    lowerQuestion.includes('chemistry') ||
    lowerQuestion.includes('biology')
  ) {
    subject = 'Science';
    topic = extractScienceTopic(lowerQuestion);
  } else if (
    lowerQuestion.includes('english') ||
    lowerQuestion.includes('grammar') ||
    lowerQuestion.includes('writing') ||
    lowerQuestion.includes('essay') ||
    lowerQuestion.includes('literature')
  ) {
    subject = 'English';
    topic = 'Language Arts';
  } else if (
    lowerQuestion.includes('history') ||
    lowerQuestion.includes('historical') ||
    lowerQuestion.includes('war') ||
    lowerQuestion.includes('ancient')
  ) {
    subject = 'History';
    topic = 'World History';
  } else if (
    lowerQuestion.includes('geography') ||
    lowerQuestion.includes('country') ||
    lowerQuestion.includes('culture')
  ) {
    subject = 'Geography';
    topic = 'World Geography';
  } else if (
    lowerQuestion.includes('computer') ||
    lowerQuestion.includes('programming') ||
    lowerQuestion.includes('coding') ||
    lowerQuestion.includes('code')
  ) {
    subject = 'Computer Science';
    topic = 'Programming';
  }
  
  return {
    category: subject,
    topic,
    subject,
  };
}

function extractMathTopic(question: string): string {
  if (question.includes('algebra')) return 'Algebra';
  if (question.includes('geometry')) return 'Geometry';
  if (question.includes('calculus')) return 'Calculus';
  if (question.includes('trigonometry')) return 'Trigonometry';
  if (question.includes('quadratic')) return 'Quadratic Equations';
  if (question.includes('linear')) return 'Linear Equations';
  return 'Mathematics';
}

function extractScienceTopic(question: string): string {
  if (question.includes('physics')) return 'Physics';
  if (question.includes('chemistry')) return 'Chemistry';
  if (question.includes('biology')) return 'Biology';
  if (question.includes('photosynthesis')) return 'Photosynthesis';
  if (question.includes('atom')) return 'Atomic Structure';
  return 'Science';
}


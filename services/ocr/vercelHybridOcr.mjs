import axios from 'axios';

class VercelHybridOCRService {
  constructor() {
    this.geminiApiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || 'AIzaSyBK849tqp6MTHIlZ-BqNg7PtncNPW57K8I';
    this.openaiApiKey = process.env.OPENAI_API_KEY;
    this.isGeminiConfigured = !!this.geminiApiKey;
    this.isOpenAIConfigured = !!this.openaiApiKey;
    
    console.log('🚀 Vercel Hybrid OCR Service initialized');
    console.log(`   ✅ Google Vision: ${this.isGeminiConfigured ? 'Configured' : 'Not configured'}`);
    console.log(`   ✅ OpenAI Vision: ${this.isOpenAIConfigured ? 'Configured' : 'Not configured'}`);
  }

  async processImage(imageBuffer, options = {}) {
    const startTime = Date.now();
    const results = [];
    const errors = [];

    try {
      console.log('🔍 Vercel Hybrid OCR processing started...');

      // 1. Google Vision OCR (Gemini) - Primary
      if (this.isGeminiConfigured) {
        try {
          const googleVisionResult = await this.runGoogleVisionOCR(imageBuffer);
          if (googleVisionResult.success && googleVisionResult.text) {
            results.push({ ...googleVisionResult, engine: 'google-vision' });
            console.log('✅ Google Vision OCR completed');
          } else {
            errors.push({ engine: 'google-vision', error: googleVisionResult.error || 'No text extracted' });
            console.log('⚠️ Google Vision OCR failed');
          }
        } catch (e) {
          errors.push({ engine: 'google-vision', error: e.message });
          console.error('❌ Google Vision OCR error:', e.message);
        }
      } else {
        errors.push({ engine: 'google-vision', error: 'API key not configured' });
      }

      // 2. OpenAI Vision - Secondary
      if (this.isOpenAIConfigured && results.length === 0) {
        try {
          const openaiVisionResult = await this.runOpenAIVision(imageBuffer);
          if (openaiVisionResult.success && openaiVisionResult.text) {
            results.push({ ...openaiVisionResult, engine: 'openai-vision' });
            console.log('✅ OpenAI Vision completed');
          } else {
            errors.push({ engine: 'openai-vision', error: openaiVisionResult.error || 'No text extracted' });
            console.log('⚠️ OpenAI Vision failed');
          }
        } catch (e) {
          errors.push({ engine: 'openai-vision', error: e.message });
          console.error('❌ OpenAI Vision error:', e.message);
        }
      } else if (!this.isOpenAIConfigured) {
        errors.push({ engine: 'openai-vision', error: 'API key not configured' });
      }

      // Combine and select best result
      const finalResult = this.combineOCRResults(results, options.language);

      const processingTime = Date.now() - startTime;
      console.log(`✅ Vercel Hybrid OCR processing completed in ${processingTime}ms`);

      return {
        success: finalResult.text.length > 0,
        text: finalResult.text,
        confidence: finalResult.confidence,
        languages: finalResult.languages,
        engines: finalResult.engines,
        source: 'vercel-hybrid-ocr',
        processingTime: processingTime,
        details: {
          individualResults: results,
          errors: errors,
          totalEngines: 2,
          successfulEngines: results.filter(r => r.success).length
        }
      };

    } catch (mainError) {
      console.error('❌ Vercel Hybrid OCR main error:', mainError);
      return {
        success: false,
        text: '',
        confidence: 0.1,
        languages: [],
        engines: [],
        source: 'vercel-hybrid-ocr-error',
        processingTime: Date.now() - startTime,
        error: mainError.message,
        details: { errors: errors.concat({ engine: 'main', error: mainError.message }) }
      };
    }
  }

  async runGoogleVisionOCR(imageBuffer) {
    try {
      const geminiApiKey = this.geminiApiKey;
      const base64Image = imageBuffer.toString('base64');
      const mimeType = this.detectImageType(imageBuffer);

      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiApiKey}`,
        {
          contents: [{
            parts: [
              { text: 'Extract all visible text from this image accurately. Return ONLY the extracted text without any explanations or commentary.' },
              { inline_data: { mime_type: mimeType, data: base64Image } }
            ]
          }],
          generationConfig: { temperature: 0.0, maxOutputTokens: 2000, topP: 0.1, topK: 1 }
        },
        { headers: { 'Content-Type': 'application/json' }, timeout: 30000 }
      );

      const extractedText = response.data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      const cleanedText = extractedText.trim().replace(/^(Here is the text|The text in the image|Extracted text|Text from image)[:\s]*/i, '').replace(/\n\s*\n/g, '\n').trim();
      
      return {
        success: cleanedText.length > 0,
        text: cleanedText,
        confidence: cleanedText.length > 0 ? 0.95 : 0.1,
        languages: this.detectLanguages(cleanedText),
        rawResponse: extractedText
      };
    } catch (error) {
      return { success: false, text: '', confidence: 0.1, languages: [], error: error.message };
    }
  }

  async runOpenAIVision(imageBuffer) {
    try {
      const base64Image = imageBuffer.toString('base64');
      const mimeType = this.detectImageType(imageBuffer);

      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'user',
              content: [
                {
                  type: 'text',
                  text: 'Extract all visible text from this image accurately. Return ONLY the extracted text without any explanations or commentary.'
                },
                {
                  type: 'image_url',
                  image_url: {
                    url: `data:${mimeType};base64,${base64Image}`
                  }
                }
              ]
            }
          ],
          max_tokens: 2000,
          temperature: 0.0
        },
        {
          headers: {
            'Authorization': `Bearer ${this.openaiApiKey}`,
            'Content-Type': 'application/json'
          },
          timeout: 30000
        }
      );

      const extractedText = response.data.choices?.[0]?.message?.content || '';
      const cleanedText = extractedText.trim().replace(/^(Here is the text|The text in the image|Extracted text|Text from image)[:\s]*/i, '').replace(/\n\s*\n/g, '\n').trim();
      
      return {
        success: cleanedText.length > 0,
        text: cleanedText,
        confidence: cleanedText.length > 0 ? 0.90 : 0.1,
        languages: this.detectLanguages(cleanedText),
        rawResponse: extractedText
      };
    } catch (error) {
      return { success: false, text: '', confidence: 0.1, languages: [], error: error.message };
    }
  }

  combineOCRResults(results, preferredLanguage) {
    let bestResult = { text: '', confidence: 0, languages: [], engines: [] };

    const successfulResults = results.filter(r => r.success && r.text);

    // Priority order: Google Vision > OpenAI Vision
    const priorityOrder = ['google-vision', 'openai-vision'];

    for (const engine of priorityOrder) {
      const result = successfulResults.find(r => r.engine === engine);
      if (result && result.text) {
        bestResult.text = result.text;
        bestResult.confidence = result.confidence;
        bestResult.languages = result.languages;
        bestResult.engines.push(engine);
        break; // Use the first successful result in priority order
      }
    }

    // If no text found, try to combine results
    if (!bestResult.text && successfulResults.length > 0) {
      const allTexts = successfulResults.map(r => r.text).filter(t => t && t.trim());
      if (allTexts.length > 0) {
        bestResult.text = allTexts.join(' ');
        bestResult.confidence = Math.max(...successfulResults.map(r => r.confidence));
        bestResult.languages = [...new Set(successfulResults.flatMap(r => r.languages))];
        bestResult.engines = successfulResults.map(r => r.engine);
      }
    }

    return bestResult;
  }

  detectImageType(imageBuffer) {
    if (imageBuffer[0] === 0xFF && imageBuffer[1] === 0xD8) return 'image/jpeg';
    if (imageBuffer[0] === 0x89 && imageBuffer[1] === 0x50) return 'image/png';
    if (imageBuffer[0] === 0x47 && imageBuffer[1] === 0x49) return 'image/gif';
    if (imageBuffer[0] === 0x52 && imageBuffer[1] === 0x49 && imageBuffer[2] === 0x46 && imageBuffer[3] === 0x46 && imageBuffer[8] === 0x57 && imageBuffer[9] === 0x45 && imageBuffer[10] === 0x42 && imageBuffer[11] === 0x50) return 'image/webp';
    return 'image/jpeg';
  }

  detectLanguages(text) {
    if (!text || text.trim().length === 0) return ['unknown'];
    const lowerText = text.toLowerCase();
    const detected = [];
    if (lowerText.match(/[\u0C80-\u0CFF]/)) detected.push('kannada');
    if (lowerText.match(/[\u0900-\u097F]/)) detected.push('hindi');
    if (lowerText.match(/[a-z]/i)) detected.push('english');
    return detected.length > 0 ? detected : ['unknown'];
  }

  getServiceStatus() {
    return {
      status: 'available',
      engines: {
        'google-vision': this.isGeminiConfigured ? 'configured' : 'not-configured',
        'openai-vision': this.isOpenAIConfigured ? 'configured' : 'not-configured'
      },
      capabilities: ['text-extraction', 'language-detection', 'hybrid-processing']
    };
  }
}

export default new VercelHybridOCRService();


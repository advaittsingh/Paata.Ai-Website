import { NextRequest, NextResponse } from 'next/server';

// Import the hybrid OCR service
import VercelHybridOCRService from '../../../../../services/ocr/vercelHybridOcr.mjs';

export async function GET(request: NextRequest) {
  try {
    const status = VercelHybridOCRService.getServiceStatus();
    
    return NextResponse.json({
      ...status,
      timestamp: new Date().toISOString(),
      environment: {
        geminiConfigured: !!process.env.GEMINI_API_KEY,
        openaiConfigured: !!process.env.OPENAI_API_KEY,
        googleVisionConfigured: !!process.env.GOOGLE_CLOUD_VISION_API_KEY
      }
    });

  } catch (error) {
    console.error('❌ OCR Status API error:', error);
    
    return NextResponse.json({
      status: 'error',
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

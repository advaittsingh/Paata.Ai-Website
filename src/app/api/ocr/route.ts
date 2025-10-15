import { NextRequest, NextResponse } from 'next/server';

// Import the hybrid OCR service
import VercelHybridOCRService from '../../../../services/ocr/vercelHybridOcr.mjs';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('image') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No image file provided' },
        { status: 400 }
      );
    }

    console.log('🔍 Processing image with Hybrid OCR:', file.name);

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Process image with hybrid OCR service
    const ocrResult = await VercelHybridOCRService.processImage(buffer);
    
    console.log('📊 OCR Result:', {
      success: ocrResult.success,
      textLength: ocrResult.text?.length || 0,
      engines: ocrResult.engines,
      processingTime: ocrResult.processingTime
    });

    if (ocrResult.success && ocrResult.text) {
      return NextResponse.json({
        text: ocrResult.text,
        confidence: ocrResult.confidence,
        languages: ocrResult.languages,
        engines: ocrResult.engines,
        processingTime: ocrResult.processingTime,
        source: ocrResult.source,
        details: ocrResult.details
      });
    } else {
      return NextResponse.json({
        text: '',
        confidence: 0,
        engines: [],
        error: ocrResult.error || 'No text detected in the image',
        details: ocrResult.details
      });
    }

  } catch (error) {
    console.error('❌ OCR API error:', error);
    
    return NextResponse.json({
      text: '',
      error: 'Failed to process image. Please try again.',
      fallback: true,
      details: { error: error.message }
    }, { status: 500 });
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
import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth-middleware';
import { checkRateLimitEnhanced } from '@/lib/rate-limit-enhanced';

// Force Node.js runtime for PDF parsing compatibility
// pdfjs-dist and canvas don't work on Edge runtime
export const runtime = 'nodejs';
export const maxDuration = 60; // 60 seconds for PDF extraction
export const preferredRegion = 'auto'; // Use auto region selection

// Lazy import to avoid breaking the app if pdfExtractor has issues
async function getPDFExtractor() {
  try {
    const { extractTextFromPDF } = await import('@/utils/pdfExtractor');
    return extractTextFromPDF;
  } catch (error: any) {
    console.error('Failed to import PDF extractor:', error);
    throw new Error('PDF extraction module is not available');
  }
}

export async function POST(request: NextRequest) {
  try {
    const rateLimit = checkRateLimitEnhanced(request, 'chat-pdf');
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

    // Get form data
    let formData: FormData;
    try {
      formData = await request.formData();
    } catch (formDataError: any) {
      console.error('Failed to parse form data:', formDataError);
      return NextResponse.json(
        { 
          error: 'Failed to process file upload. Please ensure the file is valid.',
          message: 'Failed to process file upload. Please ensure the file is valid.'
        },
        { status: 400 }
      );
    }
    
    const file = formData.get('pdf') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No PDF file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    if (file.type !== 'application/pdf') {
      return NextResponse.json(
        { error: 'Invalid file format. Only PDF files are supported.' },
        { status: 400 }
      );
    }

    // Check file size (50MB limit for chat PDFs)
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
      return NextResponse.json(
        { 
          error: `File too large (${fileSizeMB} MB). Maximum size: 50MB.`,
          message: `File too large (${fileSizeMB} MB). Maximum size: 50MB.`
        },
        { status: 400 }
      );
    }

    // Extract text from PDF
    let buffer: Buffer;
    try {
      buffer = Buffer.from(await file.arrayBuffer());
      console.log('📄 Processing PDF:', {
        fileName: file.name,
        size: file.size,
        bufferLength: buffer.length,
        bufferType: buffer.constructor.name
      });
    } catch (bufferError: any) {
      console.error('❌ Failed to create buffer:', bufferError);
      return NextResponse.json(
        { 
          error: 'Failed to read PDF file: ' + (bufferError.message || 'Unknown error'),
          message: 'Failed to read PDF file. Please ensure the file is valid.'
        },
        { status: 400 }
      );
    }
    
    try {
      console.log('🔄 Starting PDF extraction...');
      const extractTextFromPDF = await getPDFExtractor();
      const extractionResult = await extractTextFromPDF(buffer);
      
      if (!extractionResult.success) {
        console.error('❌ PDF extraction failed:', extractionResult.error);
        return NextResponse.json(
          { 
            error: extractionResult.error || 'Failed to extract text from PDF',
            message: extractionResult.error || 'Failed to extract text from PDF'
          },
          { status: 500 }
        );
      }

      console.log('✅ PDF extraction succeeded:', {
        textLength: extractionResult.text.length,
        numPages: extractionResult.numPages
      });

      return NextResponse.json({
        success: true,
        text: extractionResult.text,
        numPages: extractionResult.numPages,
        fileName: file.name,
        fileSize: file.size
      });
    } catch (extractionError: any) {
      console.error('❌ PDF extraction error:', extractionError);
      console.error('Error name:', extractionError.name);
      console.error('Error message:', extractionError.message);
      console.error('Error stack:', extractionError.stack?.substring(0, 500));
      
      // Provide more specific error messages
      let errorMessage = 'Failed to extract text from PDF';
      if (extractionError.message) {
        errorMessage += ': ' + extractionError.message;
      }
      
      return NextResponse.json(
        { 
          error: errorMessage,
          message: errorMessage
        },
        { status: 500 }
      );
    }

  } catch (error: any) {
    console.error('PDF extraction API error:', error);
    console.error('Error stack:', error.stack?.substring(0, 300));
    return NextResponse.json(
      { 
        error: 'Internal server error: ' + (error.message || 'Unknown error'),
        message: 'Internal server error: ' + (error.message || 'Unknown error')
      },
      { status: 500 }
    );
  }
}


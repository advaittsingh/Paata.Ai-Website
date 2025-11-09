import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth-middleware';
import { checkRateLimitEnhanced } from '@/lib/rate-limit-enhanced';
import VercelHybridOCRService from '../../../../../services/ocr/vercelHybridOcr.mjs';

// Force Node.js runtime for PDF parsing compatibility
export const runtime = 'nodejs';
export const maxDuration = 120; // 120 seconds for large PDFs with many questions

// Configure body size limit for App Router
// Note: Next.js App Router doesn't have a built-in way to set body size limits
// The limit is typically handled by the deployment platform (Vercel, etc.)
// For local development, this might be limited by Node.js default settings

// pdfjs-dist will be loaded dynamically to avoid build-time issues

// Extract text from PDF using pdf-parse
async function extractTextFromPDF(buffer: Buffer): Promise<{ text: string; numPages: number }> {
  try {
    // Dynamic import for pdf-parse - works in Next.js Node.js runtime
    let pdfParse: any;
    
    try {
      const pdfParseModule = await import('pdf-parse');
      // pdf-parse exports as default or named export
      pdfParse = pdfParseModule.default || pdfParseModule;
      
      // Check if it's a function
      if (typeof pdfParse !== 'function') {
        throw new Error('pdf-parse module did not export a function');
      }
    } catch (importError: any) {
      console.error('Failed to import pdf-parse:', importError);
      throw new Error(`Failed to load PDF parser: ${importError.message || 'Unknown error'}`);
    }
    
    // Call the function with timeout
    const pdfData = await Promise.race([
      pdfParse(buffer),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('PDF parsing timeout')), 30000)
      )
    ]) as any;
    
    return { 
      text: pdfData.text || '', 
      numPages: pdfData.numpages || 0 
    };
  } catch (error: any) {
    console.error('PDF extraction error:', error);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    // Re-throw with more context
    if (error.message?.includes('Invalid PDF') || error.name === 'InvalidPDFException') {
      const invalidError: any = new Error('Invalid PDF format');
      invalidError.name = 'InvalidPDFException';
      throw invalidError;
    }
    if (error.message?.includes('timeout')) {
      throw new Error('PDF parsing took too long. The file might be too large or corrupted.');
    }
    throw error;
  }
}

// Fallback: Use GPT Vision OCR directly on PDF buffer
// Note: GPT Vision doesn't directly support PDFs, so we'll use the OCR service instead
async function fallbackToGPTVisionOCR(buffer: Buffer): Promise<{ text: string; numPages: number }> {
  try {
    console.log('🔄 Using OCR service fallback for PDF (pdfjs-dist unavailable)...');
    
    // Try using the existing OCR service which can handle various formats
    const ocrResult = await VercelHybridOCRService.processImage(buffer);
    
    if (ocrResult.success && ocrResult.text && ocrResult.text.trim().length > 50) {
      console.log(`✅ OCR service fallback succeeded: ${ocrResult.text.length} characters`);
      return {
        text: ocrResult.text,
        numPages: 1 // We don't know the page count from this method
      };
    } else {
      throw new Error('OCR service returned insufficient text');
    }
  } catch (error: any) {
    console.error('❌ OCR service fallback failed:', error.message);
    
    // Final fallback: Try OpenAI Vision API directly
    try {
      console.log('🔄 Trying OpenAI Vision API as final fallback...');
      const openaiApiKey = process.env.OPENAI_API_KEY;
      
      if (!openaiApiKey) {
        throw new Error('OpenAI API key not configured');
      }
      
      // Convert PDF buffer to base64
      const base64PDF = buffer.toString('base64');
      
      // Use GPT-4o Vision to extract text from PDF
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
              role: 'user',
              content: [
                {
                  type: 'text',
                  text: 'Extract all text from this PDF document. Return ONLY the extracted text without any explanations or commentary. Preserve the structure and formatting as much as possible.'
                },
                {
                  type: 'image_url',
                  image_url: {
                    url: `data:application/pdf;base64,${base64PDF}`
                  }
                }
              ]
            }
          ],
          max_tokens: 4000,
          temperature: 0.0
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`OpenAI Vision API failed: ${errorData.error?.message || response.statusText}`);
      }
      
      const data = await response.json();
      const extractedText = data.choices?.[0]?.message?.content || '';
      
      if (!extractedText || extractedText.trim().length < 50) {
        throw new Error('OpenAI Vision API returned insufficient text');
      }
      
      console.log(`✅ OpenAI Vision API fallback succeeded: ${extractedText.length} characters`);
      
      return {
        text: extractedText,
        numPages: 1
      };
    } catch (visionError: any) {
      console.error('❌ All PDF processing methods failed:', visionError.message);
      throw new Error(
        'PDF processing failed. All methods (pdfjs-dist, OCR service, and OpenAI Vision) failed. ' +
        'Please try:\n' +
        '1. Converting the PDF pages to images (JPEG/PNG) and uploading those\n' +
        '2. Using a PDF with selectable text\n' +
        '3. Contacting support if the issue persists'
      );
    }
  }
}

// Convert PDF pages to images and process with OCR
// Using a simpler approach that works in serverless environments
async function convertPDFToImagesAndOCR(buffer: Buffer): Promise<{ text: string; numPages: number }> {
  let pdfjs: any = null;
  let pdfDocument: any = null;
  
  try {
    console.log('🔄 Attempting PDF to image conversion...');
    
    // Step 1: Try to load PDF with pdfjs-dist
    try {
      // Try different import paths for pdfjs-dist
      let pdfjsModule: any = null;
      let importError: any = null;
      
      // Try 1: Dynamic import with legacy path (most reliable for Next.js)
      try {
        pdfjsModule = await import('pdfjs-dist/legacy/build/pdf.mjs');
        pdfjs = pdfjsModule.default || pdfjsModule;
        console.log('✅ Loaded pdfjs-dist via legacy/build/pdf.mjs');
      } catch (e1: any) {
        importError = e1;
        console.warn('⚠️ Legacy import failed:', e1.message);
        
        // Try 2: Standard import
        try {
          pdfjsModule = await import('pdfjs-dist');
          pdfjs = pdfjsModule.default || pdfjsModule;
          console.log('✅ Loaded pdfjs-dist via standard import');
        } catch (e2: any) {
          console.warn('⚠️ Standard import failed:', e2.message);
          
          // Try 3: Build path
          try {
            pdfjsModule = await import('pdfjs-dist/build/pdf.mjs' as any);
            pdfjs = pdfjsModule.default || pdfjsModule;
            console.log('✅ Loaded pdfjs-dist via build/pdf.mjs');
          } catch (e3: any) {
            console.error('❌ All pdfjs-dist import attempts failed:', {
              legacy: e1?.message || 'Unknown',
              standard: e2?.message || 'Unknown',
              build: e3?.message || 'Unknown'
            });
            
            // Fallback: Try GPT Vision OCR directly on PDF buffer
            console.log('🔄 Falling back to GPT Vision OCR for PDF...');
            return await fallbackToGPTVisionOCR(buffer);
          }
        }
      }
      
      // Configure worker if available
      if (pdfjs && pdfjs.GlobalWorkerOptions) {
        try {
          const version = pdfjs.version || '3.11.174';
          pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${version}/pdf.worker.min.js`;
        } catch (workerError) {
          console.warn('⚠️ Worker configuration failed, continuing without worker:', workerError);
        }
      }
      
      // Check if getDocument is available
      if (!pdfjs || typeof pdfjs.getDocument !== 'function') {
        throw new Error('pdfjs-dist loaded but getDocument function is not available');
      }
      
      const loadingTask = pdfjs.getDocument({ 
        data: buffer,
        verbosity: 0
      });
      pdfDocument = await loadingTask.promise;
    } catch (importError: any) {
      console.error('❌ Failed to import or load PDF:', importError.message);
      console.error('Error stack:', importError.stack?.substring(0, 500));
      
      // Fallback: Try GPT Vision OCR
      console.log('🔄 Falling back to GPT Vision OCR for PDF...');
      return await fallbackToGPTVisionOCR(buffer);
    }
    
    const numPages = pdfDocument.numPages;
    console.log(`📄 PDF loaded successfully: ${numPages} pages`);
    
    if (numPages === 0) {
      throw new Error('PDF has no pages');
    }
    
    // Process all pages (up to 20 to avoid timeout)
    const maxPages = Math.min(numPages, 20);
    const allText: string[] = [];
    let pagesProcessed = 0;
    let pagesWithText = 0;
    
    // Step 2: Try direct text extraction first (fastest, works for text-based PDFs)
    console.log('📝 Step 1: Attempting direct text extraction from PDF pages...');
    for (let pageNum = 1; pageNum <= maxPages; pageNum++) {
      try {
        const page = await pdfDocument.getPage(pageNum);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: any) => item.str)
          .filter((str: string) => str && str.trim().length > 0)
          .join(' ');
        
        if (pageText && pageText.trim().length > 20) {
          allText.push(`Page ${pageNum}:\n${pageText}`);
          pagesWithText++;
          console.log(`✅ Page ${pageNum}: Extracted ${pageText.length} characters directly`);
        } else {
          console.log(`⚠️ Page ${pageNum}: No extractable text found (likely scanned/image-based)`);
        }
        pagesProcessed++;
      } catch (pageError: any) {
        console.warn(`⚠️ Page ${pageNum} text extraction error:`, pageError.message);
      }
    }
    
    // Step 3: If we got text from direct extraction, return it
    if (pagesWithText > 0 && allText.length > 0) {
      const combinedText = allText.join('\n\n');
      if (combinedText.trim().length > 50) {
        console.log(`✅ Successfully extracted text from ${pagesWithText} pages using direct extraction`);
        return {
          text: combinedText,
          numPages: numPages
        };
      }
    }
    
    // Step 4: If direct extraction didn't work, try OCR with canvas rendering
    console.log('🖼️ Step 2: Direct extraction insufficient, attempting OCR with canvas rendering...');
    
    // Check if canvas is available
    let canvasAvailable = false;
    try {
      const canvasModule = await import('canvas');
      canvasAvailable = !!canvasModule.createCanvas;
      if (canvasAvailable) {
        console.log('✅ Canvas library is available');
      }
    } catch (canvasImportError: any) {
      console.warn('⚠️ Canvas library not available:', canvasImportError.message);
    }
    
    if (!canvasAvailable) {
      // If canvas is not available and direct extraction failed, we can't process scanned PDFs
      throw new Error(
        'This PDF appears to be a scanned document (image-based) with no selectable text. ' +
        'Canvas rendering is not available in this environment. ' +
        'Please convert the PDF pages to images (JPEG/PNG) and upload those instead, ' +
        'or use a PDF with selectable text.'
      );
    }
    
    // Process pages with OCR
    allText.length = 0; // Clear previous results
    pagesWithText = 0;
    
    for (let pageNum = 1; pageNum <= maxPages; pageNum++) {
      try {
        console.log(`🔄 Processing page ${pageNum}/${maxPages} with OCR...`);
        const page = await pdfDocument.getPage(pageNum);
        const viewport = page.getViewport({ scale: 2.0 });
        
        // Render to canvas
        const { createCanvas } = await import('canvas');
        const canvas = createCanvas(viewport.width, viewport.height);
        const context = canvas.getContext('2d');
        
        await page.render({
          canvasContext: context as any,
          viewport: viewport
        }).promise;
        
        // Convert to image buffer
        const imageBuffer = canvas.toBuffer('image/png');
        
        // Process with OCR
        const ocrResult = await VercelHybridOCRService.processImage(imageBuffer);
        
        if (ocrResult.success && ocrResult.text && ocrResult.text.trim().length > 20) {
          allText.push(`Page ${pageNum}:\n${ocrResult.text}`);
          pagesWithText++;
          console.log(`✅ Page ${pageNum} OCR: Extracted ${ocrResult.text.length} characters`);
        } else {
          console.warn(`⚠️ Page ${pageNum} OCR: Insufficient text (${ocrResult.text?.length || 0} chars)`);
        }
      } catch (pageError: any) {
        console.error(`❌ Page ${pageNum} OCR error:`, pageError.message);
        // Continue with next page
      }
    }
    
    // Check if we got any text
    if (pagesWithText === 0 || allText.length === 0) {
      throw new Error(
        'Failed to extract text from PDF. The PDF appears to be image-based but OCR could not extract readable text. ' +
        'This might be due to:\n' +
        '1. Poor image quality or blurry scans\n' +
        '2. Handwritten text (OCR works best with printed text)\n' +
        '3. Complex formatting or backgrounds\n\n' +
        'Please try:\n' +
        '- Uploading a clearer version of the PDF\n' +
        '- Converting PDF pages to high-quality images (JPEG/PNG) and uploading those\n' +
        '- Using a PDF with selectable text if available'
      );
    }
    
    const combinedText = allText.join('\n\n');
    console.log(`✅ Successfully extracted text from ${pagesWithText} pages using OCR (total: ${combinedText.length} chars)`);
    
    return {
      text: combinedText,
      numPages: numPages
    };
    
  } catch (error: any) {
    console.error('❌ PDF to image conversion error:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack?.substring(0, 300),
      name: error.name
    });
    
    // Provide more helpful error messages
    if (error.message.includes('PDF processing library')) {
      throw new Error('PDF processing library is not available. Please contact support.');
    } else if (error.message.includes('scanned document') || error.message.includes('image-based')) {
      throw error; // Re-throw with the helpful message
    } else {
      throw new Error(`Failed to process PDF: ${error.message || 'Unknown error'}`);
    }
  }
}

export async function POST(request: NextRequest) {
  // Log request details immediately for debugging
  const contentLength = request.headers.get('content-length');
  const contentType = request.headers.get('content-type');
  console.log('📥 Incoming request:', {
    method: request.method,
    url: request.url,
    contentLength: contentLength ? `${(parseInt(contentLength) / (1024 * 1024)).toFixed(2)} MB` : 'unknown',
    contentType: contentType,
    hasBody: !!request.body
  });
  
  try {
    // Check rate limit
    const rateLimit = checkRateLimitEnhanced(request, 'exam-generate');
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { 
          error: 'Too many requests. Please wait a moment.',
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

    // Check if OpenAI API key is configured
    const openaiApiKey = process.env.OPENAI_API_KEY;
    if (!openaiApiKey) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 503 }
      );
    }

    // Get form data
    // Note: Next.js App Router has a default body size limit (~1MB for local dev, ~4.5MB for Vercel)
    // If the file is larger, FormData parsing will fail before we can check the size
    let formData: FormData;
    try {
      // Try to get the request body size first (if available)
      const contentLength = request.headers.get('content-length');
      if (contentLength) {
        const sizeMB = (parseInt(contentLength) / (1024 * 1024)).toFixed(2);
        console.log(`📦 Request body size: ${sizeMB} MB`);
      }
      
      formData = await request.formData();
    } catch (formDataError: any) {
      console.error('❌ Failed to parse form data:', formDataError);
      console.error('FormData error details:', {
        message: formDataError.message,
        name: formDataError.name,
        code: formDataError.code,
        stack: formDataError.stack?.substring(0, 500)
      });
      
      // Check if it's a size limit error (common error messages)
      const errorMsg = formDataError.message?.toLowerCase() || '';
      const isSizeError = errorMsg.includes('size') || 
                         errorMsg.includes('limit') || 
                         errorMsg.includes('too large') ||
                         errorMsg.includes('payload') ||
                         errorMsg.includes('413') ||
                         formDataError.code === 'LIMIT_FILE_SIZE' ||
                         formDataError.code === 'LIMIT_UNEXPECTED_FILE';
      
      if (isSizeError) {
        const contentLength = request.headers.get('content-length');
        const sizeInfo = contentLength ? ` (Request size: ${(parseInt(contentLength) / (1024 * 1024)).toFixed(2)} MB)` : '';
        
        return NextResponse.json(
          { 
            error: `File upload size limit exceeded${sizeInfo}. Next.js has a default body size limit. For local development, the limit is typically 1MB. For production (Vercel), it's 4.5MB. Please try with a smaller file or use a file upload service.`,
            message: `File upload size limit exceeded${sizeInfo}. Next.js has a default body size limit. For local development, the limit is typically 1MB. For production (Vercel), it's 4.5MB. Please try with a smaller file or use a file upload service.`,
            details: process.env.NODE_ENV === 'development' ? {
              error: formDataError.message,
              code: formDataError.code,
              suggestion: 'For local development, you may need to increase the limit in your Next.js configuration or use a different upload method.'
            } : undefined
          },
          { status: 413 } // 413 Payload Too Large
        );
      }
      
      return NextResponse.json(
        { 
          error: 'Failed to process file upload. Please ensure the file is valid.',
          message: 'Failed to process file upload. Please ensure the file is valid.',
          details: process.env.NODE_ENV === 'development' ? {
            error: formDataError.message,
            code: formDataError.code
          } : undefined
        },
        { status: 400 }
      );
    }
    
    // Support both single file ('paper') and multiple files ('papers')
    const singleFile = formData.get('paper') as File;
    const multipleFiles = formData.getAll('papers') as File[];
    const files = multipleFiles.length > 0 ? multipleFiles : (singleFile ? [singleFile] : []);
    
    // Log file details for debugging
    console.log('📄 Files received:', {
      count: files.length,
      files: files.map(f => ({
        name: f?.name,
        size: f?.size,
        sizeMB: f ? (f.size / (1024 * 1024)).toFixed(2) + ' MB' : 'N/A',
        type: f?.type
      }))
    });
    
    const subject = formData.get('subject') as string || 'General';
    const year = formData.get('year') as string || '';
    const board = formData.get('board') as string || '';

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'No paper file(s) provided' },
        { status: 400 }
      );
    }

    // Validate file types and sizes
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'application/pdf'];
    const maxSize = 100 * 1024 * 1024; // 100MB per file
    const maxTotalSize = 200 * 1024 * 1024; // 200MB total
    
    let totalSize = 0;
    for (const file of files) {
      if (!allowedTypes.includes(file.type)) {
        return NextResponse.json(
          { error: `Invalid file format for "${file.name}". Supported: JPEG, PNG, WebP, PDF` },
          { status: 400 }
        );
      }
      
      if (file.size > maxSize) {
        const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
        return NextResponse.json(
          { 
            error: `File "${file.name}" is too large (${fileSizeMB} MB). Maximum size per file: 100MB.`,
            message: `File "${file.name}" is too large (${fileSizeMB} MB). Maximum size per file: 100MB.`
          },
          { status: 400 }
        );
      }
      
      totalSize += file.size;
    }
    
    if (totalSize > maxTotalSize) {
      const totalSizeMB = (totalSize / (1024 * 1024)).toFixed(2);
      return NextResponse.json(
        { 
          error: `Total file size is too large (${totalSizeMB} MB). Maximum total size: 200MB.`,
          message: `Total file size is too large (${totalSizeMB} MB). Maximum total size: 200MB.`
        },
        { status: 400 }
      );
    }
    
    console.log(`✅ ${files.length} file(s) validated, total size: ${(totalSize / (1024 * 1024)).toFixed(2)} MB`);

    console.log('📄 Processing previous year paper(s):', {
      fileCount: files.length,
      fileNames: files.map(f => f.name),
      subject,
      year,
      board
    });

    // Step 1: Extract text from all files using OCR or PDF parsing
    let extractedText = '';
    const extractedTexts: string[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      console.log(`📄 Processing file ${i + 1}/${files.length}: ${file.name}`);
      
      let fileText = '';
      
      if (file.type === 'application/pdf') {
        // Process PDF file
        const buffer = Buffer.from(await file.arrayBuffer());
        console.log(`📄 Attempting to parse PDF: ${file.name}, size: ${buffer.length} bytes`);
        
        // Validate PDF before processing
        if (buffer.length < 1024) {
          extractedTexts.push(`[File ${i + 1}: ${file.name} - Error: File too small to be a valid PDF]`);
          continue;
        }
        
        // Check PDF header
        const pdfHeader = buffer.toString('utf8', 0, 10);
        if (!pdfHeader.includes('%PDF')) {
          console.warn('⚠️ Invalid PDF header detected:', pdfHeader);
          extractedTexts.push(`[File ${i + 1}: ${file.name} - Error: Invalid PDF format]`);
          continue;
        }
        
        console.log('✅ PDF header validated:', pdfHeader);
        
        // Try to extract text from PDF first
        let pdfTextExtracted = false;
        try {
          const pdfData = await extractTextFromPDF(buffer);
          console.log(`📄 PDF parsed successfully: ${pdfData.numPages} pages`);
          
          if (pdfData.text && pdfData.text.trim().length > 50) {
            fileText = pdfData.text;
            pdfTextExtracted = true;
            console.log(`✅ PDF text extracted: ${fileText.length} characters from ${pdfData.numPages} pages`);
          } else {
            console.warn('⚠️ PDF has no extractable text - likely a scanned document, will use OCR fallback');
          }
        } catch (pdfError: any) {
          console.warn('⚠️ PDF text extraction failed, will use OCR fallback:', pdfError.message);
          // Continue to OCR fallback below
        }
        
        // If PDF text extraction failed or returned empty, try OCR fallback
        if (!pdfTextExtracted || !fileText || fileText.trim().length < 50) {
          console.warn('⚠️ PDF has no extractable text - attempting OCR fallback');
          
          try {
            // Convert PDF pages to images and process with OCR
            console.log('🔄 Converting PDF pages for OCR processing...');
            const pdfOcrResult = await convertPDFToImagesAndOCR(buffer);
            
            if (pdfOcrResult.text && pdfOcrResult.text.trim().length > 50) {
              fileText = pdfOcrResult.text;
              console.log(`✅ PDF OCR succeeded: ${fileText.length} characters from ${pdfOcrResult.numPages} pages`);
            } else {
              console.error('❌ PDF OCR failed - insufficient text extracted');
              extractedTexts.push(`[File ${i + 1}: ${file.name} - Error: Failed to extract text from PDF]`);
              continue;
            }
          } catch (ocrError: any) {
            console.error('❌ PDF OCR conversion error:', ocrError);
            extractedTexts.push(`[File ${i + 1}: ${file.name} - Error: ${ocrError.message || 'OCR failed'}]`);
            continue;
          }
        }
      } else {
        // Process image with OCR
        const buffer = Buffer.from(await file.arrayBuffer());
        const ocrResult = await VercelHybridOCRService.processImage(buffer);
        
        if (!ocrResult.success || !ocrResult.text) {
          extractedTexts.push(`[File ${i + 1}: ${file.name} - Error: Failed to extract text from image]`);
          continue;
        }
        
        fileText = ocrResult.text;
        console.log(`✅ Image OCR succeeded: ${fileText.length} characters from ${file.name}`);
      }
      
      // Add file separator and text
      if (fileText && fileText.trim().length > 0) {
        extractedTexts.push(`\n\n[=== File ${i + 1}: ${file.name} ===]\n\n${fileText}`);
      }
    }
    
    // Combine all extracted texts
    extractedText = extractedTexts.join('\n\n');
    
    if (!extractedText || extractedText.trim().length < 50) {
      return NextResponse.json(
        { 
          error: 'Failed to extract sufficient text from any of the uploaded files. Please ensure the files are clear and readable.',
          message: 'Failed to extract sufficient text from any of the uploaded files. Please ensure the files are clear and readable.'
        },
        { status: 400 }
      );
    }

    console.log(`📝 Total extracted text length from ${files.length} file(s): ${extractedText.length} characters`);

    // Step 2: Use AI to identify questions and solve them
    const prompt = `You are an expert educator solving a previous year exam paper. 

🚨 CRITICAL: You MUST extract and solve EVERY SINGLE question in this paper. Do NOT stop at 8 questions. Continue until you have processed ALL questions in the document.

Paper Details:
- Subject: ${subject}
- Year: ${year || 'Not specified'}
- Board: ${board || 'Not specified'}

Paper Text:
${extractedText}

MANDATORY REQUIREMENTS:
1. Count the total number of questions in the paper first
2. Extract and solve EVERY question from question 1 to the last question
3. If you see questions numbered 9, 10, 11, 12, etc., you MUST include them all
4. Do NOT stop after question 8 - continue until the end
5. Process ALL sections of the paper (Section A, B, C, etc. if present)

For EACH AND EVERY question found in the paper, provide:
1. Question number (if available)
2. The complete question text
3. Question type (Multiple Choice, Short Answer, Long Answer, etc.)
4. Options (if MCQ)
5. The correct answer
6. Detailed step-by-step explanation/solution
7. Key concepts tested

Format the response as JSON array:
[
  {
    "questionNumber": "1",
    "question": "Complete question text here",
    "type": "multiple_choice" | "short_answer" | "long_answer",
    "options": ["Option A", "Option B", "Option C", "Option D"] (only for MCQ),
    "correctAnswer": "The correct answer text or option index",
    "explanation": "Detailed step-by-step explanation",
    "concepts": ["Concept 1", "Concept 2"]
  },
  {
    "questionNumber": "2",
    ...
  }
  // Continue for ALL questions - do not stop at 8!
]

VERY IMPORTANT:
- The paper may have 10, 15, 20, or more questions - extract ALL of them
- If the last question you extract is number 8, you are missing questions - continue reading
- Look for question numbers: 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, etc.
- Process the ENTIRE document from start to finish
- Your response must include solutions for ALL questions, not just the first 8`;

    let aiResponse: Response;
    try {
      aiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openaiApiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o', // Using gpt-4o for better handling of long papers
          messages: [
            {
              role: 'system',
              content: 'You are an expert educator solving exam papers. Always respond with valid JSON only. Extract ALL questions from the entire paper accurately and provide detailed solutions for each one. Do NOT stop at 8 questions - continue until you have processed EVERY question in the document. If the paper has 15 questions, return 15 solutions. If it has 20, return 20. Process the complete paper.',
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
          temperature: 0.3, // Lower temperature for more accurate solutions
          max_tokens: 32000, // Significantly increased tokens for complete papers with many questions
        }),
      });
    } catch (fetchError: any) {
      console.error('Failed to connect to OpenAI API:', fetchError);
      return NextResponse.json(
        { 
          error: 'Failed to connect to AI service. Please try again.',
          message: 'Failed to connect to AI service. Please try again.',
          details: process.env.NODE_ENV === 'development' ? fetchError.message : undefined
        },
        { status: 503 }
      );
    }

    if (!aiResponse.ok) {
      let errorData: any = {};
      try {
        const errorText = await aiResponse.text();
        if (errorText) {
          errorData = JSON.parse(errorText);
        }
      } catch (parseError) {
        console.error('Failed to parse OpenAI error response:', parseError);
        errorData = { error: `OpenAI API error: ${aiResponse.status} ${aiResponse.statusText}` };
      }
      
      console.error('OpenAI API error:', {
        status: aiResponse.status,
        statusText: aiResponse.statusText,
        error: errorData
      });
      
      return NextResponse.json(
        { 
          error: errorData.error?.message || errorData.error || 'Failed to solve paper. The AI service returned an error.',
          message: errorData.error?.message || errorData.error || 'Failed to solve paper. The AI service returned an error.',
          details: process.env.NODE_ENV === 'development' ? errorData : undefined
        },
        { status: 500 }
      );
    }

    let aiData: any;
    try {
      const responseText = await aiResponse.text();
      if (!responseText || responseText.trim().length === 0) {
        throw new Error('Empty response from OpenAI API');
      }
      aiData = JSON.parse(responseText);
    } catch (parseError: any) {
      console.error('Failed to parse OpenAI response:', parseError);
      return NextResponse.json(
        { 
          error: 'Failed to process AI response. Please try again.',
          message: 'Failed to process AI response. Please try again.',
          details: process.env.NODE_ENV === 'development' ? parseError.message : undefined
        },
        { status: 500 }
      );
    }
    
    const content = aiData.choices?.[0]?.message?.content || '[]';
    
    if (!content || content === '[]') {
      console.warn('OpenAI returned empty or invalid content');
      return NextResponse.json(
        { 
          error: 'AI did not generate any solutions. The paper might be too complex or unclear.',
          message: 'AI did not generate any solutions. The paper might be too complex or unclear.'
        },
        { status: 400 }
      );
    }

    // Parse JSON response
    let solutions;
    try {
      // Remove markdown code blocks if present
      const cleanedContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      solutions = JSON.parse(cleanedContent);
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      // Try to extract JSON from the response
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        try {
          solutions = JSON.parse(jsonMatch[0]);
        } catch (e) {
          return NextResponse.json(
            { error: 'Failed to parse solutions. The paper may be too complex or unclear.' },
            { status: 500 }
          );
        }
      } else {
        return NextResponse.json(
          { error: 'Failed to parse solutions. The paper may be too complex or unclear.' },
          { status: 500 }
        );
      }
    }

    // Validate and format solutions
    const formattedSolutions = Array.isArray(solutions) ? solutions.map((sol: any, index: number) => ({
      id: `q_${index + 1}`,
      questionNumber: sol.questionNumber || `${index + 1}`,
      question: sol.question || `Question ${index + 1}`,
      type: sol.type || 'short_answer',
      options: sol.options || [],
      correctAnswer: sol.correctAnswer || 'Answer not provided',
      explanation: sol.explanation || 'Explanation not available',
      concepts: sol.concepts || [],
    })) : [];

    if (formattedSolutions.length === 0) {
      return NextResponse.json(
        { error: 'No questions found in the paper. Please ensure the paper is clear and readable.' },
        { status: 400 }
      );
    }
    
    // Warn if we only got a few questions (might indicate incomplete processing)
    if (formattedSolutions.length <= 10) {
      console.warn(`⚠️ Only ${formattedSolutions.length} questions extracted. The paper might have more questions.`);
    }
    
    console.log(`✅ Successfully extracted and solved ${formattedSolutions.length} questions from the paper`);

    return NextResponse.json({
      success: true,
      solutions: formattedSolutions,
      count: formattedSolutions.length,
      subject,
      year,
      board,
      extractedTextLength: extractedText.length,
      warning: formattedSolutions.length <= 10 
        ? `Only ${formattedSolutions.length} questions were extracted. If the paper has more questions, they may not have been processed.` 
        : undefined,
    });

  } catch (error: any) {
    console.error('❌ Solve paper error:', error);
    console.error('Error stack trace:', error?.stack?.substring(0, 500));
    console.error('Error details:', {
      message: error?.message || 'Unknown error',
      stack: error?.stack?.substring(0, 300),
      name: error?.name,
      type: typeof error
    });
    
    // Always return proper JSON - bulletproof error handling
    const safeErrorMessage =
      error?.message?.length > 0
        ? error.message
        : 'Unknown server error occurred while processing the paper.';
    
    // Provide more helpful error messages based on error type
    let userFriendlyMessage = safeErrorMessage;
    if (safeErrorMessage.includes('ENOENT') || safeErrorMessage.includes('Cannot find module')) {
      userFriendlyMessage = 'PDF processing library is not available. Please contact support.';
    } else if (safeErrorMessage.includes('timeout')) {
      userFriendlyMessage = 'Request timed out. The paper might be too large. Please try with a smaller file.';
    } else if (safeErrorMessage.includes('Failed to load PDF parser') || safeErrorMessage.includes('PDF processing library')) {
      userFriendlyMessage = 'PDF processing library is not available. Please contact support.';
    } else if (safeErrorMessage.includes('size limit') || safeErrorMessage.includes('too large') || safeErrorMessage.includes('413')) {
      userFriendlyMessage = safeErrorMessage; // Keep the original message for size errors
    } else if (safeErrorMessage.includes('OpenAI') || safeErrorMessage.includes('API key')) {
      userFriendlyMessage = safeErrorMessage; // Keep OpenAI errors as-is
    } else if (!safeErrorMessage.includes('Failed to solve paper')) {
      userFriendlyMessage = `Failed to solve paper: ${safeErrorMessage}`;
    }
    
    const fullErrorResponse = {
      success: false,
      error: userFriendlyMessage,
      message: userFriendlyMessage,
      details:
        process.env.NODE_ENV === 'development'
          ? {
              name: error?.name || 'UnknownError',
              stack: error?.stack?.substring(0, 300),
              type: typeof error,
              originalMessage: safeErrorMessage,
            }
          : undefined,
    };
    
    // Always return JSON safely using NextResponse with stringify
    try {
      return new NextResponse(JSON.stringify(fullErrorResponse), {
        status: 500,
        headers: { 
          'Content-Type': 'application/json',
          'Content-Length': JSON.stringify(fullErrorResponse).length.toString()
        },
      });
    } catch (jsonError: any) {
      // Ultimate fallback - if even JSON.stringify fails
      console.error('❌ Failed to create error response JSON:', jsonError);
      const fallbackResponse = {
        success: false,
        error: 'An unexpected error occurred. Please try again.',
        message: 'An unexpected error occurred. Please try again.',
      };
      return new NextResponse(JSON.stringify(fallbackResponse), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }
}

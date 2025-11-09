/**
 * PDF Text Extraction Utility
 * Reusable functions for extracting text from PDFs
 */

// Import OCR service - lazy load to avoid initialization errors
// Make it completely optional so it doesn't break the app if unavailable
let VercelHybridOCRService: any = null;
let ocrImportPromise: Promise<any> | null = null;
let ocrImportFailed = false;

async function getOCRService() {
  // If we've already determined OCR is unavailable, don't try again
  if (ocrImportFailed) {
    throw new Error('OCR service is not available');
  }
  
  if (VercelHybridOCRService) {
    return VercelHybridOCRService;
  }
  
  // If import is already in progress, wait for it
  if (ocrImportPromise) {
    try {
      VercelHybridOCRService = await ocrImportPromise;
      return VercelHybridOCRService;
    } catch (e) {
      ocrImportFailed = true;
      throw e;
    }
  }
  
  // Start new import attempt
  ocrImportPromise = (async () => {
    try {
      // Use static relative path (Next.js can analyze this)
      // From src/utils, go up to root, then to services/ocr
      const ocrModule = await import('../../services/ocr/vercelHybridOcr.mjs');
      const service = ocrModule.default || ocrModule;
      
      if (!service || typeof service.processImage !== 'function') {
        throw new Error('OCR service module is not properly exported');
      }
      
      return service;
    } catch (e: any) {
      console.error('Failed to import OCR service:', e.message);
      ocrImportFailed = true;
      throw new Error(`OCR service not available: ${e.message}`);
    }
  })();
  
  try {
    VercelHybridOCRService = await ocrImportPromise;
    return VercelHybridOCRService;
  } catch (e: any) {
    ocrImportPromise = null; // Reset so we can retry
    throw e;
  }
}

export interface PDFExtractionResult {
  success: boolean;
  text: string;
  numPages?: number;
  error?: string;
}

/**
 * Extract text from PDF buffer
 * Uses the same logic as solve-paper route
 */
export async function extractTextFromPDF(buffer: Buffer): Promise<PDFExtractionResult> {
  console.log('📄 Starting PDF extraction, buffer size:', buffer.length, 'bytes');
  
  try {
    // Try pdf-parse first (for text-based PDFs)
    try {
      console.log('🔄 Step 1: Attempting pdf-parse...');
      const pdfParseModule = await import('pdf-parse');
      // pdf-parse exports as default or named export
      const pdfParse = pdfParseModule.default || pdfParseModule;
      
      // Check if it's a function
      if (typeof pdfParse !== 'function') {
        throw new Error('pdf-parse module did not export a function');
      }
      
      console.log('✅ pdf-parse module loaded, parsing PDF...');
      
      // Call with timeout to prevent hanging
      const pdfData = await Promise.race([
        pdfParse(buffer),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('PDF parsing timeout')), 30000)
        )
      ]) as any;
      
      if (pdfData.text && pdfData.text.trim().length > 50) {
        console.log('✅ pdf-parse succeeded:', pdfData.text.length, 'characters from', pdfData.numpages, 'pages');
        return {
          success: true,
          text: pdfData.text,
          numPages: pdfData.numpages || 0
        };
      } else {
        console.log('⚠️ pdf-parse returned insufficient text (' + (pdfData.text?.length || 0) + ' chars), trying pdfjs-dist...');
      }
    } catch (pdfParseError: any) {
      console.error('❌ pdf-parse failed:', pdfParseError.message);
      console.error('   Error type:', pdfParseError.name);
      console.error('   Error stack:', pdfParseError.stack?.substring(0, 300));
    }

    // Try pdfjs-dist for more complex PDFs
    console.log('🔄 Step 2: Attempting pdfjs-dist...');
    try {
      const result = await convertPDFToImagesAndOCR(buffer);
      if (result.success) {
        console.log('✅ pdfjs-dist extraction succeeded');
        return result;
      } else {
        console.warn('⚠️ pdfjs-dist extraction returned failure:', result.error);
        throw new Error(result.error || 'pdfjs-dist extraction failed');
      }
    } catch (pdfjsError: any) {
      console.error('❌ pdfjs-dist extraction failed:', pdfjsError.message);
      console.error('   Error type:', pdfjsError.name);
      console.error('   Error stack:', pdfjsError.stack?.substring(0, 300));
      
      // Fallback: Use OCR service directly on PDF buffer
      // This works for image-based PDFs
      console.log('🔄 Step 3: Attempting OCR fallback for PDF...');
      try {
        console.log('   Loading OCR service...');
        const ocrService = await getOCRService();
        
        if (!ocrService) {
          throw new Error('OCR service returned null/undefined');
        }
        
        if (typeof ocrService.processImage !== 'function') {
          console.error('   OCR service methods:', Object.keys(ocrService));
          throw new Error('OCR service is not properly initialized - processImage is not a function');
        }
        
        console.log('   ✅ OCR service loaded, processing PDF buffer...');
        const ocrResult = await ocrService.processImage(buffer);
        console.log('   OCR result:', {
          success: ocrResult.success,
          textLength: ocrResult.text?.length || 0,
          engines: ocrResult.engines,
          error: ocrResult.error
        });
        
        if (ocrResult.success && ocrResult.text && ocrResult.text.trim().length > 50) {
          console.log('✅ OCR fallback succeeded:', ocrResult.text.length, 'characters');
          return {
            success: true,
            text: ocrResult.text,
            numPages: 1 // We don't know page count from OCR
          };
        } else {
          console.warn('⚠️ OCR fallback returned insufficient text:', ocrResult.text?.length || 0);
          return {
            success: false,
            text: '',
            error: 'Failed to extract text from PDF. The PDF may be image-based but OCR could not extract readable text. Please try:\n1. Converting the PDF pages to images (JPEG/PNG) and uploading those\n2. Using a PDF with selectable text\n3. Uploading a clearer version of the PDF'
          };
        }
      } catch (ocrError: any) {
        console.error('❌ OCR fallback failed:', ocrError.message);
        console.error('OCR error stack:', ocrError.stack?.substring(0, 200));
        
        // Try OpenAI Vision API as final fallback
        try {
          console.log('🔄 Attempting OpenAI Vision API as final fallback...');
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
            throw new Error(`OpenAI Vision API failed: ${response.status} ${response.statusText}`);
          }
          
          const data = await response.json();
          const extractedText = data.choices?.[0]?.message?.content || '';
          
          if (extractedText && extractedText.trim().length > 50) {
            console.log('✅ OpenAI Vision API fallback succeeded:', extractedText.length, 'characters');
            return {
              success: true,
              text: extractedText,
              numPages: 1
            };
          } else {
            throw new Error('OpenAI Vision API returned insufficient text');
          }
        } catch (visionError: any) {
          console.error('❌ OpenAI Vision fallback also failed:', visionError.message);
          
          // Return a helpful error message
          return {
            success: false,
            text: '',
            error: `PDF processing failed. All extraction methods failed:\n- PDF libraries: ${pdfjsError.message}\n- OCR service: ${ocrError.message}\n- OpenAI Vision: ${visionError.message}\n\nPlease try:\n1. Converting the PDF pages to images (JPEG/PNG) and uploading those\n2. Using a PDF with selectable text\n3. Uploading a clearer version of the PDF`
          };
        }
      }
    }
  } catch (error: any) {
    console.error('PDF extraction error:', error);
    
    // Final fallback: Try OCR service
    try {
      const ocrService = await getOCRService();
      
      const ocrResult = await ocrService.processImage(buffer);
      
      if (ocrResult.success && ocrResult.text && ocrResult.text.trim().length > 50) {
        return {
          success: true,
          text: ocrResult.text,
          numPages: 1
        };
      }
    } catch (ocrError: any) {
      console.error('Final OCR fallback failed:', ocrError.message);
    }
    
    return {
      success: false,
      text: '',
      error: error.message || 'Unknown error extracting PDF. Please try converting the PDF pages to images (JPEG/PNG) and uploading those instead.'
    };
  }
}

/**
 * Convert PDF pages to images and use the same OCR service as images
 * This uses the proven OCR pipeline (Google Vision, OpenAI Vision, Gemini Vision)
 */
async function convertPDFToImagesAndOCR(buffer: Buffer): Promise<PDFExtractionResult> {
  let pdfjs: any = null;
  let pdfDocument: any = null;
  
  console.log('📦 convertPDFToImagesAndOCR: Starting PDF to image conversion...');
  
  try {
    // Use stable import pattern for Next.js 15+ and Webpack 5
    // Try legacy build first (most reliable)
    console.log('   Attempting to import pdfjs-dist/legacy/build/pdf.mjs...');
    try {
      const pdfjsModule = await import('pdfjs-dist/legacy/build/pdf.mjs');
      pdfjs = pdfjsModule.default || pdfjsModule;
      
      if (!pdfjs) {
        throw new Error('pdfjs module is null/undefined');
      }
      
      // Configure worker with version from the module
      if (pdfjs && pdfjs.GlobalWorkerOptions) {
        const version = pdfjs.version || '3.11.174';
        pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${version}/pdf.worker.min.js`;
        console.log('   ✅ Configured pdfjs worker (version:', version, ')');
      }
      
      console.log('   ✅ Loaded pdfjs-dist via legacy/build/pdf.mjs');
      console.log('   pdfjs methods:', Object.keys(pdfjs).slice(0, 10).join(', '), '...');
    } catch (e1: any) {
      console.error('   ❌ Legacy import failed:', e1.message);
      console.error('   Error type:', e1.name);
      console.log('   ⚠️ Trying standard import...');
      try {
        const pdfjsModule = await import('pdfjs-dist');
        pdfjs = pdfjsModule.default || pdfjsModule;
        
        if (!pdfjs) {
          throw new Error('pdfjs module is null/undefined');
        }
        
        // Configure worker
        if (pdfjs && pdfjs.GlobalWorkerOptions) {
          const version = pdfjs.version || '3.11.174';
          pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${version}/pdf.worker.min.js`;
          console.log('   ✅ Configured pdfjs worker (version:', version, ')');
        }
        
        console.log('   ✅ Loaded pdfjs-dist via standard import');
      } catch (e2: any) {
        console.error('   ❌ Standard import failed:', e2.message);
        console.error('   Error type:', e2.name);
        console.log('   ⚠️ Trying build path...');
        try {
          const pdfjsModule = await import('pdfjs-dist/build/pdf.mjs' as any);
          pdfjs = pdfjsModule.default || pdfjsModule;
          
          if (!pdfjs) {
            throw new Error('pdfjs module is null/undefined');
          }
        
          // Configure worker
          if (pdfjs && pdfjs.GlobalWorkerOptions) {
            const version = pdfjs.version || '3.11.174';
            pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${version}/pdf.worker.min.js`;
            console.log('   ✅ Configured pdfjs worker (version:', version, ')');
          }
          
          console.log('   ✅ Loaded pdfjs-dist via build/pdf.mjs');
        } catch (e3: any) {
          console.error('   ❌ All pdfjs-dist import attempts failed');
          console.error('   Last error:', e3.message);
          console.error('   Error type:', e3.name);
          console.error('   Error stack:', e3.stack?.substring(0, 500));
          // All PDF library imports failed - this will trigger OCR fallback in parent function
          throw new Error('PDF processing library not available: All pdfjs-dist import attempts failed. ' + e3.message);
        }
      }
    }
    
    if (!pdfjs || typeof pdfjs.getDocument !== 'function') {
      throw new Error('pdfjs-dist loaded but getDocument function is not available');
    }
    
    const loadingTask = pdfjs.getDocument({ 
      data: buffer,
      verbosity: 0
    });
    pdfDocument = await loadingTask.promise;
    
    const numPages = pdfDocument.numPages;
    if (numPages === 0) {
      throw new Error('PDF has no pages');
    }
    
    // Process pages (limit to 10 for chat to avoid timeout)
    const maxPages = Math.min(numPages, 10);
    const allText: string[] = [];
    let pagesWithText = 0;
    
    // Try direct text extraction first
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
        }
      } catch (pageError: any) {
        console.warn(`Page ${pageNum} extraction error:`, pageError.message);
      }
    }
    
    if (pagesWithText > 0 && allText.length > 0) {
      const combinedText = allText.join('\n\n');
      if (combinedText.trim().length > 50) {
        return {
          success: true,
          text: combinedText,
          numPages: numPages
        };
      }
    }
    
    // If direct extraction didn't work, convert PDF pages to images and use the same OCR service as images
    // This uses the proven hybrid OCR pipeline (Google Vision, OpenAI Vision, Gemini Vision)
    try {
      console.log('🖼️ Converting PDF pages to images for OCR (using same service as images)...');
      const ocrService = await getOCRService();
      
      allText.length = 0;
      pagesWithText = 0;
      
      for (let pageNum = 1; pageNum <= maxPages; pageNum++) {
        try {
          const page = await pdfDocument.getPage(pageNum);
          const viewport = page.getViewport({ scale: 2.0 });
          
          // Check if canvas is available
          try {
            const canvasModule = await import('canvas');
            if (!canvasModule.createCanvas) {
              throw new Error('Canvas not available');
            }
            
            const canvas = canvasModule.createCanvas(viewport.width, viewport.height);
            const context = canvas.getContext('2d');
            
            await page.render({
              canvasContext: context as any,
              viewport: viewport
            }).promise;
            
            // Convert page to image buffer
            const imageBuffer = canvas.toBuffer('image/png');
            
            // Use the SAME OCR service that images use (VercelHybridOCRService)
            // This uses Google Vision, OpenAI Vision, and Gemini Vision in a hybrid approach
            console.log(`📄 Processing page ${pageNum}/${maxPages} with hybrid OCR...`);
            const ocrResult = await ocrService.processImage(imageBuffer);
            
            if (ocrResult.success && ocrResult.text && ocrResult.text.trim().length > 20) {
              allText.push(`Page ${pageNum}:\n${ocrResult.text}`);
              pagesWithText++;
              console.log(`✅ Page ${pageNum}: Extracted ${ocrResult.text.length} characters using ${ocrResult.engines?.join(', ') || 'OCR'}`);
            } else {
              console.warn(`⚠️ Page ${pageNum}: OCR returned insufficient text (${ocrResult.text?.length || 0} chars)`);
            }
          } catch (canvasError: any) {
            console.warn(`Canvas rendering failed for page ${pageNum}:`, canvasError.message);
          }
        } catch (pageError: any) {
          console.warn(`Page ${pageNum} OCR error:`, pageError.message);
        }
      }
      
      if (pagesWithText > 0 && allText.length > 0) {
        console.log(`✅ Successfully extracted text from ${pagesWithText}/${maxPages} pages using hybrid OCR`);
        return {
          success: true,
          text: allText.join('\n\n'),
          numPages: numPages
        };
      }
    } catch (ocrError: any) {
      console.warn('OCR fallback failed:', ocrError.message);
    }
    
    throw new Error('Failed to extract text from PDF. The PDF may be image-based or corrupted. Please try converting the PDF pages to images (JPEG/PNG) and uploading those instead.');
    
  } catch (error: any) {
    console.error('PDF to image conversion error:', error);
    return {
      success: false,
      text: '',
      error: error.message || 'Failed to process PDF'
    };
  }
}


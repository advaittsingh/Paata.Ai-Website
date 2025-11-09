import { NextRequest, NextResponse } from 'next/server';
import { PrismaDatabase } from '@/lib/prisma-database';
import jwt from 'jsonwebtoken';
import VercelHybridOCRService from '../../../../../services/ocr/vercelHybridOcr.mjs';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

function verifyToken(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  
  const token = authHeader.substring(7);
  try {
    return jwt.verify(token, JWT_SECRET) as any;
  } catch {
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verify JWT token
    const decoded = verifyToken(request);
    if (!decoded) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Authentication required',
          code: 'AUTH_REQUIRED'
        },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const imageFile = formData.get('image') as File;
    const sessionId = formData.get('sessionId') as string || 'mobile-session';
    const contextMetadata = JSON.parse(formData.get('contextMetadata') as string || '{}');
    
    if (!imageFile) {
      return NextResponse.json(
        { 
          success: false,
          error: 'No image file provided',
          code: 'MISSING_IMAGE'
        },
        { status: 400 }
      );
    }

    // Validate image format
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(imageFile.type)) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Invalid image format. Supported: JPEG, PNG, WebP',
          code: 'INVALID_IMAGE_FORMAT'
        },
        { status: 400 }
      );
    }

    // Check file size (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (imageFile.size > maxSize) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Image too large. Maximum size: 10MB',
          code: 'IMAGE_TOO_LARGE'
        },
        { status: 400 }
      );
    }

    // Get user to check plan limits
    const user = await PrismaDatabase.getUserById(decoded.userId);
    if (!user) {
      return NextResponse.json(
        { 
          success: false,
          error: 'User not found',
          code: 'USER_NOT_FOUND'
        },
        { status: 404 }
      );
    }

    console.log('🔍 Mobile OCR processing:', {
      fileName: imageFile.name,
      size: imageFile.size,
      type: imageFile.type,
      sessionId,
      userId: user.id
    });

    // Convert file to buffer
    const buffer = Buffer.from(await imageFile.arrayBuffer());
    
    // Process image with hybrid OCR service
    const ocrResult = await VercelHybridOCRService.processImage(buffer);
    
    console.log('📊 Mobile OCR Result:', {
      success: ocrResult.success,
      textLength: ocrResult.text?.length || 0,
      engines: ocrResult.engines,
      processingTime: ocrResult.processingTime
    });

    // Update user stats
    const today = new Date().toISOString().split('T')[0];
    const currentStats = user.stats as any || {};
    const dailyUsage = currentStats.dailyUsage || {};
    const todayUsage = dailyUsage[today] || {
      interactions: 0,
      timeSpent: 0,
      textMessages: 0,
      imageUploads: 0,
      voiceInputs: 0
    };
    
    const updatedTodayUsage = {
      ...todayUsage,
      interactions: todayUsage.interactions + 1,
      imageUploads: todayUsage.imageUploads + 1,
      timeSpent: todayUsage.timeSpent + 2 // Add 2 minutes for OCR processing
    };
    
    const updatedStats = {
      totalInteractions: (currentStats.totalInteractions || 0) + 1,
      imageUploads: (currentStats.imageUploads || 0) + 1,
      totalTimeSpent: formatTimeSpent((parseInt(currentStats.totalTimeSpent?.replace(/[^\d]/g, '') || '0') + 2)),
      dailyUsage: {
        ...dailyUsage,
        [today]: updatedTodayUsage
      },
      lastActiveDate: today
    };
    
    await PrismaDatabase.updateUser(user.id, {
      stats: {
        ...currentStats,
        ...updatedStats
      }
    });

    if (ocrResult.success && ocrResult.text) {
      return NextResponse.json({
        success: true,
        text: ocrResult.text,
        confidence: ocrResult.confidence,
        languages: ocrResult.languages,
        engines: ocrResult.engines,
        processingTime: ocrResult.processingTime,
        source: ocrResult.source,
        details: ocrResult.details,
        sessionId,
        user: {
          id: user.id,
          plan: user.plan,
          stats: updatedStats
        },
        timestamp: new Date().toISOString()
      });
    } else {
      return NextResponse.json({
        success: false,
        text: '',
        confidence: 0,
        engines: [],
        error: ocrResult.error || 'No text detected in the image',
        details: ocrResult.details,
        sessionId,
        user: {
          id: user.id,
          plan: user.plan,
          stats: updatedStats
        }
      });
    }

  } catch (error) {
    console.error('❌ Mobile OCR API error:', error);
    
    return NextResponse.json({
      success: false,
      text: '',
      error: 'Failed to process image. Please try again.',
      code: 'OCR_PROCESSING_ERROR'
    }, { status: 500 });
  }
}

function formatTimeSpent(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

import { NextRequest, NextResponse } from 'next/server';
import { PrismaDatabase } from '@/lib/prisma-database';
import jwt from 'jsonwebtoken';

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
    const file = formData.get('file') as File;
    const fileType = formData.get('fileType') as string; // 'image' or 'audio'
    const sessionId = formData.get('sessionId') as string || 'mobile-session';
    
    if (!file) {
      return NextResponse.json(
        { 
          success: false,
          error: 'No file provided',
          code: 'MISSING_FILE'
        },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const allowedAudioTypes = ['audio/mp3', 'audio/mp4', 'audio/wav', 'audio/mpeg', 'audio/webm'];
    
    if (fileType === 'image' && !allowedImageTypes.includes(file.type)) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Invalid image format. Supported: JPEG, PNG, WebP',
          code: 'INVALID_IMAGE_FORMAT'
        },
        { status: 400 }
      );
    }
    
    if (fileType === 'audio' && !allowedAudioTypes.includes(file.type)) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Invalid audio format. Supported: MP3, MP4, WAV, WebM',
          code: 'INVALID_AUDIO_FORMAT'
        },
        { status: 400 }
      );
    }

    // Check file size (10MB limit for images, 25MB for audio)
    const maxImageSize = 10 * 1024 * 1024; // 10MB
    const maxAudioSize = 25 * 1024 * 1024; // 25MB
    
    if (fileType === 'image' && file.size > maxImageSize) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Image too large. Maximum size: 10MB',
          code: 'FILE_TOO_LARGE'
        },
        { status: 400 }
      );
    }
    
    if (fileType === 'audio' && file.size > maxAudioSize) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Audio file too large. Maximum size: 25MB',
          code: 'FILE_TOO_LARGE'
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

    // Generate unique filename
    const timestamp = Date.now();
    const fileExtension = file.name.split('.').pop() || 'bin';
    const fileName = `${fileType}_${decoded.userId}_${timestamp}.${fileExtension}`;
    
    // In a real implementation, you would save the file to cloud storage (AWS S3, etc.)
    // For now, we'll return a mock URL
    const fileUrl = `/uploads/mobile/${fileName}`;
    
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
      [fileType === 'image' ? 'imageUploads' : 'voiceInputs']: 
        todayUsage[fileType === 'image' ? 'imageUploads' : 'voiceInputs'] + 1,
      timeSpent: todayUsage.timeSpent + 1
    };
    
    const updatedStats = {
      totalInteractions: (currentStats.totalInteractions || 0) + 1,
      [fileType === 'image' ? 'imageUploads' : 'voiceInputs']: 
        (currentStats[fileType === 'image' ? 'imageUploads' : 'voiceInputs'] || 0) + 1,
      totalTimeSpent: formatTimeSpent((parseInt(currentStats.totalTimeSpent?.replace(/[^\d]/g, '') || '0') + 1)),
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

    return NextResponse.json({
      success: true,
      file: {
        id: fileName,
        name: file.name,
        type: file.type,
        size: file.size,
        url: fileUrl,
        uploadedAt: new Date().toISOString()
      },
      sessionId,
      user: {
        id: user.id,
        plan: user.plan,
        stats: updatedStats
      }
    });

  } catch (error) {
    console.error('Mobile file upload error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to upload file. Please try again.',
      code: 'UPLOAD_ERROR'
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

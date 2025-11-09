import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const platform = searchParams.get('platform') || 'mobile';
    const version = searchParams.get('version') || '1.0.0';

    // Mobile app configuration
    const config = {
      app: {
        name: 'PAATA.AI Mobile',
        version: '1.0.0',
        minVersion: '1.0.0',
        platform: platform,
        environment: process.env.NODE_ENV || 'development'
      },
      features: {
        chat: {
          enabled: true,
          maxMessageLength: 2000,
          maxHistoryLength: 50,
          supportedInputTypes: ['text', 'image', 'voice']
        },
        ocr: {
          enabled: true,
          maxFileSize: 10 * 1024 * 1024, // 10MB
          supportedFormats: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
          maxProcessingTime: 30000 // 30 seconds
        },
        voice: {
          enabled: true,
          maxFileSize: 25 * 1024 * 1024, // 25MB
          supportedFormats: ['audio/mp3', 'audio/mp4', 'audio/wav', 'audio/mpeg', 'audio/webm'],
          maxRecordingTime: 300 // 5 minutes
        },
        tts: {
          enabled: true,
          maxTextLength: 2000,
          supportedVoices: ['alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer'],
          supportedLanguages: ['en', 'hi', 'kn', 'ta', 'te', 'bn', 'mr', 'gu', 'pa', 'ml', 'or', 'as']
        },
        pushNotifications: {
          enabled: true,
          topics: ['chat_responses', 'usage_updates', 'feature_announcements']
        },
        offlineMode: {
          enabled: false,
          maxCacheSize: 50 * 1024 * 1024 // 50MB
        }
      },
      limits: {
        basic: {
          maxConversations: 100,
          imageAnalysis: false,
          voiceInput: false,
          exportConversations: false
        },
        pro: {
          maxConversations: 'unlimited',
          imageAnalysis: true,
          voiceInput: true,
          exportConversations: true
        },
        enterprise: {
          maxConversations: 'unlimited',
          imageAnalysis: true,
          voiceInput: true,
          exportConversations: true,
          apiAccess: true,
          teamManagement: true
        }
      },
      api: {
        baseUrl: process.env.NEXT_PUBLIC_API_URL || 'https://your-domain.com',
        timeout: 30000, // 30 seconds
        retryAttempts: 3,
        endpoints: {
          auth: {
            login: '/api/mobile/auth/login',
            signup: '/api/mobile/auth/signup',
            verify: '/api/mobile/auth/verify'
          },
          chat: '/api/mobile/chat',
          ocr: '/api/mobile/ocr',
          voice: '/api/mobile/voice',
          tts: '/api/mobile/tts',
          upload: '/api/mobile/upload',
          profile: '/api/mobile/profile'
        }
      },
      ui: {
        theme: {
          default: 'system',
          options: ['light', 'dark', 'system']
        },
        language: {
          default: 'en',
          supported: ['en', 'hi', 'kn', 'ta', 'te', 'bn', 'mr', 'gu', 'pa', 'ml', 'or', 'as']
        },
        animations: {
          enabled: true,
          duration: 300
        }
      },
      analytics: {
        enabled: true,
        trackEvents: ['chat_message', 'ocr_upload', 'voice_input', 'tts_generation'],
        privacyMode: false
      },
      security: {
        tokenExpiry: '7d',
        refreshTokenEnabled: false,
        biometricAuth: false,
        encryptionEnabled: true
      }
    };

    // Add platform-specific configurations
    if (platform === 'ios') {
      config.features.pushNotifications.enabled = true;
      config.security.biometricAuth = true;
    } else if (platform === 'android') {
      config.features.pushNotifications.enabled = true;
      config.security.biometricAuth = true;
    }

    return NextResponse.json({
      success: true,
      config,
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    });

  } catch (error) {
    console.error('Mobile config error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to load configuration',
        code: 'CONFIG_ERROR'
      },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

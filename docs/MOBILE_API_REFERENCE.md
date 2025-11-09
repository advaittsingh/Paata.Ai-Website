# Mobile API Endpoints Reference

This document provides a complete reference for all mobile-optimized API endpoints created for the PAATA.AI mobile app.

## Base URL
All mobile endpoints are prefixed with `/api/mobile/` and require JWT authentication via the `Authorization: Bearer <token>` header.

## Authentication Endpoints

### POST `/api/mobile/auth/login`
**Purpose**: Authenticate user and return JWT token

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "password123",
  "deviceInfo": "iPhone 15 Pro" // optional
}
```

**Response**:
```json
{
  "success": true,
  "user": {
    "id": "user_id",
    "firstName": "John",
    "lastName": "Doe",
    "email": "user@example.com",
    "plan": "Enterprise",
    "preferences": { ... },
    "stats": { ... }
  },
  "token": "jwt_token_here",
  "expiresIn": "7d"
}
```

### POST `/api/mobile/auth/signup`
**Purpose**: Create new user account and return JWT token

**Request Body**:
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "user@example.com",
  "password": "password123",
  "deviceInfo": "iPhone 15 Pro", // optional
  "pushToken": "fcm_token_here" // optional
}
```

**Response**: Same as login response

### POST `/api/mobile/auth/verify`
**Purpose**: Verify JWT token and refresh user data

**Headers**: `Authorization: Bearer <token>`

**Response**: Same as login response

## Chat Endpoints

### POST `/api/mobile/chat`
**Purpose**: Send message to AI and get response

**Headers**: `Authorization: Bearer <token>`

**Request Body**:
```json
{
  "message": "What is photosynthesis?",
  "conversationHistory": [
    {
      "isUser": true,
      "text": "Hello",
      "timestamp": "2024-01-01T00:00:00Z"
    }
  ],
  "sessionContext": "Biology discussion",
  "sessionId": "session_123",
  "inputType": "text", // "text", "image", "voice"
  "contextMetadata": {
    "subject": "biology",
    "difficulty": "high_school"
  },
  "pushNotification": false
}
```

**Response**:
```json
{
  "success": true,
  "response": "Photosynthesis is the process by which plants...",
  "context": {
    "currentContextId": "ctx_123",
    "contextType": "text",
    "relatedContexts": 2,
    "suggestions": ["Continue with plant biology", "Ask about chlorophyll"],
    "sessionStats": {
      "totalContexts": 5,
      "contextTypes": { "text": 3, "image": 1, "voice": 1 }
    }
  },
  "user": {
    "id": "user_id",
    "plan": "Enterprise",
    "stats": { ... }
  },
  "language": {
    "detected": "english",
    "confidence": 0.95,
    "isExplicitlyRequested": false
  },
  "timestamp": "2024-01-01T00:00:00Z"
}
```

## File Upload Endpoints

### POST `/api/mobile/upload`
**Purpose**: Upload images or audio files

**Headers**: `Authorization: Bearer <token>`

**Request Body** (multipart/form-data):
- `file`: File (image or audio)
- `fileType`: "image" or "audio"
- `sessionId`: "session_123" (optional)

**Response**:
```json
{
  "success": true,
  "file": {
    "id": "file_123",
    "name": "image.jpg",
    "type": "image/jpeg",
    "size": 1024000,
    "url": "/uploads/mobile/file_123",
    "uploadedAt": "2024-01-01T00:00:00Z"
  },
  "sessionId": "session_123",
  "user": {
    "id": "user_id",
    "plan": "Enterprise",
    "stats": { ... }
  }
}
```

## AI Processing Endpoints

### POST `/api/mobile/ocr`
**Purpose**: Extract text from images using OCR

**Headers**: `Authorization: Bearer <token>`

**Request Body** (multipart/form-data):
- `image`: Image file (JPEG, PNG, WebP)
- `sessionId`: "session_123" (optional)
- `contextMetadata`: JSON string with additional context

**Response**:
```json
{
  "success": true,
  "text": "Extracted text from image",
  "confidence": 0.95,
  "languages": ["en"],
  "engines": ["tesseract", "google_vision"],
  "processingTime": 1500,
  "source": "hybrid",
  "details": {
    "wordCount": 25,
    "lineCount": 3
  },
  "sessionId": "session_123",
  "user": {
    "id": "user_id",
    "plan": "Enterprise",
    "stats": { ... }
  },
  "timestamp": "2024-01-01T00:00:00Z"
}
```

### POST `/api/mobile/voice`
**Purpose**: Convert speech to text and generate AI response

**Headers**: `Authorization: Bearer <token>`

**Request Body** (multipart/form-data):
- `audio`: Audio file (MP3, MP4, WAV, WebM)
- `sessionId`: "session_123" (optional)
- `conversationHistory`: JSON string of previous messages
- `sessionContext`: String with session context
- `contextMetadata`: JSON string with additional context

**Response**:
```json
{
  "success": true,
  "transcribedText": "What is the capital of France?",
  "aiResponse": "The capital of France is Paris...",
  "sessionId": "session_123",
  "user": {
    "id": "user_id",
    "plan": "Enterprise",
    "stats": { ... }
  },
  "timestamp": "2024-01-01T00:00:00Z"
}
```

### POST `/api/mobile/tts`
**Purpose**: Convert text to speech

**Headers**: `Authorization: Bearer <token>` (optional)

**Request Body**:
```json
{
  "text": "Hello, this is a test message",
  "language": "en", // optional, default: "en"
  "voice": "alloy" // optional, default: "alloy"
}
```

**Response**: Binary audio/mpeg file with headers:
- `Content-Type: audio/mpeg`
- `Content-Length: <file_size>`
- `Cache-Control: public, max-age=86400`
- `X-Cache: HIT/MISS`
- `X-Success: true`

## User Profile Endpoints

### GET `/api/mobile/profile`
**Purpose**: Get user profile and analytics data

**Headers**: `Authorization: Bearer <token>`

**Query Parameters**:
- `period`: "7d", "30d", "90d", "1y" (default: "30d")
- `includeWeekly`: "true" or "false" (default: "false")

**Response**:
```json
{
  "success": true,
  "user": {
    "id": "user_id",
    "firstName": "John",
    "lastName": "Doe",
    "email": "user@example.com",
    "plan": "Enterprise",
    "preferences": { ... },
    "stats": { ... }
  },
  "analytics": {
    "period": "30d",
    "startDate": "2024-01-01T00:00:00Z",
    "endDate": "2024-01-31T00:00:00Z",
    "totalInteractions": 150,
    "textMessages": 100,
    "imageUploads": 30,
    "voiceInputs": 20,
    "totalTimeSpent": "12h 30m",
    "averageSessionTime": "5m 15s",
    "streakDays": 7,
    "lastActiveDate": "2024-01-31",
    "weeklyData": [
      {
        "day": "Mon",
        "date": "2024-01-29",
        "interactions": 5,
        "timeSpent": 25,
        "textMessages": 3,
        "imageUploads": 1,
        "voiceInputs": 1
      }
    ],
    "subjectBreakdown": {
      "math": 40,
      "science": 35,
      "english": 25
    },
    "plan": "Enterprise",
    "joinDate": "January 2024"
  },
  "timestamp": "2024-01-01T00:00:00Z"
}
```

### PUT `/api/mobile/profile`
**Purpose**: Update user profile

**Headers**: `Authorization: Bearer <token>`

**Request Body**:
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890",
  "bio": "Updated bio",
  "location": "New York, NY",
  "website": "https://johndoe.com",
  "avatar": "/image/avatar2.jpg",
  "preferences": {
    "theme": "dark",
    "language": "en",
    "notifications": {
      "email": true,
      "push": true,
      "weeklyDigest": false,
      "marketing": false
    }
  }
}
```

**Response**:
```json
{
  "success": true,
  "user": {
    "id": "user_id",
    "firstName": "John",
    "lastName": "Doe",
    // ... updated user data
  },
  "message": "Profile updated successfully"
}
```

## Configuration Endpoint

### GET `/api/mobile/config`
**Purpose**: Get mobile app configuration and feature flags

**Query Parameters**:
- `platform`: "ios", "android", "mobile" (default: "mobile")
- `version`: App version (default: "1.0.0")

**Response**:
```json
{
  "success": true,
  "config": {
    "app": {
      "name": "PAATA.AI Mobile",
      "version": "1.0.0",
      "minVersion": "1.0.0",
      "platform": "mobile",
      "environment": "production"
    },
    "features": {
      "chat": {
        "enabled": true,
        "maxMessageLength": 2000,
        "maxHistoryLength": 50,
        "supportedInputTypes": ["text", "image", "voice"]
      },
      "ocr": {
        "enabled": true,
        "maxFileSize": 10485760,
        "supportedFormats": ["image/jpeg", "image/jpg", "image/png", "image/webp"],
        "maxProcessingTime": 30000
      },
      "voice": {
        "enabled": true,
        "maxFileSize": 26214400,
        "supportedFormats": ["audio/mp3", "audio/mp4", "audio/wav", "audio/mpeg", "audio/webm"],
        "maxRecordingTime": 300
      },
      "tts": {
        "enabled": true,
        "maxTextLength": 2000,
        "supportedVoices": ["alloy", "echo", "fable", "onyx", "nova", "shimmer"],
        "supportedLanguages": ["en", "hi", "kn", "ta", "te", "bn", "mr", "gu", "pa", "ml", "or", "as"]
      },
      "pushNotifications": {
        "enabled": true,
        "topics": ["chat_responses", "usage_updates", "feature_announcements"]
      }
    },
    "limits": {
      "basic": {
        "maxConversations": 100,
        "imageAnalysis": false,
        "voiceInput": false,
        "exportConversations": false
      },
      "pro": {
        "maxConversations": "unlimited",
        "imageAnalysis": true,
        "voiceInput": true,
        "exportConversations": true
      },
      "enterprise": {
        "maxConversations": "unlimited",
        "imageAnalysis": true,
        "voiceInput": true,
        "exportConversations": true,
        "apiAccess": true,
        "teamManagement": true
      }
    },
    "api": {
      "baseUrl": "https://your-domain.com",
      "timeout": 30000,
      "retryAttempts": 3,
      "endpoints": {
        "auth": {
          "login": "/api/mobile/auth/login",
          "signup": "/api/mobile/auth/signup",
          "verify": "/api/mobile/auth/verify"
        },
        "chat": "/api/mobile/chat",
        "ocr": "/api/mobile/ocr",
        "voice": "/api/mobile/voice",
        "tts": "/api/mobile/tts",
        "upload": "/api/mobile/upload",
        "profile": "/api/mobile/profile"
      }
    },
    "ui": {
      "theme": {
        "default": "system",
        "options": ["light", "dark", "system"]
      },
      "language": {
        "default": "en",
        "supported": ["en", "hi", "kn", "ta", "te", "bn", "mr", "gu", "pa", "ml", "or", "as"]
      },
      "animations": {
        "enabled": true,
        "duration": 300
      }
    },
    "analytics": {
      "enabled": true,
      "trackEvents": ["chat_message", "ocr_upload", "voice_input", "tts_generation"],
      "privacyMode": false
    },
    "security": {
      "tokenExpiry": "7d",
      "refreshTokenEnabled": false,
      "biometricAuth": false,
      "encryptionEnabled": true
    }
  },
  "timestamp": "2024-01-01T00:00:00Z",
  "version": "1.0.0"
}
```

## Error Responses

All endpoints return consistent error responses:

```json
{
  "success": false,
  "error": "Human-readable error message",
  "code": "ERROR_CODE"
}
```

### Common Error Codes:
- `AUTH_REQUIRED`: Missing or invalid JWT token
- `USER_NOT_FOUND`: User doesn't exist
- `MISSING_FIELDS`: Required fields missing
- `INVALID_CREDENTIALS`: Wrong email/password
- `USER_EXISTS`: User already exists
- `LIMIT_REACHED`: Plan limit exceeded
- `FEATURE_UNAVAILABLE`: Feature not available in current plan
- `MISSING_FILE`: No file provided
- `INVALID_IMAGE_FORMAT`: Unsupported image format
- `INVALID_AUDIO_FORMAT`: Unsupported audio format
- `FILE_TOO_LARGE`: File exceeds size limit
- `TRANSCRIPTION_FAILED`: Speech-to-text failed
- `OCR_PROCESSING_ERROR`: OCR processing failed
- `TTS_GENERATION_ERROR`: Text-to-speech failed
- `INTERNAL_ERROR`: Server error

## Authentication Flow

1. **Login/Signup**: Call `/api/mobile/auth/login` or `/api/mobile/auth/signup`
2. **Store Token**: Save JWT token securely in mobile app
3. **Include Token**: Add `Authorization: Bearer <token>` header to all requests
4. **Verify Token**: Use `/api/mobile/auth/verify` to refresh user data
5. **Handle Expiry**: Re-authenticate when token expires (7 days)

## File Upload Guidelines

- **Images**: Max 10MB, formats: JPEG, PNG, WebP
- **Audio**: Max 25MB, formats: MP3, MP4, WAV, WebM
- **Use multipart/form-data** for file uploads
- **Include fileType** parameter to specify "image" or "audio"

## Rate Limiting

- No explicit rate limits implemented
- Plan-based conversation limits apply
- File size limits enforced per endpoint

## CORS Support

All endpoints support CORS with appropriate headers for mobile app integration.

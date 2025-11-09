# 📱 Complete API List for PAATA.AI Mobile App

**Base URL:** `https://www.paataai.com/api`

**Authentication:** Most endpoints require JWT token in `Authorization: Bearer <token>` header

---

## 📋 Table of Contents

1. [Authentication & User Management](#1-authentication--user-management)
2. [Chat & AI Communication](#2-chat--ai-communication)
3. [Notes Management](#3-notes-management)
4. [Flashcards Management](#4-flashcards-management)
5. [Exam Sessions](#5-exam-sessions)
6. [Focus Sessions (Pomodoro)](#6-focus-sessions-pomodoro)
7. [Mind Maps](#7-mind-maps)
8. [Progress & Analytics](#8-progress--analytics)
9. [Achievements & Badges](#9-achievements--badges)
10. [Notifications](#10-notifications)
11. [User Profile & Settings](#11-user-profile--settings)
12. [Subscriptions & Payments](#12-subscriptions--payments)
13. [Media Processing](#13-media-processing)
14. [Learning Materials](#14-learning-materials)
15. [Mobile-Specific Endpoints](#15-mobile-specific-endpoints)

---

## 🔐 1. Authentication & User Management

### ✅ Implemented

| Method | Endpoint | Purpose | Status |
|--------|----------|---------|--------|
| `POST` | `/api/mobile/auth/login` | User login | ✅ Implemented |
| `POST` | `/api/mobile/auth/signup` | User registration | ✅ Implemented |
| `POST` | `/api/mobile/auth/verify` | Verify JWT token | ✅ Implemented |
| `POST` | `/api/auth/logout` | User logout | ✅ Implemented |
| `POST` | `/api/auth/refresh` | Refresh JWT token | ✅ Implemented |
| `POST` | `/api/auth/forgot-password` | Request password reset | ✅ Implemented |
| `POST` | `/api/auth/reset-password` | Reset password with token | ✅ Implemented |
| `POST` | `/api/auth/change-password` | Change password (authenticated) | ✅ Implemented |
| `POST` | `/api/auth/verify-email` | Verify email address | ✅ Implemented |
| `POST` | `/api/auth/2fa/setup` | Setup two-factor authentication | ✅ Implemented |
| `POST` | `/api/auth/2fa/verify` | Verify 2FA code | ✅ Implemented |
| `POST` | `/api/auth/2fa/disable` | Disable 2FA | ✅ Implemented |
| `GET` | `/api/auth/login-history` | Get login history | ✅ Implemented |

---

## 💬 2. Chat & AI Communication

### ✅ Implemented

| Method | Endpoint | Purpose | Status |
|--------|----------|---------|--------|
| `POST` | `/api/mobile/chat` | Send chat message to AI | ✅ Implemented |
| `POST` | `/api/chat` | Send chat message (web version) | ✅ Implemented |
| `GET` | `/api/chat/sessions` | Get all chat sessions | ✅ Implemented |
| `POST` | `/api/chat/sessions` | Create new chat session | ✅ Implemented |
| `PUT` | `/api/chat/sessions` | Update chat session title | ✅ Implemented |
| `DELETE` | `/api/chat/sessions?id={id}` | Delete chat session | ✅ Implemented |
| `GET` | `/api/chat/sessions/{id}/messages` | Get messages from session | ✅ Implemented |
| `POST` | `/api/chat/sessions/{id}/messages` | Add message to session | ✅ Implemented |
| `GET` | `/api/chat/export/{id}` | Export chat conversation | ✅ Implemented |
| `POST` | `/api/chat/pdf-extract` | Extract text from PDF | ✅ Implemented |

**Request Example (Mobile Chat):**
```json
POST /api/mobile/chat
{
  "message": "What is photosynthesis?",
  "sessionId": "session123",
  "conversationHistory": [],
  "sessionContext": "biology",
  "contextMetadata": {},
  "inputType": "text",
  "language": "en"
}
```

---

## 📝 3. Notes Management

### ✅ Implemented

| Method | Endpoint | Purpose | Status |
|--------|----------|---------|--------|
| `GET` | `/api/notes?userId={userId}&category={category}` | Get user notes | ✅ Implemented |
| `POST` | `/api/notes` | Create new note | ✅ Implemented |
| `PUT` | `/api/notes` | Update note (id in body) | ✅ Implemented |
| `DELETE` | `/api/notes?id={noteId}` | Delete note | ✅ Implemented |
| `POST` | `/api/notes/generate` | Generate note from topic | ✅ Implemented |

**Request Example (Create Note):**
```json
POST /api/notes
{
  "title": "Math Notes",
  "content": "Content here...",
  "category": "Mathematics",
  "tags": "algebra,geometry",
  "userId": "user123",
  "metadata": null
}
```

**Response Example:**
```json
{
  "success": true,
  "note": {
    "id": "note123",
    "title": "Math Notes",
    "content": "Content here...",
    "category": "Mathematics",
    "tags": "algebra,geometry",
    "userId": "user123",
    "createdAt": "2024-01-15T10:00:00Z",
    "updatedAt": "2024-01-15T10:00:00Z",
    "metadata": null
  }
}
```

---

## 📚 4. Flashcards Management

### ✅ Implemented

| Method | Endpoint | Purpose | Status |
|--------|----------|---------|--------|
| `GET` | `/api/flashcards?userId={userId}&category={category}&reviewOnly={boolean}` | Get flashcards | ✅ Implemented |
| `POST` | `/api/flashcards` | Create flashcard | ✅ Implemented |
| `PUT` | `/api/flashcards` | Update flashcard (id in body) | ✅ Implemented |
| `DELETE` | `/api/flashcards?id={flashcardId}` | Delete flashcard | ✅ Implemented |

**Request Example (Create Flashcard):**
```json
POST /api/flashcards
{
  "question": "What is photosynthesis?",
  "answer": "Process by which plants make food",
  "category": "Biology",
  "difficulty": "medium",
  "masteryLevel": 0,
  "userId": "user123",
  "metadata": null
}
```

**Response Example:**
```json
{
  "success": true,
  "flashcard": {
    "id": "card123",
    "question": "What is photosynthesis?",
    "answer": "Process by which plants make food",
    "category": "Biology",
    "difficulty": "medium",
    "masteryLevel": 0,
    "userId": "user123",
    "createdAt": "2024-01-15T10:00:00Z",
    "updatedAt": "2024-01-15T10:00:00Z",
    "lastReviewed": null,
    "metadata": null
  }
}
```

---

## 📋 5. Exam Sessions

### ✅ Implemented

| Method | Endpoint | Purpose | Status |
|--------|----------|---------|--------|
| `GET` | `/api/exam?userId={userId}&status={status}` | Get exam sessions | ✅ Implemented |
| `POST` | `/api/exam` | Create/save exam session | ✅ Implemented |
| `PUT` | `/api/exam` | Update exam session (id in body) | ✅ Implemented |
| `POST` | `/api/exam/generate` | Generate exam questions | ✅ Implemented |
| `POST` | `/api/exam/solve-paper` | Solve exam paper from image | ✅ Implemented |

**Request Example (Generate Exam):**
```json
POST /api/exam/generate
{
  "subject": "Mathematics",
  "topic": "Algebra",
  "difficulty": "medium",
  "numberOfQuestions": 10,
  "timeLimit": 1800
}
```

**Request Example (Create Exam Session):**
```json
POST /api/exam
{
  "title": "Math Quiz 1",
  "questions": "[{...}]",
  "totalQuestions": 10,
  "userId": "user123",
  "metadata": null
}
```

**Request Example (Update Exam Session):**
```json
PUT /api/exam
{
  "id": "exam123",
  "userAnswers": "[{...}]",
  "score": 85.5,
  "timeSpent": 1500,
  "status": "completed"
}
```

---

## 🎯 6. Focus Sessions (Pomodoro)

### ✅ Implemented

| Method | Endpoint | Purpose | Status |
|--------|----------|---------|--------|
| `GET` | `/api/focus?userId={userId}&status={status}` | Get focus sessions | ✅ Implemented |
| `POST` | `/api/focus` | Create focus session | ✅ Implemented |
| `PUT` | `/api/focus` | Update focus session (id in body) | ✅ Implemented |

**Request Example (Create Focus Session):**
```json
POST /api/focus
{
  "duration": 1500,
  "mode": "pomodoro",
  "status": "active",
  "userId": "user123",
  "metadata": null
}
```

**Response Example:**
```json
{
  "success": true,
  "session": {
    "id": "focus123",
    "duration": 1500,
    "mode": "pomodoro",
    "status": "active",
    "userId": "user123",
    "createdAt": "2024-01-15T10:00:00Z",
    "updatedAt": "2024-01-15T10:00:00Z",
    "completedAt": null,
    "metadata": null
  }
}
```

---

## 🗺️ 7. Mind Maps

### ✅ Implemented

| Method | Endpoint | Purpose | Status |
|--------|----------|---------|--------|
| `GET` | `/api/mindmaps?userId={userId}&category={category}` | Get mind maps | ✅ Implemented |
| `POST` | `/api/mindmaps` | Create mind map | ✅ Implemented |
| `PUT` | `/api/mindmaps` | Update mind map (id in body) | ✅ Implemented |
| `DELETE` | `/api/mindmaps?id={id}` | Delete mind map | ✅ Implemented |

**Request Example (Generate Mind Map from Topic):**
```json
POST /api/mindmaps
{
  "generateFromTopic": true,
  "topic": "Photosynthesis",
  "title": "Mind Map: Photosynthesis",
  "category": "Biology",
  "colorScheme": "default",
  "conversationHistory": []
}
```

**Request Example (Create Manual Mind Map):**
```json
POST /api/mindmaps
{
  "title": "My Mind Map",
  "structure": "{...}",
  "category": "General",
  "colorScheme": "default",
  "metadata": {}
}
```

---

## 📊 8. Progress & Analytics

### ✅ Implemented

| Method | Endpoint | Purpose | Status |
|--------|----------|---------|--------|
| `GET` | `/api/mobile/profile?period={period}&analytics=true` | Get user progress/analytics | ✅ Implemented |
| `GET` | `/api/usage?period={period}` | Get usage statistics | ✅ Implemented |
| `GET` | `/api/analytics/insights?period={period}` | Get advanced analytics | ✅ Implemented |

**Query Parameters:**
- `period`: `7d`, `30d`, `90d`, `1y` (default: `30d`)
- `analytics`: `true`/`false` (default: `false`)
- `includeWeekly`: `true`/`false` (default: `false`)

**Response Example:**
```json
{
  "success": true,
  "analytics": {
    "totalInteractions": 1250,
    "textMessages": 800,
    "imageUploads": 300,
    "voiceInputs": 150,
    "totalTimeSpent": "45h 30m",
    "averageSessionTime": "25m 15s",
    "streakDays": 7,
    "lastActiveDate": "2024-01-15T14:00:00Z",
    "dailyUsage": {...},
    "subjectBreakdown": {...},
    "sessionCount": 45
  }
}
```

---

## 🏆 9. Achievements & Badges

### ✅ Implemented

| Method | Endpoint | Purpose | Status |
|--------|----------|---------|--------|
| `GET` | `/api/achievements?userId={userId}` | Get user achievements | ✅ Implemented |
| `POST` | `/api/achievements/check` | Check and award achievements | ✅ Implemented |
| `GET` | `/api/badges?userId={userId}` | Get user badges | ✅ Implemented |

**Response Example (Achievements):**
```json
{
  "success": true,
  "achievements": [
    {
      "id": "ach123",
      "userId": "user123",
      "achievementId": "ach001",
      "achievement": {
        "id": "ach001",
        "name": "First Note",
        "description": "Created your first note",
        "icon": "📝",
        "category": "study",
        "criteria": "notes_count >= 1",
        "points": 10
      },
      "unlockedAt": "2024-01-10T10:00:00Z",
      "progress": 100,
      "isUnlocked": true
    }
  ]
}
```

---

## 🔔 10. Notifications

### ✅ Implemented

| Method | Endpoint | Purpose | Status |
|--------|----------|---------|--------|
| `GET` | `/api/notifications?type={type}&read={boolean}` | Get notifications | ✅ Implemented |
| `PUT` | `/api/notifications` | Mark notification as read (id in body) | ✅ Implemented |
| `PUT` | `/api/notifications` | Mark all as read (`{markAll: true}`) | ✅ Implemented |
| `DELETE` | `/api/notifications?id={notificationId}` | Delete notification | ✅ Implemented |

**Request Example (Mark as Read):**
```json
PUT /api/notifications
{
  "id": "notif123",
  "read": true
}
```

**Request Example (Mark All as Read):**
```json
PUT /api/notifications
{
  "markAll": true
}
```

---

## 👤 11. User Profile & Settings

### ✅ Implemented

| Method | Endpoint | Purpose | Status |
|--------|----------|---------|--------|
| `GET` | `/api/mobile/profile?period={period}&analytics={boolean}` | Get user profile | ✅ Implemented |
| `PUT` | `/api/users` | Update user profile | ✅ Implemented |
| `POST` | `/api/upload/avatar` | Upload avatar image | ✅ Implemented |

**Request Example (Update Profile):**
```json
PUT /api/users
{
  "firstName": "John",
  "lastName": "Doe",
  "bio": "Student",
  "location": "New York",
  "website": "https://..."
}
```

---

## 💳 12. Subscriptions & Payments

### ✅ Implemented

| Method | Endpoint | Purpose | Status |
|--------|----------|---------|--------|
| `GET` | `/api/subscriptions/current` | Get current subscription | ✅ Implemented |
| `POST` | `/api/subscriptions/create` | Create subscription | ✅ Implemented |
| `PUT` | `/api/subscriptions/update` | Update subscription | ✅ Implemented |
| `POST` | `/api/subscriptions/cancel` | Cancel subscription | ✅ Implemented |
| `GET` | `/api/subscriptions/invoices` | Get invoices | ✅ Implemented |
| `GET` | `/api/payment-methods` | Get payment methods | ✅ Implemented |
| `GET` | `/api/invoices/{id}/download` | Download invoice PDF | ✅ Implemented |

**Request Example (Create Subscription):**
```json
POST /api/subscriptions/create
{
  "plan": "Pro",
  "paymentMethodId": "pm_123"
}
```

---

## 🖼️ 13. Media Processing

### ✅ Implemented

| Method | Endpoint | Purpose | Status |
|--------|----------|---------|--------|
| `POST` | `/api/mobile/upload` | Upload image/audio file | ✅ Implemented |
| `POST` | `/api/mobile/ocr` | Process image with OCR/AI | ✅ Implemented |
| `POST` | `/api/mobile/voice` | Process voice/audio with AI | ✅ Implemented |
| `POST` | `/api/mobile/tts` | Text-to-speech conversion | ✅ Implemented |
| `POST` | `/api/ocr` | OCR processing (web version) | ✅ Implemented |
| `POST` | `/api/voice` | Voice processing (web version) | ✅ Implemented |
| `POST` | `/api/tts` | TTS (web version) | ✅ Implemented |
| `GET` | `/api/ocr/status` | Check OCR status | ✅ Implemented |

**Request Example (Upload Image):**
```javascript
POST /api/mobile/upload
Content-Type: multipart/form-data

file: <image file>
fileType: "image"
sessionId: "session123"
```

**Request Example (OCR):**
```javascript
POST /api/mobile/ocr
Content-Type: multipart/form-data

image: <image file>
sessionId: "session123"
conversationHistory: "[]"
sessionContext: "biology"
contextMetadata: "{}"
```

**Request Example (Voice):**
```javascript
POST /api/mobile/voice
Content-Type: multipart/form-data

audio: <audio file>
sessionId: "session123"
conversationHistory: "[]"
sessionContext: "math"
contextMetadata: "{}"
```

**Request Example (TTS):**
```json
POST /api/mobile/tts
{
  "text": "Hello, this is a test.",
  "language": "en",
  "voice": "en-US-Standard-B"
}
```

---

## 📖 14. Learning Materials

### ✅ Implemented

| Method | Endpoint | Purpose | Status |
|--------|----------|---------|--------|
| `GET` | `/api/admin/learning/boards` | Get all boards | ✅ Implemented |
| `GET` | `/api/admin/learning/classes?boardId={id}` | Get classes for board | ✅ Implemented |
| `GET` | `/api/admin/learning/subjects?classId={id}` | Get subjects for class | ✅ Implemented |
| `GET` | `/api/admin/learning/chapters?subjectId={id}` | Get chapters for subject | ✅ Implemented |
| `GET` | `/api/admin/learning/videos?chapterId={id}` | Get videos for chapter | ✅ Implemented |
| `GET` | `/api/admin/learning/pdfs?chapterId={id}` | Get PDFs for chapter | ✅ Implemented |

**Note:** These endpoints are currently under `/api/admin/learning/` but should be accessible to all authenticated users for the mobile app.

---

## 📱 15. Mobile-Specific Endpoints

### ✅ Implemented

| Method | Endpoint | Purpose | Status |
|--------|----------|---------|--------|
| `GET` | `/api/mobile/config` | Get mobile app configuration | ✅ Implemented |

**Response Example:**
```json
{
  "success": true,
  "config": {
    "app": {
      "version": "1.0.0",
      "minVersion": "1.0.0",
      "updateRequired": false
    },
    "features": {
      "offlineMode": true,
      "syncEnabled": true,
      "pushNotifications": true
    },
    "limits": {
      "basic": {...},
      "pro": {...},
      "enterprise": {...}
    },
    "api": {
      "baseUrl": "https://www.paataai.com",
      "timeout": 30000,
      "retryAttempts": 3,
      "endpoints": {...}
    }
  }
}
```

---

## 🔄 Sync Support Endpoints

### ⚠️ Needs Enhancement

For full sync support, the following endpoints need to support `lastSync` parameter:

| Endpoint | Current Status | Needs |
|----------|---------------|-------|
| `/api/notes` | ✅ Basic GET | ⚠️ Add `lastSync` parameter |
| `/api/flashcards` | ✅ Basic GET | ⚠️ Add `lastSync` parameter |
| `/api/exam` | ✅ Basic GET | ⚠️ Add `lastSync` parameter |
| `/api/focus` | ✅ Basic GET | ⚠️ Add `lastSync` parameter |
| `/api/mindmaps` | ✅ Basic GET | ⚠️ Add `lastSync` parameter |
| `/api/notifications` | ✅ Basic GET | ⚠️ Add `lastSync` parameter |

**Example Sync Request:**
```
GET /api/notes?userId=user123&lastSync=2024-01-15T10:00:00Z&limit=100&offset=0
```

---

## 📝 API Request/Response Patterns

### Standard Request Headers

```javascript
{
  "Authorization": "Bearer <jwt_token>",
  "Content-Type": "application/json"
}
```

### Standard Success Response

```json
{
  "success": true,
  "data": {...},
  "message": "Operation successful"
}
```

### Standard Error Response

```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": "Additional details (dev only)"
}
```

### Pagination Response

```json
{
  "success": true,
  "data": [...],
  "total": 100,
  "hasMore": true,
  "limit": 50,
  "offset": 0
}
```

---

## 🚨 Error Codes

| Code | Description | HTTP Status |
|------|-------------|-------------|
| `AUTH_REQUIRED` | Authentication required | 401 |
| `INVALID_CREDENTIALS` | Invalid email/password | 401 |
| `USER_NOT_FOUND` | User not found | 404 |
| `LIMIT_REACHED` | Plan limit reached | 403 |
| `FEATURE_UNAVAILABLE` | Feature not in plan | 403 |
| `MISSING_MESSAGE` | Message required | 400 |
| `VALIDATION_ERROR` | Request validation failed | 400 |
| `RATE_LIMIT` | Too many requests | 429 |
| `SERVER_ERROR` | Internal server error | 500 |

---

## 📊 Summary

### Total Endpoints: **~60+ endpoints**

### By Category:
- **Authentication:** 13 endpoints ✅
- **Chat & AI:** 10 endpoints ✅
- **Notes:** 5 endpoints ✅
- **Flashcards:** 4 endpoints ✅
- **Exam Sessions:** 5 endpoints ✅
- **Focus Sessions:** 3 endpoints ✅
- **Mind Maps:** 4 endpoints ✅
- **Progress & Analytics:** 3 endpoints ✅
- **Achievements & Badges:** 3 endpoints ✅
- **Notifications:** 4 endpoints ✅
- **User Profile:** 3 endpoints ✅
- **Subscriptions:** 7 endpoints ✅
- **Media Processing:** 8 endpoints ✅
- **Learning Materials:** 6 endpoints ✅
- **Mobile-Specific:** 1 endpoint ✅

### Implementation Status:
- ✅ **Fully Implemented:** ~55 endpoints
- ⚠️ **Needs Enhancement:** ~5 endpoints (sync support)
- ❌ **Missing:** 0 critical endpoints

---

## 🔧 Next Steps

1. **Add Sync Support:**
   - Add `lastSync` parameter to GET endpoints
   - Add pagination support (`limit`, `offset`)
   - Return `lastSync` timestamp in responses

2. **RESTful Endpoints:**
   - Convert `PUT /notes` to `PUT /notes/{id}`
   - Convert `PUT /flashcards` to `PUT /flashcards/{id}`
   - Convert `PUT /notifications` to `PUT /notifications/{id}`

3. **Mobile App Integration:**
   - Use `/api/mobile/*` endpoints for mobile-specific features
   - Use standard `/api/*` endpoints for shared features
   - Implement offline sync with `lastSync` parameter

---

**Last Updated:** January 2024  
**Version:** 1.0.0


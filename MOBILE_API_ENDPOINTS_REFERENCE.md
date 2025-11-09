# 📋 Complete API Endpoints List for PAATA.AI Mobile App

**Base URL:** `https://www.paataai.com/api/mobile`

**Authentication:** All endpoints require JWT token in `Authorization: Bearer <token>` header (except auth endpoints)

---

## 📑 Table of Contents

1. [Authentication & User Management](#1-authentication--user-management)
2. [User Profile & Settings](#2-user-profile--settings)
3. [Chat & AI Communication](#3-chat--ai-communication)
4. [Notes Management](#4-notes-management)
5. [Flashcards Management](#5-flashcards-management)
6. [Exam Sessions](#6-exam-sessions)
7. [Focus Sessions](#7-focus-sessions-pomodoro)
8. [Progress & Analytics](#8-progress--analytics)
9. [Achievements & Badges](#9-achievements--badges)
10. [Notifications](#10-notifications)
11. [Learning Materials](#11-learning-materials)
12. [Subscriptions & Payments](#12-subscriptions--payments)
13. [Media Processing](#13-media-processing)
14. [Mobile-Specific Endpoints](#14-mobile-specific-endpoints)
15. [Sync-Specific Requirements](#sync-specific-requirements)
16. [Priority Levels](#priority-levels)
17. [Implementation Notes](#implementation-notes)
18. [Testing Checklist](#testing-checklist)

---

## 🔐 1. Authentication & User Management

### ✅ Currently Implemented

#### `GET /config`
Get app configuration and feature flags.

**Response:**
```json
{
  "success": true,
  "config": {
    "app": { ... },
    "features": { ... },
    "limits": { ... },
    "api": { ... }
  }
}
```

#### `POST /auth/login`
User login with email and password.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "deviceInfo": "iPhone 14 Pro"
}
```

**Response:**
```json
{
  "success": true,
  "user": { ... },
  "token": "jwt_token_here",
  "expiresIn": "7d"
}
```

#### `POST /auth/signup`
User registration.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "deviceInfo": "iPhone 14 Pro"
}
```

**Response:**
```json
{
  "success": true,
  "user": { ... },
  "token": "jwt_token_here",
  "expiresIn": "7d"
}
```

#### `POST /auth/verify`
Verify JWT token validity.

**Request Body:**
```json
{
  "token": "jwt_token_here"
}
```

**Response:**
```json
{
  "success": true,
  "valid": true,
  "user": { ... }
}
```

#### `GET /auth/verify-email?token={token}`
Verify email address with token.

**Query Parameters:**
- `token` (required): Email verification token

**Response:**
```json
{
  "success": true,
  "message": "Email verified successfully"
}
```

#### `POST /auth/verify-email`
Resend verification email.

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Verification email sent"
}
```

#### `POST /auth/2fa/setup`
Setup two-factor authentication.

**Request Body:**
```json
{
  "password": "current_password"
}
```

**Response:**
```json
{
  "success": true,
  "secret": "2fa_secret",
  "qrCode": "data:image/png;base64,...",
  "backupCodes": ["code1", "code2", ...]
}
```

#### `POST /auth/2fa/verify`
Verify 2FA code.

**Request Body:**
```json
{
  "code": "123456"
}
```

**Response:**
```json
{
  "success": true,
  "verified": true
}
```

#### `POST /auth/2fa/disable`
Disable 2FA.

**Request Body:**
```json
{
  "password": "current_password",
  "code": "123456"
}
```

**Response:**
```json
{
  "success": true,
  "message": "2FA disabled successfully"
}
```

#### `GET /auth/login-history`
Get user login history.

**Response:**
```json
{
  "success": true,
  "history": [
    {
      "id": "log123",
      "device": "iPhone 14 Pro",
      "location": "New York, USA",
      "ipAddress": "192.168.1.1",
      "timestamp": "2024-01-15T10:00:00Z",
      "success": true
    }
  ]
}
```

### ⚠️ Missing (May be needed)

#### `POST /auth/logout`
User logout (currently handled client-side).

**Request Body:**
```json
{
  "deviceId": "device_identifier"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

#### `POST /auth/forgot-password`
Request password reset.

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password reset email sent"
}
```

#### `POST /auth/reset-password`
Reset password with token.

**Request Body:**
```json
{
  "token": "reset_token",
  "newPassword": "new_password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password reset successfully"
}
```

#### `POST /auth/change-password`
Change password (authenticated).

**Request Body:**
```json
{
  "currentPassword": "old_password",
  "newPassword": "new_password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

#### `POST /auth/refresh`
Refresh JWT token.

**Request Body:**
```json
{
  "refreshToken": "refresh_token_here"
}
```

**Response:**
```json
{
  "success": true,
  "token": "new_jwt_token",
  "expiresIn": "7d"
}
```

---

## 👤 2. User Profile & Settings

### ✅ Currently Implemented

#### `GET /profile?period={period}&analytics={boolean}`
Get user profile with optional analytics.

**Query Parameters:**
- `period` (optional): `7d`, `30d`, `90d`, `1y` (default: `30d`)
- `analytics` (optional): `true`/`false` (default: `false`)
- `includeWeekly` (optional): `true`/`false` (default: `false`)

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "user123",
    "firstName": "John",
    "lastName": "Doe",
    "email": "user@example.com",
    "plan": "Pro",
    "avatar": "https://...",
    "stats": { ... },
    "preferences": { ... }
  },
  "analytics": { ... } // if analytics=true
}
```

#### `PUT /profile`
Update user profile.

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "bio": "Student",
  "location": "New York",
  "website": "https://..."
}
```

**Response:**
```json
{
  "success": true,
  "user": { ... }
}
```

#### `POST /profile/avatar`
Upload avatar image.

**Request:** `multipart/form-data`
- `file`: Image file (JPEG, PNG, WebP, max 5MB)

**Response:**
```json
{
  "success": true,
  "avatar": "https://.../avatar.jpg"
}
```

### ⚠️ Missing (May be needed)

#### `GET /settings`
Get user settings and preferences.

**Response:**
```json
{
  "success": true,
  "settings": {
    "theme": "dark",
    "language": "en",
    "notifications": {
      "enabled": true,
      "achievements": true,
      "reminders": true,
      "updates": false
    },
    "study": {
      "defaultFocusDuration": 25,
      "autoStartFocus": false,
      "soundEnabled": true
    },
    "privacy": {
      "analyticsEnabled": true,
      "dataSharing": false
    }
  }
}
```

#### `PUT /settings`
Update user settings.

**Request Body:**
```json
{
  "theme": "dark",
  "language": "en",
  "notifications": {
    "enabled": true,
    "achievements": true,
    "reminders": true,
    "updates": false
  },
  "study": {
    "defaultFocusDuration": 30,
    "autoStartFocus": true,
    "soundEnabled": true
  },
  "privacy": {
    "analyticsEnabled": true,
    "dataSharing": false
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Settings updated successfully",
  "settings": { ... }
}
```

---

## 💬 3. Chat & AI Communication

### ✅ Currently Implemented

#### `POST /chat`
Send chat message to AI.

**Request Body:**
```json
{
  "message": "What is photosynthesis?",
  "sessionId": "session123",
  "conversationHistory": [],
  "sessionContext": "biology",
  "contextMetadata": {},
  "language": "en"
}
```

**Response:**
```json
{
  "success": true,
  "response": "Photosynthesis is the process...",
  "sessionId": "session123",
  "metadata": { ... }
}
```

### ⚠️ Missing (May be needed)

#### `GET /chat/sessions`
Get chat sessions/history.

**Query Parameters:**
- `limit` (optional): Number of sessions (default: 20, max: 100)
- `offset` (optional): Pagination offset (default: 0)

**Response:**
```json
{
  "success": true,
  "sessions": [
    {
      "id": "session123",
      "title": "Biology Questions",
      "messageCount": 15,
      "createdAt": "2024-01-15T10:00:00Z",
      "updatedAt": "2024-01-15T11:00:00Z"
    }
  ],
  "total": 25,
  "hasMore": true
}
```

#### `POST /chat/sessions`
Create new chat session.

**Request Body:**
```json
{
  "title": "Math Help",
  "context": "mathematics"
}
```

**Response:**
```json
{
  "success": true,
  "session": {
    "id": "session456",
    "title": "Math Help",
    "createdAt": "2024-01-15T12:00:00Z"
  }
}
```

#### `GET /chat/sessions/{id}/messages`
Get messages from session.

**Query Parameters:**
- `limit` (optional): Number of messages (default: 50, max: 200)
- `offset` (optional): Pagination offset (default: 0)

**Response:**
```json
{
  "success": true,
  "messages": [
    {
      "id": "msg123",
      "text": "What is 2+2?",
      "isUser": true,
      "timestamp": "2024-01-15T10:00:00Z"
    },
    {
      "id": "msg124",
      "text": "2+2 equals 4.",
      "isUser": false,
      "timestamp": "2024-01-15T10:00:01Z"
    }
  ],
  "total": 15,
  "hasMore": false
}
```

#### `DELETE /chat/sessions/{id}`
Delete chat session.

**Response:**
```json
{
  "success": true,
  "message": "Chat session deleted successfully"
}
```

#### `GET /chat/export/{id}`
Export chat conversation.

**Query Parameters:**
- `format` (optional): `json`, `txt`, `pdf` (default: `json`)

**Response:**
```json
{
  "success": true,
  "export": {
    "url": "https://.../export.pdf",
    "expiresAt": "2024-01-16T12:00:00Z"
  }
}
```

---

## 📝 4. Notes Management

### ✅ Currently Implemented

#### `GET /notes?userId={userId}&category={category}`
Get notes with optional filtering.

**Query Parameters:**
- `userId` (required): User ID
- `category` (optional): Filter by category

**Response:**
```json
{
  "success": true,
  "notes": [
    {
      "id": "note123",
      "title": "Math Notes",
      "content": "Content here...",
      "category": "Mathematics",
      "tags": "algebra,geometry",
      "userId": "user123",
      "createdAt": "2024-01-15T10:00:00Z",
      "updatedAt": "2024-01-15T11:00:00Z",
      "metadata": null
    }
  ]
}
```

#### `POST /notes`
Create note.

**Request Body:**
```json
{
  "title": "New Note",
  "content": "Note content...",
  "category": "Science",
  "tags": "biology,chemistry",
  "metadata": null
}
```

**Response:**
```json
{
  "success": true,
  "note": {
    "id": "note456",
    "title": "New Note",
    "content": "Note content...",
    "category": "Science",
    "tags": "biology,chemistry",
    "userId": "user123",
    "createdAt": "2024-01-15T12:00:00Z",
    "updatedAt": "2024-01-15T12:00:00Z",
    "metadata": null
  }
}
```

#### `PUT /notes`
Update note (body includes id).

**Request Body:**
```json
{
  "id": "note123",
  "title": "Updated Note",
  "content": "Updated content...",
  "category": "Science",
  "tags": "biology,chemistry,physics",
  "metadata": null
}
```

**Response:**
```json
{
  "success": true,
  "note": { ... }
}
```

#### `DELETE /notes?id={noteId}`
Delete note.

**Query Parameters:**
- `id` (required): Note ID

**Response:**
```json
{
  "success": true,
  "message": "Note deleted successfully"
}
```

### ⚠️ Missing for Full Sync Support

#### `GET /notes?lastSync={isoTimestamp}&limit={n}&offset={n}`
Get notes with sync support.

**Query Parameters:**
- `lastSync` (optional): ISO timestamp of last sync
- `limit` (optional): Number of records (default: 100, max: 500)
- `offset` (optional): Pagination offset (default: 0)

**Response:**
```json
{
  "success": true,
  "notes": [ ... ],
  "total": 25,
  "hasMore": false,
  "lastSync": "2024-01-15T14:00:00Z"
}
```

#### `PUT /notes/{id}`
Update note by ID (RESTful).

**Request Body:**
```json
{
  "title": "Updated Note",
  "content": "Updated content...",
  "category": "Science",
  "tags": "biology,chemistry,physics",
  "metadata": null
}
```

**Response:**
```json
{
  "success": true,
  "note": { ... }
}
```

**Current Issue:** Update endpoint uses `PUT /notes` with id in body instead of `PUT /notes/{id}` (RESTful).

---

## 📚 5. Flashcards Management

### ✅ Currently Implemented

#### `GET /flashcards?userId={userId}&category={category}&reviewOnly={boolean}`
Get flashcards with optional filtering.

**Query Parameters:**
- `userId` (required): User ID
- `category` (optional): Filter by category
- `reviewOnly` (optional): Only return cards due for review

**Response:**
```json
{
  "success": true,
  "flashcards": [
    {
      "id": "card123",
      "question": "What is 2+2?",
      "answer": "4",
      "category": "Mathematics",
      "difficulty": "easy",
      "masteryLevel": 5,
      "userId": "user123",
      "createdAt": "2024-01-15T10:00:00Z",
      "updatedAt": "2024-01-15T11:00:00Z",
      "lastReviewed": "2024-01-15T11:00:00Z",
      "metadata": null
    }
  ]
}
```

#### `POST /flashcards`
Create flashcard.

**Request Body:**
```json
{
  "question": "What is photosynthesis?",
  "answer": "Process by which plants make food",
  "category": "Biology",
  "difficulty": "medium",
  "masteryLevel": 0,
  "metadata": null
}
```

**Response:**
```json
{
  "success": true,
  "flashcard": {
    "id": "card456",
    "question": "What is photosynthesis?",
    "answer": "Process by which plants make food",
    "category": "Biology",
    "difficulty": "medium",
    "masteryLevel": 0,
    "userId": "user123",
    "createdAt": "2024-01-15T12:00:00Z",
    "updatedAt": "2024-01-15T12:00:00Z",
    "lastReviewed": null,
    "metadata": null
  }
}
```

#### `PUT /flashcards`
Update flashcard (body includes id).

**Request Body:**
```json
{
  "id": "card123",
  "question": "What is photosynthesis?",
  "answer": "Process by which plants convert light energy into chemical energy",
  "category": "Biology",
  "difficulty": "medium",
  "masteryLevel": 3,
  "lastReviewed": "2024-01-15T13:00:00Z",
  "metadata": null
}
```

**Response:**
```json
{
  "success": true,
  "flashcard": { ... }
}
```

#### `DELETE /flashcards?id={flashcardId}`
Delete flashcard.

**Query Parameters:**
- `id` (required): Flashcard ID

**Response:**
```json
{
  "success": true,
  "message": "Flashcard deleted successfully"
}
```

### ⚠️ Missing for Full Sync Support

#### `GET /flashcards?lastSync={isoTimestamp}&limit={n}&offset={n}`
Get flashcards with sync support.

**Query Parameters:**
- `lastSync` (optional): ISO timestamp of last sync
- `limit` (optional): Number of records (default: 100, max: 500)
- `offset` (optional): Pagination offset (default: 0)

**Response:**
```json
{
  "success": true,
  "flashcards": [ ... ],
  "total": 50,
  "hasMore": false,
  "lastSync": "2024-01-15T14:00:00Z"
}
```

#### `PUT /flashcards/{id}`
Update flashcard by ID (RESTful).

**Request Body:**
```json
{
  "question": "What is photosynthesis?",
  "answer": "Process by which plants convert light energy into chemical energy",
  "category": "Biology",
  "difficulty": "medium",
  "masteryLevel": 3,
  "lastReviewed": "2024-01-15T13:00:00Z",
  "metadata": null
}
```

**Response:**
```json
{
  "success": true,
  "flashcard": { ... }
}
```

**Current Issue:** Update endpoint uses `PUT /flashcards` with id in body instead of `PUT /flashcards/{id}` (RESTful).

---

## 📋 6. Exam Sessions

### ✅ Currently Implemented

#### `POST /exam/generate`
Generate exam questions.

**Request Body:**
```json
{
  "subject": "Mathematics",
  "topic": "Algebra",
  "difficulty": "medium",
  "numberOfQuestions": 10,
  "timeLimit": 1800
}
```

**Response:**
```json
{
  "success": true,
  "exam": {
    "id": "exam123",
    "questions": [ ... ],
    "timeLimit": 1800
  }
}
```

#### `POST /exam`
Submit exam answers.

**Request Body:**
```json
{
  "examId": "exam123",
  "answers": [
    {
      "questionId": "q1",
      "answer": "A"
    }
  ],
  "timeSpent": 1500
}
```

**Response:**
```json
{
  "success": true,
  "result": {
    "score": 85.5,
    "totalQuestions": 10,
    "correctAnswers": 8,
    "timeSpent": 1500
  }
}
```

### ⚠️ Missing for Full Sync Support

#### `GET /exam-sessions?userId={userId}`
Get exam sessions.

**Query Parameters:**
- `userId` (required): User ID
- `status` (optional): Filter by status (`not_started`, `in_progress`, `completed`)
- `limit` (optional): Number of records (default: 50, max: 200)
- `offset` (optional): Pagination offset (default: 0)

**Response:**
```json
{
  "success": true,
  "examSessions": [
    {
      "id": "exam123",
      "title": "Math Quiz 1",
      "questions": "[{...}]",
      "userAnswers": "[{...}]",
      "score": 85.5,
      "totalQuestions": 10,
      "timeSpent": 1800,
      "status": "completed",
      "userId": "user123",
      "createdAt": "2024-01-15T10:00:00Z",
      "updatedAt": "2024-01-15T10:30:00Z",
      "completedAt": "2024-01-15T10:30:00Z",
      "metadata": null
    }
  ],
  "total": 10,
  "hasMore": false
}
```

#### `POST /exam-sessions`
Create/save exam session.

**Request Body:**
```json
{
  "title": "Science Test",
  "questions": "[{...}]",
  "userAnswers": null,
  "score": null,
  "totalQuestions": 10,
  "timeSpent": 0,
  "status": "not_started",
  "metadata": null
}
```

**Response:**
```json
{
  "success": true,
  "examSession": { ... }
}
```

#### `PUT /exam-sessions/{id}`
Update exam session.

**Request Body:**
```json
{
  "title": "Science Test",
  "questions": "[{...}]",
  "userAnswers": "[{...}]",
  "score": 90.0,
  "totalQuestions": 10,
  "timeSpent": 1500,
  "status": "completed",
  "completedAt": "2024-01-15T12:25:00Z",
  "metadata": null
}
```

**Response:**
```json
{
  "success": true,
  "examSession": { ... }
}
```

#### `DELETE /exam-sessions/{id}`
Delete exam session.

**Response:**
```json
{
  "success": true,
  "message": "Exam session deleted successfully"
}
```

#### `GET /exam-sessions?lastSync={isoTimestamp}`
Get with sync support.

**Query Parameters:**
- `lastSync` (optional): ISO timestamp of last sync
- `limit` (optional): Number of records (default: 50, max: 200)
- `offset` (optional): Pagination offset (default: 0)

**Response:**
```json
{
  "success": true,
  "examSessions": [ ... ],
  "total": 10,
  "hasMore": false,
  "lastSync": "2024-01-15T14:00:00Z"
}
```

**Note:** Sync service currently uses `/exam-sessions` but API service uses `/exam`. Need to align these.

---

## 🎯 7. Focus Sessions (Pomodoro)

### ✅ Currently Implemented

#### `GET /focus?userId={userId}`
Get focus sessions.

**Query Parameters:**
- `userId` (required): User ID
- `status` (optional): Filter by status (`active`, `completed`, `cancelled`)
- `limit` (optional): Number of records (default: 50, max: 200)
- `offset` (optional): Pagination offset (default: 0)

**Response:**
```json
{
  "success": true,
  "focusSessions": [
    {
      "id": "focus123",
      "duration": 1500,
      "mode": "pomodoro",
      "status": "completed",
      "userId": "user123",
      "createdAt": "2024-01-15T10:00:00Z",
      "updatedAt": "2024-01-15T10:25:00Z",
      "completedAt": "2024-01-15T10:25:00Z",
      "metadata": null
    }
  ]
}
```

#### `POST /focus`
Create focus session.

**Request Body:**
```json
{
  "duration": 1500,
  "mode": "pomodoro",
  "status": "active",
  "metadata": null
}
```

**Response:**
```json
{
  "success": true,
  "focusSession": {
    "id": "focus456",
    "duration": 1500,
    "mode": "pomodoro",
    "status": "active",
    "userId": "user123",
    "createdAt": "2024-01-15T12:00:00Z",
    "updatedAt": "2024-01-15T12:00:00Z",
    "completedAt": null,
    "metadata": null
  }
}
```

### ⚠️ Missing for Full Sync Support

#### `PUT /focus-sessions/{id}`
Update focus session.

**Request Body:**
```json
{
  "duration": 1500,
  "mode": "pomodoro",
  "status": "completed",
  "completedAt": "2024-01-15T12:25:00Z",
  "metadata": null
}
```

**Response:**
```json
{
  "success": true,
  "focusSession": { ... }
}
```

#### `DELETE /focus-sessions/{id}`
Delete focus session.

**Response:**
```json
{
  "success": true,
  "message": "Focus session deleted successfully"
}
```

#### `GET /focus-sessions?lastSync={isoTimestamp}`
Get with sync support.

**Query Parameters:**
- `lastSync` (optional): ISO timestamp of last sync
- `limit` (optional): Number of records (default: 50, max: 200)
- `offset` (optional): Pagination offset (default: 0)

**Response:**
```json
{
  "success": true,
  "focusSessions": [ ... ],
  "total": 20,
  "hasMore": false,
  "lastSync": "2024-01-15T14:00:00Z"
}
```

**Note:** Sync service uses `/focus-sessions` but API service uses `/focus`. Need to align these.

---

## 📊 8. Progress & Analytics

### ✅ Currently Implemented

#### `GET /profile?period={period}&analytics=true`
Get usage statistics (via profile).

**Query Parameters:**
- `period` (optional): `7d`, `30d`, `90d`, `1y` (default: `30d`)
- `analytics` (required): `true`

**Response:**
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
    "dailyUsage": { ... },
    "subjectBreakdown": { ... },
    "sessionCount": 45
  }
}
```

#### `GET /analytics/insights?period={period}`
Get advanced analytics.

**Query Parameters:**
- `period` (optional): `7d`, `30d`, `90d`, `1y` (default: `30d`)

**Response:**
```json
{
  "success": true,
  "insights": {
    "studyPatterns": { ... },
    "performanceMetrics": { ... },
    "recommendations": [ ... ]
  }
}
```

### ⚠️ Missing for Full Sync Support

#### `GET /progress?userId={userId}`
Get user progress.

**Query Parameters:**
- `userId` (required): User ID

**Response:**
```json
{
  "success": true,
  "progress": {
    "totalInteractions": 1250,
    "textMessages": 800,
    "imageUploads": 300,
    "voiceInputs": 150,
    "totalTimeSpent": "45h 30m",
    "averageSessionTime": "25m 15s",
    "streakDays": 7,
    "lastActiveDate": "2024-01-15T14:00:00Z",
    "dailyUsage": { ... },
    "subjectBreakdown": { ... },
    "sessionCount": 45,
    "notesCount": 25,
    "flashcardsCount": 50,
    "examSessionsCount": 10,
    "focusSessionsCount": 20
  }
}
```

#### `PUT /progress`
Update user progress (merge with existing stats).

**Request Body:**
```json
{
  "totalInteractions": 1250,
  "textMessages": 800,
  "imageUploads": 300,
  "voiceInputs": 150,
  "totalTimeSpent": "45h 30m",
  "averageSessionTime": "25m 15s",
  "streakDays": 7,
  "lastActiveDate": "2024-01-15T14:00:00Z",
  "dailyUsage": {
    "2024-01-15": 120
  },
  "subjectBreakdown": {
    "Mathematics": 450
  },
  "sessionCount": 45
}
```

**Response:**
```json
{
  "success": true,
  "message": "Progress updated successfully",
  "progress": { ... }
}
```

#### `GET /usage?period={period}`
Get usage stats (dedicated endpoint).

**Query Parameters:**
- `period` (optional): `7d`, `30d`, `90d`, `1y` (default: `30d`)

**Response:**
```json
{
  "success": true,
  "usage": {
    "totalInteractions": 1250,
    "textMessages": 800,
    "imageUploads": 300,
    "voiceInputs": 150,
    "totalTimeSpent": "45h 30m",
    "averageSessionTime": "25m 15s",
    "streakDays": 7,
    "lastActiveDate": "2024-01-15T14:00:00Z",
    "dailyUsage": { ... },
    "subjectBreakdown": { ... }
  }
}
```

---

## 🏆 9. Achievements & Badges

### ✅ Currently Implemented

#### `GET /achievements?userId={userId}`
Get achievements.

**Query Parameters:**
- `userId` (required): User ID

**Response:**
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

### ⚠️ Missing (May be needed)

#### `GET /badges?userId={userId}`
Get badges.

**Query Parameters:**
- `userId` (required): User ID

**Response:**
```json
{
  "success": true,
  "badges": [
    {
      "id": "badge123",
      "userId": "user123",
      "badgeId": "badge001",
      "badge": {
        "id": "badge001",
        "name": "Scholar",
        "description": "Completed 10 study sessions",
        "image": "https://...",
        "icon": "🎓",
        "rarity": "common",
        "category": "study"
      },
      "earnedAt": "2024-01-12T14:00:00Z"
    }
  ]
}
```

#### `POST /achievements/unlock`
Unlock achievement (if manual).

**Request Body:**
```json
{
  "achievementId": "ach001"
}
```

**Response:**
```json
{
  "success": true,
  "achievement": { ... }
}
```

---

## 🔔 10. Notifications

### ✅ Currently Implemented

#### `GET /notifications?type={type}&read={boolean}`
Get notifications.

**Query Parameters:**
- `type` (optional): Filter by type (`achievement`, `reminder`, `update`, `system`, `exam`, `subscription`)
- `read` (optional): Filter by read status (`true`/`false`)
- `limit` (optional): Number of records (default: 50, max: 200)
- `offset` (optional): Pagination offset (default: 0)

**Response:**
```json
{
  "success": true,
  "notifications": [
    {
      "id": "notif123",
      "userId": "user123",
      "type": "achievement",
      "title": "Achievement Unlocked!",
      "message": "You've earned the 'First Note' achievement",
      "icon": "🏆",
      "read": false,
      "readAt": null,
      "createdAt": "2024-01-15T10:00:00Z",
      "updatedAt": "2024-01-15T10:00:00Z",
      "metadata": "{\"achievementId\":\"ach001\"}"
    }
  ],
  "total": 15,
  "hasMore": false
}
```

#### `PUT /notifications`
Mark notification as read (body includes id).

**Request Body:**
```json
{
  "id": "notif123",
  "read": true
}
```

**Response:**
```json
{
  "success": true,
  "notification": {
    "id": "notif123",
    "read": true,
    "readAt": "2024-01-15T14:00:00Z"
  }
}
```

#### `PUT /notifications`
Mark all as read (body: `{markAll: true}`).

**Request Body:**
```json
{
  "markAll": true
}
```

**Response:**
```json
{
  "success": true,
  "message": "All notifications marked as read",
  "count": 15
}
```

#### `DELETE /notifications?id={notificationId}`
Delete notification.

**Query Parameters:**
- `id` (required): Notification ID

**Response:**
```json
{
  "success": true,
  "message": "Notification deleted successfully"
}
```

### ⚠️ Missing for Full Sync Support

#### `GET /notifications?lastSync={isoTimestamp}`
Get with sync support.

**Query Parameters:**
- `lastSync` (optional): ISO timestamp of last sync
- `limit` (optional): Number of records (default: 50, max: 200)
- `offset` (optional): Pagination offset (default: 0)

**Response:**
```json
{
  "success": true,
  "notifications": [ ... ],
  "total": 15,
  "hasMore": false,
  "lastSync": "2024-01-15T14:00:00Z"
}
```

#### `PUT /notifications/{id}`
Mark as read (RESTful).

**Request Body:**
```json
{
  "read": true
}
```

**Response:**
```json
{
  "success": true,
  "notification": {
    "id": "notif123",
    "read": true,
    "readAt": "2024-01-15T14:00:00Z"
  }
}
```

---

## 📖 11. Learning Materials

### ✅ Currently Implemented

#### `GET /learning-materials?class={level}&board={board}`
Get learning materials.

**Query Parameters:**
- `class` (optional): Class level (e.g., `1`, `2`, `3`)
- `board` (optional): Board name (e.g., `CBSE`, `ICSE`)

**Response:**
```json
{
  "success": true,
  "materials": {
    "boards": [ ... ],
    "classes": [ ... ],
    "subjects": [ ... ],
    "chapters": [ ... ],
    "videos": [ ... ],
    "pdfs": [ ... ]
  }
}
```

---

## 💳 12. Subscriptions & Payments

### ✅ Currently Implemented

#### `GET /subscriptions/current`
Get current subscription.

**Response:**
```json
{
  "success": true,
  "subscription": {
    "id": "sub123",
    "plan": "Pro",
    "status": "Active",
    "currentPeriodStart": "2024-01-01T00:00:00Z",
    "currentPeriodEnd": "2024-02-01T00:00:00Z",
    "cancelAtPeriodEnd": false
  }
}
```

#### `POST /subscriptions/create`
Create subscription.

**Request Body:**
```json
{
  "plan": "Pro",
  "paymentMethodId": "pm_123"
}
```

**Response:**
```json
{
  "success": true,
  "subscription": { ... }
}
```

#### `POST /subscriptions/cancel`
Cancel subscription.

**Request Body:**
```json
{
  "cancelAtPeriodEnd": true
}
```

**Response:**
```json
{
  "success": true,
  "message": "Subscription will be cancelled at period end",
  "subscription": { ... }
}
```

#### `GET /subscriptions/invoices`
Get invoices.

**Query Parameters:**
- `limit` (optional): Number of invoices (default: 20, max: 100)
- `offset` (optional): Pagination offset (default: 0)

**Response:**
```json
{
  "success": true,
  "invoices": [
    {
      "id": "inv123",
      "amount": 999,
      "currency": "INR",
      "status": "paid",
      "paidAt": "2024-01-01T00:00:00Z",
      "dueDate": "2024-01-01T00:00:00Z",
      "pdfUrl": "https://..."
    }
  ],
  "total": 5,
  "hasMore": false
}
```

#### `GET /payment-methods`
Get payment methods.

**Response:**
```json
{
  "success": true,
  "paymentMethods": [
    {
      "id": "pm123",
      "type": "card",
      "last4": "4242",
      "brand": "visa",
      "expiryMonth": 12,
      "expiryYear": 2025,
      "isDefault": true
    }
  ]
}
```

### ⚠️ Missing (May be needed)

#### `PUT /subscriptions/update`
Update subscription.

**Request Body:**
```json
{
  "plan": "Enterprise"
}
```

**Response:**
```json
{
  "success": true,
  "subscription": { ... }
}
```

#### `POST /payment-methods`
Add payment method.

**Request Body:**
```json
{
  "type": "card",
  "token": "payment_token"
}
```

**Response:**
```json
{
  "success": true,
  "paymentMethod": { ... }
}
```

#### `DELETE /payment-methods/{id}`
Remove payment method.

**Response:**
```json
{
  "success": true,
  "message": "Payment method removed successfully"
}
```

---

## 🖼️ 13. Media Processing

### ✅ Currently Implemented

#### `POST /upload`
Upload image file.

**Request:** `multipart/form-data`
- `file`: Image file (JPEG, PNG, WebP, max 10MB)
- `fileType`: `image` or `audio`
- `sessionId`: Optional session ID

**Response:**
```json
{
  "success": true,
  "file": {
    "url": "https://.../image.jpg",
    "size": 1024000,
    "type": "image/jpeg"
  }
}
```

#### `POST /ocr`
Process image with OCR/AI.

**Request:** `multipart/form-data`
- `image`: Image file
- `sessionId`: Optional session ID
- `conversationHistory`: JSON string
- `sessionContext`: Optional context
- `contextMetadata`: JSON string

**Response:**
```json
{
  "success": true,
  "text": "Extracted text from image...",
  "analysis": "AI analysis of image...",
  "metadata": { ... }
}
```

#### `POST /voice`
Process voice/audio with AI.

**Request:** `multipart/form-data`
- `audio`: Audio file (MP3, MP4, WAV, WebM, max 25MB)
- `sessionId`: Optional session ID
- `conversationHistory`: JSON string
- `sessionContext`: Optional context
- `contextMetadata`: JSON string

**Response:**
```json
{
  "success": true,
  "transcription": "Transcribed text...",
  "response": "AI response...",
  "metadata": { ... }
}
```

### ⚠️ Missing (May be needed)

#### `POST /tts`
Text-to-speech conversion.

**Request Body:**
```json
{
  "text": "Hello, this is a test.",
  "language": "en",
  "voice": "en-US-Standard-B"
}
```

**Response:**
```json
{
  "success": true,
  "audioUrl": "https://.../audio.mp3",
  "duration": 3.5
}
```

---

## 📱 14. Mobile-Specific Endpoints

### ⚠️ Missing (Recommended)

#### `GET /mobile/config`
Mobile app configuration.

**Response:**
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
    "sync": {
      "autoSyncInterval": 300000,
      "maxRetries": 3,
      "batchSize": 50
    }
  }
}
```

#### `POST /mobile/device/register`
Register device for push notifications.

**Request Body:**
```json
{
  "deviceId": "device_unique_id",
  "platform": "ios",
  "token": "push_notification_token",
  "deviceInfo": {
    "model": "iPhone 14 Pro",
    "osVersion": "17.0",
    "appVersion": "1.0.0"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Device registered successfully"
}
```

#### `DELETE /mobile/device/{deviceId}`
Unregister device.

**Response:**
```json
{
  "success": true,
  "message": "Device unregistered successfully"
}
```

#### `GET /mobile/sync/status`
Get sync status summary.

**Response:**
```json
{
  "success": true,
  "status": {
    "lastSyncTime": "2024-01-15T14:00:00Z",
    "isOnline": true,
    "pendingCounts": {
      "notes": 5,
      "flashcards": 2,
      "examSessions": 0,
      "focusSessions": 1
    },
    "syncInProgress": false,
    "lastError": null
  }
}
```

#### `POST /mobile/sync/force`
Force full sync.

**Request Body:**
```json
{
  "types": ["notes", "flashcards", "examSessions", "focusSessions"]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Sync initiated",
  "syncId": "sync_123"
}
```

---

## 🔄 Sync-Specific Requirements

### Critical for Data Sync

All syncable endpoints should support:

#### 1. **Last Sync Parameter**

- `?lastSync={ISO8601_timestamp}` - Only return items modified after this time

**Example:**
```
GET /api/mobile/notes?lastSync=2024-01-15T10:00:00Z
```

#### 2. **Pagination**

- `?limit={number}` - Max items per request (default: 100, max: 500)
- `?offset={number}` - Pagination offset

**Example:**
```
GET /api/mobile/notes?limit=50&offset=0
```

#### 3. **Consistent Response Format**

```json
{
  "success": true,
  "data": [...],
  "total": 100,
  "hasMore": true,
  "lastSync": "2024-01-15T14:00:00Z"
}
```

#### 4. **Timestamp Fields**

All syncable items must have:
- `createdAt` - ISO 8601 timestamp
- `updatedAt` - ISO 8601 timestamp

**Example:**
```json
{
  "id": "item123",
  "createdAt": "2024-01-15T10:00:00Z",
  "updatedAt": "2024-01-15T11:00:00Z",
  ...
}
```

---

## 🚨 Priority Levels

### 🔴 **Critical (App Won't Work Without These)**

1. ✅ Authentication endpoints (login, signup, verify)
2. ✅ Chat endpoint
3. ✅ Notes CRUD
4. ✅ Flashcards CRUD
5. ✅ Profile endpoints

### 🟡 **High Priority (Core Features)**

1. ⚠️ Exam session sync endpoints
2. ⚠️ Focus session sync endpoints
3. ⚠️ Progress sync endpoints
4. ⚠️ Settings sync endpoints
5. ✅ Notifications endpoints

### 🟢 **Medium Priority (Enhanced Features)**

1. ⚠️ Chat session management
2. ✅ Advanced analytics
3. ✅ Achievements/badges
4. ✅ Learning materials
5. ✅ Subscription management

### ⚪ **Low Priority (Nice to Have)**

1. ⚠️ Password reset flow
2. ✅ Email verification
3. ✅ 2FA
4. ✅ Login history
5. ⚠️ Device registration

---

## 📝 Implementation Notes

### Current API Issues to Fix

#### 1. **Notes & Flashcards Update**

**Current:**
- `PUT /notes` with id in body
- `PUT /flashcards` with id in body

**Should be:**
- `PUT /notes/{id}` (RESTful)
- `PUT /flashcards/{id}` (RESTful)

**Action Required:**
- Update backend to accept ID in URL path
- Update mobile app to use RESTful endpoints
- Maintain backward compatibility during transition

#### 2. **Exam Sessions**

**Current:**
- API service uses: `/exam` and `/exam/generate`
- Sync service expects: `/exam-sessions`

**Action Required:**
- Create `/exam-sessions` endpoints
- Align sync service with API service
- Or update sync service to use `/exam` endpoints

#### 3. **Focus Sessions**

**Current:**
- API service uses: `/focus`
- Sync service expects: `/focus-sessions`

**Action Required:**
- Create `/focus-sessions` endpoints
- Align sync service with API service
- Or update sync service to use `/focus` endpoints

#### 4. **Settings**

**Current:**
- No dedicated endpoint in API service
- Settings are part of `/profile`
- Sync service expects: `/settings`

**Action Required:**
- Create dedicated `/settings` endpoints (GET, PUT)
- Extract settings from profile endpoint
- Update mobile app to use new endpoints

#### 5. **Progress**

**Current:**
- Progress available via `/profile?analytics=true`
- Sync service may need dedicated `/progress` endpoint

**Action Required:**
- Create dedicated `/progress` endpoints (GET, PUT)
- Keep `/profile?analytics=true` for backward compatibility
- Update sync service to use new endpoints

#### 6. **Notifications Update**

**Current:**
- `PUT /notifications` with id in body

**Should be:**
- `PUT /notifications/{id}` (RESTful)

**Action Required:**
- Update backend to accept ID in URL path
- Update mobile app to use RESTful endpoint

---

## ✅ Testing Checklist

For each endpoint, verify:

### Authentication
- [ ] Authentication required (except auth endpoints)
- [ ] JWT token validation
- [ ] Token expiration handling
- [ ] Invalid token error (401)

### HTTP Methods
- [ ] Correct HTTP method (GET/POST/PUT/DELETE)
- [ ] Method not allowed error (405)

### Request Format
- [ ] Request body format matches documentation
- [ ] Required fields validation
- [ ] Field type validation
- [ ] Invalid request error (400)

### Response Format
- [ ] Response format matches expected structure
- [ ] Success response (200/201)
- [ ] Error response format
- [ ] Consistent error codes

### Error Handling
- [ ] 400 Bad Request (validation errors)
- [ ] 401 Unauthorized (authentication required)
- [ ] 403 Forbidden (insufficient permissions)
- [ ] 404 Not Found (resource not found)
- [ ] 500 Internal Server Error (server errors)
- [ ] Error message clarity

### Pagination (if applicable)
- [ ] `limit` parameter works
- [ ] `offset` parameter works
- [ ] `hasMore` flag correct
- [ ] `total` count accurate
- [ ] Max limit enforced

### Last Sync (for syncable endpoints)
- [ ] `lastSync` parameter works
- [ ] Only returns items after timestamp
- [ ] Handles invalid timestamp format
- [ ] Returns `lastSync` in response

### Timestamp Fields
- [ ] `createdAt` present (ISO 8601)
- [ ] `updatedAt` present (ISO 8601)
- [ ] Timestamps update correctly
- [ ] Timezone handling (UTC)

### Data Integrity
- [ ] Created items have all required fields
- [ ] Updated items preserve unchanged fields
- [ ] Deleted items removed correctly
- [ ] Foreign key constraints respected

### Performance
- [ ] Response time acceptable (< 2s)
- [ ] Large datasets handled efficiently
- [ ] Database queries optimized
- [ ] No N+1 query problems

---

## 📚 Reference Documents

- **`MOBILE_SYNC_DOCUMENTATION.md`** - Detailed sync API specifications
- **`services/api.js`** - Current API service implementation (mobile app)
- **`services/syncService.js`** - Sync service implementation (mobile app)
- **`SYNC_IMPLEMENTATION_GUIDE.md`** - Implementation guide (if exists)

---

## 📊 Summary Statistics

- **Total Endpoints Required:** ~50+ endpoints
- **Currently Implemented:** ~30 endpoints
- **Missing Endpoints:** ~20 endpoints
- **Critical Endpoints:** ~15 endpoints
- **Sync-Specific Endpoints:** ~10 endpoints
- **Priority Fixes Needed:** 6 issues

---

## 🔄 Version History

- **v1.0.0** (January 2024) - Initial documentation
  - Complete endpoint listing
  - Implementation status tracking
  - Priority classification
  - Testing checklist

---

**Last Updated:** January 2024  
**Document Version:** 1.0.0  
**Maintained By:** Backend & Mobile Teams


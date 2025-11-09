# Mobile App Sync Documentation

**PAATA.AI Website ↔ Mobile App Data Synchronization**

This document provides comprehensive information about syncing data between the PAATA.AI website and mobile app.

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Backend API Endpoints](#backend-api-endpoints)
3. [Database Schema Updates](#database-schema-updates)
4. [Data Models & Sync Requirements](#data-models--sync-requirements)
5. [Sync Strategy](#sync-strategy)
6. [Implementation Guide](#implementation-guide)
7. [Testing Procedures](#testing-procedures)
8. [Error Handling](#error-handling)
9. [Monitoring & Debugging](#monitoring--debugging)

---

## 🎯 Overview

### Purpose

Enable seamless data synchronization between the PAATA.AI website (`https://www.paataai.com`) and mobile app, allowing users to:

- ✅ Access their notes, flashcards, and progress on both platforms
- ✅ Work offline on mobile and sync when online
- ✅ Maintain data consistency across devices
- ✅ Resolve conflicts intelligently

### Sync Scope

**Data to Sync:**
- ✅ Notes
- ✅ Flashcards
- ✅ Exam Sessions
- ✅ Focus Sessions
- ✅ Progress/Stats
- ✅ User Settings
- ✅ Achievements & Badges
- ✅ Notifications

**Data NOT to Sync:**
- ❌ Chat Sessions (handled separately)
- ❌ Learning Content (videos, PDFs - read-only)
- ❌ Payment/Subscription data (website-only)

---

## 🔌 Backend API Endpoints

### Base URL

```
https://www.paataai.com/api/mobile
```

### Authentication

All endpoints require JWT authentication via `Authorization` header:

```
Authorization: Bearer <jwt_token>
```

---

### 1. Notes Sync Endpoints

#### GET `/api/mobile/notes`

Get all user notes with optional filtering.

**Query Parameters:**
- `lastSync` (optional): ISO timestamp of last sync
- `limit` (optional): Number of records (default: 100, max: 500)
- `offset` (optional): Pagination offset (default: 0)

**Response:**
```json
{
  "success": true,
  "notes": [
    {
      "id": "clx123...",
      "title": "Math Notes",
      "content": "Content here...",
      "category": "Mathematics",
      "tags": "algebra,geometry",
      "userId": "user123",
      "createdAt": "2024-01-15T10:00:00Z",
      "updatedAt": "2024-01-15T11:00:00Z",
      "metadata": null
    }
  ],
  "total": 25,
  "hasMore": false
}
```

#### POST `/api/mobile/notes`

Create a new note.

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
    "id": "clx456...",
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

#### PUT `/api/mobile/notes/:id`

Update an existing note.

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
  "note": {
    "id": "clx456...",
    "title": "Updated Note",
    "content": "Updated content...",
    "category": "Science",
    "tags": "biology,chemistry,physics",
    "userId": "user123",
    "createdAt": "2024-01-15T12:00:00Z",
    "updatedAt": "2024-01-15T13:00:00Z",
    "metadata": null
  }
}
```

#### DELETE `/api/mobile/notes/:id`

Delete a note.

**Response:**
```json
{
  "success": true,
  "message": "Note deleted successfully"
}
```

---

### 2. Flashcards Sync Endpoints

#### GET `/api/mobile/flashcards`

Get all user flashcards.

**Query Parameters:**
- `lastSync` (optional): ISO timestamp of last sync
- `category` (optional): Filter by category
- `limit` (optional): Number of records (default: 100, max: 500)
- `offset` (optional): Pagination offset (default: 0)

**Response:**
```json
{
  "success": true,
  "flashcards": [
    {
      "id": "clx789...",
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
  ],
  "total": 50,
  "hasMore": false
}
```

#### POST `/api/mobile/flashcards`

Create a new flashcard.

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
    "id": "clxabc...",
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

#### PUT `/api/mobile/flashcards/:id`

Update an existing flashcard.

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
  "flashcard": {
    "id": "clxabc...",
    "question": "What is photosynthesis?",
    "answer": "Process by which plants convert light energy into chemical energy",
    "category": "Biology",
    "difficulty": "medium",
    "masteryLevel": 3,
    "userId": "user123",
    "createdAt": "2024-01-15T12:00:00Z",
    "updatedAt": "2024-01-15T13:00:00Z",
    "lastReviewed": "2024-01-15T13:00:00Z",
    "metadata": null
  }
}
```

#### DELETE `/api/mobile/flashcards/:id`

Delete a flashcard.

**Response:**
```json
{
  "success": true,
  "message": "Flashcard deleted successfully"
}
```

---

### 3. Progress Sync Endpoints

#### GET `/api/mobile/progress`

Get user progress and statistics.

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
    "dailyUsage": {
      "2024-01-15": 120,
      "2024-01-14": 95,
      "2024-01-13": 110
    },
    "subjectBreakdown": {
      "Mathematics": 450,
      "Science": 380,
      "English": 320,
      "History": 100
    },
    "sessionCount": 45,
    "notesCount": 25,
    "flashcardsCount": 50,
    "examSessionsCount": 10,
    "focusSessionsCount": 20
  }
}
```

#### POST `/api/mobile/progress`

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
  "progress": {
    // Merged progress object
  }
}
```

---

### 4. Settings Sync Endpoints

#### GET `/api/mobile/settings`

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

#### PUT `/api/mobile/settings`

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
  "settings": {
    // Updated settings object
  }
}
```

---

### 5. Exam Sessions Sync Endpoints

#### GET `/api/mobile/exam-sessions`

Get all user exam sessions.

**Query Parameters:**
- `lastSync` (optional): ISO timestamp of last sync
- `status` (optional): Filter by status (not_started, in_progress, completed)
- `limit` (optional): Number of records (default: 50, max: 200)
- `offset` (optional): Pagination offset (default: 0)

**Response:**
```json
{
  "success": true,
  "examSessions": [
    {
      "id": "clxdef...",
      "title": "Math Quiz 1",
      "questions": "[{\"question\":\"...\",\"options\":[...]}]",
      "userAnswers": "[{\"questionId\":\"...\",\"answer\":\"...\"}]",
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

#### POST `/api/mobile/exam-sessions`

Create a new exam session.

**Request Body:**
```json
{
  "title": "Science Test",
  "questions": "[{\"question\":\"...\",\"options\":[...]}]",
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
  "examSession": {
    "id": "clxghi...",
    "title": "Science Test",
    "questions": "[{\"question\":\"...\",\"options\":[...]}]",
    "userAnswers": null,
    "score": null,
    "totalQuestions": 10,
    "timeSpent": 0,
    "status": "not_started",
    "userId": "user123",
    "createdAt": "2024-01-15T12:00:00Z",
    "updatedAt": "2024-01-15T12:00:00Z",
    "completedAt": null,
    "metadata": null
  }
}
```

#### PUT `/api/mobile/exam-sessions/:id`

Update an exam session.

**Request Body:**
```json
{
  "title": "Science Test",
  "questions": "[{\"question\":\"...\",\"options\":[...]}]",
  "userAnswers": "[{\"questionId\":\"...\",\"answer\":\"...\"}]",
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
  "examSession": {
    // Updated exam session object
  }
}
```

#### DELETE `/api/mobile/exam-sessions/:id`

Delete an exam session.

**Response:**
```json
{
  "success": true,
  "message": "Exam session deleted successfully"
}
```

---

### 6. Focus Sessions Sync Endpoints

#### GET `/api/mobile/focus-sessions`

Get all user focus sessions.

**Query Parameters:**
- `lastSync` (optional): ISO timestamp of last sync
- `status` (optional): Filter by status (active, completed, cancelled)
- `limit` (optional): Number of records (default: 50, max: 200)
- `offset` (optional): Pagination offset (default: 0)

**Response:**
```json
{
  "success": true,
  "focusSessions": [
    {
      "id": "clxjkl...",
      "duration": 1500,
      "mode": "pomodoro",
      "status": "completed",
      "userId": "user123",
      "createdAt": "2024-01-15T10:00:00Z",
      "updatedAt": "2024-01-15T10:25:00Z",
      "completedAt": "2024-01-15T10:25:00Z",
      "metadata": null
    }
  ],
  "total": 20,
  "hasMore": false
}
```

#### POST `/api/mobile/focus-sessions`

Create a new focus session.

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
    "id": "clxmno...",
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

#### PUT `/api/mobile/focus-sessions/:id`

Update a focus session.

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
  "focusSession": {
    // Updated focus session object
  }
}
```

#### DELETE `/api/mobile/focus-sessions/:id`

Delete a focus session.

**Response:**
```json
{
  "success": true,
  "message": "Focus session deleted successfully"
}
```

---

### 7. Achievements & Badges Sync Endpoints

#### GET `/api/mobile/achievements`

Get user achievements and badges.

**Response:**
```json
{
  "success": true,
  "achievements": [
    {
      "id": "clxpqr...",
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
  ],
  "badges": [
    {
      "id": "clxstu...",
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

---

### 8. Notifications Sync Endpoints

#### GET `/api/mobile/notifications`

Get user notifications.

**Query Parameters:**
- `lastSync` (optional): ISO timestamp of last sync
- `read` (optional): Filter by read status (true/false)
- `limit` (optional): Number of records (default: 50, max: 200)
- `offset` (optional): Pagination offset (default: 0)

**Response:**
```json
{
  "success": true,
  "notifications": [
    {
      "id": "clxvwx...",
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

#### PUT `/api/mobile/notifications/:id/read`

Mark a notification as read.

**Response:**
```json
{
  "success": true,
  "message": "Notification marked as read",
  "notification": {
    "id": "clxvwx...",
    "read": true,
    "readAt": "2024-01-15T14:00:00Z"
  }
}
```

---

## 🗄️ Database Schema Updates

### Sync Tracking Columns

Add the following columns to each syncable table:

#### Notes Table

```sql
ALTER TABLE notes ADD COLUMN IF NOT EXISTS server_id TEXT;
ALTER TABLE notes ADD COLUMN IF NOT EXISTS sync_status TEXT DEFAULT 'pending';
ALTER TABLE notes ADD COLUMN IF NOT EXISTS synced_at TIMESTAMP;
ALTER TABLE notes ADD COLUMN IF NOT EXISTS local_id TEXT; -- Mobile app local ID
```

**Sync Status Values:**
- `pending` - Needs to be synced
- `syncing` - Currently syncing
- `synced` - Successfully synced
- `conflict` - Has conflicts
- `error` - Sync failed

#### Flashcards Table

```sql
ALTER TABLE flashcards ADD COLUMN IF NOT EXISTS server_id TEXT;
ALTER TABLE flashcards ADD COLUMN IF NOT EXISTS sync_status TEXT DEFAULT 'pending';
ALTER TABLE flashcards ADD COLUMN IF NOT EXISTS synced_at TIMESTAMP;
ALTER TABLE flashcards ADD COLUMN IF NOT EXISTS local_id TEXT;
```

#### Exam Sessions Table

```sql
ALTER TABLE exam_sessions ADD COLUMN IF NOT EXISTS server_id TEXT;
ALTER TABLE exam_sessions ADD COLUMN IF NOT EXISTS sync_status TEXT DEFAULT 'pending';
ALTER TABLE exam_sessions ADD COLUMN IF NOT EXISTS synced_at TIMESTAMP;
ALTER TABLE exam_sessions ADD COLUMN IF NOT EXISTS local_id TEXT;
```

#### Focus Sessions Table

```sql
ALTER TABLE focus_sessions ADD COLUMN IF NOT EXISTS server_id TEXT;
ALTER TABLE focus_sessions ADD COLUMN IF NOT EXISTS sync_status TEXT DEFAULT 'pending';
ALTER TABLE focus_sessions ADD COLUMN IF NOT EXISTS synced_at TIMESTAMP;
ALTER TABLE focus_sessions ADD COLUMN IF NOT EXISTS local_id TEXT;
```

### Prisma Schema Updates

Update `prisma/schema.prisma`:

```prisma
model Note {
  // ... existing fields ...
  
  // Sync tracking fields
  serverId    String?   @map("server_id")
  syncStatus  String?   @default("pending") @map("sync_status")
  syncedAt    DateTime? @map("synced_at")
  localId     String?   @map("local_id")
  
  @@index([syncStatus])
  @@index([serverId])
  @@map("notes")
}

model Flashcard {
  // ... existing fields ...
  
  // Sync tracking fields
  serverId    String?   @map("server_id")
  syncStatus  String?   @default("pending") @map("sync_status")
  syncedAt    DateTime? @map("synced_at")
  localId     String?   @map("local_id")
  
  @@index([syncStatus])
  @@index([serverId])
  @@map("flashcards")
}

model ExamSession {
  // ... existing fields ...
  
  // Sync tracking fields
  serverId    String?   @map("server_id")
  syncStatus  String?   @default("pending") @map("sync_status")
  syncedAt    DateTime? @map("synced_at")
  localId     String?   @map("local_id")
  
  @@index([syncStatus])
  @@index([serverId])
  @@map("exam_sessions")
}

model FocusSession {
  // ... existing fields ...
  
  // Sync tracking fields
  serverId    String?   @map("server_id")
  syncStatus  String?   @default("pending") @map("sync_status")
  syncedAt    DateTime? @map("synced_at")
  localId     String?   @map("local_id")
  
  @@index([syncStatus])
  @@index([serverId])
  @@map("focus_sessions")
}
```

After updating the schema, run:

```bash
npx prisma db push
npx prisma generate
```

---

## 📊 Data Models & Sync Requirements

### Notes

**Fields to Sync:**
- `id` (server ID)
- `title`
- `content`
- `category`
- `tags`
- `createdAt`
- `updatedAt`
- `metadata`

**Sync Rules:**
- Create: Mobile creates with `localId`, syncs to get `serverId`
- Update: Compare `updatedAt` timestamps, last-write-wins
- Delete: Soft delete or mark for deletion

### Flashcards

**Fields to Sync:**
- `id` (server ID)
- `question`
- `answer`
- `category`
- `difficulty`
- `masteryLevel`
- `lastReviewed`
- `createdAt`
- `updatedAt`
- `metadata`

**Sync Rules:**
- Same as Notes
- `masteryLevel` and `lastReviewed` are important for spaced repetition

### Exam Sessions

**Fields to Sync:**
- `id` (server ID)
- `title`
- `questions` (JSON string)
- `userAnswers` (JSON string)
- `score`
- `totalQuestions`
- `timeSpent`
- `status`
- `createdAt`
- `updatedAt`
- `completedAt`
- `metadata`

**Sync Rules:**
- Only sync completed sessions
- Preserve question structure

### Focus Sessions

**Fields to Sync:**
- `id` (server ID)
- `duration`
- `mode`
- `status`
- `createdAt`
- `updatedAt`
- `completedAt`
- `metadata`

**Sync Rules:**
- Only sync completed sessions
- Aggregate for statistics

### Progress/Stats

**Fields to Sync:**
- All fields in `User.stats` JSON
- Merge strategy: Additive for counts, latest for dates

**Sync Rules:**
- Merge, don't replace
- Preserve highest values for streaks

### Settings

**Fields to Sync:**
- All fields in `User.preferences` JSON

**Sync Rules:**
- Last-write-wins
- Mobile app can override website settings

---

## 🔄 Sync Strategy

### Conflict Resolution

**Last-Write-Wins Strategy:**
1. Compare `updatedAt` timestamps
2. Most recent update wins
3. If timestamps are equal, server version wins

**Example:**
```javascript
if (localItem.updatedAt > serverItem.updatedAt) {
  // Use local version
  await updateServer(localItem);
} else if (serverItem.updatedAt > localItem.updatedAt) {
  // Use server version
  await updateLocal(serverItem);
} else {
  // Timestamps equal, use server version
  await updateLocal(serverItem);
}
```

### Sync Flow

1. **Pull from Server**
   - Fetch items updated since `lastSync`
   - Update local database
   - Mark as synced

2. **Push to Server**
   - Find items with `sync_status = 'pending'`
   - Send to server
   - Update `serverId` and `syncStatus`
   - Mark as synced

3. **Conflict Resolution**
   - Detect conflicts (same item updated on both)
   - Apply last-write-wins
   - Update both local and server

### Sync Triggers

- **On App Start** (if authenticated)
- **When Device Comes Online**
- **Every 5-10 Minutes** (when app is active)
- **Manual Sync** (user-triggered)
- **After Create/Update** (immediate if online, queue if offline)

---

## 🛠️ Implementation Guide

### Step 1: Update Database Schema

```bash
# Update Prisma schema
# Add sync columns to models

# Push to database
npx prisma db push

# Generate Prisma client
npx prisma generate
```

### Step 2: Create Backend API Endpoints

Create the following files in `src/app/api/mobile/`:

- `notes/route.ts` - Notes CRUD endpoints
- `flashcards/route.ts` - Flashcards CRUD endpoints
- `progress/route.ts` - Progress GET/POST endpoints
- `settings/route.ts` - Settings GET/PUT endpoints
- `exam-sessions/route.ts` - Exam sessions CRUD endpoints
- `focus-sessions/route.ts` - Focus sessions CRUD endpoints
- `achievements/route.ts` - Achievements GET endpoint
- `notifications/route.ts` - Notifications GET/PUT endpoints

### Step 3: Mobile App Integration

1. **Install Dependencies:**
   ```bash
   npm install @react-native-community/netinfo
   ```

2. **Initialize Sync Service:**
   ```javascript
   import syncService from './services/syncService';
   
   useEffect(() => {
     syncService.initialize();
     if (isAuthenticated) {
       syncService.syncAll();
     }
   }, [isAuthenticated]);
   ```

3. **Add Sync UI:**
   - Manual sync button in Settings
   - Sync status indicator
   - Last sync time display

4. **Mark Items for Sync:**
   ```javascript
   // When creating/updating
   await DatabaseService.createNote({
     ...noteData,
     sync_status: 'pending',
     server_id: null,
   });
   ```

---

## 🧪 Testing Procedures

### Test Scenarios

#### 1. Create Note Offline, Then Sync

**Steps:**
1. Disable network on mobile
2. Create a note
3. Enable network
4. Trigger sync
5. Verify note appears on website

**Expected Result:**
- Note created locally with `sync_status = 'pending'`
- After sync, note appears on website
- `sync_status` changes to `synced`

#### 2. Update Note on Both Platforms

**Steps:**
1. Create note on website
2. Sync to mobile
3. Update note on mobile
4. Update same note on website
5. Sync mobile app
6. Verify conflict resolution

**Expected Result:**
- Last update wins
- Both platforms show same version

#### 3. Delete on One Platform

**Steps:**
1. Create note on both platforms
2. Delete note on website
3. Sync mobile app
4. Verify note removed from mobile

**Expected Result:**
- Note deleted on website
- After sync, note removed from mobile

#### 4. Bulk Sync

**Steps:**
1. Create 50 notes offline
2. Go online
3. Trigger sync
4. Verify all notes synced

**Expected Result:**
- All notes synced successfully
- No duplicates
- All have `serverId`

#### 5. Network Interruption During Sync

**Steps:**
1. Start sync
2. Disable network mid-sync
3. Re-enable network
4. Verify sync resumes

**Expected Result:**
- Sync resumes from where it stopped
- No data loss
- Partial syncs handled correctly

---

## ⚠️ Error Handling

### Error Codes

| Code | Description | Action |
|------|-------------|--------|
| `AUTH_REQUIRED` | Authentication token missing/invalid | Re-authenticate |
| `NETWORK_ERROR` | Network connection failed | Retry when online |
| `SERVER_ERROR` | Server returned 5xx error | Retry with backoff |
| `VALIDATION_ERROR` | Request data invalid | Fix data and retry |
| `CONFLICT_ERROR` | Conflict detected | Resolve conflict |
| `RATE_LIMIT` | Too many requests | Wait and retry |

### Retry Strategy

```javascript
async function syncWithRetry(item, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await syncItem(item);
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await delay(Math.pow(2, i) * 1000); // Exponential backoff
    }
  }
}
```

### Error Logging

Log all sync errors with:
- Error message
- Item ID
- Sync type
- Timestamp
- User ID

---

## 📈 Monitoring & Debugging

### Sync Status Endpoint

Create `GET /api/mobile/sync-status`:

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

### Debug Logging

Enable verbose logging in development:

```javascript
if (__DEV__) {
  console.log('[Sync] Starting sync...');
  console.log('[Sync] Pending items:', pendingItems);
  console.log('[Sync] Synced items:', syncedItems);
  console.log('[Sync] Errors:', errors);
}
```

### Monitoring Metrics

Track:
- Sync success rate
- Average sync time
- Number of conflicts
- Failed syncs
- Items pending sync

---

## ✅ Implementation Checklist

### Backend

- [ ] Create Notes API endpoints (GET, POST, PUT, DELETE)
- [ ] Create Flashcards API endpoints (GET, POST, PUT, DELETE)
- [ ] Create Progress API endpoints (GET, POST)
- [ ] Create Settings API endpoints (GET, PUT)
- [ ] Create Exam Sessions API endpoints (GET, POST, PUT, DELETE)
- [ ] Create Focus Sessions API endpoints (GET, POST, PUT, DELETE)
- [ ] Create Achievements API endpoint (GET)
- [ ] Create Notifications API endpoints (GET, PUT)
- [ ] Update database schema with sync columns
- [ ] Add sync status tracking to all endpoints
- [ ] Implement conflict resolution logic
- [ ] Add error handling and logging

### Mobile App

- [ ] Install netinfo dependency
- [ ] Create sync service
- [ ] Initialize sync on app start
- [ ] Add auto-sync on network change
- [ ] Add manual sync button
- [ ] Add sync status UI
- [ ] Mark items for sync on create/update
- [ ] Implement conflict resolution
- [ ] Add error handling
- [ ] Add retry logic
- [ ] Test offline/online scenarios
- [ ] Test conflict resolution
- [ ] Test bulk sync

---

## 📞 Support

For questions or issues:

1. Check this documentation
2. Review API endpoint implementations
3. Check mobile app sync service code
4. Review error logs
5. Contact backend/mobile team leads

---

## 📝 Notes

- All timestamps should be in ISO 8601 format (UTC)
- Use pagination for large datasets
- Implement rate limiting on backend
- Cache sync status locally
- Handle app backgrounding/foregrounding
- Consider battery optimization for auto-sync

---

**Last Updated:** January 2024  
**Version:** 1.0.0


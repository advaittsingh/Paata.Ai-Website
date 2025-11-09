# 🎨 PAATA.AI Design System & Feature Documentation

**Version:** 2.0  
**Last Updated:** January 2025  
**Purpose:** Complete design system and feature specifications for mobile app implementation

---

## 📋 Table of Contents

1. [Design System](#design-system)
2. [Feature Documentation](#feature-documentation)
3. [API Reference](#api-reference)
4. [User Flows](#user-flows)
5. [Component Specifications](#component-specifications)
6. [Implementation Guidelines](#implementation-guidelines)

---

# 🎨 Design System

## Color Palette

### Primary Colors
```css
/* Dark Background/Accents */
--gray-900: #111827 (Primary action color, backgrounds, accents)
--gray-800: #1F2937 (Hover states, secondary backgrounds)
--gray-700: #374151 (Borders, dividers)

/* Text Colors */
--text-white: #FFFFFF (Text on dark backgrounds)
--text-gray-900: #111827 (Primary text on light backgrounds)
--text-gray-700: #374151 (Secondary text)
--text-gray-600: #4B5563 (Tertiary text)
--text-gray-500: #6B7280 (Muted text)

/* Background Colors */
--bg-white: #FFFFFF (Card backgrounds, main content)
--bg-gray-50: #F9FAFB (Page backgrounds)
--bg-gray-100: #F3F4F6 (Subtle backgrounds, badges)

/* Status Colors */
--success-green: #10B981 (Success messages, positive indicators)
--error-red: #EF4444 (Error messages, destructive actions)
--warning-orange: #F59E0B (Warning messages)
--info-blue: #3B82F6 (Info messages, links)
```

### Usage Guidelines
- **Primary Actions**: Use `gray-900` for buttons, active states, and primary accents
- **Text on Dark**: Always use `white` text on `gray-900` backgrounds
- **Text on Light**: Use `gray-900` for primary text, `gray-600` for secondary
- **Hover States**: Use `gray-300` for hover highlights on navigation items
- **Cards**: White background (`bg-white`) with `shadow-md` or `shadow-lg`
- **Borders**: Use `gray-200` or `gray-300` for subtle borders

## Typography

### Font Family
- **Primary**: Roboto (or system default sans-serif)
- **Fallback**: System fonts (San Francisco on iOS, Roboto on Android)

### Type Scale
```
Heading 1 (h1): 3rem (48px) - Bold - Page titles
Heading 2 (h2): 2.25rem (36px) - Bold - Section titles
Heading 3 (h3): 1.875rem (30px) - Semibold - Subsection titles
Heading 4 (h4): 1.5rem (24px) - Semibold - Card titles
Heading 5 (h5): 1.25rem (20px) - Medium - Small headings
Heading 6 (h6): 1.125rem (18px) - Medium - Labels
Body Large: 1.125rem (18px) - Regular - Lead text
Body: 1rem (16px) - Regular - Default text
Body Small: 0.875rem (14px) - Regular - Secondary text
Caption: 0.75rem (12px) - Regular - Captions, timestamps
```

### Font Weights
- **Bold**: 700 (Headings, emphasis)
- **Semibold**: 600 (Subheadings, labels)
- **Medium**: 500 (Buttons, navigation)
- **Regular**: 400 (Body text)

## Spacing System

### Base Unit: 4px
```
xs: 0.25rem (4px)
sm: 0.5rem (8px)
md: 0.75rem (12px)
base: 1rem (16px)
lg: 1.5rem (24px)
xl: 2rem (32px)
2xl: 2.5rem (40px)
3xl: 3rem (48px)
4xl: 4rem (64px)
5xl: 5rem (80px)
6xl: 6rem (96px)
7xl: 7rem (112px)
```

### Usage
- **Section Padding**: `py-28` (7rem vertical) for major sections
- **Card Padding**: `p-6` to `p-8` (1.5rem to 2rem)
- **Button Padding**: `px-4 py-3` (1rem horizontal, 0.75rem vertical)
- **Input Padding**: `px-4 py-3` (1rem horizontal, 0.75rem vertical)
- **Gap Between Elements**: `gap-4` to `gap-6` (1rem to 1.5rem)

## Component Styles

### Buttons

#### Primary Button
```css
Background: gray-900 (#111827)
Text: white (#FFFFFF)
Padding: px-4 py-3 (1rem × 0.75rem)
Border Radius: 0.5rem (8px)
Font: Semibold, 0.875rem (14px)
Hover: gray-800 (#1F2937)
Shadow: shadow-lg
Transition: all duration-200
```

#### Secondary Button (Outlined)
```css
Background: transparent
Border: 1px solid white
Text: white
Padding: px-4 py-2
Border Radius: 0.5rem
Hover: white background, gray-900 text
```

#### Text Button
```css
Background: transparent
Text: gray-900
Padding: px-3 py-2
Hover: gray-100 background
```

### Cards

#### Standard Card
```css
Background: white
Border Radius: 0.75rem (12px) or 1rem (16px)
Shadow: shadow-md or shadow-lg
Padding: p-6 to p-8
Border: border border-gray-200 (optional)
```

#### Card Header
```css
Background: gray-50 (#F9FAFB)
Padding: px-6 py-4
Border Radius: rounded-t-xl (top corners only)
Border Bottom: border-b border-gray-200
```

### Input Fields

#### Text Input
```css
Background: white
Border: 1px solid gray-300
Border Radius: 0.5rem (8px)
Padding: px-4 py-3
Focus: ring-2 ring-gray-900, border-transparent
Text: gray-900
Placeholder: gray-500
```

#### Textarea
```css
Same as Text Input
Min Height: 6rem (96px)
Resize: vertical
```

### Icons

#### Icon Containers
```css
Size: 12px × 12px (w-12 h-12) or 16px × 16px (w-16 h-16)
Background: gray-900
Text: white
Border Radius: 0.5rem (8px) or 0.75rem (12px)
Display: flex items-center justify-center
```

#### Icon Colors
- **Primary Icons**: white on gray-900 background
- **Secondary Icons**: gray-900 on transparent
- **Status Icons**: Use status colors (green, red, orange, blue)

### Navigation

#### Navbar
```css
Background: gradient from-gray-900 to-gray-800
Height: 4rem (64px) with py-4
Text: white
Hover: text-gray-300
Fixed: top-0 z-50
```

#### Sidebar
```css
Background: white
Width: 16rem (256px) expanded, 4rem (64px) collapsed
Border: border-r border-gray-200
Active Item: bg-gray-100 text-gray-900
Hover: bg-gray-100
```

### Loading States

#### Spinner
```css
Size: 12px × 12px (w-12 h-12)
Border: 2px solid gray-200
Border Top: 2px solid gray-900
Border Radius: 50%
Animation: spin (1s linear infinite)
```

#### Skeleton
```css
Background: gray-200
Border Radius: 0.25rem (4px)
Animation: pulse (2s cubic-bezier infinite)
Height: matches content
```

## Layout Patterns

### Page Structure
```
┌─────────────────────────┐
│   Navbar (Fixed Top)    │
├─────────────────────────┤
│                         │
│   Main Content Area     │
│   (Container: max-w-*)  │
│   (Padding: px-4 py-8)  │
│                         │
└─────────────────────────┘
│      Footer             │
└─────────────────────────┘
```

### Container Widths
- **Full Width**: `w-full`
- **Container**: `container mx-auto` (max-width: 1280px)
- **Narrow Content**: `max-w-4xl mx-auto` (896px)
- **Wide Content**: `max-w-6xl mx-auto` (1152px)

### Grid System
- **2 Columns**: `grid grid-cols-1 md:grid-cols-2 gap-6`
- **3 Columns**: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`
- **4 Columns**: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6`

---

# 📱 Feature Documentation

## 1. Authentication System

### Features
- Email/Password Login
- User Registration
- Password Reset (Forgot Password)
- Email Verification
- Two-Factor Authentication (2FA)
- Login History Tracking
- Session Management
- JWT Token Authentication
- Refresh Tokens

### User Flows

#### Login Flow
```
1. User enters email and password
2. Frontend validates input
3. POST /api/auth/login
4. Backend verifies credentials
5. Returns JWT token + user data
6. Frontend stores token in HTTP-only cookie
7. Redirect to /app or home
```

#### Signup Flow
```
1. User fills registration form
   - First Name, Last Name
   - Email, Password
   - Class, Board (for content filtering)
   - Terms acceptance
2. POST /api/auth/signup
3. Backend creates user account
4. Sends verification email (optional)
5. Returns JWT token + user data
6. Auto-login and redirect
```

#### Password Reset Flow
```
1. User clicks "Forgot Password"
2. Enters email address
3. POST /api/auth/forgot-password
4. Backend generates reset token
5. Sends email with reset link
6. User clicks link → /auth/reset-password?token=xxx
7. User enters new password
8. POST /api/auth/reset-password
9. Password updated, redirect to login
```

### API Endpoints

#### POST `/api/auth/login`
**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "csrfToken": "token" // optional
}
```

**Response:**
```json
{
  "user": {
    "id": "user_id",
    "firstName": "John",
    "lastName": "Doe",
    "email": "user@example.com",
    "plan": "Enterprise",
    "preferences": { ... },
    "stats": { ... }
  },
  "message": "Login successful",
  "refreshToken": "refresh_token_here"
}
```

#### POST `/api/auth/signup`
**Request:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "user@example.com",
  "password": "password123",
  "phone": "", // optional
  "class": "10",
  "board": "CBSE",
  "agreeToTerms": true
}
```

**Response:** Same as login

#### POST `/api/auth/forgot-password`
**Request:**
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

#### POST `/api/auth/reset-password`
**Request:**
```json
{
  "token": "reset_token_from_email",
  "newPassword": "newpassword123",
  "csrfToken": "token" // optional
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password reset successfully"
}
```

### UI Components

#### Login Page
- Email input field
- Password input field (with show/hide toggle)
- "Remember me" checkbox
- "Forgot password?" link
- Sign In button (gray-900 background)
- Error message display (red banner)
- Success message display (green banner)

#### Signup Page
- First Name, Last Name fields
- Email field
- Password field (with strength indicator)
- Confirm Password field
- Class selector (dropdown)
- Board selector (dropdown)
- Terms & Privacy checkbox
- Newsletter subscription checkbox
- Sign Up button
- Link to login page

---

## 2. Chat Interface

### Features
- Real-time AI chat
- Text input
- Image upload and analysis
- Voice input (speech-to-text)
- Text-to-speech (TTS)
- Chat session persistence
- Chat history
- Research mode (web search)
- Context-aware responses
- Plan-based restrictions

### User Flow
```
1. User opens /app
2. Loads chat sessions from database
3. User selects session or creates new
4. User types message / uploads image / records voice
5. POST /api/chat with message
6. AI processes and responds
7. Message saved to database
8. UI updates with response
9. Auto-scroll to latest message
```

### API Endpoints

#### POST `/api/chat`
**Request:**
```json
{
  "message": "What is photosynthesis?",
  "sessionId": "session_id", // optional
  "inputType": "text", // "text", "image", "voice"
  "imageData": "base64_string", // if inputType is "image"
  "voiceData": "base64_string", // if inputType is "voice"
  "mode": "normal", // "normal" or "research"
  "conversationHistory": [ // optional
    {
      "text": "Hello",
      "isUser": true,
      "timestamp": "2024-01-01T00:00:00Z"
    }
  ]
}
```

**Response:**
```json
{
  "response": "Photosynthesis is the process...",
  "timestamp": "2024-01-01T00:00:00Z",
  "mode": "normal",
  "context": {
    "currentContextId": "ctx_123",
    "contextType": "text",
    "relatedContexts": 3,
    "suggestions": ["How does it work?", "What are the stages?"]
  },
  "usage": {
    "currentPlan": "Enterprise",
    "totalInteractions": 150,
    "remainingConversations": "unlimited"
  }
}
```

#### GET `/api/chat/sessions`
**Response:**
```json
{
  "sessions": [
    {
      "id": "session_id",
      "title": "Math Help",
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z",
      "messageCount": 10
    }
  ]
}
```

#### GET `/api/chat/sessions/[id]/messages`
**Response:**
```json
{
  "messages": [
    {
      "id": "msg_id",
      "text": "Hello",
      "isUser": true,
      "timestamp": "2024-01-01T00:00:00Z",
      "metadata": null
    }
  ]
}
```

### UI Components

#### Chat Interface
- **Message List**: Scrollable container with messages
- **User Messages**: Right-aligned, gray-900 background, white text
- **AI Messages**: Left-aligned, white background, gray-900 text
- **Input Area**: 
  - Text input field
  - Image upload button
  - Voice record button
  - Send button
  - Research mode toggle
- **Sidebar**: Chat session list
- **Loading Indicator**: Shows when AI is processing

#### Message Component
```typescript
interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  formattedText?: string;
  hasCode?: boolean;
  hasLists?: boolean;
  hasHeaders?: boolean;
}
```

**Styling:**
- User: `bg-gray-900 text-white rounded-lg p-4 ml-auto max-w-3xl`
- AI: `bg-white text-gray-900 rounded-lg p-4 mr-auto max-w-3xl border border-gray-200`

---

## 3. Notes Feature

### Features
- Create, Read, Update, Delete notes
- Category organization
- Tag system
- Search functionality
- Rich text support
- Scientific notation rendering
- Math equation rendering

### User Flow
```
1. User navigates to /app/notes
2. Loads all user notes from database
3. User can:
   - Create new note (title + content)
   - Edit existing note
   - Delete note
   - Filter by category
   - Search notes
4. Changes auto-save or manual save
```

### API Endpoints

#### GET `/api/notes?userId=xxx&category=xxx`
**Response:**
```json
{
  "success": true,
  "notes": [
    {
      "id": "note_id",
      "title": "Biology Notes",
      "content": "Content here...",
      "category": "Science",
      "tags": "biology, cells",
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    }
  ],
  "count": 10
}
```

#### POST `/api/notes`
**Request:**
```json
{
  "title": "Note Title",
  "content": "Note content...",
  "category": "Science",
  "tags": ["biology", "cells"],
  "userId": "user_id"
}
```

#### PUT `/api/notes`
**Request:**
```json
{
  "id": "note_id",
  "title": "Updated Title",
  "content": "Updated content...",
  "category": "Science"
}
```

#### DELETE `/api/notes?id=note_id`

### UI Components

#### Notes List
- Grid or list view
- Note cards with:
  - Title
  - Preview (first 100 chars)
  - Category badge
  - Tags
  - Created date
  - Edit/Delete buttons

#### Note Editor
- Title input
- Content textarea (rich text support)
- Category selector
- Tags input (comma-separated)
- Save button
- Delete button

---

## 4. Flashcards Feature

### Features
- Create flashcards (question/answer pairs)
- Category organization
- Difficulty levels (easy, medium, hard)
- Mastery tracking
- Spaced repetition
- Review mode
- Progress tracking

### User Flow
```
1. User navigates to /app/flashcards
2. Loads all flashcards
3. User can:
   - Create new flashcard
   - Edit flashcard
   - Delete flashcard
   - Enter review mode
   - Mark mastery level
4. Review mode shows question, user answers, shows answer
```

### API Endpoints

#### GET `/api/flashcards?userId=xxx&category=xxx&reviewOnly=true`
**Response:**
```json
{
  "success": true,
  "flashcards": [
    {
      "id": "card_id",
      "question": "What is photosynthesis?",
      "answer": "Process by which plants...",
      "category": "Biology",
      "difficulty": "medium",
      "masteryLevel": 2,
      "lastReviewed": "2024-01-01T00:00:00Z",
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

#### POST `/api/flashcards`
**Request:**
```json
{
  "question": "Question text",
  "answer": "Answer text",
  "category": "Biology",
  "difficulty": "medium",
  "userId": "user_id"
}
```

#### PUT `/api/flashcards`
**Request:**
```json
{
  "id": "card_id",
  "masteryLevel": 3,
  "lastReviewed": "2024-01-01T00:00:00Z"
}
```

### UI Components

#### Flashcard Card
- Front: Question
- Back: Answer
- Flip animation
- Mastery indicator (0-5 stars)
- Difficulty badge
- Category tag

#### Review Mode
- Shows one card at a time
- "Show Answer" button
- Mastery buttons (0-5)
- "Next" button
- Progress indicator

---

## 5. Exam Mode

### Features
- AI-powered exam generation
- Customizable difficulty
- Subject selection
- Question types (MCQ, Short Answer, Long Answer)
- Timer support
- Score calculation
- Detailed results with solutions
- Review incorrect answers
- Exam history

### User Flow
```
1. User navigates to /app/exam
2. Selects subject, difficulty, question count
3. Clicks "Generate Exam"
4. POST /api/exam/generate
5. Exam questions displayed
6. User answers questions
7. Submit exam
8. Results shown with:
   - Score
   - Correct/Incorrect answers
   - Solutions
   - Performance breakdown
```

### API Endpoints

#### POST `/api/exam/generate`
**Request:**
```json
{
  "subject": "Mathematics",
  "difficulty": "medium",
  "questionCount": 10,
  "questionTypes": ["MCQ", "Short Answer"]
}
```

**Response:**
```json
{
  "success": true,
  "exam": {
    "id": "exam_id",
    "title": "Mathematics Exam",
    "questions": [
      {
        "id": "q1",
        "type": "MCQ",
        "question": "What is 2+2?",
        "options": ["3", "4", "5", "6"],
        "correctAnswer": 1,
        "explanation": "2+2 equals 4"
      }
    ],
    "totalQuestions": 10,
    "timeLimit": 1800 // seconds
  }
}
```

#### POST `/api/exam`
**Request:**
```json
{
  "examId": "exam_id",
  "userAnswers": {
    "q1": 1,
    "q2": "Answer text"
  },
  "timeSpent": 1200 // seconds
}
```

**Response:**
```json
{
  "success": true,
  "score": 8.5,
  "totalQuestions": 10,
  "correctAnswers": 8,
  "results": [
    {
      "questionId": "q1",
      "userAnswer": 1,
      "correctAnswer": 1,
      "isCorrect": true,
      "explanation": "..."
    }
  ]
}
```

### UI Components

#### Exam Generator
- Subject dropdown
- Difficulty selector (Easy, Medium, Hard)
- Question count input
- Question type checkboxes
- Generate button

#### Exam Interface
- Question display
- Answer input (varies by type)
- Timer display
- Progress indicator
- Submit button
- Navigation (Previous/Next)

#### Results Screen
- Score display (large, prominent)
- Summary statistics
- Detailed breakdown
- Review incorrect answers
- View solutions
- Retake exam button

---

## 6. Focus Mode

### Features
- Pomodoro timer
- Customizable durations
- Session tracking
- Statistics
- Distraction-free interface
- Background music (optional)
- Session history

### User Flow
```
1. User navigates to /app/focus
2. Selects focus duration (25min default)
3. Starts timer
4. Timer counts down
5. Session ends, saves to database
6. Shows completion message
7. Statistics updated
```

### API Endpoints

#### POST `/api/focus`
**Request:**
```json
{
  "userId": "user_id",
  "duration": 1500, // seconds
  "mode": "pomodoro"
}
```

**Response:**
```json
{
  "success": true,
  "session": {
    "id": "session_id",
    "duration": 1500,
    "status": "completed",
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

#### GET `/api/focus?userId=xxx`
**Response:**
```json
{
  "success": true,
  "totalFocusTime": 7200, // seconds
  "count": 10,
  "sessions": [ ... ]
}
```

### UI Components

#### Focus Timer
- Large timer display (minutes:seconds)
- Start/Pause/Reset buttons
- Duration selector
- Progress ring/circle
- Session count display
- Total time display

---

## 7. Progress & Analytics

### Features
- Usage statistics
- Learning streaks
- Subject breakdown
- Time tracking
- Performance trends
- Weekly/monthly reports
- Achievement tracking

### User Flow
```
1. User navigates to /app/progress
2. Loads usage data from API
3. Displays:
   - Overview cards (total interactions, time, streak)
   - Weekly activity chart
   - Subject breakdown
   - Monthly progress
   - Additional statistics
```

### API Endpoints

#### GET `/api/usage?userId=xxx&period=30d`
**Response:**
```json
{
  "totalInteractions": 500,
  "textMessages": 400,
  "imageUploads": 50,
  "voiceInputs": 50,
  "totalTimeSpent": "25h 30m",
  "averageSessionTime": "15m 30s",
  "streakDays": 7,
  "weeklyData": [
    { "day": "Mon", "interactions": 20, "time": "2h 30m" }
  ],
  "subjectBreakdown": [
    { "subject": "Mathematics", "interactions": 150, "percentage": 30 }
  ],
  "thisMonth": {
    "textMessages": 100,
    "imageUploads": 10,
    "voiceInputs": 5,
    "timeSpent": "5h 20m"
  }
}
```

#### GET `/api/analytics/insights`
**Response:**
```json
{
  "insights": {
    "strongestSubject": "Mathematics",
    "needsImprovement": "Physics",
    "studyPattern": "Evening",
    "recommendations": [
      "Focus more on Physics",
      "Maintain your streak!"
    ]
  }
}
```

### UI Components

#### Overview Cards
- 4 cards in grid
- Icon + large number + label
- Colors: gray-900, green-600, orange-600, blue-600

#### Activity Chart
- Bar chart or line chart
- Daily/weekly data
- Interactive tooltips

#### Subject Breakdown
- List of subjects
- Color-coded dots
- Percentage bars
- Interaction counts

---

## 8. Achievements & Badges

### Features
- Achievement system
- Badge collection
- Progress tracking
- Unlock notifications
- Achievement categories
- Points system

### User Flow
```
1. User navigates to /app/achievements
2. Loads achievements and badges
3. Displays:
   - Unlocked achievements
   - Locked achievements (with progress)
   - Badge collection
   - Points total
4. User can view details of each achievement
```

### API Endpoints

#### GET `/api/achievements?userId=xxx`
**Response:**
```json
{
  "achievements": [
    {
      "id": "ach_id",
      "name": "First Steps",
      "description": "Complete your first chat",
      "icon": "🎯",
      "category": "study",
      "points": 10,
      "isUnlocked": true,
      "unlockedAt": "2024-01-01T00:00:00Z",
      "progress": 100
    }
  ],
  "badges": [ ... ],
  "totalPoints": 150
}
```

### UI Components

#### Achievement Card
- Icon/Image
- Name
- Description
- Progress bar (if locked)
- Points value
- Unlock date (if unlocked)
- Rarity indicator (common, rare, epic, legendary)

---

## 9. Profile Management

### Features
- View profile
- Edit profile information
- Avatar upload
- Class and board selection
- Preferences management
- Security settings
- Password change
- 2FA setup
- Login history

### User Flow
```
1. User navigates to /profile
2. Views profile information
3. Clicks "Edit Profile"
4. Updates fields
5. Saves changes
6. Profile updated in database
```

### API Endpoints

#### GET `/api/users?userId=xxx`
**Response:**
```json
{
  "user": {
    "id": "user_id",
    "firstName": "John",
    "lastName": "Doe",
    "email": "user@example.com",
    "phone": "+1234567890",
    "bio": "Student",
    "location": "City, Country",
    "avatar": "/uploads/avatar.jpg",
    "plan": "Enterprise",
    "preferences": { ... },
    "stats": { ... }
  }
}
```

#### PUT `/api/users`
**Request:**
```json
{
  "userId": "user_id",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890",
  "bio": "Updated bio",
  "class": "10",
  "board": "CBSE"
}
```

### UI Components

#### Profile Page
- Avatar display (with upload button)
- Name, email, phone
- Bio, location
- Class and board display
- Edit button
- Plan badge

#### Edit Profile Form
- All profile fields (editable)
- Avatar upload
- Save button
- Cancel button

---

## 10. Subscription & Billing

### Features
- View current plan
- Upgrade/downgrade plans
- Payment method management
- Invoice history
- Subscription cancellation
- Plan comparison
- Usage limits display

### User Flow
```
1. User navigates to /profile/billing
2. Views current plan and status
3. Can:
   - View available plans
   - Upgrade/downgrade (redirects to payment)
   - View invoices
   - Download invoice PDF
   - Manage payment methods
   - Cancel subscription
```

### API Endpoints

#### GET `/api/subscriptions/current`
**Response:**
```json
{
  "subscription": {
    "id": "sub_id",
    "plan": "Pro",
    "status": "Active",
    "currentPeriodStart": "2024-01-01T00:00:00Z",
    "currentPeriodEnd": "2024-01-31T00:00:00Z",
    "cancelAtPeriodEnd": false
  }
}
```

#### POST `/api/subscriptions/create`
**Request:**
```json
{
  "plan": "Pro",
  "paymentMethodId": "pm_xxx"
}
```

#### POST `/api/subscriptions/cancel`
**Request:**
```json
{
  "subscriptionId": "sub_id"
}
```

### UI Components

#### Plan Cards
- Plan name
- Price
- Feature list
- "Choose Plan" button
- "Most Popular" badge (if applicable)

#### Current Plan Display
- Plan name badge
- Status indicator
- Renewal date
- Cancel button

#### Invoice List
- Table with columns:
  - Date
  - Amount
  - Status
  - Download button

---

## 11. Notifications System

### Features
- View all notifications
- Mark as read/unread
- Filter by type
- Delete notifications
- Notification settings
- Real-time updates (future)

### User Flow
```
1. User navigates to /notifications
2. Loads notifications from API
3. User can:
   - View notifications
   - Mark as read
   - Mark all as read
   - Delete notification
   - Filter by type
4. Updates reflected in database
```

### API Endpoints

#### GET `/api/notifications?type=xxx&read=false`
**Response:**
```json
{
  "success": true,
  "notifications": [
    {
      "id": "notif_id",
      "type": "achievement",
      "title": "Learning Streak!",
      "message": "You've maintained a 7-day streak",
      "icon": "🏆",
      "read": false,
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ],
  "unreadCount": 5
}
```

#### PUT `/api/notifications`
**Request:**
```json
{
  "id": "notif_id" // or "markAll": true
}
```

#### DELETE `/api/notifications?id=notif_id`

### UI Components

#### Notification List
- Notification cards
- Unread indicator (blue dot)
- Time ago display
- Mark as read button
- Delete button
- Filter tabs

---

## 12. Learning Materials

### Features
- Subject browsing
- Video lessons
- Book resources
- Filtered by class and board
- Search functionality

### User Flow
```
1. User navigates to /learning
2. Loads subjects/videos/books for their class and board
3. User can:
   - Browse subjects
   - Watch videos
   - Access books
   - Change class/board in profile
```

### API Endpoints
(Content is currently static, but can be extended with API)

---

## 13. Admin Panel

### Features
- Send notifications to users
- View all users
- Send to all or specific users
- Notification management

### User Flow
```
1. Admin logs in
2. Navigates to /admin/notifications
3. Fills notification form
4. Selects recipients (all or specific)
5. Sends notification
6. Notification created for selected users
```

### API Endpoints

#### POST `/api/admin/notifications`
**Request:**
```json
{
  "userIds": ["user1", "user2"], // or [] for all users
  "type": "system",
  "title": "System Maintenance",
  "message": "We'll be performing maintenance...",
  "icon": "🔧"
}
```

#### GET `/api/admin/users`
**Response:**
```json
{
  "success": true,
  "users": [
    {
      "id": "user_id",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "plan": "Pro"
    }
  ],
  "count": 150
}
```

---

# 🔌 API Reference

## Base URL
```
Development: http://localhost:3000
Production: https://your-domain.com
```

## Authentication
All protected endpoints require:
- HTTP-only cookie: `auth_token`
- OR Authorization header: `Bearer <token>`

## Common Response Formats

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

### Error Response
```json
{
  "error": "Error message",
  "details": "Additional details" // in development
}
```

## Complete API List

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration
- `POST /api/auth/logout` - User logout
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password
- `POST /api/auth/change-password` - Change password
- `GET /api/auth/verify` - Verify authentication
- `GET /api/auth/verify-email` - Verify email
- `POST /api/auth/verify-email` - Resend verification
- `POST /api/auth/2fa/setup` - Setup 2FA
- `POST /api/auth/2fa/verify` - Verify 2FA
- `POST /api/auth/2fa/disable` - Disable 2FA
- `GET /api/auth/login-history` - Get login history
- `POST /api/auth/refresh` - Refresh token

### Chat
- `POST /api/chat` - Send message
- `GET /api/chat/sessions` - Get chat sessions
- `POST /api/chat/sessions` - Create session
- `GET /api/chat/sessions/[id]/messages` - Get messages
- `POST /api/chat/sessions/[id]/messages` - Add message
- `GET /api/chat/export/[id]` - Export chat

### Notes
- `GET /api/notes?userId=xxx&category=xxx` - Get notes
- `POST /api/notes` - Create note
- `PUT /api/notes` - Update note
- `DELETE /api/notes?id=xxx` - Delete note

### Flashcards
- `GET /api/flashcards?userId=xxx` - Get flashcards
- `POST /api/flashcards` - Create flashcard
- `PUT /api/flashcards` - Update flashcard
- `DELETE /api/flashcards?id=xxx` - Delete flashcard

### Exam
- `GET /api/exam?userId=xxx` - Get exam sessions
- `POST /api/exam/generate` - Generate exam
- `POST /api/exam` - Submit exam answers

### Focus
- `GET /api/focus?userId=xxx` - Get focus sessions
- `POST /api/focus` - Create focus session

### Analytics
- `GET /api/usage?userId=xxx&period=30d` - Get usage stats
- `GET /api/analytics/insights` - Get insights

### Achievements
- `GET /api/achievements?userId=xxx` - Get achievements
- `GET /api/badges?userId=xxx` - Get badges

### Subscriptions
- `GET /api/subscriptions/current` - Get current subscription
- `POST /api/subscriptions/create` - Create subscription
- `PUT /api/subscriptions/update` - Update subscription
- `POST /api/subscriptions/cancel` - Cancel subscription
- `GET /api/subscriptions/invoices` - Get invoices

### Payment Methods
- `GET /api/payment-methods` - Get payment methods
- `POST /api/payment-methods` - Add payment method
- `PUT /api/payment-methods` - Update payment method
- `DELETE /api/payment-methods?id=xxx` - Remove payment method

### Invoices
- `GET /api/invoices/[id]/download` - Download invoice PDF

### Notifications
- `GET /api/notifications?type=xxx&read=false` - Get notifications
- `POST /api/notifications` - Create notification
- `PUT /api/notifications` - Mark as read
- `DELETE /api/notifications?id=xxx` - Delete notification

### Admin
- `GET /api/admin/check` - Check admin status
- `GET /api/admin/users` - Get all users
- `POST /api/admin/notifications` - Send notifications

### Users
- `GET /api/users?userId=xxx` - Get user
- `PUT /api/users` - Update user
- `POST /api/upload/avatar` - Upload avatar

### Utilities
- `POST /api/ocr` - Image OCR
- `POST /api/voice` - Voice transcription
- `POST /api/tts` - Text-to-speech
- `GET /api/csrf-token` - Get CSRF token

---

# 🔄 User Flows

## Complete User Journey

### New User Flow
```
1. Visit homepage
2. Click "Get Started"
3. Sign up with email/password
4. Select class and board
5. Verify email (optional)
6. Redirected to /app
7. See welcome message in chat
8. Start using features
```

### Returning User Flow
```
1. Visit homepage
2. Click "Sign In"
3. Enter credentials
4. Redirected to /app
5. Chat sessions load
6. Continue from where left off
```

### Feature Discovery Flow
```
1. User in /app
2. Sees sidebar with features:
   - Chat
   - Notes
   - Flashcards
   - Exam Mode
   - Focus Mode
   - Progress
   - Achievements
3. Clicks feature
4. Feature page loads
5. User explores and uses feature
```

---

# 🧩 Component Specifications

## Reusable Components

### Button Component
```typescript
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'text';
  size: 'sm' | 'md' | 'lg';
  color?: 'gray-900' | 'white' | 'gray';
  disabled?: boolean;
  loading?: boolean;
  icon?: ReactNode;
  children: ReactNode;
  onClick?: () => void;
}
```

**Styles:**
- Primary: `bg-gray-900 text-white`
- Secondary: `border border-white text-white`
- Text: `text-gray-900 bg-transparent`

### Card Component
```typescript
interface CardProps {
  children: ReactNode;
  shadow?: 'sm' | 'md' | 'lg';
  padding?: 'sm' | 'md' | 'lg';
  header?: ReactNode;
  footer?: ReactNode;
}
```

### Input Component
```typescript
interface InputProps {
  label?: string;
  type?: 'text' | 'email' | 'password' | 'number';
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
  icon?: ReactNode;
}
```

### Loading Skeleton
- Card skeleton
- Text skeleton
- List skeleton
- Table skeleton

---

# 📱 Mobile App Implementation Guidelines

## Design System Adaptation

### Colors
- Use same color palette
- Ensure proper contrast for accessibility
- Support dark mode (use system theme)

### Typography
- Use native font scaling
- Respect user font size preferences
- Maintain hierarchy

### Spacing
- Use 8px base unit
- Adapt padding for touch targets (min 44px)
- Use safe area insets

### Components
- Use native components where possible
- Maintain visual consistency
- Ensure touch-friendly sizes

## Feature Implementation

### Authentication
- Use secure storage for tokens
- Implement biometric authentication
- Handle token refresh automatically

### Chat
- Implement real-time updates (WebSocket or polling)
- Optimize for mobile keyboard
- Support voice input natively
- Handle image uploads efficiently

### Navigation
- Use native navigation patterns
- Bottom tab bar for main features
- Drawer/sidebar for secondary features
- Deep linking support

### Data Management
- Implement offline support
- Cache frequently accessed data
- Sync when online
- Handle conflicts gracefully

## API Integration

### Base Configuration
```typescript
const API_BASE_URL = 'https://your-domain.com/api';
const API_TIMEOUT = 30000; // 30 seconds
```

### Request Headers
```typescript
headers: {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${token}`,
  'X-Device-Info': deviceInfo
}
```

### Error Handling
- Network errors → Show retry option
- 401 errors → Redirect to login
- 403 errors → Show access denied
- 500 errors → Show generic error
- Timeout → Show timeout message

### Response Caching
- Cache user data
- Cache chat sessions
- Cache notes/flashcards
- Invalidate on updates

---

# 🎯 Implementation Checklist

## Phase 1: Core Features
- [ ] Authentication (Login, Signup, Password Reset)
- [ ] Chat Interface
- [ ] Notes
- [ ] Flashcards
- [ ] Profile Management

## Phase 2: Advanced Features
- [ ] Exam Mode
- [ ] Focus Mode
- [ ] Progress & Analytics
- [ ] Achievements

## Phase 3: Additional Features
- [ ] Notifications
- [ ] Subscription Management
- [ ] Learning Materials
- [ ] Admin Panel (if applicable)

---

# 📝 Notes for Developers

## Key Considerations

1. **State Management**: Use Context API or Redux for global state
2. **API Calls**: Implement retry logic and error handling
3. **Offline Support**: Cache data and queue actions
4. **Performance**: Lazy load components, optimize images
5. **Security**: Never store passwords, use secure token storage
6. **Accessibility**: Ensure proper labels and contrast
7. **Testing**: Test all user flows and edge cases

## Environment Variables
```env
API_BASE_URL=https://your-domain.com
JWT_SECRET=your-secret-key
OPENAI_API_KEY=your-openai-key
RAZORPAY_KEY_ID=your-razorpay-key
RAZORPAY_KEY_SECRET=your-razorpay-secret
ADMIN_EMAILS=admin@example.com
```

---

---

# 📊 Data Models

## User Model
```typescript
interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  bio?: string;
  location?: string;
  website?: string;
  avatar?: string;
  plan: 'Basic' | 'Pro' | 'Enterprise';
  joinDate: string;
  preferences: {
    theme: 'light' | 'dark' | 'system';
    language: string;
    notifications: {
      email: boolean;
      push: boolean;
      weeklyDigest: boolean;
      marketing: boolean;
    };
    learning: {
      difficultyLevel: 'beginner' | 'intermediate' | 'advanced' | 'adaptive';
      learningStyle: 'visual' | 'auditory' | 'kinesthetic' | 'mixed';
      subjectFocus: string[];
      class: string;
      board: string;
    };
  };
  stats: {
    totalInteractions: number;
    textMessages: number;
    imageUploads: number;
    voiceInputs: number;
    totalTimeSpent: string;
    averageSessionTime: string;
    streakDays: number;
  };
  subscriptionStatus: 'Inactive' | 'Active' | 'Trialing' | 'PastDue' | 'Cancelled' | 'Expired';
  emailVerified: boolean;
  twoFactorEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}
```

## Note Model
```typescript
interface Note {
  id: string;
  title: string;
  content: string;
  category?: string;
  tags: string[];
  userId: string;
  createdAt: string;
  updatedAt: string;
  metadata?: any;
}
```

## Flashcard Model
```typescript
interface Flashcard {
  id: string;
  question: string;
  answer: string;
  category?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  masteryLevel: number; // 0-5
  userId: string;
  lastReviewed?: string;
  createdAt: string;
  updatedAt: string;
}
```

## Chat Session Model
```typescript
interface ChatSession {
  id: string;
  title: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  messages: Message[];
}

interface Message {
  id: string;
  sessionId: string;
  text: string;
  isUser: boolean;
  timestamp: string;
  metadata?: {
    type?: 'text' | 'image' | 'voice';
    imageUrl?: string;
    voiceUrl?: string;
  };
}
```

## Exam Session Model
```typescript
interface ExamSession {
  id: string;
  title: string;
  questions: ExamQuestion[];
  userAnswers: (number | string)[];
  score?: number;
  totalQuestions: number;
  timeSpent?: number; // seconds
  status: 'not_started' | 'in_progress' | 'completed';
  userId: string;
  createdAt: string;
  completedAt?: string;
}

interface ExamQuestion {
  id: string;
  type: 'MCQ' | 'Short Answer' | 'Long Answer';
  question: string;
  options?: string[]; // For MCQ
  correctAnswer: number | string;
  explanation: string;
}
```

## Notification Model
```typescript
interface Notification {
  id: string;
  userId: string;
  type: 'achievement' | 'reminder' | 'update' | 'system' | 'exam' | 'subscription';
  title: string;
  message: string;
  icon?: string;
  read: boolean;
  readAt?: string;
  createdAt: string;
  metadata?: any;
}
```

## Subscription Model
```typescript
interface Subscription {
  id: string;
  userId: string;
  plan: 'Basic' | 'Pro' | 'Enterprise';
  status: 'Inactive' | 'Active' | 'Trialing' | 'PastDue' | 'Cancelled' | 'Expired';
  provider: 'stripe' | 'razorpay' | 'manual';
  subscriptionId?: string;
  customerId?: string;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  createdAt: string;
  updatedAt: string;
}
```

---

# 🔐 Security & Authentication

## Token Management
- **Access Token**: JWT, expires in 7 days
- **Refresh Token**: Random string, expires in 30 days
- **Storage**: HTTP-only cookies (web) or secure storage (mobile)
- **Refresh Flow**: Automatically refresh when access token expires

## Password Requirements
- Minimum 6 characters
- Recommended: 8+ characters with mix of letters, numbers, symbols
- Stored as bcrypt hash (never plain text)

## CSRF Protection
- CSRF tokens for state-changing operations
- Token in header: `X-CSRF-Token`
- Token obtained from: `GET /api/csrf-token`

## Rate Limiting
- Login: 5 attempts per 15 minutes
- Signup: 3 attempts per hour
- Chat: Based on plan limits
- Other endpoints: Varies

---

# 🎯 Mobile App Specific Guidelines

## Navigation Structure

### Bottom Tab Bar (Primary Navigation)
```
┌─────────────────────────────────┐
│  Chat  Notes  Exam  Progress  Me │
└─────────────────────────────────┘
```

### Drawer Menu (Secondary Navigation)
- Profile
- Settings
- Notifications
- Help & Support
- Achievements
- Billing (if applicable)
- Admin Panel (if admin)

## Screen Layouts

### Chat Screen
- Top: Navbar with session selector
- Middle: Message list (scrollable)
- Bottom: Input area with keyboard
- Floating: Send button, attachment buttons

### Notes Screen
- Top: Search bar, filter chips
- Middle: Notes grid/list
- Floating: Create note button (FAB)

### Exam Screen
- Top: Timer, progress indicator
- Middle: Question display
- Bottom: Answer input, navigation buttons

## Touch Targets
- Minimum size: 44px × 44px
- Button padding: 12px minimum
- Spacing between interactive elements: 8px minimum

## Gestures
- Swipe to delete (notes, flashcards)
- Pull to refresh (lists)
- Long press for context menu
- Pinch to zoom (images)

## Offline Support
- Cache user data
- Cache chat sessions
- Cache notes/flashcards
- Queue actions when offline
- Sync when online

## Push Notifications
- Achievement unlocks
- Exam reminders
- System updates
- Admin notifications (if applicable)

---

# 📱 Platform-Specific Considerations

## iOS
- Use SF Symbols for icons
- Follow Human Interface Guidelines
- Support Dark Mode
- Use native navigation (UINavigationController)
- Support Dynamic Type

## Android
- Use Material Icons
- Follow Material Design guidelines
- Support Dark Theme
- Use native navigation (Navigation Component)
- Support Accessibility

## Common
- Support both platforms with shared codebase (React Native, Flutter, etc.)
- Use platform-specific UI components where needed
- Maintain design consistency across platforms

---

# 🧪 Testing Checklist

## Feature Testing
- [ ] Login/Signup flows
- [ ] Chat functionality
- [ ] Notes CRUD operations
- [ ] Flashcards review
- [ ] Exam generation and submission
- [ ] Focus timer
- [ ] Profile updates
- [ ] Notification display
- [ ] Subscription management

## Edge Cases
- [ ] Network errors
- [ ] Timeout handling
- [ ] Invalid credentials
- [ ] Empty states
- [ ] Large data sets
- [ ] Concurrent operations
- [ ] Token expiration
- [ ] Offline mode

## Performance
- [ ] Load time < 2 seconds
- [ ] Smooth scrolling (60fps)
- [ ] Efficient image loading
- [ ] Proper caching
- [ ] Memory management

---

# 📚 Additional Resources

## Icons
- Font Awesome (used in web)
- Heroicons (used in web)
- Use equivalent icon sets for mobile

## Fonts
- Primary: Roboto or system default
- Ensure proper fallbacks

## Images
- Avatar: 128px × 128px (circular)
- Thumbnails: 200px × 200px
- Full images: Max 1920px width
- Format: WebP or JPEG
- Compression: Optimize for mobile

---

**End of Document**

This document provides a complete reference for implementing PAATA.AI features in a mobile app. Use it as a guide for design consistency and feature parity.

**Last Updated:** January 2025  
**Version:** 2.0


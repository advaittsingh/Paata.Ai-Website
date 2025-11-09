# 📚 PAATA.AI API Documentation

**Last Updated:** January 2025  
**Version:** 2.0  
**Base URL:** `https://yourdomain.com/api`

---

## 📋 Table of Contents

1. [Authentication](#authentication)
2. [Chat API](#chat-api)
3. [Exam API](#exam-api)
4. [User API](#user-api)
5. [Subscription API](#subscription-api)
6. [Analytics API](#analytics-api)
7. [Error Handling](#error-handling)
8. [Rate Limiting](#rate-limiting)

---

## 🔐 Authentication

### Login

**POST** `/api/auth/login`

Authenticate user and receive JWT token.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "plan": "Enterprise"
  },
  "token": "jwt_token_here"
}
```

**Errors:**
- `400` - Missing email or password
- `401` - Invalid credentials
- `429` - Too many login attempts (rate limited)

---

### Signup

**POST** `/api/auth/signup`

Create new user account.

**Request:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (201):**
```json
{
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "plan": "Enterprise"
  },
  "token": "jwt_token_here"
}
```

**Errors:**
- `400` - Validation error
- `409` - Email already exists
- `429` - Too many signup attempts

---

### Forgot Password

**POST** `/api/auth/forgot-password`

Request password reset email.

**Request:**
```json
{
  "email": "user@example.com"
}
```

**Response (200):**
```json
{
  "message": "If an account with that email exists, a password reset link has been sent."
}
```

**Errors:**
- `400` - Email required
- `429` - Too many requests

---

### Reset Password

**POST** `/api/auth/reset-password`

Reset password with token.

**Request:**
```json
{
  "token": "reset_token_from_email",
  "newPassword": "newpassword123"
}
```

**Response (200):**
```json
{
  "message": "Password has been reset successfully."
}
```

**Errors:**
- `400` - Invalid or expired token
- `429` - Too many requests

---

### Change Password

**POST** `/api/auth/change-password`

Change user password (requires authentication).

**Headers:**
```
Cookie: auth_token=jwt_token_here
```

**Request:**
```json
{
  "currentPassword": "oldpassword",
  "newPassword": "newpassword123"
}
```

**Response (200):**
```json
{
  "message": "Password changed successfully"
}
```

**Errors:**
- `401` - Authentication required or incorrect password
- `400` - Validation error
- `429` - Too many requests

---

### Verify Email

**GET** `/api/auth/verify-email?token=verification_token`

Verify user email address.

**Response (302):**
Redirects to `/auth/verify-email?success=true` or `/auth/verify-email?error=invalid`

---

### Refresh Token

**POST** `/api/auth/refresh`

Refresh access token using refresh token.

**Request:**
```json
{
  "refreshToken": "refresh_token_here"
}
```

**Response (200):**
```json
{
  "user": { ... },
  "accessToken": "new_jwt_token",
  "refreshToken": "new_refresh_token"
}
```

---

## 💬 Chat API

### Send Message

**POST** `/api/chat`

Send a chat message and receive AI response.

**Headers:**
```
Cookie: auth_token=jwt_token_here
```

**Request:**
```json
{
  "message": "What is photosynthesis?",
  "userId": "user_id",
  "conversationHistory": [],
  "sessionId": "session_id",
  "inputType": "text",
  "mode": "standard"
}
```

**Parameters:**
- `mode`: `"standard"` | `"reasoning"` | `"explain_why"` (Research Mode)

**Response (200):**
```json
{
  "response": "AI response text here",
  "context": {
    "contextType": "text",
    "relatedContexts": 0,
    "suggestions": []
  }
}
```

**Errors:**
- `401` - Authentication required
- `403` - Plan limit reached
- `429` - Rate limited (30 requests/minute)

---

### Get Chat Sessions

**GET** `/api/chat/sessions?userId=user_id`

Get all chat sessions for a user.

**Headers:**
```
Cookie: auth_token=jwt_token_here
```

**Response (200):**
```json
{
  "sessions": [
    {
      "id": "session_id",
      "title": "Chat Session",
      "createdAt": "2025-01-01T00:00:00Z",
      "updatedAt": "2025-01-01T00:00:00Z"
    }
  ]
}
```

---

### Get Session Messages

**GET** `/api/chat/sessions/[id]/messages`

Get all messages in a chat session.

**Headers:**
```
Cookie: auth_token=jwt_token_here
```

**Response (200):**
```json
{
  "messages": [
    {
      "id": "msg_id",
      "text": "Message text",
      "isUser": true,
      "timestamp": "2025-01-01T00:00:00Z"
    }
  ]
}
```

---

### Export Chat Session

**GET** `/api/chat/export/[id]?format=json`

Export chat session as JSON or TXT.

**Query Parameters:**
- `format`: `"json"` | `"txt"` (default: `"json"`)

**Response (200):**
- JSON: Returns JSON object
- TXT: Returns plain text file

---

## 📝 Exam API

### Generate Exam Questions

**POST** `/api/exam/generate`

Generate AI-powered exam questions.

**Headers:**
```
Cookie: auth_token=jwt_token_here
```

**Request:**
```json
{
  "subject": "Mathematics",
  "topic": "Calculus",
  "difficulty": "medium",
  "count": 10,
  "questionType": "multiple_choice"
}
```

**Response (200):**
```json
{
  "success": true,
  "questions": [
    {
      "id": "q1",
      "question": "What is the derivative of x^2?",
      "options": ["2x", "x^2", "2x^2", "x"],
      "correctAnswer": 0,
      "explanation": "The derivative of x^2 is 2x..."
    }
  ]
}
```

**Errors:**
- `401` - Authentication required
- `503` - OpenAI API not configured
- `429` - Rate limited (10 requests/minute)

---

### Get Exam Sessions

**GET** `/api/exam?userId=user_id&status=completed`

Get exam sessions for a user.

**Query Parameters:**
- `userId`: User ID (optional, defaults to authenticated user)
- `status`: Filter by status (optional: `"not_started"`, `"in_progress"`, `"completed"`)

**Response (200):**
```json
{
  "success": true,
  "sessions": [
    {
      "id": "session_id",
      "title": "Mathematics - Calculus",
      "questions": [...],
      "userAnswers": [...],
      "score": 85.5,
      "status": "completed",
      "createdAt": "2025-01-01T00:00:00Z"
    }
  ],
  "count": 1
}
```

---

### Create Exam Session

**POST** `/api/exam`

Create a new exam session.

**Request:**
```json
{
  "title": "Mathematics - Calculus",
  "questions": [...],
  "totalQuestions": 10,
  "userId": "user_id",
  "status": "not_started"
}
```

**Response (200):**
```json
{
  "success": true,
  "session": { ... }
}
```

---

### Update Exam Session

**PUT** `/api/exam`

Update exam session (submit answers, complete exam).

**Request:**
```json
{
  "id": "session_id",
  "userAnswers": [0, 1, 2, 0, 1],
  "score": 80.0,
  "status": "completed",
  "timeSpent": 1800
}
```

**Response (200):**
```json
{
  "success": true,
  "session": { ... }
}
```

---

## 👤 User API

### Get Current User

**GET** `/api/users/me`

Get current authenticated user.

**Headers:**
```
Cookie: auth_token=jwt_token_here
```

**Response (200):**
```json
{
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "plan": "Enterprise",
    "stats": { ... },
    "preferences": { ... }
  }
}
```

---

### Update User

**PUT** `/api/users/me`

Update user profile.

**Request:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "bio": "Student",
  "location": "New York"
}
```

**Response (200):**
```json
{
  "user": { ... }
}
```

---

## 💳 Subscription API

### Get Current Subscription

**GET** `/api/subscriptions/current`

Get user's current subscription.

**Headers:**
```
Cookie: auth_token=jwt_token_here
```

**Response (200):**
```json
{
  "subscription": {
    "id": "sub_id",
    "plan": "Pro",
    "status": "active",
    "currentPeriodEnd": "2025-02-01T00:00:00Z"
  }
}
```

---

### Create Subscription

**POST** `/api/subscriptions/create`

Create a new subscription.

**Request:**
```json
{
  "plan": "Pro",
  "paymentMethodId": "pm_xxx"
}
```

**Response (200):**
```json
{
  "subscription": { ... },
  "paymentLink": "https://razorpay.com/payment/xxx"
}
```

---

### Cancel Subscription

**POST** `/api/subscriptions/cancel`

Cancel current subscription.

**Request:**
```json
{
  "cancelAtPeriodEnd": true
}
```

**Response (200):**
```json
{
  "message": "Subscription cancelled successfully"
}
```

---

### Get Invoices

**GET** `/api/subscriptions/invoices`

Get user's invoice history.

**Response (200):**
```json
{
  "invoices": [
    {
      "id": "inv_id",
      "amount": 999,
      "currency": "INR",
      "status": "paid",
      "paidAt": "2025-01-01T00:00:00Z"
    }
  ]
}
```

---

### Download Invoice PDF

**GET** `/api/invoices/[id]/download`

Download invoice as PDF.

**Response (200):**
PDF file download

---

## 📊 Analytics API

### Get Usage Statistics

**GET** `/api/usage?userId=user_id`

Get user usage statistics.

**Response (200):**
```json
{
  "totalInteractions": 150,
  "textInteractions": 100,
  "imageInteractions": 30,
  "voiceInteractions": 20,
  "weeklyData": { ... },
  "subjectBreakdown": { ... },
  "trends": { ... }
}
```

---

### Get Learning Insights

**GET** `/api/analytics/insights?userId=user_id`

Get advanced learning insights and analytics.

**Response (200):**
```json
{
  "insights": {
    "mostActiveTime": "Evening (6-10 PM)",
    "strengths": ["Mathematics", "Physics"],
    "weaknesses": ["Chemistry"],
    "recommendations": [...]
  },
  "trends": {
    "interactionTrend": "increasing",
    "accuracyTrend": "stable"
  }
}
```

---

## ⚠️ Error Handling

All API endpoints follow consistent error response format:

```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": { ... }
}
```

### Common Error Codes

- `400` - Bad Request (validation error)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `429` - Too Many Requests (rate limited)
- `500` - Internal Server Error
- `503` - Service Unavailable (external service down)

### Rate Limit Headers

When rate limited, response includes:

```
Retry-After: 60
X-RateLimit-Remaining: 0
```

---

## 🚦 Rate Limiting

Different endpoints have different rate limits:

| Endpoint | Limit | Window |
|----------|-------|--------|
| Login | 5 requests | 15 minutes |
| Signup | 3 requests | 15 minutes |
| Forgot Password | 3 requests | 1 hour |
| Chat | 30 requests | 1 minute |
| Exam Generate | 10 requests | 1 minute |
| Exam | 20 requests | 1 minute |
| Default | 60 requests | 1 minute |

---

## 🔒 Authentication

Most endpoints require authentication via JWT token in HTTP-only cookie:

```
Cookie: auth_token=jwt_token_here
```

To authenticate:
1. Call `/api/auth/login` or `/api/auth/signup`
2. Token is automatically set in cookie
3. Include cookie in subsequent requests

---

## 📞 Support

For API issues:
- Check error response for details
- Review rate limiting headers
- Verify authentication token
- Contact support: api@paataai.com

---

**API Version:** 2.0  
**Last Updated:** January 2025


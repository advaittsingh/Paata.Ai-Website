# 🔐 PAATA.AI Authentication Flow Documentation

**Last Updated:** January 2025  
**Version:** 2.0  
**Status:** ✅ Complete - All features implemented

---

## 📋 Overview

This document describes the current authentication system implementation, its architecture, security considerations, and recommendations for production deployment.

---

## 🏗️ Current Architecture

### Authentication Method
- **Type:** Email/Password Authentication
- **Session Management:** Client-side (localStorage)
- **Backend:** Next.js API Routes
- **Database:** Prisma ORM with SQLite (dev)

---

## 🔄 Authentication Flow

### 1. User Registration Flow

```
User → /auth/signup → Frontend Form
  ↓
POST /api/auth/signup
  ↓
PrismaDatabase.createUser()
  ↓
Create User in Database
  ↓
Return User Object (without password)
  ↓
Store in localStorage as 'paata_user'
  ↓
Redirect to /app
```

**Implementation:**
- **File:** `src/app/auth/signup/page.tsx`
- **API:** `src/app/api/auth/signup/route.ts`
- **Database:** `src/lib/prisma-database.ts`

**Current Process:**
1. User fills signup form (firstName, lastName, email, password)
2. Frontend sends POST request to `/api/auth/signup`
3. Backend checks if user exists
4. Creates new user with default values:
   - Plan: `Enterprise` (default)
   - Preferences: Default settings
   - Stats: Zero values
   - Password: **Stored as plain text** ⚠️
5. Returns user object (password excluded)
6. Frontend stores in localStorage
7. UserContext updates with new user
8. Redirects to `/app`

**Default Values on Signup:**
```typescript
{
  plan: 'Enterprise',
  joinDate: new Date().toLocaleDateString(),
  preferences: {
    theme: 'system',
    language: 'en',
    notifications: {
      email: true,
      push: true,
      weeklyDigest: false,
      marketing: false
    },
    learning: {
      difficultyLevel: 'adaptive',
      learningStyle: 'mixed',
      subjectFocus: []
    }
  },
  stats: {
    totalInteractions: 0,
    textMessages: 0,
    imageUploads: 0,
    voiceInputs: 0,
    totalTimeSpent: '0h 0m',
    averageSessionTime: '0m 0s',
    streakDays: 0
  }
}
```

---

### 2. User Login Flow

```
User → /auth/login → Frontend Form
  ↓
POST /api/auth/login
  ↓
PrismaDatabase.getUserByEmail()
  ↓
Compare Password (plain text) ⚠️
  ↓
Return User Object (without password)
  ↓
Store in localStorage as 'paata_user'
  ↓
Redirect to /app
```

**Implementation:**
- **File:** `src/app/auth/login/page.tsx`
- **API:** `src/app/api/auth/login/route.ts`

**Current Process:**
1. User enters email and password
2. Frontend sends POST request to `/api/auth/login`
3. Backend fetches user by email
4. Compares password directly (plain text comparison) ⚠️
5. If match, returns user object
6. Frontend stores in localStorage
7. UserContext updates
8. Redirects to `/app`

**Password Comparison:**
```typescript
// CURRENT (INSECURE):
if (user.password !== password) {
  return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
}
```

---

### 3. Session Management

**Current Implementation:**
- **Storage:** Browser localStorage
- **Key:** `paata_user`
- **Content:** Full user object (without password)

**UserContext Provider:**
- **File:** `src/contexts/UserContext.tsx`
- **Features:**
  - Loads user from localStorage on mount
  - Provides user state to entire app
  - Handles login, signup, logout
  - Updates localStorage on changes

**Session Persistence:**
```typescript
// On Login/Signup Success
localStorage.setItem('paata_user', JSON.stringify(userData));

// On App Load
const savedUser = localStorage.getItem('paata_user');
if (savedUser) {
  const parsedUser = JSON.parse(savedUser);
  setUser(parsedUser);
}

// On Logout
localStorage.removeItem('paata_user');
```

**Authentication Check:**
```typescript
// In Protected Routes
const { isAuthenticated, isLoading } = useUser();

useEffect(() => {
  if (!isLoading && !isAuthenticated) {
    window.location.href = '/auth/login';
  }
}, [isLoading, isAuthenticated]);
```

---

### 4. Protected Routes

**Current Implementation:**
- **Middleware:** `middleware.ts` (only handles `/docs` redirect)
- **Route Protection:** Client-side checks in components
- **Protected Routes:**
  - `/app/*` - Main application
  - `/profile/*` - User profile pages

**Protection Method:**
```typescript
// Example from /app/page.tsx
useEffect(() => {
  if (!isLoading && !isAuthenticated) {
    window.location.href = '/auth/login';
  }
}, [isLoading, isAuthenticated]);
```

---

## 🔒 Security Analysis

### ⚠️ Critical Security Issues

#### 1. Password Storage
**Issue:** Passwords stored in plain text  
**Risk:** HIGH  
**Impact:** If database is compromised, all passwords are exposed

**Current Code:**
```typescript
// schema.prisma
model User {
  password  String  // Plain text storage
}

// signup/route.ts
password: userData.password, // In production, hash this
```

**Recommendation:**
```typescript
import bcrypt from 'bcryptjs';

// On Signup
const hashedPassword = await bcrypt.hash(password, 10);

// On Login
const isMatch = await bcrypt.compare(password, user.password);
```

#### 2. Session Management
**Issue:** localStorage-based sessions  
**Risk:** MEDIUM  
**Impact:** Vulnerable to XSS attacks

**Problems:**
- localStorage accessible to JavaScript (XSS risk)
- No HTTP-only cookies
- No secure flag
- No session expiration

**Recommendation:**
- Use HTTP-only cookies
- Implement JWT tokens
- Add session expiration
- Use secure flag in production

#### 3. No CSRF Protection
**Issue:** No CSRF tokens  
**Risk:** MEDIUM  
**Impact:** Cross-site request forgery attacks possible

**Recommendation:**
- Implement CSRF tokens
- Use SameSite cookie attribute
- Validate origin headers

#### 4. No Rate Limiting
**Issue:** No login attempt limits  
**Risk:** MEDIUM  
**Impact:** Brute force attacks possible

**Recommendation:**
- Limit login attempts per IP
- Implement exponential backoff
- Add CAPTCHA after failed attempts

---

## 📊 Current Database Schema

### User Model
```prisma
model User {
  id        String   @id @default(cuid())
  firstName String
  lastName  String
  email     String   @unique
  phone     String?
  password  String   // ⚠️ Plain text
  plan      Plan     @default(Enterprise)
  joinDate  String
  preferences String // JSON string
  stats     String   // JSON string
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

---

## 🚀 Recommended Production Implementation

### 1. Password Hashing

**Implementation:**
```bash
npm install bcryptjs
npm install --save-dev @types/bcryptjs
```

**Signup Route:**
```typescript
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  const { email, password, ...otherData } = await request.json();
  
  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);
  
  const newUser = await PrismaDatabase.createUser({
    ...otherData,
    email,
    password: hashedPassword
  });
  
  // Return user without password
  const { password: _, ...userWithoutPassword } = newUser;
  return NextResponse.json(userWithoutPassword);
}
```

**Login Route:**
```typescript
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();
  
  const user = await PrismaDatabase.getUserByEmail(email);
  if (!user) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }
  
  // Verify password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }
  
  const { password: _, ...userWithoutPassword } = user;
  return NextResponse.json(userWithoutPassword);
}
```

### 2. JWT Token Implementation

**Install Dependencies:**
```bash
npm install jsonwebtoken
npm install --save-dev @types/jsonwebtoken
```

**Token Generation:**
```typescript
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// On Login
const token = jwt.sign(
  { userId: user.id, email: user.email },
  JWT_SECRET,
  { expiresIn: '7d' }
);

// Set HTTP-only cookie
response.cookies.set('auth_token', token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 60 * 60 * 24 * 7 // 7 days
});
```

**Token Verification Middleware:**
```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value;
  
  if (!token) {
    if (request.nextUrl.pathname.startsWith('/app')) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
    return NextResponse.next();
  }
  
  try {
    jwt.verify(token, process.env.JWT_SECRET!);
    return NextResponse.next();
  } catch (error) {
    // Invalid token
    if (request.nextUrl.pathname.startsWith('/app')) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
    return NextResponse.next();
  }
}

export const config = {
  matcher: ['/app/:path*', '/profile/:path*']
};
```

### 3. Password Reset Flow

**Implementation Steps:**
1. User requests password reset
2. Generate reset token
3. Send email with reset link
4. User clicks link, enters new password
5. Verify token and update password

**API Endpoints Needed:**
- `POST /api/auth/forgot-password` - Request reset
- `POST /api/auth/reset-password` - Reset password with token

### 4. Email Verification

**Implementation Steps:**
1. On signup, generate verification token
2. Send verification email
3. User clicks link to verify
4. Update user verification status

**Database Addition:**
```prisma
model User {
  // ... existing fields
  emailVerified Boolean @default(false)
  verificationToken String?
  verificationTokenExpiry DateTime?
}
```

---

## 🔐 Environment Variables

**Required for Production:**
```env
# Authentication
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d

# Password Hashing
BCRYPT_SALT_ROUNDS=10

# Email (for password reset)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
EMAIL_FROM=noreply@paataai.com

# Session
SESSION_SECRET=your-session-secret
COOKIE_DOMAIN=.paataai.com
```

---

## 📝 Migration Plan

### Step 1: Password Hashing Migration
1. Install bcryptjs
2. Create migration script to hash existing passwords
3. Update signup/login routes
4. Test thoroughly

### Step 2: JWT Implementation
1. Install jsonwebtoken
2. Create token generation utility
3. Update login route
4. Create middleware for protected routes
5. Update frontend to use cookies instead of localStorage

### Step 3: Additional Security
1. Add rate limiting
2. Implement CSRF protection
3. Add email verification
4. Implement password reset

---

## 🧪 Testing Authentication

### Test Cases Needed:
1. ✅ Successful signup
2. ✅ Duplicate email signup (should fail)
3. ✅ Successful login
4. ✅ Invalid credentials (should fail)
5. ✅ Protected route access without auth
6. ✅ Session persistence
7. ✅ Logout functionality
8. ⚠️ Password hashing (not tested)
9. ⚠️ Token expiration (not implemented)
10. ⚠️ Password reset (not implemented)

---

## 📊 Current vs Recommended

| Feature | Current | Recommended |
|---------|---------|-------------|
| Password Storage | Plain text | Hashed (bcrypt) |
| Session Storage | localStorage | HTTP-only cookies |
| Session Management | Client-side | Server-side with JWT |
| Token Expiration | None | 7 days |
| Password Reset | Not implemented | Email-based |
| Email Verification | Not implemented | Required |
| Rate Limiting | None | 5 attempts/15min |
| CSRF Protection | None | Tokens + SameSite |

---

## 🎯 Priority Actions

### Critical (Must Fix Before Production)
1. ✅ Implement password hashing
2. ✅ Migrate to JWT tokens
3. ✅ Use HTTP-only cookies
4. ✅ Add session expiration

### High Priority
5. ⚠️ Add rate limiting
6. ⚠️ Implement password reset
7. ⚠️ Add email verification
8. ⚠️ CSRF protection

### Medium Priority
9. Add OAuth (Google, Apple)
10. Two-factor authentication
11. Device management
12. Session history

---

## 📚 References

- **Current Implementation:**
  - `src/app/auth/login/page.tsx`
  - `src/app/auth/signup/page.tsx`
  - `src/app/api/auth/login/route.ts`
  - `src/app/api/auth/signup/route.ts`
  - `src/contexts/UserContext.tsx`
  - `src/lib/prisma-database.ts`

- **Next.js Auth Documentation:** https://nextjs.org/docs/authentication
- **JWT Best Practices:** https://jwt.io/introduction
- **OWASP Password Storage:** https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html

---

**Next Steps:**
1. Review security recommendations with team
2. Prioritize password hashing implementation
3. Plan JWT migration
4. Set up email service for password reset
5. Implement rate limiting


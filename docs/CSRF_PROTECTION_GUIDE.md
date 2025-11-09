# 🔒 CSRF Protection Implementation Guide

**Last Updated:** January 2025  
**Status:** ✅ Fully Implemented

---

## 📋 Overview

CSRF (Cross-Site Request Forgery) protection has been fully integrated into PAATA.AI to prevent unauthorized actions from malicious websites.

---

## ✅ Implementation Status

### Backend
- ✅ CSRF token generation utility
- ✅ CSRF token verification utility
- ✅ CSRF token API endpoint (`/api/csrf-token`)
- ✅ CSRF protection integrated into:
  - Login endpoint
  - Signup endpoint
  - Change password endpoint
  - Reset password endpoint

### Frontend
- ✅ React hook for CSRF tokens (`useCsrfToken`)
- ✅ CSRF tokens automatically included in authentication requests
- ✅ Graceful degradation (works without token in development)

---

## 🔧 How It Works

### 1. Token Generation

When a user visits the site:
1. Frontend calls `/api/csrf-token`
2. Server generates a random 64-character hex token
3. Token is stored in HTTP-only cookie (`csrf_token`)
4. Token is returned to client

### 2. Token Usage

When submitting forms:
1. Frontend includes CSRF token in request:
   - Either in request body: `{ csrfToken: "..." }`
   - Or in header: `X-CSRF-Token: ...`
2. Server verifies token matches cookie
3. Request proceeds if valid, rejected if invalid

### 3. Security Features

- **HTTP-only cookies**: Tokens stored in HTTP-only cookies (not accessible via JavaScript)
- **Secure cookies**: In production, cookies are only sent over HTTPS
- **SameSite: Strict**: Cookies only sent with same-site requests
- **Constant-time comparison**: Prevents timing attacks
- **Token expiration**: Tokens expire after 1 hour

---

## 📝 Usage

### For Developers

#### Getting CSRF Token in Frontend

```typescript
import { useCsrfToken } from '@/hooks/useCsrfToken';

function MyComponent() {
  const { csrfToken, isLoading } = useCsrfToken();
  
  const handleSubmit = async (data: any) => {
    const response = await fetch('/api/endpoint', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(csrfToken && { 'X-CSRF-Token': csrfToken }),
      },
      body: JSON.stringify({
        ...data,
        ...(csrfToken && { csrfToken }),
      }),
    });
  };
}
```

#### Verifying CSRF Token in API Routes

```typescript
import { extractCsrfToken, verifyCsrfToken } from '@/lib/csrf';

export async function POST(request: NextRequest) {
  // Extract token and body
  const { token: csrfToken, body: requestBody } = await extractCsrfToken(request);
  
  // Verify token (only in production or if enabled)
  if (process.env.ENABLE_CSRF_PROTECTION === 'true' || process.env.NODE_ENV === 'production') {
    if (!csrfToken) {
      return NextResponse.json(
        { error: 'CSRF token is required' },
        { status: 403 }
      );
    }
    
    const isValid = await verifyCsrfToken(request, csrfToken);
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid CSRF token' },
        { status: 403 }
      );
    }
  }
  
  // Use requestBody instead of await request.json()
  const { email, password } = requestBody;
  // ... rest of your logic
}
```

---

## ⚙️ Configuration

### Environment Variables

Add to `.env` or `.env.production`:

```env
# Enable CSRF protection (optional)
# If not set, CSRF is enabled in production only
ENABLE_CSRF_PROTECTION=true
```

### Production vs Development

- **Production**: CSRF protection is **enabled by default**
- **Development**: CSRF protection is **disabled by default** (unless `ENABLE_CSRF_PROTECTION=true`)

This allows for easier development while maintaining security in production.

---

## 🔍 Protected Endpoints

The following endpoints require CSRF tokens:

1. **POST** `/api/auth/login` - User login
2. **POST** `/api/auth/signup` - User registration
3. **POST** `/api/auth/change-password` - Change password
4. **POST** `/api/auth/reset-password` - Reset password

---

## 🧪 Testing

### Test CSRF Protection

1. **Get CSRF Token:**
```bash
curl -X GET http://localhost:3000/api/csrf-token \
  -H "Cookie: csrf_token=existing_token" \
  -c cookies.txt
```

2. **Use Token in Request:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -H "X-CSRF-Token: YOUR_TOKEN_HERE" \
  -b cookies.txt \
  -d '{"email":"user@example.com","password":"password123","csrfToken":"YOUR_TOKEN_HERE"}'
```

3. **Test Invalid Token:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -H "X-CSRF-Token: invalid_token" \
  -b cookies.txt \
  -d '{"email":"user@example.com","password":"password123"}'
```
Should return: `403 Forbidden - Invalid CSRF token`

---

## 🛡️ Security Best Practices

1. **Always use HTTPS in production** - CSRF tokens in cookies are only secure over HTTPS
2. **Rotate tokens periodically** - Tokens expire after 1 hour
3. **Don't expose tokens in logs** - Tokens are sensitive data
4. **Validate on all state-changing operations** - POST, PUT, DELETE, PATCH
5. **Use SameSite cookies** - Already configured in implementation

---

## 🐛 Troubleshooting

### "CSRF token is required" Error

**Cause:** CSRF token not included in request

**Solution:**
1. Ensure frontend calls `/api/csrf-token` before making requests
2. Include token in request body or header
3. Check that cookies are enabled in browser

### "Invalid CSRF token" Error

**Cause:** Token in request doesn't match token in cookie

**Solution:**
1. Ensure token is fetched fresh for each session
2. Check that cookies are being sent (credentials: 'include')
3. Verify token is not being modified in transit

### CSRF Protection Not Working in Development

**Expected Behavior:** CSRF protection is disabled in development by default

**To Enable:**
```env
ENABLE_CSRF_PROTECTION=true
```

---

## 📚 Additional Resources

- [OWASP CSRF Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html)
- [Next.js Security Best Practices](https://nextjs.org/docs/app/building-your-application/configuring/security-headers)

---

## ✅ Summary

CSRF protection is now fully integrated and active in production. The implementation:

- ✅ Generates secure, random tokens
- ✅ Stores tokens in HTTP-only cookies
- ✅ Verifies tokens on all authentication endpoints
- ✅ Gracefully degrades in development
- ✅ Provides clear error messages
- ✅ Follows security best practices

**Status:** ✅ **Production Ready**

---

**Last Updated:** January 2025


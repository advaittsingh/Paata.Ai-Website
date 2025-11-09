# 📱 Mobile App Implementation Guide

**Date:** January 2025  
**Version:** 2.0  
**Status:** Updated with Latest Features

---

## 📋 Overview

This document provides a comprehensive guide for implementing the latest web features in the mobile app. It covers all recently added features including payment methods, password reset, flashcards delete, and loading states.

---

## 🔄 Recently Added Features (Need Mobile Implementation)

### 1. Payment Method Management

#### Update Payment Method
- **Endpoint:** `PUT /api/payment-methods`
- **Request Body:**
  ```json
  {
    "paymentMethodId": "string"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "Default payment method updated"
  }
  ```
- **Mobile Implementation:**
  - Add UI to set a payment method as default
  - Call API when user selects "Set as Default"
  - Show success/error feedback
  - Refresh payment methods list after update

#### Remove Payment Method
- **Endpoint:** `DELETE /api/payment-methods?id={paymentMethodId}`
- **Response:**
  ```json
  {
    "success": true,
    "message": "Payment method deleted"
  }
  ```
- **Mobile Implementation:**
  - Add delete button/action for each payment method
  - Show confirmation dialog before deletion
  - Call DELETE endpoint
  - Remove from UI on success
  - Handle error cases (e.g., cannot delete default method)

---

### 2. Password Reset Flow

#### Forgot Password
- **Endpoint:** `POST /api/auth/forgot-password`
- **Request Body:**
  ```json
  {
    "email": "user@example.com"
  }
  ```
- **Response:**
  ```json
  {
    "message": "If an account with that email exists, a password reset link has been sent."
  }
  ```
- **Mobile Implementation:**
  - Create "Forgot Password" screen
  - Email input field
  - Submit button
  - Show success message (always show same message for security)
  - Link back to login screen
  - Handle rate limiting (429 status)

#### Reset Password
- **Endpoint:** `GET /api/auth/reset-password?token={token}` (verify token)
- **Endpoint:** `POST /api/auth/reset-password` (reset password)
- **Request Body:**
  ```json
  {
    "token": "reset-token-from-email",
    "newPassword": "newSecurePassword123",
    "csrfToken": "csrf-token" // Optional, only if CSRF enabled
  }
  ```
- **Response:**
  ```json
  {
    "message": "Password has been reset successfully. You can now login with your new password."
  }
  ```
- **Mobile Implementation:**
  - Create "Reset Password" screen
  - Extract token from deep link (when user clicks email link)
  - Verify token validity on screen load
  - Show token invalid/expired message if needed
  - New password input (with strength indicator)
  - Confirm password input
  - Submit button
  - Redirect to login on success
  - Handle CSRF token if enabled (fetch from `/api/csrf-token`)

#### Deep Link Handling
- **Deep Link Format:** `paataai://reset-password?token={resetToken}`
- **Implementation:**
  - Configure deep link handling in mobile app
  - Extract token from URL parameters
  - Navigate to reset password screen with token
  - Handle invalid/missing tokens gracefully

---

### 3. Flashcards Delete

#### Delete Flashcard
- **Endpoint:** `DELETE /api/flashcards?id={flashcardId}`
- **Response:**
  ```json
  {
    "success": true,
    "message": "Flashcard deleted successfully"
  }
  ```
- **Mobile Implementation:**
  - Add delete action to flashcard menu/options
  - Show confirmation dialog
  - Call DELETE endpoint
  - Remove from local cache/list
  - Update UI immediately (optimistic update)
  - Handle errors (show error message if deletion fails)

---

### 4. Loading States

#### Loading Skeletons
- **Web Implementation:** Uses `LoadingSkeleton`, `CardGridSkeleton`, `TableSkeleton` components
- **Mobile Implementation:**
  - Create equivalent loading skeleton components
  - Show skeletons while fetching:
    - Notes list
    - Flashcards list
    - Achievements list
    - Focus sessions
    - Usage statistics
    - Settings data
  - Replace skeletons with actual content when data loads
  - Handle error states (show error message instead of skeleton)

---

## 📱 Existing Mobile API Endpoints

### Authentication
- `POST /api/mobile/auth/login` - Mobile login
- `POST /api/mobile/auth/signup` - Mobile signup
- `GET /api/mobile/auth/verify` - Verify authentication

### Chat
- `POST /api/mobile/chat` - Send chat message
- `POST /api/mobile/voice` - Voice input
- `POST /api/mobile/upload` - File upload

### Profile
- `GET /api/mobile/profile` - Get user profile and usage data

### OCR
- `POST /api/mobile/ocr` - Image OCR processing

### TTS
- `POST /api/mobile/tts` - Text-to-speech

### Configuration
- `GET /api/mobile/config` - Get mobile app configuration

---

## 🔧 Implementation Checklist

### Payment Methods
- [ ] Add "Set as Default" button/action for payment methods
- [ ] Implement payment method update API call
- [ ] Add delete button/action for payment methods
- [ ] Implement payment method delete API call
- [ ] Show confirmation dialogs
- [ ] Handle errors (cannot delete default, etc.)
- [ ] Refresh payment methods list after changes
- [ ] Update UI state optimistically

### Password Reset
- [ ] Create "Forgot Password" screen
- [ ] Implement forgot password API call
- [ ] Create "Reset Password" screen
- [ ] Implement token verification API call
- [ ] Implement password reset API call
- [ ] Configure deep link handling
- [ ] Extract token from deep link URL
- [ ] Show password strength indicator
- [ ] Handle token expiry/invalid cases
- [ ] Redirect to login on success
- [ ] Handle CSRF token (if enabled)

### Flashcards
- [ ] Add delete action to flashcard menu
- [ ] Implement delete flashcard API call
- [ ] Show confirmation dialog
- [ ] Remove from local cache
- [ ] Update UI optimistically
- [ ] Handle errors gracefully

### Loading States
- [ ] Create loading skeleton components
- [ ] Add skeletons to Notes screen
- [ ] Add skeletons to Flashcards screen
- [ ] Add skeletons to Achievements screen
- [ ] Add skeletons to Focus screen
- [ ] Add skeletons to Usage/Stats screen
- [ ] Add skeletons to Settings screen
- [ ] Handle error states

---

## 📐 API Integration Patterns

### Standard Error Handling
```typescript
try {
  const response = await fetch('/api/endpoint', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`, // If using JWT
    },
    body: JSON.stringify(data),
  });

  if (response.ok) {
    const result = await response.json();
    // Handle success
  } else {
    const error = await response.json();
    // Handle error
    throw new Error(error.error || 'Request failed');
  }
} catch (error) {
  // Handle network error
  console.error('API Error:', error);
}
```

### CSRF Token Handling (if enabled)
```typescript
// Fetch CSRF token first
const csrfResponse = await fetch('/api/csrf-token', {
  credentials: 'include',
});
const { csrfToken } = await csrfResponse.json();

// Include in request
const response = await fetch('/api/endpoint', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-CSRF-Token': csrfToken,
  },
  credentials: 'include',
  body: JSON.stringify({
    ...data,
    csrfToken,
  }),
});
```

### Deep Link Handling (React Native)
```typescript
import { Linking } from 'react-native';

// Listen for deep links
useEffect(() => {
  const handleDeepLink = (url: string) => {
    if (url.includes('reset-password')) {
      const token = extractTokenFromUrl(url);
      navigate('ResetPassword', { token });
    }
  };

  Linking.addEventListener('url', ({ url }) => {
    handleDeepLink(url);
  });

  // Check if app opened from deep link
  Linking.getInitialURL().then((url) => {
    if (url) handleDeepLink(url);
  });
}, []);
```

---

## 🎨 UI/UX Recommendations

### Payment Methods
- Show default badge on default payment method
- Disable delete button for default method
- Show loading state during update/delete
- Use swipe-to-delete gesture (iOS/Android pattern)
- Show success toast after update

### Password Reset
- Match web styling for consistency
- Show clear error messages
- Password strength indicator (visual bars)
- Auto-focus next field
- Show/hide password toggle
- Disable submit until form is valid

### Flashcards
- Long-press to show delete option
- Swipe-to-delete gesture
- Show confirmation modal
- Optimistic UI update
- Undo functionality (optional)

### Loading States
- Match web skeleton design
- Animate skeleton shimmer
- Show appropriate skeleton type (list, grid, card)
- Transition smoothly from skeleton to content

---

## 🔐 Security Considerations

### Authentication
- Store JWT tokens securely (Keychain/Keystore)
- Implement token refresh logic
- Handle token expiry gracefully
- Clear tokens on logout

### CSRF Protection
- Fetch CSRF token before state-changing requests
- Include token in headers or body
- Handle CSRF errors (403) gracefully
- Re-fetch token if expired

### Deep Links
- Validate token before showing reset screen
- Expire tokens after use
- Handle malicious links gracefully
- Show appropriate error messages

---

## 📊 Testing Checklist

### Payment Methods
- [ ] Test setting payment method as default
- [ ] Test deleting non-default payment method
- [ ] Test attempting to delete default (should fail/disable)
- [ ] Test error handling (network errors, API errors)
- [ ] Test UI updates after changes

### Password Reset
- [ ] Test forgot password flow
- [ ] Test deep link handling
- [ ] Test token verification
- [ ] Test password reset with valid token
- [ ] Test password reset with expired token
- [ ] Test password reset with invalid token
- [ ] Test password strength validation
- [ ] Test password mismatch handling
- [ ] Test CSRF token handling (if enabled)

### Flashcards
- [ ] Test deleting flashcard
- [ ] Test confirmation dialog
- [ ] Test error handling
- [ ] Test UI update after deletion
- [ ] Test with multiple flashcards

### Loading States
- [ ] Test skeleton display on all screens
- [ ] Test skeleton-to-content transition
- [ ] Test error state display
- [ ] Test with slow network (simulate)

---

## 📝 API Response Examples

### Payment Method Update
```json
{
  "success": true,
  "message": "Default payment method updated"
}
```

### Payment Method Delete
```json
{
  "success": true,
  "message": "Payment method deleted"
}
```

### Forgot Password
```json
{
  "message": "If an account with that email exists, a password reset link has been sent."
}
```

### Reset Password (Token Verification)
```json
{
  "valid": true,
  "email": "user@example.com"
}
```

### Reset Password (Invalid Token)
```json
{
  "valid": false,
  "error": "Invalid or expired token"
}
```

### Reset Password (Success)
```json
{
  "message": "Password has been reset successfully. You can now login with your new password."
}
```

### Flashcard Delete
```json
{
  "success": true,
  "message": "Flashcard deleted successfully"
}
```

---

## 🔗 Related Documentation

- [API Documentation](./API_DOCUMENTATION.md) - Complete API reference
- [Authentication Flow](./AUTH_FLOW_DOCUMENTATION.md) - Authentication details
- [Subscription Management](./SUBSCRIPTION_MANAGEMENT_DOCUMENTATION.md) - Billing details
- [Database Schema](./DATABASE_SCHEMA_DOCUMENTATION.md) - Database structure

---

## 📞 Support

For questions or issues with mobile implementation:
1. Check existing API documentation
2. Review web implementation for reference
3. Test API endpoints with Postman/curl
4. Check server logs for errors

---

**Last Updated:** January 2025  
**Version:** 2.0


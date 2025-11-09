# 🧪 Testing Setup Guide

**Last Updated:** January 2025  
**Status:** ✅ Infrastructure Complete

---

## 📋 Overview

Testing infrastructure has been set up with Jest and React Testing Library.

---

## ✅ Implementation Status

### Infrastructure
- ✅ Jest configuration (`jest.config.js`)
- ✅ Jest setup file (`jest.setup.js`)
- ✅ Example test files
- ✅ Next.js integration
- ✅ TypeScript support

### Test Files Created
- ✅ `src/__tests__/utils.test.ts` - Utility function tests
- ✅ `src/__tests__/components/ErrorBoundary.test.tsx` - Component tests

---

## 🔧 Setup Instructions

### 1. Install Dependencies

```bash
npm install --save-dev jest jest-environment-jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

### 2. Run Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

### 3. Add Test Script to package.json

Add to `package.json`:

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

---

## 📝 Writing Tests

### Example: Component Test

```typescript
// src/__tests__/components/Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import Button from '@/components/button';

describe('Button', () => {
  it('should render button text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('should call onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### Example: API Route Test

```typescript
// src/__tests__/api/auth/login.test.ts
import { POST } from '@/app/api/auth/login/route';
import { NextRequest } from 'next/server';

describe('POST /api/auth/login', () => {
  it('should return 400 for missing credentials', async () => {
    const request = new NextRequest('http://localhost:3000/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({}),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBeDefined();
  });
});
```

### Example: Utility Function Test

```typescript
// src/__tests__/utils/csrf.test.ts
import { generateCsrfToken, verifyCsrfToken } from '@/lib/csrf';

describe('CSRF Token', () => {
  it('should generate unique tokens', () => {
    const token1 = generateCsrfToken();
    const token2 = generateCsrfToken();
    
    expect(token1).not.toBe(token2);
  });
});
```

---

## 🎯 Test Coverage Goals

### Current Coverage
- ✅ Utility functions (CSRF, password hashing, error logging)
- ✅ Error boundary component

### Recommended Coverage
- 🔵 API routes (authentication, subscriptions, chat)
- 🔵 Core components (Navbar, Cards, Forms)
- 🔵 Context providers (UserContext)
- 🔵 Custom hooks

---

## 📊 Test Structure

```
src/
  __tests__/
    components/
      ErrorBoundary.test.tsx
      Button.test.tsx
    utils/
      csrf.test.ts
      auth-utils.test.ts
    api/
      auth/
        login.test.ts
        signup.test.ts
```

---

## 🔍 Mocking

### Next.js Router
Already mocked in `jest.setup.js`:

```typescript
import { useRouter } from 'next/router';

// Mocked automatically
const router = useRouter();
router.push('/path'); // Mocked
```

### Fetch API
Already mocked in `jest.setup.js`:

```typescript
global.fetch = jest.fn();

// In your test
fetch.mockResolvedValue({
  ok: true,
  json: async () => ({ data: 'test' }),
});
```

### localStorage
Already mocked in `jest.setup.js`:

```typescript
localStorage.setItem('key', 'value'); // Mocked
localStorage.getItem('key'); // Returns mocked value
```

---

## 🚀 Best Practices

1. **Test Behavior, Not Implementation**
   - Test what the user sees/interacts with
   - Don't test internal state directly

2. **Use Descriptive Test Names**
   ```typescript
   // ✅ Good
   it('should show error message when login fails', () => {});
   
   // ❌ Bad
   it('test login', () => {});
   ```

3. **Test Edge Cases**
   - Empty states
   - Error states
   - Loading states
   - Boundary conditions

4. **Keep Tests Independent**
   - Each test should work in isolation
   - Don't rely on test execution order

---

## 📊 Current Status

✅ **Infrastructure**: 100% Complete
- Jest configuration
- React Testing Library setup
- Example tests
- Mocks configured

🔵 **Test Coverage**: Starter tests created
- Can be expanded as needed

---

## 🚀 Next Steps

1. **Install dependencies** (if not already installed)
2. **Run tests** to verify setup works
3. **Add more tests** for critical features
4. **Set up CI/CD** to run tests automatically

---

**Status:** ✅ **Ready for Testing** - Infrastructure complete, ready to write tests!


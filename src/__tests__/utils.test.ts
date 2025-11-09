/**
 * Example test file - Utility functions
 * Run tests with: npm test
 */

describe('Utility Functions', () => {
  describe('Error Logging', () => {
    it('should export error logging functions', () => {
      const errorLogging = require('@/lib/error-logging');
      
      expect(errorLogging).toHaveProperty('logError');
      expect(errorLogging).toHaveProperty('logWarning');
      expect(errorLogging).toHaveProperty('logInfo');
      expect(errorLogging).toHaveProperty('captureMessage');
      expect(errorLogging).toHaveProperty('setUserContext');
      expect(errorLogging).toHaveProperty('clearUserContext');
      expect(errorLogging).toHaveProperty('addBreadcrumb');
    });

    it('should log errors without crashing', () => {
      const { logError } = require('@/lib/error-logging');
      
      expect(() => {
        logError(new Error('Test error'));
      }).not.toThrow();
    });
  });

  describe('CSRF Token', () => {
    it('should have CSRF utilities', () => {
      const csrf = require('@/lib/csrf');
      
      expect(csrf).toHaveProperty('generateCsrfToken');
      expect(csrf).toHaveProperty('verifyCsrfToken');
      expect(csrf).toHaveProperty('extractCsrfToken');
    });

    it('should generate valid CSRF tokens', () => {
      const { generateCsrfToken } = require('@/lib/csrf');
      
      const token1 = generateCsrfToken();
      const token2 = generateCsrfToken();
      
      expect(token1).toBeTruthy();
      expect(token2).toBeTruthy();
      expect(token1).not.toBe(token2); // Tokens should be unique
      expect(token1.length).toBeGreaterThan(0);
    });
  });

  describe('Password Hashing', () => {
    it('should hash passwords', async () => {
      const { hashPassword, verifyPassword } = require('@/lib/auth-utils');
      
      const password = 'testPassword123';
      const hashed = await hashPassword(password);
      
      expect(hashed).toBeTruthy();
      expect(hashed).not.toBe(password);
      expect(hashed).toMatch(/^\$2[ab]\$/); // bcrypt hash format
      
      const isValid = await verifyPassword(password, hashed);
      expect(isValid).toBe(true);
    });

    it('should reject incorrect passwords', async () => {
      const { hashPassword, verifyPassword } = require('@/lib/auth-utils');
      
      const password = 'testPassword123';
      const wrongPassword = 'wrongPassword';
      const hashed = await hashPassword(password);
      
      const isValid = await verifyPassword(wrongPassword, hashed);
      expect(isValid).toBe(false);
    });
  });
});


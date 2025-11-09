import { NextRequest } from 'next/server';
import { PrismaDatabase } from './prisma-database';

/**
 * Get user's browser/device info from request
 */
export function getUserAgent(request: NextRequest): string {
  return request.headers.get('user-agent') || 'Unknown Browser';
}

/**
 * Get user's IP address from request
 */
export function getIpAddress(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded 
    ? forwarded.split(',')[0].trim() 
    : request.headers.get('x-real-ip') || 'unknown';
  return ip;
}

/**
 * Get location from IP (simplified - in production, use a geolocation service)
 */
export function getLocationFromIp(ip: string): string {
  // Simplified location detection
  // In production, use a service like MaxMind GeoIP2, ipapi.co, or ip-api.com
  if (ip === 'unknown' || ip === '127.0.0.1' || ip === '::1') {
    return 'Local';
  }
  
  // For now, return a placeholder
  // In production, integrate with a geolocation API
  return 'Unknown Location';
}

/**
 * Parse browser name from user agent
 */
export function parseBrowser(userAgent: string): string {
  if (userAgent.includes('Chrome') && !userAgent.includes('Edg')) return 'Chrome';
  if (userAgent.includes('Firefox')) return 'Firefox';
  if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) return 'Safari';
  if (userAgent.includes('Edg')) return 'Edge';
  if (userAgent.includes('Opera')) return 'Opera';
  if (userAgent.includes('Brave')) return 'Brave Browser';
  return 'Unknown Browser';
}

/**
 * Track login session
 */
export async function trackLogin(userId: string, request: NextRequest): Promise<string> {
  try {
    const userAgent = getUserAgent(request);
    const ipAddress = getIpAddress(request);
    const location = getLocationFromIp(ipAddress);
    const browser = parseBrowser(userAgent);

    // Create login session record
    // Note: We'll need to add this to PrismaDatabase
    const sessionId = `cl${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    
    // Store in user preferences for now (until we add proper LoginSession model)
    const user = await PrismaDatabase.getUserById(userId);
    if (!user) return sessionId;

    const preferences = typeof user.preferences === 'string'
      ? JSON.parse(user.preferences)
      : user.preferences;

    const loginSessions = preferences.loginSessions || [];
    
    // Add new session
    loginSessions.push({
      id: sessionId,
      browser,
      userAgent,
      ipAddress,
      location,
      loginAt: new Date().toISOString(),
      isActive: true,
    });

    // Keep only last 20 sessions
    if (loginSessions.length > 20) {
      loginSessions.shift();
    }

    preferences.loginSessions = loginSessions;

    await PrismaDatabase.updateUser(userId, {
      preferences: JSON.stringify(preferences),
    });

    return sessionId;
  } catch (error) {
    console.error('Error tracking login:', error);
    return `session_${Date.now()}`;
  }
}

/**
 * Get login history for user
 */
export async function getLoginHistory(userId: string): Promise<any[]> {
  try {
    const user = await PrismaDatabase.getUserById(userId);
    if (!user) return [];

    const preferences = typeof user.preferences === 'string'
      ? JSON.parse(user.preferences)
      : user.preferences;

    const loginSessions = preferences.loginSessions || [];
    
    // Sort by login time (most recent first)
    return loginSessions
      .sort((a: any, b: any) => new Date(b.loginAt).getTime() - new Date(a.loginAt).getTime())
      .slice(0, 10); // Return last 10 sessions
  } catch (error) {
    console.error('Error getting login history:', error);
    return [];
  }
}

/**
 * Mark session as ended
 */
export async function endSession(userId: string, sessionId: string): Promise<void> {
  try {
    const user = await PrismaDatabase.getUserById(userId);
    if (!user) return;

    const preferences = typeof user.preferences === 'string'
      ? JSON.parse(user.preferences)
      : user.preferences;

    const loginSessions = preferences.loginSessions || [];
    const sessionIndex = loginSessions.findIndex((s: any) => s.id === sessionId);
    
    if (sessionIndex !== -1) {
      loginSessions[sessionIndex].isActive = false;
      loginSessions[sessionIndex].logoutAt = new Date().toISOString();
      
      preferences.loginSessions = loginSessions;
      await PrismaDatabase.updateUser(userId, {
        preferences: JSON.stringify(preferences),
      });
    }
  } catch (error) {
    console.error('Error ending session:', error);
  }
}


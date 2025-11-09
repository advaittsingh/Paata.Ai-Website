import { PrismaClient } from '@prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';

// Prevent multiple instances of Prisma Client in development
const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof createPrismaClient> | undefined;
};

// Helper to check if Prisma client has Board model
function hasBoardModel(client: any): boolean {
  try {
    // Check if board property exists and has Prisma methods (like findMany)
    const boardModel = (client as any).board;
    if (!boardModel || typeof boardModel !== 'object') {
      return false;
    }
    // Verify it has Prisma methods (findMany is a key method)
    return typeof boardModel.findMany === 'function';
  } catch {
    return false;
  }
}

// Create or reuse Prisma client instance with Accelerate
function createPrismaClient() {
  // Use PRISMA_DATABASE_URL if set (for when DATABASE_URL is managed by Vercel Postgres)
  // Otherwise fall back to DATABASE_URL
  const databaseUrl = process.env.PRISMA_DATABASE_URL || process.env.DATABASE_URL;
  
  if (!databaseUrl) {
    console.error('[Prisma] No DATABASE_URL or PRISMA_DATABASE_URL found!');
    throw new Error('DATABASE_URL or PRISMA_DATABASE_URL environment variable is required');
  }
  
  // CRITICAL: Check if trying to use SQLite (won't work on Vercel)
  if (databaseUrl.startsWith('file:') || databaseUrl.includes('dev.db')) {
    console.error('[Prisma] ERROR: SQLite connection string detected!');
    console.error('[Prisma] SQLite does not work on Vercel. Please use PostgreSQL.');
    console.error('[Prisma] Current DATABASE_URL:', databaseUrl.substring(0, 50) + '...');
    throw new Error('SQLite is not supported on Vercel. Please set DATABASE_URL to a PostgreSQL connection string.');
  }
  
  // Check if we're using Prisma Accelerate (connection string starts with prisma+)
  const isUsingAccelerate = databaseUrl.startsWith('prisma+');
  
  // Verify it's PostgreSQL
  if (!databaseUrl.startsWith('postgresql://') && !databaseUrl.startsWith('postgres://') && !isUsingAccelerate) {
    console.error('[Prisma] ERROR: Invalid database connection string!');
    console.error('[Prisma] Expected postgresql:// or prisma+postgres://');
    console.error('[Prisma] Got:', databaseUrl.substring(0, 50) + '...');
    throw new Error('Invalid DATABASE_URL format. Expected PostgreSQL connection string.');
  }
  
  console.log('[Prisma] Creating client with:', isUsingAccelerate ? 'Prisma Accelerate' : 'PostgreSQL Direct connection');
  console.log('[Prisma] Connection string preview:', databaseUrl.substring(0, 50) + '...');
  
  const baseClient = new PrismaClient({
    datasources: {
      db: {
        url: databaseUrl,
      },
    },
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn', 'query'] : ['error'],
  });
  
  // Extend with Accelerate if using Accelerate connection string
  const client = isUsingAccelerate 
    ? baseClient.$extends(withAccelerate())
    : baseClient;
  
  // Verify Board model exists immediately after creation
  if (!hasBoardModel(client)) {
    console.error('[Prisma] CRITICAL: Board model not found in newly created Prisma client!');
    console.error('[Prisma] This means the Prisma client was not regenerated after schema changes.');
    console.error('[Prisma] Please run: npx prisma generate');
    throw new Error('Prisma client missing Board model. Run: npx prisma generate');
  }
  
  if (isUsingAccelerate) {
    console.log('[Prisma] ✓ Prisma Accelerate enabled');
  }
  
  return client;
}

// Lazy initialization - only create client when actually used (not during build)
function getPrismaClient(): ReturnType<typeof createPrismaClient> {
  // Check if we already have a cached instance
  if (globalForPrisma.prisma) {
    return globalForPrisma.prisma;
  }

  // Check if DATABASE_URL is available (might not be during build)
  const databaseUrl = process.env.PRISMA_DATABASE_URL || process.env.DATABASE_URL;
  if (!databaseUrl) {
    // During build, DATABASE_URL might not be available
    // Return a mock client that throws helpful errors when methods are called
    // This prevents build-time errors while still catching runtime issues
    return {
      $connect: async () => { throw new Error('DATABASE_URL not available during build'); },
      $disconnect: async () => {},
      $extends: () => { throw new Error('DATABASE_URL not available during build'); },
      $on: () => {},
      $transaction: async () => { throw new Error('DATABASE_URL not available during build'); },
      $use: () => {},
      $queryRaw: async () => { throw new Error('DATABASE_URL not available during build'); },
      $queryRawUnsafe: async () => { throw new Error('DATABASE_URL not available during build'); },
      $executeRaw: async () => { throw new Error('DATABASE_URL not available during build'); },
      $executeRawUnsafe: async () => { throw new Error('DATABASE_URL not available during build'); },
      user: { findUnique: async () => { throw new Error('DATABASE_URL not available during build'); } },
      achievement: { count: async () => { throw new Error('DATABASE_URL not available during build'); } },
    } as any;
  }

  // Create new instance
  const client = createPrismaClient();
  globalForPrisma.prisma = client;
  return client;
}

// Export a proxy that lazily initializes the client only when methods are called
export const prisma = new Proxy({} as ReturnType<typeof createPrismaClient>, {
  get(_target, prop) {
    const client = getPrismaClient();
    const value = (client as any)[prop];
    if (typeof value === 'function') {
      return value.bind(client);
    }
    return value;
  },
});

// User interface matching your existing structure
export interface User {
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
  password: string;
  createdAt: string;
  updatedAt: string;
  // Password reset fields
  resetPasswordToken?: string | null;
  resetPasswordExpiry?: Date | string | null;
  // Email verification fields
  emailVerified?: boolean;
  emailVerificationToken?: string | null;
  emailVerificationExpiry?: Date | string | null;
  // Subscription fields
  subscriptionStatus?: string;
  subscriptionId?: string | null;
  customerId?: string | null;
  currentPeriodStart?: Date | string | null;
  currentPeriodEnd?: Date | string | null;
  cancelAtPeriodEnd?: boolean;
  trialEndsAt?: Date | string | null;
}

export class PrismaDatabase {
  static async getUserByEmail(email: string): Promise<User | null> {
    try {
      console.log(`[PrismaDatabase] Getting user by email: ${email}`);
      console.log(`[PrismaDatabase] DATABASE_URL exists: ${!!process.env.DATABASE_URL}`);
      console.log(`[PrismaDatabase] DATABASE_URL starts with: ${process.env.DATABASE_URL?.substring(0, 20)}...`);
      
      const user = await prisma.user.findUnique({
        where: { email }
      });
      
      console.log(`[PrismaDatabase] User found: ${!!user}`);
      
      if (!user) return null;
      
      const parsedUser = {
        ...user,
        preferences: typeof user.preferences === 'string' 
          ? JSON.parse(user.preferences) 
          : user.preferences as User['preferences'],
        stats: typeof user.stats === 'string'
          ? JSON.parse(user.stats)
          : user.stats as User['stats'],
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
      };
      
      console.log(`[PrismaDatabase] User parsed successfully: ${parsedUser.email}`);
      return parsedUser;
    } catch (error: any) {
      console.error('[PrismaDatabase] Error getting user by email:', error);
      console.error('[PrismaDatabase] Error message:', error?.message);
      console.error('[PrismaDatabase] Error code:', error?.code);
      console.error('[PrismaDatabase] Error stack:', error?.stack);
      // Re-throw the error so the caller can handle it
      throw error;
    }
  }

  static async getUserById(id: string): Promise<User | null> {
    try {
      const user = await prisma.user.findUnique({
        where: { id }
      });
      
      if (!user) return null;
      
      return {
        ...user,
        preferences: typeof user.preferences === 'string' 
          ? JSON.parse(user.preferences) 
          : user.preferences as User['preferences'],
        stats: typeof user.stats === 'string'
          ? JSON.parse(user.stats)
          : user.stats as User['stats'],
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
      };
    } catch (error) {
      console.error('Error getting user by id:', error);
      return null;
    }
  }

  static async createUser(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    try {
      const user = await prisma.user.create({
        data: {
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          phone: userData.phone,
          bio: userData.bio,
          location: userData.location,
          website: userData.website,
          avatar: userData.avatar,
          plan: userData.plan,
          joinDate: userData.joinDate,
          password: userData.password,
          preferences: typeof userData.preferences === 'object' 
            ? JSON.stringify(userData.preferences) 
            : userData.preferences as any,
          stats: typeof userData.stats === 'object'
            ? JSON.stringify(userData.stats)
            : userData.stats as any,
          // Email verification fields
          emailVerified: userData.emailVerified ?? false,
          emailVerificationToken: userData.emailVerificationToken || null,
          emailVerificationExpiry: userData.emailVerificationExpiry 
            ? (typeof userData.emailVerificationExpiry === 'string' 
                ? new Date(userData.emailVerificationExpiry) 
                : userData.emailVerificationExpiry)
            : null,
          // Password reset fields (optional)
          resetPasswordToken: userData.resetPasswordToken || null,
          resetPasswordExpiry: userData.resetPasswordExpiry 
            ? (typeof userData.resetPasswordExpiry === 'string' 
                ? new Date(userData.resetPasswordExpiry) 
                : userData.resetPasswordExpiry)
            : null,
        }
      });
      
      return {
        ...user,
        preferences: typeof user.preferences === 'string' 
          ? JSON.parse(user.preferences) 
          : user.preferences as User['preferences'],
        stats: typeof user.stats === 'string'
          ? JSON.parse(user.stats)
          : user.stats as User['stats'],
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
      };
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  static async updateUser(id: string, updates: Partial<User>): Promise<User | null> {
    try {
      const { preferences, stats, ...otherUpdates } = updates;
      
      const user = await prisma.user.update({
        where: { id },
        data: {
          ...otherUpdates,
          ...(preferences && { 
            preferences: typeof preferences === 'object' 
              ? JSON.stringify(preferences) 
              : preferences as any 
          }),
          ...(stats && { 
            stats: typeof stats === 'object'
              ? JSON.stringify(stats)
              : stats as any 
          }),
        }
      });
      
      return {
        ...user,
        preferences: typeof user.preferences === 'string' 
          ? JSON.parse(user.preferences) 
          : user.preferences as User['preferences'],
        stats: typeof user.stats === 'string'
          ? JSON.parse(user.stats)
          : user.stats as User['stats'],
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
      };
    } catch (error) {
      console.error('Error updating user:', error);
      return null;
    }
  }

  static async deleteUser(id: string): Promise<boolean> {
    try {
      await prisma.user.delete({
        where: { id }
      });
      return true;
    } catch (error) {
      console.error('Error deleting user:', error);
      return false;
    }
  }

  static async getAllUsers(): Promise<User[]> {
    try {
      const users = await prisma.user.findMany();
      
      return users.map(user => ({
        ...user,
        preferences: typeof user.preferences === 'string' 
          ? JSON.parse(user.preferences) 
          : user.preferences as User['preferences'],
        stats: typeof user.stats === 'string'
          ? JSON.parse(user.stats)
          : user.stats as User['stats'],
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
      }));
    } catch (error) {
      console.error('Error getting all users:', error);
      return [];
    }
  }

  // Method to seed initial data
  static async seedDatabase(): Promise<void> {
    try {
      // Check if users already exist
      const existingUsers = await prisma.user.count();
      if (existingUsers > 0) {
        console.log('Database already seeded');
        return;
      }

      // Seed with demo users
      const demoUsers = [
        {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          phone: '+1 (555) 123-4567',
          bio: 'Passionate student using AI to enhance my learning experience.',
          location: 'San Francisco, CA',
          website: 'https://johndoe.com',
          avatar: '/image/avatar1.jpg',
          plan: 'Pro' as const,
          joinDate: 'January 2024',
          preferences: {
            theme: 'system' as const,
            language: 'en',
            notifications: {
              email: true,
              push: true,
              weeklyDigest: true,
              marketing: false,
            },
            learning: {
              difficultyLevel: 'adaptive' as const,
              learningStyle: 'mixed' as const,
              subjectFocus: ['Mathematics', 'Science'],
            },
          },
          stats: {
            totalInteractions: 247,
            textMessages: 189,
            imageUploads: 45,
            voiceInputs: 13,
            totalTimeSpent: '12h 34m',
            averageSessionTime: '8m 45s',
            streakDays: 7,
          },
          password: 'password123',
        },
        {
          firstName: 'Advait',
          lastName: 'Singh',
          email: 'advaitsingh@curvvtech.com',
          phone: '+91 98765 43210',
          bio: 'Tech entrepreneur and AI enthusiast building the future of education.',
          location: 'Mumbai, India',
          website: 'https://curvvtech.com',
          avatar: '/image/avatar2.jpg',
          plan: 'Enterprise' as const,
          joinDate: 'October 2024',
          preferences: {
            theme: 'dark' as const,
            language: 'en',
            notifications: {
              email: true,
              push: true,
              weeklyDigest: true,
              marketing: true,
            },
            learning: {
              difficultyLevel: 'advanced' as const,
              learningStyle: 'visual' as const,
              subjectFocus: ['Technology', 'Business', 'AI/ML'],
            },
          },
          stats: {
            totalInteractions: 156,
            textMessages: 98,
            imageUploads: 32,
            voiceInputs: 26,
            totalTimeSpent: '8h 45m',
            averageSessionTime: '12m 30s',
            streakDays: 12,
          },
          password: 'curvvtech123',
        }
      ];

      for (const userData of demoUsers) {
        await prisma.user.create({
          data: {
            ...userData,
            preferences: JSON.stringify(userData.preferences),
            stats: JSON.stringify(userData.stats),
          }
        });
      }

      console.log('Database seeded successfully');
    } catch (error) {
      console.error('Error seeding database:', error);
    }
  }

  // Notes Methods
  static async createNote(data: { title: string; content: string; category?: string | null; tags?: string | null; userId: string; metadata?: string | null }) {
    return await prisma.note.create({ 
      data: {
        title: data.title,
        content: data.content,
        category: data.category || null,
        tags: data.tags || null,
        userId: data.userId,
        metadata: data.metadata || null
      }
    });
  }

  static async getUserNotes(userId: string, category?: string) {
    const where = category ? { userId, category } : { userId };
    return await prisma.note.findMany({ where, orderBy: { createdAt: 'desc' } });
  }

  static async updateNote(id: string, data: any) {
    return await prisma.note.update({ where: { id }, data });
  }

  static async deleteNote(id: string) {
    return await prisma.note.delete({ where: { id } });
  }

  // Flashcards Methods
  static async createFlashcard(data: { question: string; answer: string; category?: string; difficulty?: string; userId: string; metadata?: any }) {
    return await prisma.flashcard.create({ data });
  }

  static async getUserFlashcards(userId: string, category?: string, reviewOnly?: boolean) {
    const where: any = { userId };
    if (category) where.category = category;
    if (reviewOnly) {
      where.OR = [
        { lastReviewed: null },
        { masteryLevel: { lt: 75 } }
      ];
    }
    return await prisma.flashcard.findMany({ where, orderBy: { createdAt: 'desc' } });
  }

  static async updateFlashcard(id: string, data: any) {
    return await prisma.flashcard.update({ where: { id }, data });
  }

  static async deleteFlashcard(id: string) {
    return await prisma.flashcard.delete({ where: { id } });
  }

  // Exam Session Methods
  static async createExamSession(data: { title: string; questions: any; totalQuestions: number; userId: string; metadata?: any }) {
    return await prisma.examSession.create({ data });
  }

  static async getExamSessions(userId: string, status?: string) {
    const where = status ? { userId, status } : { userId };
    return await prisma.examSession.findMany({ where, orderBy: { createdAt: 'desc' } });
  }

  static async getExamSession(id: string) {
    return await prisma.examSession.findUnique({ where: { id } });
  }

  static async updateExamSession(id: string, data: any) {
    return await prisma.examSession.update({ where: { id }, data });
  }

  static async deleteExamSession(id: string) {
    return await prisma.examSession.delete({ where: { id } });
  }

  // Focus Session Methods
  static async createFocusSession(data: { duration: number; mode: string; userId: string; metadata?: any }) {
    return await prisma.focusSession.create({ data });
  }

  static async getFocusSessions(userId: string) {
    return await prisma.focusSession.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } });
  }

  static async updateFocusSession(id: string, data: any) {
    return await prisma.focusSession.update({ where: { id }, data });
  }

  // Question Context Methods
  static async saveQuestionContext(userId: string, data: { question: string; answer: string; reason: string; category?: string; topic?: string }) {
    return await prisma.questionContext.create({ data: { ...data, userId } });
  }

  static async getQuestionContexts(userId: string, category?: string) {
    const where = category ? { userId, category } : { userId };
    return await prisma.questionContext.findMany({ where, orderBy: { createdAt: 'desc' } });
  }

  // Subscription Methods
  static async createSubscription(data: {
    userId: string;
    plan: string;
    status: string;
    provider: string;
    subscriptionId?: string;
    customerId?: string;
    currentPeriodStart: Date;
    currentPeriodEnd: Date;
  }) {
    return await prisma.subscription.create({ data });
  }

  static async getActiveSubscription(userId: string) {
    return await prisma.subscription.findFirst({
      where: {
        userId,
        status: { in: ['Active', 'Trialing'] },
      },
      orderBy: { createdAt: 'desc' },
      include: {
        invoices: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });
  }

  static async getUserSubscriptions(userId: string) {
    return await prisma.subscription.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        invoices: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });
  }

  static async updateSubscription(id: string, data: any) {
    return await prisma.subscription.update({
      where: { id },
      data,
    });
  }

  static async cancelSubscription(id: string, cancelAtPeriodEnd: boolean = true) {
    return await prisma.subscription.update({
      where: { id },
      data: {
        cancelAtPeriodEnd,
        ...(cancelAtPeriodEnd ? {} : { status: 'Cancelled', cancelledAt: new Date() }),
      },
    });
  }

  // Payment Method Methods
  static async createPaymentMethod(data: {
    userId: string;
    provider: string;
    methodId: string;
    type: string;
    last4?: string;
    brand?: string;
    expiryMonth?: number;
    expiryYear?: number;
    isDefault?: boolean;
  }) {
    // If this is set as default, unset other defaults
    if (data.isDefault) {
      await prisma.paymentMethod.updateMany({
        where: { userId: data.userId, isDefault: true },
        data: { isDefault: false },
      });
    }
    return await prisma.paymentMethod.create({ data });
  }

  static async getUserPaymentMethods(userId: string) {
    return await prisma.paymentMethod.findMany({
      where: { userId },
      orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
    });
  }

  static async setDefaultPaymentMethod(userId: string, paymentMethodId: string) {
    // Unset all defaults
    await prisma.paymentMethod.updateMany({
      where: { userId, isDefault: true },
      data: { isDefault: false },
    });
    // Set new default
    return await prisma.paymentMethod.update({
      where: { id: paymentMethodId },
      data: { isDefault: true },
    });
  }

  static async deletePaymentMethod(id: string) {
    return await prisma.paymentMethod.delete({ where: { id } });
  }

  // Invoice Methods
  static async createInvoice(data: {
    subscriptionId: string;
    invoiceId: string;
    amount: number;
    currency?: string;
    status: string;
    dueDate: Date;
    paidAt?: Date;
    pdfUrl?: string;
  }) {
    return await prisma.invoice.create({ data });
  }

  static async getSubscriptionInvoices(subscriptionId: string) {
    return await prisma.invoice.findMany({
      where: { subscriptionId },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async getUserInvoices(userId: string) {
    const subscriptions = await prisma.subscription.findMany({
      where: { userId },
      select: { id: true },
    });
    const subscriptionIds = subscriptions.map((s) => s.id);
    return await prisma.invoice.findMany({
      where: { subscriptionId: { in: subscriptionIds } },
      orderBy: { createdAt: 'desc' },
      include: {
        subscription: {
          select: {
            plan: true,
            status: true,
          },
        },
      },
    });
  }

  static async updateInvoice(id: string, data: any) {
    return await prisma.invoice.update({
      where: { id },
      data,
    });
  }

  // Chat Session Methods
  static async createChatSession(data: {
    userId: string;
    title: string;
  }) {
    return await prisma.chatSession.create({ data });
  }

  static async getUserChatSessions(userId: string, limit: number = 50) {
    return await prisma.chatSession.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
      take: limit, // Limit number of sessions to avoid loading too many
      select: {
        id: true,
        title: true,
        createdAt: true,
        updatedAt: true,
        userId: true,
        _count: {
          select: {
            messages: true, // Just count messages, don't fetch them
          },
        },
      },
    });
  }

  static async getChatSession(id: string) {
    return await prisma.chatSession.findUnique({
      where: { id },
      include: {
        messages: {
          orderBy: { timestamp: 'asc' },
        },
      },
    });
  }

  static async updateChatSession(id: string, data: { title?: string }) {
    return await prisma.chatSession.update({
      where: { id },
      data,
    });
  }

  static async deleteChatSession(id: string) {
    return await prisma.chatSession.delete({ where: { id } });
  }

  // Message Methods
  static async createMessage(data: {
    sessionId: string;
    text: string;
    isUser: boolean;
    metadata?: string;
  }) {
    return await prisma.message.create({ data });
  }

  static async getSessionMessages(sessionId: string) {
    return await prisma.message.findMany({
      where: { sessionId },
      orderBy: { timestamp: 'asc' },
    });
  }

  static async deleteMessage(id: string) {
    return await prisma.message.delete({ where: { id } });
  }

  // ==================== NOTIFICATIONS ====================

  static async createNotification(data: {
    userId: string;
    type: string;
    title: string;
    message: string;
    icon?: string;
    metadata?: string;
  }) {
    return await prisma.notification.create({ data });
  }

  static async getUserNotifications(userId: string, options?: {
    type?: string;
    read?: boolean;
    limit?: number;
    offset?: number;
  }) {
    const where: any = { userId };
    if (options?.type) where.type = options.type;
    if (options?.read !== undefined) where.read = options.read;

    return await prisma.notification.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: options?.limit,
      skip: options?.offset,
    });
  }

  static async getUnreadNotificationCount(userId: string) {
    return await prisma.notification.count({
      where: {
        userId,
        read: false,
      },
    });
  }

  static async markNotificationAsRead(id: string) {
    return await prisma.notification.update({
      where: { id },
      data: {
        read: true,
        readAt: new Date(),
      },
    });
  }

  static async markAllNotificationsAsRead(userId: string) {
    return await prisma.notification.updateMany({
      where: {
        userId,
        read: false,
      },
      data: {
        read: true,
        readAt: new Date(),
      },
    });
  }

  static async deleteNotification(id: string) {
    return await prisma.notification.delete({ where: { id } });
  }

  static async deleteAllNotifications(userId: string) {
    return await prisma.notification.deleteMany({ where: { userId } });
  }

  // Mind Map Methods
  static async createMindMap(data: {
    title: string;
    structure: string;
    category?: string;
    colorScheme?: string;
    userId: string;
    metadata?: any;
  }) {
    return await prisma.mindMap.create({
      data: {
        title: data.title,
        structure: data.structure,
        category: data.category,
        colorScheme: data.colorScheme || 'default',
        userId: data.userId,
        metadata: data.metadata || {}
      }
    });
  }

  static async getMindMaps(userId: string, category?: string) {
    const where = category ? { userId, category } : { userId };
    return await prisma.mindMap.findMany({
      where,
      orderBy: { updatedAt: 'desc' }
    });
  }

  static async getMindMapById(id: string) {
    return await prisma.mindMap.findUnique({
      where: { id }
    });
  }

  static async updateMindMap(
    id: string,
    data: {
      title?: string;
      structure?: string;
      category?: string;
      colorScheme?: string;
      metadata?: any;
    }
  ) {
    return await prisma.mindMap.update({
      where: { id },
      data: {
        ...(data.title && { title: data.title }),
        ...(data.structure && { structure: data.structure }),
        ...(data.category !== undefined && { category: data.category }),
        ...(data.colorScheme && { colorScheme: data.colorScheme }),
        ...(data.metadata && { metadata: data.metadata })
      }
    });
  }

  static async deleteMindMap(id: string) {
    return await prisma.mindMap.delete({
      where: { id }
    });
  }
}

import { PrismaClient } from '@prisma/client';

// Prevent multiple instances of Prisma Client in development
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

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
}

export class PrismaDatabase {
  static async getUserByEmail(email: string): Promise<User | null> {
    try {
      const user = await prisma.user.findUnique({
        where: { email }
      });
      
      if (!user) return null;
      
      return {
        ...user,
        preferences: user.preferences as User['preferences'],
        stats: user.stats as User['stats'],
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
      };
    } catch (error) {
      console.error('Error getting user by email:', error);
      return null;
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
        preferences: user.preferences as User['preferences'],
        stats: user.stats as User['stats'],
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
          preferences: userData.preferences as any,
          stats: userData.stats as any,
        }
      });
      
      return {
        ...user,
        preferences: user.preferences as User['preferences'],
        stats: user.stats as User['stats'],
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
          ...(preferences && { preferences: preferences as any }),
          ...(stats && { stats: stats as any }),
        }
      });
      
      return {
        ...user,
        preferences: user.preferences as User['preferences'],
        stats: user.stats as User['stats'],
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
        preferences: user.preferences as User['preferences'],
        stats: user.stats as User['stats'],
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
            preferences: userData.preferences as any,
            stats: userData.stats as any,
          }
        });
      }

      console.log('Database seeded successfully');
    } catch (error) {
      console.error('Error seeding database:', error);
    }
  }
}

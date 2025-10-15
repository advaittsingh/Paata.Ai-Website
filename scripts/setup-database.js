const { PrismaClient } = require('@prisma/client');

async function setupDatabase() {
  const prisma = new PrismaClient();
  
  try {
    console.log('Setting up database...');
    
    // Test database connection
    await prisma.$connect();
    console.log('✅ Database connected successfully');
    
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
        plan: 'Pro',
        joinDate: 'January 2024',
        preferences: {
          theme: 'system',
          language: 'en',
          notifications: {
            email: true,
            push: true,
            weeklyDigest: true,
            marketing: false,
          },
          learning: {
            difficultyLevel: 'adaptive',
            learningStyle: 'mixed',
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
        plan: 'Enterprise',
        joinDate: 'October 2024',
        preferences: {
          theme: 'dark',
          language: 'en',
          notifications: {
            email: true,
            push: true,
            weeklyDigest: true,
            marketing: true,
          },
          learning: {
            difficultyLevel: 'advanced',
            learningStyle: 'visual',
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
          preferences: userData.preferences,
          stats: userData.stats,
        }
      });
    }

    console.log('✅ Database seeded successfully');
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

setupDatabase();

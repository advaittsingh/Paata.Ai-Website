import { prisma } from './prisma-database';

// Initialize achievements and badges in the database
export async function initializeAchievementsAndBadges() {
  try {
    // Check if achievements already exist
    const existingAchievements = await prisma.achievement.count();
    if (existingAchievements > 0) {
      console.log('Achievements and badges already initialized');
      return;
    }

    // Define achievements
    const achievements = [
      {
        name: 'First Steps',
        description: 'Complete your first 10 interactions',
        icon: '🎯',
        category: 'study',
        criteria: { type: 'interactions', target: 10 },
        points: 100
      },
      {
        name: 'Dedicated Learner',
        description: 'Complete 100 interactions',
        icon: '📚',
        category: 'study',
        criteria: { type: 'interactions', target: 100 },
        points: 500
      },
      {
        name: 'Super Scholar',
        description: 'Complete 500 interactions',
        icon: '🌟',
        category: 'study',
        criteria: { type: 'interactions', target: 500 },
        points: 1000
      },
      {
        name: 'Week Warrior',
        description: 'Maintain a 7-day streak',
        icon: '🔥',
        category: 'streak',
        criteria: { type: 'streak', target: 7 },
        points: 300
      },
      {
        name: 'Monthly Master',
        description: 'Maintain a 30-day streak',
        icon: '💪',
        category: 'streak',
        criteria: { type: 'streak', target: 30 },
        points: 2000
      },
      {
        name: 'Flashcard Expert',
        description: 'Create 50 flashcards',
        icon: '💡',
        category: 'mastery',
        criteria: { type: 'flashcards', target: 50 },
        points: 800
      },
      {
        name: 'Perfect Score',
        description: 'Score 100% on an exam',
        icon: '🎖️',
        category: 'exam',
        criteria: { type: 'exam_perfect', target: 1 },
        points: 1000
      },
      {
        name: 'Exam Champion',
        description: 'Complete 10 exams',
        icon: '🏆',
        category: 'exam',
        criteria: { type: 'exams_completed', target: 10 },
        points: 1200
      },
      {
        name: 'Focus Master',
        description: 'Complete 20 focus sessions',
        icon: '🧘',
        category: 'milestone',
        criteria: { type: 'focus_sessions', target: 20 },
        points: 600
      },
      {
        name: 'Time Tracker',
        description: 'Study for 100 hours total',
        icon: '⏰',
        category: 'milestone',
        criteria: { type: 'study_hours', target: 100 },
        points: 1500
      }
    ];

    // Define badges
    const badges = [
      {
        name: 'Newbie',
        description: 'Welcome to PAATA.AI',
        image: '/badges/newbie.png',
        icon: '🌱',
        rarity: 'common',
        category: 'milestone'
      },
      {
        name: 'Quick Learner',
        description: 'Fast response time',
        image: '/badges/quick-learner.png',
        icon: '⚡',
        rarity: 'common',
        category: 'milestone'
      },
      {
        name: 'Curious Cat',
        description: 'Asks 50 questions',
        image: '/badges/curious.png',
        icon: '🐱',
        rarity: 'rare',
        category: 'study'
      },
      {
        name: 'Scholar',
        description: '100% dedication',
        image: '/badges/scholar.png',
        icon: '📖',
        rarity: 'rare',
        category: 'milestone'
      },
      {
        name: 'Streak King',
        description: '50-day streak',
        image: '/badges/streak-king.png',
        icon: '👑',
        rarity: 'epic',
        category: 'streak'
      },
      {
        name: 'Genius',
        description: 'Perfect exam scores',
        image: '/badges/genius.png',
        icon: '🧠',
        rarity: 'epic',
        category: 'exam'
      },
      {
        name: 'Master',
        description: '1000 interactions',
        image: '/badges/master.png',
        icon: '⭐',
        rarity: 'legendary',
        category: 'milestone'
      },
      {
        name: 'Legend',
        description: 'Ultimate dedication',
        image: '/badges/legend.png',
        icon: '🔥',
        rarity: 'legendary',
        category: 'milestone'
      }
    ];

    // Insert achievements
    for (const achievement of achievements) {
      await prisma.achievement.create({
        data: {
          name: achievement.name,
          description: achievement.description,
          icon: achievement.icon,
          category: achievement.category,
          criteria: typeof achievement.criteria === 'string' 
            ? achievement.criteria 
            : JSON.stringify(achievement.criteria),
          points: achievement.points
        }
      });
    }

    // Insert badges
    for (const badge of badges) {
      await prisma.badge.create({
        data: {
          name: badge.name,
          description: badge.description,
          image: badge.image,
          icon: badge.icon,
          rarity: badge.rarity as any,
          category: badge.category
        }
      });
    }

    console.log('Achievements and badges initialized successfully');
  } catch (error) {
    console.error('Error initializing achievements and badges:', error);
  }
}

// Check and award achievements based on user progress
export async function checkAndAwardAchievements(userId: string, userStats: any) {
  try {
    // Get user's actual activity counts
    const [flashcardsCount, examSessionsCount, focusSessionsCount, notesCount, mindMapsCount] = await Promise.all([
      prisma.flashcard.count({ where: { userId } }),
      prisma.examSession.count({ where: { userId } }),
      prisma.focusSession.count({ where: { userId } }),
      prisma.note.count({ where: { userId } }),
      prisma.mindMap.count({ where: { userId } }),
    ]);

    // Get exam sessions to check for perfect scores
    const examSessions = await prisma.examSession.findMany({
      where: { userId },
      select: { score: true }
    });
    const perfectScores = examSessions.filter(e => e.score === 100).length;

    // Calculate total study hours from stats
    const totalTimeSpent = userStats.totalTimeSpent || '0h 0m';
    const hoursMatch = totalTimeSpent.match(/(\d+)h/);
    const minutesMatch = totalTimeSpent.match(/(\d+)m/);
    const totalHours = (parseInt(hoursMatch?.[1] || '0')) + (parseInt(minutesMatch?.[1] || '0') / 60);

    // Get all achievements
    const achievements = await prisma.achievement.findMany();
    const newlyUnlocked: string[] = [];

    for (const achievement of achievements) {
      // Parse criteria from JSON string if needed
      let criteria: any;
      if (typeof achievement.criteria === 'string') {
        try {
          criteria = JSON.parse(achievement.criteria);
        } catch (e) {
          console.error(`Error parsing criteria for achievement ${achievement.id}:`, e);
          continue; // Skip this achievement if criteria can't be parsed
        }
      } else {
        criteria = achievement.criteria;
      }

      if (!criteria || !criteria.type || !criteria.target) {
        console.warn(`Invalid criteria for achievement ${achievement.id}:`, criteria);
        continue; // Skip achievements with invalid criteria
      }

      let progress = 0;
      let currentValue = 0;

      // Calculate progress based on achievement type
      switch (criteria.type) {
        case 'interactions':
          currentValue = userStats.totalInteractions || 0;
          progress = Math.min((currentValue / criteria.target) * 100, 100);
          break;
        case 'streak':
          currentValue = userStats.streakDays || 0;
          progress = Math.min((currentValue / criteria.target) * 100, 100);
          break;
        case 'flashcards':
          currentValue = flashcardsCount;
          progress = Math.min((currentValue / criteria.target) * 100, 100);
          break;
        case 'exams_completed':
          currentValue = examSessionsCount;
          progress = Math.min((currentValue / criteria.target) * 100, 100);
          break;
        case 'exam_perfect':
          currentValue = perfectScores;
          progress = currentValue >= criteria.target ? 100 : 0;
          break;
        case 'focus_sessions':
          currentValue = focusSessionsCount;
          progress = Math.min((currentValue / criteria.target) * 100, 100);
          break;
        case 'study_hours':
          currentValue = totalHours;
          progress = Math.min((currentValue / criteria.target) * 100, 100);
          break;
        default:
          progress = 0;
      }

      // Check if already unlocked
      const existing = await prisma.userAchievement.findUnique({
        where: {
          userId_achievementId: {
            userId,
            achievementId: achievement.id
          }
        }
      });

      const wasUnlocked = existing?.isUnlocked || false;
      const isNowUnlocked = progress >= 100;
      const roundedProgress = Math.round(progress);

      // Always update/create user achievement if there's progress or existing record
      if (progress > 0 || existing) {
        const now = new Date();
        
        // Update user achievement
        const updated = await prisma.userAchievement.upsert({
          where: {
            userId_achievementId: {
              userId,
              achievementId: achievement.id
            }
          },
          update: {
            progress: roundedProgress,
            isUnlocked: isNowUnlocked,
            // Only set unlockedAt if newly unlocked, preserve existing date if already unlocked
            unlockedAt: isNowUnlocked 
              ? (!wasUnlocked ? now : (existing?.unlockedAt || now))
              : null
          },
          create: {
            userId,
            achievementId: achievement.id,
            progress: roundedProgress,
            isUnlocked: isNowUnlocked,
            unlockedAt: isNowUnlocked ? now : null
          }
        });

        // Track newly unlocked achievements
        if (isNowUnlocked && !wasUnlocked) {
          console.log(`🎉 Achievement unlocked: ${achievement.name} for user ${userId}`);
          newlyUnlocked.push(achievement.name);
          }
      }
    }

    // Check and award badges based on achievements
    await checkAndAwardBadges(userId);

    return { newlyUnlocked };
  } catch (error) {
    console.error('Error checking achievements:', error);
    return { newlyUnlocked: [] };
  }
}

// Check and award badges based on achievements and milestones
export async function checkAndAwardBadges(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        userAchievements: {
          where: { isUnlocked: true },
          include: { achievement: true }
        },
        userBadges: {
          include: { badge: true }
        }
      }
    });

    if (!user) return;

    const stats = user.stats as any || {};
    const unlockedAchievements = user.userAchievements || [];
    const earnedBadges = user.userBadges.map(ub => ub.badge.name);

    // Get activity counts
    const [flashcardsCount, examSessionsCount, questionsCount] = await Promise.all([
      prisma.flashcard.count({ where: { userId } }),
      prisma.examSession.count({ where: { userId } }),
      prisma.questionContext.count({ where: { userId } }),
    ]);

    // Badge awarding logic
    const badgeRules = [
      {
        badgeName: 'Newbie',
        condition: () => stats.totalInteractions >= 1,
      },
      {
        badgeName: 'Quick Learner',
        condition: () => stats.totalInteractions >= 10,
      },
      {
        badgeName: 'Curious Cat',
        condition: () => questionsCount >= 50,
      },
      {
        badgeName: 'Scholar',
        condition: () => unlockedAchievements.length >= 5,
      },
      {
        badgeName: 'Streak King',
        condition: () => stats.streakDays >= 50,
      },
      {
        badgeName: 'Genius',
        condition: () => {
          const perfectExams = unlockedAchievements.find(a => a.achievement.name === 'Perfect Score');
          return !!perfectExams;
        },
      },
      {
        badgeName: 'Master',
        condition: () => stats.totalInteractions >= 1000,
      },
      {
        badgeName: 'Legend',
        condition: () => unlockedAchievements.length >= 8 && stats.totalInteractions >= 500,
      },
    ];

    // Get all badges
    const allBadges = await prisma.badge.findMany();

    for (const rule of badgeRules) {
      const badge = allBadges.find(b => b.name === rule.badgeName);
      if (!badge) continue;

      // Check if already earned
      const alreadyEarned = earnedBadges.includes(rule.badgeName);
      if (alreadyEarned) continue;

      // Check if condition is met
      if (rule.condition()) {
        try {
          // Award badge
          await prisma.userBadge.create({
            data: {
              userId,
              badgeId: badge.id,
              earnedAt: new Date()
            }
          });
          console.log(`🏆 Badge awarded: ${rule.badgeName} to user ${userId}`);
        } catch (error: any) {
          // Ignore unique constraint errors (badge already earned)
          if (!error.message?.includes('Unique constraint')) {
            console.error(`Error awarding badge ${rule.badgeName}:`, error);
          }
        }
      }
    }
  } catch (error) {
    console.error('Error checking badges:', error);
  }
}





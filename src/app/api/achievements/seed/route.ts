import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// This route initializes achievements and badges in the database
// Call this once to seed the database

export async function POST(request: NextRequest) {
  try {
    // Check if achievements already exist
    let existingCount = 0;
    try {
      existingCount = await prisma.achievement.count();
      if (existingCount > 0) {
        return NextResponse.json({
          success: true,
          message: 'Achievements already exist',
          count: existingCount
        });
      }
    } catch (e) {
      console.log('Achievement table does not exist yet, will create');
    }

    // Define achievements
    const achievements = [
      {
        name: 'First Steps',
        description: 'Complete your first 10 interactions',
        icon: '🎯',
        category: 'study',
        criteria: JSON.stringify({ type: 'interactions', target: 10 }),
        points: 100
      },
      {
        name: 'Dedicated Learner',
        description: 'Complete 100 interactions',
        icon: '📚',
        category: 'study',
        criteria: JSON.stringify({ type: 'interactions', target: 100 }),
        points: 500
      },
      {
        name: 'Super Scholar',
        description: 'Complete 500 interactions',
        icon: '🌟',
        category: 'study',
        criteria: JSON.stringify({ type: 'interactions', target: 500 }),
        points: 1000
      },
      {
        name: 'Week Warrior',
        description: 'Maintain a 7-day streak',
        icon: '🔥',
        category: 'streak',
        criteria: JSON.stringify({ type: 'streak', target: 7 }),
        points: 300
      },
      {
        name: 'Monthly Master',
        description: 'Maintain a 30-day streak',
        icon: '💪',
        category: 'streak',
        criteria: JSON.stringify({ type: 'streak', target: 30 }),
        points: 2000
      },
      {
        name: 'Flashcard Expert',
        description: 'Create 50 flashcards',
        icon: '💡',
        category: 'mastery',
        criteria: JSON.stringify({ type: 'flashcards', target: 50 }),
        points: 800
      },
      {
        name: 'Perfect Score',
        description: 'Score 100% on an exam',
        icon: '🎖️',
        category: 'exam',
        criteria: JSON.stringify({ type: 'exam_perfect', target: 1 }),
        points: 1000
      },
      {
        name: 'Exam Champion',
        description: 'Complete 10 exams',
        icon: '🏆',
        category: 'exam',
        criteria: JSON.stringify({ type: 'exams_completed', target: 10 }),
        points: 1200
      },
      {
        name: 'Focus Master',
        description: 'Complete 20 focus sessions',
        icon: '🧘',
        category: 'milestone',
        criteria: JSON.stringify({ type: 'focus_sessions', target: 20 }),
        points: 600
      },
      {
        name: 'Time Tracker',
        description: 'Study for 100 hours total',
        icon: '⏰',
        category: 'milestone',
        criteria: JSON.stringify({ type: 'study_hours', target: 100 }),
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
          criteria: JSON.parse(achievement.criteria),
          points: achievement.points
        }
      });
    }

    // Insert badges
    for (const badge of badges) {
      await prisma.badge.create({
        data: badge
      });
    }

    // Return success
    return NextResponse.json({
      success: true,
      message: 'Achievements and badges seeded successfully',
      achievements: achievements.length,
      badges: badges.length
    });

  } catch (error) {
    console.error('Error seeding achievements:', error);
    return NextResponse.json(
      { error: 'Failed to seed achievements', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}


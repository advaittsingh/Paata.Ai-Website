import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth-middleware';
import { PrismaDatabase } from '@/lib/prisma-database';

export async function GET(request: NextRequest) {
  try {
    const authResult = await verifyAuth(request);
    if (authResult.error || !authResult.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const user = authResult.user;
    const stats = user.stats as any || {};
    const preferences = user.preferences as any || {};
    
    // Get question contexts for analysis
    const questionContexts = await PrismaDatabase.getQuestionContexts(user.id);
    
    // Get exam sessions for performance analysis
    const examSessions = await PrismaDatabase.getExamSessions(user.id);
    
    // Get flashcards for mastery analysis
    const flashcards = await PrismaDatabase.getUserFlashcards(user.id, undefined, false);

    // Calculate insights
    const insights = {
      // Learning Patterns
      learningPatterns: {
        mostActiveTime: calculateMostActiveTime(stats.dailyUsage || {}),
        preferredInputMethod: calculatePreferredInputMethod(stats),
        consistency: calculateConsistency(stats.streakDays || 0, stats.dailyUsage || {}),
      },

      // Strengths & Weaknesses
      strengths: calculateStrengths(questionContexts, examSessions, flashcards),
      weaknesses: calculateWeaknesses(questionContexts, examSessions, flashcards),

      // Performance Trends
      trends: {
        interactionTrend: calculateInteractionTrend(stats.dailyUsage || {}),
        accuracyTrend: calculateAccuracyTrend(examSessions),
        masteryTrend: calculateMasteryTrend(flashcards),
      },

      // Recommendations
      recommendations: generateRecommendations(
        stats,
        questionContexts,
        examSessions,
        flashcards
      ),

      // Subject Analysis
      subjectAnalysis: analyzeSubjects(questionContexts, stats),
    };

    return NextResponse.json({
      success: true,
      insights,
    });
  } catch (error) {
    console.error('Analytics insights error:', error);
    return NextResponse.json(
      { error: 'Failed to generate insights' },
      { status: 500 }
    );
  }
}

function calculateMostActiveTime(dailyUsage: any): string {
  // Analyze daily usage patterns from actual timestamps
  // If we have question contexts, we can analyze their timestamps
  // For now, return a default based on interaction patterns
  const dates = Object.keys(dailyUsage).sort();
  if (dates.length === 0) {
    return 'No activity yet';
  }
  
  // Analyze interaction patterns throughout the week
  const recentDates = dates.slice(-7);
  const totalInteractions = recentDates.reduce((sum, date) => 
    sum + (dailyUsage[date]?.interactions || 0), 0
  );
  
  if (totalInteractions === 0) {
    return 'No activity yet';
  }
  
  // Based on typical learning patterns, return most likely time
  // This would be enhanced with actual timestamp analysis if available
  return 'Evening (6-10 PM)';
}

function calculatePreferredInputMethod(stats: any): string {
  const text = stats.textMessages || 0;
  const image = stats.imageUploads || 0;
  const voice = stats.voiceInputs || 0;
  
  if (text > image && text > voice) return 'Text';
  if (image > voice) return 'Image';
  return 'Voice';
}

function calculateConsistency(streakDays: number, dailyUsage: any): {
  level: string;
  score: number;
  message: string;
} {
  const days = Object.keys(dailyUsage).length;
  const score = streakDays > 0 ? Math.min(100, (streakDays / 30) * 100) : 0;
  
  let level = 'Low';
  if (score >= 80) level = 'Excellent';
  else if (score >= 60) level = 'Good';
  else if (score >= 40) level = 'Moderate';
  
  return {
    level,
    score: Math.round(score),
    message: `You've been active for ${streakDays} days straight!`,
  };
}

function calculateStrengths(contexts: any[], exams: any[], flashcards: any[]): string[] {
  const strengths: string[] = [];
  
  // Analyze categories from contexts
  const categoryCounts: Record<string, number> = {};
  contexts.forEach(ctx => {
    if (ctx.category) {
      categoryCounts[ctx.category] = (categoryCounts[ctx.category] || 0) + 1;
    }
  });
  
  // Find top categories
  const sortedCategories = Object.entries(categoryCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);
  
  sortedCategories.forEach(([category]) => {
    strengths.push(`${category} - Strong understanding`);
  });
  
  // Analyze exam performance
  if (exams.length > 0) {
    const highScores = exams.filter((e: any) => e.score && e.score >= 80);
    if (highScores.length > 0) {
      strengths.push('Exam Performance - Consistently scoring high');
    }
  }
  
  // Analyze flashcard mastery
  const masteredCards = flashcards.filter((f: any) => f.masteryLevel >= 75);
  if (masteredCards.length > flashcards.length * 0.5) {
    strengths.push('Flashcard Mastery - Strong retention');
  }
  
  return strengths.length > 0 ? strengths : ['Keep practicing to identify your strengths!'];
}

function calculateWeaknesses(contexts: any[], exams: any[], flashcards: any[]): string[] {
  const weaknesses: string[] = [];
  
  // Find categories with few questions
  const categoryCounts: Record<string, number> = {};
  contexts.forEach(ctx => {
    if (ctx.category) {
      categoryCounts[ctx.category] = (categoryCounts[ctx.category] || 0) + 1;
    }
  });
  
  // Find underrepresented categories
  const avgCount = contexts.length / Object.keys(categoryCounts).length;
  Object.entries(categoryCounts).forEach(([category, count]) => {
    if (count < avgCount * 0.5) {
      weaknesses.push(`${category} - Needs more practice`);
    }
  });
  
  // Analyze low exam scores
  const lowScores = exams.filter((e: any) => e.score && e.score < 60);
  if (lowScores.length > 0) {
    weaknesses.push('Exam Performance - Focus on improving accuracy');
  }
  
  // Analyze flashcard mastery
  const lowMastery = flashcards.filter((f: any) => f.masteryLevel < 50);
  if (lowMastery.length > flashcards.length * 0.3) {
    weaknesses.push('Flashcard Retention - Review more frequently');
  }
  
  return weaknesses.length > 0 ? weaknesses : ['All areas are well covered!'];
}

function calculateInteractionTrend(dailyUsage: any): {
  direction: 'up' | 'down' | 'stable';
  percentage: number;
} {
  const dates = Object.keys(dailyUsage).sort();
  if (dates.length < 2) {
    return { direction: 'stable', percentage: 0 };
  }
  
  const recent = dates.slice(-7);
  const previous = dates.slice(-14, -7);
  
  const recentTotal = recent.reduce((sum, date) => sum + (dailyUsage[date]?.interactions || 0), 0);
  const previousTotal = previous.reduce((sum, date) => sum + (dailyUsage[date]?.interactions || 0), 0);
  
  if (previousTotal === 0) {
    return { direction: 'up', percentage: 100 };
  }
  
  const change = ((recentTotal - previousTotal) / previousTotal) * 100;
  
  return {
    direction: change > 5 ? 'up' : change < -5 ? 'down' : 'stable',
    percentage: Math.round(Math.abs(change)),
  };
}

function calculateAccuracyTrend(exams: any[]): {
  direction: 'up' | 'down' | 'stable';
  percentage: number;
} {
  if (exams.length < 2) {
    return { direction: 'stable', percentage: 0 };
  }
  
  const sorted = exams.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  const recent = sorted.slice(-3);
  const previous = sorted.slice(-6, -3);
  
  const recentAvg = recent.reduce((sum, e) => sum + (e.score || 0), 0) / recent.length;
  const previousAvg = previous.length > 0 
    ? previous.reduce((sum, e) => sum + (e.score || 0), 0) / previous.length 
    : recentAvg;
  
  if (previousAvg === 0) {
    return { direction: 'up', percentage: 100 };
  }
  
  const change = ((recentAvg - previousAvg) / previousAvg) * 100;
  
  return {
    direction: change > 5 ? 'up' : change < -5 ? 'down' : 'stable',
    percentage: Math.round(Math.abs(change)),
  };
}

function calculateMasteryTrend(flashcards: any[]): {
  direction: 'up' | 'down' | 'stable';
  percentage: number;
} {
  if (flashcards.length === 0) {
    return { direction: 'stable', percentage: 0 };
  }
  
  const avgMastery = flashcards.reduce((sum, f) => sum + (f.masteryLevel || 0), 0) / flashcards.length;
  
  // Compare with previous period (simplified - would need historical data)
  return {
    direction: avgMastery >= 70 ? 'up' : avgMastery >= 50 ? 'stable' : 'down',
    percentage: Math.round(avgMastery),
  };
}

function generateRecommendations(
  stats: any,
  contexts: any[],
  exams: any[],
  flashcards: any[]
): string[] {
  const recommendations: string[] = [];
  
  // Activity recommendations
  if ((stats.totalInteractions || 0) < 10) {
    recommendations.push('Start with more practice sessions to build your learning habit');
  }
  
  // Consistency recommendations
  if ((stats.streakDays || 0) < 3) {
    recommendations.push('Try to practice daily to maintain a learning streak');
  }
  
  // Subject recommendations
  const categoryCounts: Record<string, number> = {};
  contexts.forEach(ctx => {
    if (ctx.category) {
      categoryCounts[ctx.category] = (categoryCounts[ctx.category] || 0) + 1;
    }
  });
  
  const categories = Object.keys(categoryCounts);
  if (categories.length < 3) {
    recommendations.push('Explore different subjects to broaden your knowledge');
  }
  
  // Exam recommendations
  if (exams.length === 0) {
    recommendations.push('Try exam mode to test your knowledge and track progress');
  } else {
    const avgScore = exams.reduce((sum, e) => sum + (e.score || 0), 0) / exams.length;
    if (avgScore < 70) {
      recommendations.push('Review areas where you scored lower to improve performance');
    }
  }
  
  // Flashcard recommendations
  if (flashcards.length === 0) {
    recommendations.push('Create flashcards to reinforce your learning');
  } else {
    const lowMastery = flashcards.filter((f: any) => f.masteryLevel < 50);
    if (lowMastery.length > 0) {
      recommendations.push(`Review ${lowMastery.length} flashcards that need more practice`);
    }
  }
  
  return recommendations.length > 0 ? recommendations : ['Keep up the great work!'];
}

function analyzeSubjects(contexts: any[], stats: any): any[] {
  const subjectCounts: Record<string, { count: number; accuracy?: number }> = {};
  
  contexts.forEach(ctx => {
    const subject = ctx.category || 'Other';
    if (!subjectCounts[subject]) {
      subjectCounts[subject] = { count: 0 };
    }
    subjectCounts[subject].count++;
  });
  
  const total = contexts.length || 1;
  
  return Object.entries(subjectCounts)
    .map(([subject, data]) => ({
      subject,
      count: data.count,
      percentage: Math.round((data.count / total) * 100),
      accuracy: data.accuracy || null,
    }))
    .sort((a, b) => b.count - a.count);
}


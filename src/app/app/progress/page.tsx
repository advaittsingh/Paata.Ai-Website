"use client";

import { useState, useEffect } from 'react';
import { Navbar } from '@/components';
import { Typography, Card, CardBody, IconButton, Button, Chip } from '@material-tailwind/react';
import { useUser } from '@/contexts/UserContext';
import { Bars3Icon, XMarkIcon, ArrowTrendingUpIcon, CalendarIcon } from "@heroicons/react/24/outline";
import LoadingSkeleton, { CardGridSkeleton } from '@/components/loading-skeleton';
import AppSidebar from '@/components/app-sidebar';

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  points: number;
  isUnlocked: boolean;
  progress: number;
  unlockedAt: string | null;
}

interface Badge {
  id: string;
  name: string;
  description: string;
  image: string;
  icon: string;
  rarity: string;
  category: string;
  earned: boolean;
  earnedAt: string | null;
}

export default function ProgressPage() {
  const { user } = useUser();
  const [focusTime, setFocusTime] = useState(0);
  const [totalSessions, setTotalSessions] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [usageData, setUsageData] = useState<any>(null);
  const [insights, setInsights] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [loadingInsights, setLoadingInsights] = useState(true);
  const [selectedTab, setSelectedTab] = useState<'progress' | 'achievements'>('progress');
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [achievementStats, setAchievementStats] = useState({
    totalAchievements: 0,
    unlockedAchievements: 0,
    totalBadges: 0,
    earnedBadges: 0
  });
  const [isLoadingAchievements, setIsLoadingAchievements] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setSidebarOpen(true);
      else setSidebarOpen(false);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (user) {
      fetchFocusTime();
      fetchUsageData();
      fetchInsights();
      fetchAchievements();
    }
  }, [user, selectedPeriod, selectedTab]);

  const fetchFocusTime = async () => {
    try {
      const response = await fetch(`/api/focus?userId=${user?.id}`);
      const data = await response.json();
      if (data.success) {
        setFocusTime(data.totalFocusTime || 0);
        setTotalSessions(data.count || 0);
      }
    } catch (error) {
      console.error('Error fetching focus time:', error);
    }
  };

  const fetchUsageData = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/usage?userId=${user.id}&period=${selectedPeriod}&t=${Date.now()}`);
      if (response.ok) {
        const data = await response.json();
        setUsageData(data);
      }
    } catch (error) {
      console.error('Error fetching usage data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchInsights = async () => {
    if (!user?.id) return;
    
    setLoadingInsights(true);
    try {
      const response = await fetch('/api/analytics/insights', {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setInsights(data.insights);
      }
    } catch (error) {
      console.error('Error fetching insights:', error);
    } finally {
      setLoadingInsights(false);
    }
  };

  const fetchAchievements = async () => {
    if (!user?.id) return;
    
    setIsLoadingAchievements(true);
    try {
      const response = await fetch(`/api/achievements?userId=${user.id}`);
      const data = await response.json();
      if (data.success) {
        setAchievements(data.achievements || []);
        setBadges(data.badges || []);
        setAchievementStats(data.stats || achievementStats);
      }
    } catch (error) {
      console.error('Error fetching achievements:', error);
    } finally {
      setIsLoadingAchievements(false);
    }
  };

  const fixAchievements = async () => {
    try {
      setIsLoadingAchievements(true);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);
      
      const response = await fetch('/api/achievements/force-check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        const message = data.message || 
          (data.newlyUnlocked?.length > 0 || data.newlyEarnedBadges?.length > 0
            ? `Unlocked ${data.newlyUnlocked?.length || 0} achievement(s) and earned ${data.newlyEarnedBadges?.length || 0} badge(s)!`
            : 'Achievements checked. No new unlocks.');
        alert(message);
        await fetchAchievements();
      } else {
        alert('Error: ' + (data.error || 'Failed to fix achievements'));
      }
    } catch (error: any) {
      console.error('Error fixing achievements:', error);
      if (error.name === 'AbortError') {
        alert('Request timed out. The server may be taking too long. Please try again or check server logs.');
      } else {
        alert('Error fixing achievements: ' + (error.message || 'Unknown error. Check console for details.'));
      }
    } finally {
      setIsLoadingAchievements(false);
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'from-yellow-400 to-orange-500';
      case 'epic': return 'from-gray-900 to-gray-700';
      case 'rare': return 'from-blue-500 to-cyan-500';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'study': return 'bg-blue-100 text-blue-800';
      case 'streak': return 'bg-orange-100 text-orange-800';
      case 'mastery': return 'bg-green-100 text-green-800';
      case 'exam': return 'bg-gray-100 text-gray-900';
      case 'milestone': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };


  const stats = user?.stats || {};
  const hours = Math.floor(focusTime / 60);
  const minutes = focusTime % 60;

  // Use real data if available, otherwise fallback to context user data
  const usageStats = usageData ? {
    totalInteractions: usageData.totalInteractions,
    textMessages: usageData.textMessages,
    imageUploads: usageData.imageUploads,
    voiceInputs: usageData.voiceInputs,
    totalTimeSpent: usageData.totalTimeSpent,
    averageSessionTime: usageData.averageSessionTime,
    streakDays: usageData.streakDays,
    thisMonth: usageData.thisMonth
  } : {
    totalInteractions: stats?.totalInteractions || 0,
    textMessages: stats?.textMessages || 0,
    imageUploads: stats?.imageUploads || 0,
    voiceInputs: stats?.voiceInputs || 0,
    totalTimeSpent: stats?.totalTimeSpent || '0h 0m',
    averageSessionTime: stats?.averageSessionTime || '0m 0s',
    streakDays: stats?.streakDays || 0,
    thisMonth: {
      interactions: stats?.totalInteractions || 0,
      textMessages: stats?.textMessages || 0,
      imageUploads: stats?.imageUploads || 0,
      voiceInputs: stats?.voiceInputs || 0,
      timeSpent: stats?.totalTimeSpent || '0h 0m'
    }
  };

  const weeklyData = usageData?.weeklyData || [
    { day: 'Mon', interactions: 0, time: '0h 0m' },
    { day: 'Tue', interactions: 0, time: '0h 0m' },
    { day: 'Wed', interactions: 0, time: '0h 0m' },
    { day: 'Thu', interactions: 0, time: '0h 0m' },
    { day: 'Fri', interactions: 0, time: '0h 0m' },
    { day: 'Sat', interactions: 0, time: '0h 0m' },
    { day: 'Sun', interactions: 0, time: '0h 0m' }
  ];

  const subjectBreakdown = usageData?.subjectBreakdown || [
    { subject: 'Mathematics', interactions: 0, percentage: 0, color: 'bg-blue-500' },
    { subject: 'Science', interactions: 0, percentage: 0, color: 'bg-green-500' },
    { subject: 'English', interactions: 0, percentage: 0, color: 'bg-gray-900' },
    { subject: 'History', interactions: 0, percentage: 0, color: 'bg-orange-500' },
    { subject: 'Other', interactions: 0, percentage: 0, color: 'bg-gray-500' }
  ];


  return (
    <div className="h-screen bg-gray-50 overflow-hidden flex flex-col">
      <Navbar />
      
      <div className="flex flex-1 overflow-hidden">
        <AppSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col bg-white pt-20">
          {/* Header */}
          <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-4">
              {!sidebarOpen && (
                <IconButton variant="text" color="gray" size="sm" onClick={() => setSidebarOpen(true)} className="lg:hidden">
                  <Bars3Icon className="w-5 h-5" />
                </IconButton>
              )}
              <div>
                <Typography variant="h5" color="blue-gray" className="font-bold">Learning Progress</Typography>
                <Typography variant="small" color="gray">Track your learning journey and achievements</Typography>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {selectedTab === 'progress' && (
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
                >
                  <option value="7d">Last 7 days</option>
                  <option value="30d">Last 30 days</option>
                  <option value="90d">Last 90 days</option>
                  <option value="1y">Last year</option>
                </select>
              )}
              {selectedTab === 'achievements' && (
                <Button
                  onClick={fixAchievements}
                  disabled={isLoadingAchievements}
                  className="bg-gray-900 text-white"
                  size="sm"
                >
                  {isLoadingAchievements ? 'Checking...' : 'Fix & Check Achievements'}
                </Button>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white border-b border-gray-200 px-6 py-2">
            <div className="flex gap-2">
              <Button
                variant={selectedTab === 'progress' ? 'filled' : 'outlined'}
                onClick={() => setSelectedTab('progress')}
                className={selectedTab === 'progress' ? 'bg-gray-900' : ''}
                size="sm"
              >
                <i className="fa-solid fa-chart-line mr-2"></i>
                Progress
              </Button>
              <Button
                variant={selectedTab === 'achievements' ? 'filled' : 'outlined'}
                onClick={() => setSelectedTab('achievements')}
                className={selectedTab === 'achievements' ? 'bg-gray-900' : ''}
                size="sm"
              >
                <i className="fa-solid fa-trophy mr-2"></i>
                Achievements & Badges
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="container mx-auto px-4 py-8">

          {/* Achievements Tab */}
          {selectedTab === 'achievements' ? (
            isLoadingAchievements ? (
              <div className="space-y-6">
                <CardGridSkeleton count={4} />
                <LoadingSkeleton type="default" />
              </div>
            ) : (
              <>
                {/* Stats Summary */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                  <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                    <CardBody className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <Typography variant="small" className="opacity-80">
                            Total Achievements
                          </Typography>
                          <Typography variant="h4" className="font-bold">
                            {achievementStats.totalAchievements}
                          </Typography>
                        </div>
                        <i className="fa-solid fa-trophy text-3xl opacity-50"></i>
                      </div>
                    </CardBody>
                  </Card>
                  <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
                    <CardBody className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <Typography variant="small" className="opacity-80">
                            Unlocked
                          </Typography>
                          <Typography variant="h4" className="font-bold">
                            {achievementStats.unlockedAchievements}
                          </Typography>
                        </div>
                        <i className="fa-solid fa-check-circle text-3xl opacity-50"></i>
                      </div>
                    </CardBody>
                  </Card>
                  <Card className="bg-gradient-to-br from-gray-900 to-gray-800 text-white">
                    <CardBody className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <Typography variant="small" className="opacity-80">
                            Total Badges
                          </Typography>
                          <Typography variant="h4" className="font-bold">
                            {achievementStats.totalBadges}
                          </Typography>
                        </div>
                        <i className="fa-solid fa-award text-3xl opacity-50"></i>
                      </div>
                    </CardBody>
                  </Card>
                  <Card className="bg-gradient-to-br from-pink-500 to-pink-600 text-white">
                    <CardBody className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <Typography variant="small" className="opacity-80">
                            Earned Badges
                          </Typography>
                          <Typography variant="h4" className="font-bold">
                            {achievementStats.earnedBadges}
                          </Typography>
                        </div>
                        <i className="fa-solid fa-medal text-3xl opacity-50"></i>
                      </div>
                    </CardBody>
                  </Card>
                </div>


                {/* Achievements Section */}
                <Card className="mb-8 shadow-lg">
                  <div className="bg-gray-50 px-6 py-4 rounded-t-xl">
                    <Typography variant="h6" color="blue-gray" className="font-semibold">
                      <i className="fa-solid fa-trophy mr-2"></i>
                      Achievements
                    </Typography>
                  </div>
                  <CardBody className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {achievements.map((achievement) => (
                        <Card key={achievement.id} className={`transition-transform hover:scale-105 ${achievement.isUnlocked ? 'border-2 border-yellow-400 shadow-lg' : 'opacity-60'}`}>
                          <CardBody className="p-6">
                            <div className="flex items-start justify-between mb-4">
                              <div className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl ${achievement.isUnlocked ? 'bg-yellow-100' : 'bg-gray-200'}`}>
                                <span>{achievement.icon}</span>
                              </div>
                              {achievement.isUnlocked && (
                                <i className="fa-solid fa-check-circle text-green-500 text-xl"></i>
                              )}
                            </div>
                            <Typography variant="h6" className="font-bold mb-2">
                              {achievement.name}
                            </Typography>
                            <Typography variant="small" color="gray" className="mb-3">
                              {achievement.description}
                            </Typography>
                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-xs">
                                <span>Progress</span>
                                <span className="font-bold">{achievement.progress}%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className={`h-2 rounded-full transition-all ${achievement.isUnlocked ? 'bg-yellow-500' : 'bg-gray-900'}`}
                                  style={{ width: `${achievement.progress}%` }}
                                ></div>
                              </div>
                            </div>
                            <div className="flex items-center justify-between mt-3">
                              <Chip
                                value={achievement.category}
                                className={`text-xs ${getCategoryColor(achievement.category)}`}
                              />
                              <Typography variant="small" className="font-bold text-gray-900">
                                {achievement.points} pts
                              </Typography>
                            </div>
                            {achievement.unlockedAt && (
                              <Typography variant="small" color="gray" className="mt-2">
                                Unlocked: {new Date(achievement.unlockedAt).toLocaleDateString()}
                              </Typography>
                            )}
                          </CardBody>
                        </Card>
                      ))}
                    </div>
                  </CardBody>
                </Card>

                {/* Badges Section */}
                <Card className="mb-8 shadow-lg">
                  <div className="bg-gray-50 px-6 py-4 rounded-t-xl">
                    <Typography variant="h6" color="blue-gray" className="font-semibold">
                      <i className="fa-solid fa-award mr-2"></i>
                      Badges
                    </Typography>
                  </div>
                  <CardBody className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {badges.map((badge) => (
                        <Card key={badge.id} className={`transition-transform hover:scale-105 ${!badge.earned && 'opacity-40'}`}>
                          <CardBody className="p-6 text-center">
                            <div className={`w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br ${getRarityColor(badge.rarity)} flex items-center justify-center text-4xl shadow-lg`}>
                              <span>{badge.icon || badge.image}</span>
                            </div>
                            <Typography variant="h6" className="font-bold mb-2">
                              {badge.name}
                            </Typography>
                            <Typography variant="small" color="gray" className="mb-3">
                              {badge.description}
                            </Typography>
                            {badge.earned && (
                              <Chip value="Earned" className="bg-green-100 text-green-800" />
                            )}
                            {!badge.earned && (
                              <Chip value={badge.rarity.toUpperCase()} className="bg-gray-100 text-gray-600" />
                            )}
                          </CardBody>
                        </Card>
                      ))}
                    </div>
                  </CardBody>
                </Card>
              </>
            )
          ) : (
            <>
          {/* Loading States */}
          {loading && !usageData ? (
            <div className="space-y-6">
              <CardGridSkeleton count={4} />
              <LoadingSkeleton type="default" />
            </div>
          ) : (
            <>
          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="shadow-lg">
              <CardBody className="text-center p-6">
                <i className="fa-solid fa-message text-4xl text-gray-900 mb-4"></i>
                <Typography variant="h3" className="text-gray-900 mb-2">
                  {usageStats.totalInteractions.toLocaleString()}
                </Typography>
                <Typography className="text-gray-600">
                  Questions Answered
                </Typography>
              </CardBody>
            </Card>

            <Card className="shadow-lg">
              <CardBody className="text-center p-6">
                <i className="fa-solid fa-clock text-4xl text-green-600 mb-4"></i>
                <Typography variant="h3" className="text-green-600 mb-2">
                  {usageStats.totalTimeSpent}
                </Typography>
                <Typography className="text-gray-600">
                  Total Study Time
                </Typography>
              </CardBody>
            </Card>

            <Card className="shadow-lg">
              <CardBody className="text-center p-6">
                <i className="fa-solid fa-fire text-4xl text-orange-600 mb-4"></i>
                <Typography variant="h3" className="text-orange-600 mb-2">
                  {usageStats.streakDays}
                </Typography>
                <Typography className="text-gray-600">
                  Day Learning Streak
                </Typography>
              </CardBody>
            </Card>

            <Card className="shadow-lg">
              <CardBody className="text-center p-6">
                <i className="fa-solid fa-chart-line text-4xl text-blue-600 mb-4"></i>
                <Typography variant="h3" className="text-blue-600 mb-2">
                  {usageStats.averageSessionTime}
                </Typography>
                <Typography className="text-gray-600">
                  Avg Study Session
                </Typography>
              </CardBody>
            </Card>
          </div>

          {/* Weekly Learning Activity */}
          <Card className="mb-8 shadow-lg">
            <div className="bg-gray-50 px-6 py-4 rounded-t-xl">
              <Typography variant="h6" color="blue-gray" className="font-semibold">
                Weekly Learning Activity
              </Typography>
            </div>
            <CardBody className="p-6">
              <div className="space-y-4">
                {weeklyData.map((day: any, index: number) => (
                  <div key={index} className="flex items-center space-x-4">
                    <div className="w-12 text-sm font-medium text-gray-600">
                      {day.day}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-gray-900 h-2 rounded-full"
                            style={{ width: `${Math.min((day.interactions / 70) * 100, 100)}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-gray-700">
                          {day.interactions}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500">
                        {day.time}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Topics Studied */}
            <Card className="shadow-lg">
              <div className="bg-gray-50 px-6 py-4 rounded-t-xl">
                <Typography variant="h6" color="blue-gray" className="font-semibold">
                  Topics Studied
                </Typography>
              </div>
              <CardBody className="p-6">
                <div className="space-y-4">
                  {subjectBreakdown.map((subject: any, index: number) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${subject.color}`}></div>
                        <Typography variant="small" color="blue-gray" className="font-medium">
                          {subject.subject}
                        </Typography>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Typography variant="small" color="gray">
                          {subject.interactions} questions
                        </Typography>
                        <Typography variant="small" color="blue-gray" className="font-medium">
                          {subject.percentage}%
                        </Typography>
                      </div>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>

            {/* This Month's Progress */}
            <Card className="shadow-lg">
              <div className="bg-gray-50 px-6 py-4 rounded-t-xl">
                <Typography variant="h6" color="blue-gray" className="font-semibold">
                  This Month's Progress
                </Typography>
              </div>
              <CardBody className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <i className="fa-solid fa-keyboard text-blue-500"></i>
                      <Typography variant="small" color="blue-gray">
                        Questions Asked
                      </Typography>
                    </div>
                    <Typography variant="small" color="blue-gray" className="font-medium">
                      {usageStats.thisMonth.textMessages}
                    </Typography>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <i className="fa-solid fa-image text-green-500"></i>
                      <Typography variant="small" color="blue-gray">
                        Images Analyzed
                      </Typography>
                    </div>
                    <Typography variant="small" color="blue-gray" className="font-medium">
                      {usageStats.thisMonth.imageUploads}
                    </Typography>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <i className="fa-solid fa-microphone text-gray-900"></i>
                      <Typography variant="small" color="blue-gray">
                        Voice Queries
                      </Typography>
                    </div>
                    <Typography variant="small" color="blue-gray" className="font-medium">
                      {usageStats.thisMonth.voiceInputs}
                    </Typography>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <i className="fa-solid fa-clock text-orange-500"></i>
                      <Typography variant="small" color="blue-gray">
                        Study Time
                      </Typography>
                    </div>
                    <Typography variant="small" color="blue-gray" className="font-medium">
                      {usageStats.thisMonth.timeSpent}
                    </Typography>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>

          {/* Smart Learning Stats */}
          <Card className="mb-8 shadow-lg">
            <div className="bg-gray-50 px-6 py-4 rounded-t-xl">
              <Typography variant="h6" color="blue-gray" className="font-semibold">
                Smart Learning Activity
              </Typography>
            </div>
            <CardBody className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <i className="fa-solid fa-comments text-3xl text-blue-600 mb-2"></i>
                  <Typography variant="h4" className="text-gray-900 mb-1">
                    {usageData?.smartLearning?.chatSessions || 0}
                  </Typography>
                  <Typography variant="small" color="gray">
                    Chat Sessions
                  </Typography>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <i className="fa-solid fa-sticky-note text-3xl text-green-600 mb-2"></i>
                  <Typography variant="h4" className="text-gray-900 mb-1">
                    {usageData?.smartLearning?.notes || 0}
                  </Typography>
                  <Typography variant="small" color="gray">
                    Notes Created
                  </Typography>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <i className="fa-solid fa-lightbulb text-3xl text-yellow-600 mb-2"></i>
                  <Typography variant="h4" className="text-gray-900 mb-1">
                    {usageData?.smartLearning?.flashcards || 0}
                  </Typography>
                  <Typography variant="small" color="gray">
                    Flashcards
                  </Typography>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <i className="fa-solid fa-diagram-project text-3xl text-purple-600 mb-2"></i>
                  <Typography variant="h4" className="text-gray-900 mb-1">
                    {usageData?.smartLearning?.mindMaps || 0}
                  </Typography>
                  <Typography variant="small" color="gray">
                    Mind Maps
                  </Typography>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <i className="fa-solid fa-clipboard-check text-3xl text-red-600 mb-2"></i>
                  <Typography variant="h4" className="text-gray-900 mb-1">
                    {usageData?.smartLearning?.examSessions || 0}
                  </Typography>
                  <Typography variant="small" color="gray">
                    Exam Sessions
                  </Typography>
                </div>
                <div className="text-center p-4 bg-indigo-50 rounded-lg">
                  <i className="fa-solid fa-brain text-3xl text-indigo-600 mb-2"></i>
                  <Typography variant="h4" className="text-gray-900 mb-1">
                    {usageData?.smartLearning?.focusSessions || totalSessions}
                  </Typography>
                  <Typography variant="small" color="gray">
                    Focus Sessions
                  </Typography>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <i className="fa-solid fa-trophy text-3xl text-orange-600 mb-2"></i>
                  <Typography variant="h4" className="text-gray-900 mb-1">
                    {usageData?.smartLearning?.achievements || 0}
                  </Typography>
                  <Typography variant="small" color="gray">
                    Achievements
                  </Typography>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <i className="fa-solid fa-image text-3xl text-gray-600 mb-2"></i>
                  <Typography variant="h4" className="text-gray-900 mb-1">
                    {usageStats.imageUploads}
                  </Typography>
                  <Typography variant="small" color="gray">
                    Images Analyzed
                  </Typography>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Additional Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardBody>
                <Typography variant="h6" color="blue-gray" className="mb-4">
                  <i className="fa-solid fa-microphone mr-2"></i>
                  Voice Queries
                </Typography>
                <Typography variant="h2" className="text-gray-900">
                  {usageStats.voiceInputs}
                </Typography>
              </CardBody>
            </Card>
          </div>

          <Card>
            <CardBody>
              <Typography variant="h6" color="blue-gray" className="mb-4">
                Current Plan
              </Typography>
              <div className="flex items-center gap-4">
                <div className="px-4 py-2 bg-gray-900 text-white rounded-lg">
                  <Typography variant="h6" className="text-white">
                    {user?.plan || 'Basic'}
                  </Typography>
                </div>
                <Typography color="gray">
                  {usageStats.totalTimeSpent} total time spent
                </Typography>
              </div>
            </CardBody>
          </Card>
            </>
          )}
            </>
          )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

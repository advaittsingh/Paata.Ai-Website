"use client";

import { useState, useEffect } from 'react';
import { Navbar } from '@/components';
import { Typography, Button, Card, CardBody, IconButton, Chip } from '@material-tailwind/react';
import { useUser } from '@/contexts/UserContext';
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import LoadingSkeleton, { CardGridSkeleton } from '@/components/loading-skeleton';

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

export default function AchievementsPage() {
  const { user } = useUser();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [stats, setStats] = useState({
    totalAchievements: 0,
    unlockedAchievements: 0,
    totalBadges: 0,
    earnedBadges: 0
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'achievements' | 'badges'>('achievements');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (user) {
      fetchAchievements();
      // Don't auto-check on load - let user trigger it manually
      // checkAchievements();
    }
  }, [user]);

  const fetchAchievements = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/achievements?userId=${user?.id}`);
      const data = await response.json();
      if (data.success) {
        setAchievements(data.achievements || []);
        setBadges(data.badges || []);
        setStats(data.stats || stats);
      }
    } catch (error) {
      console.error('Error fetching achievements:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const checkAchievements = async () => {
    try {
      // Trigger achievement check with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      await fetch('/api/achievements/check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      // Refresh achievements after check
      setTimeout(() => {
        fetchAchievements();
      }, 500);
    } catch (error: any) {
      console.error('Error checking achievements:', error);
      if (error.name === 'AbortError') {
        console.error('Achievement check timed out');
      }
    }
  };

  const fixAchievements = async () => {
    try {
      setIsLoading(true);
      
      // Use force-check endpoint which is more reliable
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
        // Refresh achievements
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
      setIsLoading(false);
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

  const sidebarContent = (
    <div className={`${sidebarOpen ? 'w-80' : 'w-0'} transition-all duration-300 ease-in-out bg-gray-900 flex flex-col overflow-hidden shadow-xl`}>
      <div className="pb-4 px-4 bg-gray-900 border-b border-gray-700 pt-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">P</span>
            </div>
            <div>
              <Typography variant="h6" color="white" className="font-bold text-lg">
                PAATA.AI
              </Typography>
              <Typography variant="small" color="gray" className="text-xs">
                Your AI Assistant
              </Typography>
            </div>
          </div>
          <IconButton
            variant="text"
            color="white"
            size="sm"
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden"
          >
            <XMarkIcon className="w-5 h-5" />
          </IconButton>
        </div>
        <div className="space-y-2">
          <a href="/app" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 transition-colors text-gray-300">
            <i className="fa-solid fa-comments w-5"></i>
            <span className="text-sm font-medium">Chat</span>
          </a>
          <a href="/app/notes" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 transition-colors text-gray-300">
            <i className="fa-solid fa-sticky-note w-5"></i>
            <span className="text-sm font-medium">Notes</span>
          </a>
          <a href="/app/flashcards" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 transition-colors text-gray-300">
            <i className="fa-solid fa-lightbulb w-5"></i>
            <span className="text-sm font-medium">Flashcards</span>
          </a>
          <a href="/app/mindmaps" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 transition-colors text-gray-300">
            <i className="fa-solid fa-diagram-project w-5"></i>
            <span className="text-sm font-medium">Mind Maps</span>
          </a>
          <a href="/app/exam" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 transition-colors text-gray-300">
            <i className="fa-solid fa-clipboard-check w-5"></i>
            <span className="text-sm font-medium">Exam Mode</span>
          </a>
          <a href="/app/focus" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 transition-colors text-gray-300">
            <i className="fa-solid fa-brain w-5"></i>
            <span className="text-sm font-medium">Focus Mode</span>
          </a>
          <a href="/app/progress" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 transition-colors text-gray-300">
            <i className="fa-solid fa-chart-line w-5"></i>
            <span className="text-sm font-medium">Progress</span>
          </a>
          <a href="/app/achievements" className="flex items-center gap-3 p-3 rounded-lg bg-gray-800 text-white">
            <i className="fa-solid fa-trophy w-5"></i>
            <span className="text-sm font-medium">Achievements</span>
          </a>
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-screen bg-gray-50 overflow-hidden flex flex-col">
      <Navbar />
      
      <div className="flex flex-1 overflow-hidden">
        {sidebarContent}
        
        <div className="flex-1 flex flex-col bg-white pt-20">
          <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-4">
              {!sidebarOpen && (
                <IconButton
                  variant="text"
                  color="gray"
                  size="sm"
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden"
                >
                  <Bars3Icon className="w-5 h-5" />
                </IconButton>
              )}
              <Typography variant="h5" color="blue-gray" className="font-bold">
                Achievements & Badges
              </Typography>
            </div>
            <Button
              onClick={fixAchievements}
              disabled={isLoading}
              className="bg-gray-900 text-white"
              size="sm"
            >
              {isLoading ? 'Checking...' : 'Fix & Check Achievements'}
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto">
            <div className="container mx-auto px-4 py-8">
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
                          {stats.totalAchievements}
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
                          {stats.unlockedAchievements}
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
                          {stats.totalBadges}
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
                          {stats.earnedBadges}
                        </Typography>
                      </div>
                      <i className="fa-solid fa-medal text-3xl opacity-50"></i>
                    </div>
                  </CardBody>
                </Card>
              </div>

              {/* Tabs */}
              <div className="flex gap-2 mb-6">
                <Button
                  variant={selectedTab === 'achievements' ? 'filled' : 'outlined'}
                  onClick={() => setSelectedTab('achievements')}
                  className={selectedTab === 'achievements' ? 'bg-gray-900' : ''}
                >
                  <i className="fa-solid fa-trophy mr-2"></i>
                  Achievements
                </Button>
                <Button
                  variant={selectedTab === 'badges' ? 'filled' : 'outlined'}
                  onClick={() => setSelectedTab('badges')}
                  className={selectedTab === 'badges' ? 'bg-gray-900' : ''}
                >
                  <i className="fa-solid fa-award mr-2"></i>
                  Badges
                </Button>
              </div>

              {/* Achievements Tab */}
              {selectedTab === 'achievements' && (
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
              )}

              {/* Badges Tab */}
              {selectedTab === 'badges' && (
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
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}




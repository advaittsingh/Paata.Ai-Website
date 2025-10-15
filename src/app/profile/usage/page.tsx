"use client";

import React, { useState, useEffect } from 'react';
import { Typography, Card, CardBody, CardHeader, Button, Chip } from '@material-tailwind/react';
import { 
  ChartBarIcon, 
  ChatBubbleLeftRightIcon,
  PhotoIcon,
  MicrophoneIcon,
  ClockIcon,
  ArrowTrendingUpIcon,
  CalendarIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline';
import ProfileSidebar from '@/components/profile-sidebar';
import { Navbar } from '@/components';
import { useUser } from '@/contexts/UserContext';

export default function UsagePage() {
  const { user: contextUser } = useUser();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [usageData, setUsageData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch usage data when component mounts, period changes, or user stats change
  useEffect(() => {
    const fetchUsageData = async () => {
      if (!contextUser?.id) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch(`/api/usage?userId=${contextUser.id}&period=${selectedPeriod}&t=${Date.now()}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch usage data');
        }
        
        const data = await response.json();
        setUsageData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load usage data');
        console.error('Error fetching usage data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsageData();
    
    // Set up real-time refresh every 30 seconds
    const interval = setInterval(fetchUsageData, 30000);
    
    return () => clearInterval(interval);
  }, [contextUser?.id, selectedPeriod, contextUser?.stats?.totalInteractions]);

  const user = {
    name: `${contextUser?.firstName || ''} ${contextUser?.lastName || ''}`.trim() || 'User',
    email: contextUser?.email || 'user@example.com',
    avatar: contextUser?.avatar || '/image/avatar1.jpg',
    plan: contextUser?.plan || 'Basic',
  };

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
    totalInteractions: contextUser?.stats?.totalInteractions || 0,
    textMessages: contextUser?.stats?.textMessages || 0,
    imageUploads: contextUser?.stats?.imageUploads || 0,
    voiceInputs: contextUser?.stats?.voiceInputs || 0,
    totalTimeSpent: contextUser?.stats?.totalTimeSpent || '0h 0m',
    averageSessionTime: contextUser?.stats?.averageSessionTime || '0m 0s',
    streakDays: contextUser?.stats?.streakDays || 0,
    thisMonth: {
      interactions: contextUser?.stats?.totalInteractions || 0,
      textMessages: contextUser?.stats?.textMessages || 0,
      imageUploads: contextUser?.stats?.imageUploads || 0,
      voiceInputs: contextUser?.stats?.voiceInputs || 0,
      timeSpent: contextUser?.stats?.totalTimeSpent || '0h 0m'
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
    { subject: 'English', interactions: 0, percentage: 0, color: 'bg-purple-500' },
    { subject: 'History', interactions: 0, percentage: 0, color: 'bg-orange-500' },
    { subject: 'Other', interactions: 0, percentage: 0, color: 'bg-gray-500' }
  ];

  const recentActivity = usageData?.recentActivity || [];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'text':
        return <ChatBubbleLeftRightIcon className="w-5 h-5 text-blue-500" />;
      case 'image':
        return <PhotoIcon className="w-5 h-5 text-green-500" />;
      case 'voice':
        return <MicrophoneIcon className="w-5 h-5 text-purple-500" />;
      default:
        return <ChatBubbleLeftRightIcon className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 relative">
      <Navbar />
      
      <div className="flex flex-col lg:flex-row pt-20">
        {/* Sidebar */}
        <div className="relative z-10">
          <ProfileSidebar
            isCollapsed={isSidebarCollapsed}
            onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            user={user}
          />
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4 lg:p-8 relative z-10">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <Typography variant="h3" color="blue-gray" className="font-bold mb-2">
                    Usage Statistics
                  </Typography>
                  <Typography variant="paragraph" color="gray">
                    Track your learning progress and AI interactions
                  </Typography>
                </div>
                <div className="flex items-center space-x-3">
                  <Button variant="outlined" size="sm" className="flex items-center gap-2">
                    <ArrowDownTrayIcon className="w-4 h-4" />
                    Export Data
                  </Button>
                  <select
                    value={selectedPeriod}
                    onChange={(e) => setSelectedPeriod(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  >
                    <option value="7d">Last 7 days</option>
                    <option value="30d">Last 30 days</option>
                    <option value="90d">Last 90 days</option>
                    <option value="1y">Last year</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                  <Typography variant="paragraph" color="gray">
                    Loading usage data...
                  </Typography>
                </div>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <Typography variant="small" color="red" className="font-medium">
                      Error loading usage data
                    </Typography>
                    <Typography variant="small" color="gray" className="mt-1">
                      {error}
                    </Typography>
                  </div>
                </div>
              </div>
            )}

            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="shadow-lg">
                <CardBody className="p-6 text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ChatBubbleLeftRightIcon className="w-6 h-6 text-blue-600" />
                  </div>
                  <Typography variant="h3" color="blue-gray" className="font-bold mb-2">
                    {usageStats.totalInteractions.toLocaleString()}
                  </Typography>
                  <Typography variant="small" color="gray">
                    Total Interactions
                  </Typography>
                </CardBody>
              </Card>

              <Card className="shadow-lg">
                <CardBody className="p-6 text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ClockIcon className="w-6 h-6 text-green-600" />
                  </div>
                  <Typography variant="h3" color="blue-gray" className="font-bold mb-2">
                    {usageStats.totalTimeSpent}
                  </Typography>
                  <Typography variant="small" color="gray">
                    Time Spent Learning
                  </Typography>
                </CardBody>
              </Card>

              <Card className="shadow-lg">
                <CardBody className="p-6 text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ArrowTrendingUpIcon className="w-6 h-6 text-purple-600" />
                  </div>
                  <Typography variant="h3" color="blue-gray" className="font-bold mb-2">
                    {usageStats.streakDays}
                  </Typography>
                  <Typography variant="small" color="gray">
                    Day Streak
                  </Typography>
                </CardBody>
              </Card>

              <Card className="shadow-lg">
                <CardBody className="p-6 text-center">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CalendarIcon className="w-6 h-6 text-orange-600" />
                  </div>
                  <Typography variant="h3" color="blue-gray" className="font-bold mb-2">
                    {usageStats.averageSessionTime}
                  </Typography>
                  <Typography variant="small" color="gray">
                    Avg Session Time
                  </Typography>
                </CardBody>
              </Card>
            </div>

            {/* Weekly Activity Chart */}
            <Card className="mb-8 shadow-lg">
              <CardHeader className="bg-gray-50 px-6 py-4">
                <Typography variant="h6" color="blue-gray" className="font-semibold">
                  Weekly Activity
                </Typography>
              </CardHeader>
              <CardBody className="p-6">
                <div className="space-y-4">
                  {weeklyData.map((day, index) => (
                    <div key={index} className="flex items-center space-x-4">
                      <div className="w-12 text-sm font-medium text-gray-600">
                        {day.day}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-purple-500 h-2 rounded-full"
                              style={{ width: `${(day.interactions / 70) * 100}%` }}
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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Subject Breakdown */}
              <Card className="shadow-lg">
                <CardHeader className="bg-gray-50 px-6 py-4">
                  <Typography variant="h6" color="blue-gray" className="font-semibold">
                    Subject Breakdown
                  </Typography>
                </CardHeader>
                <CardBody className="p-6">
                  <div className="space-y-4">
                    {subjectBreakdown.map((subject, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-3 h-3 rounded-full ${subject.color}`}></div>
                          <Typography variant="small" color="blue-gray" className="font-medium">
                            {subject.subject}
                          </Typography>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Typography variant="small" color="gray">
                            {subject.interactions} interactions
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

              {/* This Month's Stats */}
              <Card className="shadow-lg">
                <CardHeader className="bg-gray-50 px-6 py-4">
                  <Typography variant="h6" color="blue-gray" className="font-semibold">
                    This Month
                  </Typography>
                </CardHeader>
                <CardBody className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <ChatBubbleLeftRightIcon className="w-5 h-5 text-blue-500" />
                        <Typography variant="small" color="blue-gray">
                          Text Messages
                        </Typography>
                      </div>
                      <Typography variant="small" color="blue-gray" className="font-medium">
                        {usageStats.thisMonth.textMessages}
                      </Typography>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <PhotoIcon className="w-5 h-5 text-green-500" />
                        <Typography variant="small" color="blue-gray">
                          Image Uploads
                        </Typography>
                      </div>
                      <Typography variant="small" color="blue-gray" className="font-medium">
                        {usageStats.thisMonth.imageUploads}
                      </Typography>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <MicrophoneIcon className="w-5 h-5 text-purple-500" />
                        <Typography variant="small" color="blue-gray">
                          Voice Inputs
                        </Typography>
                      </div>
                      <Typography variant="small" color="blue-gray" className="font-medium">
                        {usageStats.thisMonth.voiceInputs}
                      </Typography>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <ClockIcon className="w-5 h-5 text-orange-500" />
                        <Typography variant="small" color="blue-gray">
                          Time Spent
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

            {/* Recent Activity */}
            <Card className="mt-8 shadow-lg">
              <CardHeader className="bg-gray-50 px-6 py-4">
                <Typography variant="h6" color="blue-gray" className="font-semibold">
                  Recent Activity
                </Typography>
              </CardHeader>
              <CardBody className="p-0">
                <div className="divide-y divide-gray-200">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="p-6 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                          {getTypeIcon(activity.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <Typography variant="small" color="blue-gray" className="font-medium">
                              {activity.subject}
                            </Typography>
                            <Chip
                              value={activity.type}
                              size="sm"
                              color="purple"
                              className="text-xs"
                            />
                          </div>
                          <Typography variant="small" color="gray" className="mb-2">
                            {activity.question}
                          </Typography>
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <span>{activity.time}</span>
                            <span>•</span>
                            <span>{activity.duration}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

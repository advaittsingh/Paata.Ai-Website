"use client";

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components';
import { useUser } from '@/contexts/UserContext';
import { useRouter } from 'next/navigation';
import { Typography, Button, Card, CardBody, Chip } from '@material-tailwind/react';
import { 
  ChartBarIcon, 
  UsersIcon, 
  CurrencyDollarIcon, 
  DocumentTextIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
} from '@heroicons/react/24/outline';

interface AnalyticsData {
  overview: {
    totalUsers: number;
    activeUsers: number;
    newUsers: number;
    inactiveUsers: number;
  };
  planDistribution: {
    Basic: number;
    Pro: number;
    Enterprise: number;
  };
  usage: {
    totalInteractions: number;
    totalTextMessages: number;
    totalImageUploads: number;
    totalVoiceInputs: number;
    totalChatSessions: number;
    totalNotes: number;
    totalFlashcards: number;
    totalExamSessions: number;
    totalFocusSessions: number;
  };
  featureUsage: Array<{
    name: string;
    count: number;
    percentage: number;
  }>;
  inputMethodDistribution: {
    text: number;
    image: number;
    voice: number;
    percentages: {
      text: number;
      image: number;
      voice: number;
    };
  };
  mostActiveUsers: Array<{
    id: string;
    name: string;
    email: string;
    plan: string;
    interactions: number;
    streakDays: number;
  }>;
}

interface BillingData {
  overview: {
    monthlyRecurringRevenue: number;
    totalRevenue: number;
    activeSubscriptions: number;
    arpu: number;
    churnRate: number;
  };
  subscriptionPlanDistribution: {
    Basic: number;
    Pro: number;
    Enterprise: number;
  };
  subscriptionStatus: {
    Active: number;
    Inactive: number;
    Trialing: number;
    PastDue: number;
    Cancelled: number;
    Expired: number;
  };
  revenueByPlan: {
    Basic: number;
    Pro: number;
    Enterprise: number;
  };
  recentTransactions: Array<{
    id: string;
    userId: string;
    amount: string;
    status: string;
    plan: string;
    createdAt: string;
  }>;
}

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  plan: string;
  subscriptionStatus: string;
  emailVerified: boolean;
  totalInteractions: number;
  streakDays: number;
  createdAt: string;
}

export default function AdminDashboard() {
  const { user, isAuthenticated, isLoading: userLoading } = useUser();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [billing, setBilling] = useState<BillingData | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [monitoring, setMonitoring] = useState<any>(null);
  const [isRunningDiagnostics, setIsRunningDiagnostics] = useState(false);

  // Check admin access
  useEffect(() => {
    if (userLoading) return;

    if (!isAuthenticated || !user) {
      router.push('/auth/login');
      return;
    }

    const checkAdmin = async () => {
      try {
        const response = await fetch('/api/admin/check', {
          credentials: 'include',
        });
        const data = await response.json();
        
        if (!data.isAdmin) {
          setError('Access denied. Admin privileges required.');
          return;
        }

        // Load data
        await Promise.all([
          fetchAnalytics(),
          fetchBilling(),
          fetchUsers(),
          fetchMonitoring(),
        ]);
      } catch (err) {
        console.error('Admin check error:', err);
        setError('Failed to verify admin access.');
      } finally {
        setLoading(false);
      }
    };

    checkAdmin();
  }, [user, isAuthenticated, userLoading, router, selectedPeriod]);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch(`/api/admin/analytics?period=${selectedPeriod}`, {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setAnalytics(data.analytics);
      }
    } catch (err) {
      console.error('Fetch analytics error:', err);
    }
  };

  const fetchBilling = async () => {
    try {
      const response = await fetch(`/api/admin/billing?period=${selectedPeriod}`, {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setBilling(data.billing);
      }
    } catch (err) {
      console.error('Fetch billing error:', err);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users', {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || []);
      }
    } catch (err) {
      console.error('Fetch users error:', err);
    }
  };

  const fetchUserDetails = async (userId: string) => {
    try {
      const response = await fetch(`/api/admin/users?userId=${userId}&includeStats=true`, {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setSelectedUser(data.user);
      }
    } catch (err) {
      console.error('Fetch user details error:', err);
    }
  };

  const fetchMonitoring = async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 20000); // 20 second timeout

      const response = await fetch('/api/admin/monitoring', {
        credentials: 'include',
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        if (data.monitoring) {
          setMonitoring(data.monitoring);
        } else {
          console.error('Invalid monitoring data format:', data);
          setMonitoring(null);
        }
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('Monitoring API error:', errorData);
        setMonitoring(null);
      }
    } catch (err: any) {
      console.error('Fetch monitoring error:', err);
      if (err.name === 'AbortError') {
        console.error('Monitoring request timed out');
      }
      setMonitoring(null);
    }
  };

  const runDiagnostics = async () => {
    setIsRunningDiagnostics(true);
    try {
      const response = await fetch('/api/admin/monitoring', {
        method: 'POST',
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setMonitoring({
          ...monitoring,
          diagnostics: data.diagnostics,
          healthChecks: data.healthChecks,
          timestamp: data.timestamp,
        });
      }
    } catch (err) {
      console.error('Run diagnostics error:', err);
    } finally {
      setIsRunningDiagnostics(false);
    }
  };

  const handleRestartServer = async () => {
    if (!confirm('Are you sure you want to restart the server? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch('/api/admin/monitoring/restart', {
        method: 'POST',
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        alert(data.message || 'Restart request sent successfully');
      } else {
        alert('Failed to send restart request');
      }
    } catch (err) {
      console.error('Restart server error:', err);
      alert('Error sending restart request');
    }
  };

  if (userLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user || error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Typography variant="h4" color="red" className="mb-4">
            {error || 'Access Denied'}
          </Typography>
          <Button onClick={() => router.push('/')} color="white">
            Go Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 relative">
      <Navbar />
      
      <div className="mt-20 min-h-[calc(100vh-80px)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-8">
          {/* Header */}
          <div className="mb-6">
            <div className="mb-4">
              <Typography variant="h2" color="blue-gray" className="mb-2">
                Admin Dashboard
              </Typography>
              <Typography color="gray">
                Comprehensive analytics, user management, and billing overview
              </Typography>
            </div>

            {/* Action Buttons and Navigation */}
            <div className="flex items-center justify-between gap-4 mt-4 flex-wrap">
              {/* Navigation Buttons */}
              <div className="flex items-center gap-2 flex-wrap">
                <Button
                  size="sm"
                  color={activeTab === 'overview' ? 'gray' : 'white'}
                  onClick={() => setActiveTab('overview')}
                  className={activeTab === 'overview' ? 'bg-gray-900 text-white' : ''}
                >
                  <i className="fa-solid fa-home mr-2"></i>
                  Overview
                </Button>
                <Button
                  size="sm"
                  color={activeTab === 'users' ? 'gray' : 'white'}
                  onClick={() => setActiveTab('users')}
                  className={activeTab === 'users' ? 'bg-gray-900 text-white' : ''}
                >
                  <i className="fa-solid fa-users mr-2"></i>
                  Users
                </Button>
                <Button
                  size="sm"
                  color={activeTab === 'analytics' ? 'gray' : 'white'}
                  onClick={() => setActiveTab('analytics')}
                  className={activeTab === 'analytics' ? 'bg-gray-900 text-white' : ''}
                >
                  <i className="fa-solid fa-chart-bar mr-2"></i>
                  Analytics
                </Button>
                <Button
                  size="sm"
                  color={activeTab === 'billing' ? 'gray' : 'white'}
                  onClick={() => setActiveTab('billing')}
                  className={activeTab === 'billing' ? 'bg-gray-900 text-white' : ''}
                >
                  <i className="fa-solid fa-dollar-sign mr-2"></i>
                  Billing
                </Button>
                <Button
                  size="sm"
                  color={activeTab === 'monitoring' ? 'gray' : 'white'}
                  onClick={() => setActiveTab('monitoring')}
                  className={activeTab === 'monitoring' ? 'bg-gray-900 text-white' : ''}
                >
                  <i className="fa-solid fa-shield-alt mr-2"></i>
                  Monitoring
                </Button>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-4 flex-wrap">
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                >
                  <option value="7d">Last 7 days</option>
                  <option value="30d">Last 30 days</option>
                  <option value="90d">Last 90 days</option>
                  <option value="1y">Last year</option>
                </select>
                <Button
                  size="sm"
                  color="white"
                  onClick={() => router.push('/admin/notifications')}
                >
                  Send Notifications
                </Button>
                <Button
                  size="sm"
                  color="white"
                  onClick={() => router.push('/admin/learning')}
                >
                  Manage Learning Content
                </Button>
              </div>
            </div>
          </div>

          {/* Content based on active tab */}
          <div className="mt-8">
              {/* Overview Tab */}
              {activeTab === 'overview' && analytics && (
                  <div className="space-y-6">
                    {/* Key Metrics */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      <Card className="shadow-lg">
                        <CardBody className="p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-blue-100 rounded-lg">
                              <UsersIcon className="w-6 h-6 text-blue-600" />
                            </div>
                            <Chip value="Total" color="blue" variant="ghost" />
                          </div>
                          <Typography variant="h3" color="blue-gray" className="mb-2">
                            {analytics.overview.totalUsers.toLocaleString()}
                          </Typography>
                          <Typography color="gray" className="text-sm">
                            Total Users
                          </Typography>
                        </CardBody>
                      </Card>

                      <Card className="shadow-lg">
                        <CardBody className="p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-green-100 rounded-lg">
                              <ChartBarIcon className="w-6 h-6 text-green-600" />
                            </div>
                            <Chip value="Active" color="green" variant="ghost" />
                          </div>
                          <Typography variant="h3" color="blue-gray" className="mb-2">
                            {analytics.overview.activeUsers.toLocaleString()}
                          </Typography>
                          <Typography color="gray" className="text-sm">
                            Active Users
                          </Typography>
                        </CardBody>
                      </Card>

                      <Card className="shadow-lg">
                        <CardBody className="p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-purple-100 rounded-lg">
                              <CurrencyDollarIcon className="w-6 h-6 text-purple-600" />
                            </div>
                            <Chip value="MRR" color="purple" variant="ghost" />
                          </div>
                          <Typography variant="h3" color="blue-gray" className="mb-2">
                            ₹{billing?.overview.monthlyRecurringRevenue.toLocaleString() || '0'}
                          </Typography>
                          <Typography color="gray" className="text-sm">
                            Monthly Recurring Revenue
                          </Typography>
                        </CardBody>
                      </Card>

                      <Card className="shadow-lg">
                        <CardBody className="p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-orange-100 rounded-lg">
                              <DocumentTextIcon className="w-6 h-6 text-orange-600" />
                            </div>
                            <Chip value="Interactions" color="orange" variant="ghost" />
                          </div>
                          <Typography variant="h3" color="blue-gray" className="mb-2">
                            {analytics.usage.totalInteractions.toLocaleString()}
                          </Typography>
                          <Typography color="gray" className="text-sm">
                            Total Interactions
                          </Typography>
                        </CardBody>
                      </Card>
                    </div>

                    {/* Feature Usage */}
                    <Card className="shadow-lg">
                      <CardBody className="p-6">
                        <Typography variant="h6" color="blue-gray" className="mb-6">
                          Most Used Features
                        </Typography>
                        <div className="space-y-4">
                          {analytics.featureUsage.map((feature, index) => (
                            <div key={feature.name} className="flex items-center justify-between">
                              <div className="flex items-center gap-4 flex-1">
                                <div className="w-8 h-8 bg-gray-900 text-white rounded-lg flex items-center justify-center font-bold">
                                  {index + 1}
                                </div>
                                <div className="flex-1">
                                  <Typography variant="h6" color="blue-gray">
                                    {feature.name}
                                  </Typography>
                                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                                    <div
                                      className="bg-gray-900 h-2 rounded-full"
                                      style={{ width: `${feature.percentage}%` }}
                                    ></div>
                                  </div>
                                </div>
                              </div>
                              <div className="text-right ml-4">
                                <Typography variant="h6" color="blue-gray">
                                  {feature.count.toLocaleString()}
                                </Typography>
                                <Typography variant="small" color="gray">
                                  {feature.percentage}%
                                </Typography>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardBody>
                    </Card>

                    {/* Most Active Users */}
                    <Card className="shadow-lg">
                      <CardBody className="p-6">
                        <Typography variant="h6" color="blue-gray" className="mb-6">
                          Most Active Users
                        </Typography>
                        <div className="space-y-3">
                          {analytics.mostActiveUsers.map((user, index) => (
                            <div
                              key={user.id}
                              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer"
                              onClick={() => {
                                setSelectedUser(user as any);
                                setActiveTab('users');
                                fetchUserDetails(user.id);
                              }}
                            >
                              <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-gray-900 text-white rounded-full flex items-center justify-center font-bold">
                                  {index + 1}
                                </div>
                                <div>
                                  <Typography variant="h6" color="blue-gray">
                                    {user.name}
                                  </Typography>
                                  <Typography variant="small" color="gray">
                                    {user.email}
                                  </Typography>
                                </div>
                              </div>
                              <div className="text-right">
                                <Typography variant="small" color="blue-gray" className="font-medium">
                                  {user.interactions.toLocaleString()} interactions
                                </Typography>
                                <Typography variant="small" color="gray">
                                  {user.streakDays} day streak
                                </Typography>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardBody>
                    </Card>
                  </div>
                )}

              {/* Users Tab */}
              {activeTab === 'users' && (
                <>
                <Card className="shadow-lg">
                  <CardBody className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <Typography variant="h6" color="blue-gray">
                        All Users ({users.length})
                      </Typography>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Search users..."
                          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                        />
                      </div>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-gray-200">
                            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Name</th>
                            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Email</th>
                            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Plan</th>
                            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Interactions</th>
                            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {users.map((u) => (
                            <tr
                              key={u.id}
                              className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                              onClick={() => {
                                setSelectedUser(u);
                                fetchUserDetails(u.id);
                              }}
                            >
                              <td className="py-3 px-4">
                                <Typography variant="small" color="blue-gray" className="font-medium">
                                  {u.firstName} {u.lastName}
                                </Typography>
                              </td>
                              <td className="py-3 px-4">
                                <Typography variant="small" color="gray">
                                  {u.email}
                                </Typography>
                              </td>
                              <td className="py-3 px-4">
                                <Chip
                                  value={u.plan}
                                  color={u.plan === 'Enterprise' ? 'blue' : u.plan === 'Pro' ? 'green' : 'gray'}
                                  variant="ghost"
                                />
                              </td>
                              <td className="py-3 px-4">
                                <Typography variant="small" color="blue-gray">
                                  {u.totalInteractions.toLocaleString()}
                                </Typography>
                              </td>
                              <td className="py-3 px-4">
                                <Chip
                                  value={u.subscriptionStatus || 'Inactive'}
                                  color={u.subscriptionStatus === 'Active' ? 'green' : 'gray'}
                                  variant="ghost"
                                />
                              </td>
                              <td className="py-3 px-4">
                                <Button
                                  size="sm"
                                  variant="text"
                                  color="gray-900"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedUser(u);
                                    fetchUserDetails(u.id);
                                  }}
                                >
                                  View Details
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardBody>
                </Card>

                {/* User Details Modal */}
                {selectedUser && (
                  <div 
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                    onClick={() => setSelectedUser(null)}
                  >
                    <Card 
                      className="max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <CardBody className="p-6">
                        <div className="flex items-center justify-between mb-6">
                          <Typography variant="h5" color="blue-gray">
                            User Details
                          </Typography>
                          <Button
                            variant="text"
                            color="gray"
                            onClick={() => setSelectedUser(null)}
                          >
                            ✕
                          </Button>
                        </div>
                        <div className="space-y-4">
                          <div>
                            <Typography variant="small" color="gray" className="mb-1">Name</Typography>
                            <Typography variant="h6" color="blue-gray">
                              {selectedUser.firstName} {selectedUser.lastName}
                            </Typography>
                          </div>
                          <div>
                            <Typography variant="small" color="gray" className="mb-1">Email</Typography>
                            <Typography color="blue-gray">{selectedUser.email}</Typography>
                          </div>
                          <div>
                            <Typography variant="small" color="gray" className="mb-1">Plan</Typography>
                            <Chip value={selectedUser.plan} color="blue" variant="ghost" />
                          </div>
                          <div>
                            <Typography variant="small" color="gray" className="mb-1">Interactions</Typography>
                            <Typography color="blue-gray">{selectedUser.totalInteractions.toLocaleString()}</Typography>
                          </div>
                          <div>
                            <Typography variant="small" color="gray" className="mb-1">Streak</Typography>
                            <Typography color="blue-gray">{selectedUser.streakDays} days</Typography>
                          </div>
                          <div>
                            <Typography variant="small" color="gray" className="mb-1">Joined</Typography>
                            <Typography color="blue-gray">
                              {new Date(selectedUser.createdAt).toLocaleDateString()}
                            </Typography>
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  </div>
                )}
                </>
              )}

              {/* Analytics Tab */}
              {activeTab === 'analytics' && analytics && (
                  <div className="space-y-6">
                    {/* Usage Statistics */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      <Card className="shadow-lg">
                        <CardBody className="p-6 text-center">
                          <Typography variant="h3" color="blue-gray" className="mb-2">
                            {analytics.usage.totalChatSessions.toLocaleString()}
                          </Typography>
                          <Typography color="gray" className="text-sm">
                            Chat Sessions
                          </Typography>
                        </CardBody>
                      </Card>
                      <Card className="shadow-lg">
                        <CardBody className="p-6 text-center">
                          <Typography variant="h3" color="blue-gray" className="mb-2">
                            {analytics.usage.totalNotes.toLocaleString()}
                          </Typography>
                          <Typography color="gray" className="text-sm">
                            Notes Created
                          </Typography>
                        </CardBody>
                      </Card>
                      <Card className="shadow-lg">
                        <CardBody className="p-6 text-center">
                          <Typography variant="h3" color="blue-gray" className="mb-2">
                            {analytics.usage.totalFlashcards.toLocaleString()}
                          </Typography>
                          <Typography color="gray" className="text-sm">
                            Flashcards
                          </Typography>
                        </CardBody>
                      </Card>
                      <Card className="shadow-lg">
                        <CardBody className="p-6 text-center">
                          <Typography variant="h3" color="blue-gray" className="mb-2">
                            {analytics.usage.totalExamSessions.toLocaleString()}
                          </Typography>
                          <Typography color="gray" className="text-sm">
                            Exam Sessions
                          </Typography>
                        </CardBody>
                      </Card>
                    </div>

                    {/* Input Method Distribution */}
                    <Card className="shadow-lg">
                      <CardBody className="p-6">
                        <Typography variant="h6" color="blue-gray" className="mb-6">
                          Input Method Distribution
                        </Typography>
                        <div className="space-y-4">
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <Typography variant="small" color="blue-gray" className="font-medium">
                                Text Messages
                              </Typography>
                              <Typography variant="small" color="gray">
                                {analytics.inputMethodDistribution.text.toLocaleString()} ({analytics.inputMethodDistribution.percentages.text}%)
                              </Typography>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-gray-900 h-2 rounded-full"
                                style={{ width: `${analytics.inputMethodDistribution.percentages.text}%` }}
                              ></div>
                            </div>
                          </div>
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <Typography variant="small" color="blue-gray" className="font-medium">
                                Image Uploads
                              </Typography>
                              <Typography variant="small" color="gray">
                                {analytics.inputMethodDistribution.image.toLocaleString()} ({analytics.inputMethodDistribution.percentages.image}%)
                              </Typography>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-gray-900 h-2 rounded-full"
                                style={{ width: `${analytics.inputMethodDistribution.percentages.image}%` }}
                              ></div>
                            </div>
                          </div>
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <Typography variant="small" color="blue-gray" className="font-medium">
                                Voice Inputs
                              </Typography>
                              <Typography variant="small" color="gray">
                                {analytics.inputMethodDistribution.voice.toLocaleString()} ({analytics.inputMethodDistribution.percentages.voice}%)
                              </Typography>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-gray-900 h-2 rounded-full"
                                style={{ width: `${analytics.inputMethodDistribution.percentages.voice}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </CardBody>
                    </Card>

                    {/* Plan Distribution */}
                    <Card className="shadow-lg">
                      <CardBody className="p-6">
                        <Typography variant="h6" color="blue-gray" className="mb-6">
                          Plan Distribution
                        </Typography>
                        <div className="space-y-4">
                          {Object.entries(analytics.planDistribution).map(([plan, count]) => {
                            const total = Object.values(analytics.planDistribution).reduce((a, b) => a + b, 0);
                            const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
                            return (
                              <div key={plan}>
                                <div className="flex items-center justify-between mb-2">
                                  <Typography variant="small" color="blue-gray" className="font-medium">
                                    {plan}
                                  </Typography>
                                  <Typography variant="small" color="gray">
                                    {count.toLocaleString()} ({percentage}%)
                                  </Typography>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div
                                    className="bg-gray-900 h-2 rounded-full"
                                    style={{ width: `${percentage}%` }}
                                  ></div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </CardBody>
                    </Card>
                  </div>
                )}

              {/* Billing Tab */}
              {activeTab === 'billing' && billing && (
                  <div className="space-y-6">
                    {/* Revenue Overview */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      <Card className="shadow-lg">
                        <CardBody className="p-6">
                          <Typography variant="h6" color="blue-gray" className="mb-2">
                            MRR
                          </Typography>
                          <Typography variant="h3" color="blue-gray" className="mb-2">
                            ₹{billing.overview.monthlyRecurringRevenue.toLocaleString()}
                          </Typography>
                          <Typography color="gray" className="text-sm">
                            Monthly Recurring Revenue
                          </Typography>
                        </CardBody>
                      </Card>
                      <Card className="shadow-lg">
                        <CardBody className="p-6">
                          <Typography variant="h6" color="blue-gray" className="mb-2">
                            Total Revenue
                          </Typography>
                          <Typography variant="h3" color="blue-gray" className="mb-2">
                            ₹{billing.overview.totalRevenue.toLocaleString()}
                          </Typography>
                          <Typography color="gray" className="text-sm">
                            All Time
                          </Typography>
                        </CardBody>
                      </Card>
                      <Card className="shadow-lg">
                        <CardBody className="p-6">
                          <Typography variant="h6" color="blue-gray" className="mb-2">
                            ARPU
                          </Typography>
                          <Typography variant="h3" color="blue-gray" className="mb-2">
                            ₹{billing.overview.arpu.toLocaleString()}
                          </Typography>
                          <Typography color="gray" className="text-sm">
                            Average Revenue Per User
                          </Typography>
                        </CardBody>
                      </Card>
                      <Card className="shadow-lg">
                        <CardBody className="p-6">
                          <Typography variant="h6" color="blue-gray" className="mb-2">
                            Churn Rate
                          </Typography>
                          <Typography variant="h3" color="blue-gray" className="mb-2">
                            {billing.overview.churnRate}%
                          </Typography>
                          <Typography color="gray" className="text-sm">
                            Cancellation Rate
                          </Typography>
                        </CardBody>
                      </Card>
                    </div>

                    {/* Revenue by Plan */}
                    <Card className="shadow-lg">
                      <CardBody className="p-6">
                        <Typography variant="h6" color="blue-gray" className="mb-6">
                          Revenue by Plan
                        </Typography>
                        <div className="space-y-4">
                          {Object.entries(billing.revenueByPlan).map(([plan, revenue]) => (
                            <div key={plan}>
                              <div className="flex items-center justify-between mb-2">
                                <Typography variant="small" color="blue-gray" className="font-medium">
                                  {plan}
                                </Typography>
                                <Typography variant="small" color="gray" className="font-medium">
                                  ₹{revenue.toLocaleString()}
                                </Typography>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-gray-900 h-2 rounded-full"
                                  style={{ 
                                    width: `${billing.overview.monthlyRecurringRevenue > 0 
                                      ? (revenue / billing.overview.monthlyRecurringRevenue) * 100 
                                      : 0}%` 
                                  }}
                                ></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardBody>
                    </Card>

                    {/* Recent Transactions */}
                    <Card className="shadow-lg">
                      <CardBody className="p-6">
                        <Typography variant="h6" color="blue-gray" className="mb-6">
                          Recent Transactions
                        </Typography>
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead>
                              <tr className="border-b border-gray-200">
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Date</th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Plan</th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Amount</th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                              </tr>
                            </thead>
                            <tbody>
                              {billing.recentTransactions.map((tx) => (
                                <tr key={tx.id} className="border-b border-gray-100">
                                  <td className="py-3 px-4">
                                    <Typography variant="small" color="gray">
                                      {new Date(tx.createdAt).toLocaleDateString()}
                                    </Typography>
                                  </td>
                                  <td className="py-3 px-4">
                                    <Chip value={tx.plan} color="blue" variant="ghost" />
                                  </td>
                                  <td className="py-3 px-4">
                                    <Typography variant="small" color="blue-gray" className="font-medium">
                                      ₹{parseFloat(tx.amount || '0').toLocaleString()}
                                    </Typography>
                                  </td>
                                  <td className="py-3 px-4">
                                    <Chip
                                      value={tx.status}
                                      color={tx.status === 'paid' ? 'green' : 'gray'}
                                      variant="ghost"
                                    />
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </CardBody>
                    </Card>
                  </div>
                )}

              {/* Monitoring Tab */}
              {activeTab === 'monitoring' && (
                <div className="space-y-6">
                  {/* Overall Status */}
                  {monitoring && (
                      <Card className="shadow-lg">
                        <CardBody className="p-6">
                        <div className="flex items-center justify-between mb-6">
                                  <Typography variant="h6" color="blue-gray">
                            System Status
                                  </Typography>
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${
                              monitoring.overallStatus === 'healthy' ? 'bg-green-500' :
                              monitoring.overallStatus === 'warning' ? 'bg-yellow-500' :
                              'bg-red-500'
                            }`}></div>
                            <Typography variant="small" className="font-medium capitalize">
                              {monitoring.overallStatus}
                                </Typography>
                              </div>
                            </div>
                        <div className="flex gap-4 mb-4">
                                <Button
                                  size="sm"
                            color="blue"
                            onClick={fetchMonitoring}
                                >
                            <i className="fa-solid fa-refresh mr-2"></i>
                            Refresh Status
                                </Button>
                          <Button
                            size="sm"
                            color="green"
                            onClick={runDiagnostics}
                            disabled={isRunningDiagnostics}
                    >
                            <i className="fa-solid fa-stethoscope mr-2"></i>
                            {isRunningDiagnostics ? 'Running...' : 'Run Diagnostics'}
                          </Button>
                          <Button
                            size="sm"
                            color="red"
                            onClick={handleRestartServer}
                          >
                            <i className="fa-solid fa-power-off mr-2"></i>
                            Restart Server
                          </Button>
                        </div>
                        {monitoring.timestamp && (
                          <Typography variant="small" color="gray">
                            Last updated: {new Date(monitoring.timestamp).toLocaleString()}
                            </Typography>
                        )}
                      </CardBody>
                    </Card>
                  )}

                  {/* Health Checks */}
                  {monitoring?.healthChecks && (
                    <Card className="shadow-lg">
                      <CardBody className="p-6">
                        <Typography variant="h6" color="blue-gray" className="mb-6">
                          Health Checks
                        </Typography>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {Object.entries(monitoring.healthChecks.checks).map(([key, check]: [string, any]) => (
                            <div
                              key={key}
                              className={`p-4 rounded-lg border-2 ${
                                check.status === 'healthy' ? 'border-green-200 bg-green-50' :
                                check.status === 'warning' ? 'border-yellow-200 bg-yellow-50' :
                                'border-red-200 bg-red-50'
                              }`}
                            >
                            <div className="flex items-center justify-between mb-2">
                                <Typography variant="h6" color="blue-gray" className="capitalize">
                                  {key === 'serverLoad' ? 'Server Load' : key === 'cpu' ? 'CPU' : key}
                              </Typography>
                                <Chip
                                  value={check.status}
                                  color={
                                    check.status === 'healthy' ? 'green' :
                                    check.status === 'warning' ? 'yellow' :
                                    'red'
                                  }
                                  variant="ghost"
                                  className="capitalize"
                                />
                            </div>
                              <Typography variant="small" color="gray" className="mb-1">
                                {check.message}
                              </Typography>
                              {check.responseTime !== undefined && (
                              <Typography variant="small" color="gray">
                                  Response time: {check.responseTime}ms
                              </Typography>
                              )}
                              {check.usage !== undefined && (
                                <div className="mt-2">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                      className={`h-2 rounded-full ${
                                        check.usage > 95 ? 'bg-red-500' :
                                        check.usage > 90 ? 'bg-yellow-500' :
                                        'bg-green-500'
                                      }`}
                                      style={{ width: `${Math.min(check.usage, 100)}%` }}
                              ></div>
                            </div>
                                  {check.used && (
                                    <Typography variant="small" color="gray" className="mt-1">
                                      {check.used} / {check.total}
                              </Typography>
                                  )}
                                  {check.cores && (
                                    <Typography variant="small" color="gray" className="mt-1">
                                      {check.cores} cores
                              </Typography>
                                  )}
                            </div>
                              )}
                              {check.loadAverage && check.loadAverage.length > 0 && (
                                <div className="mt-2 space-y-1">
                                  <Typography variant="small" color="gray">
                                    1min: {check.load1min} | 5min: {check.load5min} | 15min: {check.load15min}
                                  </Typography>
                                  <Typography variant="small" color="gray">
                                    {check.cores} cores | {check.loadPercent}% capacity
                                  </Typography>
                                </div>
                              )}
                              {check.formatted && (
                                <Typography variant="small" color="gray" className="mt-1">
                                  {check.formatted}
                                </Typography>
                              )}
                                </div>
                          ))}
                        </div>
                      </CardBody>
                    </Card>
                  )}

                  {/* Diagnostics */}
                  {monitoring?.diagnostics && (
                      <Card className="shadow-lg">
                        <CardBody className="p-6">
                        <Typography variant="h6" color="blue-gray" className="mb-6">
                          System Diagnostics
                          </Typography>
                        <div className="space-y-6">
                          {Object.entries(monitoring.diagnostics).map(([key, diag]: [string, any]) => (
                            <div key={key}>
                              <div className="flex items-center justify-between mb-3">
                                <Typography variant="h6" color="blue-gray" className="capitalize">
                                  {key.replace(/([A-Z])/g, ' $1').trim()}
                          </Typography>
                                <Chip
                                  value={diag.status}
                                  color={
                                    diag.status === 'healthy' ? 'green' :
                                    diag.status === 'warning' ? 'yellow' :
                                    'red'
                                  }
                                  variant="ghost"
                                  className="capitalize"
                                />
                    </div>
                              <div className="bg-gray-50 rounded-lg p-4 space-y-1">
                                {diag.details.map((detail: string, index: number) => (
                                  <Typography
                                    key={index}
                                    variant="small"
                                    className={detail.startsWith('✓') ? 'text-green-700' : 'text-red-700'}
                                  >
                                    {detail}
                        </Typography>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardBody>
                    </Card>
                  )}

                  {!monitoring && (
                    <Card className="p-8 text-center">
                      <CardBody>
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
                        <Typography color="gray" className="mb-4">
                          Loading monitoring data...
                        </Typography>
                        <Button
                          size="sm"
                          color="blue"
                          onClick={fetchMonitoring}
                        >
                          <i className="fa-solid fa-refresh mr-2"></i>
                          Retry
                        </Button>
                      </CardBody>
                    </Card>
                  )}
                </div>
              )}
          </div>
        </div>
      </div>
    </div>
  );
}


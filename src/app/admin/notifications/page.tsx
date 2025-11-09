"use client";

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components';
import { useUser } from '@/contexts/UserContext';
import { useRouter } from 'next/navigation';
import { Typography, Button, Input, Textarea, Card, CardBody, Chip } from '@material-tailwind/react';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

export default function AdminNotificationsPage() {
  const { user, isAuthenticated, isLoading: userLoading } = useUser();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [sendToAll, setSendToAll] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    type: 'system',
    title: '',
    message: '',
    icon: '🔔',
  });

  // Check admin access
  useEffect(() => {
    if (userLoading) return;

    if (!isAuthenticated || !user) {
      router.push('/auth/login');
      return;
    }

    // Check admin status via API
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

        // Fetch users list if admin
        fetchUsers();
      } catch (err) {
        console.error('Admin check error:', err);
        setError('Failed to verify admin access.');
      }
    };

    checkAdmin();
  }, [user, isAuthenticated, userLoading, router]);

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      // You'll need to create an API endpoint to get all users
      // For now, we'll use a placeholder
      const response = await fetch('/api/admin/users', {
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || []);
      } else {
        setError('Failed to load users. You can still send to all users.');
      }
    } catch (err) {
      console.error('Fetch users error:', err);
      setError('Failed to load users. You can still send to all users.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const toggleUserSelection = (userId: string) => {
    setSelectedUserIds(prev => {
      if (prev.includes(userId)) {
        return prev.filter(id => id !== userId);
      } else {
        return [...prev, userId];
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const payload: any = {
        type: formData.type,
        title: formData.title,
        message: formData.message,
        icon: formData.icon || '🔔',
      };

      if (sendToAll) {
        // Send to all users
        payload.userIds = [];
      } else {
        if (selectedUserIds.length === 0) {
          setError('Please select at least one user or choose "Send to all users"');
          setSubmitting(false);
          return;
        }
        payload.userIds = selectedUserIds;
      }

      const response = await fetch('/api/admin/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(data.message || 'Notifications sent successfully!');
        setFormData({ type: 'system', title: '', message: '', icon: '🔔' });
        setSelectedUserIds([]);
        setSendToAll(false);
      } else {
        setError(data.error || 'Failed to send notifications');
      }
    } catch (err: any) {
      console.error('Send notification error:', err);
      setError(err.message || 'Failed to send notifications');
    } finally {
      setSubmitting(false);
    }
  };

  if (userLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-gray-50 relative">
      <Navbar />
      
      <div className="mt-20 min-h-[calc(100vh-80px)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <Typography variant="h2" color="blue-gray" className="mb-2">
              Admin Panel - Send Notifications
            </Typography>
            <Typography color="gray">
              Create and send notifications to users
            </Typography>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4 rounded">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="mb-6 bg-green-50 border-l-4 border-green-400 p-4 rounded">
              <p className="text-sm text-green-700">{success}</p>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-2">
              <Card className="shadow-lg">
                <CardBody className="p-6">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Notification Type */}
                    <div>
                      <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                        Notification Type
                      </label>
                      <select
                        id="type"
                        name="type"
                        value={formData.type}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                        required
                      >
                        <option value="system">System</option>
                        <option value="achievement">Achievement</option>
                        <option value="reminder">Reminder</option>
                        <option value="update">Update</option>
                        <option value="exam">Exam</option>
                        <option value="subscription">Subscription</option>
                      </select>
                    </div>

                    {/* Icon */}
                    <div>
                      <label htmlFor="icon" className="block text-sm font-medium text-gray-700 mb-2">
                        Icon (Emoji)
                      </label>
                      <Input
                        id="icon"
                        name="icon"
                        value={formData.icon}
                        onChange={handleInputChange}
                        placeholder="🔔"
                        size="lg"
                        className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                        labelProps={{
                          className: "before:content-none after:content-none",
                        }}
                      />
                    </div>

                    {/* Title */}
                    <div>
                      <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                        Title *
                      </label>
                      <Input
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        placeholder="Enter notification title"
                        required
                        size="lg"
                        className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                        labelProps={{
                          className: "before:content-none after:content-none",
                        }}
                      />
                    </div>

                    {/* Message */}
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                        Message *
                      </label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder="Enter notification message"
                        required
                        rows={6}
                        className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                        labelProps={{
                          className: "before:content-none after:content-none",
                        }}
                      />
                    </div>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      size="lg"
                      color="white"
                      className="w-full"
                      disabled={submitting}
                    >
                      {submitting ? 'Sending...' : 'Send Notifications'}
                    </Button>
                  </form>
                </CardBody>
              </Card>
            </div>

            {/* User Selection */}
            <div className="lg:col-span-1">
              <Card className="shadow-lg">
                <CardBody className="p-6">
                  <Typography variant="h6" color="blue-gray" className="mb-4">
                    Recipients
                  </Typography>

                  {/* Send to All */}
                  <div className="mb-6">
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={sendToAll}
                        onChange={(e) => {
                          setSendToAll(e.target.checked);
                          if (e.target.checked) {
                            setSelectedUserIds([]);
                          }
                        }}
                        className="w-5 h-5 text-gray-900 border-gray-300 rounded focus:ring-gray-900"
                      />
                      <span className="text-sm font-medium text-gray-900">
                        Send to all users
                      </span>
                    </label>
                  </div>

                  {!sendToAll && (
                    <div>
                      <Typography variant="small" color="gray" className="mb-3">
                        Or select specific users:
                      </Typography>
                      {loading ? (
                        <div className="text-center py-8">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                          <p className="mt-2 text-sm text-gray-600">Loading users...</p>
                        </div>
                      ) : users.length > 0 ? (
                        <div className="space-y-2 max-h-96 overflow-y-auto">
                          {users.map((user) => (
                            <label
                              key={user.id}
                              className="flex items-center space-x-3 p-2 rounded hover:bg-gray-50 cursor-pointer"
                            >
                              <input
                                type="checkbox"
                                checked={selectedUserIds.includes(user.id)}
                                onChange={() => toggleUserSelection(user.id)}
                                className="w-4 h-4 text-gray-900 border-gray-300 rounded focus:ring-gray-900"
                              />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                  {user.firstName} {user.lastName}
                                </p>
                                <p className="text-xs text-gray-500 truncate">
                                  {user.email}
                                </p>
                              </div>
                            </label>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-sm text-gray-500">
                          No users found. You can still send to all users.
                        </div>
                      )}
                      {selectedUserIds.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <Typography variant="small" color="gray">
                            {selectedUserIds.length} user(s) selected
                          </Typography>
                        </div>
                      )}
                    </div>
                  )}
                </CardBody>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useState } from 'react';
import { Navbar } from '@/components';
import { useUser } from '@/contexts/UserContext';

export default function NotificationsPage() {
  const { user } = useUser();
  const [filter, setFilter] = useState('all');

  // Mock notification data
  const notifications = [
    {
      id: 1,
      type: 'achievement',
      title: 'Learning Streak!',
      message: 'You\'ve maintained a 7-day learning streak. Keep it up!',
      time: '2 hours ago',
      read: false,
      icon: '🏆'
    },
    {
      id: 2,
      type: 'reminder',
      title: 'Daily Study Reminder',
      message: 'Don\'t forget to complete your daily learning session.',
      time: '4 hours ago',
      read: false,
      icon: '⏰'
    },
    {
      id: 3,
      type: 'update',
      title: 'New Feature Available',
      message: 'Voice input is now available! Try asking questions using your voice.',
      time: '1 day ago',
      read: true,
      icon: '🎤'
    },
    {
      id: 4,
      type: 'achievement',
      title: 'Math Master',
      message: 'You\'ve completed 50 math problems this week!',
      time: '2 days ago',
      read: true,
      icon: '📊'
    },
    {
      id: 5,
      type: 'system',
      title: 'Profile Updated',
      message: 'Your learning preferences have been successfully updated.',
      time: '3 days ago',
      read: true,
      icon: '⚙️'
    },
    {
      id: 6,
      type: 'reminder',
      title: 'Weekly Report',
      message: 'Your weekly learning report is ready to view.',
      time: '1 week ago',
      read: true,
      icon: '📈'
    }
  ];

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notification.read;
    return notification.type === filter;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: number) => {
    // In a real app, this would update the notification in the database
    console.log(`Marking notification ${id} as read`);
  };

  const markAllAsRead = () => {
    // In a real app, this would mark all notifications as read
    console.log('Marking all notifications as read');
  };

  const deleteNotification = (id: number) => {
    // In a real app, this would delete the notification from the database
    console.log(`Deleting notification ${id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-20 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
              <p className="text-gray-600 mt-1">
                {unreadCount > 0 ? `${unreadCount} unread notifications` : 'All caught up!'}
              </p>
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Mark all as read
              </button>
            )}
          </div>

          {/* Filter Tabs */}
          <div className="flex space-x-1 mb-6 bg-white rounded-lg p-1 shadow-sm border">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              All ({notifications.length})
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                filter === 'unread'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Unread ({unreadCount})
            </button>
            <button
              onClick={() => setFilter('achievement')}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                filter === 'achievement'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Achievements
            </button>
            <button
              onClick={() => setFilter('reminder')}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                filter === 'reminder'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Reminders
            </button>
            <button
              onClick={() => setFilter('update')}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                filter === 'update'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Updates
            </button>
          </div>

          {/* Notifications List */}
          <div className="space-y-4">
            {filteredNotifications.length > 0 ? (
              filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`bg-white rounded-lg shadow-sm border p-6 transition-all hover:shadow-md ${
                    !notification.read ? 'border-l-4 border-l-blue-500' : ''
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-xl">
                        {notification.icon}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className={`text-lg font-medium ${
                          !notification.read ? 'text-gray-900' : 'text-gray-700'
                        }`}>
                          {notification.title}
                        </h3>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-500">{notification.time}</span>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          )}
                        </div>
                      </div>
                      <p className="text-gray-600 mt-1">{notification.message}</p>
                      <div className="flex items-center space-x-4 mt-4">
                        {!notification.read && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                          >
                            Mark as read
                          </button>
                        )}
                        <button
                          onClick={() => deleteNotification(notification.id)}
                          className="text-sm text-red-600 hover:text-red-700 font-medium"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5-5-5h5v-5a7.5 7.5 0 00-15 0v5h5l-5 5-5-5h5v-5a7.5 7.5 0 0115 0v5z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications</h3>
                <p className="text-gray-600">
                  {filter === 'all' 
                    ? "You're all caught up! No notifications at the moment."
                    : `No ${filter} notifications found.`
                  }
                </p>
              </div>
            )}
          </div>

          {/* Notification Settings */}
          <div className="mt-12 bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Notification Settings</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-gray-200">
                <div>
                  <h3 className="font-medium text-gray-900">Email Notifications</h3>
                  <p className="text-sm text-gray-600">Receive notifications via email</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-gray-200">
                <div>
                  <h3 className="font-medium text-gray-900">Push Notifications</h3>
                  <p className="text-sm text-gray-600">Receive browser notifications</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between py-3">
                <div>
                  <h3 className="font-medium text-gray-900">Achievement Notifications</h3>
                  <p className="text-sm text-gray-600">Get notified about your learning achievements</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


"use client";

import React, { useState } from 'react';
import { ProfileSidebar } from '@/components';
import { Navbar } from '@/components';
import { useUser } from '@/contexts/UserContext';

export default function SettingsPage() {
  const { user: contextUser, updateUser } = useUser();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const user = {
    name: `${contextUser?.firstName || ''} ${contextUser?.lastName || ''}`.trim() || 'User',
    email: contextUser?.email || 'user@example.com',
    avatar: contextUser?.avatar || '/image/avatar1.jpg',
    plan: contextUser?.plan || 'Basic',
  };

  const [settings, setSettings] = useState({
    // Privacy Settings
    profileVisibility: 'private',
    showOnlineStatus: true,
    allowDataCollection: false,
    shareUsageData: true,
    
    // Appearance Settings
    theme: contextUser?.preferences?.theme ?? 'system',
    language: contextUser?.preferences?.language ?? 'en',
    fontSize: 'medium',
    compactMode: false,
    
    // Notification Settings
    emailNotifications: contextUser?.preferences?.notifications?.email ?? true,
    pushNotifications: contextUser?.preferences?.notifications?.push ?? true,
    weeklyDigest: contextUser?.preferences?.notifications?.weeklyDigest ?? true,
    marketingEmails: contextUser?.preferences?.notifications?.marketing ?? false,
    
    // Security Settings
    twoFactorAuth: false,
    loginAlerts: true,
    sessionTimeout: '30',
    
    // Learning Preferences
    difficultyLevel: contextUser?.preferences?.learning?.difficultyLevel ?? 'adaptive',
    learningStyle: contextUser?.preferences?.learning?.learningStyle ?? 'mixed',
    subjectFocus: contextUser?.preferences?.learning?.subjectFocus ?? [],
  });

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = async () => {
    try {
      const result = await updateUser({
        preferences: {
          theme: settings.theme,
          language: settings.language,
          notifications: {
            email: settings.emailNotifications,
            push: settings.pushNotifications,
            weeklyDigest: settings.weeklyDigest,
            marketing: settings.marketingEmails,
          },
          learning: {
            difficultyLevel: settings.difficultyLevel,
            learningStyle: settings.learningStyle,
            subjectFocus: settings.subjectFocus,
          },
        },
      });
      
      if (result.success) {
        setIsEditing(false);
        alert('Settings saved successfully!');
      } else {
        alert('Failed to save settings. Please try again.');
      }
    } catch (error) {
      alert('Failed to save settings. Please try again.');
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset to original values
    setSettings({
      profileVisibility: 'private',
      showOnlineStatus: true,
      allowDataCollection: false,
      shareUsageData: true,
      theme: contextUser?.preferences?.theme ?? 'system',
      language: contextUser?.preferences?.language ?? 'en',
      fontSize: 'medium',
      compactMode: false,
      emailNotifications: contextUser?.preferences?.notifications?.email ?? true,
      pushNotifications: contextUser?.preferences?.notifications?.push ?? true,
      weeklyDigest: contextUser?.preferences?.notifications?.weeklyDigest ?? true,
      marketingEmails: contextUser?.preferences?.notifications?.marketing ?? false,
      twoFactorAuth: false,
      loginAlerts: true,
      sessionTimeout: '30',
      difficultyLevel: contextUser?.preferences?.learning?.difficultyLevel ?? 'adaptive',
      learningStyle: contextUser?.preferences?.learning?.learningStyle ?? 'mixed',
      subjectFocus: contextUser?.preferences?.learning?.subjectFocus ?? [],
    });
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
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
              <p className="text-gray-600">Manage your account preferences and privacy settings</p>
            </div>

            {/* Settings Sections */}
            <div className="space-y-8">
              {/* Notifications Section */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-blue-600">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">Notifications</h2>
                      <p className="text-gray-600">Choose how you want to be notified</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-gray-200">
                    <div>
                      <h3 className="font-medium text-gray-900">Email Notifications</h3>
                      <p className="text-sm text-gray-600">Receive updates via email</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.emailNotifications}
                        onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
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
                        checked={settings.pushNotifications}
                        onChange={(e) => handleSettingChange('pushNotifications', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between py-3 border-b border-gray-200">
                    <div>
                      <h3 className="font-medium text-gray-900">Weekly Digest</h3>
                      <p className="text-sm text-gray-600">Get a weekly summary of your activity</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.weeklyDigest}
                        onChange={(e) => handleSettingChange('weeklyDigest', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between py-3">
                    <div>
                      <h3 className="font-medium text-gray-900">Marketing Emails</h3>
                      <p className="text-sm text-gray-600">Receive promotional content and updates</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.marketingEmails}
                        onChange={(e) => handleSettingChange('marketingEmails', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Security Section */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-green-600">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.623 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">Security</h2>
                      <p className="text-gray-600">Manage your account security settings</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-gray-200">
                    <div>
                      <h3 className="font-medium text-gray-900">Two-Factor Authentication</h3>
                      <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.twoFactorAuth}
                        onChange={(e) => handleSettingChange('twoFactorAuth', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between py-3 border-b border-gray-200">
                    <div>
                      <h3 className="font-medium text-gray-900">Login Alerts</h3>
                      <p className="text-sm text-gray-600">Get notified of new login attempts</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.loginAlerts}
                        onChange={(e) => handleSettingChange('loginAlerts', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="py-3">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Session Timeout (minutes)
                    </label>
                    <select
                      value={settings.sessionTimeout}
                      onChange={(e) => handleSettingChange('sessionTimeout', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    >
                      <option value="15">15 minutes</option>
                      <option value="30">30 minutes</option>
                      <option value="60">1 hour</option>
                      <option value="120">2 hours</option>
                      <option value="480">8 hours</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Appearance Section */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-purple-600">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">Appearance</h2>
                      <p className="text-gray-600">Customize how the app looks and feels</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="py-3 border-b border-gray-200">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Theme
                    </label>
                    <select
                      value={settings.theme}
                      onChange={(e) => handleSettingChange('theme', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    >
                      <option value="light">Light</option>
                      <option value="dark">Dark</option>
                      <option value="system">System</option>
                    </select>
                  </div>

                  <div className="py-3 border-b border-gray-200">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Language
                    </label>
                    <select
                      value={settings.language}
                      onChange={(e) => handleSettingChange('language', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    >
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                      <option value="de">German</option>
                    </select>
                  </div>

                  <div className="py-3">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Font Size
                    </label>
                    <select
                      value={settings.fontSize}
                      onChange={(e) => handleSettingChange('fontSize', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    >
                      <option value="small">Small</option>
                      <option value="medium">Medium</option>
                      <option value="large">Large</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 mt-8">
              <button
                onClick={handleCancel}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
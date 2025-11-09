"use client";

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components';
import { useUser } from '@/contexts/UserContext';

export default function SecurityPage() {
  const { user: contextUser, updateUser } = useUser();
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const user = {
    name: `${contextUser?.firstName || ''} ${contextUser?.lastName || ''}`.trim() || 'User',
    email: contextUser?.email || 'user@example.com',
    avatar: contextUser?.avatar || '/image/avatar1.jpg',
    plan: contextUser?.plan || 'Basic',
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 8) {
      alert('Password must be at least 8 characters long');
      return;
    }

    try {
      // Get CSRF token
      let csrfToken: string | null = null;
      try {
        const csrfResponse = await fetch('/api/csrf-token', {
          method: 'GET',
          credentials: 'include',
        });
        if (csrfResponse.ok) {
          const csrfData = await csrfResponse.json();
          csrfToken = csrfData.csrfToken;
        }
      } catch (e) {
        console.warn('Failed to fetch CSRF token:', e);
      }

      const response = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...(csrfToken && { 'X-CSRF-Token': csrfToken }),
        },
        credentials: 'include',
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
          ...(csrfToken && { csrfToken }),
        }),
      });

      const data = await response.json();

      if (response.ok) {
      alert('Password changed successfully!');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setIsChangingPassword(false);
      } else {
        alert(data.error || 'Failed to change password. Please try again.');
      }
    } catch (error) {
      console.error('Password change error:', error);
      alert('Failed to change password. Please try again.');
    }
  };

  const [twoFactorSetup, setTwoFactorSetup] = useState<{
    qrCode: string | null;
    secret: string | null;
    backupCodes: string[];
    showModal: boolean;
  }>({
    qrCode: null,
    secret: null,
    backupCodes: [],
    showModal: false,
  });

  const [verificationCode, setVerificationCode] = useState('');
  const [loginHistory, setLoginHistory] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(contextUser?.twoFactorEnabled || false);
  const [privacySettings, setPrivacySettings] = useState({
    dataCollection: contextUser?.preferences?.privacy?.dataCollection ?? true,
    profileVisibility: contextUser?.preferences?.privacy?.profileVisibility ?? false,
    marketingCommunications: contextUser?.preferences?.notifications?.marketing ?? true,
  });

  // Load login history
  useEffect(() => {
    const loadLoginHistory = async () => {
      try {
        const response = await fetch('/api/auth/login-history', {
          credentials: 'include',
        });
        
        if (response.ok) {
          const data = await response.json();
          setLoginHistory(data.sessions || []);
        }
      } catch (error) {
        console.error('Error loading login history:', error);
      } finally {
        setLoadingHistory(false);
      }
    };

    loadLoginHistory();
  }, []);

  const handleEnable2FA = async () => {
    try {
      const response = await fetch('/api/auth/2fa/setup', {
        method: 'POST',
        credentials: 'include',
      });

      const data = await response.json();

      if (response.ok) {
        setTwoFactorSetup({
          qrCode: data.qrCode,
          secret: data.secret,
          backupCodes: data.backupCodes,
          showModal: true,
        });
      } else {
        alert(data.error || 'Failed to set up 2FA. Please try again.');
      }
    } catch (error) {
      console.error('2FA setup error:', error);
      alert('Failed to enable 2FA. Please try again.');
    }
  };

  const handleVerify2FA = async () => {
    try {
      const response = await fetch('/api/auth/2fa/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ token: verificationCode }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('2FA enabled successfully! Save your backup codes in a safe place.');
        setTwoFactorSetup({ qrCode: null, secret: null, backupCodes: data.backupCodes || [], showModal: false });
        setVerificationCode('');
        setTwoFactorEnabled(true);
      } else {
        alert(data.error || 'Invalid verification code. Please try again.');
      }
    } catch (error) {
      console.error('2FA verify error:', error);
      alert('Failed to verify 2FA. Please try again.');
    }
  };

  const handleDisable2FA = async () => {
    const password = prompt('Enter your password to disable 2FA:');
    if (!password) return;

    try {
      const response = await fetch('/api/auth/2fa/disable', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (response.ok) {
      alert('2FA disabled successfully!');
        setTwoFactorEnabled(false);
      } else {
        alert(data.error || 'Failed to disable 2FA. Please try again.');
      }
    } catch (error) {
      console.error('2FA disable error:', error);
      alert('Failed to disable 2FA. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 relative">
      <Navbar />
      
      <div className="mt-20 min-h-[calc(100vh-80px)]">
        <div className="max-w-4xl mx-auto px-4 lg:px-8 py-8">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Security</h1>
              <p className="text-gray-600">Manage your account security and privacy settings</p>
            </div>

            {/* Security Sections */}
            <div className="space-y-8">
              {/* Password Section */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-blue-600">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">Password</h2>
                      <p className="text-gray-600">Change your account password</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsChangingPassword(!isChangingPassword)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {isChangingPassword ? 'Cancel' : 'Change Password'}
                  </button>
                </div>

                {isChangingPassword ? (
                  <form onSubmit={handlePasswordChange} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Current Password
                      </label>
                      <input
                        type="password"
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        New Password
                      </label>
                      <input
                        type="password"
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                        minLength={8}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                        minLength={8}
                      />
                    </div>
                    <div className="flex space-x-4">
                      <button
                        type="submit"
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Update Password
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsChangingPassword(false)}
                        className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="text-gray-600">
                    <p>Your password was last changed on October 3, 2024</p>
                    <p className="text-sm mt-1">Use a strong password with at least 8 characters</p>
                  </div>
                )}
              </div>

              {/* Two-Factor Authentication Section */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-green-600">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.623 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">Two-Factor Authentication</h2>
                      <p className="text-gray-600">Add an extra layer of security to your account</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    {twoFactorEnabled ? (
                      <>
                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                          Enabled
                        </span>
                        <button
                          onClick={handleDisable2FA}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                          Disable 2FA
                        </button>
                      </>
                    ) : (
                      <>
                    <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
                      Disabled
                    </span>
                    <button
                      onClick={handleEnable2FA}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Enable 2FA
                    </button>
                      </>
                    )}
                  </div>
                </div>

                {!twoFactorEnabled && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-yellow-800">
                        Two-Factor Authentication is not enabled
                      </h3>
                      <div className="mt-2 text-sm text-yellow-700">
                        <p>Enable 2FA to protect your account with an additional security layer.</p>
                      </div>
                    </div>
                  </div>
                </div>
                )}

                {/* 2FA Setup Modal */}
                {twoFactorSetup.showModal && twoFactorSetup.qrCode && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                      <h3 className="text-xl font-bold mb-4">Set Up Two-Factor Authentication</h3>
                      <div className="text-center mb-4">
                        <p className="text-sm text-gray-600 mb-4">
                          Scan this QR code with your authenticator app (Google Authenticator, Authy, etc.)
                        </p>
                        <img src={twoFactorSetup.qrCode} alt="QR Code" className="mx-auto mb-4" />
                        <p className="text-xs text-gray-500 mb-4">
                          Or enter this code manually: <code className="bg-gray-100 px-2 py-1 rounded">{twoFactorSetup.secret}</code>
                        </p>
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Enter verification code from your app:
                          </label>
                          <input
                            type="text"
                            value={verificationCode}
                            onChange={(e) => setVerificationCode(e.target.value)}
                            placeholder="000000"
                            maxLength={6}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-center text-2xl tracking-widest"
                          />
                        </div>
                        <div className="flex space-x-3">
                          <button
                            onClick={handleVerify2FA}
                            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                          >
                            Verify & Enable
                          </button>
                          <button
                            onClick={() => setTwoFactorSetup({ qrCode: null, secret: null, backupCodes: [], showModal: false })}
                            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Login Activity Section */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-gray-900">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">Recent Login Activity</h2>
                      <p className="text-gray-600">Monitor your account access</p>
                    </div>
                  </div>
                </div>

                {loadingHistory ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                    <p className="text-gray-600 mt-2">Loading login history...</p>
                  </div>
                ) : loginHistory.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p>No login history available</p>
                  </div>
                ) : (
                <div className="space-y-4">
                    {loginHistory.map((session, index) => {
                      const loginDate = new Date(session.loginAt);
                      const now = new Date();
                      const diffMs = now.getTime() - loginDate.getTime();
                      const diffMins = Math.floor(diffMs / 60000);
                      const diffHours = Math.floor(diffMins / 60);
                      const diffDays = Math.floor(diffHours / 24);
                      
                      let timeAgo = 'Just now';
                      if (diffMins < 1) timeAgo = 'Just now';
                      else if (diffMins < 60) timeAgo = `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
                      else if (diffHours < 24) timeAgo = `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
                      else timeAgo = `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;

                      return (
                        <div key={session.id} className="flex items-center justify-between py-3 border-b border-gray-200">
                    <div className="flex items-center space-x-3">
                            <div className={`w-8 h-8 ${session.isActive ? 'bg-green-100' : 'bg-gray-100'} rounded-full flex items-center justify-center`}>
                              {session.isActive ? (
                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                              ) : (
                        <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                              )}
                      </div>
                      <div>
                              <p className="font-medium text-gray-900">
                                {session.isActive ? 'Current Session' : 'Previous Session'}
                              </p>
                              <p className="text-sm text-gray-600">{session.browser} • {session.location}</p>
                      </div>
                    </div>
                    <div className="text-right">
                            <p className="text-sm text-gray-900">{timeAgo}</p>
                            <p className="text-xs text-gray-500">{session.isActive ? 'Active' : 'Ended'}</p>
                          </div>
                    </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Privacy Settings Section */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-orange-600">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">Privacy Settings</h2>
                      <p className="text-gray-600">Control your data and privacy</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-gray-200">
                    <div>
                      <h3 className="font-medium text-gray-900">Data Collection</h3>
                      <p className="text-sm text-gray-600">Allow PAATA.AI to collect usage data for improvement</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={privacySettings.dataCollection}
                        onChange={async (e) => {
                          const newValue = e.target.checked;
                          setPrivacySettings(prev => ({ ...prev, dataCollection: newValue }));
                          await updateUser({
                            preferences: {
                              ...contextUser?.preferences,
                              privacy: {
                                ...contextUser?.preferences?.privacy,
                                dataCollection: newValue,
                              },
                            },
                          });
                        }}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between py-3 border-b border-gray-200">
                    <div>
                      <h3 className="font-medium text-gray-900">Profile Visibility</h3>
                      <p className="text-sm text-gray-600">Make your profile visible to other users</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={privacySettings.profileVisibility}
                        onChange={async (e) => {
                          const newValue = e.target.checked;
                          setPrivacySettings(prev => ({ ...prev, profileVisibility: newValue }));
                          await updateUser({
                            preferences: {
                              ...contextUser?.preferences,
                              privacy: {
                                ...contextUser?.preferences?.privacy,
                                profileVisibility: newValue,
                              },
                            },
                          });
                        }}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between py-3">
                    <div>
                      <h3 className="font-medium text-gray-900">Marketing Communications</h3>
                      <p className="text-sm text-gray-600">Receive promotional emails and updates</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={privacySettings.marketingCommunications}
                        onChange={async (e) => {
                          const newValue = e.target.checked;
                          setPrivacySettings(prev => ({ ...prev, marketingCommunications: newValue }));
                          await updateUser({
                            preferences: {
                              ...contextUser?.preferences,
                              notifications: {
                                ...contextUser?.preferences?.notifications,
                                marketing: newValue,
                              },
                            },
                          });
                        }}
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
    </div>
  );
}


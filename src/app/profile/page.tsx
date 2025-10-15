"use client";

import React, { useState } from 'react';
import { PencilIcon, CheckIcon, XMarkIcon, CameraIcon } from '@heroicons/react/24/outline';
import ProfileSidebar from '@/components/profile-sidebar';
import { Navbar } from '@/components';
import { useUser } from '@/contexts/UserContext';
import ImageUpload from '@/components/image-upload';

export default function ProfilePage() {
  const { user, updateUser } = useUser();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  // Initialize form data with user data or defaults
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    bio: user?.bio || '',
    location: user?.location || '',
    website: user?.website || '',
    joinDate: user?.joinDate || '',
  });

  // Update form data when user data changes
  React.useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        bio: user.bio || '',
        location: user.location || '',
        website: user.website || '',
        joinDate: user.joinDate || '',
      });
    }
  }, [user]);

  const userDisplay = {
    name: `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'User',
    email: user?.email || 'user@example.com',
    avatar: user?.avatar || '/image/avatar1.jpg',
    plan: user?.plan || 'Basic',
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSave = async () => {
    // Update user data with form data
    if (user) {
      const result = await updateUser({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        bio: formData.bio,
        location: formData.location,
        website: formData.website,
      });
      
      if (result.success) {
        setIsEditing(false);
      } else {
        console.error('Failed to update user:', result.error);
        // You could show an error message to the user here
      }
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleAvatarChange = (newAvatarUrl: string) => {
    if (user) {
      updateUser({ avatar: newAvatarUrl });
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
          user={userDisplay}
        />
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4 lg:p-8 relative z-10">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Profile
              </h1>
              <p className="text-gray-600">
                Manage your personal information and account settings
              </p>
            </div>

            {/* Profile Overview Card */}
            <div className="bg-white rounded-lg shadow-lg mb-8">
              <div className="p-8">
                <div className="flex items-start space-x-6">
                  {/* Avatar Section */}
                  {user?.id ? (
                    <ImageUpload
                      currentImage={userDisplay.avatar}
                      onImageChange={handleAvatarChange}
                      userId={user.id}
                      size="md"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gray-200 flex items-center justify-center">
                      <CameraIcon className="w-8 h-8 text-gray-400" />
                    </div>
                  )}

                  {/* User Info */}
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-4">
                      <h2 className="text-2xl font-bold text-gray-900">
                        {userDisplay.name}
                      </h2>
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        userDisplay.plan === 'Enterprise' 
                          ? 'bg-purple-100 text-purple-800'
                          : userDisplay.plan === 'Pro'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {userDisplay.plan}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 mb-2">
                      {formData.bio}
                    </p>
                    
                    <div className="flex items-center space-x-6 text-sm text-gray-600">
                      <span>📍 {formData.location}</span>
                      <span>📅 Joined {formData.joinDate}</span>
                      <span>🌐 {formData.website}</span>
                    </div>
                  </div>

                  {/* Edit Button */}
                  <div className="flex space-x-2">
                    {!isEditing ? (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="flex items-center space-x-2 px-4 py-2 bg-[#612A74] text-white rounded-lg hover:bg-[#4a1f5c] transition-colors"
                      >
                        <PencilIcon className="w-4 h-4" />
                        <span>Edit Profile</span>
                      </button>
                    ) : (
                      <div className="flex space-x-2">
                        <button
                          onClick={handleSave}
                          className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                          <CheckIcon className="w-4 h-4" />
                          <span>Save</span>
                        </button>
                        <button
                          onClick={handleCancel}
                          className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                        >
                          <XMarkIcon className="w-4 h-4" />
                          <span>Cancel</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Personal Information Form */}
            <div className="bg-white rounded-lg shadow-lg">
              <div className="p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">
                  Personal Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#612A74] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#612A74] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#612A74] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#612A74] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                      Location
                    </label>
                    <input
                      type="text"
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#612A74] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-2">
                      Website
                    </label>
                    <input
                      type="url"
                      id="website"
                      name="website"
                      value={formData.website}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#612A74] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
                    Bio
                  </label>
                  <textarea
                    id="bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#612A74] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed resize-none"
                    placeholder="Tell us about yourself..."
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
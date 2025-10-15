"use client";

import React, { useState, useRef } from 'react';
import { CameraIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface ImageUploadProps {
  currentImage?: string;
  onImageChange: (imageUrl: string) => void;
  onImageRemove?: () => void;
  userId: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function ImageUpload({
  currentImage,
  onImageChange,
  onImageRemove,
  userId,
  className = '',
  size = 'md'
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32'
  };

  // Don't render if no userId
  if (!userId) {
    return (
      <div className={`${sizeClasses[size]} rounded-full overflow-hidden border-4 border-white shadow-lg bg-gray-200 flex items-center justify-center ${className}`}>
        <CameraIcon className="w-8 h-8 text-gray-400" />
      </div>
    );
  }

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('avatar', file);
      formData.append('userId', userId);

      const response = await fetch('/api/upload/avatar', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Upload failed');
      }

      const data = await response.json();
      onImageChange(data.avatarUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = async () => {
    if (!onImageRemove) return;

    setIsUploading(true);
    setError(null);

    try {
      const response = await fetch(`/api/upload/avatar?userId=${userId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Remove failed');
      }

      const data = await response.json();
      onImageChange(data.avatarUrl);
      onImageRemove();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Remove failed');
    } finally {
      setIsUploading(false);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`relative ${className}`}>
      <div
        className={`${sizeClasses[size]} rounded-full overflow-hidden border-4 border-white shadow-lg cursor-pointer group relative ${
          isUploading ? 'opacity-50' : ''
        }`}
        onClick={handleClick}
      >
        {currentImage && currentImage.trim() !== "" ? (
          <img
            src={currentImage}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <CameraIcon className="w-8 h-8 text-gray-400" />
          </div>
        )}
        
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <CameraIcon className="w-6 h-6 text-white" />
        </div>

        {/* Remove button */}
        {currentImage && currentImage !== '/image/avatar1.jpg' && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleRemoveImage();
            }}
            className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 p-1 rounded-full text-white transition-colors"
            disabled={isUploading}
          >
            <XMarkIcon className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* Upload button */}
      <button
        onClick={handleClick}
        disabled={isUploading}
        className="absolute -bottom-2 -right-2 bg-[#612A74] hover:bg-[#4a1f5c] p-2 rounded-full text-white transition-colors disabled:opacity-50"
      >
        {isUploading ? (
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          <CameraIcon className="w-4 h-4" />
        )}
      </button>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        disabled={isUploading}
      />

      {/* Error message */}
      {error && (
        <div className="absolute top-full left-0 right-0 mt-2 p-2 bg-red-100 border border-red-300 rounded text-red-700 text-sm">
          {error}
        </div>
      )}
    </div>
  );
}
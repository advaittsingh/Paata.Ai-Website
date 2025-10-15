"use client";

import React, { useState, useRef } from 'react';
import { PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface ChatImageUploadProps {
  onImageSelect: (imageFile: File) => void;
  onImageRemove: () => void;
  selectedImage: File | null;
  imagePreview: string | null;
  disabled?: boolean;
  planRestricted?: boolean;
}

export default function ChatImageUpload({
  onImageSelect,
  onImageRemove,
  selectedImage,
  imagePreview,
  disabled = false,
  planRestricted = false
}: ChatImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Validate file size (max 10MB for chat)
    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB');
      return;
    }

    setError(null);
    onImageSelect(file);
  };

  const handleRemoveImage = () => {
    onImageRemove();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClick = () => {
    if (!disabled && !planRestricted) {
      fileInputRef.current?.click();
    }
  };

  if (planRestricted) {
    return (
      <button
        disabled
        className="p-2 sm:p-3 rounded-full bg-gray-200 text-gray-400 cursor-not-allowed"
        title="Image analysis requires Pro or Enterprise plan"
      >
        <PhotoIcon className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>
    );
  }

  // When image is selected, show a different state for the button
  if (selectedImage && imagePreview) {
    return (
      <div className="relative">
        <button
          onClick={handleClick}
          disabled={disabled}
          className={`p-2 sm:p-3 rounded-full transition-colors ${
            disabled
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-green-100 text-green-600 hover:bg-green-200'
          }`}
          title="Image selected - click to change"
        >
          <PhotoIcon className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
        
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          disabled={disabled}
        />
        
        {error && (
          <div className="absolute top-full left-0 right-0 mt-1 p-2 bg-red-100 border border-red-300 rounded text-red-700 text-xs">
            {error}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={handleClick}
        disabled={disabled}
        className={`p-2 sm:p-3 rounded-full transition-colors ${
          disabled
            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
            : 'bg-white text-gray-600 hover:bg-gray-50 hover:text-[#612A74]'
        }`}
        title="Upload image for analysis"
      >
        <PhotoIcon className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled}
      />
    </div>
  );
}

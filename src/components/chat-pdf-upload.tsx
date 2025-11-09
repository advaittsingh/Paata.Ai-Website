"use client";

import React, { useState, useRef } from 'react';
import { DocumentIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface ChatPDFUploadProps {
  onPDFSelect: (pdfFile: File) => void;
  onPDFRemove: () => void;
  selectedPDF: File | null;
  disabled?: boolean;
  planRestricted?: boolean;
}

export default function ChatPDFUpload({
  onPDFSelect,
  onPDFRemove,
  selectedPDF,
  disabled = false,
  planRestricted = false
}: ChatPDFUploadProps) {
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      console.log('No file selected');
      return;
    }

    console.log('File selected:', {
      name: file.name,
      type: file.type,
      size: file.size,
      sizeMB: (file.size / (1024 * 1024)).toFixed(2)
    });

    // Validate file type
    if (file.type !== 'application/pdf') {
      console.warn('Invalid file type:', file.type);
      setError('Please select a PDF file');
      // Reset input so user can try again
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    // Validate file size (max 50MB for chat PDFs)
    if (file.size > 50 * 1024 * 1024) {
      console.warn('File too large:', file.size);
      setError('File size must be less than 50MB');
      // Reset input so user can try again
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    setError(null);
    console.log('Calling onPDFSelect with file:', file.name);
    try {
      onPDFSelect(file);
    } catch (error: any) {
      console.error('Error in onPDFSelect:', error);
      setError('Failed to process PDF: ' + (error.message || 'Unknown error'));
    }
  };

  const handleRemovePDF = () => {
    onPDFRemove();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClick = () => {
    console.log('PDF upload button clicked', { disabled, planRestricted });
    if (!disabled && !planRestricted) {
      console.log('Triggering file input click');
      if (fileInputRef.current) {
        fileInputRef.current.click();
        console.log('File input clicked');
      } else {
        console.error('File input ref is null');
      }
    } else {
      console.warn('Button click ignored:', { disabled, planRestricted });
    }
  };

  if (planRestricted) {
    return (
      <button
        disabled
        className="p-2 sm:p-3 rounded-full bg-gray-200 text-gray-400 cursor-not-allowed"
        title="PDF reading requires Pro or Enterprise plan"
      >
        <DocumentIcon className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>
    );
  }

  // When PDF is selected, show a different state for the button
  if (selectedPDF) {
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
          title={`PDF selected: ${selectedPDF.name} - click to change`}
        >
          <DocumentIcon className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
        
        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf"
          onChange={handleFileSelect}
          className="hidden"
          disabled={disabled}
        />
        
        {error && (
          <div className="absolute top-full left-0 right-0 mt-1 p-2 bg-red-100 border border-red-300 rounded text-red-700 text-xs z-10">
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
        title="Upload PDF for reading and analysis"
      >
        <DocumentIcon className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>
      
      <input
        ref={fileInputRef}
        type="file"
        accept="application/pdf"
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled}
      />
      
      {error && (
        <div className="absolute top-full left-0 right-0 mt-1 p-2 bg-red-100 border border-red-300 rounded text-red-700 text-xs z-10">
          {error}
        </div>
      )}
    </div>
  );
}


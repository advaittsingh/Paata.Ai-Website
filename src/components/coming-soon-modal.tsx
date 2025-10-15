"use client";

import React, { useState } from 'react';
import { Button, Typography } from '@material-tailwind/react';

interface ComingSoonModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ComingSoonModal({ isOpen, onClose }: ComingSoonModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl">
        <div className="text-center">
          {/* Icon */}
          <div className="w-16 h-16 bg-gradient-to-r from-[#612A74] to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="fa-solid fa-mobile-alt text-2xl text-white"></i>
          </div>
          
          {/* Title */}
          <Typography variant="h4" color="blue-gray" className="mb-4 font-bold">
            Coming Soon! 🚀
          </Typography>
          
          {/* Message */}
          <Typography color="gray" className="mb-6 text-base leading-relaxed">
            We're coming soon on mobile app mode! Until then, please continue using our website for the best PAATA.AI experience.
          </Typography>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              color="white"
              variant="outlined"
              onClick={onClose}
              className="flex-1 border-[#612A74] text-[#612A74] hover:bg-[#612A74] hover:text-white transition-all duration-200"
            >
              <i className="fa-solid fa-times mr-2"></i>
              Close
            </Button>
            <Button
              color="white"
              onClick={() => {
                onClose();
                window.location.href = '/app';
              }}
              className="flex-1 bg-[#612A74] hover:bg-[#4a1f5c] transition-all duration-200"
            >
              <i className="fa-solid fa-comments mr-2"></i>
              Try Web App
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Hook for managing the modal state
export function useComingSoonModal() {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return {
    isOpen,
    openModal,
    closeModal,
    ComingSoonModal: () => <ComingSoonModal isOpen={isOpen} onClose={closeModal} />
  };
}





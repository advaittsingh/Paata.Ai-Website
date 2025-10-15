"use client";

import { useState, useRef, useEffect } from 'react';
import { Button } from '@material-tailwind/react';
import { MicrophoneIcon, StopIcon } from '@heroicons/react/24/outline';

interface VoiceRecorderProps {
  onRecordingComplete: (audioBlob: Blob) => void;
  onTranscriptionComplete: (text: string) => void;
  onVoiceProcessingComplete?: (transcribedText: string, aiResponse: string) => void;
  disabled?: boolean;
  planRestricted?: boolean;
  sessionId?: string;
  conversationHistory?: any[];
  sessionContext?: string;
  userId?: string;
}

export default function VoiceRecorder({ 
  onRecordingComplete, 
  onTranscriptionComplete, 
  onVoiceProcessingComplete,
  disabled = false,
  planRestricted = false,
  sessionId = 'default-session',
  conversationHistory = [],
  sessionContext = '',
  userId
}: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Try to use MP4 format first, fallback to WebM
      let mimeType = 'audio/mp4';
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = 'audio/webm;codecs=opus';
      }
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = 'audio/webm';
      }
      
      const recorder = new MediaRecorder(stream, { mimeType });
      const chunks: Blob[] = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(chunks, { type: mimeType });
        onRecordingComplete(audioBlob);
        
        // Send audio to backend for processing
        setIsProcessing(true);
        
        try {
          const formData = new FormData();
          // Use appropriate file extension based on mime type
          const fileExtension = mimeType.includes('mp4') ? 'mp4' : 'webm';
          formData.append('audio', audioBlob, `voice-input.${fileExtension}`);
          formData.append('sessionId', sessionId);
          formData.append('conversationHistory', JSON.stringify(conversationHistory));
          formData.append('sessionContext', sessionContext);
          if (userId) {
            formData.append('userId', userId);
          }

          const response = await fetch('/api/voice', {
            method: 'POST',
            body: formData,
          });

          if (!response.ok) {
            throw new Error('Failed to process voice input');
          }

          const data = await response.json();
          
          if (data.success) {
            // Call the new callback with both transcription and AI response
            if (onVoiceProcessingComplete) {
              onVoiceProcessingComplete(data.transcribedText, data.aiResponse);
            } else {
              // Fallback to old callback
              onTranscriptionComplete(data.transcribedText);
            }
          } else {
            throw new Error(data.error || 'Voice processing failed');
          }
        } catch (error) {
          console.error('Voice processing error:', error);
          onTranscriptionComplete("Sorry, I couldn't process your voice input. Please try again or type your question.");
        } finally {
          setIsProcessing(false);
        }
        
        stream.getTracks().forEach(track => track.stop());
      };

      recorder.start();
      setMediaRecorder(recorder);
      setAudioChunks(chunks);
      setIsRecording(true);
      setRecordingTime(0);

      // Start timer
      intervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Unable to access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      setIsRecording(false);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex items-center gap-1 sm:gap-2">
      {isProcessing ? (
        <div className="flex items-center gap-1 sm:gap-2">
          <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <span className="text-xs sm:text-sm text-blue-600 font-medium hidden sm:inline">
            Processing voice...
          </span>
        </div>
      ) : !isRecording ? (
        <Button
          onClick={startRecording}
          disabled={disabled || isProcessing}
          variant="text"
          size="sm"
          className="p-2 sm:p-2 transition-colors hover:bg-gray-100"
          title="Start voice recording"
        >
          <MicrophoneIcon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
        </Button>
      ) : (
        <div className="flex items-center gap-1 sm:gap-2">
          <Button
            onClick={stopRecording}
            variant="text"
            size="sm"
            className="p-2 sm:p-2 hover:bg-red-100 transition-colors"
          >
            <StopIcon className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
          </Button>
          <span className="text-xs sm:text-sm text-gray-600 font-mono hidden sm:inline">
            {formatTime(recordingTime)}
          </span>
        </div>
      )}
    </div>
  );
}




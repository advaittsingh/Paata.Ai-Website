"use client";

import React from 'react';
import { Typography, Chip } from '@material-tailwind/react';
import { PhotoIcon, MicrophoneIcon, DocumentTextIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

interface ContextIndicatorProps {
  contextType?: 'text' | 'image' | 'voice';
  relatedContexts?: number;
  suggestions?: string[];
  sessionStats?: {
    totalContexts: number;
    contextTypes: { [key: string]: number };
    lastActivity: Date | null;
  };
}

export default function ContextIndicator({ 
  contextType, 
  relatedContexts = 0, 
  suggestions = [],
  sessionStats 
}: ContextIndicatorProps) {
  const getContextIcon = (type: string) => {
    switch (type) {
      case 'image':
        return <PhotoIcon className="w-4 h-4" />;
      case 'voice':
        return <MicrophoneIcon className="w-4 h-4" />;
      case 'text':
      default:
        return <DocumentTextIcon className="w-4 h-4" />;
    }
  };

  const getContextColor = (type: string) => {
    switch (type) {
      case 'image':
        return 'bg-blue-100 text-blue-800';
      case 'voice':
        return 'bg-green-100 text-green-800';
      case 'text':
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!contextType && !sessionStats) return null;

  return (
    <div className="flex flex-col gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
      {/* Current Context */}
      {contextType && (
        <div className="flex items-center gap-2">
          <Typography variant="small" color="gray" className="font-medium">
            Current Context:
          </Typography>
          <Chip
            value={contextType.toUpperCase()}
            icon={getContextIcon(contextType)}
            className={`${getContextColor(contextType)} text-xs`}
            size="sm"
          />
          {relatedContexts > 0 && (
            <Typography variant="small" color="gray">
              ({relatedContexts} related)
            </Typography>
          )}
        </div>
      )}

      {/* Session Statistics */}
      {sessionStats && (
        <div className="flex items-center gap-2 flex-wrap">
          <Typography variant="small" color="gray" className="font-medium">
            Session:
          </Typography>
          <Chip
            value={`${sessionStats.totalContexts} contexts`}
            className="bg-purple-100 text-purple-800 text-xs"
            size="sm"
          />
          {Object.entries(sessionStats.contextTypes).map(([type, count]) => (
            <Chip
              key={type}
              value={`${count} ${type}`}
              icon={getContextIcon(type)}
              className={`${getContextColor(type)} text-xs`}
              size="sm"
            />
          ))}
        </div>
      )}

      {/* Context Switching Suggestions */}
      {suggestions.length > 0 && (
        <div className="flex flex-col gap-1">
          <Typography variant="small" color="gray" className="font-medium">
            Context Suggestions:
          </Typography>
          {suggestions.map((suggestion, index) => (
            <div key={index} className="flex items-center gap-2">
              <ArrowPathIcon className="w-3 h-3 text-gray-400" />
              <Typography variant="small" color="gray" className="text-xs">
                {suggestion}
              </Typography>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


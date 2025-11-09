"use client";

import { Navbar, Footer, MathRenderer, ScientificRenderer } from "@/components";
import { Typography, Button, Card, CardBody, Input, Textarea, IconButton } from "@material-tailwind/react";
import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { useUser } from '@/contexts/UserContext';
import { videoData, Video } from '@/data/videoData';
import { formatAIResponse, getResponseIcon, getResponseColor } from '@/utils/responseFormatter';

// Video interface is now imported from videoData.ts

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  type: 'text' | 'voice' | 'image';
  formattedText?: string;
  hasCode?: boolean;
  hasLists?: boolean;
  hasHeaders?: boolean;
}

export default function VideoLearningPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useUser();
  const classNumber = params.class as string;
  const subject = params.subject as string;
  
  const [currentVideo, setCurrentVideo] = useState<Video | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoadingVideo, setIsLoadingVideo] = useState(true);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [showChat, setShowChat] = useState(true);
  const [videoProgress, setVideoProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Video data is now imported from videoData.ts

  useEffect(() => {
    if (isLoading) return;
    
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    // Load videos for the specific class and subject
    const classVideos = videoData[classNumber]?.[subject.toLowerCase()] || [];
    setVideos(classVideos);
    
    if (classVideos.length > 0) {
      setCurrentVideo(classVideos[0]);
      setIsLoadingVideo(false);
    }

    // Add welcome message
    setMessages([{
      id: 'welcome',
      text: `Welcome to Class ${classNumber} ${subject} video learning! I'm here to help you with any doubts related to the video content. Feel free to ask questions about the topics covered.`,
      isUser: false,
      timestamp: new Date(),
      type: 'text'
    }]);
  }, [classNumber, subject, isAuthenticated, isLoading, router]);

  // Auto-scroll removed - users can manually scroll or use the scroll button
  // useEffect(() => {
  //   messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  // }, [messages]);

  const handleVideoSelect = (video: Video) => {
    setCurrentVideo(video);
    setVideoProgress(0);
    setIsPlaying(false);
  };

  const handleVideoPlay = () => {
    setIsPlaying(true);
  };

  const handleVideoPause = () => {
    setIsPlaying(false);
  };

  const handleVideoProgress = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const video = e.currentTarget;
    const progress = (video.currentTime / video.duration) * 100;
    setVideoProgress(progress);
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !currentVideo || !user?.id) {
      console.log('Cannot send message:', { 
        hasMessage: !!newMessage.trim(), 
        hasVideo: !!currentVideo, 
        hasUser: !!user, 
        userId: user?.id 
      });
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      text: newMessage,
      isUser: true,
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setIsChatLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: `I'm watching a Class ${classNumber} ${subject} video about "${currentVideo.title}". My question: ${newMessage}`,
          sessionId: `video-${classNumber}-${subject}`,
          inputType: 'text',
          userId: user.id
        }),
      });

      const data = await response.json();
      console.log('Chat API response:', data);

      if (data.response) {
        const formatted = formatAIResponse(data.response);
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: data.response,
          formattedText: formatted.text,
          hasCode: formatted.hasCode,
          hasLists: formatted.hasLists,
          hasHeaders: formatted.hasHeaders,
          isUser: false,
          timestamp: new Date(),
          type: 'text'
        };
        setMessages(prev => [...prev, aiMessage]);
      } else {
        throw new Error(data.error || data.message || 'Failed to get response');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: error instanceof Error ? error.message : 'Sorry, I encountered an error. Please try again.',
        isUser: false,
        timestamp: new Date(),
        type: 'text'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#612A74] mx-auto mb-4"></div>
          <Typography color="gray">Loading...</Typography>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (videos.length === 0) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center pt-20">
          <div className="text-center">
            <Typography variant="h4" color="blue-gray" className="mb-4">
              No videos available
            </Typography>
            <Typography color="gray" className="mb-6">
              No videos found for Class {classNumber} {subject}
            </Typography>
            <Button
              style={{backgroundColor: '#612A74'}}
              onClick={() => router.push('/learning')}
            >
              Back to Docs
            </Button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-4 mb-4">
              <Button
                variant="outlined"
                size="sm"
                onClick={() => router.push('/learning')}
                className="flex items-center gap-2"
              >
                <i className="fa-solid fa-arrow-left"></i>
                Back to Docs
              </Button>
              <Typography variant="h4" color="blue-gray">
                Class {classNumber} - {subject}
              </Typography>
            </div>
            <Typography color="gray">
              Interactive video learning with AI-powered doubt resolution
            </Typography>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Video Section */}
            <div className="lg:col-span-2">
              {currentVideo && (
                <Card className="mb-6">
                  <CardBody className="p-0">
                    {/* Video Player */}
                    <div className="relative">
                      <video
                        ref={videoRef}
                        className="w-full h-64 sm:h-80 lg:h-96 bg-black rounded-t-lg"
                        poster={currentVideo.thumbnail}
                        onPlay={handleVideoPlay}
                        onPause={handleVideoPause}
                        onTimeUpdate={handleVideoProgress}
                        controls
                      >
                        <source src={currentVideo.videoUrl} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                      
                      {/* Video Progress Bar */}
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-300">
                        <div 
                          className="h-full bg-[#612A74] transition-all duration-300"
                          style={{ width: `${videoProgress}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Video Info */}
                    <div className="p-6">
                      <Typography variant="h5" color="blue-gray" className="mb-2">
                        {currentVideo.title}
                      </Typography>
                      <Typography color="gray" className="mb-4">
                        {currentVideo.description}
                      </Typography>
                      
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                        <span className="flex items-center gap-1">
                          <i className="fa-solid fa-clock"></i>
                          {currentVideo.duration}
                        </span>
                        <span className="flex items-center gap-1">
                          <i className="fa-solid fa-user"></i>
                          {currentVideo.instructor}
                        </span>
                        <span className="flex items-center gap-1">
                          <i className="fa-solid fa-eye"></i>
                          {currentVideo.views.toLocaleString()} views
                        </span>
                        <span className="flex items-center gap-1">
                          <i className="fa-solid fa-heart"></i>
                          {currentVideo.likes} likes
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {currentVideo.topics.map((topic, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-[#612A74] text-white text-xs rounded-full"
                          >
                            {topic}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          currentVideo.difficulty === 'Beginner' 
                            ? 'bg-green-100 text-green-800'
                            : currentVideo.difficulty === 'Intermediate'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {currentVideo.difficulty}
                        </span>
                        
                        <Button
                          style={{backgroundColor: '#612A74'}}
                          size="sm"
                          onClick={() => setShowChat(!showChat)}
                          className="flex items-center gap-2"
                        >
                          <i className="fa-solid fa-comments"></i>
                          {showChat ? 'Hide Chat' : 'Show Chat'}
                        </Button>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              )}

              {/* Video List */}
              <Card>
                <CardBody>
                  <Typography variant="h6" color="blue-gray" className="mb-4">
                    More Videos in {subject}
                  </Typography>
                  <div className="space-y-3">
                    {videos.map((video) => (
                      <div
                        key={video.id}
                        className={`p-4 rounded-lg border cursor-pointer transition-all ${
                          currentVideo?.id === video.id
                            ? 'border-[#612A74] bg-purple-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => handleVideoSelect(video)}
                      >
                        <div className="flex gap-4">
                          <div className="w-24 h-16 bg-gray-200 rounded flex-shrink-0 flex items-center justify-center">
                            <i className="fa-solid fa-play text-gray-400"></i>
                          </div>
                          <div className="flex-1 min-w-0">
                            <Typography variant="h6" color="blue-gray" className="text-sm mb-1 truncate">
                              {video.title}
                            </Typography>
                            <Typography color="gray" className="text-xs mb-2 line-clamp-2">
                              {video.description}
                            </Typography>
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <span>{video.duration}</span>
                              <span>{video.views} views</span>
                              <span>{video.likes} likes</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardBody>
              </Card>
            </div>

            {/* AI Chat Section */}
            {showChat && (
              <div className="lg:col-span-1">
                <Card className="h-[650px] flex flex-col overflow-hidden shadow-xl border-0">
                  <CardBody className="flex-1 flex flex-col p-0 min-h-0">
                    {/* Chat Header */}
                    <div className="p-5 border-b border-gray-100 bg-gradient-to-r from-[#612A74] to-[#7B2CBF] text-white rounded-t-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                          <i className="fa-solid fa-robot text-lg"></i>
                        </div>
                        <div>
                          <Typography variant="h6" className="text-white font-semibold">
                            AI Doubt Resolver
                          </Typography>
                          <Typography className="text-purple-100 text-sm font-medium">
                            Ask questions about the video content
                          </Typography>
                        </div>
                      </div>
                    </div>

                    {/* Messages */}
                    <div 
                      className="flex-1 p-5 overflow-y-auto space-y-5 relative bg-gray-50/50 min-h-0"
                      style={{
                        height: '400px',
                        scrollbarWidth: 'thin',
                        scrollbarColor: '#d1d5db #f3f4f6',
                        WebkitOverflowScrolling: 'touch'
                      }}
                    >
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} group`}
                        >
                          <div className="flex items-start gap-3 max-w-[85%]">
                            {!message.isUser && (
                              <div className="w-8 h-8 bg-[#612A74] rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
                                <i className="fa-solid fa-robot text-white text-xs"></i>
                              </div>
                            )}
                            <div
                              className={`px-4 py-3 rounded-2xl shadow-sm transition-all duration-200 group-hover:shadow-md ${
                                message.isUser
                                  ? 'bg-[#612A74] text-white rounded-br-md'
                                  : message.formattedText 
                                    ? getResponseColor(message.hasCode || false, message.hasLists || false, message.hasHeaders || false)
                                    : 'bg-white text-gray-800 border border-gray-200 rounded-bl-md'
                              }`}
                            >
                              {!message.isUser && message.formattedText && (
                                <div className="flex items-center mb-3">
                                  <i className={`${getResponseIcon(message.hasCode || false, message.hasLists || false, message.hasHeaders || false)} mr-2 text-[#612A74] text-sm`}></i>
                                  <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                                    {message.hasCode ? 'Code Response' : 
                                     message.hasLists ? 'Structured Response' : 
                                     message.hasHeaders ? 'Detailed Explanation' : 'AI Response'}
                                  </span>
                                </div>
                              )}
                              <div className="text-sm leading-relaxed break-words">
                                {message.formattedText ? (
                                  <ScientificRenderer content={message.formattedText} type="auto" />
                                ) : (
                                  <ScientificRenderer content={message.text} type="auto" className="whitespace-pre-wrap" />
                                )}
                              </div>
                              <div
                                className={`text-xs mt-3 font-medium ${
                                  message.isUser ? 'text-purple-100' : 'text-gray-500'
                                }`}
                              >
                                {message.timestamp.toLocaleTimeString()}
                              </div>
                            </div>
                            {message.isUser && (
                              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
                                <i className="fa-solid fa-user text-gray-600 text-xs"></i>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                      
                      {isChatLoading && (
                        <div className="flex justify-start">
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-[#612A74] rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
                              <i className="fa-solid fa-robot text-white text-xs"></i>
                            </div>
                            <div className="bg-white text-gray-800 p-4 rounded-2xl rounded-bl-md border border-gray-200 shadow-sm">
                              <div className="flex items-center gap-3">
                                <div className="flex space-x-1">
                                  <div className="w-2 h-2 bg-[#612A74] rounded-full animate-bounce"></div>
                                  <div className="w-2 h-2 bg-[#612A74] rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                                  <div className="w-2 h-2 bg-[#612A74] rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                                </div>
                                <Typography className="text-sm font-medium">AI is thinking...</Typography>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      <div ref={messagesEndRef} />
                      
                      {/* Scroll to bottom button */}
                      {messages.length > 3 && (
                        <div className="absolute bottom-6 right-6">
                          <Button
                            size="sm"
                            variant="outlined"
                            className="bg-white shadow-lg hover:shadow-xl border-gray-200 hover:border-[#612A74] transition-all duration-200"
                            onClick={() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })}
                          >
                            <i className="fa-solid fa-arrow-down text-xs text-[#612A74]"></i>
                          </Button>
                        </div>
                      )}
                    </div>

                    {/* Message Input */}
                    <div className="p-5 border-t border-gray-100 bg-white">
                      <div className="flex gap-3">
                        <div className="flex-1 relative">
                          <Textarea
                            placeholder="Ask a question about the video..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyPress={handleKeyPress}
                            className="flex-1 min-h-[50px] max-h-[120px] pr-12 border-gray-200 focus:border-[#612A74] rounded-xl resize-none"
                            disabled={isChatLoading}
                          />
                          <div className="absolute bottom-3 right-3 text-xs text-gray-400">
                            {newMessage.length}/500
                          </div>
                        </div>
                        <Button
                          style={{backgroundColor: '#612A74'}}
                          onClick={handleSendMessage}
                          disabled={!newMessage.trim() || isChatLoading}
                          className="px-4 py-3 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 disabled:opacity-50"
                        >
                          <i className="fa-solid fa-paper-plane text-sm"></i>
                        </Button>
                      </div>
                      <div className="mt-2 text-xs text-gray-500 text-center">
                        Press Enter to send, Shift+Enter for new line
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

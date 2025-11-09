"use client";

import { Navbar, Footer, MathRenderer, ScientificRenderer } from "@/components";
import { Typography, Button, Card, CardBody, Input, Textarea, IconButton } from "@material-tailwind/react";
import { PaperAirplaneIcon, XMarkIcon, DocumentIcon } from "@heroicons/react/24/outline";
import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { useUser } from '@/contexts/UserContext';
import { getChapter, Chapter } from '@/data/chapterData';
import { formatAIResponse, getResponseIcon, getResponseColor } from '@/utils/responseFormatter';
import { formatTextWithHTML } from "@/utils/textFormatter";
import ChatImageUpload from "@/components/chat-image-upload";
import ChatPDFUpload from "@/components/chat-pdf-upload";
import VoiceRecorder from "@/components/voice-recorder";
import SpeechSynthesis from "@/components/speech-synthesis";
import { canUseFeature } from "@/utils/planLimits";

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

export default function ChapterPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useUser();
  const classNumber = params.class as string;
  const subjectName = params.subject as string;
  const chapterId = params.chapter as string;

  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  // Removed activeTab state - no longer using tabs
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedPDF, setSelectedPDF] = useState<File | null>(null);
  const [pdfText, setPdfText] = useState<string | null>(null);
  const [isExtractingPDF, setIsExtractingPDF] = useState(false);
  const [pdfExtractionError, setPdfExtractionError] = useState<string | null>(null);
  const [reasoningMode, setReasoningMode] = useState(false);
  const [latestAIResponse, setLatestAIResponse] = useState<string>('');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isLoading) return;
    
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    // Load chapter data
    const chapterData = getChapter(subjectName, classNumber, chapterId);
    if (!chapterData) {
      router.push(`/learning/${classNumber}/${subjectName}`);
      return;
    }
    
    setChapter(chapterData);

    // Add welcome message
    setMessages([{
      id: 'welcome',
      text: `Welcome to ${chapterData.title}! I'm here to help you understand this chapter. You can ask me questions about the topics, concepts, or anything related to this chapter.`,
      isUser: false,
      timestamp: new Date(),
      type: 'text'
    }]);
  }, [classNumber, subjectName, chapterId, isAuthenticated, isLoading, router]);

  // Auto-scroll disabled - user can manually scroll
  // useEffect(() => {
  //   messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  // }, [messages]);

  // Generate session context for chapter
  const generateSessionContext = (messages: Message[]): string => {
    if (messages.length <= 1) {
      return `Studying ${chapter?.title || 'this chapter'} from ${subjectName} (Class ${classNumber})`;
    }
    return `Chapter: ${chapter?.title || 'Current Chapter'}, Subject: ${subjectName}, Class: ${classNumber}`;
  };

  const handleSendMessage = async () => {
    const currentInput = inputText.trim();
    if ((!currentInput && !selectedImage && !selectedPDF) || !chapter || !user?.id) {
      return;
    }

    // Handle image upload
    if (selectedImage) {
      await handleImageWithPrompt(selectedImage, currentInput || 'Analyze this image');
      return;
    }

    // Handle PDF upload
    if (selectedPDF) {
      await handlePDFWithPrompt(selectedPDF, currentInput || 'Analyze this PDF');
      return;
    }

    // Handle text message
    if (!currentInput) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: currentInput,
      isUser: true,
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsChatLoading(true);

    try {
      // Prepare conversation history (last 10 messages for context)
      const conversationHistory = messages.slice(-10).map(msg => ({
        text: msg.text,
        isUser: msg.isUser,
        timestamp: msg.timestamp
      }));

      const sessionContext = generateSessionContext(messages);

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: currentInput,
          userId: user.id,
          sessionId: `chapter-${chapterId}`,
          inputType: 'text',
          conversationHistory: conversationHistory,
          sessionContext: sessionContext,
          contextMetadata: {
            chapter: chapter.title,
            subject: subjectName,
            class: classNumber,
            chapterId: chapterId
          },
          mode: reasoningMode ? 'reasoning' : 'standard'
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const data = await response.json();
      
      if (data.response) {
        const formatted = formatAIResponse(data.response);
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: data.response,
          isUser: false,
          timestamp: new Date(),
          type: 'text',
          formattedText: formatted.text,
          hasCode: formatted.hasCode,
          hasLists: formatted.hasLists,
          hasHeaders: formatted.hasHeaders
        };
        setMessages(prev => [...prev, aiMessage]);
        setLatestAIResponse(data.response);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Sorry, I encountered an error. Please try again.',
        isUser: false,
        timestamp: new Date(),
        type: 'text'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleImageSelect = (file: File) => {
    setSelectedImage(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleImageRemove = () => {
    setSelectedImage(null);
    setImagePreview(null);
  };

  const handleImageWithPrompt = async (file: File, prompt: string) => {
    if (!chapter || !user?.id) return;

    const imageMessage: Message = {
      id: Date.now().toString(),
      text: `📷 Image uploaded: "${prompt}"`,
      isUser: true,
      timestamp: new Date(),
      type: 'image'
    };

    setMessages(prev => [...prev, imageMessage]);
    setIsChatLoading(true);

    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('message', prompt);
      formData.append('userId', user.id);
      formData.append('sessionId', `chapter-${chapterId}`);
      formData.append('sessionContext', `Chapter: ${chapter.title}, Subject: ${subjectName}, Class: ${classNumber}`);
      formData.append('mode', reasoningMode ? 'reasoning' : 'standard');

      const response = await fetch('/api/chat/image', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to process image');

      const data = await response.json();
      if (data.response) {
        const formatted = formatAIResponse(data.response);
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: data.response,
          isUser: false,
          timestamp: new Date(),
          type: 'text',
          formattedText: formatted.text,
          hasCode: formatted.hasCode,
          hasLists: formatted.hasLists,
          hasHeaders: formatted.hasHeaders
        };
        setMessages(prev => [...prev, aiMessage]);
        setLatestAIResponse(data.response);
      }

      handleImageRemove();
    } catch (error) {
      console.error('Error processing image:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Sorry, I encountered an error processing the image. Please try again.',
        isUser: false,
        timestamp: new Date(),
        type: 'text'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const handlePDFSelect = async (file: File) => {
    setSelectedPDF(file);
    setPdfExtractionError(null);
    setIsExtractingPDF(true);
    setPdfText(null);

    try {
      const formData = new FormData();
      formData.append('pdf', file);

      const response = await fetch('/api/chat/pdf-extract', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        setPdfExtractionError(errorData.error || 'Failed to extract text from PDF');
        return;
      }

      const data = await response.json();
      if (data.success && data.text) {
        setPdfText(data.text);
        setPdfExtractionError(null);
      } else {
        setPdfExtractionError('Failed to extract text from PDF. The PDF may be image-based or corrupted.');
      }
    } catch (error: any) {
      console.error('PDF extraction error:', error);
      setPdfExtractionError('Failed to extract text from PDF. You can still try to use it.');
    } finally {
      setIsExtractingPDF(false);
    }
  };

  const handlePDFRemove = () => {
    setSelectedPDF(null);
    setPdfText(null);
    setPdfExtractionError(null);
  };

  const handlePDFWithPrompt = async (file: File, prompt: string) => {
    if (!chapter || !user?.id) return;

    if (isExtractingPDF) {
      alert('Please wait for PDF extraction to complete');
      return;
    }

    if (!pdfText && !pdfExtractionError) {
      alert('Please wait for PDF extraction to complete');
      return;
    }

    const pdfMessage: Message = {
      id: Date.now().toString(),
      text: `📄 PDF uploaded: "${file.name}"${prompt ? ` - ${prompt}` : ''}`,
      isUser: true,
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, pdfMessage]);
    setIsChatLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: pdfText ? `PDF Content:\n${pdfText}\n\nQuestion: ${prompt || 'Analyze this PDF'}` : prompt || 'Analyze this PDF',
          userId: user.id,
          sessionId: `chapter-${chapterId}`,
          inputType: 'pdf',
          conversationHistory: messages.slice(-10).map(msg => ({
            text: msg.text,
            isUser: msg.isUser,
            timestamp: msg.timestamp
          })),
          sessionContext: `Chapter: ${chapter.title}, Subject: ${subjectName}, Class: ${classNumber}`,
          contextMetadata: {
            chapter: chapter.title,
            subject: subjectName,
            class: classNumber,
            chapterId: chapterId,
            pdfFileName: file.name
          },
          mode: reasoningMode ? 'reasoning' : 'standard'
        }),
      });

      if (!response.ok) throw new Error('Failed to process PDF');

      const data = await response.json();
      if (data.response) {
        const formatted = formatAIResponse(data.response);
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: data.response,
          isUser: false,
          timestamp: new Date(),
          type: 'text',
          formattedText: formatted.text,
          hasCode: formatted.hasCode,
          hasLists: formatted.hasLists,
          hasHeaders: formatted.hasHeaders
        };
        setMessages(prev => [...prev, aiMessage]);
        setLatestAIResponse(data.response);
      }

      setSelectedPDF(null);
      setPdfText(null);
    } catch (error: any) {
      console.error('Error processing PDF:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: `Error: ${error.message || 'Failed to process PDF. Please try again.'}`,
        isUser: false,
        timestamp: new Date(),
        type: 'text'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleVoiceRecordingComplete = async (audioBlob: Blob) => {
    // Voice recording will be handled by VoiceRecorder component
  };

  const handleVoiceTranscriptionComplete = async (transcription: string) => {
    setInputText(transcription);
  };

  const handleVoiceProcessingComplete = async (response: string) => {
    if (response) {
      const formatted = formatAIResponse(response);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        isUser: false,
        timestamp: new Date(),
        type: 'voice',
        formattedText: formatted.text,
        hasCode: formatted.hasCode,
        hasLists: formatted.hasLists,
        hasHeaders: formatted.hasHeaders
      };
      setMessages(prev => [...prev, aiMessage]);
      setLatestAIResponse(response);
    }
  };

  const getSubjectColor = (subject: string) => {
    const colorMap: { [key: string]: string } = {
      mathematics: 'blue',
      science: 'green',
      english: 'purple',
      hindi: 'orange',
      physics: 'indigo',
      chemistry: 'teal',
      biology: 'emerald',
      'social studies': 'rose',
      'computer science': 'violet'
    };
    return colorMap[subject.toLowerCase()] || 'gray';
  };

  const subjectColor = getSubjectColor(subjectName);

  if (!user || !chapter) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 pt-20">
          <div className="container mx-auto px-4 py-12">
            <div className="text-center">
              <Typography variant="h3" className="mb-4">
                {!user ? 'Please Login' : 'Chapter Not Found'}
              </Typography>
              <Button
                onClick={() => router.push(!user ? '/auth/login' : `/learning/${classNumber}/${subjectName}`)}
                className="bg-gray-900"
              >
                {!user ? 'Go to Login' : 'Back to Chapters'}
              </Button>
            </div>
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
        <div className="container mx-auto px-4 py-12">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <IconButton
                variant="text"
                onClick={() => router.push(`/learning/${classNumber}/${subjectName}`)}
                className="text-gray-900"
              >
                <i className="fa-solid fa-arrow-left"></i>
              </IconButton>
              <div>
                <Typography variant="h2" className="mb-2">
                  {chapter.title}
                </Typography>
                <Typography variant="lead" color="gray">
                  Chapter {chapter.number} - {subjectName} (Class {classNumber})
                </Typography>
              </div>
            </div>
            <Typography color="gray" className="mb-4">
              {chapter.description}
            </Typography>
            {chapter.topics.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {chapter.topics.map((topic, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Videos Section with Integrated AI Chat */}
          <div className="mb-8">
            {chapter.videos.length === 0 ? (
              <Card className="p-8 text-center">
                <CardBody>
                  <i className="fa-solid fa-video text-4xl text-gray-400 mb-4"></i>
                  <Typography variant="h5" className="mb-2">
                    No videos available
                  </Typography>
                  <Typography color="gray">
                    Videos for this chapter will be available soon.
                  </Typography>
                </CardBody>
              </Card>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Video Section */}
                        <Card className="overflow-hidden">
                          <CardBody className="p-0">
                            <div className="grid grid-cols-1 gap-4 p-6">
                              <div>
                                {chapter.videos[currentVideoIndex] && (
                                  <>
                                    <div className="relative w-full h-64 lg:h-80 bg-gray-900 rounded-lg mb-4">
                                      <video
                                        src={chapter.videos[currentVideoIndex].url}
                                        controls
                                        className="w-full h-full rounded-lg"
                                        poster={chapter.videos[currentVideoIndex].thumbnail}
                                      >
                                        Your browser does not support the video tag.
                                      </video>
                                    </div>
                                    <Typography variant="h5" className="mb-2">
                                      {chapter.videos[currentVideoIndex].title}
                                    </Typography>
                                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                                      <span><i className="fa-solid fa-clock mr-1"></i>{chapter.videos[currentVideoIndex].duration}</span>
                                    </div>
                                  </>
                                )}
                              </div>
                              <div>
                                <Typography variant="h6" className="mb-4">
                                  All Videos ({chapter.videos.length})
                                </Typography>
                                <div className="space-y-2 max-h-64 overflow-y-auto">
                                  {chapter.videos.map((v, i) => (
                                    <Card
                                      key={v.id}
                                      className={`cursor-pointer transition-all ${
                                        i === currentVideoIndex ? 'border-2 border-blue-500' : 'hover:shadow-md'
                                      }`}
                                      onClick={() => setCurrentVideoIndex(i)}
                                    >
                                      <CardBody className="p-3">
                                        <Typography variant="small" className="font-semibold mb-1">
                                          {v.title}
                                        </Typography>
                                        <Typography variant="small" color="gray">
                                          {v.duration}
                                        </Typography>
                                      </CardBody>
                                    </Card>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </CardBody>
                        </Card>

                        {/* AI Chat Interface - Same as Main Chat */}
                        <Card className="h-[700px] flex flex-col overflow-hidden">
                          <CardBody className="flex-1 flex flex-col p-0 min-h-0">
                            {/* Chat Header */}
                            <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                                  <span className="text-white font-bold">P</span>
                                </div>
                                <div>
                                  <Typography variant="h6" className="text-white font-semibold">
                                AI Chat Resolver
                              </Typography>
                                  <Typography className="text-gray-300 text-sm">
                                    Ask questions about {chapter?.title}
                                  </Typography>
                                </div>
                              </div>
                            </div>

                            {/* Messages Container */}
                            <div className="flex-1 overflow-y-auto bg-white p-4">
                              <div className="max-w-4xl mx-auto space-y-6">
                                {messages.map((message) => (
                                  <div
                                    key={message.id}
                                    className={`flex ${message.isUser ? "justify-end" : "justify-start"} group`}
                                  >
                                    <div className="flex items-start gap-3 max-w-4xl">
                                      {!message.isUser && (
                                        <div className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                                          <span className="text-white font-bold text-sm">P</span>
                                        </div>
                                      )}
                                      <div
                                        className={`px-6 py-4 rounded-2xl shadow-sm transition-all duration-200 group-hover:shadow-md ${
                                        message.isUser
                                            ? "bg-gray-900 text-white ml-auto"
                                            : "bg-white border border-gray-200 text-gray-900"
                                        }`}
                                      >
                                        <div
                                          className={`leading-relaxed ${
                                            message.isUser ? "text-white" : "text-gray-900"
                                      }`}
                                    >
                                      {message.isUser ? (
                                            <ScientificRenderer content={message.text} type="auto" />
                                      ) : (
                                            <ScientificRenderer content={message.formattedText || formatTextWithHTML(message.text)} type="auto" />
                                          )}
                                        </div>
                                        <div className="mt-3 flex items-center justify-between">
                                          <span
                                            className={`text-xs ${
                                              message.isUser ? "text-gray-100" : "text-gray-500"
                                            }`}
                                          >
                                            {message.timestamp.toLocaleTimeString('en-US', { 
                                              hour: '2-digit', 
                                              minute: '2-digit' 
                                            })}
                                          </span>
                                          {!message.isUser && (
                                            <SpeechSynthesis 
                                              text={message.text}
                                              size="sm"
                                              className="ml-2"
                                            />
                                          )}
                                        </div>
                                      </div>
                                      {message.isUser && (
                                        <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                                          <span className="text-white font-bold text-sm">U</span>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                ))}
                                
                                {isChatLoading && (
                                  <div className="flex justify-start">
                                    <div className="flex items-start gap-3">
                                      <div className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                                        <span className="text-white font-bold text-sm">P</span>
                                      </div>
                                      <div className="bg-white border border-gray-200 rounded-2xl px-6 py-4 shadow-sm">
                                        <div className="flex items-center gap-3">
                                          <div className="flex space-x-1">
                                            <div className="w-2 h-2 bg-gray-900 rounded-full animate-bounce"></div>
                                            <div className="w-2 h-2 bg-gray-900 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                                            <div className="w-2 h-2 bg-gray-900 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                                          </div>
                                          <Typography variant="small" color="gray" className="font-medium">
                                            PAATA.AI is thinking...
                                          </Typography>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                )}

                                <div ref={messagesEndRef} />
                              </div>
                            </div>

                            {/* Input Area */}
                            <div className="bg-white border-t border-gray-200 p-4">
                              {/* Reasoning Mode Toggle */}
                              <div className="mb-3 flex items-center justify-between">
                                <button
                                  onClick={() => setReasoningMode(!reasoningMode)}
                                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-200 ${
                                    reasoningMode
                                      ? 'bg-gray-50 border-gray-300 text-gray-900 shadow-sm'
                                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                                  }`}
                                  disabled={isChatLoading}
                                >
                                  <svg 
                                    xmlns="http://www.w3.org/2000/svg" 
                                    fill="none" 
                                    viewBox="0 0 24 24" 
                                    strokeWidth={1.5} 
                                    stroke="currentColor" 
                                    className={`w-5 h-5 ${reasoningMode ? 'text-gray-900' : 'text-gray-500'}`}
                                  >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                                  </svg>
                                  <span className={`text-sm font-medium ${reasoningMode ? 'text-gray-900' : 'text-gray-700'}`}>
                                    {reasoningMode ? 'Research Mode ON' : 'Research Mode'}
                                  </span>
                                  <div className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 ${
                                    reasoningMode ? 'bg-gray-900' : 'bg-gray-300'
                                  }`}>
                                    <span
                                      className={`${reasoningMode ? 'translate-x-4' : 'translate-x-0'} pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
                                    />
                                  </div>
                                </button>
                              </div>

                              {/* PDF Preview */}
                              {selectedPDF && (
                                <div className={`mb-4 p-3 rounded-lg flex items-center justify-between ${
                                  pdfExtractionError 
                                    ? 'bg-yellow-50 border border-yellow-200' 
                                    : 'bg-blue-50 border border-blue-200'
                                }`}>
                                  <div className="flex items-center gap-3 flex-1 min-w-0">
                                    <DocumentIcon className={`w-5 h-5 flex-shrink-0 ${
                                      pdfExtractionError ? 'text-yellow-600' : 'text-blue-600'
                                    }`} />
                                    <div className="flex-1 min-w-0">
                                      <p className={`text-sm font-medium truncate ${
                                        pdfExtractionError ? 'text-yellow-900' : 'text-blue-900'
                                      }`}>
                                        {selectedPDF.name}
                                      </p>
                                      {isExtractingPDF ? (
                                        <p className="text-xs text-blue-600">Extracting text...</p>
                                      ) : pdfExtractionError ? (
                                        <p className="text-xs text-yellow-700">{pdfExtractionError.split('\n')[0]}</p>
                                      ) : pdfText ? (
                                        <p className="text-xs text-blue-600">
                                          ✓ {pdfText.length.toLocaleString()} characters extracted
                                        </p>
                                      ) : (
                                        <p className="text-xs text-blue-600">Ready to analyze</p>
                                      )}
                                    </div>
                                  </div>
                                  <button
                                    onClick={handlePDFRemove}
                                    className={`flex-shrink-0 ml-2 ${
                                      pdfExtractionError 
                                        ? 'text-yellow-600 hover:text-yellow-800' 
                                        : 'text-blue-600 hover:text-blue-800'
                                    }`}
                                    disabled={isExtractingPDF}
                                    title="Remove PDF"
                                  >
                                    <XMarkIcon className="w-5 h-5" />
                                  </button>
                                </div>
                              )}

                              {/* Image Preview */}
                              {selectedImage && imagePreview && imagePreview.trim() !== "" && (
                                <div className="mb-4">
                                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                                    <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                                      <img
                                        src={imagePreview}
                                        alt="Selected"
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm text-gray-700 truncate font-medium">
                                        {selectedImage.name}
                                      </p>
                                      <p className="text-xs text-gray-500">
                                        Add your prompt in the text field below
                                      </p>
                                    </div>
                                    <button
                                      onClick={handleImageRemove}
                                      disabled={isChatLoading}
                                      className="p-2 text-gray-400 hover:text-red-500 disabled:opacity-50 transition-colors"
                                    >
                                      <XMarkIcon className="w-4 h-4" />
                                    </button>
                                  </div>
                                </div>
                              )}

                              {/* Input Field */}
                              <div className="flex items-end gap-3">
                                <div className="flex-1 relative">
                                  <textarea
                                    value={inputText}
                                    onChange={(e) => setInputText(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    placeholder="Ask a question about this chapter..."
                                    className="w-full px-4 py-3 pr-16 border border-gray-300 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent shadow-sm transition-all duration-200 hover:shadow-md text-sm"
                                    rows={1}
                                    style={{
                                      minHeight: "48px",
                                      maxHeight: "120px",
                                    }}
                                    onInput={(e) => {
                                      const target = e.target as HTMLTextAreaElement;
                                      target.style.height = "auto";
                                      target.style.height = Math.min(target.scrollHeight, 120) + "px";
                                    }}
                                  />
                                  <div className="absolute right-2 bottom-2 flex items-center gap-2">
                                    <ChatImageUpload 
                                      onImageSelect={handleImageSelect}
                                      onImageRemove={handleImageRemove}
                                      selectedImage={selectedImage}
                                      imagePreview={imagePreview}
                                      disabled={isChatLoading || !canUseFeature(user?.plan || 'Basic', 'imageAnalysis')}
                                      planRestricted={!canUseFeature(user?.plan || 'Basic', 'imageAnalysis')}
                                    />
                                    <ChatPDFUpload
                                      onPDFSelect={handlePDFSelect}
                                      onPDFRemove={handlePDFRemove}
                                      selectedPDF={selectedPDF}
                                      disabled={isChatLoading || isExtractingPDF}
                                      planRestricted={false}
                                    />
                                    <VoiceRecorder 
                                      onRecordingComplete={handleVoiceRecordingComplete}
                                      onTranscriptionComplete={handleVoiceTranscriptionComplete}
                                      onVoiceProcessingComplete={handleVoiceProcessingComplete}
                                      disabled={isChatLoading}
                                      planRestricted={false}
                                      sessionId={`chapter-${chapterId}`}
                                      conversationHistory={messages.slice(-10).map(msg => ({
                                        text: msg.text,
                                        isUser: msg.isUser,
                                        timestamp: msg.timestamp
                                      }))}
                                      sessionContext={generateSessionContext(messages)}
                                      userId={user?.id}
                                      mode={reasoningMode ? 'reasoning' : 'standard'}
                                />
                                    {latestAIResponse && (
                                      <SpeechSynthesis 
                                        text={latestAIResponse}
                                        size="sm"
                                      />
                                    )}
                                  </div>
                                </div>
                                
                                <Button
                                  onClick={handleSendMessage}
                                  disabled={(!inputText.trim() && !selectedImage && !selectedPDF) || isChatLoading}
                                  className="bg-gray-900 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed rounded-2xl px-6 py-4 h-[48px] shadow-lg transition-all duration-200 transform hover:scale-105 disabled:transform-none"
                                >
                                  <PaperAirplaneIcon className="w-5 h-5" />
                                </Button>
                              </div>
                            </div>
                          </CardBody>
                        </Card>
                      </div>
            )}
          </div>

          {/* PDF Books Section */}
          {chapter.pdfs.length > 0 && (
            <div className="mt-12">
              <div className="mb-6">
                <Typography variant="h4" className="mb-2">
                  PDF Books ({chapter.pdfs.length})
                </Typography>
                <Typography color="gray">
                  Download and study from these PDF books for this chapter
                </Typography>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {chapter.pdfs.map((pdf) => (
                  <Card key={pdf.id} className="hover:shadow-lg transition-shadow">
                    <CardBody className="p-6">
                      <div className="flex items-center justify-center w-16 h-16 bg-red-100 text-red-600 rounded-lg mb-4">
                        <i className="fa-solid fa-file-pdf text-3xl"></i>
                      </div>
                      <Typography variant="h6" className="mb-2">
                        {pdf.title}
                      </Typography>
                      <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                        <span><i className="fa-solid fa-file mr-1"></i>{pdf.size}</span>
                        {pdf.pages && (
                          <span><i className="fa-solid fa-book-open mr-1"></i>{pdf.pages} pages</span>
                        )}
                      </div>
                      <Button
                        size="sm"
                        className="w-full bg-red-600"
                        onClick={() => window.open(pdf.url, '_blank')}
                      >
                        <i className="fa-solid fa-download mr-2"></i>
                        Download PDF
                      </Button>
                    </CardBody>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}


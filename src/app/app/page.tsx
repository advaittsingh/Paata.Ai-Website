"use client";

import { useState, useRef, useEffect } from "react";
import { Typography, Button, IconButton } from "@material-tailwind/react";
import { PaperAirplaneIcon, PlusIcon, TrashIcon, Bars3Icon, XMarkIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { Navbar } from "@/components";
import { formatTextWithHTML } from "@/utils/textFormatter";
import ChatImageUpload from "@/components/chat-image-upload";
import VoiceRecorder from "@/components/voice-recorder";
import SpeechSynthesis from "@/components/speech-synthesis";
import { useUser } from "@/contexts/UserContext";
import { getPlanFeatures, canUseFeature, getRemainingConversations } from "@/utils/planLimits";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface ChatSession {
  id: string;
  title: string;
  timestamp: Date;
  messages: Message[];
}

export default function WebApp() {
  const { user, isAuthenticated, isLoading, updateUser } = useUser();
  
  // Only redirect if we've finished loading and user is not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      window.location.href = '/auth/login';
    }
  }, [isLoading, isAuthenticated]);

  // Show loading while checking authentication
  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#612A74] mx-auto mb-4"></div>
          <Typography color="gray">
            {isLoading ? 'Loading...' : 'Redirecting to login...'}
          </Typography>
        </div>
      </div>
    );
  }
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! I'm PAATA.AI, your intelligent homework assistant. I can help you with math problems, science questions, essay writing, and much more. What would you like to work on today?",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [currentContext, setCurrentContext] = useState<{
    contextType?: 'text' | 'image' | 'voice';
    relatedContexts?: number;
    suggestions?: string[];
    sessionStats?: any;
  }>({});
  const [usageInfo, setUsageInfo] = useState<{
    currentPlan: string;
    totalInteractions: number;
    remainingConversations: number | 'unlimited' | null;
  } | null>(null);
  const [planRestriction, setPlanRestriction] = useState<{
    show: boolean;
    message: string;
    upgradeRequired: boolean;
    requiredFeature?: string;
  }>({ show: false, message: '', upgradeRequired: false });
  const [latestAIResponse, setLatestAIResponse] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Get plan features for current user
  const planFeatures = user ? getPlanFeatures(user.plan) : null;
  const remainingConversations = user ? getRemainingConversations(user.plan, user.stats?.totalInteractions || 0) : null;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const generateChatTitle = (message: string): string => {
    // Clean up the message and create a meaningful title
    const cleanMessage = message.trim();
    
    // If it's a question, try to extract the main topic
    if (cleanMessage.includes('?')) {
      const questionWords = cleanMessage.split(' ').slice(0, 6);
      return questionWords.join(' ') + (cleanMessage.length > 30 ? '...' : '');
    }
    
    // If it's a statement, take the first few words
    const words = cleanMessage.split(' ');
    if (words.length <= 4) {
      return cleanMessage;
    }
    
    // Take first 4-5 words and add ellipsis if needed
    const title = words.slice(0, 4).join(' ');
    return title + (cleanMessage.length > title.length + 10 ? '...' : '');
  };

  const generateSessionContext = (messages: Message[]): string => {
    if (messages.length <= 1) {
      return "New conversation started";
    }

    // Only provide context for substantial conversations (more than 3 messages)
    if (messages.length <= 3) {
      return "New conversation started";
    }

    // Extract topics and subjects from user messages (only recent ones)
    const recentUserMessages = messages.filter(msg => msg.isUser).slice(-3); // Only last 3 user messages
    const subjects = new Set<string>();

    recentUserMessages.forEach(msg => {
      const text = msg.text.toLowerCase();
      
      // Only identify subjects if the message is substantial (not just greetings)
      if (text.length > 10 && !text.match(/^(hello|hi|hey|thanks|thank you)$/i)) {
        if (text.includes('math') || text.includes('algebra') || text.includes('geometry') || text.includes('calculus')) {
          subjects.add('Mathematics');
        }
        if (text.includes('science') || text.includes('physics') || text.includes('chemistry') || text.includes('biology')) {
          subjects.add('Science');
        }
        if (text.includes('english') || text.includes('writing') || text.includes('essay') || text.includes('grammar')) {
          subjects.add('English');
        }
        if (text.includes('history') || text.includes('historical') || text.includes('war') || text.includes('ancient')) {
          subjects.add('History');
        }
        if (text.includes('geography') || text.includes('country') || text.includes('culture')) {
          subjects.add('Geography');
        }
        if (text.includes('computer') || text.includes('programming') || text.includes('coding')) {
          subjects.add('Computer Science');
        }
      }
    });

    // Build minimal context summary
    let context = `Session started ${messages[0].timestamp.toLocaleDateString()}`;
    
    if (subjects.size > 0) {
      context += `. Recent subjects: ${Array.from(subjects).join(', ')}`;
    }

    return context;
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Auto-save messages to current session
  useEffect(() => {
    if (messages.length > 0 && currentSessionId) {
      setChatSessions(prev => prev.map(session => 
        session.id === currentSessionId 
          ? { ...session, messages: messages }
          : session
      ));
    }
  }, [messages, currentSessionId]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Load chat sessions from localStorage on component mount
  useEffect(() => {
    const savedSessions = localStorage.getItem('paata-chat-sessions');
    if (savedSessions) {
      try {
        const parsedSessions = JSON.parse(savedSessions);
        // Convert timestamp strings back to Date objects
        const sessionsWithDates = parsedSessions.map((session: any) => ({
          ...session,
          timestamp: new Date(session.timestamp),
          messages: session.messages.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }))
        }));
        setChatSessions(sessionsWithDates);
        
        // If there are saved sessions, select the most recent one
        if (sessionsWithDates.length > 0) {
          const mostRecentSession = sessionsWithDates[0]; // Assuming they're sorted by most recent
          setCurrentSessionId(mostRecentSession.id);
          if (mostRecentSession.messages.length > 0) {
            setMessages(mostRecentSession.messages);
          } else {
            setMessages([
              {
                id: "1",
                text: "Hello! I'm PAATA.AI, your intelligent homework assistant. I can help you with math problems, science questions, essay writing, and much more. What would you like to work on today?",
                isUser: false,
                timestamp: new Date(),
              },
            ]);
          }
        } else {
          // No saved sessions, create a new one
          const newSession: ChatSession = {
            id: Date.now().toString(),
            title: "New Chat",
            timestamp: new Date(),
            messages: [
              {
                id: "1",
                text: "Hello! I'm PAATA.AI, your intelligent homework assistant. I can help you with math problems, science questions, essay writing, and much more. What would you like to work on today?",
                isUser: false,
                timestamp: new Date(),
              },
            ],
          };
          setChatSessions([newSession]);
          setCurrentSessionId(newSession.id);
          setMessages(newSession.messages);
        }
      } catch (error) {
        console.error('Error loading chat sessions:', error);
        // If there's an error, create a new chat
        const newSession: ChatSession = {
          id: Date.now().toString(),
          title: "New Chat",
          timestamp: new Date(),
          messages: [
            {
              id: "1",
              text: "Hello! I'm PAATA.AI, your intelligent homework assistant. I can help you with math problems, science questions, essay writing, and much more. What would you like to work on today?",
              isUser: false,
              timestamp: new Date(),
            },
          ],
        };
        setChatSessions([newSession]);
        setCurrentSessionId(newSession.id);
        setMessages(newSession.messages);
      }
    } else {
      // No saved sessions, create a new one
      const newSession: ChatSession = {
        id: Date.now().toString(),
        title: "New Chat",
        timestamp: new Date(),
        messages: [
          {
            id: "1",
            text: "Hello! I'm PAATA.AI, your intelligent homework assistant. I can help you with math problems, science questions, essay writing, and much more. What would you like to work on today?",
            isUser: false,
            timestamp: new Date(),
          },
        ],
      };
      setChatSessions([newSession]);
      setCurrentSessionId(newSession.id);
      setMessages(newSession.messages);
    }
  }, []);

  // Save chat sessions to localStorage whenever they change
  useEffect(() => {
    if (chatSessions.length > 0) {
      localStorage.setItem('paata-chat-sessions', JSON.stringify(chatSessions));
    }
  }, [chatSessions]);

  const handleSendMessage = async () => {
    if ((!inputText.trim() && !selectedImage) || isChatLoading) return;

    // If there's an image, use the image upload function
    if (selectedImage) {
      await handleImageWithPrompt(selectedImage, inputText || "Please analyze this image");
      setSelectedImage(null);
      setImagePreview(null);
      setInputText("");
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    
    // Update chat session title if it's the first user message
    if (messages.length === 1) {
      const newTitle = generateChatTitle(inputText);
      setChatSessions(prev => prev.map(session => 
        session.id === currentSessionId 
          ? { ...session, title: newTitle }
          : session
      ));
    }
    
    const currentInput = inputText;
    setInputText("");
    setIsChatLoading(true);

    try {
      // Prepare conversation history (last 10 messages for context)
      const conversationHistory = messages.slice(-10).map(msg => ({
        text: msg.text,
        isUser: msg.isUser,
        timestamp: msg.timestamp
      }));

      // Generate session context summary
      const sessionContext = generateSessionContext(messages);

      // Call the API to get AI response with enhanced context
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        },
        body: JSON.stringify({ 
          message: currentInput,
          conversationHistory: conversationHistory,
          sessionContext: sessionContext,
          sessionId: currentSessionId || 'default-session',
          inputType: 'text',
          contextMetadata: {
            messageCount: messages.length,
            sessionTitle: chatSessions.find(s => s.id === currentSessionId)?.title || 'New Chat'
          },
          userId: user?.id
        }),
        cache: 'no-store'
      });

      if (!response.ok) {
        const errorData = await response.json();
        
        // Handle authentication errors
        if (response.status === 401 && errorData.requiresAuth) {
          // Redirect to login page
          window.location.href = '/auth/login';
          return;
        }
        
        // Handle plan restriction errors
        if (response.status === 403 && errorData.upgradeRequired) {
          setPlanRestriction({
            show: true,
            message: errorData.message,
            upgradeRequired: true,
            requiredFeature: errorData.requiredFeature
          });
          return;
        }
        
        throw new Error(errorData.message || 'Failed to get AI response');
      }

      const data = await response.json();
      
      // Update user context if updated user data is available
      if (data.updatedUser && updateUser) {
        await updateUser(data.updatedUser);
      }
      
      // Update usage info if available
      if (data.usage) {
        setUsageInfo(data.usage);
      }
      
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: data.response,
        isUser: false,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, aiResponse]);
      setLatestAIResponse(data.response);
      
      // Update context information if available
      if (data.context) {
        setCurrentContext({
          contextType: data.context.contextType,
          relatedContexts: data.context.relatedContexts,
          suggestions: data.context.suggestions,
          sessionStats: data.context.sessionStats
        });
      }
    } catch (error) {
      console.error('Error getting AI response:', error);
      
      // Fallback response if API fails
      const fallbackResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: "I apologize, but I'm having trouble processing your request right now. Please try again in a moment, or feel free to ask me about your homework in a different way!",
        isUser: false,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, fallbackResponse]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleImageSelect = (file: File) => {
    setSelectedImage(file);
    
    // Create preview
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
    // Create a message showing the image upload
    const imageMessage: Message = {
      id: Date.now().toString(),
      text: `📷 Image uploaded: "${prompt}"`,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, imageMessage]);
    setIsChatLoading(true);

    try {
      // First, get OCR text from the image
      const formData = new FormData();
      formData.append('image', file);
      
      let extractedText = '';
      let ocrResult: any = null;
      try {
        const ocrResponse = await fetch('/api/ocr', {
          method: 'POST',
          body: formData,
        });
        
        if (ocrResponse.ok) {
          ocrResult = await ocrResponse.json();
          extractedText = ocrResult.text || '';
        }
      } catch (ocrError) {
        console.error('OCR error:', ocrError);
      }

      // Prepare conversation history
      const conversationHistory = messages.slice(-10).map(msg => ({
        text: msg.text,
        isUser: msg.isUser,
        timestamp: msg.timestamp
      }));

      // Generate session context
      const sessionContext = generateSessionContext(messages);

      // Create enhanced message with image context
      const enhancedMessage = extractedText 
        ? `${prompt}\n\n[Image contains the following text:]\n${extractedText}`
        : `${prompt}\n\n[Image uploaded - please analyze based on the prompt]`;

      // Call the chat API with enhanced context
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message: enhancedMessage,
          conversationHistory: conversationHistory,
          sessionContext: sessionContext,
          sessionId: currentSessionId || 'default-session',
          inputType: 'image',
          contextMetadata: {
            imageFileName: file.name,
            imageSize: file.size,
            extractedText: extractedText,
            ocrConfidence: ocrResult?.confidence || 0,
            ocrEngines: ocrResult?.engines || [],
            messageCount: messages.length,
            sessionTitle: chatSessions.find(s => s.id === currentSessionId)?.title || 'New Chat'
          }
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const data = await response.json();
      
      // Update user context if updated user data is available
      if (data.updatedUser && updateUser) {
        await updateUser(data.updatedUser);
      }
      
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: data.response,
        isUser: false,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, aiResponse]);
      setLatestAIResponse(data.response);
      
      // Update context information if available
      if (data.context) {
        setCurrentContext({
          contextType: data.context.contextType,
          relatedContexts: data.context.relatedContexts,
          suggestions: data.context.suggestions,
          sessionStats: data.context.sessionStats
        });
      }
    } catch (error) {
      console.error('Error analyzing image:', error);
      
      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: "I apologize, but I'm having trouble analyzing the image right now. Please try again or describe what you see in the image.",
        isUser: false,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleVoiceRecordingComplete = (audioBlob: Blob) => {
    console.log('Voice recording completed:', audioBlob);
    // Audio is now processed in the backend
  };

  const handleVoiceProcessingComplete = async (transcribedText: string, aiResponse: string) => {
    if (transcribedText.trim()) {
      // Create a voice message
      const voiceMessage: Message = {
        id: Date.now().toString(),
        text: `🎤 Voice: ${transcribedText}`,
        isUser: true,
        timestamp: new Date(),
      };

      // Create AI response message
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        isUser: false,
        timestamp: new Date(),
      };

      // Add both messages to the chat
      setMessages(prev => [...prev, voiceMessage, aiMessage]);
    }
  };

  const handleVoiceTranscriptionComplete = async (transcribedText: string) => {
    // This is now handled by handleVoiceProcessingComplete
    // Keeping for backward compatibility
    if (transcribedText.trim()) {
      const voiceMessage: Message = {
        id: Date.now().toString(),
        text: `🎤 Voice: ${transcribedText}`,
        isUser: true,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, voiceMessage]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const createNewChat = () => {
    // First, save the current session's messages before creating a new one
    if (currentSessionId) {
      setChatSessions(prev => prev.map(session => 
        session.id === currentSessionId 
          ? { ...session, messages: messages }
          : session
      ));
    }
    
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: "New Chat",
      timestamp: new Date(),
      messages: [
        {
          id: "1",
          text: "Hello! I'm PAATA.AI, your intelligent homework assistant. I can help you with math problems, science questions, essay writing, and much more. What would you like to work on today?",
          isUser: false,
          timestamp: new Date(),
        },
      ],
    };
    
    setChatSessions(prev => [newSession, ...prev]);
    setCurrentSessionId(newSession.id);
    setMessages(newSession.messages);
  };

  const selectChatSession = (sessionId: string) => {
    // First, save the current session's messages before switching
    if (currentSessionId) {
      setChatSessions(prev => prev.map(session => 
        session.id === currentSessionId 
          ? { ...session, messages: messages }
          : session
      ));
    }
    
    // Find the target session
    const targetSession = chatSessions.find(s => s.id === sessionId);
    if (targetSession) {
      setCurrentSessionId(sessionId);
      setMessages(targetSession.messages);
    }
  };

  const deleteChatSession = (sessionId: string) => {
    if (chatSessions.length <= 1) return; // Don't delete the last session
    
    setChatSessions(prev => prev.filter(s => s.id !== sessionId));
    
    if (currentSessionId === sessionId) {
      const remainingSessions = chatSessions.filter(s => s.id !== sessionId);
      if (remainingSessions.length > 0) {
        selectChatSession(remainingSessions[0].id);
      }
    }
  };

  return (
    <div className="h-screen bg-gray-50 overflow-hidden flex flex-col">
      {/* Website Navbar */}
      <Navbar />
      
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className={`${sidebarOpen ? 'w-80' : 'w-0'} transition-all duration-300 ease-in-out bg-gray-900 flex flex-col overflow-hidden shadow-xl`}>
          {/* Sidebar Header */}
          <div className="pt-20 pb-4 px-4 bg-gray-900 border-b border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#612A74] rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-lg">P</span>
                </div>
                <div>
                  <Typography variant="h6" color="white" className="font-bold text-lg">
                    PAATA.AI
                  </Typography>
                  <Typography variant="small" color="gray" className="text-xs">
                    Your AI Assistant
                  </Typography>
                </div>
              </div>
              <IconButton
                variant="text"
                color="white"
                size="sm"
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden hover:bg-gray-700 transition-colors"
              >
                <XMarkIcon className="w-5 h-5" />
              </IconButton>
            </div>
            <Button
              onClick={createNewChat}
              className="w-full bg-[#612A74] hover:bg-[#4a1f5c] flex items-center gap-2 justify-center py-2 rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105"
            >
              <PlusIcon className="w-5 h-5" />
              <span className="font-semibold">New Chat</span>
            </Button>
          </div>
          
          {/* Chat Sessions */}
          <div className="flex-1 overflow-y-auto p-3">
            <div className="space-y-2">
              <Typography variant="small" color="gray" className="text-xs uppercase tracking-wider font-semibold mb-3 px-2">
                Recent Chats
              </Typography>
              
              {/* Current Session Summary */}
              {currentSessionId && messages.length > 1 && (
                <div className="mb-4 p-3 bg-gray-800 rounded-lg border border-gray-700">
                  <Typography variant="small" color="gray" className="text-xs uppercase tracking-wider font-semibold mb-2 text-gray-400">
                    Current Session
                  </Typography>
                  <div className="text-xs text-gray-300">
                    <div className="mb-1">
                      <span className="text-gray-400">Topics:</span> {generateSessionContext(messages).split('.')[1]?.replace(' Subjects discussed: ', '') || 'General discussion'}
                    </div>
                    <div className="mb-1">
                      <span className="text-gray-400">Messages:</span> {messages.length}
                    </div>
                    <div>
                      <span className="text-gray-400">Started:</span> {messages[0].timestamp.toLocaleDateString()}
                    </div>
                  </div>
                </div>
              )}
              {chatSessions.length === 0 && (
                <div className="text-center py-8">
                  <Typography variant="small" color="gray" className="text-gray-500 text-sm">
                    No conversations yet
                  </Typography>
                  <Typography variant="small" color="gray" className="text-gray-600 text-xs mt-1">
                    Start a new chat to begin
                  </Typography>
                </div>
              )}
              {chatSessions.map((session) => (
                <div
                  key={session.id}
                  className={`group flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                    currentSessionId === session.id
                      ? 'bg-[#612A74] text-white shadow-lg transform scale-105'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white hover:shadow-md'
                  }`}
                  onClick={() => selectChatSession(session.id)}
                >
                  <div className="flex-1 min-w-0">
                    <Typography
                      variant="small"
                      className={`font-medium truncate ${
                        currentSessionId === session.id ? 'text-white' : 'text-gray-300'
                      }`}
                    >
                      {session.title}
                    </Typography>
                    <Typography
                      variant="small"
                      className={`text-xs mt-1 ${
                        currentSessionId === session.id ? 'text-purple-100' : 'text-gray-500'
                      }`}
                    >
                      {session.timestamp.toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </Typography>
                  </div>
                  {chatSessions.length > 1 && (
                    <IconButton
                      variant="text"
                      size="sm"
                      color={currentSessionId === session.id ? "white" : "gray"}
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteChatSession(session.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-red-500 hover:text-white"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </IconButton>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col bg-white">
          {/* Header */}
          <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-4">
              {!sidebarOpen && (
                <IconButton
                  variant="text"
                  color="gray"
                  size="sm"
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden hover:bg-gray-100"
                >
                  <Bars3Icon className="w-5 h-5" />
                </IconButton>
              )}
              <div>
                <Typography variant="h5" color="blue-gray" className="font-bold">
                  {chatSessions.find(s => s.id === currentSessionId)?.title || "New Chat"}
                </Typography>
                <Typography variant="small" color="gray" className="text-xs">
                  {messages.length > 1 ? `${messages.length - 1} messages` : 'Start a conversation'}
                </Typography>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <Typography variant="small" color="gray" className="text-xs">
                Online
              </Typography>
            </div>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto bg-white">
            <div className="max-w-5xl mx-auto px-6 py-8">
              {messages.length === 1 && (
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-[#612A74] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <span className="text-white font-bold text-2xl">P</span>
                  </div>
                  <Typography variant="h4" color="blue-gray" className="font-bold mb-2">
                    Welcome to PAATA.AI
                  </Typography>
                  <Typography variant="paragraph" color="gray" className="max-w-md mx-auto">
                    Your intelligent homework assistant is ready to help you learn and succeed.
                  </Typography>
                </div>
              )}
              
              <div className="space-y-6">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.isUser ? "justify-end" : "justify-start"} group`}
                  >
                    <div className="flex items-start gap-3 max-w-4xl">
                      {!message.isUser && (
                        <div className="w-8 h-8 bg-[#612A74] rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                          <span className="text-white font-bold text-sm">P</span>
                        </div>
                      )}
                      <div
                        className={`px-6 py-4 rounded-2xl shadow-sm transition-all duration-200 group-hover:shadow-md ${
                          message.isUser
                            ? "bg-[#612A74] text-white ml-auto"
                            : "bg-white border border-gray-200 text-gray-900"
                        }`}
                      >
                        <Typography
                          variant="paragraph"
                          className={`leading-relaxed ${
                            message.isUser ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {message.isUser ? (
                            message.text
                          ) : (
                            <span 
                              dangerouslySetInnerHTML={{ 
                                __html: formatTextWithHTML(message.text) 
                              }} 
                            />
                          )}
                        </Typography>
                        <div className="mt-3 flex items-center justify-between">
                          <span
                            className={`text-xs ${
                              message.isUser ? "text-purple-100" : "text-gray-500"
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
                      <div className="w-8 h-8 bg-[#612A74] rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                        <span className="text-white font-bold text-sm">P</span>
                      </div>
                      <div className="bg-white border border-gray-200 rounded-2xl px-6 py-4 shadow-sm">
                        <div className="flex items-center gap-3">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-[#612A74] rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-[#612A74] rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                            <div className="w-2 h-2 bg-[#612A74] rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
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
          </div>

          {/* Input Area */}
          {/* Plan Restriction Alert */}
          {planRestriction.show && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 mx-6 mt-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{planRestriction.message}</p>
                  {planRestriction.upgradeRequired && (
                    <div className="mt-2">
                      <button
                        onClick={() => window.location.href = '/profile/billing'}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-700 transition-colors"
                      >
                        Upgrade Plan
                      </button>
                    </div>
                  )}
                </div>
                <div className="ml-auto pl-3">
                  <button
                    onClick={() => setPlanRestriction({ show: false, message: '', upgradeRequired: false })}
                    className="text-red-400 hover:text-red-600"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Usage Information */}
          {isAuthenticated && user && (
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mx-6 mt-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-bold text-sm">
                        {user.plan.charAt(0)}
                      </span>
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-blue-900">
                      {user.plan} Plan
                    </p>
                    <p className="text-sm text-blue-700">
                      {remainingConversations === 'unlimited' 
                        ? 'Unlimited conversations'
                        : `${remainingConversations} conversations remaining this month`
                      }
                    </p>
                  </div>
                </div>
                {remainingConversations !== 'unlimited' && remainingConversations !== null && remainingConversations < 10 && (
                  <button
                    onClick={() => window.location.href = '/profile/billing'}
                    className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors"
                  >
                    Upgrade
                  </button>
                )}
              </div>
            </div>
          )}

          <div className="bg-white border-t border-gray-200 px-6 py-6 shadow-lg">
            <div className="max-w-5xl mx-auto">
              {/* Image Preview - Above Input Field */}
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
              
              <div className="flex items-end gap-3">
                <div className="flex-1 relative">
                  <textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask me anything about your homework..."
                    className="w-full px-4 sm:px-6 py-3 sm:py-4 pr-16 sm:pr-20 border border-gray-300 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-[#612A74] focus:border-transparent shadow-sm transition-all duration-200 hover:shadow-md text-sm sm:text-base"
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
                  <div className="absolute right-2 sm:right-4 bottom-2 sm:bottom-4 flex items-center gap-1 sm:gap-2">
                    <ChatImageUpload 
                      onImageSelect={handleImageSelect}
                      onImageRemove={handleImageRemove}
                      selectedImage={selectedImage}
                      imagePreview={imagePreview}
                      disabled={isChatLoading || !canUseFeature(user?.plan || 'Basic', 'imageAnalysis')}
                      planRestricted={!canUseFeature(user?.plan || 'Basic', 'imageAnalysis')}
                    />
                    <VoiceRecorder 
                      onRecordingComplete={handleVoiceRecordingComplete}
                      onTranscriptionComplete={handleVoiceTranscriptionComplete}
                      onVoiceProcessingComplete={handleVoiceProcessingComplete}
                      disabled={isChatLoading}
                      planRestricted={false}
                      sessionId={currentSessionId || 'default-session'}
                      conversationHistory={messages.slice(-10).map(msg => ({
                        text: msg.text,
                        isUser: msg.isUser,
                        timestamp: msg.timestamp
                      }))}
                      sessionContext={generateSessionContext(messages)}
                      userId={user?.id}
                    />
                    {latestAIResponse && (
                      <SpeechSynthesis 
                        text={latestAIResponse}
                        size="sm"
                        className="hidden sm:block"
                      />
                    )}
                  </div>
                </div>
                
                {/* Send button always on same line */}
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputText.trim() || isChatLoading}
                  className="bg-[#612A74] hover:bg-[#4a1f5c] disabled:opacity-50 disabled:cursor-not-allowed rounded-xl sm:rounded-2xl px-3 sm:px-6 py-2 sm:py-4 h-[48px] sm:h-[56px] shadow-lg transition-all duration-200 transform hover:scale-105 disabled:transform-none"
                >
                  <PaperAirplaneIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                </Button>
              </div>
              
              {/* Mobile: Show additional controls below */}
              <div className="flex items-center justify-between sm:hidden mt-2">
                <div className="flex items-center gap-2">
                  {latestAIResponse && (
                    <SpeechSynthesis 
                      text={latestAIResponse}
                      size="sm"
                    />
                  )}
                  <Typography variant="small" color="gray" className="text-xs">
                    Press Enter to send
                  </Typography>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

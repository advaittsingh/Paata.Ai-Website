"use client";

import { useState, useRef, useEffect } from "react";
import { Typography, Button, IconButton } from "@material-tailwind/react";
import { PaperAirplaneIcon, PlusIcon, TrashIcon, Bars3Icon, XMarkIcon, ExclamationTriangleIcon, DocumentIcon } from "@heroicons/react/24/outline";
import { Navbar, MathRenderer, ScientificRenderer } from "@/components";
import { formatTextWithHTML } from "@/utils/textFormatter";
import { formatAIResponse, getResponseIcon, getResponseColor } from "@/utils/responseFormatter";
import ChatImageUpload from "@/components/chat-image-upload";
import ChatPDFUpload from "@/components/chat-pdf-upload";
import VoiceRecorder from "@/components/voice-recorder";
import SpeechSynthesis from "@/components/speech-synthesis";
import { useUser } from "@/contexts/UserContext";
import { getPlanFeatures, canUseFeature, getRemainingConversations } from "@/utils/planLimits";
import { ChatSkeleton, ChatMessageSkeleton } from "@/components/loading-skeleton";
import { ErrorBoundary } from "@/components/error-boundary";
import AppSidebar from "@/components/app-sidebar";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  formattedText?: string;
  hasCode?: boolean;
  hasLists?: boolean;
  hasHeaders?: boolean;
}

interface ChatSession {
  id: string;
  title: string;
  timestamp: Date;
  messages: Message[];
}

export default function WebApp() {
  const { user, isAuthenticated, isLoading, updateUser } = useUser();
  
  // All state hooks must be called before any conditional returns
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
  const [selectedPDF, setSelectedPDF] = useState<File | null>(null);
  const [pdfText, setPdfText] = useState<string | null>(null);
  const [isExtractingPDF, setIsExtractingPDF] = useState(false);
  const [pdfExtractionError, setPdfExtractionError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  // ChatGPT-style: Use Record/object for sessions (one source of truth)
  const [sessions, setSessions] = useState<Record<string, ChatSession>>({});
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [isLoadingSessions, setIsLoadingSessions] = useState(false);
  const [hasLoadedSessions, setHasLoadedSessions] = useState(false);
  const [hasInitializedNewChat, setHasInitializedNewChat] = useState(false);
  const deletedSessionsRef = useRef<Set<string>>(new Set()); // Track deleted session IDs to prevent reloading
  const creatingSessionRef = useRef<string | null>(null); // Track which session is being created
  const isSyncingRef = useRef(false); // Sync lock guard to prevent feedback loops
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
  const [reasoningMode, setReasoningMode] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Define scrollToBottom function before useEffect hooks
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Helper function to check if a session is empty (only contains AI greeting)
  const isSessionEmpty = (messages: Message[]): boolean => {
    if (messages.length === 0) return true;
    if (messages.length === 1) {
      const message = messages[0];
      // Check if it's only the AI greeting message
      return !message.isUser && message.text.includes("Hello! I'm PAATA.AI, your intelligent homework assistant");
    }
    return false;
  };
  
  // Only redirect if we've finished loading and user is not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      window.location.href = '/auth/login';
    }
  }, [isLoading, isAuthenticated]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // ChatGPT-style: Update current session when messages change (idempotent - no loops)
  useEffect(() => {
    if (!currentSessionId || isSyncingRef.current) return;
    if (!hasLoadedSessions) return;

    const current = sessions[currentSessionId];
    if (!current) return;

    const prevLast = current.messages.at(-1)?.id;
    const nextLast = messages.at(-1)?.id;

    // Only update if message count or latest ID changed
    if (current.messages.length === messages.length && prevLast === nextLast) return;

    // Update without triggering sync lock (this is a local state update)
    setSessions(prev => ({
      ...prev,
      [currentSessionId]: {
        ...prev[currentSessionId],
        messages,
        timestamp: new Date(),
      },
    }));
  }, [messages, currentSessionId, hasLoadedSessions]);

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

  // Initialize new chat on mount if not already done
  useEffect(() => {
    if (!hasInitializedNewChat && !currentSessionId) {
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
      
      setSessions(prev => ({
        ...prev,
        [newSession.id]: newSession,
      }));
      
      setCurrentSessionId(newSession.id);
      setMessages(newSession.messages);
      setHasInitializedNewChat(true);
                      }
  }, [hasInitializedNewChat, currentSessionId]);

  // Chat history loading disabled - removed for now
  // useEffect(() => {
  //   // Session loading code removed
  // }, [user?.id, sidebarOpen]);
                    
  // Chat history saving disabled - removed for now
  // useEffect(() => {
  //   // localStorage saving code removed
  // }, [sessions, hasLoadedSessions]);

  // Chat history database saving disabled - removed for now

  // Show loading while checking authentication
  if (isLoading || !isAuthenticated) {
    return (
      <ErrorBoundary>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <ChatSkeleton />
            <Typography color="gray" className="mt-4">
              {isLoading ? 'Loading...' : 'Redirecting to login...'}
            </Typography>
          </div>
        </div>
      </ErrorBoundary>
    );
  }

  // Get plan features for current user
  const planFeatures = user ? getPlanFeatures(user.plan) : null;
  const remainingConversations = user ? getRemainingConversations(user.plan, user.stats?.totalInteractions || 0) : null;

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

  const handleSendMessage = async () => {
    if ((!inputText.trim() && !selectedImage && !selectedPDF) || isChatLoading) return;

    // If there's a PDF, use the PDF upload function
    if (selectedPDF) {
      await handlePDFWithPrompt(selectedPDF, inputText || "Please analyze this PDF");
      setInputText("");
      return;
    }

    // If there's an image, use the image upload function
    if (selectedImage) {
      await handleImageWithPrompt(selectedImage, inputText || "Please analyze this image");
      setSelectedImage(null);
      setImagePreview(null);
      setInputText("");
      return;
    }

    // Ensure we have a valid session before sending messages
    let activeSessionId = currentSessionId;
    if (!activeSessionId) {
      // only create when there are zero sessions
      if (Object.keys(sessions).length === 0) {
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
        if (!isSyncingRef.current) {
          setSessions(prev => ({ ...prev, [newSession.id]: newSession }));
          activeSessionId = newSession.id;
          setCurrentSessionId(activeSessionId);
          isSyncingRef.current = true;
          setMessages(newSession.messages);
          setTimeout(() => {
            isSyncingRef.current = false;
          }, 200);
        }
      } else {
        // pick the most recent existing session
        const mostRecent = Object.values(sessions)
          .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())[0];
        if (mostRecent?.id) {
          activeSessionId = mostRecent.id;
          setCurrentSessionId(mostRecent.id);
          isSyncingRef.current = true;
          setMessages(mostRecent.messages);
          setTimeout(() => {
            isSyncingRef.current = false;
          }, 200);
        }
      }
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
      timestamp: new Date(),
    };

    // Prevent duplicate messages
    setMessages(prev => {
      const all = [...prev, userMessage];
      const deduped = Array.from(new Map(all.map(m => [m.id, m])).values());
      return deduped;
    });
    
    // Update chat session title if it's the first user message
    if (messages.length === 1 && activeSessionId) {
      const newTitle = generateChatTitle(inputText);
      setSessions(prev => {
        if (!prev[activeSessionId]) return prev;
        return {
          ...prev,
          [activeSessionId]: {
            ...prev[activeSessionId],
            title: newTitle,
          },
        };
      });
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
          sessionId: activeSessionId || currentSessionId || 'default-session',
          inputType: 'text',
          contextMetadata: {
            messageCount: messages.length,
            sessionTitle: sessions[activeSessionId || currentSessionId || '']?.title || 'New Chat'
          },
          userId: user?.id,
          mode: reasoningMode ? 'reasoning' : 'standard'
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
      
      const formatted = formatAIResponse(data.response);
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: data.response,
        formattedText: formatted.text,
        hasCode: formatted.hasCode,
        hasLists: formatted.hasLists,
        hasHeaders: formatted.hasHeaders,
        isUser: false,
        timestamp: new Date(),
      };
      
      // ChatGPT-style: Prevent duplicate messages
      setMessages(prev => {
        const exists = prev.some(m => m.id === aiResponse.id);
        return exists ? prev : [...prev, aiResponse];
      });
      
      // Ensure session exists in database before saving messages
      // This guarantees all messages in this conversation go to the same session
      const dbSessionId = await ensureSessionInDatabase(activeSessionId || currentSessionId || '');
      
      if (dbSessionId) {
        // Update currentSessionId if it changed
        if (dbSessionId !== (activeSessionId || currentSessionId)) {
          setCurrentSessionId(dbSessionId);
        }
        
        // Save both user message and AI response to database using the same session
        await saveMessageToDatabase(userMessage, {
          inputType: 'text'
        });
        await saveMessageToDatabase(aiResponse, {
          inputType: 'text',
          isResponse: true
        });
      }
      
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
      
      // Prevent duplicate messages
      setMessages(prev => {
        const all = [...prev, fallbackResponse];
        const deduped = Array.from(new Map(all.map(m => [m.id, m])).values());
        return deduped;
      });
      
      // Ensure session exists in database before saving messages
      const dbSessionId = await ensureSessionInDatabase(activeSessionId || currentSessionId || '');
      
      if (dbSessionId) {
        // Update currentSessionId if it changed
        if (dbSessionId !== (activeSessionId || currentSessionId)) {
          setCurrentSessionId(dbSessionId);
        }
        
        // Save user message and fallback response to database using the same session
        await saveMessageToDatabase(userMessage, {
          inputType: 'text'
        });
        await saveMessageToDatabase(fallbackResponse, {
          inputType: 'text',
          isResponse: true,
          isError: true
        });
      }
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

  const handlePDFSelect = async (file: File) => {
    console.log('handlePDFSelect called with file:', file.name, file.size, file.type);
    
    if (!file) {
      console.error('No file provided to handlePDFSelect');
      return;
    }
    
    setSelectedPDF(file);
    setPdfExtractionError(null);
    setIsExtractingPDF(true);
    setPdfText(null); // Clear previous text
    
    console.log('Starting PDF extraction for:', file.name);
    
    try {
      // Extract text from PDF
      const formData = new FormData();
      formData.append('pdf', file);
      
      console.log('Sending PDF to extraction API:', {
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type
      });
      
      const response = await fetch('/api/chat/pdf-extract', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });
      
      console.log('PDF extraction API response status:', response.status, response.statusText);

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.error || errorData.message || 'Failed to extract text from PDF';
        
        // Store error but keep PDF selected
        let userFriendlyError = errorMessage;
        
        // Provide helpful guidance based on error type
        if (errorMessage.includes('PDF processing library not available') || 
            errorMessage.includes('OCR service not available')) {
          userFriendlyError = 'PDF processing is currently unavailable. You can still use the PDF by:\n' +
            '1. Converting PDF pages to images (JPEG/PNG) and uploading those\n' +
            '2. Copying and pasting the text from the PDF directly\n' +
            '3. Using a PDF with selectable text if available';
        } else if (errorMessage.includes('too large') || errorMessage.includes('size limit')) {
          userFriendlyError = errorMessage + '\n\nPlease try with a smaller file or split the PDF into parts.';
        }
        
        setPdfExtractionError(userFriendlyError);
        console.error('PDF extraction failed:', errorMessage);
        return; // Keep PDF selected so user can see it
      }

      const data = await response.json();
      if (data.success && data.text) {
        setPdfText(data.text);
        setPdfExtractionError(null); // Clear any previous errors
        console.log('PDF extracted successfully:', {
          textLength: data.text.length,
          numPages: data.numPages,
          fileName: data.fileName
        });
      } else {
        setPdfExtractionError('Failed to extract text from PDF. The PDF may be image-based or corrupted. You can still try to use it.');
        console.error('PDF extraction returned no text');
      }
    } catch (error: any) {
      console.error('PDF extraction error:', error);
      
      // Store error but keep PDF selected
      const errorMsg = error.message || 'Failed to extract text from PDF. The PDF is still selected - you can try to use it or remove it.';
      setPdfExtractionError(errorMsg);
    } finally {
      setIsExtractingPDF(false);
    }
  };

  const handlePDFRemove = () => {
    setSelectedPDF(null);
    setPdfText(null);
    setPdfExtractionError(null);
  };

  // Helper function to ensure session exists in database and get its ID
  // Chat history disabled - no database operations
  const ensureSessionInDatabase = async (sessionId: string): Promise<string | null> => {
    // Disabled - return null to skip database operations
    return null;
    if (!user?.id) return null;
    
    // If session already exists in database (IDs start with 'cl'), return it
    if (sessionId.startsWith('cl')) {
      return sessionId;
    }
    
    // Check if we're already creating this session
    if (creatingSessionRef.current === sessionId) {
      // Wait a bit and retry
      await new Promise(resolve => setTimeout(resolve, 200));
      const updatedSession = sessions[sessionId];
      if (updatedSession && updatedSession.id.startsWith('cl')) {
        return updatedSession.id;
      }
      // If still not created, wait a bit more
      await new Promise(resolve => setTimeout(resolve, 300));
      const retrySession = sessions[sessionId];
      if (retrySession && retrySession.id.startsWith('cl')) {
        return retrySession.id;
      }
      return null;
    }
    
    // Create session in database
    creatingSessionRef.current = sessionId;
    const currentSession = sessions[sessionId];
    
    try {
      const createResponse = await fetch('/api/chat/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          title: currentSession?.title || 'New Chat',
        }),
      });
      
      if (createResponse.ok) {
        const data = await createResponse.json();
        const dbSessionId = data.session.id;
        
        // Update current session ID immediately
        if (currentSessionId === sessionId) {
          setCurrentSessionId(dbSessionId);
        }
        
        // ChatGPT-style: Update session in Record (replace old ID with new)
        setSessions(prev => {
          if (!prev[sessionId]) return prev;
          const updated = { ...prev };
          delete updated[sessionId]; // Remove old ID
          updated[dbSessionId] = { ...prev[sessionId], id: dbSessionId }; // Add with new ID
          return updated;
        });
        
        creatingSessionRef.current = null;
        return dbSessionId;
      } else {
        console.error('Failed to create session:', await createResponse.text());
        creatingSessionRef.current = null;
        return null;
      }
    } catch (error) {
      console.error('Error creating session:', error);
      creatingSessionRef.current = null;
      return null;
    }
  };

  // Helper function to save messages to database immediately
  // This ensures all messages in a conversation are saved to the SAME session
  // Chat history saving disabled - removed for now
  const saveMessageToDatabase = async (message: Message, metadata?: any) => {
    // Disabled - no database saving
    return;
    if (!user?.id || !currentSessionId) {
      console.log('Cannot save message: user or session not available');
      return;
    }
    
    try {
      // Ensure session exists in database and get the database session ID
      const dbSessionId = await ensureSessionInDatabase(currentSessionId);
      
      if (!dbSessionId) {
        console.warn('Could not ensure session in database, message will be saved later');
        return;
      }
      
      // Save message to database using the correct session ID
      const messageResponse = await fetch(`/api/chat/sessions/${dbSessionId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          text: message.text,
          isUser: message.isUser,
          metadata: metadata ? JSON.stringify(metadata) : undefined,
        }),
      });
      
      if (messageResponse.ok) {
        const messageData = await messageResponse.json();
        // Update message ID with database ID if needed
        if (messageData.message?.id && messageData.message.id !== message.id) {
          setMessages(prev => prev.map(msg => 
            msg.id === message.id ? { ...msg, id: messageData.message.id } : msg
          ));
        }
        console.log('✅ Message saved to database:', messageData.message?.id);
      } else {
        const errorText = await messageResponse.text();
        console.error('Failed to save message:', errorText);
      }
    } catch (error) {
      console.error('Error saving message to database:', error);
    }
  };

  const handlePDFWithPrompt = async (file: File, prompt: string) => {
    // Wait for PDF extraction if still in progress
    if (isExtractingPDF) {
      alert('Please wait for PDF extraction to complete');
      return;
    }

    // For exam papers, allow proceeding even if PDF extraction failed
    // Only trigger for very specific exam paper keywords (not just "solve question")
    const isExamPaperRequest = /solve.*entire.*paper|solve.*all.*questions.*paper|solve.*entire.*exam|previous.*year.*paper|previous.*year.*question.*paper|pyq.*paper|exam.*paper.*solve/i.test(prompt) || 
                               /exam.*paper|previous.*year.*paper|pyq.*paper/i.test(file.name);
    
    if (!pdfText) {
      if (pdfExtractionError) {
        if (isExamPaperRequest) {
          // For exam papers, allow proceeding with a warning
          const proceed = confirm('PDF text extraction failed:\n\n' + pdfExtractionError + '\n\nDo you want to proceed anyway? The AI will attempt to solve the paper, but may have limited access to the content.');
          if (!proceed) {
            return;
          }
        } else {
          alert('PDF text extraction failed:\n\n' + pdfExtractionError + '\n\nYou can still try to ask questions about the PDF, but the AI may not have access to the full content.');
          return;
        }
      } else {
        alert('PDF text extraction is still in progress. Please wait a moment and try again.');
        return;
      }
    }

    // Create a message showing the PDF upload
    const pdfMessage: Message = {
      id: Date.now().toString(),
      text: `📄 PDF uploaded: "${file.name}"\n\n${prompt}`,
      isUser: true,
      timestamp: new Date(),
    };

    // Prevent duplicate messages
    setMessages(prev => {
      const all = [...prev, pdfMessage];
      const deduped = Array.from(new Map(all.map(m => [m.id, m])).values());
      return deduped;
    });
    
    // Save PDF message to database immediately
    await saveMessageToDatabase(pdfMessage, {
      pdfFileName: file.name,
      pdfSize: file.size,
      pdfTextLength: pdfText?.length || 0,
      isExamPaper: isExamPaperRequest,
      inputType: 'pdf'
    });
    
    setIsChatLoading(true);

    try {
      // Prepare conversation history
      const conversationHistory = messages.slice(-10).map(msg => ({
        text: msg.text,
        isUser: msg.isUser,
        timestamp: msg.timestamp
      }));

      // Generate session context
      const sessionContext = generateSessionContext(messages);

      // Detect if this is an exam paper to solve
      // Only trigger for very specific exam paper keywords (not just "solve question")
      const isExamPaper = /solve.*entire.*paper|solve.*all.*questions.*paper|solve.*entire.*exam|previous.*year.*paper|previous.*year.*question.*paper|pyq.*paper|exam.*paper.*solve/i.test(prompt) || 
                         /exam.*paper|previous.*year.*paper|pyq.*paper/i.test(file.name);
      
      console.log('📝 PDF upload detected:', {
        fileName: file.name,
        prompt: prompt,
        isExamPaper: isExamPaper,
        pdfTextLength: pdfText?.length || 0,
        hasPdfText: !!pdfText
      });
      
      // For exam papers, send full PDF text; for others, truncate to 50k chars
      // If PDF extraction failed, still try to process with the prompt
      const maxTextLength = isExamPaper && pdfText ? pdfText.length : (pdfText ? Math.min(pdfText.length, 50000) : 0);
      const pdfContent = pdfText ? pdfText.substring(0, maxTextLength) : '';
      const isTruncated = pdfText ? pdfText.length > maxTextLength : false;
      
      // Create enhanced message with PDF context
      let enhancedMessage = '';
      if (isExamPaper) {
        if (pdfContent) {
          enhancedMessage = `${prompt}\n\n[EXAM PAPER CONTENT - SOLVE ALL QUESTIONS:]\n${pdfContent}${isTruncated ? '\n\n[... PDF content continues but may be truncated ...]' : ''}`;
        } else {
          // Even if PDF extraction failed, still send the exam paper prompt
          enhancedMessage = `${prompt}\n\n[NOTE: PDF text extraction may have failed, but please attempt to solve the exam paper based on the user's request. If you can see any content above, use it. Otherwise, ask the user to ensure the PDF is readable.]`;
        }
      } else {
        if (pdfContent) {
          enhancedMessage = `${prompt}\n\n[PDF Document Content:]\n${pdfContent}${isTruncated ? '\n\n[... PDF content truncated for length ...]' : ''}`;
        } else {
          enhancedMessage = `${prompt}\n\n[NOTE: PDF text extraction may have failed. Please respond based on the user's prompt.]`;
        }
      }

      // Call the chat API with PDF context
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
          inputType: 'pdf',
          questionType: isExamPaper ? 'exam_question' : 'pdf_question',
          contextMetadata: {
            pdfFileName: file.name,
            pdfSize: file.size,
            pdfTextLength: pdfText?.length || 0,
            isExamPaper: isExamPaper,
            messageCount: messages.length,
            sessionTitle: sessions[currentSessionId || '']?.title || 'New Chat'
          },
          userId: user?.id,
          mode: reasoningMode ? 'reasoning' : 'standard'
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        
        // Handle authentication errors
        if (response.status === 401 && errorData.requiresAuth) {
          window.location.href = '/auth/login';
          return;
        }
        
        throw new Error(errorData.error || `Server error: ${response.status}`);
      }

      const data = await response.json();
      
      // Add AI response
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.response,
        isUser: false,
        timestamp: new Date(),
      };

      // Prevent duplicate messages
      setMessages(prev => (prev.some(m => m.id === aiMessage.id) ? prev : [...prev, aiMessage]));
      
      // Save AI response to database immediately
      await saveMessageToDatabase(aiMessage, {
        inputType: 'pdf',
        isResponse: true
      });
      
      setLatestAIResponse(data.response);
      setCurrentContext(data.context || {});
      setUsageInfo(data.usage || null);
      
      // Clear PDF after successful message
      setSelectedPDF(null);
      setPdfText(null);
      
    } catch (error: any) {
      console.error('Error sending PDF message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: `Error: ${error.message || 'Failed to process PDF. Please try again.'}`,
        isUser: false,
        timestamp: new Date(),
      };
      // Prevent duplicate messages
      setMessages(prev => {
        const all = [...prev, errorMessage];
        const deduped = Array.from(new Map(all.map(m => [m.id, m])).values());
        return deduped;
      });
      
      // Save error message to database
      await saveMessageToDatabase(errorMessage, {
        inputType: 'pdf',
        isError: true
      });
    } finally {
      setIsChatLoading(false);
      scrollToBottom();
    }
  };

  const handleImageWithPrompt = async (file: File, prompt: string) => {
    // Create a message showing the image upload
    const imageMessage: Message = {
      id: Date.now().toString(),
      text: `📷 Image uploaded: "${prompt}"`,
      isUser: true,
      timestamp: new Date(),
    };

    // Prevent duplicate messages
    setMessages(prev => {
      const all = [...prev, imageMessage];
      const deduped = Array.from(new Map(all.map(m => [m.id, m])).values());
      return deduped;
    });
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
          console.log('OCR successful:', { textLength: extractedText.length, engines: ocrResult?.engines });
        } else {
          console.error('OCR failed:', ocrResponse.status, ocrResponse.statusText);
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
            sessionTitle: sessions[currentSessionId || '']?.title || 'New Chat'
          },
          userId: user?.id,
          mode: reasoningMode ? 'reasoning' : 'standard'
        }),
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
      
      const formatted = formatAIResponse(data.response);
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: data.response,
        formattedText: formatted.text,
        hasCode: formatted.hasCode,
        hasLists: formatted.hasLists,
        hasHeaders: formatted.hasHeaders,
        isUser: false,
        timestamp: new Date(),
      };
      
      // Prevent duplicate messages
      setMessages(prev => (prev.some(m => m.id === aiResponse.id) ? prev : [...prev, aiResponse]));
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

      // Add both messages to the chat (prevent duplicates)
      setMessages(prev => {
        const hasVoice = prev.some(m => m.id === voiceMessage.id);
        const hasAI = prev.some(m => m.id === aiMessage.id);
        const newMessages = [];
        if (!hasVoice) newMessages.push(voiceMessage);
        if (!hasAI) newMessages.push(aiMessage);
        return newMessages.length > 0 ? [...prev, ...newMessages] : prev;
      });
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
    // ChatGPT-style: Save current session before creating new one
    if (currentSessionId) {
      const currentSession = sessions[currentSessionId];
      if (currentSession && !isSessionEmpty(messages)) {
        // Update current session with latest messages
        setSessions(prev => ({
          ...prev,
          [currentSessionId]: {
            ...prev[currentSessionId],
            messages,
            timestamp: new Date(),
          },
        }));
      } else if (currentSession && isSessionEmpty(messages)) {
        // Remove empty session
        setSessions(prev => {
          const updated = { ...prev };
          delete updated[currentSessionId];
          return updated;
        });
      }
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
    
    // ChatGPT-style: Add new session to Record (automatically deduplicated by key)
    if (isSyncingRef.current) return;
    
    setSessions(prev => ({
      ...prev,
      [newSession.id]: newSession,
    }));
    
    setCurrentSessionId(newSession.id);
    isSyncingRef.current = true;
    setMessages(newSession.messages);
    setTimeout(() => {
      isSyncingRef.current = false;
    }, 200);
  };

  const selectChatSession = async (sessionId: string) => {
    if (currentSessionId === sessionId || isSyncingRef.current) return;

    // save current before switching
    if (currentSessionId) {
      const cur = sessions[currentSessionId];
      if (cur && !isSessionEmpty(messages)) {
        setSessions(prev => ({
          ...prev,
          [currentSessionId]: { ...prev[currentSessionId], messages, timestamp: new Date() },
        }));
      } else if (cur && isSessionEmpty(messages)) {
        setSessions(prev => {
          const copy = { ...prev };
          delete copy[currentSessionId];
          return copy;
        });
      }
    }

    const target = sessions[sessionId];
    if (!target) return;

    setCurrentSessionId(sessionId);

    // Chat history loading disabled - just use cached messages
    // Database loading removed

    isSyncingRef.current = true;
    setMessages(target.messages);
    setTimeout(() => {
      isSyncingRef.current = false;
    }, 200);
  };

  const deleteChatSession = async (sessionId: string) => {
    const sessionsCount = Object.keys(sessions).length;
    if (sessionsCount <= 1) {
      return alert("You must have at least one session.");
    }

    // Immediately update UI
    setSessions(prev => {
      const copy = { ...prev };
      delete copy[sessionId];
      return copy;
    });

    // Chat history disabled - no localStorage or database operations
    // localStorage and database deletion removed

    // Mark as deleted to prevent reload
    deletedSessionsRef.current.add(sessionId);

    // Pick next available session
    const remaining = Object.values(sessions).filter(s => s.id !== sessionId);
    const next = remaining.sort(
      (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
    )[0];

    setCurrentSessionId(next?.id || null);
    setMessages(next?.messages || [
      {
        id: "1",
        text: "Hello! I'm PAATA.AI, your intelligent homework assistant. I can help you with math problems, science questions, essay writing, and much more. What would you like to work on today?",
        isUser: false,
        timestamp: new Date(),
      },
    ]);
  };

  const clearAllChats = async () => {
    const sessionsArray = Object.values(sessions);
    if (sessionsArray.length === 0) return;

    // Chat history disabled - no database operations
    // Database deletion removed

    // Clear all sessions from state
    setSessions({});
    
    // Chat history disabled - no localStorage operations
    // localStorage clearing removed
    
    // Clear deleted sessions ref
    deletedSessionsRef.current.clear();
    
    // Create a new empty session
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
    
    setSessions({ [newSession.id]: newSession });
    setCurrentSessionId(newSession.id);
    setMessages(newSession.messages);
  };

  const exportChatSession = async (sessionId: string) => {
    if (!sessionId.startsWith('cl')) {
      // Export from Record
      const session = sessions[sessionId];
      if (session) {
        const exportData = {
          session: {
            id: session.id,
            title: session.title,
            createdAt: session.timestamp.toISOString(),
            updatedAt: session.timestamp.toISOString(),
          },
          messages: session.messages.map(msg => ({
            text: msg.text,
            isUser: msg.isUser,
            timestamp: msg.timestamp.toISOString(),
          })),
        };
        
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `chat-${sessionId}.json`;
        a.click();
        URL.revokeObjectURL(url);
      }
      return;
    }
    
    // Export from database
    try {
      const response = await fetch(`/api/chat/export/${sessionId}?format=json`, {
        credentials: 'include',
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `chat-${sessionId}.json`;
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Error exporting chat:', error);
      alert('Failed to export chat. Please try again.');
    }
  };

  return (
    <div className="h-screen bg-gray-50 overflow-hidden flex flex-col">
      {/* Website Navbar */}
      <Navbar />
      
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <AppSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}>
          <div className="space-y-4">
            <Button
              onClick={createNewChat}
              className="w-full bg-gray-900 hover:bg-gray-800 flex items-center gap-2 justify-center py-2.5 rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105"
            >
              <PlusIcon className="w-5 h-5" />
              <span className="font-semibold">New Chat</span>
            </Button>
            
            {/* Chat History disabled - removed for now */}
            {/* Chat Sessions section removed */}
          </div>
        </AppSidebar>

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
                  {sessions[currentSessionId || '']?.title || "New Chat"}
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
                  <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
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
              {/* Advanced Reasoning Mode Toggle */}
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
                {reasoningMode && (
                  <div className="text-xs text-gray-600 bg-gray-50 px-3 py-1 rounded-md border border-gray-200">
                    AI will research online and provide comprehensive, detailed answers like Perplexity's research mode
                  </div>
                )}
              </div>
              
              {/* PDF Preview - Above Input Field */}
              {selectedPDF && (
                <div className={`mx-6 mb-4 p-3 rounded-lg flex items-center justify-between ${
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
                        <div>
                          <p className="text-xs text-yellow-700 font-medium">⚠️ Extraction failed</p>
                          <p className="text-xs text-yellow-600 mt-1 line-clamp-2">
                            {pdfExtractionError.split('\n')[0]}
                          </p>
                        </div>
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
                    className="w-full px-4 sm:px-6 py-3 sm:py-4 pr-16 sm:pr-20 border border-gray-300 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent shadow-sm transition-all duration-200 hover:shadow-md text-sm sm:text-base"
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
                      sessionId={currentSessionId || 'default-session'}
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
                        className="hidden sm:block"
                      />
                    )}
                  </div>
                </div>
                
                {/* Send button always on same line */}
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputText.trim() || isChatLoading}
                  className="bg-gray-900 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl sm:rounded-2xl px-3 sm:px-6 py-2 sm:py-4 h-[48px] sm:h-[56px] shadow-lg transition-all duration-200 transform hover:scale-105 disabled:transform-none"
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

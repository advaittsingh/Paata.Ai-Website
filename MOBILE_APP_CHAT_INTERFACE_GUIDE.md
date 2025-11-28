# 💬 Mobile App Chat Interface Implementation Guide

## Overview

This document provides a comprehensive guide for implementing the AI Chat Interface in the PAATA.AI mobile app. The chat interface enables users to interact with AI through multiple input methods (text, voice, image, PDF) and includes features like session management, reasoning mode, text-to-speech, and conversation history.

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Data Models & Structure](#data-models--structure)
3. [API Endpoints](#api-endpoints)
4. [Screen Implementations](#screen-implementations)
5. [Component Implementations](#component-implementations)
6. [Navigation Flow](#navigation-flow)
7. [State Management](#state-management)
8. [Features & Functionality](#features--functionality)
9. [UI/UX Guidelines](#uiux-guidelines)
10. [Performance Optimization](#performance-optimization)
11. [Implementation Checklist](#implementation-checklist)

---

## Architecture Overview

### Chat System Flow

```
User Input → Input Handler → API Request → AI Processing → Response Formatting → Message Display
     ↓              ↓              ↓              ↓                  ↓                ↓
  (Text/Voice/   Validate    Add Context    Generate      Format Markdown    Update UI
   Image/PDF)    & Process   & History      Response      & Code Blocks     & Scroll
```

### Key Components

1. **Chat Screen**: Main interface for conversations
2. **Message Bubbles**: Display user and AI messages
3. **Input Area**: Text input with attachments
4. **Voice Recorder**: Record and transcribe voice
5. **Image Picker**: Upload and analyze images
6. **PDF Uploader**: Upload and extract PDF content
7. **Session Manager**: Manage multiple conversations
8. **Text-to-Speech**: Read AI responses aloud

### Input Types

- **Text**: Standard text messages
- **Voice**: Speech-to-text with audio recording
- **Image**: Image upload with OCR/AI analysis
- **PDF**: PDF upload with text extraction

---

## Data Models & Structure

### Message Model

```typescript
interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  type?: 'text' | 'voice' | 'image' | 'pdf';
  formattedText?: string;        // HTML formatted text
  hasCode?: boolean;              // Contains code blocks
  hasLists?: boolean;             // Contains lists
  hasHeaders?: boolean;           // Contains headers
  imageUrl?: string;              // For image messages
  pdfFileName?: string;            // For PDF messages
  audioUrl?: string;               // For voice messages
  metadata?: {
    inputType?: string;
    sessionId?: string;
    contextMetadata?: any;
  };
}
```

### Chat Session Model

```typescript
interface ChatSession {
  id: string;
  title: string;
  timestamp: Date;
  messages: Message[];
  lastMessageAt?: Date;
  messageCount?: number;
}
```

### Chat State Model

```typescript
interface ChatState {
  messages: Message[];
  sessions: Record<string, ChatSession>;
  currentSessionId: string | null;
  isLoading: boolean;
  isSending: boolean;
  error: string | null;
  inputText: string;
  selectedImage: File | null;
  selectedPDF: File | null;
  isRecording: boolean;
  reasoningMode: boolean;
  usageInfo: {
    currentPlan: string;
    totalInteractions: number;
    remainingConversations: number | 'unlimited' | null;
  } | null;
}
```

---

## API Endpoints

### Base URL
```
https://www.paataai.com/api
```

### Authentication
All endpoints require JWT token in `Authorization: Bearer <token>` header.

### Endpoints

#### 1. Send Chat Message (Text)
```http
POST /api/chat
Content-Type: application/json

{
  "message": "What is photosynthesis?",
  "userId": "user_123",
  "sessionId": "session_123",
  "inputType": "text",
  "conversationHistory": [
    {
      "text": "Hello",
      "isUser": true,
      "timestamp": "2024-01-01T00:00:00Z"
    }
  ],
  "sessionContext": "New conversation started",
  "contextMetadata": {},
  "mode": "standard"
}
```

**Response:**
```json
{
  "response": "Photosynthesis is the process by which plants...",
  "updatedUser": {
    "stats": {
      "totalInteractions": 10
    }
  },
  "usage": {
    "currentPlan": "Pro",
    "totalInteractions": 10,
    "remainingConversations": "unlimited"
  },
  "context": {
    "contextType": "text",
    "relatedContexts": 0,
    "suggestions": ["Learn more about chloroplasts", "Explore plant biology"]
  }
}
```

#### 2. Send Voice Message
```http
POST /api/voice
Content-Type: multipart/form-data

audio: <audio file>
sessionId: "session_123"
conversationHistory: "[...]"
sessionContext: "New conversation"
userId: "user_123"
mode: "standard"
```

**Response:**
```json
{
  "success": true,
  "transcribedText": "What is the capital of France?",
  "aiResponse": "The capital of France is Paris..."
}
```

#### 3. Send Image Message
```http
POST /api/chat/image
Content-Type: multipart/form-data

image: <image file>
message: "What's in this image?"
userId: "user_123"
sessionId: "session_123"
sessionContext: "Image analysis"
mode: "standard"
```

**Response:**
```json
{
  "response": "This image shows a mathematical equation..."
}
```

#### 4. Extract PDF Text
```http
POST /api/chat/pdf-extract
Content-Type: multipart/form-data

pdf: <pdf file>
```

**Response:**
```json
{
  "success": true,
  "text": "Extracted PDF content...",
  "numPages": 5,
  "fileName": "document.pdf"
}
```

#### 5. Get Chat Sessions
```http
GET /api/chat/sessions
```

**Response:**
```json
{
  "sessions": [
    {
      "id": "session_123",
      "title": "Math Help",
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z",
      "messageCount": 10
    }
  ]
}
```

#### 6. Create Chat Session
```http
POST /api/chat/sessions
Content-Type: application/json

{
  "title": "New Chat"
}
```

#### 7. Get Session Messages
```http
GET /api/chat/sessions/{sessionId}/messages
```

#### 8. Delete Chat Session
```http
DELETE /api/chat/sessions?id={sessionId}
```

#### 9. Text-to-Speech
```http
POST /api/mobile/tts
Content-Type: application/json

{
  "text": "Hello, this is a test.",
  "language": "en",
  "voice": "en-US-Standard-B"
}
```

**Response:** Audio file (MP3/WAV)

---

## Screen Implementations

### 1. Chat Screen (Main Interface)

**File:** `src/screens/chat/ChatScreen.tsx`

**Purpose:** Main chat interface with message display and input controls.

**Implementation:**

```typescript
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation, useRoute } from '@react-navigation/native';
import { colors, spacing, typography, borderRadius, shadows } from '../../constants/theme';
import { sendMessage, loadMessages, clearMessages } from '../../store/slices/chatSlice';
import MessageBubble from '../../components/chat/MessageBubble';
import VoiceRecorder from '../../components/chat/VoiceRecorder';
import ImagePicker from '../../components/chat/ImagePicker';
import PDFUploader from '../../components/chat/PDFUploader';
import TextToSpeech from '../../components/chat/TextToSpeech';
import { PaperAirplaneIcon, PhotoIcon, DocumentIcon, MicrophoneIcon } from 'react-native-heroicons/outline';

export default function ChatScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
  const { messages, isLoading, isSending, currentSessionId } = useSelector((state: RootState) => state.chat);
  const { user } = useSelector((state: RootState) => state.auth);
  
  const [inputText, setInputText] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedPDF, setSelectedPDF] = useState<File | null>(null);
  const [pdfText, setPdfText] = useState<string | null>(null);
  const [isExtractingPDF, setIsExtractingPDF] = useState(false);
  const [reasoningMode, setReasoningMode] = useState(false);
  const [showInputOptions, setShowInputOptions] = useState(false);
  
  const flatListRef = useRef<FlatList>(null);
  const inputRef = useRef<TextInput>(null);
  const sessionId = route.params?.sessionId || currentSessionId || 'default-session';

  useEffect(() => {
    if (sessionId) {
      dispatch(loadMessages(sessionId));
    }
  }, [sessionId]);

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if ((!inputText.trim() && !selectedImage && !selectedPDF) || isSending) return;

    // Handle PDF first
    if (selectedPDF && pdfText) {
      await handlePDFWithPrompt(selectedPDF, inputText || 'Analyze this PDF');
      return;
    }

    // Handle image
    if (selectedImage) {
      await handleImageWithPrompt(selectedImage, inputText || 'Analyze this image');
      return;
    }

    // Handle text message
    if (!inputText.trim()) return;

    const messageData = {
      message: inputText,
      sessionId: sessionId,
      inputType: 'text',
      conversationHistory: messages.slice(-10).map(msg => ({
        text: msg.text,
        isUser: msg.isUser,
        timestamp: msg.timestamp
      })),
      sessionContext: generateSessionContext(),
      contextMetadata: {
        messageCount: messages.length,
      },
      userId: user?.id,
      mode: reasoningMode ? 'reasoning' : 'standard'
    };

    dispatch(sendMessage(messageData));
    setInputText('');
  };

  const handleImageWithPrompt = async (imageUri: string, prompt: string) => {
    try {
      const formData = new FormData();
      formData.append('image', {
        uri: imageUri,
        type: 'image/jpeg',
        name: 'image.jpg',
      } as any);
      formData.append('message', prompt);
      formData.append('userId', user?.id || '');
      formData.append('sessionId', sessionId);
      formData.append('sessionContext', generateSessionContext());
      formData.append('mode', reasoningMode ? 'reasoning' : 'standard');

      const response = await fetch('https://www.paataai.com/api/chat/image', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to process image');
      }

      const data = await response.json();
      
      if (data.response) {
        // Add user message
        dispatch(addMessage({
          id: Date.now().toString(),
          text: `📷 Image: ${prompt}`,
          isUser: true,
          timestamp: new Date(),
          type: 'image',
          imageUrl: imageUri,
        }));

        // Add AI response
        dispatch(addMessage({
          id: (Date.now() + 1).toString(),
          text: data.response,
          isUser: false,
          timestamp: new Date(),
          formattedText: formatAIResponse(data.response),
        }));

        setSelectedImage(null);
        setInputText('');
      }
    } catch (error) {
      console.error('Error processing image:', error);
      Alert.alert('Error', 'Failed to process image. Please try again.');
    }
  };

  const handlePDFWithPrompt = async (pdf: File, prompt: string) => {
    if (isExtractingPDF) {
      Alert.alert('Please wait', 'PDF extraction in progress...');
      return;
    }

    if (!pdfText && !isExtractingPDF) {
      Alert.alert('Please wait', 'PDF extraction in progress...');
      return;
    }

    try {
      const response = await fetch('https://www.paataai.com/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          message: pdfText ? `PDF Content:\n${pdfText}\n\nQuestion: ${prompt}` : prompt,
          userId: user?.id,
          sessionId: sessionId,
          inputType: 'pdf',
          conversationHistory: messages.slice(-10).map(msg => ({
            text: msg.text,
            isUser: msg.isUser,
            timestamp: msg.timestamp
          })),
          sessionContext: generateSessionContext(),
          contextMetadata: {
            pdfFileName: pdf.name
          },
          mode: reasoningMode ? 'reasoning' : 'standard'
        }),
      });

      if (!response.ok) throw new Error('Failed to process PDF');

      const data = await response.json();
      
      if (data.response) {
        // Add user message
        dispatch(addMessage({
          id: Date.now().toString(),
          text: `📄 PDF: ${pdf.name} - ${prompt}`,
          isUser: true,
          timestamp: new Date(),
          type: 'pdf',
          pdfFileName: pdf.name,
        }));

        // Add AI response
        dispatch(addMessage({
          id: (Date.now() + 1).toString(),
          text: data.response,
          isUser: false,
          timestamp: new Date(),
          formattedText: formatAIResponse(data.response),
        }));

        setSelectedPDF(null);
        setPdfText(null);
        setInputText('');
      }
    } catch (error) {
      console.error('Error processing PDF:', error);
      Alert.alert('Error', 'Failed to process PDF. Please try again.');
    }
  };

  const handlePDFSelect = async (pdf: File) => {
    setSelectedPDF(pdf);
    setIsExtractingPDF(true);
    setPdfText(null);

    try {
      const formData = new FormData();
      formData.append('pdf', pdf as any);

      const response = await fetch('https://www.paataai.com/api/chat/pdf-extract', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        Alert.alert('PDF Extraction Failed', errorData.error || 'Failed to extract text from PDF');
        return;
      }

      const data = await response.json();
      if (data.success && data.text) {
        setPdfText(data.text);
      } else {
        Alert.alert('Warning', 'Could not extract text from PDF. You can still use it with a prompt.');
      }
    } catch (error) {
      console.error('PDF extraction error:', error);
      Alert.alert('Error', 'Failed to extract PDF. You can still try to use it.');
    } finally {
      setIsExtractingPDF(false);
    }
  };

  const generateSessionContext = (): string => {
    if (messages.length <= 1) {
      return 'New conversation started';
    }

    if (messages.length <= 3) {
      return 'New conversation started';
    }

    // Extract subjects from recent messages
    const recentUserMessages = messages.filter(msg => msg.isUser).slice(-3);
    const subjects = new Set<string>();

    recentUserMessages.forEach(msg => {
      const text = msg.text.toLowerCase();
      if (text.length > 10) {
        if (text.includes('math') || text.includes('algebra') || text.includes('geometry')) {
          subjects.add('Mathematics');
        }
        if (text.includes('science') || text.includes('physics') || text.includes('chemistry')) {
          subjects.add('Science');
        }
        // Add more subject detection...
      }
    });

    let context = `Session started ${messages[0].timestamp.toLocaleDateString()}`;
    if (subjects.size > 0) {
      context += `. Recent subjects: ${Array.from(subjects).join(', ')}`;
    }

    return context;
  };

  const formatAIResponse = (text: string): string => {
    // Format markdown, code blocks, lists, etc.
    // This would use a markdown parser
    return text;
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <MessageBubble message={item} />
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={90}
    >
      {/* Messages List */}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        style={styles.messagesList}
        contentContainerStyle={styles.messagesContent}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              Hello! I'm PAATA.AI, your intelligent homework assistant. I can help you with math problems, science questions, essay writing, and much more. What would you like to work on today?
            </Text>
          </View>
        }
      />

      {/* Input Area */}
      <View style={styles.inputContainer}>
        {/* Attachment Options */}
        {showInputOptions && (
          <View style={styles.inputOptions}>
            <TouchableOpacity
              style={styles.optionButton}
              onPress={() => {
                // Open image picker
                setShowInputOptions(false);
              }}
            >
              <PhotoIcon size={24} color={colors.primary} />
              <Text style={styles.optionText}>Image</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.optionButton}
              onPress={() => {
                // Open PDF picker
                setShowInputOptions(false);
              }}
            >
              <DocumentIcon size={24} color={colors.primary} />
              <Text style={styles.optionText}>PDF</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.optionButton}
              onPress={() => {
                // Start voice recording
                setShowInputOptions(false);
              }}
            >
              <MicrophoneIcon size={24} color={colors.primary} />
              <Text style={styles.optionText}>Voice</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Selected Image Preview */}
        {selectedImage && (
          <View style={styles.previewContainer}>
            <Image source={{ uri: selectedImage }} style={styles.previewImage} />
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => setSelectedImage(null)}
            >
              <Text style={styles.removeButtonText}>×</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Selected PDF Preview */}
        {selectedPDF && (
          <View style={styles.previewContainer}>
            <View style={styles.pdfPreview}>
              <DocumentIcon size={32} color={colors.primary} />
              <Text style={styles.pdfName} numberOfLines={1}>
                {selectedPDF.name}
              </Text>
              {isExtractingPDF && (
                <Text style={styles.extractingText}>Extracting text...</Text>
              )}
            </View>
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => {
                setSelectedPDF(null);
                setPdfText(null);
              }}
            >
              <Text style={styles.removeButtonText}>×</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Input Row */}
        <View style={styles.inputRow}>
          <TouchableOpacity
            style={styles.attachButton}
            onPress={() => setShowInputOptions(!showInputOptions)}
          >
            <Text style={styles.attachButtonText}>+</Text>
          </TouchableOpacity>

          <TextInput
            ref={inputRef}
            style={styles.textInput}
            placeholder="Type your message..."
            placeholderTextColor={colors.gray500}
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={2000}
            editable={!isSending}
          />

          {isSending ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color={colors.primary} />
            </View>
          ) : (
            <TouchableOpacity
              style={[
                styles.sendButton,
                (!inputText.trim() && !selectedImage && !selectedPDF) && styles.sendButtonDisabled
              ]}
              onPress={handleSendMessage}
              disabled={(!inputText.trim() && !selectedImage && !selectedPDF) || isSending}
            >
              <PaperAirplaneIcon size={20} color={colors.white} />
            </TouchableOpacity>
          )}
        </View>

        {/* Reasoning Mode Toggle */}
        <TouchableOpacity
          style={styles.reasoningToggle}
          onPress={() => setReasoningMode(!reasoningMode)}
        >
          <Text style={styles.reasoningText}>
            {reasoningMode ? '🧠 Reasoning Mode ON' : '🧠 Reasoning Mode OFF'}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    padding: spacing.md,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xxl,
  },
  emptyText: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  inputContainer: {
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.gray200,
    padding: spacing.md,
  },
  inputOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
    marginBottom: spacing.md,
  },
  optionButton: {
    alignItems: 'center',
    padding: spacing.sm,
  },
  optionText: {
    ...typography.caption,
    color: colors.textPrimary,
    marginTop: spacing.xs,
  },
  previewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.gray100,
    borderRadius: borderRadius.medium,
    padding: spacing.sm,
    marginBottom: spacing.sm,
  },
  previewImage: {
    width: 60,
    height: 60,
    borderRadius: borderRadius.small,
    marginRight: spacing.sm,
  },
  pdfPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  pdfName: {
    ...typography.bodySmall,
    color: colors.textPrimary,
    marginLeft: spacing.sm,
    flex: 1,
  },
  extractingText: {
    ...typography.caption,
    color: colors.textSecondary,
    marginLeft: spacing.sm,
  },
  removeButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.red600,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButtonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing.sm,
  },
  attachButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.gray100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  attachButtonText: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  textInput: {
    flex: 1,
    backgroundColor: colors.gray100,
    borderRadius: borderRadius.medium,
    padding: spacing.md,
    ...typography.body,
    color: colors.textPrimary,
    maxHeight: 100,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: colors.gray300,
    opacity: 0.5,
  },
  loadingContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  reasoningToggle: {
    marginTop: spacing.sm,
    padding: spacing.sm,
    alignItems: 'center',
  },
  reasoningText: {
    ...typography.caption,
    color: colors.textSecondary,
  },
});
```

### 2. Message Bubble Component

**File:** `src/components/chat/MessageBubble.tsx`

**Purpose:** Display individual messages with formatting.

**Implementation:**

```typescript
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, spacing, typography, borderRadius } from '../../constants/theme';
import { Message } from '../../types/chat';
import { RenderHTML } from 'react-native-render-html';

interface MessageBubbleProps {
  message: Message;
  onSpeak?: (text: string) => void;
}

export default function MessageBubble({ message, onSpeak }: MessageBubbleProps) {
  const isUser = message.isUser;

  return (
    <View style={[
      styles.messageContainer,
      isUser ? styles.userMessageContainer : styles.aiMessageContainer
    ]}>
      <View style={[
        styles.messageBubble,
        isUser ? styles.userBubble : styles.aiBubble
      ]}>
        {message.imageUrl && (
          <Image source={{ uri: message.imageUrl }} style={styles.messageImage} />
        )}
        
        {message.formattedText ? (
          <RenderHTML
            contentWidth={300}
            source={{ html: message.formattedText }}
            baseStyle={styles.messageText}
          />
        ) : (
          <Text style={[
            styles.messageText,
            isUser ? styles.userMessageText : styles.aiMessageText
          ]}>
            {message.text}
          </Text>
        )}

        {!isUser && onSpeak && (
          <TouchableOpacity
            style={styles.speakButton}
            onPress={() => onSpeak(message.text)}
          >
            <Text style={styles.speakButtonText}>🔊</Text>
          </TouchableOpacity>
        )}

        <Text style={[
          styles.timestamp,
          isUser ? styles.userTimestamp : styles.aiTimestamp
        ]}>
          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  messageContainer: {
    marginBottom: spacing.md,
  },
  userMessageContainer: {
    alignItems: 'flex-end',
  },
  aiMessageContainer: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    padding: spacing.md,
    borderRadius: borderRadius.xlarge,
  },
  userBubble: {
    backgroundColor: colors.primary,
    borderBottomRightRadius: borderRadius.small,
  },
  aiBubble: {
    backgroundColor: colors.white,
    borderBottomLeftRadius: borderRadius.small,
    ...shadows.sm,
  },
  messageImage: {
    width: 200,
    height: 200,
    borderRadius: borderRadius.medium,
    marginBottom: spacing.sm,
  },
  messageText: {
    ...typography.body,
  },
  userMessageText: {
    color: colors.white,
  },
  aiMessageText: {
    color: colors.textPrimary,
  },
  speakButton: {
    marginTop: spacing.xs,
    padding: spacing.xs,
  },
  speakButtonText: {
    fontSize: 16,
  },
  timestamp: {
    ...typography.caption,
    marginTop: spacing.xs,
  },
  userTimestamp: {
    color: colors.white,
    opacity: 0.7,
  },
  aiTimestamp: {
    color: colors.textSecondary,
  },
});
```

### 3. Voice Recorder Component

**File:** `src/components/chat/VoiceRecorder.tsx`

**Purpose:** Record voice and send for transcription.

**Implementation:**

```typescript
import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Audio } from 'expo-av';
import { colors, spacing, typography, borderRadius } from '../../constants/theme';
import { MicrophoneIcon, StopIcon } from 'react-native-heroicons/outline';

interface VoiceRecorderProps {
  onRecordingComplete: (audioUri: string) => void;
  onTranscriptionComplete: (text: string, aiResponse: string) => void;
  sessionId: string;
  conversationHistory: any[];
  sessionContext: string;
  userId: string;
  mode: string;
  disabled?: boolean;
}

export default function VoiceRecorder({
  onRecordingComplete,
  onTranscriptionComplete,
  sessionId,
  conversationHistory,
  sessionContext,
  userId,
  mode,
  disabled = false
}: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startRecording = async () => {
    try {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      setRecording(recording);
      setIsRecording(true);
      setRecordingTime(0);

      intervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (error) {
      console.error('Error starting recording:', error);
      Alert.alert('Error', 'Unable to access microphone. Please check permissions.');
    }
  };

  const stopRecording = async () => {
    if (!recording) return;

    setIsRecording(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      
      if (uri) {
        onRecordingComplete(uri);
        await processVoiceInput(uri);
      }
    } catch (error) {
      console.error('Error stopping recording:', error);
      Alert.alert('Error', 'Failed to process recording.');
    }

    setRecording(null);
  };

  const processVoiceInput = async (audioUri: string) => {
    setIsProcessing(true);

    try {
      const formData = new FormData();
      formData.append('audio', {
        uri: audioUri,
        type: 'audio/m4a',
        name: 'voice-input.m4a',
      } as any);
      formData.append('sessionId', sessionId);
      formData.append('conversationHistory', JSON.stringify(conversationHistory));
      formData.append('sessionContext', sessionContext);
      formData.append('mode', mode);
      formData.append('userId', userId);

      const response = await fetch('https://www.paataai.com/api/voice', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to process voice input');
      }

      const data = await response.json();
      
      if (data.success) {
        onTranscriptionComplete(data.transcribedText, data.aiResponse);
      } else {
        throw new Error(data.error || 'Voice processing failed');
      }
    } catch (error) {
      console.error('Voice processing error:', error);
      Alert.alert('Error', 'Failed to process voice input. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      {isRecording ? (
        <View style={styles.recordingContainer}>
          <View style={styles.recordingIndicator} />
          <Text style={styles.recordingTime}>{formatTime(recordingTime)}</Text>
          <TouchableOpacity
            style={styles.stopButton}
            onPress={stopRecording}
            disabled={isProcessing}
          >
            <StopIcon size={24} color={colors.white} />
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity
          style={[styles.recordButton, disabled && styles.recordButtonDisabled]}
          onPress={startRecording}
          disabled={disabled || isProcessing}
        >
          <MicrophoneIcon size={24} color={colors.white} />
        </TouchableOpacity>
      )}
      {isProcessing && (
        <Text style={styles.processingText}>Processing...</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  recordButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.red600,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordButtonDisabled: {
    backgroundColor: colors.gray300,
    opacity: 0.5,
  },
  recordingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  recordingIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.red600,
  },
  recordingTime: {
    ...typography.body,
    color: colors.textPrimary,
    minWidth: 50,
  },
  stopButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.red600,
    justifyContent: 'center',
    alignItems: 'center',
  },
  processingText: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
});
```

---

## Navigation Flow

### Navigation Structure

```typescript
// Navigation Stack
ChatStack:
  - ChatScreen (Main)
  - ChatSessionsScreen (Session list)
  - SettingsScreen (Chat settings)
```

---

## State Management

### Redux Slice

**File:** `src/store/slices/chatSlice.ts`

```typescript
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { chatApi } from '../../api/endpoints';

interface ChatState {
  messages: Message[];
  sessions: Record<string, ChatSession>;
  currentSessionId: string | null;
  isLoading: boolean;
  isSending: boolean;
  error: string | null;
}

const initialState: ChatState = {
  messages: [],
  sessions: {},
  currentSessionId: null,
  isLoading: false,
  isSending: false,
  error: null,
};

export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async (messageData: any) => {
    const response = await chatApi.sendMessage(messageData);
    return response;
  }
);

export const loadMessages = createAsyncThunk(
  'chat/loadMessages',
  async (sessionId: string) => {
    const response = await chatApi.getMessages(sessionId);
    return response.messages;
  }
);

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<Message>) => {
      state.messages.push(action.payload);
    },
    clearMessages: (state) => {
      state.messages = [];
    },
    setCurrentSession: (state, action: PayloadAction<string>) => {
      state.currentSessionId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendMessage.pending, (state) => {
        state.isSending = true;
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.isSending = false;
        // Messages are added via addMessage reducer
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.isSending = false;
        state.error = action.error.message || 'Failed to send message';
      });
  },
});

export const { addMessage, clearMessages, setCurrentSession } = chatSlice.actions;
export default chatSlice.reducer;
```

---

## Features & Functionality

### 1. Text Input
- Multi-line text input
- Character limit (2000)
- Auto-resize input area
- Send on Enter (with Shift for new line)

### 2. Voice Input
- Record audio
- Real-time transcription
- Audio playback
- Voice-to-AI response

### 3. Image Input
- Image picker
- Image preview
- OCR processing
- AI image analysis

### 4. PDF Input
- PDF picker
- Text extraction
- PDF analysis
- Multi-page support

### 5. Reasoning Mode
- Toggle reasoning mode
- Enhanced AI responses
- Step-by-step explanations

### 6. Text-to-Speech
- Read AI responses aloud
- Voice selection
- Playback controls

### 7. Session Management
- Multiple chat sessions
- Session titles
- Session history
- Delete sessions

---

## UI/UX Guidelines

### Message Bubbles
- User messages: Right-aligned, primary color
- AI messages: Left-aligned, white background
- Rounded corners with one sharp corner
- Timestamp display
- Read receipts (optional)

### Input Area
- Fixed at bottom
- Keyboard-aware scrolling
- Attachment buttons
- Send button with icon

### Loading States
- Typing indicator for AI
- Skeleton loaders
- Progress indicators

---

## Performance Optimization

1. **Message Rendering**: Use `FlatList` with `getItemLayout`
2. **Image Optimization**: Compress images before upload
3. **PDF Processing**: Show progress for large PDFs
4. **Voice Recording**: Use efficient audio formats
5. **Message Caching**: Cache messages locally

---

## Implementation Checklist

### Phase 1: Core Chat
- [ ] Implement ChatScreen
- [ ] Create MessageBubble component
- [ ] Set up Redux slice
- [ ] Integrate text messaging API

### Phase 2: Input Methods
- [ ] Add voice recording
- [ ] Add image upload
- [ ] Add PDF upload
- [ ] Handle all input types

### Phase 3: Advanced Features
- [ ] Add reasoning mode
- [ ] Add text-to-speech
- [ ] Add session management
- [ ] Add message formatting

### Phase 4: Polish
- [ ] Add loading states
- [ ] Add error handling
- [ ] Optimize performance
- [ ] Add animations

---

**Last Updated**: 2024
**Maintained By**: PAATA.AI Development Team



# 📱 PAATA.AI Mobile App Development Guide

**Complete Guide to Building the PAATA.AI Mobile Application**

This document provides comprehensive instructions for developing a native mobile app that mirrors all functionality of the PAATA.AI website.

---

## 📋 Table of Contents

1. [Project Overview](#1-project-overview)
2. [Architecture & Design Patterns](#2-architecture--design-patterns)
3. [Technology Stack](#3-technology-stack)
4. [Project Setup](#4-project-setup)
5. [Project Structure](#5-project-structure)
6. [Authentication Implementation](#6-authentication-implementation)
7. [Core Features Implementation](#7-core-features-implementation)
   - 7.1 [Chat Feature](#71-chat-feature)
   - 7.2 [AI-Powered Notes Feature](#72-ai-powered-notes-feature)
   - 7.3 [Flashcards Feature](#73-flashcards-feature-with-mastery-tracking)
   - 7.4 [AI-Powered Exam Mode Feature](#74-ai-powered-exam-mode-feature)
   - 7.5 [AI-Powered Mind Maps Feature](#75-ai-powered-mind-maps-feature)
   - 7.6 [Focus Mode (Pomodoro Timer)](#76-focus-mode-pomodoro-timer)
   - 7.7 [Progress Tracking & Achievements](#77-progress-tracking--achievements)
   - 7.8 [Learning Materials Feature](#78-learning-materials-feature)
8. [API Integration](#8-api-integration)
9. [State Management](#9-state-management)
10. [Offline Support & Data Sync](#10-offline-support--data-sync)
11. [UI/UX Guidelines](#11-uiux-guidelines)
12. [Testing Strategy](#12-testing-strategy)
13. [Performance Optimization](#13-performance-optimization)
14. [Deployment](#14-deployment)
15. [Troubleshooting](#15-troubleshooting)
16. [Best Practices](#16-best-practices)
17. [Navigation Implementation](#17-navigation-implementation)
18. [Push Notifications](#18-push-notifications)
19. [Biometric Authentication](#19-biometric-authentication)
20. [File Upload Implementation](#20-file-upload-implementation)
21. [Progress Tracking Implementation](#21-progress-tracking-implementation)
22. [Achievements Implementation](#22-achievements-implementation)
23. [Settings Implementation](#23-settings-implementation)
24. [Learning Materials Implementation](#24-learning-materials-implementation)
25. [Error Boundaries & Crash Handling](#25-error-boundaries--crash-handling)
26. [Analytics Implementation](#26-analytics-implementation)
27. [Performance Monitoring](#27-performance-monitoring)
28. [Security Best Practices](#28-security-best-practices)
29. [Accessibility](#29-accessibility)
30. [Internationalization (i18n)](#30-internationalization-i18n)

---

## 1. Project Overview

### 1.1 Application Purpose

PAATA.AI Mobile App is a native mobile application that provides complete feature parity with the website:

#### Core AI Features
- **AI-Powered Chat** - Interactive chat with AI for instant homework help
- **Multi-Modal Input** - Text, voice, and image support with OCR
- **PDF Processing** - Upload and extract content from PDF documents
- **Voice Input** - Speech-to-text with AI-powered responses

#### Smart Learning Tools
- **AI-Generated Notes** - Generate comprehensive notes from topics or conversation history (structured, outline, summary formats)
- **AI-Generated Mind Maps** - Create hierarchical mind maps from topics with branches and sub-branches
- **AI-Generated Exams** - Generate custom exams with multiple question types (MCQ, 2-marker, 5-marker, 10-marker)
- **Exam Paper Solver** - Upload exam papers (PDF/image) and get AI-powered solutions
- **Flashcards** - Create, review, and track mastery with spaced repetition
- **Focus Mode** - Pomodoro timer for focused study sessions

#### Learning Materials
- **Structured Content** - Access organized content by board, class, subject, and chapter
- **PDFs & Videos** - View educational PDFs and watch video lessons
- **Chapter-Based Learning** - Integrated AI chat for each chapter

#### Progress & Analytics
- **Progress Dashboard** - Track learning activity, time spent, streaks
- **Usage Analytics** - Weekly activity charts, subject breakdown, smart learning stats
- **Achievements System** - Unlock achievements and earn badges
- **Performance Insights** - AI-powered insights into learning patterns

#### Additional Features
- **Offline Support** - Work offline and sync when online
- **Data Sync** - Seamless sync between mobile and web
- **Profile Management** - Update profile, preferences, class/board selection
- **Subscriptions** - Manage plans, billing, and invoices
- **Push Notifications** - Get notified about achievements, streaks, and updates
- **Biometric Authentication** - Secure login with fingerprint/face ID

### 1.2 Target Platforms

- **iOS** - iPhone and iPad (iOS 14.0+)
- **Android** - Phones and tablets (Android 8.0+ / API 26+)

### 1.3 Key Requirements

1. **Feature Parity** - All website features must be available
2. **Offline Support** - Core features work without internet
3. **Data Sync** - Seamless sync between mobile and web
4. **Performance** - Fast, responsive, smooth animations
5. **Security** - Secure authentication and data storage
6. **Accessibility** - Support for screen readers and accessibility features

---

## 2. Architecture & Design Patterns

### 2.1 Recommended Architecture

**React Native with TypeScript** (Recommended)

```
┌─────────────────────────────────────────┐
│         Presentation Layer              │
│  (Screens, Components, Navigation)      │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│         Business Logic Layer            │
│  (Services, Hooks, State Management)    │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│         Data Layer                      │
│  (API Client, Local Database, Cache)    │
└─────────────────────────────────────────┘
```

### 2.2 Design Patterns

1. **MVVM (Model-View-ViewModel)**
   - Separate business logic from UI
   - ViewModels handle state and API calls
   - Views are purely presentational

2. **Repository Pattern**
   - Abstract data sources (API, local DB)
   - Single source of truth
   - Easy to mock for testing

3. **Observer Pattern**
   - State management (Redux/Context)
   - Event-driven updates
   - Reactive UI updates

4. **Singleton Pattern**
   - API client instance
   - Authentication service
   - Configuration manager

### 2.3 State Management Options

**Option 1: Redux Toolkit (Recommended for Complex Apps)**
- Predictable state management
- Time-travel debugging
- Middleware support (thunk, saga)
- DevTools integration

**Option 2: Zustand (Lightweight)**
- Simple API
- Less boilerplate
- Good for smaller apps
- Easy to learn

**Option 3: React Context + Hooks**
- Built-in React solution
- No external dependencies
- Good for simple state
- Can become complex with many contexts

**Recommendation:** Use **Redux Toolkit** for production app with complex state.

---

## 3. Technology Stack

### 3.1 Core Framework

**React Native 0.72+** with **TypeScript 5.0+**

```bash
npx react-native init PaataAIMobile --template react-native-template-typescript
```

### 3.2 Essential Libraries

#### Navigation
```json
{
  "@react-navigation/native": "^6.1.0",
  "@react-navigation/stack": "^6.3.0",
  "@react-navigation/bottom-tabs": "^6.5.0",
  "@react-navigation/drawer": "^6.6.0",
  "react-native-screens": "^3.27.0",
  "react-native-safe-area-context": "^4.7.0",
  "react-native-gesture-handler": "^2.13.0"
}
```

#### State Management
```json
{
  "@reduxjs/toolkit": "^1.9.0",
  "react-redux": "^8.1.0",
  "redux-persist": "^6.0.0"
}
```

#### API & Networking
```json
{
  "axios": "^1.6.0",
  "@react-native-community/netinfo": "^11.0.0",
  "react-query": "^3.39.0"
}
```

#### Local Database
```json
{
  "@react-native-async-storage/async-storage": "^1.19.0",
  "react-native-sqlite-storage": "^6.0.1",
  "watermelondb": "^0.27.0"
}
```

#### UI Components
```json
{
  "react-native-paper": "^5.11.0",
  "react-native-vector-icons": "^10.0.0",
  "react-native-reanimated": "^3.5.0",
  "react-native-animatable": "^1.4.0"
}
```

#### Authentication & Security
```json
{
  "@react-native-keychain/react-native-keychain": "^8.1.0",
  "react-native-biometrics": "^3.0.0",
  "jwt-decode": "^3.1.2"
}
```

#### Media & Files
```json
{
  "react-native-image-picker": "^7.0.0",
  "react-native-document-picker": "^9.1.0",
  "react-native-audio-recorder-player": "^3.6.0",
  "react-native-fs": "^2.20.0"
}
```

#### Utilities
```json
{
  "date-fns": "^2.30.0",
  "lodash": "^4.17.21",
  "react-hook-form": "^7.48.0",
  "zod": "^3.22.0"
}
```

#### Development Tools
```json
{
  "@types/react": "^18.2.0",
  "@types/react-native": "^0.72.0",
  "eslint": "^8.50.0",
  "prettier": "^3.0.0",
  "react-native-debugger": "^0.13.0"
}
```

### 3.3 Platform-Specific Requirements

#### iOS
- Xcode 14.0+
- CocoaPods
- iOS Deployment Target: 14.0

#### Android
- Android Studio
- JDK 17+
- Android SDK 26+ (Android 8.0)
- Gradle 7.5+

---

## 4. Project Setup

### 4.1 Initial Setup

```bash
# Create React Native project
npx react-native init PaataAIMobile --template react-native-template-typescript

# Navigate to project
cd PaataAIMobile

# Install dependencies
npm install

# iOS setup (macOS only)
cd ios && pod install && cd ..
```

### 4.2 Project Configuration

#### 4.2.1 TypeScript Configuration

`tsconfig.json`:
```json
{
  "compilerOptions": {
    "target": "esnext",
    "module": "commonjs",
    "lib": ["es2017"],
    "allowJs": true,
    "jsx": "react-native",
    "noEmit": true,
    "isolatedModules": true,
    "strict": true,
    "moduleResolution": "node",
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "resolveJsonModule": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@components/*": ["src/components/*"],
      "@screens/*": ["src/screens/*"],
      "@services/*": ["src/services/*"],
      "@utils/*": ["src/utils/*"],
      "@types/*": ["src/types/*"],
      "@store/*": ["src/store/*"]
    }
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "babel.config.js", "metro.config.js"]
}
```

#### 4.2.2 Environment Variables

Create `.env` file:
```env
# API Configuration
API_BASE_URL=https://www.paataai.com/api
API_TIMEOUT=30000

# App Configuration
APP_NAME=PAATA.AI
APP_VERSION=1.0.0

# Feature Flags
ENABLE_OFFLINE_MODE=true
ENABLE_PUSH_NOTIFICATIONS=true
ENABLE_BIOMETRIC_AUTH=true

# Analytics (Optional)
ANALYTICS_ENABLED=true
```

Install `react-native-config`:
```bash
npm install react-native-config
```

#### 4.2.3 Metro Bundler Configuration

`metro.config.js`:
```javascript
const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

const defaultConfig = getDefaultConfig(__dirname);
const {assetExts, sourceExts} = defaultConfig.resolver;

const config = {
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
  resolver: {
    assetExts: assetExts.filter(ext => ext !== 'svg'),
    sourceExts: [...sourceExts, 'svg'],
  },
};

module.exports = mergeConfig(defaultConfig, config);
```

### 4.3 Folder Structure

```
PaataAIMobile/
├── android/                 # Android native code
├── ios/                     # iOS native code
├── src/
│   ├── assets/             # Images, fonts, etc.
│   │   ├── images/
│   │   ├── fonts/
│   │   └── icons/
│   ├── components/         # Reusable components
│   │   ├── common/
│   │   ├── forms/
│   │   └── layout/
│   ├── screens/            # Screen components
│   │   ├── auth/
│   │   ├── chat/
│   │   ├── notes/
│   │   ├── flashcards/
│   │   ├── exam/
│   │   ├── focus/
│   │   ├── mindmaps/
│   │   ├── profile/
│   │   └── settings/
│   ├── navigation/         # Navigation configuration
│   │   ├── AppNavigator.tsx
│   │   ├── AuthNavigator.tsx
│   │   └── MainNavigator.tsx
│   ├── services/           # API and business logic
│   │   ├── api/
│   │   ├── auth/
│   │   ├── sync/
│   │   └── storage/
│   ├── store/              # Redux store
│   │   ├── slices/
│   │   ├── middleware/
│   │   └── store.ts
│   ├── hooks/              # Custom React hooks
│   ├── utils/              # Utility functions
│   ├── types/              # TypeScript types
│   └── constants/          # App constants
├── __tests__/              # Test files
├── .env                    # Environment variables
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

---

## 5. Project Structure

### 5.1 Core Directories

#### `src/services/api/`

API client and endpoint definitions:

```typescript
// src/services/api/client.ts
import axios, { AxiosInstance, AxiosError } from 'axios';
import Config from 'react-native-config';
import { getStoredToken, clearStoredToken } from '../storage/authStorage';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: Config.API_BASE_URL || 'https://www.paataai.com/api',
      timeout: Config.API_TIMEOUT ? parseInt(Config.API_TIMEOUT) : 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor - Add auth token
    this.client.interceptors.request.use(
      async (config) => {
        const token = await getStoredToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor - Handle errors
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        if (error.response?.status === 401) {
          // Token expired, clear and redirect to login
          await clearStoredToken();
          // Navigate to login (use navigation service)
        }
        return Promise.reject(error);
      }
    );
  }

  get instance() {
    return this.client;
  }
}

export default new ApiClient().instance;
```

#### `src/services/api/endpoints.ts`

```typescript
// src/services/api/endpoints.ts
import apiClient from './client';

export const authApi = {
  login: (email: string, password: string, deviceInfo?: string) =>
    apiClient.post('/mobile/auth/login', { email, password, deviceInfo }),
  
  signup: (data: SignupData) =>
    apiClient.post('/mobile/auth/signup', data),
  
  verify: (token: string) =>
    apiClient.post('/mobile/auth/verify', { token }),
  
  logout: () =>
    apiClient.post('/auth/logout'),
  
  refresh: (refreshToken: string) =>
    apiClient.post('/auth/refresh', { refreshToken }),
};

export const chatApi = {
  sendMessage: (data: ChatMessageData) =>
    apiClient.post('/mobile/chat', data),
  
  getSessions: () =>
    apiClient.get('/chat/sessions'),
  
  createSession: (title: string) =>
    apiClient.post('/chat/sessions', { title }),
  
  getMessages: (sessionId: string) =>
    apiClient.get(`/chat/sessions/${sessionId}/messages`),
};

export const notesApi = {
  getAll: (userId: string, category?: string, lastSync?: string) =>
    apiClient.get('/notes', { params: { userId, category, lastSync } }),
  
  create: (data: CreateNoteData) =>
    apiClient.post('/notes', data),
  
  update: (id: string, data: UpdateNoteData) =>
    apiClient.put('/notes', { id, ...data }),
  
  delete: (id: string) =>
    apiClient.delete('/notes', { params: { id } }),
};

// ... More API endpoints
```

---

## 6. Authentication Implementation

### 6.1 Authentication Flow

```
┌─────────────┐
│   Splash    │
└──────┬──────┘
       │
       ▼
┌─────────────┐      No Token      ┌─────────────┐
│ Check Token │ ──────────────────▶│   Login     │
└──────┬──────┘                     └──────┬──────┘
       │                                    │
   Valid Token                          Login Success
       │                                    │
       ▼                                    ▼
┌─────────────┐                     ┌─────────────┐
│  Main App   │◀────────────────────│ Store Token │
└─────────────┘                     └─────────────┘
```

### 6.2 Authentication Service

```typescript
// src/services/auth/authService.ts
import { authApi } from '../api/endpoints';
import * as Keychain from 'react-native-keychain';
import { jwtDecode } from 'jwt-decode';

interface TokenPayload {
  userId: string;
  email: string;
  plan: string;
  exp: number;
}

class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly REFRESH_TOKEN_KEY = 'refresh_token';

  async login(email: string, password: string): Promise<AuthResult> {
    try {
      const deviceInfo = `${Platform.OS} ${Platform.Version}`;
      const response = await authApi.login(email, password, deviceInfo);
      
      const { token, user } = response.data;
      
      // Store tokens securely
      await this.storeTokens(token, response.data.refreshToken);
      
      return {
        success: true,
        user,
        token,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Login failed',
      };
    }
  }

  async signup(data: SignupData): Promise<AuthResult> {
    try {
      const deviceInfo = `${Platform.OS} ${Platform.Version}`;
      const response = await authApi.signup({ ...data, deviceInfo });
      
      const { token, user } = response.data;
      await this.storeTokens(token, response.data.refreshToken);
      
      return {
        success: true,
        user,
        token,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Signup failed',
      };
    }
  }

  async logout(): Promise<void> {
    try {
      await authApi.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      await this.clearTokens();
    }
  }

  async getStoredToken(): Promise<string | null> {
    try {
      const credentials = await Keychain.getGenericPassword();
      if (credentials) {
        return credentials.password; // Token stored as password
      }
      return null;
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  }

  async isTokenValid(): Promise<boolean> {
    const token = await this.getStoredToken();
    if (!token) return false;

    try {
      const decoded = jwtDecode<TokenPayload>(token);
      const currentTime = Date.now() / 1000;
      
      // Check if token is expired (with 5 minute buffer)
      return decoded.exp > currentTime + 300;
    } catch (error) {
      return false;
    }
  }

  async refreshTokenIfNeeded(): Promise<string | null> {
    if (await this.isTokenValid()) {
      return await this.getStoredToken();
    }

    try {
      const refreshToken = await this.getRefreshToken();
      if (!refreshToken) return null;

      const response = await authApi.refresh(refreshToken);
      const { token } = response.data;
      
      await this.storeTokens(token, response.data.refreshToken);
      return token;
    } catch (error) {
      await this.clearTokens();
      return null;
    }
  }

  private async storeTokens(token: string, refreshToken?: string): Promise<void> {
    await Keychain.setGenericPassword(this.TOKEN_KEY, token);
    if (refreshToken) {
      await Keychain.setGenericPassword(this.REFRESH_TOKEN_KEY, refreshToken, {
        service: 'refresh_token',
      });
    }
  }

  private async getRefreshToken(): Promise<string | null> {
    try {
      const credentials = await Keychain.getGenericPassword({
        service: 'refresh_token',
      });
      return credentials ? credentials.password : null;
    } catch (error) {
      return null;
    }
  }

  private async clearTokens(): Promise<void> {
    await Keychain.resetGenericPassword();
    await Keychain.resetGenericPassword({ service: 'refresh_token' });
  }
}

export default new AuthService();
```

### 6.3 Authentication Redux Slice

```typescript
// src/store/slices/authSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import authService from '../../services/auth/authService';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }: { email: string; password: string }) => {
    const result = await authService.login(email, password);
    if (!result.success) {
      throw new Error(result.error);
    }
    return result;
  }
);

export const signup = createAsyncThunk(
  'auth/signup',
  async (data: SignupData) => {
    const result = await authService.signup(data);
    if (!result.success) {
      throw new Error(result.error);
    }
    return result;
  }
);

export const checkAuth = createAsyncThunk('auth/check', async () => {
  const token = await authService.getStoredToken();
  if (!token || !(await authService.isTokenValid())) {
    return null;
  }
  // Verify token with backend
  const result = await authService.verifyToken(token);
  return result;
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      authService.logout();
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Login failed';
      })
      // Similar for signup and checkAuth
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
```

### 6.4 Login Screen Implementation

```typescript
// src/screens/auth/LoginScreen.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../store/slices/authSlice';
import { RootState } from '../../store/store';

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const { isLoading, error } = useSelector((state: RootState) => state.auth);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      await dispatch(login({ email, password })).unwrap();
      // Navigation handled by AppNavigator based on auth state
    } catch (err: any) {
      Alert.alert('Login Failed', err.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>PAATA.AI</Text>
      <Text style={styles.subtitle}>Login to continue</Text>

      {error && <Text style={styles.error}>{error}</Text>}

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity
        style={[styles.button, isLoading && styles.buttonDisabled]}
        onPress={handleLogin}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>
          {isLoading ? 'Logging in...' : 'Login'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
        <Text style={styles.link}>Don't have an account? Sign up</Text>
      </TouchableOpacity>
    </View>
  );
}
```

---

## 7. Core Features Implementation

### 7.1 Chat Feature

#### 7.1.1 Chat Screen

```typescript
// src/screens/chat/ChatScreen.tsx
import React, { useState, useRef, useEffect } from 'react';
import { View, FlatList, TextInput, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { sendMessage, loadMessages } from '../../store/slices/chatSlice';
import MessageBubble from '../../components/chat/MessageBubble';
import VoiceRecorder from '../../components/chat/VoiceRecorder';
import ImagePicker from '../../components/chat/ImagePicker';

export default function ChatScreen({ route }: any) {
  const { sessionId } = route.params || {};
  const [inputText, setInputText] = useState('');
  const [inputType, setInputType] = useState<'text' | 'voice' | 'image'>('text');
  const dispatch = useDispatch();
  const { messages, isLoading } = useSelector((state: RootState) => state.chat);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    if (sessionId) {
      dispatch(loadMessages(sessionId));
    }
  }, [sessionId]);

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const messageData = {
      message: inputText,
      sessionId: sessionId || 'default',
      inputType: 'text',
      conversationHistory: messages.slice(-10), // Last 10 messages for context
    };

    await dispatch(sendMessage(messageData));
    setInputText('');
  };

  const handleVoiceSend = async (audioUri: string) => {
    // Handle voice message
    const formData = new FormData();
    formData.append('audio', {
      uri: audioUri,
      type: 'audio/m4a',
      name: 'audio.m4a',
    } as any);
    formData.append('sessionId', sessionId || 'default');
    
    // Call voice API
  };

  const handleImageSend = async (imageUri: string) => {
    // Handle image message
    const formData = new FormData();
    formData.append('image', {
      uri: imageUri,
      type: 'image/jpeg',
      name: 'image.jpg',
    } as any);
    formData.append('sessionId', sessionId || 'default');
    
    // Call OCR API
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <MessageBubble message={item} />}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
      />

      <View style={styles.inputContainer}>
        {inputType === 'text' && (
          <>
            <TextInput
              style={styles.input}
              value={inputText}
              onChangeText={setInputText}
              placeholder="Type your message..."
              multiline
            />
            <TouchableOpacity onPress={handleSend}>
              <Text>Send</Text>
            </TouchableOpacity>
          </>
        )}

        {inputType === 'voice' && (
          <VoiceRecorder onRecordComplete={handleVoiceSend} />
        )}

        {inputType === 'image' && (
          <ImagePicker onImageSelected={handleImageSend} />
        )}

        <View style={styles.inputTypeSelector}>
          <TouchableOpacity onPress={() => setInputType('text')}>
            <Text>Text</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setInputType('voice')}>
            <Text>Voice</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setInputType('image')}>
            <Text>Image</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
```

#### 7.1.2 Chat Redux Slice

```typescript
// src/store/slices/chatSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { chatApi } from '../../services/api/endpoints';

interface ChatState {
  messages: Message[];
  sessions: ChatSession[];
  currentSessionId: string | null;
  isLoading: boolean;
  error: string | null;
}

export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async (data: ChatMessageData) => {
    const response = await chatApi.sendMessage(data);
    return response.data;
  }
);

export const loadMessages = createAsyncThunk(
  'chat/loadMessages',
  async (sessionId: string) => {
    const response = await chatApi.getMessages(sessionId);
    return response.data.messages;
  }
);

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    messages: [],
    sessions: [],
    currentSessionId: null,
    isLoading: false,
    error: null,
  } as ChatState,
  reducers: {
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    clearMessages: (state) => {
      state.messages = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.messages.push(action.payload.response);
      })
      .addCase(loadMessages.fulfilled, (state, action) => {
        state.messages = action.payload;
      });
  },
});

export const { addMessage, clearMessages } = chatSlice.actions;
export default chatSlice.reducer;
```

### 7.2 AI-Powered Notes Feature

#### 7.2.1 Notes List Screen with AI Generation

```typescript
// src/screens/notes/NotesListScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, FlatList, TouchableOpacity, Text, Modal, TextInput, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchNotes, createNote, generateNotes } from '../../store/slices/notesSlice';
import NoteCard from '../../components/notes/NoteCard';

export default function NotesListScreen({ navigation }: any) {
  const dispatch = useDispatch();
  const { notes, isLoading, isGenerating } = useSelector((state: RootState) => state.notes);
  const { user } = useSelector((state: RootState) => state.auth);
  const [category, setCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [generateTopic, setGenerateTopic] = useState('');
  const [generateFormat, setGenerateFormat] = useState<'structured' | 'outline' | 'summary'>('structured');

  useEffect(() => {
    if (user) {
      dispatch(fetchNotes({ userId: user.id, category: category !== 'all' ? category : undefined }));
    }
  }, [user, category]);

  const handleGenerateNotes = async () => {
    if (!generateTopic.trim()) {
      Alert.alert('Error', 'Please enter a topic');
      return;
    }

    try {
      const result = await dispatch(generateNotes({
        topic: generateTopic.trim(),
        format: generateFormat,
        autoSave: true,
        category: 'AI Generated',
        tags: ['AI Generated']
      })).unwrap();

      if (result.autoSaved) {
        Alert.alert('Success', 'Notes generated and saved!');
        setShowGenerateModal(false);
        setGenerateTopic('');
        dispatch(fetchNotes({ userId: user!.id }));
      } else {
        // Navigate to editor with generated content
        navigation.navigate('NoteEditor', {
          mode: 'create',
          initialContent: result.note
        });
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to generate notes');
    }
  };

  const handleGenerateFromChat = async (conversationHistory: any[]) => {
    try {
      const result = await dispatch(generateNotes({
        conversationHistory,
        format: generateFormat,
        autoSave: true,
        category: 'AI Generated',
        tags: ['AI Generated', 'From Chat']
      })).unwrap();

      Alert.alert('Success', 'Notes generated from conversation!');
      dispatch(fetchNotes({ userId: user!.id }));
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to generate notes');
    }
  };

  const filteredNotes = notes.filter(note => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return note.title.toLowerCase().includes(query) ||
             note.content.toLowerCase().includes(query) ||
             note.category?.toLowerCase().includes(query);
    }
    return true;
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Notes</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.generateButton}
            onPress={() => setShowGenerateModal(true)}
          >
            <Text style={styles.generateButtonText}>✨ Generate with AI</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.createButton}
            onPress={() => navigation.navigate('NoteEditor', { mode: 'create' })}
          >
            <Text style={styles.createButtonText}>+ New Note</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar */}
      <TextInput
        style={styles.searchInput}
        placeholder="Search notes..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      {/* Category Filter */}
      <View style={styles.categoryFilter}>
        <TouchableOpacity
          style={[styles.categoryButton, category === 'all' && styles.categoryButtonActive]}
          onPress={() => setCategory('all')}
        >
          <Text>All</Text>
        </TouchableOpacity>
        {/* Add category buttons dynamically */}
      </View>

      <FlatList
        data={filteredNotes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <NoteCard
            note={item}
            onPress={() => navigation.navigate('NoteEditor', { noteId: item.id })}
          />
        )}
        refreshing={isLoading}
        onRefresh={() => dispatch(fetchNotes({ userId: user!.id, category: category !== 'all' ? category : undefined }))}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No notes yet</Text>
            <TouchableOpacity onPress={() => setShowGenerateModal(true)}>
              <Text style={styles.emptyActionText}>Generate with AI</Text>
            </TouchableOpacity>
          </View>
        }
      />

      {/* Generate Notes Modal */}
      <Modal
        visible={showGenerateModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowGenerateModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Generate Notes with AI</Text>
            
            <TextInput
              style={styles.modalInput}
              placeholder="Enter topic (e.g., Laws of Motion)"
              value={generateTopic}
              onChangeText={setGenerateTopic}
              multiline
            />

            <Text style={styles.formatLabel}>Format:</Text>
            <View style={styles.formatButtons}>
              <TouchableOpacity
                style={[styles.formatButton, generateFormat === 'structured' && styles.formatButtonActive]}
                onPress={() => setGenerateFormat('structured')}
              >
                <Text>Structured</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.formatButton, generateFormat === 'outline' && styles.formatButtonActive]}
                onPress={() => setGenerateFormat('outline')}
              >
                <Text>Outline</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.formatButton, generateFormat === 'summary' && styles.formatButtonActive]}
                onPress={() => setGenerateFormat('summary')}
              >
                <Text>Summary</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => setShowGenerateModal(false)}
              >
                <Text>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalGenerateButton, isGenerating && styles.modalGenerateButtonDisabled]}
                onPress={handleGenerateNotes}
                disabled={isGenerating || !generateTopic.trim()}
              >
                <Text style={styles.modalGenerateButtonText}>
                  {isGenerating ? 'Generating...' : 'Generate'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
```

#### 7.2.2 Notes Redux Slice with AI Generation

```typescript
// src/store/slices/notesSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { notesApi } from '../../services/api/endpoints';
import { syncService } from '../../services/sync/syncService';

export const fetchNotes = createAsyncThunk(
  'notes/fetchNotes',
  async ({ userId, category, lastSync }: FetchNotesParams) => {
    const response = await notesApi.getAll(userId, category, lastSync);
    return response.data.notes;
  }
);

export const createNote = createAsyncThunk(
  'notes/createNote',
  async (data: CreateNoteData, { dispatch }) => {
    const localNote = { ...data, id: `local_${Date.now()}`, syncStatus: 'pending' };
    
    try {
      const response = await notesApi.create(data);
      return { ...response.data.note, syncStatus: 'synced' };
    } catch (error) {
      await syncService.queueForSync('notes', localNote);
      return localNote;
    }
  }
);

export const generateNotes = createAsyncThunk(
  'notes/generateNotes',
  async (params: {
    topic?: string;
    conversationHistory?: any[];
    format?: 'structured' | 'outline' | 'summary';
    autoSave?: boolean;
    category?: string;
    tags?: string[];
  }) => {
    const response = await notesApi.generate(params);
    return response.data;
  }
);

export const updateNote = createAsyncThunk(
  'notes/updateNote',
  async ({ id, ...data }: UpdateNoteData) => {
    const response = await notesApi.update(id, data);
    return response.data.note;
  }
);

export const deleteNote = createAsyncThunk(
  'notes/deleteNote',
  async (id: string) => {
    await notesApi.delete(id);
    return id;
  }
);

const notesSlice = createSlice({
  name: 'notes',
  initialState: {
    notes: [],
    isLoading: false,
    isGenerating: false,
    error: null,
  },
  reducers: {
    updateLocalNote: (state, action) => {
      const index = state.notes.findIndex(n => n.id === action.payload.id);
      if (index !== -1) {
        state.notes[index] = { ...state.notes[index], ...action.payload, syncStatus: 'pending' };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotes.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchNotes.fulfilled, (state, action) => {
        state.isLoading = false;
        state.notes = action.payload;
      })
      .addCase(createNote.fulfilled, (state, action) => {
        state.notes.push(action.payload);
      })
      .addCase(generateNotes.pending, (state) => {
        state.isGenerating = true;
      })
      .addCase(generateNotes.fulfilled, (state, action) => {
        state.isGenerating = false;
        if (action.payload.autoSaved && action.payload.savedNote) {
          state.notes.push(action.payload.savedNote);
        }
      })
      .addCase(generateNotes.rejected, (state) => {
        state.isGenerating = false;
      })
      .addCase(updateNote.fulfilled, (state, action) => {
        const index = state.notes.findIndex(n => n.id === action.payload.id);
        if (index !== -1) {
          state.notes[index] = action.payload;
        }
      })
      .addCase(deleteNote.fulfilled, (state, action) => {
        state.notes = state.notes.filter(n => n.id !== action.payload);
      });
  },
});

export const { updateLocalNote } = notesSlice.actions;
export default notesSlice.reducer;
```

#### 7.2.3 Notes API Endpoints

```typescript
// src/services/api/endpoints.ts
export const notesApi = {
  getAll: (userId: string, category?: string, lastSync?: string) =>
    apiClient.get('/notes', { params: { userId, category, lastSync } }),
  
  create: (data: CreateNoteData) =>
    apiClient.post('/notes', data),
  
  update: (id: string, data: UpdateNoteData) =>
    apiClient.put('/notes', { id, ...data }),
  
  delete: (id: string) =>
    apiClient.delete('/notes', { params: { id } }),
  
  generate: (params: {
    topic?: string;
    conversationHistory?: any[];
    format?: string;
    autoSave?: boolean;
    category?: string;
    tags?: string[];
  }) =>
    apiClient.post('/notes/generate', params),
};
```

### 7.3 Flashcards Feature with Mastery Tracking

```typescript
// src/screens/flashcards/FlashcardsScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFlashcards, createFlashcard, updateFlashcardMastery } from '../../store/slices/flashcardsSlice';

export default function FlashcardsScreen() {
  const dispatch = useDispatch();
  const { flashcards, isLoading } = useSelector((state: RootState) => state.flashcards);
  const { user } = useSelector((state: RootState) => state.auth);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [reviewMode, setReviewMode] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [newFlashcard, setNewFlashcard] = useState({
    question: '',
    answer: '',
    category: '',
    difficulty: 'medium' as 'easy' | 'medium' | 'hard'
  });

  useEffect(() => {
    if (user) {
      dispatch(fetchFlashcards({ userId: user.id, reviewOnly: reviewMode }));
    }
  }, [user, reviewMode]);

  const handleNext = async (masteryLevel: number) => {
    const currentCard = flashcards[currentIndex];
    if (!currentCard) return;

    await dispatch(updateFlashcardMastery({
      id: currentCard.id,
      masteryLevel,
      lastReviewed: new Date().toISOString()
    }));

    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowAnswer(false);
    } else {
      setReviewMode(false);
      setCurrentIndex(0);
      setShowAnswer(false);
      Alert.alert('Complete!', 'You\'ve finished reviewing all flashcards');
    }
  };

  const handleCreateFlashcard = async () => {
    if (!newFlashcard.question || !newFlashcard.answer) {
      Alert.alert('Error', 'Please fill in both question and answer');
      return;
    }

    try {
      await dispatch(createFlashcard({
        ...newFlashcard,
        userId: user!.id
      })).unwrap();
      
      setShowCreate(false);
      setNewFlashcard({ question: '', answer: '', category: '', difficulty: 'medium' });
      Alert.alert('Success', 'Flashcard created!');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to create flashcard');
    }
  };

  const currentCard = flashcards[currentIndex];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Flashcards</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={[styles.reviewButton, reviewMode && styles.reviewButtonActive]}
            onPress={() => setReviewMode(!reviewMode)}
          >
            <Text>{reviewMode ? 'Exit Review' : 'Start Review'}</Text>
          </TouchableOpacity>
          {!reviewMode && (
            <TouchableOpacity
              style={styles.createButton}
              onPress={() => setShowCreate(true)}
            >
              <Text>+ Create</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {currentCard ? (
        <View style={styles.cardContainer}>
          <Text style={styles.cardCounter}>
            Card {currentIndex + 1} of {flashcards.length}
          </Text>

          {!showAnswer ? (
            <View style={styles.questionContainer}>
              <Text style={styles.cardLabel}>Question</Text>
              <Text style={styles.cardContent}>{currentCard.question}</Text>
              {currentCard.category && (
                <Text style={styles.categoryTag}>{currentCard.category}</Text>
              )}
              <TouchableOpacity
                style={styles.showAnswerButton}
                onPress={() => setShowAnswer(true)}
              >
                <Text style={styles.showAnswerButtonText}>Show Answer</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.answerContainer}>
              <Text style={styles.cardLabel}>Answer</Text>
              <Text style={styles.cardContent}>{currentCard.answer}</Text>
              
              <Text style={styles.masteryLabel}>How well did you know this?</Text>
              <View style={styles.masteryButtons}>
                <TouchableOpacity
                  style={[styles.masteryButton, styles.masteryButtonRed]}
                  onPress={() => handleNext(25)}
                >
                  <Text>Need Review</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.masteryButton, styles.masteryButtonYellow]}
                  onPress={() => handleNext(50)}
                >
                  <Text>Getting There</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.masteryButton, styles.masteryButtonBlue]}
                  onPress={() => handleNext(75)}
                >
                  <Text>Good</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.masteryButton, styles.masteryButtonGreen]}
                  onPress={() => handleNext(100)}
                >
                  <Text>Mastered</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No flashcards yet</Text>
          <TouchableOpacity onPress={() => setShowCreate(true)}>
            <Text style={styles.emptyActionText}>Create your first flashcard</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Create Flashcard Modal */}
      <Modal
        visible={showCreate}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowCreate(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Create Flashcard</Text>
            
            <TextInput
              style={styles.modalInput}
              placeholder="Question"
              value={newFlashcard.question}
              onChangeText={(text) => setNewFlashcard({ ...newFlashcard, question: text })}
              multiline
            />
            
            <TextInput
              style={styles.modalInput}
              placeholder="Answer"
              value={newFlashcard.answer}
              onChangeText={(text) => setNewFlashcard({ ...newFlashcard, answer: text })}
              multiline
            />
            
            <TextInput
              style={styles.modalInput}
              placeholder="Category (optional)"
              value={newFlashcard.category}
              onChangeText={(text) => setNewFlashcard({ ...newFlashcard, category: text })}
            />

            <View style={styles.difficultyButtons}>
              <TouchableOpacity
                style={[styles.difficultyButton, newFlashcard.difficulty === 'easy' && styles.difficultyButtonActive]}
                onPress={() => setNewFlashcard({ ...newFlashcard, difficulty: 'easy' })}
              >
                <Text>Easy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.difficultyButton, newFlashcard.difficulty === 'medium' && styles.difficultyButtonActive]}
                onPress={() => setNewFlashcard({ ...newFlashcard, difficulty: 'medium' })}
              >
                <Text>Medium</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.difficultyButton, newFlashcard.difficulty === 'hard' && styles.difficultyButtonActive]}
                onPress={() => setNewFlashcard({ ...newFlashcard, difficulty: 'hard' })}
              >
                <Text>Hard</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => setShowCreate(false)}
              >
                <Text>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalCreateButton}
                onPress={handleCreateFlashcard}
              >
                <Text style={styles.modalCreateButtonText}>Create</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
```

### 7.4 AI-Powered Exam Mode Feature

#### 7.4.1 Exam Generation Screen

```typescript
// src/screens/exam/ExamGenerationScreen.tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Modal, Alert, ScrollView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { generateExam } from '../../store/slices/examSlice';

export default function ExamGenerationScreen({ navigation }: any) {
  const dispatch = useDispatch();
  const { isGenerating } = useSelector((state: RootState) => state.exam);
  const [examConfig, setExamConfig] = useState({
    subject: '',
    topic: '',
    difficulty: 'medium' as 'easy' | 'medium' | 'hard',
    questionTypes: {
      mcq: { enabled: true, count: 5, marks: 1 },
      twoMarker: { enabled: true, count: 3, marks: 2 },
      fiveMarker: { enabled: false, count: 0, marks: 5 },
      tenMarker: { enabled: false, count: 0, marks: 10 }
    }
  });

  const handleGenerateExam = async () => {
    if (!examConfig.subject.trim() || !examConfig.topic.trim()) {
      Alert.alert('Error', 'Please fill in subject and topic');
      return;
    }

    const totalQuestions = Object.values(examConfig.questionTypes)
      .filter(qt => qt.enabled)
      .reduce((sum, qt) => sum + qt.count, 0);

    if (totalQuestions === 0) {
      Alert.alert('Error', 'Please select at least one question type');
      return;
    }

    try {
      const questionTypesConfig: any = {};
      if (examConfig.questionTypes.mcq.enabled && examConfig.questionTypes.mcq.count > 0) {
        questionTypesConfig.mcq = {
          count: examConfig.questionTypes.mcq.count,
          marks: examConfig.questionTypes.mcq.marks
        };
      }
      if (examConfig.questionTypes.twoMarker.enabled && examConfig.questionTypes.twoMarker.count > 0) {
        questionTypesConfig.twoMarker = {
          count: examConfig.questionTypes.twoMarker.count,
          marks: examConfig.questionTypes.twoMarker.marks
        };
      }
      if (examConfig.questionTypes.fiveMarker.enabled && examConfig.questionTypes.fiveMarker.count > 0) {
        questionTypesConfig.fiveMarker = {
          count: examConfig.questionTypes.fiveMarker.count,
          marks: examConfig.questionTypes.fiveMarker.marks
        };
      }
      if (examConfig.questionTypes.tenMarker.enabled && examConfig.questionTypes.tenMarker.count > 0) {
        questionTypesConfig.tenMarker = {
          count: examConfig.questionTypes.tenMarker.count,
          marks: examConfig.questionTypes.tenMarker.marks
        };
      }

      const result = await dispatch(generateExam({
        subject: examConfig.subject.trim(),
        topic: examConfig.topic.trim(),
        difficulty: examConfig.difficulty,
        questionTypes: questionTypesConfig
      })).unwrap();

      navigation.navigate('ExamTaking', {
        examId: result.examId,
        questions: result.questions
      });
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to generate exam');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.label}>Subject</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., Mathematics, Physics"
          value={examConfig.subject}
          onChangeText={(text) => setExamConfig({ ...examConfig, subject: text })}
        />

        <Text style={styles.label}>Topic</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., Laws of Motion, Quadratic Equations"
          value={examConfig.topic}
          onChangeText={(text) => setExamConfig({ ...examConfig, topic: text })}
        />

        <Text style={styles.label}>Difficulty</Text>
        <View style={styles.difficultyButtons}>
          <TouchableOpacity
            style={[styles.difficultyButton, examConfig.difficulty === 'easy' && styles.difficultyButtonActive]}
            onPress={() => setExamConfig({ ...examConfig, difficulty: 'easy' })}
          >
            <Text>Easy</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.difficultyButton, examConfig.difficulty === 'medium' && styles.difficultyButtonActive]}
            onPress={() => setExamConfig({ ...examConfig, difficulty: 'medium' })}
          >
            <Text>Medium</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.difficultyButton, examConfig.difficulty === 'hard' && styles.difficultyButtonActive]}
            onPress={() => setExamConfig({ ...examConfig, difficulty: 'hard' })}
          >
            <Text>Hard</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Question Types</Text>

        {/* MCQ */}
        <View style={styles.questionTypeRow}>
          <View style={styles.questionTypeHeader}>
            <TouchableOpacity
              style={styles.checkbox}
              onPress={() => setExamConfig({
                ...examConfig,
                questionTypes: {
                  ...examConfig.questionTypes,
                  mcq: { ...examConfig.questionTypes.mcq, enabled: !examConfig.questionTypes.mcq.enabled }
                }
              })}
            >
              <Text>{examConfig.questionTypes.mcq.enabled ? '✓' : ''}</Text>
            </TouchableOpacity>
            <Text style={styles.questionTypeLabel}>Multiple Choice Questions (1 mark each)</Text>
          </View>
          {examConfig.questionTypes.mcq.enabled && (
            <TextInput
              style={styles.countInput}
              placeholder="Count"
              keyboardType="numeric"
              value={examConfig.questionTypes.mcq.count.toString()}
              onChangeText={(text) => setExamConfig({
                ...examConfig,
                questionTypes: {
                  ...examConfig.questionTypes,
                  mcq: { ...examConfig.questionTypes.mcq, count: parseInt(text) || 0 }
                }
              })}
            />
          )}
        </View>

        {/* 2-Marker */}
        <View style={styles.questionTypeRow}>
          <View style={styles.questionTypeHeader}>
            <TouchableOpacity
              style={styles.checkbox}
              onPress={() => setExamConfig({
                ...examConfig,
                questionTypes: {
                  ...examConfig.questionTypes,
                  twoMarker: { ...examConfig.questionTypes.twoMarker, enabled: !examConfig.questionTypes.twoMarker.enabled }
                }
              })}
            >
              <Text>{examConfig.questionTypes.twoMarker.enabled ? '✓' : ''}</Text>
            </TouchableOpacity>
            <Text style={styles.questionTypeLabel}>Short Answer Questions (2 marks each)</Text>
          </View>
          {examConfig.questionTypes.twoMarker.enabled && (
            <TextInput
              style={styles.countInput}
              placeholder="Count"
              keyboardType="numeric"
              value={examConfig.questionTypes.twoMarker.count.toString()}
              onChangeText={(text) => setExamConfig({
                ...examConfig,
                questionTypes: {
                  ...examConfig.questionTypes,
                  twoMarker: { ...examConfig.questionTypes.twoMarker, count: parseInt(text) || 0 }
                }
              })}
            />
          )}
        </View>

        {/* 5-Marker */}
        <View style={styles.questionTypeRow}>
          <View style={styles.questionTypeHeader}>
            <TouchableOpacity
              style={styles.checkbox}
              onPress={() => setExamConfig({
                ...examConfig,
                questionTypes: {
                  ...examConfig.questionTypes,
                  fiveMarker: { ...examConfig.questionTypes.fiveMarker, enabled: !examConfig.questionTypes.fiveMarker.enabled }
                }
              })}
            >
              <Text>{examConfig.questionTypes.fiveMarker.enabled ? '✓' : ''}</Text>
            </TouchableOpacity>
            <Text style={styles.questionTypeLabel}>Long Answer Questions (5 marks each)</Text>
          </View>
          {examConfig.questionTypes.fiveMarker.enabled && (
            <TextInput
              style={styles.countInput}
              placeholder="Count"
              keyboardType="numeric"
              value={examConfig.questionTypes.fiveMarker.count.toString()}
              onChangeText={(text) => setExamConfig({
                ...examConfig,
                questionTypes: {
                  ...examConfig.questionTypes,
                  fiveMarker: { ...examConfig.questionTypes.fiveMarker, count: parseInt(text) || 0 }
                }
              })}
            />
          )}
        </View>

        {/* 10-Marker */}
        <View style={styles.questionTypeRow}>
          <View style={styles.questionTypeHeader}>
            <TouchableOpacity
              style={styles.checkbox}
              onPress={() => setExamConfig({
                ...examConfig,
                questionTypes: {
                  ...examConfig.questionTypes,
                  tenMarker: { ...examConfig.questionTypes.tenMarker, enabled: !examConfig.questionTypes.tenMarker.enabled }
                }
              })}
            >
              <Text>{examConfig.questionTypes.tenMarker.enabled ? '✓' : ''}</Text>
            </TouchableOpacity>
            <Text style={styles.questionTypeLabel}>Essay Questions (10 marks each)</Text>
          </View>
          {examConfig.questionTypes.tenMarker.enabled && (
            <TextInput
              style={styles.countInput}
              placeholder="Count"
              keyboardType="numeric"
              value={examConfig.questionTypes.tenMarker.count.toString()}
              onChangeText={(text) => setExamConfig({
                ...examConfig,
                questionTypes: {
                  ...examConfig.questionTypes,
                  tenMarker: { ...examConfig.questionTypes.tenMarker, count: parseInt(text) || 0 }
                }
              })}
            />
          )}
        </View>

        <TouchableOpacity
          style={[styles.generateButton, isGenerating && styles.generateButtonDisabled]}
          onPress={handleGenerateExam}
          disabled={isGenerating}
        >
          <Text style={styles.generateButtonText}>
            {isGenerating ? 'Generating Exam...' : 'Generate Exam'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
```

#### 7.4.2 Exam Taking Screen

```typescript
// src/screens/exam/ExamTakingScreen.tsx
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, Modal } from 'react-native';
import { useDispatch } from 'react-redux';
import { submitExam } from '../../store/slices/examSlice';

export default function ExamTakingScreen({ route, navigation }: any) {
  const { examId, questions } = route.params;
  const dispatch = useDispatch();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [timeSpent, setTimeSpent] = useState(0);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Start timer
    timerRef.current = setInterval(() => {
      setTimeSpent(prev => prev + 1);
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const handleAnswerChange = (questionId: string, answer: any) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = async () => {
    setShowSubmitModal(false);
    
    try {
      const result = await dispatch(submitExam({
        examId,
        answers,
        timeSpent
      })).unwrap();

      navigation.replace('ExamResults', {
        examId,
        results: result
      });
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to submit exam');
    }
  };

  const currentQuestion = questions[currentQuestionIndex];
  const answeredCount = Object.keys(answers).length;
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>
          Question {currentQuestionIndex + 1} of {questions.length}
        </Text>
        <Text style={styles.timerText}>{formatTime(timeSpent)}</Text>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressBar}>
        <View
          style={[styles.progressFill, { width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }]}
        />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.questionContainer}>
          <Text style={styles.questionNumber}>
            Question {currentQuestionIndex + 1} ({currentQuestion.marks} marks)
          </Text>
          <Text style={styles.questionText}>{currentQuestion.question}</Text>

          {currentQuestion.type === 'mcq' && currentQuestion.options && (
            <View style={styles.optionsContainer}>
              {currentQuestion.options.map((option: string, index: number) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.optionButton,
                    answers[currentQuestion.id] === index && styles.optionButtonSelected
                  ]}
                  onPress={() => handleAnswerChange(currentQuestion.id, index)}
                >
                  <Text style={styles.optionLabel}>{String.fromCharCode(65 + index)}.</Text>
                  <Text style={styles.optionText}>{option}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {(currentQuestion.type === 'twoMarker' || currentQuestion.type === 'fiveMarker' || currentQuestion.type === 'tenMarker') && (
            <TextInput
              style={styles.textAnswerInput}
              placeholder="Type your answer here..."
              multiline
              value={answers[currentQuestion.id] || ''}
              onChangeText={(text) => handleAnswerChange(currentQuestion.id, text)}
            />
          )}
        </View>
      </ScrollView>

      {/* Navigation Buttons */}
      <View style={styles.navigationButtons}>
        <TouchableOpacity
          style={[styles.navButton, currentQuestionIndex === 0 && styles.navButtonDisabled]}
          onPress={handlePrevious}
          disabled={currentQuestionIndex === 0}
        >
          <Text>Previous</Text>
        </TouchableOpacity>

        {currentQuestionIndex < questions.length - 1 ? (
          <TouchableOpacity style={styles.navButton} onPress={handleNext}>
            <Text>Next</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.submitButton}
            onPress={() => setShowSubmitModal(true)}
          >
            <Text style={styles.submitButtonText}>Submit Exam</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Submit Confirmation Modal */}
      <Modal
        visible={showSubmitModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowSubmitModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Submit Exam?</Text>
            <Text style={styles.modalText}>
              You have answered {answeredCount} out of {questions.length} questions.
              Are you sure you want to submit?
            </Text>
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => setShowSubmitModal(false)}
              >
                <Text>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalSubmitButton}
                onPress={handleSubmit}
              >
                <Text style={styles.modalSubmitButtonText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
```

#### 7.4.3 Exam Results Screen

```typescript
// src/screens/exam/ExamResultsScreen.tsx
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';

export default function ExamResultsScreen({ route, navigation }: any) {
  const { results } = route.params;
  const { score, totalMarks, percentage, questions, answers } = results;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Exam Results</Text>
        <Text style={styles.scoreText}>{score} / {totalMarks}</Text>
        <Text style={styles.percentageText}>{percentage}%</Text>
      </View>

      <View style={styles.questionsContainer}>
        {questions.map((question: any, index: number) => {
          const userAnswer = answers[question.id];
          const isCorrect = question.type === 'mcq'
            ? userAnswer === question.correctAnswer
            : question.isCorrect; // For text answers, backend determines correctness

          return (
            <View key={question.id} style={styles.questionResultCard}>
              <View style={styles.questionHeader}>
                <Text style={styles.questionNumber}>Question {index + 1}</Text>
                {isCorrect ? (
                  <Text style={styles.correctBadge}>✓ Correct</Text>
                ) : (
                  <Text style={styles.incorrectBadge}>✗ Incorrect</Text>
                )}
              </View>
              <Text style={styles.questionText}>{question.question}</Text>
              {question.type === 'mcq' && (
                <>
                  <Text style={styles.answerLabel}>Your Answer:</Text>
                  <Text style={styles.userAnswer}>
                    {question.options[userAnswer]}
                  </Text>
                  <Text style={styles.answerLabel}>Correct Answer:</Text>
                  <Text style={styles.correctAnswer}>
                    {question.finalAnswer}
                  </Text>
                </>
              )}
              {question.explanation && (
                <>
                  <Text style={styles.explanationLabel}>Explanation:</Text>
                  <Text style={styles.explanation}>{question.explanation}</Text>
                </>
              )}
            </View>
          );
        })}
      </View>

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.navigate('ExamGeneration')}
      >
        <Text style={styles.backButtonText}>Create New Exam</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
```

#### 7.4.4 Solve Exam Paper Feature

```typescript
// src/screens/exam/SolvePaperScreen.tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import { solveExamPaper } from '../../store/slices/examSlice';

export default function SolvePaperScreen({ navigation }: any) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePickPaper = async () => {
    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf, DocumentPicker.types.images],
      });

      setIsProcessing(true);

      const formData = new FormData();
      formData.append('file', {
        uri: result[0].uri,
        type: result[0].type,
        name: result[0].name,
      } as any);

      const solutions = await dispatch(solveExamPaper(formData)).unwrap();

      navigation.navigate('PaperSolutions', {
        solutions: solutions.questions,
        paperInfo: solutions.paperInfo
      });
    } catch (error: any) {
      if (DocumentPicker.isCancel(error)) {
        return;
      }
      Alert.alert('Error', error.message || 'Failed to process paper');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Solve Exam Paper</Text>
      <Text style={styles.description}>
        Upload a PDF or image of an exam paper and get AI-powered solutions
      </Text>

      <TouchableOpacity
        style={[styles.uploadButton, isProcessing && styles.uploadButtonDisabled]}
        onPress={handlePickPaper}
        disabled={isProcessing}
      >
        <Text style={styles.uploadButtonText}>
          {isProcessing ? 'Processing...' : 'Upload Paper'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
```

### 7.5 AI-Powered Mind Maps Feature

#### 7.5.1 Mind Maps List Screen

```typescript
// src/screens/mindmaps/MindMapsListScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, FlatList, TouchableOpacity, Text, Modal, TextInput, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMindMaps, generateMindMap, createMindMap } from '../../store/slices/mindmapsSlice';

export default function MindMapsListScreen({ navigation }: any) {
  const dispatch = useDispatch();
  const { mindMaps, isLoading, isGenerating } = useSelector((state: RootState) => state.mindmaps);
  const { user } = useSelector((state: RootState) => state.auth);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [generateTopic, setGenerateTopic] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    if (user) {
      dispatch(fetchMindMaps({ userId: user.id, category: selectedCategory !== 'all' ? selectedCategory : undefined }));
    }
  }, [user, selectedCategory]);

  const handleGenerateMindMap = async () => {
    if (!generateTopic.trim()) {
      Alert.alert('Error', 'Please enter a topic');
      return;
    }

    try {
      const result = await dispatch(generateMindMap({
        topic: generateTopic.trim(),
        title: `Mind Map: ${generateTopic.trim()}`,
        category: 'AI Generated'
      })).unwrap();

      Alert.alert('Success', 'Mind map generated!');
      setShowGenerateModal(false);
      setGenerateTopic('');
      dispatch(fetchMindMaps({ userId: user!.id }));
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to generate mind map');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mind Maps</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.generateButton}
            onPress={() => setShowGenerateModal(true)}
          >
            <Text style={styles.generateButtonText}>✨ Generate with AI</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.createButton}
            onPress={() => setShowCreateModal(true)}
          >
            <Text style={styles.createButtonText}>+ Create New</Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={mindMaps}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.mindMapCard}
            onPress={() => navigation.navigate('MindMapView', { mindMapId: item.id })}
          >
            <Text style={styles.mindMapTitle}>{item.title}</Text>
            {item.category && (
              <Text style={styles.mindMapCategory}>{item.category}</Text>
            )}
          </TouchableOpacity>
        )}
        refreshing={isLoading}
        onRefresh={() => dispatch(fetchMindMaps({ userId: user!.id }))}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No mind maps yet</Text>
            <TouchableOpacity onPress={() => setShowGenerateModal(true)}>
              <Text style={styles.emptyActionText}>Generate with AI</Text>
            </TouchableOpacity>
          </View>
        }
      />

      {/* Generate Modal */}
      <Modal
        visible={showGenerateModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowGenerateModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Generate Mind Map with AI</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Enter topic (e.g., Laws of Motion)"
              value={generateTopic}
              onChangeText={setGenerateTopic}
              multiline
            />
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => setShowGenerateModal(false)}
              >
                <Text>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalGenerateButton, isGenerating && styles.modalGenerateButtonDisabled]}
                onPress={handleGenerateMindMap}
                disabled={isGenerating || !generateTopic.trim()}
              >
                <Text style={styles.modalGenerateButtonText}>
                  {isGenerating ? 'Generating...' : 'Generate'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
```

#### 7.5.2 Mind Map View/Editor Screen

```typescript
// src/screens/mindmaps/MindMapViewScreen.tsx
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal, TextInput } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { updateMindMap } from '../../store/slices/mindmapsSlice';

interface MindMapNode {
  id: string;
  label: string;
  description?: string;
  color?: string;
  children: MindMapNode[];
}

interface MindMapStructure {
  centralTopic: string;
  branches: MindMapNode[];
}

export default function MindMapViewScreen({ route, navigation }: any) {
  const { mindMapId } = route.params;
  const dispatch = useDispatch();
  const { mindMaps } = useSelector((state: RootState) => state.mindmaps);
  const mindMap = mindMaps.find(m => m.id === mindMapId);
  const [isEditing, setIsEditing] = useState(false);
  const [structure, setStructure] = useState<MindMapStructure>(
    mindMap ? JSON.parse(mindMap.structure) : { centralTopic: '', branches: [] }
  );

  const renderMindMap = () => {
    return (
      <View style={styles.mindMapContainer}>
        {/* Central Topic */}
        <View style={styles.centralTopicContainer}>
          <Text style={styles.centralTopic}>{structure.centralTopic}</Text>
        </View>

        {/* Branches */}
        <View style={styles.branchesContainer}>
          {structure.branches.map((branch, idx) => (
            <View key={branch.id || idx} style={styles.branchCard}>
              <View style={[styles.branchHeader, { backgroundColor: branch.color || '#3b82f6' }]}>
                <Text style={styles.branchLabel}>{branch.label}</Text>
                {branch.description && (
                  <Text style={styles.branchDescription}>{branch.description}</Text>
                )}
              </View>
              
              {branch.children && branch.children.length > 0 && (
                <View style={styles.subBranchesContainer}>
                  {branch.children.map((child, childIdx) => (
                    <View key={child.id || childIdx} style={styles.subBranchCard}>
                      <Text style={styles.subBranchLabel}>{child.label}</Text>
                      {child.description && (
                        <Text style={styles.subBranchDescription}>{child.description}</Text>
                      )}
                    </View>
                  ))}
                </View>
              )}
            </View>
          ))}
        </View>
      </View>
    );
  };

  const handleSave = async () => {
    try {
      await dispatch(updateMindMap({
        id: mindMapId,
        structure: JSON.stringify(structure)
      })).unwrap();
      
      setIsEditing(false);
      Alert.alert('Success', 'Mind map updated!');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to update mind map');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{mindMap?.title}</Text>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => setIsEditing(!isEditing)}
        >
          <Text>{isEditing ? 'View' : 'Edit'}</Text>
        </TouchableOpacity>
      </View>

      {isEditing ? (
        <View style={styles.editorContainer}>
          {/* Editor UI for modifying structure */}
          <TextInput
            style={styles.centralTopicInput}
            placeholder="Central Topic"
            value={structure.centralTopic}
            onChangeText={(text) => setStructure({ ...structure, centralTopic: text })}
          />
          {/* Add branch editing UI */}
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save Changes</Text>
          </TouchableOpacity>
        </View>
      ) : (
        renderMindMap()
      )}
    </ScrollView>
  );
}
```

### 7.6 Focus Mode (Pomodoro Timer)

```typescript
// src/screens/focus/FocusScreen.tsx
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { createFocusSession, updateFocusSession } from '../../store/slices/focusSlice';

export default function FocusScreen() {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const [duration, setDuration] = useState(1500); // 25 minutes default
  const [isRunning, setIsRunning] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(duration);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning && timeRemaining > 0) {
      intervalRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            handleComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeRemaining]);

  const handleStart = async () => {
    try {
      const result = await dispatch(createFocusSession({
        duration,
        mode: 'pomodoro',
        status: 'active',
        userId: user!.id
      })).unwrap();
      
      setSessionId(result.id);
      setIsRunning(true);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to start focus session');
    }
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleResume = () => {
    setIsRunning(true);
  };

  const handleComplete = async () => {
    setIsRunning(false);
    if (sessionId) {
      try {
        await dispatch(updateFocusSession({
          id: sessionId,
          status: 'completed',
          completedAt: new Date().toISOString()
        })).unwrap();
        
        Alert.alert('Great Job!', 'Focus session completed!');
        setTimeRemaining(duration);
        setSessionId(null);
      } catch (error: any) {
        console.error('Error completing session:', error);
      }
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeRemaining(duration);
    setSessionId(null);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const presetDurations = [
    { label: '15 min', value: 900 },
    { label: '25 min', value: 1500 },
    { label: '45 min', value: 2700 },
    { label: '60 min', value: 3600 }
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Focus Mode</Text>
      
      {!isRunning && !sessionId && (
        <View style={styles.presetContainer}>
          <Text style={styles.presetLabel}>Select Duration:</Text>
          <View style={styles.presetButtons}>
            {presetDurations.map((preset) => (
              <TouchableOpacity
                key={preset.value}
                style={[styles.presetButton, duration === preset.value && styles.presetButtonActive]}
                onPress={() => {
                  setDuration(preset.value);
                  setTimeRemaining(preset.value);
                }}
              >
                <Text>{preset.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      <View style={styles.timerContainer}>
        <Text style={styles.timerText}>{formatTime(timeRemaining)}</Text>
      </View>

      <View style={styles.controlsContainer}>
        {!isRunning && !sessionId && (
          <TouchableOpacity style={styles.startButton} onPress={handleStart}>
            <Text style={styles.startButtonText}>Start</Text>
          </TouchableOpacity>
        )}

        {isRunning && (
          <TouchableOpacity style={styles.pauseButton} onPress={handlePause}>
            <Text style={styles.pauseButtonText}>Pause</Text>
          </TouchableOpacity>
        )}

        {!isRunning && sessionId && (
          <>
            <TouchableOpacity style={styles.resumeButton} onPress={handleResume}>
              <Text style={styles.resumeButtonText}>Resume</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
              <Text style={styles.resetButtonText}>Reset</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      {sessionId && (
        <View style={styles.statsContainer}>
          <Text style={styles.statsText}>
            Session Active • {formatTime(duration - timeRemaining)} elapsed
          </Text>
        </View>
      )}
    </View>
  );
}
```

### 7.7 Progress Tracking & Achievements

#### 7.7.1 Progress Dashboard Screen

```typescript
// src/screens/progress/ProgressScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProgress, fetchUsageData } from '../../store/slices/progressSlice';
import { fetchAchievements } from '../../store/slices/achievementsSlice';

export default function ProgressScreen() {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const { progress, usageData, isLoading } = useSelector((state: RootState) => state.progress);
  const { achievements, badges, isLoading: isLoadingAchievements } = useSelector((state: RootState) => state.achievements);
  const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [selectedTab, setSelectedTab] = useState<'progress' | 'achievements'>('progress');

  useEffect(() => {
    if (user) {
      dispatch(fetchProgress({ period: selectedPeriod }));
      dispatch(fetchUsageData({ userId: user.id, period: selectedPeriod }));
      dispatch(fetchAchievements({ userId: user.id }));
    }
  }, [user, selectedPeriod, selectedTab]);

  return (
    <ScrollView style={styles.container}>
      {/* Tab Selector */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'progress' && styles.tabActive]}
          onPress={() => setSelectedTab('progress')}
        >
          <Text style={[styles.tabText, selectedTab === 'progress' && styles.tabTextActive]}>
            Progress
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'achievements' && styles.tabActive]}
          onPress={() => setSelectedTab('achievements')}
        >
          <Text style={[styles.tabText, selectedTab === 'achievements' && styles.tabTextActive]}>
            Achievements
          </Text>
        </TouchableOpacity>
      </View>

      {selectedTab === 'progress' ? (
        <>
          {/* Period Selector */}
          <View style={styles.periodSelector}>
            {(['7d', '30d', '90d', '1y'] as const).map((period) => (
              <TouchableOpacity
                key={period}
                style={[styles.periodButton, selectedPeriod === period && styles.periodButtonActive]}
                onPress={() => setSelectedPeriod(period)}
              >
                <Text>{period.toUpperCase()}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Overview Cards */}
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{usageData?.totalInteractions || 0}</Text>
              <Text style={styles.statLabel}>Questions Answered</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{usageData?.totalTimeSpent || '0h 0m'}</Text>
              <Text style={styles.statLabel}>Study Time</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{usageData?.streakDays || 0}</Text>
              <Text style={styles.statLabel}>Day Streak</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{usageData?.averageSessionTime || '0m'}</Text>
              <Text style={styles.statLabel}>Avg Session</Text>
            </View>
          </View>

          {/* Weekly Activity Chart */}
          <View style={styles.chartContainer}>
            <Text style={styles.sectionTitle}>Weekly Activity</Text>
            {usageData?.weeklyData?.map((day: any, index: number) => (
              <View key={index} style={styles.chartBar}>
                <Text style={styles.chartLabel}>{day.day}</Text>
                <View style={styles.chartBarContainer}>
                  <View
                    style={[styles.chartBarFill, { width: `${(day.interactions / 70) * 100}%` }]}
                  />
                </View>
                <Text style={styles.chartValue}>{day.interactions}</Text>
              </View>
            ))}
          </View>

          {/* Subject Breakdown */}
          <View style={styles.subjectBreakdown}>
            <Text style={styles.sectionTitle}>Topics Studied</Text>
            {usageData?.subjectBreakdown?.map((subject: any, index: number) => (
              <View key={index} style={styles.subjectRow}>
                <View style={styles.subjectInfo}>
                  <View style={[styles.subjectColor, { backgroundColor: subject.color }]} />
                  <Text style={styles.subjectName}>{subject.subject}</Text>
                </View>
                <View style={styles.subjectStats}>
                  <Text style={styles.subjectCount}>{subject.interactions} questions</Text>
                  <Text style={styles.subjectPercentage}>{subject.percentage}%</Text>
                </View>
              </View>
            ))}
          </View>

          {/* Smart Learning Stats */}
          <View style={styles.smartLearningStats}>
            <Text style={styles.sectionTitle}>Smart Learning Activity</Text>
            <View style={styles.smartLearningGrid}>
              <View style={styles.smartLearningCard}>
                <Text style={styles.smartLearningValue}>
                  {usageData?.smartLearning?.chatSessions || 0}
                </Text>
                <Text style={styles.smartLearningLabel}>Chat Sessions</Text>
              </View>
              <View style={styles.smartLearningCard}>
                <Text style={styles.smartLearningValue}>
                  {usageData?.smartLearning?.notes || 0}
                </Text>
                <Text style={styles.smartLearningLabel}>Notes</Text>
              </View>
              <View style={styles.smartLearningCard}>
                <Text style={styles.smartLearningValue}>
                  {usageData?.smartLearning?.flashcards || 0}
                </Text>
                <Text style={styles.smartLearningLabel}>Flashcards</Text>
              </View>
              <View style={styles.smartLearningCard}>
                <Text style={styles.smartLearningValue}>
                  {usageData?.smartLearning?.mindMaps || 0}
                </Text>
                <Text style={styles.smartLearningLabel}>Mind Maps</Text>
              </View>
              <View style={styles.smartLearningCard}>
                <Text style={styles.smartLearningValue}>
                  {usageData?.smartLearning?.examSessions || 0}
                </Text>
                <Text style={styles.smartLearningLabel}>Exam Sessions</Text>
              </View>
              <View style={styles.smartLearningCard}>
                <Text style={styles.smartLearningValue}>
                  {usageData?.smartLearning?.focusSessions || 0}
                </Text>
                <Text style={styles.smartLearningLabel}>Focus Sessions</Text>
              </View>
            </View>
          </View>
        </>
      ) : (
        <>
          {/* Achievements Section */}
          <View style={styles.achievementsStats}>
            <View style={styles.achievementStatCard}>
              <Text style={styles.achievementStatValue}>
                {achievements?.filter(a => a.isUnlocked).length || 0} / {achievements?.length || 0}
              </Text>
              <Text style={styles.achievementStatLabel}>Achievements Unlocked</Text>
            </View>
            <View style={styles.achievementStatCard}>
              <Text style={styles.achievementStatValue}>
                {badges?.filter(b => b.earned).length || 0} / {badges?.length || 0}
              </Text>
              <Text style={styles.achievementStatLabel}>Badges Earned</Text>
            </View>
          </View>

          {/* Achievements List */}
          <View style={styles.achievementsList}>
            <Text style={styles.sectionTitle}>Achievements</Text>
            {achievements?.map((achievement: any) => (
              <View
                key={achievement.id}
                style={[
                  styles.achievementCard,
                  achievement.isUnlocked && styles.achievementCardUnlocked
                ]}
              >
                <View style={styles.achievementIcon}>
                  <Text style={styles.achievementIconText}>{achievement.icon}</Text>
                </View>
                <View style={styles.achievementInfo}>
                  <Text style={styles.achievementName}>{achievement.name}</Text>
                  <Text style={styles.achievementDescription}>{achievement.description}</Text>
                  <View style={styles.achievementProgress}>
                    <View style={styles.progressBar}>
                      <View
                        style={[
                          styles.progressFill,
                          { width: `${achievement.progress}%` }
                        ]}
                      />
                    </View>
                    <Text style={styles.progressText}>{achievement.progress}%</Text>
                  </View>
                </View>
                {achievement.isUnlocked && (
                  <Text style={styles.unlockedBadge}>✓</Text>
                )}
              </View>
            ))}
          </View>

          {/* Badges List */}
          <View style={styles.badgesList}>
            <Text style={styles.sectionTitle}>Badges</Text>
            <View style={styles.badgesGrid}>
              {badges?.map((badge: any) => (
                <View
                  key={badge.id}
                  style={[
                    styles.badgeCard,
                    !badge.earned && styles.badgeCardLocked
                  ]}
                >
                  <View style={[styles.badgeIcon, { backgroundColor: getRarityColor(badge.rarity) }]}>
                    <Text style={styles.badgeIconText}>{badge.icon || badge.image}</Text>
                  </View>
                  <Text style={styles.badgeName}>{badge.name}</Text>
                  <Text style={styles.badgeDescription}>{badge.description}</Text>
                  {badge.earned && (
                    <Text style={styles.earnedBadge}>Earned</Text>
                  )}
                </View>
              ))}
            </View>
          </View>
        </>
      )}
    </ScrollView>
  );
}

const getRarityColor = (rarity: string) => {
  switch (rarity) {
    case 'legendary': return '#FFD700';
    case 'epic': return '#9D4EDD';
    case 'rare': return '#2196F3';
    default: return '#9E9E9E';
  }
};
```

### 7.8 Learning Materials Feature

#### 7.8.1 Learning Materials Screen

```typescript
// src/screens/learning/LearningMaterialsScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBoards, fetchClasses, fetchSubjects, fetchChapters } from '../../store/slices/learningSlice';

export default function LearningMaterialsScreen({ navigation }: any) {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const { boards, classes, subjects, chapters, isLoading } = useSelector((state: RootState) => state.learning);
  const [selectedBoard, setSelectedBoard] = useState<string | null>(user?.preferences?.learning?.board || null);
  const [selectedClass, setSelectedClass] = useState<string | null>(user?.preferences?.learning?.class || null);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      dispatch(fetchBoards());
      if (selectedBoard) {
        dispatch(fetchClasses({ board: selectedBoard }));
      }
      if (selectedClass) {
        dispatch(fetchSubjects({ board: selectedBoard!, class: selectedClass }));
      }
      if (selectedSubject) {
        dispatch(fetchChapters({ board: selectedBoard!, class: selectedClass!, subject: selectedSubject }));
      }
    }
  }, [user, selectedBoard, selectedClass, selectedSubject]);

  const handleSubjectPress = (subject: any) => {
    setSelectedSubject(subject.name);
    navigation.navigate('SubjectDetails', {
      board: selectedBoard,
      class: selectedClass,
      subject: subject.name
    });
  };

  const handleChapterPress = (chapter: any) => {
    navigation.navigate('ChapterDetails', {
      board: selectedBoard,
      class: selectedClass,
      subject: selectedSubject,
      chapterId: chapter.id,
      chapterName: chapter.name
    });
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Learning Materials</Text>
      <Text style={styles.subtitle}>
        {selectedBoard && selectedClass
          ? `${selectedBoard} • Class ${selectedClass}`
          : 'Select your board and class'}
      </Text>

      {/* Board Selection */}
      {!selectedBoard && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Board</Text>
          <FlatList
            data={boards}
            horizontal
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.boardCard}
                onPress={() => setSelectedBoard(item.name)}
              >
                <Text style={styles.boardName}>{item.name}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}

      {/* Class Selection */}
      {selectedBoard && !selectedClass && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Class</Text>
          <FlatList
            data={classes}
            numColumns={3}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.classCard}
                onPress={() => setSelectedClass(item.name)}
              >
                <Text style={styles.className}>Class {item.name}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}

      {/* Subjects List */}
      {selectedBoard && selectedClass && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Subjects</Text>
            <TouchableOpacity
              style={styles.changeButton}
              onPress={() => {
                setSelectedClass(null);
                setSelectedSubject(null);
              }}
            >
              <Text style={styles.changeButtonText}>Change Class</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={subjects}
            numColumns={2}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.subjectCard}
                onPress={() => handleSubjectPress(item)}
              >
                <View style={[styles.subjectIcon, { backgroundColor: item.color }]}>
                  <Text style={styles.subjectIconText}>{item.icon}</Text>
                </View>
                <Text style={styles.subjectName}>{item.name}</Text>
                <Text style={styles.subjectDescription}>{item.description}</Text>
                <Text style={styles.subjectCount}>{item.bookCount} Books</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}

      {/* Chapters List */}
      {selectedSubject && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{selectedSubject} Chapters</Text>
            <TouchableOpacity
              style={styles.changeButton}
              onPress={() => setSelectedSubject(null)}
            >
              <Text style={styles.changeButtonText}>Back</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={chapters}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.chapterCard}
                onPress={() => handleChapterPress(item)}
              >
                <Text style={styles.chapterName}>{item.name}</Text>
                <Text style={styles.chapterDescription}>{item.description}</Text>
                <View style={styles.chapterResources}>
                  <Text style={styles.resourceCount}>
                    📚 {item.pdfCount || 0} PDFs
                  </Text>
                  <Text style={styles.resourceCount}>
                    🎥 {item.videoCount || 0} Videos
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </ScrollView>
  );
}
```

#### 7.8.2 Chapter Details Screen

```typescript
// src/screens/learning/ChapterDetailsScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchChapterDetails } from '../../store/slices/learningSlice';

export default function ChapterDetailsScreen({ route, navigation }: any) {
  const { chapterId, chapterName } = route.params;
  const dispatch = useDispatch();
  const { chapterDetails, isLoading } = useSelector((state: RootState) => state.learning);
  const [selectedTab, setSelectedTab] = useState<'pdfs' | 'videos' | 'chat'>('pdfs');

  useEffect(() => {
    dispatch(fetchChapterDetails({ chapterId }));
  }, [chapterId]);

  const handlePdfPress = (pdf: any) => {
    navigation.navigate('PdfViewer', {
      pdfId: pdf.id,
      pdfUrl: pdf.url,
      pdfName: pdf.name
    });
  };

  const handleVideoPress = (video: any) => {
    navigation.navigate('VideoPlayer', {
      videoId: video.id,
      videoUrl: video.url,
      videoName: video.name
    });
  };

  const handleStartChat = () => {
    navigation.navigate('Chat', {
      sessionContext: `Chapter: ${chapterName}`,
      contextType: 'chapter',
      contextId: chapterId
    });
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{chapterName}</Text>
      {chapterDetails?.description && (
        <Text style={styles.description}>{chapterDetails.description}</Text>
      )}

      {/* Tab Selector */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'pdfs' && styles.tabActive]}
          onPress={() => setSelectedTab('pdfs')}
        >
          <Text style={[styles.tabText, selectedTab === 'pdfs' && styles.tabTextActive]}>
            PDFs ({chapterDetails?.pdfs?.length || 0})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'videos' && styles.tabActive]}
          onPress={() => setSelectedTab('videos')}
        >
          <Text style={[styles.tabText, selectedTab === 'videos' && styles.tabTextActive]}>
            Videos ({chapterDetails?.videos?.length || 0})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'chat' && styles.tabActive]}
          onPress={() => setSelectedTab('chat')}
        >
          <Text style={[styles.tabText, selectedTab === 'chat' && styles.tabTextActive]}>
            Chat with AI
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      {selectedTab === 'pdfs' && (
        <View style={styles.contentContainer}>
          {chapterDetails?.pdfs?.map((pdf: any) => (
            <TouchableOpacity
              key={pdf.id}
              style={styles.resourceCard}
              onPress={() => handlePdfPress(pdf)}
            >
              <Text style={styles.resourceIcon}>📚</Text>
              <View style={styles.resourceInfo}>
                <Text style={styles.resourceName}>{pdf.name}</Text>
                <Text style={styles.resourceMeta}>
                  {pdf.pageCount} pages • {pdf.size}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {selectedTab === 'videos' && (
        <View style={styles.contentContainer}>
          {chapterDetails?.videos?.map((video: any) => (
            <TouchableOpacity
              key={video.id}
              style={styles.resourceCard}
              onPress={() => handleVideoPress(video)}
            >
              <Text style={styles.resourceIcon}>🎥</Text>
              <View style={styles.resourceInfo}>
                <Text style={styles.resourceName}>{video.name}</Text>
                <Text style={styles.resourceMeta}>
                  {video.duration} • {video.views} views
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {selectedTab === 'chat' && (
        <View style={styles.chatContainer}>
          <Text style={styles.chatDescription}>
            Start a conversation with AI about this chapter. Ask questions, get explanations, and learn interactively.
          </Text>
          <TouchableOpacity
            style={styles.startChatButton}
            onPress={handleStartChat}
          >
            <Text style={styles.startChatButtonText}>Start Chat</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}
```

---

## 8. API Integration

### 8.1 API Service Structure

See `MOBILE_APP_API_LIST.md` for complete API reference.

#### 8.1.1 Complete API Endpoints

```typescript
// src/services/api/endpoints.ts
import apiClient from './client';

// Authentication
export const authApi = {
  login: (email: string, password: string, deviceInfo?: string) =>
    apiClient.post('/mobile/auth/login', { email, password, deviceInfo }),
  
  signup: (data: SignupData) =>
    apiClient.post('/mobile/auth/signup', data),
  
  verify: (token: string) =>
    apiClient.post('/mobile/auth/verify', { token }),
  
  logout: () =>
    apiClient.post('/auth/logout'),
  
  refresh: (refreshToken: string) =>
    apiClient.post('/auth/refresh', { refreshToken }),
  
  forgotPassword: (email: string) =>
    apiClient.post('/auth/forgot-password', { email }),
  
  resetPassword: (token: string, password: string) =>
    apiClient.post('/auth/reset-password', { token, password }),
};

// Chat
export const chatApi = {
  sendMessage: (data: ChatMessageData) =>
    apiClient.post('/mobile/chat', data),
  
  getSessions: () =>
    apiClient.get('/chat/sessions'),
  
  createSession: (title: string) =>
    apiClient.post('/chat/sessions', { title }),
  
  getMessages: (sessionId: string) =>
    apiClient.get(`/chat/sessions/${sessionId}/messages`),
  
  exportSession: (sessionId: string) =>
    apiClient.get(`/chat/export/${sessionId}`),
};

// Voice
export const voiceApi = {
  process: (formData: FormData) =>
    apiClient.post('/mobile/voice', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
};

// OCR/Image
export const ocrApi = {
  process: (formData: FormData) =>
    apiClient.post('/mobile/ocr', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  
  getStatus: (taskId: string) =>
    apiClient.get(`/ocr/status?taskId=${taskId}`),
};

// Notes
export const notesApi = {
  getAll: (userId: string, category?: string, lastSync?: string) =>
    apiClient.get('/notes', { params: { userId, category, lastSync } }),
  
  create: (data: CreateNoteData) =>
    apiClient.post('/notes', data),
  
  update: (id: string, data: UpdateNoteData) =>
    apiClient.put('/notes', { id, ...data }),
  
  delete: (id: string) =>
    apiClient.delete('/notes', { params: { id } }),
  
  generate: (params: {
    topic?: string;
    conversationHistory?: any[];
    format?: string;
    autoSave?: boolean;
    category?: string;
    tags?: string[];
  }) =>
    apiClient.post('/notes/generate', params),
};

// Flashcards
export const flashcardsApi = {
  getAll: (userId: string, category?: string, reviewOnly?: boolean) =>
    apiClient.get('/flashcards', { params: { userId, category, reviewOnly } }),
  
  create: (data: CreateFlashcardData) =>
    apiClient.post('/flashcards', data),
  
  update: (id: string, data: UpdateFlashcardData) =>
    apiClient.put('/flashcards', { id, ...data }),
  
  delete: (id: string) =>
    apiClient.delete('/flashcards', { params: { id } }),
};

// Mind Maps
export const mindmapsApi = {
  getAll: (userId: string, category?: string) =>
    apiClient.get('/mindmaps', { params: { userId, category } }),
  
  create: (data: CreateMindMapData) =>
    apiClient.post('/mindmaps', data),
  
  generate: (data: { topic: string; title: string; category?: string }) =>
    apiClient.post('/mindmaps', {
      ...data,
      generateFromTopic: true,
    }),
  
  update: (id: string, data: UpdateMindMapData) =>
    apiClient.put('/mindmaps', { id, ...data }),
  
  delete: (id: string) =>
    apiClient.delete('/mindmaps', { params: { id } }),
};

// Exam
export const examApi = {
  generate: (data: {
    subject: string;
    topic: string;
    difficulty: string;
    questionTypes: Record<string, { count: number; marks: number }>;
  }) =>
    apiClient.post('/exam/generate', data),
  
  submit: (data: {
    examId: string;
    answers: Record<string, any>;
    timeSpent: number;
  }) =>
    apiClient.post('/exam', data),
  
  solvePaper: (formData: FormData) =>
    apiClient.post('/exam/solve-paper', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  
  getResults: (examId: string) =>
    apiClient.get(`/exam?examId=${examId}`),
};

// Focus Mode
export const focusApi = {
  createSession: (data: CreateFocusSessionData) =>
    apiClient.post('/focus', data),
  
  updateSession: (id: string, data: UpdateFocusSessionData) =>
    apiClient.put('/focus', { id, ...data }),
  
  getSessions: (userId: string) =>
    apiClient.get(`/focus?userId=${userId}`),
};

// Progress & Analytics
export const progressApi = {
  getUsage: (userId: string, period: string) =>
    apiClient.get(`/usage?userId=${userId}&period=${period}`),
  
  getInsights: () =>
    apiClient.get('/analytics/insights'),
};

// Achievements
export const achievementsApi = {
  getAll: (userId: string) =>
    apiClient.get(`/achievements?userId=${userId}`),
  
  check: (userId: string) =>
    apiClient.post('/achievements/check', { userId }),
  
  forceCheck: () =>
    apiClient.post('/achievements/force-check'),
};

// Learning Materials
export const learningApi = {
  getBoards: () =>
    apiClient.get('/admin/learning/boards'),
  
  getClasses: (board: string) =>
    apiClient.get(`/admin/learning/classes?board=${board}`),
  
  getSubjects: (board: string, class: string) =>
    apiClient.get(`/admin/learning/subjects?board=${board}&class=${class}`),
  
  getChapters: (board: string, class: string, subject: string) =>
    apiClient.get(`/learning/${class}/${subject}`),
  
  getChapterDetails: (chapterId: string) =>
    apiClient.get(`/learning/chapter/${chapterId}`),
};

// Profile & Settings
export const profileApi = {
  getProfile: () =>
    apiClient.get('/mobile/profile'),
  
  updateProfile: (data: UpdateProfileData) =>
    apiClient.put('/mobile/profile', data),
  
  uploadAvatar: (formData: FormData) =>
    apiClient.post('/upload/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
};

// Subscriptions & Billing
export const subscriptionApi = {
  getCurrent: () =>
    apiClient.get('/subscriptions/current'),
  
  create: (data: CreateSubscriptionData) =>
    apiClient.post('/subscriptions/create', data),
  
  update: (data: UpdateSubscriptionData) =>
    apiClient.put('/subscriptions/update', data),
  
  cancel: () =>
    apiClient.post('/subscriptions/cancel'),
  
  getInvoices: () =>
    apiClient.get('/subscriptions/invoices'),
  
  downloadInvoice: (invoiceId: string) =>
    apiClient.get(`/invoices/${invoiceId}/download`, { responseType: 'blob' }),
};
```

### 8.2 Error Handling

```typescript
// src/services/api/errorHandler.ts
export class ApiError extends Error {
  constructor(
    public code: string,
    public message: string,
    public statusCode?: number,
    public details?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export const handleApiError = (error: any): ApiError => {
  if (error.response) {
    // Server responded with error
    const { status, data } = error.response;
    return new ApiError(
      data.code || 'SERVER_ERROR',
      data.error || 'An error occurred',
      status,
      data.details
    );
  } else if (error.request) {
    // Request made but no response
    return new ApiError('NETWORK_ERROR', 'No internet connection', 0);
  } else {
    // Error in request setup
    return new ApiError('REQUEST_ERROR', error.message, 0);
  }
};
```

### 8.3 Retry Logic

```typescript
// src/utils/retry.ts
export const retryRequest = async <T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
    }
  }
  throw new Error('Max retries exceeded');
};
```

---

## 9. State Management

### 9.1 Redux Store Setup

```typescript
// src/store/store.ts
import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { combineReducers } from '@reduxjs/toolkit';

import authReducer from './slices/authSlice';
import chatReducer from './slices/chatSlice';
import notesReducer from './slices/notesSlice';
import flashcardsReducer from './slices/flashcardsSlice';
import mindmapsReducer from './slices/mindmapsSlice';
import examReducer from './slices/examSlice';
import focusReducer from './slices/focusSlice';
import progressReducer from './slices/progressSlice';
import achievementsReducer from './slices/achievementsSlice';
import learningReducer from './slices/learningSlice';
import syncReducer from './slices/syncSlice';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['auth', 'notes', 'flashcards', 'mindmaps', 'learning'], // Persist these
};

const rootReducer = combineReducers({
  auth: authReducer,
  chat: chatReducer,
  notes: notesReducer,
  flashcards: flashcardsReducer,
  mindmaps: mindmapsReducer,
  exam: examReducer,
  focus: focusReducer,
  progress: progressReducer,
  achievements: achievementsReducer,
  learning: learningReducer,
  sync: syncReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

#### 9.1.1 Additional Redux Slices

```typescript
// src/store/slices/mindmapsSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { mindmapsApi } from '../../services/api/endpoints';

export const fetchMindMaps = createAsyncThunk(
  'mindmaps/fetchMindMaps',
  async ({ userId, category }: { userId: string; category?: string }) => {
    const response = await mindmapsApi.getAll(userId, category);
    return response.data.mindMaps;
  }
);

export const generateMindMap = createAsyncThunk(
  'mindmaps/generateMindMap',
  async (data: { topic: string; title: string; category?: string }) => {
    const response = await mindmapsApi.generate(data);
    return response.data.mindMap;
  }
);

export const createMindMap = createAsyncThunk(
  'mindmaps/createMindMap',
  async (data: CreateMindMapData) => {
    const response = await mindmapsApi.create(data);
    return response.data.mindMap;
  }
);

export const updateMindMap = createAsyncThunk(
  'mindmaps/updateMindMap',
  async ({ id, ...data }: UpdateMindMapData) => {
    const response = await mindmapsApi.update(id, data);
    return response.data.mindMap;
  }
);

const mindmapsSlice = createSlice({
  name: 'mindmaps',
  initialState: {
    mindMaps: [],
    isLoading: false,
    isGenerating: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMindMaps.fulfilled, (state, action) => {
        state.mindMaps = action.payload;
      })
      .addCase(generateMindMap.pending, (state) => {
        state.isGenerating = true;
      })
      .addCase(generateMindMap.fulfilled, (state, action) => {
        state.isGenerating = false;
        state.mindMaps.push(action.payload);
      })
      .addCase(createMindMap.fulfilled, (state, action) => {
        state.mindMaps.push(action.payload);
      })
      .addCase(updateMindMap.fulfilled, (state, action) => {
        const index = state.mindMaps.findIndex(m => m.id === action.payload.id);
        if (index !== -1) {
          state.mindMaps[index] = action.payload;
        }
      });
  },
});

export default mindmapsSlice.reducer;
```

```typescript
// src/store/slices/examSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { examApi } from '../../services/api/endpoints';

export const generateExam = createAsyncThunk(
  'exam/generateExam',
  async (data: GenerateExamData) => {
    const response = await examApi.generate(data);
    return response.data;
  }
);

export const submitExam = createAsyncThunk(
  'exam/submitExam',
  async (data: SubmitExamData) => {
    const response = await examApi.submit(data);
    return response.data;
  }
);

export const solveExamPaper = createAsyncThunk(
  'exam/solvePaper',
  async (formData: FormData) => {
    const response = await examApi.solvePaper(formData);
    return response.data;
  }
);

const examSlice = createSlice({
  name: 'exam',
  initialState: {
    currentExam: null,
    questions: [],
    results: null,
    isGenerating: false,
    isSubmitting: false,
    isLoading: false,
    error: null,
  },
  reducers: {
    clearExam: (state) => {
      state.currentExam = null;
      state.questions = [];
      state.results = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(generateExam.pending, (state) => {
        state.isGenerating = true;
      })
      .addCase(generateExam.fulfilled, (state, action) => {
        state.isGenerating = false;
        state.currentExam = action.payload.examId;
        state.questions = action.payload.questions;
      })
      .addCase(submitExam.pending, (state) => {
        state.isSubmitting = true;
      })
      .addCase(submitExam.fulfilled, (state, action) => {
        state.isSubmitting = false;
        state.results = action.payload;
      })
      .addCase(solveExamPaper.fulfilled, (state, action) => {
        state.results = action.payload;
      });
  },
});

export const { clearExam } = examSlice.actions;
export default examSlice.reducer;
```

```typescript
// src/store/slices/focusSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { focusApi } from '../../services/api/endpoints';

export const createFocusSession = createAsyncThunk(
  'focus/createSession',
  async (data: CreateFocusSessionData) => {
    const response = await focusApi.createSession(data);
    return response.data.session;
  }
);

export const updateFocusSession = createAsyncThunk(
  'focus/updateSession',
  async ({ id, ...data }: UpdateFocusSessionData) => {
    const response = await focusApi.updateSession(id, data);
    return response.data.session;
  }
);

export const fetchFocusSessions = createAsyncThunk(
  'focus/fetchSessions',
  async (userId: string) => {
    const response = await focusApi.getSessions(userId);
    return response.data.sessions;
  }
);

const focusSlice = createSlice({
  name: 'focus',
  initialState: {
    currentSession: null,
    sessions: [],
    totalFocusTime: 0,
    isLoading: false,
    error: null,
  },
  reducers: {
    setCurrentSession: (state, action) => {
      state.currentSession = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createFocusSession.fulfilled, (state, action) => {
        state.currentSession = action.payload;
        state.sessions.push(action.payload);
      })
      .addCase(updateFocusSession.fulfilled, (state, action) => {
        const index = state.sessions.findIndex(s => s.id === action.payload.id);
        if (index !== -1) {
          state.sessions[index] = action.payload;
        }
        if (state.currentSession?.id === action.payload.id) {
          state.currentSession = action.payload;
        }
      })
      .addCase(fetchFocusSessions.fulfilled, (state, action) => {
        state.sessions = action.payload;
        state.totalFocusTime = action.payload.reduce((sum: number, s: any) => sum + (s.duration || 0), 0);
      });
  },
});

export const { setCurrentSession } = focusSlice.actions;
export default focusSlice.reducer;
```

```typescript
// src/store/slices/progressSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { progressApi } from '../../services/api/endpoints';

export const fetchProgress = createAsyncThunk(
  'progress/fetchProgress',
  async ({ period }: { period: string }) => {
    // This can be extended to fetch progress data
    return { period };
  }
);

export const fetchUsageData = createAsyncThunk(
  'progress/fetchUsageData',
  async ({ userId, period }: { userId: string; period: string }) => {
    const response = await progressApi.getUsage(userId, period);
    return response.data;
  }
);

export const fetchInsights = createAsyncThunk(
  'progress/fetchInsights',
  async () => {
    const response = await progressApi.getInsights();
    return response.data.insights;
  }
);

const progressSlice = createSlice({
  name: 'progress',
  initialState: {
    progress: null,
    usageData: null,
    insights: null,
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsageData.fulfilled, (state, action) => {
        state.usageData = action.payload;
      })
      .addCase(fetchInsights.fulfilled, (state, action) => {
        state.insights = action.payload;
      });
  },
});

export default progressSlice.reducer;
```

```typescript
// src/store/slices/achievementsSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { achievementsApi } from '../../services/api/endpoints';

export const fetchAchievements = createAsyncThunk(
  'achievements/fetchAchievements',
  async ({ userId }: { userId: string }) => {
    const response = await achievementsApi.getAll(userId);
    return {
      achievements: response.data.achievements,
      badges: response.data.badges,
      stats: response.data.stats,
    };
  }
);

export const checkAchievements = createAsyncThunk(
  'achievements/check',
  async ({ userId }: { userId: string }) => {
    const response = await achievementsApi.check(userId);
    return response.data;
  }
);

const achievementsSlice = createSlice({
  name: 'achievements',
  initialState: {
    achievements: [],
    badges: [],
    stats: {
      totalAchievements: 0,
      unlockedAchievements: 0,
      totalBadges: 0,
      earnedBadges: 0,
    },
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAchievements.fulfilled, (state, action) => {
        state.achievements = action.payload.achievements;
        state.badges = action.payload.badges;
        state.stats = action.payload.stats;
      })
      .addCase(checkAchievements.fulfilled, (state, action) => {
        // Update achievements and badges if new ones were unlocked
        if (action.payload.newlyUnlocked) {
          action.payload.newlyUnlocked.forEach((id: string) => {
            const achievement = state.achievements.find(a => a.id === id);
            if (achievement) {
              achievement.isUnlocked = true;
            }
          });
        }
      });
  },
});

export default achievementsSlice.reducer;
```

```typescript
// src/store/slices/learningSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { learningApi } from '../../services/api/endpoints';

export const fetchBoards = createAsyncThunk(
  'learning/fetchBoards',
  async () => {
    const response = await learningApi.getBoards();
    return response.data.boards;
  }
);

export const fetchClasses = createAsyncThunk(
  'learning/fetchClasses',
  async ({ board }: { board: string }) => {
    const response = await learningApi.getClasses(board);
    return response.data.classes;
  }
);

export const fetchSubjects = createAsyncThunk(
  'learning/fetchSubjects',
  async ({ board, class: classNum }: { board: string; class: string }) => {
    const response = await learningApi.getSubjects(board, classNum);
    return response.data.subjects;
  }
);

export const fetchChapters = createAsyncThunk(
  'learning/fetchChapters',
  async ({ board, class: classNum, subject }: { board: string; class: string; subject: string }) => {
    const response = await learningApi.getChapters(board, classNum, subject);
    return response.data.chapters;
  }
);

export const fetchChapterDetails = createAsyncThunk(
  'learning/fetchChapterDetails',
  async ({ chapterId }: { chapterId: string }) => {
    const response = await learningApi.getChapterDetails(chapterId);
    return response.data;
  }
);

const learningSlice = createSlice({
  name: 'learning',
  initialState: {
    boards: [],
    classes: [],
    subjects: [],
    chapters: [],
    chapterDetails: null,
    isLoading: false,
    error: null,
  },
  reducers: {
    clearChapters: (state) => {
      state.chapters = [];
    },
    clearChapterDetails: (state) => {
      state.chapterDetails = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBoards.fulfilled, (state, action) => {
        state.boards = action.payload;
      })
      .addCase(fetchClasses.fulfilled, (state, action) => {
        state.classes = action.payload;
      })
      .addCase(fetchSubjects.fulfilled, (state, action) => {
        state.subjects = action.payload;
      })
      .addCase(fetchChapters.fulfilled, (state, action) => {
        state.chapters = action.payload;
      })
      .addCase(fetchChapterDetails.fulfilled, (state, action) => {
        state.chapterDetails = action.payload;
      });
  },
});

export const { clearChapters, clearChapterDetails } = learningSlice.actions;
export default learningSlice.reducer;
```

### 9.2 Typed Hooks

```typescript
// src/store/hooks.ts
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './store';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
```

---

## 10. Offline Support & Data Sync

### 10.1 Sync Service

```typescript
// src/services/sync/syncService.ts
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { notesApi, flashcardsApi } from '../api/endpoints';

class SyncService {
  private syncQueue: SyncItem[] = [];
  private isSyncing = false;
  private syncInterval: NodeJS.Timeout | null = null;

  async initialize() {
    // Load sync queue from storage
    const queue = await AsyncStorage.getItem('sync_queue');
    if (queue) {
      this.syncQueue = JSON.parse(queue);
    }

    // Listen to network changes
    NetInfo.addEventListener(state => {
      if (state.isConnected && this.syncQueue.length > 0) {
        this.syncAll();
      }
    });

    // Auto-sync every 5 minutes
    this.syncInterval = setInterval(() => {
      if (this.syncQueue.length > 0) {
        this.syncAll();
      }
    }, 5 * 60 * 1000);
  }

  async queueForSync(type: SyncType, item: any) {
    const syncItem: SyncItem = {
      id: `sync_${Date.now()}`,
      type,
      action: 'create',
      data: item,
      timestamp: new Date().toISOString(),
    };

    this.syncQueue.push(syncItem);
    await this.saveQueue();

    // Try to sync immediately if online
    const netInfo = await NetInfo.fetch();
    if (netInfo.isConnected) {
      this.syncAll();
    }
  }

  async syncAll(force: boolean = false) {
    if (this.isSyncing && !force) return;
    if (this.syncQueue.length === 0) return;

    const netInfo = await NetInfo.fetch();
    if (!netInfo.isConnected) {
      console.log('No internet connection, skipping sync');
      return;
    }

    this.isSyncing = true;

    try {
      const itemsToSync = [...this.syncQueue];
      this.syncQueue = [];

      for (const item of itemsToSync) {
        try {
          await this.syncItem(item);
        } catch (error) {
          console.error(`Failed to sync item ${item.id}:`, error);
          // Re-queue failed items
          this.syncQueue.push(item);
        }
      }

      await this.saveQueue();
    } finally {
      this.isSyncing = false;
    }
  }

  private async syncItem(item: SyncItem) {
    switch (item.type) {
      case 'notes':
        if (item.action === 'create') {
          await notesApi.create(item.data);
        } else if (item.action === 'update') {
          await notesApi.update(item.data.id, item.data);
        } else if (item.action === 'delete') {
          await notesApi.delete(item.data.id);
        }
        break;
      // Similar for other types
    }
  }

  private async saveQueue() {
    await AsyncStorage.setItem('sync_queue', JSON.stringify(this.syncQueue));
  }

  getSyncStatus() {
    return {
      pendingCount: this.syncQueue.length,
      isSyncing: this.isSyncing,
      lastSyncTime: null, // Store in AsyncStorage
    };
  }
}

export const syncService = new SyncService();
```

### 10.2 Local Database (WatermelonDB)

For complex offline support, consider WatermelonDB:

```typescript
// src/database/schema.ts
import { appSchema, tableSchema } from '@nozbe/watermelondb';

export default appSchema({
  version: 1,
  tables: [
    tableSchema({
      name: 'notes',
      columns: [
        { name: 'server_id', type: 'string', isOptional: true },
        { name: 'title', type: 'string' },
        { name: 'content', type: 'string' },
        { name: 'category', type: 'string', isOptional: true },
        { name: 'sync_status', type: 'string' },
        { name: 'synced_at', type: 'number', isOptional: true },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ],
    }),
    // Similar for flashcards, exam sessions, etc.
  ],
});
```

---

## 11. UI/UX Guidelines

### 11.1 Design System

Create a consistent design system:

```typescript
// src/constants/theme.ts
export const colors = {
  primary: '#1F2937', // Gray-900
  secondary: '#4B5563', // Gray-600
  accent: '#3B82F6', // Blue-500
  success: '#10B981', // Green-500
  error: '#EF4444', // Red-500
  warning: '#F59E0B', // Amber-500
  background: '#F9FAFB', // Gray-50
  surface: '#FFFFFF',
  text: {
    primary: '#111827', // Gray-900
    secondary: '#6B7280', // Gray-500
    disabled: '#9CA3AF', // Gray-400
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const typography = {
  h1: { fontSize: 32, fontWeight: 'bold' },
  h2: { fontSize: 24, fontWeight: 'bold' },
  h3: { fontSize: 20, fontWeight: '600' },
  body: { fontSize: 16, fontWeight: '400' },
  caption: { fontSize: 12, fontWeight: '400' },
};
```

### 11.2 Component Library

Create reusable components:

```typescript
// src/components/common/Button.tsx
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors, spacing, typography } from '../../constants/theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  disabled?: boolean;
  loading?: boolean;
}

export default function Button({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
}: ButtonProps) {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        styles[variant],
        (disabled || loading) && styles.disabled,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
    >
      <Text style={[styles.text, styles[`${variant}Text`]]}>
        {loading ? 'Loading...' : title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: 8,
    alignItems: 'center',
  },
  primary: {
    backgroundColor: colors.primary,
  },
  secondary: {
    backgroundColor: colors.secondary,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    ...typography.body,
    fontWeight: '600',
  },
  primaryText: {
    color: '#FFFFFF',
  },
  secondaryText: {
    color: '#FFFFFF',
  },
  outlineText: {
    color: colors.primary,
  },
});
```

---

## 12. Testing Strategy

### 12.1 Unit Tests

```typescript
// __tests__/services/authService.test.ts
import authService from '../../src/services/auth/authService';

describe('AuthService', () => {
  it('should login successfully', async () => {
    const result = await authService.login('test@example.com', 'password');
    expect(result.success).toBe(true);
    expect(result.token).toBeDefined();
  });

  it('should handle login failure', async () => {
    const result = await authService.login('wrong@example.com', 'wrong');
    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
  });
});
```

### 12.2 Integration Tests

Test API integration and Redux flows.

### 12.3 E2E Tests

Use Detox or Appium for end-to-end testing.

---

## 13. Performance Optimization

### 13.1 Image Optimization

```typescript
// Use react-native-fast-image for better performance
import FastImage from 'react-native-fast-image';

<FastImage
  source={{ uri: imageUrl, priority: FastImage.priority.normal }}
  resizeMode={FastImage.resizeMode.contain}
/>
```

### 13.2 List Optimization

```typescript
// Use FlatList with proper optimization
<FlatList
  data={items}
  keyExtractor={(item) => item.id}
  renderItem={renderItem}
  removeClippedSubviews
  maxToRenderPerBatch={10}
  windowSize={10}
  initialNumToRender={10}
/>
```

### 13.3 Code Splitting

Use React.lazy for screen-level code splitting.

---

## 14. Deployment

### 14.1 iOS Deployment

1. Configure App Store Connect
2. Build archive: `cd ios && xcodebuild archive`
3. Upload to App Store Connect
4. Submit for review

### 14.2 Android Deployment

1. Generate signed APK/AAB
2. Upload to Google Play Console
3. Submit for review

### 14.3 CI/CD

Set up GitHub Actions or similar for automated builds and deployments.

---

## 15. Troubleshooting

### Common Issues

1. **Metro bundler errors** - Clear cache: `npm start -- --reset-cache`
2. **iOS build errors** - Run `cd ios && pod install`
3. **Android build errors** - Clean: `cd android && ./gradlew clean`
4. **Network errors** - Check API base URL and network permissions

---

## 16. Best Practices

1. **Always handle errors gracefully**
2. **Show loading states**
3. **Implement offline support**
4. **Use TypeScript for type safety**
5. **Follow React Native performance best practices**
6. **Test on real devices**
7. **Monitor app performance and crashes**
8. **Keep dependencies updated**
9. **Follow platform-specific design guidelines**
10. **Implement proper navigation structure**

---

## 📚 Additional Resources

- [React Native Documentation](https://reactnative.dev/)
- [Redux Toolkit Documentation](https://redux-toolkit.js.org/)
- [React Navigation Documentation](https://reactnavigation.org/)
- [PAATA.AI API Documentation](./MOBILE_APP_API_LIST.md)

---

## 17. Navigation Implementation

### 17.1 Navigation Structure

```typescript
// src/navigation/AppNavigator.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

// Screens
import LoginScreen from '../screens/auth/LoginScreen';
import SignupScreen from '../screens/auth/SignupScreen';
import ChatScreen from '../screens/chat/ChatScreen';
import NotesListScreen from '../screens/notes/NotesListScreen';
import FlashcardsListScreen from '../screens/flashcards/FlashcardsListScreen';
import ExamScreen from '../screens/exam/ExamScreen';
import FocusScreen from '../screens/focus/FocusScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#1F2937',
        tabBarInactiveTintColor: '#6B7280',
      }}
    >
      <Tab.Screen
        name="Chat"
        component={ChatScreen}
        options={{
          tabBarIcon: ({ color }) => <Icon name="chat" color={color} />,
        }}
      />
      <Tab.Screen
        name="Notes"
        component={NotesListScreen}
        options={{
          tabBarIcon: ({ color }) => <Icon name="notes" color={color} />,
        }}
      />
      <Tab.Screen
        name="Flashcards"
        component={FlashcardsListScreen}
        options={{
          tabBarIcon: ({ color }) => <Icon name="flashcards" color={color} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color }) => <Icon name="profile" color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Signup" component={SignupScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Main" component={MainTabs} />
            <Stack.Screen name="NoteEditor" component={NoteEditorScreen} />
            <Stack.Screen name="Exam" component={ExamScreen} />
            <Stack.Screen name="Focus" component={FocusScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

### 17.2 Deep Linking

```typescript
// src/navigation/linking.ts
export const linking = {
  prefixes: ['paataai://', 'https://paataai.com'],
  config: {
    screens: {
      Login: 'login',
      Signup: 'signup',
      Chat: 'chat/:sessionId?',
      Notes: 'notes',
      NoteEditor: 'notes/:noteId',
      Exam: 'exam/:examId',
    },
  },
};
```

## 18. Push Notifications

### 18.1 Setup

```bash
npm install @react-native-firebase/app @react-native-firebase/messaging
```

### 18.2 Implementation

```typescript
// src/services/notifications/pushNotificationService.ts
import messaging from '@react-native-firebase/messaging';
import { Platform } from 'react-native';

class PushNotificationService {
  async requestPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      const token = await messaging().getToken();
      // Send token to backend
      await this.registerDevice(token);
    }
  }

  async registerDevice(token: string) {
    // Call API to register device
    await apiClient.post('/mobile/device/register', {
      deviceId: token,
      platform: Platform.OS,
      token: token,
    });
  }

  setupListeners() {
    // Foreground messages
    messaging().onMessage(async (remoteMessage) => {
      // Show local notification
      this.showLocalNotification(remoteMessage);
    });

    // Background messages
    messaging().setBackgroundMessageHandler(async (remoteMessage) => {
      // Handle background message
    });

    // Notification opened
    messaging().onNotificationOpenedApp((remoteMessage) => {
      // Navigate to relevant screen
      this.handleNotificationNavigation(remoteMessage);
    });
  }
}

export default new PushNotificationService();
```

## 19. Biometric Authentication

### 19.1 Setup

```bash
npm install react-native-biometrics
```

### 19.2 Implementation

```typescript
// src/services/auth/biometricService.ts
import ReactNativeBiometrics from 'react-native-biometrics';

class BiometricService {
  async isAvailable(): Promise<boolean> {
    const { available } = await ReactNativeBiometrics.isSensorAvailable();
    return available;
  }

  async authenticate(): Promise<boolean> {
    try {
      const { success } = await ReactNativeBiometrics.simplePrompt({
        promptMessage: 'Confirm fingerprint',
      });
      return success;
    } catch (error) {
      return false;
    }
  }
}

export default new BiometricService();
```

## 20. File Upload Implementation

### 20.1 Image Upload

```typescript
// src/services/media/imageService.ts
import ImagePicker from 'react-native-image-picker';
import { uploadApi } from '../api/endpoints';

class ImageService {
  async pickImage(): Promise<string | null> {
    return new Promise((resolve) => {
      ImagePicker.launchImageLibrary(
        {
          mediaType: 'photo',
          quality: 0.8,
          maxWidth: 1024,
          maxHeight: 1024,
        },
        (response) => {
          if (response.uri) {
            resolve(response.uri);
          } else {
            resolve(null);
          }
        }
      );
    });
  }

  async uploadImage(uri: string, sessionId?: string): Promise<string> {
    const formData = new FormData();
    formData.append('file', {
      uri,
      type: 'image/jpeg',
      name: 'image.jpg',
    } as any);
    formData.append('fileType', 'image');
    if (sessionId) {
      formData.append('sessionId', sessionId);
    }

    const response = await uploadApi.upload(formData);
    return response.data.file.url;
  }
}

export default new ImageService();
```

### 20.2 Voice Recording

```typescript
// src/services/media/voiceService.ts
import AudioRecorderPlayer from 'react-native-audio-recorder-player';

class VoiceService {
  private recorder = new AudioRecorderPlayer();

  async startRecording(): Promise<string> {
    const path = await this.recorder.startRecorder();
    return path;
  }

  async stopRecording(): Promise<string> {
    const result = await this.recorder.stopRecorder();
    return result;
  }

  async uploadAudio(uri: string, sessionId?: string): Promise<any> {
    const formData = new FormData();
    formData.append('audio', {
      uri,
      type: 'audio/m4a',
      name: 'audio.m4a',
    } as any);
    if (sessionId) {
      formData.append('sessionId', sessionId);
    }

    const response = await voiceApi.process(formData);
    return response.data;
  }
}

export default new VoiceService();
```

## 21. Progress Tracking Implementation

### 21.1 Progress Screen

```typescript
// src/screens/progress/ProgressScreen.tsx
import React, { useEffect } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProgress } from '../../store/slices/progressSlice';
import ProgressChart from '../../components/progress/ProgressChart';

export default function ProgressScreen() {
  const dispatch = useDispatch();
  const { progress, isLoading } = useSelector((state: RootState) => state.progress);

  useEffect(() => {
    dispatch(fetchProgress({ period: '30d' }));
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Your Progress</Text>
      
      <View style={styles.statsContainer}>
        <StatCard
          label="Total Interactions"
          value={progress?.totalInteractions || 0}
          icon="chat"
        />
        <StatCard
          label="Study Streak"
          value={`${progress?.streakDays || 0} days`}
          icon="flame"
        />
        <StatCard
          label="Time Spent"
          value={progress?.totalTimeSpent || '0h 0m'}
          icon="clock"
        />
      </View>

      <ProgressChart data={progress?.dailyUsage} />
    </ScrollView>
  );
}
```

## 22. Achievements Implementation

### 22.1 Achievements Screen

```typescript
// src/screens/achievements/AchievementsScreen.tsx
import React, { useEffect } from 'react';
import { View, FlatList } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAchievements } from '../../store/slices/achievementsSlice';
import AchievementCard from '../../components/achievements/AchievementCard';

export default function AchievementsScreen() {
  const dispatch = useDispatch();
  const { achievements, badges } = useSelector((state: RootState) => state.achievements);

  useEffect(() => {
    dispatch(fetchAchievements());
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={achievements}
        renderItem={({ item }) => (
          <AchievementCard
            achievement={item}
            isUnlocked={item.isUnlocked}
            progress={item.progress}
          />
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}
```

## 23. Settings Implementation

### 23.1 Settings Screen

```typescript
// src/screens/settings/SettingsScreen.tsx
import React, { useState } from 'react';
import { View, Switch, Text } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { updateSettings } from '../../store/slices/settingsSlice';

export default function SettingsScreen() {
  const dispatch = useDispatch();
  const { settings } = useSelector((state: RootState) => state.settings);
  const [notificationsEnabled, setNotificationsEnabled] = useState(
    settings?.notifications?.enabled || false
  );

  const handleToggleNotifications = async (value: boolean) => {
    setNotificationsEnabled(value);
    await dispatch(updateSettings({
      notifications: { ...settings.notifications, enabled: value },
    }));
  };

  return (
    <View style={styles.container}>
      <View style={styles.settingRow}>
        <Text>Push Notifications</Text>
        <Switch
          value={notificationsEnabled}
          onValueChange={handleToggleNotifications}
        />
      </View>
      {/* More settings */}
    </View>
  );
}
```

## 24. Learning Materials Implementation

### 24.1 Learning Materials Screen

```typescript
// src/screens/learning/LearningMaterialsScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, FlatList, TouchableOpacity } from 'react-native';
import { fetchBoards, fetchClasses, fetchSubjects } from '../../store/slices/learningSlice';

export default function LearningMaterialsScreen() {
  const [selectedBoard, setSelectedBoard] = useState<string | null>(null);
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    if (selectedClass) {
      loadSubjects(selectedClass);
    }
  }, [selectedClass]);

  return (
    <View style={styles.container}>
      {/* Board selection */}
      {/* Class selection */}
      {/* Subjects list */}
      <FlatList
        data={subjects}
        renderItem={({ item }) => (
          <SubjectCard
            subject={item}
            onPress={() => navigation.navigate('SubjectDetails', { subjectId: item.id })}
          />
        )}
      />
    </View>
  );
}
```

## 25. Error Boundaries & Crash Handling

### 25.1 Error Boundary

```typescript
// src/components/common/ErrorBoundary.tsx
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    // Log to crash reporting service
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <Text style={styles.title}>Something went wrong</Text>
          <Text style={styles.message}>{this.state.error?.message}</Text>
          <TouchableOpacity onPress={() => this.setState({ hasError: false, error: null })}>
            <Text>Try Again</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return this.props.children;
  }
}
```

## 26. Analytics Implementation

### 26.1 Analytics Service

```typescript
// src/services/analytics/analyticsService.ts
class AnalyticsService {
  trackEvent(eventName: string, properties?: Record<string, any>) {
    // Track to analytics platform
    // Example: Firebase Analytics, Mixpanel, etc.
  }

  trackScreen(screenName: string) {
    this.trackEvent('screen_view', { screen_name: screenName });
  }

  trackUserAction(action: string, details?: Record<string, any>) {
    this.trackEvent('user_action', { action, ...details });
  }
}

export default new AnalyticsService();
```

## 27. Performance Monitoring

### 27.1 Performance Tracking

```typescript
// src/utils/performance.ts
export const trackPerformance = (name: string, fn: () => Promise<any>) => {
  const start = performance.now();
  return fn().finally(() => {
    const duration = performance.now() - start;
    console.log(`${name} took ${duration}ms`);
    // Send to analytics
  });
};
```

## 28. Security Best Practices

### 28.1 Secure Storage

- Use Keychain (iOS) / Keystore (Android) for sensitive data
- Never store passwords in plain text
- Encrypt local database
- Use certificate pinning for API calls

### 28.2 Code Obfuscation

- Enable ProGuard (Android)
- Enable code obfuscation (iOS)
- Remove debug code in production

## 29. Accessibility

### 29.1 Accessibility Implementation

```typescript
<TouchableOpacity
  accessible={true}
  accessibilityLabel="Login button"
  accessibilityHint="Double tap to login"
  accessibilityRole="button"
>
  <Text>Login</Text>
</TouchableOpacity>
```

## 30. Internationalization (i18n)

### 30.1 Setup

```bash
npm install react-i18next i18next
```

### 30.2 Implementation

```typescript
// src/i18n/index.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: require('./locales/en.json') },
    hi: { translation: require('./locales/hi.json') },
  },
  lng: 'en',
  fallbackLng: 'en',
});
```

---

## 📝 Complete Feature List

### ✅ All Features Covered in This Guide

#### 🤖 AI-Powered Features
1. **AI Chat Interface**
   - Text-based chat with conversation history
   - Voice input with speech-to-text
   - Image upload with OCR
   - PDF upload and extraction
   - Context-aware responses
   - Multiple conversation modes (standard, reasoning, explain_why)
   - Session management and export

2. **AI Notes Generation**
   - Generate from topic (structured, outline, summary formats)
   - Generate from conversation history
   - Auto-save option
   - Category and tag management
   - Markdown formatting support
   - Scientific notation rendering

3. **AI Mind Map Generation**
   - Generate comprehensive mind maps from topics
   - Hierarchical structure (central topic → branches → sub-branches → sub-sub-branches)
   - Manual creation and editing
   - Color customization
   - Category organization

4. **AI Exam Generation**
   - Custom exam generation by subject and topic
   - Multiple question types: MCQ (1 mark), Short Answer (2 marks), Long Answer (5 marks), Essay (10 marks)
   - Difficulty levels: Easy, Medium, Hard
   - Configurable question counts per type
   - Exam taking interface with timer
   - Results with detailed explanations
   - Exam paper solver (upload PDF/image, get solutions)

#### 📚 Learning Tools
5. **Notes Management**
   - Create, edit, delete notes
   - Search and filter by category
   - Tag system
   - Markdown support
   - Scientific notation rendering
   - Offline support

6. **Flashcards**
   - Create flashcards with question/answer
   - Review mode with spaced repetition
   - Mastery tracking (25%, 50%, 75%, 100%)
   - Category and difficulty levels
   - Review-only filtering

7. **Focus Mode (Pomodoro)**
   - Customizable timer durations (15, 25, 45, 60 minutes)
   - Start, pause, resume, reset
   - Session tracking
   - Total focus time statistics

8. **Learning Materials**
   - Board selection (CBSE, ICSE, etc.)
   - Class-based organization (1-12)
   - Subject-wise content
   - Chapter-level organization
   - PDF viewer integration
   - Video player integration
   - Chapter-based AI chat

#### 📊 Progress & Analytics
9. **Progress Dashboard**
   - Total interactions count
   - Study time tracking
   - Learning streak
   - Average session time
   - Weekly activity charts
   - Subject breakdown
   - Smart learning activity stats

10. **Achievements System**
    - Achievement unlocking
    - Progress tracking per achievement
    - Badge system with rarity levels
    - Achievement categories (study, streak, mastery, exam, milestone)
    - Stats dashboard

#### 🔐 Authentication & Profile
11. **Authentication**
    - Email/password login
    - Sign up with email verification
    - Password reset
    - Token refresh
    - Biometric authentication
    - Device tracking

12. **Profile Management**
    - Profile information
    - Avatar upload
    - Class and board preferences
    - Settings management
    - Subscription management

#### 💳 Subscriptions & Billing
13. **Subscription Management**
    - View current plan
    - Upgrade/downgrade plans
    - Cancel subscription
    - Invoice history
    - Download invoices

#### 🔔 Notifications
14. **Push Notifications**
    - Achievement unlocks
    - Streak reminders
    - Study reminders
    - Feature updates

#### 📱 Mobile-Specific Features
15. **Offline Support**
    - Offline note creation
    - Offline flashcard review
    - Sync queue management
    - Automatic sync when online

16. **File Handling**
    - Image picker
    - PDF picker
    - Document picker
    - File upload with progress
    - OCR processing

17. **Voice Features**
    - Voice recording
    - Speech-to-text
    - Text-to-speech (TTS)
    - Voice input for chat

#### 🎨 UI/UX Features
18. **Navigation**
    - Bottom tab navigation
    - Stack navigation
    - Drawer navigation
    - Deep linking support

19. **Accessibility**
    - Screen reader support
    - Accessibility labels
    - Keyboard navigation
    - High contrast support

20. **Internationalization**
    - Multi-language support
    - RTL support
    - Locale-based formatting

---

## 📝 Implementation Checklist

### Phase 1: Foundation (Week 1-2)
- [ ] Project setup and configuration
- [ ] Navigation structure
- [ ] Authentication flow
- [ ] API client setup
- [ ] Redux store configuration
- [ ] Basic UI components

### Phase 2: Core Features (Week 3-5)
- [ ] Chat feature with multi-modal input (text, voice, image)
- [ ] AI-powered notes generation (from topic and conversation)
- [ ] Notes management (CRUD, search, categories, tags)
- [ ] Flashcards with mastery tracking
- [ ] AI-powered mind map generation
- [ ] Mind map creation and editing
- [ ] Profile screen
- [ ] Settings screen

### Phase 3: Advanced Features (Week 6-8)
- [ ] AI-powered exam generation (all question types)
- [ ] Exam taking interface with timer
- [ ] Exam results and explanations
- [ ] Exam paper solver (PDF/image upload)
- [ ] Focus mode (Pomodoro timer)
- [ ] Progress dashboard with analytics
- [ ] Achievements and badges system
- [ ] Learning materials (boards, classes, subjects, chapters)
- [ ] PDF and video viewers

### Phase 4: Polish (Week 9-10)
- [ ] Offline support
- [ ] Data sync
- [ ] Push notifications
- [ ] Performance optimization
- [ ] Testing
- [ ] Bug fixes

### Phase 5: Launch (Week 11-12)
- [ ] App Store submission
- [ ] Play Store submission
- [ ] Marketing materials
- [ ] User documentation

---

## 🎯 Key Success Metrics

1. **Performance**
   - App launch time < 2 seconds
   - Screen transition < 300ms
   - API response handling < 1 second

2. **Reliability**
   - Crash rate < 0.1%
   - API success rate > 99%
   - Sync success rate > 95%

3. **User Experience**
   - Smooth animations (60 FPS)
   - Offline functionality
   - Intuitive navigation

---

**Last Updated:** January 2024  
**Version:** 1.0.0


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
8. [API Integration](#8-api-integration)
9. [State Management](#9-state-management)
10. [Offline Support & Data Sync](#10-offline-support--data-sync)
11. [UI/UX Guidelines](#11-uiux-guidelines)
12. [Testing Strategy](#12-testing-strategy)
13. [Performance Optimization](#13-performance-optimization)
14. [Deployment](#14-deployment)
15. [Troubleshooting](#15-troubleshooting)
16. [Best Practices](#16-best-practices)

---

## 1. Project Overview

### 1.1 Application Purpose

PAATA.AI Mobile App is a native mobile application that provides:

- **AI-Powered Homework Assistance** - Interactive chat with AI for instant help
- **Smart Learning Tools** - Notes, flashcards, mind maps, exam preparation
- **Progress Tracking** - Analytics and insights into learning habits
- **Gamification** - Achievements, badges, and streaks
- **Offline Support** - Work offline and sync when online
- **Multi-Modal Input** - Text, voice, and image support

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

### 7.2 Notes Feature

#### 7.2.1 Notes List Screen

```typescript
// src/screens/notes/NotesListScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, FlatList, TouchableOpacity, Text } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchNotes, createNote } from '../../store/slices/notesSlice';
import NoteCard from '../../components/notes/NoteCard';

export default function NotesListScreen({ navigation }: any) {
  const dispatch = useDispatch();
  const { notes, isLoading } = useSelector((state: RootState) => state.notes);
  const { user } = useSelector((state: RootState) => state.auth);
  const [category, setCategory] = useState<string | undefined>();

  useEffect(() => {
    if (user) {
      dispatch(fetchNotes({ userId: user.id, category }));
    }
  }, [user, category]);

  const handleCreateNote = () => {
    navigation.navigate('NoteEditor', { mode: 'create' });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Notes</Text>
        <TouchableOpacity onPress={handleCreateNote}>
          <Text>+ New Note</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={notes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <NoteCard
            note={item}
            onPress={() => navigation.navigate('NoteEditor', { noteId: item.id })}
          />
        )}
        refreshing={isLoading}
        onRefresh={() => dispatch(fetchNotes({ userId: user!.id, category }))}
      />
    </View>
  );
}
```

#### 7.2.2 Notes Redux Slice

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
    // Create locally first
    const localNote = { ...data, id: `local_${Date.now()}`, syncStatus: 'pending' };
    
    // Try to sync immediately if online
    try {
      const response = await notesApi.create(data);
      return { ...response.data.note, syncStatus: 'synced' };
    } catch (error) {
      // If offline, queue for sync
      await syncService.queueForSync('notes', localNote);
      return localNote;
    }
  }
);

const notesSlice = createSlice({
  name: 'notes',
  initialState: {
    notes: [],
    isLoading: false,
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
      .addCase(fetchNotes.fulfilled, (state, action) => {
        state.notes = action.payload;
      })
      .addCase(createNote.fulfilled, (state, action) => {
        state.notes.push(action.payload);
      });
  },
});

export const { updateLocalNote } = notesSlice.actions;
export default notesSlice.reducer;
```

### 7.3 Flashcards Feature

Similar pattern to Notes - implement CRUD operations with offline support.

### 7.4 Exam Mode Feature

```typescript
// src/screens/exam/ExamScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useDispatch } from 'react-redux';
import { generateExam, submitExam } from '../../store/slices/examSlice';

export default function ExamScreen({ route }: any) {
  const { subject, topic, difficulty } = route.params;
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeSpent, setTimeSpent] = useState(0);
  const dispatch = useDispatch();

  useEffect(() => {
    loadExam();
    startTimer();
  }, []);

  const loadExam = async () => {
    const result = await dispatch(generateExam({ subject, topic, difficulty })).unwrap();
    setQuestions(result.questions);
  };

  const handleSubmit = async () => {
    const result = await dispatch(submitExam({
      examId: questions[0].examId,
      answers,
      timeSpent,
    })).unwrap();
    
    // Navigate to results screen
  };

  return (
    <View style={styles.container}>
      <Text>Question {currentQuestion + 1} of {questions.length}</Text>
      <Text>{questions[currentQuestion]?.question}</Text>
      {/* Render options */}
      <TouchableOpacity onPress={handleSubmit}>
        <Text>Submit</Text>
      </TouchableOpacity>
    </View>
  );
}
```

### 7.5 Focus Mode (Pomodoro)

```typescript
// src/screens/focus/FocusScreen.tsx
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useDispatch } from 'react-redux';
import { createFocusSession, updateFocusSession } from '../../store/slices/focusSlice';

export default function FocusScreen() {
  const [duration, setDuration] = useState(1500); // 25 minutes
  const [isRunning, setIsRunning] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(duration);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const dispatch = useDispatch();

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
    const session = await dispatch(createFocusSession({
      duration,
      mode: 'pomodoro',
      status: 'active',
    })).unwrap();
    
    setIsRunning(true);
  };

  const handleComplete = async () => {
    setIsRunning(false);
    await dispatch(updateFocusSession({
      id: sessionId,
      status: 'completed',
      completedAt: new Date().toISOString(),
    }));
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.timer}>{formatTime(timeRemaining)}</Text>
      <TouchableOpacity onPress={isRunning ? handlePause : handleStart}>
        <Text>{isRunning ? 'Pause' : 'Start'}</Text>
      </TouchableOpacity>
    </View>
  );
}
```

---

## 8. API Integration

### 8.1 API Service Structure

See `MOBILE_APP_API_LIST.md` for complete API reference.

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
import examReducer from './slices/examSlice';
import focusReducer from './slices/focusSlice';
import syncReducer from './slices/syncSlice';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['auth', 'notes', 'flashcards'], // Only persist these
};

const rootReducer = combineReducers({
  auth: authReducer,
  chat: chatReducer,
  notes: notesReducer,
  flashcards: flashcardsReducer,
  exam: examReducer,
  focus: focusReducer,
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

## 📝 Implementation Checklist

### Phase 1: Foundation (Week 1-2)
- [ ] Project setup and configuration
- [ ] Navigation structure
- [ ] Authentication flow
- [ ] API client setup
- [ ] Redux store configuration
- [ ] Basic UI components

### Phase 2: Core Features (Week 3-5)
- [ ] Chat feature
- [ ] Notes feature
- [ ] Flashcards feature
- [ ] Profile screen
- [ ] Settings screen

### Phase 3: Advanced Features (Week 6-8)
- [ ] Exam mode
- [ ] Focus mode
- [ ] Mind maps
- [ ] Progress tracking
- [ ] Achievements

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


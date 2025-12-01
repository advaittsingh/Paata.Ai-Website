# 🔔 Mobile App Notifications Implementation Guide

## Overview

This document provides a comprehensive guide for implementing notifications in the PAATA.AI mobile app. Notifications sent from the admin panel should appear in the mobile app, allowing users to stay updated on achievements, system updates, reminders, and more.

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Data Models & Structure](#data-models--structure)
3. [API Endpoints](#api-endpoints)
4. [Screen Implementations](#screen-implementations)
5. [Component Implementations](#component-implementations)
6. [State Management](#state-management)
7. [Features & Functionality](#features--functionality)
8. [Push Notifications Integration](#push-notifications-integration)
9. [Polling & Auto-Refresh](#polling--auto-refresh)
10. [UI/UX Guidelines](#uiux-guidelines)
11. [Implementation Checklist](#implementation-checklist)

---

## Architecture Overview

### Notification Flow

```
Admin Panel → API → Database → Mobile App API → Redux Store → UI Components
     ↓              ↓              ↓                  ↓              ↓
  Send         Create         Store            Fetch & Cache    Display
  Notification Notification  Notification      Notifications    Badge/List
```

### Key Components

1. **Notifications Screen**: Main screen to view all notifications
2. **Notification Badge**: Unread count indicator in navigation
3. **Notification Item**: Individual notification display component
4. **Notification Service**: API service for fetching/managing notifications
5. **Push Notification Handler**: Handle push notifications from Firebase/APNs

---

## Data Models & Structure

### Notification Model

```typescript
interface Notification {
  id: string;
  type: 'system' | 'achievement' | 'reminder' | 'update' | 'exam' | 'subscription';
  title: string;
  message: string;
  icon?: string;
  read: boolean;
  readAt?: string;
  createdAt: string;
  metadata?: {
    achievementId?: string;
    examId?: string;
    subscriptionId?: string;
    [key: string]: any;
  };
}
```

### Notification State Model

```typescript
interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
  lastFetchedAt: number | null;
  filters: {
    type: string | null;
    read: boolean | null;
  };
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

#### 1. Get Notifications
```http
GET /api/notifications?type={type}&read={boolean}&limit={limit}&offset={offset}
```

**Query Parameters:**
- `type` (optional): Filter by type (`system`, `achievement`, `reminder`, `update`, `exam`, `subscription`)
- `read` (optional): Filter by read status (`true` or `false`)
- `limit` (optional): Number of notifications to return (default: 50)
- `offset` (optional): Pagination offset (default: 0)

**Response:**
```json
{
  "success": true,
  "notifications": [
    {
      "id": "notif_123",
      "type": "system",
      "title": "System Update",
      "message": "We've added new features!",
      "icon": "🔔",
      "read": false,
      "readAt": null,
      "createdAt": "2024-01-15T10:00:00.000Z",
      "metadata": null
    }
  ],
  "unreadCount": 5
}
```

#### 2. Mark Notification as Read
```http
PUT /api/notifications
Content-Type: application/json

{
  "id": "notif_123",
  "read": true
}
```

**Response:**
```json
{
  "success": true,
  "message": "Notification marked as read"
}
```

#### 3. Mark All as Read
```http
PUT /api/notifications
Content-Type: application/json

{
  "markAll": true
}
```

**Response:**
```json
{
  "success": true,
  "message": "All notifications marked as read",
  "count": 5
}
```

#### 4. Delete Notification
```http
DELETE /api/notifications?id={notificationId}
```

**Response:**
```json
{
  "success": true,
  "message": "Notification deleted"
}
```

---

## Screen Implementations

### 1. Notifications Screen

**File:** `src/screens/notifications/NotificationsScreen.tsx`

**Purpose:** Main screen to display and manage notifications.

**Implementation:**

```typescript
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { colors, spacing, typography, borderRadius, shadows } from '../../constants/theme';
import {
  fetchNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  setFilter,
} from '../../store/slices/notificationSlice';
import NotificationItem from '../../components/notifications/NotificationItem';
import FilterTabs from '../../components/notifications/FilterTabs';
import { BellIcon, CheckIcon } from 'react-native-heroicons/outline';

export default function NotificationsScreen() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const {
    notifications,
    unreadCount,
    isLoading,
    isRefreshing,
    error,
    filters,
  } = useSelector((state: RootState) => state.notifications);

  // Fetch notifications on mount and when screen is focused
  useFocusEffect(
    useCallback(() => {
      dispatch(fetchNotifications());
    }, [dispatch])
  );

  const handleRefresh = useCallback(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  const handleMarkAsRead = async (id: string) => {
    try {
      await dispatch(markAsRead(id)).unwrap();
    } catch (error) {
      Alert.alert('Error', 'Failed to mark notification as read');
    }
  };

  const handleMarkAllAsRead = async () => {
    Alert.alert(
      'Mark All as Read',
      'Are you sure you want to mark all notifications as read?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Mark All',
          onPress: async () => {
            try {
              await dispatch(markAllAsRead()).unwrap();
            } catch (error) {
              Alert.alert('Error', 'Failed to mark all as read');
            }
          },
        },
      ]
    );
  };

  const handleDelete = async (id: string) => {
    Alert.alert(
      'Delete Notification',
      'Are you sure you want to delete this notification?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await dispatch(deleteNotification(id)).unwrap();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete notification');
            }
          },
        },
      ]
    );
  };

  const handleFilterChange = (filter: { type: string | null; read: boolean | null }) => {
    dispatch(setFilter(filter));
    dispatch(fetchNotifications());
  };

  const formatTimeAgo = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  const renderNotification = ({ item }: { item: Notification }) => (
    <NotificationItem
      notification={item}
      onPress={() => handleMarkAsRead(item.id)}
      onDelete={() => handleDelete(item.id)}
      formatTimeAgo={formatTimeAgo}
    />
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <BellIcon size={64} color={colors.gray400} />
      <Text style={styles.emptyTitle}>No notifications</Text>
      <Text style={styles.emptyText}>
        {filters.read === false
          ? "You're all caught up! No unread notifications."
          : 'You have no notifications yet.'}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Notifications</Text>
          {unreadCount > 0 && (
            <Text style={styles.headerSubtitle}>
              {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
            </Text>
          )}
        </View>
        {unreadCount > 0 && (
          <TouchableOpacity
            style={styles.markAllButton}
            onPress={handleMarkAllAsRead}
          >
            <CheckIcon size={20} color={colors.primary} />
            <Text style={styles.markAllText}>Mark all</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Filter Tabs */}
      <FilterTabs
        currentFilter={filters}
        onFilterChange={handleFilterChange}
      />

      {/* Notifications List */}
      <FlatList
        data={notifications}
        renderItem={renderNotification}
        keyExtractor={(item) => item.id}
        contentContainerStyle={
          notifications.length === 0 ? styles.emptyListContainer : styles.listContainer
        }
        ListEmptyComponent={renderEmptyState}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={colors.primary}
          />
        }
        onEndReached={() => {
          // Load more notifications if needed
          if (!isLoading && notifications.length > 0) {
            // Implement pagination
          }
        }}
        onEndReachedThreshold={0.5}
      />

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
    ...shadows.sm,
  },
  headerTitle: {
    ...typography.h2,
    color: colors.textPrimary,
  },
  headerSubtitle: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  markAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.sm,
    borderRadius: borderRadius.medium,
    backgroundColor: colors.gray100,
  },
  markAllText: {
    ...typography.bodySmall,
    color: colors.primary,
    marginLeft: spacing.xs,
    fontWeight: '600',
  },
  listContainer: {
    padding: spacing.md,
  },
  emptyListContainer: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xxl,
  },
  emptyTitle: {
    ...typography.h3,
    color: colors.textPrimary,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  emptyText: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  errorContainer: {
    padding: spacing.md,
    backgroundColor: colors.red50,
    borderTopWidth: 1,
    borderTopColor: colors.red200,
  },
  errorText: {
    ...typography.bodySmall,
    color: colors.red600,
    textAlign: 'center',
  },
});
```

### 2. Notification Item Component

**File:** `src/components/notifications/NotificationItem.tsx`

**Purpose:** Display individual notification with actions.

**Implementation:**

```typescript
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, spacing, typography, borderRadius, shadows } from '../../constants/theme';
import { Notification } from '../../types/notifications';
import { TrashIcon } from 'react-native-heroicons/outline';

interface NotificationItemProps {
  notification: Notification;
  onPress: () => void;
  onDelete: () => void;
  formatTimeAgo: (dateString: string) => string;
}

export default function NotificationItem({
  notification,
  onPress,
  onDelete,
  formatTimeAgo,
}: NotificationItemProps) {
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'achievement':
        return colors.yellow500;
      case 'exam':
        return colors.blue500;
      case 'subscription':
        return colors.green500;
      case 'reminder':
        return colors.orange500;
      default:
        return colors.primary;
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        !notification.read && styles.unreadContainer,
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        {/* Icon */}
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: getTypeColor(notification.type) + '20' },
          ]}
        >
          <Text style={styles.icon}>{notification.icon || '🔔'}</Text>
        </View>

        {/* Text Content */}
        <View style={styles.textContainer}>
          <View style={styles.headerRow}>
            <Text style={styles.title} numberOfLines={1}>
              {notification.title}
            </Text>
            {!notification.read && <View style={styles.unreadDot} />}
          </View>
          <Text style={styles.message} numberOfLines={2}>
            {notification.message}
          </Text>
          <Text style={styles.time}>{formatTimeAgo(notification.createdAt)}</Text>
        </View>

        {/* Delete Button */}
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={onDelete}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <TrashIcon size={18} color={colors.gray400} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.large,
    padding: spacing.md,
    marginBottom: spacing.sm,
    ...shadows.sm,
  },
  unreadContainer: {
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
    backgroundColor: colors.primary + '05',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  icon: {
    fontSize: 24,
  },
  textContainer: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  title: {
    ...typography.body,
    fontWeight: '600',
    color: colors.textPrimary,
    flex: 1,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    marginLeft: spacing.xs,
  },
  message: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  time: {
    ...typography.caption,
    color: colors.textTertiary,
  },
  deleteButton: {
    padding: spacing.xs,
    marginLeft: spacing.sm,
  },
});
```

### 3. Filter Tabs Component

**File:** `src/components/notifications/FilterTabs.tsx`

**Purpose:** Filter notifications by type and read status.

**Implementation:**

```typescript
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { colors, spacing, typography, borderRadius } from '../../constants/theme';

interface FilterTabsProps {
  currentFilter: {
    type: string | null;
    read: boolean | null;
  };
  onFilterChange: (filter: { type: string | null; read: boolean | null }) => void;
}

const FILTERS = [
  { id: 'all', label: 'All', filter: { type: null, read: null } },
  { id: 'unread', label: 'Unread', filter: { type: null, read: false } },
  { id: 'system', label: 'System', filter: { type: 'system', read: null } },
  { id: 'achievement', label: 'Achievements', filter: { type: 'achievement', read: null } },
  { id: 'exam', label: 'Exams', filter: { type: 'exam', read: null } },
];

export default function FilterTabs({ currentFilter, onFilterChange }: FilterTabsProps) {
  const getActiveFilterId = () => {
    const match = FILTERS.find(
      (f) =>
        f.filter.type === currentFilter.type && f.filter.read === currentFilter.read
    );
    return match?.id || 'all';
  };

  const activeFilterId = getActiveFilterId();

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {FILTERS.map((filter) => {
          const isActive = activeFilterId === filter.id;
          return (
            <TouchableOpacity
              key={filter.id}
              style={[styles.tab, isActive && styles.activeTab]}
              onPress={() => onFilterChange(filter.filter)}
            >
              <Text style={[styles.tabText, isActive && styles.activeTabText]}>
                {filter.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  scrollContent: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  tab: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    backgroundColor: colors.gray100,
    marginRight: spacing.sm,
  },
  activeTab: {
    backgroundColor: colors.primary,
  },
  tabText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  activeTabText: {
    color: colors.white,
    fontWeight: '600',
  },
});
```

---

## State Management

### Redux Slice

**File:** `src/store/slices/notificationSlice.ts`

```typescript
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { notificationApi } from '../../api/endpoints';

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
  lastFetchedAt: number | null;
  filters: {
    type: string | null;
    read: boolean | null;
  };
}

const initialState: NotificationState = {
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  isRefreshing: false,
  error: null,
  lastFetchedAt: null,
  filters: {
    type: null,
    read: null,
  },
};

export const fetchNotifications = createAsyncThunk(
  'notifications/fetchNotifications',
  async (_, { getState }) => {
    const state = getState() as RootState;
    const { filters } = state.notifications;
    
    const params = new URLSearchParams();
    if (filters.type) params.append('type', filters.type);
    if (filters.read !== null) params.append('read', filters.read.toString());
    params.append('limit', '50');
    
    const response = await notificationApi.getNotifications(params.toString());
    return response;
  }
);

export const markAsRead = createAsyncThunk(
  'notifications/markAsRead',
  async (id: string) => {
    await notificationApi.markAsRead(id);
    return id;
  }
);

export const markAllAsRead = createAsyncThunk(
  'notifications/markAllAsRead',
  async () => {
    const response = await notificationApi.markAllAsRead();
    return response;
  }
);

export const deleteNotification = createAsyncThunk(
  'notifications/deleteNotification',
  async (id: string) => {
    await notificationApi.deleteNotification(id);
    return id;
  }
);

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    setFilter: (state, action: PayloadAction<{ type: string | null; read: boolean | null }>) => {
      state.filters = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch notifications
      .addCase(fetchNotifications.pending, (state) => {
        if (state.notifications.length === 0) {
          state.isLoading = true;
        } else {
          state.isRefreshing = true;
        }
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isRefreshing = false;
        state.notifications = action.payload.notifications;
        state.unreadCount = action.payload.unreadCount;
        state.lastFetchedAt = Date.now();
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.isLoading = false;
        state.isRefreshing = false;
        state.error = action.error.message || 'Failed to fetch notifications';
      })
      // Mark as read
      .addCase(markAsRead.fulfilled, (state, action) => {
        const notification = state.notifications.find((n) => n.id === action.payload);
        if (notification) {
          notification.read = true;
          notification.readAt = new Date().toISOString();
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
      })
      // Mark all as read
      .addCase(markAllAsRead.fulfilled, (state) => {
        state.notifications.forEach((n) => {
          n.read = true;
          n.readAt = new Date().toISOString();
        });
        state.unreadCount = 0;
      })
      // Delete notification
      .addCase(deleteNotification.fulfilled, (state, action) => {
        const notification = state.notifications.find((n) => n.id === action.payload);
        if (notification && !notification.read) {
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
        state.notifications = state.notifications.filter((n) => n.id !== action.payload);
      });
  },
});

export const { setFilter, clearError } = notificationSlice.actions;
export default notificationSlice.reducer;
```

### API Service

**File:** `src/api/endpoints/notificationApi.ts`

```typescript
import { apiClient } from '../client';

export const notificationApi = {
  getNotifications: async (queryParams: string = '') => {
    const response = await apiClient.get(`/notifications?${queryParams}`);
    return response.data;
  },

  markAsRead: async (id: string) => {
    const response = await apiClient.put('/notifications', { id, read: true });
    return response.data;
  },

  markAllAsRead: async () => {
    const response = await apiClient.put('/notifications', { markAll: true });
    return response.data;
  },

  deleteNotification: async (id: string) => {
    const response = await apiClient.delete(`/notifications?id=${id}`);
    return response.data;
  },
};
```

---

## Features & Functionality

### 1. Notification Badge in Navigation

**File:** `src/components/navigation/TabBar.tsx`

Add unread count badge to notifications tab:

```typescript
import { useSelector } from 'react-redux';
import { Badge } from 'react-native-elements';

// In your tab bar component
const { unreadCount } = useSelector((state: RootState) => state.notifications);

<Tab.Screen
  name="Notifications"
  component={NotificationsScreen}
  options={{
    tabBarIcon: ({ color, size }) => (
      <View>
        <BellIcon size={size} color={color} />
        {unreadCount > 0 && (
          <Badge
            value={unreadCount > 99 ? '99+' : unreadCount}
            status="error"
            containerStyle={{ position: 'absolute', top: -4, right: -4 }}
          />
        )}
      </View>
    ),
  }}
/>
```

### 2. Auto-Refresh on App Focus

**File:** `src/App.tsx`

```typescript
import { AppState } from 'react-native';
import { useDispatch } from 'react-redux';
import { fetchNotifications } from './store/slices/notificationSlice';

useEffect(() => {
  const subscription = AppState.addEventListener('change', (nextAppState) => {
    if (nextAppState === 'active') {
      // Refresh notifications when app comes to foreground
      dispatch(fetchNotifications());
    }
  });

  return () => subscription.remove();
}, []);
```

---

## Polling & Auto-Refresh

### Background Polling Service

**File:** `src/services/notifications/pollingService.ts`

```typescript
import { AppState } from 'react-native';
import { store } from '../../store';
import { fetchNotifications } from '../../store/slices/notificationSlice';

class NotificationPollingService {
  private intervalId: NodeJS.Timeout | null = null;
  private pollInterval = 60000; // 1 minute

  startPolling() {
    if (this.intervalId) return;

    this.intervalId = setInterval(() => {
      const state = AppState.currentState;
      if (state === 'active') {
        store.dispatch(fetchNotifications());
      }
    }, this.pollInterval);
  }

  stopPolling() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  setPollInterval(interval: number) {
    this.pollInterval = interval;
    this.stopPolling();
    this.startPolling();
  }
}

export default new NotificationPollingService();
```

---

## Implementation Checklist

### Phase 1: Core Implementation
- [ ] Create notification Redux slice
- [ ] Implement notification API service
- [ ] Create NotificationsScreen
- [ ] Create NotificationItem component
- [ ] Add navigation route for notifications

### Phase 2: Features
- [ ] Add filter tabs (All, Unread, by Type)
- [ ] Implement mark as read functionality
- [ ] Implement mark all as read
- [ ] Implement delete notification
- [ ] Add pull-to-refresh

### Phase 3: UI/UX
- [ ] Add notification badge to tab bar
- [ ] Add empty state
- [ ] Add loading states
- [ ] Add error handling
- [ ] Style notifications with proper colors

### Phase 4: Auto-Refresh
- [ ] Implement polling service
- [ ] Refresh on app focus
- [ ] Refresh on screen focus
- [ ] Optimize polling frequency

### Phase 5: Push Notifications (Optional)
- [ ] Integrate Firebase/APNs
- [ ] Handle push notification received
- [ ] Navigate to notification on tap
- [ ] Update badge count from push

---

**Last Updated:** 2024  
**Maintained By:** PAATA.AI Development Team




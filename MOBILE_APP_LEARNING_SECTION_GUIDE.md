# 📚 Mobile App Learning Section Implementation Guide

## Overview

This document provides a comprehensive guide for implementing the Learning Materials section in the PAATA.AI mobile app. The learning section allows students to access structured educational content organized by Board → Class → Subject → Chapter, with PDFs, videos, and AI-powered chat assistance.

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Data Models & Structure](#data-models--structure)
3. [API Endpoints](#api-endpoints)
4. [Screen Implementations](#screen-implementations)
5. [Navigation Flow](#navigation-flow)
6. [State Management](#state-management)
7. [Features & Functionality](#features--functionality)
8. [UI/UX Guidelines](#uiux-guidelines)
9. [Offline Support](#offline-support)
10. [Performance Optimization](#performance-optimization)
11. [Implementation Checklist](#implementation-checklist)

---

## Architecture Overview

### Hierarchical Structure

```
Board (CBSE, ICSE, State Board)
  └── Class (1, 2, 3, ..., 12)
      └── Subject (Mathematics, Science, English, etc.)
          └── Chapter (Chapter 1, Chapter 2, etc.)
              ├── Videos (Video lessons)
              ├── PDFs (Study materials)
              └── AI Chat (Chapter-specific assistance)
```

### Key Features

- **Multi-level Navigation**: Board → Class → Subject → Chapter
- **Content Types**: Videos, PDFs, and AI chat
- **Personalization**: User preferences for board and class
- **Search Functionality**: Search across subjects and chapters
- **Progress Tracking**: Track viewed videos and read PDFs
- **Offline Support**: Download content for offline access
- **AI Integration**: Chapter-specific AI chat assistance

---

## Data Models & Structure

### Database Schema

```typescript
// Board Model
interface Board {
  id: string;
  name: string;        // "CBSE", "ICSE", "State Board"
  code: string;        // "cbse", "icse"
  createdAt: Date;
  updatedAt: Date;
}

// Class Model
interface Class {
  id: string;
  boardId: string;
  number: string;      // "1", "2", "3", ..., "12"
  name?: string;       // "Class 1", "Class 2"
  createdAt: Date;
  updatedAt: Date;
}

// Subject Model
interface Subject {
  id: string;
  classId: string;
  name: string;        // "Mathematics", "Science", "English"
  slug: string;        // "mathematics", "science"
  description?: string;
  icon?: string;       // FontAwesome icon class
  color?: string;      // Color code for UI
  createdAt: Date;
  updatedAt: Date;
}

// Chapter Model
interface Chapter {
  id: string;
  subjectId: string;
  title: string;       // "Introduction to Algebra"
  description?: string;
  number: number;       // Chapter number (1, 2, 3, ...)
  topics?: string[];   // Array of topics covered
  createdAt: Date;
  updatedAt: Date;
}

// Video Model
interface Video {
  id: string;
  chapterId: string;
  title: string;
  url: string;         // Video URL
  thumbnail?: string;  // Thumbnail image URL
  duration?: string;   // "10:30"
  order: number;       // Display order
  createdAt: Date;
  updatedAt: Date;
}

// PDF Model
interface PDF {
  id: string;
  chapterId: string;
  title: string;
  url: string;        // PDF URL
  size?: string;      // File size
  pages?: number;     // Number of pages
  order: number;      // Display order
  createdAt: Date;
  updatedAt: Date;
}
```

### Subject Color Mapping

```typescript
const subjectColors: { [key: string]: string } = {
  mathematics: 'blue',
  science: 'green',
  english: 'purple',
  hindi: 'orange',
  physics: 'indigo',
  chemistry: 'teal',
  biology: 'emerald',
  'social studies': 'rose',
  'computer science': 'violet',
  economics: 'amber',
  accountancy: 'green',
  'business studies': 'blue'
};
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

#### 1. Get All Boards
```http
GET /api/admin/learning/boards
```

**Response:**
```json
{
  "boards": [
    {
      "id": "board1",
      "name": "CBSE",
      "code": "cbse",
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

#### 2. Get Classes for Board
```http
GET /api/admin/learning/classes?boardId={boardId}
```

**Response:**
```json
{
  "classes": [
    {
      "id": "class1",
      "boardId": "board1",
      "number": "1",
      "name": "Class 1",
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

#### 3. Get Subjects for Class
```http
GET /api/admin/learning/subjects?classId={classId}
```

**Response:**
```json
{
  "subjects": [
    {
      "id": "subject1",
      "classId": "class1",
      "name": "Mathematics",
      "slug": "mathematics",
      "description": "Basic numbers, shapes, and counting",
      "icon": "fa-calculator",
      "color": "blue",
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

#### 4. Get Chapters for Subject
```http
GET /api/admin/learning/chapters?subjectId={subjectId}
```

**Response:**
```json
{
  "chapters": [
    {
      "id": "chapter1",
      "subjectId": "subject1",
      "title": "Introduction to Numbers",
      "description": "Learn about basic numbers",
      "number": 1,
      "topics": ["Counting", "Number Recognition"],
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

#### 5. Get Chapter Details (with Videos and PDFs)
```http
GET /api/admin/learning/chapters?chapterId={chapterId}
```

**Response:**
```json
{
  "chapter": {
    "id": "chapter1",
    "subjectId": "subject1",
    "title": "Introduction to Numbers",
    "description": "Learn about basic numbers",
    "number": 1,
    "topics": ["Counting", "Number Recognition"],
    "subject": {
      "name": "Mathematics",
      "slug": "mathematics",
      "class": {
        "number": "1",
        "board": {
          "name": "CBSE",
          "code": "cbse"
        }
      }
    },
    "videos": [
      {
        "id": "video1",
        "chapterId": "chapter1",
        "title": "Introduction to Numbers",
        "url": "https://example.com/video1.mp4",
        "thumbnail": "https://example.com/thumb1.jpg",
        "duration": "10:30",
        "order": 1
      }
    ],
    "pdfs": [
      {
        "id": "pdf1",
        "chapterId": "chapter1",
        "title": "Chapter 1 Notes",
        "url": "https://example.com/pdf1.pdf",
        "size": "2.5 MB",
        "pages": 15,
        "order": 1
      }
    ]
  }
}
```

#### 6. Get Videos for Chapter
```http
GET /api/admin/learning/videos?chapterId={chapterId}
```

#### 7. Get PDFs for Chapter
```http
GET /api/admin/learning/pdfs?chapterId={chapterId}
```

---

## Screen Implementations

### 1. Learning Materials Home Screen

**File:** `src/screens/learning/LearningMaterialsScreen.tsx`

**Purpose:** Display user's selected board/class and list of subjects.

**Features:**
- Display user's current board and class
- List all subjects for the selected class
- Search functionality
- Quick access to change board/class
- Subject cards with icons and colors

**Implementation:**

```typescript
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { colors, spacing, typography, borderRadius, shadows } from '../../constants/theme';
import { fetchBoards, fetchClasses, fetchSubjects } from '../../store/slices/learningSlice';

export default function LearningMaterialsScreen() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const { boards, classes, subjects, isLoading } = useSelector((state: RootState) => state.learning);
  
  const [selectedBoard, setSelectedBoard] = useState<string | null>(
    user?.preferences?.learning?.board || null
  );
  const [selectedClass, setSelectedClass] = useState<string | null>(
    user?.preferences?.learning?.class || null
  );
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (user) {
      dispatch(fetchBoards());
      if (selectedBoard) {
        dispatch(fetchClasses({ board: selectedBoard }));
      }
      if (selectedClass) {
        dispatch(fetchSubjects({ board: selectedBoard!, class: selectedClass }));
      }
    }
  }, [user, selectedBoard, selectedClass]);

  const filteredSubjects = subjects.filter(subject =>
    subject.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    subject.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getSubjectColor = (color: string) => {
    const colorMap: { [key: string]: string } = {
      blue: colors.blue600,
      green: colors.green600,
      purple: '#9333EA',
      orange: '#F97316',
      indigo: '#4F46E5',
      teal: '#14B8A6',
      emerald: colors.green600,
      rose: '#E11D48',
      violet: '#8B5CF6',
      amber: colors.amber500,
    };
    return colorMap[color] || colors.gray600;
  };

  const handleSubjectPress = (subject: any) => {
    navigation.navigate('SubjectDetails', {
      board: selectedBoard,
      class: selectedClass,
      subject: subject.name,
      subjectId: subject.id
    });
  };

  const handleChangeBoardClass = () => {
    navigation.navigate('BoardClassSelection', {
      onSelect: (board: string, classNum: string) => {
        setSelectedBoard(board);
        setSelectedClass(classNum);
      }
    });
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Learning Materials</Text>
        {selectedBoard && selectedClass && (
          <View style={styles.infoContainer}>
            <Text style={styles.infoText}>
              {selectedBoard} - Class {selectedClass}
            </Text>
            <TouchableOpacity onPress={handleChangeBoardClass}>
              <Text style={styles.changeText}>Change</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search subjects..."
          placeholderTextColor={colors.gray500}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Subjects Grid */}
      <View style={styles.subjectsGrid}>
        {filteredSubjects.map((subject) => (
          <TouchableOpacity
            key={subject.id}
            style={styles.subjectCard}
            onPress={() => handleSubjectPress(subject)}
          >
            <View style={[
              styles.subjectIcon,
              { backgroundColor: getSubjectColor(subject.color || 'gray') + '20' }
            ]}>
              <Text style={[
                styles.subjectIconText,
                { color: getSubjectColor(subject.color || 'gray') }
              ]}>
                {subject.icon ? '📚' : '📖'}
              </Text>
            </View>
            <Text style={styles.subjectName}>{subject.name}</Text>
            <Text style={styles.subjectDescription} numberOfLines={2}>
              {subject.description || 'Study materials available'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {filteredSubjects.length === 0 && (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No subjects found</Text>
          <Text style={styles.emptySubtext}>
            {searchQuery ? 'Try adjusting your search' : 'Select a board and class to get started'}
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: spacing.lg,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  title: {
    ...typography.h2,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoText: {
    ...typography.body,
    color: colors.textSecondary,
  },
  changeText: {
    ...typography.body,
    color: colors.accent,
    fontWeight: '600',
  },
  searchContainer: {
    padding: spacing.md,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  searchInput: {
    backgroundColor: colors.gray100,
    borderRadius: borderRadius.medium,
    padding: spacing.md,
    ...typography.body,
    color: colors.textPrimary,
  },
  subjectsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: spacing.md,
    justifyContent: 'space-between',
  },
  subjectCard: {
    width: '48%',
    backgroundColor: colors.white,
    borderRadius: borderRadius.large,
    padding: spacing.lg,
    marginBottom: spacing.md,
    ...shadows.md,
  },
  subjectIcon: {
    width: 64,
    height: 64,
    borderRadius: borderRadius.medium,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  subjectIconText: {
    fontSize: 32,
  },
  subjectName: {
    ...typography.h4,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  subjectDescription: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xxl,
  },
  emptyText: {
    ...typography.h3,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  emptySubtext: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
```

### 2. Board & Class Selection Screen

**File:** `src/screens/learning/BoardClassSelectionScreen.tsx`

**Purpose:** Allow users to select their board and class.

**Implementation:**

```typescript
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation, useRoute } from '@react-navigation/native';
import { colors, spacing, typography, borderRadius } from '../../constants/theme';
import { fetchBoards, fetchClasses } from '../../store/slices/learningSlice';

export default function BoardClassSelectionScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
  const { boards, classes } = useSelector((state: RootState) => state.learning);
  
  const [selectedBoard, setSelectedBoard] = useState<string | null>(null);
  const [selectedClass, setSelectedClass] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchBoards());
  }, []);

  useEffect(() => {
    if (selectedBoard) {
      dispatch(fetchClasses({ board: selectedBoard }));
    }
  }, [selectedBoard]);

  const handleBoardSelect = (boardId: string) => {
    setSelectedBoard(boardId);
    setSelectedClass(null);
  };

  const handleClassSelect = (classNumber: string) => {
    setSelectedClass(classNumber);
    if (route.params?.onSelect) {
      route.params.onSelect(selectedBoard!, classNumber);
    }
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Select Board & Class</Text>
        <Text style={styles.subtitle}>
          Choose your educational board and class to access personalized content
        </Text>
      </View>

      {/* Board Selection */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Select Board</Text>
        <View style={styles.optionsGrid}>
          {boards.map((board) => (
            <TouchableOpacity
              key={board.id}
              style={[
                styles.optionCard,
                selectedBoard === board.id && styles.optionCardSelected
              ]}
              onPress={() => handleBoardSelect(board.id)}
            >
              <Text style={[
                styles.optionText,
                selectedBoard === board.id && styles.optionTextSelected
              ]}>
                {board.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Class Selection */}
      {selectedBoard && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Class</Text>
          <View style={styles.optionsGrid}>
            {classes
              .filter(c => c.boardId === selectedBoard)
              .map((classItem) => (
                <TouchableOpacity
                  key={classItem.id}
                  style={[
                    styles.optionCard,
                    selectedClass === classItem.number && styles.optionCardSelected
                  ]}
                  onPress={() => handleClassSelect(classItem.number)}
                >
                  <Text style={[
                    styles.optionText,
                    selectedClass === classItem.number && styles.optionTextSelected
                  ]}>
                    Class {classItem.number}
                  </Text>
                </TouchableOpacity>
              ))}
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: spacing.lg,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  title: {
    ...typography.h2,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
  },
  section: {
    padding: spacing.lg,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  optionCard: {
    width: '48%',
    backgroundColor: colors.white,
    borderRadius: borderRadius.medium,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 2,
    borderColor: colors.gray200,
    alignItems: 'center',
  },
  optionCardSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '10',
  },
  optionText: {
    ...typography.body,
    color: colors.textPrimary,
  },
  optionTextSelected: {
    color: colors.primary,
    fontWeight: '600',
  },
});
```

### 3. Subject Details Screen (Chapter List)

**File:** `src/screens/learning/SubjectDetailsScreen.tsx`

**Purpose:** Display all chapters for a selected subject.

**Implementation:**

```typescript
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation, useRoute } from '@react-navigation/native';
import { colors, spacing, typography, borderRadius, shadows } from '../../constants/theme';
import { fetchChapters } from '../../store/slices/learningSlice';

export default function SubjectDetailsScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
  const { chapters, isLoading } = useSelector((state: RootState) => state.learning);
  
  const { subjectId, subject, board, class: classNum } = route.params;
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (subjectId) {
      dispatch(fetchChapters({ subjectId }));
    }
  }, [subjectId]);

  const filteredChapters = chapters.filter(chapter =>
    chapter.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chapter.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chapter.topics?.some(topic => topic.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleChapterPress = (chapter: any) => {
    navigation.navigate('ChapterDetails', {
      chapterId: chapter.id,
      chapterName: chapter.title,
      subject: subject,
      board: board,
      class: classNum
    });
  };

  const getSubjectColor = (subjectName: string) => {
    const colorMap: { [key: string]: string } = {
      mathematics: colors.blue600,
      science: colors.green600,
      english: '#9333EA',
      // ... other mappings
    };
    return colorMap[subjectName.toLowerCase()] || colors.gray600;
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>{subject}</Text>
        <Text style={styles.subtitle}>Class {classNum} - {board}</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search chapters..."
          placeholderTextColor={colors.gray500}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Chapters List */}
      <View style={styles.chaptersList}>
        {filteredChapters.map((chapter) => (
          <TouchableOpacity
            key={chapter.id}
            style={styles.chapterCard}
            onPress={() => handleChapterPress(chapter)}
          >
            <View style={[
              styles.chapterNumber,
              { backgroundColor: getSubjectColor(subject) + '20' }
            ]}>
              <Text style={[
                styles.chapterNumberText,
                { color: getSubjectColor(subject) }
              ]}>
                {chapter.number}
              </Text>
            </View>
            <View style={styles.chapterContent}>
              <Text style={styles.chapterTitle}>{chapter.title}</Text>
              {chapter.description && (
                <Text style={styles.chapterDescription} numberOfLines={2}>
                  {chapter.description}
                </Text>
              )}
              {chapter.topics && chapter.topics.length > 0 && (
                <View style={styles.topicsContainer}>
                  {chapter.topics.slice(0, 3).map((topic, index) => (
                    <View key={index} style={styles.topicTag}>
                      <Text style={styles.topicText}>{topic}</Text>
                    </View>
                  ))}
                  {chapter.topics.length > 3 && (
                    <Text style={styles.moreTopicsText}>
                      +{chapter.topics.length - 3} more
                    </Text>
                  )}
                </View>
              )}
            </View>
            <View style={styles.chapterMeta}>
              <Text style={styles.metaText}>→</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {filteredChapters.length === 0 && (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No chapters found</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: spacing.lg,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  title: {
    ...typography.h2,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
  },
  searchContainer: {
    padding: spacing.md,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  searchInput: {
    backgroundColor: colors.gray100,
    borderRadius: borderRadius.medium,
    padding: spacing.md,
    ...typography.body,
    color: colors.textPrimary,
  },
  chaptersList: {
    padding: spacing.md,
  },
  chapterCard: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: borderRadius.large,
    padding: spacing.lg,
    marginBottom: spacing.md,
    ...shadows.md,
    alignItems: 'center',
  },
  chapterNumber: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.medium,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  chapterNumberText: {
    ...typography.h4,
    fontWeight: '700',
  },
  chapterContent: {
    flex: 1,
  },
  chapterTitle: {
    ...typography.h4,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  chapterDescription: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  topicsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  topicTag: {
    backgroundColor: colors.gray100,
    borderRadius: borderRadius.small,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    marginRight: spacing.xs,
    marginBottom: spacing.xs,
  },
  topicText: {
    ...typography.caption,
    color: colors.textPrimary,
  },
  moreTopicsText: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  chapterMeta: {
    marginLeft: spacing.sm,
  },
  metaText: {
    ...typography.h4,
    color: colors.textSecondary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xxl,
  },
  emptyText: {
    ...typography.h3,
    color: colors.textPrimary,
  },
});
```

### 4. Chapter Details Screen

**File:** `src/screens/learning/ChapterDetailsScreen.tsx`

**Purpose:** Display chapter content including videos, PDFs, and AI chat.

**Key Features:**
- Video player with playlist
- PDF viewer
- AI chat interface (chapter-specific)
- Progress tracking
- Download for offline

**Implementation:**

```typescript
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Video } from 'expo-av';
import { colors, spacing, typography, borderRadius, shadows } from '../../constants/theme';
import ChatInterface from '../../components/learning/ChapterChatInterface';

export default function ChapterDetailsScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { chapterId, chapterName, subject, board, class: classNum } = route.params;
  
  const [chapter, setChapter] = useState<any>(null);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'videos' | 'pdfs' | 'chat'>('videos');
  const [isLoading, setIsLoading] = useState(true);
  const videoRef = useRef<Video>(null);

  useEffect(() => {
    fetchChapterDetails();
  }, [chapterId]);

  const fetchChapterDetails = async () => {
    try {
      const response = await fetch(
        `https://www.paataai.com/api/admin/learning/chapters?chapterId=${chapterId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      setChapter(data.chapter);
    } catch (error) {
      console.error('Error fetching chapter:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVideoSelect = (index: number) => {
    setCurrentVideoIndex(index);
  };

  const handlePDFPress = (pdf: any) => {
    navigation.navigate('PDFViewer', {
      pdfUrl: pdf.url,
      pdfTitle: pdf.title
    });
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{chapterName}</Text>
        <Text style={styles.subtitle}>
          Chapter {chapter?.number} - {subject} (Class {classNum})
        </Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'videos' && styles.tabActive]}
          onPress={() => setActiveTab('videos')}
        >
          <Text style={[
            styles.tabText,
            activeTab === 'videos' && styles.tabTextActive
          ]}>
            Videos ({chapter?.videos?.length || 0})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'pdfs' && styles.tabActive]}
          onPress={() => setActiveTab('pdfs')}
        >
          <Text style={[
            styles.tabText,
            activeTab === 'pdfs' && styles.tabTextActive
          ]}>
            PDFs ({chapter?.pdfs?.length || 0})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'chat' && styles.tabActive]}
          onPress={() => setActiveTab('chat')}
        >
          <Text style={[
            styles.tabText,
            activeTab === 'chat' && styles.tabTextActive
          ]}>
            AI Chat
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView style={styles.content}>
        {activeTab === 'videos' && (
          <View style={styles.videosContainer}>
            {chapter?.videos && chapter.videos.length > 0 ? (
              <>
                {/* Current Video Player */}
                <View style={styles.videoPlayerContainer}>
                  <Video
                    ref={videoRef}
                    source={{ uri: chapter.videos[currentVideoIndex]?.url }}
                    style={styles.videoPlayer}
                    useNativeControls
                    resizeMode="contain"
                  />
                  <Text style={styles.videoTitle}>
                    {chapter.videos[currentVideoIndex]?.title}
                  </Text>
                  {chapter.videos[currentVideoIndex]?.duration && (
                    <Text style={styles.videoDuration}>
                      Duration: {chapter.videos[currentVideoIndex].duration}
                    </Text>
                  )}
                </View>

                {/* Video Playlist */}
                <View style={styles.playlistContainer}>
                  <Text style={styles.playlistTitle}>All Videos</Text>
                  {chapter.videos.map((video: any, index: number) => (
                    <TouchableOpacity
                      key={video.id}
                      style={[
                        styles.playlistItem,
                        index === currentVideoIndex && styles.playlistItemActive
                      ]}
                      onPress={() => handleVideoSelect(index)}
                    >
                      <View style={styles.playlistItemContent}>
                        <Text style={styles.playlistItemTitle}>{video.title}</Text>
                        {video.duration && (
                          <Text style={styles.playlistItemDuration}>{video.duration}</Text>
                        )}
                      </View>
                      {index === currentVideoIndex && (
                        <Text style={styles.playingIndicator}>▶ Playing</Text>
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              </>
            ) : (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No videos available</Text>
                <Text style={styles.emptySubtext}>
                  Videos for this chapter will be available soon.
                </Text>
              </View>
            )}
          </View>
        )}

        {activeTab === 'pdfs' && (
          <View style={styles.pdfsContainer}>
            {chapter?.pdfs && chapter.pdfs.length > 0 ? (
              chapter.pdfs.map((pdf: any) => (
                <TouchableOpacity
                  key={pdf.id}
                  style={styles.pdfCard}
                  onPress={() => handlePDFPress(pdf)}
                >
                  <View style={styles.pdfIcon}>
                    <Text style={styles.pdfIconText}>📄</Text>
                  </View>
                  <View style={styles.pdfContent}>
                    <Text style={styles.pdfTitle}>{pdf.title}</Text>
                    <View style={styles.pdfMeta}>
                      {pdf.size && (
                        <Text style={styles.pdfMetaText}>{pdf.size}</Text>
                      )}
                      {pdf.pages && (
                        <Text style={styles.pdfMetaText}>{pdf.pages} pages</Text>
                      )}
                    </View>
                  </View>
                  <Text style={styles.pdfArrow}>→</Text>
                </TouchableOpacity>
              ))
            ) : (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No PDFs available</Text>
                <Text style={styles.emptySubtext}>
                  PDFs for this chapter will be available soon.
                </Text>
              </View>
            )}
          </View>
        )}

        {activeTab === 'chat' && (
          <ChatInterface
            chapterId={chapterId}
            chapterName={chapterName}
            subject={subject}
            classNum={classNum}
            board={board}
          />
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: spacing.lg,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  backButton: {
    ...typography.body,
    color: colors.accent,
    marginBottom: spacing.sm,
  },
  title: {
    ...typography.h2,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  tab: {
    flex: 1,
    padding: spacing.md,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: colors.primary,
  },
  tabText: {
    ...typography.body,
    color: colors.textSecondary,
  },
  tabTextActive: {
    color: colors.primary,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  videosContainer: {
    padding: spacing.md,
  },
  videoPlayerContainer: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.large,
    padding: spacing.md,
    marginBottom: spacing.lg,
    ...shadows.md,
  },
  videoPlayer: {
    width: '100%',
    height: 200,
    borderRadius: borderRadius.medium,
    marginBottom: spacing.md,
    backgroundColor: colors.black,
  },
  videoTitle: {
    ...typography.h4,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  videoDuration: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  playlistContainer: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.large,
    padding: spacing.md,
    ...shadows.md,
  },
  playlistTitle: {
    ...typography.h4,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  playlistItem: {
    flexDirection: 'row',
    padding: spacing.md,
    borderRadius: borderRadius.medium,
    marginBottom: spacing.sm,
    backgroundColor: colors.gray50,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  playlistItemActive: {
    backgroundColor: colors.primary + '10',
    borderWidth: 2,
    borderColor: colors.primary,
  },
  playlistItemContent: {
    flex: 1,
  },
  playlistItemTitle: {
    ...typography.body,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  playlistItemDuration: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  playingIndicator: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: '600',
  },
  pdfsContainer: {
    padding: spacing.md,
  },
  pdfCard: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: borderRadius.large,
    padding: spacing.lg,
    marginBottom: spacing.md,
    ...shadows.md,
    alignItems: 'center',
  },
  pdfIcon: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.medium,
    backgroundColor: colors.red600 + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  pdfIconText: {
    fontSize: 24,
  },
  pdfContent: {
    flex: 1,
  },
  pdfTitle: {
    ...typography.h4,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  pdfMeta: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  pdfMetaText: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  pdfArrow: {
    ...typography.h4,
    color: colors.textSecondary,
    marginLeft: spacing.sm,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xxl,
  },
  emptyText: {
    ...typography.h3,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  emptySubtext: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
```

### 5. Chapter AI Chat Interface Component

**File:** `src/components/learning/ChapterChatInterface.tsx`

**Purpose:** AI chat interface specific to chapter context.

**Implementation:**

```typescript
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { colors, spacing, typography, borderRadius, shadows } from '../../constants/theme';

interface ChapterChatInterfaceProps {
  chapterId: string;
  chapterName: string;
  subject: string;
  classNum: string;
  board: string;
}

export default function ChapterChatInterface({
  chapterId,
  chapterName,
  subject,
  classNum,
  board
}: ChapterChatInterfaceProps) {
  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    // Add welcome message
    setMessages([{
      id: 'welcome',
      text: `Welcome to ${chapterName}! I'm here to help you understand this chapter. You can ask me questions about the topics, concepts, or anything related to this chapter.`,
      isUser: false,
      timestamp: new Date(),
    }]);
  }, [chapterName]);

  const handleSendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('https://www.paataai.com/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          message: inputText,
          userId: userId,
          sessionId: `chapter-${chapterId}`,
          inputType: 'text',
          conversationHistory: messages.slice(-10).map(msg => ({
            text: msg.text,
            isUser: msg.isUser,
            timestamp: msg.timestamp
          })),
          sessionContext: `Chapter: ${chapterName}, Subject: ${subject}, Class: ${classNum}`,
          contextMetadata: {
            chapter: chapterName,
            subject: subject,
            class: classNum,
            chapterId: chapterId,
            board: board
          },
        }),
      });

      const data = await response.json();
      
      if (data.response) {
        const aiMessage = {
          id: (Date.now() + 1).toString(),
          text: data.response,
          isUser: false,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, aiMessage]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        text: 'Sorry, I encountered an error. Please try again.',
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={90}
    >
      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
      >
        {messages.map((message) => (
          <View
            key={message.id}
            style={[
              styles.messageContainer,
              message.isUser ? styles.userMessage : styles.aiMessage
            ]}
          >
            <View style={[
              styles.messageBubble,
              message.isUser ? styles.userBubble : styles.aiBubble
            ]}>
              <Text style={[
                styles.messageText,
                message.isUser ? styles.userMessageText : styles.aiMessageText
              ]}>
                {message.text}
              </Text>
            </View>
          </View>
        ))}
        {isLoading && (
          <View style={[styles.messageContainer, styles.aiMessage]}>
            <View style={[styles.messageBubble, styles.aiBubble]}>
              <Text style={styles.loadingText}>Thinking...</Text>
            </View>
          </View>
        )}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Ask a question about this chapter..."
          placeholderTextColor={colors.gray500}
          value={inputText}
          onChangeText={setInputText}
          multiline
          maxLength={1000}
        />
        <TouchableOpacity
          style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
          onPress={handleSendMessage}
          disabled={!inputText.trim() || isLoading}
        >
          <Text style={styles.sendButtonText}>Send</Text>
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
  messagesContainer: {
    flex: 1,
    padding: spacing.md,
  },
  messageContainer: {
    marginBottom: spacing.md,
  },
  userMessage: {
    alignItems: 'flex-end',
  },
  aiMessage: {
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
  messageText: {
    ...typography.body,
  },
  userMessageText: {
    color: colors.white,
  },
  aiMessageText: {
    color: colors.textPrimary,
  },
  loadingText: {
    ...typography.body,
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: spacing.md,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.gray200,
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    backgroundColor: colors.gray100,
    borderRadius: borderRadius.medium,
    padding: spacing.md,
    ...typography.body,
    color: colors.textPrimary,
    maxHeight: 100,
    marginRight: spacing.sm,
  },
  sendButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.medium,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: colors.gray300,
    opacity: 0.5,
  },
  sendButtonText: {
    ...typography.button,
    color: colors.white,
  },
});
```

### 6. PDF Viewer Screen

**File:** `src/screens/learning/PDFViewerScreen.tsx`

**Purpose:** Display PDF documents with zoom and navigation.

**Implementation:**

```typescript
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
import { colors, spacing, typography } from '../../constants/theme';

export default function PDFViewerScreen({ route, navigation }: any) {
  const { pdfUrl, pdfTitle } = route.params;
  const [loading, setLoading] = useState(true);

  const pdfViewerUrl = `https://mozilla.github.io/pdf.js/web/viewer.html?file=${encodeURIComponent(pdfUrl)}`;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title} numberOfLines={1}>{pdfTitle}</Text>
      </View>

      {/* PDF Viewer */}
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading PDF...</Text>
        </View>
      )}
      
      <WebView
        source={{ uri: pdfViewerUrl }}
        style={styles.webview}
        onLoadEnd={() => setLoading(false)}
        javaScriptEnabled={true}
        domStorageEnabled={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  backButton: {
    ...typography.body,
    color: colors.accent,
    marginRight: spacing.md,
  },
  title: {
    ...typography.h4,
    color: colors.textPrimary,
    flex: 1,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
    zIndex: 1,
  },
  loadingText: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.md,
  },
  webview: {
    flex: 1,
  },
});
```

---

## Navigation Flow

### Navigation Structure

```typescript
// Navigation Stack
LearningStack:
  - LearningMaterialsScreen (Home)
  - BoardClassSelectionScreen
  - SubjectDetailsScreen
  - ChapterDetailsScreen
  - PDFViewerScreen
```

### Navigation Implementation

```typescript
// src/navigation/LearningStack.tsx
import { createStackNavigator } from '@react-navigation/stack';
import LearningMaterialsScreen from '../screens/learning/LearningMaterialsScreen';
import BoardClassSelectionScreen from '../screens/learning/BoardClassSelectionScreen';
import SubjectDetailsScreen from '../screens/learning/SubjectDetailsScreen';
import ChapterDetailsScreen from '../screens/learning/ChapterDetailsScreen';
import PDFViewerScreen from '../screens/learning/PDFViewerScreen';

const Stack = createStackNavigator();

export default function LearningStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="LearningMaterials" component={LearningMaterialsScreen} />
      <Stack.Screen name="BoardClassSelection" component={BoardClassSelectionScreen} />
      <Stack.Screen name="SubjectDetails" component={SubjectDetailsScreen} />
      <Stack.Screen name="ChapterDetails" component={ChapterDetailsScreen} />
      <Stack.Screen name="PDFViewer" component={PDFViewerScreen} />
    </Stack.Navigator>
  );
}
```

---

## State Management

### Redux Slice

**File:** `src/store/slices/learningSlice.ts`

```typescript
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { learningApi } from '../../api/endpoints';

interface LearningState {
  boards: any[];
  classes: any[];
  subjects: any[];
  chapters: any[];
  currentChapter: any | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: LearningState = {
  boards: [],
  classes: [],
  subjects: [],
  chapters: [],
  currentChapter: null,
  isLoading: false,
  error: null,
};

// Async Thunks
export const fetchBoards = createAsyncThunk(
  'learning/fetchBoards',
  async () => {
    const response = await learningApi.getBoards();
    return response.boards;
  }
);

export const fetchClasses = createAsyncThunk(
  'learning/fetchClasses',
  async ({ board }: { board: string }) => {
    const response = await learningApi.getClasses(board);
    return response.classes;
  }
);

export const fetchSubjects = createAsyncThunk(
  'learning/fetchSubjects',
  async ({ board, class: classNum }: { board: string; class: string }) => {
    const response = await learningApi.getSubjects(board, classNum);
    return response.subjects;
  }
);

export const fetchChapters = createAsyncThunk(
  'learning/fetchChapters',
  async ({ subjectId }: { subjectId: string }) => {
    const response = await learningApi.getChapters(subjectId);
    return response.chapters;
  }
);

export const fetchChapterDetails = createAsyncThunk(
  'learning/fetchChapterDetails',
  async ({ chapterId }: { chapterId: string }) => {
    const response = await learningApi.getChapterDetails(chapterId);
    return response.chapter;
  }
);

const learningSlice = createSlice({
  name: 'learning',
  initialState,
  reducers: {
    clearLearningData: (state) => {
      state.boards = [];
      state.classes = [];
      state.subjects = [];
      state.chapters = [];
      state.currentChapter = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Boards
      .addCase(fetchBoards.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchBoards.fulfilled, (state, action) => {
        state.isLoading = false;
        state.boards = action.payload;
      })
      .addCase(fetchBoards.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch boards';
      })
      // Fetch Classes
      .addCase(fetchClasses.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchClasses.fulfilled, (state, action) => {
        state.isLoading = false;
        state.classes = action.payload;
      })
      .addCase(fetchClasses.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch classes';
      })
      // Fetch Subjects
      .addCase(fetchSubjects.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSubjects.fulfilled, (state, action) => {
        state.isLoading = false;
        state.subjects = action.payload;
      })
      .addCase(fetchSubjects.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch subjects';
      })
      // Fetch Chapters
      .addCase(fetchChapters.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchChapters.fulfilled, (state, action) => {
        state.isLoading = false;
        state.chapters = action.payload;
      })
      .addCase(fetchChapters.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch chapters';
      })
      // Fetch Chapter Details
      .addCase(fetchChapterDetails.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchChapterDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentChapter = action.payload;
      })
      .addCase(fetchChapterDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch chapter details';
      });
  },
});

export const { clearLearningData } = learningSlice.actions;
export default learningSlice.reducer;
```

### API Endpoints

**File:** `src/api/endpoints.ts`

```typescript
export const learningApi = {
  getBoards: async () => {
    const response = await fetch('https://www.paataai.com/api/admin/learning/boards', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.json();
  },

  getClasses: async (boardId: string) => {
    const response = await fetch(
      `https://www.paataai.com/api/admin/learning/classes?boardId=${boardId}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }
    );
    return response.json();
  },

  getSubjects: async (boardId: string, classId: string) => {
    // First get classes for board, then subjects for class
    const classesResponse = await fetch(
      `https://www.paataai.com/api/admin/learning/classes?boardId=${boardId}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }
    );
    const classesData = await classesResponse.json();
    const classItem = classesData.classes.find((c: any) => c.number === classId);
    
    if (!classItem) throw new Error('Class not found');
    
    const response = await fetch(
      `https://www.paataai.com/api/admin/learning/subjects?classId=${classItem.id}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }
    );
    return response.json();
  },

  getChapters: async (subjectId: string) => {
    const response = await fetch(
      `https://www.paataai.com/api/admin/learning/chapters?subjectId=${subjectId}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }
    );
    return response.json();
  },

  getChapterDetails: async (chapterId: string) => {
    const response = await fetch(
      `https://www.paataai.com/api/admin/learning/chapters?chapterId=${chapterId}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }
    );
    return response.json();
  },
};
```

---

## Features & Functionality

### 1. Search Functionality

- **Subject Search**: Search by name or description
- **Chapter Search**: Search by title, description, or topics
- **Real-time Filtering**: Update results as user types

### 2. Progress Tracking

Track user progress for:
- Videos watched (with timestamp)
- PDFs read
- Chapters completed
- Time spent per chapter

**Implementation:**

```typescript
// Track video progress
const trackVideoProgress = async (chapterId: string, videoId: string, progress: number) => {
  await fetch('https://www.paataai.com/api/learning/progress', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      chapterId,
      videoId,
      progress,
      type: 'video',
    }),
  });
};
```

### 3. Offline Support

- **Download Videos**: Download videos for offline viewing
- **Download PDFs**: Cache PDFs locally
- **Sync Progress**: Sync progress when online

**Implementation:**

```typescript
import * as FileSystem from 'expo-file-system';

const downloadVideo = async (videoUrl: string, videoId: string) => {
  const fileUri = `${FileSystem.documentDirectory}${videoId}.mp4`;
  const downloadResumable = FileSystem.createDownloadResumable(
    videoUrl,
    fileUri
  );
  
  try {
    const result = await downloadResumable.downloadAsync();
    return result?.uri;
  } catch (error) {
    console.error('Download error:', error);
    throw error;
  }
};
```

### 4. AI Chat Integration

- **Chapter Context**: AI understands current chapter context
- **Subject Awareness**: AI knows the subject and class
- **Conversation History**: Maintains context within chapter
- **Multi-modal Input**: Support text, voice, and image input

### 5. Video Features

- **Playlist Navigation**: Easy switching between videos
- **Playback Controls**: Play, pause, seek, speed control
- **Progress Tracking**: Resume from last watched position
- **Quality Selection**: Choose video quality (if available)
- **Subtitles**: Support for subtitles (if available)

### 6. PDF Features

- **Zoom & Pan**: Pinch to zoom, pan to navigate
- **Page Navigation**: Jump to specific pages
- **Bookmarks**: Save favorite pages
- **Annotations**: Highlight and add notes (future feature)
- **Search**: Search within PDF content

---

## UI/UX Guidelines

### Color Scheme

Follow the design scheme from `MOBILE_APP_DESIGN_SCHEME.md`:

- **Primary Background**: Gray-50 (`#F9FAFB`)
- **Card Background**: White (`#FFFFFF`)
- **Primary Text**: Gray-900 (`#111827`)
- **Secondary Text**: Gray-600 (`#4B5563`)
- **Subject Colors**: Use color mapping for subject-specific accents

### Typography

- **Screen Titles**: H2 (24px, Bold)
- **Section Headers**: H3 (20px, Semi-bold)
- **Card Titles**: H4 (18px, Semi-bold)
- **Body Text**: Body (16px, Regular)
- **Captions**: Caption (12px, Regular)

### Spacing

- **Screen Padding**: 16px
- **Card Padding**: 16px-24px
- **Item Spacing**: 8px-16px
- **Section Spacing**: 24px-32px

### Component Guidelines

1. **Cards**: Use rounded corners (12px), subtle shadows, white background
2. **Buttons**: Primary buttons use Gray-900, 48px height
3. **Input Fields**: Gray-100 background, 8px border radius
4. **Icons**: Use FontAwesome icons or emoji for subject icons
5. **Loading States**: Show skeleton loaders or spinners
6. **Empty States**: Provide helpful messages and actions

---

## Offline Support

### Caching Strategy

1. **Cache Boards, Classes, Subjects**: Store in local database
2. **Cache Chapter Metadata**: Store chapter info locally
3. **Download Videos**: Allow users to download videos
4. **Cache PDFs**: Store PDFs locally after first view
5. **Sync Progress**: Queue progress updates for sync

### Implementation

```typescript
// Use WatermelonDB or AsyncStorage for local caching
import AsyncStorage from '@react-native-async-storage/async-storage';

const cacheLearningData = async (key: string, data: any) => {
  await AsyncStorage.setItem(key, JSON.stringify(data));
};

const getCachedLearningData = async (key: string) => {
  const data = await AsyncStorage.getItem(key);
  return data ? JSON.parse(data) : null;
};
```

---

## Performance Optimization

### 1. Lazy Loading

- Load chapters only when subject is selected
- Load videos/PDFs only when chapter is opened
- Use pagination for large lists

### 2. Image Optimization

- Use thumbnail images for videos
- Compress images before display
- Implement progressive image loading

### 3. Video Optimization

- Use adaptive bitrate streaming
- Preload next video in playlist
- Cache video metadata

### 4. List Optimization

- Use `FlatList` with `keyExtractor`
- Implement `getItemLayout` for better performance
- Use `removeClippedSubviews` for long lists

### 5. API Optimization

- Batch API calls when possible
- Cache API responses
- Implement request debouncing for search

---

## Implementation Checklist

### Phase 1: Core Structure
- [ ] Set up navigation stack
- [ ] Create Redux slice for learning state
- [ ] Implement API endpoints integration
- [ ] Create base screen components

### Phase 2: Board & Class Selection
- [ ] Implement BoardClassSelectionScreen
- [ ] Add board selection UI
- [ ] Add class selection UI
- [ ] Save user preferences

### Phase 3: Subject & Chapter Lists
- [ ] Implement LearningMaterialsScreen
- [ ] Implement SubjectDetailsScreen
- [ ] Add search functionality
- [ ] Add subject/chapter cards

### Phase 4: Chapter Details
- [ ] Implement ChapterDetailsScreen
- [ ] Add tab navigation (Videos/PDFs/Chat)
- [ ] Integrate video player
- [ ] Integrate PDF viewer

### Phase 5: Video Player
- [ ] Implement video playback
- [ ] Add video playlist
- [ ] Add progress tracking
- [ ] Add playback controls

### Phase 6: PDF Viewer
- [ ] Implement PDF rendering
- [ ] Add zoom and pan
- [ ] Add page navigation
- [ ] Add bookmarking

### Phase 7: AI Chat
- [ ] Implement ChapterChatInterface
- [ ] Add chapter context to chat
- [ ] Integrate with chat API
- [ ] Add message history

### Phase 8: Offline Support
- [ ] Implement local caching
- [ ] Add download functionality
- [ ] Add sync mechanism
- [ ] Handle offline/online states

### Phase 9: Progress Tracking
- [ ] Track video progress
- [ ] Track PDF reading progress
- [ ] Sync progress to server
- [ ] Display progress indicators

### Phase 10: Polish & Optimization
- [ ] Add loading states
- [ ] Add error handling
- [ ] Optimize performance
- [ ] Add animations
- [ ] Test on multiple devices

---

## Testing Checklist

### Functional Testing
- [ ] Board selection works correctly
- [ ] Class selection filters subjects
- [ ] Subject list displays correctly
- [ ] Chapter list displays correctly
- [ ] Video playback works
- [ ] PDF viewing works
- [ ] AI chat responds correctly
- [ ] Search functionality works
- [ ] Progress tracking works
- [ ] Offline mode works

### UI/UX Testing
- [ ] Colors match design scheme
- [ ] Typography is consistent
- [ ] Spacing is correct
- [ ] Icons display correctly
- [ ] Loading states are clear
- [ ] Error states are helpful
- [ ] Empty states are informative

### Performance Testing
- [ ] Lists scroll smoothly
- [ ] Images load efficiently
- [ ] Videos play without lag
- [ ] PDFs render quickly
- [ ] API calls are optimized
- [ ] Memory usage is reasonable

### Device Testing
- [ ] Test on iOS devices
- [ ] Test on Android devices
- [ ] Test on different screen sizes
- [ ] Test in portrait and landscape
- [ ] Test with slow network
- [ ] Test offline mode

---

## Troubleshooting

### Common Issues

1. **Videos not playing**
   - Check video URL format
   - Verify video codec compatibility
   - Check network connectivity

2. **PDFs not loading**
   - Verify PDF URL is accessible
   - Check PDF viewer implementation
   - Ensure proper headers are set

3. **AI chat not responding**
   - Verify API endpoint
   - Check authentication token
   - Verify request payload format

4. **Progress not syncing**
   - Check network connectivity
   - Verify sync API endpoint
   - Check local storage permissions

---

## Future Enhancements

1. **Annotations**: Allow users to highlight and annotate PDFs
2. **Notes**: Add chapter-specific notes feature
3. **Quizzes**: Add chapter quizzes
4. **Bookmarks**: Save favorite chapters/videos
5. **Recommendations**: Suggest related content
6. **Social Features**: Share progress with friends
7. **Gamification**: Add achievements for completing chapters
8. **Analytics**: Detailed learning analytics dashboard

---

## Resources

- **Design Scheme**: `MOBILE_APP_DESIGN_SCHEME.md`
- **API Documentation**: `MOBILE_APP_API_LIST.md`
- **Development Guide**: `MOBILE_APP_DEVELOPMENT_GUIDE.md`

---

**Last Updated**: 2024
**Maintained By**: PAATA.AI Development Team



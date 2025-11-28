# PAATA.AI Mobile App Design Scheme

## Overview

This document specifies the complete design system and color scheme for the PAATA.AI mobile application. All colors, typography, spacing, and component styles are defined here to ensure consistency across the mobile app.

---

## Table of Contents

1. [Color Palette](#color-palette)
2. [Typography](#typography)
3. [Spacing & Layout](#spacing--layout)
4. [Component-Specific Colors](#component-specific-colors)
5. [Status & State Colors](#status--state-colors)
6. [Gradients](#gradients)
7. [Shadows & Elevation](#shadows--elevation)
8. [Border Radius](#border-radius)
9. [Implementation Guide](#implementation-guide)

---

## Color Palette

### Primary Colors

#### Gray Scale (Primary Palette)

| Color Name | Hex Code | RGB | Usage |
|------------|----------|-----|-------|
| **Gray-900** | `#111827` | `rgb(17, 24, 39)` | Primary dark background (Navbar, Sidebar, Primary buttons, Active states) |
| **Gray-800** | `#1F2937` | `rgb(31, 41, 55)` | Secondary dark (Hover states, Active menu items, Secondary buttons) |
| **Gray-700** | `#374151` | `rgb(55, 65, 81)` | Borders, Dividers, Scrollbar tracks |
| **Gray-600** | `#4B5563` | `rgb(75, 85, 99)` | Secondary text, Icons on dark backgrounds |
| **Gray-500** | `#6B7280` | `rgb(107, 114, 128)` | Tertiary text, Placeholder text |
| **Gray-400** | `#9CA3AF` | `rgb(156, 163, 175)` | Disabled text, Inactive icons |
| **Gray-300** | `#D1D5DB` | `rgb(209, 213, 219)` | Light borders, Hover backgrounds on light surfaces |
| **Gray-200** | `#E5E7EB` | `rgb(229, 231, 235)` | Light borders, Input borders, Card borders |
| **Gray-100** | `#F3F4F6` | `rgb(243, 244, 246)` | Light backgrounds, Tags, Badges, Secondary backgrounds |
| **Gray-50** | `#F9FAFB` | `rgb(249, 250, 251)` | Page backgrounds, Screen backgrounds |
| **White** | `#FFFFFF` | `rgb(255, 255, 255)` | Cards, Surfaces, Text on dark backgrounds |

### Accent Colors

| Color Name | Hex Code | RGB | Usage |
|------------|----------|-----|-------|
| **Blue-600** | `#2563EB` | `rgb(37, 99, 235)` | Primary accent (Pricing highlights, Links, Primary CTAs) |
| **Blue-500** | `#3B82F6` | `rgb(59, 130, 246)` | Secondary accent, Interactive elements |
| **Green-600** | `#16A34A` | `rgb(22, 163, 74)` | Success states, Positive actions, Completed items |
| **Green-500** | `#10B981` | `rgb(16, 185, 129)` | Success highlights, Achievement badges |
| **Green-100** | `#D1FAE5` | `rgb(209, 250, 229)` | Success backgrounds, Light success states |
| **Red-600** | `#DC2626` | `rgb(220, 38, 38)` | Error states, Destructive actions, Warnings |
| **Red-500** | `#EF4444` | `rgb(239, 68, 68)` | Error highlights, Delete buttons |
| **Red-200** | `#FECACA` | `rgb(254, 202, 202)` | Error backgrounds, Light error states |
| **Amber-500** | `#F59E0B` | `rgb(245, 158, 11)` | Warning states, Caution indicators |
| **Amber-100** | `#FEF3C7` | `rgb(254, 243, 199)` | Warning backgrounds |

### Semantic Colors

| Semantic | Light Mode | Dark Mode (Future) | Usage |
|----------|------------|-------------------|-------|
| **Primary** | Gray-900 | Gray-100 | Main brand color |
| **Secondary** | Gray-600 | Gray-400 | Secondary elements |
| **Accent** | Blue-600 | Blue-400 | Interactive highlights |
| **Success** | Green-600 | Green-400 | Success indicators |
| **Error** | Red-600 | Red-400 | Error indicators |
| **Warning** | Amber-500 | Amber-400 | Warning indicators |
| **Background** | Gray-50 | Gray-900 | Screen backgrounds |
| **Surface** | White | Gray-800 | Card/surface backgrounds |
| **Text Primary** | Gray-900 | White | Main text |
| **Text Secondary** | Gray-600 | Gray-400 | Secondary text |
| **Text Disabled** | Gray-400 | Gray-600 | Disabled text |

---

## Typography

### Font Families

- **Primary Font**: System default (San Francisco on iOS, Roboto on Android)
- **Monospace Font**: System monospace (for code blocks)

### Font Sizes & Weights

| Style | Font Size | Font Weight | Line Height | Usage |
|-------|-----------|-------------|-------------|-------|
| **H1** | 32px | Bold (700) | 40px | Page titles, Main headings |
| **H2** | 24px | Bold (700) | 32px | Section headings |
| **H3** | 20px | Semi-bold (600) | 28px | Subsection headings |
| **H4** | 18px | Semi-bold (600) | 24px | Card titles |
| **Body Large** | 18px | Regular (400) | 28px | Large body text |
| **Body** | 16px | Regular (400) | 24px | Standard body text |
| **Body Small** | 14px | Regular (400) | 20px | Secondary text, Descriptions |
| **Caption** | 12px | Regular (400) | 16px | Captions, Labels, Metadata |
| **Button** | 14px | Semi-bold (600) | 20px | Button text |
| **Label** | 14px | Medium (500) | 20px | Form labels |

### Text Colors

| Element | Color | Hex Code |
|---------|-------|----------|
| **Primary Text** | Gray-900 | `#111827` |
| **Secondary Text** | Gray-600 | `#4B5563` |
| **Tertiary Text** | Gray-500 | `#6B7280` |
| **Disabled Text** | Gray-400 | `#9CA3AF` |
| **Text on Dark** | White | `#FFFFFF` |
| **Link Text** | Blue-600 | `#2563EB` |
| **Error Text** | Red-600 | `#DC2626` |
| **Success Text** | Green-600 | `#16A34A` |

---

## Spacing & Layout

### Spacing Scale

| Name | Size | Usage |
|------|------|-------|
| **XS** | 4px | Tight spacing, Icon padding |
| **SM** | 8px | Small gaps, Compact spacing |
| **MD** | 16px | Standard spacing, Component padding |
| **LG** | 24px | Section spacing, Card padding |
| **XL** | 32px | Large gaps, Screen margins |
| **XXL** | 48px | Extra large gaps, Section separation |

### Layout Constants

| Element | Value | Usage |
|---------|-------|-------|
| **Screen Padding** | 16px | Horizontal padding for screens |
| **Card Padding** | 16px-24px | Internal padding for cards |
| **Button Height** | 48px | Standard button height |
| **Input Height** | 48px | Standard input field height |
| **Navbar Height** | 64px | Top navigation bar height |
| **Tab Bar Height** | 56px | Bottom tab bar height |
| **Sidebar Width** | 256px | Sidebar/drawer width |

---

## Component-Specific Colors

### Navigation

#### Top Navigation Bar (Navbar)
- **Background**: `Gray-900` (`#111827`) with gradient `from-gray-900 to-gray-800`
- **Text**: `White` (`#FFFFFF`)
- **Logo Text**: `White`, Bold
- **Link Text**: `White` (`#FFFFFF`)
- **Link Hover**: `Gray-300` (`#D1D5DB`)
- **Border**: None
- **Shadow**: Medium shadow (elevation 4)

#### Sidebar/Drawer
- **Background**: `Gray-900` (`#111827`)
- **Header Background**: `Gray-900` (`#111827`)
- **Header Text**: `White` (`#FFFFFF`)
- **Header Subtitle**: `Gray-500` (`#6B7280`)
- **Menu Item Text (Inactive)**: `Gray-300` (`#D1D5DB`)
- **Menu Item Text (Active)**: `White` (`#FFFFFF`)
- **Menu Item Background (Active)**: `Gray-800` (`#1F2937`)
- **Menu Item Background (Hover)**: `Gray-800` (`#1F2937`)
- **Icon Color (Inactive)**: `Gray-300` (`#D1D5DB`)
- **Icon Color (Active)**: `White` (`#FFFFFF`)
- **Border (Section Divider)**: `Gray-700` (`#374151`)
- **Backdrop (Mobile)**: `Black` with 50% opacity

#### Bottom Tab Bar
- **Background**: `White` (`#FFFFFF`)
- **Active Tab Icon**: `Gray-900` (`#111827`)
- **Inactive Tab Icon**: `Gray-500` (`#6B7280`)
- **Active Tab Label**: `Gray-900` (`#111827`)
- **Inactive Tab Label**: `Gray-500` (`#6B7280`)
- **Border Top**: `Gray-200` (`#E5E7EB`)

### Buttons

#### Primary Button
- **Background**: `Gray-900` (`#111827`)
- **Text**: `White` (`#FFFFFF`)
- **Border**: None
- **Hover/Active**: `Gray-800` (`#1F2937`)
- **Disabled Background**: `Gray-200` (`#E5E7EB`)
- **Disabled Text**: `Gray-400` (`#9CA3AF`)

#### Secondary Button
- **Background**: `Gray-800` (`#1F2937`)
- **Text**: `White` (`#FFFFFF`)
- **Border**: None
- **Hover/Active**: `Gray-700` (`#374151`)

#### Outline Button
- **Background**: Transparent
- **Text**: `Gray-900` (`#111827`)
- **Border**: `Gray-900` (`#111827`), 1px
- **Hover Background**: `Gray-100` (`#F3F4F6`)

#### Accent Button (Blue)
- **Background**: `Blue-600` (`#2563EB`)
- **Text**: `White` (`#FFFFFF`)
- **Border**: None
- **Hover/Active**: `Blue-500` (`#3B82F6`)

#### Success Button (Green)
- **Background**: `Green-600` (`#16A34A`)
- **Text**: `White` (`#FFFFFF`)
- **Border**: None
- **Hover/Active**: `Green-500` (`#10B981`)

#### Destructive Button (Red)
- **Background**: `Red-600` (`#DC2626`)
- **Text**: `White` (`#FFFFFF`)
- **Border**: None
- **Hover/Active**: `Red-500` (`#EF4444`)

### Cards

#### Standard Card
- **Background**: `White` (`#FFFFFF`)
- **Border**: `Gray-200` (`#E5E7EB`), 1px
- **Shadow**: Light shadow (elevation 2)
- **Padding**: 16px-24px
- **Border Radius**: 12px

#### Elevated Card
- **Background**: `White` (`#FFFFFF`)
- **Border**: None
- **Shadow**: Medium shadow (elevation 4)
- **Padding**: 16px-24px
- **Border Radius**: 12px

#### Interactive Card (Hover)
- **Background**: `White` (`#FFFFFF`)
- **Border**: `Gray-200` (`#E5E7EB`), 1px
- **Hover Background**: `Gray-50` (`#F9FAFB`)
- **Hover Border**: `Gray-300` (`#D1D5DB`)

### Input Fields

#### Text Input
- **Background**: `White` (`#FFFFFF`)
- **Border**: `Gray-200` (`#E5E7EB`), 1px
- **Border (Focused)**: `Gray-900` (`#111827`), 2px
- **Text**: `Gray-900` (`#111827`)
- **Placeholder**: `Gray-500` (`#6B7280`)
- **Disabled Background**: `Gray-100` (`#F3F4F6`)
- **Disabled Text**: `Gray-400` (`#9CA3AF`)
- **Error Border**: `Red-600` (`#DC2626`), 2px
- **Error Background**: `Red-50` (if needed)

#### Textarea
- Same as Text Input

#### Search Input
- **Background**: `Gray-100` (`#F3F4F6`)
- **Border**: `Gray-200` (`#E5E7EB`), 1px
- **Border (Focused)**: `Gray-900` (`#111827`), 2px
- **Text**: `Gray-900` (`#111827`)
- **Placeholder**: `Gray-500` (`#6B7280`)
- **Icon**: `Gray-500` (`#6B7280`)

### Lists

#### List Item
- **Background**: `White` (`#FFFFFF`)
- **Background (Pressed)**: `Gray-50` (`#F9FAFB`)
- **Border Bottom**: `Gray-200` (`#E5E7EB`), 1px
- **Text**: `Gray-900` (`#111827`)
- **Secondary Text**: `Gray-600` (`#4B5563`)
- **Icon**: `Gray-600` (`#4B5563`)

#### List Item (Selected)
- **Background**: `Gray-50` (`#F9FAFB`)
- **Text**: `Gray-900` (`#111827`)
- **Icon**: `Gray-900` (`#111827`)

### Chat Interface

#### Chat Container
- **Background**: `Gray-50` (`#F9FAFB`)
- **Message Container**: `White` (`#FFFFFF`)

#### User Message Bubble
- **Background**: `Gray-900` (`#111827`)
- **Text**: `White` (`#FFFFFF`)
- **Border Radius**: 16px (top-right, bottom-right, bottom-left: 4px)

#### AI Message Bubble
- **Background**: `White` (`#FFFFFF`)
- **Text**: `Gray-900` (`#111827`)
- **Border**: `Gray-200` (`#E5E7EB`), 1px
- **Border Radius**: 16px (top-left, bottom-left, bottom-right: 4px)

#### Chat Input Area
- **Background**: `White` (`#FFFFFF`)
- **Border Top**: `Gray-200` (`#E5E7EB`), 1px
- **Input Background**: `Gray-100` (`#F3F4F6`)
- **Input Border**: `Gray-200` (`#E5E7EB`), 1px
- **Send Button**: `Gray-900` (`#111827`)

### Notes Feature

#### Notes List
- **Background**: `White` (`#FFFFFF`)
- **Card Background**: `White` (`#FFFFFF`)
- **Card Border**: `Gray-200` (`#E5E7EB`), 1px
- **Title Text**: `Gray-900` (`#111827`)
- **Content Text**: `Gray-600` (`#4B5563`)
- **Category Badge**: `Gray-100` (`#F3F4F6`) with `Gray-900` (`#111827`) text
- **Tag**: `Gray-100` (`#F3F4F6`) with `Gray-900` (`#111827`) text

#### Notes Editor
- **Background**: `White` (`#FFFFFF`)
- **Toolbar Background**: `Gray-50` (`#F9FAFB`)
- **Toolbar Border**: `Gray-200` (`#E5E7EB`), 1px
- **Input Text**: `Gray-900` (`#111827`)
- **Save Button**: `Gray-900` (`#111827`)

### Exam Mode

#### Exam Card
- **Background**: `White` (`#FFFFFF`)
- **Border**: `Gray-200` (`#E5E7EB`), 1px
- **Title**: `Gray-900` (`#111827`)
- **Status Badge (Active)**: `Blue-600` (`#2563EB`) background, `White` text
- **Status Badge (Completed)**: `Green-600` (`#16A34A`) background, `White` text

#### Question Card
- **Background**: `White` (`#FFFFFF`)
- **Border**: `Gray-200` (`#E5E7EB`), 1px
- **Question Text**: `Gray-900` (`#111827`)
- **Option Background**: `Gray-50` (`#F9FAFB`)
- **Option Background (Selected)**: `Blue-600` (`#2563EB`) with `White` text
- **Option Border**: `Gray-200` (`#E5E7EB`), 1px
- **Option Border (Selected)**: `Blue-600` (`#2563EB`), 2px

#### Timer
- **Background**: `Gray-900` (`#111827`)
- **Text**: `White` (`#FFFFFF`)
- **Warning (Low Time)**: `Red-600` (`#DC2626`)

### Mind Maps

#### Mind Map Node
- **Background**: `White` (`#FFFFFF`)
- **Border**: `Gray-900` (`#111827`), 2px
- **Text**: `Gray-900` (`#111827`)
- **Background (Selected)**: `Blue-600` (`#2563EB`) with `White` text
- **Connection Line**: `Gray-300` (`#D1D5DB`), 2px

### Progress & Analytics

#### Progress Bar
- **Background**: `Gray-200` (`#E5E7EB`)
- **Fill**: `Blue-600` (`#2563EB`)
- **Fill (Success)**: `Green-600` (`#16A34A`)

#### Stat Card
- **Background**: `White` (`#FFFFFF`)
- **Border**: `Gray-200` (`#E5E7EB`), 1px
- **Value Text**: `Gray-900` (`#111827`), Bold
- **Label Text**: `Gray-600` (`#4B5563`)
- **Icon Background**: `Gray-100` (`#F3F4F6`)
- **Icon Color**: `Gray-900` (`#111827`)

#### Achievement Badge
- **Background**: `Green-100` (`#D1FAE5`)
- **Border**: `Green-600` (`#16A34A`), 2px
- **Text**: `Green-600` (`#16A34A`)
- **Icon**: `Green-600` (`#16A34A`)

### Learning Materials

#### Chapter Card
- **Background**: `White` (`#FFFFFF`)
- **Border**: `Gray-200` (`#E5E7EB`), 1px
- **Title**: `Gray-900` (`#111827`)
- **Description**: `Gray-600` (`#4B5563`)
- **Icon Background**: `Gray-100` (`#F3F4F6`)
- **Icon Color**: `Gray-900` (`#111827`)

#### PDF Viewer
- **Background**: `Gray-50` (`#F9FAFB`)
- **Toolbar Background**: `White` (`#FFFFFF`)
- **Toolbar Border**: `Gray-200` (`#E5E7EB`), 1px

#### Video Player
- **Background**: `Black` (`#000000`)
- **Controls Background**: `Black` with 70% opacity
- **Controls Text**: `White` (`#FFFFFF`)

### Modals & Dialogs

#### Modal Backdrop
- **Background**: `Black` (`#000000`) with 50% opacity

#### Modal Container
- **Background**: `White` (`#FFFFFF`)
- **Border Radius**: 16px (top corners on mobile)
- **Shadow**: Large shadow (elevation 8)

#### Modal Header
- **Background**: `White` (`#FFFFFF`)
- **Border Bottom**: `Gray-200` (`#E5E7EB`), 1px
- **Title**: `Gray-900` (`#111827`), Bold
- **Close Button**: `Gray-600` (`#4B5563`)

#### Modal Body
- **Background**: `White` (`#FFFFFF`)
- **Text**: `Gray-900` (`#111827`)

#### Modal Footer
- **Background**: `Gray-50` (`#F9FAFB`)
- **Border Top**: `Gray-200` (`#E5E7EB`), 1px
- **Button (Primary)**: `Gray-900` (`#111827`)
- **Button (Secondary)**: `Gray-200` (`#E5E7EB`) background, `Gray-900` text

### Badges & Tags

#### Default Badge
- **Background**: `Gray-100` (`#F3F4F6`)
- **Text**: `Gray-900` (`#111827`)
- **Border**: None

#### Success Badge
- **Background**: `Green-100` (`#D1FAE5`)
- **Text**: `Green-600` (`#16A34A`)
- **Border**: None

#### Error Badge
- **Background**: `Red-200` (`#FECACA`)
- **Text**: `Red-600` (`#DC2626`)
- **Border**: None

#### Warning Badge
- **Background**: `Amber-100` (`#FEF3C7`)
- **Text**: `Amber-500` (`#F59E0B`)
- **Border**: None

#### Info Badge
- **Background**: `Blue-600` (`#2563EB`)
- **Text**: `White` (`#FFFFFF`)
- **Border**: None

### Loading States

#### Skeleton Loader
- **Background**: `Gray-200` (`#E5E7EB`)
- **Shimmer**: `Gray-100` (`#F3F4F6`)

#### Loading Spinner
- **Color**: `Gray-900` (`#111827`)
- **Background (Full Screen)**: `White` (`#FFFFFF`) with 80% opacity

### Empty States

#### Empty State Container
- **Background**: `White` (`#FFFFFF`)
- **Icon**: `Gray-400` (`#9CA3AF`)
- **Title**: `Gray-900` (`#111827`)
- **Description**: `Gray-600` (`#4B5563`)
- **Action Button**: `Gray-900` (`#111827`)

---

## Status & State Colors

### Success States
- **Background**: `Green-100` (`#D1FAE5`)
- **Border**: `Green-600` (`#16A34A`)
- **Text**: `Green-600` (`#16A34A`)
- **Icon**: `Green-600` (`#16A34A`)

### Error States
- **Background**: `Red-200` (`#FECACA`)
- **Border**: `Red-600` (`#DC2626`)
- **Text**: `Red-600` (`#DC2626`)
- **Icon**: `Red-600` (`#DC2626`)

### Warning States
- **Background**: `Amber-100` (`#FEF3C7`)
- **Border**: `Amber-500` (`#F59E0B`)
- **Text**: `Amber-500` (`#F59E0B`)
- **Icon**: `Amber-500` (`#F59E0B`)

### Info States
- **Background**: `Blue-600` (`#2563EB`)
- **Border**: `Blue-600` (`#2563EB`)
- **Text**: `White` (`#FFFFFF`)
- **Icon**: `White` (`#FFFFFF`)

### Disabled States
- **Background**: `Gray-100` (`#F3F4F6`)
- **Text**: `Gray-400` (`#9CA3AF`)
- **Border**: `Gray-200` (`#E5E7EB`)
- **Icon**: `Gray-400` (`#9CA3AF`)

### Focus States
- **Border**: `Gray-900` (`#111827`), 2px
- **Outline**: `Gray-900` (`#111827`), 2px (for accessibility)

### Hover States
- **Light Background**: `Gray-50` (`#F9FAFB`)
- **Dark Background**: `Gray-800` (`#1F2937`)
- **Text**: `Gray-300` (`#D1D5DB`) on dark, `Gray-900` (`#111827`) on light

### Active/Pressed States
- **Light Background**: `Gray-100` (`#F3F4F6`)
- **Dark Background**: `Gray-700` (`#374151`)
- **Opacity**: 85% for buttons

---

## Gradients

### Primary Gradient (Navbar)
- **From**: `Gray-900` (`#111827`)
- **To**: `Gray-800` (`#1F2937`)
- **Direction**: Left to Right
- **Usage**: Top navigation bar

### Background Gradient (Optional)
- **From**: `Gray-50` (`#F9FAFB`)
- **To**: `White` (`#FFFFFF`)
- **Direction**: Top to Bottom
- **Usage**: Screen backgrounds (optional, can use solid `Gray-50`)

---

## Shadows & Elevation

### Shadow Levels

| Level | Shadow | Usage |
|-------|--------|-------|
| **0** | None | Flat elements |
| **1** | `0 1px 2px rgba(0, 0, 0, 0.05)` | Subtle elevation |
| **2** | `0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)` | Cards, Buttons |
| **4** | `0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)` | Navbar, Elevated cards |
| **8** | `0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05)` | Modals, Dropdowns |
| **16** | `0 20px 25px rgba(0, 0, 0, 0.1), 0 10px 10px rgba(0, 0, 0, 0.04)` | Floating action buttons |

### Component Elevation

| Component | Elevation | Shadow |
|-----------|-----------|--------|
| **Cards** | 2 | Light shadow |
| **Buttons** | 2 | Light shadow (when pressed: 0) |
| **Navbar** | 4 | Medium shadow |
| **Modals** | 8 | Large shadow |
| **Dropdowns** | 8 | Large shadow |
| **FAB** | 16 | Extra large shadow |

---

## Border Radius

| Name | Size | Usage |
|------|------|-------|
| **None** | 0px | Square elements |
| **Small** | 4px | Small badges, Tags |
| **Medium** | 8px | Buttons, Inputs, Small cards |
| **Large** | 12px | Cards, Modals |
| **XLarge** | 16px | Chat bubbles, Large modals |
| **Full** | 9999px | Pills, Circular avatars |

### Component-Specific Border Radius

| Element | Border Radius |
|---------|------------|
| **Buttons** | 8px |
| **Input Fields** | 8px |
| **Cards** | 12px |
| **Modals** | 16px (top corners on mobile) |
| **Chat Bubbles** | 16px (with one small corner) |
| **Badges** | 4px or Full (pills) |
| **Avatars** | Full (circular) |

---

## Implementation Guide

### React Native Implementation

#### 1. Create Theme Constants File

```typescript
// src/constants/theme.ts

export const colors = {
  // Gray Scale
  gray900: '#111827',
  gray800: '#1F2937',
  gray700: '#374151',
  gray600: '#4B5563',
  gray500: '#6B7280',
  gray400: '#9CA3AF',
  gray300: '#D1D5DB',
  gray200: '#E5E7EB',
  gray100: '#F3F4F6',
  gray50: '#F9FAFB',
  white: '#FFFFFF',
  black: '#000000',

  // Accent Colors
  blue600: '#2563EB',
  blue500: '#3B82F6',
  green600: '#16A34A',
  green500: '#10B981',
  green100: '#D1FAE5',
  red600: '#DC2626',
  red500: '#EF4444',
  red200: '#FECACA',
  amber500: '#F59E0B',
  amber100: '#FEF3C7',

  // Semantic Colors
  primary: '#111827',
  secondary: '#4B5563',
  accent: '#2563EB',
  success: '#16A34A',
  error: '#DC2626',
  warning: '#F59E0B',
  background: '#F9FAFB',
  surface: '#FFFFFF',
  textPrimary: '#111827',
  textSecondary: '#4B5563',
  textDisabled: '#9CA3AF',
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
  h1: { fontSize: 32, fontWeight: '700' as const, lineHeight: 40 },
  h2: { fontSize: 24, fontWeight: '700' as const, lineHeight: 32 },
  h3: { fontSize: 20, fontWeight: '600' as const, lineHeight: 28 },
  h4: { fontSize: 18, fontWeight: '600' as const, lineHeight: 24 },
  bodyLarge: { fontSize: 18, fontWeight: '400' as const, lineHeight: 28 },
  body: { fontSize: 16, fontWeight: '400' as const, lineHeight: 24 },
  bodySmall: { fontSize: 14, fontWeight: '400' as const, lineHeight: 20 },
  caption: { fontSize: 12, fontWeight: '400' as const, lineHeight: 16 },
  button: { fontSize: 14, fontWeight: '600' as const, lineHeight: 20 },
  label: { fontSize: 14, fontWeight: '500' as const, lineHeight: 20 },
};

export const borderRadius = {
  none: 0,
  small: 4,
  medium: 8,
  large: 12,
  xlarge: 16,
  full: 9999,
};

export const shadows = {
  none: {},
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 8,
  },
};
```

#### 2. Component Usage Examples

```typescript
// Primary Button
import { colors, spacing, borderRadius, shadows } from '../constants/theme';

const PrimaryButton = ({ title, onPress }) => (
  <TouchableOpacity
    style={{
      backgroundColor: colors.gray900,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.lg,
      borderRadius: borderRadius.medium,
      ...shadows.md,
    }}
    onPress={onPress}
  >
    <Text style={{ color: colors.white, ...typography.button }}>
      {title}
    </Text>
  </TouchableOpacity>
);

// Card
const Card = ({ children }) => (
  <View
    style={{
      backgroundColor: colors.white,
      borderRadius: borderRadius.large,
      borderWidth: 1,
      borderColor: colors.gray200,
      padding: spacing.lg,
      ...shadows.md,
    }}
  >
    {children}
  </View>
);

// Navbar
const Navbar = () => (
  <View
    style={{
      height: 64,
      backgroundColor: colors.gray900,
      paddingHorizontal: spacing.md,
      ...shadows.lg,
    }}
  >
    <Text style={{ color: colors.white, ...typography.h3 }}>
      PAATA.AI
    </Text>
  </View>
);
```

#### 3. Using Linear Gradients

```typescript
import LinearGradient from 'react-native-linear-gradient';

// Navbar with gradient
const Navbar = () => (
  <LinearGradient
    colors={[colors.gray900, colors.gray800]}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 0 }}
    style={{
      height: 64,
      paddingHorizontal: spacing.md,
      ...shadows.lg,
    }}
  >
    <Text style={{ color: colors.white, ...typography.h3 }}>
      PAATA.AI
    </Text>
  </LinearGradient>
);
```

### StyleSheet Best Practices

1. **Always use theme constants** - Never hardcode colors or spacing
2. **Create reusable style objects** - Define common patterns in a shared styles file
3. **Use StyleSheet.create()** - For better performance
4. **Maintain consistency** - Follow the design system strictly
5. **Test on both platforms** - iOS and Android may render shadows differently

### Dark Mode (Future Consideration)

When implementing dark mode, create a theme provider:

```typescript
// src/contexts/ThemeContext.tsx
import { createContext, useContext, useState } from 'react';
import { colors as lightColors } from '../constants/theme';

const darkColors = {
  ...lightColors,
  primary: '#F9FAFB',
  background: '#111827',
  surface: '#1F2937',
  textPrimary: '#FFFFFF',
  textSecondary: '#D1D5DB',
  // ... other dark mode overrides
};

export const ThemeContext = createContext({
  colors: lightColors,
  isDark: false,
  toggleTheme: () => {},
});
```

---

## Accessibility Guidelines

### Color Contrast

- **Normal Text**: Minimum 4.5:1 contrast ratio (WCAG AA)
- **Large Text**: Minimum 3:1 contrast ratio (WCAG AA)
- **Interactive Elements**: Minimum 3:1 contrast ratio

### Text Sizes

- **Minimum Touch Target**: 44x44 points (iOS), 48x48 dp (Android)
- **Minimum Readable Text**: 14px (16px recommended)

### Focus Indicators

- Always provide visible focus indicators for keyboard navigation
- Use 2px border in `Gray-900` for focus states

---

## Design Tokens Summary

### Quick Reference

| Element | Color | Hex |
|---------|-------|-----|
| **Primary Background** | Gray-900 | `#111827` |
| **Secondary Background** | Gray-800 | `#1F2937` |
| **Page Background** | Gray-50 | `#F9FAFB` |
| **Card Background** | White | `#FFFFFF` |
| **Primary Text** | Gray-900 | `#111827` |
| **Secondary Text** | Gray-600 | `#4B5563` |
| **Primary Button** | Gray-900 | `#111827` |
| **Accent Color** | Blue-600 | `#2563EB` |
| **Success** | Green-600 | `#16A34A` |
| **Error** | Red-600 | `#DC2626` |
| **Border** | Gray-200 | `#E5E7EB` |

---

## Notes

- All colors are specified in hex format for consistency
- RGB values are provided for reference
- The design system is optimized for light mode (dark mode can be added later)
- All interactive elements should have hover/active states
- All colors should meet WCAG AA contrast requirements
- Use system fonts for optimal performance and native feel

---

## Version History

- **v1.0** - Initial design scheme documentation (2024)

---

**Last Updated**: 2024
**Maintained By**: PAATA.AI Development Team


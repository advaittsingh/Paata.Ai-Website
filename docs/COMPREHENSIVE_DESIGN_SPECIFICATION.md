# 🎨 PAATA.AI Comprehensive Design Specification

**Version:** 2.0  
**Last Updated:** January 2025  
**Purpose:** Complete design specification with every detail from the website for mobile app implementation

---

## 📋 Table of Contents

1. [Design System](#design-system)
2. [Component Library](#component-library)
3. [Page Specifications](#page-specifications)
4. [State Variations](#state-variations)
5. [Interactions & Animations](#interactions--animations)
6. [Icons & Assets](#icons--assets)
7. [Responsive Design](#responsive-design)
8. [Accessibility](#accessibility)

---

# 🎨 Design System

## Color Palette

### Primary Colors
```css
/* Dark Background/Accents - PRIMARY ACTION COLOR */
--gray-900: #111827
RGB: rgb(17, 24, 39)
Usage: Primary buttons, active states, icons, accents, navbar background

--gray-800: #1F2937
RGB: rgb(31, 41, 55)
Usage: Hover states, secondary backgrounds, navbar gradient end

--gray-700: #374151
RGB: rgb(55, 65, 81)
Usage: Borders, dividers, secondary text
```

### Text Colors
```css
/* Primary Text (on light backgrounds) */
--text-gray-900: #111827
RGB: rgb(17, 24, 39)
Usage: Headings, primary text, labels

/* Secondary Text */
--text-gray-700: #374151
RGB: rgb(55, 65, 81)
Usage: Secondary text, descriptions

/* Tertiary Text */
--text-gray-600: #4B5563
RGB: rgb(75, 85, 99)
Usage: Helper text, timestamps

/* Muted Text */
--text-gray-500: #6B7280
RGB: rgb(107, 114, 128)
Usage: Placeholders, disabled text

/* Text on Dark Backgrounds */
--text-white: #FFFFFF
RGB: rgb(255, 255, 255)
Usage: Text on gray-900 backgrounds, navbar text
```

### Background Colors
```css
/* Card/Content Backgrounds */
--bg-white: #FFFFFF
RGB: rgb(255, 255, 255)
Usage: Cards, modals, main content areas

/* Page Background */
--bg-gray-50: #F9FAFB
RGB: rgb(249, 250, 251)
Usage: Page backgrounds, section backgrounds

/* Subtle Backgrounds */
--bg-gray-100: #F3F4F6
RGB: rgb(243, 244, 246)
Usage: Badges, subtle highlights, inactive states

/* Light Gray */
--bg-gray-200: #E5E7EB
RGB: rgb(229, 231, 235)
Usage: Borders, dividers, skeleton loaders
```

### Status Colors
```css
/* Success */
--success-green: #10B981
RGB: rgb(16, 185, 129)
Usage: Success messages, positive indicators, checkmarks

/* Error */
--error-red: #EF4444
RGB: rgb(239, 68, 68)
Usage: Error messages, destructive actions, validation errors

/* Warning */
--warning-orange: #F59E0B
RGB: rgb(245, 158, 11)
Usage: Warning messages, caution indicators

/* Info */
--info-blue: #3B82F6
RGB: rgb(59, 130, 246)
Usage: Info messages, links, informational badges
```

### Color Usage Guidelines

**Primary Actions:**
- Background: `gray-900` (#111827)
- Text: `white` (#FFFFFF)
- Hover: `gray-800` (#1F2937)

**Secondary Actions:**
- Background: `transparent`
- Border: `1px solid white`
- Text: `white`
- Hover: `white` background, `gray-900` text

**Text Buttons:**
- Background: `transparent`
- Text: `gray-900`
- Hover: `gray-100` background

**Navigation Hover:**
- Text: `gray-300` (#D1D5DB)
- Background: `transparent`

**Active States:**
- Background: `gray-100` (#F3F4F6)
- Text: `gray-900` (#111827)

## Typography

### Font Family
```css
Primary Font: Roboto (or system default sans-serif)
Fallback: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif
```

### Type Scale

#### Heading 1 (h1)
```css
Font Size: 3rem (48px)
Line Height: 1.2
Font Weight: 700 (Bold)
Letter Spacing: -0.02em
Color: gray-900 (on light) / white (on dark)
Usage: Page titles, hero headlines
Example: "Homework Assistance at your fingertips with Paata Ai"
```

#### Heading 2 (h2)
```css
Font Size: 2.25rem (36px)
Line Height: 1.3
Font Weight: 700 (Bold)
Letter Spacing: -0.01em
Color: gray-900
Usage: Section titles, major headings
Example: "Your Learning App"
```

#### Heading 3 (h3)
```css
Font Size: 1.875rem (30px)
Line Height: 1.4
Font Weight: 600 (Semibold)
Color: gray-900
Usage: Subsection titles, card titles
Example: "Homework Buddy App"
```

#### Heading 4 (h4)
```css
Font Size: 1.5rem (24px)
Line Height: 1.5
Font Weight: 600 (Semibold)
Color: gray-900
Usage: Card titles, smaller section headings
```

#### Heading 5 (h5)
```css
Font Size: 1.25rem (20px)
Line Height: 1.5
Font Weight: 500 (Medium)
Color: gray-900
Usage: Small headings, labels
```

#### Heading 6 (h6)
```css
Font Size: 1.125rem (18px)
Line Height: 1.5
Font Weight: 500 (Medium)
Color: gray-900
Usage: Labels, small headings
```

#### Body Large (Lead)
```css
Font Size: 1.125rem (18px)
Line Height: 1.75
Font Weight: 400 (Regular)
Color: gray-500 (muted) or gray-700 (normal)
Usage: Lead paragraphs, descriptions
Example: "Revolutionize your learning with AI-powered homework assistance..."
```

#### Body (Default)
```css
Font Size: 1rem (16px)
Line Height: 1.75
Font Weight: 400 (Regular)
Color: gray-700
Usage: Body text, paragraphs
```

#### Body Small
```css
Font Size: 0.875rem (14px)
Line Height: 1.5
Font Weight: 400 (Regular)
Color: gray-600
Usage: Secondary text, helper text
```

#### Caption
```css
Font Size: 0.75rem (12px)
Line Height: 1.5
Font Weight: 400 (Regular)
Color: gray-500
Usage: Captions, timestamps, fine print
```

### Font Weights
```css
Thin: 100
Light: 300
Regular: 400 (default)
Medium: 500
Semibold: 600
Bold: 700
```

## Spacing System

### Base Unit: 4px

```css
xs: 0.25rem (4px)
sm: 0.5rem (8px)
md: 0.75rem (12px)
base: 1rem (16px)
lg: 1.5rem (24px)
xl: 2rem (32px)
2xl: 2.5rem (40px)
3xl: 3rem (48px)
4xl: 4rem (64px)
5xl: 5rem (80px)
6xl: 6rem (96px)
7xl: 7rem (112px)
```

### Spacing Usage

**Section Padding:**
- Major sections: `py-28` (7rem vertical = 112px)
- Standard sections: `py-16` (4rem = 64px)
- Compact sections: `py-8` (2rem = 32px)

**Card Padding:**
- Standard: `p-6` to `p-8` (1.5rem to 2rem = 24px to 32px)
- Compact: `p-4` (1rem = 16px)
- Spacious: `p-12` to `p-14` (3rem to 3.5rem = 48px to 56px)

**Button Padding:**
- Large: `px-4 py-3` (1rem × 0.75rem = 16px × 12px)
- Medium: `px-3 py-2` (0.75rem × 0.5rem = 12px × 8px)
- Small: `px-2 py-1` (0.5rem × 0.25rem = 8px × 4px)

**Input Padding:**
- Standard: `px-4 py-3` (1rem × 0.75rem = 16px × 12px)

**Gap Between Elements:**
- Tight: `gap-2` (0.5rem = 8px)
- Standard: `gap-4` to `gap-6` (1rem to 1.5rem = 16px to 24px)
- Spacious: `gap-8` to `gap-12` (2rem to 3rem = 32px to 48px)

## Shadows

```css
/* Small Shadow */
shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05)

/* Medium Shadow (Default) */
shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)

/* Large Shadow */
shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)

/* Extra Large Shadow */
shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)

/* 2XL Shadow (for modals, cards) */
shadow-2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25)
```

**Usage:**
- Cards: `shadow-md` or `shadow-lg`
- Modals: `shadow-2xl`
- Buttons: `shadow-lg` (on hover)
- Navbar: `shadow-md`

## Border Radius

```css
none: 0
sm: 0.25rem (4px)
base: 0.5rem (8px)
md: 0.75rem (12px)
lg: 1rem (16px)
xl: 1.5rem (24px)
2xl: 2rem (32px)
full: 9999px (circular)
```

**Usage:**
- Buttons: `rounded-lg` (0.5rem = 8px)
- Cards: `rounded-xl` (0.75rem = 12px) or `rounded-2xl` (1rem = 16px)
- Inputs: `rounded-lg` (0.5rem = 8px)
- Icons: `rounded-lg` (0.5rem = 8px) or `rounded-full` (circular)
- Badges: `rounded-full` (circular)

## Borders

```css
/* Standard Border */
border: 1px solid gray-200 (#E5E7EB)
border: 1px solid gray-300 (#D1D5DB)

/* Focus Border */
border: 2px solid gray-900 (#111827)

/* Error Border */
border: 1px solid error-red (#EF4444)
border-l-4: 4px solid error-red (left border for error messages)
```

---

# 🧩 Component Library

## Buttons

### Primary Button
```css
/* Default State */
Background: gray-900 (#111827)
Text: white (#FFFFFF)
Padding: px-4 py-3 (16px × 12px)
Border Radius: 0.5rem (8px)
Font: Semibold, 0.875rem (14px)
Shadow: shadow-lg
Transition: all duration-200

/* Hover State */
Background: gray-800 (#1F2937)
Shadow: shadow-lg (enhanced)
Transform: scale(1.02) (optional)

/* Active State */
Background: gray-900 (#111827)
Transform: scale(0.98)

/* Disabled State */
Background: gray-300 (#D1D5DB)
Text: gray-500 (#6B7280)
Cursor: not-allowed
Opacity: 0.5
```

**Example:**
```tsx
<Button
  size="lg"
  color="white"
  className="flex items-center justify-center gap-2"
>
  Get Started
</Button>
```

### Secondary Button (Outlined)
```css
/* Default State */
Background: transparent
Border: 1px solid white
Text: white (#FFFFFF)
Padding: px-4 py-2 (16px × 8px)
Border Radius: 0.5rem (8px)
Font: Semibold, 0.875rem (14px)

/* Hover State */
Background: white (#FFFFFF)
Text: gray-900 (#111827)
```

### Text Button
```css
/* Default State */
Background: transparent
Text: gray-900 (#111827)
Padding: px-3 py-2 (12px × 8px)
Font: Medium, 0.875rem (14px)

/* Hover State */
Background: gray-100 (#F3F4F6)
```

### Icon Button
```css
/* Default State */
Size: 40px × 40px (w-10 h-10)
Background: transparent
Border Radius: 0.5rem (8px)
Padding: 0.5rem (8px)

/* Hover State */
Background: gray-100 (#F3F4F6)
```

## Cards

### Standard Card
```css
/* Container */
Background: white (#FFFFFF)
Border Radius: 0.75rem (12px) or 1rem (16px)
Shadow: shadow-md or shadow-lg
Padding: p-6 to p-8 (24px to 32px)
Border: border border-gray-200 (optional)
```

**Example:**
```tsx
<Card className="shadow-lg">
  <CardBody className="p-6">
    {/* Content */}
  </CardBody>
</Card>
```

### Card with Header
```css
/* Header */
Background: gray-50 (#F9FAFB)
Padding: px-6 py-4 (24px × 16px)
Border Radius: rounded-t-xl (top corners only)
Border Bottom: border-b border-gray-200

/* Body */
Padding: p-6 (24px)
```

### Feature Card
```css
/* Container */
Background: white (#FFFFFF)
Border Radius: 0.75rem (12px)
Shadow: shadow-md
Padding: p-6 (24px)
Border: none

/* Icon Container */
Size: 48px × 48px (w-12 h-12)
Background: gray-900 (#111827)
Border Radius: 0.5rem (8px)
Display: flex items-center justify-center
Margin: mb-4 (16px)

/* Icon */
Color: white (#FFFFFF)
Size: 24px × 24px (w-6 h-6)

/* Title */
Font: Semibold, 1.25rem (20px)
Color: gray-900 (#111827)
Margin: mb-2 (8px)

/* Description */
Font: Regular, 1rem (16px)
Color: gray-600 (#4B5563)
Line Height: 1.75
```

## Input Fields

### Text Input
```css
/* Container */
Width: 100%
Background: white (#FFFFFF)
Border: 1px solid gray-300 (#D1D5DB)
Border Radius: 0.5rem (8px)
Padding: px-4 py-3 (16px × 12px)
Font: Regular, 1rem (16px)
Color: gray-900 (#111827)

/* Placeholder */
Color: gray-500 (#6B7280)

/* Focus State */
Border: 2px solid gray-900 (#111827)
Outline: none
Ring: ring-2 ring-gray-900
```

**Example:**
```tsx
<Input
  label="Email Address"
  type="email"
  size="lg"
  className="!border-t-blue-gray-200 focus:!border-t-gray-900"
  labelProps={{
    className: "before:content-none after:content-none",
  }}
/>
```

### Textarea
```css
/* Same as Text Input */
Min Height: 6rem (96px)
Resize: vertical
```

### Password Input
```css
/* Same as Text Input */
/* With show/hide toggle button */
Toggle Button:
  Position: absolute right-3 top-1/2
  Color: gray-500 (#6B7280)
  Hover: gray-700 (#374151)
```

## Icons

### Icon Container (Primary)
```css
/* Container */
Size: 48px × 48px (w-12 h-12) or 64px × 64px (w-16 h-16)
Background: gray-900 (#111827)
Text: white (#FFFFFF)
Border Radius: 0.5rem (8px) or 0.75rem (12px)
Display: flex items-center justify-center
Margin: mb-3 to mb-4 (12px to 16px)
Margin X: mx-auto (centered)

/* Icon */
Color: white (#FFFFFF)
Size: 20px × 20px (w-5 h-5) or 24px × 24px (w-6 h-6)
Font Size: text-xl (1.25rem = 20px) for Font Awesome icons
```

**Example:**
```tsx
<div className="mb-3 grid h-12 w-12 place-content-center rounded-lg bg-gray-900 text-white mx-auto">
  <i className="fa-solid fa-envelope text-xl"></i>
</div>
```

### Icon Container (Secondary)
```css
/* Container */
Size: 40px × 40px (w-10 h-10)
Background: gray-100 (#F3F4F6)
Text: gray-900 (#111827)
Border Radius: 0.5rem (8px)
```

## Badges & Chips

### Plan Badge
```css
/* Enterprise */
Background: gray-100 (#F3F4F6)
Text: gray-900 (#111827)
Padding: px-2 py-1 (8px × 4px)
Border Radius: rounded-full
Font: Medium, 0.75rem (12px)

/* Pro */
Background: blue-100 (#DBEAFE)
Text: blue-800 (#1E40AF)

/* Basic */
Background: gray-100 (#F3F4F6)
Text: gray-800 (#1F2937)
```

### Status Chip
```css
/* Active */
Color: green
Variant: ghost

/* Inactive */
Color: gray
Variant: ghost
```

## Loading States

### Spinner
```css
/* Container */
Size: 48px × 48px (w-12 h-12)
Border: 2px solid gray-200 (#E5E7EB)
Border Top: 2px solid gray-900 (#111827)
Border Radius: 50% (circular)
Animation: spin (1s linear infinite)
Margin: mx-auto (centered)
```

**Example:**
```tsx
<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
```

### Skeleton Loader
```css
/* Container */
Background: gray-200 (#E5E7EB)
Border Radius: 0.25rem (4px)
Animation: pulse (2s cubic-bezier(0.4, 0, 0.6, 1) infinite)
Height: matches content
```

## Navigation

### Navbar
```css
/* Container */
Background: gradient from-gray-900 to-gray-800
Height: 4rem (64px) with py-4
Text: white (#FFFFFF)
Position: fixed top-0 z-50
Shadow: shadow-md
Width: 100%

/* Links */
Font: Medium, 0.875rem (14px)
Color: white (#FFFFFF)
Hover: gray-300 (#D1D5DB)
Transition: transition-colors duration-200

/* Logo */
Font: Bold, 1.25rem (20px)
Color: white (#FFFFFF)
```

### Sidebar
```css
/* Container */
Background: white (#FFFFFF)
Width: 16rem (256px) expanded, 4rem (64px) collapsed
Border: border-r border-gray-200
Height: 100vh
Position: fixed or relative

/* Active Item */
Background: gray-100 (#F3F4F6)
Text: gray-900 (#111827)
Border Radius: 0.5rem (8px)
Padding: px-3 py-2 (12px × 8px)

/* Hover */
Background: gray-100 (#F3F4F6)
```

## Messages (Chat)

### User Message
```css
/* Container */
Background: gray-900 (#111827)
Text: white (#FFFFFF)
Border Radius: 0.5rem (8px)
Padding: p-4 (16px)
Max Width: 75% (max-w-3xl)
Margin: ml-auto (right-aligned)
Margin Bottom: mb-4 (16px)

/* Avatar */
Size: 32px × 32px (w-8 h-8)
Background: gray-900 (#111827)
Text: white (#FFFFFF)
Border Radius: 50% (circular)
```

### AI Message
```css
/* Container */
Background: white (#FFFFFF)
Text: gray-900 (#111827)
Border Radius: 0.5rem (8px)
Padding: p-4 (16px)
Max Width: 75% (max-w-3xl)
Margin: mr-auto (left-aligned)
Border: border border-gray-200
Margin Bottom: mb-4 (16px)

/* Avatar */
Size: 32px × 32px (w-8 h-8)
Background: gray-900 (#111827)
Text: white (#FFFFFF)
Border Radius: 50% (circular)
```

## Modals

### Modal Overlay
```css
/* Container */
Position: fixed inset-0
Background: black with opacity-50 (rgba(0, 0, 0, 0.5))
Z-index: 50
Display: flex items-center justify-center
Padding: p-4 (16px)
```

### Modal Content
```css
/* Container */
Background: white (#FFFFFF)
Border Radius: 1rem (16px)
Max Width: 32rem (512px) or 42rem (672px)
Width: 100%
Max Height: 90vh
Overflow: overflow-y-auto
Shadow: shadow-2xl
Padding: p-6 (24px)
```

---

# 📱 Page Specifications

## Homepage

### Hero Section
```css
/* Container */
Min Height: 49rem (784px)
Background: gray-900 (#111827)
Padding: px-8 (32px)
Grid: grid-cols-1 lg:grid-cols-2
Gap: standard

/* Content */
Title: h1, white, mb-4
Description: lead, white, mb-7
Buttons: flex flex-col gap-2 md:flex-row

/* Image */
Max Height: 30rem (480px) md:36rem (576px) lg:40rem (640px)
```

### Feature Section
```css
/* Container */
Padding: py-28 px-4 (112px × 16px)
Background: white

/* Header */
Text Align: center
Margin Bottom: mb-20 (80px)

/* Grid */
Grid: grid-cols-1 md:grid-cols-2
Max Width: max-w-6xl
Gap: gap-4 gap-y-12 (16px × 48px)
```

### Learning Materials Section
```css
/* Container */
Padding: py-28 px-4 (112px × 16px)
Background: white

/* Grid */
Grid: grid-cols-1 lg:grid-cols-2
Gap: gap-12 (48px)
Items: items-center

/* Cards */
Grid: grid-cols-2
Gap: gap-4 gap-y-12 (16px × 48px)
```

### Contact Form Section
```css
/* Container */
Padding: py-28 px-4 (112px × 16px)
Background: white

/* Form Card */
Background: white
Border Radius: rounded-xl (12px)
Shadow: shadow-md
Padding: p-8 md:p-14 (32px to 56px)
Max Width: max-w-4xl
```

## Authentication Pages

### Login/Signup Page
```css
/* Container */
Min Height: 100vh
Background: gray-50 (#F9FAFB)
Padding: px-4 py-8 pt-24 (16px × 32px × 96px)

/* Form Card */
Background: white
Border Radius: rounded-xl (12px)
Shadow: shadow-2xl
Max Width: max-w-md (448px)
Width: 100%

/* Header Section */
Background: gray-900 (#111827)
Text: white
Padding: p-8 pb-6 (32px × 24px)
Border Radius: rounded-t-xl (top corners)

/* Logo Circle */
Size: 64px × 64px (w-16 h-16)
Background: white/20 (rgba(255, 255, 255, 0.2))
Border Radius: 50% (circular)
Margin: mb-4 (16px)

/* Form Fields */
Spacing: space-y-6 (24px)
```

## Chat Interface

### Chat Container
```css
/* Container */
Height: 100vh
Background: gray-50 (#F9FAFB)
Display: flex flex-col
Overflow: hidden

/* Sidebar */
Width: 16rem (256px) on desktop, hidden on mobile
Background: white
Border: border-r border-gray-200
Height: 100%
Overflow: overflow-y-auto

/* Message Area */
Flex: flex-1
Background: white
Padding: p-4 (16px)
Overflow: overflow-y-auto

/* Input Area */
Background: white
Border Top: border-t border-gray-200
Padding: p-4 (16px)
```

### Chat Session List
```css
/* Container */
Padding: p-4 (16px)

/* Session Item */
Padding: p-3 (12px)
Border Radius: rounded-lg (8px)
Margin Bottom: mb-2 (8px)
Hover: bg-gray-800 (on dark sidebar)

/* Active Session */
Background: gray-900 (#111827)
Text: white (#FFFFFF)
```

## Notes Page

### Notes Grid
```css
/* Container */
Grid: grid-cols-1 md:grid-cols-2 lg:grid-cols-3
Gap: gap-6 (24px)
Padding: p-6 (24px)

/* Note Card */
Background: white
Border Radius: rounded-xl (12px)
Shadow: shadow-md
Padding: p-6 (24px)
Hover: shadow-lg
```

## Exam Page

### Exam Generator
```css
/* Container */
Background: white
Border Radius: rounded-xl (12px)
Shadow: shadow-lg
Padding: p-8 (32px)
Max Width: max-w-2xl

/* Form Fields */
Spacing: space-y-6 (24px)
```

### Question Display
```css
/* Container */
Background: white
Border Radius: rounded-xl (12px)
Shadow: shadow-md
Padding: p-6 (24px)
Margin Bottom: mb-4 (16px)

/* Options */
Spacing: space-y-3 (12px)
Padding: p-4 (16px)
Border: border border-gray-200
Border Radius: rounded-lg (8px)
Hover: border-gray-900

/* Selected Option */
Border: 2px solid gray-900 (#111827)
Background: gray-50 (#F9FAFB)
```

## Profile Page

### Profile Card
```css
/* Container */
Background: white
Border Radius: rounded-xl (12px)
Shadow: shadow-lg
Padding: p-8 (32px)

/* Avatar */
Size: 128px × 128px (w-32 h-32)
Border Radius: 50% (circular)
Border: 4px solid white
Shadow: shadow-lg
```

### Settings Section
```css
/* Container */
Background: white
Border Radius: rounded-xl (12px)
Shadow: shadow-md
Padding: p-6 (24px)
Margin Bottom: mb-6 (24px)

/* Section Header */
Padding: px-6 py-4 (24px × 16px)
Background: gray-50 (#F9FAFB)
Border Radius: rounded-t-xl (top corners)
Border Bottom: border-b border-gray-200
```

---

# 🎭 State Variations

## Button States

### Default
- Background: gray-900
- Text: white
- Shadow: shadow-lg

### Hover
- Background: gray-800
- Shadow: enhanced
- Transform: scale(1.02)

### Active/Pressed
- Background: gray-900
- Transform: scale(0.98)

### Disabled
- Background: gray-300
- Text: gray-500
- Opacity: 0.5
- Cursor: not-allowed

### Loading
- Background: gray-900
- Text: "Loading..."
- Spinner: visible
- Pointer Events: none

## Input States

### Default
- Border: gray-300
- Background: white

### Focus
- Border: 2px solid gray-900
- Ring: ring-2 ring-gray-900
- Outline: none

### Error
- Border: 1px solid error-red
- Ring: ring-2 ring-red-500

### Disabled
- Background: gray-100
- Text: gray-500
- Cursor: not-allowed

## Card States

### Default
- Shadow: shadow-md
- Background: white

### Hover
- Shadow: shadow-lg
- Transform: translateY(-2px)

### Selected/Active
- Border: 2px solid gray-900
- Shadow: shadow-lg

## Navigation States

### Default Link
- Color: white (navbar) / gray-700 (sidebar)
- Background: transparent

### Hover
- Color: gray-300 (navbar) / gray-900 (sidebar)
- Background: transparent (navbar) / gray-100 (sidebar)

### Active
- Color: white (navbar) / gray-900 (sidebar)
- Background: gray-100 (sidebar)
- Font Weight: medium

---

# ✨ Interactions & Animations

## Transitions

```css
/* Standard Transition */
transition: all duration-200
Duration: 200ms
Easing: ease-in-out

/* Color Transition */
transition-colors duration-200

/* Transform Transition */
transition-transform duration-200

/* Opacity Transition */
transition-opacity duration-200
```

## Animations

### Fade In
```css
animation: fade-in duration-500
@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}
```

### Slide In
```css
animation: slide-in-from-bottom-4 duration-500
@keyframes slide-in-from-bottom-4 {
  from { transform: translateY(1rem); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
```

### Spin (Loading)
```css
animation: spin 1s linear infinite
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
```

### Pulse (Skeleton)
```css
animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
```

## Hover Effects

### Button Hover
- Background color change
- Shadow enhancement
- Slight scale (1.02)

### Card Hover
- Shadow enhancement
- Slight lift (translateY(-2px))

### Link Hover
- Color change
- Underline (optional)

---

# 🎯 Icons & Assets

## Icon Library

### Font Awesome Icons (Primary)
```css
Font Family: Font Awesome 6
Usage: <i className="fa-solid fa-icon-name"></i>
Size: text-xl (20px) or text-2xl (24px)
```

**Common Icons:**
- `fa-envelope` - Email
- `fa-phone` - Phone
- `fa-clock` - Time
- `fa-book` - Book/Subjects
- `fa-video` - Video
- `fa-graduation-cap` - Education
- `fa-filter` - Filter
- `fa-comments` - Chat
- `fa-sticky-note` - Notes
- `fa-lightbulb` - Flashcards
- `fa-clipboard-check` - Exam
- `fa-brain` - Focus Mode
- `fa-chart-line` - Progress/Analytics
- `fa-trophy` - Achievements
- `fa-user` - Profile
- `fa-cog` - Settings
- `fa-credit-card` - Billing
- `fa-shield-check` - Security
- `fa-bell` - Notifications

### Heroicons (Secondary)
```css
Library: @heroicons/react/24/outline or /24/solid
Usage: <Icon className="w-6 h-6" />
Size: w-5 h-5 (20px) or w-6 h-6 (24px)
```

## Logo

### Primary Logo
```css
Text: "PAATA.AI"
Font: Bold, 1.25rem (20px)
Color: white (on dark) / gray-900 (on light)
```

### Logo Icon
```css
Size: 64px × 64px (w-16 h-16)
Background: gray-900 (#111827)
Text: "P" (white, bold, 2xl)
Border Radius: 50% (circular) or 0.5rem (8px)
```

## Images

### Avatar
```css
Size: 128px × 128px (w-32 h-32)
Border Radius: 50% (circular)
Border: 4px solid white
Shadow: shadow-lg
Object Fit: cover
```

### Thumbnails
```css
Size: 200px × 200px
Border Radius: 0.5rem (8px)
Object Fit: cover
```

### Hero Image
```css
Max Width: 470px
Max Height: 576px
Responsive: max-h-[30rem] md:max-h-[36rem] lg:max-h-[40rem]
```

---

# 📐 Responsive Design

## Breakpoints

```css
sm: 640px (small devices)
md: 768px (tablets)
lg: 1024px (desktops)
xl: 1280px (large desktops)
2xl: 1536px (extra large desktops)
```

## Mobile Adaptations

### Navigation
- Desktop: Horizontal navbar
- Mobile: Hamburger menu with slide-out drawer

### Grid Layouts
- Mobile: 1 column
- Tablet: 2 columns
- Desktop: 3-4 columns

### Spacing
- Mobile: Reduced padding (py-16 instead of py-28)
- Desktop: Full spacing

### Typography
- Mobile: Slightly smaller font sizes
- Desktop: Full type scale

---

# ♿ Accessibility

## Color Contrast
- Text on gray-900: white (WCAG AAA)
- Text on white: gray-900 (WCAG AAA)
- Minimum contrast ratio: 4.5:1

## Focus States
- All interactive elements have visible focus indicators
- Focus ring: 2px solid gray-900
- Outline: none (replaced by ring)

## Keyboard Navigation
- All interactive elements are keyboard accessible
- Tab order is logical
- Enter/Space activates buttons

## Screen Readers
- All images have alt text
- Form inputs have labels
- Buttons have descriptive text
- ARIA labels where needed

---

# 📊 Component Specifications

## Feature Card Component

```tsx
<Card className="border-0 shadow-md">
  <CardBody className="p-6 text-center">
    {/* Icon */}
    <div className="mb-4 grid h-12 w-12 place-content-center rounded-lg bg-gray-900 text-white mx-auto">
      <Icon className="w-6 h-6" />
    </div>
    
    {/* Title */}
    <Typography variant="h5" color="blue-gray" className="mb-2">
      Feature Title
    </Typography>
    
    {/* Description */}
    <Typography color="gray" className="text-sm">
      Feature description text
    </Typography>
  </CardBody>
</Card>
```

## Contact Info Card

```tsx
<div>
  {/* Icon */}
  <div className="mb-3 grid h-12 w-12 place-content-center rounded-lg bg-gray-900 text-white mx-auto">
    <i className="fa-solid fa-envelope text-xl"></i>
  </div>
  
  {/* Title */}
  <Typography variant="h6" color="blue-gray" className="mb-2">
    Email Us
  </Typography>
  
  {/* Content */}
  <Typography color="gray" className="text-sm">
    support@paata.ai
  </Typography>
</div>
```

## Stat Card

```tsx
<Card className="shadow-lg">
  <CardBody className="text-center p-6">
    {/* Icon */}
    <i className="fa-solid fa-message text-4xl text-gray-900 mb-4"></i>
    
    {/* Number */}
    <Typography variant="h3" className="text-gray-900 mb-2">
      1,234
    </Typography>
    
    {/* Label */}
    <Typography className="text-gray-600">
      Questions Answered
    </Typography>
  </CardBody>
</Card>
```

---

# 🎨 Design Tokens Summary

## Colors
- Primary: `#111827` (gray-900)
- Text Primary: `#111827` (gray-900)
- Text Secondary: `#4B5563` (gray-600)
- Background: `#FFFFFF` (white)
- Page Background: `#F9FAFB` (gray-50)
- Success: `#10B981` (green-500)
- Error: `#EF4444` (red-500)
- Warning: `#F59E0B` (orange-500)
- Info: `#3B82F6` (blue-500)

## Typography
- Font Family: Roboto (system fallback)
- Heading 1: 48px, Bold
- Heading 2: 36px, Bold
- Heading 3: 30px, Semibold
- Body: 16px, Regular
- Small: 14px, Regular
- Caption: 12px, Regular

## Spacing
- Base Unit: 4px
- Section Padding: 112px (py-28)
- Card Padding: 24-32px (p-6 to p-8)
- Button Padding: 16px × 12px (px-4 py-3)

## Shadows
- Small: `shadow-sm`
- Medium: `shadow-md` (default)
- Large: `shadow-lg`
- Extra Large: `shadow-2xl` (modals)

## Border Radius
- Small: 4px
- Medium: 8px (buttons, inputs)
- Large: 12px (cards)
- Full: 50% (circular)

---

---

# 📄 Complete Page Layouts

## Homepage Layout

### Structure
```
┌─────────────────────────────────────┐
│         Navbar (Fixed Top)          │
├─────────────────────────────────────┤
│                                     │
│         Hero Section                │
│    (min-h-[49rem], bg-gray-900)     │
│                                     │
├─────────────────────────────────────┤
│                                     │
│      Feature Section                │
│    (py-28, bg-white)                │
│                                     │
├─────────────────────────────────────┤
│                                     │
│   Mobile Convenience Section        │
│    (py-28, bg-white)                │
│                                     │
├─────────────────────────────────────┤
│                                     │
│      Video Intro Section            │
│    (py-28, bg-white)                │
│                                     │
├─────────────────────────────────────┤
│                                     │
│   Learning Materials Section        │
│    (py-28, bg-white)                │
│                                     │
├─────────────────────────────────────┤
│                                     │
│      Contact Form Section           │
│    (py-28, bg-white)                │
│                                     │
├─────────────────────────────────────┤
│            Footer                   │
└─────────────────────────────────────┘
```

### Hero Section Details
```css
Container:
  min-height: 49rem (784px)
  background: gray-900 (#111827)
  padding: px-8 (32px)
  grid: grid-cols-1 lg:grid-cols-2
  gap: standard
  align-items: center

Content Column:
  Title: h1, white, mb-4
  Description: lead, white, mb-7
  App Buttons: flex flex-col gap-2 md:flex-row

Image Column:
  max-height: 30rem md:36rem lg:40rem
  margin: my-20 lg:my-0
  transform: -translate-y-32 lg:translate-y-0

Info Card (below hero):
  background: white
  border-radius: rounded-xl
  padding: p-5 md:p-14
  margin: mx-8 lg:mx-16 -mt-24
  shadow: shadow-md
```

## Chat Interface Layout

### Structure
```
┌─────────────────────────────────────┐
│         Navbar (Fixed Top)          │
├──────────┬──────────────────────────┤
│          │                          │
│ Sidebar  │    Message Area          │
│ (256px)  │    (flex-1)              │
│          │                          │
│ Sessions │    Messages List         │
│ List     │    (scrollable)          │
│          │                          │
│          ├──────────────────────────┤
│          │    Input Area            │
│          │    (fixed bottom)        │
└──────────┴──────────────────────────┘
```

### Chat Message Bubble
```css
User Message:
  background: gray-900 (#111827)
  color: white
  border-radius: 0.5rem (8px)
  padding: p-4 (16px)
  max-width: 75% (max-w-3xl)
  margin-left: auto (right-aligned)
  margin-bottom: mb-4 (16px)
  
  Avatar:
    size: 32px × 32px
    background: gray-900
    color: white
    border-radius: 50%

AI Message:
  background: white
  color: gray-900
  border: border border-gray-200
  border-radius: 0.5rem (8px)
  padding: p-4 (16px)
  max-width: 75% (max-w-3xl)
  margin-right: auto (left-aligned)
  margin-bottom: mb-4 (16px)
  
  Avatar:
    size: 32px × 32px
    background: gray-900
    color: white
    border-radius: 50%
```

### Chat Input Area
```css
Container:
  background: white
  border-top: border-t border-gray-200
  padding: p-4 (16px)
  display: flex
  gap: gap-2 (8px)
  align-items: center

Input Field:
  flex: flex-1
  border: border border-gray-300
  border-radius: rounded-lg
  padding: px-4 py-3
  focus: ring-2 ring-gray-900

Send Button:
  size: 40px × 40px
  background: gray-900
  color: white
  border-radius: rounded-lg
  padding: p-2
```

## Notes Page Layout

### Structure
```
┌─────────────────────────────────────┐
│         Navbar (Fixed Top)          │
├──────────┬──────────────────────────┤
│          │                          │
│ Sidebar  │    Notes Area            │
│          │                          │
│          │  [Search] [Filter]       │
│          │                          │
│          │  ┌────┐ ┌────┐ ┌────┐   │
│          │  │Note│ │Note│ │Note│   │
│          │  └────┘ └────┘ └────┘   │
│          │                          │
│          │  [+ Create Note]         │
└──────────┴──────────────────────────┘
```

### Note Card
```css
Container:
  background: white
  border-radius: rounded-xl (12px)
  shadow: shadow-md
  padding: p-6 (24px)
  hover: shadow-lg
  cursor: pointer

Title:
  font: semibold, 1.25rem (20px)
  color: gray-900
  margin-bottom: mb-2 (8px)

Content Preview:
  font: regular, 1rem (16px)
  color: gray-600
  line-height: 1.5
  max-height: 3rem
  overflow: hidden
  text-overflow: ellipsis

Category Badge:
  background: gray-100
  color: gray-900
  padding: px-2 py-1
  border-radius: rounded-full
  font-size: 0.75rem (12px)
  margin-top: mt-2

Tags:
  display: flex
  gap: gap-2
  margin-top: mt-2
  flex-wrap: wrap
```

## Flashcards Page Layout

### Flashcard Card (Review Mode)
```css
Container:
  background: white
  border-radius: rounded-xl (12px)
  shadow: shadow-lg
  padding: p-8 (32px)
  min-height: 300px
  display: flex
  flex-direction: column
  justify-content: center
  align-items: center
  perspective: 1000px

Front Side:
  display: block
  backface-visibility: hidden
  transform: rotateY(0deg)

Back Side:
  display: none (or block when flipped)
  backface-visibility: hidden
  transform: rotateY(180deg)

Question:
  font: semibold, 1.5rem (24px)
  color: gray-900
  text-align: center
  margin-bottom: mb-4

Answer:
  font: regular, 1.125rem (18px)
  color: gray-700
  text-align: center

Flip Button:
  margin-top: mt-6
  background: gray-900
  color: white
  padding: px-6 py-3
  border-radius: rounded-lg
```

## Exam Page Layout

### Exam Generator Form
```css
Container:
  background: white
  border-radius: rounded-xl (12px)
  shadow: shadow-lg
  padding: p-8 (32px)
  max-width: max-w-2xl

Form Fields:
  display: flex
  flex-direction: column
  gap: gap-6 (24px)

Select Dropdown:
  border: border border-gray-300
  border-radius: rounded-lg
  padding: px-4 py-3
  focus: ring-2 ring-gray-900

Generate Button:
  background: gray-900
  color: white
  padding: px-6 py-3
  border-radius: rounded-lg
  font: semibold
  width: 100%
```

### Question Display
```css
Container:
  background: white
  border-radius: rounded-xl (12px)
  shadow: shadow-md
  padding: p-6 (24px)
  margin-bottom: mb-4 (16px)

Question Text:
  font: semibold, 1.25rem (20px)
  color: gray-900
  margin-bottom: mb-4

Options:
  display: flex
  flex-direction: column
  gap: gap-3 (12px)

Option Item:
  border: border border-gray-200
  border-radius: rounded-lg (8px)
  padding: p-4 (16px)
  cursor: pointer
  hover: border-gray-900
  transition: border-color duration-200

Selected Option:
  border: 2px solid gray-900
  background: gray-50

Correct Answer (Results):
  border: 2px solid green-500
  background: green-50

Incorrect Answer (Results):
  border: 2px solid red-500
  background: red-50
```

## Profile Page Layout

### Profile Header
```css
Container:
  background: white
  border-radius: rounded-xl (12px)
  shadow: shadow-lg
  padding: p-8 (32px)
  display: flex
  gap: gap-6 (24px)
  align-items: center

Avatar:
  size: 128px × 128px
  border-radius: 50%
  border: 4px solid white
  shadow: shadow-lg

Info:
  flex: flex-1

Name:
  font: bold, 2rem (32px)
  color: gray-900
  margin-bottom: mb-2

Email:
  font: regular, 1rem (16px)
  color: gray-600
  margin-bottom: mb-2

Plan Badge:
  display: inline-block
  background: gray-100
  color: gray-900
  padding: px-3 py-1
  border-radius: rounded-full
  font-size: 0.875rem (14px)
```

## Progress Page Layout

### Stat Cards Grid
```css
Container:
  display: grid
  grid-template-columns: repeat(4, 1fr)
  gap: gap-6 (24px)
  margin-bottom: mb-8 (32px)

Stat Card:
  background: white
  border-radius: rounded-xl (12px)
  shadow: shadow-lg
  padding: p-6 (24px)
  text-align: center

Icon:
  size: 48px × 48px
  color: gray-900 (or status color)
  margin-bottom: mb-4

Number:
  font: bold, 2rem (32px)
  color: gray-900
  margin-bottom: mb-2

Label:
  font: regular, 1rem (16px)
  color: gray-600
```

### Activity Chart
```css
Container:
  background: white
  border-radius: rounded-xl (12px)
  shadow: shadow-lg
  padding: p-6 (24px)

Header:
  background: gray-50
  padding: px-6 py-4
  border-radius: rounded-t-xl
  border-bottom: border-b border-gray-200
  margin: -p-6 -p-6 mb-6 -p-6

Chart Bars:
  display: flex
  align-items: flex-end
  gap: gap-2 (8px)
  height: 200px

Bar:
  flex: 1
  background: gray-900
  border-radius: rounded-t-lg
  min-height: 4px
```

---

# 🎯 Interactive Elements

## Dropdown Menu
```css
Container:
  position: absolute
  background: white
  border-radius: rounded-lg (8px)
  shadow: shadow-lg
  padding: py-2 (8px)
  min-width: 192px (w-48)
  z-index: 50
  opacity: 0
  visibility: hidden
  transition: opacity duration-200, visibility duration-200

Visible (on hover):
  opacity: 100
  visibility: visible

Menu Item:
  padding: px-4 py-2 (16px × 8px)
  font-size: 0.875rem (14px)
  color: gray-700
  hover: background-gray-100
  cursor: pointer
```

## Modal/Dialog
```css
Overlay:
  position: fixed
  inset: 0
  background: rgba(0, 0, 0, 0.5)
  display: flex
  align-items: center
  justify-content: center
  z-index: 50
  padding: p-4 (16px)

Content:
  background: white
  border-radius: rounded-xl (12px)
  max-width: 32rem (512px) or 42rem (672px)
  width: 100%
  max-height: 90vh
  overflow-y: auto
  shadow: shadow-2xl
  padding: p-6 (24px)

Close Button:
  position: absolute
  top: 1rem (16px)
  right: 1rem (16px)
  background: transparent
  border: none
  font-size: 1.5rem (24px)
  color: gray-500
  cursor: pointer
  hover: color-gray-900
```

## Toast/Notification
```css
Container:
  position: fixed
  bottom: 1rem (16px)
  right: 1rem (16px)
  background: white
  border-radius: rounded-lg (8px)
  shadow: shadow-xl
  padding: p-4 (16px)
  min-width: 300px
  z-index: 100
  animation: slide-in-from-right duration-300

Success:
  border-left: 4px solid green-500

Error:
  border-left: 4px solid red-500

Warning:
  border-left: 4px solid orange-500

Info:
  border-left: 4px solid blue-500
```

---

# 📱 Mobile-Specific Adaptations

## Touch Targets
```css
Minimum Size: 44px × 44px
Button Padding: 12px minimum
Spacing Between: 8px minimum
```

## Gestures
- Swipe to delete (notes, flashcards)
- Pull to refresh (lists)
- Long press for context menu
- Pinch to zoom (images)

## Mobile Navigation
```css
Bottom Tab Bar:
  position: fixed
  bottom: 0
  height: 64px
  background: white
  border-top: border-t border-gray-200
  display: flex
  justify-content: space-around
  align-items: center
  z-index: 40

Tab Item:
  display: flex
  flex-direction: column
  align-items: center
  gap: gap-1 (4px)
  padding: py-2 (8px)
  flex: 1

Icon:
  size: 24px × 24px
  color: gray-500

Active:
  color: gray-900

Label:
  font-size: 0.75rem (12px)
  color: gray-500

Active Label:
  color: gray-900
```

---

**End of Design Specification**

This document provides complete design specifications for implementing PAATA.AI in a mobile app. Use it as a reference for maintaining design consistency across platforms.

**Last Updated:** January 2025  
**Version:** 2.0




**Version:** 2.0  
**Last Updated:** January 2025  
**Purpose:** Complete design specification with every detail from the website for mobile app implementation

---

## 📋 Table of Contents

1. [Design System](#design-system)
2. [Component Library](#component-library)
3. [Page Specifications](#page-specifications)
4. [State Variations](#state-variations)
5. [Interactions & Animations](#interactions--animations)
6. [Icons & Assets](#icons--assets)
7. [Responsive Design](#responsive-design)
8. [Accessibility](#accessibility)

---

# 🎨 Design System

## Color Palette

### Primary Colors
```css
/* Dark Background/Accents - PRIMARY ACTION COLOR */
--gray-900: #111827
RGB: rgb(17, 24, 39)
Usage: Primary buttons, active states, icons, accents, navbar background

--gray-800: #1F2937
RGB: rgb(31, 41, 55)
Usage: Hover states, secondary backgrounds, navbar gradient end

--gray-700: #374151
RGB: rgb(55, 65, 81)
Usage: Borders, dividers, secondary text
```

### Text Colors
```css
/* Primary Text (on light backgrounds) */
--text-gray-900: #111827
RGB: rgb(17, 24, 39)
Usage: Headings, primary text, labels

/* Secondary Text */
--text-gray-700: #374151
RGB: rgb(55, 65, 81)
Usage: Secondary text, descriptions

/* Tertiary Text */
--text-gray-600: #4B5563
RGB: rgb(75, 85, 99)
Usage: Helper text, timestamps

/* Muted Text */
--text-gray-500: #6B7280
RGB: rgb(107, 114, 128)
Usage: Placeholders, disabled text

/* Text on Dark Backgrounds */
--text-white: #FFFFFF
RGB: rgb(255, 255, 255)
Usage: Text on gray-900 backgrounds, navbar text
```

### Background Colors
```css
/* Card/Content Backgrounds */
--bg-white: #FFFFFF
RGB: rgb(255, 255, 255)
Usage: Cards, modals, main content areas

/* Page Background */
--bg-gray-50: #F9FAFB
RGB: rgb(249, 250, 251)
Usage: Page backgrounds, section backgrounds

/* Subtle Backgrounds */
--bg-gray-100: #F3F4F6
RGB: rgb(243, 244, 246)
Usage: Badges, subtle highlights, inactive states

/* Light Gray */
--bg-gray-200: #E5E7EB
RGB: rgb(229, 231, 235)
Usage: Borders, dividers, skeleton loaders
```

### Status Colors
```css
/* Success */
--success-green: #10B981
RGB: rgb(16, 185, 129)
Usage: Success messages, positive indicators, checkmarks

/* Error */
--error-red: #EF4444
RGB: rgb(239, 68, 68)
Usage: Error messages, destructive actions, validation errors

/* Warning */
--warning-orange: #F59E0B
RGB: rgb(245, 158, 11)
Usage: Warning messages, caution indicators

/* Info */
--info-blue: #3B82F6
RGB: rgb(59, 130, 246)
Usage: Info messages, links, informational badges
```

### Color Usage Guidelines

**Primary Actions:**
- Background: `gray-900` (#111827)
- Text: `white` (#FFFFFF)
- Hover: `gray-800` (#1F2937)

**Secondary Actions:**
- Background: `transparent`
- Border: `1px solid white`
- Text: `white`
- Hover: `white` background, `gray-900` text

**Text Buttons:**
- Background: `transparent`
- Text: `gray-900`
- Hover: `gray-100` background

**Navigation Hover:**
- Text: `gray-300` (#D1D5DB)
- Background: `transparent`

**Active States:**
- Background: `gray-100` (#F3F4F6)
- Text: `gray-900` (#111827)

## Typography

### Font Family
```css
Primary Font: Roboto (or system default sans-serif)
Fallback: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif
```

### Type Scale

#### Heading 1 (h1)
```css
Font Size: 3rem (48px)
Line Height: 1.2
Font Weight: 700 (Bold)
Letter Spacing: -0.02em
Color: gray-900 (on light) / white (on dark)
Usage: Page titles, hero headlines
Example: "Homework Assistance at your fingertips with Paata Ai"
```

#### Heading 2 (h2)
```css
Font Size: 2.25rem (36px)
Line Height: 1.3
Font Weight: 700 (Bold)
Letter Spacing: -0.01em
Color: gray-900
Usage: Section titles, major headings
Example: "Your Learning App"
```

#### Heading 3 (h3)
```css
Font Size: 1.875rem (30px)
Line Height: 1.4
Font Weight: 600 (Semibold)
Color: gray-900
Usage: Subsection titles, card titles
Example: "Homework Buddy App"
```

#### Heading 4 (h4)
```css
Font Size: 1.5rem (24px)
Line Height: 1.5
Font Weight: 600 (Semibold)
Color: gray-900
Usage: Card titles, smaller section headings
```

#### Heading 5 (h5)
```css
Font Size: 1.25rem (20px)
Line Height: 1.5
Font Weight: 500 (Medium)
Color: gray-900
Usage: Small headings, labels
```

#### Heading 6 (h6)
```css
Font Size: 1.125rem (18px)
Line Height: 1.5
Font Weight: 500 (Medium)
Color: gray-900
Usage: Labels, small headings
```

#### Body Large (Lead)
```css
Font Size: 1.125rem (18px)
Line Height: 1.75
Font Weight: 400 (Regular)
Color: gray-500 (muted) or gray-700 (normal)
Usage: Lead paragraphs, descriptions
Example: "Revolutionize your learning with AI-powered homework assistance..."
```

#### Body (Default)
```css
Font Size: 1rem (16px)
Line Height: 1.75
Font Weight: 400 (Regular)
Color: gray-700
Usage: Body text, paragraphs
```

#### Body Small
```css
Font Size: 0.875rem (14px)
Line Height: 1.5
Font Weight: 400 (Regular)
Color: gray-600
Usage: Secondary text, helper text
```

#### Caption
```css
Font Size: 0.75rem (12px)
Line Height: 1.5
Font Weight: 400 (Regular)
Color: gray-500
Usage: Captions, timestamps, fine print
```

### Font Weights
```css
Thin: 100
Light: 300
Regular: 400 (default)
Medium: 500
Semibold: 600
Bold: 700
```

## Spacing System

### Base Unit: 4px

```css
xs: 0.25rem (4px)
sm: 0.5rem (8px)
md: 0.75rem (12px)
base: 1rem (16px)
lg: 1.5rem (24px)
xl: 2rem (32px)
2xl: 2.5rem (40px)
3xl: 3rem (48px)
4xl: 4rem (64px)
5xl: 5rem (80px)
6xl: 6rem (96px)
7xl: 7rem (112px)
```

### Spacing Usage

**Section Padding:**
- Major sections: `py-28` (7rem vertical = 112px)
- Standard sections: `py-16` (4rem = 64px)
- Compact sections: `py-8` (2rem = 32px)

**Card Padding:**
- Standard: `p-6` to `p-8` (1.5rem to 2rem = 24px to 32px)
- Compact: `p-4` (1rem = 16px)
- Spacious: `p-12` to `p-14` (3rem to 3.5rem = 48px to 56px)

**Button Padding:**
- Large: `px-4 py-3` (1rem × 0.75rem = 16px × 12px)
- Medium: `px-3 py-2` (0.75rem × 0.5rem = 12px × 8px)
- Small: `px-2 py-1` (0.5rem × 0.25rem = 8px × 4px)

**Input Padding:**
- Standard: `px-4 py-3` (1rem × 0.75rem = 16px × 12px)

**Gap Between Elements:**
- Tight: `gap-2` (0.5rem = 8px)
- Standard: `gap-4` to `gap-6` (1rem to 1.5rem = 16px to 24px)
- Spacious: `gap-8` to `gap-12` (2rem to 3rem = 32px to 48px)

## Shadows

```css
/* Small Shadow */
shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05)

/* Medium Shadow (Default) */
shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)

/* Large Shadow */
shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)

/* Extra Large Shadow */
shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)

/* 2XL Shadow (for modals, cards) */
shadow-2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25)
```

**Usage:**
- Cards: `shadow-md` or `shadow-lg`
- Modals: `shadow-2xl`
- Buttons: `shadow-lg` (on hover)
- Navbar: `shadow-md`

## Border Radius

```css
none: 0
sm: 0.25rem (4px)
base: 0.5rem (8px)
md: 0.75rem (12px)
lg: 1rem (16px)
xl: 1.5rem (24px)
2xl: 2rem (32px)
full: 9999px (circular)
```

**Usage:**
- Buttons: `rounded-lg` (0.5rem = 8px)
- Cards: `rounded-xl` (0.75rem = 12px) or `rounded-2xl` (1rem = 16px)
- Inputs: `rounded-lg` (0.5rem = 8px)
- Icons: `rounded-lg` (0.5rem = 8px) or `rounded-full` (circular)
- Badges: `rounded-full` (circular)

## Borders

```css
/* Standard Border */
border: 1px solid gray-200 (#E5E7EB)
border: 1px solid gray-300 (#D1D5DB)

/* Focus Border */
border: 2px solid gray-900 (#111827)

/* Error Border */
border: 1px solid error-red (#EF4444)
border-l-4: 4px solid error-red (left border for error messages)
```

---

# 🧩 Component Library

## Buttons

### Primary Button
```css
/* Default State */
Background: gray-900 (#111827)
Text: white (#FFFFFF)
Padding: px-4 py-3 (16px × 12px)
Border Radius: 0.5rem (8px)
Font: Semibold, 0.875rem (14px)
Shadow: shadow-lg
Transition: all duration-200

/* Hover State */
Background: gray-800 (#1F2937)
Shadow: shadow-lg (enhanced)
Transform: scale(1.02) (optional)

/* Active State */
Background: gray-900 (#111827)
Transform: scale(0.98)

/* Disabled State */
Background: gray-300 (#D1D5DB)
Text: gray-500 (#6B7280)
Cursor: not-allowed
Opacity: 0.5
```

**Example:**
```tsx
<Button
  size="lg"
  color="white"
  className="flex items-center justify-center gap-2"
>
  Get Started
</Button>
```

### Secondary Button (Outlined)
```css
/* Default State */
Background: transparent
Border: 1px solid white
Text: white (#FFFFFF)
Padding: px-4 py-2 (16px × 8px)
Border Radius: 0.5rem (8px)
Font: Semibold, 0.875rem (14px)

/* Hover State */
Background: white (#FFFFFF)
Text: gray-900 (#111827)
```

### Text Button
```css
/* Default State */
Background: transparent
Text: gray-900 (#111827)
Padding: px-3 py-2 (12px × 8px)
Font: Medium, 0.875rem (14px)

/* Hover State */
Background: gray-100 (#F3F4F6)
```

### Icon Button
```css
/* Default State */
Size: 40px × 40px (w-10 h-10)
Background: transparent
Border Radius: 0.5rem (8px)
Padding: 0.5rem (8px)

/* Hover State */
Background: gray-100 (#F3F4F6)
```

## Cards

### Standard Card
```css
/* Container */
Background: white (#FFFFFF)
Border Radius: 0.75rem (12px) or 1rem (16px)
Shadow: shadow-md or shadow-lg
Padding: p-6 to p-8 (24px to 32px)
Border: border border-gray-200 (optional)
```

**Example:**
```tsx
<Card className="shadow-lg">
  <CardBody className="p-6">
    {/* Content */}
  </CardBody>
</Card>
```

### Card with Header
```css
/* Header */
Background: gray-50 (#F9FAFB)
Padding: px-6 py-4 (24px × 16px)
Border Radius: rounded-t-xl (top corners only)
Border Bottom: border-b border-gray-200

/* Body */
Padding: p-6 (24px)
```

### Feature Card
```css
/* Container */
Background: white (#FFFFFF)
Border Radius: 0.75rem (12px)
Shadow: shadow-md
Padding: p-6 (24px)
Border: none

/* Icon Container */
Size: 48px × 48px (w-12 h-12)
Background: gray-900 (#111827)
Border Radius: 0.5rem (8px)
Display: flex items-center justify-center
Margin: mb-4 (16px)

/* Icon */
Color: white (#FFFFFF)
Size: 24px × 24px (w-6 h-6)

/* Title */
Font: Semibold, 1.25rem (20px)
Color: gray-900 (#111827)
Margin: mb-2 (8px)

/* Description */
Font: Regular, 1rem (16px)
Color: gray-600 (#4B5563)
Line Height: 1.75
```

## Input Fields

### Text Input
```css
/* Container */
Width: 100%
Background: white (#FFFFFF)
Border: 1px solid gray-300 (#D1D5DB)
Border Radius: 0.5rem (8px)
Padding: px-4 py-3 (16px × 12px)
Font: Regular, 1rem (16px)
Color: gray-900 (#111827)

/* Placeholder */
Color: gray-500 (#6B7280)

/* Focus State */
Border: 2px solid gray-900 (#111827)
Outline: none
Ring: ring-2 ring-gray-900
```

**Example:**
```tsx
<Input
  label="Email Address"
  type="email"
  size="lg"
  className="!border-t-blue-gray-200 focus:!border-t-gray-900"
  labelProps={{
    className: "before:content-none after:content-none",
  }}
/>
```

### Textarea
```css
/* Same as Text Input */
Min Height: 6rem (96px)
Resize: vertical
```

### Password Input
```css
/* Same as Text Input */
/* With show/hide toggle button */
Toggle Button:
  Position: absolute right-3 top-1/2
  Color: gray-500 (#6B7280)
  Hover: gray-700 (#374151)
```

## Icons

### Icon Container (Primary)
```css
/* Container */
Size: 48px × 48px (w-12 h-12) or 64px × 64px (w-16 h-16)
Background: gray-900 (#111827)
Text: white (#FFFFFF)
Border Radius: 0.5rem (8px) or 0.75rem (12px)
Display: flex items-center justify-center
Margin: mb-3 to mb-4 (12px to 16px)
Margin X: mx-auto (centered)

/* Icon */
Color: white (#FFFFFF)
Size: 20px × 20px (w-5 h-5) or 24px × 24px (w-6 h-6)
Font Size: text-xl (1.25rem = 20px) for Font Awesome icons
```

**Example:**
```tsx
<div className="mb-3 grid h-12 w-12 place-content-center rounded-lg bg-gray-900 text-white mx-auto">
  <i className="fa-solid fa-envelope text-xl"></i>
</div>
```

### Icon Container (Secondary)
```css
/* Container */
Size: 40px × 40px (w-10 h-10)
Background: gray-100 (#F3F4F6)
Text: gray-900 (#111827)
Border Radius: 0.5rem (8px)
```

## Badges & Chips

### Plan Badge
```css
/* Enterprise */
Background: gray-100 (#F3F4F6)
Text: gray-900 (#111827)
Padding: px-2 py-1 (8px × 4px)
Border Radius: rounded-full
Font: Medium, 0.75rem (12px)

/* Pro */
Background: blue-100 (#DBEAFE)
Text: blue-800 (#1E40AF)

/* Basic */
Background: gray-100 (#F3F4F6)
Text: gray-800 (#1F2937)
```

### Status Chip
```css
/* Active */
Color: green
Variant: ghost

/* Inactive */
Color: gray
Variant: ghost
```

## Loading States

### Spinner
```css
/* Container */
Size: 48px × 48px (w-12 h-12)
Border: 2px solid gray-200 (#E5E7EB)
Border Top: 2px solid gray-900 (#111827)
Border Radius: 50% (circular)
Animation: spin (1s linear infinite)
Margin: mx-auto (centered)
```

**Example:**
```tsx
<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
```

### Skeleton Loader
```css
/* Container */
Background: gray-200 (#E5E7EB)
Border Radius: 0.25rem (4px)
Animation: pulse (2s cubic-bezier(0.4, 0, 0.6, 1) infinite)
Height: matches content
```

## Navigation

### Navbar
```css
/* Container */
Background: gradient from-gray-900 to-gray-800
Height: 4rem (64px) with py-4
Text: white (#FFFFFF)
Position: fixed top-0 z-50
Shadow: shadow-md
Width: 100%

/* Links */
Font: Medium, 0.875rem (14px)
Color: white (#FFFFFF)
Hover: gray-300 (#D1D5DB)
Transition: transition-colors duration-200

/* Logo */
Font: Bold, 1.25rem (20px)
Color: white (#FFFFFF)
```

### Sidebar
```css
/* Container */
Background: white (#FFFFFF)
Width: 16rem (256px) expanded, 4rem (64px) collapsed
Border: border-r border-gray-200
Height: 100vh
Position: fixed or relative

/* Active Item */
Background: gray-100 (#F3F4F6)
Text: gray-900 (#111827)
Border Radius: 0.5rem (8px)
Padding: px-3 py-2 (12px × 8px)

/* Hover */
Background: gray-100 (#F3F4F6)
```

## Messages (Chat)

### User Message
```css
/* Container */
Background: gray-900 (#111827)
Text: white (#FFFFFF)
Border Radius: 0.5rem (8px)
Padding: p-4 (16px)
Max Width: 75% (max-w-3xl)
Margin: ml-auto (right-aligned)
Margin Bottom: mb-4 (16px)

/* Avatar */
Size: 32px × 32px (w-8 h-8)
Background: gray-900 (#111827)
Text: white (#FFFFFF)
Border Radius: 50% (circular)
```

### AI Message
```css
/* Container */
Background: white (#FFFFFF)
Text: gray-900 (#111827)
Border Radius: 0.5rem (8px)
Padding: p-4 (16px)
Max Width: 75% (max-w-3xl)
Margin: mr-auto (left-aligned)
Border: border border-gray-200
Margin Bottom: mb-4 (16px)

/* Avatar */
Size: 32px × 32px (w-8 h-8)
Background: gray-900 (#111827)
Text: white (#FFFFFF)
Border Radius: 50% (circular)
```

## Modals

### Modal Overlay
```css
/* Container */
Position: fixed inset-0
Background: black with opacity-50 (rgba(0, 0, 0, 0.5))
Z-index: 50
Display: flex items-center justify-center
Padding: p-4 (16px)
```

### Modal Content
```css
/* Container */
Background: white (#FFFFFF)
Border Radius: 1rem (16px)
Max Width: 32rem (512px) or 42rem (672px)
Width: 100%
Max Height: 90vh
Overflow: overflow-y-auto
Shadow: shadow-2xl
Padding: p-6 (24px)
```

---

# 📱 Page Specifications

## Homepage

### Hero Section
```css
/* Container */
Min Height: 49rem (784px)
Background: gray-900 (#111827)
Padding: px-8 (32px)
Grid: grid-cols-1 lg:grid-cols-2
Gap: standard

/* Content */
Title: h1, white, mb-4
Description: lead, white, mb-7
Buttons: flex flex-col gap-2 md:flex-row

/* Image */
Max Height: 30rem (480px) md:36rem (576px) lg:40rem (640px)
```

### Feature Section
```css
/* Container */
Padding: py-28 px-4 (112px × 16px)
Background: white

/* Header */
Text Align: center
Margin Bottom: mb-20 (80px)

/* Grid */
Grid: grid-cols-1 md:grid-cols-2
Max Width: max-w-6xl
Gap: gap-4 gap-y-12 (16px × 48px)
```

### Learning Materials Section
```css
/* Container */
Padding: py-28 px-4 (112px × 16px)
Background: white

/* Grid */
Grid: grid-cols-1 lg:grid-cols-2
Gap: gap-12 (48px)
Items: items-center

/* Cards */
Grid: grid-cols-2
Gap: gap-4 gap-y-12 (16px × 48px)
```

### Contact Form Section
```css
/* Container */
Padding: py-28 px-4 (112px × 16px)
Background: white

/* Form Card */
Background: white
Border Radius: rounded-xl (12px)
Shadow: shadow-md
Padding: p-8 md:p-14 (32px to 56px)
Max Width: max-w-4xl
```

## Authentication Pages

### Login/Signup Page
```css
/* Container */
Min Height: 100vh
Background: gray-50 (#F9FAFB)
Padding: px-4 py-8 pt-24 (16px × 32px × 96px)

/* Form Card */
Background: white
Border Radius: rounded-xl (12px)
Shadow: shadow-2xl
Max Width: max-w-md (448px)
Width: 100%

/* Header Section */
Background: gray-900 (#111827)
Text: white
Padding: p-8 pb-6 (32px × 24px)
Border Radius: rounded-t-xl (top corners)

/* Logo Circle */
Size: 64px × 64px (w-16 h-16)
Background: white/20 (rgba(255, 255, 255, 0.2))
Border Radius: 50% (circular)
Margin: mb-4 (16px)

/* Form Fields */
Spacing: space-y-6 (24px)
```

## Chat Interface

### Chat Container
```css
/* Container */
Height: 100vh
Background: gray-50 (#F9FAFB)
Display: flex flex-col
Overflow: hidden

/* Sidebar */
Width: 16rem (256px) on desktop, hidden on mobile
Background: white
Border: border-r border-gray-200
Height: 100%
Overflow: overflow-y-auto

/* Message Area */
Flex: flex-1
Background: white
Padding: p-4 (16px)
Overflow: overflow-y-auto

/* Input Area */
Background: white
Border Top: border-t border-gray-200
Padding: p-4 (16px)
```

### Chat Session List
```css
/* Container */
Padding: p-4 (16px)

/* Session Item */
Padding: p-3 (12px)
Border Radius: rounded-lg (8px)
Margin Bottom: mb-2 (8px)
Hover: bg-gray-800 (on dark sidebar)

/* Active Session */
Background: gray-900 (#111827)
Text: white (#FFFFFF)
```

## Notes Page

### Notes Grid
```css
/* Container */
Grid: grid-cols-1 md:grid-cols-2 lg:grid-cols-3
Gap: gap-6 (24px)
Padding: p-6 (24px)

/* Note Card */
Background: white
Border Radius: rounded-xl (12px)
Shadow: shadow-md
Padding: p-6 (24px)
Hover: shadow-lg
```

## Exam Page

### Exam Generator
```css
/* Container */
Background: white
Border Radius: rounded-xl (12px)
Shadow: shadow-lg
Padding: p-8 (32px)
Max Width: max-w-2xl

/* Form Fields */
Spacing: space-y-6 (24px)
```

### Question Display
```css
/* Container */
Background: white
Border Radius: rounded-xl (12px)
Shadow: shadow-md
Padding: p-6 (24px)
Margin Bottom: mb-4 (16px)

/* Options */
Spacing: space-y-3 (12px)
Padding: p-4 (16px)
Border: border border-gray-200
Border Radius: rounded-lg (8px)
Hover: border-gray-900

/* Selected Option */
Border: 2px solid gray-900 (#111827)
Background: gray-50 (#F9FAFB)
```

## Profile Page

### Profile Card
```css
/* Container */
Background: white
Border Radius: rounded-xl (12px)
Shadow: shadow-lg
Padding: p-8 (32px)

/* Avatar */
Size: 128px × 128px (w-32 h-32)
Border Radius: 50% (circular)
Border: 4px solid white
Shadow: shadow-lg
```

### Settings Section
```css
/* Container */
Background: white
Border Radius: rounded-xl (12px)
Shadow: shadow-md
Padding: p-6 (24px)
Margin Bottom: mb-6 (24px)

/* Section Header */
Padding: px-6 py-4 (24px × 16px)
Background: gray-50 (#F9FAFB)
Border Radius: rounded-t-xl (top corners)
Border Bottom: border-b border-gray-200
```

---

# 🎭 State Variations

## Button States

### Default
- Background: gray-900
- Text: white
- Shadow: shadow-lg

### Hover
- Background: gray-800
- Shadow: enhanced
- Transform: scale(1.02)

### Active/Pressed
- Background: gray-900
- Transform: scale(0.98)

### Disabled
- Background: gray-300
- Text: gray-500
- Opacity: 0.5
- Cursor: not-allowed

### Loading
- Background: gray-900
- Text: "Loading..."
- Spinner: visible
- Pointer Events: none

## Input States

### Default
- Border: gray-300
- Background: white

### Focus
- Border: 2px solid gray-900
- Ring: ring-2 ring-gray-900
- Outline: none

### Error
- Border: 1px solid error-red
- Ring: ring-2 ring-red-500

### Disabled
- Background: gray-100
- Text: gray-500
- Cursor: not-allowed

## Card States

### Default
- Shadow: shadow-md
- Background: white

### Hover
- Shadow: shadow-lg
- Transform: translateY(-2px)

### Selected/Active
- Border: 2px solid gray-900
- Shadow: shadow-lg

## Navigation States

### Default Link
- Color: white (navbar) / gray-700 (sidebar)
- Background: transparent

### Hover
- Color: gray-300 (navbar) / gray-900 (sidebar)
- Background: transparent (navbar) / gray-100 (sidebar)

### Active
- Color: white (navbar) / gray-900 (sidebar)
- Background: gray-100 (sidebar)
- Font Weight: medium

---

# ✨ Interactions & Animations

## Transitions

```css
/* Standard Transition */
transition: all duration-200
Duration: 200ms
Easing: ease-in-out

/* Color Transition */
transition-colors duration-200

/* Transform Transition */
transition-transform duration-200

/* Opacity Transition */
transition-opacity duration-200
```

## Animations

### Fade In
```css
animation: fade-in duration-500
@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}
```

### Slide In
```css
animation: slide-in-from-bottom-4 duration-500
@keyframes slide-in-from-bottom-4 {
  from { transform: translateY(1rem); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
```

### Spin (Loading)
```css
animation: spin 1s linear infinite
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
```

### Pulse (Skeleton)
```css
animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
```

## Hover Effects

### Button Hover
- Background color change
- Shadow enhancement
- Slight scale (1.02)

### Card Hover
- Shadow enhancement
- Slight lift (translateY(-2px))

### Link Hover
- Color change
- Underline (optional)

---

# 🎯 Icons & Assets

## Icon Library

### Font Awesome Icons (Primary)
```css
Font Family: Font Awesome 6
Usage: <i className="fa-solid fa-icon-name"></i>
Size: text-xl (20px) or text-2xl (24px)
```

**Common Icons:**
- `fa-envelope` - Email
- `fa-phone` - Phone
- `fa-clock` - Time
- `fa-book` - Book/Subjects
- `fa-video` - Video
- `fa-graduation-cap` - Education
- `fa-filter` - Filter
- `fa-comments` - Chat
- `fa-sticky-note` - Notes
- `fa-lightbulb` - Flashcards
- `fa-clipboard-check` - Exam
- `fa-brain` - Focus Mode
- `fa-chart-line` - Progress/Analytics
- `fa-trophy` - Achievements
- `fa-user` - Profile
- `fa-cog` - Settings
- `fa-credit-card` - Billing
- `fa-shield-check` - Security
- `fa-bell` - Notifications

### Heroicons (Secondary)
```css
Library: @heroicons/react/24/outline or /24/solid
Usage: <Icon className="w-6 h-6" />
Size: w-5 h-5 (20px) or w-6 h-6 (24px)
```

## Logo

### Primary Logo
```css
Text: "PAATA.AI"
Font: Bold, 1.25rem (20px)
Color: white (on dark) / gray-900 (on light)
```

### Logo Icon
```css
Size: 64px × 64px (w-16 h-16)
Background: gray-900 (#111827)
Text: "P" (white, bold, 2xl)
Border Radius: 50% (circular) or 0.5rem (8px)
```

## Images

### Avatar
```css
Size: 128px × 128px (w-32 h-32)
Border Radius: 50% (circular)
Border: 4px solid white
Shadow: shadow-lg
Object Fit: cover
```

### Thumbnails
```css
Size: 200px × 200px
Border Radius: 0.5rem (8px)
Object Fit: cover
```

### Hero Image
```css
Max Width: 470px
Max Height: 576px
Responsive: max-h-[30rem] md:max-h-[36rem] lg:max-h-[40rem]
```

---

# 📐 Responsive Design

## Breakpoints

```css
sm: 640px (small devices)
md: 768px (tablets)
lg: 1024px (desktops)
xl: 1280px (large desktops)
2xl: 1536px (extra large desktops)
```

## Mobile Adaptations

### Navigation
- Desktop: Horizontal navbar
- Mobile: Hamburger menu with slide-out drawer

### Grid Layouts
- Mobile: 1 column
- Tablet: 2 columns
- Desktop: 3-4 columns

### Spacing
- Mobile: Reduced padding (py-16 instead of py-28)
- Desktop: Full spacing

### Typography
- Mobile: Slightly smaller font sizes
- Desktop: Full type scale

---

# ♿ Accessibility

## Color Contrast
- Text on gray-900: white (WCAG AAA)
- Text on white: gray-900 (WCAG AAA)
- Minimum contrast ratio: 4.5:1

## Focus States
- All interactive elements have visible focus indicators
- Focus ring: 2px solid gray-900
- Outline: none (replaced by ring)

## Keyboard Navigation
- All interactive elements are keyboard accessible
- Tab order is logical
- Enter/Space activates buttons

## Screen Readers
- All images have alt text
- Form inputs have labels
- Buttons have descriptive text
- ARIA labels where needed

---

# 📊 Component Specifications

## Feature Card Component

```tsx
<Card className="border-0 shadow-md">
  <CardBody className="p-6 text-center">
    {/* Icon */}
    <div className="mb-4 grid h-12 w-12 place-content-center rounded-lg bg-gray-900 text-white mx-auto">
      <Icon className="w-6 h-6" />
    </div>
    
    {/* Title */}
    <Typography variant="h5" color="blue-gray" className="mb-2">
      Feature Title
    </Typography>
    
    {/* Description */}
    <Typography color="gray" className="text-sm">
      Feature description text
    </Typography>
  </CardBody>
</Card>
```

## Contact Info Card

```tsx
<div>
  {/* Icon */}
  <div className="mb-3 grid h-12 w-12 place-content-center rounded-lg bg-gray-900 text-white mx-auto">
    <i className="fa-solid fa-envelope text-xl"></i>
  </div>
  
  {/* Title */}
  <Typography variant="h6" color="blue-gray" className="mb-2">
    Email Us
  </Typography>
  
  {/* Content */}
  <Typography color="gray" className="text-sm">
    support@paata.ai
  </Typography>
</div>
```

## Stat Card

```tsx
<Card className="shadow-lg">
  <CardBody className="text-center p-6">
    {/* Icon */}
    <i className="fa-solid fa-message text-4xl text-gray-900 mb-4"></i>
    
    {/* Number */}
    <Typography variant="h3" className="text-gray-900 mb-2">
      1,234
    </Typography>
    
    {/* Label */}
    <Typography className="text-gray-600">
      Questions Answered
    </Typography>
  </CardBody>
</Card>
```

---

# 🎨 Design Tokens Summary

## Colors
- Primary: `#111827` (gray-900)
- Text Primary: `#111827` (gray-900)
- Text Secondary: `#4B5563` (gray-600)
- Background: `#FFFFFF` (white)
- Page Background: `#F9FAFB` (gray-50)
- Success: `#10B981` (green-500)
- Error: `#EF4444` (red-500)
- Warning: `#F59E0B` (orange-500)
- Info: `#3B82F6` (blue-500)

## Typography
- Font Family: Roboto (system fallback)
- Heading 1: 48px, Bold
- Heading 2: 36px, Bold
- Heading 3: 30px, Semibold
- Body: 16px, Regular
- Small: 14px, Regular
- Caption: 12px, Regular

## Spacing
- Base Unit: 4px
- Section Padding: 112px (py-28)
- Card Padding: 24-32px (p-6 to p-8)
- Button Padding: 16px × 12px (px-4 py-3)

## Shadows
- Small: `shadow-sm`
- Medium: `shadow-md` (default)
- Large: `shadow-lg`
- Extra Large: `shadow-2xl` (modals)

## Border Radius
- Small: 4px
- Medium: 8px (buttons, inputs)
- Large: 12px (cards)
- Full: 50% (circular)

---

---

# 📄 Complete Page Layouts

## Homepage Layout

### Structure
```
┌─────────────────────────────────────┐
│         Navbar (Fixed Top)          │
├─────────────────────────────────────┤
│                                     │
│         Hero Section                │
│    (min-h-[49rem], bg-gray-900)     │
│                                     │
├─────────────────────────────────────┤
│                                     │
│      Feature Section                │
│    (py-28, bg-white)                │
│                                     │
├─────────────────────────────────────┤
│                                     │
│   Mobile Convenience Section        │
│    (py-28, bg-white)                │
│                                     │
├─────────────────────────────────────┤
│                                     │
│      Video Intro Section            │
│    (py-28, bg-white)                │
│                                     │
├─────────────────────────────────────┤
│                                     │
│   Learning Materials Section        │
│    (py-28, bg-white)                │
│                                     │
├─────────────────────────────────────┤
│                                     │
│      Contact Form Section           │
│    (py-28, bg-white)                │
│                                     │
├─────────────────────────────────────┤
│            Footer                   │
└─────────────────────────────────────┘
```

### Hero Section Details
```css
Container:
  min-height: 49rem (784px)
  background: gray-900 (#111827)
  padding: px-8 (32px)
  grid: grid-cols-1 lg:grid-cols-2
  gap: standard
  align-items: center

Content Column:
  Title: h1, white, mb-4
  Description: lead, white, mb-7
  App Buttons: flex flex-col gap-2 md:flex-row

Image Column:
  max-height: 30rem md:36rem lg:40rem
  margin: my-20 lg:my-0
  transform: -translate-y-32 lg:translate-y-0

Info Card (below hero):
  background: white
  border-radius: rounded-xl
  padding: p-5 md:p-14
  margin: mx-8 lg:mx-16 -mt-24
  shadow: shadow-md
```

## Chat Interface Layout

### Structure
```
┌─────────────────────────────────────┐
│         Navbar (Fixed Top)          │
├──────────┬──────────────────────────┤
│          │                          │
│ Sidebar  │    Message Area          │
│ (256px)  │    (flex-1)              │
│          │                          │
│ Sessions │    Messages List         │
│ List     │    (scrollable)          │
│          │                          │
│          ├──────────────────────────┤
│          │    Input Area            │
│          │    (fixed bottom)        │
└──────────┴──────────────────────────┘
```

### Chat Message Bubble
```css
User Message:
  background: gray-900 (#111827)
  color: white
  border-radius: 0.5rem (8px)
  padding: p-4 (16px)
  max-width: 75% (max-w-3xl)
  margin-left: auto (right-aligned)
  margin-bottom: mb-4 (16px)
  
  Avatar:
    size: 32px × 32px
    background: gray-900
    color: white
    border-radius: 50%

AI Message:
  background: white
  color: gray-900
  border: border border-gray-200
  border-radius: 0.5rem (8px)
  padding: p-4 (16px)
  max-width: 75% (max-w-3xl)
  margin-right: auto (left-aligned)
  margin-bottom: mb-4 (16px)
  
  Avatar:
    size: 32px × 32px
    background: gray-900
    color: white
    border-radius: 50%
```

### Chat Input Area
```css
Container:
  background: white
  border-top: border-t border-gray-200
  padding: p-4 (16px)
  display: flex
  gap: gap-2 (8px)
  align-items: center

Input Field:
  flex: flex-1
  border: border border-gray-300
  border-radius: rounded-lg
  padding: px-4 py-3
  focus: ring-2 ring-gray-900

Send Button:
  size: 40px × 40px
  background: gray-900
  color: white
  border-radius: rounded-lg
  padding: p-2
```

## Notes Page Layout

### Structure
```
┌─────────────────────────────────────┐
│         Navbar (Fixed Top)          │
├──────────┬──────────────────────────┤
│          │                          │
│ Sidebar  │    Notes Area            │
│          │                          │
│          │  [Search] [Filter]       │
│          │                          │
│          │  ┌────┐ ┌────┐ ┌────┐   │
│          │  │Note│ │Note│ │Note│   │
│          │  └────┘ └────┘ └────┘   │
│          │                          │
│          │  [+ Create Note]         │
└──────────┴──────────────────────────┘
```

### Note Card
```css
Container:
  background: white
  border-radius: rounded-xl (12px)
  shadow: shadow-md
  padding: p-6 (24px)
  hover: shadow-lg
  cursor: pointer

Title:
  font: semibold, 1.25rem (20px)
  color: gray-900
  margin-bottom: mb-2 (8px)

Content Preview:
  font: regular, 1rem (16px)
  color: gray-600
  line-height: 1.5
  max-height: 3rem
  overflow: hidden
  text-overflow: ellipsis

Category Badge:
  background: gray-100
  color: gray-900
  padding: px-2 py-1
  border-radius: rounded-full
  font-size: 0.75rem (12px)
  margin-top: mt-2

Tags:
  display: flex
  gap: gap-2
  margin-top: mt-2
  flex-wrap: wrap
```

## Flashcards Page Layout

### Flashcard Card (Review Mode)
```css
Container:
  background: white
  border-radius: rounded-xl (12px)
  shadow: shadow-lg
  padding: p-8 (32px)
  min-height: 300px
  display: flex
  flex-direction: column
  justify-content: center
  align-items: center
  perspective: 1000px

Front Side:
  display: block
  backface-visibility: hidden
  transform: rotateY(0deg)

Back Side:
  display: none (or block when flipped)
  backface-visibility: hidden
  transform: rotateY(180deg)

Question:
  font: semibold, 1.5rem (24px)
  color: gray-900
  text-align: center
  margin-bottom: mb-4

Answer:
  font: regular, 1.125rem (18px)
  color: gray-700
  text-align: center

Flip Button:
  margin-top: mt-6
  background: gray-900
  color: white
  padding: px-6 py-3
  border-radius: rounded-lg
```

## Exam Page Layout

### Exam Generator Form
```css
Container:
  background: white
  border-radius: rounded-xl (12px)
  shadow: shadow-lg
  padding: p-8 (32px)
  max-width: max-w-2xl

Form Fields:
  display: flex
  flex-direction: column
  gap: gap-6 (24px)

Select Dropdown:
  border: border border-gray-300
  border-radius: rounded-lg
  padding: px-4 py-3
  focus: ring-2 ring-gray-900

Generate Button:
  background: gray-900
  color: white
  padding: px-6 py-3
  border-radius: rounded-lg
  font: semibold
  width: 100%
```

### Question Display
```css
Container:
  background: white
  border-radius: rounded-xl (12px)
  shadow: shadow-md
  padding: p-6 (24px)
  margin-bottom: mb-4 (16px)

Question Text:
  font: semibold, 1.25rem (20px)
  color: gray-900
  margin-bottom: mb-4

Options:
  display: flex
  flex-direction: column
  gap: gap-3 (12px)

Option Item:
  border: border border-gray-200
  border-radius: rounded-lg (8px)
  padding: p-4 (16px)
  cursor: pointer
  hover: border-gray-900
  transition: border-color duration-200

Selected Option:
  border: 2px solid gray-900
  background: gray-50

Correct Answer (Results):
  border: 2px solid green-500
  background: green-50

Incorrect Answer (Results):
  border: 2px solid red-500
  background: red-50
```

## Profile Page Layout

### Profile Header
```css
Container:
  background: white
  border-radius: rounded-xl (12px)
  shadow: shadow-lg
  padding: p-8 (32px)
  display: flex
  gap: gap-6 (24px)
  align-items: center

Avatar:
  size: 128px × 128px
  border-radius: 50%
  border: 4px solid white
  shadow: shadow-lg

Info:
  flex: flex-1

Name:
  font: bold, 2rem (32px)
  color: gray-900
  margin-bottom: mb-2

Email:
  font: regular, 1rem (16px)
  color: gray-600
  margin-bottom: mb-2

Plan Badge:
  display: inline-block
  background: gray-100
  color: gray-900
  padding: px-3 py-1
  border-radius: rounded-full
  font-size: 0.875rem (14px)
```

## Progress Page Layout

### Stat Cards Grid
```css
Container:
  display: grid
  grid-template-columns: repeat(4, 1fr)
  gap: gap-6 (24px)
  margin-bottom: mb-8 (32px)

Stat Card:
  background: white
  border-radius: rounded-xl (12px)
  shadow: shadow-lg
  padding: p-6 (24px)
  text-align: center

Icon:
  size: 48px × 48px
  color: gray-900 (or status color)
  margin-bottom: mb-4

Number:
  font: bold, 2rem (32px)
  color: gray-900
  margin-bottom: mb-2

Label:
  font: regular, 1rem (16px)
  color: gray-600
```

### Activity Chart
```css
Container:
  background: white
  border-radius: rounded-xl (12px)
  shadow: shadow-lg
  padding: p-6 (24px)

Header:
  background: gray-50
  padding: px-6 py-4
  border-radius: rounded-t-xl
  border-bottom: border-b border-gray-200
  margin: -p-6 -p-6 mb-6 -p-6

Chart Bars:
  display: flex
  align-items: flex-end
  gap: gap-2 (8px)
  height: 200px

Bar:
  flex: 1
  background: gray-900
  border-radius: rounded-t-lg
  min-height: 4px
```

---

# 🎯 Interactive Elements

## Dropdown Menu
```css
Container:
  position: absolute
  background: white
  border-radius: rounded-lg (8px)
  shadow: shadow-lg
  padding: py-2 (8px)
  min-width: 192px (w-48)
  z-index: 50
  opacity: 0
  visibility: hidden
  transition: opacity duration-200, visibility duration-200

Visible (on hover):
  opacity: 100
  visibility: visible

Menu Item:
  padding: px-4 py-2 (16px × 8px)
  font-size: 0.875rem (14px)
  color: gray-700
  hover: background-gray-100
  cursor: pointer
```

## Modal/Dialog
```css
Overlay:
  position: fixed
  inset: 0
  background: rgba(0, 0, 0, 0.5)
  display: flex
  align-items: center
  justify-content: center
  z-index: 50
  padding: p-4 (16px)

Content:
  background: white
  border-radius: rounded-xl (12px)
  max-width: 32rem (512px) or 42rem (672px)
  width: 100%
  max-height: 90vh
  overflow-y: auto
  shadow: shadow-2xl
  padding: p-6 (24px)

Close Button:
  position: absolute
  top: 1rem (16px)
  right: 1rem (16px)
  background: transparent
  border: none
  font-size: 1.5rem (24px)
  color: gray-500
  cursor: pointer
  hover: color-gray-900
```

## Toast/Notification
```css
Container:
  position: fixed
  bottom: 1rem (16px)
  right: 1rem (16px)
  background: white
  border-radius: rounded-lg (8px)
  shadow: shadow-xl
  padding: p-4 (16px)
  min-width: 300px
  z-index: 100
  animation: slide-in-from-right duration-300

Success:
  border-left: 4px solid green-500

Error:
  border-left: 4px solid red-500

Warning:
  border-left: 4px solid orange-500

Info:
  border-left: 4px solid blue-500
```

---

# 📱 Mobile-Specific Adaptations

## Touch Targets
```css
Minimum Size: 44px × 44px
Button Padding: 12px minimum
Spacing Between: 8px minimum
```

## Gestures
- Swipe to delete (notes, flashcards)
- Pull to refresh (lists)
- Long press for context menu
- Pinch to zoom (images)

## Mobile Navigation
```css
Bottom Tab Bar:
  position: fixed
  bottom: 0
  height: 64px
  background: white
  border-top: border-t border-gray-200
  display: flex
  justify-content: space-around
  align-items: center
  z-index: 40

Tab Item:
  display: flex
  flex-direction: column
  align-items: center
  gap: gap-1 (4px)
  padding: py-2 (8px)
  flex: 1

Icon:
  size: 24px × 24px
  color: gray-500

Active:
  color: gray-900

Label:
  font-size: 0.75rem (12px)
  color: gray-500

Active Label:
  color: gray-900
```

---

**End of Design Specification**

This document provides complete design specifications for implementing PAATA.AI in a mobile app. Use it as a reference for maintaining design consistency across platforms.

**Last Updated:** January 2025  
**Version:** 2.0


# PAATA.AI - Intelligent Homework Assistant

<div align="center">

![PAATA.AI Logo](public/image/Paata_logo.png)

**Your AI-powered learning companion for personalized homework assistance, exam preparation, and academic success.**

[![Next.js](https://img.shields.io/badge/Next.js-15.5.4-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6.17.0-2D3748)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-336791)](https://neon.tech/)

[Live Demo](https://paataai.com) • [Documentation](#documentation) • [Features](#features) • [Getting Started](#getting-started)

</div>

---

## 🚀 Overview

PAATA.AI is a comprehensive AI-powered educational platform designed to help students excel in their studies. The platform offers personalized learning materials, AI-powered exam generation, research mode, advanced analytics, and much more.

### Key Highlights

- 🤖 **AI-Powered Assistance** - Get instant help with homework using advanced AI models
- 📚 **Structured Learning** - Access organized content by class, subject, and chapter
- 📝 **Smart Note-Taking** - Create, organize, and review notes with AI assistance
- 🎯 **Exam Preparation** - Generate and practice with AI-created exam questions
- 📊 **Progress Tracking** - Monitor your learning journey with detailed analytics
- 🏆 **Gamification** - Earn achievements and badges as you learn
- 📱 **Mobile-Friendly** - Responsive design that works on all devices

---

## ✨ Features

### Core Features

- **AI Chat Interface** - Interactive chat with AI for homework help
- **Multi-Modal Input** - Text, voice, and image input support
- **PDF Processing** - Upload and extract content from PDF documents
- **Video Learning** - Integrated video lessons with AI chat
- **Flashcards** - Create and study with AI-generated flashcards
- **Mind Maps** - Visualize concepts with AI-generated mind maps
- **Focus Mode** - Distraction-free study sessions with timer
- **Research Mode** - Enhanced research capabilities with web search

### Learning Management

- **Class-Based Organization** - Content organized by class, subject, and chapter
- **Progress Tracking** - Track your learning progress across all subjects
- **Usage Analytics** - Detailed insights into your study habits
- **Achievement System** - Unlock achievements and badges
- **Streak Tracking** - Maintain daily study streaks

### User Management

- **Authentication** - Secure login/signup with email verification
- **2FA Support** - Two-factor authentication for enhanced security
- **Profile Management** - Customize your profile and preferences
- **Subscription Plans** - Multiple subscription tiers (Free, Pro, Enterprise)
- **Billing Integration** - Razorpay payment integration

### Admin Features

- **Dashboard** - Comprehensive admin dashboard with analytics
- **User Management** - View and manage all users
- **Content Management** - Manage learning content (videos, PDFs)
- **Notification System** - Send notifications to users
- **Monitoring** - System health monitoring and diagnostics

---

## 🛠️ Tech Stack

### Frontend

- **Framework**: Next.js 15.5.4 (App Router)
- **UI Library**: React 18
- **Styling**: Tailwind CSS 3
- **Components**: Material Tailwind React
- **Icons**: Heroicons
- **State Management**: React Context API

### Backend

- **Runtime**: Node.js
- **API**: Next.js API Routes
- **Database**: PostgreSQL (Neon)
- **ORM**: Prisma 6.17.0
- **Acceleration**: Prisma Accelerate

### AI & Services

- **AI Models**: 
  - Google Gemini AI
  - OpenAI GPT
- **OCR**: Google Cloud Vision API
- **Speech**: Google Cloud Speech-to-Text
- **Email**: SendGrid
- **Payments**: Razorpay
- **Authentication**: Stack Auth (Custom JWT)

### Development Tools

- **Language**: TypeScript 5
- **Linting**: ESLint
- **Testing**: Jest
- **Error Tracking**: Sentry (optional)

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18.x or higher
- **npm** or **yarn**
- **PostgreSQL** database (or Neon account)
- **Git**

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/advaittsingh/Paata.Ai-Website.git
cd Paata.Ai-Website
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env.local` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://user:password@host:port/database?sslmode=require"
PRISMA_DATABASE_URL="prisma+postgresql://user:password@host:port/database?sslmode=require"

# Authentication
NEXT_PUBLIC_STACK_PROJECT_ID="your-project-id"
NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY="your-publishable-key"
STACK_SECRET_SERVER_KEY="your-secret-key"

# AI Services
GOOGLE_AI_API_KEY="your-google-ai-key"
OPENAI_API_KEY="your-openai-key"

# Google Cloud Services
GOOGLE_CLOUD_PROJECT_ID="your-project-id"
GOOGLE_CLOUD_PRIVATE_KEY="your-private-key"
GOOGLE_CLOUD_CLIENT_EMAIL="your-client-email"

# Email Service
SENDGRID_API_KEY="your-sendgrid-key"
SENDGRID_FROM_EMAIL="noreply@paataai.com"

# Payment Gateway
RAZORPAY_KEY_ID="your-razorpay-key"
RAZORPAY_KEY_SECRET="your-razorpay-secret"

# Application
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NODE_ENV="development"

# Optional: CSRF Protection
ENABLE_CSRF_PROTECTION="false"

# Optional: Sentry Error Tracking
NEXT_PUBLIC_SENTRY_DSN="your-sentry-dsn"
```

### 4. Set Up the Database

```bash
# Generate Prisma Client
npm run db:generate

# Push schema to database
npm run db:push

# Seed database (optional)
npm run db:seed
```

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure

```
paata-ai-app/
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── migrations/            # Database migrations
├── public/                    # Static assets
│   ├── image/                 # Images
│   └── uploads/               # User uploads
├── src/
│   ├── app/                   # Next.js app directory
│   │   ├── api/              # API routes
│   │   ├── admin/             # Admin pages
│   │   ├── auth/              # Authentication pages
│   │   ├── learning/         # Learning pages
│   │   ├── profile/           # User profile pages
│   │   └── page.tsx           # Home page
│   ├── components/            # React components
│   │   ├── sections/          # Page sections
│   │   └── ...
│   ├── contexts/              # React contexts
│   ├── lib/                   # Utility libraries
│   ├── hooks/                 # Custom React hooks
│   ├── types/                 # TypeScript types
│   └── utils/                 # Utility functions
├── scripts/                   # Utility scripts
└── services/                 # External services
```

---

## 🗄️ Database Schema

The application uses PostgreSQL with Prisma ORM. Key models include:

- **User** - User accounts and profiles
- **Note** - User notes
- **Flashcard** - Study flashcards
- **ExamSession** - Exam attempts and results
- **FocusSession** - Focus mode sessions
- **MindMap** - Mind map visualizations
- **ChatSession** - AI chat conversations
- **Notification** - User notifications
- **Subscription** - User subscriptions
- **UserAchievement** - User achievements
- **UserBadge** - User badges

See `prisma/schema.prisma` for the complete schema.

---

## 🔧 Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint

# Database
npm run db:generate      # Generate Prisma Client
npm run db:push          # Push schema to database
npm run db:seed          # Seed database
npm run db:studio        # Open Prisma Studio
npm run db:check         # Check database users
npm run db:reset         # Reset database

# Utilities
npm run clean            # Clean build artifacts
```

---

## 🌐 Deployment

### Vercel Deployment

1. **Connect Repository** to Vercel
2. **Set Environment Variables** in Vercel dashboard
3. **Configure Build Settings**:
   - Build Command: `npm run build`
   - Install Command: `npm install --include=dev`
   - Output Directory: `.next`
4. **Deploy**

### Environment Variables for Production

Ensure all environment variables are set in Vercel:
- `DATABASE_URL` - PostgreSQL connection string
- `PRISMA_DATABASE_URL` - Prisma Accelerate URL (optional)
- `NEXT_PUBLIC_STACK_PROJECT_ID` - Stack Auth project ID
- `NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY` - Stack Auth publishable key
- `STACK_SECRET_SERVER_KEY` - Stack Auth secret key
- All other service API keys

### Database Setup on Vercel

1. Use **Neon PostgreSQL** (recommended) or Vercel Postgres
2. Get connection string from Neon dashboard
3. Set `DATABASE_URL` in Vercel environment variables
4. Run `npx prisma db push` to create tables

---

## 🔐 Authentication

The application uses a custom authentication system with:

- **Email/Password** authentication
- **Email Verification** - Users must verify their email
- **JWT Tokens** - Access and refresh tokens
- **2FA Support** - Two-factor authentication
- **CSRF Protection** - Cross-site request forgery protection
- **Password Reset** - Secure password reset flow

---

## 📱 API Documentation

### Authentication Endpoints

- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/verify-email` - Verify email address
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password
- `POST /api/auth/change-password` - Change password
- `POST /api/auth/2fa/enable` - Enable 2FA
- `POST /api/auth/2fa/verify` - Verify 2FA code

### Chat & AI Endpoints

- `POST /api/chat` - Send message to AI
- `POST /api/chat/context` - Get chat context
- `POST /api/ocr` - OCR image processing
- `POST /api/voice` - Voice input processing

### Learning Endpoints

- `GET /api/notes` - Get user notes
- `POST /api/notes` - Create note
- `GET /api/flashcards` - Get flashcards
- `POST /api/exam` - Create exam session
- `POST /api/mindmaps` - Generate mind map

### User Endpoints

- `GET /api/users/me` - Get current user
- `PUT /api/users/me` - Update user profile
- `GET /api/usage` - Get usage statistics
- `GET /api/achievements/check` - Check achievements

### Admin Endpoints

- `GET /api/admin/users` - Get all users
- `GET /api/admin/analytics` - Get analytics
- `GET /api/admin/billing` - Get billing data
- `POST /api/admin/notifications` - Send notification
- `GET /api/admin/monitoring` - System monitoring

---

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm test -- --watch
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

---

## 👥 Authors

- **CurvvTech** - *Initial work*

---

## 🙏 Acknowledgments

- Google AI for Gemini API
- OpenAI for GPT models
- Neon for PostgreSQL hosting
- Vercel for hosting and deployment
- Material Tailwind for UI components

---

## 📞 Support

For support, email support@paataai.com or visit [https://paataai.com/help](https://paataai.com/help)

---

## 🔗 Links

- **Website**: [https://paataai.com](https://paataai.com)
- **Documentation**: Coming soon
- **Issues**: [GitHub Issues](https://github.com/advaittsingh/Paata.Ai-Website/issues)

---

<div align="center">

**Made with ❤️ by CurvvTech**

[⬆ Back to Top](#paataai---intelligent-homework-assistant)

</div>



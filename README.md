# PAATA.AI - Intelligent Homework Assistant

A comprehensive Next.js application that provides AI-powered homework assistance with multi-modal input support (text, voice, images).

## 🚀 Features

- **AI Chat Interface** - Powered by Google Gemini AI
- **Multi-modal Input** - Text, voice, and image support
- **User Authentication** - Secure login and user management
- **OCR Processing** - Extract text from images
- **Usage Analytics** - Track user interactions and progress
- **Responsive Design** - Modern UI with Tailwind CSS
- **Real-time Updates** - Live usage statistics and context management

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS, Material Tailwind
- **AI**: Google Gemini AI, OpenAI (optional)
- **Database**: Prisma ORM with MySQL/PostgreSQL
- **Authentication**: Custom JWT-based auth
- **Deployment**: Vercel (or GoDaddy hosting)

## 📦 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- MySQL/PostgreSQL database

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd paata-ai-website
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Set up the database**
   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:3000`

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file with the following variables:

```env
# Database
DATABASE_URL="your_database_url"
PRISMA_DATABASE_URL="your_database_url"

# AI APIs
GEMINI_API_KEY="your_gemini_api_key"
OPENAI_API_KEY="your_openai_api_key" # Optional
GOOGLE_API_KEY="your_google_vision_api_key" # For OCR

# App Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your_secret_key"
NODE_ENV="development"
```

### Database Setup

1. **Create a database** (MySQL or PostgreSQL)
2. **Update DATABASE_URL** in your `.env.local`
3. **Run migrations**:
   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```

## 📁 Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   ├── auth/          # Authentication endpoints
│   │   ├── chat/          # AI chat API
│   │   ├── ocr/           # OCR processing
│   │   └── ...
│   ├── auth/              # Authentication pages
│   ├── profile/           # User profile pages
│   └── ...
├── components/            # Reusable React components
├── contexts/              # React contexts
├── lib/                   # Utility libraries
├── utils/                 # Helper functions
└── types/                 # TypeScript type definitions

scripts/
├── setup-database.js      # Database setup
└── check-users.js         # User management

prisma/
└── schema.prisma          # Database schema

public/
├── image/                 # Static images
├── logos/                 # Logo files
└── uploads/               # User uploads (avatars only)
```

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect your repository** to Vercel
2. **Set environment variables** in Vercel dashboard
3. **Deploy** - Vercel handles the rest automatically

### GoDaddy Hosting

1. **Download** the deployment package
2. **Upload** to your GoDaddy hosting
3. **Configure** environment variables
4. **Set up** MySQL database
5. **Run** deployment script

## 🧪 Testing

### Database Testing
- Use `scripts/check-users.js` to verify user data
- Use `scripts/setup-database.js` for initial setup

## 🔍 API Endpoints

- `POST /api/chat` - AI chat interface
- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration
- `POST /api/ocr` - Image text extraction
- `POST /api/voice` - Voice input processing
- `GET /api/usage` - Usage statistics

## 🎯 Features in Detail

### AI Chat System
- **Context-aware responses** - Maintains conversation history
- **Multi-modal support** - Text, voice, and image inputs
- **Educational focus** - Designed for homework assistance
- **Step-by-step guidance** - Breaks down complex problems

### User Management
- **Secure authentication** - JWT-based login system
- **Profile management** - User settings and preferences
- **Usage tracking** - Monitor interaction patterns
- **Plan-based features** - Different access levels

### OCR Processing
- **Image text extraction** - Extract text from photos
- **Multi-language support** - Various language detection
- **Hybrid processing** - Google Vision + OpenAI Vision

## 🛠️ Development

### Adding New Features
1. **Create components** in `src/components/`
2. **Add API routes** in `src/app/api/`
3. **Update database schema** in `prisma/schema.prisma`
4. **Run migrations** with `npx prisma migrate dev`

### Code Style
- **TypeScript** for type safety
- **ESLint** for code quality
- **Prettier** for formatting
- **Tailwind CSS** for styling

## 📞 Support

For issues and questions:
1. Check the troubleshooting section in scripts
2. Review API documentation
3. Check database connection and environment variables

## 📄 License

This project is licensed under the MIT License.

---

**PAATA.AI** - Your intelligent homework assistant! 🎓
# 🚀 PAATA.AI Deployment Guide

**Last Updated:** January 2025  
**Version:** 2.0

---

## 📋 Table of Contents

1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Environment Setup](#environment-setup)
3. [Database Migration](#database-migration)
4. [API Configuration](#api-configuration)
5. [Email Service Setup](#email-service-setup)
6. [Deployment Options](#deployment-options)
7. [Post-Deployment](#post-deployment)
8. [Troubleshooting](#troubleshooting)

---

## ✅ Pre-Deployment Checklist

### Core Requirements
- [ ] All environment variables configured
- [ ] Database connection string set
- [ ] API keys obtained (Razorpay, OpenAI, Google Search)
- [ ] Email service configured
- [ ] JWT_SECRET generated
- [ ] Production URL configured
- [ ] Domain configured (if using custom domain)

### Testing Checklist
- [ ] User registration works
- [ ] User login works
- [ ] Password reset works
- [ ] Chat functionality works
- [ ] Exam generation works
- [ ] Payment processing works
- [ ] Subscription management works
- [ ] Email sending works

---

## 🔧 Environment Setup

### Step 1: Generate JWT Secret

```bash
# Generate a strong random secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Step 2: Create Production `.env` File

Create a `.env.production` file (or set environment variables in your hosting platform):

```env
# Database
DATABASE_URL="postgresql://user:password@host:port/database?schema=public"

# Authentication
JWT_SECRET="your-generated-secret-here"
NEXT_PUBLIC_APP_URL="https://yourdomain.com"

# OpenAI (Required for exam generation)
OPENAI_API_KEY="sk-xxxxxxxxxxxxxxxxxxxxx"

# Razorpay (Required for payments)
RAZORPAY_KEY_ID="rzp_live_xxxxxxxxxxxxx"
RAZORPAY_KEY_SECRET="xxxxxxxxxxxxxxxxxxxxx"
RAZORPAY_WEBHOOK_SECRET="xxxxxxxxxxxxxxxxxxxxx"

# Email Service (Recommended)
SENDGRID_API_KEY="SG.xxxxxxxxxxxxxxxxxxxxx"
EMAIL_FROM="noreply@yourdomain.com"

# Google Custom Search (Optional - for Research Mode)
GOOGLE_SEARCH_API_KEY="AIzaSyC9qPhrRXVCvV2MdkvHHyqr0FkNVJkjxDU"
GOOGLE_SEARCH_ENGINE_ID="your-search-engine-id"

# Node Environment
NODE_ENV="production"
```

### Step 3: Verify Environment Variables

Ensure all required variables are set:

```bash
# In your deployment platform, verify:
echo $JWT_SECRET
echo $DATABASE_URL
echo $OPENAI_API_KEY
echo $RAZORPAY_KEY_ID
```

---

## 🗄️ Database Migration

### Option 1: PostgreSQL (Recommended)

#### Step 1: Set Up PostgreSQL Database

Choose a hosting provider:
- **Supabase** (Recommended for ease): https://supabase.com
- **Vercel Postgres**: https://vercel.com/docs/storage/vercel-postgres
- **AWS RDS**: https://aws.amazon.com/rds/
- **Railway**: https://railway.app
- **Neon**: https://neon.tech

#### Step 2: Get Connection String

From your PostgreSQL provider, get the connection string:
```
postgresql://user:password@host:port/database?schema=public
```

#### Step 3: Update Environment Variables

Update `DATABASE_URL` in your `.env.production` or hosting platform.

#### Step 4: Run Migrations

```bash
# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate deploy

# Verify database
npx prisma studio  # Optional: Open database viewer
```

#### Step 5: Verify Connection

```bash
# Test database connection
npx prisma db pull
```

### Option 2: SQLite (Development Only)

⚠️ **Not recommended for production** - Use for development only.

```bash
# SQLite is already configured
# Just ensure DATABASE_URL points to your SQLite file
DATABASE_URL="file:./dev.db"
```

---

## 💳 API Configuration

### Razorpay Setup

#### Step 1: Get API Keys

1. Go to [Razorpay Dashboard](https://dashboard.razorpay.com)
2. Navigate to **Settings** → **API Keys**
3. Copy your **Key ID** and **Key Secret**
4. Add to environment variables

#### Step 2: Configure Webhooks

1. Go to **Settings** → **Webhooks**
2. Add webhook URL: `https://yourdomain.com/api/webhooks/razorpay`
3. Enable events:
   - `subscription.*`
   - `payment.*`
   - `invoice.*`
4. Copy **Webhook Secret** and add to environment variables

#### Step 3: Test Payments

Use Razorpay test mode first:
- Test Key ID: Starts with `rzp_test_`
- Test payments: Use test cards from Razorpay docs

### OpenAI Setup

#### Step 1: Get API Key

1. Go to [OpenAI Platform](https://platform.openai.com/api-keys)
2. Create a new API key
3. Copy the key (starts with `sk-`)
4. Add to environment variables

#### Step 2: Set Usage Limits (Optional)

1. Go to **Settings** → **Usage Limits**
2. Set monthly spending limits
3. Configure alerts

### Google Custom Search (Optional)

See [GOOGLE_SEARCH_SETUP.md](./GOOGLE_SEARCH_SETUP.md) for detailed instructions.

---

## 📧 Email Service Setup

### Option 1: SendGrid (Recommended)

#### Step 1: Create Account

1. Go to [SendGrid](https://sendgrid.com)
2. Sign up for free account (100 emails/day free)
3. Verify your email

#### Step 2: Create API Key

1. Go to **Settings** → **API Keys**
2. Click **Create API Key**
3. Name it (e.g., "PAATA.AI Production")
4. Select **Full Access** or **Restricted Access** (Mail Send)
5. Copy the API key (starts with `SG.`)
6. Add to environment variables

#### Step 3: Verify Sender

1. Go to **Settings** → **Sender Authentication**
2. Verify your domain or single sender
3. Update `EMAIL_FROM` in environment variables

#### Step 4: Test Email Sending

```bash
# The email service will automatically use SendGrid
# Test by triggering password reset or signup
```

### Option 2: AWS SES

1. Set up AWS SES
2. Verify domain/email
3. Get AWS credentials
4. Update `src/lib/email-service.ts` to use AWS SES
5. Add credentials to environment variables

### Option 3: SMTP

1. Get SMTP credentials from your email provider
2. Update `src/lib/email-service.ts` to use SMTP
3. Add SMTP credentials to environment variables

---

## 🌐 Deployment Options

### Option 1: Vercel (Recommended)

#### Step 1: Prepare Repository

```bash
# Ensure all code is committed
git add .
git commit -m "Prepare for production deployment"
git push origin main
```

#### Step 2: Deploy to Vercel

1. Go to [Vercel](https://vercel.com)
2. Click **New Project**
3. Import your GitHub/GitLab repository
4. Configure project:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./` (or your root)
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

#### Step 3: Add Environment Variables

In Vercel dashboard:
1. Go to **Settings** → **Environment Variables**
2. Add all variables from `.env.production`
3. Set for **Production**, **Preview**, and **Development**

#### Step 4: Set Up Database

1. Use **Vercel Postgres** (integrated) or external PostgreSQL
2. Add `DATABASE_URL` to environment variables
3. Run migrations: `npx prisma migrate deploy`

#### Step 5: Deploy

1. Click **Deploy**
2. Wait for build to complete
3. Test your deployment

#### Step 6: Configure Custom Domain (Optional)

1. Go to **Settings** → **Domains**
2. Add your domain
3. Follow DNS configuration instructions

### Option 2: AWS (EC2/ECS)

#### Step 1: Set Up Server

1. Launch EC2 instance or ECS cluster
2. Install Node.js 18+
3. Install PostgreSQL client

#### Step 2: Clone Repository

```bash
git clone https://github.com/yourusername/paata-ai.git
cd paata-ai
npm install
```

#### Step 3: Configure Environment

```bash
# Create .env file
nano .env
# Add all environment variables
```

#### Step 4: Build and Run

```bash
# Build application
npm run build

# Run migrations
npx prisma migrate deploy

# Start application (with PM2)
npm install -g pm2
pm2 start npm --name "paata-ai" -- start
pm2 save
pm2 startup
```

### Option 3: Docker

#### Step 1: Create Dockerfile

```dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

#### Step 2: Build and Run

```bash
# Build image
docker build -t paata-ai .

# Run container
docker run -p 3000:3000 --env-file .env.production paata-ai
```

---

## 🔍 Post-Deployment

### Step 1: Verify All Features

1. **Authentication**
   - [ ] Sign up
   - [ ] Login
   - [ ] Password reset
   - [ ] Email verification

2. **Chat**
   - [ ] Send messages
   - [ ] Image upload
   - [ ] Voice input
   - [ ] Research Mode

3. **Exams**
   - [ ] Generate exam
   - [ ] Take exam
   - [ ] View results

4. **Payments**
   - [ ] Create subscription
   - [ ] Process payment
   - [ ] View invoices
   - [ ] Cancel subscription

5. **Email**
   - [ ] Password reset email
   - [ ] Verification email
   - [ ] Invoice email

### Step 2: Set Up Monitoring

#### Option 1: Vercel Analytics

1. Enable Vercel Analytics in dashboard
2. Monitor performance and errors

#### Option 2: Sentry (Recommended)

1. Sign up at [Sentry](https://sentry.io)
2. Create Next.js project
3. Install Sentry:

```bash
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

4. Configure in `sentry.client.config.ts` and `sentry.server.config.ts`

### Step 3: Set Up Backups

1. **Database Backups**
   - Configure automatic backups in your PostgreSQL provider
   - Set up daily backups
   - Test restore process

2. **Code Backups**
   - Use Git (GitHub/GitLab)
   - Regular commits
   - Tag releases

### Step 4: Performance Optimization

1. **Enable Caching**
   - Vercel: Automatic
   - Other: Set up CDN (Cloudflare, AWS CloudFront)

2. **Image Optimization**
   - Use Next.js Image component
   - Configure image domains

3. **Database Optimization**
   - Add indexes for frequently queried fields
   - Monitor slow queries

---

## 🐛 Troubleshooting

### Database Connection Issues

```bash
# Test connection
npx prisma db pull

# Common issues:
# - Wrong connection string format
# - Firewall blocking connection
# - SSL required (add ?sslmode=require)
```

### Build Errors

```bash
# Clear Next.js cache
rm -rf .next
npm run build

# Clear node_modules
rm -rf node_modules package-lock.json
npm install
```

### API Key Issues

```bash
# Verify environment variables are loaded
# In production, check hosting platform environment variables
# Ensure no typos in variable names
```

### Email Not Sending

1. Check SendGrid API key
2. Verify sender email is verified
3. Check SendGrid dashboard for errors
4. Review server logs

### Payment Issues

1. Verify Razorpay keys are for correct environment (test/live)
2. Check webhook URL is correct
3. Verify webhook events are enabled
4. Check Razorpay dashboard for webhook logs

---

## 📞 Support

For deployment issues:
- Check [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
- Review [CONFIGURATION_GUIDE.md](./CONFIGURATION_GUIDE.md)
- Contact support: support@paataai.com

---

## ✅ Deployment Checklist Summary

- [ ] Environment variables configured
- [ ] Database migrated to PostgreSQL
- [ ] Razorpay configured and tested
- [ ] OpenAI API key configured
- [ ] Email service configured
- [ ] Application deployed
- [ ] Custom domain configured (if applicable)
- [ ] All features tested
- [ ] Monitoring set up
- [ ] Backups configured
- [ ] Performance optimized

**Your PAATA.AI application is now ready for production!** 🎉


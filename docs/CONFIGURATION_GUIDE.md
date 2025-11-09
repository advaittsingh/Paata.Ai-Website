# 🔧 PAATA.AI Configuration Guide

**Last Updated:** January 2025  
**Version:** 2.0  
**Purpose:** Step-by-step guide for completing remaining configuration steps

---

## 📋 Overview

This guide explains all remaining configuration steps needed to make PAATA.AI fully production-ready. These are **not blockers** for submission - the system works without them, but they're needed for production deployment.

**Recent Updates:**
- Added OpenAI API setup for exam question generation
- Updated chat persistence documentation
- Added analytics configuration notes

---

## 🔴 REQUIRED: Razorpay Setup (For Payment Processing)

### Why This Is Needed
- Currently, payment processing is implemented but needs Razorpay API keys to work
- Without keys, users can't actually process payments (subscriptions will fail)
- Free plan (Basic) works without Razorpay, but paid plans (Pro/Enterprise) need it

### Step-by-Step Setup

#### 1. Create Razorpay Account
1. Go to https://razorpay.com
2. Click "Sign Up" or "Get Started"
3. Complete registration (business or personal account)
4. Verify your email and phone number

#### 2. Get API Keys
1. Log in to Razorpay Dashboard
2. Go to **Settings** → **API Keys**
3. You'll see two options:
   - **Test Mode** (for development/testing)
   - **Live Mode** (for production)

**For Testing:**
- Click "Generate Test Keys"
- Copy the **Key ID** and **Key Secret**

**For Production:**
- Complete business verification first
- Switch to Live Mode
- Generate Live Keys
- Copy the **Key ID** and **Key Secret**

#### 3. Set Up Webhook
1. In Razorpay Dashboard, go to **Settings** → **Webhooks**
2. Click "Add New Webhook"
3. Enter your webhook URL:
   ```
   https://yourdomain.com/api/webhooks/razorpay
   ```
   (Replace `yourdomain.com` with your actual domain)
4. **Enable these events:**
   - `subscription.created`
   - `subscription.updated`
   - `subscription.activated`
   - `subscription.cancelled`
   - `payment.captured`
   - `payment.failed`
   - `invoice.paid`
5. Copy the **Webhook Secret** (shown after creating webhook)

#### 4. Add to Environment Variables
Create or update your `.env` file in the project root:

```env
# Razorpay Configuration
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxxx
RAZORPAY_WEBHOOK_SECRET=xxxxxxxxxxxxxxxxxxxxx

# Optional: Pre-created Plan IDs (if you want to use existing plans)
RAZORPAY_PLAN_PRO_MONTHLY=plan_xxxxxxxxxxxxx
RAZORPAY_PLAN_PRO_YEARLY=plan_xxxxxxxxxxxxx
RAZORPAY_PLAN_ENTERPRISE_MONTHLY=plan_xxxxxxxxxxxxx
RAZORPAY_PLAN_ENTERPRISE_YEARLY=plan_xxxxxxxxxxxxx
```

**Note:** If you don't set the plan IDs, the system will automatically create plans in Razorpay when needed.

#### 5. Test the Integration
1. Start your development server: `npm run dev`
2. Try to upgrade to a paid plan
3. Use Razorpay test cards:
   - **Success:** `4111 1111 1111 1111`
   - **Failure:** `4000 0000 0000 0002`
   - **CVV:** Any 3 digits
   - **Expiry:** Any future date

#### 6. Production Checklist
- [ ] Switch to Live Mode in Razorpay
- [ ] Update environment variables with Live keys
- [ ] Update webhook URL to production domain
- [ ] Test with real payment (small amount)
- [ ] Verify webhook is receiving events

---

## 🟡 OPTIONAL: Email Service Integration

### Why This Is Optional
- System works without email service
- Password reset links will be logged to console (development)
- Subscription confirmations won't be sent
- Invoices won't be emailed

### Email Service Options

#### Option 1: SendGrid (Recommended - Easy Setup)

**Setup Steps:**
1. Go to https://sendgrid.com
2. Create free account (100 emails/day free)
3. Verify your email address
4. Go to **Settings** → **API Keys**
5. Click "Create API Key"
6. Name it (e.g., "PAATA.AI")
7. Copy the API key

**Update Code:**
1. Install SendGrid SDK:
   ```bash
   npm install @sendgrid/mail
   ```

2. Update `src/lib/email-service.ts`:
   ```typescript
   import sgMail from '@sendgrid/mail';

   sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

   export async function sendEmail(options: EmailOptions): Promise<boolean> {
     try {
       await sgMail.send({
         to: options.to,
         from: options.from || process.env.EMAIL_FROM || 'noreply@paataai.com',
         subject: options.subject,
         html: options.html,
         text: options.text,
       });
       return true;
     } catch (error) {
       console.error('SendGrid error:', error);
       return false;
     }
   }
   ```

3. Add to `.env`:
   ```env
   SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxx
   EMAIL_FROM=noreply@paataai.com
   ```

#### Option 2: AWS SES (For AWS Users)

**Setup Steps:**
1. Go to AWS Console → SES
2. Verify your email domain or email address
3. Create IAM user with SES permissions
4. Generate access keys

**Update Code:**
1. Install AWS SDK:
   ```bash
   npm install @aws-sdk/client-ses
   ```

2. Update `src/lib/email-service.ts` with AWS SES code

3. Add to `.env`:
   ```env
   AWS_REGION=us-east-1
   AWS_ACCESS_KEY_ID=xxxxxxxxxxxxx
   AWS_SECRET_ACCESS_KEY=xxxxxxxxxxxxx
   EMAIL_FROM=noreply@paataai.com
   ```

#### Option 3: Resend (Modern & Simple)

**Setup Steps:**
1. Go to https://resend.com
2. Create account
3. Get API key from dashboard

**Update Code:**
1. Install Resend SDK:
   ```bash
   npm install resend
   ```

2. Update `src/lib/email-service.ts` with Resend code

3. Add to `.env`:
   ```env
   RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxx
   EMAIL_FROM=noreply@paataai.com
   ```

#### Option 4: SMTP (Generic)

**Setup Steps:**
1. Get SMTP credentials from your email provider:
   - Gmail: Use App Password
   - Outlook: Use App Password
   - Custom SMTP: Get from hosting provider

**Update Code:**
1. Install Nodemailer:
   ```bash
   npm install nodemailer
   ```

2. Update `src/lib/email-service.ts`:
   ```typescript
   import nodemailer from 'nodemailer';

   const transporter = nodemailer.createTransport({
     host: process.env.SMTP_HOST,
     port: parseInt(process.env.SMTP_PORT || '587'),
     secure: process.env.SMTP_PORT === '465',
     auth: {
       user: process.env.SMTP_USER,
       pass: process.env.SMTP_PASS,
     },
   });

   export async function sendEmail(options: EmailOptions): Promise<boolean> {
     try {
       await transporter.sendMail({
         from: options.from || process.env.EMAIL_FROM,
         to: options.to,
         subject: options.subject,
         html: options.html,
         text: options.text,
       });
       return true;
     } catch (error) {
       console.error('SMTP error:', error);
       return false;
     }
   }
   ```

3. Add to `.env`:
   ```env
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   EMAIL_FROM=noreply@paataai.com
   ```

---

## 🟡 OPTIONAL: Database Migration (SQLite → PostgreSQL)

### Why This Is Optional
- SQLite works fine for development and small deployments
- PostgreSQL recommended for:
  - Production environments
  - Multiple concurrent users
  - Better performance
  - Advanced features

### Migration Steps

#### 1. Set Up PostgreSQL Database

**Option A: Local PostgreSQL**
```bash
# Install PostgreSQL (macOS)
brew install postgresql
brew services start postgresql

# Create database
createdb paataai_production
```

**Option B: Cloud Database (Recommended)**
- **Vercel Postgres:** Free tier available
- **Supabase:** Free tier available
- **Railway:** Free tier available
- **Neon:** Free tier available
- **AWS RDS:** Paid, enterprise-grade

#### 2. Get Connection String
Format: `postgresql://username:password@host:port/database`

Example:
```
postgresql://user:password@localhost:5432/paataai_production
```

#### 3. Update Environment Variables
```env
# Change from SQLite to PostgreSQL
DATABASE_URL="postgresql://user:password@localhost:5432/paataai_production"
```

#### 4. Update Prisma Schema (If Needed)
Check `prisma/schema.prisma` - it should already support PostgreSQL.

#### 5. Run Migration
```bash
# Generate migration
npx prisma migrate dev --name init

# For production
npx prisma migrate deploy
```

#### 6. Migrate Existing Data (If Applicable)
If you have existing SQLite data:
1. Export SQLite data
2. Import to PostgreSQL
3. Or use a migration tool

---

## 🔵 REQUIRED: Environment Variables Setup

### Complete `.env` File Template

Create a `.env` file in your project root:

```env
# Database
DATABASE_URL="file:./prisma/dev.db"
# For production PostgreSQL:
# DATABASE_URL="postgresql://user:password@host:5432/database"

# Authentication
JWT_SECRET=your-super-secret-jwt-key-change-in-production-min-32-chars
JWT_EXPIRES_IN=7d

# Razorpay (Required for payment processing)
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxxx
RAZORPAY_WEBHOOK_SECRET=xxxxxxxxxxxxxxxxxxxxx

# Optional: Pre-created Razorpay Plan IDs
RAZORPAY_PLAN_PRO_MONTHLY=plan_xxxxxxxxxxxxx
RAZORPAY_PLAN_PRO_YEARLY=plan_xxxxxxxxxxxxx
RAZORPAY_PLAN_ENTERPRISE_MONTHLY=plan_xxxxxxxxxxxxx
RAZORPAY_PLAN_ENTERPRISE_YEARLY=plan_xxxxxxxxxxxxx

# App URL (Required for webhooks and callbacks)
NEXT_PUBLIC_APP_URL=http://localhost:3000
# For production:
# NEXT_PUBLIC_APP_URL=https://paataai.com

# Email Service (Optional)
# For SendGrid:
SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxx
EMAIL_FROM=noreply@paataai.com

# For SMTP:
# SMTP_HOST=smtp.gmail.com
# SMTP_PORT=587
# SMTP_USER=your-email@gmail.com
# SMTP_PASS=your-app-password
# EMAIL_FROM=noreply@paataai.com

# OpenAI (If using OpenAI for chat)
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxx

# Other API Keys (if needed)
# Add other service API keys here
```

### Generate JWT Secret

For production, generate a strong JWT secret:

```bash
# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Or using OpenSSL
openssl rand -hex 32
```

---

## 📝 Configuration Priority

### 🔴 Must Do Before Production
1. **Razorpay Setup** - Required for payment processing
2. **Environment Variables** - Set all required variables
3. **App URL** - Set production URL
4. **JWT Secret** - Generate strong secret

### 🟡 Should Do (Recommended)
1. **Email Service** - For password reset and notifications
2. **Database Migration** - For production scalability
3. **Webhook Configuration** - For automatic subscription updates

### 🔵 Nice to Have
1. **Advanced Analytics**
2. **Error Logging (Sentry)**
3. **Monitoring Tools**
4. **CDN Setup**

---

## 🧪 Testing Checklist

After configuration, test these:

### Razorpay Integration
- [ ] Test payment link generation
- [ ] Test subscription creation
- [ ] Test webhook receiving events
- [ ] Test subscription cancellation
- [ ] Test invoice creation

### Email Service (If Configured)
- [ ] Test password reset email
- [ ] Test subscription confirmation email
- [ ] Test invoice email
- [ ] Test cancellation email

### Database (If Migrated)
- [ ] Test user creation
- [ ] Test subscription creation
- [ ] Test data queries
- [ ] Test performance

---

## 🚀 Deployment Checklist

Before deploying to production:

### Pre-Deployment
- [ ] All environment variables set
- [ ] Razorpay keys configured (Live mode)
- [ ] Webhook URL updated
- [ ] Database migrated (if using PostgreSQL)
- [ ] JWT secret generated
- [ ] Email service configured (optional)

### Deployment
- [ ] Deploy to hosting (Vercel, Railway, etc.)
- [ ] Set environment variables in hosting platform
- [ ] Run database migrations
- [ ] Test live site

### Post-Deployment
- [ ] Test payment processing
- [ ] Test webhook receiving
- [ ] Test email sending (if configured)
- [ ] Monitor error logs
- [ ] Test all critical paths

---

## 📞 Support & Resources

### Razorpay Resources
- **Documentation:** https://razorpay.com/docs
- **Support:** support@razorpay.com
- **Dashboard:** https://dashboard.razorpay.com

### Email Service Resources
- **SendGrid:** https://docs.sendgrid.com
- **AWS SES:** https://docs.aws.amazon.com/ses
- **Resend:** https://resend.com/docs

### Database Resources
- **Prisma Docs:** https://www.prisma.io/docs
- **PostgreSQL Docs:** https://www.postgresql.org/docs

---

## ⚠️ Important Notes

1. **Never commit `.env` file** - It contains secrets
2. **Use different keys for dev/staging/production**
3. **Rotate keys regularly** for security
4. **Monitor webhook logs** to ensure they're working
5. **Test in test mode first** before going live
6. **Keep backups** of your database

---

## ✅ Quick Start Summary

**Minimum for Production:**
1. Set up Razorpay account → Get API keys
2. Add keys to `.env` file
3. Set `NEXT_PUBLIC_APP_URL` to production URL
4. Generate strong `JWT_SECRET`
5. Deploy!

**Recommended:**
+ Set up email service
+ Migrate to PostgreSQL
+ Configure monitoring

---

**Status:** Ready to configure and deploy! 🚀


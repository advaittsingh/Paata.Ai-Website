# 📄 Environment Variables Template

**Copy this template to create your `.env` file**

---

## 🔐 Create `.env` File

Create a file named `.env` in your project root directory (same level as `package.json`).

**⚠️ IMPORTANT:** Never commit `.env` to git! It's already in `.gitignore`.

---

## 📋 Complete Template

```env
# ============================================
# DATABASE CONFIGURATION
# ============================================
# Development (SQLite - default)
DATABASE_URL="file:./prisma/dev.db"

# Production (PostgreSQL - recommended)
# DATABASE_URL="postgresql://username:password@host:port/database"

# ============================================
# AUTHENTICATION
# ============================================
# Generate a strong random string (32+ characters)
# Use: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
JWT_SECRET=your-super-secret-jwt-key-change-in-production-min-32-characters
JWT_EXPIRES_IN=7d

# ============================================
# RAZORPAY CONFIGURATION (REQUIRED FOR PAYMENTS)
# ============================================
# Get these from: https://dashboard.razorpay.com → Settings → API Keys
# Test Mode (for development)
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxxx

# Live Mode (for production)
# RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxxx
# RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxxx

# Webhook Secret (from Razorpay Dashboard → Settings → Webhooks)
RAZORPAY_WEBHOOK_SECRET=xxxxxxxxxxxxxxxxxxxxx

# Optional: Pre-created Plan IDs (if you have them in Razorpay)
# RAZORPAY_PLAN_PRO_MONTHLY=plan_xxxxxxxxxxxxx
# RAZORPAY_PLAN_PRO_YEARLY=plan_xxxxxxxxxxxxx
# RAZORPAY_PLAN_ENTERPRISE_MONTHLY=plan_xxxxxxxxxxxxx
# RAZORPAY_PLAN_ENTERPRISE_YEARLY=plan_xxxxxxxxxxxxx

# ============================================
# APPLICATION URL
# ============================================
# Development
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Production (update with your domain)
# NEXT_PUBLIC_APP_URL=https://paataai.com

# ============================================
# EMAIL SERVICE (OPTIONAL)
# ============================================
# Option 1: SendGrid
# SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxx
# EMAIL_FROM=noreply@paataai.com

# Option 2: SMTP (Generic)
# SMTP_HOST=smtp.gmail.com
# SMTP_PORT=587
# SMTP_USER=your-email@gmail.com
# SMTP_PASS=your-app-password
# EMAIL_FROM=noreply@paataai.com

# Option 3: AWS SES
# AWS_REGION=us-east-1
# AWS_ACCESS_KEY_ID=xxxxxxxxxxxxx
# AWS_SECRET_ACCESS_KEY=xxxxxxxxxxxxx
# EMAIL_FROM=noreply@paataai.com

# Option 4: Resend
# RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxx
# EMAIL_FROM=noreply@paataai.com

# ============================================
# OPENAI CONFIGURATION (REQUIRED FOR EXAM GENERATION)
# ============================================
# Get from: https://platform.openai.com/api-keys
# Required for AI-powered exam question generation (/api/exam/generate)
# Model used: gpt-4o-mini (cost-effective)
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxx

# ============================================
# GOOGLE CUSTOM SEARCH API (FOR RESEARCH MODE)
# ============================================
# Get from: https://console.cloud.google.com/apis/credentials
# Create API key and enable "Custom Search API"
# Get Search Engine ID from: https://programmablesearchengine.google.com/controlpanel/create
# Required for web search functionality in Research Mode
GOOGLE_SEARCH_API_KEY=AIzaSyC9qPhrRXVCvV2MdkvHHyqr0FkNVJkjxDU
GOOGLE_SEARCH_ENGINE_ID=your-search-engine-id-here

# ============================================
# OTHER API KEYS (IF NEEDED)
# ============================================
# Add other service API keys here as needed
```

---

## 🎯 Minimum Required Variables

For basic functionality (without payments and exam generation):

```env
JWT_SECRET=<generate-random-string>
JWT_EXPIRES_IN=7d
DATABASE_URL="file:./prisma/dev.db"
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

For exam question generation:
```env
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxx
```

---

## 🔴 Required for Payments

Add these for payment processing:

```env
RAZORPAY_KEY_ID=rzp_test_xxxxx
RAZORPAY_KEY_SECRET=xxxxx
RAZORPAY_WEBHOOK_SECRET=xxxxx
```

---

## 🟡 Optional for Production

Add these for full production setup:

```env
# Email Service
SENDGRID_API_KEY=SG.xxxxx
EMAIL_FROM=noreply@paataai.com

# PostgreSQL (instead of SQLite)
DATABASE_URL="postgresql://user:pass@host/db"
```

---

## 🔧 How to Generate JWT Secret

### Method 1: Node.js
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Method 2: OpenSSL
```bash
openssl rand -hex 32
```

### Method 3: Online Generator
Use: https://randomkeygen.com/ (use "CodeIgniter Encryption Keys")

---

## ✅ Verification Checklist

After setting up `.env`:

- [ ] File exists in project root
- [ ] JWT_SECRET is set (32+ characters)
- [ ] DATABASE_URL is set
- [ ] NEXT_PUBLIC_APP_URL is set
- [ ] Razorpay keys set (if using payments)
- [ ] Email service configured (optional)
- [ ] File is in `.gitignore` (should be)

---

## ⚠️ Security Notes

1. **Never commit `.env`** - Contains secrets
2. **Use different keys** for dev/staging/production
3. **Rotate secrets regularly** - Change JWT_SECRET periodically
4. **Use strong secrets** - Minimum 32 characters
5. **Keep secrets secure** - Don't share in emails/chat

---

## 🚀 Deployment

When deploying to hosting (Vercel, Railway, etc.):

1. Go to hosting platform dashboard
2. Find "Environment Variables" or "Secrets" section
3. Add all variables from `.env` file
4. Set `NEXT_PUBLIC_APP_URL` to production URL
5. Use production Razorpay keys (not test keys)

---

**Copy this template and fill in your actual values!** ✅


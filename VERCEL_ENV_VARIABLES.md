# Vercel Environment Variables

This document lists all environment variables required for deploying the Paata.Ai website to Vercel.

## Required Environment Variables

### Database
- **`DATABASE_URL`** (Required)
  - PostgreSQL connection string
  - Format: `postgresql://user:password@host:port/database?schema=public`
  - Example: `postgresql://user:pass@db.example.com:5432/paataai?schema=public`

### Authentication & Security
- **`JWT_SECRET`** (Required)
  - Secret key for JWT token generation and verification
  - Should be a long, random, secure string
  - Example: Generate using `openssl rand -base64 32`

- **`JWT_EXPIRES_IN`** (Optional)
  - JWT token expiration time
  - Default: `7d` (7 days)
  - Format: `7d`, `24h`, `30m`, etc.

### OpenAI API
- **`OPENAI_API_KEY`** (Required)
  - OpenAI API key for AI features (chat, exam generation, mind maps, notes, voice, TTS, OCR)
  - Get from: https://platform.openai.com/api-keys

### Admin Configuration
- **`ADMIN_EMAIL`** (Required)
  - Email address of the admin user
  - Used for reward expiration checks and admin access
  - Example: `admin@paataai.com`

- **`ADMIN_EMAILS`** (Optional)
  - Comma-separated list of admin email addresses
  - Used for admin panel access
  - Example: `admin@paataai.com,admin2@paataai.com`

### Application URLs
- **`NEXT_PUBLIC_APP_URL`** (Required)
  - Public URL of your application
  - Used for email links, redirects, and callbacks
  - Example: `https://paataai.com` or `https://www.paataai.com`
  - **Note:** Must start with `https://` in production

- **`NEXT_PUBLIC_API_URL`** (Optional)
  - Public API URL (if different from app URL)
  - Default: Uses `NEXT_PUBLIC_APP_URL`

### Payment Gateway - Razorpay
- **`RAZORPAY_KEY_ID`** (Required if using Razorpay)
  - Razorpay API Key ID
  - Get from: https://dashboard.razorpay.com/app/keys

- **`RAZORPAY_KEY_SECRET`** (Required if using Razorpay)
  - Razorpay API Key Secret
  - Get from: https://dashboard.razorpay.com/app/keys

- **`RAZORPAY_WEBHOOK_SECRET`** (Required if using Razorpay webhooks)
  - Razorpay webhook secret for verifying webhook signatures
  - Get from: Razorpay Dashboard → Settings → Webhooks

- **`RAZORPAY_PLAN_PRO_MONTHLY`** (Required if using Razorpay subscriptions)
  - Razorpay Plan ID for Pro Monthly subscription
  - Create plan in Razorpay Dashboard → Products → Plans

- **`RAZORPAY_PLAN_PRO_YEARLY`** (Required if using Razorpay subscriptions)
  - Razorpay Plan ID for Pro Yearly subscription

- **`RAZORPAY_PLAN_ENTERPRISE_MONTHLY`** (Required if using Razorpay subscriptions)
  - Razorpay Plan ID for Enterprise Monthly subscription

- **`RAZORPAY_PLAN_ENTERPRISE_YEARLY`** (Required if using Razorpay subscriptions)
  - Razorpay Plan ID for Enterprise Yearly subscription

### Email Service - SendGrid
- **`SENDGRID_API_KEY`** (Required for email functionality)
  - SendGrid API key for sending emails
  - Get from: https://app.sendgrid.com/settings/api_keys

- **`EMAIL_FROM`** (Optional)
  - Email address to send emails from
  - Default: `noreply@paataai.com`
  - Example: `noreply@paataai.com`

## Optional Environment Variables

### Google Services
- **`GOOGLE_SEARCH_API_KEY`** (Optional)
  - Google Custom Search API key
  - Used for web search functionality
  - Get from: https://console.cloud.google.com/apis/credentials

- **`GOOGLE_SEARCH_ENGINE_ID`** (Optional)
  - Google Custom Search Engine ID
  - Used with Google Search API

- **`GOOGLE_CLOUD_VISION_API_KEY`** (Optional)
  - Google Cloud Vision API key
  - Used for OCR functionality
  - Get from: https://console.cloud.google.com/apis/credentials

- **`GEMINI_API_KEY`** (Optional)
  - Google Gemini API key
  - Alternative OCR provider
  - Get from: https://makersuite.google.com/app/apikey

- **`GOOGLE_API_KEY`** (Optional)
  - Alternative name for Gemini API key
  - Used as fallback if `GEMINI_API_KEY` is not set

### Payment Gateway - Stripe
- **`STRIPE_WEBHOOK_SECRET`** (Optional)
  - Stripe webhook secret for verifying webhook signatures
  - Only needed if using Stripe as payment provider
  - Get from: Stripe Dashboard → Developers → Webhooks

### Error Monitoring - Sentry
- **`NEXT_PUBLIC_SENTRY_DSN`** (Optional)
  - Sentry DSN for error tracking
  - Get from: https://sentry.io/settings/projects/

### Security Features
- **`ENABLE_CSRF_PROTECTION`** (Optional)
  - Enable CSRF protection
  - Set to `true` to enable (defaults to enabled in production)
  - Values: `true` or `false`

## Automatically Set by Vercel

These variables are automatically set by Vercel and don't need to be configured:

- **`NODE_ENV`** - Automatically set to `production` in production deployments
- **`NEXT_RUNTIME`** - Automatically set based on your Next.js configuration

## Quick Setup Checklist

### Minimum Required for Basic Functionality:
1. ✅ `DATABASE_URL`
2. ✅ `JWT_SECRET`
3. ✅ `OPENAI_API_KEY`
4. ✅ `ADMIN_EMAIL`
5. ✅ `NEXT_PUBLIC_APP_URL`

### For Full Payment Functionality:
6. ✅ `RAZORPAY_KEY_ID`
7. ✅ `RAZORPAY_KEY_SECRET`
8. ✅ `RAZORPAY_WEBHOOK_SECRET`
9. ✅ `RAZORPAY_PLAN_PRO_MONTHLY`
10. ✅ `RAZORPAY_PLAN_PRO_YEARLY`
11. ✅ `RAZORPAY_PLAN_ENTERPRISE_MONTHLY`
12. ✅ `RAZORPAY_PLAN_ENTERPRISE_YEARLY`

### For Email Functionality:
13. ✅ `SENDGRID_API_KEY`
14. ✅ `EMAIL_FROM` (optional)

## How to Add Environment Variables in Vercel

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add each variable with its value
4. Select the environments where it should be available:
   - **Production** - For production deployments
   - **Preview** - For preview deployments (pull requests)
   - **Development** - For local development (if using Vercel CLI)

## Important Notes

1. **Never commit secrets to Git** - All sensitive values should only be in Vercel environment variables
2. **Use different values for production and preview** - Especially for payment gateway keys
3. **Rotate secrets regularly** - Change API keys and secrets periodically for security
4. **Test in preview environment first** - Deploy to preview before production
5. **Database URL** - Ensure your database allows connections from Vercel's IP addresses
6. **HTTPS Required** - `NEXT_PUBLIC_APP_URL` must use `https://` in production

## Verification

After deployment, you can verify environment variables are set correctly by:
1. Checking the admin monitoring page (if accessible)
2. Testing key features (login, AI chat, payments)
3. Checking Vercel function logs for any missing variable errors

## Troubleshooting

If you see errors about missing environment variables:
1. Check Vercel dashboard → Settings → Environment Variables
2. Ensure variables are added to the correct environment (Production/Preview)
3. Redeploy after adding new variables
4. Check function logs in Vercel dashboard for specific error messages


This document lists all environment variables required for deploying the Paata.Ai website to Vercel.

## Required Environment Variables

### Database
- **`DATABASE_URL`** (Required)
  - PostgreSQL connection string
  - Format: `postgresql://user:password@host:port/database?schema=public`
  - Example: `postgresql://user:pass@db.example.com:5432/paataai?schema=public`

### Authentication & Security
- **`JWT_SECRET`** (Required)
  - Secret key for JWT token generation and verification
  - Should be a long, random, secure string
  - Example: Generate using `openssl rand -base64 32`

- **`JWT_EXPIRES_IN`** (Optional)
  - JWT token expiration time
  - Default: `7d` (7 days)
  - Format: `7d`, `24h`, `30m`, etc.

### OpenAI API
- **`OPENAI_API_KEY`** (Required)
  - OpenAI API key for AI features (chat, exam generation, mind maps, notes, voice, TTS, OCR)
  - Get from: https://platform.openai.com/api-keys

### Admin Configuration
- **`ADMIN_EMAIL`** (Required)
  - Email address of the admin user
  - Used for reward expiration checks and admin access
  - Example: `admin@paataai.com`

- **`ADMIN_EMAILS`** (Optional)
  - Comma-separated list of admin email addresses
  - Used for admin panel access
  - Example: `admin@paataai.com,admin2@paataai.com`

### Application URLs
- **`NEXT_PUBLIC_APP_URL`** (Required)
  - Public URL of your application
  - Used for email links, redirects, and callbacks
  - Example: `https://paataai.com` or `https://www.paataai.com`
  - **Note:** Must start with `https://` in production

- **`NEXT_PUBLIC_API_URL`** (Optional)
  - Public API URL (if different from app URL)
  - Default: Uses `NEXT_PUBLIC_APP_URL`

### Payment Gateway - Razorpay
- **`RAZORPAY_KEY_ID`** (Required if using Razorpay)
  - Razorpay API Key ID
  - Get from: https://dashboard.razorpay.com/app/keys

- **`RAZORPAY_KEY_SECRET`** (Required if using Razorpay)
  - Razorpay API Key Secret
  - Get from: https://dashboard.razorpay.com/app/keys

- **`RAZORPAY_WEBHOOK_SECRET`** (Required if using Razorpay webhooks)
  - Razorpay webhook secret for verifying webhook signatures
  - Get from: Razorpay Dashboard → Settings → Webhooks

- **`RAZORPAY_PLAN_PRO_MONTHLY`** (Required if using Razorpay subscriptions)
  - Razorpay Plan ID for Pro Monthly subscription
  - Create plan in Razorpay Dashboard → Products → Plans

- **`RAZORPAY_PLAN_PRO_YEARLY`** (Required if using Razorpay subscriptions)
  - Razorpay Plan ID for Pro Yearly subscription

- **`RAZORPAY_PLAN_ENTERPRISE_MONTHLY`** (Required if using Razorpay subscriptions)
  - Razorpay Plan ID for Enterprise Monthly subscription

- **`RAZORPAY_PLAN_ENTERPRISE_YEARLY`** (Required if using Razorpay subscriptions)
  - Razorpay Plan ID for Enterprise Yearly subscription

### Email Service - SendGrid
- **`SENDGRID_API_KEY`** (Required for email functionality)
  - SendGrid API key for sending emails
  - Get from: https://app.sendgrid.com/settings/api_keys

- **`EMAIL_FROM`** (Optional)
  - Email address to send emails from
  - Default: `noreply@paataai.com`
  - Example: `noreply@paataai.com`

## Optional Environment Variables

### Google Services
- **`GOOGLE_SEARCH_API_KEY`** (Optional)
  - Google Custom Search API key
  - Used for web search functionality
  - Get from: https://console.cloud.google.com/apis/credentials

- **`GOOGLE_SEARCH_ENGINE_ID`** (Optional)
  - Google Custom Search Engine ID
  - Used with Google Search API

- **`GOOGLE_CLOUD_VISION_API_KEY`** (Optional)
  - Google Cloud Vision API key
  - Used for OCR functionality
  - Get from: https://console.cloud.google.com/apis/credentials

- **`GEMINI_API_KEY`** (Optional)
  - Google Gemini API key
  - Alternative OCR provider
  - Get from: https://makersuite.google.com/app/apikey

- **`GOOGLE_API_KEY`** (Optional)
  - Alternative name for Gemini API key
  - Used as fallback if `GEMINI_API_KEY` is not set

### Payment Gateway - Stripe
- **`STRIPE_WEBHOOK_SECRET`** (Optional)
  - Stripe webhook secret for verifying webhook signatures
  - Only needed if using Stripe as payment provider
  - Get from: Stripe Dashboard → Developers → Webhooks

### Error Monitoring - Sentry
- **`NEXT_PUBLIC_SENTRY_DSN`** (Optional)
  - Sentry DSN for error tracking
  - Get from: https://sentry.io/settings/projects/

### Security Features
- **`ENABLE_CSRF_PROTECTION`** (Optional)
  - Enable CSRF protection
  - Set to `true` to enable (defaults to enabled in production)
  - Values: `true` or `false`

## Automatically Set by Vercel

These variables are automatically set by Vercel and don't need to be configured:

- **`NODE_ENV`** - Automatically set to `production` in production deployments
- **`NEXT_RUNTIME`** - Automatically set based on your Next.js configuration

## Quick Setup Checklist

### Minimum Required for Basic Functionality:
1. ✅ `DATABASE_URL`
2. ✅ `JWT_SECRET`
3. ✅ `OPENAI_API_KEY`
4. ✅ `ADMIN_EMAIL`
5. ✅ `NEXT_PUBLIC_APP_URL`

### For Full Payment Functionality:
6. ✅ `RAZORPAY_KEY_ID`
7. ✅ `RAZORPAY_KEY_SECRET`
8. ✅ `RAZORPAY_WEBHOOK_SECRET`
9. ✅ `RAZORPAY_PLAN_PRO_MONTHLY`
10. ✅ `RAZORPAY_PLAN_PRO_YEARLY`
11. ✅ `RAZORPAY_PLAN_ENTERPRISE_MONTHLY`
12. ✅ `RAZORPAY_PLAN_ENTERPRISE_YEARLY`

### For Email Functionality:
13. ✅ `SENDGRID_API_KEY`
14. ✅ `EMAIL_FROM` (optional)

## How to Add Environment Variables in Vercel

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add each variable with its value
4. Select the environments where it should be available:
   - **Production** - For production deployments
   - **Preview** - For preview deployments (pull requests)
   - **Development** - For local development (if using Vercel CLI)

## Important Notes

1. **Never commit secrets to Git** - All sensitive values should only be in Vercel environment variables
2. **Use different values for production and preview** - Especially for payment gateway keys
3. **Rotate secrets regularly** - Change API keys and secrets periodically for security
4. **Test in preview environment first** - Deploy to preview before production
5. **Database URL** - Ensure your database allows connections from Vercel's IP addresses
6. **HTTPS Required** - `NEXT_PUBLIC_APP_URL` must use `https://` in production

## Verification

After deployment, you can verify environment variables are set correctly by:
1. Checking the admin monitoring page (if accessible)
2. Testing key features (login, AI chat, payments)
3. Checking Vercel function logs for any missing variable errors

## Troubleshooting

If you see errors about missing environment variables:
1. Check Vercel dashboard → Settings → Environment Variables
2. Ensure variables are added to the correct environment (Production/Preview)
3. Redeploy after adding new variables
4. Check function logs in Vercel dashboard for specific error messages


This document lists all environment variables required for deploying the Paata.Ai website to Vercel.

## Required Environment Variables

### Database
- **`DATABASE_URL`** (Required)
  - PostgreSQL connection string
  - Format: `postgresql://user:password@host:port/database?schema=public`
  - Example: `postgresql://user:pass@db.example.com:5432/paataai?schema=public`

### Authentication & Security
- **`JWT_SECRET`** (Required)
  - Secret key for JWT token generation and verification
  - Should be a long, random, secure string
  - Example: Generate using `openssl rand -base64 32`

- **`JWT_EXPIRES_IN`** (Optional)
  - JWT token expiration time
  - Default: `7d` (7 days)
  - Format: `7d`, `24h`, `30m`, etc.

### OpenAI API
- **`OPENAI_API_KEY`** (Required)
  - OpenAI API key for AI features (chat, exam generation, mind maps, notes, voice, TTS, OCR)
  - Get from: https://platform.openai.com/api-keys

### Admin Configuration
- **`ADMIN_EMAIL`** (Required)
  - Email address of the admin user
  - Used for reward expiration checks and admin access
  - Example: `admin@paataai.com`

- **`ADMIN_EMAILS`** (Optional)
  - Comma-separated list of admin email addresses
  - Used for admin panel access
  - Example: `admin@paataai.com,admin2@paataai.com`

### Application URLs
- **`NEXT_PUBLIC_APP_URL`** (Required)
  - Public URL of your application
  - Used for email links, redirects, and callbacks
  - Example: `https://paataai.com` or `https://www.paataai.com`
  - **Note:** Must start with `https://` in production

- **`NEXT_PUBLIC_API_URL`** (Optional)
  - Public API URL (if different from app URL)
  - Default: Uses `NEXT_PUBLIC_APP_URL`

### Payment Gateway - Razorpay
- **`RAZORPAY_KEY_ID`** (Required if using Razorpay)
  - Razorpay API Key ID
  - Get from: https://dashboard.razorpay.com/app/keys

- **`RAZORPAY_KEY_SECRET`** (Required if using Razorpay)
  - Razorpay API Key Secret
  - Get from: https://dashboard.razorpay.com/app/keys

- **`RAZORPAY_WEBHOOK_SECRET`** (Required if using Razorpay webhooks)
  - Razorpay webhook secret for verifying webhook signatures
  - Get from: Razorpay Dashboard → Settings → Webhooks

- **`RAZORPAY_PLAN_PRO_MONTHLY`** (Required if using Razorpay subscriptions)
  - Razorpay Plan ID for Pro Monthly subscription
  - Create plan in Razorpay Dashboard → Products → Plans

- **`RAZORPAY_PLAN_PRO_YEARLY`** (Required if using Razorpay subscriptions)
  - Razorpay Plan ID for Pro Yearly subscription

- **`RAZORPAY_PLAN_ENTERPRISE_MONTHLY`** (Required if using Razorpay subscriptions)
  - Razorpay Plan ID for Enterprise Monthly subscription

- **`RAZORPAY_PLAN_ENTERPRISE_YEARLY`** (Required if using Razorpay subscriptions)
  - Razorpay Plan ID for Enterprise Yearly subscription

### Email Service - SendGrid
- **`SENDGRID_API_KEY`** (Required for email functionality)
  - SendGrid API key for sending emails
  - Get from: https://app.sendgrid.com/settings/api_keys

- **`EMAIL_FROM`** (Optional)
  - Email address to send emails from
  - Default: `noreply@paataai.com`
  - Example: `noreply@paataai.com`

## Optional Environment Variables

### Google Services
- **`GOOGLE_SEARCH_API_KEY`** (Optional)
  - Google Custom Search API key
  - Used for web search functionality
  - Get from: https://console.cloud.google.com/apis/credentials

- **`GOOGLE_SEARCH_ENGINE_ID`** (Optional)
  - Google Custom Search Engine ID
  - Used with Google Search API

- **`GOOGLE_CLOUD_VISION_API_KEY`** (Optional)
  - Google Cloud Vision API key
  - Used for OCR functionality
  - Get from: https://console.cloud.google.com/apis/credentials

- **`GEMINI_API_KEY`** (Optional)
  - Google Gemini API key
  - Alternative OCR provider
  - Get from: https://makersuite.google.com/app/apikey

- **`GOOGLE_API_KEY`** (Optional)
  - Alternative name for Gemini API key
  - Used as fallback if `GEMINI_API_KEY` is not set

### Payment Gateway - Stripe
- **`STRIPE_WEBHOOK_SECRET`** (Optional)
  - Stripe webhook secret for verifying webhook signatures
  - Only needed if using Stripe as payment provider
  - Get from: Stripe Dashboard → Developers → Webhooks

### Error Monitoring - Sentry
- **`NEXT_PUBLIC_SENTRY_DSN`** (Optional)
  - Sentry DSN for error tracking
  - Get from: https://sentry.io/settings/projects/

### Security Features
- **`ENABLE_CSRF_PROTECTION`** (Optional)
  - Enable CSRF protection
  - Set to `true` to enable (defaults to enabled in production)
  - Values: `true` or `false`

## Automatically Set by Vercel

These variables are automatically set by Vercel and don't need to be configured:

- **`NODE_ENV`** - Automatically set to `production` in production deployments
- **`NEXT_RUNTIME`** - Automatically set based on your Next.js configuration

## Quick Setup Checklist

### Minimum Required for Basic Functionality:
1. ✅ `DATABASE_URL`
2. ✅ `JWT_SECRET`
3. ✅ `OPENAI_API_KEY`
4. ✅ `ADMIN_EMAIL`
5. ✅ `NEXT_PUBLIC_APP_URL`

### For Full Payment Functionality:
6. ✅ `RAZORPAY_KEY_ID`
7. ✅ `RAZORPAY_KEY_SECRET`
8. ✅ `RAZORPAY_WEBHOOK_SECRET`
9. ✅ `RAZORPAY_PLAN_PRO_MONTHLY`
10. ✅ `RAZORPAY_PLAN_PRO_YEARLY`
11. ✅ `RAZORPAY_PLAN_ENTERPRISE_MONTHLY`
12. ✅ `RAZORPAY_PLAN_ENTERPRISE_YEARLY`

### For Email Functionality:
13. ✅ `SENDGRID_API_KEY`
14. ✅ `EMAIL_FROM` (optional)

## How to Add Environment Variables in Vercel

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add each variable with its value
4. Select the environments where it should be available:
   - **Production** - For production deployments
   - **Preview** - For preview deployments (pull requests)
   - **Development** - For local development (if using Vercel CLI)

## Important Notes

1. **Never commit secrets to Git** - All sensitive values should only be in Vercel environment variables
2. **Use different values for production and preview** - Especially for payment gateway keys
3. **Rotate secrets regularly** - Change API keys and secrets periodically for security
4. **Test in preview environment first** - Deploy to preview before production
5. **Database URL** - Ensure your database allows connections from Vercel's IP addresses
6. **HTTPS Required** - `NEXT_PUBLIC_APP_URL` must use `https://` in production

## Verification

After deployment, you can verify environment variables are set correctly by:
1. Checking the admin monitoring page (if accessible)
2. Testing key features (login, AI chat, payments)
3. Checking Vercel function logs for any missing variable errors

## Troubleshooting

If you see errors about missing environment variables:
1. Check Vercel dashboard → Settings → Environment Variables
2. Ensure variables are added to the correct environment (Production/Preview)
3. Redeploy after adding new variables
4. Check function logs in Vercel dashboard for specific error messages








# Vercel Deployment Guide

## Pre-Deployment Checklist

Before deploying, ensure you have:

1. ✅ Fixed `vercel.json` syntax errors
2. ✅ Logged in to Vercel CLI
3. ✅ Set up all required environment variables in Vercel dashboard

## Deployment Steps

### Option 1: Deploy via CLI (Recommended for first deployment)

```bash
# Deploy to production
vercel --prod

# Or deploy to preview (for testing)
vercel
```

### Option 2: Deploy via Vercel Dashboard

1. Push your code to GitHub/GitLab/Bitbucket
2. Go to https://vercel.com
3. Click "Add New Project"
4. Import your repository
5. Configure environment variables
6. Deploy

## Environment Variables Setup

Before deploying, add all environment variables in Vercel:

1. Go to your project in Vercel Dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add each variable from `VERCEL_ENV_VARIABLES.md`
4. Select environments: Production, Preview, Development

### Critical Variables (Must Have):

- `DATABASE_URL` - Your PostgreSQL connection string
- `JWT_SECRET` - Generate with: `openssl rand -base64 32`
- `OPENAI_API_KEY` - Your OpenAI API key
- `ADMIN_EMAIL` - Your admin email address
- `NEXT_PUBLIC_APP_URL` - Your production URL (e.g., `https://paataai.com`)

### Payment Variables (If using Razorpay):

- `RAZORPAY_KEY_ID`
- `RAZORPAY_KEY_SECRET`
- `RAZORPAY_WEBHOOK_SECRET`
- `RAZORPAY_PLAN_PRO_MONTHLY`
- `RAZORPAY_PLAN_PRO_YEARLY`
- `RAZORPAY_PLAN_ENTERPRISE_MONTHLY`
- `RAZORPAY_PLAN_ENTERPRISE_YEARLY`

### Email Variables (If using SendGrid):

- `SENDGRID_API_KEY`
- `EMAIL_FROM` (optional)

## Post-Deployment Steps

1. **Verify Database Connection**
   - Check that your database allows connections from Vercel's IPs
   - Run Prisma migrations: `npx prisma migrate deploy` (if using migrations)

2. **Test Key Features**
   - User registration/login
   - AI chat functionality
   - Payment flow (if applicable)
   - Email sending (if applicable)

3. **Set up Custom Domain** (Optional)
   - Go to Project Settings → Domains
   - Add your custom domain
   - Update DNS records as instructed

4. **Monitor Deployments**
   - Check Vercel dashboard for build logs
   - Monitor function logs for errors
   - Set up error tracking (Sentry, if configured)

## Troubleshooting

### Build Failures

- Check build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Verify Node.js version compatibility

### Runtime Errors

- Check function logs in Vercel dashboard
- Verify all environment variables are set
- Check database connection string format

### Database Issues

- Ensure database allows external connections
- Check firewall rules
- Verify connection string format

## Next Steps After Deployment

1. Test all features in production
2. Set up monitoring and alerts
3. Configure custom domain
4. Set up CI/CD for automatic deployments
5. Review and optimize performance


## Pre-Deployment Checklist

Before deploying, ensure you have:

1. ✅ Fixed `vercel.json` syntax errors
2. ✅ Logged in to Vercel CLI
3. ✅ Set up all required environment variables in Vercel dashboard

## Deployment Steps

### Option 1: Deploy via CLI (Recommended for first deployment)

```bash
# Deploy to production
vercel --prod

# Or deploy to preview (for testing)
vercel
```

### Option 2: Deploy via Vercel Dashboard

1. Push your code to GitHub/GitLab/Bitbucket
2. Go to https://vercel.com
3. Click "Add New Project"
4. Import your repository
5. Configure environment variables
6. Deploy

## Environment Variables Setup

Before deploying, add all environment variables in Vercel:

1. Go to your project in Vercel Dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add each variable from `VERCEL_ENV_VARIABLES.md`
4. Select environments: Production, Preview, Development

### Critical Variables (Must Have):

- `DATABASE_URL` - Your PostgreSQL connection string
- `JWT_SECRET` - Generate with: `openssl rand -base64 32`
- `OPENAI_API_KEY` - Your OpenAI API key
- `ADMIN_EMAIL` - Your admin email address
- `NEXT_PUBLIC_APP_URL` - Your production URL (e.g., `https://paataai.com`)

### Payment Variables (If using Razorpay):

- `RAZORPAY_KEY_ID`
- `RAZORPAY_KEY_SECRET`
- `RAZORPAY_WEBHOOK_SECRET`
- `RAZORPAY_PLAN_PRO_MONTHLY`
- `RAZORPAY_PLAN_PRO_YEARLY`
- `RAZORPAY_PLAN_ENTERPRISE_MONTHLY`
- `RAZORPAY_PLAN_ENTERPRISE_YEARLY`

### Email Variables (If using SendGrid):

- `SENDGRID_API_KEY`
- `EMAIL_FROM` (optional)

## Post-Deployment Steps

1. **Verify Database Connection**
   - Check that your database allows connections from Vercel's IPs
   - Run Prisma migrations: `npx prisma migrate deploy` (if using migrations)

2. **Test Key Features**
   - User registration/login
   - AI chat functionality
   - Payment flow (if applicable)
   - Email sending (if applicable)

3. **Set up Custom Domain** (Optional)
   - Go to Project Settings → Domains
   - Add your custom domain
   - Update DNS records as instructed

4. **Monitor Deployments**
   - Check Vercel dashboard for build logs
   - Monitor function logs for errors
   - Set up error tracking (Sentry, if configured)

## Troubleshooting

### Build Failures

- Check build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Verify Node.js version compatibility

### Runtime Errors

- Check function logs in Vercel dashboard
- Verify all environment variables are set
- Check database connection string format

### Database Issues

- Ensure database allows external connections
- Check firewall rules
- Verify connection string format

## Next Steps After Deployment

1. Test all features in production
2. Set up monitoring and alerts
3. Configure custom domain
4. Set up CI/CD for automatic deployments
5. Review and optimize performance


## Pre-Deployment Checklist

Before deploying, ensure you have:

1. ✅ Fixed `vercel.json` syntax errors
2. ✅ Logged in to Vercel CLI
3. ✅ Set up all required environment variables in Vercel dashboard

## Deployment Steps

### Option 1: Deploy via CLI (Recommended for first deployment)

```bash
# Deploy to production
vercel --prod

# Or deploy to preview (for testing)
vercel
```

### Option 2: Deploy via Vercel Dashboard

1. Push your code to GitHub/GitLab/Bitbucket
2. Go to https://vercel.com
3. Click "Add New Project"
4. Import your repository
5. Configure environment variables
6. Deploy

## Environment Variables Setup

Before deploying, add all environment variables in Vercel:

1. Go to your project in Vercel Dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add each variable from `VERCEL_ENV_VARIABLES.md`
4. Select environments: Production, Preview, Development

### Critical Variables (Must Have):

- `DATABASE_URL` - Your PostgreSQL connection string
- `JWT_SECRET` - Generate with: `openssl rand -base64 32`
- `OPENAI_API_KEY` - Your OpenAI API key
- `ADMIN_EMAIL` - Your admin email address
- `NEXT_PUBLIC_APP_URL` - Your production URL (e.g., `https://paataai.com`)

### Payment Variables (If using Razorpay):

- `RAZORPAY_KEY_ID`
- `RAZORPAY_KEY_SECRET`
- `RAZORPAY_WEBHOOK_SECRET`
- `RAZORPAY_PLAN_PRO_MONTHLY`
- `RAZORPAY_PLAN_PRO_YEARLY`
- `RAZORPAY_PLAN_ENTERPRISE_MONTHLY`
- `RAZORPAY_PLAN_ENTERPRISE_YEARLY`

### Email Variables (If using SendGrid):

- `SENDGRID_API_KEY`
- `EMAIL_FROM` (optional)

## Post-Deployment Steps

1. **Verify Database Connection**
   - Check that your database allows connections from Vercel's IPs
   - Run Prisma migrations: `npx prisma migrate deploy` (if using migrations)

2. **Test Key Features**
   - User registration/login
   - AI chat functionality
   - Payment flow (if applicable)
   - Email sending (if applicable)

3. **Set up Custom Domain** (Optional)
   - Go to Project Settings → Domains
   - Add your custom domain
   - Update DNS records as instructed

4. **Monitor Deployments**
   - Check Vercel dashboard for build logs
   - Monitor function logs for errors
   - Set up error tracking (Sentry, if configured)

## Troubleshooting

### Build Failures

- Check build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Verify Node.js version compatibility

### Runtime Errors

- Check function logs in Vercel dashboard
- Verify all environment variables are set
- Check database connection string format

### Database Issues

- Ensure database allows external connections
- Check firewall rules
- Verify connection string format

## Next Steps After Deployment

1. Test all features in production
2. Set up monitoring and alerts
3. Configure custom domain
4. Set up CI/CD for automatic deployments
5. Review and optimize performance








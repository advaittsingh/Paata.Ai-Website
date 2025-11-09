/**
 * Email Service Utility
 * 
 * Integrated with SendGrid for email delivery
 * Configure with SENDGRID_API_KEY in .env
 */

import sgMail from '@sendgrid/mail';

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
  from?: string;
}

// Initialize SendGrid
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

/**
 * Send email using SendGrid
 * Falls back to console logging in development if API key not configured
 */
export async function sendEmail(options: EmailOptions): Promise<boolean> {
  try {
    const fromEmail = options.from || process.env.EMAIL_FROM || 'noreply@paataai.com';
    
    // In development without API key, log email instead of sending
    if (process.env.NODE_ENV === 'development' && !process.env.SENDGRID_API_KEY) {
      console.log('📧 Email (DEV - No API Key):', {
        to: options.to,
        subject: options.subject,
        from: fromEmail,
        html: options.html,
      });
      return true;
    }

    // If no API key in production, return false
    if (!process.env.SENDGRID_API_KEY) {
      console.warn('SENDGRID_API_KEY not configured. Email not sent:', {
        to: options.to,
        subject: options.subject,
      });
      return false;
    }

    const msg = {
      to: options.to,
      from: fromEmail,
      subject: options.subject,
      text: options.text || options.html.replace(/<[^>]*>/g, ''),
      html: options.html,
    };

    await sgMail.send(msg);
    console.log('✅ Email sent successfully to:', options.to);
    return true;
  } catch (error: any) {
    console.error('❌ Error sending email:', error);
    if (error.response) {
      console.error('SendGrid error details:', error.response.body);
    }
    return false;
  }
}

/**
 * Send subscription confirmation email
 */
export async function sendSubscriptionConfirmationEmail(
  email: string,
  data: {
    plan: string;
    amount: number;
    currency: string;
    nextBillingDate: string;
  }
): Promise<boolean> {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #612A74; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background-color: #f9f9f9; }
        .button { display: inline-block; padding: 10px 20px; background-color: #612A74; color: white; text-decoration: none; border-radius: 5px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Welcome to PAATA.AI ${data.plan} Plan!</h1>
        </div>
        <div class="content">
          <p>Thank you for subscribing to the ${data.plan} plan.</p>
          <p><strong>Subscription Details:</strong></p>
          <ul>
            <li>Plan: ${data.plan}</li>
            <li>Amount: ${data.currency} ${data.amount}</li>
            <li>Next Billing Date: ${data.nextBillingDate}</li>
          </ul>
          <p>You now have access to all ${data.plan} features.</p>
          <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://paataai.com'}/app" class="button">Get Started</a>
        </div>
      </div>
    </body>
    </html>
  `;

  return await sendEmail({
    to: email,
    subject: `Welcome to PAATA.AI ${data.plan} Plan!`,
    html,
  });
}

/**
 * Send invoice email
 */
export async function sendInvoiceEmail(
  email: string,
  data: {
    invoiceId: string;
    amount: number;
    currency: string;
    plan: string;
    paidAt: string;
    pdfUrl?: string;
  }
): Promise<boolean> {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #612A74; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background-color: #f9f9f9; }
        .button { display: inline-block; padding: 10px 20px; background-color: #612A74; color: white; text-decoration: none; border-radius: 5px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Invoice from PAATA.AI</h1>
        </div>
        <div class="content">
          <p>Thank you for your payment.</p>
          <p><strong>Invoice Details:</strong></p>
          <ul>
            <li>Invoice ID: ${data.invoiceId}</li>
            <li>Plan: ${data.plan}</li>
            <li>Amount: ${data.currency} ${data.amount}</li>
            <li>Paid At: ${data.paidAt}</li>
          </ul>
          ${data.pdfUrl ? `<a href="${data.pdfUrl}" class="button">Download Invoice PDF</a>` : ''}
        </div>
      </div>
    </body>
    </html>
  `;

  return await sendEmail({
    to: email,
    subject: `Invoice #${data.invoiceId} from PAATA.AI`,
    html,
  });
}

/**
 * Send cancellation confirmation email
 */
export async function sendCancellationEmail(
  email: string,
  data: {
    plan: string;
    cancelAtPeriodEnd: boolean;
    periodEndDate?: string;
  }
): Promise<boolean> {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #612A74; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background-color: #f9f9f9; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Subscription Cancelled</h1>
        </div>
        <div class="content">
          <p>Your ${data.plan} plan subscription has been cancelled.</p>
          ${data.cancelAtPeriodEnd && data.periodEndDate
            ? `<p>Your subscription will remain active until ${data.periodEndDate}. After that, you'll be moved to the Basic plan.</p>`
            : '<p>You have been moved to the Basic plan.</p>'}
          <p>We're sorry to see you go. If you change your mind, you can reactivate your subscription anytime.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return await sendEmail({
    to: email,
    subject: 'PAATA.AI Subscription Cancelled',
    html,
  });
}

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail(
  email: string,
  resetLink: string
): Promise<boolean> {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #612A74; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background-color: #f9f9f9; }
        .button { display: inline-block; padding: 10px 20px; background-color: #612A74; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .warning { color: #666; font-size: 14px; margin-top: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Reset Your Password</h1>
        </div>
        <div class="content">
          <p>You requested to reset your password for your PAATA.AI account.</p>
          <p>Click the button below to reset your password:</p>
          <a href="${resetLink}" class="button">Reset Password</a>
          <p class="warning">This link will expire in 1 hour. If you didn't request this, please ignore this email.</p>
          <p>If the button doesn't work, copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #612A74;">${resetLink}</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return await sendEmail({
    to: email,
    subject: 'Reset Your PAATA.AI Password',
    html,
  });
}

/**
 * Send email verification email
 */
export async function sendVerificationEmail(
  email: string,
  verificationLink: string
): Promise<boolean> {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #612A74; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background-color: #f9f9f9; }
        .button { display: inline-block; padding: 10px 20px; background-color: #612A74; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .warning { color: #666; font-size: 14px; margin-top: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Verify Your Email</h1>
        </div>
        <div class="content">
          <p>Welcome to PAATA.AI! Please verify your email address to complete your registration.</p>
          <p>Click the button below to verify your email:</p>
          <a href="${verificationLink}" class="button">Verify Email</a>
          <p class="warning">This link will expire in 24 hours. If you didn't create an account, please ignore this email.</p>
          <p>If the button doesn't work, copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #612A74;">${verificationLink}</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return await sendEmail({
    to: email,
    subject: 'Verify Your PAATA.AI Email Address',
    html,
  });
}


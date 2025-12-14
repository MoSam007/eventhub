import nodemailer from 'nodemailer';

// Resolve SMTP settings from env (supports both SMTP_* and EMAIL_* names)
const SMTP_HOST = process.env.SMTP_HOST || process.env.EMAIL_HOST;
const SMTP_PORT = Number(process.env.SMTP_PORT || process.env.EMAIL_PORT || 587);
const SMTP_USER = process.env.SMTP_USER || process.env.EMAIL_USER;
const SMTP_PASS = process.env.SMTP_PASS || process.env.EMAIL_PASSWORD || process.env.EMAIL_PASS;
const EMAIL_FROM = process.env.EMAIL_FROM || (SMTP_USER ? `Events Hub <${SMTP_USER}>` : 'Events Hub <no-reply@localhost>' );
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

async function getTransporter() {
  // If SMTP credentials are provided, use them
  if (SMTP_HOST && SMTP_USER && SMTP_PASS) {
    return nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_PORT === 465, // true for 465, false for other ports
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    });
  }

  // Fallback to Ethereal in non-production for easy local testing
  if (process.env.NODE_ENV !== 'production') {
    const testAccount = await nodemailer.createTestAccount();
    return nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: { user: testAccount.user, pass: testAccount.pass },
    });
  }

  // If we reach here in production, throw a helpful error
  throw new Error('SMTP credentials are missing. Set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, and optionally EMAIL_FROM.');
}

export const sendVerificationEmail = async (
  email: string,
  fullName: string,
  token: string
) => {
  const verificationUrl = `${FRONTEND_URL}/verify-email/${token}`;

  const mailOptions = {
    from: EMAIL_FROM,
    to: email,
    subject: 'Verify Your Email - Events Hub',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #ea580c;">Welcome to Events Hub!</h2>
        <p>Hi ${fullName},</p>
        <p>Thank you for signing up. Please verify your email address by clicking the button below:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationUrl}" 
             style="background-color: #ea580c; color: white; padding: 12px 30px; 
                    text-decoration: none; border-radius: 5px; display: inline-block;">
            Verify Email
          </a>
        </div>
        <p>Or copy and paste this link in your browser:</p>
        <p style="color: #666; word-break: break-all;">${verificationUrl}</p>
        <p style="color: #666; font-size: 12px; margin-top: 30px;">
          This link will expire in 24 hours. If you didn't create an account, please ignore this email.
        </p>
      </div>
    `,
  };

  try {
    const transporter = await getTransporter();
    const info = await transporter.sendMail(mailOptions);
    console.log('Verification email sent to:', email);
    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) {
      console.log('Ethereal preview URL:', previewUrl);
    }
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw error;
  }
};

export const sendPasswordResetEmail = async (
  email: string,
  fullName: string,
  token: string
) => {
  const resetUrl = `${FRONTEND_URL}/reset-password/${token}`;

  const mailOptions = {
    from: EMAIL_FROM,
    to: email,
    subject: 'Reset Your Password - Events Hub',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #ea580c;">Password Reset Request</h2>
        <p>Hi ${fullName},</p>
        <p>We received a request to reset your password. Click the button below to create a new password:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" 
             style="background-color: #ea580c; color: white; padding: 12px 30px; 
                    text-decoration: none; border-radius: 5px; display: inline-block;">
            Reset Password
          </a>
        </div>
        <p>Or copy and paste this link in your browser:</p>
        <p style="color: #666; word-break: break-all;">${resetUrl}</p>
        <p style="color: #666; font-size: 12px; margin-top: 30px;">
          This link will expire in 1 hour. If you didn't request a password reset, please ignore this email.
        </p>
      </div>
    `,
  };

  try {
    const transporter = await getTransporter();
    const info = await transporter.sendMail(mailOptions);
    console.log('Password reset email sent to:', email);
    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) {
      console.log('Ethereal preview URL:', previewUrl);
    }
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw error;
  }
};

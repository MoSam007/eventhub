import { Request, Response, NextFunction } from 'express';
import prisma from '../config/database';
import { hashPassword, comparePassword } from '../utils/password.util';
import { generateToken, generateRefreshToken } from '../utils/jwt.utils';
import { RegisterData, LoginCredentials } from '../types';
import { sendVerificationEmail, sendPasswordResetEmail } from '../utils/email.utils';
import crypto from 'crypto';

export const register = async (
  req: Request<{}, {}, RegisterData>,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log('=== REGISTRATION REQUEST ===');
    console.log('Body:', JSON.stringify(req.body, null, 2));
    
    const { email, password, fullName, phone, role } = req.body;

    if (!email || !password || !fullName) {
      return res.status(400).json({
        status: 'error',
        message: 'Email, password, and full name are required',
      });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      console.log('User already exists:', email);
      return res.status(409).json({
        status: 'error',
        message: 'Email already registered',
      });
    }

    const passwordHash = await hashPassword(password);
    const userRole = role || 'USER';
    
    // Generate email verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    console.log('Creating user with role:', userRole);

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        fullName,
        phone: phone || null,
        role: userRole,
        emailVerified: false,
        verificationToken,
        verificationExpires,
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        emailVerified: true,
        createdAt: true,
      },
    });

    // Send verification email
    try {
      await sendVerificationEmail(user.email, user.fullName, verificationToken);
      console.log('✅ Verification email sent to:', user.email);
    } catch (emailError) {
      console.error('⚠️ Failed to send verification email:', emailError);
      // Don't fail registration if email fails
    }

    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    const refreshToken = generateRefreshToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    console.log('✅ User registered successfully:', {
      email: user.email,
      role: user.role
    });

    res.status(201).json({
      status: 'success',
      message: 'Registration successful. Please check your email to verify your account.',
      data: { 
        user, 
        token, 
        refreshToken 
      },
    });
  } catch (error) {
    console.error('❌ Registration error:', error);
    next(error);
  }
};

export const login = async (
  req: Request<{}, {}, LoginCredentials>,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log('=== LOGIN REQUEST ===');
    console.log('Email:', req.body.email);
    
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Email and password are required',
      });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      console.log('User not found:', email);
      return res.status(401).json({
        status: 'error',
        message: 'Invalid credentials',
      });
    }

    const isValidPassword = await comparePassword(password, user.passwordHash);
    if (!isValidPassword) {
      console.log('Invalid password for:', email);
      return res.status(401).json({
        status: 'error',
        message: 'Invalid credentials',
      });
    }

    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    const refreshToken = generateRefreshToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    const { passwordHash, ...userWithoutPassword } = user;

    console.log('✅ User logged in successfully:', {
      email: user.email,
      role: user.role
    });

    res.status(200).json({
      status: 'success',
      message: 'Login successful',
      data: { 
        user: userWithoutPassword, 
        token, 
        refreshToken 
      },
    });
  } catch (error) {
    console.error('❌ Login error:', error);
    next(error);
  }
};

export const getMe = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { passwordHash, ...user } = req.user!;
    res.status(200).json({
      status: 'success',
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

export const verifyEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { token } = req.params;

    const user = await prisma.user.findFirst({
      where: {
        verificationToken: token,
        verificationExpires: {
          gt: new Date(),
        },
      },
    });

    if (!user) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid or expired verification token',
      });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        verificationToken: null,
        verificationExpires: null,
      },
    });

    console.log('✅ Email verified for:', user.email);

    res.status(200).json({
      status: 'success',
      message: 'Email verified successfully',
    });
  } catch (error) {
    console.error('❌ Email verification error:', error);
    next(error);
  }
};

export const forgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    
    // Always return success to prevent email enumeration
    if (!user) {
      return res.status(200).json({
        status: 'success',
        message: 'If an account exists with this email, a password reset link has been sent.',
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetExpires,
      },
    });

    // Send password reset email
    try {
      await sendPasswordResetEmail(user.email, user.fullName, resetToken);
      console.log('✅ Password reset email sent to:', user.email);
    } catch (emailError) {
      console.error('⚠️ Failed to send password reset email:', emailError);
    }

    res.status(200).json({
      status: 'success',
      message: 'If an account exists with this email, a password reset link has been sent.',
    });
  } catch (error) {
    console.error('❌ Forgot password error:', error);
    next(error);
  }
};

export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetExpires: {
          gt: new Date(),
        },
      },
    });

    if (!user) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid or expired reset token',
      });
    }

    const passwordHash = await hashPassword(password);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash,
        resetToken: null,
        resetExpires: null,
      },
    });

    console.log('✅ Password reset successfully for:', user.email);

    res.status(200).json({
      status: 'success',
      message: 'Password reset successfully',
    });
  } catch (error) {
    console.error('❌ Reset password error:', error);
    next(error);
  }
};

// Social Authentication (Google, Facebook, Apple)
export const socialAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { provider, token: socialToken, email, fullName, providerId } = req.body;

    console.log('=== SOCIAL AUTH REQUEST ===');
    console.log('Provider:', provider);
    console.log('Email:', email);

    // Verify token with provider (implementation depends on provider)
    // This is a simplified version - you'll need to add actual OAuth verification
    
    let user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      // Create new user from social auth
      user = await prisma.user.create({
        data: {
          email,
          fullName,
          emailVerified: true, // Social accounts are pre-verified
          role: 'USER',
          passwordHash: '', // No password for social auth
        },
      });
      console.log('✅ New user created via social auth:', user.email);
    } else {
      console.log('✅ Existing user logged in via social auth:', user.email);
    }

    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    const refreshToken = generateRefreshToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    const { passwordHash, ...userWithoutPassword } = user;

    res.status(200).json({
      status: 'success',
      message: 'Social authentication successful',
      data: {
        token,
        refreshToken,
        user: userWithoutPassword,
      },
    });
  } catch (error) {
    console.error('❌ Social auth error:', error);
    next(error);
  }
};

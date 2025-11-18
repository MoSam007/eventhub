import { Request, Response, NextFunction } from 'express';
import prisma from '../config/database';
import { hashPassword, comparePassword } from '../utils/password.util';
import { generateToken, generateRefreshToken } from '../utils/jwt.utils';
import { RegisterData, LoginCredentials } from '../types';

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

    console.log('Creating user with role:', userRole);

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        fullName,
        phone: phone || null,
        role: userRole,
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        createdAt: true,
      },
    });

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
      message: 'User registered successfully',
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
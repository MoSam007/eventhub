import { Request, Response, NextFunction } from 'express';
import prisma from '../config/database';
import { hashPassword, comparePassword } from '../utils/password.util';
import { generateToken, generateRefreshToken } from '../utils/jwt.utils';
import { AppError } from '../middleware/error.middleware';
import { RegisterData, LoginCredentials } from '../types';

export const register = async (
  req: Request<{}, {}, RegisterData>,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log('Register request body:', req.body);
    
    const { email, password, fullName, phone } = req.body;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({
        status: 'error',
        message: 'Email already registered',
      });
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        fullName,
        phone: phone || null,
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        createdAt: true,
      },
    });

    // Generate tokens
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

    console.log('User registered successfully:', user.email);

    res.status(201).json({
      status: 'success',
      message: 'User registered successfully',
      data: { user, token, refreshToken },
    });
  } catch (error) {
    console.error('Registration error:', error);
    next(error);
  }
};

export const login = async (
  req: Request<{}, {}, LoginCredentials>,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log('Login request body:', req.body);
    
    const { email, password } = req.body;

    // Find user
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid credentials',
      });
    }

    // Verify password
    const isValidPassword = await comparePassword(password, user.passwordHash);
    if (!isValidPassword) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid credentials',
      });
    }

    // Generate tokens
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

    console.log('User logged in successfully:', user.email);

    res.status(200).json({
      status: 'success',
      message: 'Login successful',
      data: { user: userWithoutPassword, token, refreshToken },
    });
  } catch (error) {
    console.error('Login error:', error);
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
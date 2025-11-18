import { User } from '@prisma/client';

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

export interface ApiResponse<T = any> {
  status: 'success' | 'error';
  message: string;
  data?: T;
}

export interface TokenPayload {
  userId: string
  email: string
  role: 'USER' | 'HOST' | 'VENDOR' | 'ADMIN'
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
  role?: 'USER' | 'HOST' | 'VENDOR' 
}
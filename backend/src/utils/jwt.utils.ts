import jwt, { SignOptions } from 'jsonwebtoken';
import { env } from '../config/env';
import { TokenPayload } from '../types/types';

export const generateToken = (payload: TokenPayload): string => {
  const options: SignOptions = {
    expiresIn: '15m'
  };
  return jwt.sign(payload, env.JWT_SECRET, options);
};

export const generateRefreshToken = (payload: TokenPayload): string => {
  const options: SignOptions = {
    expiresIn: '7d'
  };
  return jwt.sign(payload, env.JWT_REFRESH_SECRET, options);
};

export const verifyToken = (token: string): TokenPayload => {
  return jwt.verify(token, env.JWT_SECRET) as TokenPayload;
};

export const verifyRefreshToken = (token: string): TokenPayload => {
  return jwt.verify(token, env.JWT_REFRESH_SECRET) as TokenPayload;
};

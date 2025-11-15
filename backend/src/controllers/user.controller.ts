import { Request, Response, NextFunction } from 'express';
import prisma from '../config/database';
import { AppError } from '../middleware/error.middleware';

export const getProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.params.id || req.user?.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        fullName: true,
        profilePicture: true,
        phone: true,
        role: true,
        location: true,
        preferences: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    res.status(200).json({
      status: 'success',
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.id;
    const { fullName, phone, profilePicture, preferences } = req.body;

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        fullName,
        phone,
        profilePicture,
        preferences,
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        profilePicture: true,
        phone: true,
        role: true,
        preferences: true,
      },
    });

    res.status(200).json({
      status: 'success',
      message: 'Profile updated successfully',
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};
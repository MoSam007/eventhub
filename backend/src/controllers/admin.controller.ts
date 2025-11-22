import { Request, Response, NextFunction } from 'express';
import prisma from '../config/database';
import { hashPassword } from '../utils/password.util';
import { AppError } from '../middleware/error.middleware';

// Get all users with filters
export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { role, search, page = '1', limit = '10' } = req.query;
    
    const skip = (Number(page) - 1) * Number(limit);
    
    const where: any = {};
    
    if (role && role !== 'all') {
      where.role = role;
    }
    
    if (search) {
      where.OR = [
        { fullName: { contains: search as string, mode: 'insensitive' } },
        { email: { contains: search as string, mode: 'insensitive' } },
      ];
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: Number(limit),
        select: {
          id: true,
          email: true,
          fullName: true,
          phone: true,
          role: true,
          emailVerified: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: {
              hostedEvents: true,
              attendedEvents: true,
            }
          }
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.user.count({ where }),
    ]);

    console.log(`Admin fetched ${users.length} users (total: ${total})`);

    res.status(200).json({
      status: 'success',
      data: {
        users,
        pagination: {
          total,
          page: Number(page),
          limit: Number(limit),
          totalPages: Math.ceil(total / Number(limit)),
        },
      },
    });
  } catch (error) {
    console.error('Get all users error:', error);
    next(error);
  }
};

// Get user by ID
export const getUserById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        fullName: true,
        phone: true,
        role: true,
        emailVerified: true,
        location: true,
        preferences: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            hostedEvents: true,
            attendedEvents: true,
            vendorServices: true,
            serviceBids: true,
          }
        }
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

// Create new user (Admin)
export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password, fullName, phone, role } = req.body;

    console.log('Admin creating user:', { email, role });

    // Check if user exists
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
        role: role || 'USER',
        emailVerified: true, // Admin-created users are auto-verified
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        phone: true,
        role: true,
        createdAt: true,
      },
    });

    console.log('✅ Admin created user:', user.email);

    res.status(201).json({
      status: 'success',
      message: 'User created successfully',
      data: { user },
    });
  } catch (error) {
    console.error('Create user error:', error);
    next(error);
  }
};

// Update user
export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { email, fullName, phone, role } = req.body;

    console.log('Admin updating user:', id, req.body);

    // Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { id } });
    if (!existingUser) {
      throw new AppError('User not found', 404);
    }

    // Check if email is taken by another user
    if (email && email !== existingUser.email) {
      const emailTaken = await prisma.user.findUnique({ where: { email } });
      if (emailTaken) {
        return res.status(409).json({
          status: 'error',
          message: 'Email already in use',
        });
      }
    }

    // Update user
    const user = await prisma.user.update({
      where: { id },
      data: {
        email,
        fullName,
        phone,
        role,
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        phone: true,
        role: true,
        updatedAt: true,
      },
    });

    console.log('✅ Admin updated user:', user.email);

    res.status(200).json({
      status: 'success',
      message: 'User updated successfully',
      data: { user },
    });
  } catch (error) {
    console.error('Update user error:', error);
    next(error);
  }
};

// Delete user
export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    console.log('Admin deleting user:', id);

    // Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { id } });
    if (!existingUser) {
      throw new AppError('User not found', 404);
    }

    // Prevent admin from deleting themselves
    if (id === req.user?.id) {
      return res.status(400).json({
        status: 'error',
        message: 'You cannot delete your own account',
      });
    }

    // Delete user (cascading will handle related records)
    await prisma.user.delete({ where: { id } });

    console.log('✅ Admin deleted user:', existingUser.email);

    res.status(200).json({
      status: 'success',
      message: 'User deleted successfully',
    });
  } catch (error) {
    console.error('Delete user error:', error);
    next(error);
  }
};

// Get user statistics
export const getUserStats = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const [
      totalUsers,
      totalHosts,
      totalVendors,
      totalEvents,
      recentUsers,
    ] = await Promise.all([
      prisma.user.count({ where: { role: 'USER' } }),
      prisma.user.count({ where: { role: 'HOST' } }),
      prisma.user.count({ where: { role: 'VENDOR' } }),
      prisma.event.count(),
      prisma.user.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          fullName: true,
          email: true,
          role: true,
          createdAt: true,
        },
      }),
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        totalUsers,
        totalHosts,
        totalVendors,
        totalEvents,
        recentUsers,
      },
    });
  } catch (error) {
    next(error);
  }
};

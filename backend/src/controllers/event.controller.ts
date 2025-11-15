import { Request, Response, NextFunction } from 'express';
import prisma from '../config/database';
import { AppError } from '../middleware/error.middleware';

export const getAllEvents = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { category, search, limit = '20', page = '1' } = req.query;
    
    const skip = (Number(page) - 1) * Number(limit);

    const where: any = {
      status: 'PUBLISHED',
    };

    if (category) {
      where.categoryId = category;
    }

    if (search) {
      where.OR = [
        { title: { contains: search as string, mode: 'insensitive' } },
        { description: { contains: search as string, mode: 'insensitive' } },
      ];
    }

    const [events, total] = await Promise.all([
      prisma.event.findMany({
        where,
        skip,
        take: Number(limit),
        include: {
          category: true,
          host: {
            select: {
              id: true,
              fullName: true,
              profilePicture: true,
            },
          },
          _count: {
            select: { attendees: true },
          },
        },
        orderBy: { startDatetime: 'asc' },
      }),
      prisma.event.count({ where }),
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        events,
        pagination: {
          total,
          page: Number(page),
          limit: Number(limit),
          totalPages: Math.ceil(total / Number(limit)),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getEventById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        category: true,
        host: {
          select: {
            id: true,
            fullName: true,
            profilePicture: true,
            email: true,
          },
        },
        attendees: {
          include: {
            user: {
              select: {
                id: true,
                fullName: true,
                profilePicture: true,
              },
            },
          },
        },
        reviews: {
          include: {
            user: {
              select: {
                id: true,
                fullName: true,
                profilePicture: true,
              },
            },
          },
        },
      },
    });

    if (!event) {
      throw new AppError('Event not found', 404);
    }

    res.status(200).json({
      status: 'success',
      data: { event },
    });
  } catch (error) {
    next(error);
  }
};

export const createEvent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.id;
    const eventData = req.body;

    const event = await prisma.event.create({
      data: {
        ...eventData,
        hostId: userId,
      },
      include: {
        category: true,
        host: {
          select: {
            id: true,
            fullName: true,
            profilePicture: true,
          },
        },
      },
    });

    res.status(201).json({
      status: 'success',
      message: 'Event created successfully',
      data: { event },
    });
  } catch (error) {
    next(error);
  }
};

export const updateEvent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const existingEvent = await prisma.event.findUnique({ where: { id } });
    
    if (!existingEvent) {
      throw new AppError('Event not found', 404);
    }

    if (existingEvent.hostId !== userId) {
      throw new AppError('Not authorized to update this event', 403);
    }

    const event = await prisma.event.update({
      where: { id },
      data: req.body,
      include: {
        category: true,
      },
    });

    res.status(200).json({
      status: 'success',
      message: 'Event updated successfully',
      data: { event },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteEvent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const event = await prisma.event.findUnique({ where: { id } });
    
    if (!event) {
      throw new AppError('Event not found', 404);
    }

    if (event.hostId !== userId) {
      throw new AppError('Not authorized to delete this event', 403);
    }

    await prisma.event.delete({ where: { id } });

    res.status(200).json({
      status: 'success',
      message: 'Event deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
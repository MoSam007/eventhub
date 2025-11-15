import { Request, Response, NextFunction } from 'express';
import prisma from '../config/database';

export const getVendorDashboard = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const vendorId = req.user!.id;

    const [events, services, bids] = await Promise.all([
      prisma.event.findMany({
        where: { hostId: vendorId },
        include: {
          _count: {
            select: { attendees: true },
          },
        },
      }),
      prisma.vendorService.findMany({
        where: { vendorId },
      }),
      prisma.serviceBid.findMany({
        where: { vendorId },
        include: {
          event: true,
        },
      }),
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        events,
        services,
        bids,
      },
    });
  } catch (error) {
    next(error);
  }
};
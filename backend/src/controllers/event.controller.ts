import { Request, Response, NextFunction } from 'express'
import prisma from '../config/database'
import { AppError } from '../middleware/error.middleware'
import { Prisma, EventStatus } from '@prisma/client'
import slugify from 'slugify'

/**
 * -----------------------------------------------------
 * GET ALL EVENTS — Supports:
 * search, category, status, price range, sorting, pagination
 * -----------------------------------------------------
 */
export const getAllEvents = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      category = '',
      search = '',
      status = '',
      tags = '',
      minPrice,
      maxPrice,
      sort = 'date_asc',
      page = '1',
      limit = '20'
    } = req.query

    const pageNum = Number(page)
    const limitNum = Number(limit)
    const skip = (pageNum - 1) * limitNum

    // ------------------------------
    // 1️⃣ Build Safe Prisma Filters
    // ------------------------------
    const where: Prisma.EventWhereInput = {}

    // Category by slug
    if (category) {
      where.category = {
        slug: String(category),
      }
    }

    // Search keywords
    if (search) {
      where.OR = [
        { title: { contains: String(search), mode: 'insensitive' } },
        { description: { contains: String(search), mode: 'insensitive' } },
      ]
    }

    // Tags
    if (tags) {
      const tagList = String(tags).split(',')
      where.eventTags = {
        some: {
          name: { in: tagList }
        }
      }
    }

    // Location
    if (req.query.location) {
      const loc = String(req.query.location)

      where.OR = [
        ...(where.OR || []),
        { location: { contains: loc, mode: 'insensitive' } },
        { address: { contains: loc, mode: 'insensitive' } },
      ]
    }

    // Status
    if (status && Object.values(EventStatus).includes(status as EventStatus)) {
      where.status = status as EventStatus
    }

    // Price
    if (minPrice || maxPrice) {
      where.price = {}
      if (minPrice) where.price.gte = Number(minPrice)
      if (maxPrice) where.price.lte = Number(maxPrice)
    }


    // ------------------------------
    // 2️⃣ Sorting
    // ------------------------------
    let orderBy: Prisma.EventOrderByWithRelationInput = {}

    switch (sort) {
      case 'date_desc':
        orderBy = { startDatetime: 'desc' }
        break
      case 'price_asc':
        orderBy = { price: 'asc' }
        break
      case 'price_desc':
        orderBy = { price: 'desc' }
        break
      default:
        orderBy = { startDatetime: 'asc' }
    }

    // ------------------------------
    // 3️⃣ Query DB
    // ------------------------------
    const [events, total] = await Promise.all([
      prisma.event.findMany({
        where,
        skip,
        take: limitNum,
        orderBy,
        include: {
          category: true,
          host: {
            select: {
              id: true,
              fullName: true,
              profilePicture: true
            }
          },
          _count: {
            select: { attendees: true }
          }
        }
      }),
      prisma.event.count({ where })
    ])

    res.status(200).json({
      status: 'success',
      data: {
        events,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(total / limitNum)
        }
      }
    })

  } catch (error) {
    next(error)
  }
}



/**
 * -----------------------------------------------------
 * GET EVENT BY ID or SLUG
 * -----------------------------------------------------
 */
const isUUID = (value: string) =>
  /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[4][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/.test(value)

export const getEventById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const event = await prisma.event.findFirst({
      where: {
        OR: [
          { id: id },
          { slug: id }
        ]
      },
      include: {
        category: true,
        host: {
          select: { id: true, fullName: true, profilePicture: true, email: true }
        },
        attendees: {
          include: {
            user: { select: { id: true, fullName: true, profilePicture: true } }
          }
        },
        reviews: {
          include: {
            user: { select: { id: true, fullName: true, profilePicture: true } }
          }
        },
        faqs: true,
        features: true,
        scheduleItems: true,
        eventTags: true
      }
    });

    if (!event) throw new AppError("Event not found", 404);

    res.status(200).json({ status: "success", data: { event } });
  } catch (err) {
    next(err);
  }
};

/**
 * -----------------------------------------------------
 * CREATE EVENT — Auto-generate slug
 * -----------------------------------------------------
 */
export const createEvent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id
    const eventData = req.body

    const baseSlug = slugify(eventData.title)
    let slug = baseSlug

    // ensure unique slug
    let exists = await prisma.event.findUnique({ where: { slug } })
    let counter = 1
    while (exists) {
      slug = `${baseSlug}-${counter++}`
      exists = await prisma.event.findUnique({ where: { slug } })
    }

    const event = await prisma.event.create({
      data: {
        ...eventData,
        slug,
        hostId: userId,
      },
      include: {
        category: true,
        host: { select: { id: true, fullName: true, profilePicture: true } },
      },
    })

    res.status(201).json({
      status: 'success',
      message: 'Event created successfully',
      data: { event },
    })
  } catch (error) {
    next(error)
  }
}


/**
 * -----------------------------------------------------
 * UPDATE EVENT — Regenerate slug if title changes
 * -----------------------------------------------------
 */
export const updateEvent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    const userId = req.user!.id

    const existingEvent = await prisma.event.findUnique({ where: { id } })
    if (!existingEvent) throw new AppError('Event not found', 404)
    if (existingEvent.hostId !== userId)
      throw new AppError('Not authorized to update this event', 403)

    let updates = req.body

    // if title changed -> regenerate slug
    if (updates.title && updates.title !== existingEvent.title) {
      const baseSlug = slugify(updates.title)
      let slug = baseSlug
      let exists = await prisma.event.findUnique({ where: { slug } })
      let counter = 1
      
      while (exists && exists.id !== id) {
        slug = `${baseSlug}-${counter++}`
        exists = await prisma.event.findUnique({ where: { slug } })
      }

      updates.slug = slug
    }

    const event = await prisma.event.update({
      where: { id },
      data: updates,
      include: { category: true },
    })

    res.status(200).json({
      status: 'success',
      message: 'Event updated successfully',
      data: { event },
    })
  } catch (error) {
    next(error)
  }
}


/**
 * -----------------------------------------------------
 * DELETE EVENT
 * -----------------------------------------------------
 */
export const deleteEvent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    const userId = req.user!.id

    const event = await prisma.event.findUnique({ where: { id } })

    if (!event) {
      throw new AppError('Event not found', 404)
    }

    if (event.hostId !== userId) {
      throw new AppError('Not authorized to delete this event', 403)
    }

    await prisma.event.delete({ where: { id } })

    res.status(200).json({
      status: 'success',
      message: 'Event deleted successfully'
    })

  } catch (error) {
    next(error)
  }
}

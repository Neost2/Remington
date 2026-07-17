import { Response, NextFunction } from 'express';
import prisma from '../config/database';
import { AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';

// Create or update driver profile
export const upsertProfile = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user?.userId) return next(new AppError('Unauthorized', 401));
    const {
      county,
      state,
      vehicleCapacity,
      isInFallbackPool,
      isAvailableNow,
      maxMilesOneWay,
      isWheelchairAccessible,
      preferredDays,
      communityNotes,
      providerType,
      acceptsCreditCard,
      acceptsMedicaid,
      acceptsGrantPay,
      perMileRateCents,
      baseFeeCents,
    } = req.body;

    const userId = req.user.userId;

    const driver = await prisma.driver.upsert({
      where: { userId },
      create: {
        userId,
        county,
        state,
        vehicleCapacity,
        isInFallbackPool,
        isAvailableNow,
        maxMilesOneWay,
        isWheelchairAccessible,
        preferredDays,
        communityNotes,
        providerType,
        acceptsCreditCard,
        acceptsMedicaid,
        acceptsGrantPay,
        perMileRateCents,
        baseFeeCents,
      },
      update: {
        county,
        state,
        vehicleCapacity,
        isInFallbackPool,
        isAvailableNow,
        maxMilesOneWay,
        isWheelchairAccessible,
        preferredDays,
        communityNotes,
        providerType,
        acceptsCreditCard,
        acceptsMedicaid,
        acceptsGrantPay,
        perMileRateCents,
        baseFeeCents,
      },
    });

    res.json(driver);
  } catch (err) {
    next(err);
  }
};

// Get logged-in driver's profile
export const getProfile = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user?.userId) return next(new AppError('Unauthorized', 401));
    const driver = await prisma.driver.findUnique({
      where: { userId: req.user.userId },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    if (!driver) return next(new AppError('Driver profile not found', 404));

    res.json(driver);
  } catch (err) {
    next(err);
  }
};

// Driver toggles availability
export const setAvailability = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { isAvailableNow } = req.body;

    if (typeof isAvailableNow !== 'boolean') {
      return next(new AppError('isAvailableNow must be true or false', 400));
    }

    if (!req.user?.userId) return next(new AppError('Unauthorized', 401));
    const existingDriver = await prisma.driver.findUnique({
      where: { userId: req.user.userId },
    });

    if (!existingDriver) {
      return next(new AppError('Driver profile not found', 404));
    }

    const driver = await prisma.driver.update({
      where: { userId: req.user.userId },
      data: { isAvailableNow },
    });

    res.json({
      message: 'Availability updated',
      isAvailableNow: driver.isAvailableNow,
      driver,
    });
  } catch (err) {
    next(err);
  }
};

// Coordinator/Admin: available drivers by county/state/accessibility
export const getAvailableDrivers = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { county, state, wheelchair } = req.query;

    const drivers = await prisma.driver.findMany({
      where: {
        isAvailableNow: true,
        ...(county ? { county: String(county) } : {}),
        ...(state ? { state: String(state) } : {}),
        ...(wheelchair === 'true' ? { isWheelchairAccessible: true } : {}),
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
      },
      orderBy: [
        { reliabilityScore: 'desc' },
        { ridesCompleted: 'desc' },
      ],
    });

    res.json(drivers);
  } catch (err) {
    next(err);
  }
};

// Coordinator/Admin: fallback pool drivers
export const getFallbackPool = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { county, state } = req.query;

    const drivers = await prisma.driver.findMany({
      where: {
        isInFallbackPool: true,
        isAvailableNow: true,
        ...(county ? { county: String(county) } : {}),
        ...(state ? { state: String(state) } : {}),
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            phone: true,
          },
        },
      },
      orderBy: { reliabilityScore: 'desc' },
    });

    res.json(drivers);
  } catch (err) {
    next(err);
  }
};

// Coordinator/Admin: list all drivers
export const listDrivers = async (
  _req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const drivers = await prisma.driver.findMany({
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(drivers);
  } catch (err) {
    next(err);
  }
};
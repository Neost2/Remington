import { Response, NextFunction } from 'express';
import prisma from '../config/database';
import { AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';
import { RideStatus } from '@prisma/client';

// Create or update coordinator profile
export const upsertProfile = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user?.userId) return next(new AppError('Unauthorized', 401));
    const { county, state, organization, stipendActive, isVerified } = req.body;
    if (!county || !state) return next(new AppError('county and state are required', 400));
    const userId = req.user.userId;

    const coordinator = await prisma.coordinator.upsert({
      where: { userId },
      create: {
        userId,
        county,
        state,
        organization,
        stipendActive,
        isVerified: isVerified ?? false,
      },
      update: {
        county,
        state,
        organization,
        stipendActive,
        isVerified,
      },
    });

    res.json(coordinator);
  } catch (err) {
    next(err);
  }
};

// Get logged-in coordinator profile
export const getProfile = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user?.userId) return next(new AppError('Unauthorized', 401));
    const coordinator = await prisma.coordinator.findUnique({
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

    if (!coordinator) return next(new AppError('Coordinator profile not found', 404));

    res.json(coordinator);
  } catch (err) {
    next(err);
  }
};

// Coordinator: list rides in coordinator county/state
export const listRidesInCounty = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user?.userId) return next(new AppError('Unauthorized', 401));
    const coordinator = await prisma.coordinator.findUnique({
      where: { userId: req.user.userId },
    });

    if (!coordinator) return next(new AppError('Coordinator profile not found', 404));

    const rides = await prisma.rideRequest.findMany({
      where: {
        patient: {
          county: coordinator.county,
          state: coordinator.state,
        },
      },
      include: {
        appointment: true,
        patient: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                phone: true,
                email: true,
              },
            },
          },
        },
        driver: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                phone: true,
                email: true,
              },
            },
          },
        },
      },
      orderBy: { pickupTime: 'asc' },
    });

    res.json(rides);
  } catch (err) {
    next(err);
  }
};

// Coordinator: dashboard stat cards
export const getDashboardStats = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user?.userId) return next(new AppError('Unauthorized', 401));
    const coordinator = await prisma.coordinator.findUnique({
      where: { userId: req.user.userId },
    });

    if (!coordinator) return next(new AppError('Coordinator profile not found', 404));

    const countyStateFilter = {
      patient: {
        county: coordinator.county,
        state: coordinator.state,
      },
    };

    const [
      pending,
      matched,
      confirmed,
      inProgress,
      completed,
      cancelled,
      fallback,
      total,
    ] = await Promise.all([
      prisma.rideRequest.count({
        where: { ...countyStateFilter, status: RideStatus.PENDING },
      }),
      prisma.rideRequest.count({
        where: { ...countyStateFilter, status: RideStatus.MATCHED },
      }),
      prisma.rideRequest.count({
        where: { ...countyStateFilter, status: RideStatus.CONFIRMED },
      }),
      prisma.rideRequest.count({
        where: { ...countyStateFilter, status: RideStatus.IN_PROGRESS },
      }),
      prisma.rideRequest.count({
        where: { ...countyStateFilter, status: RideStatus.COMPLETED },
      }),
      prisma.rideRequest.count({
        where: { ...countyStateFilter, status: RideStatus.CANCELLED },
      }),
      prisma.rideRequest.count({
        where: { ...countyStateFilter, status: RideStatus.FALLBACK_NEEDED },
      }),
      prisma.rideRequest.count({
        where: countyStateFilter,
      }),
    ]);

    res.json({
      pending,
      matched,
      confirmed,
      inProgress,
      completed,
      cancelled,
      fallback,
      total,
    });
  } catch (err) {
    next(err);
  }
};

// Admin: list all coordinators
export const listCoordinators = async (
  _req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const coordinators = await prisma.coordinator.findMany({
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

    res.json(coordinators);
  } catch (err) {
    next(err);
  }
};

// Admin: verify coordinator
export const verifyCoordinator = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { coordinatorId } = req.params;

    const coordinator = await prisma.coordinator.update({
      where: { id: coordinatorId },
      data: { isVerified: true },
    });

    res.json(coordinator);
  } catch (err) {
    next(err);
  }
};

// Coordinator: create depot route
export const createDepotRoute = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user?.userId) return next(new AppError('Unauthorized', 401));
    const coordinator = await prisma.coordinator.findUnique({
      where: { userId: req.user.userId },
    });

    if (!coordinator) return next(new AppError('Coordinator profile not found', 404));

    const {
      depotName,
      depotAddress,
      county,
      state,
      destinationCity,
      destinationState,
      departureTime,
      returnTime,
      maxPassengers,
      recurrenceNote,
    } = req.body;

    const route = await prisma.depotRoute.create({
      data: {
        coordinatorId: coordinator.id,
        depotName,
        depotAddress,
        county: county || coordinator.county,
        state: state || coordinator.state,
        destinationCity,
        destinationState,
        departureTime: new Date(departureTime),
        returnTime: returnTime ? new Date(returnTime) : null,
        maxPassengers,
        recurrenceNote,
      },
    });

    res.status(201).json(route);
  } catch (err) {
    next(err);
  }
};

// Coordinator/Admin: list depot routes
export const listDepotRoutes = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { county, state } = req.query;

    const routes = await prisma.depotRoute.findMany({
      where: {
        isActive: true,
        ...(county ? { county: String(county) } : {}),
        ...(state ? { state: String(state) } : {}),
      },
      include: {
        coordinator: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                phone: true,
              },
            },
          },
        },
        drivers: {
          include: {
            driver: {
              include: {
                user: {
                  select: {
                    firstName: true,
                    lastName: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: { departureTime: 'asc' },
    });

    res.json(routes);
  } catch (err) {
    next(err);
  }
};
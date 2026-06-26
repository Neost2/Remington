import { Response, NextFunction } from 'express';
import prisma from '../config/database';
import { AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';
import { Role, RideStatus } from '@prisma/client';
import * as fallbackService from '../services/fallback.service';

// Get fallback options for a ride that needs fallback
export const getFallbackOptions = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { rideId } = req.params;

    const ride = await prisma.rideRequest.findUnique({ where: { id: rideId } });
    if (!ride) return next(new AppError('Ride not found', 404));

    // Check authorization — coordinator, patient, or advocate can view
    if (req.user?.role === Role.COORDINATOR) {
      const coordinator = await prisma.coordinator.findUnique({ where: { userId: req.user.userId } });
      if (!coordinator || ride.coordinatorId !== coordinator.id) {
        return next(new AppError('Not authorized for this ride', 403));
      }
    } else if (req.user?.role === Role.PATIENT) {
      const patient = await prisma.patient.findUnique({ where: { userId: req.user.userId } });
      if (!patient || ride.patientId !== patient.id) {
        return next(new AppError('Not authorized for this ride', 403));
      }
    }

    const offers = await fallbackService.getFallbackOffersForRide(rideId);
    res.json(offers);
  } catch (err) {
    next(err);
  }
};

// Generate fallback offers for a ride
export const generateFallbackOffers = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { rideId } = req.params;

    const ride = await prisma.rideRequest.findUnique({ where: { id: rideId } });
    if (!ride) return next(new AppError('Ride not found', 404));

    // Mark the ride as needing fallback if not already
    if (ride.status !== RideStatus.FALLBACK_NEEDED) {
      await prisma.rideRequest.update({
        where: { id: rideId },
        data: { status: RideStatus.FALLBACK_NEEDED },
      });
    }

    const offerIds = await fallbackService.createFallbackOffers(rideId);
    const offers = await fallbackService.getFallbackOffersForRide(rideId);

    res.json({
      rideId,
      status: RideStatus.FALLBACK_NEEDED,
      offersGenerated: offerIds.length,
      offers,
    });
  } catch (err) {
    next(err);
  }
};

// Select a fallback option
export const selectFallbackOffer = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { offerId } = req.params;

    const offer = await prisma.fallbackOffer.findUnique({
      where: { id: offerId },
      include: { rideRequest: true },
    });
    if (!offer) return next(new AppError('Fallback offer not found', 404));

    const updatedRide = await fallbackService.selectFallbackOption(
      offerId,
      req.user!.userId,
      req.user!.role,
    );

    res.json({
      message: 'Fallback option selected',
      ride: updatedRide,
    });
  } catch (err) {
    next(err);
  }
};

// Patient responds to a fallback offer (accept/decline)
export const respondToFallbackOffer = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { offerId } = req.params;
    const { accepted, responseNote } = req.body;

    const offer = await prisma.fallbackOffer.findUnique({
      where: { id: offerId },
      include: { rideRequest: true },
    });
    if (!offer) return next(new AppError('Fallback offer not found', 404));

    // Verify the patient owns this ride
    const patient = await prisma.patient.findUnique({ where: { userId: req.user!.userId } });
    if (!patient || offer.rideRequest.patientId !== patient.id) {
      return next(new AppError('Not authorized to respond to this offer', 403));
    }

    await prisma.fallbackOffer.update({
      where: { id: offerId },
      data: {
        wasOfferedToPatient: true,
        wasAccepted: accepted,
        patientRespondedAt: new Date(),
        patientResponseNote: responseNote ?? null,
      },
    });

    if (accepted) {
      const updatedRide = await fallbackService.selectFallbackOption(
        offerId,
        req.user!.userId,
        req.user!.role,
      );
      res.json({ message: 'Fallback offer accepted', ride: updatedRide });
    } else {
      res.json({ message: 'Fallback offer declined' });
    }
  } catch (err) {
    next(err);
  }
};

// List all rides needing fallback (for coordinators)
export const getFallbackNeededRides = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const rides = await prisma.rideRequest.findMany({
      where: { status: RideStatus.FALLBACK_NEEDED },
      include: {
        appointment: true,
        patient: {
          include: { user: { select: { firstName: true, lastName: true, phone: true } } },
        },
        fallbackOffers: {
          where: { wasAccepted: null },
          orderBy: { autoMatchRank: 'asc' },
        },
      },
      orderBy: [{ urgencyLevel: 'desc' }, { pickupTime: 'asc' }],
    });

    res.json(rides);
  } catch (err) {
    next(err);
  }
};
// RideEvent controller: create and list events
import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';
import * as rideEventService from '../services/rideEvent.service';

export const createRideEvent = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user?.userId) return next(new AppError('Unauthorized', 401));
    const event = await rideEventService.createRideEvent(req.body);
    res.status(201).json(event);
  } catch (err) {
    next(err);
  }
};

export const getRideEventsForRide = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user?.userId) return next(new AppError('Unauthorized', 401));
    const events = await rideEventService.getRideEventsForRide(req.params.rideRequestId);
    res.json(events);
  } catch (err) {
    next(err);
  }
};

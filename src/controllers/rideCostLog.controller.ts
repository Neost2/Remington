// RideCostLog controller: create and list logs
import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';
import * as costLogService from '../services/rideCostLog.service';

export const createRideCostLog = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user?.userId) return next(new AppError('Unauthorized', 401));
    const log = await costLogService.createRideCostLog(req.body);
    res.status(201).json(log);
  } catch (err) {
    next(err);
  }
};

export const getRideCostLogsForRide = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user?.userId) return next(new AppError('Unauthorized', 401));
    const logs = await costLogService.getRideCostLogsForRide(req.params.rideRequestId);
    res.json(logs);
  } catch (err) {
    next(err);
  }
};

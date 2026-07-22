// CommunicationLog controller: create and list logs
import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';
import * as commLogService from '../services/communicationLog.service';

export const createCommunicationLog = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user?.userId) return next(new AppError('Unauthorized', 401));
    const log = await commLogService.createCommunicationLog(req.body);
    res.status(201).json(log);
  } catch (err) {
    next(err);
  }
};

export const getCommunicationLogsForUser = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user?.userId) return next(new AppError('Unauthorized', 401));
    const logs = await commLogService.getCommunicationLogsForUser(req.params.userId);
    res.json(logs);
  } catch (err) {
    next(err);
  }
};

// Portal: logs for a specific ride (all roles on that ride)
export const getLogsForRide = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user?.userId) return next(new AppError('Unauthorized', 401));
    const logs = await commLogService.getLogsForRide(req.params.rideId);
    res.json(logs);
  } catch (err) {
    next(err);
  }
};

// Portal: post a message tied to a ride
export const postPortalMessage = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user?.userId) return next(new AppError('Unauthorized', 401));
    const { rideId, message, channel = 'portal' } = req.body;
    const log = await commLogService.createCommunicationLog({
      user: { connect: { id: req.user.userId } },
      channel,
      direction: 'outbound',
      message,
      status: 'sent',
      relatedId: rideId ?? null,
    });
    res.status(201).json(log);
  } catch (err) {
    next(err);
  }
};

// Portal: recent logs (coordinator/admin)
export const getRecentPortalLogs = async (_req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const logs = await commLogService.getRecentPortalLogs(50);
    res.json(logs);
  } catch (err) {
    next(err);
  }
};

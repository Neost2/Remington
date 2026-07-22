// RideCostLog routes
import { Router } from 'express';
import { authenticate, requireRole } from '../middleware/auth';
import { Role } from '@prisma/client';
import * as costLogController from '../controllers/rideCostLog.controller';

const router = Router();

router.use(authenticate);

router.post('/', requireRole(Role.COORDINATOR, Role.ADMIN), costLogController.createRideCostLog);
router.get('/ride/:rideRequestId', requireRole(Role.COORDINATOR, Role.DRIVER, Role.ADMIN), costLogController.getRideCostLogsForRide);

export default router;

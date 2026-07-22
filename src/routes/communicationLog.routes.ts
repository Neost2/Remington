// CommunicationLog routes
import { Router } from 'express';
import { authenticate, requireRole } from '../middleware/auth';
import { Role } from '@prisma/client';
import * as commLogController from '../controllers/communicationLog.controller';

const router = Router();

// All communication log routes require authentication
router.use(authenticate);

router.post('/', requireRole(Role.COORDINATOR, Role.ADMIN), commLogController.createCommunicationLog);
router.get('/user/:userId', requireRole(Role.COORDINATOR, Role.ADMIN), commLogController.getCommunicationLogsForUser);

// Portal endpoints
router.get('/ride/:rideId', requireRole(Role.COORDINATOR, Role.DRIVER, Role.PATIENT, Role.ADMIN), commLogController.getLogsForRide);
router.post('/portal', requireRole(Role.COORDINATOR, Role.DRIVER, Role.ADMIN), commLogController.postPortalMessage);
router.get('/portal/recent', requireRole(Role.COORDINATOR, Role.ADMIN), commLogController.getRecentPortalLogs);

export default router;

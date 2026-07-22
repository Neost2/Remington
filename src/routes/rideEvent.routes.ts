// RideEvent routes
import { Router } from 'express';
import { authenticate, requireRole } from '../middleware/auth';
import { Role } from '@prisma/client';
import * as rideEventController from '../controllers/rideEvent.controller';

const router = Router();

router.use(authenticate);

router.post('/', requireRole(Role.COORDINATOR, Role.ADMIN), rideEventController.createRideEvent);
router.get('/ride/:rideRequestId', requireRole(Role.COORDINATOR, Role.DRIVER, Role.PATIENT, Role.ADMIN), rideEventController.getRideEventsForRide);

export default router;

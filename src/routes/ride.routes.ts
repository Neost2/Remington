import { Router } from 'express';
import { authenticate, requireRole } from '../middleware/auth';
import {
  createRideRequest,
  getPendingRides,
  assignDriver,
  getPoolingOptions,
  triggerFallback,
  confirmRide,
  completeRide,
  listAllRides,
  getMyRides,
  updateRideStatus,
} from '../controllers/ride.controller';
import { Role } from '@prisma/client';

const router = Router();

router.use(authenticate);

// Patient routes
router.post('/', requireRole(Role.PATIENT), createRideRequest);
router.get('/my', requireRole(Role.PATIENT), getMyRides);

// Coordinator routes
router.get('/pending', requireRole(Role.COORDINATOR), getPendingRides);
router.get('/:rideId/pooling-options', requireRole(Role.COORDINATOR), getPoolingOptions);
router.patch('/:rideId/assign', requireRole(Role.COORDINATOR), assignDriver);
router.patch('/:rideId/fallback', requireRole(Role.COORDINATOR), triggerFallback);

// Driver/Coordinator routes
router.patch('/:rideId/status', requireRole(Role.DRIVER, Role.COORDINATOR), updateRideStatus);
router.patch('/:rideId/confirm', requireRole(Role.DRIVER), confirmRide);
router.patch('/:rideId/complete', requireRole(Role.DRIVER, Role.COORDINATOR), completeRide);

// Admin route
router.get('/', requireRole(Role.ADMIN), listAllRides);

export default router;
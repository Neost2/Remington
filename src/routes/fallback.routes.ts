import { Router } from 'express';
import { authenticate, requireRole } from '../middleware/auth';
import { Role } from '@prisma/client';
import {
  getFallbackOptions,
  generateFallbackOffers,
  selectFallbackOffer,
  respondToFallbackOffer,
  getFallbackNeededRides,
} from '../controllers/fallback.controller';

const router = Router();

router.use(authenticate);

// Coordinator: list all rides that need fallback
router.get('/needed', requireRole(Role.COORDINATOR, Role.ADMIN), getFallbackNeededRides);

// Coordinator or Patient: view fallback options for a specific ride
router.get('/rides/:rideId', requireRole(Role.COORDINATOR, Role.PATIENT, Role.ADMIN), getFallbackOptions);

// Coordinator: generate fallback offers for a ride
router.post('/rides/:rideId/generate', requireRole(Role.COORDINATOR, Role.ADMIN), generateFallbackOffers);

// Coordinator: select a fallback offer on behalf of patient
router.patch('/offers/:offerId/select', requireRole(Role.COORDINATOR, Role.ADMIN), selectFallbackOffer);

// Patient: respond to a fallback offer (accept/decline)
router.patch('/offers/:offerId/respond', requireRole(Role.PATIENT), respondToFallbackOffer);

export default router;
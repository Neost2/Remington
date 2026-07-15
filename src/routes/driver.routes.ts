import { Router } from 'express';
import { authenticate, requireRole } from '../middleware/auth';
import {
  upsertProfile,
  getProfile,
  setAvailability,
  getFallbackPool,
  getAvailableDrivers,
  listDrivers,
} from '../controllers/driver.controller';
import { Role } from '@prisma/client';

const router = Router();

router.use(authenticate);

router.put('/profile', requireRole(Role.DRIVER), upsertProfile);
router.get('/profile', requireRole(Role.DRIVER), getProfile);
router.patch('/availability', requireRole(Role.DRIVER), setAvailability);

// Coordinator/Admin endpoint used by pooling hub
router.get('/available', requireRole(Role.COORDINATOR, Role.ADMIN), getAvailableDrivers);

// Existing fallback-pool endpoint
router.get('/fallback-pool', requireRole(Role.COORDINATOR, Role.ADMIN), getFallbackPool);

// Admin/Coordinator list
router.get('/', requireRole(Role.ADMIN, Role.COORDINATOR), listDrivers);

export default router;
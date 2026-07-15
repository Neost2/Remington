import { Router } from 'express';
import { authenticate, requireRole } from '../middleware/auth';
import {
  upsertProfile,
  getProfile,
  listCoordinators,
  verifyCoordinator,
  createDepotRoute,
  listDepotRoutes,
  listRidesInCounty,
  getDashboardStats,
} from '../controllers/coordinator.controller';
import { Role } from '@prisma/client';

const router = Router();

router.use(authenticate);

router.put('/profile', requireRole(Role.COORDINATOR), upsertProfile);
router.get('/profile', requireRole(Role.COORDINATOR), getProfile);

// Coordinator dashboard endpoints
router.get('/rides', requireRole(Role.COORDINATOR), listRidesInCounty);
router.get('/stats', requireRole(Role.COORDINATOR), getDashboardStats);

// Admin endpoints
router.get('/', requireRole(Role.ADMIN), listCoordinators);
router.patch('/:coordinatorId/verify', requireRole(Role.ADMIN), verifyCoordinator);

// Depot route endpoints
router.post('/depot-routes', requireRole(Role.COORDINATOR), createDepotRoute);
router.get('/depot-routes', requireRole(Role.COORDINATOR, Role.ADMIN), listDepotRoutes);

export default router;
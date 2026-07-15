import { Router } from 'express';
import { authenticate, requireRole } from '../middleware/auth';
import {
  createSurveyResponse,
  getSurveyResponses,
} from '../controllers/surveyResponse.controller';
import { Role } from '@prisma/client';

const router = Router();

router.use(authenticate);

// Patient submits post-ride survey
router.post('/', requireRole(Role.PATIENT), createSurveyResponse);

// Coordinator/Admin can view surveys
router.get('/', requireRole(Role.COORDINATOR, Role.ADMIN), getSurveyResponses);

export default router;
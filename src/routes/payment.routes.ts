import { Router } from 'express';
import { authenticate, requireRole } from '../middleware/auth';
import { Role } from '@prisma/client';
import {
  createAuthorization,
  createRidePayment,
  capturePayment,
  reallocatePayment,
  refundPayment,
  getPatientFunding,
  listAllAuthorizations,
  listAllPayments,
  getMyPayments,
} from '../controllers/payment.controller';

const router = Router();

router.use(authenticate);

// Patient: view funding sources and payment history
router.get('/my-funding', requireRole(Role.PATIENT), getPatientFunding);
router.get('/my-payments', requireRole(Role.PATIENT), getMyPayments);

// Payment authorization (admin or coordinator)
router.post('/authorizations', requireRole(Role.ADMIN, Role.COORDINATOR), createAuthorization);

// Ride payment lifecycle
router.post('/rides', requireRole(Role.PATIENT, Role.COORDINATOR, Role.ADMIN), createRidePayment);
router.patch('/:ridePaymentId/capture', requireRole(Role.COORDINATOR, Role.ADMIN), capturePayment);
router.patch('/:ridePaymentId/reallocate', requireRole(Role.COORDINATOR, Role.ADMIN), reallocatePayment);
router.patch('/:ridePaymentId/refund', requireRole(Role.ADMIN), refundPayment);

// Admin views
router.get('/authorizations', requireRole(Role.ADMIN), listAllAuthorizations);
router.get('/all-payments', requireRole(Role.ADMIN), listAllPayments);

export default router;
import { Response, NextFunction } from 'express';
import prisma from '../config/database';
import { AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';
import { FundingSource, PaymentStatus, Role } from '@prisma/client';
import * as paymentService from '../services/payment.service';

// Create a payment authorization for a patient
export const createAuthorization = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { patientId, fundingSource, maxCents, authorizationReference, notes } = req.body;

    const auth = await paymentService.createPaymentAuthorization(
      patientId,
      fundingSource as FundingSource,
      maxCents,
      authorizationReference,
      notes,
    );

    res.status(201).json(auth);
  } catch (err) {
    next(err);
  }
};

// Create a ride payment (called when ride is booked)
export const createRidePayment = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { rideRequestId, fundingSource, estimatedMiles, providerType } = req.body;

    // Verify the ride exists
    const ride = await prisma.rideRequest.findUnique({
      where: { id: rideRequestId },
      include: { driver: true },
    });
    if (!ride) return next(new AppError('Ride not found', 404));

    const payment = await paymentService.createRidePayment(
      rideRequestId,
      fundingSource as FundingSource,
      estimatedMiles,
      providerType as any,
      ride.driver?.perMileRateCents,
      ride.driver?.baseFeeCents,
    );

    // Update the ride with the payment info
    await prisma.rideRequest.update({
      where: { id: rideRequestId },
      data: {
        fundingSource: fundingSource as FundingSource,
        providerType: providerType as any,
      },
    });

    // Log payment event
    await prisma.rideEvent.create({
      data: {
        rideRequestId,
        eventType: 'PAYMENT_AUTHORIZED',
        reason: `Payment created: $${(payment.totalCents / 100).toFixed(2)} via ${fundingSource}`,
        actorRole: (req.user?.role ?? null) as Role | null,
        actorId: req.user?.userId,
      },
    });

    res.status(201).json(payment);
  } catch (err) {
    next(err);
  }
};

// Capture a payment after ride completion
export const capturePayment = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { ridePaymentId } = req.params;
    const payment = await paymentService.capturePayment(ridePaymentId, req.user?.userId);

    // Log capture event
    const ridePayment = await prisma.ridePayment.findUnique({
      where: { id: ridePaymentId },
    });
    if (ridePayment) {
      await prisma.rideEvent.create({
        data: {
          rideRequestId: ridePayment.rideRequestId,
          eventType: 'PAYMENT_CAPTURED',
          reason: `Payment captured: $${(payment.totalCents / 100).toFixed(2)}`,
          actorRole: (req.user?.role ?? null) as Role | null,
          actorId: req.user?.userId,
        },
      });
    }

    res.json(payment);
  } catch (err) {
    next(err);
  }
};

// Reallocate payment to a fallback provider
export const reallocatePayment = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { ridePaymentId } = req.params;
    const { newProviderType, newDriverId, newCostCents } = req.body;

    const payment = await paymentService.reallocatePayment(
      ridePaymentId,
      newProviderType as any,
      newDriverId,
      newCostCents,
      req.user?.userId,
    );

    res.json(payment);
  } catch (err) {
    next(err);
  }
};

// Refund a payment
export const refundPayment = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { ridePaymentId } = req.params;
    const { reason } = req.body;

    const payment = await paymentService.refundPayment(ridePaymentId, reason, req.user?.userId);

    // Log refund event
    const ridePayment = await prisma.ridePayment.findUnique({
      where: { id: ridePaymentId },
    });
    if (ridePayment) {
      await prisma.rideEvent.create({
        data: {
          rideRequestId: ridePayment.rideRequestId,
          eventType: 'PAYMENT_CAPTURED',
          reason: `Payment refunded: $${(payment.totalCents / 100).toFixed(2)} - ${reason}`,
          actorRole: (req.user?.role ?? null) as Role | null,
          actorId: req.user?.userId,
        },
      });
    }

    res.json(payment);
  } catch (err) {
    next(err);
  }
};

// Get patient's available funding sources
export const getPatientFunding = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const patient = await prisma.patient.findUnique({ where: { userId: req.user!.userId } });
    if (!patient) return next(new AppError('Patient profile not found', 404));

    const funding = await paymentService.getPatientFundingSources(patient.id);
    res.json(funding);
  } catch (err) {
    next(err);
  }
};

// Admin: get all payment authorizations
export const listAllAuthorizations = async (_req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authorizations = await prisma.paymentAuthorization.findMany({
      include: {
        patient: { include: { user: { select: { firstName: true, lastName: true, email: true } } } },
        rides: { select: { id: true, status: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(authorizations);
  } catch (err) {
    next(err);
  }
};

// Admin: get all payments
export const listAllPayments = async (_req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const payments = await prisma.ridePayment.findMany({
      include: {
        rideRequest: {
          include: {
            patient: { include: { user: { select: { firstName: true, lastName: true } } } },
            appointment: { select: { clinicName: true, appointmentDate: true } },
          },
        },
        transactions: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(payments);
  } catch (err) {
    next(err);
  }
};

// Patient: view their payment history
export const getMyPayments = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const patient = await prisma.patient.findUnique({ where: { userId: req.user!.userId } });
    if (!patient) return next(new AppError('Patient profile not found', 404));

    const payments = await prisma.ridePayment.findMany({
      where: {
        rideRequest: {
          patientId: patient.id,
        },
      },
      include: {
        rideRequest: {
          include: {
            appointment: { select: { clinicName: true, appointmentDate: true, estimatedMiles: true } },
          },
        },
        transactions: {
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(payments);
  } catch (err) {
    next(err);
  }
};
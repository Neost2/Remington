import prisma from '../config/database';
import {
  FundingSource,
  PaymentStatus,
  TransportationProviderType,
} from '@prisma/client';

export interface PaymentBreakdown {
  baseFeeCents: number;
  mileageCents: number;
  surchargeCents: number;
  totalCents: number;
}

export const calculateRideCost = (
  estimatedMiles: number,
  providerType: TransportationProviderType,
  driverPerMileRateCents?: number | null,
  driverBaseFeeCents?: number | null,
): PaymentBreakdown => {
  let baseFeeCents = 0;
  let perMileCents = 0;

  switch (providerType) {
    case TransportationProviderType.NEMT_VAN:
    case TransportationProviderType.WHEELCHAIR_VAN:
    case TransportationProviderType.AMBULETTE:
      baseFeeCents = driverBaseFeeCents ?? 500; // $5.00 base
      perMileCents = driverPerMileRateCents ?? 150; // $1.50/mile
      break;
    case TransportationProviderType.RIDESHARE:
      baseFeeCents = 250; // $2.50 base
      perMileCents = 90;  // $0.90/mile
      break;
    case TransportationProviderType.TAXI:
      baseFeeCents = 350; // $3.50 base
      perMileCents = 200; // $2.00/mile
      break;
    case TransportationProviderType.COMMUNITY_SHUTTLE:
      baseFeeCents = 200; // $2.00 base
      perMileCents = 50;  // $0.50/mile (subsidized)
      break;
    case TransportationProviderType.VOLUNTEER_DRIVER:
    default:
      baseFeeCents = driverBaseFeeCents ?? 0;
      perMileCents = driverPerMileRateCents ?? 85; // $0.85/mile (volunteer reimbursement rate)
      break;
  }

  const mileageCents = Math.round(estimatedMiles * perMileCents);
  const totalCents = baseFeeCents + mileageCents;

  return {
    baseFeeCents,
    mileageCents,
    surchargeCents: 0,
    totalCents,
  };
};

export const createPaymentAuthorization = async (
  patientId: string,
  fundingSource: FundingSource,
  maxCents: number,
  authReference?: string,
  notes?: string,
) => {
  const auth = await prisma.paymentAuthorization.create({
    data: {
      patientId,
      fundingSource,
      maxCents,
      usedCents: 0,
      status: PaymentStatus.AUTHORIZED,
      authorizationReference: authReference ?? null,
      notes: notes ?? null,
    },
  });
  return auth;
};

export const createRidePayment = async (
  rideRequestId: string,
  fundingSource: FundingSource,
  estimatedMiles: number,
  providerType: TransportationProviderType,
  driverPerMileRateCents?: number | null,
  driverBaseFeeCents?: number | null,
) => {
  const cost = calculateRideCost(estimatedMiles, providerType, driverPerMileRateCents, driverBaseFeeCents);

  const payment = await prisma.ridePayment.create({
    data: {
      rideRequestId,
      totalCents: cost.totalCents,
      baseFeeCents: cost.baseFeeCents,
      mileageCents: cost.mileageCents,
      fundingSource,
      paymentStatus: PaymentStatus.PENDING,
    },
  });

  // Create the authorization transaction
  await prisma.paymentTransaction.create({
    data: {
      ridePaymentId: payment.id,
      transactionType: 'AUTHORIZATION',
      amountCents: cost.totalCents,
      status: PaymentStatus.PENDING,
    },
  });

  return payment;
};

export const capturePayment = async (ridePaymentId: string, processedBy?: string) => {
  const payment = await prisma.ridePayment.update({
    where: { id: ridePaymentId },
    data: {
      paymentStatus: PaymentStatus.CAPTURED,
      capturedAt: new Date(),
    },
  });

  await prisma.paymentTransaction.create({
    data: {
      ridePaymentId: payment.id,
      transactionType: 'CAPTURE',
      amountCents: payment.totalCents,
      status: PaymentStatus.CAPTURED,
      processedBy: processedBy ?? null,
    },
  });

  return payment;
};

export const reallocatePayment = async (
  ridePaymentId: string,
  newProviderType: TransportationProviderType,
  newDriverId: string | null,
  newCostCents: number,
  processedBy?: string,
) => {
  const payment = await prisma.ridePayment.findUnique({
    where: { id: ridePaymentId },
    include: { rideRequest: { include: { appointment: true } } },
  });
  if (!payment) throw new Error('Payment not found');

  const oldProviderType = payment.fundingSource;

  // Update payment with new amounts
  const updated = await prisma.ridePayment.update({
    where: { id: ridePaymentId },
    data: {
      totalCents: newCostCents,
      paymentStatus: PaymentStatus.REALLOCATED,
      reallocatedAt: new Date(),
    },
  });

  // Log the reallocation transaction
  await prisma.paymentTransaction.create({
    data: {
      ridePaymentId: payment.id,
      transactionType: 'REALLOCATION',
      amountCents: newCostCents,
      status: PaymentStatus.REALLOCATED,
      processedBy: processedBy ?? null,
      notes: `Payment re-routed from ${oldProviderType} to ${newProviderType}`,
      reallocatedFromProviderType: oldProviderType as unknown as TransportationProviderType,
      reallocatedToProviderType: newProviderType,
      reallocatedToDriverId: newDriverId,
    },
  });

  return updated;
};

export const refundPayment = async (ridePaymentId: string, reason: string, processedBy?: string) => {
  const payment = await prisma.ridePayment.findUnique({
    where: { id: ridePaymentId },
  });
  if (!payment) throw new Error('Payment not found');

  const updated = await prisma.ridePayment.update({
    where: { id: ridePaymentId },
    data: {
      paymentStatus: PaymentStatus.REFUNDED,
      refundedAt: new Date(),
      notes: reason,
    },
  });

  await prisma.paymentTransaction.create({
    data: {
      ridePaymentId: payment.id,
      transactionType: 'REFUND',
      amountCents: payment.totalCents,
      status: PaymentStatus.REFUNDED,
      processedBy: processedBy ?? null,
      notes: reason,
    },
  });

  return updated;
};

export const getPatientFundingSources = async (patientId: string) => {
  const patient = await prisma.patient.findUnique({
    where: { id: patientId },
    select: {
      defaultFundingSource: true,
      primaryInsuranceProvider: true,
    },
  });

  const authorizations = await prisma.paymentAuthorization.findMany({
    where: {
      patientId,
      status: PaymentStatus.AUTHORIZED,
      OR: [
        { expiresAt: null },
        { expiresAt: { gt: new Date() } },
      ],
    },
    orderBy: { createdAt: 'desc' },
  });

  return {
    defaultFundingSource: patient?.defaultFundingSource,
    primaryInsuranceProvider: patient?.primaryInsuranceProvider,
    availableAuthorizations: authorizations,
  };
};
import prisma from '../config/database';
import { TransportationProviderType, RideStatus, PaymentStatus } from '@prisma/client';
import { calculateRideCost } from './payment.service';

export interface FallbackCandidate {
  driverId: string | null;
  providerType: TransportationProviderType;
  providerName: string;
  estimatedCostCents: number;
  estimatedArrivalMinutes: number;
  isWheelchairAccessible: boolean;
  matchScore: number;
}

export const findFallbackOptions = async (rideRequestId: string): Promise<FallbackCandidate[]> => {
  const ride = await prisma.rideRequest.findUnique({
    where: { id: rideRequestId },
    include: {
      patient: true,
      appointment: true,
      driver: true,
    },
  });
  if (!ride) throw new Error('Ride not found');

  const patient = ride.patient;
  const appointment = ride.appointment;
  const estimatedMiles = appointment.estimatedMiles || 0;
  const needsWheelchair = patient.accessibilityRequirement === 'WHEELCHAIR_ACCESSIBLE' ||
    patient.accessibilityRequirement === 'NON_TRANSFERABLE_WHEELCHAIR';
  const hoursUntilPickup = (new Date(ride.pickupTime).getTime() - Date.now()) / (1000 * 60 * 60);
  const isUrgent = hoursUntilPickup <= 24;
  const originalFundingSource = ride.fundingSource;

  const candidates: FallbackCandidate[] = [];

  // 1. Find available fallback pool drivers in the same county
  const fallbackDrivers = await prisma.driver.findMany({
    where: {
      county: patient.county,
      state: patient.state,
      isAvailableNow: true,
      isInFallbackPool: true,
      ...(needsWheelchair ? { isWheelchairAccessible: true } : {}),
      ...(originalFundingSource === 'MEDICAID_NEMT' ? { acceptsMedicaid: true } : {}),
      ...(originalFundingSource === 'CREDIT_CARD' || originalFundingSource === 'FAMILY' ? { acceptsCreditCard: true } : {}),
    },
    include: {
      user: { select: { firstName: true, lastName: true } },
    },
  });

  for (const driver of fallbackDrivers) {
    const providerType = driver.providerType;
    const cost = calculateRideCost(
      estimatedMiles,
      providerType,
      driver.perMileRateCents,
      driver.baseFeeCents,
    );
    const costDelta = ride.driver
      ? (cost.totalCents - 0) // compare to default pricing for this provider type
      : cost.totalCents;

    // Calculate a match score — higher is better
    const availabilityScore = driver.isAvailableNow ? 30 : 0;
    const rangeScore = driver.maxMilesOneWay >= estimatedMiles ? 20 : 0;
    const reliabilityScore = driver.reliabilityScore * 5;
    const costScore = costDelta <= 0 ? 15 : Math.max(0, 15 - Math.round(costDelta / 100));
    const wheelchairScore = needsWheelchair && driver.isWheelchairAccessible ? 10 : 0;

    candidates.push({
      driverId: driver.id,
      providerType: providerType,
      providerName: `${driver.user.firstName} ${driver.user.lastName} (Fallback Driver)`,
      estimatedCostCents: cost.totalCents,
      estimatedArrivalMinutes: isUrgent ? 30 : 60,
      isWheelchairAccessible: driver.isWheelchairAccessible,
      matchScore: availabilityScore + rangeScore + reliabilityScore + costScore + wheelchairScore,
    });
  }

  // 2. Add system-level fallback options based on funding source
  if (needsWheelchair) {
    candidates.push({
      driverId: null,
      providerType: TransportationProviderType.WHEELCHAIR_VAN,
      providerName: 'Wheelchair Van Service (Network)',
      estimatedCostCents: calculateRideCost(estimatedMiles, TransportationProviderType.WHEELCHAIR_VAN).totalCents,
      estimatedArrivalMinutes: 60,
      isWheelchairAccessible: true,
      matchScore: 50,
    });
  }

  if (originalFundingSource === 'MEDICAID_NEMT') {
    candidates.push({
      driverId: null,
      providerType: TransportationProviderType.NEMT_VAN,
      providerName: 'NEMT Broker (Medicaid)',
      estimatedCostCents: calculateRideCost(estimatedMiles, TransportationProviderType.NEMT_VAN).totalCents,
      estimatedArrivalMinutes: 90,
      isWheelchairAccessible: false,
      matchScore: 45,
    });
  }

  if (ride.creditId) {
    // Partner credit can be used to fund a rideshare or taxi
    candidates.push({
      driverId: null,
      providerType: TransportationProviderType.RIDESHARE,
      providerName: 'Rideshare (Partner-Funded)',
      estimatedCostCents: calculateRideCost(estimatedMiles, TransportationProviderType.RIDESHARE).totalCents,
      estimatedArrivalMinutes: isUrgent ? 15 : 30,
      isWheelchairAccessible: false,
      matchScore: 55,
    });
  }

  // 3. Always offer community volunteer driver option
  const communityDrivers = await prisma.driver.findMany({
    where: {
      county: patient.county,
      state: patient.state,
      isAvailableNow: true,
      OR: [
        { isInFallbackPool: true },
        { communityNotes: { not: null } },
      ],
      ...(needsWheelchair ? { isWheelchairAccessible: true } : {}),
    },
    include: {
      user: { select: { firstName: true, lastName: true } },
    },
    take: 3,
  });

  for (const driver of communityDrivers) {
    if (!candidates.some(c => c.driverId === driver.id)) {
      const cost = calculateRideCost(
        estimatedMiles,
        TransportationProviderType.VOLUNTEER_DRIVER,
        driver.perMileRateCents,
        driver.baseFeeCents,
      );

      candidates.push({
        driverId: driver.id,
        providerType: TransportationProviderType.VOLUNTEER_DRIVER,
        providerName: `${driver.user.firstName} ${driver.user.lastName} (Community Volunteer)`,
        estimatedCostCents: cost.totalCents,
        estimatedArrivalMinutes: 45,
        isWheelchairAccessible: driver.isWheelchairAccessible,
        matchScore: 35 + (driver.reliabilityScore * 3),
      });
    }
  }

  // Sort by match score descending
  candidates.sort((a, b) => b.matchScore - a.matchScore);

  return candidates;
};

export const createFallbackOffers = async (rideRequestId: string): Promise<string[]> => {
  const candidates = await findFallbackOptions(rideRequestId);
  const offerIds: string[] = [];

  for (let i = 0; i < candidates.length; i++) {
    const candidate = candidates[i];
    const offer = await prisma.fallbackOffer.create({
      data: {
        rideRequestId,
        driverId: candidate.driverId,
        providerType: candidate.providerType,
        providerName: candidate.providerName,
        estimatedCostCents: candidate.estimatedCostCents,
        estimatedArrivalMinutes: candidate.estimatedArrivalMinutes,
        isWheelchairAccessible: candidate.isWheelchairAccessible,
        autoMatchRank: i + 1,
        isAvailable: true,
      },
    });
    offerIds.push(offer.id);
  }

  // Log fallback event
  await prisma.rideEvent.create({
    data: {
      rideRequestId,
      eventType: 'FALLBACK_OFFERS_CREATED',
      oldStatus: RideStatus.FALLBACK_NEEDED,
      newStatus: RideStatus.FALLBACK_NEEDED,
      reason: `Generated ${candidates.length} fallback options`,
    },
  });

  return offerIds;
};

export const selectFallbackOption = async (
  offerId: string,
  selectedByUserId: string,
  actorRole: string,
) => {
  const offer = await prisma.fallbackOffer.findUnique({
    where: { id: offerId },
    include: {
      rideRequest: {
        include: {
          appointment: true,
          ridePayment: true,
        },
      },
    },
  });
  if (!offer) throw new Error('Fallback offer not found');

  // If this ride has a payment, reallocate it to the new provider
  if (offer.rideRequest.ridePayment) {
    const ridePayment = offer.rideRequest.ridePayment;
    const cost = offer.estimatedCostCents || 0;

    // Reallocate the payment to the new provider
    await prisma.ridePayment.update({
      where: { id: ridePayment.id },
      data: {
        paymentStatus: PaymentStatus.REALLOCATED,
        reallocatedAt: new Date(),
        totalCents: cost,
      },
    });

    await prisma.paymentTransaction.create({
      data: {
        ridePaymentId: ridePayment.id,
        transactionType: 'REALLOCATION',
        amountCents: cost,
        status: PaymentStatus.REALLOCATED,
        processedBy: selectedByUserId,
        notes: `Payment reallocated to fallback: ${offer.providerName} (${offer.providerType})`,
        reallocatedFromProviderType: ridePayment.fundingSource as unknown as TransportationProviderType,
        reallocatedToProviderType: offer.providerType,
        reallocatedToDriverId: offer.driverId,
      },
    });
  }

  // Mark offer as accepted
  await prisma.fallbackOffer.update({
    where: { id: offerId },
    data: {
      wasOfferedToPatient: true,
      wasAccepted: true,
      patientRespondedAt: new Date(),
    },
  });

  // Update the ride request
  const updatedRide = await prisma.rideRequest.update({
    where: { id: offer.rideRequestId },
    data: {
      driverId: offer.driverId ?? undefined,
      providerType: offer.providerType,
      isFallbackUsed: true,
      status: RideStatus.MATCHED,
    },
  });

  // Log the event
  await prisma.rideEvent.create({
    data: {
      rideRequestId: updatedRide.id,
      eventType: 'FALLBACK_OPTION_SELECTED',
      oldStatus: RideStatus.FALLBACK_NEEDED,
      newStatus: RideStatus.MATCHED,
      reason: `Fallback selected: ${offer.providerName} (${offer.providerType})`,
      actorRole: actorRole as any,
      actorId: selectedByUserId,
    },
  });

  // Mark all other fallback offers for this ride as not accepted
  await prisma.fallbackOffer.updateMany({
    where: {
      rideRequestId: offer.rideRequestId,
      id: { not: offerId },
      wasAccepted: null,
    },
    data: {
      wasAccepted: false,
    },
  });

  return updatedRide;
};

export const getFallbackOffersForRide = async (rideRequestId: string) => {
  const offers = await prisma.fallbackOffer.findMany({
    where: { rideRequestId },
    include: {
      driver: {
        include: { user: { select: { firstName: true, lastName: true, phone: true } } },
      },
    },
    orderBy: { autoMatchRank: 'asc' },
  });
  return offers;
};
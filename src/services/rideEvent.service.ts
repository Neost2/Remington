// RideEvent service: create, list, and log events
import prisma from '../config/database';
import { Prisma } from '@prisma/client';

export const createRideEvent = async (
  data: Prisma.RideEventCreateInput
) => {
  return prisma.rideEvent.create({ data });
};

export const getRideEventsForRide = async (rideRequestId: string) => {
  return prisma.rideEvent.findMany({
    where: { rideRequestId },
    orderBy: { createdAt: 'asc' },
  });
};
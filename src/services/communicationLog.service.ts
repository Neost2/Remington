// CommunicationLog service: create and list logs
import prisma from '../config/database';
import { Prisma } from '@prisma/client';

export const createCommunicationLog = async (
  data: Prisma.CommunicationLogCreateInput
) => {
  return prisma.communicationLog.create({ data });
};

export const getCommunicationLogsForUser = async (userId: string) => {
  return prisma.communicationLog.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
};
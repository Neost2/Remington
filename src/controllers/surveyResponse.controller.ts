import { Response, NextFunction } from "express";
import prisma from "../config/database";
import { AuthRequest } from "../middleware/auth";
import { AppError } from "../middleware/errorHandler";
import { Role } from "@prisma/client";

// Patient creates a post-ride survey response
export const createSurveyResponse = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const {
  rideRequestId,
  npsScore,
  score,
  comment,
  driverId,
  coordinatorId,
} = req.body;

    const finalScore = npsScore ?? score;

    if (typeof finalScore !== "number" || finalScore < 0 || finalScore > 10) {
      return next(
        new AppError("Survey score must be a number from 0 to 10", 400),
      );
    }

    const patient = await prisma.patient.findUnique({
      where: { userId: req.user!.userId },
    });

    if (!patient) return next(new AppError("Patient profile not found", 404));

    const ride = await prisma.rideRequest.findUnique({
      where: { id: rideRequestId },
    });

    if (!ride) return next(new AppError("Ride not found", 404));

    if (ride.patientId !== patient.id) {
      return next(new AppError("Not authorized to survey this ride", 403));
    }

    const response = await prisma.surveyResponse.create({
      data: {
        patientId: patient.id,
        rideRequestId,
        driverId: driverId ?? ride.driverId,
        coordinatorId: coordinatorId ?? ride.coordinatorId,
        npsScore: finalScore,
        comments: comment ?? null,
      },
    });

    res.status(201).json(response);
  } catch (err) {
    next(err);
  }
};

// Coordinator/Admin lists survey responses
export const getSurveyResponses = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { rideRequestId, patientId } = req.query;

    const where: any = {
      ...(rideRequestId ? { rideRequestId: String(rideRequestId) } : {}),
      ...(patientId ? { patientId: String(patientId) } : {}),
    };

    // Coordinator only sees surveys connected to their county/state
    if (req.user!.role === Role.COORDINATOR) {
      const coordinator = await prisma.coordinator.findUnique({
        where: { userId: req.user!.userId },
      });

      if (!coordinator)
        return next(new AppError("Coordinator profile not found", 404));

      where.rideRequest = {
        patient: {
          county: coordinator.county,
          state: coordinator.state,
        },
      };
    }

    const responses = await prisma.surveyResponse.findMany({
      where,
      include: {
        patient: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                email: true,
                phone: true,
              },
            },
          },
        },
        rideRequest: {
          include: {
            appointment: true,
          },
        },
        driver: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                phone: true,
              },
            },
          },
        },
      },
      orderBy: { submittedAt: "desc" },
    });

    res.json(responses);
  } catch (err) {
    next(err);
  }
};

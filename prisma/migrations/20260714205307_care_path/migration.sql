-- CreateEnum
CREATE TYPE "Role" AS ENUM ('PATIENT', 'DRIVER', 'COORDINATOR', 'ADMIN', 'PARTNER', 'ADVOCATE');

-- CreateEnum
CREATE TYPE "AccessibilityRequirement" AS ENUM ('STANDARD', 'WHEELCHAIR_ACCESSIBLE', 'NON_TRANSFERABLE_WHEELCHAIR', 'STRETCHER');

-- CreateEnum
CREATE TYPE "SchedulingConstraint" AS ENUM ('STANDARD', 'SAME_DAY', 'ADVANCE_48H', 'ADVANCE_72H');

-- CreateEnum
CREATE TYPE "UrgencyLevel" AS ENUM ('NORMAL', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "RideStatus" AS ENUM ('PENDING', 'MATCHED', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'FALLBACK_NEEDED');

-- CreateEnum
CREATE TYPE "AppointmentType" AS ENUM ('ONCOLOGY', 'CARDIOLOGY', 'NEUROLOGY', 'DIALYSIS', 'MENTAL_HEALTH', 'POST_SURGICAL', 'SPECIALIST', 'OTHER');

-- CreateEnum
CREATE TYPE "CreditStatus" AS ENUM ('ACTIVE', 'DEPLETED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "FundingSource" AS ENUM ('MEDICAID_NEMT', 'MEDICARE', 'PRIVATE_INSURANCE', 'CREDIT_CARD', 'GRANT', 'HSA_FSA', 'FAMILY', 'PARTNER_CREDIT', 'CHARITY', 'OTHER');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'AUTHORIZED', 'CAPTURED', 'REFUNDED', 'REALLOCATED', 'FAILED');

-- CreateEnum
CREATE TYPE "TransportationProviderType" AS ENUM ('NEMT_VAN', 'RIDESHARE', 'TAXI', 'VOLUNTEER_DRIVER', 'PUBLIC_TRANSIT', 'COMMUNITY_SHUTTLE', 'WHEELCHAIR_VAN', 'AMBULETTE');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "patients" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "county" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "zipCode" TEXT NOT NULL,
    "hasSmartphone" BOOLEAN NOT NULL DEFAULT false,
    "prefersSms" BOOLEAN NOT NULL DEFAULT true,
    "prefersVoice" BOOLEAN NOT NULL DEFAULT false,
    "primaryLanguage" TEXT NOT NULL DEFAULT 'English',
    "notes" TEXT,
    "accessibilityRequirement" "AccessibilityRequirement" NOT NULL DEFAULT 'STANDARD',
    "schedulingConstraint" "SchedulingConstraint" NOT NULL DEFAULT 'STANDARD',
    "raceEthnicity" TEXT,
    "disability" TEXT,
    "incomeBracket" TEXT,
    "barriers" TEXT,
    "defaultFundingSource" "FundingSource" DEFAULT 'MEDICAID_NEMT',
    "primaryInsuranceProvider" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "patients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "drivers" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "county" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "vehicleCapacity" INTEGER NOT NULL DEFAULT 4,
    "isInFallbackPool" BOOLEAN NOT NULL DEFAULT false,
    "isAvailableNow" BOOLEAN NOT NULL DEFAULT false,
    "maxMilesOneWay" INTEGER NOT NULL DEFAULT 50,
    "isWheelchairAccessible" BOOLEAN NOT NULL DEFAULT false,
    "preferredDays" TEXT,
    "communityNotes" TEXT,
    "ridesCompleted" INTEGER NOT NULL DEFAULT 0,
    "reliabilityScore" DOUBLE PRECISION NOT NULL DEFAULT 5.0,
    "providerType" "TransportationProviderType" NOT NULL DEFAULT 'VOLUNTEER_DRIVER',
    "acceptsCreditCard" BOOLEAN NOT NULL DEFAULT false,
    "acceptsMedicaid" BOOLEAN NOT NULL DEFAULT false,
    "acceptsGrantPay" BOOLEAN NOT NULL DEFAULT true,
    "perMileRateCents" INTEGER,
    "baseFeeCents" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "drivers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "coordinators" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "county" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "organization" TEXT,
    "stipendActive" BOOLEAN NOT NULL DEFAULT false,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "coordinators_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "institutional_partners" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "organization" TEXT NOT NULL,
    "county" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "institutional_partners_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "appointments" (
    "id" TEXT NOT NULL,
    "appointmentType" "AppointmentType" NOT NULL,
    "clinicName" TEXT NOT NULL,
    "clinicCity" TEXT NOT NULL,
    "clinicState" TEXT NOT NULL,
    "appointmentDate" TIMESTAMP(3) NOT NULL,
    "estimatedMiles" INTEGER NOT NULL,
    "isRecurring" BOOLEAN NOT NULL DEFAULT false,
    "recurrenceNote" TEXT,
    "notes" TEXT,
    "wasMissed" BOOLEAN DEFAULT false,
    "missedReason" TEXT,
    "impactNotes" TEXT,
    "rescheduledFromId" TEXT,

    CONSTRAINT "appointments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ride_events" (
    "id" TEXT NOT NULL,
    "rideRequestId" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "oldStatus" "RideStatus",
    "newStatus" "RideStatus",
    "reason" TEXT,
    "actorRole" "Role",
    "actorId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ride_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "survey_responses" (
    "id" TEXT NOT NULL,
    "rideRequestId" TEXT,
    "patientId" TEXT,
    "driverId" TEXT,
    "coordinatorId" TEXT,
    "npsScore" INTEGER,
    "satisfaction" INTEGER,
    "comments" TEXT,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "survey_responses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ride_cost_logs" (
    "id" TEXT NOT NULL,
    "rideRequestId" TEXT NOT NULL,
    "costCents" INTEGER NOT NULL,
    "fundingSource" TEXT NOT NULL,
    "estimatedSavingsCents" INTEGER,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ride_cost_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "communication_logs" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "channel" TEXT NOT NULL,
    "direction" TEXT NOT NULL,
    "message" TEXT,
    "status" TEXT,
    "relatedId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "communication_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ride_requests" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "appointmentId" TEXT NOT NULL,
    "coordinatorId" TEXT,
    "driverId" TEXT,
    "creditId" TEXT,
    "status" "RideStatus" NOT NULL DEFAULT 'PENDING',
    "urgencyLevel" "UrgencyLevel" NOT NULL DEFAULT 'NORMAL',
    "pickupAddress" TEXT NOT NULL,
    "pickupTime" TIMESTAMP(3) NOT NULL,
    "confirmedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),
    "cancellationNote" TEXT,
    "isFallbackUsed" BOOLEAN NOT NULL DEFAULT false,
    "patientNoShow" BOOLEAN NOT NULL DEFAULT false,
    "needsSameDayFallback" BOOLEAN NOT NULL DEFAULT false,
    "requestedAdvanceWindowHours" INTEGER,
    "rescheduledFromRideId" TEXT,
    "fundingSource" "FundingSource",
    "providerType" "TransportationProviderType",
    "paymentAuthorizationId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ride_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ride_payments" (
    "id" TEXT NOT NULL,
    "rideRequestId" TEXT NOT NULL,
    "totalCents" INTEGER NOT NULL,
    "baseFeeCents" INTEGER NOT NULL DEFAULT 0,
    "mileageCents" INTEGER NOT NULL DEFAULT 0,
    "surchargeCents" INTEGER NOT NULL DEFAULT 0,
    "tipCents" INTEGER NOT NULL DEFAULT 0,
    "fundingSource" "FundingSource" NOT NULL,
    "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "paidByPatient" BOOLEAN NOT NULL DEFAULT false,
    "patientPortionCents" INTEGER NOT NULL DEFAULT 0,
    "authorizedAt" TIMESTAMP(3),
    "capturedAt" TIMESTAMP(3),
    "refundedAt" TIMESTAMP(3),
    "reallocatedAt" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ride_payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment_transactions" (
    "id" TEXT NOT NULL,
    "ridePaymentId" TEXT NOT NULL,
    "transactionType" TEXT NOT NULL,
    "amountCents" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "status" "PaymentStatus" NOT NULL,
    "gatewayReference" TEXT,
    "gatewayResponse" TEXT,
    "processedBy" TEXT,
    "notes" TEXT,
    "reallocatedFromProviderType" "TransportationProviderType",
    "reallocatedToProviderType" "TransportationProviderType",
    "reallocatedToDriverId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payment_transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment_authorizations" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "fundingSource" "FundingSource" NOT NULL,
    "maxCents" INTEGER NOT NULL,
    "usedCents" INTEGER NOT NULL DEFAULT 0,
    "status" "PaymentStatus" NOT NULL DEFAULT 'AUTHORIZED',
    "authorizationReference" TEXT,
    "authorizationCode" TEXT,
    "expiresAt" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payment_authorizations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fallback_offers" (
    "id" TEXT NOT NULL,
    "rideRequestId" TEXT NOT NULL,
    "driverId" TEXT,
    "providerType" "TransportationProviderType" NOT NULL,
    "providerName" TEXT NOT NULL,
    "estimatedCostCents" INTEGER,
    "estimatedArrivalMinutes" INTEGER,
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    "isWheelchairAccessible" BOOLEAN NOT NULL DEFAULT false,
    "acceptanceRate" DOUBLE PRECISION,
    "wasOfferedToPatient" BOOLEAN NOT NULL DEFAULT false,
    "patientRespondedAt" TIMESTAMP(3),
    "wasAccepted" BOOLEAN,
    "patientResponseNote" TEXT,
    "autoMatchRank" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "fallback_offers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "advocates" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "organization" TEXT,
    "county" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "specialization" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "advocates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "advocate_ride_requests" (
    "id" TEXT NOT NULL,
    "advocateId" TEXT NOT NULL,
    "rideRequestId" TEXT NOT NULL,
    "driverId" TEXT,
    "coordinatorId" TEXT,
    "partnerId" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "advocate_ride_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "depot_routes" (
    "id" TEXT NOT NULL,
    "coordinatorId" TEXT NOT NULL,
    "depotName" TEXT NOT NULL,
    "depotAddress" TEXT NOT NULL,
    "county" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "destinationCity" TEXT NOT NULL,
    "destinationState" TEXT NOT NULL,
    "departureTime" TIMESTAMP(3) NOT NULL,
    "returnTime" TIMESTAMP(3),
    "maxPassengers" INTEGER NOT NULL DEFAULT 6,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "recurrenceNote" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "depot_routes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "depot_route_drivers" (
    "id" TEXT NOT NULL,
    "depotRouteId" TEXT NOT NULL,
    "driverId" TEXT NOT NULL,
    "confirmedAt" TIMESTAMP(3),

    CONSTRAINT "depot_route_drivers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ride_credits" (
    "id" TEXT NOT NULL,
    "partnerId" TEXT NOT NULL,
    "totalCredits" INTEGER NOT NULL,
    "usedCredits" INTEGER NOT NULL DEFAULT 0,
    "remainingCredits" INTEGER NOT NULL,
    "status" "CreditStatus" NOT NULL DEFAULT 'ACTIVE',
    "expiresAt" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ride_credits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL,
    "rideRequestId" TEXT,
    "driverId" TEXT,
    "coordinatorId" TEXT,
    "channel" TEXT NOT NULL,
    "recipient" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "sentAt" TIMESTAMP(3),
    "delivered" BOOLEAN NOT NULL DEFAULT false,
    "twilioSid" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_phone_key" ON "users"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "patients_userId_key" ON "patients"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "drivers_userId_key" ON "drivers"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "coordinators_userId_key" ON "coordinators"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "institutional_partners_userId_key" ON "institutional_partners"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ride_requests_appointmentId_key" ON "ride_requests"("appointmentId");

-- CreateIndex
CREATE UNIQUE INDEX "ride_payments_rideRequestId_key" ON "ride_payments"("rideRequestId");

-- CreateIndex
CREATE UNIQUE INDEX "advocates_userId_key" ON "advocates"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "advocate_ride_requests_advocateId_rideRequestId_key" ON "advocate_ride_requests"("advocateId", "rideRequestId");

-- CreateIndex
CREATE UNIQUE INDEX "depot_route_drivers_depotRouteId_driverId_key" ON "depot_route_drivers"("depotRouteId", "driverId");

-- AddForeignKey
ALTER TABLE "patients" ADD CONSTRAINT "patients_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "drivers" ADD CONSTRAINT "drivers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coordinators" ADD CONSTRAINT "coordinators_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "institutional_partners" ADD CONSTRAINT "institutional_partners_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_rescheduledFromId_fkey" FOREIGN KEY ("rescheduledFromId") REFERENCES "appointments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ride_events" ADD CONSTRAINT "ride_events_rideRequestId_fkey" FOREIGN KEY ("rideRequestId") REFERENCES "ride_requests"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "survey_responses" ADD CONSTRAINT "survey_responses_rideRequestId_fkey" FOREIGN KEY ("rideRequestId") REFERENCES "ride_requests"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "survey_responses" ADD CONSTRAINT "survey_responses_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patients"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "survey_responses" ADD CONSTRAINT "survey_responses_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "drivers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "survey_responses" ADD CONSTRAINT "survey_responses_coordinatorId_fkey" FOREIGN KEY ("coordinatorId") REFERENCES "coordinators"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ride_cost_logs" ADD CONSTRAINT "ride_cost_logs_rideRequestId_fkey" FOREIGN KEY ("rideRequestId") REFERENCES "ride_requests"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "communication_logs" ADD CONSTRAINT "communication_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ride_requests" ADD CONSTRAINT "ride_requests_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ride_requests" ADD CONSTRAINT "ride_requests_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "appointments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ride_requests" ADD CONSTRAINT "ride_requests_coordinatorId_fkey" FOREIGN KEY ("coordinatorId") REFERENCES "coordinators"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ride_requests" ADD CONSTRAINT "ride_requests_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "drivers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ride_requests" ADD CONSTRAINT "ride_requests_creditId_fkey" FOREIGN KEY ("creditId") REFERENCES "ride_credits"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ride_requests" ADD CONSTRAINT "ride_requests_paymentAuthorizationId_fkey" FOREIGN KEY ("paymentAuthorizationId") REFERENCES "payment_authorizations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ride_payments" ADD CONSTRAINT "ride_payments_rideRequestId_fkey" FOREIGN KEY ("rideRequestId") REFERENCES "ride_requests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_transactions" ADD CONSTRAINT "payment_transactions_ridePaymentId_fkey" FOREIGN KEY ("ridePaymentId") REFERENCES "ride_payments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_authorizations" ADD CONSTRAINT "payment_authorizations_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fallback_offers" ADD CONSTRAINT "fallback_offers_rideRequestId_fkey" FOREIGN KEY ("rideRequestId") REFERENCES "ride_requests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fallback_offers" ADD CONSTRAINT "fallback_offers_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "drivers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "advocates" ADD CONSTRAINT "advocates_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "advocate_ride_requests" ADD CONSTRAINT "advocate_ride_requests_advocateId_fkey" FOREIGN KEY ("advocateId") REFERENCES "advocates"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "advocate_ride_requests" ADD CONSTRAINT "advocate_ride_requests_rideRequestId_fkey" FOREIGN KEY ("rideRequestId") REFERENCES "ride_requests"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "advocate_ride_requests" ADD CONSTRAINT "advocate_ride_requests_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "drivers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "advocate_ride_requests" ADD CONSTRAINT "advocate_ride_requests_coordinatorId_fkey" FOREIGN KEY ("coordinatorId") REFERENCES "coordinators"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "advocate_ride_requests" ADD CONSTRAINT "advocate_ride_requests_partnerId_fkey" FOREIGN KEY ("partnerId") REFERENCES "institutional_partners"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "depot_routes" ADD CONSTRAINT "depot_routes_coordinatorId_fkey" FOREIGN KEY ("coordinatorId") REFERENCES "coordinators"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "depot_route_drivers" ADD CONSTRAINT "depot_route_drivers_depotRouteId_fkey" FOREIGN KEY ("depotRouteId") REFERENCES "depot_routes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "depot_route_drivers" ADD CONSTRAINT "depot_route_drivers_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "drivers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ride_credits" ADD CONSTRAINT "ride_credits_partnerId_fkey" FOREIGN KEY ("partnerId") REFERENCES "institutional_partners"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_rideRequestId_fkey" FOREIGN KEY ("rideRequestId") REFERENCES "ride_requests"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "drivers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_coordinatorId_fkey" FOREIGN KEY ("coordinatorId") REFERENCES "coordinators"("id") ON DELETE SET NULL ON UPDATE CASCADE;

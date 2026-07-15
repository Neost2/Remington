const {
  PrismaClient,
  Role,
  RideStatus,
  AppointmentType,
  AccessibilityRequirement,
  SchedulingConstraint,
  UrgencyLevel,
  TransportationProviderType,
} = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

const PASSWORD = 'Password123!';

async function hashPassword() {
  return bcrypt.hash(PASSWORD, 10);
}

async function createUser({ email, phone, role, firstName, lastName }) {
  const passwordHash = await hashPassword();

  return prisma.user.upsert({
    where: { email },
    update: {
      phone,
      role,
      firstName,
      lastName,
      passwordHash,
      isActive: true,
    },
    create: {
      email,
      phone,
      role,
      firstName,
      lastName,
      passwordHash,
      isActive: true,
    },
  });
}

async function cleanupDemoRides(patientIds) {
  // Find existing rides for these demo patients
  const oldRides = await prisma.rideRequest.findMany({
    where: { patientId: { in: patientIds } },
    select: { id: true },
  });

  const oldRideIds = oldRides.map((r) => r.id);
  if (oldRideIds.length === 0) return;

  // Delete child rows first to avoid FK constraint errors
  // Required based on your error: ride_events_rideRequestId_fkey
  await prisma.rideEvent.deleteMany({
    where: { rideRequestId: { in: oldRideIds } },
  });

  // If you add more FK tables later (examples), delete them here too:
  // await prisma.fallbackOffer.deleteMany({ where: { rideRequestId: { in: oldRideIds } } });
  // await prisma.surveyResponse.deleteMany({ where: { rideRequestId: { in: oldRideIds } } });

  // Now delete the rides
  await prisma.rideRequest.deleteMany({
    where: { id: { in: oldRideIds } },
  });
}

async function main() {
  console.log('Seeding CarePath demo data...');

  const coordinatorUser = await createUser({
    email: 'coordinator@carepath.test',
    phone: '5550001000',
    role: Role.COORDINATOR,
    firstName: 'Casey',
    lastName: 'Coordinator',
  });

  const patientUser1 = await createUser({
    email: 'patient1@carepath.test',
    phone: '5550002001',
    role: Role.PATIENT,
    firstName: 'Pat',
    lastName: 'Patient',
  });

  const patientUser2 = await createUser({
    email: 'patient2@carepath.test',
    phone: '5550002002',
    role: Role.PATIENT,
    firstName: 'Wendy',
    lastName: 'Wheelchair',
  });

  const driverUser1 = await createUser({
    email: 'driver1@carepath.test',
    phone: '5550003001',
    role: Role.DRIVER,
    firstName: 'Drew',
    lastName: 'Driver',
  });

  const driverUser2 = await createUser({
    email: 'driver2@carepath.test',
    phone: '5550003002',
    role: Role.DRIVER,
    firstName: 'Will',
    lastName: 'Wheelchair',
  });

  const driverUser3 = await createUser({
    email: 'driver3@carepath.test',
    phone: '5550003003',
    role: Role.DRIVER,
    firstName: 'Faith',
    lastName: 'Fallback',
  });

  const coordinator = await prisma.coordinator.upsert({
    where: { userId: coordinatorUser.id },
    update: {
      county: 'Cook',
      state: 'IL',
      organization: 'CarePath Demo Clinic',
      isVerified: true,
      stipendActive: true,
    },
    create: {
      userId: coordinatorUser.id,
      county: 'Cook',
      state: 'IL',
      organization: 'CarePath Demo Clinic',
      isVerified: true,
      stipendActive: true,
    },
  });

  const patient1 = await prisma.patient.upsert({
    where: { userId: patientUser1.id },
    update: {
      county: 'Cook',
      state: 'IL',
      zipCode: '60601',
      hasSmartphone: true,
      prefersSms: true,
      prefersVoice: false,
      primaryLanguage: 'English',
      accessibilityRequirement: AccessibilityRequirement.STANDARD,
      schedulingConstraint: SchedulingConstraint.STANDARD,
      notes: 'Demo patient for standard ride.',
    },
    create: {
      userId: patientUser1.id,
      county: 'Cook',
      state: 'IL',
      zipCode: '60601',
      hasSmartphone: true,
      prefersSms: true,
      prefersVoice: false,
      primaryLanguage: 'English',
      accessibilityRequirement: AccessibilityRequirement.STANDARD,
      schedulingConstraint: SchedulingConstraint.STANDARD,
      notes: 'Demo patient for standard ride.',
    },
  });

  const patient2 = await prisma.patient.upsert({
    where: { userId: patientUser2.id },
    update: {
      county: 'Cook',
      state: 'IL',
      zipCode: '60602',
      hasSmartphone: false,
      prefersSms: true,
      prefersVoice: true,
      primaryLanguage: 'English',
      accessibilityRequirement: AccessibilityRequirement.WHEELCHAIR_ACCESSIBLE,
      schedulingConstraint: SchedulingConstraint.ADVANCE_48H,
      notes: 'Demo patient who needs wheelchair-accessible transportation.',
    },
    create: {
      userId: patientUser2.id,
      county: 'Cook',
      state: 'IL',
      zipCode: '60602',
      hasSmartphone: false,
      prefersSms: true,
      prefersVoice: true,
      primaryLanguage: 'English',
      accessibilityRequirement: AccessibilityRequirement.WHEELCHAIR_ACCESSIBLE,
      schedulingConstraint: SchedulingConstraint.ADVANCE_48H,
      notes: 'Demo patient who needs wheelchair-accessible transportation.',
    },
  });

  const driver1 = await prisma.driver.upsert({
    where: { userId: driverUser1.id },
    update: {
      county: 'Cook',
      state: 'IL',
      vehicleCapacity: 4,
      isAvailableNow: true,
      isInFallbackPool: false,
      maxMilesOneWay: 60,
      isWheelchairAccessible: false,
      reliabilityScore: 4.8,
      ridesCompleted: 22,
      providerType: TransportationProviderType.VOLUNTEER_DRIVER,
    },
    create: {
      userId: driverUser1.id,
      county: 'Cook',
      state: 'IL',
      vehicleCapacity: 4,
      isAvailableNow: true,
      isInFallbackPool: false,
      maxMilesOneWay: 60,
      isWheelchairAccessible: false,
      reliabilityScore: 4.8,
      ridesCompleted: 22,
      providerType: TransportationProviderType.VOLUNTEER_DRIVER,
    },
  });

  const driver2 = await prisma.driver.upsert({
    where: { userId: driverUser2.id },
    update: {
      county: 'Cook',
      state: 'IL',
      vehicleCapacity: 3,
      isAvailableNow: true,
      isInFallbackPool: false,
      maxMilesOneWay: 80,
      isWheelchairAccessible: true,
      reliabilityScore: 4.9,
      ridesCompleted: 34,
      providerType: TransportationProviderType.WHEELCHAIR_VAN,
    },
    create: {
      userId: driverUser2.id,
      county: 'Cook',
      state: 'IL',
      vehicleCapacity: 3,
      isAvailableNow: true,
      isInFallbackPool: false,
      maxMilesOneWay: 80,
      isWheelchairAccessible: true,
      reliabilityScore: 4.9,
      ridesCompleted: 34,
      providerType: TransportationProviderType.WHEELCHAIR_VAN,
    },
  });

  const driver3 = await prisma.driver.upsert({
    where: { userId: driverUser3.id },
    update: {
      county: 'Cook',
      state: 'IL',
      vehicleCapacity: 4,
      isAvailableNow: true,
      isInFallbackPool: true,
      maxMilesOneWay: 45,
      isWheelchairAccessible: false,
      reliabilityScore: 4.5,
      ridesCompleted: 12,
      communityNotes: 'Fallback volunteer driver for urgent cases.',
      providerType: TransportationProviderType.VOLUNTEER_DRIVER,
    },
    create: {
      userId: driverUser3.id,
      county: 'Cook',
      state: 'IL',
      vehicleCapacity: 4,
      isAvailableNow: true,
      isInFallbackPool: true,
      maxMilesOneWay: 45,
      isWheelchairAccessible: false,
      reliabilityScore: 4.5,
      ridesCompleted: 12,
      communityNotes: 'Fallback volunteer driver for urgent cases.',
      providerType: TransportationProviderType.VOLUNTEER_DRIVER,
    },
  });

  // --- FIX: clean up rides safely (events -> rides) ---
  await cleanupDemoRides([patient1.id, patient2.id]);

  const appointment1 = await prisma.appointment.create({
    data: {
      appointmentType: AppointmentType.CARDIOLOGY,
      clinicName: 'Cook County Heart Clinic',
      clinicCity: 'Chicago',
      clinicState: 'IL',
      appointmentDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2),
      estimatedMiles: 22,
      isRecurring: false,
      notes: 'Standard demo ride.',
    },
  });

  const ride1 = await prisma.rideRequest.create({
    data: {
      patientId: patient1.id,
      appointmentId: appointment1.id,
      coordinatorId: coordinator.id,
      pickupAddress: '100 Demo Patient St, Chicago, IL',
      pickupTime: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2),
      status: RideStatus.PENDING,
      urgencyLevel: UrgencyLevel.NORMAL,
      needsSameDayFallback: false,
    },
  });

  const appointment2 = await prisma.appointment.create({
    data: {
      appointmentType: AppointmentType.DIALYSIS,
      clinicName: 'Northside Dialysis Center',
      clinicCity: 'Chicago',
      clinicState: 'IL',
      appointmentDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3),
      estimatedMiles: 31,
      isRecurring: true,
      recurrenceNote: 'Three times per week.',
      notes: 'Wheelchair-accessible demo ride.',
    },
  });

  const ride2 = await prisma.rideRequest.create({
    data: {
      patientId: patient2.id,
      appointmentId: appointment2.id,
      coordinatorId: coordinator.id,
      driverId: driver2.id,
      pickupAddress: '200 Wheelchair Ave, Chicago, IL',
      pickupTime: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3),
      status: RideStatus.MATCHED,
      urgencyLevel: UrgencyLevel.HIGH,
      needsSameDayFallback: false,
    },
  });

  const appointment3 = await prisma.appointment.create({
    data: {
      appointmentType: AppointmentType.ONCOLOGY,
      clinicName: 'Regional Oncology Center',
      clinicCity: 'Chicago',
      clinicState: 'IL',
      appointmentDate: new Date(Date.now() + 1000 * 60 * 60 * 12),
      estimatedMiles: 40,
      isRecurring: false,
      notes: 'Fallback escalation demo ride.',
    },
  });

  const ride3 = await prisma.rideRequest.create({
    data: {
      patientId: patient1.id,
      appointmentId: appointment3.id,
      coordinatorId: coordinator.id,
      pickupAddress: '300 Urgent Care Path, Chicago, IL',
      pickupTime: new Date(Date.now() + 1000 * 60 * 60 * 12),
      status: RideStatus.FALLBACK_NEEDED,
      urgencyLevel: UrgencyLevel.CRITICAL,
      needsSameDayFallback: true,
    },
  });

  await prisma.rideEvent.createMany({
    data: [
      {
        rideRequestId: ride1.id,
        eventType: 'DEMO_SEEDED',
        newStatus: RideStatus.PENDING,
        reason: 'Demo standard pending ride created.',
        actorRole: Role.ADMIN,
        actorId: coordinatorUser.id,
      },
      {
        rideRequestId: ride2.id,
        eventType: 'DEMO_SEEDED',
        newStatus: RideStatus.MATCHED,
        reason: 'Demo wheelchair matched ride created.',
        actorRole: Role.ADMIN,
        actorId: coordinatorUser.id,
      },
      {
        rideRequestId: ride3.id,
        eventType: 'DEMO_SEEDED',
        newStatus: RideStatus.FALLBACK_NEEDED,
        reason: 'Demo fallback-needed ride created.',
        actorRole: Role.ADMIN,
        actorId: coordinatorUser.id,
      },
    ],
  });

  console.log('');
  console.log('CarePath demo seed complete.');
  console.log('');
  console.log('Demo login accounts:');
  console.log(`Coordinator: coordinator@carepath.test / ${PASSWORD}`);
  console.log(`Patient 1:   patient1@carepath.test / ${PASSWORD}`);
  console.log(`Patient 2:   patient2@carepath.test / ${PASSWORD}`);
  console.log(`Driver 1:    driver1@carepath.test / ${PASSWORD}`);
  console.log(`Driver 2:    driver2@carepath.test / ${PASSWORD}`);
  console.log(`Driver 3:    driver3@carepath.test / ${PASSWORD}`);
  console.log('');
  console.log('Created ride IDs:');
  console.log(`Standard pending ride: ${ride1.id}`);
  console.log(`Wheelchair matched ride: ${ride2.id}`);
  console.log(`Fallback-needed ride: ${ride3.id}`);
}

main()
  .catch((error) => {
    console.error('Seed failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { errorHandler, notFound } from './middleware/errorHandler';
import { sanitizeBody } from './middleware/validate';
import { config } from './config/env';

import zipLookupRoutes from './routes/zipLookup.routes';
import authRoutes from './routes/auth.routes';
import patientRoutes from './routes/patient.routes';
import driverRoutes from './routes/driver.routes';
import coordinatorRoutes from './routes/coordinator.routes';
import rideRoutes from './routes/ride.routes';
import creditRoutes from './routes/credit.routes';
import rideEventRoutes from './routes/rideEvent.routes';
import surveyResponseRoutes from './routes/surveyResponse.routes';
import rideCostLogRoutes from './routes/rideCostLog.routes';
import communicationLogRoutes from './routes/communicationLog.routes';
import paymentRoutes from './routes/payment.routes';
import fallbackRoutes from './routes/fallback.routes';

const app = express();

// Security headers
app.use(helmet());

// CORS — restrict to known origins in production
const allowedOrigins = config.isDev
  ? ['http://localhost:3000', 'http://localhost:3001']
  : (process.env.ALLOWED_ORIGINS ?? '').split(',').map(o => o.trim()).filter(Boolean);

app.use(cors({
  origin: (origin, cb) => {
    // Allow requests with no origin (mobile apps, curl, server-to-server)
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
    cb(null, false); // Block the origin without throwing
  },
  credentials: true,
}));

// Rate limiting — 200 requests per 15 min per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' },
});
app.use('/api/', limiter);

// Stricter limit on auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { error: 'Too many login attempts, please try again later.' },
});
app.use('/api/auth/', authLimiter);

// Body parsing with size limit
app.use(express.json({ limit: '50kb' }));
app.use(express.urlencoded({ extended: true, limit: '50kb' }));

// Global sanitization
app.use(sanitizeBody);

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'CarePath API', timestamp: new Date().toISOString() });
});

// Routes

app.use('/api/zip-lookup', zipLookupRoutes);

app.use('/api/auth', authRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/drivers', driverRoutes);
app.use('/api/coordinators', coordinatorRoutes);
app.use('/api/rides', rideRoutes);
app.use('/api/credits', creditRoutes);
app.use('/api/ride-events', rideEventRoutes);
app.use('/api/survey-responses', surveyResponseRoutes);
app.use('/api/survey', surveyResponseRoutes);
app.use('/api/ride-cost-logs', rideCostLogRoutes);
app.use('/api/communication-logs', communicationLogRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/fallback', fallbackRoutes);

// 404 & error handling
app.use(notFound);
app.use(errorHandler);

export default app;

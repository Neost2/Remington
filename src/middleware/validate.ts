import { Request, Response, NextFunction } from 'express';
import { AppError } from './errorHandler';

// Validate required string fields on req.body
export const requireFields = (...fields: string[]) =>
  (req: Request, _res: Response, next: NextFunction): void => {
    const missing = fields.filter(f => {
      const val = req.body[f];
      return val === undefined || val === null || val === '';
    });
    if (missing.length > 0) {
      return next(new AppError(`Missing required fields: ${missing.join(', ')}`, 400));
    }
    next();
  };

// Sanitize string fields — trim whitespace, prevent prototype pollution
export const sanitizeBody = (req: Request, _res: Response, next: NextFunction): void => {
  if (req.body && typeof req.body === 'object') {
    const dangerous = ['__proto__', 'constructor', 'prototype'];
    for (const key of dangerous) {
      // Use hasOwnProperty, not the `in` operator — every plain object
      // inherits `constructor` (and other keys) from Object.prototype, so
      // `in` would incorrectly flag every request (even ones with an empty
      // body) as a prototype-pollution attempt.
      if (Object.prototype.hasOwnProperty.call(req.body, key)) {
        return next(new AppError('Invalid request body', 400));
      }
    }
    // Trim all string values
    for (const key of Object.keys(req.body)) {
      if (typeof req.body[key] === 'string') {
        req.body[key] = req.body[key].trim();
      }
    }
  }
  next();
};

// Validate email format
export const validateEmail = (field = 'email') =>
  (req: Request, _res: Response, next: NextFunction): void => {
    const val = req.body[field];
    if (val && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
      return next(new AppError(`Invalid email address`, 400));
    }
    next();
  };

// Validate password strength
export const validatePassword = (field = 'password') =>
  (req: Request, _res: Response, next: NextFunction): void => {
    const val = req.body[field];
    if (val && val.length < 8) {
      return next(new AppError('Password must be at least 8 characters', 400));
    }
    next();
  };

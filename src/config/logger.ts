import winston from 'winston';
import { config } from './env';

// AWS Lambda's filesystem is read-only outside of /tmp, and CloudWatch
// already captures console output, so file transports are only useful
// (and only writable) when running as a traditional long-lived process.
const isLambda = !!process.env.AWS_LAMBDA_FUNCTION_NAME;

const transports: winston.transport[] = [new winston.transports.Console()];
if (!isLambda) {
  transports.push(
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  );
}

export const logger = winston.createLogger({
  level: config.isDev ? 'debug' : 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    config.isDev
      ? winston.format.combine(winston.format.colorize(), winston.format.simple())
      : winston.format.json()
  ),
  transports,
});

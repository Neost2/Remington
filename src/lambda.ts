import serverlessHttp from 'serverless-http';
import type { Handler } from 'aws-lambda';
import app from './app';

const serverlessHandler = serverlessHttp(app);

export const handler: Handler = async (event, context) => {
  // Reuse warm connections across invocations
  context.callbackWaitsForEmptyEventLoop = false;
  return serverlessHandler(event, context);
};

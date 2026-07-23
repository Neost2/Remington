import * as pulumi from '@pulumi/pulumi';
import * as aws from '@pulumi/aws';
import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';

const prefix = 'carepath';
const region = aws.config.region ?? 'us-east-1';

// Content hash of the built Lambda bundle, used as the S3 object key so a
// new build (different code) uploads to a new key, which is what actually
// causes the Lambda function resource to pick up the new code on `pulumi up`.
function hashDir(dir: string, hash: crypto.Hash) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) hashDir(full, hash);
    else hash.update(fs.readFileSync(full));
  }
}
const distLambdaDir = path.resolve(__dirname, '..', 'dist-lambda');
const bundleHash = (() => {
  const hash = crypto.createHash('sha256');
  hashDir(distLambdaDir, hash);
  return hash.digest('hex').slice(0, 16);
})();

const ssmParam = (name: string, withDecryption = true) =>
  aws.ssm.getParameterOutput({ name: `/carepath/prod/${name}`, withDecryption }).apply(p => p.value);

const databaseUrl = ssmParam('DATABASE_URL');
const jwtSecret = ssmParam('JWT_SECRET');
const jwtExpiresIn = ssmParam('JWT_EXPIRES_IN', false);
const allowedOrigins = ssmParam('ALLOWED_ORIGINS', false);

// --- IAM role for the API Lambda ---
const lambdaRole = new aws.iam.Role(`${prefix}-lambda-role`, {
  assumeRolePolicy: JSON.stringify({
    Version: '2012-10-17',
    Statement: [
      {
        Action: 'sts:AssumeRole',
        Effect: 'Allow',
        Principal: { Service: 'lambda.amazonaws.com' },
      },
    ],
  }),
});

new aws.iam.RolePolicyAttachment(`${prefix}-lambda-basic-exec`, {
  role: lambdaRole.name,
  policyArn: aws.iam.ManagedPolicy.AWSLambdaBasicExecutionRole,
});

// --- Upload the Lambda deployment package to S3 first ---
// (Uploading directly as the Lambda "code" payload signs the whole multi-MB
// request once; on a slow uplink that single signature can expire (SigV4
// signatures are valid for 5 minutes) before the upload finishes. S3 uploads
// use chunked/streaming signing, which doesn't have that limitation.)
const artifactsBucket = new aws.s3.BucketV2(`${prefix}-lambda-artifacts`, {
  forceDestroy: true,
});

const lambdaArchive = new aws.s3.BucketObjectv2(`${prefix}-lambda-code`, {
  bucket: artifactsBucket.id,
  key: `lambda-${bundleHash}.zip`,
  source: new pulumi.asset.FileArchive('../dist-lambda'),
});

// --- Lambda function running the Express API via serverless-http ---
const apiLambda = new aws.lambda.Function(`${prefix}-api`, {
  s3Bucket: artifactsBucket.id,
  s3Key: lambdaArchive.key,
  handler: 'index.handler',
  runtime: aws.lambda.Runtime.NodeJS20dX,
  role: lambdaRole.arn,
  timeout: 30,
  memorySize: 512,
  environment: {
    variables: {
      NODE_ENV: 'production',
      DATABASE_URL: databaseUrl,
      JWT_SECRET: jwtSecret,
      JWT_EXPIRES_IN: jwtExpiresIn,
      ALLOWED_ORIGINS: allowedOrigins,
    },
  },
});

// --- HTTP API Gateway in front of the Lambda ---
const httpApi = new aws.apigatewayv2.Api(`${prefix}-http-api`, {
  protocolType: 'HTTP',
});

const integration = new aws.apigatewayv2.Integration(`${prefix}-integration`, {
  apiId: httpApi.id,
  integrationType: 'AWS_PROXY',
  integrationUri: apiLambda.arn,
  payloadFormatVersion: '2.0',
});

new aws.apigatewayv2.Route(`${prefix}-default-route`, {
  apiId: httpApi.id,
  routeKey: '$default',
  target: pulumi.interpolate`integrations/${integration.id}`,
});

const stage = new aws.apigatewayv2.Stage(`${prefix}-stage`, {
  apiId: httpApi.id,
  name: '$default',
  autoDeploy: true,
});

new aws.lambda.Permission(`${prefix}-apigw-permission`, {
  action: 'lambda:InvokeFunction',
  function: apiLambda.name,
  principal: 'apigateway.amazonaws.com',
  sourceArn: pulumi.interpolate`${httpApi.executionArn}/*/*`,
});

export const apiUrl = httpApi.apiEndpoint;
export const lambdaName = apiLambda.name;
export const deployedRegion = region;

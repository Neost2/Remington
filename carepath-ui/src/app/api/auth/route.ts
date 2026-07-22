import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const body = await request.json()

  const email = body.email
  const password = body.password

  if (!email || !password) {
    return NextResponse.json(
      {
        success: false,
        message: 'Email and password are required.',
      },
      {
        status: 400,
      },
    )
  }

  /*
    FUTURE AWS CONNECTION:

    const AWS = require('aws-sdk');
    const cognito = new AWS.CognitoIdentityServiceProvider({
      region: 'your-region',
    });
  */

  return NextResponse.json({
    success: true,
    message: 'Temporary development login successful.',
    token: 'temporary-development-token',
    user: {
      id: 'temporary-user-1',
      email,
      role: 'patient',
    },
  })
}
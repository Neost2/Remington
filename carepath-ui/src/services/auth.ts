export type LoginCredentials = {
  email: string
  password: string
}

export type LoginResponse = {
  success: boolean
  message?: string
  token?: string
  user?: {
    id: string
    email: string
    role?: string
  }
}

export async function loginUser(
  credentials: LoginCredentials,
): Promise<LoginResponse> {
  const response = await fetch('/api/auth/login', {
    method: 'POST',

    headers: {
      'Content-Type': 'application/json',
    },

    body: JSON.stringify(credentials),
  })

  const data = await response.json() as LoginResponse

  if (!response.ok) {
    throw new Error(data.message || 'Unable to log in')
  }

  return data
}
export type RegistrationData = {
  firstName: string
  lastName: string
  phone: string
  email: string
  password: string
}

export type RegistrationResponse = {
  success: boolean
  message?: string
  token?: string
  user?: {
    id: string
    email: string
    role?: string
  }
}

export async function registerUser(
  registrationData: RegistrationData,
): Promise<RegistrationResponse> {
  const response = await fetch('/api/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(registrationData),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || 'Unable to create the account.')
  }

  return data
}
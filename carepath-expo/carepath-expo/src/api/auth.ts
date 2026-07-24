import { api } from './client';
import type { LoginResponse, RegisterResponse, MeResponse, Role } from '@/types/api';

export const registerApi = async (body: {
  email: string;
  phone: string;
  password: string;
  role: Role;
  firstName: string;
  lastName: string;
}): Promise<RegisterResponse> => {
  const res = await api.post('/api/auth/register', body);
  return res.data;
};

export const loginApi = async (body: {
  email: string;
  password: string;
}): Promise<LoginResponse> => {
  const res = await api.post('/api/auth/login', body);
  return res.data;
};

export const meApi = async (): Promise<MeResponse> => {
  const res = await api.get('/api/auth/me');
  return res.data;
};

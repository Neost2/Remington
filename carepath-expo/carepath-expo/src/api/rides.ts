import { api } from './client';
import type { CreateRideRequestBody } from '@/types/api';

export const createRideRequestApi = async (body: CreateRideRequestBody) => {
  const res = await api.post('/api/rides', body);
  return res.data;
};

import axios from 'axios';
import { getApiUrl } from '@/utils/platformApiUrl';

export const api = axios.create({
  baseURL: getApiUrl(),
  timeout: 15000,
});

export const setAuthToken = (token: string | null) => {
  if (token) api.defaults.headers.common.Authorization = `Bearer ${token}`;
  else delete api.defaults.headers.common.Authorization;
};

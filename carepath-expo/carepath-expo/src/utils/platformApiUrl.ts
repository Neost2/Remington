import Constants from 'expo-constants';

export const getApiUrl = (): string => {
  const extra = (Constants.expoConfig?.extra ?? {}) as any;
  if (extra.apiUrl && typeof extra.apiUrl === 'string') return extra.apiUrl;
  return 'http://10.0.2.2:3001';
};

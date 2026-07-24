// IMPORTANT API_URL notes:
// - Android emulator: http://10.0.2.2:3001
// - iOS simulator:   http://localhost:3001
// - Real phone:      http://<YOUR_LAN_IP>:3001

const API_URL = 'http://192.168.1.248:3001';

module.exports = ({ config }) => ({
  ...config,
  name: 'CarePath',
  slug: 'carepath',
  version: '1.0.0',
  orientation: 'portrait',
  userInterfaceStyle: 'light',
  splash: {
    resizeMode: 'contain',
    backgroundColor: '#0B1020',
  },
  extra: {
    apiUrl: API_URL,
  },
  plugins: [
    'expo-secure-store',
  ],
});
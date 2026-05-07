import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

// When running on an Android emulator, 10.0.2.2 maps to the host's localhost.
// When running on a physical device, you need to use your PC's actual local IP address.
const API_BASE_URL = Platform.OS === 'android' ? 'http://10.0.2.2:8000/api' : 'http://localhost:8000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Request Interceptor to add Auth Token
apiClient.interceptors.request.use(
  async (config) => {
    try {
      const token = await SecureStore.getItemAsync('auth_token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error fetching token from SecureStore', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor for handling errors globally
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // e.g., handle 401 Unauthorized by logging out
    if (error.response && error.response.status === 401) {
      // Trigger logout flow here if needed
      SecureStore.deleteItemAsync('auth_token');
    }
    return Promise.reject(error);
  }
);

export default apiClient;

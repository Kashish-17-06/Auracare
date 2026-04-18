import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Set this to 'true' if you want to work on frontend without the backend running
const MOCK_MODE = true; 

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to handle Mock Data if backend is down or MOCK_MODE is on
api.interceptors.request.use(async (config) => {
  if (MOCK_MODE) {
    // Intercept and return mock data for development
    console.warn("⚠️ API is in MOCK_MODE. Using local dummy data.");
    return config;
  }
  
  const user = JSON.parse(localStorage.getItem('auracare_user'));
  if (user && user.token) {
    config.headers['Authorization'] = `Bearer ${user.token}`;
  }
  return config;
});

export default api;
export { MOCK_MODE };

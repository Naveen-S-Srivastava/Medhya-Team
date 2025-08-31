// Environment Configuration
export const getApiBaseUrl = () => {
  // Check if window is available (for SSR compatibility)
  if (typeof window === 'undefined') {
    return 'http://localhost:5000/api'; // Default to development
  }
  
  // Check if we're in development (localhost)
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://localhost:5000/api';
  }
  
  // Production URL
  return 'https://mindcare-17y9.onrender.com/api';
};

export const getApiUrl = () => {
  // Check if window is available (for SSR compatibility)
  if (typeof window === 'undefined') {
    return 'http://localhost:5000'; // Default to development
  }
  
  // Check if we're in development (localhost)
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://localhost:5000';
  }
  
  // Production URL
  return 'https://mindcare-17y9.onrender.com';
};

export const isDevelopment = () => {
  if (typeof window === 'undefined') {
    return true; // Default to development
  }
  return window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
};

export const isProduction = () => {
  return !isDevelopment();
};

// Export constants - use function calls to ensure they're evaluated at runtime
export const API_BASE_URL = getApiBaseUrl();
export const API_URL = getApiUrl();

export default {
  API_BASE_URL,
  API_URL,
  isDevelopment,
  isProduction,
  getApiBaseUrl,
  getApiUrl,
};

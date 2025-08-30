// API Base Configuration
const API_BASE_URL = 'http://localhost:5000/api';

// Helper function to handle API responses
const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

// Generic API request function
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = localStorage.getItem('token');
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  };

  const config = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    const result = await handleResponse(response);
    return result;
  } catch (error) {
    console.error('❌ API Request failed:', error);
    throw error;
  }
};

// Crisis Management API
export const crisisAPI = {
  // Get all crisis alerts with optional filters
  getCrisisAlerts: async (filters = {}) => {
    const queryParams = new URLSearchParams();
    if (filters.status) queryParams.append('status', filters.status);
    if (filters.severity) queryParams.append('severity', filters.severity);
    
    const endpoint = `/crisis${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return apiRequest(endpoint);
  },

  // Create a new crisis alert
  createCrisisAlert: async (alertData) => {
    return apiRequest('/crisis', {
      method: 'POST',
      body: JSON.stringify(alertData),
    });
  },

  // Update crisis alert status
  updateCrisisStatus: async (alertId, status) => {
    return apiRequest(`/crisis/${alertId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },
};

// Appointment API
export const appointmentAPI = {
  // Get appointments for a specific student
  getStudentAppointments: async (studentId) => {
    return apiRequest(`/appointments/student/${studentId}`);
  },

  // Create a new appointment
  createAppointment: async (appointmentData) => {
    return apiRequest('/appointments', {
      method: 'POST',
      body: JSON.stringify(appointmentData),
    });
  },

  // Get all appointments (for admin)
  getAllAppointments: async (filters = {}) => {
    const queryParams = new URLSearchParams();
    if (filters.status) queryParams.append('status', filters.status);
    if (filters.counselor) queryParams.append('counselor', filters.counselor);
    if (filters.date) queryParams.append('date', filters.date);
    
    const endpoint = `/appointments${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return apiRequest(endpoint);
  },
};

// User API
export const userAPI = {
  // Get user profile
  getUserProfile: async (userId) => {
    return apiRequest(`/users/${userId}`);
  },

  // Update user profile
  updateUserProfile: async (userId, userData) => {
    return apiRequest(`/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  },

  // Get all users (for admin)
  getAllUsers: async (filters = {}) => {
    const queryParams = new URLSearchParams();
    if (filters.role) queryParams.append('role', filters.role);
    if (filters.institution) queryParams.append('institution', filters.institution);
    
    const endpoint = `/users${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return apiRequest(endpoint);
  },
};

// Assessment API
export const assessmentAPI = {
  // Get assessments for a student
  getStudentAssessments: async (studentId) => {
    return apiRequest(`/assessments/${studentId}`);
  },

  // Create a new assessment
  createAssessment: async (assessmentData) => {
    return apiRequest('/assessments', {
      method: 'POST',
      body: JSON.stringify(assessmentData),
    });
  },

  // Get all assessments (for admin analytics)
  getAllAssessments: async (filters = {}) => {
    const queryParams = new URLSearchParams();
    if (filters.type) queryParams.append('type', filters.type);
    if (filters.startDate) queryParams.append('startDate', filters.startDate);
    if (filters.endDate) queryParams.append('endDate', filters.endDate);
    if (filters.user) queryParams.append('user', filters.user);
    
    const endpoint = `/assessments${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return apiRequest(endpoint);
  },

  // Get assessment analytics for admin dashboard
  getAssessmentAnalytics: async (timeRange = '7d') => {
    return apiRequest(`/assessments/analytics?timeRange=${timeRange}`);
  },

  // Get weekly assessment patterns
  getWeeklyPatterns: async () => {
    return apiRequest('/assessments/weekly-patterns');
  },
};

// Chat API
export const chatAPI = {
  // Get chat history
  getChatHistory: async (userId) => {
    return apiRequest(`/chat/history/${userId}`);
  },

  // Send a message
  sendMessage: async (messageData) => {
    return apiRequest('/chat/message', {
      method: 'POST',
      body: JSON.stringify(messageData),
    });
  },
};

// Activity API
export const activityAPI = {
  // Get activity logs
  getActivityLogs: async (filters = {}) => {
    const queryParams = new URLSearchParams();
    if (filters.user) queryParams.append('user', filters.user);
    if (filters.action) queryParams.append('action', filters.action);
    if (filters.startDate) queryParams.append('startDate', filters.startDate);
    if (filters.endDate) queryParams.append('endDate', filters.endDate);
    
    const endpoint = `/activity${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return apiRequest(endpoint);
  },
};

// Utility functions
export const apiUtils = {
  // Format date for API
  formatDate: (date) => {
    return date.toISOString().split('T')[0];
  },

  // Parse API date
  parseDate: (dateString) => {
    return new Date(dateString);
  },

  // Generate pagination parameters
  getPaginationParams: (page = 1, limit = 10) => {
    return {
      page: page.toString(),
      limit: limit.toString(),
    };
  },

  // Handle search and filter parameters
  buildSearchParams: (searchTerm, filters = {}) => {
    const params = new URLSearchParams();
    if (searchTerm) params.append('search', searchTerm);
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
    return params.toString();
  },
};

export default {
  crisisAPI,
  appointmentAPI,
  userAPI,
  assessmentAPI,
  chatAPI,
  activityAPI,
  apiUtils,
};

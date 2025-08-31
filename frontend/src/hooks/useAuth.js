import { useState, useEffect } from 'react';

const API_BASE_URL = 'http://localhost:5000/api';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is authenticated on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/users/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        // Add additional user metadata for routing logic
        const userWithMetadata = {
          ...data.data.user,
          isProfileComplete: Boolean(
            data.data.user.phone && 
            data.data.user.institutionId && 
            data.data.user.studentId
          ),
          isNewUser: !data.data.user.phone || !data.data.user.institutionId || !data.data.user.studentId,
          isGoogleUser: Boolean(data.data.user.googleId)
        };
        setUser(userWithMetadata);
      } else if (response.status === 401) {
        // Token expired, try to refresh
        try {
          await refreshToken();
          // Retry the profile request with new token
          const newToken = localStorage.getItem('token');
          const retryResponse = await fetch(`${API_BASE_URL}/users/profile`, {
            headers: {
              'Authorization': `Bearer ${newToken}`,
              'Content-Type': 'application/json'
            }
          });
          
          if (retryResponse.ok) {
            const retryData = await retryResponse.json();
            // Add additional user metadata for routing logic
            const userWithMetadata = {
              ...retryData.data.user,
              isProfileComplete: Boolean(
                retryData.data.user.phone && 
                retryData.data.user.institutionId && 
                retryData.data.user.studentId
              ),
              isNewUser: !retryData.data.user.phone || !retryData.data.user.institutionId || !retryData.data.user.studentId,
              isGoogleUser: Boolean(retryData.data.user.googleId)
            };
            setUser(userWithMetadata);
          } else {
            // Refresh failed, clear tokens
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
          }
        } catch (refreshErr) {
          console.error('Token refresh failed:', refreshErr);
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
        }
      } else {
        // Other error, clear tokens
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
      }
    } catch (err) {
      console.error('Auth check failed:', err);
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password, role = "student") => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password, role })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Store tokens
      localStorage.setItem('token', data.token);
      localStorage.setItem('refreshToken', data.refreshToken);
      
      // Add additional user metadata for routing logic
      const userWithMetadata = {
        ...data.data.user,
        isProfileComplete: Boolean(
          data.data.user.phone && 
          data.data.user.institutionId && 
          data.data.user.studentId
        ),
        isNewUser: !data.data.user.phone || !data.data.user.institutionId || !data.data.user.studentId,
        isGoogleUser: Boolean(data.data.user.googleId)
      };
      
      setUser(userWithMetadata);
      return userWithMetadata;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/users/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      // Store tokens
      localStorage.setItem('token', data.token);
      localStorage.setItem('refreshToken', data.refreshToken);
      
      setUser(data.data.user);
      return data.data.user;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const googleAuth = async (googleData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/users/google-auth`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(googleData)
      });

      const data = await response.json();

      if (!response.ok) {
        // Check if this is a "user not found" response (404)
        if (response.status === 404 && data.code === 'USER_NOT_FOUND') {
          // Create a custom error with the Google data for signup flow
          const customError = new Error('User not found. Please sign up first.');
          customError.code = 'USER_NOT_FOUND';
          customError.googleData = data.data; // Include the Google data for signup
          throw customError;
        }
        throw new Error(data.message || 'Google authentication failed');
      }

      // Store tokens
      localStorage.setItem('token', data.token);
      localStorage.setItem('refreshToken', data.refreshToken);
      
      // Add additional user metadata for routing logic
      const userWithMetadata = {
        ...data.data.user,
        isProfileComplete: Boolean(
          data.data.user.phone && 
          data.data.user.institutionId && 
          data.data.user.studentId
        ),
        isNewUser: !data.data.user.phone || !data.data.user.institutionId || !data.data.user.studentId,
        isGoogleUser: Boolean(data.data.user.googleId)
      };
      
      setUser(userWithMetadata);
      return userWithMetadata;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        await fetch(`${API_BASE_URL}/users/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
      }
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      // Clear tokens and user state
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      setUser(null);
    }
  };

  const refreshToken = async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      const response = await fetch(`${API_BASE_URL}/users/refresh-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ refreshToken })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Token refresh failed');
      }

      // Update tokens
      localStorage.setItem('token', data.token);
      localStorage.setItem('refreshToken', data.refreshToken);
      
      return data.token;
    } catch (err) {
      // Clear tokens on refresh failure
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      setUser(null);
      throw err;
    }
  };

  const updateProfile = async (profileData) => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Not authenticated');
    }

    try {
      const response = await fetch(`${API_BASE_URL}/users/profile`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(profileData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Profile update failed');
      }

      // Add additional user metadata for routing logic
      const userWithMetadata = {
        ...data.data.user,
        isProfileComplete: Boolean(
          data.data.user.phone && 
          data.data.user.institutionId && 
          data.data.user.studentId
        ),
        isNewUser: !data.data.user.phone || !data.data.user.institutionId || !data.data.user.studentId,
        isGoogleUser: Boolean(data.data.user.googleId)
      };

      setUser(userWithMetadata);
      return userWithMetadata;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return {
    user,
    loading,
    error,
    login,
    register,
    googleAuth,
    logout,
    refreshToken,
    updateProfile,
    checkAuth
  };
};

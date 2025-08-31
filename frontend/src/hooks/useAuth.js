import { useState, useEffect } from 'react';
import { API_BASE_URL, authAPI } from '../services/api.js';

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
      const data = await authAPI.getProfile();
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
    } catch (err) {
      if (err.message.includes('401')) {
        // Token expired, try to refresh
        try {
          await refreshToken();
          // Retry the profile request with new token
          const retryData = await authAPI.getProfile();
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
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password, role = "student") => {
    setLoading(true);
    setError(null);

    try {
      const data = await authAPI.login({ email, password, role });

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
      const data = await authAPI.register(userData);

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
      const data = await authAPI.googleAuth(googleData);

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
      // Check if this is a "user not found" response (404)
      if (err.message.includes('404') && err.message.includes('USER_NOT_FOUND')) {
        // Create a custom error with the Google data for signup flow
        const customError = new Error('User not found. Please sign up first.');
        customError.code = 'USER_NOT_FOUND';
        customError.googleData = googleData; // Include the Google data for signup
        throw customError;
      }
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
        await authAPI.logout();
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
      const data = await authAPI.refreshToken(refreshToken);

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
      const data = await authAPI.updateProfile(profileData);

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

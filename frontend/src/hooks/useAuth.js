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
      // Use the profile completion status from backend
      const userWithMetadata = {
        ...data.data.user,
        isProfileComplete: Boolean(data.data.user.isProfileComplete),
        isNewUser: !data.data.user.isProfileComplete,
        isGoogleUser: Boolean(data.data.user.googleId)
      };
      
      console.log('🔍 useAuth - Profile loaded:', {
        userId: userWithMetadata._id,
        isProfileComplete: userWithMetadata.isProfileComplete,
        backendValue: data.data.user.isProfileComplete
      });
      
      setUser(userWithMetadata);
    } catch (err) {
      if (err.message.includes('401')) {
        // Token expired, try to refresh
        try {
          await refreshToken();
          // Retry the profile request with new token
          const retryData = await authAPI.getProfile();
          // Use the profile completion status from backend
          const userWithMetadata = {
            ...retryData.data.user,
            isProfileComplete: Boolean(retryData.data.user.isProfileComplete),
            isNewUser: !retryData.data.user.isProfileComplete,
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
      
      // Use the profile completion status from backend
      const userWithMetadata = {
        ...data.data.user,
        isProfileComplete: Boolean(data.data.user.isProfileComplete),
        isNewUser: !data.data.user.isProfileComplete,
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
      
      // Use the profile completion status from backend
      const userWithMetadata = {
        ...data.data.user,
        isProfileComplete: Boolean(data.data.user.isProfileComplete),
        isNewUser: !data.data.user.isProfileComplete,
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
      localStorage.removeItem('refreshToken');
      
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

      // Use the profile completion status from backend
      const userWithMetadata = {
        ...data.data.user,
        isProfileComplete: Boolean(data.data.user.isProfileComplete),
        isNewUser: !data.data.user.isProfileComplete,
        isGoogleUser: Boolean(data.data.user.googleId)
      };

      setUser(userWithMetadata);
      return userWithMetadata;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const checkProfileCompletion = async () => {
    if (!user?._id) return null;
    
    try {
      const token = localStorage.getItem('token');
      if (!token) return null;

      const response = await fetch(`${API_BASE_URL}/user-details/${user._id}/status`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        const updatedUser = {
          ...user,
          isProfileComplete: data.data.isProfileComplete,
          profileCompletionPercentage: data.data.completionPercentage
        };
        setUser(updatedUser);
        return data.data;
      }
    } catch (error) {
      console.error('Error checking profile completion:', error);
    }
    return null;
  };

  const refreshProfileStatus = async () => {
    return await checkProfileCompletion();
  };

  const forceRefreshProfileStatus = async () => {
    if (!user?._id) {
      console.log('❌ forceRefreshProfileStatus: No user ID found');
      return null;
    }
    
    try {
      console.log('🔍 forceRefreshProfileStatus: Starting refresh for user:', user._id);
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('❌ forceRefreshProfileStatus: No token found');
        return null;
      }

      // First, refresh the complete user profile
      try {
        console.log('🔍 forceRefreshProfileStatus: Refreshing complete user profile');
        const profileData = await authAPI.getProfile();
        const userWithMetadata = {
          ...profileData.data.user,
          isProfileComplete: Boolean(profileData.data.user.isProfileComplete),
          isNewUser: !profileData.data.user.isProfileComplete,
          isGoogleUser: Boolean(profileData.data.user.googleId)
        };
        
        console.log('✅ forceRefreshProfileStatus: User profile refreshed:', {
          userId: userWithMetadata._id,
          isProfileComplete: userWithMetadata.isProfileComplete
        });
        
        setUser(userWithMetadata);
        return { isProfileComplete: userWithMetadata.isProfileComplete };
      } catch (profileError) {
        console.log('⚠️ forceRefreshProfileStatus: Profile refresh failed, trying profile status API');
      }

      // Fallback: use the profile status API
      const response = await fetch(`${API_BASE_URL}/user-details/${user._id}/status`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log('✅ forceRefreshProfileStatus: Profile status data received:', data);
        
        const updatedUser = {
          ...user,
          isProfileComplete: data.data.isProfileComplete,
          profileCompletionPercentage: data.data.completionPercentage
        };
        
        console.log('✅ forceRefreshProfileStatus: Updating user state:', {
          oldIsProfileComplete: user.isProfileComplete,
          newIsProfileComplete: updatedUser.isProfileComplete
        });
        
        setUser(updatedUser);
        return data.data;
      } else {
        const errorData = await response.json();
        console.error('❌ forceRefreshProfileStatus: Failed to get profile status:', errorData);
      }
    } catch (error) {
      console.error('❌ forceRefreshProfileStatus: Error refreshing profile status:', error);
    }
    return null;
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
    checkAuth,
    checkProfileCompletion,
    refreshProfileStatus,
    forceRefreshProfileStatus
  };
};

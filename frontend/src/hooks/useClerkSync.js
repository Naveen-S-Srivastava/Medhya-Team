import { useState } from 'react';

const API_BASE_URL = 'http://localhost:5000/api';

export const useClerkSync = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Sync user with backend database
  const syncUser = async (userData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/clerk/sync`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clerkId: userData.id,
          email: userData.emailAddresses[0]?.emailAddress || '',
          firstName: userData.firstName || '',
          lastName: userData.lastName || '',
          phone: userData.phoneNumbers[0]?.phoneNumber || ''
        })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to sync user');
      }

      const data = await response.json();
      
      // Store clerk user ID in localStorage for API calls
      localStorage.setItem('clerkUserId', userData.id);
      
      return data.data;
    } catch (err) {
      setError(err.message);
      console.error('Error syncing user:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Complete user profile
  const completeProfile = async (clerkId, profileData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/clerk/user/${clerkId}/complete-profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData)
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to complete profile');
      }

      const data = await response.json();
      return data.data;
    } catch (err) {
      setError(err.message);
      console.error('Error completing profile:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Get user profile
  const getUserProfile = async (clerkId) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/clerk/user/${clerkId}/profile`);

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to fetch user profile');
      }

      const data = await response.json();
      return data.data;
    } catch (err) {
      setError(err.message);
      console.error('Error fetching user profile:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update user profile
  const updateProfile = async (clerkId, updates) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/clerk/user/${clerkId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates)
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to update profile');
      }

      const data = await response.json();
      return data.data;
    } catch (err) {
      setError(err.message);
      console.error('Error updating profile:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    syncUser,
    completeProfile,
    getUserProfile,
    updateProfile
  };
};

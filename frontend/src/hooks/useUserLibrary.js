import { useState } from 'react';

const API_BASE_URL = 'http://localhost:5000/api';

export const useUserLibrary = () => {
  const [userResources, setUserResources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState(null);

  // Get user's library
  const getUserLibrary = async (page = 1, limit = 12) => {
    setLoading(true);
    setError(null);

    try {
      const clerkId = localStorage.getItem('clerkUserId');
      if (!clerkId) {
        // If no clerk ID, just set empty library instead of throwing error
        setUserResources([]);
        setPagination(null);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/resources/library/user?page=${page}&limit=${limit}`, {
        headers: {
          'X-Clerk-User-ID': clerkId
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Clerk ID is invalid, clear it and set empty library
          localStorage.removeItem('clerkUserId');
          setUserResources([]);
          setPagination(null);
          return;
        }
        const data = await response.json();
        throw new Error(data.message || 'Failed to fetch user library');
      }

      const data = await response.json();
      setUserResources(data.data);
      setPagination(data.pagination);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching user library:', err);
      // Set empty library on error
      setUserResources([]);
      setPagination(null);
    } finally {
      setLoading(false);
    }
  };

  // Remove resource from library
  const removeFromLibrary = async (resourceId) => {
    try {
      const clerkId = localStorage.getItem('clerkUserId');
      if (!clerkId) {
        throw new Error('Please login to manage your library');
      }

      const response = await fetch(`${API_BASE_URL}/resources/library/${resourceId}`, {
        method: 'DELETE',
        headers: {
          'X-Clerk-User-ID': clerkId
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('clerkUserId');
          throw new Error('Please login again to manage your library');
        }
        const data = await response.json();
        throw new Error(data.message || 'Failed to remove resource from library');
      }

      // Remove from local state
      setUserResources(prev => prev.filter(ur => ur.resource._id !== resourceId));
      
      return true;
    } catch (err) {
      setError(err.message);
      console.error('Error removing resource from library:', err);
      throw err;
    }
  };

  // Update user resource (progress, notes, etc.)
  const updateUserResource = async (resourceId, updates) => {
    try {
      const clerkId = localStorage.getItem('clerkUserId');
      if (!clerkId) {
        throw new Error('Please login to update your library');
      }

      const response = await fetch(`${API_BASE_URL}/resources/library/${resourceId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'X-Clerk-User-ID': clerkId
        },
        body: JSON.stringify(updates)
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('clerkUserId');
          throw new Error('Please login again to update your library');
        }
        const data = await response.json();
        throw new Error(data.message || 'Failed to update resource');
      }

      const data = await response.json();
      
      // Update local state
      setUserResources(prev => 
        prev.map(ur => 
          ur.resource._id === resourceId ? { ...ur, ...data.data } : ur
        )
      );

      return data.data;
    } catch (err) {
      setError(err.message);
      console.error('Error updating user resource:', err);
      throw err;
    }
  };

  // Mark resource as downloaded
  const markAsDownloaded = async (resourceId) => {
    try {
      const clerkId = localStorage.getItem('clerkUserId');
      if (!clerkId) {
        throw new Error('Please login to download resources');
      }

      const response = await fetch(`${API_BASE_URL}/resources/library/${resourceId}/download`, {
        method: 'POST',
        headers: {
          'X-Clerk-User-ID': clerkId
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('clerkUserId');
          throw new Error('Please login again to download resources');
        }
        const data = await response.json();
        throw new Error(data.message || 'Failed to mark resource as downloaded');
      }

      // Update local state
      setUserResources(prev => 
        prev.map(ur => 
          ur.resource._id === resourceId 
            ? { ...ur, status: 'downloaded', downloadCount: (ur.downloadCount || 0) + 1 }
            : ur
        )
      );

      return true;
    } catch (err) {
      setError(err.message);
      console.error('Error marking resource as downloaded:', err);
      throw err;
    }
  };

  // Add resource to library (alias for saveResource from useResources)
  const addToLibrary = async (resourceId) => {
    try {
      const clerkId = localStorage.getItem('clerkUserId');
      if (!clerkId) {
        throw new Error('Please login to add resources to your library');
      }

      const response = await fetch(`${API_BASE_URL}/resources/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Clerk-User-ID': clerkId
        },
        body: JSON.stringify({ resourceId })
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('clerkUserId');
          throw new Error('Please login again to add resources to your library');
        }
        const data = await response.json();
        throw new Error(data.message || 'Failed to add resource to library');
      }

      const data = await response.json();
      
      // Add to local state
      setUserResources(prev => [data.data, ...prev]);
      
      return data.data;
    } catch (err) {
      setError(err.message);
      console.error('Error adding resource to library:', err);
      throw err;
    }
  };

  return {
    userResources,
    loading,
    error,
    pagination,
    getUserLibrary,
    removeFromLibrary,
    updateUserResource,
    markAsDownloaded,
    addToLibrary
  };
};

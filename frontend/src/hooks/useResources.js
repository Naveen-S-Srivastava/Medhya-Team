import { useState } from 'react';

const API_BASE_URL = 'http://localhost:5000/api';

export const useResources = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState(null);

  // Get all resources with filtering and pagination
  const getResources = async (filters = {}, page = 1, limit = 12) => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        page,
        limit,
        ...filters
      });

      const response = await fetch(`${API_BASE_URL}/resources?${params}`);

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to fetch resources');
      }

      const data = await response.json();
      setResources(data.data);
      setPagination(data.pagination);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching resources:', err);
    } finally {
      setLoading(false);
    }
  };

  // Get featured resources
  const getFeaturedResources = async (limit = 6) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/resources/featured?limit=${limit}`);

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to fetch featured resources');
      }

      const data = await response.json();
      return data.data;
    } catch (err) {
      setError(err.message);
      console.error('Error fetching featured resources:', err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Get single resource by ID
  const getResource = async (id) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/resources/${id}`);

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to fetch resource');
      }

      const data = await response.json();
      return data.data;
    } catch (err) {
      setError(err.message);
      console.error('Error fetching resource:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Rate a resource
  const rateResource = async (resourceId, rating, review = null) => {
    try {
      const clerkId = localStorage.getItem('clerkUserId');
      if (!clerkId) {
        throw new Error('Please login to rate resources');
      }

      const response = await fetch(`${API_BASE_URL}/resources/${resourceId}/rate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Clerk-User-ID': clerkId
        },
        body: JSON.stringify({ rating, review })
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('clerkUserId');
          throw new Error('Please login again to rate resources');
        }
        const data = await response.json();
        throw new Error(data.message || 'Failed to rate resource');
      }

      const data = await response.json();
      return data.data;
    } catch (err) {
      setError(err.message);
      console.error('Error rating resource:', err);
      throw err;
    }
  };

  // Save resource to library
  const saveResource = async (resourceId) => {
    try {
      const clerkId = localStorage.getItem('clerkUserId');
      if (!clerkId) {
        throw new Error('Please login to save resources to your library');
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
          throw new Error('Please login again to save resources');
        }
        const data = await response.json();
        throw new Error(data.message || 'Failed to save resource');
      }

      const data = await response.json();
      return data.data;
    } catch (err) {
      setError(err.message);
      console.error('Error saving resource:', err);
      throw err;
    }
  };

  // Get resource statistics
  const getResourceStats = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/resources/stats`);

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to fetch resource statistics');
      }

      const data = await response.json();
      return data.data;
    } catch (err) {
      setError(err.message);
      console.error('Error fetching resource statistics:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    resources,
    loading,
    error,
    pagination,
    getResources,
    getFeaturedResources,
    getResource,
    rateResource,
    saveResource,
    getResourceStats
  };
};

import axios from 'axios';

// Backend URL - Update this to match your backend port
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Food API endpoints
export const foodAPI = {
  // Add new food item
  addFood: async (formData) => {
    try {
      const response = await axios.post(`${API_URL}/api/food/add`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      console.error('Error adding food:', error);
      throw error;
    }
  },

  // Get all food items
  listFood: async () => {
    try {
      const response = await api.get('/api/food/list');
      return response.data;
    } catch (error) {
      console.error('Error fetching food items:', error);
      throw error;
    }
  },

  // Remove food item
  removeFood: async (id) => {
    try {
      const response = await api.post('/api/food/remove', { id });
      return response.data;
    } catch (error) {
      console.error('Error removing food:', error);
      throw error;
    }
  },

  // Get image URL
  getImageURL: (filename) => {
    return `${API_URL}/images/${filename}`;
  },
};

export default api;


import axios from 'axios';

const API_URL = 'http://localhost:5000/api'; // Note: /api prefix

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false // Set to true if using sessions/cookies later
});

export const signupUser = async (userData) => {
  try {
    console.log('Sending signup request:', userData);
    const response = await api.post('/signup', userData);
    console.log('Signup response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Signup error:', error.response?.data || error.message);
    throw error.response?.data || { message: 'Signup failed' };
  }
};

export const loginUser = async (credentials) => {
  try {
    console.log('Sending login request:', credentials);
    const response = await api.post('/login', credentials);
    console.log('Login response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Login error:', error.response?.data || error.message);
    throw error.response?.data || { message: 'Login failed' };
  }
};

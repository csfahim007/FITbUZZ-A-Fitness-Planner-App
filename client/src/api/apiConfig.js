export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export const commonHeaders = {
  'Content-Type': 'application/json',
  'Accept': 'application/json'
};

export const getAuthHeader = (token) => ({
  'Authorization': `Bearer ${token}`
});
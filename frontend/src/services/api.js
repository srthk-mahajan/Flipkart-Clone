import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'
});

const parseResponse = (response) => response.data;
const getStoredUser = () => {
  if (typeof window === 'undefined') return null;
  try {
    return JSON.parse(localStorage.getItem('flipkartCloneAuthUser') || 'null');
  } catch {
    return null;
  }
};

const getUserId = () => getStoredUser()?.id;

export const getProducts = async (params = {}) => {
  const response = await api.get('/products', { params });
  return parseResponse(response);
};

export const getProductById = async (id) => {
  const response = await api.get(`/products/${id}`);
  return parseResponse(response);
};

export const getCart = async () => {
  const userId = getUserId();
  const response = await api.get('/cart', {
    params: userId ? { userId } : {}
  });
  return parseResponse(response);
};

export const addToCart = async (payload) => {
  const userId = getUserId();
  const response = await api.post('/cart', {
    ...payload,
    ...(userId ? { userId } : {})
  });
  return parseResponse(response);
};

export const updateCart = async (cartItemId, payload) => {
  const userId = getUserId();
  const response = await api.patch(`/cart/${cartItemId}`, {
    ...payload,
    ...(userId ? { userId } : {})
  });
  return parseResponse(response);
};

export const removeFromCart = async (cartItemId) => {
  const userId = getUserId();
  const response = await api.delete(`/cart/${cartItemId}`, {
    params: userId ? { userId } : {}
  });
  return parseResponse(response);
};

export const placeOrder = async (payload) => {
  const userId = getUserId();
  const response = await api.post('/orders', {
    ...payload,
    ...(userId ? { userId } : {})
  });
  return parseResponse(response);
};

export const getOrderHistory = async () => {
  const userId = getUserId();
  const response = await api.get('/orders', {
    params: userId ? { userId } : {}
  });
  return parseResponse(response);
};

export const signupUser = async (payload) => {
  const response = await api.post('/auth/signup', payload);
  return parseResponse(response);
};

export const loginUser = async (payload) => {
  const response = await api.post('/auth/login', payload);
  return parseResponse(response);
};

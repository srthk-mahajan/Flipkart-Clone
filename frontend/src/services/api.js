import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'
});

const PRODUCT_CACHE_TTL_MS = 60 * 1000;
const productCache = new Map();

const getCacheKey = (endpoint, params = {}) => {
  const entries = Object.entries(params)
    .filter(([, value]) => value !== undefined && value !== null && value !== '')
    .sort(([a], [b]) => a.localeCompare(b));

  return `${endpoint}?${new URLSearchParams(entries).toString()}`;
};

const getCachedValue = (key) => {
  const record = productCache.get(key);
  if (!record) return null;

  if (Date.now() > record.expiresAt) {
    productCache.delete(key);
    return null;
  }

  return record.value;
};

const setCachedValue = (key, value) => {
  productCache.set(key, {
    value,
    expiresAt: Date.now() + PRODUCT_CACHE_TTL_MS
  });
};

const parseResponse = (response) => response.data;
const AUTH_USER_KEY = 'flipkartCloneAuthUser';
const GUEST_ID_KEY = 'flipkartCloneGuestId';

const generateGuestId = () => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID().replace(/-/g, '');
  }

  return `guest_${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`;
};

const getStoredUser = () => {
  if (typeof window === 'undefined') return null;
  try {
    return JSON.parse(localStorage.getItem(AUTH_USER_KEY) || 'null');
  } catch {
    return null;
  }
};

const getOrCreateGuestId = () => {
  if (typeof window === 'undefined') return null;

  const existing = localStorage.getItem(GUEST_ID_KEY);
  if (existing) return existing;

  const generated = generateGuestId();
  localStorage.setItem(GUEST_ID_KEY, generated);
  return generated;
};

const getIdentityPayload = () => {
  const userId = getStoredUser()?.id;
  if (userId) {
    return { userId };
  }

  const guestId = getOrCreateGuestId();
  return guestId ? { guestId } : {};
};

export const getProducts = async (params = {}) => {
  const key = getCacheKey('/products', params);
  const cached = getCachedValue(key);
  if (cached) return cached;

  const response = await api.get('/products', { params });
  const parsed = parseResponse(response);
  setCachedValue(key, parsed);
  return parsed;
};

export const getProductById = async (id) => {
  const key = getCacheKey(`/products/${id}`);
  const cached = getCachedValue(key);
  if (cached) return cached;

  const response = await api.get(`/products/${id}`);
  const parsed = parseResponse(response);
  setCachedValue(key, parsed);
  return parsed;
};

export const getCart = async () => {
  const identityPayload = getIdentityPayload();
  const response = await api.get('/cart', {
    params: identityPayload
  });
  return parseResponse(response);
};

export const addToCart = async (payload) => {
  const identityPayload = getIdentityPayload();
  const response = await api.post('/cart', {
    ...payload,
    ...identityPayload
  });
  return parseResponse(response);
};

export const updateCart = async (cartItemId, payload) => {
  const identityPayload = getIdentityPayload();
  const response = await api.patch(`/cart/${cartItemId}`, {
    ...payload,
    ...identityPayload
  });
  return parseResponse(response);
};

export const removeFromCart = async (cartItemId) => {
  const identityPayload = getIdentityPayload();
  const response = await api.delete(`/cart/${cartItemId}`, {
    params: identityPayload
  });
  return parseResponse(response);
};

export const placeOrder = async (payload) => {
  const identityPayload = getIdentityPayload();
  const response = await api.post('/orders', {
    ...payload,
    ...identityPayload
  });
  return parseResponse(response);
};

export const getOrderHistory = async () => {
  const identityPayload = getIdentityPayload();
  const response = await api.get('/orders', {
    params: identityPayload
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

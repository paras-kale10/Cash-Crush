import { apiRequest } from './client.js';

// ── Auth ──
export const authApi = {
  register: (body) =>
    apiRequest('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  login: (body) =>
    apiRequest('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
};

// ── User ──
export const userApi = {
  getProfile: () => apiRequest('/users/profile'),
  updateProfile: (body) =>
    apiRequest('/users/profile', { method: 'PATCH', body: JSON.stringify(body) }),
  resetAll: () =>
    apiRequest('/users/profile/reset', { method: 'POST' }),
};

// ── Transactions ──
export const transactionApi = {
  list: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return apiRequest(`/transactions${qs ? `?${qs}` : ''}`);
  },
  create: (body) =>
    apiRequest('/transactions', { method: 'POST', body: JSON.stringify(body) }),
  update: (id, body) =>
    apiRequest(`/transactions/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
  delete: (id) => apiRequest(`/transactions/${id}`, { method: 'DELETE' }),
};

// ── Goals ──
export const goalApi = {
  list: () => apiRequest('/goals'),
  create: (body) =>
    apiRequest('/goals', { method: 'POST', body: JSON.stringify(body) }),
  update: (id, body) =>
    apiRequest(`/goals/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
  delete: (id) => apiRequest(`/goals/${id}`, { method: 'DELETE' }),
};

// ── Vault ──
export const vaultApi = {
  get: () => apiRequest('/vault'),
  update: (body) =>
    apiRequest('/vault', { method: 'PATCH', body: JSON.stringify(body) }),
};

// ── Dashboard ──
export const dashboardApi = {
  getStats: () => apiRequest('/dashboard/stats'),
};

// ── Migration ──
export const migrateApi = {
  fromLocalStorage: (localData) =>
    apiRequest('/migrate/local-storage', {
      method: 'POST',
      body: JSON.stringify({ localData }),
    }),
};

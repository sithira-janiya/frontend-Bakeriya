// Thin API client for the Bakerya backend.
//
// Base URLs:
//   - REST: import.meta.env.VITE_API_URL, or '' (relative) so vite's dev proxy
//     forwards /api -> http://localhost:4000 during development.
//   - WS:   import.meta.env.VITE_WS_URL, or derived from the page origin + /ws
//     (vite proxies /ws in dev).
//
// The admin JWT is kept in localStorage so a chef stays logged in across
// reloads; it's attached as a Bearer token on protected calls.

const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '')
// Single JWT for the signed-in principal (admin or customer). Admin-only API
// calls still reject a customer token server-side (requireAdmin checks role).
const TOKEN_KEY = 'bakerya_token'

export function getToken() {
  try {
    return localStorage.getItem(TOKEN_KEY)
  } catch {
    return null
  }
}

export function setToken(token) {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token)
    else localStorage.removeItem(TOKEN_KEY)
  } catch {
    /* ignore */
  }
}

export function wsUrl() {
  if (import.meta.env.VITE_WS_URL) return import.meta.env.VITE_WS_URL
  if (API_BASE) {
    return API_BASE.replace(/^http/, 'ws') + '/ws'
  }
  const proto = window.location.protocol === 'https:' ? 'wss' : 'ws'
  return `${proto}://${window.location.host}/ws`
}

async function request(path, { method = 'GET', body, auth = false } = {}) {
  const headers = {}
  if (body !== undefined) headers['Content-Type'] = 'application/json'
  if (auth) {
    const token = getToken()
    if (token) headers.Authorization = `Bearer ${token}`
  }

  let res
  try {
    res = await fetch(`${API_BASE}/api${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined
    })
  } catch (err) {
    throw new ApiError('Network error — is the backend running?', 0)
  }

  let data = null
  const text = await res.text()
  if (text) {
    try {
      data = JSON.parse(text)
    } catch {
      data = { error: text }
    }
  }

  if (!res.ok) {
    throw new ApiError(data?.error || `Request failed (${res.status})`, res.status)
  }
  return data
}

export class ApiError extends Error {
  constructor(message, status) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

export const api = {
  getMenu: () => request('/menu'),
  placeOrder: (payload) => request('/orders', { method: 'POST', body: payload }),
  getOrder: (code) => request(`/orders/${encodeURIComponent(code)}`),
  findOrdersByEmail: (email) => request(`/orders?email=${encodeURIComponent(email)}`),
  listOrders: () => request('/orders', { auth: true }),
  updateOrderStatus: (code, status) =>
    request(`/orders/${encodeURIComponent(code)}/status`, { method: 'PATCH', body: { status }, auth: true }),

  // Auth (admin + customer share /auth/login; admin uses username `admin`).
  register: (payload) => request('/auth/register', { method: 'POST', body: payload }),
  login: (identifier, password) =>
    request('/auth/login', { method: 'POST', body: { username: identifier, password } }),
  googleLogin: (credential) => request('/auth/google', { method: 'POST', body: { credential } }),
  me: () => request('/auth/me', { auth: true }),
  requestPasswordPin: () => request('/auth/password/request-pin', { method: 'POST', auth: true }),
  changePassword: (pin, newPassword) =>
    request('/auth/password/change', { method: 'POST', body: { pin, newPassword }, auth: true }),

  // Menu admin (chef): full list incl. hidden items + add / update / remove.
  getMenuAdmin: () => request('/menu/admin', { auth: true }),
  createMenuItem: (item) => request('/menu', { method: 'POST', body: item, auth: true }),
  updateMenuItem: (id, patch) =>
    request(`/menu/${encodeURIComponent(id)}`, { method: 'PATCH', body: patch, auth: true }),
  deleteMenuItem: (id) => request(`/menu/${encodeURIComponent(id)}`, { method: 'DELETE', auth: true })
}

// Low-level HTTP/WS plumbing for the Bakerya backend.
//
// This module owns the transport concerns only — base URLs, auth tokens, the
// fetch wrapper, and the typed ApiError. Domain calls live in the sibling
// *Service.js files, which import `request` from here.
//
// Base URLs:
//   - REST: import.meta.env.VITE_API_URL, or '' (relative) so vite's dev proxy
//     forwards /api -> http://localhost:4000 during development.
//   - WS:   import.meta.env.VITE_WS_URL, or derived from the page origin + /ws
//     (vite proxies /ws in dev).
//
// The JWT is kept in localStorage so a signed-in principal stays logged in
// across reloads; it's attached as a Bearer token on protected calls.

const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '')
// Single JWT for the signed-in principal (admin or customer). Admin-only API
// calls still reject a customer token server-side (requireAdmin checks role).
const TOKEN_KEY = 'bakerya_token'
// Per-browser guest token (role: 'guest'). Issued by the backend on a guest's
// first order; lets THIS browser reopen its own orders' full details without an
// account. Identity is the token, not the client IP.
const GUEST_TOKEN_KEY = 'bakerya_guest_token'

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

export function getGuestToken() {
  try {
    return localStorage.getItem(GUEST_TOKEN_KEY)
  } catch {
    return null
  }
}

export function setGuestToken(token) {
  try {
    if (token) localStorage.setItem(GUEST_TOKEN_KEY, token)
    else localStorage.removeItem(GUEST_TOKEN_KEY)
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

export class ApiError extends Error {
  constructor(message, status, data) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    // Full parsed error body, so callers can read flags like needsVerification.
    this.data = data || null
  }
}

// Core fetch wrapper shared by every service call. Always resolves to parsed
// JSON (or null) on success and throws an ApiError on network/HTTP failure —
// callers never see a raw fetch rejection or an unhandled non-2xx response.
export async function request(path, { method = 'GET', body, auth = false } = {}) {
  const headers = {}
  if (body !== undefined) headers['Content-Type'] = 'application/json'
  if (auth) {
    // Prefer the signed-in principal; fall back to the guest token so a guest
    // can place and reopen their own orders. Admin/customer always wins.
    const token = getToken() || getGuestToken()
    if (token) headers.Authorization = `Bearer ${token}`
  }

  let res
  try {
    res = await fetch(`${API_BASE}/api${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined
    })
  } catch {
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
    throw new ApiError(data?.error || `Request failed (${res.status})`, res.status, data)
  }
  return data
}

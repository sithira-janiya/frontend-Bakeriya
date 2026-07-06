// Order endpoints — create, read (by code / by email), list, status, delete.
import { request } from './httpClient.js'

export const orderService = {
  // auth: sends the customer token (owns via email) or the guest token (reuses
  // the browser's gid so all its guest orders share one identity).
  placeOrder: (payload) => request('/orders', { method: 'POST', body: payload, auth: true }),

  // auth: attaches the token when signed in so the owner/admin gets full detail;
  // guests still work (backend returns a redacted view for the code lookup).
  getOrder: (code) => request(`/orders/${encodeURIComponent(code)}`, { auth: true }),

  // Email lookup requires auth (own orders only, or admin) server-side.
  findOrdersByEmail: (email) => request(`/orders?email=${encodeURIComponent(email)}`, { auth: true }),

  listOrders: () => request('/orders', { auth: true }),

  updateOrderStatus: (code, status) =>
    request(`/orders/${encodeURIComponent(code)}/status`, { method: 'PATCH', body: { status }, auth: true }),

  deleteOrder: (code) => request(`/orders/${encodeURIComponent(code)}`, { method: 'DELETE', auth: true })
}

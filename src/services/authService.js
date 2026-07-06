// Auth endpoints — registration/verification, login (admin + customer share
// /auth/login; admin uses username `admin`), Google, session, password change.
import { request } from './httpClient.js'

export const authService = {
  register: (payload) => request('/auth/register', { method: 'POST', body: payload }),
  verifyEmail: (email, code) => request('/auth/verify-email', { method: 'POST', body: { email, code } }),
  resendVerification: (email) => request('/auth/resend-verification', { method: 'POST', body: { email } }),
  login: (identifier, password) =>
    request('/auth/login', { method: 'POST', body: { username: identifier, password } }),
  googleLogin: (credential) => request('/auth/google', { method: 'POST', body: { credential } }),
  me: () => request('/auth/me', { auth: true }),
  requestPasswordPin: () => request('/auth/password/request-pin', { method: 'POST', auth: true }),
  changePassword: (pin, newPassword) =>
    request('/auth/password/change', { method: 'POST', body: { pin, newPassword }, auth: true })
}

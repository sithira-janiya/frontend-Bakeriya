import { Navigate, Outlet } from 'react-router-dom'
import { useStore } from '../context/StoreContext.jsx'

// Login-first gate for the storefront. Any established role — admin, signed-in
// customer, or anonymous guest — may pass; everyone else is sent to /login.
// While a stored token is still validating (authLoading) we render nothing so a
// returning user isn't flashed to the login page on reload.
export default function RequireEntry() {
  const { isAdmin, currentUser, guestSession, authLoading } = useStore()

  if (authLoading) return null

  if (!isAdmin && !currentUser && !guestSession) {
    return <Navigate to="/login" replace />
  }
  return <Outlet />
}

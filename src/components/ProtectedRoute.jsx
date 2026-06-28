import { Navigate } from 'react-router-dom'
import { useStore } from '../context/StoreContext.jsx'

// Gates a route by role. While the stored token is still being validated
// (authLoading) we render nothing to avoid a wrong redirect flash on reload.
export default function ProtectedRoute({ children, role = 'admin' }) {
  const { isAdmin, currentUser, authLoading } = useStore()

  if (authLoading) return null

  if (role === 'admin' ? !isAdmin : !currentUser) {
    return <Navigate to="/login" replace />
  }
  return children
}

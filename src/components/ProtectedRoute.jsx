import { Navigate } from 'react-router-dom'
import { useStore } from '../context/StoreContext.jsx'

export default function ProtectedRoute({ children }) {
  const { isAdmin } = useStore()
  if (!isAdmin) {
    return <Navigate to="/admin/login" replace />
  }
  return children
}

import { useEffect, useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import LoadingScreen from './components/LoadingScreen.jsx'
import { useLanguage } from './context/LanguageContext.jsx'
import Home from './pages/Home.jsx'
import Menu from './pages/Menu.jsx'
import OrderForm from './pages/OrderForm.jsx'
import OrderStatus from './pages/OrderStatus.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import CustomerDashboard from './pages/CustomerDashboard.jsx'
import AdminPanel from './pages/AdminPanel.jsx'
import NotFound from './pages/NotFound.jsx'
import { Navigate } from 'react-router-dom'

export default function App() {
  const [booting, setBooting] = useState(true)
  const [leaving, setLeaving] = useState(false)
  const { t } = useLanguage()

  useEffect(() => {
    const leaveTimer = setTimeout(() => setLeaving(true), 1100)
    const doneTimer = setTimeout(() => setBooting(false), 1400)
    return () => {
      clearTimeout(leaveTimer)
      clearTimeout(doneTimer)
    }
  }, [])

  if (booting) {
    return <LoadingScreen message={t('app.preheating')} leaving={leaving} />
  }

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/order" element={<OrderForm />} />
        <Route path="/track" element={<OrderStatus />} />
        <Route path="/track/:orderId" element={<OrderStatus />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* legacy admin login link -> unified login */}
        <Route path="/admin/login" element={<Navigate to="/login" replace />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute role="customer">
              <CustomerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <AdminPanel />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}

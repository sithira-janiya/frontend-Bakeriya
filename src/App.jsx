import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import RequireEntry from "./components/RequireEntry.jsx";
import LoadingScreen from "./components/LoadingScreen.jsx";
import PageTransition from "./components/anim/PageTransition.jsx";
import { useLanguage } from "./context/LanguageContext.jsx";
import Home from "./pages/Home.jsx";
import Menu from "./pages/Menu.jsx";
import OrderForm from "./pages/OrderForm.jsx";
import OrderStatus from "./pages/OrderStatus.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import CustomerDashboard from "./pages/CustomerDashboard.jsx";
import AdminPanel from "./pages/AdminPanel.jsx";
import NotFound from "./pages/NotFound.jsx";

export default function App() {
  const [booting, setBooting] = useState(true);
  const [leaving, setLeaving] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    const leaveTimer = setTimeout(() => setLeaving(true), 1100);
    const doneTimer = setTimeout(() => setBooting(false), 1400);
    return () => {
      clearTimeout(leaveTimer);
      clearTimeout(doneTimer);
    };
  }, []);

  if (booting) {
    return <LoadingScreen message={t("app.preheating")} leaving={leaving} />;
  }

  return (
    <Routes>
      {/* Auth pages render full-screen (no navbar/footer) so the 2D login
          animation owns the viewport. They get their own entrance. */}
      <Route
        path="/login"
        element={
          <PageTransition>
            <Login />
          </PageTransition>
        }
      />
      <Route
        path="/register"
        element={
          <PageTransition>
            <Register />
          </PageTransition>
        }
      />
      {/* legacy admin login link -> unified login */}
      <Route path="/admin/login" element={<Navigate to="/login" replace />} />

      <Route element={<Layout />}>
        {/* Login-first: the storefront is gated to guests, customers, admins. */}
        <Route element={<RequireEntry />}>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/order" element={<OrderForm />} />
          <Route path="/track" element={<OrderStatus />} />
          <Route path="/track/:orderId" element={<OrderStatus />} />
        </Route>
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
  );
}

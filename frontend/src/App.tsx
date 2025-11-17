import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/authStore'
import { useEffect } from 'react'

// Layouts
import MainLayout from './components/layout/MainLayout'
import DashboardLayout from './components/layout/DashboardLayout'

// Pages
import Home from './pages/Home'
import Events from './pages/Events'
import EventDetail from './pages/EventDetail'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Onboarding from './pages/Onboarding'
import Profile from './pages/Profile'
import VendorDashboard from './pages/vendor/Dashboard'
import CreateEvent from './pages/vendor/CreateEvent'
import NotFound from './pages/NotFound'

// Protected Route Component
import ProtectedRoute from './components/common/ProtectedRoute'

function App() {
  const { initAuth } = useAuthStore()

  useEffect(() => {
    initAuth()
  }, [initAuth])

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="events" element={<Events />} />
        <Route path="events/:id" element={<EventDetail />} />
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />
      </Route>

      {/* Onboarding Route */}
      <Route
        path="/onboarding"
        element={
          <ProtectedRoute>
            <Onboarding />
          </ProtectedRoute>
        }
      />

      {/* Protected User Routes */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Profile />} />
      </Route>

      {/* Vendor Routes */}
      <Route
        path="/vendor"
        element={
          <ProtectedRoute requiredRole="VENDOR">
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<VendorDashboard />} />
        <Route path="create-event" element={<CreateEvent />} />
      </Route>

      {/* Redirect /create-events to vendor route or signup */}
      <Route path="/create-event" element={<CreateEventRedirect />} />

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

// Helper component for create event redirect
function CreateEventRedirect() {
  const { isAuthenticated, user } = useAuthStore()
  
  if (!isAuthenticated) {
    return <Navigate to="/signup" state={{ intendedRole: 'VENDOR' }} replace />
  }
  
  if (user?.role === 'VENDOR' || user?.role === 'ADMIN') {
    return <Navigate to="/vendor/create-event" replace />
  }
  
  return <Navigate to="/" replace />
}

export default App
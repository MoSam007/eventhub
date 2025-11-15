import { Routes, Route } from 'react-router-dom'
import { useThemeStore } from './store/themeStore'
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
import Profile from './pages/Profile'
import VendorDashboard from './pages/vendor/Dashboard'
import CreateEvent from './pages/vendor/CreateEvent'
import NotFound from './pages/NotFound'

// Protected Route Component
import ProtectedRoute from './components/common/ProtectedRoute'

function App() {
  const { isDark } = useThemeStore()

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDark])

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

      {/* Protected Routes */}
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

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App
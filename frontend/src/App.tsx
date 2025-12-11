import { Routes, Route } from 'react-router-dom'
import { useAuthStore } from './store/authStore'
import { useEffect } from 'react'

// Layouts
import MainLayout from './components/layout/MainLayout'
import SidebarLayout from './components/layout/SidebarLayout'

// Public Pages
import Home from './pages/Home'
import Events from './pages/Events'
import EventDetail from './pages/EventDetail'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Onboarding from './pages/Onboarding'
import Profile from './pages/Profile'
import NotFound from './pages/NotFound'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import VerifyEmail from './pages/VerifyEmail'

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard'
import AdminUsers from './pages/admin/Users'
import AdminManageEvents from './pages/admin/ManageEvents'
import AdminEditEvent from './pages/admin/EditEvent'

// Host Pages
import HostDashboard from './pages/host/Dashboard'
import HostManageEvents from './pages/host/ManageEvents'
import CreateEvent from './pages/host/CreateEvent'
import EditEvent from './pages/host/EditEvent'

// Vendor Pages
import VendorDashboard from './pages/vendor/Dashboard'

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
        <Route path="/events/:slug" element={<EventDetail />} />
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="reset-password/:token" element={<ResetPassword />} />
        <Route path="verify-email/:token" element={<VerifyEmail />} />
      </Route>

      {/* Onboarding */}
      <Route
        path="/onboarding"
        element={
          <ProtectedRoute>
            <Onboarding />
          </ProtectedRoute>
        }
      />

      {/* User Routes */}
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

      {/* Admin Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute requiredRole="ADMIN">
            <SidebarLayout role="ADMIN" />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="events" element={<AdminManageEvents />} />
        <Route path="create-event" element={<CreateEvent />} />
        <Route path="events/:id/edit" element={<AdminEditEvent />} />
        <Route path="hosts" element={<div>Hosts Management</div>} />
        <Route path="vendors" element={<div>Vendors Management</div>} />
        <Route path="settings" element={<div>Settings</div>} />
      </Route>

      {/* Host Routes */}
      <Route
        path="/host"
        element={
          <ProtectedRoute requiredRole="HOST">
            <SidebarLayout role="HOST" />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<HostDashboard />} />
        <Route path="events" element={<HostManageEvents />} />
        <Route path="create-event" element={<CreateEvent />} />
        <Route path="/host/events/:id/edit" element={<EditEvent />} />
        <Route path="bids" element={<div>Vendor Bids</div>} />
        <Route path="settings" element={<div>Settings</div>} />
      </Route>

      {/* Vendor Routes */}
      <Route
        path="/vendor"
        element={
          <ProtectedRoute requiredRole="VENDOR">
            <SidebarLayout role="VENDOR" />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<VendorDashboard />} />
        <Route path="services" element={<div>My Services</div>} />
        <Route path="events" element={<div>Browse Events</div>} />
        <Route path="bids" element={<div>My Bids</div>} />
        <Route path="settings" element={<div>Settings</div>} />
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App
import { ReactNode, useEffect } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'

interface ProtectedRouteProps {
  children: ReactNode
  requiredRole?: 'USER' | 'HOST' | 'VENDOR' | 'ADMIN' 
  redirectTo?: string
}

export default function ProtectedRoute({ 
  children, 
  requiredRole,
  redirectTo 
}: ProtectedRouteProps) {
  const { isAuthenticated, user, initAuth } = useAuthStore()
  const location = useLocation()

  useEffect(() => {
    initAuth()
  }, [initAuth])

  console.log('ProtectedRoute check:', { isAuthenticated, userRole: user?.role, requiredRole })

  if (!isAuthenticated) {
    return <Navigate to={redirectTo || "/login"} state={{ from: location }} replace />
  }

  if (requiredRole && user?.role !== requiredRole && user?.role !== 'ADMIN') {
    console.log('Role mismatch, redirecting...')
    // Redirect based on user's actual role
    if (user?.role === 'HOST') {
      return <Navigate to="/host/dashboard" replace />
    }
    if (user?.role === 'VENDOR') {
      return <Navigate to="/vendor/dashboard" replace />
    }
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}
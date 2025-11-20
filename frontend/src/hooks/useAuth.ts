import { useAuthStore } from '../store/authStore'
import { useMutation, useQuery } from '@tanstack/react-query'
import { authService } from '../services/auth.service'
import { useNavigate, useLocation } from 'react-router-dom'

export const useAuth = () => {
  const { user, setUser, logout, isAuthenticated } = useAuthStore()
  const navigate = useNavigate()
  // const location = useLocation()

  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      console.log('=== LOGIN SUCCESS ===')
      console.log('User data received:', data.data.user)
      console.log('User role:', data.data.user.role)
      
      // Set user in store
      setUser(data.data.user)
      
      // Small delay to ensure state updates
      setTimeout(() => {
        const role = data.data.user.role
        console.log('Redirecting based on role:', role)
        // const from = (location.state as any)?.from?.pathname
       
        // Redirect based on role
        if (role === 'ADMIN') {
          console.log('→ Redirecting to /admin/dashboard')
          navigate('/admin/dashboard')
        } else if (role === 'HOST') {
          console.log('→ Redirecting to /host/dashboard')
          navigate('/host/dashboard')
        } else if (role === 'VENDOR') {
          console.log('→ Redirecting to /vendor/dashboard')
          navigate('/vendor/dashboard')
        } else {
          console.log('→ Redirecting to /events')
          navigate('/events')
        }
      }, 100)
    },
    onError: (error) => {
      console.error('Login error:', error)
    }
  })

  const registerMutation = useMutation({
    mutationFn: authService.register,
    onSuccess: (data) => {
      console.log('=== REGISTRATION SUCCESS ===')
      console.log('User data received:', data.data.user)
      console.log('User role:', data.data.user.role)
      
      setUser(data.data.user)
      
      // Always go to onboarding after signup
      setTimeout(() => {
        console.log('→ Redirecting to /onboarding')
        navigate('/onboarding')
      }, 100)
    },
    onError: (error) => {
      console.error('Registration error:', error)
    }
  })

  const { refetch: refetchUser } = useQuery({
    queryKey: ['currentUser'],
    queryFn: authService.getMe,
    enabled: isAuthenticated,
  })

  return {
    user,
    isAuthenticated,
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout,
    isLoggingIn: loginMutation.isPending,
    isRegistering: registerMutation.isPending,
    loginError: loginMutation.error,
    registerError: registerMutation.error,
    refetchUser,
  }
}
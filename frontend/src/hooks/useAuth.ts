import { useAuthStore } from '../store/authStore'
import { useMutation, useQuery } from '@tanstack/react-query'
import { authService } from '../services/auth.service'
import { useNavigate, useLocation } from 'react-router-dom'

export const useAuth = () => {
  const { user, setUser, logout, isAuthenticated } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()

  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      console.log('Login success, user role:', data.data.user.role)
      setUser(data.data.user)
      
      const from = (location.state as any)?.from?.pathname
      
      // Redirect based on role
      if (data.data.user.role === 'HOST') {
        console.log('Redirecting to host dashboard')
        navigate(from || '/host/dashboard')
      } else if (data.data.user.role === 'VENDOR') {
        console.log('Redirecting to vendor dashboard')
        navigate(from || '/vendor/dashboard')
      } else {
        console.log('Redirecting to events')
        navigate(from || '/events')
      }
    },
  })

  const registerMutation = useMutation({
    mutationFn: authService.register,
    onSuccess: (data) => {
      console.log('Registration success, user role:', data.data.user.role)
      setUser(data.data.user)
      // Always go to onboarding after signup
      navigate('/onboarding')
    },
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
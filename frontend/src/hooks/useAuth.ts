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
      setUser(data.data.user)
      const from = (location.state as any)?.from?.pathname
      
      // Redirect based on role
      if (data.data.user.role === 'VENDOR') {
        navigate(from || '/vendor/dashboard')
      } else {
        navigate(from || '/events')
      }
    },
  })

  const registerMutation = useMutation({
    mutationFn: authService.register,
    onSuccess: (data) => {
      setUser(data.data.user)
      // Always go to onboarding after signup
      navigate('/onboarding')
    },
  })

  const { refetch: refetchUser } = useQuery({
    queryKey: ['currentUser'],
    queryFn: authService.getMe,
    enabled: isAuthenticated,
    // @ts-ignore
    onSuccess: (data) => {
      setUser(data)
    },
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
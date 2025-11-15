import { useAuthStore } from '../store/authStore'
import { useMutation, useQuery } from '@tanstack/react-query'
import { authService } from '../services/auth.service'
import { useNavigate } from 'react-router-dom'
import { User } from '../types'
import { useEffect } from 'react'

export const useAuth = () => {
  const { user, setUser, logout, isAuthenticated } = useAuthStore()
  const navigate = useNavigate()

  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      setUser(data.data.user)
      navigate('/')
    },
  })

  const registerMutation = useMutation({
    mutationFn: authService.register,
    onSuccess: (data) => {
      setUser(data.data.user)
      navigate('/')
    },
  })

  const { data: currentUser, refetch: refetchUser } = useQuery<User, Error>({
    queryKey: ['currentUser'],
    queryFn: authService.getMe,
    enabled: isAuthenticated,
  })

  useEffect(() => {
    if (currentUser) {
      setUser(currentUser)
    }
  }, [currentUser, setUser])

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
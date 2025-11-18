import { create } from 'zustand'
import { User } from '../types'
import { authService } from '../services/auth.service'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  setUser: (user: User | null) => void
  logout: () => void
  initAuth: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,

  setUser: (user) => {
    console.log('Setting user in store:', user)  // Add logging
    set({
      user,
      isAuthenticated: !!user,
    })
  },

  logout: () => {
    authService.logout()
    set({ user: null, isAuthenticated: false })
  },

  initAuth: () => {
    const user = authService.getCurrentUser()
    const isAuthenticated = authService.isAuthenticated()
    console.log('Initializing auth:', { user, isAuthenticated }) 
    set({ user, isAuthenticated })
  },
}))
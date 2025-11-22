import api from './api'

export interface CreateUserData {
  email: string
  password: string
  fullName: string
  phone?: string
  role: 'USER' | 'HOST' | 'VENDOR' | 'ADMIN'
}

export interface UpdateUserData {
  email?: string
  fullName?: string
  phone?: string
  role?: 'USER' | 'HOST' | 'VENDOR' | 'ADMIN'
}

export const adminService = {
  // Get all users
  async getUsers(params?: {
    role?: string
    search?: string
    page?: number
    limit?: number
  }) {
    const response = await api.get('/admin/users', { params })
    return response.data
  },

  // Get user by ID
  async getUserById(id: string) {
    const response = await api.get(`/admin/users/${id}`)
    return response.data
  },

  // Create user
  async createUser(data: CreateUserData) {
    const response = await api.post('/admin/users', data)
    return response.data
  },

  // Update user
  async updateUser(id: string, data: UpdateUserData) {
    const response = await api.put(`/admin/users/${id}`, data)
    return response.data
  },

  // Delete user
  async deleteUser(id: string) {
    const response = await api.delete(`/admin/users/${id}`)
    return response.data
  },

  // Get stats
  async getStats() {
    const response = await api.get('/admin/stats')
    return response.data
  },
}
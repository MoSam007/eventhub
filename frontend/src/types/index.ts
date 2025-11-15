export interface User {
  id: string
  email: string
  fullName: string
  profilePicture?: string
  phone?: string
  role: 'USER' | 'VENDOR' | 'ADMIN'
  location?: string
  preferences?: any
  createdAt: string
}

export interface Event {
  id: string
  title: string
  description: string
  categoryId: string
  category?: Category
  hostId: string
  host?: {
    id: string
    fullName: string
    profilePicture?: string
  }
  location: string
  address: string
  startDatetime: string
  endDatetime: string
  capacity?: number
  price?: number
  images: string[]
  tags: string[]
  status: 'DRAFT' | 'PUBLISHED' | 'CANCELLED' | 'COMPLETED'
  createdAt: string
  _count?: {
    attendees: number
  }
}

export interface Category {
  id: string
  name: string
  slug: string
  icon?: string
  parentId?: string
}

export interface AuthResponse {
  status: string
  message: string
  data: {
    user: User
    token: string
    refreshToken: string
  }
}

export interface ApiResponse<T = any> {
  status: 'success' | 'error'
  message: string
  data?: T
  errors?: any[]
}
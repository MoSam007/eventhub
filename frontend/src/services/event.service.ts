import api from './api'
import { Event, ApiResponse } from '../types'

export interface EventsResponse {
  events: Event[]
  pagination: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

export const eventService = {
  async getAllEvents(params?: {
    category?: string
    search?: string
    page?: number
    limit?: number
    status?: string
    minPrice?: number
    maxPrice?: number
  }): Promise<EventsResponse> {
    const response = await api.get<ApiResponse<EventsResponse>>('/events', { params })
    return response.data.data!
  },

  // 🔥 One universal fetcher (slug OR id)
  async getEvent(slugOrId: string): Promise<Event> {
    const response = await api.get<ApiResponse<{ event: Event }>>(`/events/${slugOrId}`)
    return response.data.data!.event
  },

  // Get host's own events
  async getMyEvents(params?: {
    search?: string
    status?: string
    page?: number
    limit?: number
  }): Promise<EventsResponse> {
    const response = await api.get<ApiResponse<EventsResponse>>('/events/my-events', { params })
    return response.data.data!
  },

  // Get all events for admin
  async getAllEventsAdmin(params?: {
    search?: string
    status?: string
    categoryId?: string
    page?: number
    limit?: number
  }): Promise<EventsResponse> {
    const response = await api.get<ApiResponse<EventsResponse>>('/admin/events', { params })
    return response.data.data!
  },

  async createEvent(eventData: {
    title: string
    description: string
    longDescription?: string
    categoryId: string
    location: string
    address: string
    latitude?: number
    longitude?: number
    date: string
    startTime: string
    endTime: string
    capacity?: number
    price?: number
    currency?: string
    images?: string[]
    tags?: string[]
    features?: Array<{ name: string }>
    faqs?: Array<{ question: string; answer: string }>
    scheduleItems?: Array<{ time: string; activity: string }>
    status?: string
  }): Promise<Event> {
    const response = await api.post<ApiResponse<{ event: Event }>>('/events', eventData)
    return response.data.data!.event
  },

  async uploadEventImages(files: File[]) {
    const formData = new FormData()
    files.forEach(file => formData.append('images', file))
    
    const response = await api.post('/upload/event-images', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return response.data
  },

  async updateEvent(id: string, eventData: Partial<Event>): Promise<Event> {
    const response = await api.put<ApiResponse<{ event: Event }>>(`/events/${id}`, eventData)
    return response.data.data!.event
  },

  async deleteEvent(id: string): Promise<void> {
    await api.delete(`/events/${id}`)
  },
}

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
  }): Promise<EventsResponse> {
    const response = await api.get<ApiResponse<EventsResponse>>('/events', { params })
    return response.data.data!
  },

  async getEventById(id: string): Promise<Event> {
    const response = await api.get<ApiResponse<{ event: Event }>>(`/events/${id}`)
    return response.data.data!.event
  },

  async createEvent(eventData: Partial<Event>): Promise<Event> {
    const response = await api.post<ApiResponse<{ event: Event }>>('/events', eventData)
    return response.data.data!.event
  },

  async updateEvent(id: string, eventData: Partial<Event>): Promise<Event> {
    const response = await api.put<ApiResponse<{ event: Event }>>(`/events/${id}`, eventData)
    return response.data.data!.event
  },

  async deleteEvent(id: string): Promise<void> {
    await api.delete(`/events/${id}`)
  },
}
import api from './api'
import { EventbriteEvent, ApiResponse } from '../types'

export const externalEventService = {
  async getEventbriteNairobiEvents(): Promise<EventbriteEvent[]> {
    const response = await api.get<ApiResponse<{ events: EventbriteEvent[] }>>('/external/eventbrite/nairobi')
    return response.data.data?.events || []
  }
}

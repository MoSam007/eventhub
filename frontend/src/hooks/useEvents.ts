import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { eventService } from '../services/event.service'

export interface EventQueryParams {
  category?: string
  search?: string
  page?: number
  limit?: number
  status?: string
  minPrice?: number
  maxPrice?: number
}

export const useEvents = (params: EventQueryParams = {}) => {
  return useQuery({
    queryKey: ['events', params],
    queryFn: () => eventService.getAllEvents(params),
    staleTime: 60_000,
    gcTime: 0,
    refetchOnWindowFocus: false,
  })
}

// Hook for host's own events
export const useMyEvents = (params: { search?: string; status?: string; page?: number; limit?: number } = {}) => {
  return useQuery({
    queryKey: ['my-events', params],
    queryFn: () => eventService.getMyEvents(params),
    staleTime: 60_000,
    refetchOnWindowFocus: false,
  })
}

// Hook for admin to get all events
export const useAdminEvents = (params: { search?: string; status?: string; categoryId?: string; page?: number; limit?: number } = {}) => {
  return useQuery({
    queryKey: ['admin-events', params],
    queryFn: () => eventService.getAllEventsAdmin(params),
    staleTime: 60_000,
    refetchOnWindowFocus: false,
  })
}

// slug OR uuid supported
export const useEvent = (slugOrId: string | undefined) => {
  return useQuery({
    queryKey: ['event', slugOrId],
    queryFn: () => eventService.getEvent(slugOrId!),
    enabled: !!slugOrId,
    staleTime: 60_000,
  })
}

export const useCreateEvent = () => {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: eventService.createEvent,
    onSuccess: (newEvent) => {
      qc.invalidateQueries({ queryKey: ['events'] })
      qc.invalidateQueries({ queryKey: ['my-events'] })
      qc.invalidateQueries({ queryKey: ['admin-events'] })
      qc.invalidateQueries({ queryKey: ['event', newEvent.slug] })
    },
  })
}

export const useUpdateEvent = () => {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (payload: { slugOrId: string; data: any }) =>
      eventService.updateEvent(payload.slugOrId, payload.data),

    onSuccess: (updatedEvent) => {
      qc.invalidateQueries({ queryKey: ['events'] })
      qc.invalidateQueries({ queryKey: ['my-events'] })
      qc.invalidateQueries({ queryKey: ['admin-events'] })
      qc.invalidateQueries({ queryKey: ['event', updatedEvent.slug] })
    },
  })
}

export const useDeleteEvent = () => {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: eventService.deleteEvent,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['events'] })
      qc.invalidateQueries({ queryKey: ['my-events'] })
      qc.invalidateQueries({ queryKey: ['admin-events'] })
    },
  })
}

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
    staleTime: 60_000, // 1 minute
    retry: 1,
  })
}

export const useEvent = (id: string | undefined) => {
  return useQuery({
    queryKey: ['event', id],
    queryFn: () => eventService.getEventById(id!),
    enabled: !!id,
    staleTime: 60_000,
  })
}

export const useCreateEvent = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: eventService.createEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] })
    },
  })
}

export const useUpdateEvent = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: { id: string; data: any }) =>
      eventService.updateEvent(payload.id, payload.data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['events'] })
      queryClient.invalidateQueries({ queryKey: ['event', id] })
    },
  })
}

export const useDeleteEvent = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: eventService.deleteEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] })
    },
  })
}

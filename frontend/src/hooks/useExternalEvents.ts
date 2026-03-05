import { useQuery } from '@tanstack/react-query'
import { externalEventService } from '../services/externalEvent.service'

export const useEventbriteNairobiEvents = () => {
  return useQuery({
    queryKey: ['eventbrite-events-nairobi'],
    queryFn: () => externalEventService.getEventbriteNairobiEvents(),
    staleTime: 1000 * 60 * 60, // 1 hour stale time for external events
    retry: 1
  })
}

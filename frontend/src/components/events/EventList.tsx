import { Event } from '../../types'
import EventCard from './EventCard'

interface EventListProps {
  events: Event[]
  isLoading?: boolean
  // cols prop allows customizing responsive columns, default kept same as before
  cols?: { sm?: number; lg?: number }
}

function buildGridCols(cols?: { sm?: number; lg?: number }) {
  const sm = cols?.sm ?? 2
  const lg = cols?.lg ?? 4
  return `grid grid-cols-1 sm:grid-cols-${sm} lg:grid-cols-${lg} gap-5`
}

export default function EventList({ events, isLoading, cols }: EventListProps) {
  if (isLoading) {
    return (
      <div className={buildGridCols(cols)}>
        {[...Array(4)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-200 h-48 rounded-t-lg" />
            <div className="bg-white p-4 rounded-b-lg border border-gray-200 border-t-0 space-y-3">
              <div className="h-5 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
              <div className="h-4 bg-gray-200 rounded w-2/3" />
              <div className="h-4 bg-gray-200 rounded w-1/3" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (!events || events.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-lg text-gray-600">
          No events found. Try adjusting your search criteria.
        </p>
      </div>
    )
  }

  return (
    <div className={buildGridCols(cols)}>
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  )
}

import { Link } from 'react-router-dom'
import Card from '../common/Card'
import { Event } from '../../types'

interface EventCardProps {
  event: Event
}

export default function EventCard({ event }: EventCardProps) {
  const startDate = new Date(event.startDatetime)
  const dayOfWeek = startDate.toLocaleDateString('en-US', { weekday: 'short' })
  const month = startDate.toLocaleDateString('en-US', { month: 'short' })
  const day = startDate.getDate()
  const time = startDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })

  return (
    <Link to={`/events/${event.id}`}>
      <Card hover className="h-full">
        {/* Image */}
        <div className="relative h-48 overflow-hidden bg-gray-100">
          <img
            src={event.images[0]}
            alt={event.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Title */}
          <h3 className="text-base font-semibold text-gray-900 mb-2 line-clamp-2 min-h-[3rem]">
            {event.title}
          </h3>

          {/* Date & Time */}
          <p className="text-sm text-gray-600 mb-1">
            {dayOfWeek}, {month} {day} · {time}
          </p>

          {/* Location */}
          <p className="text-sm text-gray-500 line-clamp-1 mb-3">
            {event.address}
          </p>

          {/* Price */}
          <div className="text-sm font-medium text-gray-900">
            {event.price === 0 || event.price === undefined ? 'Free' : `From Ksh. ${event.price.toLocaleString()}`}
          </div>
        </div>
      </Card>
    </Link>
  )
}

import { Link } from 'react-router-dom'
import Card from '../common/Card'
import { Event } from '../../types'
import { Calendar, MapPin, Users } from 'lucide-react'

interface EventCardProps {
  event: Event
}

export default function EventCard({ event }: EventCardProps) {
  const startDate = new Date(event.date || event.startDatetime)
  const dayOfWeek = startDate.toLocaleDateString('en-US', { weekday: 'short' })
  const month = startDate.toLocaleDateString('en-US', { month: 'short' })
  const day = startDate.getDate()
  const time = event.startTime || startDate.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit', 
    hour12: true 
  })

  // Get primary image
  const primaryImage = event.image || event.images[0] || 
    'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=300&fit=crop'

  return (
    <Link to={`/events/${event.id}`}>
      <Card hover className="h-full">
        {/* Image */}
        <div className="relative h-48 overflow-hidden bg-gray-100">
          <img
            src={primaryImage}
            alt={event.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {/* Status Badge */}
          {event.status && (
            <div className="absolute top-2 left-2">
              <span className={`px-2 py-1 rounded text-xs font-semibold ${
                event.status.toLowerCase() === 'upcoming' ? 'bg-green-100 text-green-800' :
                event.status.toLowerCase() === 'ongoing' ? 'bg-blue-100 text-blue-800' :
                event.status.toLowerCase() === 'completed' ? 'bg-gray-100 text-gray-800' :
                'bg-red-100 text-red-800'
              }`}>
                {event.status}
              </span>
            </div>
          )}
          {/* Price Badge */}
          {event.price !== undefined && (
            <div className="absolute top-2 right-2 bg-orange-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
              {event.price === 0 ? 'FREE' : `${event.currency || 'KES'} ${event.price.toLocaleString()}`}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Category */}
          {event.category && (
            <div className="text-xs text-orange-600 font-semibold mb-2">
              {event.category.name}
            </div>
          )}

          {/* Title */}
          <h3 className="text-base font-semibold text-gray-900 mb-2 line-clamp-2 min-h-[3rem] group-hover:text-orange-600 transition-colors">
            {event.title}
          </h3>

          {/* Description */}
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {event.description}
          </p>

          {/* Date & Time */}
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Calendar size={16} className="flex-shrink-0" />
              <span>{dayOfWeek}, {month} {day} · {time}</span>
            </div>

            {/* Location */}
            <div className="flex items-center gap-2">
              <MapPin size={16} className="flex-shrink-0" />
              <span className="line-clamp-1">{event.address || event.location}</span>
            </div>

            {/* Capacity */}
            {event.registered !== undefined && event.capacity && (
              <div className="flex items-center gap-2">
                <Users size={16} className="flex-shrink-0" />
                <span>{event.registered}/{event.capacity} registered</span>
              </div>
            )}
          </div>
        </div>
      </Card>
    </Link>
  )
}
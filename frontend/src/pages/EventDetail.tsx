import { useParams } from 'react-router-dom'
import { useEvent } from '../hooks/useEvents'
import { Calendar, MapPin, DollarSign } from 'lucide-react'
import Card from '../components/common/Card'
import Button from '../components/Button'
import { formatDate } from '../utils/helpers'

export default function EventDetail() {
  const { id } = useParams<{ id: string }>()
  const { data: event, isLoading } = useEvent(id!)

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-4xl mx-auto px-4 animate-pulse">
          <div className="h-96 bg-gray-300 dark:bg-gray-700 rounded-2xl mb-6" />
          <div className="space-y-4">
            <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-3/4" />
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded" />
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-5/6" />
          </div>
        </div>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <p className="text-gray-600 dark:text-gray-400">Event not found</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Image */}
        <div className="relative h-96 rounded-2xl overflow-hidden mb-8">
          {event.images[0] ? (
            <img
              src={event.images[0]}
              alt={event.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-9xl">
              {event.category?.icon || '🎉'}
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-6 left-6 text-white">
            <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium mb-2">
              {event.category?.name}
            </span>
            <h1 className="text-4xl font-bold">{event.title}</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  About This Event
                </h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                  {event.description}
                </p>
              </div>
            </Card>

            {/* Host Info */}
            {event.host && (
              <Card>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    Hosted By
                  </h3>
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-600 dark:text-primary-400 text-2xl font-bold">
                      {event.host.fullName[0]}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {event.host.fullName}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <div className="p-6 space-y-4">
                <div className="flex items-center space-x-3 text-gray-700 dark:text-gray-300">
                  <Calendar size={20} className="text-primary-600" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Date & Time</p>
                    <p className="font-medium">{formatDate(event.startDatetime, 'PPpp')}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 text-gray-700 dark:text-gray-300">
                  <MapPin size={20} className="text-primary-600" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Location</p>
                    <p className="font-medium">{event.address}</p>
                  </div>
                </div>

                {event.price !== undefined && (
                  <div className="flex items-center space-x-3 text-gray-700 dark:text-gray-300">
                    <DollarSign size={20} className="text-primary-600" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Price</p>
                      <p className="font-medium">
                        {event.price === 0 ? 'Free' : `$${event.price}`}
                      </p>
                    </div>
                  </div>
                )}

                <Button className="w-full" size='lg'>
                  Register Now
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
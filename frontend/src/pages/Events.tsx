import { useEffect, useState } from 'react'
import { Search } from 'lucide-react'
import EventList from '../components/events/EventList'
import { useEvents } from '../hooks/useEvents'
import { useEventbriteNairobiEvents } from '../hooks/useExternalEvents'
import { useSearchParams } from 'react-router-dom'
import { Event } from '../types'


export default function Events() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [page, setPage] = useState(1)
  const [searchParams] = useSearchParams()

  useEffect(() => {
    setSearchQuery(searchParams.get('search') || '')
    setSelectedCategory(searchParams.get('category') || '')
  }, [searchParams])

  const { data, isLoading, isFetching } = useEvents({
    search: searchQuery,
    category: selectedCategory,
    page,
    limit: 12
  })

  const { data: eventbriteData, isLoading: isEventbriteLoading } = useEventbriteNairobiEvents()

  const events = data?.events ?? []
  const totalPages = data?.pagination?.totalPages ?? 1

  // Map Eventbrite events to our internal Event type
  const mappedEventbriteEvents: Event[] = (eventbriteData || []).map(eb => ({
    id: eb.id,
    slug: eb.id, // Use ID as slug for external events
    title: eb.name.text,
    description: eb.description.text || '',
    categoryId: 'external',
    category: { id: 'external', name: 'Eventbrite', slug: 'eventbrite' },
    location: eb.venue?.name || 'Nairobi, Kenya',
    address: eb.venue?.address.address_1 || 'Nairobi, Kenya',
    startDatetime: eb.start.utc,
    endDatetime: eb.end.utc,
    image: eb.logo?.url,
    images: eb.logo ? [eb.logo.url] : [],
    tags: [],
    status: 'Upcoming',
    createdAt: new Date().toISOString(),
    externalUrl: eb.url
  }))

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Discover Events</h1>
        <p className="text-lg text-gray-600 mb-8">Find your next experience</p>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setPage(1) // reset to page 1
              }}
              className="w-full mx-auto pl-10 pr-4 py-3 border border-gray-300 rounded-full"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => {
                setSelectedCategory('')
                setPage(1)
              }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedCategory === ''
                  ? 'bg-gray-900 text-white'
                  : 'bg-white text-gray-700 border border-gray-300'
              }`}
            >
              All Events
            </button>

            {['tech', 'music', 'food', 'social', 'cultural', 'hiking', 
              'biking', 'clubbing', 'networking'
            ].map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat)
                  setPage(1)
                }}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all capitalize ${
                  selectedCategory === cat
                    ? 'bg-gray-900 text-white'
                    : 'bg-white text-gray-700 border border-gray-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-12">
          {/* Main Events List */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Explore on Venture</h2>
            
            {isLoading || isFetching ? (
              <EventList events={[]} isLoading={true} />
            ) : events.length === 0 ? (
              <div className="text-center py-16 bg-gray-50 rounded-xl">
                <p className="text-lg text-gray-600">
                  No local events found matching your criteria.
                </p>
              </div>
            ) : (
              <>
                <EventList events={events} />

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center mt-10">
                    <div className="flex items-center gap-3">
                      <button
                        disabled={page === 1}
                        onClick={() => setPage((p) => p - 1)}
                        className="px-4 py-2 border rounded disabled:opacity-50"
                      >
                        Previous
                      </button>
                      <span className="text-gray-600">
                        Page {page} of {totalPages}
                      </span>
                      <button
                        disabled={page === totalPages}
                        onClick={() => setPage((p) => p + 1)}
                        className="px-4 py-2 border rounded disabled:opacity-50"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Eventbrite Events Section */}
          <div className="pt-12 border-t border-gray-100">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Events from Eventbrite</h2>
                <p className="text-gray-600 mt-1">Discover more upcoming events in Nairobi from around the web</p>
              </div>
              <div className="hidden sm:block">
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/8/82/Eventbrite_logo.svg"
                  alt="Eventbrite" 
                  className="h-6"
                />
              </div>
            </div>
            
            {isEventbriteLoading ? (
              <EventList events={[]} isLoading={true} />
            ) : mappedEventbriteEvents.length === 0 ? (
              <div className="text-center py-16 bg-gray-50 rounded-xl">
                <p className="text-lg text-gray-600">
                  No upcoming events found on Eventbrite at the moment.
                </p>
              </div>
            ) : (
              <EventList events={mappedEventbriteEvents} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

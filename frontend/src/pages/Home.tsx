import EventList from '../components/events/EventList'
import HeroSlider from '../components/home/HeroSlider'
import FeaturedEvent from '../components/home/FeaturedEvent'
import Insights from '../components/home/Insights'
import { useEvents } from '../hooks/useEvents'
import { useEventbriteNairobiEvents } from '../hooks/useExternalEvents'
import { Event } from '../types'

export default function Home() {
  // Fetch events from backend
  const { data, isLoading } = useEvents({
    limit: 20,
    page: 1,
  })

  // Fetch Eventbrite events
  const { data: eventbriteData, isLoading: isEventbriteLoading } = useEventbriteNairobiEvents()

  const events = data?.events || []

  // Map Eventbrite events to our internal Event type
  const mappedEventbriteEvents: Event[] = (eventbriteData || []).slice(0, 4).map(eb => ({
    id: eb.id,
    slug: eb.id,
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

  // Derived sections
  const popularEvents = events.slice(0, 4)
  const freeEvents = events.filter(e => e.price === 0).slice(0, 4)
  const hikingEvents = events.slice(4, 8)
  const featured = events[2] // first event becomes featured

  return (
    <div className="min-h-screen bg-white">
      <HeroSlider />

      {/* Internal Events Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {isLoading ? (
          <div className="py-20 text-center">
            <p className="text-gray-600 text-lg">Loading local events...</p>
          </div>
        ) : events.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-gray-600 text-lg">No local events available yet.</p>
          </div>
        ) : (
          <>
            {/* Popular Events Section */}
            <section className="py-12 bg-white">
              <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 mb-8">
                Popular events in Nairobi
              </h2>
              <EventList events={popularEvents} cols={{ sm: 2, lg: 4 }} />
            </section>

            {/* Free Events Section */}
            <section className="py-12">
              <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 mb-8">
                Free events in Nairobi
              </h2>
              <EventList events={freeEvents} cols={{ sm: 2, lg: 4 }} />
            </section>

            {/* Featured Event */}
            {featured && (
              <section className="py-12">
                <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 mb-8">
                  Featured Event
                </h2>

                <FeaturedEvent
                  title={featured.title}
                  datetime={featured.startDatetime}
                  address={featured.address}
                  description={featured.description}
                  ctaLabel="Reserve a spot"
                  imageUrl={
                    featured.image ||
                    'https://images.unsplash.com/photo-1501492765677-f07c5f3d87db?w=1200&h=900&fit=crop'
                  }
                />
              </section>
            )}

            {/* Hiking Events */}
            <section className="py-12">
              <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 mb-8">
                Hiking events
              </h2>
              <EventList events={hikingEvents} cols={{ sm: 2, lg: 4 }} />
            </section>
          </>
        )}
      </div>

      {/* Eventbrite Section - Separate from internal loading/empty states */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900">
              Discover on Eventbrite
            </h2>
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/8/82/Eventbrite_logo.svg" 
              alt="Eventbrite" 
              className="h-6 opacity-60"
            />
          </div>
          
          {isEventbriteLoading ? (
            <div className="text-center py-10">
              <p className="text-gray-600">Loading Eventbrite events...</p>
            </div>
          ) : mappedEventbriteEvents.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-600">No events found on Eventbrite at the moment.</p>
            </div>
          ) : (
            <EventList events={mappedEventbriteEvents} cols={{ sm: 2, lg: 4 }} />
          )}
        </div>
      </section>

      {/* Insights & Others */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <section className="py-12 bg-white">
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 mb-8">
            Insights from Vendors
          </h2>
          <Insights />
        </section>
      </div>

          {/* CTA Section */}
          <section className="py-16 bg-gray-100">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Make your own event
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Create your event on EventHub and reach thousands of event-goers
              </p>
              <button className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-md font-medium transition-colors">
                Create Event
              </button>
            </div>
          </section>
    </div>
  )
}


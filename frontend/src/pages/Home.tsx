import EventList from '../components/events/EventList'
import HeroSlider from '../components/home/HeroSlider'
import FeaturedEvent from '../components/home/FeaturedEvent'
import Insights from '../components/home/Insights'
import { useEvents } from '../hooks/useEvents'

export default function Home() {
  // Fetch events from backend
  const { data, isLoading } = useEvents({
    limit: 20,
    page: 1,
  })

  const events = data?.events || []

  // Derived sections
  const popularEvents = events.slice(0, 4)
  const freeEvents = events.filter(e => e.price === 0).slice(0, 4)
  const hikingEvents = events.slice(4, 8)
  const featured = events[2] // first event becomes featured

  return (
    <div className="min-h-screen bg-white">
      <HeroSlider />

      {/* Loading State */}
      {isLoading && (
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <p className="text-gray-600 text-lg">Loading events...</p>
        </div>
      )}

      {!isLoading && events.length === 0 && (
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <p className="text-gray-600 text-lg">No events available yet.</p>
        </div>
      )}

      {!isLoading && events.length > 0 && (
        <>
          {/* Popular Events Section */}
          <section className="py-12 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 mb-8">
                Popular events in Nairobi
              </h2>
              <EventList events={popularEvents} cols={{ sm: 2, lg: 4 }} />
            </div>
          </section>

          {/* Free Events Section */}
          <section className="py-12 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 mb-8">
                Free events in Nairobi
              </h2>
              <EventList events={freeEvents} cols={{ sm: 2, lg: 4 }} />
            </div>
          </section>

          {/* Featured Event */}
          {featured && (
            <section className="py-12 bg-white">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
              </div>
            </section>
          )}

          {/* Hiking Events */}
          <section className="py-12 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 mb-8">
                Hiking events
              </h2>
              <EventList events={hikingEvents} cols={{ sm: 2, lg: 4 }} />
            </div>
          </section>

          {/* Insights */}
          <section className="py-12 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 mb-8">
                Insights from Vendors
              </h2>

              <Insights />
            </div>
          </section>

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
        </>
      )}
    </div>
  )
}

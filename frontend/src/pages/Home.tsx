import EventList from '../components/events/EventList'
import HeroSlider from '../components/home/HeroSlider'
import { DUMMY_EVENTS } from '../utils/dummyData'
import FeaturedEvent from '../components/home/FeaturedEvent'
import Insights from '../components/home/Insights'

export default function Home() {
  // Use dummy data for now - first 4 for popular, last 4 for free
  const popularEvents = DUMMY_EVENTS.slice(0, 4)
  const freeEvents = DUMMY_EVENTS.filter(e => e.price === 0).slice(0, 4)
  const hikingEvents = DUMMY_EVENTS.slice(0, 4) // for demo, reuse
  const featured = DUMMY_EVENTS[4] // pick one as featured

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Slider */}
      <HeroSlider />

      {/* Popular Events Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 mb-8">
            Popular events in Nairobi
          </h2>
          <EventList events={popularEvents} cols={{ sm:2, lg:4 }} />
        </div>
      </section>

      {/* Free Events Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 mb-8">
            Free events in Nairobi
          </h2>
          <EventList events={freeEvents} cols={{ sm:2, lg:4 }} />
        </div>
      </section>

      {/* Featured Events (new) */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 mb-8">
            Featured Events
          </h2>

          <FeaturedEvent
            title={featured.title}
            datetime={featured.startDatetime}
            address={featured.address}
            description={featured.description}
            ctaLabel="Reserve a spot"
            imageUrl="https://images.unsplash.com/photo-1501492765677-f07c5f3d87db?w=1200&h=900&fit=crop"
          />
        </div>
      </section>

      {/* Hiking events */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 mb-8">
            Hiking events
          </h2>
          <EventList events={hikingEvents} cols={{ sm:2, lg:4 }} />
        </div>
      </section>

      {/* Insights from Vendors */}
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
            Create your event on EventHub and reach millions of event-goers
          </p>
          <button className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-md font-medium transition-colors">
            Create Event
          </button>
        </div>
      </section>
    </div>
  )
}

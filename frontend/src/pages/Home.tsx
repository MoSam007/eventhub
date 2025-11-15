import EventList from '../components/events/EventList'
import HeroSlider from '../components/home/HeroSlider'
import { DUMMY_EVENTS } from '../utils/dummyData'

export default function Home() {
  // Use dummy data for now - first 4 for popular, last 4 for free
  const popularEvents = DUMMY_EVENTS.slice(0, 4)
  const freeEvents = DUMMY_EVENTS.filter(e => e.price === 0).slice(0, 4)

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Slider */}
      <HeroSlider />

      {/* Popular Events Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Popular events in Nairobi
          </h2>
          <EventList events={popularEvents} isLoading={false} />
        </div>
      </section>

      {/* Free Events Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Free events in Nairobi
          </h2>
          <EventList events={freeEvents} isLoading={false} />
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Browse by category
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              { name: 'Music', emoji: '🎵' },
              { name: 'Food & Drink', emoji: '🍽️' },
              { name: 'Arts', emoji: '🎨' },
              { name: 'Sports', emoji: '⚽' },
              { name: 'Tech', emoji: '💻' },
              { name: 'Business', emoji: '💼' },
              { name: 'Health', emoji: '🏃' },
              { name: 'Hobbies', emoji: '🎮' },
              { name: 'Travel', emoji: '✈️' },
              { name: 'Film', emoji: '🎬' },
              { name: 'Charity', emoji: '❤️' },
              { name: 'Family', emoji: '👨‍👩‍👧' },
            ].map((category) => (
              <button
                key={category.name}
                className="flex flex-col items-center justify-center p-6 bg-white border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-md transition-all"
              >
                <span className="text-4xl mb-2">{category.emoji}</span>
                <span className="text-sm font-medium text-gray-900">{category.name}</span>
              </button>
            ))}
          </div>
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
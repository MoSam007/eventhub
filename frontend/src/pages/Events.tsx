import { useEffect, useState } from 'react'
import { Search } from 'lucide-react'
import EventList from '../components/events/EventList'
import { useEvents } from '../hooks/useEvents'
import { useSearchParams } from 'react-router-dom'


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

  const events = data?.events ?? []
  const totalPages = data?.pagination?.totalPages ?? 1

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

        <EventList events={events} isLoading={isLoading || isFetching} />

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-10">
            <div className="flex items-center gap-3">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="px-4 py-2 border rounded disabled:opacity-50"
              >
                Prev
              </button>

              <span className="font-medium">
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
      </div>
    </div>
  )
}

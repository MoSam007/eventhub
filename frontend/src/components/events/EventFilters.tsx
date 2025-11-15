import { Search, SlidersHorizontal } from 'lucide-react'
import { EVENT_CATEGORIES } from '../../utils/constants'
import { useState } from 'react'

interface EventFiltersProps {
  searchQuery: string
  selectedCategory: string
  onSearchChange: (value: string) => void
  onCategoryChange: (value: string) => void
}

export default function EventFilters({
  searchQuery,
  selectedCategory,
  onSearchChange,
  onCategoryChange,
}: EventFiltersProps) {
  const [showAllCategories, setShowAllCategories] = useState(false)
  const visibleCategories = showAllCategories ? EVENT_CATEGORIES : EVENT_CATEGORIES.slice(0, 6)

  return (
    <div className="space-y-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      {/* Search */}
      <div>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search events by name, location, or keyword..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
          />
        </div>
      </div>

      {/* Categories */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="flex items-center text-lg font-semibold text-gray-900 dark:text-white">
            <SlidersHorizontal size={20} className="mr-2 text-primary-600" />
            Categories
          </h3>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          <button
            onClick={() => onCategoryChange('')}
            className={`group relative overflow-hidden px-4 py-3 rounded-xl text-sm font-medium transition-all ${
              selectedCategory === ''
                ? 'bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-lg shadow-primary-500/30'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            <div className="relative z-10 flex items-center justify-center">
              <span>All Events</span>
            </div>
            {selectedCategory === '' && (
              <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-primary-600 opacity-0 group-hover:opacity-20 transition-opacity" />
            )}
          </button>

          {visibleCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => onCategoryChange(category.id)}
              className={`group relative overflow-hidden px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                selectedCategory === category.id
                  ? 'bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-lg shadow-primary-500/30'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <div className="relative z-10 flex items-center justify-center space-x-2">
                <span className="text-lg">{category.icon}</span>
                <span className="hidden sm:inline">{category.name}</span>
              </div>
              {selectedCategory === category.id && (
                <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-primary-600 opacity-0 group-hover:opacity-20 transition-opacity" />
              )}
            </button>
          ))}
        </div>

        {EVENT_CATEGORIES.length > 6 && (
          <button
            onClick={() => setShowAllCategories(!showAllCategories)}
            className="mt-4 text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium"
          >
            {showAllCategories ? 'Show less' : `Show ${EVENT_CATEGORIES.length - 6} more categories`}
          </button>
        )}
      </div>
    </div>
  )
}
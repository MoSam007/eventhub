import { Link } from 'react-router-dom'
import { Search, MapPin, Menu, HelpCircle } from 'lucide-react'
import { useState } from 'react'
import { useAuthStore } from '../../store/authStore'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isHelpOpen, setIsHelpOpen] = useState(false)
  const { isAuthenticated, logout } = useAuthStore()

  return (
    <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="text-xl font-semibold text-gray-900">
            Events Hub
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden lg:flex items-center flex-1 max-w-xl mx-8">
            <div className="flex w-full border border-gray-300 rounded-md overflow-hidden bg-white shadow-sm">
              <div className="flex-1 flex items-center px-4 py-2 border-r border-gray-300">
                <input
                  type="text"
                  placeholder="Discover events"
                  className="w-full text-sm text-gray-600 placeholder-gray-400 focus:outline-none bg-transparent"
                />
              </div>
              <div className="flex items-center px-4 py-2 min-w-[180px]">
                <MapPin size={18} className="text-gray-400 mr-2 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Find Location"
                  className="w-full text-sm text-gray-600 placeholder-gray-400 focus:outline-none bg-transparent"
                />
              </div>
              <button className="px-4 hover:bg-gray-50 transition-colors border-l border-gray-300">
                <Search size={20} className="text-gray-600" />
              </button>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/events"
              className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
            >
              Events
            </Link>
            <Link
              to="/vendor/create-event"
              className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
            >
              Create Events
            </Link>
            <Link
              to="/vendor/dashboard"
              className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
            >
              Vendors
            </Link>

            {/* Help Menu */}
            <div className="relative">
              <button
                onClick={() => setIsHelpOpen(!isHelpOpen)}
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <Menu size={20} className="text-gray-700" />
              </button>
              
              {isHelpOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setIsHelpOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-20">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <div className="flex items-center text-gray-900">
                        <HelpCircle size={18} className="mr-2 text-gray-600" />
                        <span className="font-semibold text-sm">Help Center</span>
                      </div>
                    </div>
                    <Link
                      to="/vendor/signup"
                      className="block px-4 py-3 hover:bg-gray-50 transition-colors"
                      onClick={() => setIsHelpOpen(false)}
                    >
                      <div className="font-medium text-gray-900 text-sm">Become a Vendor</div>
                      <div className="text-xs text-gray-500 mt-0.5">FAQs on how to become a vendor</div>
                    </Link>
                    <Link
                      to="/help/find-events"
                      className="block px-4 py-3 hover:bg-gray-50 transition-colors"
                      onClick={() => setIsHelpOpen(false)}
                    >
                      <div className="font-medium text-gray-900 text-sm">Find Events</div>
                      <div className="text-xs text-gray-500 mt-0.5">FAQs on how to find events around you</div>
                    </Link>
                    <div className="border-t border-gray-100 mt-2 pt-2">
                      {isAuthenticated ? (
                        <>
                          <Link
                            to="/profile"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                            onClick={() => setIsHelpOpen(false)}
                          >
                            Profile
                          </Link>
                          <button
                            onClick={() => {
                              logout()
                              setIsHelpOpen(false)
                            }}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            Logout
                          </button>
                        </>
                      ) : (
                        <>
                          <Link
                            to="/login"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                            onClick={() => setIsHelpOpen(false)}
                          >
                            Login
                          </Link>
                          <Link
                            to="/signup"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                            onClick={() => setIsHelpOpen(false)}
                          >
                            Sign up
                          </Link>
                        </>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            <Menu size={24} />
          </button>
        </div>

        {/* Mobile Search & Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-4 border-t border-gray-200">
            <div className="flex w-full border border-gray-300 rounded-md overflow-hidden">
              <input
                type="text"
                placeholder="Discover events"
                className="flex-1 px-4 py-2 text-sm focus:outline-none"
              />
              <button className="px-4 hover:bg-gray-50">
                <Search size={20} />
              </button>
            </div>
            <Link
              to="/events"
              className="block text-gray-700 hover:text-gray-900 py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Events
            </Link>
            <Link
              to="/vendor/create-event"
              className="block text-gray-700 hover:text-gray-900 py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Create Events
            </Link>
            {isAuthenticated ? (
              <>
                <Link
                  to="/profile"
                  className="block text-gray-700 py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Profile
                </Link>
                <button
                  onClick={() => {
                    logout()
                    setIsMenuOpen(false)
                  }}
                  className="block text-red-600 py-2"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block text-gray-700 py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="block text-gray-700 py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
import { Link } from 'react-router-dom'
import { Search, MapPin, Menu, HelpCircle } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { useAuthStore } from '../../store/authStore'
import { useNavigate } from 'react-router-dom'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isHelpOpen, setIsHelpOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  
  const { isAuthenticated, logout, user } = useAuthStore()
  const navigate = useNavigate()
  const [keyword, setKeyword] = useState('')
  const [location, setLocation] = useState('')
  
  const helpMenuRef = useRef<HTMLDivElement>(null)
  const inactivityTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Get dashboard route based on user role
  const getDashboardRoute = () => {
    if (!user) return '/events'
    
    switch (user.role) {
      case 'ADMIN':
        return '/admin/dashboard'
      case 'HOST':
        return '/host/dashboard'
      case 'VENDOR':
        return '/vendor/dashboard'
      default:
        return '/events'
    }
  }

  // Check if user has a dashboard (not regular USER role)
  const hasDashboard = user && ['ADMIN', 'HOST', 'VENDOR'].includes(user.role)

  // Handle scroll behavior - hide on scroll down, show on scroll up
  useEffect(() => {
    let ticking = false

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY

          // Show navbar when scrolling up, hide when scrolling down
          if (currentScrollY < lastScrollY || currentScrollY < 10) {
            setIsVisible(true)
            resetInactivityTimer()
          } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
            setIsVisible(false)
          }

          setLastScrollY(currentScrollY)
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  // Inactivity timer - hide navbar after 10 seconds of no scroll
  const resetInactivityTimer = () => {
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current)
    }

    inactivityTimerRef.current = setTimeout(() => {
      if (window.scrollY > 100) {
        setIsVisible(false)
      }
    }, 10000) // 10 seconds
  }

  useEffect(() => {
    resetInactivityTimer()
    return () => {
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current)
      }
    }
  }, [])

  // Mouse movement resets inactivity timer
  useEffect(() => {
    const handleMouseMove = () => {
      if (!isVisible) {
        setIsVisible(true)
      }
      resetInactivityTimer()
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [isVisible])

  // Close help menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (helpMenuRef.current && !helpMenuRef.current.contains(event.target as Node)) {
        setIsHelpOpen(false)
      }
    }

    if (isHelpOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isHelpOpen])

  const handleSearch = () => {
    const params = new URLSearchParams()

    if (keyword) params.append('search', keyword)
    if (location) params.append('location', location)

    navigate(`/events?${params.toString()}`)
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-200 h-20 transition-transform duration-300 ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="text-xl font-semibold text-gray-900">
            Events Hub
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden lg:flex items-center flex-1 max-w-xl px-auto mx-auto">
            <div className="flex w-full border border-gray-300 rounded-full overflow-hidden bg-white shadow-sm font-inter h-10">
              <div className="flex-1 flex items-center px-4 py-2 border-r border-gray-300">
                <input
                  type="text"
                  placeholder="Discover events"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="w-full text-sm text-gray-600 placeholder-gray-400 focus:outline-none bg-transparent"
                />
              </div>
              <div className="flex items-center px-4 py-2 min-w-[180px]">
                <MapPin size={18} className="text-gray-400 mr-2 flex-shrink-0" />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="Find Location"
                  className="w-full text-sm text-gray-600 placeholder-gray-400 focus:outline-none bg-transparent"
                />
              </div>

              <button
                onClick={handleSearch}
                className="px-4 hover:bg-gray-50 transition-colors border-l border-gray-300"
              >
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
              to="/host/create-event"
              className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
            >
              Create Events
            </Link>

            {/* Help Menu */}
            <div className="relative" ref={helpMenuRef}>
              <button
                onClick={() => setIsHelpOpen(!isHelpOpen)}
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <Menu size={20} className="text-gray-700" />
              </button>

              {isHelpOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <div className="flex items-center text-gray-900">
                      <HelpCircle size={18} className="mr-2 text-gray-600" />
                      <span className="font-semibold text-sm">Help Center</span>
                    </div>
                  </div>

                  {/* Dashboard Link - Only for ADMIN, HOST, VENDOR */}
                  {isAuthenticated && hasDashboard && (
                    <>
                      <Link
                        to={getDashboardRoute()}
                        className="block px-4 py-3 hover:bg-gray-50 transition-colors"
                        onClick={() => setIsHelpOpen(false)}
                      >
                        <div className="font-medium text-gray-900 text-sm">My Dashboard</div>
                        <div className="text-xs text-gray-500 mt-0.5">
                          Go to your {user.role.toLowerCase()} dashboard
                        </div>
                      </Link>
                      <div className="border-t border-gray-100 my-2" />
                    </>
                  )}

                  <Link
                    to="/vendor/signup"
                    className="block px-4 py-3 hover:bg-gray-50 transition-colors"
                    onClick={() => setIsHelpOpen(false)}
                  >
                    <div className="font-medium text-gray-900 text-sm">Become a Vendor</div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      FAQs on how to become a vendor
                    </div>
                  </Link>
                  <Link
                    to="/help/find-events"
                    className="block px-4 py-3 hover:bg-gray-50 transition-colors"
                    onClick={() => setIsHelpOpen(false)}
                  >
                    <div className="font-medium text-gray-900 text-sm">Find Events</div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      FAQs on how to find events around you
                    </div>
                  </Link>
                  <Link
                    to="/help/find-vendors"
                    className="block px-4 py-3 hover:bg-gray-50 transition-colors"
                    onClick={() => setIsHelpOpen(false)}
                  >
                    <div className="font-medium text-gray-900 text-sm">Find Vendors</div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      FAQs on how to find vendors around you
                    </div>
                  </Link>
                  <Link
                    to="/help/host-events"
                    className="block px-4 py-3 hover:bg-gray-50 transition-colors"
                    onClick={() => setIsHelpOpen(false)}
                  >
                    <div className="font-medium text-gray-900 text-sm">Host Events</div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      How to host your own events
                    </div>
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
                          className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
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
          <div className="md:hidden py-4 space-y-4 border-t border-gray-200 bg-white">
            {/* Mobile Search */}
            <div className="space-y-2">
              <div className="flex w-full border border-gray-300 rounded-full overflow-hidden">
                <input
                  type="text"
                  placeholder="Discover events"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  className="flex-1 px-4 py-2 text-sm focus:outline-none"
                />
                <button
                  onClick={handleSearch}
                  className="px-4 hover:bg-gray-50 border-l border-gray-300"
                >
                  <Search size={20} />
                </button>
              </div>
              <div className="flex items-center border border-gray-300 rounded-full px-4 py-2">
                <MapPin size={18} className="text-gray-400 mr-2" />
                <input
                  type="text"
                  placeholder="Find Location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="flex-1 text-sm focus:outline-none"
                />
              </div>
            </div>

            {/* Mobile Navigation Links */}
            <div className="space-y-1">
              {/* Dashboard Link - Only for ADMIN, HOST, VENDOR */}
              {isAuthenticated && hasDashboard && (
                <>
                  <Link
                    to={getDashboardRoute()}
                    className="block text-gray-900 font-medium hover:bg-gray-50 py-2 px-2 rounded"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    My Dashboard
                  </Link>
                  <div className="border-t border-gray-200 my-2" />
                </>
              )}

              <Link
                to="/events"
                className="block text-gray-700 hover:bg-gray-50 py-2 px-2 rounded"
                onClick={() => setIsMenuOpen(false)}
              >
                Events
              </Link>
              <Link
                to="/host/create-event"
                className="block text-gray-700 hover:bg-gray-50 py-2 px-2 rounded"
                onClick={() => setIsMenuOpen(false)}
              >
                Create Events
              </Link>

              <div className="border-t border-gray-200 my-2" />

              <div className="px-4 py-3 border-b border-gray-100">
                    <div className="flex items-center text-gray-900">
                      <HelpCircle size={18} className="mr-2 text-gray-600" />
                      <span className="font-semibold text-sm uppercase">Help Center</span>
                    </div>
                  </div>
              <Link
                to="/vendor/signup"
                className="block text-gray-700 hover:bg-gray-50 py-2 px-2 rounded"
                onClick={() => setIsMenuOpen(false)}
              >
                Become a Vendor
              </Link>
              <Link
                to="/help/find-vendors"
                className="block text-gray-700 hover:bg-gray-50 py-2 px-2 rounded"
                onClick={() => setIsMenuOpen(false)}
              >
                Find Vendors
              </Link>
              <Link
                to="/help/host-events"
                className="block text-gray-700 hover:bg-gray-50 py-2 px-2 rounded"
                onClick={() => setIsMenuOpen(false)}
              >
                Host Events
              </Link>

              <div className="border-t border-gray-200 my-2" />

              {isAuthenticated ? (
                <>
                  <Link
                    to="/profile"
                    className="block text-gray-700 hover:bg-gray-50 py-2 px-2 rounded"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={() => {
                      logout()
                      setIsMenuOpen(false)
                    }}
                    className="block w-full text-left text-red-600 hover:bg-red-50 py-2 px-2 rounded"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="block text-gray-700 hover:bg-gray-50 py-2 px-2 rounded"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="block text-gray-700 hover:bg-gray-50 py-2 px-2 rounded"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
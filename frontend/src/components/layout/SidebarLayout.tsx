import { Outlet, Link, useLocation } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Calendar, 
  Settings, 
  Plus, 
  Users, 
  Store,
  Briefcase,
  LogOut,
  Menu,
  X
} from 'lucide-react'
import { useState } from 'react'
import { useAuthStore } from '../../store/authStore'

interface SidebarItem {
  name: string
  path: string
  icon: any
}

interface SidebarLayoutProps {
  role: 'ADMIN' | 'HOST' | 'VENDOR'
}

export default function SidebarLayout({ role }: SidebarLayoutProps) {
  const location = useLocation()
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const { user, logout } = useAuthStore()

  const menuItems: Record<string, SidebarItem[]> = {
    ADMIN: [
      { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
      { name: 'Users', path: '/admin/users', icon: Users },
      { name: 'Hosts', path: '/admin/hosts', icon: Briefcase },
      { name: 'Vendors', path: '/admin/vendors', icon: Store },
      { name: 'Events', path: '/admin/events', icon: Calendar },
      { name: 'Settings', path: '/admin/settings', icon: Settings },
    ],
    HOST: [
      { name: 'Dashboard', path: '/host/dashboard', icon: LayoutDashboard },
      { name: 'Create Event', path: '/host/create-event', icon: Plus },
      { name: 'My Events', path: '/host/events', icon: Calendar },
      { name: 'Vendor Bids', path: '/host/bids', icon: Store },
      { name: 'Settings', path: '/host/settings', icon: Settings },
    ],
    VENDOR: [
      { name: 'Dashboard', path: '/vendor/dashboard', icon: LayoutDashboard },
      { name: 'My Services', path: '/vendor/services', icon: Store },
      { name: 'Browse Events', path: '/vendor/events', icon: Calendar },
      { name: 'My Bids', path: '/vendor/bids', icon: Briefcase },
      { name: 'Settings', path: '/vendor/settings', icon: Settings },
    ],
  }

  const items = menuItems[role] || []

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`${
          isSidebarOpen ? 'w-64' : 'w-20'
        } bg-white border-r border-gray-200 transition-all duration-300 flex flex-col`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-200">
          {isSidebarOpen && (
            <Link to="/" className="text-xl font-bold text-orange-600">
              Events Hub
            </Link>
          )}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* User Info */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-semibold">
              {user?.fullName[0]}
            </div>
            {isSidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{user?.fullName}</p>
                <p className="text-xs text-gray-500 capitalize">{role.toLowerCase()}</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {items.map((item) => {
            const isActive = location.pathname === item.path
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-orange-50 text-orange-600'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <item.icon size={20} />
                {isSidebarOpen && <span className="font-medium">{item.name}</span>}
              </Link>
            )
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={logout}
            className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-red-600 hover:bg-red-50 w-full transition-colors"
          >
            <LogOut size={20} />
            {isSidebarOpen && <span className="font-medium">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

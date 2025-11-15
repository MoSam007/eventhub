import { Outlet, Link } from 'react-router-dom'
import { LayoutDashboard, Calendar, Settings, Plus } from 'lucide-react'
import Navbar from '../common/Navbar'

export default function DashboardLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <aside className="w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-4rem)]">
          <nav className="p-4 space-y-2">
            <Link
              to="/vendor/dashboard"
              className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors text-gray-700"
            >
              <LayoutDashboard size={20} />
              <span>Dashboard</span>
            </Link>
            <Link
              to="/vendor/create-event"
              className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors text-gray-700"
            >
              <Plus size={20} />
              <span>Create Event</span>
            </Link>
            <Link
              to="/vendor/events"
              className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors text-gray-700"
            >
              <Calendar size={20} />
              <span>My Events</span>
            </Link>
            <Link
              to="/vendor/settings"
              className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors text-gray-700"
            >
              <Settings size={20} />
              <span>Settings</span>
            </Link>
          </nav>
        </aside>

        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
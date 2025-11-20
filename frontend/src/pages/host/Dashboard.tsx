import { 
  Calendar, 
  Users, 
  TrendingUp, 
  DollarSign, 
  Plus,
  Eye,
  Edit,
  Trash2,
  Clock,
  MapPin
} from 'lucide-react'
import { Link } from 'react-router-dom'
import Card from '../../components/common/Card'
import Button from '../../components/Button'

export default function HostDashboard() {
  const stats = [
    { 
      label: 'Total Events', 
      value: '12', 
      change: '+2 this month', 
      icon: Calendar, 
      color: 'text-blue-600', 
      bg: 'bg-blue-50' 
    },
    { 
      label: 'Total Attendees', 
      value: '1,234', 
      change: '+15% from last month', 
      icon: Users, 
      color: 'text-green-600', 
      bg: 'bg-green-50' 
    },
    { 
      label: 'Revenue', 
      value: '$12,450', 
      change: '+23% from last month', 
      icon: DollarSign, 
      color: 'text-purple-600', 
      bg: 'bg-purple-50' 
    },
    { 
      label: 'Pending Bids', 
      value: '8', 
      change: '3 new bids', 
      icon: TrendingUp, 
      color: 'text-orange-600', 
      bg: 'bg-orange-50' 
    },
  ]

  const upcomingEvents = [
    {
      id: '1',
      title: 'Tech Meetup 2024',
      date: '2024-12-15',
      time: '18:00',
      location: 'iHub Nairobi',
      attendees: 45,
      capacity: 100,
      status: 'Published'
    },
    {
      id: '2',
      title: 'Startup Pitch Night',
      date: '2024-12-20',
      time: '19:00',
      location: 'The Alchemist',
      attendees: 32,
      capacity: 80,
      status: 'Published'
    },
    {
      id: '3',
      title: 'Business Networking',
      date: '2024-12-22',
      time: '17:30',
      location: 'Radisson Blu',
      attendees: 18,
      capacity: 50,
      status: 'Draft'
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Host Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage your events and track performance</p>
        </div>
        <Link to="/host/create-event">
          <Button size="lg">
            <Plus size={20} className="mr-2" />
            Create Event
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <Card key={i} className="hover:shadow-lg transition-shadow">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-gray-500 mt-2">{stat.change}</p>
                </div>
                <div className={`w-14 h-14 rounded-full ${stat.bg} flex items-center justify-center flex-shrink-0`}>
                  <stat.icon className={stat.color} size={28} />
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-all cursor-pointer border-2 border-transparent hover:border-orange-200">
          <Link to="/host/create-event" className="block p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center">
                <Plus className="text-orange-600" size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Create Event</h3>
                <p className="text-sm text-gray-600">Start a new event</p>
              </div>
            </div>
          </Link>
        </Card>

        <Card className="hover:shadow-lg transition-all cursor-pointer border-2 border-transparent hover:border-blue-200">
          <Link to="/host/bids" className="block p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
                <TrendingUp className="text-blue-600" size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Review Bids</h3>
                <p className="text-sm text-gray-600">8 pending bids</p>
              </div>
            </div>
          </Link>
        </Card>

        <Card className="hover:shadow-lg transition-all cursor-pointer border-2 border-transparent hover:border-green-200">
          <Link to="/host/events" className="block p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center">
                <Calendar className="text-green-600" size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">My Events</h3>
                <p className="text-sm text-gray-600">View all events</p>
              </div>
            </div>
          </Link>
        </Card>
      </div>

      {/* Upcoming Events */}
      <Card>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Upcoming Events</h2>
            <Link to="/host/events" className="text-orange-600 hover:text-orange-700 font-medium text-sm">
              View All →
            </Link>
          </div>

          <div className="space-y-4">
            {upcomingEvents.map((event) => (
              <div
                key={event.id}
                className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:border-orange-200 hover:shadow-md transition-all"
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="font-semibold text-gray-900">{event.title}</h3>
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                      event.status === 'Published' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {event.status}
                    </span>
                  </div>
                  <div className="flex items-center space-x-6 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <Clock size={16} />
                      <span>{new Date(event.date).toLocaleDateString()} at {event.time}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin size={16} />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users size={16} />
                      <span>{event.attendees}/{event.capacity}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <Eye size={18} className="text-gray-600" />
                  </button>
                  <button className="p-2 hover:bg-blue-50 rounded-lg transition-colors">
                    <Edit size={18} className="text-blue-600" />
                  </button>
                  <button className="p-2 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 size={18} className="text-red-600" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Registrations</h3>
            <div className="space-y-3">
              {[
                { name: 'John Doe', event: 'Tech Meetup 2024', time: '2 hours ago' },
                { name: 'Sarah Smith', event: 'Startup Pitch Night', time: '5 hours ago' },
                { name: 'Mike Johnson', event: 'Tech Meetup 2024', time: '1 day ago' },
              ].map((reg, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{reg.name}</p>
                    <p className="text-xs text-gray-500">{reg.event}</p>
                  </div>
                  <span className="text-xs text-gray-400">{reg.time}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Vendor Bids</h3>
            <div className="space-y-3">
              {[
                { vendor: 'Premium Catering', service: 'Catering', amount: '$1,200', status: 'Pending' },
                { vendor: 'Sound Masters', service: 'Audio Setup', amount: '$800', status: 'Pending' },
                { vendor: 'Photo Pro', service: 'Photography', amount: '$600', status: 'Accepted' },
              ].map((bid, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{bid.vendor}</p>
                    <p className="text-xs text-gray-500">{bid.service}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">{bid.amount}</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      bid.status === 'Accepted' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {bid.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
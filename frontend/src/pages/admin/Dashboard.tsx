import { Users, Briefcase, Store, Calendar} from 'lucide-react'
import Card from '../../components/common/Card'

export default function AdminDashboard() {
  const stats = [
    { label: 'Total Users', value: '1,234', change: '+12%', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Event Hosts', value: '156', change: '+8%', icon: Briefcase, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Service Vendors', value: '89', change: '+15%', icon: Store, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Active Events', value: '342', change: '+23%', icon: Calendar, color: 'text-orange-600', bg: 'bg-orange-50' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back, Admin</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <Card key={i} className="hover:shadow-lg transition-shadow">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-green-600 mt-2">{stat.change} from last month</p>
                </div>
                <div className={`w-14 h-14 rounded-full ${stat.bg} flex items-center justify-center`}>
                  <stat.icon className={stat.color} size={28} />
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {[
                { action: 'New user registered', user: 'john@example.com', time: '5 min ago' },
                { action: 'Event created', user: 'Host: Sarah Smith', time: '12 min ago' },
                { action: 'Vendor approved', user: 'vendor@example.com', time: '1 hour ago' },
                { action: 'Event published', user: 'Tech Meetup 2024', time: '2 hours ago' },
              ].map((activity, i) => (
                <div key={i} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                    <p className="text-xs text-gray-500">{activity.user}</p>
                  </div>
                  <span className="text-xs text-gray-400">{activity.time}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">User Growth</h3>
            <div className="h-64 flex items-end justify-between space-x-2">
              {[40, 65, 55, 80, 70, 90, 85].map((height, i) => (
                <div key={i} className="flex-1 bg-gradient-to-t from-orange-600 to-orange-400 rounded-t-lg" style={{ height: `${height}%` }} />
              ))}
            </div>
            <div className="flex justify-between mt-2 text-xs text-gray-500">
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
              <span>Sun</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
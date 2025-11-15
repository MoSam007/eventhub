import { Calendar, Users, TrendingUp, DollarSign } from 'lucide-react'
import Card from '../../components/common/Card'
import Button from '../../components/Button'
import { Link } from 'react-router-dom'

export default function VendorDashboard() {
  const stats = [
    { label: 'Total Events', value: '12', icon: Calendar, color: 'text-blue-600' },
    { label: 'Total Attendees', value: '1,234', icon: Users, color: 'text-green-600' },
    { label: 'Revenue', value: '$12,450', icon: DollarSign, color: 'text-purple-600' },
    { label: 'Growth', value: '+23%', icon: TrendingUp, color: 'text-orange-600' },
  ]

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <Link to="/vendor/create-event">
          <Button>Create New Event</Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <Card key={i}>
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                    {stat.value}
                  </p>
                </div>
                <stat.icon className={`${stat.color} w-12 h-12`} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Recent Events */}
      <Card>
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Recent Events
          </h2>
          <div className="text-center py-8 text-gray-600 dark:text-gray-400">
            <p>No events yet. Create your first event to get started!</p>
          </div>
        </div>
      </Card>
    </div>
  )
}

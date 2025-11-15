import { Link } from 'react-router-dom'
import Button from '../components/Button'
import { Home } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4">
      <div className="text-center space-y-8 max-w-lg">
        <div className="relative">
          <h1 className="text-9xl font-bold text-primary-600 dark:text-primary-400 opacity-20">404</h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-7xl">🔍</span>
          </div>
        </div>
        <h2 className="text-4xl font-bold text-gray-900 dark:text-white">
          Page Not Found
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Oops! The page you're looking for seems to have wandered off. Let's get you back on track.
        </p>
        <Link to="/">
          <Button size='lg' className="shadow-xl">
            <Home size={20} className="mr-2" />
            Go Back Home
          </Button>
        </Link>
      </div>
    </div>
  )
}
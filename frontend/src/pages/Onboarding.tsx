import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import Button from '../components/Button'
import { CheckCircle } from 'lucide-react'

const INTERESTS = [
  { id: 'music', name: 'Music & Concerts', emoji: '🎵' },
  { id: 'food', name: 'Food & Drink', emoji: '🍽️' },
  { id: 'tech', name: 'Technology', emoji: '💻' },
  { id: 'sports', name: 'Sports & Fitness', emoji: '⚽' },
  { id: 'arts', name: 'Arts & Culture', emoji: '🎨' },
  { id: 'business', name: 'Business & Networking', emoji: '💼' },
  { id: 'outdoor', name: 'Outdoor & Adventure', emoji: '🏔️' },
  { id: 'education', name: 'Education & Learning', emoji: '📚' },
  { id: 'wellness', name: 'Health & Wellness', emoji: '🧘' },
  { id: 'nightlife', name: 'Nightlife & Parties', emoji: '🌃' },
  { id: 'social', name: 'Social Hangouts', emoji: '👥' },
  { id: 'gaming', name: 'Gaming & Esports', emoji: '🎮' },
]

export default function Onboarding() {
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const [selectedInterests, setSelectedInterests] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const toggleInterest = (id: string) => {
    setSelectedInterests(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  const handleComplete = async () => {
    setIsSubmitting(true)
    // TODO: Save interests to user preferences
    console.log('User interests:', selectedInterests)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Redirect based on role
    if (user?.role === 'VENDOR') {
      navigate('/vendor/dashboard')
    } else {
      navigate('/events')
    }
  }

  const handleSkip = () => {
    if (user?.role === 'VENDOR') {
      navigate('/vendor/dashboard')
    } else {
      navigate('/events')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center px-4 py-12">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome to Events Hub, {user?.fullName}! 🎉
          </h1>
          <p className="text-xl text-gray-600">
            Let's personalize your experience. What are you interested in?
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Select at least 3 interests to get started
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
            {INTERESTS.map((interest) => {
              const isSelected = selectedInterests.includes(interest.id)
              return (
                <button
                  key={interest.id}
                  onClick={() => toggleInterest(interest.id)}
                  className={`relative p-6 rounded-xl border-2 transition-all text-center ${
                    isSelected
                      ? 'border-orange-600 bg-orange-50 shadow-md'
                      : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                  }`}
                >
                  {isSelected && (
                    <div className="absolute top-2 right-2">
                      <CheckCircle size={20} className="text-orange-600" />
                    </div>
                  )}
                  <div className="text-4xl mb-2">{interest.emoji}</div>
                  <div className="text-sm font-medium text-gray-900">
                    {interest.name}
                  </div>
                </button>
              )
            })}
          </div>

          <div className="flex justify-between items-center">
            <button
              onClick={handleSkip}
              className="text-gray-600 hover:text-gray-900 font-medium"
            >
              Skip for now
            </button>
            <Button
              onClick={handleComplete}
              disabled={selectedInterests.length < 3}
              isLoading={isSubmitting}
              size="lg"
            >
              Continue ({selectedInterests.length}/3)
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
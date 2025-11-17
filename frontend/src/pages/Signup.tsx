import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import Input from '../components/common/Input'
import Button from '../components/Button'
import { Mail, Lock, User, Phone, Users, Briefcase } from 'lucide-react'

type UserRole = 'USER' | 'VENDOR'

export default function Signup() {
  const [step, setStep] = useState<1 | 2>(1)
  const [selectedRole, setSelectedRole] = useState<UserRole>('USER')
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const { register, isRegistering, registerError } = useAuth()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' })
    }
  }

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {}

    if (formData.fullName.length < 2) {
      newErrors.fullName = 'Name must be at least 2 characters'
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email address'
    }

    if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    if (formData.phone && formData.phone.length > 0) {
      const phoneRegex = /^[\d\s\+\-\(\)]+$/
      if (!phoneRegex.test(formData.phone)) {
        newErrors.phone = 'Invalid phone number format'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNextStep = () => {
    if (validateStep1()) {
      setStep(2)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const registrationData = {
      fullName: formData.fullName,
      email: formData.email,
      password: formData.password,
      phone: formData.phone.trim() || undefined,
      role: selectedRole,
    }
    console.log('Submitting registration:', registrationData)
    register(registrationData)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center justify-center text-orange-600 mb-4">
            <div className="text-4xl font-bold">Events Hub</div>
          </Link>
          <h2 className="text-3xl font-bold text-gray-900">Create Account</h2>
          <p className="text-gray-600 mt-2">
            {step === 1 ? 'Enter your details to get started' : 'Choose your account type'}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          {/* Progress Indicator */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                step >= 1 ? 'bg-orange-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                1
              </div>
              <div className={`w-24 h-1 ${step >= 2 ? 'bg-orange-600' : 'bg-gray-200'}`} />
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                step >= 2 ? 'bg-orange-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                2
              </div>
            </div>
          </div>

          {registerError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-600 mb-6">
              Registration failed. Please check your information and try again.
            </div>
          )}

          {/* Step 1: Basic Info */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="relative">
                <User className="absolute left-3 top-10 text-gray-400 z-10" size={20} />
                <Input
                  label="Full Name"
                  name="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="John Doe"
                  error={errors.fullName}
                  required
                  className="pl-10"
                />
              </div>

              <div className="relative">
                <Mail className="absolute left-3 top-10 text-gray-400 z-10" size={20} />
                <Input
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  error={errors.email}
                  required
                  className="pl-10"
                />
              </div>

              <div className="relative">
                <Phone className="absolute left-3 top-10 text-gray-400 z-10" size={20} />
                <Input
                  label="Phone (Optional)"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+254 700 000 000"
                  error={errors.phone}
                  className="pl-10"
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-10 text-gray-400 z-10" size={20} />
                <Input
                  label="Password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  error={errors.password}
                  helperText="At least 8 characters"
                  required
                  className="pl-10"
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-10 text-gray-400 z-10" size={20} />
                <Input
                  label="Confirm Password"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  error={errors.confirmPassword}
                  required
                  className="pl-10"
                />
              </div>

              <Button
                type="button"
                onClick={handleNextStep}
                className="w-full mt-6"
                size="lg"
              >
                Next Step
              </Button>
            </div>
          )}

          {/* Step 2: Role Selection */}
          {step === 2 && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  How do you plan to use Events Hub?
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Attendee Option */}
                  <button
                    type="button"
                    onClick={() => setSelectedRole('USER')}
                    className={`p-6 rounded-xl border-2 transition-all text-left ${
                      selectedRole === 'USER'
                        ? 'border-orange-600 bg-orange-50 shadow-md'
                        : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                    }`}
                  >
                    <div className="flex items-start space-x-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        selectedRole === 'USER' ? 'bg-orange-600 text-white' : 'bg-gray-100 text-gray-600'
                      }`}>
                        <Users size={24} />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-2">I'm an Attendee</h4>
                        <p className="text-sm text-gray-600">
                          Discover and attend amazing local events, concerts, workshops, and more.
                        </p>
                        <ul className="mt-3 space-y-1 text-sm text-gray-500">
                          <li>✓ Browse events</li>
                          <li>✓ Save favorites</li>
                          <li>✓ Get recommendations</li>
                        </ul>
                      </div>
                    </div>
                  </button>

                  {/* Host/Vendor Option */}
                  <button
                    type="button"
                    onClick={() => setSelectedRole('VENDOR')}
                    className={`p-6 rounded-xl border-2 transition-all text-left ${
                      selectedRole === 'VENDOR'
                        ? 'border-orange-600 bg-orange-50 shadow-md'
                        : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                    }`}
                  >
                    <div className="flex items-start space-x-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        selectedRole === 'VENDOR' ? 'bg-orange-600 text-white' : 'bg-gray-100 text-gray-600'
                      }`}>
                        <Briefcase size={24} />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-2">I'm a Host/Organizer</h4>
                        <p className="text-sm text-gray-600">
                          Create and manage events, reach more attendees, and grow your business.
                        </p>
                        <ul className="mt-3 space-y-1 text-sm text-gray-500">
                          <li>✓ Create events</li>
                          <li>✓ Manage bookings</li>
                          <li>✓ Analytics dashboard</li>
                        </ul>
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              <div className="flex space-x-4">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setStep(1)}
                  className="flex-1"
                  size="lg"
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  className="flex-1"
                  size="lg"
                  isLoading={isRegistering}
                >
                  Create Account
                </Button>
              </div>
            </form>
          )}

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-orange-600 hover:text-orange-700">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

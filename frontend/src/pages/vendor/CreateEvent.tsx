import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCreateEvent } from '../../hooks/useEvents'
import Card from '../../components/common/Card'
import Input from '../../components/common/Input'
import Button from '../../components/Button'
import { EVENT_CATEGORIES } from '../../utils/constants'

export default function CreateEvent() {
  const navigate = useNavigate()
  const { mutate: createEvent, isPending } = useCreateEvent()

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    categoryId: '',
    address: '',
    startDatetime: '',
    endDatetime: '',
    capacity: '',
    price: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    createEvent(
      {
        ...formData,
        capacity: formData.capacity ? parseInt(formData.capacity) : undefined,
        price: formData.price ? parseFloat(formData.price) : 0,
        images: [],
        tags: [],
        location: 'POINT(0 0)', // TODO: Implement proper geolocation
      },
      {
        onSuccess: () => {
          navigate('/vendor/dashboard')
        },
      }
    )
  }

  return (
    <div className="max-w-3xl">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        Create New Event
      </h1>

      <Card>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <Input
            label="Event Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description
            </label>
            <textarea
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Category
            </label>
            <select
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              value={formData.categoryId}
              onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
              required
            >
              <option value="">Select a category</option>
              {EVENT_CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.icon} {cat.name}
                </option>
              ))}
            </select>
          </div>

          <Input
            label="Address"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Start Date & Time"
              type="datetime-local"
              value={formData.startDatetime}
              onChange={(e) => setFormData({ ...formData, startDatetime: e.target.value })}
              required
            />
            <Input
              label="End Date & Time"
              type="datetime-local"
              value={formData.endDatetime}
              onChange={(e) => setFormData({ ...formData, endDatetime: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Capacity (Optional)"
              type="number"
              value={formData.capacity}
              onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
            />
            <Input
              label="Price ($)"
              type="number"
              step="0.01"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              helperText="Leave as 0 for free events"
            />
          </div>

          <div className="flex space-x-4">
            <Button type="submit" isLoading={isPending}>
              Create Event
            </Button>
            <Button type="button" variant="ghost" onClick={() => navigate('/vendor/dashboard')}>
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}            
import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { 
  MapPin, Users, DollarSign, Calendar, Clock, Upload, X, Plus, 
  Image as ImageIcon, Tag, List, HelpCircle, Check, ArrowLeft,
  Loader2, Save, AlertCircle
} from 'lucide-react'
import { eventService } from '../../services/event.service'
import api from '../../services/api'

interface FAQ { id: string; question: string; answer: string }
interface ScheduleItem { id: string; time: string; activity: string }
interface Feature { id: string; name: string }

export default function AdminEditEvent() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const queryClient = useQueryClient()
  
  const [step, setStep] = useState(1)
  const [previewImages, setPreviewImages] = useState<string[]>([])
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [hasChanges, setHasChanges] = useState(false)
  
  const [formData, setFormData] = useState({
    title: '', description: '', longDescription: '', categoryId: '', address: '', location: '',
    latitude: '', longitude: '', date: '', startTime: '', endTime: '', capacity: '',
    price: '', currency: 'KES', status: 'DRAFT', tags: [] as string[], features: [] as Feature[],
    faqs: [] as FAQ[], scheduleItems: [] as ScheduleItem[]
  })

  const [currentTag, setCurrentTag] = useState('')
  const [currentFeature, setCurrentFeature] = useState('')
  const [currentFaq, setCurrentFaq] = useState({ question: '', answer: '' })
  const [currentSchedule, setCurrentSchedule] = useState({ time: '', activity: '' })

  // Fetch event data
  const { data: eventData, isLoading: isLoadingEvent } = useQuery({
    queryKey: ['event', id],
    queryFn: () => eventService.getEvent(id!),
    enabled: !!id
  })

  // Fetch categories
  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await api.get('/categories')
      return response.data
    }
  })

  const categories = categoriesData?.data?.categories || []

  // Load event data into form
  useEffect(() => {
    if (eventData) {
      const event = eventData
      setFormData({
        title: event.title || '',
        description: event.description || '',
        longDescription: event.longDescription || '',
        categoryId: event.categoryId || '',
        address: event.address || '',
        location: event.location || '',
        latitude: event.latitude?.toString() || '',
        longitude: event.longitude?.toString() || '',
        date: event.date ? new Date(event.date).toISOString().split('T')[0] : '',
        startTime: event.startTime || '',
        endTime: event.endTime || '',
        capacity: event.capacity?.toString() || '',
        price: event.price?.toString() || '',
        currency: event.currency || 'KES',
        status: event.status || 'DRAFT',
        tags: event.tags || [],
        features: (event.features || []).map((f: any, i: number) => ({ 
          id: f.id || `feat-${i}`, 
          name: f.name 
        })),
        faqs: (event.faqs || []).map((f: any, i: number) => ({ 
          id: f.id || `faq-${i}`, 
          question: f.question, 
          answer: f.answer 
        })),
        scheduleItems: (event.scheduleItems || []).map((s: any, i: number) => ({ 
          id: s.id || `sched-${i}`, 
          time: s.time, 
          activity: s.activity 
        }))
      })
      setPreviewImages(event.images || (event.image ? [event.image] : []))
    }
  }, [eventData])

  // Update event mutation
  const updateEventMutation = useMutation({
    mutationFn: async (data: any) => {
      let uploadedImages: string[] = previewImages

      // Upload new images if any
      if (imageFiles.length > 0) {
        const uploadResult = await eventService.uploadEventImages(imageFiles)
        uploadedImages = uploadResult.data.urls || previewImages
      }

      const eventData = {
        ...data,
        images: uploadedImages,
        features: data.features.map((f: Feature) => ({ name: f.name })),
        latitude: data.latitude ? parseFloat(data.latitude) : undefined,
        longitude: data.longitude ? parseFloat(data.longitude) : undefined,
        capacity: data.capacity ? parseInt(data.capacity) : undefined,
        price: data.price ? parseFloat(data.price) : 0,
      }

      return eventService.updateEvent(id!, eventData)
    },
    onSuccess: (updatedEvent) => {
      queryClient.invalidateQueries({ queryKey: ['event', id] })
      queryClient.invalidateQueries({ queryKey: ['admin-events'] })
      
      const slugOrId = updatedEvent?.slug || updatedEvent?.id || id
      navigate(`/events/${slugOrId}`)
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || 'Failed to update event')
    }
  })

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      const filesArray = Array.from(files)
      setImageFiles(prev => [...prev, ...filesArray])
      setHasChanges(true)
      
      filesArray.forEach(file => {
        const reader = new FileReader()
        reader.onloadend = () => {
          setPreviewImages(prev => [...prev, reader.result as string])
        }
        reader.readAsDataURL(file)
      })
    }
  }

  const removeImage = (index: number) => {
    setPreviewImages(prev => prev.filter((_, i) => i !== index))
    setImageFiles(prev => prev.filter((_, i) => i !== index))
    setHasChanges(true)
  }

  const addTag = () => {
    if (currentTag && !formData.tags.includes(currentTag)) {
      setFormData(prev => ({ ...prev, tags: [...prev.tags, currentTag] }))
      setCurrentTag('')
      setHasChanges(true)
    }
  }
  const removeTag = (tag: string) => {
    setFormData(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }))
    setHasChanges(true)
  }
  
  const addFeature = () => {
    if (currentFeature) {
      setFormData(prev => ({ 
        ...prev, 
        features: [...prev.features, { id: Date.now().toString(), name: currentFeature }] 
      }))
      setCurrentFeature('')
      setHasChanges(true)
    }
  }
  const removeFeature = (id: string) => {
    setFormData(prev => ({ ...prev, features: prev.features.filter(f => f.id !== id) }))
    setHasChanges(true)
  }
  
  const addFaq = () => {
    if (currentFaq.question && currentFaq.answer) {
      setFormData(prev => ({ 
        ...prev, 
        faqs: [...prev.faqs, { ...currentFaq, id: Date.now().toString() }] 
      }))
      setCurrentFaq({ question: '', answer: '' })
      setHasChanges(true)
    }
  }
  const removeFaq = (id: string) => {
    setFormData(prev => ({ ...prev, faqs: prev.faqs.filter(f => f.id !== id) }))
    setHasChanges(true)
  }
  
  const addScheduleItem = () => {
    if (currentSchedule.time && currentSchedule.activity) {
      setFormData(prev => ({ 
        ...prev, 
        scheduleItems: [...prev.scheduleItems, { ...currentSchedule, id: Date.now().toString() }] 
      }))
      setCurrentSchedule({ time: '', activity: '' })
      setHasChanges(true)
    }
  }
  const removeScheduleItem = (id: string) => {
    setFormData(prev => ({ ...prev, scheduleItems: prev.scheduleItems.filter(s => s.id !== id) }))
    setHasChanges(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateEventMutation.mutate(formData)
  }

  const validateStep = () => {
    if (step === 1) return formData.title && formData.description && formData.categoryId
    if (step === 2) return formData.address && formData.date && formData.startTime && formData.endTime
    return true
  }

  if (isLoadingEvent) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
      </div>
    )
  }

  if (!eventData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Event Not Found</h2>
          <button
            onClick={() => navigate('/admin/events')}
            className="text-orange-600 hover:underline"
          >
            Back to Events
          </button>
        </div>
      </div>
    )
  }

  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft size={20} />
              <span className="hidden sm:inline">Back</span>
            </button>
            <h1 className="text-lg sm:text-2xl font-bold text-gray-900">Edit Event</h1>
            <button
              onClick={handleSubmit}
              disabled={updateEventMutation.isPending || !hasChanges}
              className="flex items-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
            >
              {updateEventMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save size={18} />
              )}
              <span className="hidden sm:inline">Save Changes</span>
              <span className="sm:hidden">Save</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Progress Indicator */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center justify-center overflow-x-auto pb-2">
            {[1, 2, 3, 4, 5].map((num) => (
              <div key={num} className="flex items-center">
                <button
                  onClick={() => setStep(num)}
                  className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-semibold text-xs sm:text-sm transition-colors ${
                    step >= num 
                      ? 'bg-orange-600 text-white' 
                      : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                  }`}
                >
                  {num}
                </button>
                {num < 5 && (
                  <div className={`w-8 sm:w-20 h-1 transition-colors ${
                    step > num ? 'bg-orange-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-3 text-[10px] sm:text-sm text-gray-600 px-1">
            <span>Basic</span>
            <span>Details</span>
            <span>Media</span>
            <span>Content</span>
            <span>Review</span>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <form onSubmit={handleSubmit} className="p-4 sm:p-8">
            
            {/* Step 1: Basic Info */}
            {step === 1 && (
              <div className="space-y-4 sm:space-y-6">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">Basic Information</h2>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Event Title *</label>
                  <input 
                    type="text" 
                    value={formData.title} 
                    onChange={(e) => {
                      setFormData({ ...formData, title: e.target.value })
                      setHasChanges(true)
                    }}
                    placeholder="e.g., Tech Innovation Summit 2024" 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" 
                    required 
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Short Description *</label>
                  <textarea 
                    value={formData.description} 
                    onChange={(e) => {
                      setFormData({ ...formData, description: e.target.value })
                      setHasChanges(true)
                    }}
                    rows={3} 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" 
                    placeholder="Brief description of your event" 
                    required 
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                    <select 
                      value={formData.categoryId} 
                      onChange={(e) => {
                        setFormData({ ...formData, categoryId: e.target.value })
                        setHasChanges(true)
                      }}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" 
                      required
                    >
                      <option value="">Select category</option>
                      {categories.map((cat: any) => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status *</label>
                    <select 
                      value={formData.status} 
                      onChange={(e) => {
                        setFormData({ ...formData, status: e.target.value })
                        setHasChanges(true)
                      }}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      <option value="DRAFT">Draft</option>
                      <option value="UPCOMING">Upcoming</option>
                      <option value="ONGOING">Ongoing</option>
                      <option value="COMPLETED">Completed</option>
                      <option value="CANCELLED">Cancelled</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <button 
                    type="button" 
                    onClick={() => validateStep() && setStep(2)} 
                    disabled={!validateStep()}
                    className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:bg-gray-300 font-medium transition-colors"
                  >
                    Next →
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Location & Time */}
            {step === 2 && (
              <div className="space-y-4 sm:space-y-6">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">Location & Time</h2>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MapPin size={16} className="inline mr-1" />
                    Venue Name *
                  </label>
                  <input 
                    type="text" 
                    value={formData.location} 
                    onChange={(e) => {
                      setFormData({ ...formData, location: e.target.value })
                      setHasChanges(true)
                    }}
                    placeholder="e.g., Nairobi Convention Centre" 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" 
                    required 
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Address *</label>
                  <input 
                    type="text" 
                    value={formData.address} 
                    onChange={(e) => {
                      setFormData({ ...formData, address: e.target.value })
                      setHasChanges(true)
                    }}
                    placeholder="Street, City, Country" 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" 
                    required 
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Latitude</label>
                    <input 
                      type="number" 
                      step="any" 
                      value={formData.latitude} 
                      onChange={(e) => {
                        setFormData({ ...formData, latitude: e.target.value })
                        setHasChanges(true)
                      }}
                      placeholder="-1.286389" 
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Longitude</label>
                    <input 
                      type="number" 
                      step="any" 
                      value={formData.longitude} 
                      onChange={(e) => {
                        setFormData({ ...formData, longitude: e.target.value })
                        setHasChanges(true)
                      }}
                      placeholder="36.817223" 
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Calendar size={16} className="inline mr-1" />
                      Date *
                    </label>
                    <input 
                      type="date" 
                      value={formData.date} 
                      onChange={(e) => {
                        setFormData({ ...formData, date: e.target.value })
                        setHasChanges(true)
                      }}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" 
                      required 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Clock size={16} className="inline mr-1" />
                      Start *
                    </label>
                    <input 
                      type="time" 
                      value={formData.startTime} 
                      onChange={(e) => {
                        setFormData({ ...formData, startTime: e.target.value })
                        setHasChanges(true)
                      }}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" 
                      required 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">End *</label>
                    <input 
                      type="time" 
                      value={formData.endTime} 
                      onChange={(e) => {
                        setFormData({ ...formData, endTime: e.target.value })
                        setHasChanges(true)
                      }}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" 
                      required 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Users size={16} className="inline mr-1" />
                      Capacity
                    </label>
                    <input 
                      type="number" 
                      value={formData.capacity} 
                      onChange={(e) => {
                        setFormData({ ...formData, capacity: e.target.value })
                        setHasChanges(true)
                      }}
                      placeholder="Max attendees" 
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <DollarSign size={16} className="inline mr-1" />
                      Price
                    </label>
                    <div className="flex gap-2">
                      <select 
                        value={formData.currency} 
                        onChange={(e) => {
                          setFormData({ ...formData, currency: e.target.value })
                          setHasChanges(true)
                        }}
                        className="px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      >
                        <option value="KES">KES</option>
                        <option value="USD">USD</option>
                      </select>
                      <input 
                        type="number" 
                        value={formData.price} 
                        onChange={(e) => {
                          setFormData({ ...formData, price: e.target.value })
                          setHasChanges(true)
                        }}
                        placeholder="0 for free" 
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" 
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-between pt-4">
                  <button 
                    type="button" 
                    onClick={() => setStep(1)}
                    className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium transition-colors"
                  >
                    ← Back
                  </button>
                  <button 
                    type="button" 
                    onClick={() => validateStep() && setStep(3)} 
                    disabled={!validateStep()}
                    className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:bg-gray-300 font-medium transition-colors"
                  >
                    Next →
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Images */}
            {step === 3 && (
              <div className="space-y-4 sm:space-y-6">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">Images & Media</h2>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <ImageIcon size={16} className="inline mr-1" />
                    Event Images
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-orange-500 transition-colors">
                    <input 
                      type="file" 
                      accept="image/*" 
                      multiple 
                      onChange={handleImageUpload} 
                      className="hidden" 
                      id="img-up" 
                    />
                    <label htmlFor="img-up" className="cursor-pointer">
                      <Upload className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                      <p className="text-sm text-gray-600">Click or drag images here</p>
                      <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 10MB</p>
                    </label>
                  </div>
                </div>

                {previewImages.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {previewImages.map((img, i) => (
                      <div key={i} className="relative group">
                        <img 
                          src={img} 
                          alt={`Preview ${i}`} 
                          className="w-full h-32 object-cover rounded-lg border border-gray-200" 
                        />
                        <button 
                          type="button" 
                          onClick={() => removeImage(i)} 
                          className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600"
                        >
                          <X size={16} />
                        </button>
                        {i === 0 && (
                          <span className="absolute bottom-2 left-2 bg-orange-600 text-white text-xs px-2 py-1 rounded font-medium">
                            Primary
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex justify-between pt-4">
                  <button 
                    type="button" 
                    onClick={() => setStep(2)}
                    className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium transition-colors"
                  >
                    ← Back
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setStep(4)}
                    className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-medium transition-colors"
                  >
                    Next →
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: Content */}
            {step === 4 && (
              <div className="space-y-6 sm:space-y-8">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">Additional Content</h2>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Detailed Description</label>
                  <textarea 
                    value={formData.longDescription} 
                    onChange={(e) => {
                      setFormData({ ...formData, longDescription: e.target.value })
                      setHasChanges(true)
                    }}
                    rows={6} 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 font-mono text-sm" 
                    placeholder="Detailed description with HTML formatting..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Tag size={16} className="inline mr-1" />
                    Tags
                  </label>
                  <div className="flex gap-2 mb-3">
                    <input 
                      type="text" 
                      value={currentTag} 
                      onChange={(e) => setCurrentTag(e.target.value)} 
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())} 
                      placeholder="Add tag" 
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" 
                    />
                    <button 
                      type="button" 
                      onClick={addTag} 
                      className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                    >
                      <Plus size={20} />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map(tag => (
                      <span key={tag} className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                        #{tag}
                        <button type="button" onClick={() => removeTag(tag)} className="hover:text-orange-900">
                          <X size={14} />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Check size={16} className="inline mr-1" />
                    Features
                  </label>
                  <div className="flex gap-2 mb-3">
                    <input 
                      type="text" 
                      value={currentFeature} 
                      onChange={(e) => setCurrentFeature(e.target.value)} 
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())} 
                      placeholder="e.g., WiFi Available" 
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" 
                    />
                    <button 
                      type="button" 
                      onClick={addFeature} 
                      className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                    >
                      <Plus size={20} />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {formData.features.map(f => (
                      <div key={f.id} className="flex items-center justify-between bg-green-50 px-3 py-2 rounded-lg">
                        <span className="text-sm text-green-800 flex items-center gap-2">
                          <Check size={16} className="text-green-600" />
                          {f.name}
                        </span>
                        <button 
                          type="button" 
                          onClick={() => removeFeature(f.id)} 
                          className="text-red-600 hover:text-red-800"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <List size={16} className="inline mr-1" />
                    Schedule
                  </label>
                  <div className="flex flex-col sm:flex-row gap-2 mb-3">
                    <input 
                      type="time" 
                      value={currentSchedule.time} 
                      onChange={(e) => setCurrentSchedule({ ...currentSchedule, time: e.target.value })} 
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" 
                    />
                    <input 
                      type="text" 
                      value={currentSchedule.activity} 
                      onChange={(e) => setCurrentSchedule({ ...currentSchedule, activity: e.target.value })} 
                      placeholder="Activity description" 
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" 
                    />
                    <button 
                      type="button" 
                      onClick={addScheduleItem} 
                      className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                    >
                      <Plus size={20} />
                    </button>
                  </div>
                  <div className="space-y-2">
                    {formData.scheduleItems.map(item => (
                      <div key={item.id} className="flex items-start gap-3 bg-gray-50 p-3 rounded-lg">
                        <span className="text-orange-600 font-semibold text-sm whitespace-nowrap">
                          {item.time}
                        </span>
                        <span className="flex-1 text-gray-700 text-sm">{item.activity}</span>
                        <button 
                          type="button" 
                          onClick={() => removeScheduleItem(item.id)} 
                          className="text-red-600 hover:text-red-800"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <HelpCircle size={16} className="inline mr-1" />
                    FAQs
                  </label>
                  <div className="space-y-3 mb-3">
                    <input 
                      type="text" 
                      value={currentFaq.question} 
                      onChange={(e) => setCurrentFaq({ ...currentFaq, question: e.target.value })} 
                      placeholder="Question" 
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" 
                    />
                    <textarea 
                      value={currentFaq.answer} 
                      onChange={(e) => setCurrentFaq({ ...currentFaq, answer: e.target.value })} 
                      rows={2} 
                      placeholder="Answer" 
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" 
                    />
                    <button 
                      type="button" 
                      onClick={addFaq} 
                      className="w-full sm:w-auto px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                    >
                      <Plus size={16} className="inline mr-2" />
                      Add FAQ
                    </button>
                  </div>
                  <div className="space-y-2">
                    {formData.faqs.map(faq => (
                      <div key={faq.id} className="bg-blue-50 p-4 rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <p className="font-semibold text-gray-900 text-sm">{faq.question}</p>
                          <button 
                            type="button" 
                            onClick={() => removeFaq(faq.id)} 
                            className="text-red-600 hover:text-red-800"
                          >
                            <X size={16} />
                          </button>
                        </div>
                        <p className="text-gray-700 text-sm">{faq.answer}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between pt-4">
                  <button 
                    type="button" 
                    onClick={() => setStep(3)}
                    className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium transition-colors"
                  >
                    ← Back
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setStep(5)}
                    className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-medium transition-colors"
                  >
                    Review →
                  </button>
                </div>
              </div>
            )}

            {/* Step 5: Review */}
            {step === 5 && (
              <div className="space-y-4 sm:space-y-6">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">Review Changes</h2>
                
                <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-lg p-4 sm:p-6 border border-orange-200">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <span className="text-xs sm:text-sm text-gray-600">Title:</span>
                      <p className="font-medium text-sm sm:text-base">{formData.title}</p>
                    </div>
                    <div>
                      <span className="text-xs sm:text-sm text-gray-600">Category:</span>
                      <p className="font-medium text-sm sm:text-base capitalize">
                        {categories.find((c: any) => c.id === formData.categoryId)?.name || formData.categoryId}
                      </p>
                    </div>
                    <div>
                      <span className="text-xs sm:text-sm text-gray-600">Status:</span>
                      <p className="font-medium text-sm sm:text-base">{formData.status}</p>
                    </div>
                    <div>
                      <span className="text-xs sm:text-sm text-gray-600">Location:</span>
                      <p className="font-medium text-sm sm:text-base">{formData.location}</p>
                    </div>
                    <div>
                      <span className="text-xs sm:text-sm text-gray-600">Date:</span>
                      <p className="font-medium text-sm sm:text-base">{formData.date}</p>
                    </div>
                    <div>
                      <span className="text-xs sm:text-sm text-gray-600">Time:</span>
                      <p className="font-medium text-sm sm:text-base">
                        {formData.startTime} - {formData.endTime}
                      </p>
                    </div>
                    <div>
                      <span className="text-xs sm:text-sm text-gray-600">Price:</span>
                      <p className="font-medium text-sm sm:text-base">
                        {formData.price ? `${formData.currency} ${formData.price}` : 'Free'}
                      </p>
                    </div>
                    <div>
                      <span className="text-xs sm:text-sm text-gray-600">Capacity:</span>
                      <p className="font-medium text-sm sm:text-base">
                        {formData.capacity || 'Unlimited'}
                      </p>
                    </div>
                    <div>
                      <span className="text-xs sm:text-sm text-gray-600">Images:</span>
                      <p className="font-medium text-sm sm:text-base">
                        {previewImages.length} image{previewImages.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                    <div>
                      <span className="text-xs sm:text-sm text-gray-600">Tags:</span>
                      <p className="font-medium text-sm sm:text-base">{formData.tags.length} tags</p>
                    </div>
                    <div>
                      <span className="text-xs sm:text-sm text-gray-600">Features:</span>
                      <p className="font-medium text-sm sm:text-base">{formData.features.length} features</p>
                    </div>
                    <div>
                      <span className="text-xs sm:text-sm text-gray-600">Schedule:</span>
                      <p className="font-medium text-sm sm:text-base">
                        {formData.scheduleItems.length} items
                      </p>
                    </div>
                    <div>
                      <span className="text-xs sm:text-sm text-gray-600">FAQs:</span>
                      <p className="font-medium text-sm sm:text-base">{formData.faqs.length} questions</p>
                    </div>
                  </div>
                </div>

                {hasChanges && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-blue-900">You have unsaved changes</p>
                      <p className="text-xs text-blue-700 mt-1">
                        Click "Save Changes" to update the event
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row justify-between gap-3 pt-4">
                  <button 
                    type="button" 
                    onClick={() => setStep(4)}
                    className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium transition-colors"
                  >
                    ← Back
                  </button>
                  <button 
                    type="submit" 
                    disabled={updateEventMutation.isPending || !hasChanges}
                    className="px-8 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-medium text-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {updateEventMutation.isPending ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save size={20} />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}
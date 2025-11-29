import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  MapPin, Users, DollarSign, Calendar, Clock, Upload, X, Plus, 
  Image as ImageIcon, Tag, List, HelpCircle, Check
} from 'lucide-react'

interface FAQ { id: string; question: string; answer: string }
interface ScheduleItem { id: string; time: string; activity: string }
interface Feature { id: string; name: string }

export default function CreateEvent() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [previewImages, setPreviewImages] = useState<string[]>([])
  
  const [formData, setFormData] = useState({
    title: '', description: '', longDescription: '', category: '', address: '', location: '',
    latitude: '', longitude: '', date: '', startTime: '', endTime: '', capacity: '',
    price: '', currency: 'KES', tags: [] as string[], features: [] as Feature[],
    faqs: [] as FAQ[], scheduleItems: [] as ScheduleItem[]
  })

  const [currentTag, setCurrentTag] = useState('')
  const [currentFeature, setCurrentFeature] = useState('')
  const [currentFaq, setCurrentFaq] = useState({ question: '', answer: '' })
  const [currentSchedule, setCurrentSchedule] = useState({ time: '', activity: '' })

  const generateTags = () => {
    const text = `${formData.title} ${formData.description}`.toLowerCase()
    const words = text.split(/\s+/)
    const commonWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of']
    const tags = words.filter(w => w.length > 4 && !commonWords.includes(w))
      .filter((w, i, self) => self.indexOf(w) === i).slice(0, 5)
    setFormData(prev => ({ ...prev, tags: [...new Set([...prev.tags, ...tags])] }))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      const newImages: string[] = []
      Array.from(files).forEach(file => {
        const reader = new FileReader()
        reader.onloadend = () => {
          newImages.push(reader.result as string)
          if (newImages.length === files.length) setPreviewImages(prev => [...prev, ...newImages])
        }
        reader.readAsDataURL(file)
      })
    }
  }

  const removeImage = (index: number) => setPreviewImages(prev => prev.filter((_, i) => i !== index))
  const addTag = () => {
    if (currentTag && !formData.tags.includes(currentTag)) {
      setFormData(prev => ({ ...prev, tags: [...prev.tags, currentTag] }))
      setCurrentTag('')
    }
  }
  const removeTag = (tag: string) => setFormData(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }))
  const addFeature = () => {
    if (currentFeature) {
      setFormData(prev => ({ ...prev, features: [...prev.features, { id: Date.now().toString(), name: currentFeature }] }))
      setCurrentFeature('')
    }
  }
  const removeFeature = (id: string) => setFormData(prev => ({ ...prev, features: prev.features.filter(f => f.id !== id) }))
  const addFaq = () => {
    if (currentFaq.question && currentFaq.answer) {
      setFormData(prev => ({ ...prev, faqs: [...prev.faqs, { ...currentFaq, id: Date.now().toString() }] }))
      setCurrentFaq({ question: '', answer: '' })
    }
  }
  const removeFaq = (id: string) => setFormData(prev => ({ ...prev, faqs: prev.faqs.filter(f => f.id !== id) }))
  const addScheduleItem = () => {
    if (currentSchedule.time && currentSchedule.activity) {
      setFormData(prev => ({ ...prev, scheduleItems: [...prev.scheduleItems, { ...currentSchedule, id: Date.now().toString() }] }))
      setCurrentSchedule({ time: '', activity: '' })
    }
  }
  const removeScheduleItem = (id: string) => setFormData(prev => ({ ...prev, scheduleItems: prev.scheduleItems.filter(s => s.id !== id) }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Creating event:', formData, 'Images:', previewImages)
    navigate('/host/dashboard')
  }

  const validateStep = () => {
    if (step === 1) return formData.title && formData.description && formData.category
    if (step === 2) return formData.address && formData.date && formData.startTime && formData.endTime
    return true
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-4xl font-bold text-gray-900">Create New Event</h1>
        <p className="text-sm sm:text-base text-gray-600 mt-2">Fill in the details to create your event</p>
      </div>

      {/* Progress */}
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center justify-center overflow-x-auto pb-2">
          {[1, 2, 3, 4, 5].map((num) => (
            <div key={num} className="flex items-center">
              <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-semibold text-xs sm:text-sm ${step >= num ? 'bg-orange-600 text-white' : 'bg-gray-200 text-gray-600'}`}>{num}</div>
              {num < 5 && <div className={`w-8 sm:w-20 h-1 ${step > num ? 'bg-orange-600' : 'bg-gray-200'}`} />}
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-3 text-[10px] sm:text-sm text-gray-600 px-1">
          <span>Basic</span><span>Details</span><span>Media</span><span>Content</span><span>Review</span>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg border border-gray-200">
        <form onSubmit={handleSubmit} className="p-4 sm:p-8">
          {step === 1 && (
            <div className="space-y-4 sm:space-y-6">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">Basic Information</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Event Title *</label>
                <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="e.g., Tech Innovation Summit 2024" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Short Description *</label>
                <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="Brief description" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" required>
                  <option value="">Select category</option>
                  <option value="technology">Technology</option>
                  <option value="music">Music</option>
                  <option value="food">Food</option>
                  <option value="business">Business</option>
                  <option value="sports">Sports</option>
                  <option value="arts">Arts</option>
                </select>
              </div>
              <div className="flex justify-end pt-4">
                <button type="button" onClick={() => validateStep() && setStep(2)} disabled={!validateStep()} className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:bg-gray-300 font-medium">Next →</button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 sm:space-y-6">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">Location & Time</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2"><MapPin size={16} className="inline mr-1" />Venue Name *</label>
                <input type="text" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} placeholder="e.g., Nairobi Convention Centre" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Address *</label>
                <input type="text" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} placeholder="Street, City, Country" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" required />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Latitude</label>
                  <input type="number" step="any" value={formData.latitude} onChange={(e) => setFormData({ ...formData, latitude: e.target.value })} placeholder="-1.286389" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Longitude</label>
                  <input type="number" step="any" value={formData.longitude} onChange={(e) => setFormData({ ...formData, longitude: e.target.value })} placeholder="36.817223" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2"><Calendar size={16} className="inline mr-1" />Date *</label>
                  <input type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2"><Clock size={16} className="inline mr-1" />Start *</label>
                  <input type="time" value={formData.startTime} onChange={(e) => setFormData({ ...formData, startTime: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">End *</label>
                  <input type="time" value={formData.endTime} onChange={(e) => setFormData({ ...formData, endTime: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" required />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2"><Users size={16} className="inline mr-1" />Capacity</label>
                  <input type="number" value={formData.capacity} onChange={(e) => setFormData({ ...formData, capacity: e.target.value })} placeholder="Max attendees" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2"><DollarSign size={16} className="inline mr-1" />Price</label>
                  <div className="flex gap-2">
                    <select value={formData.currency} onChange={(e) => setFormData({ ...formData, currency: e.target.value })} className="px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500">
                      <option value="KES">KES</option>
                      <option value="USD">USD</option>
                    </select>
                    <input type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} placeholder="0 for free" className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" />
                  </div>
                </div>
              </div>
              <div className="flex justify-between pt-4">
                <button type="button" onClick={() => setStep(1)} className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium">← Back</button>
                <button type="button" onClick={() => validateStep() && setStep(3)} disabled={!validateStep()} className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:bg-gray-300 font-medium">Next →</button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4 sm:space-y-6">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">Images & Media</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2"><ImageIcon size={16} className="inline mr-1" />Event Images</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-orange-500 transition">
                  <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" id="img-up" />
                  <label htmlFor="img-up" className="cursor-pointer">
                    <Upload className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                    <p className="text-sm text-gray-600">Click or drag images</p>
                  </label>
                </div>
              </div>
              {previewImages.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {previewImages.map((img, i) => (
                    <div key={i} className="relative group">
                      <img src={img} alt={`Preview ${i}`} className="w-full h-32 object-cover rounded-lg" />
                      <button type="button" onClick={() => removeImage(i)} className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"><X size={16} /></button>
                      {i === 0 && <span className="absolute bottom-2 left-2 bg-orange-600 text-white text-xs px-2 py-1 rounded">Primary</span>}
                    </div>
                  ))}
                </div>
              )}
              <div className="flex justify-between pt-4">
                <button type="button" onClick={() => setStep(2)} className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium">← Back</button>
                <button type="button" onClick={() => setStep(4)} className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-medium">Next →</button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6 sm:space-y-8">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">Additional Content</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Detailed Description</label>
                <textarea value={formData.longDescription} onChange={(e) => setFormData({ ...formData, longDescription: e.target.value })} rows={6} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 font-mono text-sm" placeholder="<p>Detailed description with HTML...</p>" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2"><Tag size={16} className="inline mr-1" />Tags</label>
                <div className="flex gap-2 mb-3">
                  <input type="text" value={currentTag} onChange={(e) => setCurrentTag(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())} placeholder="Add tag" className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" />
                  <button type="button" onClick={addTag} className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"><Plus size={20} /></button>
                  <button type="button" onClick={generateTags} className="hidden sm:block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">Auto</button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map(tag => (
                    <span key={tag} className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm flex items-center gap-2">#{tag}<button type="button" onClick={() => removeTag(tag)}><X size={14} /></button></span>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2"><Check size={16} className="inline mr-1" />Features</label>
                <div className="flex gap-2 mb-3">
                  <input type="text" value={currentFeature} onChange={(e) => setCurrentFeature(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())} placeholder="e.g., WiFi Available" className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" />
                  <button type="button" onClick={addFeature} className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"><Plus size={20} /></button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {formData.features.map(f => (
                    <div key={f.id} className="flex items-center justify-between bg-green-50 px-3 py-2 rounded-lg">
                      <span className="text-sm text-green-800 flex items-center gap-2"><Check size={16} className="text-green-600" />{f.name}</span>
                      <button type="button" onClick={() => removeFeature(f.id)} className="text-red-600"><X size={16} /></button>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2"><List size={16} className="inline mr-1" />Schedule</label>
                <div className="flex flex-col sm:flex-row gap-2 mb-3">
                  <input type="time" value={currentSchedule.time} onChange={(e) => setCurrentSchedule({ ...currentSchedule, time: e.target.value })} className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" />
                  <input type="text" value={currentSchedule.activity} onChange={(e) => setCurrentSchedule({ ...currentSchedule, activity: e.target.value })} placeholder="Activity" className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" />
                  <button type="button" onClick={addScheduleItem} className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"><Plus size={20} /></button>
                </div>
                <div className="space-y-2">
                  {formData.scheduleItems.map(item => (
                    <div key={item.id} className="flex items-start gap-3 bg-gray-50 p-3 rounded-lg">
                      <span className="text-orange-600 font-semibold text-sm whitespace-nowrap">{item.time}</span>
                      <span className="flex-1 text-gray-700 text-sm">{item.activity}</span>
                      <button type="button" onClick={() => removeScheduleItem(item.id)} className="text-red-600"><X size={16} /></button>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2"><HelpCircle size={16} className="inline mr-1" />FAQs</label>
                <div className="space-y-3 mb-3">
                  <input type="text" value={currentFaq.question} onChange={(e) => setCurrentFaq({ ...currentFaq, question: e.target.value })} placeholder="Question" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" />
                  <textarea value={currentFaq.answer} onChange={(e) => setCurrentFaq({ ...currentFaq, answer: e.target.value })} rows={2} placeholder="Answer" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" />
                  <button type="button" onClick={addFaq} className="w-full sm:w-auto px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"><Plus size={16} className="inline mr-2" />Add FAQ</button>
                </div>
                <div className="space-y-2">
                  {formData.faqs.map(faq => (
                    <div key={faq.id} className="bg-blue-50 p-4 rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <p className="font-semibold text-gray-900 text-sm">{faq.question}</p>
                        <button type="button" onClick={() => removeFaq(faq.id)} className="text-red-600"><X size={16} /></button>
                      </div>
                      <p className="text-gray-700 text-sm">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-between pt-4">
                <button type="button" onClick={() => setStep(3)} className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium">← Back</button>
                <button type="button" onClick={() => setStep(5)} className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-medium">Review →</button>
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-4 sm:space-y-6">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">Review & Submit</h2>
              <div className="bg-gray-50 rounded-lg p-4 sm:p-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div><span className="text-gray-600 text-sm">Title:</span><p className="font-medium">{formData.title}</p></div>
                  <div><span className="text-gray-600 text-sm">Category:</span><p className="font-medium capitalize">{formData.category}</p></div>
                  <div><span className="text-gray-600 text-sm">Location:</span><p className="font-medium">{formData.location}</p></div>
                  <div><span className="text-gray-600 text-sm">Date:</span><p className="font-medium">{formData.date}</p></div>
                  <div><span className="text-gray-600 text-sm">Time:</span><p className="font-medium">{formData.startTime} - {formData.endTime}</p></div>
                  <div><span className="text-gray-600 text-sm">Price:</span><p className="font-medium">{formData.price ? `${formData.currency} ${formData.price}` : 'Free'}</p></div>
                  <div><span className="text-gray-600 text-sm">Capacity:</span><p className="font-medium">{formData.capacity || 'Unlimited'}</p></div>
                  <div><span className="text-gray-600 text-sm">Images:</span><p className="font-medium">{previewImages.length} uploaded</p></div>
                  <div><span className="text-gray-600 text-sm">Tags:</span><p className="font-medium">{formData.tags.length} tags</p></div>
                  <div><span className="text-gray-600 text-sm">Features:</span><p className="font-medium">{formData.features.length} features</p></div>
                  <div><span className="text-gray-600 text-sm">Schedule:</span><p className="font-medium">{formData.scheduleItems.length} items</p></div>
                  <div><span className="text-gray-600 text-sm">FAQs:</span><p className="font-medium">{formData.faqs.length} questions</p></div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row justify-between gap-3 pt-4">
                <button type="button" onClick={() => setStep(4)} className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium">← Back</button>
                <button type="submit" className="px-8 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-medium text-lg">🎉 Create Event</button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}
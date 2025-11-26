import { useState } from 'react';
import { 
  Calendar, MapPin, Clock, Users, Share2, Heart, 
  ChevronDown, ChevronUp, ExternalLink, Mail, Phone, Globe,
  CheckCircle,   Info
} from 'lucide-react';

// Mock event data - replace with actual API call
const mockEvent = {
  id: '1',
  title: 'Tech Innovation Summit 2024',
  description: 'Join us for the biggest tech innovation summit of the year. Connect with industry leaders, explore cutting-edge technologies, and network with fellow innovators.',
  longDescription: `
    <p>The Tech Innovation Summit 2024 is your gateway to the future of technology. This three-day event brings together the brightest minds in tech, from startup founders to Fortune 500 executives.</p>
    
    <h3>What to Expect:</h3>
    <ul>
      <li>50+ keynote speakers from leading tech companies</li>
      <li>Interactive workshops and hands-on sessions</li>
      <li>Networking opportunities with 5000+ attendees</li>
      <li>Expo hall featuring 200+ innovative startups</li>
      <li>Evening social events and after-parties</li>
    </ul>
    
    <h3>Who Should Attend:</h3>
    <ul>
      <li>Tech entrepreneurs and startup founders</li>
      <li>Software developers and engineers</li>
      <li>Product managers and designers</li>
      <li>Investors and VCs</li>
      <li>Anyone passionate about technology</li>
    </ul>
  `,
  image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&h=600&fit=crop',
  date: '2024-12-15',
  startTime: '09:00',
  endTime: '18:00',
  location: 'Nairobi Convention Centre',
  address: 'Harry Thuku Road, Nairobi, Kenya',
  latitude: -1.2864,
  longitude: 36.8172,
  category: 'Technology',
  price: 5000,
  currency: 'KES',
  capacity: 500,
  registered: 342,
  host: {
    name: 'Tech Kenya',
    email: 'info@techkenya.com',
    phone: '+254 700 000000',
    website: 'https://techkenya.com',
    image: 'https://ui-avatars.com/api/?name=Tech+Kenya&size=200'
  },
  tags: ['Technology', 'Innovation', 'Networking', 'Conference'],
  status: 'upcoming',
  features: [
    'WiFi Available',
    'Parking Available',
    'Food & Beverages',
    'Photography',
    'Recording Allowed',
    'Networking Sessions'
  ],
  schedule: [
    { time: '09:00 AM', activity: 'Registration & Welcome Coffee' },
    { time: '10:00 AM', activity: 'Opening Keynote' },
    { time: '11:30 AM', activity: 'Panel Discussion: Future of AI' },
    { time: '01:00 PM', activity: 'Lunch Break & Networking' },
    { time: '02:30 PM', activity: 'Breakout Sessions' },
    { time: '04:00 PM', activity: 'Startup Pitch Competition' },
    { time: '06:00 PM', activity: 'Closing Remarks & Cocktail' }
  ]
};

const faqs = [
  {
    question: 'What is included in the ticket price?',
    answer: 'Your ticket includes access to all keynote sessions, workshops, the expo hall, lunch, refreshments throughout the day, and networking events. You will also receive a welcome kit with event materials.'
  },
  {
    question: 'Can I get a refund if I cannot attend?',
    answer: 'Yes, we offer full refunds up to 14 days before the event. Refunds requested 7-14 days before receive 50% back. No refunds are available within 7 days of the event, but you can transfer your ticket to someone else.'
  },
  {
    question: 'Is parking available at the venue?',
    answer: 'Yes, the Nairobi Convention Centre has ample parking space available for attendees. Parking is free for event participants. Please bring your ticket confirmation for validation.'
  },
  {
    question: 'What should I bring to the event?',
    answer: 'Please bring a valid ID for check-in, your ticket confirmation (digital or printed), business cards for networking, and any electronic devices you may need. We also recommend bringing a light jacket as conference rooms can be cool.'
  },
  {
    question: 'Will there be food provided?',
    answer: 'Yes, lunch and refreshments throughout the day are included in your ticket. We cater to various dietary requirements including vegetarian, vegan, and halal options. Please indicate your preferences during registration.'
  },
  {
    question: 'Is the event suitable for beginners?',
    answer: 'Absolutely! We have sessions designed for all experience levels, from beginners to advanced professionals. The schedule includes introductory workshops as well as deep-dive technical sessions.'
  },
  {
    question: 'Can I attend virtually?',
    answer: 'Currently, this is an in-person only event to maximize networking opportunities. However, keynote recordings will be available to ticket holders after the event.'
  },
  {
    question: 'What is the dress code?',
    answer: 'Business casual is recommended. The atmosphere is professional but comfortable. Many attendees wear smart casual attire suitable for a tech conference.'
  },
  {
    question: 'Are there student discounts available?',
    answer: 'Yes! Students receive a 30% discount on ticket prices. Please have your valid student ID ready during registration and check-in.'
  },
  {
    question: 'Will I receive a certificate of attendance?',
    answer: 'Yes, all attendees will receive a digital certificate of attendance via email within 48 hours after the event concludes.'
  },
  {
    question: 'Is WiFi available at the venue?',
    answer: 'Yes, high-speed WiFi is available throughout the venue. Network credentials will be provided in your welcome kit at registration.'
  },
  {
    question: 'Can I bring a guest?',
    answer: 'Each ticket is valid for one person only. If you would like to bring a guest, they will need to register and purchase their own ticket.'
  }
];

const EventDetailPage = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);

  const spotsLeft = mockEvent.capacity - mockEvent.registered;
  const percentageFilled = (mockEvent.registered / mockEvent.capacity) * 100;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-green-100 text-green-800';
      case 'ongoing': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: mockEvent.title,
        text: mockEvent.description,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-64 md:h-96 overflow-hidden">
        <img 
          src={mockEvent.image} 
          alt={mockEvent.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8 text-white">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-2 mb-2">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(mockEvent.status)}`}>
                {mockEvent.status.toUpperCase()}
              </span>
              <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-semibold">
                {mockEvent.category}
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold mb-2">{mockEvent.title}</h1>
            <div className="flex flex-wrap gap-4 text-sm md:text-base">
              <div className="flex items-center gap-2">
                <Calendar size={18} />
                <span>{new Date(mockEvent.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={18} />
                <span>{mockEvent.startTime} - {mockEvent.endTime}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={18} />
                <span>{mockEvent.location}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 md:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setIsLiked(!isLiked)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
                  isLiked ? 'bg-red-50 border-red-300 text-red-600' : 'bg-white border-gray-300 text-gray-600 hover:border-gray-400'
                }`}
              >
                <Heart size={20} fill={isLiked ? 'currentColor' : 'none'} />
                <span className="hidden sm:inline">{isLiked ? 'Saved' : 'Save'}</span>
              </button>
              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-600 hover:border-gray-400 transition-all"
              >
                <Share2 size={20} />
                <span className="hidden sm:inline">Share</span>
              </button>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="flex border-b border-gray-200 overflow-x-auto">
                {['overview', 'schedule', 'location', 'faq'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-6 py-3 font-medium text-sm whitespace-nowrap transition-colors ${
                      activeTab === tab
                        ? 'text-orange-600 border-b-2 border-orange-600'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>

              <div className="p-6">
                {/* Overview Tab */}
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Event</h2>
                      <p className="text-gray-700 leading-relaxed mb-4">{mockEvent.description}</p>
                      
                      <div 
                        className={`prose prose-sm max-w-none ${!showFullDescription ? 'line-clamp-6' : ''}`}
                        dangerouslySetInnerHTML={{ __html: mockEvent.longDescription }}
                      />
                      
                      <button
                        onClick={() => setShowFullDescription(!showFullDescription)}
                        className="text-orange-600 hover:text-orange-700 font-medium mt-2 flex items-center gap-1"
                      >
                        {showFullDescription ? (
                          <>Show Less <ChevronUp size={16} /></>
                        ) : (
                          <>Read More <ChevronDown size={16} /></>
                        )}
                      </button>
                    </div>

                    {/* Features */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">What's Included</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {mockEvent.features.map((feature, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm text-gray-700">
                            <CheckCircle size={16} className="text-green-600 flex-shrink-0" />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Tags */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Tags</h3>
                      <div className="flex flex-wrap gap-2">
                        {mockEvent.tags.map((tag, index) => (
                          <span key={index} className="px-3 py-1 bg-orange-50 text-orange-700 rounded-full text-sm font-medium">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Schedule Tab */}
                {activeTab === 'schedule' && (
                  <div className="space-y-4">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Event Schedule</h2>
                    {mockEvent.schedule.map((item, index) => (
                      <div key={index} className="flex gap-4 pb-4 border-b border-gray-200 last:border-0">
                        <div className="flex-shrink-0 w-24 text-orange-600 font-semibold">
                          {item.time}
                        </div>
                        <div className="flex-1">
                          <p className="text-gray-900 font-medium">{item.activity}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Location Tab */}
                {activeTab === 'location' && (
                  <div className="space-y-4">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Venue Information</h2>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <MapPin className="text-orange-600 flex-shrink-0 mt-1" size={20} />
                        <div>
                          <p className="font-semibold text-gray-900">{mockEvent.location}</p>
                          <p className="text-gray-600 text-sm">{mockEvent.address}</p>
                        </div>
                      </div>
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${mockEvent.latitude},${mockEvent.longitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium"
                      >
                        View on Google Maps <ExternalLink size={16} />
                      </a>
                    </div>
                    <div className="w-full h-64 bg-gray-200 rounded-lg overflow-hidden mt-4">
                      <iframe
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        loading="lazy"
                        src={`https://www.google.com/maps/embed/v1/place?key=YOUR_GOOGLE_MAPS_API_KEY&q=${mockEvent.latitude},${mockEvent.longitude}`}
                        title="Event Location Map"
                      />
                    </div>
                  </div>
                )}

                {/* FAQ Tab */}
                {activeTab === 'faq' && (
                  <div className="space-y-4">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
                    <div className="space-y-3">
                      {faqs.map((faq, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                          <button
                            onClick={() => toggleFaq(index)}
                            className="w-full flex items-center justify-between p-4 bg-white hover:bg-gray-50 transition-colors text-left"
                          >
                            <span className="font-medium text-gray-900 pr-4">{faq.question}</span>
                            {openFaq === index ? (
                              <ChevronUp size={20} className="text-gray-500 flex-shrink-0" />
                            ) : (
                              <ChevronDown size={20} className="text-gray-500 flex-shrink-0" />
                            )}
                          </button>
                          {openFaq === index && (
                            <div className="p-4 pt-0 bg-gray-50">
                              <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Registration Card */}
            <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 sticky top-6">
              <div className="mb-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-gray-900">{mockEvent.currency} {mockEvent.price.toLocaleString()}</span>
                  <span className="text-gray-600">per person</span>
                </div>
              </div>

              {/* Capacity Bar */}
              <div className="mb-6">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span className="flex items-center gap-1">
                    <Users size={16} />
                    {mockEvent.registered} registered
                  </span>
                  <span className="font-semibold text-orange-600">{spotsLeft} spots left</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all ${
                      percentageFilled > 80 ? 'bg-red-500' : percentageFilled > 50 ? 'bg-orange-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${percentageFilled}%` }}
                  />
                </div>
              </div>

              <button className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 rounded-lg transition-colors mb-3 flex items-center justify-center gap-2">
                <span>🎫</span>
                Register Now
              </button>

              <p className="text-xs text-center text-gray-500">
                Secure registration • Instant confirmation
              </p>
            </div>

            {/* Host Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Hosted By</h3>
              <div className="flex items-center gap-3 mb-4">
                <img 
                  src={mockEvent.host.image} 
                  alt={mockEvent.host.name}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <p className="font-semibold text-gray-900">{mockEvent.host.name}</p>
                  <p className="text-sm text-gray-600">Event Organizer</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <a href={`mailto:${mockEvent.host.email}`} className="flex items-center gap-2 text-gray-600 hover:text-orange-600 transition-colors">
                  <Mail size={16} />
                  {mockEvent.host.email}
                </a>
                <a href={`tel:${mockEvent.host.phone}`} className="flex items-center gap-2 text-gray-600 hover:text-orange-600 transition-colors">
                  <Phone size={16} />
                  {mockEvent.host.phone}
                </a>
                <a href={mockEvent.host.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-gray-600 hover:text-orange-600 transition-colors">
                  <Globe size={16} />
                  Visit Website
                </a>
              </div>
            </div>

            {/* Quick Info */}
            <div className="bg-orange-50 rounded-lg border border-orange-200 p-4">
              <div className="flex items-start gap-2">
                <Info size={20} className="text-orange-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-gray-700">
                  <p className="font-semibold text-gray-900 mb-1">Important Information</p>
                  <p>Please arrive 30 minutes early for check-in. Bring a valid ID and your ticket confirmation.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailPage;
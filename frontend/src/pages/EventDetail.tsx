import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { 
  Calendar, MapPin, Clock, Users, Share2, Heart, 
  ChevronDown, ChevronUp, ExternalLink, Mail, Phone,
  CheckCircle, Info, ArrowLeft
} from 'lucide-react';
import { eventService } from '../services/event.service';
import { Event } from '../types';

const EventDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('overview');
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);

  // Fetch event data
  const { data: event, isLoading, error } = useQuery<Event>({
    queryKey: ['event', slug],
    queryFn: () => eventService.getEvent(slug!),
    enabled: !!slug,
  });

  // Loading state
    if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 bg-gray-200 py-8">
        <div className="max-w-4xl mx-auto px-4 animate-pulse">
          <div className="h-96 bg-gray-300 bg-gray-700 rounded-2xl mb-6" />
          <div className="space-y-4">
            <div className="h-8 bg-gray-300 bg-gray-700 rounded w-3/4" />
            <div className="h-4 bg-gray-300 bg-gray-700 rounded" />
            <div className="h-4 bg-gray-300 bg-gray-700 rounded w-5/6" />
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (error || !event) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Event Not Found</h2>
          <p className="text-gray-600 mb-6">The event you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={() => navigate('/events')}
            className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Events
          </button>
        </div>
      </div>
    );
  }

  const spotsLeft = event.spotsLeft ?? (event.capacity ? event.capacity - (event.registered || 0) : 0);
  const registered = event.registered || 0;
  const capacity = event.capacity || 100;
  const percentageFilled = (registered / capacity) * 100;

  const getStatusColor = (status: string) => {
    const statusLower = status.toLowerCase();
    switch (statusLower) {
      case 'upcoming': return 'bg-green-100 text-green-800';
      case 'ongoing': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'published': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const handleShare = async () => {
    const shareData = {
      title: event.title,
      text: event.description,
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    }
  };

  // Format date
  const eventDate = new Date(event.date || event.startDatetime);
  const formattedDate = eventDate.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  // Get times
  const startTime = event.startTime || new Date(event.startDatetime).toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit', 
    hour12: true 
  });
  const endTime = event.endTime || new Date(event.endDatetime).toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit', 
    hour12: true 
  });

  // Get primary image or fallback
  const primaryImage = event.image || event.images[0] || 
    'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&h=600&fit=crop';

  // Get host avatar
  const hostName = event.host?.fullName || 'Event Host';
  const hostAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(hostName)}&size=200&background=f97316&color=fff`;

  // Get location name
  const locationName = event.location || event.address;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-64 md:h-96 overflow-hidden">
        <img 
          src={primaryImage} 
          alt={event.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 bg-white/90 hover:bg-white text-gray-900 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-lg z-10"
        >
          <ArrowLeft size={20} />
          <span className="hidden sm:inline">Back</span>
        </button>

        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8 text-white">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-2 mb-2">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(event.status)}`}>
                {event.status.toUpperCase()}
              </span>
              {event.category && (
                <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-semibold">
                  {event.category.name}
                </span>
              )}
            </div>
            <h1 className="text-3xl md:text-5xl font-bold mb-2">{event.title}</h1>
            <div className="flex flex-wrap gap-4 text-sm md:text-base">
              <div className="flex items-center gap-2">
                <Calendar size={18} />
                <span>{formattedDate}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={18} />
                <span>{startTime} - {endTime}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={18} />
                <span>{locationName}</span>
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
                      <p className="text-gray-700 leading-relaxed mb-4">{event.description}</p>
                      
                      {event.longDescription && (
                        <>
                          <div 
                            className={`prose prose-sm max-w-none ${!showFullDescription ? 'line-clamp-6' : ''}`}
                            dangerouslySetInnerHTML={{ __html: event.longDescription }}
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
                        </>
                      )}
                    </div>

                    {/* Features */}
                    {event.features && event.features.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">What's Included</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {event.features.map((feature) => (
                            <div key={feature.id} className="flex items-center gap-2 text-sm text-gray-700">
                              <CheckCircle size={16} className="text-green-600 flex-shrink-0" />
                              <span>{feature.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Tags */}
                    {event.eventTags && event.eventTags.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Tags</h3>
                        <div className="flex flex-wrap gap-2">
                          {event.eventTags.map((tag) => (
                            <span key={tag.id} className="px-3 py-1 bg-orange-50 text-orange-700 rounded-full text-sm font-medium">
                              #{tag.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Schedule Tab */}
                {activeTab === 'schedule' && (
                  <div className="space-y-4">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Event Schedule</h2>
                    {event.scheduleItems && event.scheduleItems.length > 0 ? (
                      event.scheduleItems.map((item) => (
                        <div key={item.id} className="flex gap-4 pb-4 border-b border-gray-200 last:border-0">
                          <div className="flex-shrink-0 w-24 text-orange-600 font-semibold">
                            {item.time}
                          </div>
                          <div className="flex-1">
                            <p className="text-gray-900 font-medium">{item.activity}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-center py-8">Schedule details coming soon...</p>
                    )}
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
                          <p className="font-semibold text-gray-900">{locationName}</p>
                          <p className="text-gray-600 text-sm">{event.address}</p>
                        </div>
                      </div>
                      {event.latitude && event.longitude && (
                        <>
                          <a
                            href={`https://www.google.com/maps/search/?api=1&query=${event.latitude},${event.longitude}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium"
                          >
                            View on Google Maps <ExternalLink size={16} />
                          </a>
                          <div className="w-full h-64 bg-gray-200 rounded-lg overflow-hidden mt-4">
                            <iframe
                              width="100%"
                              height="100%"
                              style={{ border: 0 }}
                              loading="lazy"
                              src={`https://www.google.com/maps?q=${event.latitude},${event.longitude}&output=embed`}
                              title="Event Location Map"
                            />
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}

                {/* FAQ Tab */}
                {activeTab === 'faq' && (
                  <div className="space-y-4">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
                    {event.faqs && event.faqs.length > 0 ? (
                      <div className="space-y-3">
                        {event.faqs.map((faq, index) => (
                          <div key={faq.id} className="border border-gray-200 rounded-lg overflow-hidden">
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
                    ) : (
                      <p className="text-gray-500 text-center py-8">No FAQs available for this event.</p>
                    )}
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
                  {event.price === 0 || !event.price ? (
                    <span className="text-3xl font-bold text-green-600">FREE</span>
                  ) : (
                    <>
                      <span className="text-3xl font-bold text-gray-900">
                        {event.currency || 'KES'} {event.price.toLocaleString()}
                      </span>
                      <span className="text-gray-600">per person</span>
                    </>
                  )}
                </div>
              </div>

              {/* Capacity Bar */}
              {event.capacity && (
                <div className="mb-6">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span className="flex items-center gap-1">
                      <Users size={16} />
                      {registered} registered
                    </span>
                    <span className="font-semibold text-orange-600">{spotsLeft} spots left</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all ${
                        percentageFilled > 80 ? 'bg-red-500' : percentageFilled > 50 ? 'bg-orange-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${Math.min(percentageFilled, 100)}%` }}
                    />
                  </div>
                </div>
              )}

              <button className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 rounded-lg transition-colors mb-3 flex items-center justify-center gap-2">
                <span>🎫</span>
                Register Now
              </button>

              <p className="text-xs text-center text-gray-500">
                Secure registration • Instant confirmation
              </p>
            </div>

            {/* Host Information */}
            {event.host && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Hosted By</h3>
                <div className="flex items-center gap-3 mb-4">
                  <img 
                    src={hostAvatar} 
                    alt={event.host.fullName}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <p className="font-semibold text-gray-900">{event.host.fullName}</p>
                    <p className="text-sm text-gray-600">Event Organizer</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <a href={`mailto:${event.host.email}`} className="flex items-center gap-2 text-gray-600 hover:text-orange-600 transition-colors">
                    <Mail size={16} />
                    {event.host.email}
                  </a>
                  {event.host.phone && (
                    <a href={`tel:${event.host.phone}`} className="flex items-center gap-2 text-gray-600 hover:text-orange-600 transition-colors">
                      <Phone size={16} />
                      {event.host.phone}
                    </a>
                  )}
                </div>
              </div>
            )}

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
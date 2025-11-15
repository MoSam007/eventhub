export const APP_NAME = 'EventHub'

export const EVENT_CATEGORIES = [
  {
    id: 'outdoor',
    name: 'Outdoor & Adventure',
    icon: '🏔️',
    subcategories: ['Hiking', 'Camping', 'Rock Climbing', 'Cycling', 'Water Sports'],
  },
  {
    id: 'music',
    name: 'Music & Entertainment',
    icon: '🎵',
    subcategories: ['Concerts', 'Jazz & Blues', 'Electronic/EDM', 'Classical', 'Open Mic'],
  },
  {
    id: 'cultural',
    name: 'Cultural & Arts',
    icon: '🎨',
    subcategories: ['Art Exhibitions', 'Theater', 'Film', 'Poetry', 'Museums'],
  },
  {
    id: 'social',
    name: 'Social & Networking',
    icon: '👥',
    subcategories: ['Hangouts', 'Meetups', 'Game Nights', 'Book Clubs'],
  },
  {
    id: 'nightlife',
    name: 'Nightlife',
    icon: '🌃',
    subcategories: ['Clubbing', 'Bar Crawls', 'Rooftop Parties', 'DJ Nights'],
  },
  {
    id: 'tech',
    name: 'Tech & Professional',
    icon: '💻',
    subcategories: ['Meetups', 'Hackathons', 'Workshops', 'Conferences'],
  },
  {
    id: 'cosplay',
    name: 'Cosplay & Gaming',
    icon: '🎮',
    subcategories: ['Cosplay Events', 'Gaming Tournaments', 'Comic Cons', 'Anime'],
  },
  {
    id: 'food',
    name: 'Food & Drink',
    icon: '🍽️',
    subcategories: ['Food Festivals', 'Wine Tasting', 'Cooking Classes', 'Brewery Tours'],
  },
]

export const ROUTES = {
  HOME: '/',
  EVENTS: '/events',
  LOGIN: '/login',
  SIGNUP: '/signup',
  PROFILE: '/profile',
  VENDOR_DASHBOARD: '/vendor/dashboard',
  CREATE_EVENT: '/vendor/create-event',
}
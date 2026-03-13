export interface User {
  id: string
  email: string
  fullName: string
  profilePicture?: string
  phone?: string
  role: 'USER' | 'HOST' | 'VENDOR' | 'ADMIN'
  location?: string
  preferences?: any
  createdAt: string
}

export interface EventHost {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  profilePicture?: string;
}

export interface EventFaq {
  id: string;
  question: string;
  answer: string;
  order: number;
}

export interface EventFeature {
  id: string;
  name: string;
}

export interface ScheduleItem {
  id: string;
  time: string;
  activity: string;
  order: number;
}

export interface EventTag {
  id: string;
  name: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon?: string;
}

export interface Event {
  id: string;
  slug: string;
  title: string;
  description: string;
  longDescription?: string;
  categoryId: string;
  category?: Category;
  hostId?: string;
  host?: EventHost;
  location: string;
  address: string;
  latitude?: number;
  longitude?: number;
  startDatetime: string;
  endDatetime: string;
  date?: string;
  startTime?: string;
  endTime?: string;
  capacity?: number;
  price?: number;
  currency?: string;
  image?: string;
  images: string[];
  tags: string[];
  status: string;
  createdAt: string;
  updatedAt?: string;
  
  // Related data
  faqs?: EventFaq[];
  features?: EventFeature[];
  scheduleItems?: ScheduleItem[];
  eventTags?: EventTag[];
  registered?: number;
  spotsLeft?: number;
  externalUrl?: string;
  source?: string;
}

export interface EventbriteEvent {
  id: string;
  name: {
    text: string;
    html: string;
  };
  description: {
    text: string;
    html: string;
  };
  url: string;
  start: {
    timezone: string;
    local: string;
    utc: string;
  };
  end: {
    timezone: string;
    local: string;
    utc: string;
  };
  logo: {
    url: string;
  } | null;
  venue?: {
    name: string;
    address: {
      address_1: string;
      city: string;
      region: string;
      postal_code: string;
      country: string;
    };
  };
}

export interface Category {
  id: string
  name: string
  slug: string
  icon?: string
  parentId?: string
}

export interface AuthResponse {
  status: string
  message: string
  data: {
    user: User
    token: string
    refreshToken: string
  }
}

export interface ApiResponse<T = any> {
  status: 'success' | 'error'
  message: string
  data?: T
  errors?: any[]
}
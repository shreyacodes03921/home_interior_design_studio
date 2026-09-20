export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  avatar?: string;
  title?: string;
  phone?: string;
  wishlist: string[];
  preferences?: {
    preferredStyle?: string;
    propertyType?: string;
  };
  status: 'active' | 'deactivated';
  createdAt: string;
}

export interface Design {
  id: string;
  title: string;
  category: string;
  roomType: string;
  style: string;
  images: string[];
  description: string;
  tags: string[];
  designerId: string;
  designerName: string;
  areaSqFt?: number;
  yearCompleted?: number;
  budgetRange?: string;
  featured?: boolean;
  viewCount?: number;
  palette?: string[];
  materials?: string[];
  createdAt: string;
}

export interface Service {
  id: string;
  name: string;
  tier: string;
  description: string;
  priceRange: string;
  category: string;
  deliverables: string[];
  duration: string;
  popular?: boolean;
  createdAt: string;
}

export interface Booking {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userPhone?: string;
  serviceId: string;
  serviceName: string;
  date: string;
  timeSlot?: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
  designerNotes?: string;
  budget?: string;
  roomDetails?: {
    roomType?: string;
    approxSqFt?: number;
    propertyAddress?: string;
    timeline?: string;
    stylePreference?: string;
  };
  createdAt: string;
}

export interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  publishedDate: string;
  tags: string[];
  readTimeMinutes: number;
  createdAt: string;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  targetType: 'design' | 'service';
  targetId: string;
  rating: number;
  comment: string;
  verifiedBooking?: boolean;
  createdAt: string;
}

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: 'new' | 'contacted' | 'resolved';
  createdAt: string;
}

export interface AdminAnalytics {
  totalUsers: number;
  totalDesigns: number;
  totalBookings: number;
  totalInquiries: number;
  totalBlogs: number;
  estimatedPipeline: number;
  bookingStatusCounts: {
    pending: number;
    confirmed: number;
    completed: number;
    cancelled: number;
  };
  categoryCounts: Record<string, number>;
  styleViews: Record<string, number>;
}

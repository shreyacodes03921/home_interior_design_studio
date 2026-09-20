import { User, Design, Service, Booking, Blog, Review, Inquiry, AdminAnalytics } from '../types';

const API_BASE = '/api';

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('atelier_token');
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  const config: RequestInit = {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...(options.headers || {}),
    },
  };

  const response = await fetch(url, config);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'An unexpected API error occurred');
  }

  return data;
}

export const api = {
  // Auth
  auth: {
    register: (body: { name: string; email: string; password: string; phone?: string; preferences?: any }) =>
      request<{ success: boolean; token: string; user: User }>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(body),
      }),
    login: (body: { email: string; password: string }) =>
      request<{ success: boolean; token: string; user: User }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(body),
      }),
    google: (body: { email: string; name: string; avatar?: string }) =>
      request<{ success: boolean; token: string; user: User }>('/auth/google', {
        method: 'POST',
        body: JSON.stringify(body),
      }),
    requestReset: (email: string) =>
      request<{ success: boolean; message: string; debugToken?: string }>('/auth/reset-password-request', {
        method: 'POST',
        body: JSON.stringify({ email }),
      }),
    completeReset: (token: string, newPassword: string) =>
      request<{ success: boolean; message: string }>('/auth/reset-password-complete', {
        method: 'POST',
        body: JSON.stringify({ token, newPassword }),
      }),
    getMe: () => request<{ success: boolean; user: User }>('/auth/me'),
    updateProfile: (body: Partial<User>) =>
      request<{ success: boolean; user: User }>('/auth/profile', {
        method: 'PUT',
        body: JSON.stringify(body),
      }),
    toggleWishlist: (designId: string) =>
      request<{ success: boolean; wishlist: string[]; added: boolean; message: string }>('/auth/wishlist', {
        method: 'POST',
        body: JSON.stringify({ designId }),
      }),
  },

  // Designs
  designs: {
    getAll: (params?: { roomType?: string; category?: string; style?: string; search?: string; featured?: boolean; sort?: string }) => {
      const query = new URLSearchParams();
      if (params?.roomType) query.set('roomType', params.roomType);
      if (params?.category) query.set('category', params.category);
      if (params?.style) query.set('style', params.style);
      if (params?.search) query.set('search', params.search);
      if (params?.featured) query.set('featured', 'true');
      if (params?.sort) query.set('sort', params.sort);
      const qs = query.toString();
      return request<{ success: boolean; count: number; designs: Design[] }>(`/designs${qs ? `?${qs}` : ''}`);
    },
    getById: (id: string) => request<{ success: boolean; design: Design }>(`/designs/${id}`),
    create: (body: Partial<Design>) =>
      request<{ success: boolean; design: Design }>('/designs', {
        method: 'POST',
        body: JSON.stringify(body),
      }),
    update: (id: string, body: Partial<Design>) =>
      request<{ success: boolean; design: Design }>(`/designs/${id}`, {
        method: 'PUT',
        body: JSON.stringify(body),
      }),
    delete: (id: string) =>
      request<{ success: boolean; message: string }>(`/designs/${id}`, {
        method: 'DELETE',
      }),
  },

  // Services
  services: {
    getAll: () => request<{ success: boolean; count: number; services: Service[] }>('/services'),
    getById: (id: string) => request<{ success: boolean; service: Service }>(`/services/${id}`),
    create: (body: Partial<Service>) =>
      request<{ success: boolean; service: Service }>('/services', {
        method: 'POST',
        body: JSON.stringify(body),
      }),
    update: (id: string, body: Partial<Service>) =>
      request<{ success: boolean; service: Service }>(`/services/${id}`, {
        method: 'PUT',
        body: JSON.stringify(body),
      }),
    delete: (id: string) =>
      request<{ success: boolean; message: string }>(`/services/${id}`, {
        method: 'DELETE',
      }),
  },

  // Bookings
  bookings: {
    create: (body: Partial<Booking>) =>
      request<{ success: boolean; message: string; booking: Booking }>('/bookings', {
        method: 'POST',
        body: JSON.stringify(body),
      }),
    getMyBookings: () => request<{ success: boolean; count: number; bookings: Booking[] }>('/bookings/my-bookings'),
    getAll: (params?: { status?: string; search?: string }) => {
      const query = new URLSearchParams();
      if (params?.status) query.set('status', params.status);
      if (params?.search) query.set('search', params.search);
      const qs = query.toString();
      return request<{ success: boolean; count: number; bookings: Booking[] }>(`/bookings${qs ? `?${qs}` : ''}`);
    },
    getById: (id: string) => request<{ success: boolean; booking: Booking }>(`/bookings/${id}`),
    updateStatus: (id: string, body: { status?: string; designerNotes?: string }) =>
      request<{ success: boolean; message: string; booking: Booking }>(`/bookings/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify(body),
      }),
  },

  // Blogs
  blogs: {
    getAll: (params?: { tag?: string; search?: string }) => {
      const query = new URLSearchParams();
      if (params?.tag) query.set('tag', params.tag);
      if (params?.search) query.set('search', params.search);
      const qs = query.toString();
      return request<{ success: boolean; count: number; blogs: Blog[] }>(`/blogs${qs ? `?${qs}` : ''}`);
    },
    getBySlug: (slug: string) => request<{ success: boolean; blog: Blog }>(`/blogs/${slug}`),
    create: (body: Partial<Blog>) =>
      request<{ success: boolean; blog: Blog }>('/blogs', {
        method: 'POST',
        body: JSON.stringify(body),
      }),
    update: (id: string, body: Partial<Blog>) =>
      request<{ success: boolean; blog: Blog }>(`/blogs/${id}`, {
        method: 'PUT',
        body: JSON.stringify(body),
      }),
    delete: (id: string) =>
      request<{ success: boolean; message: string }>(`/blogs/${id}`, {
        method: 'DELETE',
      }),
  },

  // Reviews
  reviews: {
    getForTarget: (targetType: 'design' | 'service', targetId: string) =>
      request<{ success: boolean; count: number; averageRating: number; reviews: Review[] }>(`/reviews/${targetType}/${targetId}`),
    getAll: () => request<{ success: boolean; count: number; reviews: Review[] }>('/reviews'),
    create: (body: { targetType: 'design' | 'service'; targetId: string; rating: number; comment: string }) =>
      request<{ success: boolean; message: string; review: Review }>('/reviews', {
        method: 'POST',
        body: JSON.stringify(body),
      }),
  },

  // Inquiries
  inquiries: {
    submit: (body: { name: string; email: string; phone?: string; subject?: string; message: string }) =>
      request<{ success: boolean; message: string; inquiry: Inquiry }>('/inquiries', {
        method: 'POST',
        body: JSON.stringify(body),
      }),
    getAll: () => request<{ success: boolean; count: number; inquiries: Inquiry[] }>('/inquiries'),
    updateStatus: (id: string, status: 'new' | 'contacted' | 'resolved') =>
      request<{ success: boolean; inquiry: Inquiry }>(`/inquiries/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      }),
  },

  // Admin
  admin: {
    getAnalytics: () => request<{ success: boolean; stats: AdminAnalytics; recentBookings: Booking[]; recentEmails: any[] }>('/admin/analytics'),
    getUsers: () => request<{ success: boolean; count: number; users: User[] }>('/admin/users'),
    updateUser: (id: string, body: { status?: 'active' | 'deactivated'; role?: 'user' | 'admin' }) =>
      request<{ success: boolean; message: string; user: User }>(`/admin/users/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(body),
      }),
  },
};

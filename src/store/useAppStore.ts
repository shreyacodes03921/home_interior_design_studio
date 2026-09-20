import { create } from 'zustand';

export type AppView =
  | 'home'
  | 'portfolio'
  | 'design-detail'
  | 'services'
  | 'about'
  | 'blog'
  | 'blog-detail'
  | 'contact'
  | 'dashboard'
  | 'admin';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  description?: string;
}

interface AppState {
  currentView: AppView;
  selectedDesignId: string | null;
  selectedBlogSlug: string | null;
  bookingModalOpen: boolean;
  bookingPrefill: {
    serviceId?: string;
    serviceName?: string;
    designTitle?: string;
    stylePreference?: string;
    roomType?: string;
  } | null;
  authModalOpen: boolean;
  authModalTab: 'login' | 'register' | 'reset';
  lightboxImage: string | null;
  toasts: ToastMessage[];

  // Navigation
  navigate: (view: AppView, params?: { designId?: string; blogSlug?: string }) => void;
  openBookingModal: (prefill?: AppState['bookingPrefill']) => void;
  closeBookingModal: () => void;
  openAuthModal: (tab?: 'login' | 'register' | 'reset') => void;
  closeAuthModal: () => void;
  openLightbox: (imageUrl: string) => void;
  closeLightbox: () => void;
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  currentView: 'home',
  selectedDesignId: null,
  selectedBlogSlug: null,
  bookingModalOpen: false,
  bookingPrefill: null,
  authModalOpen: false,
  authModalTab: 'login',
  lightboxImage: null,
  toasts: [],

  navigate: (view, params) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    set({
      currentView: view,
      selectedDesignId: params?.designId || null,
      selectedBlogSlug: params?.blogSlug || null,
    });
  },

  openBookingModal: (prefill) => {
    set({ bookingModalOpen: true, bookingPrefill: prefill || null });
  },

  closeBookingModal: () => {
    set({ bookingModalOpen: false, bookingPrefill: null });
  },

  openAuthModal: (tab = 'login') => {
    set({ authModalOpen: true, authModalTab: tab });
  },

  closeAuthModal: () => {
    set({ authModalOpen: false });
  },

  openLightbox: (imageUrl) => {
    set({ lightboxImage: imageUrl });
  },

  closeLightbox: () => {
    set({ lightboxImage: null });
  },

  addToast: (toast) => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;
    set((state) => ({ toasts: [...state.toasts, { ...toast, id }] }));
    setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
    }, 4500);
  },

  removeToast: (id) => {
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
  },
}));

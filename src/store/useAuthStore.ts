import { create } from 'zustand';
import { User } from '../types';
import { api } from '../api/client';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  initAuth: () => Promise<void>;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, phone?: string) => Promise<boolean>;
  googleLogin: (email: string, name: string, avatar?: string) => Promise<boolean>;
  logout: () => void;
  toggleWishlist: (designId: string) => Promise<boolean>;
  isWishlisted: (designId: string) => boolean;
  quickDemoLogin: (role: 'admin' | 'user') => Promise<void>;
  setUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: localStorage.getItem('atelier_token'),
  isLoading: true,
  error: null,

  initAuth: async () => {
    const token = localStorage.getItem('atelier_token');
    if (!token) {
      set({ isLoading: false });
      return;
    }

    try {
      const res = await api.auth.getMe();
      if (res.success && res.user) {
        set({ user: res.user, isLoading: false, error: null });
      } else {
        localStorage.removeItem('atelier_token');
        set({ user: null, token: null, isLoading: false });
      }
    } catch {
      localStorage.removeItem('atelier_token');
      set({ user: null, token: null, isLoading: false });
    }
  },

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.auth.login({ email, password });
      if (res.success && res.token) {
        localStorage.setItem('atelier_token', res.token);
        set({ user: res.user, token: res.token, isLoading: false, error: null });
        return true;
      }
      return false;
    } catch (err: any) {
      set({ isLoading: false, error: err.message || 'Login failed' });
      return false;
    }
  },

  register: async (name: string, email: string, password: string, phone?: string) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.auth.register({ name, email, password, phone });
      if (res.success && res.token) {
        localStorage.setItem('atelier_token', res.token);
        set({ user: res.user, token: res.token, isLoading: false, error: null });
        return true;
      }
      return false;
    } catch (err: any) {
      set({ isLoading: false, error: err.message || 'Registration failed' });
      return false;
    }
  },

  googleLogin: async (email: string, name: string, avatar?: string) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.auth.google({ email, name, avatar });
      if (res.success && res.token) {
        localStorage.setItem('atelier_token', res.token);
        set({ user: res.user, token: res.token, isLoading: false, error: null });
        return true;
      }
      return false;
    } catch (err: any) {
      set({ isLoading: false, error: err.message || 'Google login failed' });
      return false;
    }
  },

  logout: () => {
    localStorage.removeItem('atelier_token');
    set({ user: null, token: null });
  },

  toggleWishlist: async (designId: string) => {
    const { user } = get();
    if (!user) return false;

    try {
      const res = await api.auth.toggleWishlist(designId);
      if (res.success) {
        set({
          user: {
            ...user,
            wishlist: res.wishlist,
          },
        });
        return res.added;
      }
      return false;
    } catch {
      return false;
    }
  },

  isWishlisted: (designId: string) => {
    const { user } = get();
    return Boolean(user?.wishlist?.includes(designId));
  },

  quickDemoLogin: async (role: 'admin' | 'user') => {
    if (role === 'admin') {
      await get().login('admin@atelierlux.com', 'admin123');
    } else {
      await get().login('client@atelierlux.com', 'client123');
    }
  },

  setUser: (user: User) => set({ user }),
}));

import React, { useEffect, useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { useAuthStore } from '../store/useAuthStore';
import { api } from '../api/client';
import { Booking, Design } from '../types';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import {
  Heart,
  Calendar,
  User as UserIcon,
  Clock,
  Home,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  Shield,
  Trash2,
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { navigate, openBookingModal, openAuthModal, addToast } = useAppStore();
  const { user, toggleWishlist, setUser } = useAuthStore();

  const [activeTab, setActiveTab] = useState<'wishlist' | 'bookings' | 'profile'>('wishlist');
  const [wishlistDesigns, setWishlistDesigns] = useState<Design[]>([]);
  const [myBookings, setMyBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Profile form state
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [preferredStyle, setPreferredStyle] = useState(user?.preferences?.preferredStyle || 'Japandi');
  const [propertyType, setPropertyType] = useState(user?.preferences?.propertyType || 'Penthouse');
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  useEffect(() => {
    if (!user) {
      openAuthModal('login');
      return;
    }

    setName(user.name);
    setPhone(user.phone || '');
    setAvatar(user.avatar || '');
    setPreferredStyle(user.preferences?.preferredStyle || 'Japandi');
    setPropertyType(user.preferences?.propertyType || 'Penthouse');

    setIsLoading(true);
    Promise.all([
      api.designs.getAll(),
      api.bookings.getMyBookings(),
    ])
      .then(([designsRes, bookingsRes]) => {
        if (designsRes.success) {
          const userWishlistIds = user.wishlist || [];
          const matched = designsRes.designs.filter((d) => userWishlistIds.includes(d.id));
          setWishlistDesigns(matched);
        }
        if (bookingsRes.success) {
          setMyBookings(bookingsRes.bookings);
        }
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [user]);

  const handleRemoveWishlist = async (designId: string) => {
    const added = await toggleWishlist(designId);
    setWishlistDesigns((prev) => prev.filter((d) => d.id !== designId));
    addToast({ type: 'info', title: 'Removed from Saved Designs' });
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdatingProfile(true);
    try {
      const res = await api.auth.updateProfile({
        name,
        phone,
        avatar,
        preferences: {
          preferredStyle,
          propertyType,
        },
      });

      if (res.success && res.user) {
        setUser(res.user);
        addToast({ type: 'success', title: 'Client preferences updated successfully' });
      }
    } catch (err: any) {
      addToast({ type: 'error', title: 'Update failed', description: err.message });
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const avatarPresets = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
  ];

  if (!user) {
    return (
      <div className="max-w-xl mx-auto py-24 text-center space-y-4 px-4">
        <h2 className="font-serif text-3xl text-stone-900">Client Access Required</h2>
        <p className="text-xs text-stone-600">Please sign in to view your saved designs and consultations.</p>
        <Button variant="luxury" onClick={() => openAuthModal('login')} className="uppercase text-xs tracking-wider">
          Sign In / Register
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Header Profile Bar */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={user.avatar || avatarPresets[0]}
            alt={user.name}
            className="w-16 h-16 rounded-full object-cover border-2 border-stone-900"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-2xl sm:text-3xl text-stone-900 font-light">{user.name}</h1>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-stone-100 text-stone-700">
                {user.role}
              </span>
            </div>
            <p className="text-xs font-mono text-stone-500">{user.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="luxury"
            size="sm"
            onClick={() => openBookingModal()}
            className="uppercase text-xs tracking-wider"
          >
            <Sparkles className="w-3.5 h-3.5" /> Book Consultation
          </Button>

          {user.role === 'admin' && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('admin')}
              className="uppercase text-xs tracking-wider text-amber-900 border-amber-800/40"
            >
              <Shield className="w-3.5 h-3.5 mr-1" /> Admin Panel
            </Button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-stone-200">
        <button
          onClick={() => setActiveTab('wishlist')}
          className={`flex items-center gap-2 px-6 py-3 text-xs uppercase tracking-wider font-semibold cursor-pointer border-b-2 transition-all ${
            activeTab === 'wishlist'
              ? 'border-stone-900 text-stone-900'
              : 'border-transparent text-stone-400 hover:text-stone-700'
          }`}
        >
          <Heart className="w-4 h-4" /> Saved Designs ({wishlistDesigns.length})
        </button>

        <button
          onClick={() => setActiveTab('bookings')}
          className={`flex items-center gap-2 px-6 py-3 text-xs uppercase tracking-wider font-semibold cursor-pointer border-b-2 transition-all ${
            activeTab === 'bookings'
              ? 'border-stone-900 text-stone-900'
              : 'border-transparent text-stone-400 hover:text-stone-700'
          }`}
        >
          <Calendar className="w-4 h-4" /> Consultation History ({myBookings.length})
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`flex items-center gap-2 px-6 py-3 text-xs uppercase tracking-wider font-semibold cursor-pointer border-b-2 transition-all ${
            activeTab === 'profile'
              ? 'border-stone-900 text-stone-900'
              : 'border-transparent text-stone-400 hover:text-stone-700'
          }`}
        >
          <UserIcon className="w-4 h-4" /> Profile & Preferences
        </button>
      </div>

      {/* TAB 1: SAVED DESIGNS (WISHLIST) */}
      {activeTab === 'wishlist' && (
        <div className="space-y-6">
          {wishlistDesigns.length === 0 ? (
            <div className="p-16 text-center bg-white rounded-2xl border border-stone-200 space-y-4">
              <Heart className="w-12 h-12 text-stone-300 mx-auto" />
              <h3 className="font-serif text-2xl text-stone-800 font-light">No saved spaces yet</h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                Explore our residential portfolio and tap the heart icon on any space to curate your project wishlist.
              </p>
              <Button
                variant="luxury"
                size="sm"
                onClick={() => navigate('portfolio')}
                className="uppercase text-xs tracking-wider"
              >
                Browse Portfolio
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {wishlistDesigns.map((design) => (
                <div
                  key={design.id}
                  className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-stone-100">
                    <img
                      src={design.images[0]}
                      alt={design.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3">
                      <Badge variant="luxury">{design.category}</Badge>
                    </div>
                    <button
                      onClick={() => handleRemoveWishlist(design.id)}
                      className="absolute top-3 right-3 p-2 rounded-full bg-stone-900/70 hover:bg-stone-900 text-white cursor-pointer"
                      title="Remove from saved"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-1">
                      <p className="text-xs font-mono text-stone-400">{design.style}</p>
                      <h4
                        onClick={() => navigate('design-detail', { designId: design.id })}
                        className="font-serif text-lg font-medium text-stone-900 hover:text-amber-900 cursor-pointer"
                      >
                        {design.title}
                      </h4>
                      <p className="text-xs text-stone-600 line-clamp-2 font-light">
                        {design.description}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-stone-100 flex items-center justify-between gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate('design-detail', { designId: design.id })}
                        className="text-xs uppercase tracking-wider"
                      >
                        View Project
                      </Button>
                      <Button
                        variant="luxury"
                        size="sm"
                        onClick={() =>
                          openBookingModal({
                            designTitle: design.title,
                            roomType: design.roomType,
                            stylePreference: design.style,
                          })
                        }
                        className="text-xs uppercase tracking-wider"
                      >
                        Book for Space
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: CONSULTATION BOOKINGS */}
      {activeTab === 'bookings' && (
        <div className="space-y-6">
          {myBookings.length === 0 ? (
            <div className="p-16 text-center bg-white rounded-2xl border border-stone-200 space-y-4">
              <Calendar className="w-12 h-12 text-stone-300 mx-auto" />
              <h3 className="font-serif text-2xl text-stone-800 font-light">No consultations booked</h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                Schedule a consultation to meet with our principal designers and review architectural floorplans.
              </p>
              <Button
                variant="luxury"
                size="sm"
                onClick={() => openBookingModal()}
                className="uppercase text-xs tracking-wider"
              >
                Schedule Appointment
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {myBookings.map((b) => {
                const statusBadges = {
                  pending: <Badge variant="warning">Awaiting Studio Review</Badge>,
                  confirmed: <Badge variant="success">Confirmed with Director</Badge>,
                  completed: <Badge variant="neutral">Completed Engagement</Badge>,
                  cancelled: <Badge variant="outline">Cancelled</Badge>,
                };

                return (
                  <div
                    key={b.id}
                    className="bg-white p-6 rounded-2xl border border-stone-200/90 shadow-2xs space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
                      <div>
                        <span className="text-[11px] font-mono text-stone-400">Reference #{b.id}</span>
                        <h3 className="font-serif text-xl font-medium text-stone-900">{b.serviceName}</h3>
                      </div>
                      <div>{statusBadges[b.status]}</div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                      <div className="flex items-center gap-2 text-stone-600">
                        <Calendar className="w-4 h-4 text-stone-400 shrink-0" />
                        <span>Date: <strong className="text-stone-900">{b.date}</strong></span>
                      </div>
                      <div className="flex items-center gap-2 text-stone-600">
                        <Clock className="w-4 h-4 text-stone-400 shrink-0" />
                        <span>Time: <strong className="text-stone-900">{b.timeSlot || 'Scheduled'}</strong></span>
                      </div>
                      <div className="flex items-center gap-2 text-stone-600">
                        <Home className="w-4 h-4 text-stone-400 shrink-0" />
                        <span>Room: <strong className="text-stone-900">{b.roomDetails?.roomType || 'Residence'}</strong></span>
                      </div>
                    </div>

                    {b.notes && (
                      <p className="text-xs text-stone-600 italic bg-stone-50 p-3 rounded-lg border border-stone-200/60">
                        Client Notes: "{b.notes}"
                      </p>
                    )}

                    {b.designerNotes && (
                      <div className="p-3.5 bg-amber-50/80 border border-amber-200/80 rounded-lg text-xs space-y-1">
                        <span className="font-semibold uppercase tracking-wider text-amber-950 text-[10px] flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-amber-800" /> Studio Lead Architect Message:
                        </span>
                        <p className="text-amber-950 leading-relaxed font-light">{b.designerNotes}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: PROFILE & PREFERENCES */}
      {activeTab === 'profile' && (
        <form onSubmit={handleUpdateProfile} className="bg-white p-8 rounded-2xl border border-stone-200 max-w-2xl space-y-6">
          <div className="space-y-1">
            <h3 className="font-serif text-2xl text-stone-900 font-light">Client Profile & Spatial Preferences</h3>
            <p className="text-xs text-stone-500 font-light">
              Tailor your architectural interests so our directors can present relevant material samples.
            </p>
          </div>

          {/* Avatar selector */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700">
              Select Client Avatar
            </label>
            <div className="flex items-center gap-3">
              {avatarPresets.map((img, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setAvatar(img)}
                  className={`w-12 h-12 rounded-full overflow-hidden border-2 transition-all cursor-pointer ${
                    avatar === img ? 'border-stone-900 ring-2 ring-stone-900/20 shadow-md scale-105' : 'border-stone-200 opacity-60'
                  }`}
                >
                  <img src={img} alt={`Preset ${i}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <Input
              label="Phone Number"
              placeholder="+1 (555) 000-0000"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700">
                Preferred Aesthetic Style
              </label>
              <select
                value={preferredStyle}
                onChange={(e) => setPreferredStyle(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-lg text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-800"
              >
                <option value="Japandi">Scandinavian Japandi</option>
                <option value="Contemporary Luxury">Contemporary European Luxury</option>
                <option value="Modern Minimalist">Modern Minimalist</option>
                <option value="Mid-Century Modern">Mid-Century Organic</option>
                <option value="Warm Mediterranean">Warm Mediterranean Earth</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700">
                Property Typology
              </label>
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-lg text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-800"
              >
                <option value="Penthouse">Urban Penthouse</option>
                <option value="Townhouse">Historic Townhouse / Brownstone</option>
                <option value="Suburban Villa">Coastal or Suburban Villa</option>
                <option value="Industrial Loft">High-Ceiling Soho Loft</option>
                <option value="Country Estate">Country Estate</option>
              </select>
            </div>
          </div>

          <div className="pt-4 border-t border-stone-100 flex justify-end">
            <Button
              type="submit"
              variant="luxury"
              isLoading={isUpdatingProfile}
              className="uppercase text-xs tracking-wider"
            >
              Save Client Profile
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};

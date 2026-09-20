import React, { useState } from 'react';
import { useAppStore, AppView } from '../../store/useAppStore';
import { useAuthStore } from '../../store/useAuthStore';
import { Button } from '../ui/Button';
import { Heart, User as UserIcon, Menu, X, Shield, Calendar, LogOut, ChevronDown, Sparkles } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { currentView, navigate, openBookingModal, openAuthModal, addToast } = useAppStore();
  const { user, logout, quickDemoLogin } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navLinks: { label: string; view: AppView }[] = [
    { label: 'Home', view: 'home' },
    { label: 'Portfolio', view: 'portfolio' },
    { label: 'Services', view: 'services' },
    { label: 'About Us', view: 'about' },
    { label: 'Design Journal', view: 'blog' },
    { label: 'Contact', view: 'contact' },
  ];

  const handleNav = (view: AppView) => {
    navigate(view);
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  };

  const wishlistCount = user?.wishlist?.length || 0;

  return (
    <header className="sticky top-0 z-40 bg-stone-50/90 backdrop-blur-md border-b border-stone-200/80 transition-all">
      {/* Demo Switcher Top Bar for quick reviewer testing */}
      <div className="bg-stone-900 text-stone-300 text-xs px-4 py-1.5 flex items-center justify-between border-b border-stone-800">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-medium text-stone-200">Atelier Luxe Studio</span>
          <span className="hidden sm:inline text-stone-400">| Full-Stack Interior Design Platform</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-stone-400 hidden md:inline">Quick Demo Roles:</span>
          {user?.role === 'admin' ? (
            <button
              onClick={async () => {
                await quickDemoLogin('user');
                addToast({ type: 'info', title: 'Switched to Client Profile', description: 'Logged in as Julian Sterling (Client)' });
              }}
              className="text-amber-200 hover:text-white underline cursor-pointer font-medium text-[11px]"
            >
              Switch to Client (User)
            </button>
          ) : (
            <button
              onClick={async () => {
                await quickDemoLogin('admin');
                addToast({ type: 'success', title: 'Admin Mode Active', description: 'Logged in as Eleanor Vance (Principal Director / Admin)' });
              }}
              className="text-amber-300 hover:text-amber-100 flex items-center gap-1 cursor-pointer font-medium text-[11px]"
            >
              <Shield className="w-3 h-3 text-amber-300" /> Switch to Admin
            </button>
          )}
          {user?.role === 'admin' && (
            <button
              onClick={() => handleNav('admin')}
              className="bg-amber-900/60 text-amber-200 px-2 py-0.5 rounded text-[11px] hover:bg-amber-800 transition-colors"
            >
              Admin Dashboard
            </button>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <div
            onClick={() => handleNav('home')}
            className="cursor-pointer group flex flex-col"
          >
            <span className="font-serif text-2xl sm:text-3xl tracking-widest font-normal text-stone-900 uppercase">
              Atelier Luxe
            </span>
            <span className="text-[10px] tracking-[0.25em] text-stone-500 uppercase -mt-1 font-sans">
              Architecture & Interiors
            </span>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.view}
                onClick={() => handleNav(link.view)}
                className={`text-sm uppercase tracking-wider transition-colors cursor-pointer py-1 ${
                  currentView === link.view
                    ? 'text-stone-900 font-semibold border-b-2 border-stone-900'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Actions: Wishlist, User, Book Consultation */}
          <div className="flex items-center gap-4">
            {/* Wishlist Button */}
            <button
              onClick={() => {
                if (!user) {
                  openAuthModal('login');
                } else {
                  handleNav('dashboard');
                }
              }}
              className="relative p-2 text-stone-700 hover:text-stone-900 transition-colors cursor-pointer rounded-full hover:bg-stone-200/50"
              title="Saved Designs (Wishlist)"
            >
              <Heart className={`w-5 h-5 ${wishlistCount > 0 ? 'text-amber-700 fill-amber-700' : ''}`} />
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-stone-900 text-stone-100 text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* User Account / Auth Dropdown */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-full hover:bg-stone-200/60 transition-colors cursor-pointer border border-stone-200"
                >
                  <img
                    src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                    alt={user.name}
                    className="w-7 h-7 rounded-full object-cover"
                  />
                  <ChevronDown className="w-3.5 h-3.5 text-stone-500 hidden sm:block mr-1" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-stone-200 py-2 z-50 animate-in fade-in zoom-in-95">
                    <div className="px-4 py-2 border-b border-stone-100">
                      <p className="text-xs text-stone-400 uppercase tracking-wider">Signed in as</p>
                      <p className="text-sm font-semibold text-stone-900 truncate">{user.name}</p>
                      <span className="inline-block mt-0.5 text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-stone-100 text-stone-700">
                        {user.role}
                      </span>
                    </div>

                    <button
                      onClick={() => handleNav('dashboard')}
                      className="w-full px-4 py-2 text-left text-xs uppercase tracking-wider text-stone-700 hover:bg-stone-50 flex items-center gap-2"
                    >
                      <UserIcon className="w-4 h-4 text-stone-500" /> Client Dashboard
                    </button>

                    <button
                      onClick={() => handleNav('dashboard')}
                      className="w-full px-4 py-2 text-left text-xs uppercase tracking-wider text-stone-700 hover:bg-stone-50 flex items-center gap-2"
                    >
                      <Calendar className="w-4 h-4 text-stone-500" /> My Consultations
                    </button>

                    {user.role === 'admin' && (
                      <button
                        onClick={() => handleNav('admin')}
                        className="w-full px-4 py-2 text-left text-xs uppercase tracking-wider text-amber-900 bg-amber-50/70 hover:bg-amber-100/70 flex items-center gap-2 font-semibold"
                      >
                        <Shield className="w-4 h-4 text-amber-700" /> Admin Studio Panel
                      </button>
                    )}

                    <div className="border-t border-stone-100 my-1"></div>

                    <button
                      onClick={() => {
                        logout();
                        setUserDropdownOpen(false);
                        addToast({ type: 'info', title: 'Signed out successfully' });
                      }}
                      className="w-full px-4 py-2 text-left text-xs uppercase tracking-wider text-rose-700 hover:bg-rose-50 flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => openAuthModal('login')}
                className="text-xs uppercase tracking-wider font-semibold text-stone-700 hover:text-stone-900 px-3 py-1.5 rounded-md hover:bg-stone-100 cursor-pointer"
              >
                Sign In
              </button>
            )}

            {/* Book Consultation Primary CTA */}
            <Button
              variant="luxury"
              size="sm"
              onClick={() => openBookingModal()}
              className="hidden sm:inline-flex uppercase text-xs tracking-wider"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              Book Consultation
            </Button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-stone-700 hover:text-stone-900 rounded-md hover:bg-stone-100 cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-stone-200 bg-stone-50 px-6 py-6 space-y-4 animate-in slide-in-from-top-4">
          <nav className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <button
                key={link.view}
                onClick={() => handleNav(link.view)}
                className={`text-left text-sm uppercase tracking-wider py-2 ${
                  currentView === link.view
                    ? 'font-bold text-stone-900 border-l-2 border-stone-900 pl-2'
                    : 'text-stone-600'
                }`}
              >
                {link.label}
              </button>
            ))}
            {user?.role === 'admin' && (
              <button
                onClick={() => handleNav('admin')}
                className="text-left text-sm uppercase tracking-wider py-2 font-bold text-amber-900 flex items-center gap-2"
              >
                <Shield className="w-4 h-4" /> Admin Studio Panel
              </button>
            )}
          </nav>
          <div className="pt-4 border-t border-stone-200 flex flex-col gap-3">
            <Button
              variant="luxury"
              size="md"
              onClick={() => {
                setMobileMenuOpen(false);
                openBookingModal();
              }}
              className="w-full uppercase text-xs tracking-wider"
            >
              Book Consultation
            </Button>
            {!user && (
              <Button
                variant="outline"
                size="md"
                onClick={() => {
                  setMobileMenuOpen(false);
                  openAuthModal('login');
                }}
                className="w-full uppercase text-xs tracking-wider"
              >
                Sign In / Register
              </Button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

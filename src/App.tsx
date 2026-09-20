import React, { useEffect } from 'react';
import { useAppStore } from './store/useAppStore';
import { useAuthStore } from './store/useAuthStore';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { BookingModal } from './components/common/BookingModal';
import { AuthModal } from './components/common/AuthModal';
import { ImageLightbox } from './components/common/ImageLightbox';
import { ToastContainer } from './components/ui/ToastContainer';

// Pages
import { HomePage } from './pages/HomePage';
import { PortfolioPage } from './pages/PortfolioPage';
import { DesignDetailPage } from './pages/DesignDetailPage';
import { ServicesPage } from './pages/ServicesPage';
import { AboutPage } from './pages/AboutPage';
import { BlogPage } from './pages/BlogPage';
import { BlogPostDetailPage } from './pages/BlogPostDetailPage';
import { ContactPage } from './pages/ContactPage';
import { DashboardPage } from './pages/DashboardPage';
import { AdminPage } from './pages/AdminPage';

export default function App() {
  const { currentView } = useAppStore();
  const { initAuth } = useAuthStore();

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 font-sans text-stone-900 selection:bg-amber-900 selection:text-stone-50 antialiased">
      {/* Global Navigation */}
      <Navbar />

      {/* Main Content Router */}
      <main className="flex-1">
        {currentView === 'home' && <HomePage />}
        {currentView === 'portfolio' && <PortfolioPage />}
        {currentView === 'design-detail' && <DesignDetailPage />}
        {currentView === 'services' && <ServicesPage />}
        {currentView === 'about' && <AboutPage />}
        {currentView === 'blog' && <BlogPage />}
        {currentView === 'blog-detail' && <BlogPostDetailPage />}
        {currentView === 'contact' && <ContactPage />}
        {currentView === 'dashboard' && <DashboardPage />}
        {currentView === 'admin' && <AdminPage />}
      </main>

      {/* Global Footer */}
      <Footer />

      {/* Interactive Global Modals & Notifications */}
      <BookingModal />
      <AuthModal />
      <ImageLightbox />
      <ToastContainer />
    </div>
  );
}

import React, { useState } from 'react';
import { useAppStore, AppView } from '../../store/useAppStore';
import { Mail, ArrowRight, MapPin, Phone, Clock } from 'lucide-react';
import { Button } from '../ui/Button';

export const Footer: React.FC = () => {
  const { navigate, addToast } = useAppStore();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes('@')) {
      addToast({ type: 'error', title: 'Please enter a valid email address' });
      return;
    }
    setSubscribed(true);
    addToast({
      type: 'success',
      title: 'Subscribed to Atelier Journal',
      description: 'You will receive our quarterly architectural lookbook and private design releases.',
    });
    setNewsletterEmail('');
  };

  return (
    <footer className="bg-stone-900 text-stone-300 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Studio Profile */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="font-serif text-2xl text-stone-100 tracking-wider uppercase">
              Atelier Luxe
            </h3>
            <p className="text-xs tracking-[0.2em] text-amber-200/80 uppercase font-sans">
              Architecture & Bespoke Interiors
            </p>
            <p className="text-sm text-stone-400 leading-relaxed max-w-sm">
              We design timeless living environments grounded in the dialogue of raw natural textures, sculptural light, and bespoke architectural craftsmanship.
            </p>
            <div className="pt-2 space-y-2 text-xs text-stone-400">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-300/80 shrink-0" />
                <span>74 Mercer Street, Soho, New York, NY 10012</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-300/80 shrink-0" />
                <span>+1 (212) 840-7200</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-300/80 shrink-0" />
                <span>Monday – Friday: 09:00 – 18:00 EST</span>
              </div>
            </div>
          </div>

          {/* Quick Nav */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-widest font-semibold text-stone-200 border-b border-stone-800 pb-2">
              Explore
            </h4>
            <ul className="space-y-2 text-xs uppercase tracking-wider text-stone-400">
              <li>
                <button onClick={() => navigate('portfolio')} className="hover:text-stone-100 transition-colors">
                  Portfolio Gallery
                </button>
              </li>
              <li>
                <button onClick={() => navigate('services')} className="hover:text-stone-100 transition-colors">
                  Design Packages
                </button>
              </li>
              <li>
                <button onClick={() => navigate('about')} className="hover:text-stone-100 transition-colors">
                  Studio & Philosophy
                </button>
              </li>
              <li>
                <button onClick={() => navigate('blog')} className="hover:text-stone-100 transition-colors">
                  Design Journal
                </button>
              </li>
              <li>
                <button onClick={() => navigate('contact')} className="hover:text-stone-100 transition-colors">
                  Inquire & Contact
                </button>
              </li>
            </ul>
          </div>

          {/* Design Specialties */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-widest font-semibold text-stone-200 border-b border-stone-800 pb-2">
              Spaces
            </h4>
            <ul className="space-y-2 text-xs tracking-wider text-stone-400">
              <li>Living Room Sanctuaries</li>
              <li>Master Bed & Bath Suites</li>
              <li>Culinary & Kitchen Islands</li>
              <li>Executive Home Offices</li>
              <li>Private Residential Spas</li>
              <li>Turnkey Estates</li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-widest font-semibold text-stone-200 border-b border-stone-800 pb-2">
              Atelier Gazette
            </h4>
            <p className="text-xs text-stone-400 leading-relaxed">
              Curated material palettes, architectural walkthroughs, and seasonal design trends delivered to your inbox.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-2 pt-1">
              <div className="relative">
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Your email address"
                  className="w-full px-3 py-2 bg-stone-800/80 border border-stone-700 rounded-md text-xs text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-400/80"
                />
              </div>
              <Button type="submit" variant="luxury" size="sm" className="w-full text-xs uppercase tracking-wider">
                Subscribe <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-14 pt-6 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-4">
          <p>© {new Date().getFullYear()} Atelier Luxe Architecture & Interior Design Studio. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>New York</span>
            <span>•</span>
            <span>Paris</span>
            <span>•</span>
            <span>Kyoto</span>
            <span>•</span>
            <span>London</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

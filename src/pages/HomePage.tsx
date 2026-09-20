import React, { useEffect, useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { useAuthStore } from '../store/useAuthStore';
import { api } from '../api/client';
import { Design, Service, Blog, Review } from '../types';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import {
  ArrowRight,
  Heart,
  Sparkles,
  Compass,
  Layers,
  SunMedium,
  CheckCircle,
  Star,
  Eye,
  Calendar,
  Clock,
  ShieldCheck,
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { navigate, openBookingModal, openLightbox, addToast, openAuthModal } = useAppStore();
  const { user, toggleWishlist, isWishlisted } = useAuthStore();

  const [featuredDesigns, setFeaturedDesigns] = useState<Design[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    Promise.all([
      api.designs.getAll({ featured: true }),
      api.services.getAll(),
      api.blogs.getAll(),
      api.reviews.getAll(),
    ])
      .then(([designsRes, servicesRes, blogsRes, reviewsRes]) => {
        if (designsRes.success) setFeaturedDesigns(designsRes.designs);
        if (servicesRes.success) setServices(servicesRes.services);
        if (blogsRes.success) setBlogs(blogsRes.blogs.slice(0, 3));
        if (reviewsRes.success) setReviews(reviewsRes.reviews);
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  const handleWishlist = async (e: React.MouseEvent, designId: string) => {
    e.stopPropagation();
    if (!user) {
      openAuthModal('login');
      return;
    }
    const added = await toggleWishlist(designId);
    addToast({
      type: 'success',
      title: added ? 'Saved to Wishlist' : 'Removed from Wishlist',
      description: added ? 'View in your client dashboard anytime.' : undefined,
    });
  };

  const categories = [
    { id: 'all', label: 'All Curated Spaces' },
    { id: 'living-room', label: 'Living Rooms' },
    { id: 'bedroom', label: 'Primary Suites' },
    { id: 'kitchen', label: 'Culinary Islands' },
    { id: 'office', label: 'Home Offices' },
    { id: 'bathroom', label: 'Spa Bathrooms' },
  ];

  const filteredDesigns = activeCategory === 'all'
    ? featuredDesigns
    : featuredDesigns.filter((d) => d.roomType === activeCategory || d.category.toLowerCase().includes(activeCategory));

  return (
    <div className="space-y-24 pb-20">
      {/* 1. EDITORIAL HERO SECTION */}
      <section className="relative min-h-[85vh] flex items-center bg-stone-950 text-stone-100 overflow-hidden">
        {/* Background Image with Cinematic Gradient Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=2000&q=85"
            alt="Atelier Luxe Kyoto Villa interior architecture"
            className="w-full h-full object-cover opacity-45 scale-105 transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-950/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-stone-950/40" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-2xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950/70 border border-amber-800/60 text-amber-200 text-xs font-semibold uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              Bespoke Interior Architecture
            </div>

            <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-light tracking-tight text-white leading-[1.1]">
              Spaces Shaped by <span className="italic font-normal text-amber-100">Light, Form</span> & Quiet Luxury.
            </h1>

            <p className="text-base sm:text-lg text-stone-300 leading-relaxed font-light max-w-xl">
              We design enduring residential sanctuaries and private estates. Where raw natural textures meet meticulous Scandinavian minimalism and timeless European craftsmanship.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <Button
                variant="luxury"
                size="lg"
                onClick={() => openBookingModal()}
                className="uppercase tracking-widest text-xs font-semibold py-4"
              >
                Reserve Consultation
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>

              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate('portfolio')}
                className="border-stone-400/60 text-stone-100 hover:bg-stone-800/60 hover:text-white uppercase tracking-widest text-xs py-4"
              >
                Explore Portfolio
              </Button>
            </div>

            <div className="pt-8 border-t border-stone-800/80 grid grid-cols-3 gap-6 text-stone-400">
              <div>
                <p className="font-serif text-2xl text-white font-medium">180+</p>
                <p className="text-xs uppercase tracking-wider text-stone-400 mt-0.5">Private Estates</p>
              </div>
              <div>
                <p className="font-serif text-2xl text-white font-medium">14</p>
                <p className="text-xs uppercase tracking-wider text-stone-400 mt-0.5">Design Awards</p>
              </div>
              <div>
                <p className="font-serif text-2xl text-white font-medium">100%</p>
                <p className="text-xs uppercase tracking-wider text-stone-400 mt-0.5">Custom Joinery</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CATEGORY QUICK-SWITCH & FEATURED DESIGNS CAROUSEL / GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-stone-200 pb-6 mb-8">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] text-stone-500 font-semibold">
              Curated Portfolio
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-stone-900 mt-1 font-light">
              Signature Residences & Sanctuaries
            </h2>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`text-xs uppercase tracking-wider px-3.5 py-1.5 rounded-full whitespace-nowrap transition-all cursor-pointer ${
                  activeCategory === cat.id
                    ? 'bg-stone-900 text-stone-100 font-semibold shadow-xs'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Designs Showcase */}
        {isLoading ? (
          <div className="h-64 flex items-center justify-center text-stone-400">
            <span className="animate-pulse font-serif text-lg">Curating portfolio spaces...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredDesigns.map((design) => {
              const wishlisted = isWishlisted(design.id);

              return (
                <div
                  key={design.id}
                  onClick={() => navigate('design-detail', { designId: design.id })}
                  className="group bg-white rounded-xl overflow-hidden border border-stone-200/90 shadow-2xs hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col"
                >
                  {/* Image Container with Hover Zoom & Wishlist Button */}
                  <div className="relative aspect-[4/3] overflow-hidden bg-stone-100">
                    <img
                      src={design.images[0]}
                      alt={design.title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Room Category Pill */}
                    <div className="absolute top-3 left-3">
                      <Badge variant="luxury">{design.category}</Badge>
                    </div>

                    {/* Wishlist Heart Toggle */}
                    <button
                      onClick={(e) => handleWishlist(e, design.id)}
                      className="absolute top-3 right-3 p-2 rounded-full bg-stone-900/60 hover:bg-stone-900 text-white backdrop-blur-xs transition-colors cursor-pointer"
                      title={wishlisted ? 'Remove from Saved' : 'Save to Wishlist'}
                    >
                      <Heart className={`w-4 h-4 ${wishlisted ? 'fill-amber-400 text-amber-400' : 'text-white'}`} />
                    </button>

                    {/* Quick Lightbox Inspection */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openLightbox(design.images[0]);
                      }}
                      className="absolute bottom-3 right-3 p-2 rounded-full bg-stone-950/70 hover:bg-stone-950 text-stone-200 hover:text-white backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                      title="Inspect High-Res Detail"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Content */}
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs text-stone-500 font-mono">
                        <span>{design.style}</span>
                        {design.areaSqFt && <span>{design.areaSqFt} sq ft</span>}
                      </div>

                      <h3 className="font-serif text-xl font-normal text-stone-900 group-hover:text-amber-900 transition-colors">
                        {design.title}
                      </h3>

                      <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed font-light">
                        {design.description}
                      </p>
                    </div>

                    {/* Material Palette Swatches */}
                    {design.palette && (
                      <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          {design.palette.map((color, i) => (
                            <span
                              key={i}
                              className="w-3.5 h-3.5 rounded-full border border-stone-300/80 shadow-2xs"
                              style={{ backgroundColor: color }}
                              title={color}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-stone-400 uppercase tracking-wider group-hover:text-stone-900 font-medium flex items-center gap-1">
                          View Project <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-12 text-center">
          <Button
            variant="outline"
            size="md"
            onClick={() => navigate('portfolio')}
            className="uppercase tracking-widest text-xs px-8"
          >
            Explore Complete Portfolio ({featuredDesigns.length}+ Residences)
          </Button>
        </div>
      </section>

      {/* 3. ATELIER METHODOLOGY & ARCHITECTURAL PILLARS */}
      <section className="bg-stone-100/70 border-y border-stone-200 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-xl mx-auto text-center space-y-3 mb-16">
            <span className="text-xs uppercase tracking-[0.25em] text-stone-500 font-semibold">
              Design Philosophy
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-stone-900 font-light">
              The Architecture of Wellbeing
            </h2>
            <p className="text-sm text-stone-600 font-light leading-relaxed">
              We approach every private dwelling not as a showroom of trends, but as an enduring sanctuary engineered for sensory equilibrium.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-xl border border-stone-200/80 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-900 flex items-center justify-center">
                <SunMedium className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg text-stone-900 font-medium">Circadian Light Flow</h3>
              <p className="text-xs text-stone-600 leading-relaxed font-light">
                Engineering multi-tier indirect cove lighting and window framing that honors natural solar progressions throughout the day.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-stone-200/80 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-900 flex items-center justify-center">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg text-stone-900 font-medium">Authentic Materiality</h3>
              <p className="text-xs text-stone-600 leading-relaxed font-light">
                Limewash plaster, raw Dordogne limestone, wire-brushed oak, and Belgian bouclé that age with grace and rich patina.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-stone-200/80 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-900 flex items-center justify-center">
                <Compass className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg text-stone-900 font-medium">Spatial Discipline</h3>
              <p className="text-xs text-stone-600 leading-relaxed font-light">
                Conscious negative space and sightlines that eliminate visual overwhelm, cultivating tranquility in every room.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-stone-200/80 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-900 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg text-stone-900 font-medium">Bespoke Millwork</h3>
              <p className="text-xs text-stone-600 leading-relaxed font-light">
                Every cabinet, wardrobe, and culinary island is designed custom for your floor plan and fabricated by master cabinetmakers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SERVICES OVERVIEW & PRICING PREVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-stone-200 pb-6 mb-12">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] text-stone-500 font-semibold">
              Tailored Offerings
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-stone-900 mt-1 font-light">
              Design Packages & Engagements
            </h2>
          </div>
          <Button
            variant="ghost"
            onClick={() => navigate('services')}
            className="text-xs uppercase tracking-wider"
          >
            View Detailed Specifications <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service) => (
            <div
              key={service.id}
              className={`p-8 rounded-2xl border flex flex-col justify-between transition-all duration-300 relative ${
                service.popular
                  ? 'border-stone-900 bg-stone-900 text-stone-50 shadow-xl'
                  : 'border-stone-200/90 bg-white text-stone-900 hover:border-stone-300'
              }`}
            >
              {service.popular && (
                <span className="absolute -top-3 left-8 px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest bg-amber-300 text-stone-950">
                  Most Requested
                </span>
              )}

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className={`text-xs uppercase tracking-wider font-semibold ${service.popular ? 'text-amber-200' : 'text-stone-500'}`}>
                    {service.tier}
                  </span>
                  <span className="text-xs font-mono opacity-80">{service.duration}</span>
                </div>

                <h3 className="font-serif text-2xl font-light">{service.name}</h3>
                <p className={`text-xs leading-relaxed font-light ${service.popular ? 'text-stone-300' : 'text-stone-600'}`}>
                  {service.description}
                </p>

                <div className="py-2">
                  <p className="text-xs uppercase tracking-wider opacity-75">Estimated Investment</p>
                  <p className="font-serif text-2xl font-medium mt-0.5">{service.priceRange}</p>
                </div>

                <div className="border-t border-stone-200/20 pt-4 space-y-2">
                  <p className="text-xs uppercase tracking-wider font-semibold">Included Deliverables:</p>
                  <ul className="space-y-1.5 text-xs font-light">
                    {service.deliverables.slice(0, 4).map((del, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${service.popular ? 'text-amber-300' : 'text-stone-700'}`} />
                        <span>{del}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-8">
                <Button
                  variant={service.popular ? 'luxury' : 'primary'}
                  size="md"
                  onClick={() => openBookingModal({ serviceId: service.id, serviceName: service.name })}
                  className="w-full uppercase text-xs tracking-wider"
                >
                  Book Consultation
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. VERIFIED CLIENT REVIEWS & TESTIMONIALS */}
      <section className="bg-stone-900 text-stone-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-xl mx-auto text-center space-y-3 mb-16">
            <span className="text-xs uppercase tracking-[0.25em] text-amber-200/80 font-semibold">
              Client Endorsements
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-white font-light">
              Reflections from Completed Spaces
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {reviews.map((rev) => (
              <div
                key={rev.id}
                className="p-8 rounded-xl bg-stone-800/60 border border-stone-700/80 space-y-4 relative"
              >
                <div className="flex items-center gap-1 text-amber-300">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-300" />
                  ))}
                </div>

                <p className="font-serif text-base text-stone-200 italic leading-relaxed">
                  "{rev.comment}"
                </p>

                <div className="pt-4 border-t border-stone-700/60 flex items-center gap-3">
                  <img
                    src={rev.userAvatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80'}
                    alt={rev.userName}
                    className="w-10 h-10 rounded-full object-cover border border-amber-400/30"
                  />
                  <div>
                    <h4 className="text-sm font-semibold text-white">{rev.userName}</h4>
                    {rev.verifiedBooking && (
                      <span className="text-[10px] text-emerald-400 font-semibold uppercase tracking-wider flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" /> Verified Residential Client
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. LATEST FROM DESIGN JOURNAL */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between border-b border-stone-200 pb-6 mb-12">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] text-stone-500 font-semibold">
              Studio Journal
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-stone-900 mt-1 font-light">
              Essays on Light & Living
            </h2>
          </div>
          <Button
            variant="ghost"
            onClick={() => navigate('blog')}
            className="text-xs uppercase tracking-wider hidden sm:inline-flex"
          >
            Read All Articles <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {blogs.map((blog) => (
            <div
              key={blog.id}
              onClick={() => navigate('blog-detail', { blogSlug: blog.slug })}
              className="group cursor-pointer space-y-4"
            >
              <div className="aspect-[16/10] overflow-hidden rounded-xl bg-stone-100 border border-stone-200">
                <img
                  src={blog.coverImage}
                  alt={blog.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-3 text-xs text-stone-400 font-mono">
                  <span>{blog.publishedDate}</span>
                  <span>•</span>
                  <span>{blog.readTimeMinutes} min read</span>
                </div>

                <h3 className="font-serif text-xl font-normal text-stone-900 group-hover:text-amber-900 transition-colors leading-snug">
                  {blog.title}
                </h3>

                <p className="text-xs text-stone-600 font-light line-clamp-2 leading-relaxed">
                  {blog.excerpt}
                </p>

                <span className="inline-flex items-center gap-1 text-xs uppercase tracking-wider font-semibold text-stone-800 group-hover:text-amber-900 pt-1">
                  Read Essay <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. CALL TO ACTION RESERVATION BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-stone-950 text-white p-10 sm:p-16 relative overflow-hidden text-center space-y-6">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#C7B299_1px,transparent_1px)] [background-size:16px_16px]" />
          
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <span className="text-xs uppercase tracking-[0.25em] text-amber-300 font-semibold">
              Begin Your Project
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-light">
              Ready to Craft Your Sanctuary?
            </h2>
            <p className="text-sm text-stone-300 font-light leading-relaxed">
              Schedule an introductory design consultation at our Soho studio or via private digital video conference.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                variant="luxury"
                size="lg"
                onClick={() => openBookingModal()}
                className="uppercase tracking-widest text-xs px-8"
              >
                Schedule Consultation
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate('contact')}
                className="border-stone-500 text-stone-200 hover:text-white uppercase tracking-widest text-xs px-8"
              >
                Send Studio Inquiry
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

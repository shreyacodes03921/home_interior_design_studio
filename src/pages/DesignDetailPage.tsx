import React, { useEffect, useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { useAuthStore } from '../store/useAuthStore';
import { api } from '../api/client';
import { Design, Review } from '../types';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Input, Textarea } from '../components/ui/Input';
import {
  ArrowLeft,
  Heart,
  Eye,
  ZoomIn,
  Sparkles,
  Calendar,
  Layers,
  Star,
  CheckCircle,
  Share2,
  UserCheck,
  Maximize2,
} from 'lucide-react';

export const DesignDetailPage: React.FC = () => {
  const { selectedDesignId, navigate, openBookingModal, openLightbox, addToast, openAuthModal } = useAppStore();
  const { user, toggleWishlist, isWishlisted } = useAuthStore();

  const [design, setDesign] = useState<Design | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [averageRating, setAverageRating] = useState<number>(5.0);
  const [relatedDesigns, setRelatedDesigns] = useState<Design[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Review Form State
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState<string>('');
  const [isSubmittingReview, setIsSubmittingReview] = useState<boolean>(false);

  useEffect(() => {
    if (!selectedDesignId) {
      navigate('portfolio');
      return;
    }

    setIsLoading(true);
    Promise.all([
      api.designs.getById(selectedDesignId),
      api.reviews.getForTarget('design', selectedDesignId),
      api.designs.getAll({ featured: true }),
    ])
      .then(([designRes, reviewsRes, allDesignsRes]) => {
        if (designRes.success) {
          setDesign(designRes.design);
          setActiveImageIndex(0);
        }
        if (reviewsRes.success) {
          setReviews(reviewsRes.reviews);
          setAverageRating(reviewsRes.averageRating || 5.0);
        }
        if (allDesignsRes.success) {
          setRelatedDesigns(allDesignsRes.designs.filter((d) => d.id !== selectedDesignId).slice(0, 3));
        }
      })
      .catch((err) => {
        console.error(err);
        addToast({ type: 'error', title: 'Could not load project', description: err.message });
      })
      .finally(() => setIsLoading(false));
  }, [selectedDesignId]);

  const handleWishlist = async () => {
    if (!design) return;
    if (!user) {
      openAuthModal('login');
      return;
    }
    const added = await toggleWishlist(design.id);
    addToast({
      type: 'success',
      title: added ? 'Saved to Wishlist' : 'Removed from Wishlist',
      description: added ? 'View in your client dashboard anytime.' : undefined,
    });
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      addToast({ type: 'info', title: 'Link copied to clipboard' });
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!design) return;
    if (!user) {
      openAuthModal('login');
      return;
    }
    if (!comment.trim()) {
      addToast({ type: 'error', title: 'Please include your review thoughts' });
      return;
    }

    setIsSubmittingReview(true);
    try {
      const res = await api.reviews.create({
        targetType: 'design',
        targetId: design.id,
        rating,
        comment,
      });

      if (res.success && res.review) {
        setReviews([res.review, ...reviews]);
        setComment('');
        addToast({
          type: 'success',
          title: 'Review submitted',
          description: 'Thank you for your thoughts on this architectural work.',
        });
      }
    } catch (err: any) {
      addToast({ type: 'error', title: 'Failed to post review', description: err.message });
    } finally {
      setIsSubmittingReview(false);
    }
  };

  if (isLoading || !design) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <span className="font-serif text-xl animate-pulse text-stone-500">
          Loading architectural portfolio project...
        </span>
      </div>
    );
  }

  const wishlisted = isWishlisted(design.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      {/* Navigation Top Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('portfolio')}
          className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-stone-600 hover:text-stone-950 font-medium cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Portfolio
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={handleShare}
            className="p-2 text-stone-600 hover:text-stone-900 rounded-full hover:bg-stone-100 cursor-pointer"
            title="Share project"
          >
            <Share2 className="w-4 h-4" />
          </button>
          <button
            onClick={handleWishlist}
            className={`p-2 rounded-full border transition-colors cursor-pointer ${
              wishlisted
                ? 'border-amber-300 bg-amber-50 text-amber-800'
                : 'border-stone-300 text-stone-700 hover:bg-stone-100'
            }`}
            title={wishlisted ? 'Saved to Wishlist' : 'Add to Wishlist'}
          >
            <Heart className={`w-4 h-4 ${wishlisted ? 'fill-amber-700 text-amber-700' : ''}`} />
          </button>
        </div>
      </div>

      {/* Hero Title & Meta */}
      <div className="space-y-4 max-w-3xl">
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant="luxury">{design.category}</Badge>
          <span className="text-xs uppercase font-mono text-stone-500">{design.style}</span>
          {design.yearCompleted && (
            <span className="text-xs font-mono text-stone-400">Completed {design.yearCompleted}</span>
          )}
        </div>

        <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-stone-900 font-light tracking-tight leading-tight">
          {design.title}
        </h1>

        <p className="text-base text-stone-600 font-light leading-relaxed">
          {design.description}
        </p>
      </div>

      {/* High-Resolution Multi-Image Gallery */}
      <div className="space-y-4">
        {/* Active Stage Image */}
        <div
          onClick={() => openLightbox(design.images[activeImageIndex])}
          className="relative aspect-[16/10] sm:aspect-[21/10] bg-stone-100 rounded-2xl overflow-hidden border border-stone-200/90 shadow-sm group cursor-pointer"
        >
          <img
            src={design.images[activeImageIndex]}
            alt={`${design.title} view ${activeImageIndex + 1}`}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-102"
          />
          <div className="absolute bottom-4 right-4 bg-stone-950/75 text-stone-200 text-xs px-3 py-1.5 rounded-full backdrop-blur-xs flex items-center gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
            <ZoomIn className="w-3.5 h-3.5 text-amber-300" />
            Click to inspect high-resolution view
          </div>
        </div>

        {/* Thumbnail Selector */}
        {design.images.length > 1 && (
          <div className="flex items-center gap-3 overflow-x-auto pb-2">
            {design.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImageIndex(idx)}
                className={`relative w-24 h-16 sm:w-32 sm:h-20 rounded-lg overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                  activeImageIndex === idx
                    ? 'border-stone-900 ring-2 ring-stone-900/20 shadow-md'
                    : 'border-transparent opacity-60 hover:opacity-100'
                }`}
              >
                <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Specifications & Architectural Narrative */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left 2 Cols: Architectural Narrative & Materials */}
        <div className="lg:col-span-2 space-y-10">
          {/* Key Metric Specs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-6 bg-stone-50 rounded-xl border border-stone-200/80">
            <div>
              <p className="text-[11px] uppercase tracking-wider text-stone-400">Total Area</p>
              <p className="font-serif text-lg font-medium text-stone-900 mt-0.5">
                {design.areaSqFt ? `${design.areaSqFt} sq ft` : 'Custom Scope'}
              </p>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-wider text-stone-400">Room Category</p>
              <p className="font-serif text-lg font-medium text-stone-900 mt-0.5">{design.roomType}</p>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-wider text-stone-400">Style Typology</p>
              <p className="font-serif text-lg font-medium text-stone-900 mt-0.5">{design.style}</p>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-wider text-stone-400">Est. Investment</p>
              <p className="font-serif text-lg font-medium text-stone-900 mt-0.5">
                {design.budgetRange || '$60k – $95k'}
              </p>
            </div>
          </div>

          {/* Design Intent Statement */}
          <div className="space-y-4">
            <h3 className="font-serif text-2xl text-stone-900 font-light">Architectural Concept</h3>
            <p className="text-stone-600 font-light leading-relaxed">
              Designed with purposeful architectural restraint, this residence explores the dialogue between soft tactile materiality and structured linear volume. Natural light washes across textured wall applications throughout the day, creating subtle shifts in shadow and ambient warmth.
            </p>
            <p className="text-stone-600 font-light leading-relaxed">
              Every detail—from the concealed baseboards to the custom recessed curtain pockets—was executed with zero-tolerance precision by our studio’s bespoke fabrication partners.
            </p>
          </div>

          {/* Color & Material Palette */}
          {design.palette && design.palette.length > 0 && (
            <div className="space-y-4 border-t border-stone-200 pt-8">
              <h3 className="font-serif text-xl text-stone-900 font-light">Color & Texture Palette</h3>
              <div className="flex flex-wrap items-center gap-4">
                {design.palette.map((hex, i) => (
                  <div key={i} className="flex items-center gap-2.5 p-2 rounded-lg border border-stone-200 bg-white">
                    <span
                      className="w-7 h-7 rounded-md border border-stone-300 shadow-2xs"
                      style={{ backgroundColor: hex }}
                    />
                    <span className="text-xs font-mono text-stone-700 uppercase font-medium">{hex}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Materials List */}
          {design.materials && design.materials.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xs uppercase tracking-wider font-semibold text-stone-500">
                Specified Materials & Finishes
              </h4>
              <div className="flex flex-wrap gap-2">
                {design.materials.map((mat, i) => (
                  <span
                    key={i}
                    className="text-xs px-3 py-1 rounded-md bg-stone-100 text-stone-800 border border-stone-200/80 font-medium"
                  >
                    {mat}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          {design.tags && (
            <div className="flex flex-wrap items-center gap-2 pt-2">
              {design.tags.map((tag, i) => (
                <span key={i} className="text-[11px] text-stone-500 font-mono">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Right 1 Col: Action Card & Designer Bio */}
        <div className="space-y-6">
          {/* Reservation Card */}
          <div className="p-6 rounded-2xl bg-stone-900 text-stone-100 space-y-5 shadow-lg border border-stone-800">
            <div className="space-y-1">
              <span className="text-xs uppercase tracking-widest text-amber-300 font-semibold">
                Bespoke Realization
              </span>
              <h3 className="font-serif text-2xl font-light text-white">
                Commission a Space Like This
              </h3>
              <p className="text-xs text-stone-300 font-light leading-relaxed">
                Our architects can adapt the spatial layout, material palette, and custom joinery of this project to your residence.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <Button
                variant="luxury"
                size="md"
                onClick={() =>
                  openBookingModal({
                    designTitle: design.title,
                    roomType: design.roomType,
                    stylePreference: design.style,
                  })
                }
                className="w-full uppercase text-xs tracking-wider"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                Book Consultation for this Space
              </Button>

              <Button
                variant="outline"
                size="md"
                onClick={handleWishlist}
                className="w-full border-stone-700 text-stone-300 hover:bg-stone-800 hover:text-white uppercase text-xs tracking-wider"
              >
                <Heart className={`w-3.5 h-3.5 ${wishlisted ? 'fill-amber-400 text-amber-400' : ''}`} />
                {wishlisted ? 'In Wishlist' : 'Add to Wishlist'}
              </Button>
            </div>
          </div>

          {/* Designer Bio Card */}
          <div className="p-6 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-4">
            <span className="text-[11px] uppercase tracking-wider text-stone-500 font-semibold">
              Lead Architect & Designer
            </span>
            <div className="flex items-center gap-3">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
                alt={design.designerName}
                className="w-12 h-12 rounded-full object-cover border border-amber-800/30"
              />
              <div>
                <h4 className="font-serif text-base text-stone-900 font-medium">{design.designerName}</h4>
                <p className="text-xs text-stone-500 font-mono">Principal Director • Atelier Luxe</p>
              </div>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed font-light">
              "True architectural luxury is silent. It exists in the transition between light and shadow, and the tactile honesty of authentic stone and timber."
            </p>
          </div>
        </div>
      </div>

      {/* Client Reviews Section */}
      <section className="border-t border-stone-200 pt-16 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] text-stone-500 font-semibold">
              Client Feedback
            </span>
            <h2 className="font-serif text-3xl text-stone-900 font-light">
              Reviews & Reflections ({reviews.length})
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${i < Math.round(averageRating) ? 'fill-amber-400' : 'text-stone-300'}`}
                />
              ))}
            </div>
            <span className="text-sm font-semibold text-stone-800">{averageRating.toFixed(1)} / 5.0</span>
          </div>
        </div>

        {/* Reviews List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviews.map((rev) => (
            <div key={rev.id} className="p-6 rounded-xl bg-stone-50 border border-stone-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-amber-500">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-500" />
                  ))}
                </div>
                {rev.verifiedBooking && (
                  <span className="text-[10px] uppercase font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" /> Verified Client
                  </span>
                )}
              </div>

              <p className="text-xs text-stone-700 italic leading-relaxed">"{rev.comment}"</p>

              <div className="pt-2 flex items-center gap-2 text-xs text-stone-500">
                <span className="font-medium text-stone-900">{rev.userName}</span>
                <span>•</span>
                <span>{new Date(rev.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Leave a Review Form */}
        <div className="p-8 rounded-2xl bg-white border border-stone-200/90 shadow-2xs space-y-4 max-w-2xl">
          <h3 className="font-serif text-xl text-stone-900 font-light">
            Share Your Experience with this Design
          </h3>
          <form onSubmit={handleReviewSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700">
                Your Rating
              </label>
              <div className="flex items-center gap-1 text-stone-300">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 cursor-pointer focus:outline-none"
                  >
                    <Star
                      className={`w-6 h-6 ${star <= rating ? 'fill-amber-400 text-amber-400' : 'text-stone-300'}`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <Textarea
              label="Your Review"
              placeholder="Reflect on the spatial quality, materials, or lighting of this project..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
              required
            />

            <Button
              type="submit"
              variant="luxury"
              isLoading={isSubmittingReview}
              className="uppercase text-xs tracking-wider"
            >
              Post Review
            </Button>
          </form>
        </div>
      </section>

      {/* Related Projects */}
      {relatedDesigns.length > 0 && (
        <section className="border-t border-stone-200 pt-16 space-y-8">
          <h2 className="font-serif text-3xl text-stone-900 font-light">
            Complementary Spaces
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {relatedDesigns.map((rel) => (
              <div
                key={rel.id}
                onClick={() => navigate('design-detail', { designId: rel.id })}
                className="group cursor-pointer space-y-3"
              >
                <div className="aspect-[4/3] rounded-xl overflow-hidden bg-stone-100 border border-stone-200">
                  <img
                    src={rel.images[0]}
                    alt={rel.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <p className="text-xs uppercase font-mono text-stone-400">{rel.style}</p>
                <h4 className="font-serif text-lg text-stone-900 group-hover:text-amber-900 transition-colors">
                  {rel.title}
                </h4>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

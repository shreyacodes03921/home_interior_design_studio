import React, { useEffect, useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { useAuthStore } from '../store/useAuthStore';
import { api } from '../api/client';
import { Design } from '../types';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import {
  Heart,
  Search,
  SlidersHorizontal,
  LayoutGrid,
  Rows,
  Eye,
  ArrowRight,
  Filter,
  X,
} from 'lucide-react';

export const PortfolioPage: React.FC = () => {
  const { navigate, openLightbox, addToast, openAuthModal } = useAppStore();
  const { user, toggleWishlist, isWishlisted } = useAuthStore();

  const [designs, setDesigns] = useState<Design[]>([]);
  const [roomFilter, setRoomFilter] = useState<string>('all');
  const [styleFilter, setStyleFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('recent');
  const [viewMode, setViewMode] = useState<'grid' | 'masonry'>('grid');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchDesigns = () => {
    setIsLoading(true);
    api.designs
      .getAll({
        roomType: roomFilter !== 'all' ? roomFilter : undefined,
        style: styleFilter !== 'all' ? styleFilter : undefined,
        search: searchQuery.trim() || undefined,
        sort: sortBy,
      })
      .then((res) => {
        if (res.success) setDesigns(res.designs);
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchDesigns();
  }, [roomFilter, styleFilter, sortBy]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchDesigns();
  };

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
      description: added ? 'Access anytime from your client dashboard.' : undefined,
    });
  };

  const roomOptions = [
    { id: 'all', label: 'All Rooms' },
    { id: 'living-room', label: 'Living Room' },
    { id: 'bedroom', label: 'Bedroom' },
    { id: 'kitchen', label: 'Kitchen' },
    { id: 'office', label: 'Office' },
    { id: 'bathroom', label: 'Bathroom' },
    { id: 'dining-room', label: 'Dining Room' },
  ];

  const styleOptions = [
    { id: 'all', label: 'All Aesthetics' },
    { id: 'Japandi', label: 'Scandinavian Japandi' },
    { id: 'Contemporary', label: 'Contemporary Luxury' },
    { id: 'Minimalist', label: 'Modern Minimalist' },
    { id: 'Mid-Century', label: 'Mid-Century Modern' },
    { id: 'Mediterranean', label: 'Warm Mediterranean' },
    { id: 'Traditional', label: 'Traditional Elegant' },
  ];

  const resetFilters = () => {
    setRoomFilter('all');
    setStyleFilter('all');
    setSearchQuery('');
    setSortBy('recent');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="space-y-4 max-w-2xl">
        <span className="text-xs uppercase tracking-[0.25em] text-stone-500 font-semibold">
          Architectural Archive
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl text-stone-900 font-light tracking-tight">
          Portfolio & Spatial Gallery
        </h1>
        <p className="text-sm text-stone-600 font-light leading-relaxed">
          Browse our completed residential sanctuaries by room category, material typology, and architectural style.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200/90 shadow-2xs space-y-5">
        {/* Top Row: Search & View Options */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          {/* Search Input */}
          <form onSubmit={handleSearch} className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by materials (e.g. travertine, oak, limewash) or design title..."
              className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-300/80 rounded-lg text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-800"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  api.designs.getAll({ roomType: roomFilter !== 'all' ? roomFilter : undefined, style: styleFilter !== 'all' ? styleFilter : undefined, sort: sortBy }).then(res => res.success && setDesigns(res.designs));
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </form>

          {/* Sort & View Mode Controls */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-stone-600">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-stone-50 border border-stone-300 rounded-md px-2.5 py-1.5 text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-stone-800"
              >
                <option value="recent">Newest Released</option>
                <option value="views">Most Viewed</option>
                <option value="title">Alphabetical (A-Z)</option>
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="border border-stone-200 rounded-lg p-0.5 flex items-center bg-stone-50">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-md cursor-pointer ${
                  viewMode === 'grid' ? 'bg-white shadow-2xs text-stone-900' : 'text-stone-400 hover:text-stone-700'
                }`}
                title="Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('masonry')}
                className={`p-1.5 rounded-md cursor-pointer ${
                  viewMode === 'masonry' ? 'bg-white shadow-2xs text-stone-900' : 'text-stone-400 hover:text-stone-700'
                }`}
                title="Masonry View"
              >
                <Rows className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Room Type Pills */}
        <div className="space-y-2 pt-2 border-t border-stone-100">
          <div className="flex items-center justify-between text-xs text-stone-500 uppercase tracking-wider font-semibold">
            <span>Room Type</span>
            {(roomFilter !== 'all' || styleFilter !== 'all' || searchQuery) && (
              <button
                onClick={resetFilters}
                className="text-amber-800 hover:underline cursor-pointer flex items-center gap-1 font-normal lowercase text-[11px]"
              >
                Clear all filters
              </button>
            )}
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {roomOptions.map((opt) => (
              <button
                key={opt.id}
                onClick={() => setRoomFilter(opt.id)}
                className={`text-xs uppercase tracking-wider px-3.5 py-1.5 rounded-full transition-all cursor-pointer whitespace-nowrap ${
                  roomFilter === opt.id
                    ? 'bg-stone-900 text-stone-50 font-semibold'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Style Typology Pills */}
        <div className="space-y-2 pt-1">
          <div className="text-xs text-stone-500 uppercase tracking-wider font-semibold">
            Architectural Style
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {styleOptions.map((opt) => (
              <button
                key={opt.id}
                onClick={() => setStyleFilter(opt.id)}
                className={`text-xs uppercase tracking-wider px-3.5 py-1.5 rounded-full transition-all cursor-pointer whitespace-nowrap ${
                  styleFilter === opt.id
                    ? 'bg-amber-950 text-amber-200 font-semibold border border-amber-800/80'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs uppercase tracking-wider text-stone-500">
        <span>Showing {designs.length} Curated Residences</span>
        <span>Studio Archive 2024–2026</span>
      </div>

      {/* Portfolio Gallery Display */}
      {isLoading ? (
        <div className="h-64 flex items-center justify-center text-stone-400">
          <span className="animate-pulse font-serif text-lg">Retrieving design collections...</span>
        </div>
      ) : designs.length === 0 ? (
        <div className="p-16 text-center bg-white rounded-2xl border border-stone-200 space-y-4">
          <Filter className="w-10 h-10 text-stone-300 mx-auto" />
          <h3 className="font-serif text-2xl text-stone-800">No matching projects found</h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            Try resetting your room filters or searching for alternative materials like oak, limestone, or linen.
          </p>
          <Button variant="outline" size="sm" onClick={resetFilters} className="uppercase text-xs tracking-wider">
            Reset Filters
          </Button>
        </div>
      ) : (
        <div
          className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'
              : 'columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8'
          }
        >
          {designs.map((design) => {
            const wishlisted = isWishlisted(design.id);

            return (
              <div
                key={design.id}
                onClick={() => navigate('design-detail', { designId: design.id })}
                className="group bg-white rounded-xl overflow-hidden border border-stone-200/90 shadow-2xs hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col break-inside-avoid"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-stone-100">
                  <img
                    src={design.images[0]}
                    alt={design.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <div className="absolute top-3 left-3">
                    <Badge variant="luxury">{design.category}</Badge>
                  </div>

                  <button
                    onClick={(e) => handleWishlist(e, design.id)}
                    className="absolute top-3 right-3 p-2 rounded-full bg-stone-900/60 hover:bg-stone-900 text-white backdrop-blur-xs transition-colors cursor-pointer"
                    title={wishlisted ? 'Remove from Wishlist' : 'Save to Wishlist'}
                  >
                    <Heart className={`w-4 h-4 ${wishlisted ? 'fill-amber-400 text-amber-400' : 'text-white'}`} />
                  </button>

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

                  {design.materials && (
                    <div className="flex flex-wrap gap-1">
                      {design.materials.slice(0, 3).map((mat, i) => (
                        <span
                          key={i}
                          className="text-[10px] px-2 py-0.5 rounded bg-stone-100 text-stone-600 font-medium"
                        >
                          {mat}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                    <span className="text-xs font-mono text-stone-400">
                      {design.viewCount || 0} views
                    </span>
                    <span className="text-xs uppercase tracking-wider text-stone-800 group-hover:text-amber-900 font-medium flex items-center gap-1">
                      Explore Project <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

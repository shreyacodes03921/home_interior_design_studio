import React, { useEffect } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { X, ZoomIn } from 'lucide-react';

export const ImageLightbox: React.FC = () => {
  const { lightboxImage, closeLightbox } = useAppStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
    };
    if (lightboxImage) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [lightboxImage, closeLightbox]);

  if (!lightboxImage) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-stone-950/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-200"
      onClick={closeLightbox}
    >
      <button
        onClick={closeLightbox}
        className="absolute top-6 right-6 p-2 rounded-full bg-stone-900/80 text-stone-200 hover:text-white hover:bg-stone-800 transition-colors z-10 cursor-pointer"
        aria-label="Close image preview"
      >
        <X className="w-6 h-6" />
      </button>

      <div
        className="relative max-w-6xl max-h-[90vh] overflow-hidden rounded-xl shadow-2xl border border-stone-800"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={lightboxImage}
          alt="High-resolution interior design preview"
          className="w-full h-full object-contain max-h-[85vh] select-none"
        />
        <div className="absolute bottom-3 left-4 text-xs tracking-wider uppercase text-stone-300 bg-stone-950/70 px-3 py-1 rounded-full backdrop-blur-xs flex items-center gap-1.5">
          <ZoomIn className="w-3.5 h-3.5 text-amber-300" />
          Atelier Luxe Architectural Resolution
        </div>
      </div>
    </div>
  );
};

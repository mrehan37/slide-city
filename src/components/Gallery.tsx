import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Eye, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { GALLERY_ITEMS } from '../data';

export default function Gallery() {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const categories = [
    { key: 'all', label: 'All Media' },
    { key: 'action', label: 'Drift Action' },
    { key: 'karts', label: 'Our E-Karts' },
    { key: 'track', label: 'Track & Lights' },
    { key: 'events', label: 'Celebrations' },
  ];

  const filteredItems = activeCategory === 'all'
    ? GALLERY_ITEMS
    : GALLERY_ITEMS.filter(item => item.category === activeCategory);

  const openLightbox = (id: string) => {
    // Find absolute index inside GALLERY_ITEMS to make sliding navigation seamless
    const idx = GALLERY_ITEMS.findIndex(item => item.id === id);
    if (idx !== -1) setLightboxIndex(idx);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
  };

  const slideNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % GALLERY_ITEMS.length);
    }
  };

  const slidePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex - 1 + GALLERY_ITEMS.length) % GALLERY_ITEMS.length);
    }
  };

  return (
    <section id="gallery" className="relative py-24 bg-zinc-950 overflow-hidden border-t border-zinc-900 text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-xl">
            <span className="text-red-500 text-xs font-black uppercase tracking-[0.2em] font-mono border border-zinc-850 px-3.5 py-1 bg-zinc-950/40 inline-block rounded-none">
              PIX FROM THE PITWALL
            </span>
            <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white font-display mt-3 italic">
              THE SLIDE GALLERY
            </h2>
            <p className="text-zinc-400 text-sm sm:text-base mt-3 font-sans">
              Explore actual high-contrast shots of our rear-axis drift racers, certified carbon-fiber helmets, glowing neon lanes, and podium ceremonies. Click any shot to expand.
            </p>
          </div>

          {/* Filter Pill Badges */}
          <div className="flex flex-wrap gap-2 mt-6 md:mt-0 bg-zinc-900 border border-zinc-850 p-1.5 rounded-none font-mono">
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                id={`cat-filter-btn-${cat.key}`}
                className={`py-2 px-4 rounded-none text-xs uppercase font-black tracking-widest cursor-pointer transition-all transform -skew-x-12 ${
                  activeCategory === cat.key
                    ? 'bg-red-655 text-white italic'
                    : 'text-zinc-450 hover:text-white'
                }`}
              >
                <span className="inline-block skew-x-12">{cat.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Bento Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25 }}
                onClick={() => openLightbox(item.id)}
                className={`group cursor-pointer overflow-hidden rounded-none bg-zinc-950/50 border border-zinc-855 relative ${item.aspect}`}
              >
                {/* Image thumb */}
                <img 
                  src={item.image} 
                  alt={item.title} 
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 opacity-75 group-hover:opacity-100"
                />

                {/* Dark Hover overlay with Eye Symbol */}
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent opacity-0 group-hover:opacity-95 transition-opacity duration-300 flex flex-col justify-end p-5 text-left">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-red-500 text-xs font-black uppercase tracking-widest font-mono block">
                        🏁 // {item.category}
                      </span>
                      <h3 className="text-white text-sm sm:text-base font-black uppercase tracking-wider font-display mt-1.5 italic">
                        {item.title}
                      </h3>
                    </div>
                    <div className="bg-zinc-950 p-2.5 rounded-none border border-zinc-850 text-white shadow-lg flex-shrink-0">
                      <Eye className="w-4 h-4 text-red-500" />
                    </div>
                  </div>
                </div>

              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Lightbox Modal overlay slider with AnimatePresence */}
        <AnimatePresence>
          {lightboxIndex !== null && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeLightbox}
              className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex flex-col items-center justify-center p-4 md:p-8"
            >
              
              {/* Close Button top row */}
              <div className="absolute top-6 right-6 z-50 flex items-center gap-3">
                <span className="text-xs text-zinc-550 font-mono hidden md:inline-block tracking-widest uppercase">
                  ESC or TAP OUTSIDE TO EXIT
                </span>
                <button
                  onClick={closeLightbox}
                  id="lightbox-close-btn"
                  className="p-3 bg-zinc-950 hover:bg-zinc-900 text-white rounded-none border border-zinc-850 focus:outline-none cursor-pointer transform -skew-x-12"
                >
                  <X className="w-4.5 h-4.5 skew-x-12" />
                </button>
              </div>

              {/* Slider panel content */}
              <div className="max-w-5xl w-full flex items-center justify-between gap-4 relative">
                
                {/* Prev Slide button left */}
                <button
                  onClick={slidePrev}
                  id="lightbox-prev-btn"
                  className="p-3 bg-zinc-950 hover:bg-zinc-900 text-white rounded-none border border-zinc-850 focus:outline-none cursor-pointer hidden sm:flex-shrink-0 sm:flex items-center justify-center transform -skew-x-12"
                >
                  <ChevronLeft className="w-5 h-5 skew-x-12" />
                </button>

                {/* Extended Photo with dynamic animations */}
                <div className="flex-grow flex flex-col items-center">
                  <motion.img
                    key={lightboxIndex}
                    initial={{ scale: 0.98, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 140 }}
                    src={GALLERY_ITEMS[lightboxIndex].image}
                    alt={GALLERY_ITEMS[lightboxIndex].title}
                    className="max-h-[65vh] w-auto max-w-full object-contain rounded-none border border-zinc-850 shadow-2xl"
                  />

                  {/* Caption information metadata */}
                  <div className="text-center mt-6 max-w-lg">
                    <span className="text-red-500 text-xs font-black uppercase tracking-widest font-mono">
                      Media {lightboxIndex + 1} of {GALLERY_ITEMS.length} • Category: {GALLERY_ITEMS[lightboxIndex].category}
                    </span>
                    <h4 className="text-white text-base md:text-lg font-black uppercase font-display mt-1.5 italic">
                      {GALLERY_ITEMS[lightboxIndex].title}
                    </h4>
                  </div>
                </div>

                {/* Next Slide button right */}
                <button
                  onClick={slideNext}
                  id="lightbox-next-btn"
                  className="p-3 bg-zinc-950 hover:bg-zinc-900 text-white rounded-none border border-zinc-850 focus:outline-none cursor-pointer hidden sm:flex-shrink-0 sm:flex items-center justify-center transform -skew-x-12"
                >
                  <ChevronRight className="w-5 h-5 skew-x-12" />
                </button>

              </div>

              {/* Mobile Swipe / Quick bottom slider indicators */}
              <div className="sm:hidden flex gap-4 mt-8 font-mono">
                <button
                  onClick={slidePrev}
                  id="lightbox-mobile-prev"
                  className="py-2.5 px-4 bg-zinc-95 w-24 bg-zinc-950 border border-zinc-850 text-white rounded-none text-xs uppercase font-black focus:outline-none cursor-pointer transform -skew-x-12"
                >
                  <span className="inline-block skew-x-12">Prev</span>
                </button>
                <button
                  onClick={slideNext}
                  id="lightbox-mobile-next"
                  className="py-2.5 px-4 bg-zinc-95 w-24 bg-zinc-955 border border-zinc-850 text-white rounded-none text-xs uppercase font-black focus:outline-none cursor-pointer transform -skew-x-12"
                >
                  <span className="inline-block skew-x-12">Next</span>
                </button>
              </div>

            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}

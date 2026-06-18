import { useEffect, useMemo, useState } from 'react';
import { ExternalLink, Quote, Star } from 'lucide-react';
import { TESTIMONIALS } from '../data';
import { Testimonial } from '../types';

const GOOGLE_REVIEWS_URL =
  'https://www.google.com/maps?cid=15475330145257075926&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAMYASAF&hl=en-US&source=embed';
const INITIAL_REVIEW_COUNT = 3;

type ReviewCard = Testimonial & {
  sourceUrl?: string;
  relativeTime?: string;
};

interface GoogleReviewsResponse {
  placeName?: string;
  rating?: number | null;
  userRatingCount?: number | null;
  reviews?: ReviewCard[];
  sourceUrl?: string;
  source?: 'google';
}

const getInitials = (name: string) =>
  name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

export default function Testimonials() {
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [googleReviews, setGoogleReviews] = useState<ReviewCard[]>([]);
  const [googleRating, setGoogleRating] = useState<number | null>(null);
  const [googleReviewCount, setGoogleReviewCount] = useState<number | null>(null);
  const [sourceUrl, setSourceUrl] = useState(GOOGLE_REVIEWS_URL);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [reviewsError, setReviewsError] = useState('');

  useEffect(() => {
    let isMounted = true;

    const fetchGoogleReviews = async () => {
      try {
        const response = await fetch('/api/google-reviews');

        if (!response.ok) {
          throw new Error('Google reviews unavailable');
        }

        const data = (await response.json()) as GoogleReviewsResponse;

        if (!isMounted) return;

        setGoogleReviews(data.reviews || []);
        setGoogleRating(data.rating ?? null);
        setGoogleReviewCount(data.userRatingCount ?? null);
        setSourceUrl(data.sourceUrl || GOOGLE_REVIEWS_URL);
        setReviewsError('');
      } catch {
        if (!isMounted) return;
        setReviewsError('Google reviews are not connected yet, so sample feedback is shown for now.');
      } finally {
        if (isMounted) {
          setReviewsLoading(false);
        }
      }
    };

    fetchGoogleReviews();

    return () => {
      isMounted = false;
    };
  }, []);

  const allReviews: ReviewCard[] = googleReviews.length ? googleReviews : TESTIMONIALS;
  const isUsingGoogleReviews = googleReviews.length > 0;

  const tags = useMemo(() => {
    const reviewTags = Array.from(new Set(allReviews.map((review) => review.tag))).filter(Boolean);
    return [
      { key: 'all', label: 'All Reviews' },
      ...reviewTags.map((tag) => ({
        key: tag,
        label: tag === 'Google Review' ? 'Google Reviews' : `${tag}s`,
      })),
    ];
  }, [allReviews]);

  const filteredReviews = useMemo(() => selectedTag === 'all'
    ? allReviews
    : allReviews.filter(t => t.tag === selectedTag), [allReviews, selectedTag]);

  const visibleReviews = showAllReviews
    ? filteredReviews
    : filteredReviews.slice(0, INITIAL_REVIEW_COUNT);
  const hasMoreReviews = filteredReviews.length > INITIAL_REVIEW_COUNT;

  const averageRating = googleRating || (allReviews.length
    ? allReviews.reduce((total, review) => total + review.rating, 0) / allReviews.length
    : 0);
  const reviewCount = googleReviewCount || allReviews.length;

  return (
    <section id="testimonials" className="relative py-24 bg-zinc-950 overflow-hidden border-t border-zinc-900 text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-xl">
            <span className="text-red-500 text-xs font-black uppercase tracking-[0.2em] font-mono border border-zinc-850 px-3.5 py-1 bg-zinc-950/40 inline-block rounded-none">
              FEEDBACK FROM THE FINISH LINE
            </span>
            <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white font-display mt-3 italic">
              RACER TESTIMONIALS
            </h2>
            <p className="text-zinc-400 text-sm sm:text-base mt-3 font-sans">
              See how families, HR teams, and seasoned motorsport competitors rate their high-energy experiences on the Slide City curves.
            </p>
          </div>

          {/* Quick filter row badges */}
          <div className="flex flex-wrap gap-2 mt-6 md:mt-0 bg-zinc-900 border border-zinc-850 p-1 rounded-none font-mono">
            {tags.map((t) => (
              <button
                key={t.key}
                onClick={() => {
                  setSelectedTag(t.key);
                  setShowAllReviews(false);
                }}
                id={`tm-filter-btn-${t.key}`}
                className={`py-1.5 px-3 rounded-none text-xs uppercase font-black tracking-widest cursor-pointer transition-all transform -skew-x-12 ${
                  selectedTag === t.key
                    ? 'bg-red-600 text-white italic shadow-md'
                    : 'text-zinc-450 hover:text-white'
                }`}
              >
                <span className="inline-block skew-x-12">{t.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          <div className="lg:col-span-8 bg-zinc-950/30 border border-zinc-855 rounded-none p-5 md:p-6 space-y-5">
            <div className="flex items-center gap-2">
              <div className="bg-red-600 p-2 text-white">
                <Star className="w-4 h-4 fill-current" />
              </div>
              <div>
                <h3 className="text-white text-sm font-black uppercase tracking-wider italic">
                  Google Reviews
                </h3>
                <p className="text-zinc-400 text-sm font-sans">
                  {isUsingGoogleReviews ? 'Pulled from Google Places and shown directly on this page.' : 'Google Places will load here once the API key and place ID are configured.'}
                </p>
              </div>
            </div>

            <p className="text-zinc-400 text-sm sm:text-base leading-relaxed font-sans max-w-2xl">
              {reviewsLoading
                ? 'Loading the latest Google review cards...'
                : isUsingGoogleReviews
                  ? 'We show a short set of Google review cards first so the section stays clean. Use view more to expand the list.'
                  : reviewsError}
            </p>

            <a
              href={sourceUrl}
              target="_blank"
              rel="noreferrer"
              className="bg-red-600 hover:bg-red-700 text-white py-3 px-5 sm:px-6 rounded-none text-xs sm:text-sm font-black uppercase tracking-wide sm:tracking-widest transform -skew-x-12 cursor-pointer text-center"
            >
              <span className="inline-flex skew-x-12 items-center justify-center gap-2 leading-tight">
                View on Google <ExternalLink className="w-3.5 h-3.5 flex-shrink-0" />
              </span>
            </a>
          </div>

          <div className="lg:col-span-4 bg-zinc-950/30 border border-zinc-855 rounded-none p-5 md:p-6 flex flex-col justify-between gap-5">
            <div>
              <span className="text-red-500 text-xs font-black uppercase tracking-[0.2em] font-mono">
                Review System
              </span>
              <h3 className="text-white text-3xl font-black italic mt-2">
                {averageRating.toFixed(1)}/5.0
              </h3>
              <p className="text-zinc-400 text-sm mt-2 leading-relaxed">
                Based on {reviewCount} {isUsingGoogleReviews ? 'Google' : 'displayed'} reviews.
              </p>
            </div>

            <a
              href={sourceUrl}
              target="_blank"
              rel="noreferrer"
              className="border border-zinc-800 hover:border-red-600 text-zinc-300 hover:text-white py-3 px-4 rounded-none text-sm font-black uppercase tracking-widest text-center transition-colors"
            >
              View on Google
            </a>
          </div>
        </div>

        {/* Testimonials Review Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {visibleReviews.map((tm) => (
            <a
              key={tm.id}
              href={tm.sourceUrl || sourceUrl}
              target="_blank"
              rel="noreferrer"
              className="bg-zinc-950/20 border border-zinc-855 rounded-none p-6 md:p-8 flex flex-col justify-between relative transition-all duration-300 hover:border-red-650/40 w-full group shadow-md"
            >
              
              {/* Massive graphic quotes character */}
              <div className="absolute top-6 right-6 text-zinc-900/40 group-hover:text-red-600/10 transition-colors pointer-events-none select-none">
                <Quote className="w-12 h-12 stroke-[1.5]" />
              </div>

              {/* Verified Driver Label Badge */}
              <div className="flex justify-between items-start mb-6">
                <div className="inline-flex items-center gap-1.5 bg-zinc-950 py-1 px-2.5 border border-zinc-900 rounded-none text-xs text-red-500 font-bold uppercase tracking-widest font-mono">
                  ★ {isUsingGoogleReviews ? 'Google Review' : 'Verified Driver'} // {tm.tag}
                </div>
              </div>

              {/* Review Text body */}
              <p className="text-zinc-300 text-sm sm:text-base leading-relaxed mb-6 font-medium font-sans">
                "{tm.text}"
              </p>

              {/* Stars & Author Details */}
              <div className="border-t border-zinc-900 pt-6 mt-auto">
                {/* 5-Star Ratings */}
                <div className="flex gap-1 mb-4 select-none">
                  {Array.from({ length: tm.rating }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 text-red-600 fill-current" />
                  ))}
                </div>

                {/* Author Info */}
                <div className="flex items-center gap-3">
                  {tm.avatar ? (
                    <img 
                      src={tm.avatar} 
                      alt={tm.name} 
                      loading="lazy"
                      decoding="async"
                      className="w-10 h-10 rounded-none object-cover border border-zinc-850"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-none border border-zinc-850 bg-red-600 text-white flex items-center justify-center text-xs font-black">
                      {getInitials(tm.name)}
                    </div>
                  )}
                  <div>
                    <h3 className="text-white text-xs font-black uppercase tracking-wider font-display">
                      {tm.name}
                    </h3>
                    <p className="text-zinc-400 text-sm font-medium font-sans mt-1">
                      {tm.role}
                    </p>
                  </div>
                </div>
              </div>

            </a>
          ))}
        </div>

        {hasMoreReviews && (
          <div className="mt-8 flex justify-center">
            <button
              onClick={() => setShowAllReviews(!showAllReviews)}
              className="bg-zinc-950 hover:bg-red-600 text-zinc-300 hover:text-white border border-zinc-800 hover:border-red-600 py-3 px-5 sm:px-7 rounded-none text-xs sm:text-sm font-black uppercase tracking-wide sm:tracking-widest transform -skew-x-12 cursor-pointer transition-colors"
            >
              <span className="inline-flex skew-x-12 items-center justify-center gap-2 text-center leading-tight">
                {showAllReviews ? 'Show Less Reviews' : `View More Reviews (${filteredReviews.length - INITIAL_REVIEW_COUNT})`}
              </span>
            </button>
          </div>
        )}

        {/* Bottom review aggregate statistics */}
        <div className="mt-12 bg-zinc-950/20 border border-zinc-855 rounded-none p-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="space-y-1">
            <h4 className="text-white text-xs font-black uppercase font-display flex items-center justify-center sm:justify-start gap-2 italic">
              🏆 #1 Top-Rated Family Destination
            </h4>
            <p className="text-zinc-400 text-sm">
              {isUsingGoogleReviews ? 'Review wall powered by Google Places. Open Google Maps for the full listing.' : 'Sample review wall shown until Google Places credentials are configured.'}
            </p>
          </div>
          
          <div className="flex gap-1 text-red-600 select-none flex-shrink-0 items-center">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="w-3.5 h-3.5 fill-current text-red-600" />
            ))}
            <span className="text-white text-xs font-black font-mono ml-2 mt-0.5 tracking-wider">
              {averageRating.toFixed(1)}/5.0 SCORE
            </span>
          </div>
        </div>

      </div>
    </section>
  );
}

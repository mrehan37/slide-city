import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Zap, Users, Clock, Award, ChevronsDown, Flag, Timer } from 'lucide-react';
import TrackConditionsBadge from './TrackConditionsBadge';
import { PEXELS_IMAGES } from '../data';

interface HeroProps {
  onBookClick: () => void;
  onViewPackagesClick: () => void;
}

export default function Hero({ onBookClick, onViewPackagesClick }: HeroProps) {
  const [timeLeft, setTimeLeft] = useState({ hours: 4, minutes: 28, seconds: 43 });

  // Demo countdown for the race-night promo card
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else {
          return { hours: 4, minutes: 0, seconds: 0 }; // Loop simulation
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatNumber = (num: number) => num.toString().padStart(2, '0');

  const highlights = [
    { text: 'Fast Electric Karts', sub: 'Instant Torque / Pro Models', icon: <Zap className="w-5 h-5 text-race-red" /> },
    { text: 'Lap Timing Boards', sub: 'Results After Every Heat', icon: <Clock className="w-5 h-5 text-race-blue" /> },
    { text: 'Specialised Parties', sub: 'Podiums, Catering, Private Grid', icon: <Users className="w-5 h-5 text-race-yellow" /> },
    { text: 'Beginner & Pro Levels', sub: 'Speed Limit Gated Classes', icon: <Award className="w-5 h-5 text-emerald-400" /> },
  ];

  return (
    <section 
      id="home" 
      className="relative min-h-screen bg-race-darker flex flex-col justify-center overflow-hidden pt-20"
    >
      {/* Immersive Racetrack Background Image with Skewed Dynamic Overlays */}
      <div className="absolute inset-0">
        <img 
          src={PEXELS_IMAGES.indoorRace}
          srcSet={`${PEXELS_IMAGES.indoorRaceSmall} 960w, ${PEXELS_IMAGES.indoorRace} 1600w`}
          sizes="100vw"
          alt="Go-kart racers taking a bend on an indoor karting track"
          loading="eager"
          decoding="async"
          fetchPriority="high"
          className="w-full h-full object-cover scale-105 motion-safe:animate-[pulse-slow_8s_infinite] opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-race-darker via-race-darker/70 to-transparent"></div>
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-race-darker to-transparent"></div>
        
        {/* Graphic grid lines representing racing coordinates */}
        <div className="absolute inset-0 bg-grid-pattern opacity-40 mix-blend-color-dodge"></div>
        <div className="absolute top-0 right-0 w-1/3 h-full bg-speed-lines opacity-20 hidden lg:block"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24 z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Main Action Text Column */}
          <div className="col-span-1 lg:col-span-7 flex flex-col items-start gap-6 text-left">
            
            {/* Intro badges */}
            <div className="flex flex-wrap items-center gap-3">
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2.5 bg-zinc-950 border border-zinc-900 px-4 py-1.5 text-xs text-white"
              >
                <div className="w-1.5 h-1.5 bg-red-600 rounded-none" />
                <span className="text-xs font-black tracking-[0.2em] uppercase text-zinc-300 font-racing">
                  UK KARTING BOOKINGS
                </span>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.15 }}
              >
                <TrackConditionsBadge />
              </motion.div>
            </div>

            {/* Spectacular Heading in Bold Italic */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
            >
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black uppercase tracking-tighter text-white font-display leading-[0.85] italic">
                Own the Track at <br />
                <span className="text-red-600 font-black italic relative block mt-2 text-5xl sm:text-6xl md:text-7xl lg:text-8xl">
                  SLIDE CITY
                </span>
              </h1>
            </motion.div>

            {/* Subtitle description */}
            <motion.p 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-zinc-400 text-sm sm:text-base md:text-lg max-w-xl font-normal leading-relaxed"
            >
              High-speed electric go-kart racing, razor-sharp drift-style turns, lap timing boards, and unforgettable UK race-day energy built for friends, families, and competitive drivers.
            </motion.p>

            {/* Micro-Interaction CTA Blocks */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto pt-2"
            >
              <button
                onClick={onBookClick}
                id="hero-cta-book"
                className="bg-red-600 hover:bg-red-700 text-white py-4 px-8 rounded-none text-sm font-black uppercase tracking-widest shadow-lg transform -skew-x-12 transition-all duration-300 cursor-pointer"
              >
                <span className="inline-flex skew-x-[12deg] items-center justify-center gap-2 whitespace-nowrap">
                  <Flag className="w-4 h-4" /> Book A Race
                </span>
              </button>

              <button
                onClick={onViewPackagesClick}
                id="hero-cta-packages"
                className="bg-zinc-950 hover:bg-zinc-900 text-white border border-zinc-800 py-4 px-8 rounded-none text-sm font-black uppercase tracking-widest transform -skew-x-12 transition-all duration-300 cursor-pointer"
              >
                <span className="inline-block skew-x-[12deg]">
                  View Packages
                </span>
              </button>
            </motion.div>

          </div>

          {/* Immersive Event Board Widget (Promotional Race Countdown / Timing Banner) */}
          <div className="col-span-1 lg:col-span-5 w-full flex justify-center py-6">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.7 }}
              className="w-full max-w-sm bg-zinc-950 border border-zinc-850 rounded-none p-6 shadow-2xl relative"
            >
              {/* Dynamic Grid Skew Accent badge */}
              <div className="absolute -top-3.5 -right-1 bg-red-600 text-white text-xs font-black uppercase tracking-widest py-1 px-3 skew-x-[-12deg] shadow-lg rounded-none">
                FEATURED FORMAT
              </div>

              <div className="flex items-center gap-2.5 border-b border-zinc-900 pb-4 mb-4">
                <div className="bg-red-600/10 p-2.5 rounded-none">
                  <Timer className="w-4.5 h-4.5 text-red-600" />
                </div>
                <div>
                  <h3 className="text-white text-xs font-black uppercase tracking-widest font-display">
                    Race Night Format
                  </h3>
                  <p className="text-zinc-400 text-sm uppercase font-bold">
                    Slide Tournament Series
                  </p>
                </div>
              </div>

              {/* Countdown metrics */}
              <div className="grid grid-cols-3 gap-3 text-center mb-5">
                <div className="bg-zinc-900 border border-zinc-850 rounded-none py-3 px-2">
                  <div className="text-3xl font-black font-racing text-red-600 tracking-tight">
                    {formatNumber(timeLeft.hours)}
                  </div>
                  <div className="text-xs font-bold text-zinc-500 uppercase tracking-wider mt-0.5">HRS</div>
                </div>
                <div className="bg-zinc-900 border border-zinc-850 rounded-none py-3 px-2">
                  <div className="text-3xl font-black font-racing text-white tracking-tight animate-pulse">
                    {formatNumber(timeLeft.minutes)}
                  </div>
                  <div className="text-xs font-bold text-zinc-500 uppercase tracking-wider mt-0.5">MINS</div>
                </div>
                <div className="bg-zinc-900 border border-zinc-850 rounded-none py-3 px-2">
                  <div className="text-3xl font-black font-racing text-red-600 tracking-tight">
                    {formatNumber(timeLeft.seconds)}
                  </div>
                  <div className="text-xs font-bold text-zinc-500 uppercase tracking-wider mt-0.5">SECS</div>
                </div>
              </div>

              {/* Tournament detail lists */}
              <div className="space-y-3 bg-zinc-900/40 border border-zinc-850 rounded-none p-3.5 text-xs">
                <div className="flex justify-between border-b border-zinc-900 pb-1.5 ">
                  <span className="text-zinc-500 font-bold uppercase text-xs">Tonight Tournament:</span>
                  <span className="text-white font-bold select-none text-xs">Drift Showdown</span>
                </div>
                <div className="flex justify-between border-b border-zinc-900 pb-1.5">
                  <span className="text-zinc-500 font-bold uppercase text-xs">Class Requirements:</span>
                  <span className="text-red-600 font-bold uppercase tracking-wider text-xs">AM & PRO</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500 font-bold uppercase text-xs">Prizes Pool:</span>
                  <span className="text-white font-bold text-xs">£500 + Golden Cup</span>
                </div>
              </div>

              <button 
                onClick={onBookClick}
                className="w-full mt-4 bg-zinc-900 hover:bg-red-600 hover:text-white text-zinc-350 py-3 rounded-none text-sm uppercase font-extrabold tracking-widest border border-zinc-850 hover:border-red-600 transition-all duration-300"
              >
                Register Your Team Grid
              </button>
            </motion.div>
          </div>

        </div>

        {/* Dynamic highlights horizontal layout bar */}
        <div className="mt-16 md:mt-24 pt-8 border-t border-zinc-900">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {highlights.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1, duration: 0.5 }}
                className="flex items-start gap-4 p-4 rounded-none bg-zinc-950 border border-zinc-850 hover:border-red-650/30 hover:bg-zinc-900/40 transition-colors duration-300"
              >
                <div className="bg-zinc-900 p-2.5 rounded-none border border-zinc-850 flex-shrink-0">
                  {item.icon}
                </div>
                <div className="text-left font-display">
                  <h4 className="text-sm font-black text-white uppercase tracking-wider font-display">
                    {item.text}
                  </h4>
                  <p className="text-sm text-zinc-400 font-medium leading-relaxed">
                    {item.sub}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Scroll downstream indicator */}
        <div className="hidden md:flex justify-center mt-12 animate-bounce">
          <a href="#about" className="text-zinc-500 hover:text-race-red transition-colors">
            <ChevronsDown className="w-6 h-6" />
          </a>
        </div>

      </div>
    </section>
  );
}

import React from 'react';
import { ArrowUp, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  const scrollBackToTop = (e: React.MouseEvent) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-zinc-950 border-t border-zinc-900 text-left pt-16 pb-8 relative overflow-hidden">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 border-b border-zinc-900 pb-12 mb-10">
          
          {/* Logo & Brand statement */}
          <div className="col-span-1 md:col-span-5 space-y-4">
            <div
              className="inline-flex cursor-pointer"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              role="button"
              tabIndex={0}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
              aria-label="Back to top"
            >
              <img
                src="/images/slide-city-logo.png"
                alt="Slide City Go Karting"
                className="h-20 w-auto object-contain transition-transform duration-300 hover:scale-105"
              />
            </div>

            <p className="text-zinc-500 text-sm leading-relaxed max-w-sm">
              Slide City is a UK go-kart racing destination for fast electric heats, birthday parties, group bookings, corporate events, and competitive race nights.
            </p>

            <div className="flex gap-3 text-zinc-650 font-racing text-xs font-black uppercase tracking-wider mt-4">
              <span>★ SLIDE-CITY.CO.UK</span>
              <span>•</span>
              <span>CERTIFIED SAFETY RATED</span>
            </div>
          </div>

          {/* Quick Links navigation */}
          <div className="col-span-1 md:col-span-3 space-y-4">
            <h4 className="text-white text-xs font-black uppercase tracking-wider font-display">
              Quick Links:
            </h4>
            
            <ul className="text-xs text-zinc-400 space-y-2.5 font-sans">
              <li>
                <a href="#about" className="hover:text-red-500 transition-colors flex items-center gap-1.5 font-medium">
                  → About Slide City
                </a>
              </li>
              <li>
                <a href="#experience" className="hover:text-red-500 transition-colors flex items-center gap-1.5 font-medium">
                  → The Experience
                </a>
              </li>
              <li>
                <a href="#packages" className="hover:text-red-500 transition-colors flex items-center gap-1.5 font-medium">
                  → Race Packages
                </a>
              </li>
              <li>
                <a href="#track" className="hover:text-red-500 transition-colors flex items-center gap-1.5 font-medium">
                  → Track Layout
                </a>
              </li>
              <li>
                <a href="#events" className="hover:text-red-500 transition-colors flex items-center gap-1.5 font-medium">
                  → Group & Party Enquiries
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Placeholders */}
          <div className="col-span-1 md:col-span-4 space-y-4">
            <h4 className="text-white text-xs font-black uppercase tracking-wider font-display">
              Contact:
            </h4>

            <ul className="text-xs text-zinc-450 space-y-2.5">
              <li className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-red-550 flex-shrink-0 mt-0.5" />
                <span className="font-sans leading-snug">Slide City, United Kingdom</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-red-550 flex-shrink-0" />
                <span className="font-mono">Phone number coming soon</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-red-550 flex-shrink-0" />
                <a href="mailto:info@slide-city.co.uk" className="font-mono hover:text-red-500 transition-colors">
                  info@slide-city.co.uk
                </a>
              </li>
            </ul>

            <div className="pt-2">
              <span className="bg-zinc-900 border border-zinc-850 px-3 py-1 bg-zinc-950 text-xs text-zinc-550 tracking-widest uppercase font-black font-mono block w-max select-none">
                🟢 BOOKINGS: SLIDE-CITY.CO.UK
              </span>
            </div>
          </div>

        </div>

        {/* Copyright + scroll to top button */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-center sm:text-left gap-4 text-xs text-zinc-550 font-medium font-mono uppercase tracking-wider">
          <div>
            &copy; {currentYear} Slide City. All rights reserved. • Book online at slide-city.co.uk.
          </div>

          <button
            onClick={scrollBackToTop}
            id="footer-backtotop-btn"
            className="p-2.5 bg-zinc-900 hover:bg-red-600 text-zinc-400 hover:text-white rounded-none border border-zinc-850 transition-all flex items-center gap-2 cursor-pointer uppercase font-black text-sm tracking-widest transform -skew-x-12"
          >
            <span className="inline-flex skew-x-12 items-center gap-2 whitespace-nowrap font-racing">
              Scroll to Grid <ArrowUp className="w-3" />
            </span>
          </button>
        </div>

      </div>
    </footer>
  );
}

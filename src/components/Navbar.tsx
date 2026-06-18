import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

interface NavbarProps {
  onBookClick: () => void;
  onViewPackagesClick: () => void;
}

export default function Navbar({ onBookClick, onViewPackagesClick }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  // Detect scroll to style navbar and detect active section
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      const sections = ['home', 'about', 'experience', 'packages', 'track', 'events', 'gallery', 'contact'];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const offsetTop = element.offsetTop;
          const offsetHeight = element.offsetHeight;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#home', key: 'home' },
    { name: 'About', href: '#about', key: 'about' },
    { name: 'Experience', href: '#experience', key: 'experience' },
    { name: 'Packages', href: '#packages', key: 'packages' },
    { name: 'Track', href: '#track', key: 'track' },
    { name: 'Events', href: '#events', key: 'events' },
    { name: 'Gallery', href: '#gallery', key: 'gallery' },
    { name: 'Contact', href: '#contact', key: 'contact' },
  ];

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const targetId = href.replace('#', '');
    const element = document.getElementById(targetId);
    if (element) {
      const offset = 80; // Offset for sticky header
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      setActiveSection(targetId);
      setIsOpen(false);
    }
  };

  return (
    <nav 
      id="nav-header"
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-zinc-950/95 backdrop-blur-md py-3 shadow-[0_4px_30px_rgba(0,0,0,0.9)] border-b border-red-650/30' 
          : 'bg-zinc-950/40 py-5 border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Brand Logo */}
          <a 
            href="#home" 
            onClick={(e) => handleLinkClick(e, '#home')}
            className="-my-4 flex items-center self-start translate-y-2 group cursor-pointer focus:outline-none"
            id="brand-logo"
            aria-label="Slide City home"
          >
            <img
              src="/images/slide-city-logo.png"
              alt="Slide City Go Karting"
              className="h-20 sm:h-24 lg:h-28 w-auto object-contain drop-shadow-[0_10px_24px_rgba(0,0,0,0.75)] transition-transform duration-300 group-hover:scale-105"
            />
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <div className="flex items-center gap-1.5 bg-zinc-900/90 border border-zinc-850 px-3 py-1.5">
              {navLinks.map((link) => {
                const isActive = activeSection === link.key;
                return (
                  <a
                    key={link.key}
                    href={link.href}
                    onClick={(e) => handleLinkClick(e, link.href)}
                    id={`desktop-nav-${link.key}`}
                    className={`px-3 py-1 block text-xs uppercase font-extrabold tracking-widest font-display transition-all duration-250 ${
                      isActive
                        ? 'text-white border-b-2 border-red-600 pb-0.5'
                        : 'text-zinc-400 hover:text-white hover:border-b-2 hover:border-zinc-700 pb-0.5'
                    }`}
                  >
                    {link.name}
                  </a>
                );
              })}
            </div>
          </div>

          {/* Booking CTA */}
          <div className="hidden lg:flex items-center gap-5">
            <button
              onClick={onBookClick}
              id="navbar-cta-book"
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-none font-extrabold italic uppercase tracking-tighter transform -skew-x-12 transition-colors cursor-pointer text-sm"
            >
              <span className="inline-block skew-x-12">Book Now</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => setIsOpen(!isOpen)}
              id="mobile-menu-toggle"
              className="p-2 rounded-none text-zinc-400 hover:text-white hover:bg-zinc-900 bg-zinc-950 border border-zinc-800 focus:outline-none"
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      {isOpen && (
        <div className="md:hidden bg-zinc-950 border-b border-red-600/30 px-4 pt-4 pb-6 space-y-3.5 shadow-2xl">
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <a
                key={link.key}
                href={link.href}
                id={`mobile-nav-${link.key}`}
                onClick={(e) => handleLinkClick(e, link.href)}
                className={`px-4 py-2 text-xs uppercase font-black tracking-widest font-display ${
                  activeSection === link.key
                    ? 'bg-red-600 text-white italic'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-900/60'
                }`}
              >
                {link.name}
              </a>
            ))}
          </div>

          <div className="pt-4 border-t border-zinc-900 flex flex-col gap-3">
            <button
              onClick={() => {
                setIsOpen(false);
                onBookClick();
              }}
              id="mobile-nav-book"
              className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-none text-xs sm:text-sm uppercase font-extrabold italic tracking-wide sm:tracking-widest text-center transform -skew-x-12 cursor-pointer"
            >
              <span className="inline-block skew-x-12 leading-tight">Book A Race Now</span>
            </button>
            <button
              onClick={() => {
                setIsOpen(false);
                onViewPackagesClick();
              }}
              id="mobile-nav-packages"
              className="w-full bg-zinc-900 hover:bg-zinc-800 text-zinc-300 py-3 px-4 rounded-none text-xs sm:text-sm uppercase font-extrabold tracking-wide sm:tracking-widest text-center border border-zinc-800 leading-tight"
            >
              View Racing Packages
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}

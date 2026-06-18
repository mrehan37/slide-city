import { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Experience from './components/Experience';
import Packages from './components/Packages';
import TrackSection from './components/TrackSection';
import Leaderboard from './components/Leaderboard';
import Events from './components/Events';
import Gallery from './components/Gallery';
import Testimonials from './components/Testimonials';
import Faq from './components/Faq';
import ContactForm from './components/ContactForm';
import Footer from './components/Footer';
import CustomCursor from './components/CustomCursor';
import { ArrowUp, Flag, Mail } from 'lucide-react';

export default function App() {
  const [selectedPackage, setSelectedPackage] = useState<string>('');
  const [showCallModal, setShowCallModal] = useState<boolean>(false);
  const [showBackToTop, setShowBackToTop] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 500);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToContact = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = contactSection.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const scrollToPackages = () => {
    const packagesSection = document.getElementById('packages');
    if (packagesSection) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = packagesSection.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const scrollBackToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const handleChoosePackage = (packageName: string) => {
    setSelectedPackage(packageName);
    // Smooth scroll focus down to booking
    setTimeout(() => {
      scrollToContact();
    }, 100);
  };

  const handleClearSelectedPackage = () => {
    setSelectedPackage('');
  };

  return (
    <div className="min-h-screen bg-race-darker text-zinc-300 font-sans antialiased selection:bg-race-red selection:text-white overflow-hidden">
      {/* Custom Racing Physics Cursor */}
      <CustomCursor />
      
      {/* Sticky Top Navbar */}
      <Navbar onBookClick={scrollToContact} onViewPackagesClick={scrollToPackages} />

      {/* Main Sections */}
      <main>
        
        {/* HERO SECTION */}
        <section id="hero-sec-wrapper">
          <Hero onBookClick={scrollToContact} onViewPackagesClick={scrollToPackages} />
        </section>

        {/* Dynamic Interlocking Checkered Split Ticker */}
        <div className="bg-checkered h-6 w-full border-t border-b border-zinc-900 shadow-inner relative z-20"></div>

        {/* ABOUT SECTION */}
        <section id="about-sec-wrapper">
          <About />
        </section>

        {/* EXPERIENCE SECTION */}
        <section id="experience-sec-wrapper">
          <Experience />
        </section>

        {/* PACKAGES SECTION + INTEGRATE PRICE CALCULATOR */}
        <section id="packages-sec-wrapper">
          <Packages onChoosePackage={handleChoosePackage} />
        </section>

        {/* TRACK SECTION */}
        <section id="track-sec-wrapper">
          <TrackSection />
        </section>

        {/* SAMPLE LEADERBOARD SECTION */}
        <section id="leaderboard-demo" className="bg-race-dark py-12 border-t border-zinc-900 bg-grid-pattern relative">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <span className="text-race-red text-xs font-black uppercase tracking-widest font-racing">
                ⚡ SAMPLE SPEEDWAY BOARD
              </span>
              <h3 className="text-white text-base font-black uppercase tracking-wider font-display mt-1">
                Drift Pitwall Leaderboard Demo
              </h3>
              <p className="text-zinc-400 text-sm max-w-lg mx-auto leading-relaxed mt-2">
                This is an interactive sample board for presentation only. Click battle below to simulate drivers jockeying for seasonal podium points.
              </p>
            </div>
            
            <Leaderboard />
          </div>
        </section>

        {/* EVENTS SECTION */}
        <section id="events-sec-wrapper">
          <Events onEventBookSelect={handleChoosePackage} />
        </section>

        {/* GALLERY SECTION */}
        <section id="gallery-sec-wrapper">
          <Gallery />
        </section>

        {/* TESTIMONIALS SECTION */}
        <section id="testimonials-sec-wrapper">
          <Testimonials />
        </section>

        {/* FAQ SECTION */}
        <Faq />

        {/* BOOKING CTA CALLOUT */}
        <section className="relative py-20 bg-gradient-to-r from-race-red to-orange-600 overflow-hidden text-center">
          {/* Sliced pattern vectors overlay */}
          <div className="absolute inset-0 bg-checkered opacity-15 mix-blend-overlay"></div>
          <div className="absolute inset-0 bg-speed-lines opacity-10 pointer-events-none"></div>

          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 z-10 space-y-6">
            <span className="bg-black/90 text-race-yellow py-1.5 px-4 rounded-full text-xs font-black uppercase tracking-widest inline-block font-racing animate-bounce">
              ⚡ ADRENALINE SLOTS RUNNING LOW
            </span>
            
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white uppercase tracking-tight font-display leading-[0.95]">
              Ready to Race?
            </h2>
            
            <p className="text-white/90 text-sm sm:text-base max-w-xl mx-auto font-medium leading-relaxed">
              Grab your slot now. Weekend parties, group heats, and league nights fill quickly, so send your request and we will help line up the right race format.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center pt-2">
              <button
                onClick={scrollToContact}
                id="cta-booknow-btn"
                className="w-full sm:w-auto bg-black text-white hover:bg-zinc-900 py-4 px-6 sm:px-10 rounded-xl text-xs sm:text-sm uppercase font-black tracking-wide sm:tracking-widest shadow-2xl transition-all skew-x-[-10deg] cursor-pointer"
              >
                <span className="inline-flex skew-x-[10deg] items-center justify-center gap-2 text-center leading-tight">
                  <Flag className="w-4 h-4 flex-shrink-0 text-race-red" /> Book Now
                </span>
              </button>

              <button
                onClick={() => setShowCallModal(true)}
                id="cta-callus-btn"
                className="w-full sm:w-auto bg-white text-black hover:bg-zinc-100 py-4 px-6 sm:px-10 rounded-xl text-xs sm:text-sm uppercase font-black tracking-wide sm:tracking-widest shadow-2xl transition-all skew-x-[-10deg] cursor-pointer"
              >
                <span className="inline-flex skew-x-[10deg] items-center justify-center gap-2 text-center leading-tight">
                  <Mail className="w-4 h-4 flex-shrink-0 text-race-blue" /> Email Us Directly
                </span>
              </button>
            </div>
          </div>
        </section>

        {/* CONTACT / BOOKING FORM SECTION */}
        <section id="contact-sec-wrapper">
          <ContactForm selectedPackage={selectedPackage} onClearSelectedPackage={handleClearSelectedPackage} />
        </section>

      </main>

      {/* FOOTER */}
      <Footer />

      <button
        onClick={scrollBackToTop}
        id="floating-backtotop-btn"
        aria-label="Back to top"
        className={`fixed bottom-5 right-5 z-40 bg-red-600 hover:bg-red-700 text-white border border-red-500/60 shadow-2xl shadow-black/50 p-3 rounded-none transform -skew-x-12 transition-all duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 focus:ring-offset-zinc-950 ${
          showBackToTop
            ? 'translate-y-0 opacity-100 pointer-events-auto'
            : 'translate-y-6 opacity-0 pointer-events-none'
        }`}
      >
        <span className="inline-flex skew-x-12 items-center justify-center">
          <ArrowUp className="w-5 h-5" />
        </span>
      </button>

      {/* INTERACTIVE ENQUIRY INFO MODAL */}
      {showCallModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border-2 border-zinc-800 rounded-3xl p-6 md:p-8 max-w-sm w-full relative overflow-hidden bg-checkered bg-blend-soft-light text-left">
            
            {/* Design header */}
            <div className="flex items-center gap-2.5 border-b border-zinc-800 pb-4 mb-4">
              <div className="bg-race-blue/10 p-2.5 rounded-lg border border-race-blue/20">
                <Mail className="w-5 h-5 text-race-blue animate-pulse" />
              </div>
              <div>
                <h4 className="text-white text-sm font-black uppercase tracking-wider font-display">
                  PITWALL ENQUIRIES
                </h4>
                <span className="text-xs text-emerald-400 font-bold uppercase tracking-widest block font-racing">
                  EMAIL ENQUIRIES
                </span>
              </div>
            </div>

            <p className="text-zinc-300 text-sm leading-relaxed">
              Email the Slide City team for custom package enquiries, group slot requests, corporate events, or venue updates.
            </p>

            <div className="bg-zinc-950 border border-zinc-850 p-4 rounded-xl text-center my-5 select-all font-mono">
              <span className="text-zinc-500 text-xs font-bold uppercase block tracking-wider mb-1 font-sans">
                EMAIL ADDRESS:
              </span>
              <a 
                href="mailto:info@slide-city.co.uk" 
                className="text-white text-xl font-extrabold tracking-wider hover:text-race-red transition-colors block"
              >
                info@slide-city.co.uk
              </a>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs border-t border-zinc-850 pt-4">
              <div>
                <span className="text-zinc-550 text-xs font-bold uppercase tracking-wider">ENQUIRY DAYS</span>
                <p className="text-zinc-300 font-bold mt-0.5">7 Days / Week</p>
              </div>
              <div>
                <span className="text-zinc-550 text-xs font-bold uppercase tracking-wider">RESPONSE TIMES</span>
                <p className="text-emerald-450 font-bold mt-0.5">Fast Follow-Up</p>
              </div>
            </div>

            <button
              onClick={() => setShowCallModal(false)}
              id="callmodal-close-btn"
              className="w-full mt-6 bg-zinc-800 hover:bg-race-red hover:text-white text-zinc-300 text-xs font-black uppercase tracking-wider py-3 rounded-xl transition-all cursor-pointer text-center"
            >
              Back to Track
            </button>

          </div>
        </div>
      )}

    </div>
  );
}

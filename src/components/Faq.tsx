import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HelpCircle, ChevronRight, GraduationCap, ShieldAlert, Award, Footprints } from 'lucide-react';

interface FaqItem {
  id: string;
  question: string;
  category: string;
  answer: string;
  icon: React.ReactNode;
}

export default function Faq() {
  const [activeId, setActiveId] = useState<string | null>('faq-age');

  const faqs: FaqItem[] = [
    {
      id: 'faq-age',
      category: 'AGE & REQUIREMENTS',
      question: 'What are the age, height, and licensing requirements to race?',
      icon: <GraduationCap className="w-4 h-4 text-amber-500" />,
      answer: 'Our racing division is split into two classes: Adult Racers (ages 16+ with a valid physical photo ID) and Junior Racers (ages 8-15). Adult karts require no driver license. Junior racers must be at least 48 inches (122 cm) tall to securely operate the adjustable pedals and safety harness systems.'
    },
    {
      id: 'faq-gear',
      category: 'GEAR RENTAL',
      question: 'Is helmet and racing gear rental included in the ticket package?',
      icon: <Footprints className="w-4 h-4 text-emerald-400" />,
      answer: 'Yes! Fully professional DOT-certified sanitization helmets, full-body abrasive fire-resistant suits, race collars, and performance gloves are provided free of charge with every booking option. You may also bring your own full-face helmet provided it carries a valid safety inspection seal.'
    },
    {
      id: 'faq-safety',
      category: 'TRACK SAFETY',
      question: 'What racing safety protocols are enforced during a drift run?',
      icon: <ShieldAlert className="w-4 h-4 text-red-500" />,
      answer: 'Our entire paddock operates under electronic transponder grids. Track marshals have immediate, direct power to toggle speed limiters or disable individual karts remotely in emergency situations. We enforce zero-tolerance rules for intentional ramming or dangerous lines to guarantee precise driving racing lines for all skill levels.'
    },
    {
      id: 'faq-lessons',
      category: 'DRIFT METHODOLOGY',
      question: 'I am a complete beginner. Can I still drift on these tracks?',
      icon: <Award className="w-4 h-4 text-blue-400" />,
      answer: 'Absolutely! Our drift chassis karts feature mechanical slip-ratio adjustments. Prior to entering the starting grid, our coaching marshals provide a 10-minute briefing on steering angle corrections, braking zones, throttle control, and apex navigation to get you sliding like a professional immediately.'
    },
    {
      id: 'faq-weather',
      category: 'WEATHER & WET TRACKS',
      question: 'How do track operations adapt if outdoor conditions become wet?',
      icon: <HelpCircle className="w-4 h-4 text-zinc-400" />,
      answer: 'We race dry or rain where conditions are safe. In wet weather, staff adjust the session format and driving guidance so racers can handle the surface with confidence.'
    }
  ];

  const toggleAccordion = (id: string) => {
    setActiveId(activeId === id ? null : id);
  };

  return (
    <section id="faq-section" className="relative py-28 bg-zinc-950 border-t border-zinc-900 overflow-hidden">
      
      {/* Decorative Drift Corner Coordinate Graphics */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-5">
        <div className="absolute top-10 left-10 text-xs font-mono text-zinc-500">COORD: 34° 03\' 12" N / 118° 14\' 50" W</div>
        <div className="absolute bottom-10 right-10 text-xs font-mono text-zinc-500">APEX LATENCY: 0.12s</div>
        <div className="absolute top-1/2 left-5 w-48 h-0.5 bg-gradient-to-r from-red-600 to-transparent"></div>
        <div className="absolute top-1/3 right-5 w-32 h-0.5 bg-gradient-to-l from-zinc-700 to-transparent"></div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-zinc-900/60 border border-zinc-850 px-3.5 py-1 text-xs font-mono font-black uppercase tracking-[0.25em] text-red-500 mb-4">
            <span className="w-1.5 h-1.5 bg-red-600 animate-ping rounded-full inline-block mr-1"></span>
            PRO GROUND SUPPORT FAQs
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white uppercase tracking-tight font-display italic leading-none">
            Frequently Asked Queries
          </h2>
          <p className="text-zinc-500 text-sm sm:text-base mt-3 max-w-xl mx-auto leading-relaxed">
            Everything you need before climbing into the cockpit: safety rules, gear checklists, booking guidance, and drift coaching basics.
          </p>
        </div>

        {/* Accordion Layout list */}
        <div className="space-y-4">
          {faqs.map((faq) => {
            const isOpen = activeId === faq.id;
            return (
              <div 
                key={faq.id} 
                className={`transition-all duration-300 border rounded-none ${
                  isOpen 
                    ? 'bg-zinc-900 border-red-600 shadow-xl shadow-red-650/5' 
                    : 'bg-zinc-950 hover:bg-zinc-900/50 border-zinc-900'
                }`}
              >
                {/* Header Toggle Button */}
                <button
                  onClick={() => toggleAccordion(faq.id)}
                  id={`faq-toggle-${faq.id}`}
                  className="w-full flex items-center justify-between p-5 md:p-6 text-left cursor-pointer transition-colors"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-center gap-4 pr-4">
                    {/* Icon container */}
                    <div className={`p-2 border hidden sm:block ${
                      isOpen ? 'bg-zinc-950 border-red-600/30' : 'bg-zinc-900 border-zinc-850'
                    }`}>
                      {faq.icon}
                    </div>

                    <div className="space-y-1">
                      <span className="text-xs font-mono font-black tracking-widest text-zinc-500 block uppercase">
                        {faq.category}
                      </span>
                      <h3 className="text-white text-sm sm:text-base font-bold uppercase tracking-wide font-display">
                        {faq.question}
                      </h3>
                    </div>
                  </div>

                  <div className={`p-2 border transition-colors ${
                    isOpen ? 'border-red-600 text-red-500 bg-red-500/5' : 'border-zinc-850 text-zinc-500'
                  }`}>
                    <ChevronRight className={`w-4 h-4 transition-transform duration-300 ${
                      isOpen ? 'rotate-90' : 'rotate-0'
                    }`} />
                  </div>
                </button>

                {/* Smooth Expandable Content Panel */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.28, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="p-5 md:p-6 pt-0 border-t border-zinc-900/60 text-sm sm:text-base text-zinc-400 leading-relaxed font-sans text-left space-y-4">
                        <p>{faq.answer}</p>
                        
                        {/* Technical mini stamp indicating safety checklist confirmation */}
                        <div className="flex items-center gap-2 text-xs font-mono uppercase bg-zinc-950/80 border border-zinc-900 py-1.5 px-3 tracking-widest text-[#df2020]">
                          <span className="w-1 h-1 bg-[#df2020] rounded-full animate-pulse"></span>
                          System verification: safety gear protocol compliant
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

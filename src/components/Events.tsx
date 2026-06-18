import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Cake, Users, Award, Landmark, Sparkles, Trophy, ChevronRight, Check } from 'lucide-react';
import { PEXELS_IMAGES } from '../data';

interface EventsProps {
  onEventBookSelect: (eventType: string) => void;
}

export default function Events({ onEventBookSelect }: EventsProps) {
  const [activeTab, setActiveTab] = useState<string>('birthday');

  const eventTypes = [
    {
      id: 'birthday',
      name: 'Birthday Parties',
      descr: 'Make their next birthday legendary with private high-speed races, dedicated grids, professional grid starts, and a hosted party space for celebrations.',
      highlights: [
        'Dedicated racing grid exclusively for your group',
        'Custom trophy and podium ceremony for the birthday driver',
        'Fresh pizza and soft drink catering packages',
        'Certified party safety coaches managing the grid',
      ],
      age: 'Kids (8+) & Teens',
      badge: 'Best-Seller',
      icon: <Cake className="w-5 h-5 text-white" />,
      bgImage: PEXELS_IMAGES.party,
    },
    {
      id: 'team-building',
      name: 'Team Building',
      descr: 'Ignite healthy workplace competition with a Corporate Grand Prix built around quick decisions, teamwork, and a proper finish-line buzz.',
      highlights: [
        'Advanced tournament bracket styles with group eliminations',
        'Lounge buyouts with projector and microphone access',
        'Premium hot catering and alcohol-free drinks options',
        'Team-coaching sessions with pro motorsport instructors',
      ],
      age: 'Adults Only (18+)',
      badge: 'Highly Commended',
      icon: <Users className="w-5 h-5 text-white" />,
      bgImage: PEXELS_IMAGES.teamEvent,
    },
    {
      id: 'school',
      name: 'School Trips / Youth Groups',
      descr: 'Combine adrenaline with STEM-friendly learning around electric torque, reaction times, racing lines, and safe decision-making on track.',
      highlights: [
        'Educational physics & electrical kart overview courses',
        'Strict speed governors with junior power modes',
        'Comprehensive motor coordination & hazard safety lectures',
        'Discounted bundle pricing options for academic networks',
      ],
      age: 'Ages 8 - 17',
      badge: 'Stem Certified',
      icon: <Landmark className="w-5 h-5 text-white" />,
      bgImage: PEXELS_IMAGES.schoolGroup,
    },
    {
      id: 'league',
      name: 'League Competitive Nights',
      descr: 'Do you have what it takes to top the board? Slide City hosts weekly multi-stage leagues for UK drivers chasing prizes, bragging rights, and seasonal trophies.',
      highlights: [
        'Pro 50 mph motor classifications',
        'Split-time style results shown on race boards',
        'Championship points tracking for league nights',
        'Access to exclusive closed-door practice events',
      ],
      age: 'Experienced Adults (16+)',
      badge: 'Cash Prizes',
      icon: <Trophy className="w-5 h-5 text-white" />,
      bgImage: PEXELS_IMAGES.indoorRace,
    },
    {
      id: 'rentals',
      name: 'Private Track Rentals',
      descr: 'Take over the circuit for private celebrations, product launches, filming, automotive showcases, or full-site corporate away days.',
      highlights: [
        'Full track and paddock private access',
        'Custom speed curves and safety rules',
        'Flexible kart sessions for your guest list',
        'Full AV control integration over timing boards & music audio systems',
      ],
      age: 'All Ages Welcome',
      badge: 'VIP Ultimate',
      icon: <Sparkles className="w-5 h-5 text-white" />,
      bgImage: PEXELS_IMAGES.eventGrid,
    },
  ];

  const currentTab = eventTypes.find(t => t.id === activeTab) || eventTypes[0];

  return (
    <section id="events" className="relative py-24 bg-zinc-950 overflow-hidden border-t border-zinc-900 text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Title */}
        <div className="max-w-xl mb-12">
          <span className="text-zinc-500 text-xs font-black uppercase tracking-[0.2em] font-racing border border-zinc-850 px-3 py-1 bg-zinc-900 inline-block mb-3">
            HOST A LEGENDARY DAY
          </span>
          <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white font-display italic">
            GROUP & TRACK EVENTS
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base mt-3.5 leading-relaxed">
            From birthdays and school trips to private corporate race days, Slide City gives your group a fast, organised, safety-led UK karting experience.
          </p>
        </div>

        {/* Categories Tab Select Row (Vertical on small, Horizontal scroll on larger) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Menu Selector Buttons - Column */}
          <div className="col-span-1 lg:col-span-4 flex flex-row lg:flex-col gap-2.5 overflow-x-auto lg:overflow-x-visible pb-4 lg:pb-0 scrollbar-none font-racing">
            {eventTypes.map((tab) => {
              const isActive = tab.id === activeTab;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  id={`events-tab-btn-${tab.id}`}
                  className={`flex-shrink-0 w-[240px] lg:w-full p-4 rounded-none border text-left cursor-pointer flex items-center gap-3.5 transition-all transform -skew-x-12 ${
                    isActive
                      ? 'bg-zinc-900 border-red-650 text-white shadow-lg'
                      : 'bg-zinc-950 border-zinc-850 text-zinc-400 hover:text-white hover:bg-zinc-900/60'
                  }`}
                >
                  <div className="skew-x-12 flex items-center gap-3.5 w-full">
                    <div className={`p-2 rounded-none flex items-center justify-center ${
                      isActive ? 'bg-red-600 text-white' : 'bg-zinc-900 text-zinc-450 border border-zinc-800'
                    }`}>
                      {tab.icon}
                    </div>
                    
                    <div className="flex-grow">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm sm:text-base font-extrabold uppercase tracking-wider">
                          {tab.name}
                        </h3>
                        {tab.id === 'birthday' && (
                          <span className="text-xs bg-red-600 text-white py-0.5 px-2 rounded-none uppercase font-black tracking-widest leading-none">
                            Popular
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Dynamic Details Content Panel */}
          <div className="col-span-1 lg:col-span-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="bg-zinc-950/20 border border-zinc-855 rounded-none overflow-hidden shadow-2xl flex flex-col md:flex-row h-full animate-[pulse-slow_3s_infinite]"
              >
                
                {/* Visual Image pane */}
                <div className="w-full md:w-2/5 h-48 md:h-auto relative overflow-hidden flex-shrink-0 animate-pulse">
                  <img 
                    src={currentTab.bgImage} 
                    alt={currentTab.name} 
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover group"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-l from-zinc-950 via-zinc-950/25 to-transparent"></div>
                  
                  {/* Category highlights tag */}
                  <div className="absolute top-4 left-4 bg-zinc-950/95 py-1 px-2.5 rounded-none border border-zinc-850 font-display text-xs font-black uppercase text-white tracking-widest">
                    🏁 {currentTab.badge}
                  </div>
                </div>

                {/* Information details pane */}
                <div className="w-full md:w-3/5 p-6 md:p-8 flex flex-col justify-between space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between font-mono">
                      <span className="text-zinc-550 text-xs font-bold uppercase tracking-widest">
                        EVENT PROFILE
                      </span>
                      <span className="text-red-500 text-xs uppercase font-bold tracking-widest">
                        // GUIDE: {currentTab.age}
                      </span>
                    </div>

                    <h3 className="text-white text-2xl font-black uppercase tracking-tight font-display italic">
                      {currentTab.name}
                    </h3>
                    
                    <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
                      {currentTab.descr}
                    </p>

                    {/* Bullet perks highlights */}
                    <div className="space-y-2.5 pt-2">
                      {currentTab.highlights.map((h, i) => (
                        <div key={i} className="flex gap-2.5 items-start text-xs text-zinc-350">
                          <Check className="w-3.5 h-3.5 text-red-650 flex-shrink-0 mt-0.5" />
                          <span className="font-medium text-zinc-300">{h}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Immediate quick selection trigger redirection */}
                  <div className="pt-4 border-t border-zinc-900">
                    <button
                      onClick={() => onEventBookSelect(currentTab.name)}
                      id={`event-inquire-${currentTab.id}`}
                      className="w-full sm:w-auto px-5 sm:px-6 py-3.5 bg-red-600 hover:bg-red-750 text-white rounded-none text-xs sm:text-sm uppercase font-extrabold tracking-wide sm:tracking-widest transition-all text-center flex items-center justify-center gap-2 cursor-pointer transform -skew-x-12"
                    >
                      <span className="inline-flex skew-x-12 items-center justify-center gap-2 text-center leading-tight">
                        Inquire About {currentTab.name} <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />
                      </span>
                    </button>
                  </div>

                </div>

              </motion.div>
            </AnimatePresence>
          </div>

        </div>

      </div>
    </section>
  );
}

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Zap, Shuffle, Clock, Trophy, Shield, HelpCircle, Activity, ChevronRight } from 'lucide-react';

const cardVariants = {
  hidden: (idx: number) => ({
    opacity: 0,
    x: -100,
    rotate: -8, // Tilted like a kart taking a corner drift
  }),
  visible: (idx: number) => ({
    opacity: 1,
    x: 0,
    rotate: 0,
    transition: {
      type: 'spring',
      damping: 16,
      stiffness: 70,
      mass: 0.9,
      delay: idx * 0.12, // Staggered entry for each lane feature
    },
  }),
};

export default function Experience() {
  const [selectedFeature, setSelectedFeature] = useState(0);

  const features = [
    {
      id: 0,
      title: 'Fast Electric Karts',
      descr: 'Powered by electric drive systems that deliver instant torque, clean acceleration, and no petrol fumes inside the venue.',
      icon: <Zap className="w-5 h-5 text-white" />,
      color: 'border-red-600',
      bgColor: 'bg-red-600/10',
      specs: {
        engine: '48V High-Output Brushless AC',
        torque: 'Instant electric torque from standstill',
        topSpeed: 'Up to 50 mph in pro sessions',
        customTech: 'Electronic speed modes by race class',
      },
    },
    {
      id: 1,
      title: 'Drift-Inspired Corners',
      descr: 'Built around technical bends, tight apexes, and controlled slide moments that reward clean steering and confident throttle work.',
      icon: <Shuffle className="w-5 h-5 text-white" />,
      color: 'border-zinc-800',
      bgColor: 'bg-zinc-900',
      specs: {
        surface: 'Technical indoor racing surface',
        hairpins: '3 Extreme Drift Hairpins',
        driftAngle: 'Up to 45-Degree Slide Clearance',
        tireType: 'Low-profile karting compounds',
      },
    },
    {
      id: 2,
      title: 'Lap Timing Boards',
      descr: 'Race sessions include timing screens and results boards so drivers can compare lap times after each heat.',
      icon: <Clock className="w-5 h-5 text-white" />,
      color: 'border-zinc-800',
      bgColor: 'bg-zinc-900',
      specs: {
        precision: 'Session lap-time results',
        pitHUD: 'Overhead timing boards',
        mobileApp: 'Shareable results and split times',
        rankings: 'Global weekly & monthly leaderboards',
      },
    },
    {
      id: 3,
      title: 'Parties & Corporate Events',
      descr: 'Structured private events with Formula-style grid starts, dynamic scoreboards, hosted awards, and group-friendly catering.',
      icon: <Trophy className="w-5 h-5 text-white" />,
      color: 'border-zinc-800',
      bgColor: 'bg-zinc-900',
      specs: {
        gridStarts: 'F1 Red/Green starting gantry flags',
        podiumReward: 'Gold, Silver & Bronze Medals + Trophy',
        catering: 'VIP lounge, hot pizzas, and soft drinks',
        marshals: '2 Dedicated private event staff coordinators',
      },
    },
  ];

  return (
    <section id="experience" className="relative py-24 bg-zinc-950 overflow-hidden border-t border-zinc-900 text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 text-left">
          <div className="max-w-xl">
            <span className="text-zinc-500 text-xs font-black uppercase tracking-[0.2em] font-racing">
              THE RACING DESTINATION
            </span>
            <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white font-display mt-2 italic">
              ENGINEERED FOR ADRENALINE
            </h2>
            <p className="text-zinc-400 text-sm sm:text-base leading-relaxed mt-3">
              Explore why Slide City delivers a competitive, premium, and family-friendly karting experience for UK racers. Click the cards below to see what powers the day.
            </p>
          </div>
          <div className="flex gap-2.5 items-center mt-3.5 md:mt-0 bg-zinc-90 w-full bg-zinc-900 border border-zinc-850 rounded-none py-2 px-4 shadow">
            <Activity className="w-4 h-4 text-red-600" />
            <span className="text-xs font-black uppercase tracking-wider text-zinc-300 font-racing">
              EXPERIENCE GUIDE
            </span>
          </div>
        </div>

        {/* Dynamic Display Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch pt-2">
          
          {/* Left Column: Interactive Feature Selector Cards */}
          <div className="col-span-1 lg:col-span-6 flex flex-col gap-4">
            {features.map((item, idx) => {
              const isActive = selectedFeature === item.id;
              return (
                <motion.button
                  custom={idx}
                  variants={cardVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.15 }}
                  whileHover={{ 
                    scale: 1.015,
                    x: 6,
                    transition: { duration: 0.15, ease: 'easeOut' }
                  }}
                  key={item.id}
                  onClick={() => setSelectedFeature(item.id)}
                  id={`experience-btn-${item.id}`}
                  className={`w-full text-left p-5 rounded-none border transition-colors duration-300 cursor-pointer flex gap-4 ${
                    isActive 
                      ? 'bg-zinc-900/90 border-red-600 relative shadow-xl shadow-red-650/5' 
                      : 'bg-zinc-950 hover:bg-zinc-900/60 border-zinc-850'
                  }`}
                >
                  <div className={`p-3 rounded-none flex-shrink-0 flex items-center justify-center transition-colors ${
                    isActive ? 'bg-red-600 text-white' : 'bg-zinc-900 text-zinc-400 border border-zinc-800'
                  }`}>
                    {item.icon}
                  </div>
                  
                  <div className="flex-grow space-y-1.5 self-center">
                    <div className="flex items-center justify-between">
                      <h3 className="text-white text-base font-black uppercase tracking-wider font-display">
                        {item.title}
                      </h3>
                      <ChevronRight className={`w-4 h-4 text-zinc-500 transition-transform ${
                        isActive ? 'rotate-90 text-red-600' : ''
                      }`} />
                    </div>
                    <p className="text-zinc-400 text-sm font-normal leading-relaxed">
                      {item.descr.substring(0, 115)}...
                    </p>
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* Right Column: Immersive Spec Panel */}
          <div className="col-span-1 lg:col-span-6">
            <div className="bg-zinc-900/40 border border-zinc-850 rounded-none p-6 md:p-8 flex flex-col justify-between h-full relative overflow-hidden bg-checkered bg-blend-soft-light">
              
              {/* Overlay elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-radial from-red-600/10 to-transparent pointer-events-none"></div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedFeature}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-red-600 border border-red-750 py-0.5 px-3 rounded-none text-xs text-white font-black uppercase font-racing tracking-widest">
                      SPECS SHEET
                    </div>
                    <div className="text-zinc-500 font-mono text-xs uppercase tracking-wider">
                      ID: SLIDE-KT-{features[selectedFeature].id}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-white text-2xl font-black uppercase tracking-tight font-display italic">
                      {features[selectedFeature].title}
                    </h3>
                    <p className="text-zinc-300 text-sm sm:text-base leading-relaxed mt-2.5">
                      {features[selectedFeature].descr}
                    </p>
                  </div>

                  <div className="border-t border-zinc-850 pt-6">
                    <h4 className="text-zinc-500 text-xs font-black uppercase tracking-widest font-racing mb-4">
                      Karting & Event Specs:
                    </h4>

                    {/* Specifications key values */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {Object.entries(features[selectedFeature].specs).map(([key, value]) => (
                        <div key={key} className="bg-zinc-950 border border-zinc-850 p-4 rounded-none text-left">
                          <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest block border-b border-zinc-900 pb-1">
                            {key.replace(/([A-Z])/g, ' $1')}
                          </span>
                          <span className="block text-white text-sm font-bold font-sans leading-relaxed mt-2">
                            {value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Extra visual timing gauges */}
              <div className="border-t border-zinc-850 pt-6 mt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex gap-2">
                  <span className="w-1.5 h-1.5 rounded-none bg-red-600 animate-pulse"></span>
                  <span className="text-red-650 text-xs font-bold uppercase tracking-widest font-racing">
                    Built for supervised race sessions
                  </span>
                </div>
                
                <span className="text-zinc-500 text-xs font-mono select-none uppercase tracking-wider">
                  Slide City experience guide
                </span>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

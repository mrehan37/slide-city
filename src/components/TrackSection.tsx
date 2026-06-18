import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronsUp, Shuffle, TrendingUp, Cpu, Compass, Layout, Award, HelpCircle, ShieldAlert } from 'lucide-react';
import { TRACK_SECTORS } from '../data';

export default function TrackSection() {
  const [activeLayout, setActiveLayout] = useState<'adult' | 'junior'>('adult');
  const [selectedSector, setSelectedSector] = useState<string>('s2'); // default highlight on drift hairpin

  const getSectorStats = () => {
    return TRACK_SECTORS.find(s => s.id === selectedSector) || TRACK_SECTORS[1];
  };

  const currentSector = getSectorStats();

  const sectorIcon = (id: string) => {
    switch (id) {
      case 's1': return <ChevronsUp className="w-5 h-5 text-emerald-400" />;
      case 's2': return <Shuffle className="w-5 h-5 text-race-red" />;
      case 's3': return <TrendingUp className="w-5 h-5 text-orange-400" />;
      case 's4': return <Cpu className="w-5 h-5 text-race-blue" />;
      default: return <Compass className="w-5 h-5 text-white" />;
    }
  };

  return (
    <section id="track" className="relative py-24 bg-zinc-950 overflow-hidden border-t border-zinc-900 text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end mb-12 text-left">
          <div className="col-span-1 lg:col-span-8">
            <span className="text-zinc-500 text-xs font-black uppercase tracking-[0.2em] font-racing border border-zinc-850 px-3 py-1 bg-zinc-900">
              THE RACETRACK BLUEPRINT
            </span>
            <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white font-display mt-3.5 italic">
              THE DUAL SLIDELINES
            </h2>
            <p className="text-zinc-400 text-sm sm:text-base mt-3.5 max-w-2xl">
              Slide City runs a technical karting layout with fast straights, tight corners, safe barrier systems, overtaking zones, and separate formats for junior, adult, and advanced drivers.
            </p>
          </div>

          {/* Toggle button layout selection */}
          <div className="col-span-1 lg:col-span-4 flex justify-start lg:justify-end font-racing">
            <div className="inline-flex gap-1.5 bg-zinc-900 border border-zinc-850 p-1.5 rounded-none w-full sm:w-auto">
              <button
                onClick={() => {
                  setActiveLayout('adult');
                  setSelectedSector('s2');
                }}
                id="track-layout-adult"
                className={`flex-1 sm:flex-initial py-2.5 px-5 rounded-none text-xs uppercase font-extrabold tracking-widest transition-all cursor-pointer transform -skew-x-12 ${
                  activeLayout === 'adult'
                    ? 'bg-red-600 text-white italic shadow-md'
                    : 'text-zinc-450 hover:text-white hover:bg-zinc-800'
                }`}
              >
                <span className="inline-block skew-x-12">Adult Pro Track</span>
              </button>
              <button
                onClick={() => {
                  setActiveLayout('junior');
                  setSelectedSector('s1');
                }}
                id="track-layout-junior"
                className={`flex-1 sm:flex-initial py-2.5 px-5 rounded-none text-xs uppercase font-extrabold tracking-widest transition-all cursor-pointer transform -skew-x-12 ${
                  activeLayout === 'junior'
                    ? 'bg-red-650/40 text-white italic border border-red-600/30'
                    : 'text-zinc-455 hover:text-white hover:bg-zinc-800'
                }`}
              >
                <span className="inline-block skew-x-12">Junior Academy</span>
              </button>
            </div>
          </div>
        </div>

        {/* Content Details: SVG map Left, Metadata right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-zinc-900/30 border border-zinc-850 p-6 md:p-8 rounded-none">
          
          {/* SVG Map Layout column */}
          <div className="col-span-1 lg:col-span-7 flex flex-col items-center">
            
            <div className="bg-zinc-950 border border-zinc-850 p-6 sm:p-10 rounded-2xl w-full flex flex-col items-center justify-center relative">
              
              {/* Graphic speed measurements indicators on map */}
              <div className="absolute top-4 left-4 flex gap-1.5 items-center">
                <div className="w-2.5 h-2.5 rounded-full bg-race-red animate-ping" />
                <span className="text-zinc-500 font-mono text-xs uppercase tracking-widest">
                  Layout: {activeLayout === 'adult' ? 'PRO-GRID v2.5' : 'ACADEMY-GRID v1.0'}
                </span>
              </div>

              {/* Racetrack SVG Vector */}
              <svg 
                viewBox="0 0 500 280" 
                className="w-full max-w-[480px] h-auto drop-shadow-[0_10px_30px_rgba(255,46,46,0.15)]"
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Outermost grid bounds */}
                <rect width="500" height="280" rx="12" fill="#030304" />
                <grid />

                {/* Road surface path background */}
                {activeLayout === 'adult' ? (
                  // ADULT PRO CIRCUIT (Full layout with long straights & loop hairpins)
                  <>
                    {/* Background Road thick path */}
                    <path 
                      id="track-road" 
                      d="M 50 140 C 50 200, 100 240, 200 240 C 300 240, 360 180, 420 180 C 470 180, 470 110, 410 80 C 350 50, 290 120, 230 120 C 170 120, 150 50, 90 50 C 40 50, 50 80, 50 140 Z" 
                      stroke="#1e293b" 
                      strokeWidth="28" 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                    />
                    {/* Inner detail border */}
                    <path 
                      d="M 50 140 C 50 200, 100 240, 200 240 C 300 240, 360 180, 420 180 C 470 180, 470 110, 410 80 C 350 50, 290 120, 230 120 C 170 120, 150 50, 90 50 C 40 50, 50 80, 50 140 Z" 
                      stroke="#ff2e2e" 
                      strokeWidth="4" 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeDasharray="10 6"
                      className="opacity-60 animate-[pulse-slow_2s_infinite]"
                    />

                    {/* Sector Highlights overlay paths */}
                    {/* S1: Launch straight (Top area: 90 50 to 50 140) */}
                    <path 
                      d="M 90 50 C 40 50, 50 80, 50 140" 
                      stroke={selectedSector === 's1' ? '#34d399' : 'transparent'} 
                      strokeWidth="32" 
                      strokeLinecap="round" 
                      className="transition-all duration-300"
                    />

                    {/* S2: Tsunami drift (Bottom curves: 50 140 to 200 240) */}
                    <path 
                      d="M 50 140 C 50 200, 100 240, 200 240" 
                      stroke={selectedSector === 's2' ? '#ef4444' : 'transparent'} 
                      strokeWidth="32" 
                      strokeLinecap="round" 
                      className="transition-all duration-300"
                    />

                    {/* S3: Sonic S-curves (Mid sections: 200 240 to 420 180 to 410 80) */}
                    <path 
                      d="M 200 240 C 300 240, 360 180, 420 180 C 470 180, 470 110, 410 80" 
                      stroke={selectedSector === 's3' ? '#fb923c' : 'transparent'} 
                      strokeWidth="32" 
                      strokeLinecap="round" 
                      className="transition-all duration-300"
                    />

                    {/* S4: Technical chicane (Inside technical loop: 410 80 to 230 120 to 90 50) */}
                    <path 
                      d="M 410 80 C 350 50, 290 120, 230 120 C 170 120, 150 50, 90 50" 
                      stroke={selectedSector === 's4' ? '#06b6d4' : 'transparent'} 
                      strokeWidth="32" 
                      strokeLinecap="round" 
                      className="transition-all duration-300"
                    />
                  </>
                ) : (
                  // JUNIOR ACADEMY CIRCUIT (Shattered inner simplified oval circuit)
                  <>
                    {/* Road surface path background */}
                    <path 
                      d="M 80 140 C 80 210, 150 210, 250 210 C 350 210, 420 210, 420 140 C 420 70, 350 70, 250 70 C 150 70, 80 70, 80 140 Z" 
                      stroke="#1e293b" 
                      strokeWidth="28" 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                    />
                    {/* Mid line indicators */}
                    <path 
                      d="M 80 140 C 80 210, 150 210, 250 210 C 350 210, 420 210, 420 140 C 420 70, 350 70, 250 70 C 150 70, 80 70, 80 140 Z" 
                      stroke="#06b6d4" 
                      strokeWidth="3" 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeDasharray="8 8"
                    />

                    {/* Highlights map integration */}
                    <path 
                      d="M 250 70 C 150 70, 80 70, 80 140" 
                      stroke={selectedSector === 's1' ? '#34d399' : 'transparent'} 
                      strokeWidth="32" 
                    />
                    <path 
                      d="M 80 140 C 80 210, 150 210, 250 210" 
                      stroke={selectedSector === 's2' ? '#ef4444' : 'transparent'} 
                      strokeWidth="32" 
                    />
                    <path 
                      d="M 250 210 C 350 210, 420 210, 420 140" 
                      stroke={selectedSector === 's3' ? '#fb923c' : 'transparent'} 
                      strokeWidth="32" 
                    />
                    <path 
                      d="M 420 140 C 420 70, 350 70, 250 70" 
                      stroke={selectedSector === 's4' ? '#06b6d4' : 'transparent'} 
                      strokeWidth="32" 
                    />
                  </>
                )}

                {/* Checkpoint Indicators pins */}
                {/* S1 Apex Pin */}
                <circle cx="70" cy="80" r="10" fill="#000" stroke="#34d399" strokeWidth="3" className="cursor-pointer" onClick={() => setSelectedSector('s1')} />
                <text x="70" y="84" fill="#fff" fontSize="10" fontWeight="900" textAnchor="middle" className="pointer-events-none">1</text>

                {/* S2 Apex Pin */}
                <circle cx="110" cy="225" r="10" fill="#000" stroke="#ef4444" strokeWidth="3" className="cursor-pointer" onClick={() => setSelectedSector('s2')} />
                <text x="110" y="229" fill="#fff" fontSize="10" fontWeight="900" textAnchor="middle" className="pointer-events-none">2</text>

                {/* S3 Apex Pin */}
                <circle cx="430" cy="150" r="10" fill="#000" stroke="#fb923c" strokeWidth="3" className="cursor-pointer" onClick={() => setSelectedSector('s3')} />
                <text x="430" y="154" fill="#fff" fontSize="10" fontWeight="900" textAnchor="middle" className="pointer-events-none">3</text>

                {/* S4 Apex Pin */}
                <circle cx="290" cy="90" r="10" fill="#000" stroke="#06b6d4" strokeWidth="3" className="cursor-pointer" onClick={() => setSelectedSector('s4')} />
                <text x="290" y="94" fill="#fff" fontSize="10" fontWeight="900" textAnchor="middle" className="pointer-events-none">4</text>

                {/* Start-Finish Grid Line with Checker Flag Texture */}
                <line x1="50" y1="140" x2="70" y2="140" stroke="#ffffff" strokeWidth="2" strokeDasharray="3 3" />
              </svg>

              {/* Grid map references key info */}
              <div className="flex gap-4 mt-6 text-xs text-zinc-500 font-mono uppercase tracking-wider">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-none bg-zinc-90 w-full bg-zinc-900 border border-zinc-800"></span> Track Road
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-none bg-red-650"></span> Selected Sector
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-1 border-t border-dashed border-white"></span> Start Grid
                </div>
              </div>

            </div>
          </div>

          {/* Slices Spec Selector right column */}
          <div className="col-span-1 lg:col-span-5 flex flex-col justify-between h-full space-y-6 text-left">
            <div>
              <div className="text-zinc-500 text-xs font-black uppercase tracking-widest font-mono">
                TRACK GUIDE DESK
              </div>
              <h3 className="text-white text-xl font-black uppercase tracking-wider font-display mt-1.5 italic">
                TRACK LAYOUT PROFILE
              </h3>
              <p className="text-zinc-400 text-sm leading-relaxed mt-1.5 ">
                Explore the key track sectors, difficulty ratings, and corner styles before you book. Select a sector bullet to review its characteristics:
              </p>
            </div>

            {/* Quick selectors list */}
            <div className="space-y-2">
              {TRACK_SECTORS.map((sec) => {
                const isCurrent = sec.id === selectedSector;
                return (
                  <button
                    key={sec.id}
                    onClick={() => setSelectedSector(sec.id)}
                    id={`sector-list-btn-${sec.id}`}
                    className={`w-full p-3 rounded-none border text-left flex items-center gap-3 cursor-pointer transition-all ${
                      isCurrent
                        ? 'bg-zinc-950 border-red-600/60 text-white font-display'
                        : 'bg-zinc-950 border-zinc-850 hover:bg-zinc-900/60 text-zinc-400 hover:text-white'
                    }`}
                  >
                    <div className={`p-1.5 rounded-none ${
                      isCurrent ? 'bg-red-600 text-white' : 'bg-zinc-90 w-full bg-zinc-900 text-zinc-400 border border-zinc-800'
                    }`}>
                      {sectorIcon(sec.id)}
                    </div>
                    
                    <div className="flex-grow flex items-center justify-between font-display">
                      <span className="text-xs font-black uppercase tracking-wider">
                        {sec.name}
                      </span>
                      <span className={`text-xs font-black uppercase px-2 py-0.5 rounded-none ${
                        sec.difficulty === 'Red' 
                          ? 'bg-red-950/80 text-red-500 border border-red-900/40' 
                          : sec.difficulty === 'Orange' 
                          ? 'bg-amber-950/80 text-amber-500 border border-amber-900/40' 
                          : 'bg-emerald-950/80 text-emerald-500 border border-emerald-900/40'
                      }`}>
                        {sec.difficulty} SCALE
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Selected sector detail box */}
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedSector}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="bg-zinc-950 border border-zinc-855 rounded-none p-4.5 space-y-3.5"
              >
                <div className="flex justify-between items-center border-b border-zinc-900 pb-2.5">
                  <h4 className="text-white text-xs font-black uppercase tracking-widest font-racing select-none">
                    🏁 {currentSector.name} Specs
                  </h4>
                  <span className="text-xs text-zinc-500 font-mono font-bold uppercase tracking-wider">
                    S-LEN: {currentSector.length}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3.5 text-xs font-display">
                  <div className="col-span-2">
                    <span className="text-zinc-500 font-bold uppercase text-xs tracking-widest block font-mono">
                      KEY CORNER FEATURE:
                    </span>
                    <span className="text-zinc-300 font-medium block mt-1 leading-relaxed">
                      {currentSector.keyFeature}
                    </span>
                  </div>
                  <div>
                    <span className="text-zinc-500 font-bold uppercase text-xs tracking-widest block font-mono">
                      DIFFICULTY SCALE:
                    </span>
                    <span className="text-white font-black block mt-1 uppercase tracking-wider text-xs">
                      {currentSector.difficulty} LEVEL
                    </span>
                  </div>
                  <div>
                    <span className="text-zinc-500 font-bold uppercase text-xs tracking-widest block font-mono">
                      DRIFTER POTENTIAL:
                    </span>
                    <span className="text-red-650 font-black block mt-1 uppercase tracking-wider text-xs">
                      {currentSector.driftPotential} G-LOAD
                    </span>
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

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Check, ArrowRight, Plus, Minus, CheckCircle } from 'lucide-react';
import { RACE_PACKAGES } from '../data';

interface PackagesProps {
  onChoosePackage: (packageName: string, totalPrice?: number) => void;
}

export default function Packages({ onChoosePackage }: PackagesProps) {
  const [selectedPackForCalc, setSelectedPackForCalc] = useState<string>('double-pack');
  const [numParticipants, setNumParticipants] = useState<number>(1);
  const [addsOn, setAddsOn] = useState({
    gopro: false,
    medal: false,
    photos: false,
    lunch: false,
  });

  const activePackData = RACE_PACKAGES.find(p => p.id === selectedPackForCalc) || RACE_PACKAGES[1];

  // Calculations
  const basePricePerUnit = activePackData.id === 'group-party' || activePackData.id === 'corporate-gp'
    ? activePackData.price 
    : activePackData.price * numParticipants;

  const unitDescription = activePackData.id === 'group-party' || activePackData.id === 'corporate-gp'
    ? 'Flat Rate Package'
    : `Total for ${numParticipants} racer${numParticipants > 1 ? 's' : ''}`;

  const addonPrices = {
    gopro: 15, // GoPro recording setup
    medal: 8,  // Metal Trophy/Medallion (for individual races)
    photos: 10, // Pro high-quality turn action shots
    lunch: 12, // VIP food platter & beverage combo
  };

  const calculateAddonsCost = () => {
    let price = 0;
    // For flat rate, add-ons are flat. For racers, add-ons are per-racer
    const multiplier = activePackData.id === 'group-party' || activePackData.id === 'corporate-gp' ? 10 : numParticipants;
    
    if (addsOn.gopro) price += addonPrices.gopro * (activePackData.id === 'single-pass' || activePackData.id === 'double-pack' ? numParticipants : 3);
    if (addsOn.medal) price += addonPrices.medal * (activePackData.id === 'single-pass' || activePackData.id === 'double-pack' ? numParticipants : 1);
    if (addsOn.photos) price += addonPrices.photos * multiplier;
    if (addsOn.lunch) price += addonPrices.lunch * multiplier;
    
    return price;
  };

  const finalCost = basePricePerUnit + calculateAddonsCost();

  const handleCustomSubmit = () => {
    let customSummary = `${activePackData.name} customised for ${numParticipants} racer(s).`;
    if (addsOn.gopro) customSummary += ' + GoPro Rental';
    if (addsOn.medal) customSummary += ' + Medal Package';
    if (addsOn.photos) customSummary += ' + Photo Bundle';
    if (addsOn.lunch) customSummary += ' + VIP Catering Platter';
    onChoosePackage(customSummary, finalCost);
  };

  return (
    <section id="packages" className="relative py-24 bg-zinc-950 overflow-hidden border-t border-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full text-left">
        
        {/* Section Title */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-red-500 text-xs font-black uppercase tracking-[0.2em] font-mono border border-zinc-850 px-3.5 py-1 bg-zinc-950/40 inline-block rounded-none">
            FLEXIBLE OPTIONS
          </span>
          <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white font-display mt-3 italic">
            RACE DAY PACKAGES
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base mt-3 font-sans">
            Choose from flexible single sessions, multi-race passes, or catered private track grand prix. Scroll below to customise your team's booking in real time.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch mb-20">
          {RACE_PACKAGES.map((pkg) => (
            <div
              key={pkg.id}
              className={`rounded-none border p-6 flex flex-col justify-between transition-all duration-300 relative text-left ${
                pkg.popular
                  ? 'bg-zinc-950 border-red-600 shadow-2xl relative'
                  : 'bg-zinc-950/20 border-zinc-855 hover:border-zinc-700/80'
              }`}
            >
              {pkg.badge && (
                <div className={`absolute -top-3 left-4 text-xs font-black uppercase tracking-widest px-2.5 py-1 rounded-none transform -skew-x-12 ${
                  pkg.popular ? 'bg-red-600 text-white' : 'bg-zinc-800 text-zinc-300'
                }`}>
                  <span className="inline-block skew-x-12">{pkg.badge}</span>
                </div>
              )}

              {/* Package Header */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-white text-base font-black uppercase tracking-wider font-display italic">
                    {pkg.name}
                  </h3>
                  <div className="text-zinc-550 text-xs font-bold uppercase mt-1.5 font-mono">
                    Best for: {pkg.bestFor}
                  </div>
                </div>

                <div className="border-b border-zinc-900 pb-5 font-mono">
                  <div className="flex items-baseline">
                    <span className="text-zinc-500 text-sm font-bold">£</span>
                    <span className="text-white text-3xl font-black tracking-tight font-display italic">
                      {pkg.price}
                    </span>
                    {pkg.id !== 'group-party' && pkg.id !== 'corporate-gp' && (
                      <span className="text-zinc-500 text-xs font-medium ml-1">/ racer</span>
                    )}
                  </div>
                  <div className="bg-zinc-950 border border-zinc-900 py-1 px-2.5 rounded-none text-xs text-red-500 tracking-wider font-bold uppercase mt-2.5 inline-block font-mono">
                    ⏱️ TIME LIMIT: {pkg.duration}
                  </div>
                </div>

                {/* Features list */}
                <ul className="space-y-3 pt-2 font-sans">
                  {pkg.features.map((feat, idx) => (
                    <li key={idx} className="flex gap-2.5 items-start">
                      <Check className="w-3.5 h-3.5 text-red-600 flex-shrink-0 mt-0.5" />
                      <span className="text-zinc-300 text-sm leading-relaxed font-sans">
                        {feat}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Footer CTA & Speed Lock spec */}
              <div className="pt-6 border-t border-zinc-900 mt-6 space-y-3.5">
                <div className="flex justify-between items-center text-xs font-bold text-zinc-500 uppercase font-mono tracking-widest">
                  <span>Power Lock:</span>
                  <span className="text-red-500 font-bold uppercase">
                    {pkg.speedLimit}
                  </span>
                </div>

                <button
                  onClick={() => onChoosePackage(pkg.name, pkg.price)}
                  id={`pkg-choose-btn-${pkg.id}`}
                  className={`w-full py-3.5 rounded-none text-sm uppercase font-extrabold tracking-wider transition-all duration-300 transform -skew-x-12 cursor-pointer ${
                    pkg.popular
                      ? 'bg-red-600 hover:bg-red-750 text-white'
                      : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-350 border border-zinc-800'
                  }`}
                >
                  <span className="inline-flex skew-x-12 items-center justify-center gap-1.5 whitespace-nowrap">
                    Choose Package <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </button>
              </div>

            </div>
          ))}
        </div>

        {/* EXTRA: Add-on Customizer Calculator (Bento styled) */}
        <div className="bg-zinc-950/20 border border-zinc-855 rounded-none p-6 md:p-8 text-left">
          <div className="flex flex-col lg:flex-row items-start justify-between gap-8">
            
            {/* Left panel: configure selections */}
            <div className="w-full lg:w-2/3 space-y-6">
              <div>
                <div className="inline-flex items-center gap-1.5 bg-zinc-950 border border-zinc-850 py-1 px-3 text-xs text-red-500 font-bold uppercase font-mono tracking-widest rounded-none">
                  ★ ADD-ON CO-DRIVE CREATOR
                </div>
                <h3 className="text-white text-xl font-black uppercase tracking-wider font-display mt-2.5 italic">
                  CUSTOMISE YOUR GROUP BOOKING
                </h3>
                <p className="text-zinc-400 text-sm leading-relaxed mt-1 font-sans">
                  Adjust drivers and select action packs before booking. Pricing updates instantly so there are no surprises on arrival.
                </p>
              </div>

              {/* Options selection row: target packages */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
                {RACE_PACKAGES.map(p => (
                  <button
                    key={p.id}
                    onClick={() => {
                      setSelectedPackForCalc(p.id);
                      if (p.id === 'group-party' || p.id === 'corporate-gp') {
                        setNumParticipants(1); // Flat packages
                      }
                    }}
                    id={`calc-select-pkg-${p.id}`}
                    className={`p-3 rounded-none border text-left cursor-pointer transition-all duration-200 ${
                      selectedPackForCalc === p.id
                        ? 'bg-red-650/10 border-red-600 text-white'
                        : 'bg-zinc-950 border-zinc-900 text-zinc-500 hover:border-zinc-800'
                    }`}
                  >
                    <div className="text-xs font-bold uppercase tracking-wider truncate">
                      {p.name.split(' ')[0]}
                    </div>
                    <div className="text-xs font-black text-white mt-1 italic font-display">
                      £{p.price}{p.id !== 'group-party' && p.id !== 'corporate-gp' ? '/r' : ''}
                    </div>
                  </button>
                ))}
              </div>

              {/* Racers count slider (Only visible for individual packages) */}
              {selectedPackForCalc !== 'group-party' && selectedPackForCalc !== 'corporate-gp' && (
                <div className="bg-zinc-950 border border-zinc-900 p-4 rounded-none">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-zinc-[450] text-xs font-bold uppercase tracking-widest font-mono">
                      NUMBER OF RACERS:
                    </span>
                    <span className="text-red-500 font-black text-lg font-mono">
                      {numParticipants}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setNumParticipants(Math.max(1, numParticipants - 1))}
                      id="calc-dec-racers"
                      className="p-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded-none focus:outline-none cursor-pointer border border-zinc-850"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <input
                      type="range"
                      min="1"
                      max="20"
                      value={numParticipants}
                      onChange={(e) => setNumParticipants(parseInt(e.target.value))}
                      className="w-full h-1 bg-zinc-800 appearance-none cursor-pointer accent-red-600"
                    />
                    <button
                      onClick={() => setNumParticipants(Math.min(20, numParticipants + 1))}
                      id="calc-inc-racers"
                      className="p-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded-none focus:outline-none cursor-pointer border border-zinc-850"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* Extrapolated options checkboxes */}
              <div>
                <span className="text-zinc-[450] text-xs font-bold uppercase tracking-widest block mb-2.5 font-mono">
                  SELECT ACCELERATION PACKS & CATERING:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-display">
                  
                  <button
                    onClick={() => setAddsOn({ ...addsOn, gopro: !addsOn.gopro })}
                    id="calc-addon-gopro"
                    className={`p-3 rounded-none border text-left cursor-pointer flex items-center justify-between ${
                      addsOn.gopro ? 'bg-zinc-950 border-red-600' : 'bg-zinc-950/40 border-zinc-900'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-black text-white uppercase tracking-wider italic">
                        helmet gopro footage
                      </div>
                      <div className="text-xs text-zinc-550 mt-0.5 font-mono">
                        £{addonPrices.gopro} flat / capture
                      </div>
                    </div>
                    {addsOn.gopro ? <CheckCircle className="w-4 h-4 text-red-500" /> : <div className="w-3.5 h-3.5 border border-zinc-800 rounded-none" />}
                  </button>

                  <button
                    onClick={() => setAddsOn({ ...addsOn, medal: !addsOn.medal })}
                    id="calc-addon-medal"
                    className={`p-3 rounded-none border text-left cursor-pointer flex items-center justify-between ${
                      addsOn.medal ? 'bg-zinc-950 border-red-600' : 'bg-zinc-950/40 border-zinc-900'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-black text-white uppercase tracking-wider italic">
                        podium metal & certification
                      </div>
                      <div className="text-xs text-zinc-550 mt-0.5 font-mono">
                        £{addonPrices.medal} flat / racer
                      </div>
                    </div>
                    {addsOn.medal ? <CheckCircle className="w-4 h-4 text-red-500" /> : <div className="w-3.5 h-3.5 border border-zinc-800 rounded-none" />}
                  </button>

                  <button
                    onClick={() => setAddsOn({ ...addsOn, photos: !addsOn.photos })}
                    id="calc-addon-photos"
                    className={`p-3 rounded-none border text-left cursor-pointer flex items-center justify-between ${
                      addsOn.photos ? 'bg-zinc-950 border-red-600' : 'bg-zinc-950/40 border-zinc-900'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-black text-white uppercase tracking-wider italic">
                        HD Turn Action Photos bundle
                      </div>
                      <div className="text-xs text-zinc-550 mt-0.5 font-mono">
                        £{addonPrices.photos} / racer
                      </div>
                    </div>
                    {addsOn.photos ? <CheckCircle className="w-4 h-4 text-red-500" /> : <div className="w-3.5 h-3.5 border border-zinc-800 rounded-none" />}
                  </button>

                  <button
                    onClick={() => setAddsOn({ ...addsOn, lunch: !addsOn.lunch })}
                    id="calc-addon-lunch"
                    className={`p-3 rounded-none border text-left cursor-pointer flex items-center justify-between ${
                      addsOn.lunch ? 'bg-zinc-950 border-emerald-500' : 'bg-zinc-950/40 border-zinc-900'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-black text-white uppercase tracking-wider italic">
                        VIP Food Platter + Soft Drink
                      </div>
                      <div className="text-xs text-zinc-550 mt-0.5 font-mono">
                        £{addonPrices.lunch} / racer
                      </div>
                    </div>
                    {addsOn.lunch ? <CheckCircle className="w-4 h-4 text-emerald-500" /> : <div className="w-3.5 h-3.5 border border-zinc-800 rounded-none" />}
                  </button>

                </div>
              </div>

            </div>

            {/* Right panel: dynamic outcome summary */}
            <div className="w-full lg:w-1/3 bg-zinc-950 border border-zinc-850 p-6 rounded-none flex flex-col justify-between h-auto lg:h-[350px]">
              <div className="space-y-4">
                <span className="text-xs text-zinc-550 font-bold uppercase tracking-widest font-mono">
                  SUMMARY SHEET
                </span>
                
                <div>
                  <h4 className="text-white text-sm font-black uppercase tracking-wider font-display italic">
                    {activePackData.name}
                  </h4>
                  <p className="text-zinc-400 text-sm mt-1.5 leading-relaxed font-sans">
                    {activePackData.duration} - Speed capability lock at {activePackData.speedLimit}.
                  </p>
                </div>

                <div className="border-t border-zinc-900 pt-3 space-y-1.5 text-xs font-mono">
                  <div className="flex justify-between text-zinc-400">
                    <span>Base config:</span>
                    <span className="text-zinc-200">£{basePricePerUnit}</span>
                  </div>
                  <div className="flex justify-between text-zinc-450 border-b border-zinc-900 pb-2">
                    <span>Add-ons option:</span>
                    <span className="text-zinc-200">£{calculateAddonsCost()}</span>
                  </div>
                  <div className="text-zinc-[500] text-xs uppercase font-bold pt-1">
                    // {unitDescription}
                  </div>
                </div>
              </div>

              <div className="border-t border-zinc-900 pt-5 mt-6 space-y-4 font-mono">
                <div className="flex justify-between items-baseline">
                  <span className="text-zinc-450 text-xs font-bold uppercase tracking-wider">EST. PRICE:</span>
                  <span className="text-2xl font-black text-red-500 tracking-widest font-display italic">
                    £{finalCost}
                  </span>
                </div>

                <button
                  onClick={handleCustomSubmit}
                  id="calc-submit-btn"
                  className="w-full bg-red-650 hover:bg-red-750 text-white text-xs py-3.5 px-4 rounded-none uppercase font-black tracking-widest transition-all cursor-pointer transform -skew-x-12"
                >
                  <span className="inline-block skew-x-12">
                    Configure and Book Now
                  </span>
                </button>
              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
}

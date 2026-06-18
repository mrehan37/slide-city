import { motion } from 'motion/react';
import { ShieldCheck, Flame, Zap, Award, CheckCircle } from 'lucide-react';

export default function About() {
  const stats = [
    { value: '850m', label: 'Pro Track Length', sub: 'Indoor / Outdoor Dual Track' },
    { value: '50-sec', label: 'Average Lap Target', sub: 'Interactive timing leaderboard' },
    { value: '100%', label: 'Electric Propulsion', sub: 'Zero-emission high-torque motors' },
    { value: '25+', label: 'Race-Ready Karts', sub: 'Drift-tuned electric fleet' },
  ];

  const corePillars = [
    'Fully trained track marshals monitoring every race',
    'Premium ECE-certified full-face helmet hire with fresh liners',
    'Dual-belt crash barrier systems with energy-absorbing buffer tracks',
    'Dynamic electronic speed controls for Junior, Adult, and Pro categories',
  ];

  return (
    <section id="about" className="relative py-24 bg-zinc-950 bg-grid-pattern overflow-hidden border-t border-zinc-900 text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Checkered Flag accent border */}
        <div className="flex justify-center mb-8">
          <div className="w-16 h-1 bg-red-600 rounded-none"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Visual Column */}
          <div className="col-span-1 lg:col-span-6 space-y-6 text-left">
            <span className="text-zinc-500 text-xs font-black uppercase tracking-[0.2em] font-racing border border-zinc-850 px-3.5 py-1 bg-zinc-90 w-full bg-zinc-900">
              WHO WE ARE
            </span>
            
            <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white font-display italic leading-tight">
              Where Speed <br />
              <span className="text-red-600 italic">
                Meets Style.
              </span>
            </h2>

            <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
              Slide City is a UK-based go-kart racing destination built for friends, families, corporate teams, and competitive drivers who want a fast, polished day on track.
            </p>

            <p className="text-zinc-500 text-sm sm:text-base leading-relaxed">
              Our electric karting experience blends indoor-style control, dramatic cornering, lap timing boards, and safety-led race formats. From first-timers to regular league racers, every session is run by trained staff with clear briefing and track support.
            </p>

            {/* Core safety & security pointers */}
            <div className="space-y-3.5 pt-4">
              <h3 className="text-white text-xs font-black uppercase tracking-wider font-display flex items-center gap-2">
                <ShieldCheck className="w-4.5 h-4.5 text-red-600" /> Professional Track Mandate
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {corePillars.map((pillar, i) => (
                  <div key={i} className="flex gap-2.5 items-start bg-zinc-900/60 p-3.5 rounded-none border border-zinc-850">
                    <CheckCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-zinc-400 font-medium leading-relaxed">
                      {pillar}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Bento Grid Stats / Achievements Column */}
          <div className="col-span-1 lg:col-span-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {stats.map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.4 }}
                  className="bg-zinc-950 border border-zinc-850 rounded-none p-6 text-left hover:border-red-600/35 transition-all duration-350 relative group overflow-hidden"
                >
                  {/* Subtle hover drift corner lines */}
                  <div className="absolute top-0 right-0 w-8 h-8 bg-zinc-900 group-hover:bg-red-650/10 transition-colors border-b border-l border-zinc-850"></div>
                  
                  <div className="text-3xl sm:text-4xl font-black font-racing text-red-600 tracking-wider mb-1.5 flex items-baseline gap-1">
                    {stat.value}
                    {i === 2 && <Zap className="w-4 h-4 text-white inline animate-pulse" />}
                  </div>

                  <h3 className="text-white text-xs font-black uppercase tracking-wider font-display mb-1">
                    {stat.label}
                  </h3>
                  
                  <p className="text-sm text-zinc-400 font-medium font-sans">
                    {stat.sub}
                  </p>
                </motion.div>
              ))}

              {/* Special interactive Promo Banner within About Grid */}
              <div className="sm:col-span-2 bg-zinc-950 border border-red-600/20 rounded-none p-6 text-left flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-xs text-red-650 font-black uppercase tracking-widest font-display italic">
                    <Flame className="w-4 h-4 animate-bounce" /> Pro Speed Nights
                  </div>
                  <p className="text-sm text-zinc-400 leading-relaxed">
                    Join us every Tuesday and Thursday after 8:00 PM for advanced heats, league-style grids, and higher-power kart modes for approved drivers.
                  </p>
                </div>
                <div className="flex-shrink-0 bg-red-600 hover:bg-red-700 px-4 py-2 text-white rounded-none text-xs font-black uppercase tracking-widest cursor-pointer transform -skew-x-12">
                  <span className="inline-block skew-x-12">Pro License Req</span>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

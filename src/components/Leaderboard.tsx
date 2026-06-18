import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Timer, Swords, ArrowUp, Zap, RotateCcw } from 'lucide-react';
import { LeaderboardRacer } from '../types';
import { INITIAL_LEADERBOARD_ADULT, INITIAL_LEADERBOARD_JUNIOR } from '../data';

export default function Leaderboard() {
  const [division, setDivision] = useState<'adult' | 'junior'>('adult');
  const [racers, setRacers] = useState<LeaderboardRacer[]>(INITIAL_LEADERBOARD_ADULT);
  const [lastUpdatedRacer, setLastUpdatedRacer] = useState<number | null>(null);
  const [battleMessage, setBattleMessage] = useState<string>('Sample race board ready. Pick a division or simulate a lap.');

  // Reset racers on division change
  useEffect(() => {
    setRacers(division === 'adult' ? INITIAL_LEADERBOARD_ADULT : INITIAL_LEADERBOARD_JUNIOR);
    setLastUpdatedRacer(null);
    setBattleMessage(`${division === 'adult' ? 'Adult Pro Division' : 'Junior Academy Division'} sample board loaded.`);
  }, [division]);

  // Handle demo lap simulation
  const simulateLap = () => {
    setRacers((prevRacers) => {
      // Modify lap timers slightly
      const simulated = prevRacers.map((racer) => {
        // Random change between -0.4s and +0.3s
        const randomDiff = (Math.random() * 0.7 - 0.4);
        
        // Parse current best lap
        const currentBestFloat = parseFloat(racer.bestLap.replace('s', ''));
        const newBestFloat = Math.max(16.5, parseFloat((currentBestFloat + (randomDiff < -0.1 ? randomDiff : randomDiff * 0.1)).toFixed(3)));
        
        // Best lap gets updated if new Best is smaller
        const isNewBest = newBestFloat < currentBestFloat;
        
        // Random current lap time
        const currentLapFloat = parseFloat((newBestFloat + (Math.random() * 0.9)).toFixed(3));

        return {
          ...racer,
          bestLap: isNewBest ? `${newBestFloat.toFixed(3)}s` : racer.bestLap,
          avgLapTime: `${currentLapFloat.toFixed(3)}s`,
          isNewRecord: isNewBest,
        };
      });

      // Sort racers by best lap time
      simulated.sort((a, b) => parseFloat(a.bestLap) - parseFloat(b.bestLap));

      // Re-calculate ranks and gaps
      const finalRanked = simulated.map((racer, index) => {
        const bestFloat = parseFloat(racer.bestLap);
        const leaderBestFloat = parseFloat(simulated[0].bestLap);
        const prevBestFloat = index > 0 ? parseFloat(simulated[index - 1].bestLap) : leaderBestFloat;

        const gap = index === 0 ? '---' : `+${(bestFloat - leaderBestFloat).toFixed(3)}s`;
        const interval = index === 0 ? '---' : `+${(bestFloat - prevBestFloat).toFixed(3)}s`;

        return {
          ...racer,
          rank: index + 1,
          gap,
          interval,
        };
      });

      // Find who got the ultimate best lap or an update
      const updatedIndex = finalRanked.findIndex(r => r.isNewRecord);
      if (updatedIndex !== -1) {
        setLastUpdatedRacer(finalRanked[updatedIndex].kartNo);
        setBattleMessage(`🏁 Sample update: Kart #${finalRanked[updatedIndex].kartNo} (${finalRanked[updatedIndex].name.split(' ')[0]}) set a new personal best: ${finalRanked[updatedIndex].bestLap}.`);
      } else {
        // General overtake update
        const randomRacer = finalRanked[Math.floor(Math.random() * finalRanked.length)];
        setLastUpdatedRacer(randomRacer.kartNo);
        setBattleMessage('⚡ Sample lap completed. The board has reshuffled for demo purposes.');
      }

      return finalRanked;
    });
  };

  const resetBoard = () => {
    setRacers(division === 'adult' ? INITIAL_LEADERBOARD_ADULT : INITIAL_LEADERBOARD_JUNIOR);
    setLastUpdatedRacer(null);
    setBattleMessage('Sample board restored to its starting order.');
  };

  return (
    <div className="bg-zinc-950 border border-zinc-855 rounded-none p-5 md:p-6 shadow-2xl relative w-full overflow-hidden text-left">
      
      {/* Absolute drift coordinates lines in container corners */}
      <div className="absolute top-0 left-0 w-1.5 h-full bg-red-650"></div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-900 pb-5 mb-5 pl-2">
        <div className="flex items-center gap-2.5">
          <div className="bg-red-600 text-white p-2.5 rounded-none">
            <Trophy className="w-4 h-4 fill-current animate-bounce" />
          </div>
          <div className="text-left font-display">
            <h3 className="text-white text-sm font-black uppercase tracking-wider">
              Sample Pitwall Leaderboard
            </h3>
            <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest font-mono flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-none bg-red-600"></span>
              Interactive Demo Lap Feed
            </p>
          </div>
        </div>

        {/* Action Toggle buttons division classification */}
        <div className="inline-flex bg-zinc-900 border border-zinc-850 p-1 rounded-none font-racing">
          <button
            onClick={() => setDivision('adult')}
            id="ldr-toggle-adult"
            className={`py-1.5 px-3 rounded-none text-xs uppercase font-black tracking-widest cursor-pointer transition-all transform -skew-x-12 ${
              division === 'adult' ? 'bg-red-600 text-white italic shadow-md' : 'text-zinc-450 hover:text-white'
            }`}
          >
            <span className="inline-block skew-x-12">Adult Pro</span>
          </button>
          <button
            onClick={() => setDivision('junior')}
            id="ldr-toggle-junior"
            className={`py-1.5 px-3 rounded-none text-xs uppercase font-black tracking-widest cursor-pointer transition-all transform -skew-x-12 ${
              division === 'junior' ? 'bg-zinc-850 text-white italic' : 'text-zinc-450 hover:text-white'
            }`}
          >
            <span className="inline-block skew-x-12">Jun Acad</span>
          </button>
        </div>
      </div>

      {/* Simulated ticker feed */}
      <div className="bg-zinc-950 border border-zinc-850 rounded-none p-3 text-xs text-left mb-5 flex items-center justify-between pl-4">
        <div className="flex items-center gap-2 text-zinc-350 font-mono">
          <Zap className="w-3.5 h-3.5 text-red-500 animate-pulse flex-shrink-0" />
          <span className="text-sm leading-relaxed select-none font-medium">
            {battleMessage}
          </span>
        </div>
      </div>

      {/* Leaderboard data table rows */}
      <div className="space-y-2 mb-6">
        {/* Header categories */}
        <div className="grid grid-cols-12 gap-1 text-xs font-black text-zinc-500 uppercase tracking-widest px-4 pb-1 pl-6 font-mono">
          <div className="col-span-1 select-none">RK</div>
          <div className="col-span-5 text-left">RACER NAME</div>
          <div className="col-span-2 text-right">LAST LAP</div>
          <div className="col-span-2 text-right">BEST LAP</div>
          <div className="col-span-2 text-right">GAP</div>
        </div>

        {/* Racer Rows */}
        <AnimatePresence>
          {racers.map((racer) => {
            const isHighlighted = lastUpdatedRacer === racer.kartNo;
            let stripeBorderColor = 'border-l-zinc-800';
            if (racer.rank === 1) stripeBorderColor = 'border-l-red-500';
            else if (racer.rank === 2) stripeBorderColor = 'border-l-zinc-400';
            else if (racer.rank === 3) stripeBorderColor = 'border-l-amber-600';

            return (
              <motion.div
                key={racer.kartNo}
                layoutId={`racer-${racer.kartNo}`}
                className={`grid grid-cols-12 gap-1 items-center bg-zinc-950/40 border border-zinc-855 p-2.5 rounded-none transition-all duration-300 relative pl-4 ${
                  isHighlighted 
                    ? 'ring-1 ring-red-600/50 bg-zinc-950 shadow-lg scale-[1.01]' 
                    : ''
                }`}
              >
                {/* Left rank colored indicator bar */}
                <div className={`absolute top-0 left-0 w-1 h-full rounded-none ${
                  racer.rank === 1 ? 'bg-red-500' : racer.rank === 2 ? 'bg-zinc-400' : racer.rank === 3 ? 'bg-amber-600' : 'bg-zinc-800'
                }`}></div>

                {/* Rank */}
                <div className="col-span-1 text-center font-racing text-sm font-black text-zinc-450">
                  {racer.rank}
                </div>

                {/* Racer Name + Kart No Badge */}
                <div className="col-span-5 text-left flex items-center gap-2">
                  <span className="bg-zinc-900 px-2 py-0.5 rounded-none text-xs font-mono text-zinc-400 border border-zinc-800">
                    #{racer.kartNo}
                  </span>
                  <span className="text-white text-sm font-bold truncate font-sans">
                    {racer.name}
                  </span>
                </div>

                {/* Last Lap time */}
                <div className="col-span-2 text-right font-mono text-zinc-300 text-sm">
                  {racer.avgLapTime}
                </div>

                {/* Best Lap time + indicator icon */}
                <div className="col-span-2 text-right font-mono text-white text-sm font-bold relative">
                  <span className={`${isHighlighted ? 'text-red-500 animate-pulse' : ''}`}>
                    {racer.bestLap}
                  </span>
                </div>

                {/* Cumulative gap */}
                <div className="col-span-2 text-right font-mono text-zinc-400 text-sm">
                  {racer.gap}
                </div>

              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Trigger Buttons console bottom */}
      <div className="flex items-center justify-between gap-4 border-t border-zinc-900 pt-4 pl-1">
        <button
          onClick={resetBoard}
          id="ldr-btn-reset"
          className="p-2.5 border border-zinc-850 hover:border-zinc-700 bg-zinc-950 text-zinc-400 hover:text-white rounded-none transition-colors cursor-pointer"
          title="Reset grid stats to default"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        <button
          onClick={simulateLap}
          id="ldr-btn-battle"
          className="flex-grow bg-red-600 hover:bg-red-750 text-white text-xs font-black uppercase tracking-widest py-3.5 px-4 rounded-none flex items-center justify-center gap-2 transition-all cursor-pointer transform -skew-x-12"
        >
          <span className="inline-flex skew-x-12 items-center gap-2 whitespace-nowrap">
            <Swords className="w-3.5 h-3.5" /> Simulate Sample Battle
          </span>
        </button>
      </div>

    </div>
  );
}

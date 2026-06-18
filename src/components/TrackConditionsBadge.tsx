import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, CloudRain, Gauge, MapPin, RefreshCw, Sun, Thermometer, Wind } from 'lucide-react';

interface WeatherConditions {
  status: 'Dry' | 'Wet';
  grip: number;
  temp: number;
  windSpeed: number;
  weatherCode: number;
  lastUpdated: string;
}

interface OpenMeteoResponse {
  current?: {
    temperature_2m?: number;
    precipitation?: number;
    rain?: number;
    showers?: number;
    snowfall?: number;
    weather_code?: number;
    wind_speed_10m?: number;
  };
}

const LONDON_WEATHER_URL =
  'https://api.open-meteo.com/v1/forecast?latitude=51.5072&longitude=-0.1276&current=temperature_2m,precipitation,rain,showers,snowfall,weather_code,wind_speed_10m&temperature_unit=celsius&wind_speed_unit=mph&timezone=Europe%2FLondon';

const WET_WEATHER_CODES = new Set([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 71, 73, 75, 77, 80, 81, 82, 85, 86, 95, 96, 99]);

const getGripIndex = (isWet: boolean, windSpeed: number) => {
  const baseGrip = isWet ? 0.62 : 0.94;
  const windPenalty = Math.min(windSpeed / 100, 0.06);
  return Math.max(0.5, Math.round((baseGrip - windPenalty) * 100) / 100);
};

export default function TrackConditionsBadge() {
  const [loading, setLoading] = useState(true);
  const [showDetails, setShowDetails] = useState(false);
  const [conditions, setConditions] = useState<WeatherConditions | null>(null);
  const [error, setError] = useState('');

  const fetchWeather = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(LONDON_WEATHER_URL);

      if (!response.ok) {
        throw new Error('Weather service unavailable');
      }

      const data = (await response.json()) as OpenMeteoResponse;
      const current = data.current;

      if (!current) {
        throw new Error('Weather data missing');
      }

      const precipitation =
        (current.precipitation || 0) + (current.rain || 0) + (current.showers || 0) + (current.snowfall || 0);
      const weatherCode = current.weather_code ?? 0;
      const isWet = precipitation > 0 || WET_WEATHER_CODES.has(weatherCode);
      const windSpeed = Math.round(current.wind_speed_10m || 0);

      const newConditions: WeatherConditions = {
        status: isWet ? 'Wet' : 'Dry',
        grip: getGripIndex(isWet, windSpeed),
        temp: Math.round(current.temperature_2m || 0),
        windSpeed,
        weatherCode,
        lastUpdated: new Date().toLocaleTimeString('en-GB', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      };

      setConditions(newConditions);
    } catch {
      setError('London weather update failed');
      setConditions({
        status: 'Dry',
        grip: 0.9,
        temp: 16,
        windSpeed: 0,
        weatherCode: 0,
        lastUpdated: new Date().toLocaleTimeString('en-GB', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather();
  }, []);

  return (
    <div className="relative inline-block font-mono select-none">
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loading-tracker"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="inline-flex items-center gap-2 bg-zinc-950 border border-zinc-850 px-3.5 py-1.5 text-xs font-black uppercase text-zinc-500 tracking-wider"
          >
            <RefreshCw className="w-3 h-3 text-red-500 animate-spin" />
            <span>LOADING LONDON WEATHER...</span>
          </motion.div>
        ) : (
          <motion.div
            key="active-tracker"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`inline-flex max-w-[calc(100vw-2rem)] items-center gap-2.5 bg-zinc-950 border px-3.5 py-1.5 text-xs font-black uppercase cursor-pointer hover:bg-zinc-900 transition-colors ${
              conditions?.status === 'Wet' 
                ? 'border-blue-500/80 text-blue-400' 
                : 'border-amber-500/80 text-amber-500'
            }`}
            onClick={() => setShowDetails(!showDetails)}
            title="Click to toggle weather details"
          >
            {error ? (
              <AlertTriangle className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
            ) : conditions?.status === 'Wet' ? (
              <CloudRain className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
            ) : (
              <Sun className="w-3.5 h-3.5 text-amber-500" />
            )}
            
            <span className="truncate">
              LONDON: {conditions?.temp}°C • ASPHALT: {conditions?.status} (GRIP: {conditions?.grip.toFixed(2)})
            </span>

            <span className="text-xs text-zinc-650 ml-1 border-l border-zinc-855 pl-2 hover:text-white transition-colors hidden sm:flex items-center gap-1 whitespace-nowrap">
              WEATHER DETAILS {showDetails ? '▼' : '▲'}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fly-out detail module panel to display full micro weather reports */}
      <AnimatePresence>
        {showDetails && !loading && conditions && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="absolute left-0 mt-2 z-30 w-64 bg-zinc-950 border border-zinc-900 p-4 shadow-2xl space-y-3.5"
          >
            <div className="flex items-center justify-between border-b border-zinc-900 pb-2">
              <span className="text-xs text-zinc-550 font-bold uppercase tracking-wider">
                LONDON WEATHER FEED
              </span>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  fetchWeather();
                }}
                className="hover:text-red-500 transition-colors cursor-pointer text-zinc-500 p-1 flex items-center gap-1 text-sm font-mono font-bold"
                title="Refresh London weather data"
              >
                <RefreshCw className="w-2.5 h-2.5" /> REFRESH
              </button>
            </div>

            <div className="space-y-2 text-xs">
              {/* Grip Coefficient */}
              <div className="flex justify-between items-center text-zinc-400">
                <span className="flex items-center gap-1.5 font-bold uppercase text-zinc-550 text-xs">
                  <Gauge className="w-3 h-3 text-red-550" /> Grip Index:
                </span>
                <span className="text-white font-black">
                  {conditions.grip} μ
                </span>
              </div>

              {/* Outdoor Temperature */}
              <div className="flex justify-between items-center text-zinc-400">
                <span className="flex items-center gap-1.5 font-bold uppercase text-zinc-550 text-xs">
                  <Thermometer className="w-3 h-3 text-red-550" /> London Temp:
                </span>
                <span className="text-white font-black">
                  {conditions.temp}°C
                </span>
              </div>

              {/* Wind Speed */}
              <div className="flex justify-between items-center text-zinc-400">
                <span className="flex items-center gap-1.5 font-bold uppercase text-zinc-550 text-xs">
                  <Wind className="w-3 h-3 text-red-550" /> Wind:
                </span>
                <span className="text-white font-black">
                  {conditions.windSpeed} mph
                </span>
              </div>

              <div className="flex justify-between items-center text-zinc-400">
                <span className="flex items-center gap-1.5 font-bold uppercase text-zinc-550 text-xs">
                  <MapPin className="w-3 h-3 text-red-550" /> Source:
                </span>
                <span className="text-white font-black">
                  Open-Meteo
                </span>
              </div>

              {/* Weather report statement */}
              <div className="bg-zinc-900/60 border border-zinc-910 p-2 text-sm leading-relaxed text-zinc-450 mt-1 uppercase text-left">
                {error ? (
                  <span>⚠️ {error}. Showing safe fallback track estimate.</span>
                ) : conditions.status === 'Wet' ? (
                  <span>⚠️ Wet asphalt alert. Speed regulators adjusted for safety and drift.</span>
                ) : (
                  <span>☀️ London conditions indicate dry weather. Grip estimate is based on current weather.</span>
                )}
              </div>
            </div>

            <div className="text-xs text-zinc-[650] text-right border-t border-zinc-920 pt-2 flex justify-between">
              <span>UPDATED:</span>
              <span>{conditions.lastUpdated}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

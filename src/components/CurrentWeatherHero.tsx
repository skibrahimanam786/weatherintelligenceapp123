import React from 'react';
import { OpenMeteoForecastResponse, GeocodingResult, TemperatureUnit } from '../types/weather';
import { getWeatherCondition, formatTempWithUnit, degreesToCompass, getUvIndexCategory } from '../utils/weatherUtils';
import { 
  Sun, Moon, CloudSun, CloudMoon, Cloud, CloudFog, CloudDrizzle, 
  CloudRain, CloudRainWind, Snowflake, CloudLightning, CloudHail, 
  MapPin, Star, Wind, Droplets, Gauge, SunMedium
} from 'lucide-react';

interface CurrentWeatherHeroProps {
  weather: OpenMeteoForecastResponse;
  location: GeocodingResult;
  unit: TemperatureUnit;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

export const CurrentWeatherHero: React.FC<CurrentWeatherHeroProps> = ({
  weather,
  location,
  unit,
  isFavorite,
  onToggleFavorite
}) => {
  const current = weather.current;
  const daily = weather.daily;

  if (!current) {
    return null;
  }

  const condition = getWeatherCondition(current.weather_code, current.is_day);
  const todayMaxC = daily?.temperature_2m_max?.[0] ?? current.temperature_2m;
  const todayMinC = daily?.temperature_2m_min?.[0] ?? current.temperature_2m;
  const maxUvToday = daily?.uv_index_max?.[0] ?? current.cloud_cover / 10;
  const uvInfo = getUvIndexCategory(maxUvToday);

  // Dynamic Lucide Icon Mapper
  const renderWeatherIcon = (iconName: string) => {
    const props = { className: 'w-20 h-20 sm:w-28 sm:h-28 text-white drop-shadow-lg' };
    switch (iconName) {
      case 'Sun': return <Sun {...props} className="w-20 h-20 sm:w-28 sm:h-28 text-amber-300 drop-shadow-xl animate-spin-slow" />;
      case 'Moon': return <Moon {...props} className="w-20 h-20 sm:w-28 sm:h-28 text-indigo-200 drop-shadow-xl" />;
      case 'CloudSun': return <CloudSun {...props} className="w-20 h-20 sm:w-28 sm:h-28 text-amber-200 drop-shadow-xl" />;
      case 'CloudMoon': return <CloudMoon {...props} className="w-20 h-20 sm:w-28 sm:h-28 text-indigo-200 drop-shadow-xl" />;
      case 'Cloud': return <Cloud {...props} className="w-20 h-20 sm:w-28 sm:h-28 text-slate-200 drop-shadow-xl" />;
      case 'CloudFog': return <CloudFog {...props} className="w-20 h-20 sm:w-28 sm:h-28 text-stone-200 drop-shadow-xl" />;
      case 'CloudDrizzle': return <CloudDrizzle {...props} className="w-20 h-20 sm:w-28 sm:h-28 text-teal-200 drop-shadow-xl" />;
      case 'CloudRain': return <CloudRain {...props} className="w-20 h-20 sm:w-28 sm:h-28 text-blue-200 drop-shadow-xl" />;
      case 'CloudRainWind': return <CloudRainWind {...props} className="w-20 h-20 sm:w-28 sm:h-28 text-sky-200 drop-shadow-xl" />;
      case 'Snowflake': return <Snowflake {...props} className="w-20 h-20 sm:w-28 sm:h-28 text-sky-100 drop-shadow-xl" />;
      case 'CloudLightning': return <CloudLightning {...props} className="w-20 h-20 sm:w-28 sm:h-28 text-purple-200 drop-shadow-xl animate-pulse" />;
      case 'CloudHail': return <CloudHail {...props} className="w-20 h-20 sm:w-28 sm:h-28 text-red-200 drop-shadow-xl" />;
      default: return <SunMedium {...props} className="w-20 h-20 sm:w-28 sm:h-28 text-amber-300 drop-shadow-xl" />;
    }
  };

  return (
    <div 
      className="relative overflow-hidden rounded-3xl bg-slate-900/90 border border-slate-800 p-6 sm:p-10 text-slate-50 shadow-2xl transition-all"
      id="current-weather-hero-card"
    >
      {/* Background Decorative Gradient Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Hero Header Line: Location Title & Eyebrow */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono uppercase tracking-[0.35em]">
            <MapPin className="w-3.5 h-3.5 shrink-0 text-cyan-400" />
            <span>METEOROLOGICAL_STATION</span>
            {location.elevation && (
              <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                {location.elevation}M ELEV
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 mt-2">
            <h2 className="text-5xl sm:text-7xl font-black tracking-tighter uppercase text-slate-50 drop-shadow-lg">
              {location.name}
            </h2>
            <span className="text-xl sm:text-2xl font-light text-slate-400 tracking-widest uppercase">
              {location.admin1 ? `${location.admin1}, ` : ''}{location.country}
              <span className="ml-2 font-mono text-xs text-slate-500">({location.latitude.toFixed(1)}°N, {location.longitude.toFixed(1)}°E)</span>
            </span>
          </div>

          <p className="text-xs font-mono text-slate-400 uppercase tracking-wider mt-2">
            LOCAL_TIME: {new Date().toLocaleTimeString('en-US', { timeZone: location.timezone || 'UTC', hour: '2-digit', minute: '2-digit' })} • TIMEZONE: {location.timezone || 'UTC'}
          </p>
        </div>

        {/* Pin / Favorite Star Button */}
        <button
          onClick={onToggleFavorite}
          id="hero-favorite-toggle-btn"
          className={`px-4 py-2.5 rounded-xl border font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 ${
            isFavorite
              ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-amber-400/20'
              : 'bg-slate-950/80 text-slate-300 border-slate-700 hover:border-cyan-500/60 hover:text-cyan-300'
          }`}
          title={isFavorite ? 'Remove from pinned locations' : 'Pin to favorite locations'}
        >
          <Star className={`w-4 h-4 ${isFavorite ? 'fill-slate-950' : ''}`} />
          <span>{isFavorite ? 'PINNED' : 'PIN_CITY'}</span>
        </button>
      </div>

      {/* Main Temperature & Weather Icon Section */}
      <div className="relative z-10 my-8 sm:my-10 flex flex-col md:flex-row md:items-center justify-between gap-8 border-y border-slate-800/80 py-8">
        <div className="flex flex-col">
          <div className="flex flex-col sm:flex-row sm:items-baseline gap-4">
            {/* GIANT BOLD TEMPERATURE */}
            <span className="text-7xl sm:text-[130px] lg:text-[150px] font-black text-slate-50 leading-none tracking-tighter drop-shadow-xl">
              {formatTempWithUnit(current.temperature_2m, unit)}
            </span>

            <div className="flex flex-col gap-1">
              <span className="text-xs font-mono uppercase tracking-widest text-cyan-400">FEELS_LIKE</span>
              <span className="text-2xl sm:text-3xl font-bold text-slate-200">
                {formatTempWithUnit(current.apparent_temperature, unit)}
              </span>
              <span className="text-xs font-mono text-slate-400 uppercase tracking-wider mt-1">
                HIGH {formatTempWithUnit(todayMaxC, unit)} / LOW {formatTempWithUnit(todayMinC, unit)}
              </span>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <span className="px-3.5 py-1 rounded-lg text-xs font-mono font-bold uppercase tracking-wider bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
              {condition.label}
            </span>
            <p className="text-2xl sm:text-3xl font-light italic text-slate-300">
              {condition.description}
            </p>
          </div>
        </div>

        {/* Weather Icon */}
        <div className="self-start md:self-center flex items-center justify-center p-6 bg-slate-950/60 border border-slate-800 rounded-2xl shadow-inner">
          {renderWeatherIcon(condition.iconName)}
        </div>
      </div>

      {/* Quick Metrics Bar at Bottom of Hero */}
      <div className="relative z-10 grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Wind Speed */}
        <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 flex items-center gap-4">
          <div className="w-9 h-9 border border-slate-700 rounded-full flex items-center justify-center text-cyan-400 font-mono text-xs italic shrink-0">
            01
          </div>
          <div>
            <p className="text-[10px] font-mono uppercase tracking-wider text-cyan-400">Surface Wind</p>
            <p className="text-xl font-bold text-slate-100">
              {Math.round(current.wind_speed_10m)} <span className="text-xs text-slate-400 font-mono">km/h</span>
            </p>
            <p className="text-[10px] font-mono text-slate-400 uppercase">
              {degreesToCompass(current.wind_direction_10m)} ({current.wind_direction_10m}°)
            </p>
          </div>
        </div>

        {/* Humidity */}
        <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 flex items-center gap-4">
          <div className="w-9 h-9 border border-slate-700 rounded-full flex items-center justify-center text-cyan-400 font-mono text-xs italic shrink-0">
            02
          </div>
          <div>
            <p className="text-[10px] font-mono uppercase tracking-wider text-cyan-400">Relative Humidity</p>
            <p className="text-xl font-bold text-slate-100">
              {current.relative_humidity_2m}%
            </p>
            <p className="text-[10px] font-mono text-slate-400 uppercase">
              {current.relative_humidity_2m > 70 ? 'High Moisture' : current.relative_humidity_2m < 30 ? 'Dry Air' : 'Comfortable'}
            </p>
          </div>
        </div>

        {/* Air Pressure */}
        <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 flex items-center gap-4">
          <div className="w-9 h-9 border border-slate-700 rounded-full flex items-center justify-center text-cyan-400 font-mono text-xs italic shrink-0">
            03
          </div>
          <div>
            <p className="text-[10px] font-mono uppercase tracking-wider text-cyan-400">Atmospheric Pressure</p>
            <p className="text-xl font-bold text-slate-100">
              {Math.round(current.pressure_msl || current.surface_pressure)} <span className="text-xs text-slate-400 font-mono">hPa</span>
            </p>
            <p className="text-[10px] font-mono text-slate-400 uppercase">Barometric Sea Level</p>
          </div>
        </div>

        {/* UV Index */}
        <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 flex items-center gap-4">
          <div className="w-9 h-9 border border-slate-700 rounded-full flex items-center justify-center text-cyan-400 font-mono text-xs italic shrink-0">
            04
          </div>
          <div>
            <p className="text-[10px] font-mono uppercase tracking-wider text-cyan-400">UV Index Peak</p>
            <p className="text-xl font-bold text-slate-100">
              {maxUvToday} <span className="text-xs font-mono text-amber-400">({uvInfo.label})</span>
            </p>
            <p className="text-[10px] font-mono text-slate-400 uppercase truncate">Solar Radiation</p>
          </div>
        </div>

      </div>

    </div>
  );
};

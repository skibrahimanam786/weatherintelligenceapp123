import React from 'react';
import { OpenMeteoForecastResponse, TemperatureUnit } from '../types/weather';
import { getUvIndexCategory, degreesToCompass, formatTimeOnly, formatTempWithUnit } from '../utils/weatherUtils';
import { 
  Sun, Wind, Droplets, Eye, Sunrise, Sunset, Cloud, Navigation, 
  Thermometer, ShieldAlert, Compass
} from 'lucide-react';

interface WeatherMetricsGridProps {
  weather: OpenMeteoForecastResponse;
  unit: TemperatureUnit;
}

export const WeatherMetricsGrid: React.FC<WeatherMetricsGridProps> = ({ weather, unit }) => {
  const current = weather.current;
  const daily = weather.daily;
  const hourly = weather.hourly;

  if (!current) return null;

  const maxUvToday = daily?.uv_index_max?.[0] ?? 0;
  const uvInfo = getUvIndexCategory(maxUvToday);
  
  const sunriseTime = daily?.sunrise?.[0] ? formatTimeOnly(daily.sunrise[0]) : '--:--';
  const sunsetTime = daily?.sunset?.[0] ? formatTimeOnly(daily.sunset[0]) : '--:--';
  
  const visibilityKm = hourly?.visibility?.[0] ? Math.round(hourly.visibility[0] / 1000) : 10;
  const dewPointC = hourly?.dew_point_2m?.[0] ?? (current.temperature_2m - ((100 - current.relative_humidity_2m) / 5));

  // Sun position progress percentage calculation
  let sunProgress = 50;
  if (daily?.sunrise?.[0] && daily?.sunset?.[0]) {
    const riseMs = new Date(daily.sunrise[0]).getTime();
    const setMs = new Date(daily.sunset[0]).getTime();
    const nowMs = Date.now();
    if (nowMs <= riseMs) sunProgress = 0;
    else if (nowMs >= setMs) sunProgress = 100;
    else {
      sunProgress = Math.round(((nowMs - riseMs) / (setMs - riseMs)) * 100);
    }
  }

  return (
    <div className="space-y-4" id="weather-metrics-grid-container">
      <div className="border-b border-slate-800 pb-3">
        <h3 className="text-xs font-mono uppercase tracking-[0.25em] text-cyan-400 flex items-center gap-2">
          <Compass className="w-4 h-4 text-cyan-400" />
          ATMOSPHERIC_GAUGE_METRICS
        </h3>
        <p className="text-sm font-light italic text-slate-300 mt-0.5">
          Sensor telemetry, UV radiation limits, and wind vectors.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        
        {/* 1. UV Index Gauge */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-cyan-400 text-[10px] font-mono font-bold uppercase tracking-wider">
              <Sun className="w-4 h-4 text-amber-400" />
              <span>UV_INDEX_PEAK</span>
            </div>
            <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${uvInfo.badge}`}>
              {uvInfo.label}
            </span>
          </div>

          <div className="my-4">
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-black text-slate-100 font-mono">{maxUvToday}</span>
              <span className="text-xs font-mono text-slate-400">/ 12 PEAK</span>
            </div>

            {/* Visual Gauge Bar */}
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden my-3 relative">
              <div 
                className="h-full bg-cyan-400 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (maxUvToday / 11) * 100)}%` }}
              />
            </div>
          </div>

          <p className="text-xs text-slate-400 font-light leading-relaxed border-t border-slate-800/80 pt-3">
            {uvInfo.desc}
          </p>
        </div>

        {/* 2. Wind & Gusts Vector */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-cyan-400 text-[10px] font-mono font-bold uppercase tracking-wider">
              <Wind className="w-4 h-4 text-cyan-400" />
              <span>WIND_DYNAMICS</span>
            </div>
            <span className="text-[10px] font-mono font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/30">
              {degreesToCompass(current.wind_direction_10m)}
            </span>
          </div>

          <div className="my-3 flex items-center justify-between">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-black text-slate-100 font-mono">
                  {Math.round(current.wind_speed_10m)}
                </span>
                <span className="text-xs font-mono text-slate-400">KM/H</span>
              </div>
              <p className="text-xs font-mono text-slate-400 mt-1">
                GUSTS: <span className="text-slate-200 font-bold">{Math.round(current.wind_gusts_10m || current.wind_speed_10m * 1.3)} KM/H</span>
              </p>
            </div>

            {/* Animated Compass Icon */}
            <div className="w-14 h-14 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center relative shadow-inner">
              <Navigation 
                className="w-7 h-7 text-cyan-400 transition-transform duration-500" 
                style={{ transform: `rotate(${current.wind_direction_10m}deg)` }}
              />
              <span className="absolute top-1 text-[8px] font-mono font-bold text-slate-500">N</span>
            </div>
          </div>

          <p className="text-xs text-slate-400 font-light leading-relaxed border-t border-slate-800/80 pt-3">
            {current.wind_speed_10m > 35 
              ? 'High wind alert: Caution recommended for high-profile vehicles.'
              : current.wind_speed_10m > 15
              ? 'Gentle breeze to moderate airflow.'
              : 'Calm atmospheric movement.'}
          </p>
        </div>

        {/* 3. Humidity & Dew Point */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-cyan-400 text-[10px] font-mono font-bold uppercase tracking-wider">
              <Droplets className="w-4 h-4 text-cyan-400" />
              <span>RELATIVE_HUMIDITY</span>
            </div>
            <span className="text-[10px] font-mono font-bold text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/30">
              DEW: {formatTempWithUnit(dewPointC, unit)}
            </span>
          </div>

          <div className="my-3">
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-black text-slate-100 font-mono">{current.relative_humidity_2m}%</span>
            </div>

            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden my-3">
              <div 
                className="h-full bg-cyan-400 rounded-full transition-all duration-500"
                style={{ width: `${current.relative_humidity_2m}%` }}
              />
            </div>
          </div>

          <p className="text-xs text-slate-400 font-light leading-relaxed border-t border-slate-800/80 pt-3">
            {current.relative_humidity_2m > 75 
              ? 'Muggy atmosphere. Condensation likelihood is high.'
              : current.relative_humidity_2m < 30
              ? 'Dry air: Skin hydration and eye care suggested.'
              : 'Comfortable moisture levels.'}
          </p>
        </div>

        {/* 4. Solar Cycle Arc (Sunrise & Sunset) */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-cyan-400 text-[10px] font-mono font-bold uppercase tracking-wider">
              <Sunrise className="w-4 h-4 text-amber-400" />
              <span>SOLAR_DAYLIGHT_CYCLE</span>
            </div>
            <span className="text-[10px] text-amber-300 font-mono font-bold uppercase">
              {sunProgress > 0 && sunProgress < 100 ? `${sunProgress}% DAYLIGHT` : 'NIGHT_PHASE'}
            </span>
          </div>

          <div className="my-3 space-y-3">
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden relative">
              <div 
                className="h-full bg-amber-400 rounded-full transition-all duration-500"
                style={{ width: `${sunProgress}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-1.5 text-slate-300 font-bold">
                <Sunrise className="w-4 h-4 text-amber-400" />
                <span>RISE: {sunriseTime}</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-300 font-bold">
                <Sunset className="w-4 h-4 text-amber-500" />
                <span>SET: {sunsetTime}</span>
              </div>
            </div>
          </div>

          <p className="text-xs text-slate-400 font-light leading-relaxed border-t border-slate-800/80 pt-3">
            Solar elevation cycle calibrated to station coordinates and timezone offset.
          </p>
        </div>

        {/* 5. Cloud Cover & Visibility */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-cyan-400 text-[10px] font-mono font-bold uppercase tracking-wider">
              <Cloud className="w-4 h-4 text-slate-300" />
              <span>VISIBILITY_RANGE</span>
            </div>
            <span className="text-[10px] text-slate-300 font-mono font-bold bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
              {current.cloud_cover}% CLOUDS
            </span>
          </div>

          <div className="my-3 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-mono uppercase text-slate-400">Horizontal Sight Range</p>
              <div className="flex items-baseline gap-1 mt-1 font-mono">
                <span className="text-4xl font-black text-slate-100">{visibilityKm}</span>
                <span className="text-xs text-slate-400 font-bold">KM</span>
              </div>
            </div>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-slate-300">
              <Eye className="w-6 h-6 text-cyan-400" />
            </div>
          </div>

          <p className="text-xs text-slate-400 font-light leading-relaxed border-t border-slate-800/80 pt-3">
            {visibilityKm >= 10 ? 'Unobstructed direct line-of-sight visual conditions.' : 'Reduced atmospheric visibility.'}
          </p>
        </div>

        {/* 6. Atmospheric Pressure */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-cyan-400 text-[10px] font-mono font-bold uppercase tracking-wider">
              <Thermometer className="w-4 h-4 text-emerald-400" />
              <span>BAROMETRIC_PRESSURE</span>
            </div>
            <span className="text-[10px] text-emerald-300 font-mono font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
              STABLE
            </span>
          </div>

          <div className="my-3 font-mono">
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-black text-slate-100">
                {Math.round(current.pressure_msl || current.surface_pressure)}
              </span>
              <span className="text-xs text-slate-400 font-bold">HPA</span>
            </div>
            <p className="text-[10px] text-slate-400 uppercase mt-1">
              SURFACE: {Math.round(current.surface_pressure)} HPA
            </p>
          </div>

          <p className="text-xs text-slate-400 font-light leading-relaxed border-t border-slate-800/80 pt-3">
            Steady barometric pressure indicates neutral front movement.
          </p>
        </div>

      </div>
    </div>
  );
};

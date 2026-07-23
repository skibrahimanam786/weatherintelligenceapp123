import React, { useState } from 'react';
import { OpenMeteoForecastResponse, TemperatureUnit } from '../types/weather';
import { 
  getWeatherCondition, formatDayName, formatTempWithUnit, 
  getUvIndexCategory, formatTimeOnly 
} from '../utils/weatherUtils';
import { 
  Calendar, CloudRain, Sun, Wind, ChevronRight, X, Sunrise, Sunset, 
  Droplets, SunMedium, Moon, CloudSun, CloudMoon, Cloud, CloudFog, 
  CloudDrizzle, CloudRainWind, Snowflake, CloudLightning, CloudHail
} from 'lucide-react';

interface DailyForecastProps {
  weather: OpenMeteoForecastResponse;
  unit: TemperatureUnit;
}

export const DailyForecast: React.FC<DailyForecastProps> = ({ weather, unit }) => {
  const [selectedDayIdx, setSelectedDayIdx] = useState<number | null>(null);

  const daily = weather.daily;
  if (!daily || !daily.time || daily.time.length === 0) return null;

  // Global min and max across all 7 days for relative temp bar scaling
  const globalMin = Math.min(...daily.temperature_2m_min);
  const globalMax = Math.max(...daily.temperature_2m_max);
  const tempSpan = Math.max(1, globalMax - globalMin);

  const renderIcon = (code: number) => {
    const condition = getWeatherCondition(code, 1);
    const props = { className: 'w-6 h-6 shrink-0' };

    switch (condition.iconName) {
      case 'Sun': return <Sun {...props} className="w-6 h-6 text-amber-400" />;
      case 'Moon': return <Moon {...props} className="w-6 h-6 text-indigo-300" />;
      case 'CloudSun': return <CloudSun {...props} className="w-6 h-6 text-amber-300" />;
      case 'CloudMoon': return <CloudMoon {...props} className="w-6 h-6 text-indigo-200" />;
      case 'Cloud': return <Cloud {...props} className="w-6 h-6 text-slate-300" />;
      case 'CloudFog': return <CloudFog {...props} className="w-6 h-6 text-stone-300" />;
      case 'CloudDrizzle': return <CloudDrizzle {...props} className="w-6 h-6 text-teal-300" />;
      case 'CloudRain': return <CloudRain {...props} className="w-6 h-6 text-blue-400" />;
      case 'CloudRainWind': return <CloudRainWind {...props} className="w-6 h-6 text-sky-400" />;
      case 'Snowflake': return <Snowflake {...props} className="w-6 h-6 text-sky-200" />;
      case 'CloudLightning': return <CloudLightning {...props} className="w-6 h-6 text-purple-400" />;
      case 'CloudHail': return <CloudHail {...props} className="w-6 h-6 text-red-400" />;
      default: return <SunMedium {...props} className="w-6 h-6 text-amber-400" />;
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4" id="daily-forecast-card">
      
      {/* Card Header */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
        <div>
          <h3 className="text-xs font-mono uppercase tracking-[0.25em] text-cyan-400 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-cyan-400" />
            7_DAY_PROJECTION
          </h3>
          <p className="text-sm font-light italic text-slate-300 mt-0.5">
            Weekly thermal trends and meteorological forecasting.
          </p>
        </div>
        <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded-lg border border-cyan-500/30">
          7 DAYS
        </span>
      </div>

      {/* Daily Rows List */}
      <div className="space-y-2">
        {daily.time.map((time, idx) => {
          const code = daily.weather_code[idx];
          const minTemp = daily.temperature_2m_min[idx];
          const maxTemp = daily.temperature_2m_max[idx];
          const precipProb = daily.precipitation_probability_max?.[idx] ?? 0;
          const precipSum = daily.precipitation_sum?.[idx] ?? 0;
          const uvMax = daily.uv_index_max?.[idx] ?? 0;
          const condition = getWeatherCondition(code, 1);
          const uvInfo = getUvIndexCategory(uvMax);

          // Temp range bar math percentage
          const leftPct = Math.round(((minTemp - globalMin) / tempSpan) * 100);
          const widthPct = Math.max(10, Math.round(((maxTemp - minTemp) / tempSpan) * 100));

          return (
            <div
              key={`day-${time}`}
              onClick={() => setSelectedDayIdx(idx)}
              className="p-3.5 rounded-xl bg-slate-950/60 hover:bg-slate-800/80 border border-slate-800/80 hover:border-cyan-500/40 cursor-pointer transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
              id={`daily-item-${idx}`}
            >
              {/* Day Name & Condition */}
              <div className="flex items-center gap-3 min-w-[200px]">
                <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0">
                  {renderIcon(code)}
                </div>
                <div>
                  <p className="font-mono text-sm font-bold tracking-wider uppercase text-slate-100 group-hover:text-cyan-300 transition-colors">
                    {formatDayName(time)}
                  </p>
                  <p className="text-xs text-slate-400">
                    {condition.label}
                  </p>
                </div>
              </div>

              {/* Rain Risk & UV Badge */}
              <div className="flex items-center gap-3">
                {precipProb > 20 ? (
                  <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 flex items-center gap-1">
                    <CloudRain className="w-3.5 h-3.5" />
                    {precipProb}% ({precipSum}mm)
                  </span>
                ) : (
                  <span className="text-xs font-mono text-slate-500 hidden sm:inline uppercase">Dry</span>
                )}

                <span className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold border hidden md:inline-block ${uvInfo.badge}`}>
                  UV {uvMax}
                </span>
              </div>

              {/* Min & Max Temp Range Visual Bar */}
              <div className="flex items-center gap-3 min-w-[220px]">
                <span className="text-xs font-mono font-bold text-slate-400 w-12 text-right">
                  {formatTempWithUnit(minTemp, unit)}
                </span>

                <div className="flex-1 bg-slate-800 h-1.5 rounded-full overflow-hidden relative">
                  <div 
                    className="h-full bg-cyan-400 rounded-full"
                    style={{ marginLeft: `${leftPct}%`, width: `${widthPct}%` }}
                  />
                </div>

                <span className="text-xs font-mono font-bold text-slate-100 w-12">
                  {formatTempWithUnit(maxTemp, unit)}
                </span>
              </div>

              <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-transform shrink-0 hidden sm:block" />
            </div>
          );
        })}
      </div>

      {/* Expanded Day Detail Drawer Modal */}
      {selectedDayIdx !== null && (
        <div 
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={() => setSelectedDayIdx(null)}
          id="day-detail-modal-backdrop"
        >
          <div 
            className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-5"
            onClick={(e) => e.stopPropagation()}
            id="day-detail-modal-card"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
                  {renderIcon(daily.weather_code[selectedDayIdx])}
                </div>
                <div>
                  <h4 className="text-lg font-black uppercase tracking-tight text-slate-100">
                    {formatDayName(daily.time[selectedDayIdx])} FORECAST
                  </h4>
                  <p className="text-xs font-mono text-cyan-400">
                    {daily.time[selectedDayIdx]} • {getWeatherCondition(daily.weather_code[selectedDayIdx]).description}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedDayIdx(null)}
                className="p-1.5 text-slate-400 hover:text-slate-100 bg-slate-800 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Stats Grid */}
            <div className="grid grid-cols-2 gap-3 text-sm font-mono">
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                <p className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider">TEMP_RANGE</p>
                <p className="text-lg font-bold text-slate-100 mt-1">
                  {formatTempWithUnit(daily.temperature_2m_min[selectedDayIdx], unit)} - {formatTempWithUnit(daily.temperature_2m_max[selectedDayIdx], unit)}
                </p>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  Feels like {formatTempWithUnit(daily.apparent_temperature_max?.[selectedDayIdx] ?? daily.temperature_2m_max[selectedDayIdx], unit)}
                </p>
              </div>

              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                <p className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider">PRECIP_TOTAL</p>
                <p className="text-lg font-bold text-cyan-300 mt-1">
                  {daily.precipitation_sum?.[selectedDayIdx] ?? 0} mm
                </p>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  Chance: {daily.precipitation_probability_max?.[selectedDayIdx] ?? 0}%
                </p>
              </div>

              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                <p className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider">MAX_WIND_GUSTS</p>
                <p className="text-lg font-bold text-teal-400 mt-1">
                  {Math.round(daily.wind_gusts_10m_max?.[selectedDayIdx] ?? 0)} km/h
                </p>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  Avg: {Math.round(daily.wind_speed_10m_max?.[selectedDayIdx] ?? 0)} km/h
                </p>
              </div>

              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                <p className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider">MAX_UV_INDEX</p>
                <p className="text-lg font-bold text-amber-400 mt-1">
                  {daily.uv_index_max?.[selectedDayIdx] ?? 0} ({getUvIndexCategory(daily.uv_index_max?.[selectedDayIdx] ?? 0).label})
                </p>
                <p className="text-[10px] text-slate-500 mt-0.5">Peak Sunlight</p>
              </div>
            </div>

            {/* Solar Cycle Times */}
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2 text-slate-300 font-bold">
                <Sunrise className="w-4 h-4 text-amber-400" />
                <span>SUNRISE: {daily.sunrise?.[selectedDayIdx] ? formatTimeOnly(daily.sunrise[selectedDayIdx]) : '--:--'}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300 font-bold">
                <Sunset className="w-4 h-4 text-amber-500" />
                <span>SUNSET: {daily.sunset?.[selectedDayIdx] ? formatTimeOnly(daily.sunset[selectedDayIdx]) : '--:--'}</span>
              </div>
            </div>

            <button
              onClick={() => setSelectedDayIdx(null)}
              className="w-full py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black rounded-xl transition-colors text-xs font-mono uppercase tracking-wider"
            >
              CLOSE_DETAILS
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

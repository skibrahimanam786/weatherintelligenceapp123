import React, { useState } from 'react';
import { OpenMeteoForecastResponse, TemperatureUnit } from '../types/weather';
import { getWeatherCondition, formatTempWithUnit, formatHour } from '../utils/weatherUtils';
import { 
  Clock, Thermometer, CloudRain, Wind, Sun, Droplets,
  SunMedium, Moon, CloudSun, CloudMoon, Cloud, CloudFog, CloudDrizzle, 
  CloudRainWind, Snowflake, CloudLightning, CloudHail
} from 'lucide-react';

interface HourlyForecastProps {
  weather: OpenMeteoForecastResponse;
  unit: TemperatureUnit;
}

type MetricView = 'temperature' | 'precipitation' | 'wind' | 'uv' | 'humidity';

export const HourlyForecast: React.FC<HourlyForecastProps> = ({ weather, unit }) => {
  const [activeMetric, setActiveMetric] = useState<MetricView>('temperature');

  const hourly = weather.hourly;
  if (!hourly || !hourly.time || hourly.time.length === 0) return null;

  // Slice next 24 hourly steps starting from current time or index 0
  const nowIso = new Date().toISOString().slice(0, 13);
  let startIndex = hourly.time.findIndex(t => t.startsWith(nowIso));
  if (startIndex === -1) startIndex = 0;
  
  const next24Hours = hourly.time.slice(startIndex, startIndex + 24).map((time, idx) => {
    const actualIdx = startIndex + idx;
    return {
      time,
      temp: hourly.temperature_2m?.[actualIdx] ?? 0,
      apparentTemp: hourly.apparent_temperature?.[actualIdx] ?? 0,
      precipProb: hourly.precipitation_probability?.[actualIdx] ?? 0,
      precipMm: hourly.precipitation?.[actualIdx] ?? 0,
      weatherCode: hourly.weather_code?.[actualIdx] ?? 0,
      windSpeed: hourly.wind_speed_10m?.[actualIdx] ?? 0,
      uvIndex: hourly.uv_index?.[actualIdx] ?? 0,
      humidity: hourly.relative_humidity_2m?.[actualIdx] ?? 0,
      isDay: 1 // default
    };
  });

  const renderIcon = (code: number, isDay: number) => {
    const condition = getWeatherCondition(code, isDay);
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
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4" id="hourly-forecast-card">
      
      {/* Header & Metric Selector Pills */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
        <div>
          <h3 className="text-xs font-mono uppercase tracking-[0.25em] text-cyan-400 flex items-center gap-2">
            <Clock className="w-4 h-4 text-cyan-400" />
            24_HOUR_TIMELINE_PROJECTION
          </h3>
          <p className="text-sm font-light italic text-slate-300 mt-0.5">
            Hourly meteorological sequence and atmospheric shifts.
          </p>
        </div>

        {/* Metric Selector Buttons */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 overflow-x-auto font-mono text-xs">
          <button
            onClick={() => setActiveMetric('temperature')}
            id="hourly-tab-temp"
            className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeMetric === 'temperature'
                ? 'bg-cyan-500 text-slate-950 font-black shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Thermometer className="w-3.5 h-3.5" />
            <span>TEMP</span>
          </button>

          <button
            onClick={() => setActiveMetric('precipitation')}
            id="hourly-tab-rain"
            className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeMetric === 'precipitation'
                ? 'bg-cyan-500 text-slate-950 font-black shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <CloudRain className="w-3.5 h-3.5" />
            <span>RAIN_%</span>
          </button>

          <button
            onClick={() => setActiveMetric('wind')}
            id="hourly-tab-wind"
            className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeMetric === 'wind'
                ? 'bg-cyan-500 text-slate-950 font-black shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Wind className="w-3.5 h-3.5" />
            <span>WIND</span>
          </button>

          <button
            onClick={() => setActiveMetric('uv')}
            id="hourly-tab-uv"
            className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeMetric === 'uv'
                ? 'bg-cyan-500 text-slate-950 font-black shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sun className="w-3.5 h-3.5" />
            <span>UV</span>
          </button>

          <button
            onClick={() => setActiveMetric('humidity')}
            id="hourly-tab-humidity"
            className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeMetric === 'humidity'
                ? 'bg-cyan-500 text-slate-950 font-black shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Droplets className="w-3.5 h-3.5" />
            <span>HUMIDITY</span>
          </button>
        </div>
      </div>

      {/* Horizontal Scrollable Row */}
      <div className="flex gap-3 overflow-x-auto pb-2 pt-1 scrollbar-thin scrollbar-thumb-slate-700">
        {next24Hours.map((item, idx) => {
          const isNow = idx === 0;
          return (
            <div
              key={`hour-${item.time}`}
              className={`flex-none w-28 p-3.5 rounded-xl border transition-all flex flex-col items-center justify-between text-center ${
                isNow
                  ? 'bg-cyan-500/10 border-cyan-500/60 text-slate-100 shadow-md shadow-cyan-500/10'
                  : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-800/60 text-slate-300'
              }`}
            >
              {/* Time Label */}
              <span className={`text-xs font-mono font-bold uppercase tracking-wider ${isNow ? 'text-cyan-400' : 'text-slate-400'}`}>
                {isNow ? 'NOW' : formatHour(item.time)}
              </span>

              {/* Icon */}
              <div className="my-2">
                {renderIcon(item.weatherCode, item.isDay)}
              </div>

              {/* Main Display Metric Value */}
              <div className="my-1">
                {activeMetric === 'temperature' && (
                  <p className="text-base font-black text-slate-100 font-mono">
                    {formatTempWithUnit(item.temp, unit)}
                  </p>
                )}

                {activeMetric === 'precipitation' && (
                  <div>
                    <p className="text-sm font-black text-cyan-400 font-mono">
                      {item.precipProb}%
                    </p>
                    {item.precipMm > 0 && (
                      <p className="text-[10px] font-mono text-cyan-300">{item.precipMm} mm</p>
                    )}
                  </div>
                )}

                {activeMetric === 'wind' && (
                  <p className="text-sm font-black text-teal-400 font-mono">
                    {Math.round(item.windSpeed)} <span className="text-[10px] font-normal">km/h</span>
                  </p>
                )}

                {activeMetric === 'uv' && (
                  <p className="text-sm font-black text-amber-400 font-mono">
                    {item.uvIndex} <span className="text-[10px] font-normal">UV</span>
                  </p>
                )}

                {activeMetric === 'humidity' && (
                  <p className="text-sm font-black text-indigo-400 font-mono">
                    {item.humidity}%
                  </p>
                )}
              </div>

              {/* Rain Probability Badge */}
              {item.precipProb >= 30 ? (
                <span className="mt-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center gap-1">
                  <CloudRain className="w-2.5 h-2.5" />
                  {item.precipProb}%
                </span>
              ) : (
                <span className="text-[10px] text-slate-500 mt-1 font-mono uppercase tracking-wider">
                  {getWeatherCondition(item.weatherCode).label.slice(0, 10)}
                </span>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
};

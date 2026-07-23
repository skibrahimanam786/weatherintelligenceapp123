import React, { useState } from 'react';
import { OpenMeteoForecastResponse, TemperatureUnit } from '../types/weather';
import { convertTemperature, formatHour, formatDayName } from '../utils/weatherUtils';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  AreaChart, Area, CartesianGrid, Legend, LineChart, Line 
} from 'recharts';
import { LineChart as ChartIcon, Thermometer, CloudRain, Wind, Sun, Calendar } from 'lucide-react';

interface WeatherChartsProps {
  weather: OpenMeteoForecastResponse;
  unit: TemperatureUnit;
}

type ChartTab = 'temperature' | 'precipitation' | 'wind' | 'uv' | 'dailyRange';

export const WeatherCharts: React.FC<WeatherChartsProps> = ({ weather, unit }) => {
  const [activeTab, setActiveTab] = useState<ChartTab>('temperature');

  const hourly = weather.hourly;
  const daily = weather.daily;

  if (!hourly || !hourly.time) return null;

  // Prepare 24-hour chart dataset
  const nowIso = new Date().toISOString().slice(0, 13);
  let startIndex = hourly.time.findIndex(t => t.startsWith(nowIso));
  if (startIndex === -1) startIndex = 0;

  const hourlyData = hourly.time.slice(startIndex, startIndex + 24).map((time, idx) => {
    const actualIdx = startIndex + idx;
    const tempC = hourly.temperature_2m?.[actualIdx] ?? 0;
    const apparentC = hourly.apparent_temperature?.[actualIdx] ?? 0;

    return {
      timeLabel: formatHour(time),
      temp: convertTemperature(tempC, unit),
      apparentTemp: convertTemperature(apparentC, unit),
      precipProb: hourly.precipitation_probability?.[actualIdx] ?? 0,
      precipMm: hourly.precipitation?.[actualIdx] ?? 0,
      windSpeed: Math.round(hourly.wind_speed_10m?.[actualIdx] ?? 0),
      uvIndex: hourly.uv_index?.[actualIdx] ?? 0,
      humidity: hourly.relative_humidity_2m?.[actualIdx] ?? 0
    };
  });

  // Prepare 7-day chart dataset
  const dailyData = (daily?.time || []).map((time, idx) => ({
    dayLabel: formatDayName(time),
    minTemp: convertTemperature(daily?.temperature_2m_min?.[idx] ?? 0, unit),
    maxTemp: convertTemperature(daily?.temperature_2m_max?.[idx] ?? 0, unit),
    rainSum: daily?.precipitation_sum?.[idx] ?? 0,
    uvMax: daily?.uv_index_max?.[idx] ?? 0,
    windMax: Math.round(daily?.wind_speed_10m_max?.[idx] ?? 0)
  }));

  const unitSymbol = unit === 'fahrenheit' ? '°F' : '°C';

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5" id="weather-charts-card">
      
      {/* Header & Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
        <div>
          <h3 className="text-xs font-mono uppercase tracking-[0.25em] text-cyan-400 flex items-center gap-2">
            <ChartIcon className="w-4 h-4 text-cyan-400" />
            ANALYTICAL_GRAPH_MODELS
          </h3>
          <p className="text-sm font-light italic text-slate-300 mt-0.5">
            Multi-variable meteorological trend projection and predictive curves.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 overflow-x-auto font-mono text-xs">
          <button
            onClick={() => setActiveTab('temperature')}
            id="chart-tab-temp"
            className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'temperature'
                ? 'bg-cyan-500 text-slate-950 font-black shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Thermometer className="w-3.5 h-3.5" />
            <span>24H_TEMP</span>
          </button>

          <button
            onClick={() => setActiveTab('precipitation')}
            id="chart-tab-rain"
            className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'precipitation'
                ? 'bg-cyan-500 text-slate-950 font-black shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <CloudRain className="w-3.5 h-3.5" />
            <span>PRECIP</span>
          </button>

          <button
            onClick={() => setActiveTab('wind')}
            id="chart-tab-wind"
            className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'wind'
                ? 'bg-cyan-500 text-slate-950 font-black shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Wind className="w-3.5 h-3.5" />
            <span>WIND</span>
          </button>

          <button
            onClick={() => setActiveTab('uv')}
            id="chart-tab-uv"
            className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'uv'
                ? 'bg-cyan-500 text-slate-950 font-black shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sun className="w-3.5 h-3.5" />
            <span>UV_HUMID</span>
          </button>

          <button
            onClick={() => setActiveTab('dailyRange')}
            id="chart-tab-daily"
            className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'dailyRange'
                ? 'bg-cyan-500 text-slate-950 font-black shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>7DAY_RANGE</span>
          </button>
        </div>
      </div>

      {/* Chart Canvas Area */}
      <div className="w-full h-72 sm:h-80 pt-2">
        <ResponsiveContainer width="100%" height="100%">
          
          {/* TAB 1: 24h Temperature & Feels Like Area Chart */}
          {activeTab === 'temperature' && (
            <AreaChart data={hourlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#38bdf8" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="apparentGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
              <XAxis dataKey="timeLabel" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} unit={unitSymbol} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '1rem', color: '#f8fafc' }}
                formatter={(val: number) => [`${val}${unitSymbol}`, '']}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Area type="monotone" dataKey="temp" name={`Temperature (${unitSymbol})`} stroke="#38bdf8" strokeWidth={3} fillOpacity={1} fill="url(#tempGradient)" />
              <Area type="monotone" dataKey="apparentTemp" name={`Feels Like (${unitSymbol})`} stroke="#f59e0b" strokeWidth={2} strokeDasharray="4 4" fillOpacity={1} fill="url(#apparentGradient)" />
            </AreaChart>
          )}

          {/* TAB 2: Precipitation Probability & Volume Bar Chart */}
          {activeTab === 'precipitation' && (
            <BarChart data={hourlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
              <XAxis dataKey="timeLabel" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis yAxisId="left" stroke="#3b82f6" fontSize={11} tickLine={false} unit="%" domain={[0, 100]} />
              <YAxis yAxisId="right" orientation="right" stroke="#60a5fa" fontSize={11} tickLine={false} unit="mm" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '1rem', color: '#f8fafc' }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Bar yAxisId="left" dataKey="precipProb" name="Rain Chance (%)" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              <Bar yAxisId="right" dataKey="precipMm" name="Volume (mm)" fill="#93c5fd" radius={[6, 6, 0, 0]} />
            </BarChart>
          )}

          {/* TAB 3: Wind Speed Area Chart */}
          {activeTab === 'wind' && (
            <AreaChart data={hourlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="windGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#14b8a6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
              <XAxis dataKey="timeLabel" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} unit=" km/h" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '1rem', color: '#f8fafc' }}
                formatter={(val: number) => [`${val} km/h`, 'Wind Speed']}
              />
              <Area type="monotone" dataKey="windSpeed" name="Wind Speed (km/h)" stroke="#14b8a6" strokeWidth={3} fillOpacity={1} fill="url(#windGradient)" />
            </AreaChart>
          )}

          {/* TAB 4: UV Index & Humidity Line Chart */}
          {activeTab === 'uv' && (
            <LineChart data={hourlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
              <XAxis dataKey="timeLabel" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis yAxisId="left" stroke="#f59e0b" fontSize={11} tickLine={false} domain={[0, 12]} />
              <YAxis yAxisId="right" orientation="right" stroke="#818cf8" fontSize={11} tickLine={false} unit="%" domain={[0, 100]} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '1rem', color: '#f8fafc' }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Line yAxisId="left" type="monotone" dataKey="uvIndex" name="UV Index" stroke="#f59e0b" strokeWidth={3} dot={false} />
              <Line yAxisId="right" type="monotone" dataKey="humidity" name="Humidity (%)" stroke="#818cf8" strokeWidth={2} dot={false} />
            </LineChart>
          )}

          {/* TAB 5: 7-Day Min vs Max Temp Bar Chart */}
          {activeTab === 'dailyRange' && (
            <BarChart data={dailyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
              <XAxis dataKey="dayLabel" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} unit={unitSymbol} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '1rem', color: '#f8fafc' }}
                formatter={(val: number) => [`${val}${unitSymbol}`, '']}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Bar dataKey="minTemp" name={`Min Temp (${unitSymbol})`} fill="#38bdf8" radius={[6, 6, 0, 0]} />
              <Bar dataKey="maxTemp" name={`Max Temp (${unitSymbol})`} fill="#f97316" radius={[6, 6, 0, 0]} />
            </BarChart>
          )}

        </ResponsiveContainer>
      </div>

    </div>
  );
};

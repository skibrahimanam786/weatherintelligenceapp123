import React, { useState, useEffect } from 'react';
import { OpenMeteoForecastResponse, GeocodingResult, AiWeatherInsight } from '../types/weather';
import { generateRuleBasedRecommendations } from '../utils/weatherUtils';
import { fetchAiWeatherInsights } from '../services/weatherApi';
import { 
  Sparkles, Shirt, Footprints, Bike, Waves, Camera, Utensils, 
  ShieldAlert, CheckCircle2, AlertTriangle, RefreshCw, Bot,
  HeartHandshake, Compass, Umbrella
} from 'lucide-react';

interface SmartRecommendationsProps {
  weather: OpenMeteoForecastResponse;
  location: GeocodingResult;
}

export const SmartRecommendations: React.FC<SmartRecommendationsProps> = ({ weather, location }) => {
  const [aiInsight, setAiInsight] = useState<AiWeatherInsight | null>(null);
  const [loadingAi, setLoadingAi] = useState<boolean>(false);
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  const current = weather.current;
  const daily = weather.daily;

  if (!current) return null;

  const ruleRecs = generateRuleBasedRecommendations(
    current.temperature_2m,
    current.apparent_temperature,
    current.relative_humidity_2m,
    current.wind_speed_10m,
    weather.hourly?.precipitation_probability?.[0] ?? 0,
    current.weather_code,
    daily?.uv_index_max?.[0] ?? 0
  );

  // Trigger Gemini AI Intelligence fetch
  const handleGenerateAiBrief = async () => {
    setLoadingAi(true);
    try {
      const payload = {
        city: location.name,
        country: location.country,
        current: {
          temp: current.temperature_2m,
          apparentTemp: current.apparent_temperature,
          conditionLabel: weather.current?.weather_code !== undefined ? weather.current.weather_code : 'Clear',
          humidity: current.relative_humidity_2m,
          windSpeed: current.wind_speed_10m,
          windGusts: current.wind_gusts_10m,
          uvIndex: daily?.uv_index_max?.[0] ?? 0,
          precipProb: weather.hourly?.precipitation_probability?.[0] ?? 0
        },
        dailySummary: (daily?.time || []).slice(0, 5).map((t, i) => ({
          date: t,
          maxTemp: daily?.temperature_2m_max[i],
          minTemp: daily?.temperature_2m_min[i],
          precipProb: daily?.precipitation_probability_max?.[i]
        }))
      };

      const res = await fetchAiWeatherInsights(payload);
      if (res && res.summary) {
        setAiInsight(res);
      }
    } catch (err) {
      console.warn('Could not fetch AI weather brief:', err);
    } finally {
      setLoadingAi(false);
    }
  };

  // Auto load AI brief on city load if desired or on user request
  useEffect(() => {
    setAiInsight(null);
  }, [location.id, location.name]);

  const toggleCheck = (item: string) => {
    setCheckedItems(prev => ({ ...prev, [item]: !prev[item] }));
  };

  const getActivityIcon = (iconName: string) => {
    switch (iconName) {
      case 'Footprints': return <Footprints className="w-5 h-5 text-sky-400 shrink-0" />;
      case 'Bike': return <Bike className="w-5 h-5 text-teal-400 shrink-0" />;
      case 'Waves': return <Waves className="w-5 h-5 text-blue-400 shrink-0" />;
      case 'Sparkles': return <Sparkles className="w-5 h-5 text-amber-400 shrink-0" />;
      case 'Utensils': return <Utensils className="w-5 h-5 text-emerald-400 shrink-0" />;
      case 'Camera': return <Camera className="w-5 h-5 text-purple-400 shrink-0" />;
      default: return <Compass className="w-5 h-5 text-sky-400 shrink-0" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Ideal':
        return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';
      case 'Good':
        return 'bg-sky-500/15 text-sky-300 border-sky-500/30';
      case 'Moderate':
        return 'bg-amber-500/15 text-amber-300 border-amber-500/30';
      case 'Poor':
        return 'bg-orange-500/15 text-orange-300 border-orange-500/30';
      default:
        return 'bg-red-500/15 text-red-300 border-red-500/30';
    }
  };

  return (
    <div className="space-y-6" id="smart-recommendations-section">
      
      {/* 1. Gemini AI Weather Advisor Section */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 border border-cyan-500/40 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 font-mono text-xs font-bold shrink-0">
              AI
            </div>
            <div>
              <h3 className="text-xs font-mono uppercase tracking-[0.25em] text-cyan-400 flex items-center gap-2">
                <span>GEMINI_SYNTHESIS_BRIEF</span>
                <span className="text-[10px] font-mono bg-cyan-500/10 text-cyan-300 px-2 py-0.5 rounded border border-cyan-500/30">
                  GEMINI 3.6 FLASH
                </span>
              </h3>
              <p className="text-sm font-light italic text-slate-300 mt-0.5">
                Personalized atmospheric synthesis, clothing protocol, and outdoor safety brief for {location.name}.
              </p>
            </div>
          </div>

          <button
            onClick={handleGenerateAiBrief}
            disabled={loadingAi}
            id="generate-ai-brief-btn"
            className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs font-mono uppercase tracking-wider transition-all flex items-center justify-center gap-2 disabled:opacity-50 shrink-0 shadow-md"
          >
            {loadingAi ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>ANALYZING_ATMOSPHERE...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>{aiInsight ? 'REFRESH_AI_BRIEF' : 'GENERATE_AI_BRIEF'}</span>
              </>
            )}
          </button>
        </div>

        {/* AI Insight Display */}
        {aiInsight ? (
          <div className="space-y-4 text-slate-200 text-sm animate-in fade-in duration-300">
            <div className="bg-cyan-500/10 border-l-2 border-cyan-500 p-4 rounded-r-xl font-medium leading-relaxed">
              <p className="font-mono text-xs uppercase tracking-wider text-cyan-400 font-bold mb-1">
                EXECUTIVE_SUMMARY // {aiInsight.summary}
              </p>
              <p className="text-sm text-slate-200 font-light italic">{aiInsight.executiveBrief}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Wardrobe AI */}
              <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-2">
                <h4 className="font-mono text-xs uppercase tracking-wider text-cyan-400 font-bold flex items-center gap-2">
                  <Shirt className="w-4 h-4" /> APPAREL_PROTOCOL
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-300 font-mono">
                  {aiInsight.outfitRecommendation.map((item, idx) => (
                    <li key={`ai-outfit-${idx}`} className="flex items-start gap-2">
                      <span className="text-cyan-400 font-bold">&gt;</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Activity Planner AI */}
              <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-2">
                <h4 className="font-mono text-xs uppercase tracking-wider text-emerald-400 font-bold flex items-center gap-2">
                  <HeartHandshake className="w-4 h-4" /> ACTIVITY_STRATEGY
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-300 font-mono">
                  {aiInsight.activityAdvice.map((item, idx) => (
                    <li key={`ai-act-${idx}`} className="flex items-start gap-2">
                      <span className="text-emerald-400 font-bold">&gt;</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>

            {/* Health & Travel Warnings */}
            <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-xl text-xs font-mono text-amber-200 space-y-2">
              <h4 className="font-bold uppercase tracking-wider text-amber-300 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4" /> HEALTH_AND_SAFETY_ADVISORY
              </h4>
              <div className="space-y-1">
                {aiInsight.healthAndSafety.map((item, idx) => (
                  <p key={`ai-health-${idx}`}>• {item}</p>
                ))}
              </div>
              {aiInsight.travelWarning && (
                <p className="font-bold text-red-300 pt-1 border-t border-amber-500/20 uppercase">
                  ⚠️ TRAVEL_WARNING: {aiInsight.travelWarning}
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-center text-xs font-mono text-slate-400">
            CLICK <strong className="text-cyan-400">"GENERATE_AI_BRIEF"</strong> ABOVE FOR REAL-TIME GEMINI ATMOSPHERIC COMMENTARY AND OUTFIT ADVISORY.
          </div>
        )}
      </div>

      {/* 2. Weather Hazard Alert Radar */}
      {ruleRecs.alerts.length > 0 && (
        <div className="space-y-2">
          {ruleRecs.alerts.map((alertText, idx) => (
            <div 
              key={`rule-alert-${idx}`}
              className="p-4 rounded-xl bg-red-500/15 border border-red-500/40 text-red-200 text-xs font-mono font-bold flex items-center gap-3 shadow-lg"
            >
              <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
              <span className="uppercase">HAZARD_ALERT: {alertText}</span>
            </div>
          ))}
        </div>
      )}

      {/* 3. Clothing & Gear Checklist */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4 lg:col-span-1">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-xs font-mono uppercase tracking-[0.25em] text-cyan-400 flex items-center gap-2">
              <Shirt className="w-4 h-4 text-cyan-400" />
              WARDROBE_PROTOCOL
            </h3>
            <p className="text-sm font-light italic text-slate-300 mt-0.5">
              Interactive gear checklist based on current conditions.
            </p>
          </div>

          <div className="space-y-2">
            <p className="text-[10px] font-mono uppercase text-slate-400 tracking-wider">
              RECOMMENDED_APPAREL
            </p>
            {ruleRecs.clothing.map((item) => (
              <label
                key={item}
                onClick={() => toggleCheck(item)}
                className={`p-3 rounded-xl border transition-all flex items-center gap-3 cursor-pointer text-xs font-mono font-bold ${
                  checkedItems[item]
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300 line-through opacity-70'
                    : 'bg-slate-950/60 border-slate-800 text-slate-200 hover:bg-slate-800'
                }`}
              >
                <CheckCircle2 className={`w-4 h-4 shrink-0 ${checkedItems[item] ? 'text-emerald-400' : 'text-slate-600'}`} />
                <span>{item}</span>
              </label>
            ))}

            <p className="text-[10px] font-mono uppercase text-slate-400 tracking-wider pt-2">
              ESSENTIAL_GEAR
            </p>
            {ruleRecs.gear.map((gear) => (
              <label
                key={gear}
                onClick={() => toggleCheck(gear)}
                className={`p-3 rounded-xl border transition-all flex items-center gap-3 cursor-pointer text-xs font-mono font-bold ${
                  checkedItems[gear]
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300 line-through opacity-70'
                    : 'bg-slate-950/60 border-slate-800 text-slate-200 hover:bg-slate-800'
                }`}
              >
                <Umbrella className={`w-4 h-4 shrink-0 ${checkedItems[gear] ? 'text-emerald-400' : 'text-cyan-400'}`} />
                <span>{gear}</span>
              </label>
            ))}
          </div>
        </div>

        {/* 4. Outdoor Activity Suitability Scores */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4 lg:col-span-2">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-xs font-mono uppercase tracking-[0.25em] text-cyan-400 flex items-center gap-2">
              <Compass className="w-4 h-4 text-cyan-400" />
              ACTIVITY_SUITABILITY_INDEX
            </h3>
            <p className="text-sm font-light italic text-slate-300 mt-0.5">
              Calculated suitability matrix based on thermal and wind limits.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {ruleRecs.activities.map((act) => (
              <div
                key={act.activity}
                className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 flex flex-col justify-between space-y-2 hover:border-cyan-500/40 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    {getActivityIcon(act.icon)}
                    <span className="font-mono text-xs uppercase font-bold text-slate-100">{act.activity}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${getStatusBadge(act.status)}`}>
                    {act.status} ({act.score}/100)
                  </span>
                </div>

                {/* Score Bar */}
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-500 ${
                      act.score >= 80 ? 'bg-cyan-400' : act.score >= 50 ? 'bg-amber-400' : 'bg-red-400'
                    }`}
                    style={{ width: `${act.score}%` }}
                  />
                </div>

                <p className="text-[11px] text-slate-400 leading-normal font-light">
                  {act.reason}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};

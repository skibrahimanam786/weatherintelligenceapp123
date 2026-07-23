import { TemperatureUnit, WeatherConditionInfo, SmartRecommendation, ActivityScore } from '../types/weather';

/**
 * WMO Weather interpretation codes (WW)
 * Code 0: Clear sky
 * Code 1, 2, 3: Mainly clear, partly cloudy, and overcast
 * Code 45, 48: Fog and depositing rime fog
 * Code 51, 53, 55: Drizzle: Light, moderate, and dense intensity
 * Code 56, 57: Freezing Drizzle: Light and dense intensity
 * Code 61, 63, 65: Rain: Slight, moderate and heavy intensity
 * Code 66, 67: Freezing Rain: Light and heavy intensity
 * Code 71, 73, 75: Snow fall: Slight, moderate, and heavy intensity
 * Code 77: Snow grains
 * Code 80, 81, 82: Rain showers: Slight, moderate, and violent
 * Code 85, 86: Snow showers slight and heavy
 * Code 95: Thunderstorm: Slight or moderate
 * Code 96, 99: Thunderstorm with slight and heavy hail
 */
export function getWeatherCondition(code: number, isDay: number = 1): WeatherConditionInfo {
  switch (code) {
    case 0:
      return {
        code,
        label: 'Clear Sky',
        description: isDay ? 'Sunny and clear skies' : 'Clear starry night',
        iconName: isDay ? 'Sun' : 'Moon',
        bgGradient: isDay 
          ? 'from-sky-400 via-blue-500 to-indigo-600' 
          : 'from-slate-900 via-indigo-950 to-slate-900',
        cardBg: 'bg-amber-500/10 text-amber-900 dark:text-amber-100 border-amber-500/20',
        textColor: 'text-sky-50',
        badgeBg: 'bg-amber-400/20 text-amber-700 dark:text-amber-300',
        severity: 'normal'
      };
    case 1:
      return {
        code,
        label: 'Mainly Clear',
        description: 'Mostly clear with few passing clouds',
        iconName: isDay ? 'SunMedium' : 'MoonStar',
        bgGradient: isDay 
          ? 'from-blue-400 via-indigo-500 to-sky-600' 
          : 'from-slate-900 via-slate-800 to-indigo-950',
        cardBg: 'bg-blue-500/10 text-blue-900 dark:text-blue-100 border-blue-500/20',
        textColor: 'text-blue-50',
        badgeBg: 'bg-blue-400/20 text-blue-700 dark:text-blue-300',
        severity: 'normal'
      };
    case 2:
      return {
        code,
        label: 'Partly Cloudy',
        description: 'Scattered clouds throughout the day',
        iconName: isDay ? 'CloudSun' : 'CloudMoon',
        bgGradient: isDay 
          ? 'from-sky-500 via-slate-500 to-blue-700' 
          : 'from-slate-900 via-slate-800 to-slate-900',
        cardBg: 'bg-sky-500/10 text-sky-900 dark:text-sky-100 border-sky-500/20',
        textColor: 'text-sky-50',
        badgeBg: 'bg-sky-400/20 text-sky-700 dark:text-sky-300',
        severity: 'normal'
      };
    case 3:
      return {
        code,
        label: 'Overcast',
        description: 'Dense cloud cover blocking the sun',
        iconName: 'Cloud',
        bgGradient: 'from-slate-600 via-slate-700 to-slate-800',
        cardBg: 'bg-slate-500/10 text-slate-900 dark:text-slate-100 border-slate-500/20',
        textColor: 'text-slate-100',
        badgeBg: 'bg-slate-400/20 text-slate-700 dark:text-slate-300',
        severity: 'normal'
      };
    case 45:
    case 48:
      return {
        code,
        label: code === 48 ? 'Depositing Rime Fog' : 'Foggy',
        description: 'Reduced visibility due to fog and moisture',
        iconName: 'CloudFog',
        bgGradient: 'from-zinc-500 via-stone-600 to-slate-700',
        cardBg: 'bg-stone-500/10 text-stone-900 dark:text-stone-100 border-stone-500/20',
        textColor: 'text-stone-100',
        badgeBg: 'bg-stone-400/20 text-stone-700 dark:text-stone-300',
        severity: 'notice'
      };
    case 51:
    case 53:
    case 55:
      return {
        code,
        label: code === 51 ? 'Light Drizzle' : code === 53 ? 'Moderate Drizzle' : 'Dense Drizzle',
        description: 'Continuous fine rain drizzle',
        iconName: 'CloudDrizzle',
        bgGradient: 'from-teal-600 via-cyan-700 to-slate-800',
        cardBg: 'bg-teal-500/10 text-teal-900 dark:text-teal-100 border-teal-500/20',
        textColor: 'text-teal-50',
        badgeBg: 'bg-teal-400/20 text-teal-700 dark:text-teal-300',
        severity: 'notice'
      };
    case 56:
    case 57:
      return {
        code,
        label: 'Freezing Drizzle',
        description: 'Freezing drizzle causing icy surface conditions',
        iconName: 'CloudSnow',
        bgGradient: 'from-cyan-700 via-sky-800 to-slate-900',
        cardBg: 'bg-cyan-500/10 text-cyan-900 dark:text-cyan-100 border-cyan-500/20',
        textColor: 'text-cyan-50',
        badgeBg: 'bg-cyan-400/20 text-cyan-700 dark:text-cyan-300',
        severity: 'warning'
      };
    case 61:
    case 63:
    case 65:
      return {
        code,
        label: code === 61 ? 'Slight Rain' : code === 63 ? 'Moderate Rain' : 'Heavy Rain',
        description: code === 65 ? 'Heavy rainfall with high precipitation' : 'Steady rainfall expected',
        iconName: 'CloudRain',
        bgGradient: 'from-blue-600 via-indigo-700 to-slate-800',
        cardBg: 'bg-blue-500/10 text-blue-900 dark:text-blue-100 border-blue-500/20',
        textColor: 'text-blue-50',
        badgeBg: 'bg-blue-400/20 text-blue-700 dark:text-blue-300',
        severity: code === 65 ? 'warning' : 'notice'
      };
    case 66:
    case 67:
      return {
        code,
        label: 'Freezing Rain',
        description: 'Rain freezing instantly on cold surfaces',
        iconName: 'CloudRainWind',
        bgGradient: 'from-cyan-800 via-blue-900 to-slate-900',
        cardBg: 'bg-sky-500/10 text-sky-900 dark:text-sky-100 border-sky-500/20',
        textColor: 'text-sky-50',
        badgeBg: 'bg-sky-400/20 text-sky-700 dark:text-sky-300',
        severity: 'warning'
      };
    case 71:
    case 73:
    case 75:
    case 77:
      return {
        code,
        label: code === 71 ? 'Slight Snow' : code === 73 ? 'Moderate Snow' : 'Heavy Snowfall',
        description: 'Snowfall and icy atmospheric conditions',
        iconName: 'Snowflake',
        bgGradient: 'from-sky-700 via-indigo-800 to-slate-900',
        cardBg: 'bg-sky-500/10 text-sky-900 dark:text-sky-100 border-sky-500/20',
        textColor: 'text-sky-50',
        badgeBg: 'bg-sky-400/20 text-sky-700 dark:text-sky-300',
        severity: code === 75 ? 'warning' : 'notice'
      };
    case 80:
    case 81:
    case 82:
      return {
        code,
        label: code === 82 ? 'Violent Rain Showers' : 'Rain Showers',
        description: 'Intermittent localized rain showers',
        iconName: 'CloudRain',
        bgGradient: 'from-indigo-600 via-blue-700 to-slate-800',
        cardBg: 'bg-indigo-500/10 text-indigo-900 dark:text-indigo-100 border-indigo-500/20',
        textColor: 'text-indigo-50',
        badgeBg: 'bg-indigo-400/20 text-indigo-700 dark:text-indigo-300',
        severity: code === 82 ? 'warning' : 'notice'
      };
    case 85:
    case 86:
      return {
        code,
        label: 'Snow Showers',
        description: 'Passing snow flurries and accumulation',
        iconName: 'CloudSnow',
        bgGradient: 'from-blue-700 via-indigo-800 to-slate-900',
        cardBg: 'bg-blue-500/10 text-blue-900 dark:text-blue-100 border-blue-500/20',
        textColor: 'text-blue-50',
        badgeBg: 'bg-blue-400/20 text-blue-700 dark:text-blue-300',
        severity: 'notice'
      };
    case 95:
      return {
        code,
        label: 'Thunderstorm',
        description: 'Lightning activity and electrical thunder storms',
        iconName: 'CloudLightning',
        bgGradient: 'from-purple-800 via-slate-900 to-indigo-950',
        cardBg: 'bg-purple-500/10 text-purple-900 dark:text-purple-100 border-purple-500/20',
        textColor: 'text-purple-50',
        badgeBg: 'bg-purple-400/20 text-purple-700 dark:text-purple-300',
        severity: 'severe'
      };
    case 96:
    case 99:
      return {
        code,
        label: 'Thunderstorm with Hail',
        description: 'Severe thunderstorm accompanied by damaging hail',
        iconName: 'CloudHail',
        bgGradient: 'from-red-900 via-purple-950 to-slate-900',
        cardBg: 'bg-red-500/10 text-red-900 dark:text-red-100 border-red-500/20',
        textColor: 'text-red-50',
        badgeBg: 'bg-red-400/20 text-red-700 dark:text-red-300',
        severity: 'severe'
      };
    default:
      return {
        code,
        label: 'Unknown Condition',
        description: 'Weather conditions variable',
        iconName: 'Cloud',
        bgGradient: 'from-slate-700 via-slate-800 to-slate-900',
        cardBg: 'bg-slate-500/10 text-slate-900 dark:text-slate-100 border-slate-500/20',
        textColor: 'text-slate-50',
        badgeBg: 'bg-slate-400/20 text-slate-700 dark:text-slate-300',
        severity: 'normal'
      };
  }
}

export function convertTemperature(celsius: number, unit: TemperatureUnit): number {
  if (unit === 'fahrenheit') {
    return Math.round((celsius * 9) / 5 + 32);
  }
  return Math.round(celsius);
}

export function formatTempWithUnit(celsius: number, unit: TemperatureUnit): string {
  const converted = convertTemperature(celsius, unit);
  return `${converted}°${unit === 'fahrenheit' ? 'F' : 'C'}`;
}

export function degreesToCompass(deg: number): string {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round((deg % 360) / 22.5) % 16;
  return directions[index];
}

export function getUvIndexCategory(uv: number): { label: string; color: string; badge: string; desc: string } {
  if (uv <= 2) {
    return { label: 'Low', color: 'text-emerald-500', badge: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30', desc: 'Minimal solar danger. Safe to be outdoors.' };
  } else if (uv <= 5) {
    return { label: 'Moderate', color: 'text-amber-500', badge: 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30', desc: 'Moderate risk. Wear sunglasses & apply SPF 30+.' };
  } else if (uv <= 7) {
    return { label: 'High', color: 'text-orange-500', badge: 'bg-orange-500/15 text-orange-700 dark:text-orange-300 border-orange-500/30', desc: 'High protection needed. Seek shade during peak midday hours.' };
  } else if (uv <= 10) {
    return { label: 'Very High', color: 'text-red-500', badge: 'bg-red-500/15 text-red-700 dark:text-red-300 border-red-500/30', desc: 'Very high hazard. Unprotected skin burns rapidly.' };
  } else {
    return { label: 'Extreme', color: 'text-purple-600', badge: 'bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-500/30', desc: 'Extreme radiation alert. Avoid outdoor exposure without coverage.' };
  }
}

export function generateRuleBasedRecommendations(
  tempC: number,
  apparentTempC: number,
  humidity: number,
  windSpeedKmh: number,
  precipProb: number,
  weatherCode: number,
  uvIndex: number
): SmartRecommendation {
  const clothing: string[] = [];
  const gear: string[] = [];
  const alerts: string[] = [];

  // Clothing logic
  if (tempC < 0) {
    clothing.push('Heavy insulated winter coat & thermals', 'Fleece-lined pants & woolen socks', 'Beanie, thermal gloves & neck gaiter');
  } else if (tempC < 10) {
    clothing.push('Warm coat or heavy jacket', 'Sweater or hoodie layering', 'Long trousers & closed shoes');
  } else if (tempC < 20) {
    clothing.push('Light jacket or cardigan', 'Long pants or jeans', 'Breathable cotton shirt');
  } else if (tempC < 28) {
    clothing.push('Light T-shirt & shorts/skirt', 'Breathable summer wear', 'Light comfortable footwear');
  } else {
    clothing.push('Ultra-light linen/breathable clothes', 'Loose fitting shorts/tops', 'Sun hat & ventilated footwear');
  }

  // Gear logic
  if (precipProb > 30 || [51, 53, 55, 61, 63, 65, 80, 81, 82].includes(weatherCode)) {
    gear.push('Compact waterproof umbrella', 'Water-resistant footwear or boots', 'Rain jacket or poncho');
  }
  if (uvIndex >= 3) {
    gear.push('UV-blocking sunglasses (UV400)', 'Broad spectrum SPF 30+ sunscreen', 'Wide-brimmed sun hat');
  }
  if (windSpeedKmh > 30) {
    gear.push('Windbreaker jacket', 'Eye protection against wind dust');
  }

  // Alerts logic
  if (tempC >= 33) {
    alerts.push('🔥 Extreme Heat Warning: Stay hydrated and limit peak afternoon sun exposure.');
  }
  if (apparentTempC <= -5) {
    alerts.push('❄️ Frostbite Risk: Keep skin covered and limit prolonged freezing exposure.');
  }
  if (windSpeedKmh >= 45) {
    alerts.push('💨 High Wind Gust Notice: Secure outdoor loose items and take care when driving.');
  }
  if (weatherCode >= 95) {
    alerts.push('⚡ Severe Thunderstorm Hazard: Stay indoors away from metallic objects and open trees.');
  }
  if (uvIndex >= 8) {
    alerts.push('☀️ Extreme UV Index: Skin can burn in under 15 minutes without protection.');
  }

  // Activities scores
  const isRaining = precipProb > 40 || [51, 53, 55, 61, 63, 65, 80, 81, 82, 95, 96, 99].includes(weatherCode);
  
  const activities: ActivityScore[] = [
    {
      activity: 'Running & Jogging',
      icon: 'Footprints',
      score: isRaining ? 25 : (tempC >= 10 && tempC <= 22 && windSpeedKmh < 25) ? 95 : 60,
      status: isRaining ? 'Poor' : (tempC >= 10 && tempC <= 22 && windSpeedKmh < 25) ? 'Ideal' : 'Moderate',
      reason: isRaining ? 'Precipitation lowers traction and comfort.' : (tempC >= 10 && tempC <= 22) ? 'Optimal temperature and clear conditions for cardio.' : 'Manage pace due to heat or cool winds.'
    },
    {
      activity: 'Cycling & Commuting',
      icon: 'Bike',
      score: (isRaining || windSpeedKmh > 35) ? 20 : (windSpeedKmh < 15 && tempC >= 12 && tempC <= 26) ? 90 : 65,
      status: (isRaining || windSpeedKmh > 35) ? 'Unfavorable' : (windSpeedKmh < 15 && tempC >= 12) ? 'Ideal' : 'Good',
      reason: windSpeedKmh > 35 ? 'Strong headwinds and crosswinds present safety hazard.' : isRaining ? 'Slippery roads and reduced visibility.' : 'Great riding weather with pleasant winds.'
    },
    {
      activity: 'Beach & Swimming',
      icon: 'Waves',
      score: (tempC >= 25 && !isRaining && uvIndex >= 4) ? 92 : (tempC < 20 || isRaining) ? 15 : 50,
      status: (tempC >= 25 && !isRaining && uvIndex >= 4) ? 'Ideal' : (tempC < 20 || isRaining) ? 'Unfavorable' : 'Moderate',
      reason: tempC >= 25 && !isRaining ? 'Warm temperatures perfect for beach activities.' : 'Too cool or wet for swimming comfortably.'
    },
    {
      activity: 'Stargazing & Astronomy',
      icon: 'Sparkles',
      score: (weatherCode <= 1 && !isRaining) ? 95 : (weatherCode === 2) ? 60 : 10,
      status: (weatherCode <= 1 && !isRaining) ? 'Ideal' : (weatherCode === 2) ? 'Moderate' : 'Unfavorable',
      reason: weatherCode <= 1 ? 'Clear cloudless skies provide excellent celestial visibility.' : 'Cloud cover restricts night sky observation.'
    },
    {
      activity: 'Outdoor Dining & Picnic',
      icon: 'Utensils',
      score: (tempC >= 18 && tempC <= 28 && !isRaining && windSpeedKmh < 20) ? 90 : 40,
      status: (tempC >= 18 && tempC <= 28 && !isRaining && windSpeedKmh < 20) ? 'Ideal' : 'Moderate',
      reason: !isRaining && tempC >= 18 && tempC <= 28 ? 'Pleasant breeze and comfortable outdoor ambiance.' : 'Weather is either too chilly, windy, or wet.'
    },
    {
      activity: 'Drone Flying & Photography',
      icon: 'Camera',
      score: (windSpeedKmh < 25 && !isRaining && weatherCode !== 45) ? 88 : 20,
      status: (windSpeedKmh < 25 && !isRaining && weatherCode !== 45) ? 'Ideal' : 'Unfavorable',
      reason: windSpeedKmh >= 25 ? 'High wind speeds threaten drone flight stability.' : isRaining ? 'Moisture can damage camera sensors.' : 'Stable atmosphere and good lighting.'
    }
  ];

  const uvCategory = getUvIndexCategory(uvIndex);
  
  const comfortIndex = humidity > 75 && tempC > 27 
    ? 'Muggy & Humid (High Discomfort)' 
    : humidity < 25 && tempC > 20 
    ? 'Dry Atmosphere (Stay Hydrated)' 
    : 'Comfortable Thermal Zone';

  return {
    clothing,
    gear: gear.length > 0 ? gear : ['Standard daily gear'],
    activities,
    alerts,
    uvAdvice: `UV Index is ${uvIndex} (${uvCategory.label}). ${uvCategory.desc}`,
    comfortIndex
  };
}

export function formatDayName(dateString: string): string {
  const date = new Date(dateString + 'T00:00:00');
  const today = new Date();
  
  if (date.toDateString() === today.toDateString()) {
    return 'Today';
  }
  
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);
  if (date.toDateString() === tomorrow.toDateString()) {
    return 'Tomorrow';
  }

  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

export function formatHour(timeString: string): string {
  const date = new Date(timeString);
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
}

export function formatTimeOnly(timeString: string): string {
  if (!timeString) return '--:--';
  const date = new Date(timeString);
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
}

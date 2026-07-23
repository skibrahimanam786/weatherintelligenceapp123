export interface GeocodingResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  elevation?: number;
  feature_code?: string;
  country_code?: string;
  admin1?: string;
  admin2?: string;
  admin3?: string;
  admin4?: string;
  timezone: string;
  population?: number;
  postcodes?: string[];
  country_id?: number;
  country: string;
}

export interface GeocodingResponse {
  results?: GeocodingResult[];
  generationtime_ms: number;
}

export interface OpenMeteoForecastResponse {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  current_units?: Record<string, string>;
  current?: {
    time: string;
    interval: number;
    temperature_2m: number;
    relative_humidity_2m: number;
    apparent_temperature: number;
    is_day: number;
    precipitation: number;
    rain: number;
    showers: number;
    snowfall: number;
    weather_code: number;
    cloud_cover: number;
    pressure_msl: number;
    surface_pressure: number;
    wind_speed_10m: number;
    wind_direction_10m: number;
    wind_gusts_10m: number;
  };
  hourly_units?: Record<string, string>;
  hourly?: {
    time: string[];
    temperature_2m: number[];
    relative_humidity_2m: number[];
    dew_point_2m: number[];
    apparent_temperature: number[];
    precipitation_probability: number[];
    precipitation: number[];
    weather_code: number[];
    pressure_msl: number[];
    cloud_cover: number[];
    visibility: number[];
    wind_speed_10m: number[];
    uv_index: number[];
  };
  daily_units?: Record<string, string>;
  daily?: {
    time: string[];
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    apparent_temperature_max: number[];
    apparent_temperature_min: number[];
    sunrise: string[];
    sunset: string[];
    uv_index_max: number[];
    precipitation_sum: number[];
    rain_sum: number[];
    showers_sum: number[];
    snowfall_sum: number[];
    precipitation_hours: number[];
    precipitation_probability_max: number[];
    wind_speed_10m_max: number[];
    wind_gusts_10m_max: number[];
    wind_direction_10m_dominant: number[];
  };
}

export type TemperatureUnit = 'celsius' | 'fahrenheit';
export type SpeedUnit = 'kmh' | 'mph' | 'ms';

export interface WeatherConditionInfo {
  code: number;
  label: string;
  description: string;
  iconName: string;
  bgGradient: string;
  cardBg: string;
  textColor: string;
  badgeBg: string;
  severity: 'normal' | 'notice' | 'warning' | 'severe';
}

export interface ActivityScore {
  activity: string;
  score: number; // 0 - 100
  status: 'Ideal' | 'Good' | 'Moderate' | 'Poor' | 'Unfavorable';
  reason: string;
  icon: string;
}

export interface SmartRecommendation {
  clothing: string[];
  gear: string[];
  activities: ActivityScore[];
  alerts: string[];
  uvAdvice: string;
  comfortIndex: string;
}

export interface AiWeatherInsight {
  summary: string;
  executiveBrief: string;
  outfitRecommendation: string[];
  activityAdvice: string[];
  healthAndSafety: string[];
  travelWarning?: string;
  generatedAt: string;
}

export interface SavedLocation {
  id: string; // unique key
  name: string;
  country: string;
  admin1?: string;
  latitude: number;
  longitude: number;
  timezone: string;
  addedAt: number;
}

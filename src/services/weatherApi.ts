import { GeocodingResponse, GeocodingResult, OpenMeteoForecastResponse } from '../types/weather';

const GEOCODING_BASE_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const FORECAST_BASE_URL = 'https://api.open-meteo.com/v1/forecast';

export async function searchCities(query: string): Promise<GeocodingResult[]> {
  const trimmed = query.trim();
  if (!trimmed || trimmed.length < 2) {
    return [];
  }

  const url = `${GEOCODING_BASE_URL}?name=${encodeURIComponent(trimmed)}&count=10&language=en&format=json`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);

  try {
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Geocoding server error: HTTP ${response.status}`);
    }

    const data: GeocodingResponse = await response.json();
    return data.results || [];
  } catch (error: unknown) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortName') {
      throw new Error('City search request timed out. Please check your network connection.');
    }
    console.error('Failed to search cities:', error);
    throw error;
  }
}

export async function fetchWeatherForecast(
  latitude: number,
  longitude: number,
  timezone: string = 'auto'
): Promise<OpenMeteoForecastResponse> {
  const params = new URLSearchParams({
    latitude: latitude.toString(),
    longitude: longitude.toString(),
    current: [
      'temperature_2m',
      'relative_humidity_2m',
      'apparent_temperature',
      'is_day',
      'precipitation',
      'rain',
      'showers',
      'snowfall',
      'weather_code',
      'cloud_cover',
      'pressure_msl',
      'surface_pressure',
      'wind_speed_10m',
      'wind_direction_10m',
      'wind_gusts_10m'
    ].join(','),
    hourly: [
      'temperature_2m',
      'relative_humidity_2m',
      'dew_point_2m',
      'apparent_temperature',
      'precipitation_probability',
      'precipitation',
      'weather_code',
      'pressure_msl',
      'cloud_cover',
      'visibility',
      'wind_speed_10m',
      'uv_index'
    ].join(','),
    daily: [
      'weather_code',
      'temperature_2m_max',
      'temperature_2m_min',
      'apparent_temperature_max',
      'apparent_temperature_min',
      'sunrise',
      'sunset',
      'uv_index_max',
      'precipitation_sum',
      'rain_sum',
      'showers_sum',
      'snowfall_sum',
      'precipitation_hours',
      'precipitation_probability_max',
      'wind_speed_10m_max',
      'wind_gusts_10m_max',
      'wind_direction_10m_dominant'
    ].join(','),
    timezone: timezone || 'auto'
  });

  const url = `${FORECAST_BASE_URL}?${params.toString()}`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  try {
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Open-Meteo Forecast API error: HTTP ${response.status}`);
    }

    const data: OpenMeteoForecastResponse = await response.json();
    return data;
  } catch (error: unknown) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Weather forecast fetch timed out. Please try refreshing.');
    }
    console.error('Failed to fetch weather forecast:', error);
    throw error;
  }
}

export async function fetchAiWeatherInsights(weatherDataPayload: object) {
  try {
    const response = await fetch('/api/ai-weather-insights', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(weatherDataPayload)
    });

    if (!response.ok) {
      const errJson = await response.json().catch(() => ({}));
      throw new Error(errJson.error || `Server status ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.warn('AI Weather Insights call failed, falling back to local rule engine:', error);
    return null;
  }
}

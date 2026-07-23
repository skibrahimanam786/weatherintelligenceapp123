import React, { useState, useEffect, useCallback } from 'react';
import { GeocodingResult, OpenMeteoForecastResponse, TemperatureUnit, SavedLocation } from './types/weather';
import { fetchWeatherForecast } from './services/weatherApi';
import { Header } from './components/Header';
import { CitySearch } from './components/CitySearch';
import { CurrentWeatherHero } from './components/CurrentWeatherHero';
import { HourlyForecast } from './components/HourlyForecast';
import { DailyForecast } from './components/DailyForecast';
import { WeatherMetricsGrid } from './components/WeatherMetricsGrid';
import { WeatherCharts } from './components/WeatherCharts';
import { SmartRecommendations } from './components/SmartRecommendations';
import { ErrorState } from './components/ErrorState';
import { LoadingSkeleton } from './components/LoadingSkeleton';
import { CloudSun, RefreshCw, MapPin } from 'lucide-react';

const DEFAULT_LOCATION: GeocodingResult = {
  id: 1850147,
  name: 'Tokyo',
  country: 'Japan',
  country_code: 'JP',
  admin1: 'Tokyo',
  latitude: 35.6895,
  longitude: 139.6917,
  timezone: 'Asia/Tokyo'
};

const STORAGE_KEYS = {
  UNIT: 'weatherintel_unit',
  SAVED_LOCATIONS: 'weatherintel_saved_locations',
  RECENT_SEARCHES: 'weatherintel_recent_searches',
  LAST_LOCATION: 'weatherintel_last_location'
};

export default function App() {
  const [unit, setUnit] = useState<TemperatureUnit>(() => {
    return (localStorage.getItem(STORAGE_KEYS.UNIT) as TemperatureUnit) || 'celsius';
  });

  const [currentLocation, setCurrentLocation] = useState<GeocodingResult>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.LAST_LOCATION);
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return DEFAULT_LOCATION;
  });

  const [savedLocations, setSavedLocations] = useState<SavedLocation[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SAVED_LOCATIONS);
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return [];
  });

  const [recentSearches, setRecentSearches] = useState<GeocodingResult[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.RECENT_SEARCHES);
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return [];
  });

  const [weatherData, setWeatherData] = useState<OpenMeteoForecastResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  // Persist unit changes
  const toggleUnit = () => {
    const nextUnit = unit === 'celsius' ? 'fahrenheit' : 'celsius';
    setUnit(nextUnit);
    localStorage.setItem(STORAGE_KEYS.UNIT, nextUnit);
  };

  // Load weather for location
  const loadWeather = useCallback(async (loc: GeocodingResult) => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchWeatherForecast(loc.latitude, loc.longitude, loc.timezone);
      setWeatherData(data);
      setCurrentLocation(loc);
      setLastUpdated(new Date().toLocaleTimeString());
      localStorage.setItem(STORAGE_KEYS.LAST_LOCATION, JSON.stringify(loc));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unable to connect to Open-Meteo Forecast API';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial mount load
  useEffect(() => {
    loadWeather(currentLocation);
  }, []);

  // Location selection handler
  const handleSelectCity = (city: GeocodingResult) => {
    loadWeather(city);

    // Save to recent searches
    setRecentSearches(prev => {
      const filtered = prev.filter(item => item.id !== city.id && item.name !== city.name);
      const updated = [city, ...filtered].slice(0, 8);
      localStorage.setItem(STORAGE_KEYS.RECENT_SEARCHES, JSON.stringify(updated));
      return updated;
    });
  };

  // GPS Geolocation trigger
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        const gpsLoc: GeocodingResult = {
          id: Date.now(),
          name: 'Current Location',
          country: 'GPS Location',
          latitude: lat,
          longitude: lng,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'auto'
        };
        handleSelectCity(gpsLoc);
      },
      (err) => {
        setLoading(false);
        setError(`Location access denied or unavailable (${err.message}). Defaulting to searched city.`);
      },
      { timeout: 8000 }
    );
  };

  // Toggle Pinned / Favorite City
  const isCurrentFavorite = savedLocations.some(
    loc => loc.name === currentLocation.name && Math.abs(loc.latitude - currentLocation.latitude) < 0.1
  );

  const toggleFavorite = () => {
    if (isCurrentFavorite) {
      const updated = savedLocations.filter(
        loc => !(loc.name === currentLocation.name && Math.abs(loc.latitude - currentLocation.latitude) < 0.1)
      );
      setSavedLocations(updated);
      localStorage.setItem(STORAGE_KEYS.SAVED_LOCATIONS, JSON.stringify(updated));
    } else {
      const newFav: SavedLocation = {
        id: `${currentLocation.name}-${Date.now()}`,
        name: currentLocation.name,
        country: currentLocation.country,
        admin1: currentLocation.admin1,
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
        timezone: currentLocation.timezone,
        addedAt: Date.now()
      };
      const updated = [newFav, ...savedLocations];
      setSavedLocations(updated);
      localStorage.setItem(STORAGE_KEYS.SAVED_LOCATIONS, JSON.stringify(updated));
    }
  };

  const removeSavedLocation = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = savedLocations.filter(l => l.id !== id);
    setSavedLocations(updated);
    localStorage.setItem(STORAGE_KEYS.SAVED_LOCATIONS, JSON.stringify(updated));
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem(STORAGE_KEYS.RECENT_SEARCHES);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased selection:bg-sky-500 selection:text-slate-950 flex flex-col">
      
      {/* Sticky Header */}
      <Header
        unit={unit}
        onToggleUnit={toggleUnit}
        onOpenSearch={() => setIsSearchOpen(true)}
        savedLocations={savedLocations}
        onSelectSavedLocation={(loc) => {
          handleSelectCity({
            id: Number(loc.id) || Date.now(),
            name: loc.name,
            country: loc.country,
            admin1: loc.admin1,
            latitude: loc.latitude,
            longitude: loc.longitude,
            timezone: loc.timezone
          });
        }}
        onRemoveSavedLocation={removeSavedLocation}
        onUseCurrentLocation={handleUseCurrentLocation}
        currentCityName={currentLocation.name}
      />

      {/* Main Body Dashboard Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        
        {loading ? (
          <LoadingSkeleton />
        ) : error ? (
          <ErrorState 
            message={error} 
            onRetry={() => loadWeather(currentLocation)} 
            onOpenSearch={() => setIsSearchOpen(true)}
          />
        ) : weatherData ? (
          <>
            {/* Top Row: Hero Card & Location Info */}
            <CurrentWeatherHero
              weather={weatherData}
              location={currentLocation}
              unit={unit}
              isFavorite={isCurrentFavorite}
              onToggleFavorite={toggleFavorite}
            />

            {/* 24-Hour Timeline Bar */}
            <HourlyForecast
              weather={weatherData}
              unit={unit}
            />

            {/* Detailed Atmospheric Metrics Grid */}
            <WeatherMetricsGrid
              weather={weatherData}
              unit={unit}
            />

            {/* Recharts Meteorological Visual Analytics */}
            <WeatherCharts
              weather={weatherData}
              unit={unit}
            />

            {/* 7-Day Forecast Breakdown */}
            <DailyForecast
              weather={weatherData}
              unit={unit}
            />

            {/* AI Intelligence Briefing & Smart Activity Matrix */}
            <SmartRecommendations
              weather={weatherData}
              location={currentLocation}
            />
          </>
        ) : null}

      </main>

      {/* City Search Modal */}
      <CitySearch
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectCity={handleSelectCity}
        onUseCurrentLocation={handleUseCurrentLocation}
        recentSearches={recentSearches}
        onClearRecentSearches={clearRecentSearches}
      />

      {/* Global Footer */}
      <footer className="mt-12 border-t border-slate-900 bg-slate-950 py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <CloudSun className="w-4 h-4 text-sky-400" />
            <span className="font-semibold text-slate-300">WeatherIntel Dashboard</span>
            <span>• Powered by Open-Meteo & Gemini AI</span>
          </div>

          <div className="flex items-center gap-4">
            {lastUpdated && (
              <span>Last Sync: {lastUpdated}</span>
            )}
            <button
              onClick={() => loadWeather(currentLocation)}
              className="text-sky-400 hover:text-sky-300 flex items-center gap-1 transition-colors font-medium"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh Weather</span>
            </button>
          </div>
        </div>
      </footer>

    </div>
  );
}

import React, { useState, useEffect, useRef } from 'react';
import { GeocodingResult } from '../types/weather';
import { searchCities } from '../services/weatherApi';
import { Search, X, MapPin, Compass, Clock, Building2, AlertCircle, Loader2 } from 'lucide-react';

interface CitySearchProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCity: (city: GeocodingResult) => void;
  onUseCurrentLocation: () => void;
  recentSearches: GeocodingResult[];
  onClearRecentSearches: () => void;
}

const POPULAR_CITIES: GeocodingResult[] = [
  { id: 1850147, name: 'Tokyo', country: 'Japan', country_code: 'JP', admin1: 'Tokyo', latitude: 35.6895, longitude: 139.6917, timezone: 'Asia/Tokyo' },
  { id: 2643743, name: 'London', country: 'United Kingdom', country_code: 'GB', admin1: 'England', latitude: 51.5085, longitude: -0.1257, timezone: 'Europe/London' },
  { id: 5128581, name: 'New York', country: 'United States', country_code: 'US', admin1: 'New York', latitude: 40.7143, longitude: -74.006, timezone: 'America/New_York' },
  { id: 2988507, name: 'Paris', country: 'France', country_code: 'FR', admin1: 'Île-de-France', latitude: 48.8534, longitude: 2.3488, timezone: 'Europe/Paris' },
  { id: 2147714, name: 'Sydney', country: 'Australia', country_code: 'AU', admin1: 'New South Wales', latitude: -33.8678, longitude: 151.2073, timezone: 'Australia/Sydney' },
  { id: 292223, name: 'Dubai', country: 'United Arab Emirates', country_code: 'AE', admin1: 'Dubai', latitude: 25.2582, longitude: 55.3047, timezone: 'Asia/Dubai' },
  { id: 1880252, name: 'Singapore', country: 'Singapore', country_code: 'SG', latitude: 1.2897, longitude: 103.8501, timezone: 'Asia/Singapore' },
  { id: 5391959, name: 'San Francisco', country: 'United States', country_code: 'US', admin1: 'California', latitude: 37.7749, longitude: -122.4194, timezone: 'America/Los_Angeles' }
];

export const CitySearch: React.FC<CitySearchProps> = ({
  isOpen,
  onClose,
  onSelectCity,
  onUseCurrentLocation,
  recentSearches,
  onClearRecentSearches
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GeocodingResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery('');
      setResults([]);
      setError(null);
    }
  }, [isOpen]);

  // Handle keyboard shortcut Esc & ⌘K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Open search modal via dispatch or prop if needed
        }
      } else if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Debounced search query
  useEffect(() => {
    if (!query.trim() || query.trim().length < 2) {
      setResults([]);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    const handler = setTimeout(async () => {
      try {
        const data = await searchCities(query);
        setResults(data);
        if (data.length === 0) {
          setError(`No locations found matching "${query}". Try checking spelling or search a major city.`);
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Failed to reach Open-Meteo Geocoding API';
        setError(msg);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(handler);
  }, [query]);

  if (!isOpen) return null;

  const handleSelect = (city: GeocodingResult) => {
    onSelectCity(city);
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-start justify-center pt-12 sm:pt-20 px-4 pb-6 overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
      id="city-search-modal-backdrop"
    >
      <div
        className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col my-auto"
        onClick={(e) => e.stopPropagation()}
        id="city-search-modal-card"
      >
        {/* Search Header Input Bar */}
        <div className="p-4 border-b border-slate-800 flex items-center gap-3 bg-slate-950">
          <Search className="w-5 h-5 text-cyan-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="SEARCH CITY, REGION, POSTAL CODE, OR COUNTRY..."
            className="flex-1 bg-transparent text-slate-100 placeholder-slate-500 text-sm font-mono uppercase tracking-wider focus:outline-none"
            id="city-search-input"
          />
          {loading && <Loader2 className="w-5 h-5 text-cyan-400 animate-spin shrink-0" />}
          {query && !loading && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="px-2.5 py-1 text-xs font-mono font-bold text-cyan-400 bg-cyan-500/10 rounded-lg border border-cyan-500/30"
          >
            ESC
          </button>
        </div>

        {/* GPS Current Location Shortcut */}
        <div className="px-4 py-3 bg-slate-950/60 border-b border-slate-800/80 flex items-center justify-between">
          <button
            onClick={() => {
              onUseCurrentLocation();
              onClose();
            }}
            id="modal-gps-location-btn"
            className="flex items-center gap-2.5 text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            <Compass className="w-4 h-4 animate-pulse" />
            <span>USE_MY_CURRENT_LOCATION [GPS]</span>
          </button>
          <span className="text-[10px] font-mono text-slate-500 uppercase">Auto-detect coordinates</span>
        </div>

        {/* Search Results Body */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-6">
          
          {/* Error / Empty Search Feedback */}
          {error && (
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold uppercase">{error}</p>
                <p className="text-[10px] text-amber-400/80 mt-1 uppercase">
                  Try searching with standard English city names or selecting a recommended station below.
                </p>
              </div>
            </div>
          )}

          {/* Search Results List */}
          {results.length > 0 && (
            <div>
              <h3 className="text-[10px] font-mono uppercase tracking-[0.2em] text-cyan-400 mb-2 font-bold">
                MATCHING_STATIONS ({results.length})
              </h3>
              <div className="space-y-1">
                {results.map((item) => (
                  <button
                    key={`${item.id}-${item.latitude}-${item.longitude}`}
                    onClick={() => handleSelect(item)}
                    className="w-full text-left p-3 rounded-xl hover:bg-slate-800/80 border border-transparent hover:border-cyan-500/40 flex items-center justify-between group transition-all"
                  >
                    <div className="flex items-center gap-3 truncate">
                      <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center shrink-0 text-cyan-400">
                        <Building2 className="w-4 h-4" />
                      </div>
                      <div className="truncate">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm font-bold uppercase text-slate-100 group-hover:text-cyan-300">
                            {item.name}
                          </span>
                          {item.country_code && (
                            <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-1.5 py-0.5 rounded border border-cyan-500/20">
                              {item.country_code}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400 truncate mt-0.5 font-light">
                          {item.admin1 ? `${item.admin1}, ` : ''}{item.country}
                          {item.elevation ? ` • Elev: ${item.elevation}m` : ''}
                        </p>
                      </div>
                    </div>
                    <div className="text-right text-[10px] text-slate-500 font-mono hidden sm:block">
                      {item.latitude.toFixed(2)}°, {item.longitude.toFixed(2)}°
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Recent Searches List */}
          {recentSearches.length > 0 && query.length < 2 && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-[10px] font-mono uppercase tracking-[0.2em] text-cyan-400 font-bold flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" /> RECENT_STATIONS
                </h3>
                <button
                  onClick={onClearRecentSearches}
                  className="text-[10px] font-mono text-slate-500 hover:text-slate-300 transition-colors uppercase"
                >
                  CLEAR_HISTORY
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((loc) => (
                  <button
                    key={`recent-${loc.id}-${loc.name}`}
                    onClick={() => handleSelect(loc)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-200 text-xs font-mono font-bold uppercase transition-all hover:border-cyan-500/40"
                  >
                    <MapPin className="w-3 h-3 text-cyan-400" />
                    <span>{loc.name}</span>
                    <span className="text-[10px] text-slate-500">({loc.country})</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Popular Cities Grid */}
          {query.length < 2 && (
            <div>
              <h3 className="text-[10px] font-mono uppercase tracking-[0.2em] text-cyan-400 mb-2.5 font-bold">
                KEY_GLOBAL_METROPOLISES
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {POPULAR_CITIES.map((city) => (
                  <button
                    key={city.id}
                    onClick={() => handleSelect(city)}
                    className="p-3 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/40 text-left transition-all group"
                  >
                    <p className="font-mono text-xs font-bold uppercase text-slate-200 group-hover:text-cyan-300">
                      {city.name}
                    </p>
                    <p className="text-[10px] font-mono text-slate-500 mt-0.5 truncate uppercase">
                      {city.country}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};

import React from 'react';
import { TemperatureUnit, SavedLocation } from '../types/weather';
import { CloudSun, Search, Compass, Star, Trash2, MapPin } from 'lucide-react';

interface HeaderProps {
  unit: TemperatureUnit;
  onToggleUnit: () => void;
  onOpenSearch: () => void;
  savedLocations: SavedLocation[];
  onSelectSavedLocation: (loc: SavedLocation) => void;
  onRemoveSavedLocation: (id: string, e: React.MouseEvent) => void;
  onUseCurrentLocation: () => void;
  currentCityName?: string;
}

export const Header: React.FC<HeaderProps> = ({
  unit,
  onToggleUnit,
  onOpenSearch,
  savedLocations,
  onSelectSavedLocation,
  onRemoveSavedLocation,
  onUseCurrentLocation,
  currentCityName
}) => {
  const [showSavedDropdown, setShowSavedDropdown] = React.useState(false);

  return (
    <header className="sticky top-0 z-30 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 text-slate-100 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* App Logo & Branding */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 border border-cyan-500/40 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 font-mono text-xs font-bold shrink-0">
            00
          </div>
          <div>
            <h1 className="text-xs font-mono uppercase tracking-[0.3em] text-cyan-400">
              Meteorological Intelligence
            </h1>
            <p className="text-base font-black tracking-tighter uppercase text-slate-100">
              WeatherIntel
            </p>
          </div>
        </div>

        {/* Center Search Trigger */}
        <button
          onClick={onOpenSearch}
          id="search-trigger-btn"
          className="flex-1 max-w-md flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-900 text-slate-300 text-sm border-b-2 border-slate-700/80 border-x border-t border-slate-800 transition-all hover:border-cyan-500/60 group text-left"
        >
          <Search className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform shrink-0" />
          <span className="truncate flex-1 text-slate-400 font-mono text-xs uppercase tracking-wider">
            {currentCityName ? `SEARCH_COORDINATES... [${currentCityName.toUpperCase()}]` : 'SEARCH_COORDINATES...'}
          </span>
          <kbd className="hidden md:inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-mono font-bold text-cyan-400 bg-cyan-500/10 rounded border border-cyan-500/30">
            ⌘K
          </kbd>
        </button>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          
          {/* Current GPS Location Button */}
          <button
            onClick={onUseCurrentLocation}
            title="Use My Current GPS Location"
            id="gps-location-btn"
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-cyan-400 border border-slate-800 transition-colors flex items-center justify-center"
          >
            <Compass className="w-5 h-5" />
          </button>

          {/* Saved Locations Favorites Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowSavedDropdown(!showSavedDropdown)}
              id="favorites-dropdown-btn"
              className={`p-2 rounded-xl border transition-colors flex items-center gap-1.5 text-xs font-mono font-bold tracking-wider uppercase ${
                savedLocations.length > 0
                  ? 'bg-amber-500/10 border-amber-500/40 text-amber-300 hover:bg-amber-500/20'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
              title="Saved Favorite Cities"
            >
              <Star className={`w-4 h-4 ${savedLocations.length > 0 ? 'fill-amber-400 text-amber-400' : ''}`} />
              {savedLocations.length > 0 && (
                <span className="text-[10px] bg-amber-400/20 text-amber-300 px-1.5 py-0.5 rounded font-mono font-bold">
                  {savedLocations.length}
                </span>
              )}
            </button>

            {/* Saved Locations Menu */}
            {showSavedDropdown && (
              <div 
                className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                id="saved-locations-menu"
              >
                <div className="px-3 py-2 text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-widest border-b border-slate-800 flex justify-between items-center">
                  <span>SAVED_LOCATIONS</span>
                  <span>{savedLocations.length}</span>
                </div>
                
                <div className="max-h-60 overflow-y-auto mt-1 space-y-0.5">
                  {savedLocations.length === 0 ? (
                    <div className="px-3 py-4 text-center text-xs font-mono text-slate-500">
                      NO_SAVED_LOCATIONS.<br />PIN CITIES FOR FAST ACCESS.
                    </div>
                  ) : (
                    savedLocations.map((loc) => (
                      <div
                        key={loc.id}
                        onClick={() => {
                          onSelectSavedLocation(loc);
                          setShowSavedDropdown(false);
                        }}
                        className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-slate-800/80 cursor-pointer text-sm text-slate-200 group transition-colors"
                      >
                        <div className="flex items-center gap-2 truncate">
                          <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                          <div className="truncate">
                            <p className="font-bold uppercase tracking-tight text-slate-200 group-hover:text-cyan-300 truncate">
                              {loc.name}
                            </p>
                            <p className="text-[10px] font-mono text-slate-400 uppercase truncate">
                              {loc.admin1 ? `${loc.admin1}, ` : ''}{loc.country}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={(e) => onRemoveSavedLocation(loc.id, e)}
                          title="Remove city"
                          className="p-1 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Temperature Unit Toggle (°C / °F) */}
          <div className="bg-slate-900 p-1 rounded-xl border border-slate-800 flex items-center font-mono">
            <button
              onClick={() => unit !== 'celsius' && onToggleUnit()}
              id="unit-celsius-btn"
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                unit === 'celsius'
                  ? 'bg-cyan-500 text-slate-950 font-black shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              °C
            </button>
            <button
              onClick={() => unit !== 'fahrenheit' && onToggleUnit()}
              id="unit-fahrenheit-btn"
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                unit === 'fahrenheit'
                  ? 'bg-cyan-500 text-slate-950 font-black shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              °F
            </button>
          </div>

        </div>

      </div>
    </header>
  );
};

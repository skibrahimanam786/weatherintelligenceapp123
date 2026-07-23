import React from 'react';
import { AlertTriangle, RefreshCw, MapPin, WifiOff } from 'lucide-react';

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
  onOpenSearch?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ message, onRetry, onOpenSearch }) => {
  return (
    <div className="max-w-xl mx-auto my-12 p-8 bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl text-center space-y-5 animate-in fade-in duration-200">
      <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 mx-auto flex items-center justify-center font-mono font-bold text-xs">
        <WifiOff className="w-8 h-8" />
      </div>

      <div>
        <h3 className="text-xs font-mono uppercase tracking-[0.25em] text-red-400 font-bold">
          TELEMETRY_LINK_FAILURE
        </h3>
        <p className="text-sm text-slate-300 font-light italic mt-2 leading-relaxed">
          {message || 'Unable to retrieve meteorological data from Open-Meteo. Please check your network connection or try searching for a different station.'}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <button
          onClick={onRetry}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black font-mono text-xs uppercase tracking-wider shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          <span>RETRY_CONNECTION</span>
        </button>

        {onOpenSearch && (
          <button
            onClick={onOpenSearch}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-200 font-bold font-mono text-xs uppercase tracking-wider border border-slate-800 transition-all flex items-center justify-center gap-2"
          >
            <MapPin className="w-4 h-4 text-cyan-400" />
            <span>SEARCH_NEW_STATION</span>
          </button>
        )}
      </div>
    </div>
  );
};

import React from 'react';
import { AlertCircle, RefreshCw, MapPin, Search } from 'lucide-react';
import { GeoCity } from '../types';
import { POPULAR_CITIES } from '../services/weatherApi';

interface ErrorMessageProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  onSelectCity?: (city: GeoCity) => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  title = 'Forecast Data Unavailable',
  message,
  onRetry,
  onSelectCity,
}) => {
  return (
    <div className="w-full max-w-xl mx-auto my-12 p-8 bg-white/10 backdrop-blur-2xl rounded-3xl border border-rose-400/30 shadow-2xl text-center">
      <div className="w-14 h-14 mx-auto rounded-2xl bg-rose-500/20 border border-rose-400/30 backdrop-blur-md flex items-center justify-center text-rose-300 mb-4 shadow-lg shadow-rose-500/20">
        <AlertCircle className="w-7 h-7" />
      </div>

      <h3 className="text-lg font-bold text-white mb-2">
        {title}
      </h3>

      <p className="text-sm text-slate-300 mb-6 leading-relaxed max-w-md mx-auto">
        {message}
      </p>

      {onRetry && (
        <button
          id="btn-error-retry"
          type="button"
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-sky-500/80 hover:bg-sky-400 text-white border border-sky-300/40 transition shadow-md shadow-sky-500/30 backdrop-blur-md"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Retry Connection</span>
        </button>
      )}

      {onSelectCity && (
        <div className="mt-8 pt-6 border-t border-white/10">
          <p className="text-xs font-semibold text-sky-200/70 mb-3 uppercase tracking-wider">
            Or switch to a major verified city
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {POPULAR_CITIES.slice(0, 4).map((city) => (
              <button
                key={city.id}
                type="button"
                onClick={() => onSelectCity(city)}
                className="px-3 py-1.5 rounded-xl text-xs font-medium bg-white/10 hover:bg-white/20 text-slate-200 border border-white/15 backdrop-blur-md transition flex items-center gap-1.5"
              >
                <MapPin className="w-3 h-3 text-sky-400" />
                <span>{city.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

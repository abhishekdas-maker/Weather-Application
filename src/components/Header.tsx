import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Navigation, Clock, Loader2, X, Globe, Sparkles } from 'lucide-react';
import { GeoCity, TempUnit, WindUnit } from '../types';
import { searchCities, POPULAR_CITIES } from '../services/weatherApi';

interface HeaderProps {
  currentCity: GeoCity;
  onSelectCity: (city: GeoCity) => void;
  tempUnit: TempUnit;
  onToggleTempUnit: () => void;
  windUnit: WindUnit;
  onToggleWindUnit: () => void;
  onLocateUser: () => void;
  isLocating: boolean;
  onRefresh: () => void;
  isRefreshing: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentCity,
  onSelectCity,
  tempUnit,
  onToggleTempUnit,
  windUnit,
  onToggleWindUnit,
  onLocateUser,
  isLocating,
  onRefresh,
  isRefreshing,
}) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<GeoCity[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [recentSearches, setRecentSearches] = useState<GeoCity[]>(() => {
    try {
      const saved = localStorage.getItem('weather_recent_cities');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const searchContainerRef = useRef<HTMLDivElement>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced search
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setSuggestions([]);
      setIsSearching(false);
      setSearchError(null);
      return;
    }

    setIsSearching(true);
    setSearchError(null);

    debounceTimerRef.current = setTimeout(async () => {
      try {
        const results = await searchCities(trimmed);
        setSuggestions(results);
        if (results.length === 0) {
          setSearchError(`No cities found matching "${trimmed}"`);
        } else {
          setSearchError(null);
        }
      } catch (err: unknown) {
        setSearchError('Failed to fetch city suggestions');
        setSuggestions([]);
      } finally {
        setIsSearching(false);
      }
    }, 280);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [query]);

  const handleSelectCity = (city: GeoCity) => {
    onSelectCity(city);
    setQuery('');
    setIsOpen(false);
    setSuggestions([]);

    // Save to recent
    setRecentSearches((prev) => {
      const filtered = prev.filter((item) => item.id !== city.id && item.name !== city.name);
      const updated = [city, ...filtered].slice(0, 5);
      try {
        localStorage.setItem('weather_recent_cities', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (suggestions.length > 0) {
      handleSelectCity(suggestions[0]);
    } else if (query.trim().length >= 2) {
      setIsSearching(true);
      try {
        const results = await searchCities(query.trim());
        if (results.length > 0) {
          handleSelectCity(results[0]);
        } else {
          setSearchError(`City "${query}" could not be found`);
        }
      } catch {
        setSearchError('Unable to locate city. Please try again.');
      } finally {
        setIsSearching(false);
      }
    }
  };

  return (
    <header className="w-full bg-slate-900/50 backdrop-blur-xl border-b border-white/10 sticky top-0 z-30 transition-colors shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          
          {/* Brand & Active City */}
          <div className="flex items-center justify-between w-full md:w-auto gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/15 backdrop-blur-lg rounded-2xl border border-white/25 flex items-center justify-center shadow-lg relative overflow-hidden group">
                <div className="w-4 h-4 bg-sky-400 rounded-full blur-[2px] shadow-[0_0_12px_#38bdf8]" />
                <Sparkles className="w-4 h-4 text-white absolute" />
              </div>
              <div>
                <span className="text-base font-bold tracking-tight text-white block leading-tight">
                  Weather<span className="font-light text-sky-300"> Intelligence</span>
                </span>
                <span className="text-xs text-sky-200/70 flex items-center gap-1">
                  <Globe className="w-3 h-3 text-sky-400" />
                  Open-Meteo Precision API
                </span>
              </div>
            </div>

            {/* Mobile Controls Right */}
            <div className="flex items-center gap-1.5 md:hidden">
              <button
                id="mobile-unit-toggle"
                onClick={onToggleTempUnit}
                className="px-2.5 py-1.5 text-xs font-semibold rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 border border-white/15 backdrop-blur-md transition"
                title="Toggle Temperature Unit"
              >
                °{tempUnit === 'celsius' ? 'C' : 'F'}
              </button>
              <button
                id="mobile-locate-btn"
                onClick={onLocateUser}
                disabled={isLocating}
                className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 border border-white/15 backdrop-blur-md transition disabled:opacity-50"
                title="Use Current Location"
              >
                {isLocating ? <Loader2 className="w-4 h-4 animate-spin text-sky-400" /> : <Navigation className="w-4 h-4 text-sky-300" />}
              </button>
            </div>
          </div>

          {/* Search Bar Input Container */}
          <div ref={searchContainerRef} className="relative w-full md:max-w-md lg:max-w-lg">
            <form onSubmit={handleFormSubmit} className="relative flex items-center">
              <div className="absolute left-4 text-slate-400 pointer-events-none">
                {isSearching ? (
                  <Loader2 className="w-4 h-4 animate-spin text-sky-400" />
                ) : (
                  <Search className="w-4 h-4 text-slate-400" />
                )}
              </div>

              <input
                id="city-search-input"
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setIsOpen(true);
                }}
                onFocus={() => setIsOpen(true)}
                placeholder="Search any city worldwide (e.g. Tokyo, Paris, Chicago)..."
                className="w-full pl-11 pr-24 py-2.5 bg-white/10 hover:bg-white/15 focus:bg-white/15 backdrop-blur-md text-sm text-white placeholder:text-slate-400 rounded-full border border-white/20 focus:border-sky-400/70 focus:ring-2 focus:ring-sky-400/40 focus:outline-none transition-all shadow-inner"
              />

              {query && (
                <button
                  type="button"
                  onClick={() => {
                    setQuery('');
                    setSuggestions([]);
                    setSearchError(null);
                  }}
                  className="absolute right-18 text-slate-400 hover:text-white p-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}

              <button
                type="submit"
                className="absolute right-1.5 px-3 py-1.5 text-xs font-medium rounded-full bg-sky-500/80 hover:bg-sky-400 text-white border border-sky-300/40 transition shadow-md shadow-sky-500/30"
              >
                Search
              </button>
            </form>

            {/* Suggestions Dropdown */}
            {isOpen && (suggestions.length > 0 || searchError || isSearching) && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900/95 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/20 overflow-hidden z-50 animate-in fade-in-50 duration-150">
                {isSearching && suggestions.length === 0 && (
                  <div className="p-4 text-center text-xs text-sky-200/70 flex items-center justify-center gap-2">
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-sky-400" />
                    Searching global geocoding index...
                  </div>
                )}

                {searchError && (
                  <div className="p-4 text-center text-xs text-rose-300">
                    {searchError}
                  </div>
                )}

                {suggestions.length > 0 && (
                  <ul className="max-h-72 overflow-y-auto divide-y divide-white/10">
                    {suggestions.map((item) => (
                      <li key={`${item.id}-${item.latitude}-${item.longitude}`}>
                        <button
                          type="button"
                          onClick={() => handleSelectCity(item)}
                          className="w-full text-left px-4 py-2.5 hover:bg-white/10 flex items-center justify-between gap-2 text-sm transition group"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <MapPin className="w-4 h-4 text-sky-400/80 group-hover:text-sky-300 shrink-0 transition" />
                            <div className="truncate">
                              <span className="font-medium text-white">
                                {item.name}
                              </span>
                              {(item.admin1 || item.country) && (
                                <span className="text-xs text-sky-200/60 ml-1.5 truncate">
                                  {[item.admin1, item.country].filter(Boolean).join(', ')}
                                </span>
                              )}
                            </div>
                          </div>
                          {item.country_code && (
                            <span className="text-[11px] font-mono uppercase font-semibold px-1.5 py-0.5 rounded bg-white/10 text-sky-200 border border-white/20 shrink-0">
                              {item.country_code}
                            </span>
                          )}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>

          {/* Desktop Controls */}
          <div className="hidden md:flex items-center gap-2">
            <button
              id="desktop-locate-btn"
              onClick={onLocateUser}
              disabled={isLocating}
              className="px-3 py-2 text-xs font-medium rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 border border-white/15 backdrop-blur-md transition flex items-center gap-1.5 disabled:opacity-50"
              title="Use Current Location"
            >
              {isLocating ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-sky-400" />
              ) : (
                <Navigation className="w-3.5 h-3.5 text-sky-400" />
              )}
              <span>Locate Me</span>
            </button>

            {/* Units Toggle Group */}
            <div className="flex items-center bg-white/10 backdrop-blur-md rounded-xl p-0.5 border border-white/15 text-xs">
              <button
                id="btn-unit-celsius"
                onClick={tempUnit !== 'celsius' ? onToggleTempUnit : undefined}
                className={`px-2.5 py-1.5 rounded-lg font-semibold transition ${
                  tempUnit === 'celsius'
                    ? 'bg-sky-500/40 border border-sky-400/50 text-white shadow-xs'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                °C
              </button>
              <button
                id="btn-unit-fahrenheit"
                onClick={tempUnit !== 'fahrenheit' ? onToggleTempUnit : undefined}
                className={`px-2.5 py-1.5 rounded-lg font-semibold transition ${
                  tempUnit === 'fahrenheit'
                    ? 'bg-sky-500/40 border border-sky-400/50 text-white shadow-xs'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                °F
              </button>
            </div>

            {/* Wind unit toggle */}
            <button
              id="btn-wind-unit"
              onClick={onToggleWindUnit}
              className="px-2.5 py-2 text-xs font-medium rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 border border-white/15 backdrop-blur-md transition"
              title="Toggle Wind Unit"
            >
              {windUnit === 'kmh' ? 'km/h' : 'mph'}
            </button>

            {/* Refresh Button */}
            <button
              id="btn-refresh"
              onClick={onRefresh}
              disabled={isRefreshing}
              className="p-2 text-xs font-medium rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 border border-white/15 backdrop-blur-md transition disabled:opacity-50"
              title="Refresh Forecast Data"
            >
              <Clock className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-sky-400' : ''}`} />
            </button>
          </div>
        </div>

        {/* Quick select cities & recent searches pill strip */}
        <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center gap-1.5 overflow-x-auto no-scrollbar text-xs">
          <span className="text-[11px] font-medium text-slate-400 shrink-0 mr-1">
            Popular:
          </span>
          {POPULAR_CITIES.map((city) => {
            const isSelected = currentCity.name === city.name;
            return (
              <button
                key={city.id}
                type="button"
                onClick={() => onSelectCity(city)}
                className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition shrink-0 ${
                  isSelected
                    ? 'bg-sky-500/30 border border-sky-400/60 text-white shadow-[0_0_12px_rgba(56,189,248,0.25)]'
                    : 'bg-white/10 text-slate-300 hover:bg-white/20 hover:text-white border border-white/10 backdrop-blur-md'
                }`}
              >
                {city.name}
              </button>
            );
          })}

          {recentSearches.length > 0 && (
            <>
              <span className="text-white/20 mx-1">|</span>
              <span className="text-[11px] font-medium text-slate-400 shrink-0 mr-1">
                Recent:
              </span>
              {recentSearches.map((city) => (
                <button
                  key={`recent-${city.id}`}
                  type="button"
                  onClick={() => onSelectCity(city)}
                  className="px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap bg-white/5 text-slate-300 hover:text-white hover:bg-white/15 border border-white/10 backdrop-blur-md transition shrink-0 flex items-center gap-1"
                >
                  <span>{city.name}</span>
                </button>
              ))}
            </>
          )}
        </div>
      </div>
    </header>
  );
};

import React from 'react';
import {
  Wind,
  Droplets,
  Sun,
  Compass,
  Gauge,
  Sunrise,
  Sunset,
  ShieldAlert,
  Calendar,
  CloudRain,
} from 'lucide-react';
import { WeatherData, TempUnit, WindUnit } from '../types';
import { getWeatherMeta } from '../utils/weatherCodes';
import { WeatherIcon } from './WeatherIcon';

interface CurrentWeatherProps {
  data: WeatherData;
  tempUnit: TempUnit;
  windUnit: WindUnit;
}

export const CurrentWeather: React.FC<CurrentWeatherProps> = ({ data, tempUnit, windUnit }) => {
  const { current, daily, city, timezone, updatedAt } = data;
  const today = daily[0];
  const meta = getWeatherMeta(current.weatherCode, current.isDay);

  const formatLocalTime = () => {
    try {
      return new Intl.DateTimeFormat('en-US', {
        timeZone: timezone,
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
      }).format(new Date());
    } catch {
      return new Date().toLocaleDateString();
    }
  };

  const formatSunTime = (isoString?: string) => {
    if (!isoString) return '--:--';
    try {
      const date = new Date(isoString);
      return new Intl.DateTimeFormat('en-US', {
        timeZone: timezone,
        hour: 'numeric',
        minute: '2-digit',
      }).format(date);
    } catch {
      return isoString.slice(11, 16);
    }
  };

  const getUvBadge = (uv: number) => {
    if (uv <= 2) return { label: 'Low', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30 backdrop-blur-md' };
    if (uv <= 5) return { label: 'Moderate', color: 'bg-amber-500/20 text-amber-300 border-amber-400/30 backdrop-blur-md' };
    if (uv <= 7) return { label: 'High', color: 'bg-orange-500/20 text-orange-300 border-orange-400/30 backdrop-blur-md' };
    if (uv <= 10) return { label: 'Very High', color: 'bg-rose-500/20 text-rose-300 border-rose-400/30 backdrop-blur-md' };
    return { label: 'Extreme', color: 'bg-purple-500/20 text-purple-300 border-purple-400/30 backdrop-blur-md' };
  };

  const uvBadge = getUvBadge(current.uvIndex);
  const tempSymbol = tempUnit === 'celsius' ? '°C' : '°F';
  const windSymbol = windUnit === 'kmh' ? 'km/h' : 'mph';

  return (
    <div id="current-weather-card" className="w-full bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl overflow-hidden relative">
      {/* Subtle top right ambient glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-sky-400/10 blur-[80px] rounded-full pointer-events-none" />

      {/* Top Banner with City & Status */}
      <div className="p-5 sm:p-6 pb-4 border-b border-white/10 flex flex-wrap items-start justify-between gap-4 relative z-10">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              {city.name}
            </h1>
            {city.country_code && (
              <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-white/10 backdrop-blur-md text-sky-200 border border-white/20">
                {city.country_code}
              </span>
            )}
          </div>
          <p className="text-xs text-sky-200/70 mt-1 flex items-center gap-2">
            <span>{[city.admin1, city.country].filter(Boolean).join(', ')}</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-sky-300/70" />
              {formatLocalTime()}
            </span>
          </p>
        </div>

        <div className="flex flex-col items-end text-right">
          <div
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border border-sky-400/40 bg-sky-500/20 text-sky-200 backdrop-blur-md shadow-xs"
          >
            <span className={`w-2 h-2 rounded-full ${meta.category === 'rain' ? 'bg-sky-400 animate-pulse' : 'bg-amber-400'}`} />
            <span>{meta.label}</span>
          </div>
          <span className="text-[11px] text-slate-400 mt-1">
            Updated at {updatedAt}
          </span>
        </div>
      </div>

      {/* Main Temperature & Conditions Block */}
      <div className="p-5 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center relative z-10">
        {/* Large Temp Hero */}
        <div className="lg:col-span-6 flex flex-col sm:flex-row items-center sm:items-start gap-5">
          <div className="p-4 rounded-3xl bg-white/10 backdrop-blur-lg border border-white/20 shrink-0 shadow-lg">
            <WeatherIcon
              weatherCode={current.weatherCode}
              isDay={current.isDay}
              className="w-16 h-16 sm:w-20 sm:h-20"
            />
          </div>

          <div className="text-center sm:text-left">
            <div className="flex items-baseline justify-center sm:justify-start gap-1">
              <span className="text-5xl sm:text-6xl font-extrabold tracking-tight text-white tabular-nums">
                {Math.round(current.temperature)}
              </span>
              <span className="text-2xl sm:text-3xl font-light text-sky-300">
                {tempSymbol}
              </span>
            </div>

            <p className="text-sm font-medium text-sky-200/90 mt-1">
              {meta.description}
            </p>

            <div className="flex items-center justify-center sm:justify-start gap-3 text-xs text-slate-300 mt-2">
              <span>
                Feels like{' '}
                <strong className="text-white font-semibold">
                  {Math.round(current.apparentTemperature)}{tempSymbol}
                </strong>
              </span>
              <span>•</span>
              {today && (
                <span>
                  H: <strong className="text-rose-400 font-semibold">{today.tempMax}{tempSymbol}</strong>{' '}
                  L: <strong className="text-sky-400 font-semibold">{today.tempMin}{tempSymbol}</strong>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Environmental Indicators Grid */}
        <div className="lg:col-span-6 grid grid-cols-2 sm:grid-cols-3 gap-3">
          {/* Wind */}
          <div className="p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 flex flex-col justify-between transition-colors">
            <div className="flex items-center justify-between text-slate-400 mb-1.5">
              <span className="text-xs font-medium text-sky-200/80">Wind</span>
              <Wind className="w-4 h-4 text-sky-400" />
            </div>
            <div>
              <div className="text-lg font-bold text-white tabular-nums">
                {current.windSpeed} <span className="text-xs font-normal text-slate-400">{windSymbol}</span>
              </div>
              <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                <Compass className="w-3 h-3 text-sky-400/70" />
                <span>Dir {current.windDirection}°</span>
              </div>
            </div>
          </div>

          {/* Humidity */}
          <div className="p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 flex flex-col justify-between transition-colors">
            <div className="flex items-center justify-between text-slate-400 mb-1.5">
              <span className="text-xs font-medium text-sky-200/80">Humidity</span>
              <Droplets className="w-4 h-4 text-sky-400" />
            </div>
            <div>
              <div className="text-lg font-bold text-white tabular-nums">
                {current.relativeHumidity}%
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                {current.relativeHumidity > 70 ? 'Humid' : current.relativeHumidity < 30 ? 'Dry' : 'Comfortable'}
              </div>
            </div>
          </div>

          {/* UV Index */}
          <div className="p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 flex flex-col justify-between transition-colors">
            <div className="flex items-center justify-between text-slate-400 mb-1.5">
              <span className="text-xs font-medium text-sky-200/80">UV Index</span>
              <Sun className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-lg font-bold text-white tabular-nums">
                  {current.uvIndex}
                </span>
                <span className={`text-[10px] font-semibold px-1.5 py-0.2 rounded border ${uvBadge.color}`}>
                  {uvBadge.label}
                </span>
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                {today ? `Max ${today.uvIndexMax}` : 'Daily Peak'}
              </div>
            </div>
          </div>

          {/* Precipitation */}
          <div className="p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 flex flex-col justify-between transition-colors">
            <div className="flex items-center justify-between text-slate-400 mb-1.5">
              <span className="text-xs font-medium text-sky-200/80">Precipitation</span>
              <CloudRain className="w-4 h-4 text-sky-400" />
            </div>
            <div>
              <div className="text-lg font-bold text-white tabular-nums">
                {today ? `${today.precipitationProbabilityMax}%` : `${current.precipitation} mm`}
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                {today ? `${today.precipitationSum} mm sum` : `${current.precipitation} mm current`}
              </div>
            </div>
          </div>

          {/* Barometric Pressure */}
          <div className="p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 flex flex-col justify-between transition-colors">
            <div className="flex items-center justify-between text-slate-400 mb-1.5">
              <span className="text-xs font-medium text-sky-200/80">Air Pressure</span>
              <Gauge className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <div className="text-lg font-bold text-white tabular-nums">
                {Math.round(current.surfacePressure || 1013)}{' '}
                <span className="text-xs font-normal text-slate-400">hPa</span>
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                {(current.surfacePressure || 1013) > 1015 ? 'High pressure' : 'Normal / Low'}
              </div>
            </div>
          </div>

          {/* Sun Cycle */}
          <div className="p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 flex flex-col justify-between transition-colors">
            <div className="flex items-center justify-between text-slate-400 mb-1.5">
              <span className="text-xs font-medium text-sky-200/80">Sun Times</span>
              <Sunrise className="w-4 h-4 text-amber-400" />
            </div>
            <div className="space-y-0.5">
              <div className="text-xs text-slate-200 flex items-center justify-between">
                <span className="text-[10px] text-slate-400">Rise:</span>
                <span className="font-semibold tabular-nums text-white">{formatSunTime(today?.sunrise)}</span>
              </div>
              <div className="text-xs text-slate-200 flex items-center justify-between">
                <span className="text-[10px] text-slate-400">Set:</span>
                <span className="font-semibold tabular-nums text-white">{formatSunTime(today?.sunset)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { CloudRain, Wind, Sun, Sunrise, Sunset, ChevronRight, Droplets } from 'lucide-react';
import { DailyForecastItem, HourlyForecastItem, TempUnit, WindUnit } from '../types';
import { getWeatherMeta } from '../utils/weatherCodes';
import { WeatherIcon } from './WeatherIcon';

interface WeeklyForecastProps {
  daily: DailyForecastItem[];
  hourly: HourlyForecastItem[];
  selectedDayIndex: number;
  onSelectDay: (index: number) => void;
  tempUnit: TempUnit;
  windUnit: WindUnit;
  timezone: string;
}

export const WeeklyForecast: React.FC<WeeklyForecastProps> = ({
  daily,
  hourly,
  selectedDayIndex,
  onSelectDay,
  tempUnit,
  windUnit,
  timezone,
}) => {
  const tempSymbol = tempUnit === 'celsius' ? '°' : '°';
  const windSymbol = windUnit === 'kmh' ? 'km/h' : 'mph';

  // Calculate global min and max for proportional range bars
  const globalMin = Math.min(...daily.map((d) => d.tempMin));
  const globalMax = Math.max(...daily.map((d) => d.tempMax));
  const tempSpan = Math.max(1, globalMax - globalMin);

  const formatDayName = (dateStr: string, index: number) => {
    if (index === 0) return 'Today';
    try {
      const date = new Date(dateStr + 'T12:00:00');
      return new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(date);
    } catch {
      return dateStr;
    }
  };

  const formatDateSub = (dateStr: string) => {
    try {
      const date = new Date(dateStr + 'T12:00:00');
      return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(date);
    } catch {
      return dateStr;
    }
  };

  const selectedDay = daily[selectedDayIndex] || daily[0];
  const selectedMeta = getWeatherMeta(selectedDay.weatherCode);

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

  // Filter hourly items for selected day if applicable
  const selectedDayHourly = hourly.filter((h) => h.time.startsWith(selectedDay.date));

  return (
    <div id="weekly-forecast-card" className="w-full bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl overflow-hidden">
      <div className="p-5 border-b border-white/10 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span>7-Day Strategic Forecast</span>
            <span className="text-xs font-normal text-sky-200/70">
              (Click any card to inspect)
            </span>
          </h2>
        </div>
        <span className="text-xs text-sky-300/70">
          Showing 7 consecutive days
        </span>
      </div>

      {/* 7-Day Interactive Grid */}
      <div className="p-4 sm:p-5 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        {daily.slice(0, 7).map((item, index) => {
          const isSelected = index === selectedDayIndex;
          const meta = getWeatherMeta(item.weatherCode);

          // Proportional bar offsets
          const leftPercent = Math.max(0, Math.min(100, ((item.tempMin - globalMin) / tempSpan) * 100));
          const rightPercent = Math.max(0, Math.min(100, ((globalMax - item.tempMax) / tempSpan) * 100));
          const widthPercent = Math.max(10, 100 - leftPercent - rightPercent);

          return (
            <button
              key={item.date}
              id={`forecast-day-card-${index}`}
              type="button"
              onClick={() => onSelectDay(index)}
              className={`p-3.5 rounded-2xl text-left flex flex-col justify-between transition-all duration-200 relative group cursor-pointer border ${
                isSelected
                  ? 'bg-sky-400/20 border-sky-400/50 backdrop-blur-md ring-1 ring-sky-400/60 shadow-[0_0_18px_rgba(56,189,248,0.25)]'
                  : 'bg-white/5 hover:bg-white/15 border-white/10 backdrop-blur-md'
              }`}
            >
              {/* Day Header */}
              <div className="flex items-center justify-between w-full">
                <span className={`text-sm font-bold ${isSelected ? 'text-sky-300' : 'text-white'}`}>
                  {formatDayName(item.date, index)}
                </span>
                <span className="text-[11px] text-sky-200/60 font-medium">
                  {formatDateSub(item.date)}
                </span>
              </div>

              {/* Icon & Rain chance */}
              <div className="my-3 flex items-center justify-between">
                <WeatherIcon weatherCode={item.weatherCode} className="w-8 h-8" />
                {item.precipitationProbabilityMax > 15 ? (
                  <div className="flex items-center gap-0.5 text-xs font-semibold text-sky-300">
                    <CloudRain className="w-3.5 h-3.5" />
                    <span>{item.precipitationProbabilityMax}%</span>
                  </div>
                ) : (
                  <span className="text-[11px] text-slate-400">Dry</span>
                )}
              </div>

              {/* Weather label summary */}
              <div className="text-xs text-slate-300 line-clamp-1 font-medium mb-2.5">
                {meta.label}
              </div>

              {/* Proportional Range Bar */}
              <div className="w-full mt-auto pt-2 border-t border-white/10">
                <div className="flex items-center justify-between text-xs font-semibold tabular-nums mb-1">
                  <span className="text-sky-300">{item.tempMin}{tempSymbol}</span>
                  <span className="text-rose-300">{item.tempMax}{tempSymbol}</span>
                </div>
                
                <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden relative">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-sky-400 via-amber-400 to-rose-500 absolute"
                    style={{
                      left: `${leftPercent}%`,
                      width: `${widthPercent}%`,
                    }}
                  />
                </div>
              </div>

              {isSelected && (
                <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-sky-400 rounded-full shadow-[0_0_8px_#38bdf8]" />
              )}
            </button>
          );
        })}
      </div>

      {/* Selected Day Inspection Detailed Drawer */}
      {selectedDay && (
        <div className="p-4 sm:p-5 bg-white/5 backdrop-blur-xl border-t border-white/10 transition-colors">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-3">
              <WeatherIcon weatherCode={selectedDay.weatherCode} className="w-8 h-8" />
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span>Inspection for {formatDayName(selectedDay.date, selectedDayIndex)}</span>
                  <span className="text-xs font-medium text-sky-200/70">
                    ({formatDateSub(selectedDay.date)})
                  </span>
                </h3>
                <p className="text-xs text-sky-200/60">
                  {selectedMeta.description}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="text-right">
                <div className="text-sm font-bold text-white">
                  Range: <span className="text-sky-300">{selectedDay.tempMin}{tempSymbol}</span> to{' '}
                  <span className="text-rose-300">{selectedDay.tempMax}{tempSymbol}</span>
                </div>
                <div className="text-xs text-slate-400">
                  Feels: {selectedDay.apparentTempMin}{tempSymbol} to {selectedDay.apparentTempMax}{tempSymbol}
                </div>
              </div>
            </div>
          </div>

          {/* Key Metrics Breakdown for Selected Day */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
            <div className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 text-xs transition-colors">
              <div className="flex items-center gap-1.5 text-sky-300/80 mb-1">
                <CloudRain className="w-3.5 h-3.5 text-sky-400" />
                <span>Precipitation</span>
              </div>
              <div className="text-sm font-bold text-white">
                {selectedDay.precipitationProbabilityMax}% chance
              </div>
              <div className="text-[11px] text-slate-400">
                {selectedDay.precipitationSum} mm total
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 text-xs transition-colors">
              <div className="flex items-center gap-1.5 text-sky-300/80 mb-1">
                <Wind className="w-3.5 h-3.5 text-sky-400" />
                <span>Peak Wind</span>
              </div>
              <div className="text-sm font-bold text-white">
                {selectedDay.windSpeedMax} {windSymbol}
              </div>
              <div className="text-[11px] text-slate-400">
                {selectedDay.windSpeedMax > 30 ? 'Gusty conditions' : 'Gentle to moderate'}
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 text-xs transition-colors">
              <div className="flex items-center gap-1.5 text-sky-300/80 mb-1">
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                <span>Max UV Radiation</span>
              </div>
              <div className="text-sm font-bold text-white">
                Index {selectedDay.uvIndexMax}
              </div>
              <div className="text-[11px] text-slate-400">
                {selectedDay.uvIndexMax >= 6 ? 'High risk; sunscreen advised' : 'Moderate or low exposure'}
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 text-xs transition-colors">
              <div className="flex items-center gap-1.5 text-sky-300/80 mb-1">
                <Sunrise className="w-3.5 h-3.5 text-amber-400" />
                <span>Daylight Span</span>
              </div>
              <div className="text-sm font-bold text-white">
                {formatSunTime(selectedDay.sunrise)} - {formatSunTime(selectedDay.sunset)}
              </div>
              <div className="text-[11px] text-slate-400">
                Solar progression
              </div>
            </div>
          </div>

          {/* Hourly Timeline if available for this selected day */}
          {selectedDayHourly.length > 0 && (
            <div>
              <span className="text-xs font-semibold text-slate-300 block mb-2">
                Hourly Timeline for {formatDayName(selectedDay.date, selectedDayIndex)}
              </span>
              <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                {selectedDayHourly.slice(0, 12).map((hour) => {
                  const timeLabel = hour.time.slice(11, 16);
                  return (
                    <div
                      key={hour.time}
                      className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-center min-w-[70px] shrink-0 backdrop-blur-md transition-colors"
                    >
                      <span className="text-[11px] font-medium text-slate-400 block mb-1">
                        {timeLabel}
                      </span>
                      <WeatherIcon weatherCode={hour.weatherCode} className="w-5 h-5 mx-auto mb-1" />
                      <span className="text-xs font-bold text-white block">
                        {hour.temperature}{tempSymbol}
                      </span>
                      {hour.precipitationProbability > 0 && (
                        <span className="text-[10px] text-sky-400 font-medium block">
                          {hour.precipitationProbability}%
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

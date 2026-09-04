import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
} from 'recharts';
import { TrendingUp, Clock, Calendar } from 'lucide-react';
import { DailyForecastItem, HourlyForecastItem, TempUnit } from '../types';
import { getWeatherMeta } from '../utils/weatherCodes';

interface WeatherChartsProps {
  daily: DailyForecastItem[];
  hourly: HourlyForecastItem[];
  tempUnit: TempUnit;
  timezone: string;
}

export const WeatherCharts: React.FC<WeatherChartsProps> = ({
  daily,
  hourly,
  tempUnit,
  timezone,
}) => {
  const [viewMode, setViewMode] = useState<'daily' | 'hourly'>('daily');
  const tempSymbol = tempUnit === 'celsius' ? '°C' : '°F';

  // Format 7-day data for recharts
  const dailyChartData = daily.slice(0, 7).map((item, index) => {
    let dayName = 'Today';
    if (index > 0) {
      try {
        const d = new Date(item.date + 'T12:00:00');
        dayName = new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(d);
      } catch {
        dayName = item.date;
      }
    }
    const meta = getWeatherMeta(item.weatherCode);
    return {
      day: dayName,
      date: item.date,
      high: item.tempMax,
      low: item.tempMin,
      precipChance: item.precipitationProbabilityMax,
      precipSum: item.precipitationSum,
      condition: meta.label,
    };
  });

  // Format 24-hour data for recharts
  const hourlyChartData = hourly.slice(0, 24).map((item) => {
    let hourLabel = item.time.slice(11, 16);
    try {
      const d = new Date(item.time);
      hourLabel = new Intl.DateTimeFormat('en-US', {
        timeZone: timezone,
        hour: 'numeric',
      }).format(d);
    } catch {
      // fallback
    }
    const meta = getWeatherMeta(item.weatherCode);
    return {
      hour: hourLabel,
      temp: item.temperature,
      feelsLike: item.apparentTemperature,
      precipChance: item.precipitationProbability,
      wind: item.windSpeed,
      condition: meta.label,
    };
  });

  // Custom Tooltip for Daily Chart
  const CustomDailyTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const dataPoint = payload[0].payload;
      return (
        <div className="bg-slate-900/90 backdrop-blur-2xl text-white p-3.5 rounded-2xl shadow-2xl border border-white/20 text-xs">
          <div className="font-bold text-sm mb-1 text-sky-300">{label}</div>
          <div className="text-slate-300 mb-1.5">{dataPoint.condition}</div>
          <div className="space-y-1">
            <div className="flex items-center justify-between gap-4 text-rose-300">
              <span>High:</span>
              <span className="font-semibold">{dataPoint.high}{tempSymbol}</span>
            </div>
            <div className="flex items-center justify-between gap-4 text-sky-300">
              <span>Low:</span>
              <span className="font-semibold">{dataPoint.low}{tempSymbol}</span>
            </div>
            {dataPoint.precipChance > 0 && (
              <div className="flex items-center justify-between gap-4 text-sky-200 pt-1 border-t border-white/10">
                <span>Rain Probability:</span>
                <span className="font-semibold">{dataPoint.precipChance}%</span>
              </div>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  // Custom Tooltip for Hourly Chart
  const CustomHourlyTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const dataPoint = payload[0].payload;
      return (
        <div className="bg-slate-900/90 backdrop-blur-2xl text-white p-3.5 rounded-2xl shadow-2xl border border-white/20 text-xs">
          <div className="font-bold text-sm mb-1 text-sky-300">{label}</div>
          <div className="text-slate-300 mb-1.5">{dataPoint.condition}</div>
          <div className="space-y-1">
            <div className="flex items-center justify-between gap-4 text-amber-300">
              <span>Temp:</span>
              <span className="font-semibold">{dataPoint.temp}{tempSymbol}</span>
            </div>
            <div className="flex items-center justify-between gap-4 text-slate-300">
              <span>Feels Like:</span>
              <span className="font-semibold">{dataPoint.feelsLike}{tempSymbol}</span>
            </div>
            <div className="flex items-center justify-between gap-4 text-sky-200 pt-1 border-t border-white/10">
              <span>Rain Chance:</span>
              <span className="font-semibold">{dataPoint.precipChance}%</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div id="weather-charts-card" className="w-full bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl overflow-hidden">
      {/* Chart Header & Toggle Controls */}
      <div className="p-5 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-sky-400" />
            <span>Meteorological Trend Analytics</span>
          </h2>
          <p className="text-xs text-sky-200/70 mt-0.5">
            {viewMode === 'daily'
              ? '7-Day High & Low temperature curves and thermal trajectories'
              : 'Hourly temperature curve & rain probability for the next 24 hours'}
          </p>
        </div>

        {/* Segmented Controller Button Toggle */}
        <div className="flex items-center bg-white/10 backdrop-blur-md p-1 rounded-2xl border border-white/15 text-xs self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setViewMode('daily')}
            className={`px-3 py-1.5 rounded-xl font-medium transition flex items-center gap-1.5 ${
              viewMode === 'daily'
                ? 'bg-sky-500/40 border border-sky-400/50 text-white shadow-xs font-semibold'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>7-Day Trend</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('hourly')}
            className={`px-3 py-1.5 rounded-xl font-medium transition flex items-center gap-1.5 ${
              viewMode === 'hourly'
                ? 'bg-sky-500/40 border border-sky-400/50 text-white shadow-xs font-semibold'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>24h Hourly</span>
          </button>
        </div>
      </div>

      {/* Chart Canvas Area */}
      <div className="p-4 sm:p-6">
        {viewMode === 'daily' ? (
          <div>
            <div className="flex items-center justify-end gap-5 text-xs text-slate-300 mb-3">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-rose-400 inline-block shadow-[0_0_8px_#f43f5e]" />
                <span>Max Temp (High)</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-sky-400 inline-block shadow-[0_0_8px_#38bdf8]" />
                <span>Min Temp (Low)</span>
              </span>
            </div>

            <div className="h-64 sm:h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={dailyChartData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorHigh" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="colorLow" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff" opacity={0.1} />
                  <XAxis
                    dataKey="day"
                    stroke="#94a3b8"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    dy={10}
                  />
                  <YAxis
                    stroke="#94a3b8"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    unit={tempSymbol}
                    domain={['auto', 'auto']}
                  />
                  <Tooltip content={<CustomDailyTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="high"
                    name="High Temp"
                    stroke="#f43f5e"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#colorHigh)"
                    activeDot={{ r: 5, fill: '#f43f5e' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="low"
                    name="Low Temp"
                    stroke="#38bdf8"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#colorLow)"
                    activeDot={{ r: 5, fill: '#38bdf8' }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-end gap-5 text-xs text-slate-300 mb-3">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-amber-400 inline-block shadow-[0_0_8px_#fbbf24]" />
                <span>Hourly Temperature</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-sky-400 inline-block shadow-[0_0_8px_#38bdf8]" />
                <span>Rain Probability</span>
              </span>
            </div>

            <div className="h-64 sm:h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={hourlyChartData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff" opacity={0.1} />
                  <XAxis
                    dataKey="hour"
                    stroke="#94a3b8"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    dy={10}
                    interval={2}
                  />
                  <YAxis
                    stroke="#94a3b8"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    unit={tempSymbol}
                    domain={['auto', 'auto']}
                  />
                  <Tooltip content={<CustomHourlyTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="temp"
                    name="Temperature"
                    stroke="#fbbf24"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#colorTemp)"
                    activeDot={{ r: 5, fill: '#fbbf24' }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

import React, { useState, useEffect, useCallback } from 'react';
import { GeoCity, WeatherData, TempUnit, WindUnit } from './types';
import { POPULAR_CITIES, fetchWeatherData, reverseGeocodeCoords } from './services/weatherApi';
import { generateWeatherIntelligence } from './utils/recommendations';
import { getWeatherMeta } from './utils/weatherCodes';
import { Header } from './components/Header';
import { CurrentWeather } from './components/CurrentWeather';
import { WeeklyForecast } from './components/WeeklyForecast';
import { WeatherCharts } from './components/WeatherCharts';
import { SmartRecommendations } from './components/SmartRecommendations';
import { WeatherSkeleton } from './components/WeatherSkeleton';
import { ErrorMessage } from './components/ErrorMessage';
import { ShieldCheck, Cloud, RefreshCw } from 'lucide-react';

export default function App() {
  const [currentCity, setCurrentCity] = useState<GeoCity>(() => {
    try {
      const saved = localStorage.getItem('weather_selected_city');
      return saved ? JSON.parse(saved) : POPULAR_CITIES[0]; // London default
    } catch {
      return POPULAR_CITIES[0];
    }
  });

  const [tempUnit, setTempUnit] = useState<TempUnit>(() => {
    try {
      return (localStorage.getItem('weather_temp_unit') as TempUnit) || 'celsius';
    } catch {
      return 'celsius';
    }
  });

  const [windUnit, setWindUnit] = useState<WindUnit>(() => {
    try {
      return (localStorage.getItem('weather_wind_unit') as WindUnit) || 'kmh';
    } catch {
      return 'kmh';
    }
  });

  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Load weather data for the active city
  const loadWeather = useCallback(
    async (city: GeoCity, showRefreshSpinner = false) => {
      if (showRefreshSpinner) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }
      setError(null);

      try {
        const data = await fetchWeatherData(city, tempUnit, windUnit);
        setWeatherData(data);
        // Reset selected day if out of bounds
        setSelectedDayIndex(0);
        try {
          localStorage.setItem('weather_selected_city', JSON.stringify(city));
        } catch {
          // ignore
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message || 'Failed to fetch weather forecast');
        } else {
          setError('Unable to connect to Open-Meteo weather services. Please check your network.');
        }
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [tempUnit, windUnit]
  );

  useEffect(() => {
    loadWeather(currentCity);
  }, [currentCity, loadWeather]);

  const handleCitySelect = (city: GeoCity) => {
    setCurrentCity(city);
  };

  const handleToggleTempUnit = () => {
    const nextUnit: TempUnit = tempUnit === 'celsius' ? 'fahrenheit' : 'celsius';
    setTempUnit(nextUnit);
    try {
      localStorage.setItem('weather_temp_unit', nextUnit);
    } catch {
      // ignore
    }
  };

  const handleToggleWindUnit = () => {
    const nextUnit: WindUnit = windUnit === 'kmh' ? 'mph' : 'kmh';
    setWindUnit(nextUnit);
    try {
      localStorage.setItem('weather_wind_unit', nextUnit);
    } catch {
      // ignore
    }
  };

  const handleLocateUser = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          const userCity = await reverseGeocodeCoords(lat, lon);
          setCurrentCity(userCity);
        } catch {
          setError('Unable to resolve current geographical location.');
        } finally {
          setIsLocating(false);
        }
      },
      (geoError) => {
        setIsLocating(false);
        if (geoError.code === geoError.PERMISSION_DENIED) {
          setError('Location access was denied. Please allow location access or search for your city.');
        } else {
          setError('Unable to retrieve current location. Please search manually.');
        }
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const weatherMeta = weatherData ? getWeatherMeta(weatherData.current.weatherCode, weatherData.current.isDay) : null;
  const intelligence = weatherData
    ? generateWeatherIntelligence(
        weatherData.current,
        weatherData.daily[selectedDayIndex] || weatherData.daily[0]
      )
    : null;

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 flex flex-col font-sans relative overflow-x-hidden selection:bg-sky-500 selection:text-white">
      {/* Frosted Glass Atmospheric Background Gradients & Glow Orbs */}
      <div className="fixed inset-0 z-0 bg-gradient-to-tr from-indigo-950 via-sky-950 to-slate-950 opacity-70 pointer-events-none" />
      <div className="fixed top-[-10%] left-[-10%] w-[550px] h-[550px] bg-purple-600/20 blur-[130px] rounded-full pointer-events-none" />
      <div className="fixed top-[35%] right-[-10%] w-[500px] h-[500px] bg-sky-500/20 blur-[130px] rounded-full pointer-events-none" />
      <div className="fixed bottom-[-10%] left-[20%] w-[550px] h-[550px] bg-emerald-500/15 blur-[130px] rounded-full pointer-events-none" />

      {/* Top Header */}
      <Header
        currentCity={currentCity}
        onSelectCity={handleCitySelect}
        tempUnit={tempUnit}
        onToggleTempUnit={handleToggleTempUnit}
        windUnit={windUnit}
        onToggleWindUnit={handleToggleWindUnit}
        onLocateUser={handleLocateUser}
        isLocating={isLocating}
        onRefresh={() => loadWeather(currentCity, true)}
        isRefreshing={isRefreshing}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10">
        {isLoading && !weatherData && <WeatherSkeleton />}

        {error && !isLoading && (
          <ErrorMessage
            message={error}
            onRetry={() => loadWeather(currentCity)}
            onSelectCity={handleCitySelect}
          />
        )}

        {weatherData && (
          <div className="space-y-6">
            {/* 1. Hero Current Weather Card */}
            <CurrentWeather
              data={weatherData}
              tempUnit={tempUnit}
              windUnit={windUnit}
            />

            {/* 2. 7-Day Interactive Forecast Cards & Selected Day Breakdown */}
            <WeeklyForecast
              daily={weatherData.daily}
              hourly={weatherData.hourly}
              selectedDayIndex={selectedDayIndex}
              onSelectDay={setSelectedDayIndex}
              tempUnit={tempUnit}
              windUnit={windUnit}
              timezone={weatherData.timezone}
            />

            {/* 3. Meteorological Trends Visualization (Daily + Hourly) */}
            <WeatherCharts
              daily={weatherData.daily}
              hourly={weatherData.hourly}
              tempUnit={tempUnit}
              timezone={weatherData.timezone}
            />

            {/* 4. Smart Dynamic Clothing & Activity Recommendations */}
            {intelligence && (
              <SmartRecommendations intelligence={intelligence} />
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-white/10 bg-slate-900/40 backdrop-blur-md py-5 mt-auto relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-200">Weather Intelligence</span>
            <span>•</span>
            <span className="text-sky-300/80">Real-time Geocoding & High-Resolution Forecast</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Open-Meteo Open Data</span>
            </span>
            <span>•</span>
            <span>WMO Compliant</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export interface GeoCity {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  elevation?: number;
  feature_code?: string;
  country_code?: string;
  country?: string;
  country_id?: number;
  admin1?: string;
  admin2?: string;
  timezone?: string;
  population?: number;
}

export interface CurrentWeatherState {
  time: string;
  temperature: number;
  apparentTemperature: number;
  relativeHumidity: number;
  isDay: boolean;
  precipitation: number;
  weatherCode: number;
  windSpeed: number;
  windDirection: number;
  uvIndex: number;
  surfacePressure?: number;
}

export interface DailyForecastItem {
  date: string;
  weatherCode: number;
  tempMax: number;
  tempMin: number;
  apparentTempMax: number;
  apparentTempMin: number;
  sunrise: string;
  sunset: string;
  uvIndexMax: number;
  precipitationSum: number;
  precipitationProbabilityMax: number;
  windSpeedMax: number;
}

export interface HourlyForecastItem {
  time: string;
  temperature: number;
  apparentTemperature: number;
  precipitationProbability: number;
  precipitation: number;
  weatherCode: number;
  windSpeed: number;
}

export interface WeatherData {
  city: GeoCity;
  current: CurrentWeatherState;
  daily: DailyForecastItem[];
  hourly: HourlyForecastItem[];
  timezone: string;
  updatedAt: string;
}

export type TempUnit = 'celsius' | 'fahrenheit';
export type WindUnit = 'kmh' | 'mph';

export interface ClothingRecommendation {
  summary: string;
  top: string;
  bottom: string;
  outerwear: string;
  footwear: string;
  accessories: string[];
  alert?: string;
}

export interface ActivityScore {
  name: string;
  score: number; // 0 - 100
  label: 'Ideal' | 'Good' | 'Fair' | 'Challenging' | 'Not Recommended';
  reason: string;
  icon: string;
}

export interface WeatherIntelligence {
  clothing: ClothingRecommendation;
  activities: ActivityScore[];
  generalAdvice: string;
  comfortIndex: number; // 0 - 100
  comfortLabel: string;
}

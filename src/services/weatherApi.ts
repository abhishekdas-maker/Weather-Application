import { GeoCity, WeatherData, TempUnit, WindUnit, DailyForecastItem, HourlyForecastItem } from '../types';

export const POPULAR_CITIES: GeoCity[] = [
  {
    id: 5128581,
    name: 'New York',
    country: 'United States',
    country_code: 'US',
    admin1: 'New York',
    latitude: 40.7128,
    longitude: -74.006,
    timezone: 'America/New_York',
  },
  {
    id: 2643743,
    name: 'London',
    country: 'United Kingdom',
    country_code: 'GB',
    admin1: 'England',
    latitude: 51.5085,
    longitude: -0.1257,
    timezone: 'Europe/London',
  },
  {
    id: 1850147,
    name: 'Tokyo',
    country: 'Japan',
    country_code: 'JP',
    admin1: 'Tokyo',
    latitude: 35.6895,
    longitude: 139.6917,
    timezone: 'Asia/Tokyo',
  },
  {
    id: 2988507,
    name: 'Paris',
    country: 'France',
    country_code: 'FR',
    admin1: 'Île-de-France',
    latitude: 48.8534,
    longitude: 2.3488,
    timezone: 'Europe/Paris',
  },
  {
    id: 5391959,
    name: 'San Francisco',
    country: 'United States',
    country_code: 'US',
    admin1: 'California',
    latitude: 37.7749,
    longitude: -122.4194,
    timezone: 'America/Los_Angeles',
  },
  {
    id: 2147714,
    name: 'Sydney',
    country: 'Australia',
    country_code: 'AU',
    admin1: 'New South Wales',
    latitude: -33.8678,
    longitude: 151.2073,
    timezone: 'Australia/Sydney',
  },
];

export async function searchCities(query: string): Promise<GeoCity[]> {
  const trimmed = query.trim();
  if (trimmed.length < 2) return [];

  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
    trimmed
  )}&count=8&language=en&format=json`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Geocoding failed with status: ${response.status}`);
    }
    const data = await response.json();
    if (!data.results || !Array.isArray(data.results)) {
      return [];
    }
    return data.results as GeoCity[];
  } catch (err: unknown) {
    if (err instanceof Error) {
      throw new Error(err.message || 'Failed to search cities');
    }
    throw new Error('Network error during geocoding search');
  }
}

export async function fetchWeatherData(
  city: GeoCity,
  tempUnit: TempUnit = 'celsius',
  windUnit: WindUnit = 'kmh'
): Promise<WeatherData> {
  const params = new URLSearchParams({
    latitude: city.latitude.toString(),
    longitude: city.longitude.toString(),
    current:
      'temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m,wind_direction_10m,surface_pressure,uv_index',
    hourly:
      'temperature_2m,apparent_temperature,precipitation_probability,precipitation,weather_code,wind_speed_10m',
    daily:
      'weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,uv_index_max,precipitation_sum,precipitation_probability_max,wind_speed_10m_max',
    timezone: city.timezone || 'auto',
    temperature_unit: tempUnit,
    wind_speed_unit: windUnit,
  });

  const url = `https://api.open-meteo.com/v1/forecast?${params.toString()}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Weather service returned HTTP ${response.status}`);
    }
    const json = await response.json();

    const current = {
      time: json.current?.time || new Date().toISOString(),
      temperature: Math.round((json.current?.temperature_2m ?? 0) * 10) / 10,
      apparentTemperature: Math.round((json.current?.apparent_temperature ?? 0) * 10) / 10,
      relativeHumidity: json.current?.relative_humidity_2m ?? 50,
      isDay: Boolean(json.current?.is_day ?? 1),
      precipitation: json.current?.precipitation ?? 0,
      weatherCode: json.current?.weather_code ?? 0,
      windSpeed: Math.round((json.current?.wind_speed_10m ?? 0) * 10) / 10,
      windDirection: json.current?.wind_direction_10m ?? 0,
      uvIndex: json.current?.uv_index ?? 0,
      surfacePressure: json.current?.surface_pressure ?? 1013,
    };

    const daily: DailyForecastItem[] = [];
    if (json.daily && Array.isArray(json.daily.time)) {
      const count = json.daily.time.length;
      for (let i = 0; i < count; i++) {
        daily.push({
          date: json.daily.time[i],
          weatherCode: json.daily.weather_code?.[i] ?? 0,
          tempMax: Math.round(json.daily.temperature_2m_max?.[i] ?? 0),
          tempMin: Math.round(json.daily.temperature_2m_min?.[i] ?? 0),
          apparentTempMax: Math.round(json.daily.apparent_temperature_max?.[i] ?? 0),
          apparentTempMin: Math.round(json.daily.apparent_temperature_min?.[i] ?? 0),
          sunrise: json.daily.sunrise?.[i] || '',
          sunset: json.daily.sunset?.[i] || '',
          uvIndexMax: json.daily.uv_index_max?.[i] ?? 0,
          precipitationSum: json.daily.precipitation_sum?.[i] ?? 0,
          precipitationProbabilityMax: json.daily.precipitation_probability_max?.[i] ?? 0,
          windSpeedMax: Math.round(json.daily.wind_speed_10m_max?.[i] ?? 0),
        });
      }
    }

    const hourly: HourlyForecastItem[] = [];
    if (json.hourly && Array.isArray(json.hourly.time)) {
      // Get the next 24-36 hours relative to current time index
      const currentTimeStr = json.current?.time;
      let startIndex = 0;
      if (currentTimeStr) {
        const foundIndex = json.hourly.time.findIndex((t: string) => t >= currentTimeStr);
        if (foundIndex >= 0) {
          startIndex = foundIndex;
        }
      }
      const endIndex = Math.min(json.hourly.time.length, startIndex + 24);

      for (let i = startIndex; i < endIndex; i++) {
        hourly.push({
          time: json.hourly.time[i],
          temperature: Math.round(json.hourly.temperature_2m?.[i] ?? 0),
          apparentTemperature: Math.round(json.hourly.apparent_temperature?.[i] ?? 0),
          precipitationProbability: json.hourly.precipitation_probability?.[i] ?? 0,
          precipitation: json.hourly.precipitation?.[i] ?? 0,
          weatherCode: json.hourly.weather_code?.[i] ?? 0,
          windSpeed: Math.round(json.hourly.wind_speed_10m?.[i] ?? 0),
        });
      }
    }

    return {
      city,
      current,
      daily,
      hourly,
      timezone: json.timezone || city.timezone || 'UTC',
      updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
  } catch (err: unknown) {
    if (err instanceof Error) {
      throw new Error(err.message || 'Unable to fetch forecast data');
    }
    throw new Error('Network error while retrieving forecast');
  }
}

export async function reverseGeocodeCoords(lat: number, lon: number): Promise<GeoCity> {
  try {
    const res = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`);
    if (res.ok) {
      const data = await res.json();
      const cityName = data.city || data.locality || data.principalSubdivision || 'My Location';
      return {
        id: Math.floor(Math.random() * 1000000),
        name: cityName,
        country: data.countryName || '',
        country_code: data.countryCode || '',
        admin1: data.principalSubdivision || '',
        latitude: lat,
        longitude: lon,
      };
    }
  } catch {
    // fallback below
  }

  return {
    id: Math.floor(Math.random() * 1000000),
    name: 'Current Location',
    country: '',
    country_code: '',
    latitude: lat,
    longitude: lon,
  };
}

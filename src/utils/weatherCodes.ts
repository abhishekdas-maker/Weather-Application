export interface WeatherMeta {
  label: string;
  description: string;
  iconName: 'Sun' | 'Moon' | 'CloudSun' | 'CloudMoon' | 'Cloud' | 'CloudFog' | 'CloudDrizzle' | 'CloudRain' | 'CloudSnow' | 'CloudLightning' | 'Snowflake';
  category: 'clear' | 'partlyCloudy' | 'cloudy' | 'fog' | 'drizzle' | 'rain' | 'snow' | 'thunderstorm';
  themeColor: {
    bgLight: string;
    textAccent: string;
    badgeBg: string;
    badgeBorder: string;
  };
}

export function getWeatherMeta(code: number, isDay: boolean = true): WeatherMeta {
  switch (code) {
    case 0:
      return {
        label: isDay ? 'Clear Sky' : 'Clear Night',
        description: isDay ? 'Bright sunny conditions with unobstructed skies' : 'Starlit and calm clear skies',
        iconName: isDay ? 'Sun' : 'Moon',
        category: 'clear',
        themeColor: {
          bgLight: 'from-amber-500/10 to-orange-500/5',
          textAccent: 'text-amber-600 dark:text-amber-400',
          badgeBg: 'bg-amber-50 dark:bg-amber-950/40',
          badgeBorder: 'border-amber-200 dark:border-amber-800/60',
        },
      };

    case 1:
      return {
        label: isDay ? 'Mainly Sunny' : 'Mainly Clear',
        description: 'Pleasant conditions with sparse high clouds',
        iconName: isDay ? 'CloudSun' : 'CloudMoon',
        category: 'partlyCloudy',
        themeColor: {
          bgLight: 'from-sky-500/10 to-amber-500/5',
          textAccent: 'text-sky-600 dark:text-sky-400',
          badgeBg: 'bg-sky-50 dark:bg-sky-950/40',
          badgeBorder: 'border-sky-200 dark:border-sky-800/60',
        },
      };

    case 2:
      return {
        label: 'Partly Cloudy',
        description: 'Scattered clouds with periods of filtered sunshine',
        iconName: isDay ? 'CloudSun' : 'CloudMoon',
        category: 'partlyCloudy',
        themeColor: {
          bgLight: 'from-sky-500/10 to-slate-500/5',
          textAccent: 'text-blue-600 dark:text-blue-400',
          badgeBg: 'bg-blue-50 dark:bg-blue-950/40',
          badgeBorder: 'border-blue-200 dark:border-blue-800/60',
        },
      };

    case 3:
      return {
        label: 'Overcast',
        description: 'Continuous cloud cover with diffuse daylight',
        iconName: 'Cloud',
        category: 'cloudy',
        themeColor: {
          bgLight: 'from-slate-500/10 to-gray-500/5',
          textAccent: 'text-slate-600 dark:text-slate-400',
          badgeBg: 'bg-slate-100 dark:bg-slate-800/50',
          badgeBorder: 'border-slate-200 dark:border-slate-700',
        },
      };

    case 45:
    case 48:
      return {
        label: code === 48 ? 'Depositing Rime Fog' : 'Foggy',
        description: 'Reduced visibility due to dense surface condensation',
        iconName: 'CloudFog',
        category: 'fog',
        themeColor: {
          bgLight: 'from-zinc-500/10 to-slate-500/5',
          textAccent: 'text-zinc-600 dark:text-zinc-400',
          badgeBg: 'bg-zinc-100 dark:bg-zinc-800/50',
          badgeBorder: 'border-zinc-300 dark:border-zinc-700',
        },
      };

    case 51:
    case 53:
    case 55:
      return {
        label: code === 51 ? 'Light Drizzle' : code === 53 ? 'Moderate Drizzle' : 'Dense Drizzle',
        description: 'Fine liquid precipitation causing damp pavement and surfaces',
        iconName: 'CloudDrizzle',
        category: 'drizzle',
        themeColor: {
          bgLight: 'from-teal-500/10 to-cyan-500/5',
          textAccent: 'text-teal-600 dark:text-teal-400',
          badgeBg: 'bg-teal-50 dark:bg-teal-950/40',
          badgeBorder: 'border-teal-200 dark:border-teal-800/60',
        },
      };

    case 56:
    case 57:
      return {
        label: 'Freezing Drizzle',
        description: 'Supercooled drizzle freezing on impact; slick surfaces likely',
        iconName: 'CloudDrizzle',
        category: 'drizzle',
        themeColor: {
          bgLight: 'from-cyan-500/10 to-blue-500/5',
          textAccent: 'text-cyan-700 dark:text-cyan-300',
          badgeBg: 'bg-cyan-50 dark:bg-cyan-950/40',
          badgeBorder: 'border-cyan-200 dark:border-cyan-800/60',
        },
      };

    case 61:
    case 63:
    case 65:
      return {
        label: code === 61 ? 'Slight Rain' : code === 63 ? 'Moderate Rain' : 'Heavy Rain',
        description: code === 65 ? 'Heavy continuous rainfall with surface runoff' : 'Steady rainfall; water-resistant gear recommended',
        iconName: 'CloudRain',
        category: 'rain',
        themeColor: {
          bgLight: 'from-blue-500/10 to-indigo-500/5',
          textAccent: 'text-blue-600 dark:text-blue-400',
          badgeBg: 'bg-blue-50 dark:bg-blue-950/40',
          badgeBorder: 'border-blue-200 dark:border-blue-800/60',
        },
      };

    case 66:
    case 67:
      return {
        label: 'Freezing Rain',
        description: 'Hazardous rain freezing upon contact with roadway structures',
        iconName: 'CloudRain',
        category: 'rain',
        themeColor: {
          bgLight: 'from-indigo-500/10 to-cyan-500/5',
          textAccent: 'text-indigo-600 dark:text-indigo-400',
          badgeBg: 'bg-indigo-50 dark:bg-indigo-950/40',
          badgeBorder: 'border-indigo-200 dark:border-indigo-800/60',
        },
      };

    case 71:
    case 73:
    case 75:
      return {
        label: code === 71 ? 'Light Snow' : code === 73 ? 'Moderate Snow' : 'Heavy Snowfall',
        description: 'Falling crystalline snow with potential accumulation',
        iconName: 'CloudSnow',
        category: 'snow',
        themeColor: {
          bgLight: 'from-sky-400/10 to-indigo-400/5',
          textAccent: 'text-sky-600 dark:text-sky-300',
          badgeBg: 'bg-sky-50 dark:bg-sky-950/40',
          badgeBorder: 'border-sky-200 dark:border-sky-800/60',
        },
      };

    case 77:
      return {
        label: 'Snow Grains',
        description: 'Opaque white ice grains falling in small quantities',
        iconName: 'Snowflake',
        category: 'snow',
        themeColor: {
          bgLight: 'from-slate-400/10 to-sky-400/5',
          textAccent: 'text-slate-600 dark:text-slate-300',
          badgeBg: 'bg-slate-50 dark:bg-slate-900/40',
          badgeBorder: 'border-slate-200 dark:border-slate-800',
        },
      };

    case 80:
    case 81:
    case 82:
      return {
        label: code === 80 ? 'Light Showers' : code === 81 ? 'Passing Showers' : 'Violent Rain Showers',
        description: 'Intermittent shower bursts with rapid shifts in intensity',
        iconName: 'CloudRain',
        category: 'rain',
        themeColor: {
          bgLight: 'from-blue-600/10 to-cyan-600/5',
          textAccent: 'text-blue-700 dark:text-blue-300',
          badgeBg: 'bg-blue-50 dark:bg-blue-950/40',
          badgeBorder: 'border-blue-200 dark:border-blue-800/60',
        },
      };

    case 85:
    case 86:
      return {
        label: code === 85 ? 'Slight Snow Showers' : 'Heavy Snow Showers',
        description: 'Brisk snow squalls with sudden gusty conditions',
        iconName: 'CloudSnow',
        category: 'snow',
        themeColor: {
          bgLight: 'from-cyan-500/10 to-slate-500/5',
          textAccent: 'text-cyan-600 dark:text-cyan-300',
          badgeBg: 'bg-cyan-50 dark:bg-cyan-950/40',
          badgeBorder: 'border-cyan-200 dark:border-cyan-800/60',
        },
      };

    case 95:
      return {
        label: 'Thunderstorm',
        description: 'Atmospheric instability with lightning, thunder, and wind gusts',
        iconName: 'CloudLightning',
        category: 'thunderstorm',
        themeColor: {
          bgLight: 'from-purple-500/10 to-amber-500/5',
          textAccent: 'text-purple-600 dark:text-purple-400',
          badgeBg: 'bg-purple-50 dark:bg-purple-950/40',
          badgeBorder: 'border-purple-200 dark:border-purple-800/60',
        },
      };

    case 96:
    case 99:
      return {
        label: 'Thunderstorm with Hail',
        description: 'Severe storm activity with hail pellets and high wind gusts',
        iconName: 'CloudLightning',
        category: 'thunderstorm',
        themeColor: {
          bgLight: 'from-rose-500/10 to-purple-500/5',
          textAccent: 'text-rose-600 dark:text-rose-400',
          badgeBg: 'bg-rose-50 dark:bg-rose-950/40',
          badgeBorder: 'border-rose-200 dark:border-rose-800/60',
        },
      };

    default:
      return {
        label: 'Variable Conditions',
        description: 'Typical atmospheric conditions',
        iconName: 'Cloud',
        category: 'cloudy',
        themeColor: {
          bgLight: 'from-slate-500/10 to-zinc-500/5',
          textAccent: 'text-slate-600 dark:text-slate-400',
          badgeBg: 'bg-slate-50 dark:bg-slate-900/40',
          badgeBorder: 'border-slate-200 dark:border-slate-700',
        },
      };
  }
}

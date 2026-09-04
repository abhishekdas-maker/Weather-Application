import React from 'react';
import {
  Sun,
  Moon,
  CloudSun,
  CloudMoon,
  Cloud,
  CloudFog,
  CloudDrizzle,
  CloudRain,
  CloudSnow,
  CloudLightning,
  Snowflake,
} from 'lucide-react';
import { getWeatherMeta } from '../utils/weatherCodes';

interface WeatherIconProps {
  weatherCode: number;
  isDay?: boolean;
  className?: string;
  size?: number;
}

export const WeatherIcon: React.FC<WeatherIconProps> = ({
  weatherCode,
  isDay = true,
  className = 'w-8 h-8',
  size,
}) => {
  const meta = getWeatherMeta(weatherCode, isDay);
  const iconProps = {
    className,
    size: size ?? undefined,
    strokeWidth: 2,
  };

  switch (meta.iconName) {
    case 'Sun':
      return <Sun {...iconProps} className={`${className} text-amber-500`} />;
    case 'Moon':
      return <Moon {...iconProps} className={`${className} text-indigo-400`} />;
    case 'CloudSun':
      return <CloudSun {...iconProps} className={`${className} text-amber-500`} />;
    case 'CloudMoon':
      return <CloudMoon {...iconProps} className={`${className} text-indigo-300`} />;
    case 'Cloud':
      return <Cloud {...iconProps} className={`${className} text-slate-400`} />;
    case 'CloudFog':
      return <CloudFog {...iconProps} className={`${className} text-zinc-400`} />;
    case 'CloudDrizzle':
      return <CloudDrizzle {...iconProps} className={`${className} text-teal-400`} />;
    case 'CloudRain':
      return <CloudRain {...iconProps} className={`${className} text-blue-500`} />;
    case 'CloudSnow':
      return <CloudSnow {...iconProps} className={`${className} text-sky-300`} />;
    case 'Snowflake':
      return <Snowflake {...iconProps} className={`${className} text-sky-400`} />;
    case 'CloudLightning':
      return <CloudLightning {...iconProps} className={`${className} text-purple-500`} />;
    default:
      return <Sun {...iconProps} className={`${className} text-amber-500`} />;
  }
};

export interface WeatherCondition {
  main: string;
  description: string;
  icon: string;
  id?: number;
}

export interface DailyForecast {
  dt: number;
  sunrise: number;
  sunset: number;
  temp: {
    max: number;
    min: number;
  };
  pop: number; 
  weather: WeatherCondition[];
}

export interface HourlyForecast {
  dt: number;
  temp: number;
  weather: WeatherCondition[];
}

export interface WeatherData {
  timezone_offset?: number;
  current: {
    dt: number;
    temp: number;
    wind_speed: number;
    humidity: number;
    feels_like: number;
    visibility: number;
    pressure: number;
    uvi: number;
    weather: WeatherCondition[];
    timezone_offset: number;
  };
  daily: DailyForecast[];
  hourly: HourlyForecast[];
  name?: string;
  sys?: {
    country: string;
  };
}

export interface WeatherHighlights {
  temp: number;
  wind: number;
  humidity: number;
  feels_like: number;
  weather: string;
  pressure: number;
  visibility: string;
  uv: number;
  uvText: string;
  tomorrowName: string;
  todayMax: number;
  todayMin: number;
  tomorrowMax: number;
  tomorrowMin: number;
  currentTime: string;
  rainChance: string;
}

export interface User {
  id: string;
  isPremium: boolean;
}

export interface CheckoutSessionResponse {
  url?: string;
  error: string;
}
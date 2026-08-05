'use client';
import { useState, useEffect } from "react";
import weatherApi from "./weatherApi";
import { getWeekday } from "./temp_date";
import { formatHour } from "./temp_date";
import { Interface } from "readline";
const API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
import { WeatherData, WeatherHighlights, DailyForecast } from "@/types/weather";

const useWeather = (initialLocation?: string) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [location, setLocation] = useState<string>(initialLocation ?? "");
  const [forecast, setForecast] = useState<any[] | null>(null);;
  const [highLights, setHighLights] = useState<WeatherHighlights | null>(null);
  const [cities, setCities] = useState<string[]>([]);
  const [citiesWeather, setCitiesWeather] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null)

  const fetchMainWeatherData = async () => {
    if (!location) return;
    try {
      setError(null);
      setLoading(true);
      const weatherData = await weatherApi.getWeatherData(location);
      if (weatherData) {
        setWeather(weatherData);
        setForecast(weatherData.daily);
        setHighLights(processHighlights(weatherData));
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const processHighlights = (weatherData: WeatherData): WeatherHighlights => {
    const { current, daily } = weatherData;
    const today = daily[0];
    const tomorrow = daily[1];

    const getUVDescription = (uv: number): string => {
      if (uv <= 2) return "Low";
      if (uv <= 5) return "Moderate";
      if (uv <= 7) return "High";
      if (uv <= 10) return "Very High";
      return "Extreme";
    };

    return {
      temp: current.temp,
      wind: current.wind_speed,
      humidity: current.humidity,
      feels_like: current.feels_like,
      weather: current.weather[0].main,
      visibility: (Number(current.visibility) / 1000).toFixed(1),
      pressure: current.pressure,
      uv: current.uvi,
      uvText: getUVDescription(current.uvi),
      tomorrowName: getWeekday(current.dt, 1),
      todayMax: Math.round(today.temp.max),
      todayMin: Math.round(today.temp.min),
      tomorrowMax: Math.round(tomorrow.temp.max),
      tomorrowMin: Math.round(tomorrow.temp.min),
      currentTime: formatHour(current.dt),
      rainChance: (today.pop * 100).toFixed(0)
    };
  };

  const fetchCitiesWeatherData = async () => {
    try {
      setLoading(true);
      const cityWeatherData = await weatherApi.getMultipleCitiesWeather(cities);
      setCitiesWeather(cityWeatherData);
    } catch (error: any) {
      setError(error.message);
      console.error("Error fetching cities weather: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialLocation) return;

    let cancelled = false;

    const detectLocation = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/location', { cache: 'no-store' });
        const result = await response.json();

        if (!response.ok || typeof result.city !== 'string') {
          throw new Error(result.error || 'Unable to detect your city');
        }

        if (!cancelled) setLocation(result.city);
      } catch (error: any) {
        if (!cancelled) {
          setError(error.message || 'Unable to detect your city');
          setLoading(false);
        }
      }
    };

    detectLocation();

    return () => {
      cancelled = true;
    };
  }, [initialLocation]);

  useEffect(() => {
    fetchMainWeatherData();
  }, [location]);

  useEffect(() => {
    if (cities.length > 0) fetchCitiesWeatherData();
  }, [cities]);

  return {
    weather,
    location,
    setLocation,
    forecast,
    highLights,
    citiesWeather,
    loading,
    error,
    cities,
  };
};

export default useWeather;

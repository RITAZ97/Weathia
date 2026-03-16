'use client';
import { useState, useEffect } from "react";
import weatherApi from "./weatherApi";
import { getWeekday } from "./temp_date";
import { formatHour } from "./temp_date";
const API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY;

const useWeather = (initialLocation = "Melbourne,AU") => {
  const [weather, setWeather] = useState(null);
  const [location, setLocation] = useState(initialLocation);
  const [forecast, setForecast] = useState(null);
  const [highLights, setHighLights] = useState(null);
  const [cities, setCities] = useState([]);
  const [citiesWeather, setCitiesWeather] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const processHighlights = (weatherData) => {
    const { current, daily } = weatherData;
    const today = daily[0];
    const tomorrow = daily[1];

    const getUVDescription = (uv) => {
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
      visibility: (current.visibility / 1000).toFixed(1),
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

  // const processSevenDayForecast = (dailyData) => {
  //   return dailyData.slice(1, 8).map((day) => {
  //     const date = new Date(day.dt * 1000);
  //     return {
  //       dayName: date.toLocaleDateString("en-US", { weekday: "long" }),
  //       maxTemp: Math.round(day.temp.max),
  //       minTemp: Math.round(day.temp.min),
  //       icon: day.weather[0].icon,
  //       condition: day.weather[0].main,
  //     };
  //   });
  // };

  const fetchCitiesWeatherData = async () => {
    try {
      setLoading(true);
      const cityWeatherData = await weatherApi.getMultipleCitiesWeather(cities);
      setCitiesWeather(cityWeatherData);
    } catch (error) {
      setError(error.message);
      console.error("Error fetching cities weather: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMainWeatherData();
  }, [location]);

  useEffect(() => {
    fetchCitiesWeatherData();
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
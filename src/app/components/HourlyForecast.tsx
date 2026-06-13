"use client";
import React, { useState, useEffect, FC } from 'react';
import { useSession } from 'next-auth/react'; 
import { WeatherData } from '@/types/weather';

interface HourlyForecastProps {
  weather: WeatherData | null;
  weatherData?: any[];
}

const HourlyForecast: FC<HourlyForecastProps> = ({ weather, weatherData = [] }) => {
  const { data: session } = useSession(); 
  const isLoggedIn = !!session;

  const [startIndex, setStartIndex] = useState(0);
  const displayCount = 12;
  const maxAllowedHours = isLoggedIn ? 24 : 12;

  const hourlyData = weather?.hourly?.slice(0, 24).map((item) => {
    const itemDate = new Date(item.dt * 1000).toLocaleDateString();
    const dayInfo = weather.daily.find(d =>
      new Date(d.dt * 1000).toLocaleDateString() === itemDate
    );
    const sunrise = dayInfo?.sunrise || weather.daily[0].sunrise;
    const sunset = dayInfo?.sunset || weather.daily[0].sunset;
    const isDaylight = item.dt > sunrise && item.dt < sunset;
    let weatherMain = item.weather[0].main.toLowerCase();
    let iconName = weatherMain;

    if (weatherMain === 'clear') {
      iconName = isDaylight ? 'clear-day' : 'clear-night';
    }
    const timezoneOffset = weather.timezone_offset || 0;
    return {
      ...item,
      iconName: iconName,
      displayTime: new Date((item.dt + timezoneOffset) * 1000).toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'UTC' 
      }),
      temp: Math.round(item.temp)
    };
  }) || [];

  useEffect(() => {
    if (weatherData.length === 0 || !weather) return;

    const targetDate = new Date((Date.now() / 1000 + (weather.timezone_offset ?? 0)) * 1000);
    const currentHour = targetDate.getUTCHours();

    const currentIndex = weatherData.findIndex(item => {
      const hourPart = parseInt(item.time.split(':')[0]);
      const isPM = item.time.includes('PM');
      const militaryHour = isPM && hourPart !== 12 ? hourPart + 12 : (!isPM && hourPart === 12 ? 0 : hourPart);
      return militaryHour >= currentHour;
    });

    if (currentIndex !== -1) {
      const maxIndex = Math.max(0, Math.min(weatherData.length, maxAllowedHours) - displayCount);
      const safeIndex = Math.min(currentIndex, maxIndex);
      setStartIndex(safeIndex);
    }
  }, [weatherData, maxAllowedHours]);

  const moveNext = () => {
    if (startIndex + displayCount < maxAllowedHours && startIndex + displayCount < hourlyData.length) {
      setStartIndex(startIndex + displayCount);
    }
  };

  const movePrev = () => {
    if (startIndex > 0) {
      setStartIndex(startIndex - displayCount);
    }
  };

  const isNextDisabled = startIndex + displayCount >= hourlyData.length || (!isLoggedIn && startIndex + displayCount >= maxAllowedHours);

  return (
    <div className="w-full mt-18 px-8 xl:px-15 rounded-2xl text-white">
      <h2 className="text-[20px] font-semibold pb-8 text-center">Hourly Forecast</h2>

      <div className="relative flex items-center px-4">
        <button
          onClick={movePrev}
          className={`absolute -left-2 z-10 p-2 hover:cursor-pointer transition-all ${startIndex === 0 ? "opacity-40 pointer-events-none" : "opacity-100"}`}
        >
          <img src="/icons/left.svg" className="w-4 h-auto object-contain" alt="left" />
        </button>

        <div className="w-full overflow-hidden">
          <div
            className="flex transition-transform duration-700 cubic-bezier(0.4, 0, 0.2, 1)"
            style={{
              transform: `translateX(-${startIndex * (100 / displayCount)}%)`
            }}
          >
            {hourlyData.map((item, id) => (
              <div
                key={id}
                className="flex-none w-[8.333333%] flex flex-col items-center group/item"
              >
                <div className="w-12 h-8 lg:h-12 rounded-full bg-transparent lg:bg-support2 flex justify-center items-center">
                  <img
                    src={`/icons/${item.iconName}.svg`}
                    className="w-5 h-auto object-contain"
                    alt={item.weather[0].description}
                  />
                </div>
                <div className="flex flex-col justify-center items-center lg:pt-2">
                  <p className="text-primary font-normal text-[12px] lg:text-[14px]">{id === 0 ? "Now" : item.displayTime}</p>
                  <h2 className="text-primary font-semibold">{item.temp}°</h2>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute -right-2 z-10 flex items-center justify-center group">
          <button
            onClick={moveNext}
            disabled={isNextDisabled}
            className="p-2 transition-all hover:cursor-pointer disabled:cursor-not-allowed disabled:opacity-40"
          >
            <img src="/icons/right.svg" className="w-4 h-auto object-contain" alt="right" />
          </button>
          {!isLoggedIn && isNextDisabled && (
            <div className="absolute bottom-full mb-2 hidden group-hover:flex flex-col items-center pointer-events-none animate-fadeIn">
              <div className="bg-white text-black text-[12px] font-medium py-1.5 px-3 rounded shadow-lg whitespace-nowrap border border-gray-200">
                Log in to unlock 24h forecast
              </div>
              <div className="w-2 h-2 bg-white rotate-45 -mt-1 border-r border-b border-gray-200"></div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default HourlyForecast;
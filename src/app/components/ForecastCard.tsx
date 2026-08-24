"use client";
import React from 'react';
import { getWeekday } from '@/utils/temp_date';
import MobileHourlyForecast from './MobileHourlyForecast';
import { WeatherData, WeatherHighlights } from '@/types/weather';

interface ForecastCardProps {
  weather: WeatherData | null;
  highLights: WeatherHighlights | null;
  setLocation: (location: string) => void;
}

const ForecastCard: React.FC<ForecastCardProps> = ({ weather }) => {
  if (!weather || !weather.daily) {
    return <div className="sm:hidden w-[92%] mx-auto text-center py-10">Loading forecast...</div>;
  }

  return (
    <div className="sm:hidden w-[92%] mx-auto">
      <div className="w-full bg-white flex justify-center items-center rounded-[10px] py-6 shadow-sm">
        <div className="mx-auto px-6.25 w-full">
          <h2 className="text-secondary font-semibold pb-3 text-center">Hourly Forecast</h2>
          <MobileHourlyForecast weather={weather}/>

          <h2 className="text-secondary font-semibold pt-6 pb-3 text-center">7 Days Forecast</h2>
          
          {weather.daily.slice(0, 7).map((item, id) => (
            <div
              key={item.dt}
              className="grid grid-cols-[64px_28px_minmax(46px,1fr)_42px_42px] items-center gap-x-1 py-3 border-b border-support4 last:border-0"
            >
              <h3 className="min-w-0 text-ternary text-[14px] font-medium whitespace-nowrap">
                {id === 0 ? "Today" : getWeekday(item.dt).slice(0, 3)}
              </h3>
              
              <img
                src={`/icons/${item.weather[0].main.toLowerCase()}.svg`}
                className="w-5 h-5 object-contain justify-self-center"
                alt={item.weather[0].description}
              />
              
              <p className="min-w-0 truncate text-ternary font-medium text-[14px] text-center">
                {item.weather[0].main}
              </p>
              
              <div className="flex translate-x-0.5 items-center justify-end gap-0.5 text-ternary font-medium tabular-nums">
                <img src="/icons/up_gray.svg" className="w-[7px] h-3 object-contain" alt="high" />
                <p className="text-[13px] whitespace-nowrap">{Math.round(item.temp.max)}°</p>
              </div>
              
              <div className="flex items-center justify-start gap-0.5 pl-3 text-ternary font-medium tabular-nums">
                <img src="/icons/down_gray.svg" className="w-[7px] h-3 object-contain" alt="low" />
                <p className="text-[13px] whitespace-nowrap">{Math.round(item.temp.min)}°</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ForecastCard;

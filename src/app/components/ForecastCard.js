"use client"
import React from 'react';
import { getWeekday } from '@/utils/temp_date';
import MobileHourlyForecast from './MobileHourlyForecast';

const ForecastCard = ({ weather, highlight }) => {

  return (
    <div className="sm:hidden w-[85%] mx-auto ">
      <div className="w-full bg-white flex justify-center items-center rounded-[10px] py-6">
        <div className="mx-auto px-[25px]">
          <h3 className="text-secondary font-semibold pb-5 text-center">Hourly Forecast</h3>
          <MobileHourlyForecast weather={weather}/>

          <h3 className="text-secondary font-semibold pt-6 pb-3 text-center">7 Days Forecast</h3>
          {weather?.daily?.slice(0, 7).map((item, id) => (
            <div key={id} className="flex justify-between items-center py-3 gap-[20px] border-b border-support4">
              <h3 className="w-18 text-ternary text-[13px] font-medium">
                {id === 0 ? "Today" : getWeekday(item.dt)}
              </h3>
              <img
                src={`/icons/${item.weather[0].main.toLowerCase()}.svg`}
                className="w-5 h-auto object-contain"
                alt={item.weather[0].description}
              />
              <p className="w-[58px] text-ternary font-medium text-center">
                {item.weather[0].main}
              </p>
              <div className="w-9 flex justify-center items-center gap-[4px] text-ternary font-medium  text-center">
                <img src="/icons/up_gray.svg" className="w-[6px] lg:w-[8px] auto object-contain" alt="arrow_up" />
                <p>{Math.round(item.temp.max)}°</p>
              </div>
              <div className="w-9 flex justify-center items-center gap-[4px] text-ternary font-medium ">
                <img src="/icons/down_gray.svg" className="w-[6px] auto object-contain" alt="arrow_down" />
                <p>{Math.round(item.temp.min)}°</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ForecastCard
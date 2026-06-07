import React from 'react';
import HourlyForecast from './HourlyForecast';
import { WeatherData, WeatherHighlights } from '@/types/weather';
import { getWeekday } from '@/utils/temp_date';

interface WeatherDashboardProps {
  weather: WeatherData | null;
  highLights: WeatherHighlights | null;
}

const WeatherDashboard: React.FC<WeatherDashboardProps> = ({ weather, highLights }) => {
  return (
    <div className="hidden mx-auto sm:block w-[92%] lg:w-[85%] max-w-[1320px] h-[668px] bg-[#6C6F75]/45 backdrop-blur-[8px] rounded-[25px]">
      <div className="w-full h-100 flex justify-between items-start px-8 xl:px-15 py-8">
      
        <div className="w-[45%] xl:w-[40%] h-full">
          <p className="text-[20px] text-center font-semibold text-white">Today's Highlight</p>
          
          <div className="w-full h-[50px] flex justify-center items-center bg-[#BCC0C7]/50 backdrop-blur-[8px] rounded-full mt-7 mb-[55px]">
            <div className="flex gap-2 xl:gap-4 items-center">
              <h3 className="text-white text-[12px] md:text-[14px] lg:text-[16px]">Today</h3>
              <div className="flex text-white">
                <p className="text-[12px] md:text-[14px] lg:text-[16px]">{highLights?.todayMin}/</p>
                <p className="text-[12px] md:text-[14px] lg:text-[16px]"> {highLights?.todayMax}℃</p>
              </div>
              <div className="w-[1.5px] h-6 bg-white" />
              <h3 className="text-white text-[12px] md:text-[14px] lg:text-[16px]">{highLights?.tomorrowName}</h3>
              <div className="flex text-white">
                <p className="text-[12px] md:text-[14px] lg:text-[16px]">{highLights?.tomorrowMin}/</p>
                <p className="text-[12px] md:text-[14px] lg:text-[16px]"> {highLights?.tomorrowMax}℃</p>
              </div>
            </div>
          </div>

          <div className="w-full flex justify-between items-stretch h-[100px]">
            <div className="w-[30%] xl:w-[28%] aspect-[33/25] bg-[#BCC0C7]/50 backdrop-blur-[8px] rounded-[10px] p-3 text-white">
              <div className="flex flex-col gap-[10px] items-center">
                <div className="flex gap-1 justify-center items-center">
                  <img src="/icons/rain_white.svg" className="w-4 h-auto object-contain" alt="rainy" />
                  <h2 className="text-[14px]">{highLights?.currentTime}</h2>
                </div>
                <div className="text-center">
                  <p className="text-[12px] lg:text-[14px]">Rain %</p>
                  <p className="text-[14px] lg:text-[16px]">{highLights?.rainChance}</p>
                </div>
              </div>
            </div>

            <div className="w-[30%] xl:w-[28%] aspect-[33/25] bg-[#BCC0C7]/50 backdrop-blur-[8px] rounded-[10px] p-3 text-white">
              <div className="flex flex-col gap-[10px] justify-center">
                <div className="flex justify-center items-center gap-1">
                  <img src="/icons/wind_white.svg" className="w-5 h-auto object-contain" alt="wind" />
                  <h3 className="font-semibold">Wind</h3>
                </div>
                <div className="text-center">
                  <p className="text-[12px] lg:text-[14px]">Wind speed</p>
                  <p className="text-[14px] lg:text-[16px]">{highLights?.wind} m/s</p>
                </div>
              </div>
            </div>

            <div className="w-[30%] xl:w-[28%] aspect-[33/25] bg-[#BCC0C7]/50 backdrop-blur-[8px] rounded-[10px] p-3 text-white">
              <div className="flex flex-col gap-[10px] justify-center">
                <div className="flex justify-center items-center gap-1">
                  <img src="/icons/sun_white.svg" className="w-4 h-auto object-contain" alt="uv" />
                  <h3 className="font-semibold">UV</h3>
                </div>
                <div className="text-center">
                  <h3 className="text-[18px]">{highLights?.uv}</h3>
                  <p className="text-[14px]">{highLights?.uvText}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full flex justify-between items-stretch h-[100px] mt-[30px] text-white">
            <div className="w-[30%] aspect-[33/25] xl:w-[28%] bg-[#BCC0C7]/50 backdrop-blur-[8px] rounded-[10px] p-3">
              <div className="flex flex-col gap-[22px] justify-center">
                <div className="flex justify-center items-center gap-2">
                  <img src="/icons/humidity.svg" className="w-3 h-auto object-contain" alt="humidity" />
                  <h3 className="text-[12px] lg:text-[14px] font-semibold">Humidity</h3>
                </div>
                <div className="text-center">
                  <h3 className="text-[14px] lg:text-[20px]">{highLights?.humidity} %</h3>
                </div>
              </div>
            </div>

            <div className="w-[30%] xl:w-[28%] aspect-[33/25] bg-[#BCC0C7]/50 backdrop-blur-[8px] rounded-[10px] p-3">
              <div className="flex flex-col gap-[22px] justify-center">
                <div className="flex justify-center items-center gap-1">
                  <img src="/icons/visibility.svg" className="w-5 h-auto object-contain" alt="visibility" />
                  <h3 className="text-[12px] lg:text-[14px] font-semibold">Visibility</h3>
                </div>
                <div className="text-center">
                  <h3 className="text-[14px] lg:text-[20px]">{highLights?.visibility} km</h3>
                </div>
              </div>
            </div>

            <div className="w-[30%] aspect-[33/25] xl:w-[28%] bg-[#BCC0C7]/50 backdrop-blur-[8px] rounded-[10px] p-3">
              <div className="flex flex-col gap-[22px] justify-center">
                <div className="flex justify-center items-center gap-2">
                  <img src="/icons/pressure.svg" className="w-5 h-auto object-contain" alt="pressure" />
                  <h3 className="text-[12px] lg:text-[14px] font-semibold">Pressure</h3>
                </div>
                <div className="text-center">
                  <h3 className="text-[14px] lg:text-[20px]">{highLights?.pressure} hPa</h3>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-[45%] lg:w-[38%] h-full flex-col justify-between text-white">
          <p className="text-[20px] text-center font-semibold mb-[20px]">7 Days Forecast</p>

          {weather?.daily?.slice(0, 7).map((item, id) => (
            <div key={item.dt || id} className="flex justify-between items-center py-3 gap-[20px] border-b border-white/10">
              <h2 className="w-20 text-white">
                {id === 0 ? "Today" : getWeekday(item.dt)}
              </h2>
              <img
                src={`/icons/${item.weather[0].main.toLowerCase()}.svg`}
                className="w-5 h-auto object-contain"
                alt={item.weather[0].description}
              />
              <h2 className="w-[58px] text-white text-center">
                {item.weather[0].main}
              </h2>
              <div className="w-9 flex justify-center items-center gap-[4px] text-white text-center">
                <img src="/icons/up.svg" className="w-[6px] lg:w-[8px] h-auto object-contain" alt="arrow_up" />
                <h2 className="text-[14px]">{Math.round(item.temp.max)}°</h2>
              </div>
              <div className="w-9 flex justify-center items-center gap-[4px] text-white">
                <img src="/icons/down.svg" className="w-[8px] h-auto object-contain" alt="arrow_down" />
                <h2 className="text-[14px]">{Math.round(item.temp.min)}°</h2>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <HourlyForecast weather={weather as any} />
    </div>
  );
};

export default WeatherDashboard;
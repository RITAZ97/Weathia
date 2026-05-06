"use client";
import React from 'react';
import { WeatherHighlights } from '@/types/weather';

interface MainMetricsProps {
  highLights: WeatherHighlights | null;
}

const MainMetrics: React.FC<MainMetricsProps> = ({highLights})=> {

  return (
    <div className="sm:hidden w-[92%] text-white mx-auto py-[40px]">
      <div className="w-full  rounded-full bg-[#6C6F75]/45 backdrop-blur-[8px] flex justify-around items-center py-3">
        <div className="flex gap-[10px] justify-center items-center">
          <h3 className="text-white">Today</h3>
          <div className="flex gap-1 items-center">
            <img src="/icons/up.svg" className="w-2 h-4 object-contain " alt="arrow_up" />
            <h3 className="">{highLights?.todayMax}℃</h3>
          </div>
          <div className="flex gap-1 items-center">
            <img src="/icons/down.svg" className="w-2 h-4 object-contain " alt="arrow_up" />
            <h3 className="">{highLights?.todayMin}℃</h3>
          </div>
          <div className="w-[1.5px] h-6 bg-white items" />
          <h3 className=" text-white">{highLights?.tomorrowName}</h3>
          <div className="flex gap-1 items-center">
            <img src="/icons/up.svg" className="w-2 h-4 object-contain " alt="arrow_down" />
            <h3 className="">{highLights?.tomorrowMax}℃</h3>
          </div>
          <div className="flex gap-1 items-center">
            <img src="/icons/down.svg" className="w-2 h-4 object-contain " alt="arrow_up" />
            <h3 className="">{highLights?.tomorrowMin}℃</h3>
          </div>
        </div>
      </div>

      <div className="w-full h-[100px] rounded-[10px] bg-[#6C6F75]/45 backdrop-blur-[8px] flex items-center mt-7 px-2">
        <div className="flex-1 flex flex-col gap-[10px] justify-center items-center">
          <div className="flex gap-2 justify-center items-center">
            <img src="/icons/rain_white.svg" className="w-4 h-auto object-contain" alt="rainy" />
            <h3 className="text-[15px]">{highLights?.currentTime}</h3>
          </div>
          <div className="text-center">
            <p className="text-[13px] opacity-80">Chance of rain</p>
            <p className="text-[14px] font-medium">{highLights?.rainChance} %</p>
          </div>
        </div>
        <div className="w-[1px] h-10 bg-white/50" />

        <div className="flex-1 flex flex-col gap-[10px] justify-center items-center">
          <div className="flex justify-center items-center gap-2">
            <img src="/icons/wind_white.svg" className="w-5 h-auto object-contain" alt="wind" />
            <h3 className="text-[15px]">Wind</h3>
          </div>
          <div className="text-center">
            <p className="text-[13px] opacity-80">Wind speed</p>
            <p className="text-[14px] font-medium">{highLights?.wind} m/s</p>
          </div>
        </div>
        <div className="w-[1px] h-10 bg-white/50" />

        <div className="flex-1 flex flex-col gap-[10px] justify-center items-center">
          <div className="flex justify-center items-center gap-2">
            <img src="/icons/sun_white.svg" className="w-4 h-auto object-contain" alt="uv" />
            <h3 className="text-[15px]">UV</h3>
          </div>
          <div className="text-center">
            <p className="text-[14px] font-medium">{highLights?.uv}</p>
            <p className="text-[13px] opacity-80">{highLights?.uvText}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MainMetrics;
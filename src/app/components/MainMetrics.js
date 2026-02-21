"use client";
import React from 'react';

const MainMetrics = ({ highLights }) => {

  return (
    <div className="sm:hidden w-[85%] text-white mx-auto py-[40px]">
      <div className="w-full  rounded-full bg-[#6C6F75]/45 backdrop-blur-[8px] flex justify-around items-center py-3">
        <div className="flex gap-[10px] justify-center items-center">
          <h3 className="text-white">Today</h3>
          <div className="flex gap-1 items-center">
            <img src="/icons/up.svg" className="w-2 h-4 object-contain " alt="arrow_up" />
            <p className="">{highLights?.todayMax}℃</p>
          </div>
          <div className="flex gap-1 items-center">
            <img src="/icons/down.svg" className="w-2 h-4 object-contain " alt="arrow_up" />
            <p className="">{highLights?.todayMin}℃</p>
          </div>
          <div className="w-[1.5px] h-6 bg-white items" />
          <h3 className=" text-white">{highLights?.tomorrowName}</h3>
          <div className="flex gap-1 items-center">
            <img src="/icons/up.svg" className="w-2 h-4 object-contain " alt="arrow_down" />
            <p className="">{highLights?.tomorrowMax}℃</p>
          </div>
          <div className="flex gap-1 items-center">
            <img src="/icons/down.svg" className="w-2 h-4 object-contain " alt="arrow_up" />
            <p className="">{highLights?.tomorrowMin}℃</p>
          </div>
        </div>
      </div>

      <div className="w-full h-[100px] rounded-[10px] bg-[#6C6F75]/45 backdrop-blur-[8px] flex items-center mt-7 px-2">
        <div className="flex-1 flex flex-col gap-[10px] justify-center items-center">
          <div className="flex gap-2 justify-center items-center">
            <img src="/icons/rain_white.svg" className="w-4 h-auto object-contain" alt="rainy" />
            <h3 className="">{highLights?.currentTime}</h3>
          </div>
          <div className="text-center">
            <p className="text-[12px] opacity-80">Chance of rain</p>
            <p className="text-[14px] font-medium">{highLights?.rainChance} %</p>
          </div>
        </div>
        <div className="w-[1px] h-10 bg-white/50" />

        <div className="flex-1 flex flex-col gap-[10px] justify-center items-center">
          <div className="flex justify-center items-center gap-2">
            <img src="/icons/wind_white.svg" className="w-5 h-auto object-contain" alt="wind" />
            <h3 className="">Wind</h3>
          </div>
          <div className="text-center">
            <p className="text-[12px] opacity-80">Wind speed</p>
            <p className="text-[14px] font-medium">{highLights?.wind} m/s</p>
          </div>
        </div>
        <div className="w-[1px] h-10 bg-white/50" />

        <div className="flex-1 flex flex-col gap-[10px] justify-center items-center">
          <div className="flex justify-center items-center gap-2">
            <img src="/icons/sun_white.svg" className="w-4 h-auto object-contain" alt="uv" />
            <h3 className="">UV</h3>
          </div>
          <div className="text-center">
            <p className="text-[14px] font-medium">{highLights?.uv}</p>
            <p className="text-[12px] opacity-80">{highLights?.uvText}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MainMetrics;
"use client";
import React, { useState } from 'react';
import SearchBar from './SearchBar';
import { formatTemperature } from '@/utils/temp_date';
import { formatDate } from '@/utils/temp_date';
import SavedBox from './SavedBox';

const Header = ({ setLocation, weather, loading, setLoading, error }) => {
  console.log("Header Props:", { loading, weather });
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  if (loading?.weather || loading?.forecast) {
    return <div className="p-10 text-white">Loading weather data...</div>;
  }
  if (error) return (
    <div className="p-4 text-red-500 bg-red-100 rounded-md">
      Error: {error}
    </div>
  );
  if (!weather) return null

  return (
    <div className='w-full text-white mx-auto'>
      <div className="w-full flex justify-center bg-gradient-to-b from-[#48505C]/[0.79] from-[10%] via-[#59606B]/[0.5] via-[43%] via-[#7C828B]/[0.44] via-[60%] to-[#B7B3B3]/[0] to-[100%]">
        <div className="w-[85%]">
          <div className="flex justify-between items-center pt-5">
            <div className="flex gap-1 md:gap-2">
              <img src="/icons/weathia_logo.svg" className="w-5 h-5 md:w-7 h-auto object-contain" alt="logo" />
              <div className="flex">
                <h3 className="text-[14px] md:text-[20px]">Weathia</h3>
              </div>
            </div>
            <SearchBar setLocation={setLocation} loading={loading} setLoading={setLoading} customClass='hidden sm:flex' onSelect={(city) => console.log(city)} />
            <div className="flex items-center justify-center gap-2">
              <div className="sm:hidden flex gap-3 items-center">
                <button onClick={() => setIsSearchOpen(true)}>
                  <img src="/icons/search_icon.svg" className="w-4.5 h-auto object-contain md:hidden" alt="search" />
                </button>
                {isSearchOpen && (
                  <div className="fixed inset-0 z-100 bg-gray-900 flex flex-col px-6 pt-6">
                    <button
                      onClick={() => setIsSearchOpen(false)}
                      className="flex justify-end mb-8"
                    >
                      <img src="/icons/close.svg" className="w-4 h-auto object-contain" alt="close" />
                    </button>
                    <div className="w-full flex justify-center">
                      <SearchBar
                        setLocation={setLocation}
                        loading={loading}
                        setLoading={setLoading}
                        customClass='sm:hidden'
                        onSelect={(city) => {
                          console.log("Selected:", city);
                          setIsSearchOpen(false); 
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
              <SavedBox
                className="hidden sm:flex"
                currentCity={weather?.name}  
                onSelectCity={setLocation}   
                weather={weather} />
            </div>
          </div>

          <div className="hidden w-full md:flex justify-center items-center my-14">
            <div className="flex items-center gap-30">
              <div className="flex gap-2 items-center">
                <img src="/icons/locate_icon.svg" className="w-4 h-auto object-contain" alt="location" />
                <p className="text-[18px] font-semibold">{weather.name}, {weather.sys?.country}</p>
              </div>
              <div className="flex flex-col gap-3 justify-center items-center">
                <div className="text-center">
                  <h1 className="leading-none sm:text-slate-800 md:text-support2">{formatTemperature(weather.current.temp)}</h1>
                </div>
                <div className="w-[190px] h-[42px] rounded-full bg-[#6C6F75]/50 backdrop-blur-[8px] flex justify-center items-center">
                  <p className="text-[16px]">{weather.current.weather[0].main}, feels like {formatTemperature(weather.current.feels_like)} </p>
                </div>
              </div>
              <p className="text-[18px] font-semibold">{formatDate(weather.current.dt, weather.timezone_offset)}</p>
            </div>
          </div>

          <div className="md:hidden flex justify-between items-center py-10">
            <div className="flex gap-2 items-end">
              <img src="/icons/locate_icon.svg" className="w-4 h-auto object-contain" alt="location" />
              <h2 className="">{weather.name || "Unknown City"}</h2>
            </div>
            <div className="flex items-end">
              <p className="">{formatDate(weather.current.dt, weather.timezone_offset)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="md:hidden w-full flex justify-center">
        <div className="w-[85%]">
          <div className="flex gap-3 items-end">
            <h1 className="text-support2 leading-none drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]">{formatTemperature(weather.current.temp)}</h1>
            <div className="bg-[#6C6F75]/45 backdrop-blur-[8px] w-[70px] h-[27px] mb-[4px] rounded-full flex justify-center items-center">
              <p className="">{weather.current.weather[0].main}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Header
"use client";
import React, { useState, useEffect } from 'react';

const HourlyForecast = ({ weatherData = [], weather }) => {
  const [startIndex, setStartIndex] = useState(0);
  const displayCount = 12;
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
        timeZone: 'UTC' // 必须用 UTC，因为我们已经手动加上了偏移量
      }),
      temp: Math.round(item.temp)
    };
  }) || [];

  useEffect(() => {
    if (weatherData.length === 0) return;

    const targetDate = new Date((Date.now() / 1000 + weather.timezone_offset) * 1000);
    const currentHour = targetDate.getUTCHours();

    const currentIndex = weatherData.findIndex(item => {
      const hourPart = parseInt(item.time.split(':')[0]);
      const isPM = item.time.includes('PM');
      const militaryHour = isPM && hourPart !== 12 ? hourPart + 12 : (!isPM && hourPart === 12 ? 0 : hourPart);
      return militaryHour >= currentHour;
    });

    if (currentIndex !== -1) {
      const safeIndex = Math.min(currentIndex, Math.max(0, weatherData.length - displayCount));
      setStartIndex(safeIndex);
    }
  }, [weatherData]);

  const moveNext = () => {
    if (startIndex + displayCount < hourlyData.length) {
      setStartIndex(startIndex + displayCount);
    }
  };

  const movePrev = () => {
    if (startIndex > 0) {
      setStartIndex(startIndex - displayCount);
    }
  };

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
                className="flex-none w-[8.333333%] flex flex-col items-center group"
              >
                <div className="w-12 h-12 rounded-full bg-support2 flex justify-center items-center">
                  <img
                    src={`/icons/${item.iconName}.svg`}
                    className="w-5 h-auto object-contain"
                    alt={item.weather[0].description}
                  />
                </div>
                <div className="flex flex-col justify-center items-center pt-2">
                  <p className="text-primary font-normal text-[13px]">{id === 0 ? "Now" : item.displayTime}</p>
                  <h2 className="text-primary font-semibold">{item.temp}°</h2>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={moveNext}
          disabled={startIndex + displayCount >= 13}
          className="absolute ml-6 -right-2 z-10 p-2 hover:cursor-pointer disabled:cursor-default transition-all disabled:opacity-40"
        >
          <img src="/icons/right.svg" className="w-4 h-auto object-contain" alt="right" />
        </button>
      </div>
    </div>
  );
}

export default HourlyForecast;
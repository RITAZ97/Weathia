"use client";
import React from 'react';

const MobileHourlyForecast = ({ weather }) => {
  const hourlyData = weather?.hourly?.slice(0, 24).map((item, index) => {
    const itemDate = new Date(item.dt * 1000);
    const itemDateStr = itemDate.toLocaleDateString();
    const dayInfo = weather.daily.find(d =>
      new Date(d.dt * 1000).toLocaleDateString() === itemDateStr
    );
    const sunrise = dayInfo?.sunrise || weather.daily[0].sunrise;
    const sunset = dayInfo?.sunset || weather.daily[0].sunset;
    const isDaylight = item.dt > sunrise && item.dt < sunset;
    let weatherMain = item.weather[0].main.toLowerCase();
    let iconName = weatherMain;
    if (weatherMain === 'clear') {
      iconName = isDaylight ? 'clear-day' : 'clear-night';
    }

    return {
      ...item,
      displayTime: index === 0 ? "Now" : itemDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      temp: Math.round(item.temp),
      iconName: iconName
    };
  }) || [];

  return (
    <div className="flex justify-center items-center mx-auto">
      <div className="w-full max-w-[300px] flex justify-center items-center py-3">
        <div className="flex w-full overflow-x-auto snap-x snap-mandatory no-scrollbar">
          {hourlyData.map((item, id) => (
            <div
              key={id}
              className="flex-none w-1/4 snap-start flex flex-col items-center group"
            >
              <div className="w-12 h-12 rounded-full bg-support2 flex justify-center items-center mb-3">
                <img
                  src={`/icons/${item.iconName}.svg`}
                  className="w-5 h-auto object-contain"
                  alt="weather"
                />
              </div>
              <div className="flex flex-col items-center gap-0.5">
                <p className="text-ternary font-medium uppercase">
                  {item.displayTime}
                </p>
                <h2 className="text-ternary font-semibold">
                  {item.temp}°
                </h2>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MobileHourlyForecast;
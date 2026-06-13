"use client";
import React from 'react';
import { useSession } from 'next-auth/react'; 
import { WeatherData } from '@/types/weather';
import { useRouter } from 'next/navigation';

interface MobileHourlyForecastProps {
  weather: WeatherData | null;
  weatherData?: any[];
}

const MobileHourlyForecast: React.FC<MobileHourlyForecastProps> = ({ weather }) => {
  const { data: session } = useSession();
  const isLoggedIn = !!session;
  const router = useRouter();
  const maxAllowedHours = isLoggedIn ? 24 : 12;

  const hourlyData = weather?.hourly?.slice(0, maxAllowedHours).map((item, index) => {
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
    const timezoneOffset = weather.timezone_offset || 0;

    return {
      ...item,
      displayTime: new Date((item.dt + timezoneOffset) * 1000).toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'UTC'
      }),
      temp: Math.round(item.temp),
      iconName: iconName
    };
  }) || [];

  return (
    <div className="flex justify-center items-center mx-auto w-full">
      <div className="w-full max-w-[330px] flex justify-center items-center py-3">
        <div className="flex w-full overflow-x-auto snap-x snap-mandatory no-scrollbar pb-1">
          {hourlyData.map((item, id) => (
            <div
              key={id}
              className="flex-none w-[22%] snap-start flex flex-col items-center group"
            >
              <div className="w-12 h-12 rounded-full bg-support2 flex justify-center items-center mb-3">
                <img
                  src={`/icons/${item.iconName}.svg`}
                  className="w-5 h-auto object-contain"
                  alt="weather"
                />
              </div>
              <div className="flex flex-col items-center gap-0.5">
                <h3 className="text-ternary font-medium uppercase">
                  {id === 0 ? "Now" : item.displayTime}
                </h3>
                <h2 className="text-ternary font-semibold">
                  {item.temp}°
                </h2>
              </div>
            </div>
          ))}
          {!isLoggedIn && (
            <div 
              className="flex-none w-[35%] snap-start flex flex-col items-center justify-center border border-dashed border-gray-500 rounded-xl ml-2 p-2 bg-black/20"
              onClick={() => {
                router.push('/auth/register?mode=signin'); 
              }}
            >
              <div className="w-8 h-8 rounded-full bg-white/10 flex justify-center items-center mb-2">
                <span className="text-[14px]">🔒</span>
              </div>
              <p className="text-[10px] text-gray-400 font-medium text-center leading-tight">
                Log in to<br/>unlock 24h
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default MobileHourlyForecast;
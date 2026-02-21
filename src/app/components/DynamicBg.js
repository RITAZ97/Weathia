"use client";
import React, { useMemo } from 'react';

const DynamicBg = ({weather}) => {

  const bgClassName = useMemo(() => {
    if (!weather?.current || !weather?.daily?.[0]) {
      return "bg-[url('/images/clear-day.png')]";
    }

    const dt = weather.current.dt;
    const { sunrise, sunset } = weather.daily[0];
    const condition = weather.current.weather[0].main.toLowerCase();
    const offset = 3600; 
    let phase = 'day';

    if (dt >= sunset - offset && dt <= sunset + offset) {
      phase = 'twilight';
    }
    else if (dt > sunrise && dt < sunset - offset) {
      phase = 'day';
    }
    else {
      phase = 'night';
    }

    const fileName = `${condition}-${phase}`;
    console.log("Matching background:", fileName);
    return `url('/images/${fileName}.png')`;
  }, [weather]);

  return (
    <div
      className="fixed inset-0 -z-10 bg-cover bg-center transition-all duration-1000 ease-in-out"
      style={{ backgroundImage: bgClassName }}
    >
    </div>
  );
};


export default DynamicBg
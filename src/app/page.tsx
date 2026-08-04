'use client';
import React from 'react';
import Header from "./components/Header";
import MainMetrics from "./components/MainMetrics";
import ForecastCard from "./components/ForecastCard";
import WeatherDashboard from "./components/WeatherDashboard";
import Footer from "./components/Footer";
import DynamicBg from "./components/DynamicBg";
import useWeather from "@/utils/useWeather";

export default function Home() {
  const { weather, setLocation, loading, highLights, error } = useWeather();

  return (
    // 1. 让 main 变成 flex 容器，且纵向排列，最小高度为屏幕全屏 (100vh)
    <main className=" w-full min-h-screen flex flex-col justify-between overflow-x-hidden">
      <DynamicBg weather={weather} />

      {/* 2. 上半部分包裹所有 Dashboard 内容，设置 flex-1 让它自动撑开剩余空间，并用 mb-12 强行拉开与 Footer 的距离 */}
      <div className="z-10 w-full flex-1 mb-12 sm:mb-16">
        <Header
          weather={weather}
          loading={loading}
          error={error}
          setLocation={setLocation}
          highLights={highLights}
        />

        <WeatherDashboard
          weather={weather}
          highLights={highLights}
        />

        <MainMetrics
          highLights={highLights}
        />

        <ForecastCard
          weather={weather}
          highLights={highLights}
          setLocation={setLocation}
        />
      </div>

      <div className=" z-20 w-full">
        <Footer />
      </div>
    </main>
  );
}
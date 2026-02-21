'use client';
import Header from "./components/Header";
import MainMetrics from "./components/MainMetrics";
import ForecastCard from "./components/ForecastCard";
import WeatherDashboard from "./components/WeatherDashboard";
import Footer from "./components/Footer";
import DynamicBg from "./components/DynamicBg";
import useWeather from "@/utils/useWeather";

export default function Home() {
  const { weather, setLocation, loading, setLoading, highLights, error } = useWeather();

  return (
    <main className="relative w-full min-h-screen overflow-x-hidden">
      <DynamicBg weather={weather} />
      <div className="absolute w-full h-full">
        <div className="absolute bottom-0 w-full bg-gradient-to-t from-[#313D49] via-[#313D49]/80 to-transparent h-[60%]" />
      </div>
      <div className="relative z-10 w-full">
        <Header
          weather={weather}
          highLights={highLights}
          loading={loading}
          error={error}
          setLocation={setLocation}
          setLoading={setLocation}
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
        <div className="mt-auto">
          <Footer />
        </div>
      </div>
    </main>
  );
}

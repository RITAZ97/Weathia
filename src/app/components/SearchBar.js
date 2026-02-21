"use client";
import React, { useState, useEffect } from 'react';

const SearchBar = ({ setLocation, onSelect, customClass = "" }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const CITIES = ["Beijing, China", "Melbourne, AU", "Bali, Indonesia"];
  const filtered = query.trim() === ""
    ? []
    : CITIES.filter(c => c.toLowerCase().includes(query.toLowerCase()));
  const API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY;

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }

    const timer = setTimeout(() => {
      fetchCities();
    }, 500);
    return () => clearTimeout(timer);
  }, [query]);

  const fetchCities = async () => {
    if (!query) return;
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${query.trim()}&limit=5&appid=${API_KEY}`
      );
      const data = await response.json();
      setResults(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Fetch error:", error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`relative flex w-[320px] xl:w-[400px] justify-center items-center mt-2 h-[46px]
     bg-[#F5F5F5]/25 backdrop-blur-[8px] text-[16px] z-101 rounded-full border border-white/20 px-3 ${customClass}`}>
      <input
        type="text"
        placeholder="City, State, or Country"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setShowResults(true);
        }}
        className="w-full text-white bg-transparent focus:outline-none placeholder:text-white/60 text-[16px]"
      />

      <div className="absolute right-4 cursor-pointer">
        <img src="/icons/search_icon.svg" className="w-5 h-auto object-contain" alt="search" />
      </div>

      {showResults && query.trim() !== "" && (
        <div className="absolute top-[50px] left-0 w-full bg-[#394049]/90 backdrop-blur-xl rounded-2xl overflow-hidden z-[101] shadow-2xl text-left border border-white/10">
          {loading ? (
            <div className="px-5 py-3 text-white/50 text-sm">Searching...</div>
          ) : results.length > 0 ? (
            <ul className="py-1">
              {results.map((city, index) => (
                <li
                  key={index}
                  className="px-5 py-3 text-white hover:bg-white/10 cursor-pointer border-b border-white/5 last:border-none group"
                  onClick={() => {
                    const locationName = `${city.name}, ${city.country}`;
                    setQuery(locationName);
                    setLocation(locationName);
                    setShowResults(false);
                    if (onSelect) {
                      onSelect(locationName);
                    }
                  }}
                >
                  <span className="font-medium text-white">{city.name}</span>
                  <span className="ml-2 text-xs text-white/50 group-hover:text-white/70">
                    {city.state ? `${city.state}, ` : ""}{city.country}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-5 py-8 text-center text-gray-400 text-sm">
              No cities found.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default SearchBar;
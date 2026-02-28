"use client"
import React, { useState, useEffect } from 'react';
import AsyncSelect from 'react-select/async';

const ConfirmModal = ({ isOpen, onClose, onConfirm, message, className }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-[9999]">
      <div className="bg-[#3a3737] text-white px-6 py-8 rounded-lg text-center max-w-[420px] shadow-xl border border-white/10">
        <p className="mb-6 text-sm md:text-base">{message}</p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={onConfirm}
            className="px-4 py-1.5 bg-[#27ae60] hover:bg-[#219150] text-white rounded transition-colors cursor-pointer text-sm font-medium"
          >
            Yes
          </button>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#e74c3c] hover:bg-[#c0392b] text-white rounded transition-colors cursor-pointer text-sm font-medium"
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
};

const SavedBox = ({ currentCity, onSelectCity, weather }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isListOpen, setIsListOpen] = useState(false);
  const [savedCities, setSavedCities] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('weather_cities') || '[]');
    setSavedCities(saved);
  }, []);

  const isFavorited = savedCities.some(city => city.name === currentCity);

  const handleAction = () => {
    setIsModalOpen(true);
  };

  const toggleCity = () => {
    if (!isFavorited) {
      const mainCondition = weather?.weather?.[0]?.main || weather?.current?.weather?.[0]?.main;

      const cityData = {
        name: currentCity,
        temp: Math.round(weather?.main?.temp || weather?.current?.temp || 0),
        condition: mainCondition || 'Clouds'
      };

      const updated = [...savedCities, cityData];
      setSavedCities(updated);
      localStorage.setItem('weather_cities', JSON.stringify(updated));
    } else {
      const updated = savedCities.filter(city => city.name !== currentCity);
      setSavedCities(updated);
      localStorage.setItem('weather_cities', JSON.stringify(updated));
    }
    setIsModalOpen(false);
  };

  return (
    <div className="flex items-center gap-2 relative">
      <button className="hover:scale-110 transition-transform cursor-pointer" onClick={handleAction}>
        <svg
          className="w-6 h-6 sm:w-[28px] sm:h-[28px] overflow-visible"
          viewBox="-1 -1 28 28"
          fill={isFavorited ? "#f1c40f" : "none"}
          stroke={isFavorited ? "#f1c40f" : "currentColor"}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      </button>
      <button className="hover:opacity-70 transition-opacity" onClick={() => setIsListOpen(!isListOpen)}>
        <img src={isListOpen ? "/icons/close.svg" : "/icons/menu_icon.svg"} className={`
      cursor-pointer transition-all object-contain
      ${isListOpen
            ? "w-4 h-auto sm:w-5 h-auto"
            : "w-5 h-auto sm:w-6"
          }
    `} alt="menu" />
      </button>
      <ConfirmModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={toggleCity}
        message={
          isFavorited
            ? `Do you want to remove ${currentCity} from your list?`
            : `Do you want to save ${currentCity} to your list?`
        }
      />

      <div className="max-h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-white/20">
        {isListOpen && (
          <div className="absolute top-12 right-0 bg-[#222]/55 backdrop-blur-sm min-w-[280px] rounded-lg border border-white/10 shadow-2xl z-[100] overflow-hidden">
            {savedCities.length > 0 ? (
              savedCities.map((cityObj, index) => (
                <div
                  key={index}
                  className="px-4 py-3 cursor-pointer flex justify-between items-center hover:bg-white/10 transition-colors border-b border-white/5 last:border-none text-white/90"
                  onClick={() => {
                    onSelectCity(cityObj.name);
                    setIsListOpen(false);
                  }}
                >
                  <div className="flex items-center justify-between gap-4 overflow-hidden">
                    <p className="text-[12px] sm:text-[14px] truncate w-24">
                      {cityObj.name}
                    </p>
                    <div className="flex items-center gap-6">
                      <img
                        src={`/icons/${cityObj.condition?.toLowerCase() || 'clear'}.svg`}
                        className="w-4 h-auto object-contain"
                        alt="weather"
                      />
                      <span className="text-xs sm:text-[14px] text-white/70">{cityObj.temp}°</span>
                    </div>
                  </div>
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      const updated = savedCities.filter(c => c.name !== cityObj.name);
                      setSavedCities(updated);
                      localStorage.setItem('weather_cities', JSON.stringify(updated));
                    }}
                    className="text-white/60 hover:text-[#ff4d4d] transition-colors text-xl leading-none ml-2 px-1"
                  >
                    <svg
                      className="w-4 h-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 text-[12px] sm:text-[14px] text-white/40 text-center italic">
                No saved cities
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedBox;
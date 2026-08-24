"use client";
import React, { useState, useEffect, useRef } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface CityData {
  name: string;
  temp: number | string;
  condition: string;
}

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message: string;
  showCancel?: boolean;
}

interface WeatherData {
  main?: { temp: number };
  weather?: Array<{ main: string }>;
  current?: {
    temp: number;
    weather: Array<{ main: string }>;
  };
}

interface SavedBoxProps {
  currentCity: string;
  onSelectCity: (cityName: string) => void;
  weather: WeatherData | null;
  className?: string;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({ isOpen, onClose, onConfirm, message, showCancel = true }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-[999]">
      <div className="bg-[#3a3737] text-white px-6 py-8 rounded-lg text-center max-w-[420px] shadow-xl border border-white/10 mx-4">
        <p className="mb-6 text-sm md:text-base leading-relaxed">{message}</p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={onConfirm}
            className="px-5 py-1.5 bg-[#1cc9a9] hover:bg-[#6ad9c1] text-white rounded transition-colors cursor-pointer text-sm font-medium"
          >
            {showCancel ? 'Yes' : 'Got it'}
          </button>
          {showCancel && (
            <button
              onClick={onClose}
              className="px-5 py-1.5 bg-[#e74c3c] hover:bg-[#c0392b] text-white rounded transition-colors cursor-pointer text-sm font-medium"
            >
              No
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const SavedBox: React.FC<SavedBoxProps> = ({ currentCity, onSelectCity, weather }) => {
  const { data: session, status } = useSession();
  
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalMode, setModalMode] = useState<'toggle' | 'delete' | 'limitExceeded'>('toggle');
  const [cityPendingDelete, setCityPendingDelete] = useState<string | null>(null);
  const [isListOpen, setIsListOpen] = useState<boolean>(false);
  const [savedCities, setSavedCities] = useState<CityData[]>([]);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const isLoggedIn = status === 'authenticated';
  const isPremium = (session?.user as any)?.isPremium === true;
  
  const getLimit = () => {
    if (!isLoggedIn) return 5; 
    if (isPremium) return 99;  
    return 15;                 
  };

  const limit = getLimit();

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('weather_cities') || '[]');
    setSavedCities(saved);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsListOpen(false);
      }
    };

    if (isListOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isListOpen]);

  const isFavorited = savedCities.some(city => city.name === currentCity);

  const handleAction = () => {
    if (!isFavorited && savedCities.length >= limit) {
      setModalMode('limitExceeded');
      setIsModalOpen(true);
      return;
    }
    
    setModalMode('toggle');
    setIsModalOpen(true);
  };

  const toggleCity = () => {
    if (modalMode === 'limitExceeded') {
      setIsModalOpen(false);
      return;
    }

    if (!isFavorited) {
      const mainCondition = weather?.weather?.[0]?.main || weather?.current?.weather?.[0]?.main;
      const rawTemp = weather?.main?.temp ?? weather?.current?.temp;

      const cityData: CityData = {
        name: currentCity,
        temp: typeof rawTemp === 'number' ? Math.round(rawTemp) : 'Unknown',
        condition: mainCondition || 'Unknown'
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

  const requestCityDelete = (cityName: string) => {
    setCityPendingDelete(cityName);
    setModalMode('delete');
    setIsModalOpen(true);
  };

  const confirmCityDelete = () => {
    if (!cityPendingDelete) return;

    const updated = savedCities.filter(city => city.name !== cityPendingDelete);
    setSavedCities(updated);
    localStorage.setItem('weather_cities', JSON.stringify(updated));
    setCityPendingDelete(null);
    setIsModalOpen(false);
  };

  const closeModal = () => {
    setCityPendingDelete(null);
    setIsModalOpen(false);
  };

  const renderFooterSlogan = () => {
    if (status === 'loading') {
      return (
        <div className="px-4 py-2.5 bg-white/5 border-t border-white/10 text-center">
          <p className="text-[11px] text-white/30 animate-pulse">Checking status...</p>
        </div>
      );
    }

    if (isLoggedIn && isPremium) {
      return (
        <div className="px-4 py-2.5 bg-white/5 border-t border-white/10 text-center flex items-center justify-center gap-2">
          {session?.user?.image && (
            <img src={session.user.image} alt="avatar" className="w-4 h-4 rounded-full" />
          )}
          <p className="text-[12px] text-[#2DEBC9] tracking-wide font-medium">
            Premium Elite: Enjoy up to 99 saved cities.
          </p>
        </div>
      );
    }

    if (isLoggedIn) {
      return (
        <div className="px-4 py-2.5 bg-white/5 border-t border-white/10 text-center flex flex-col items-center gap-1">
          <div className="flex items-center gap-1.5">
            {session?.user?.image && (
              <img src={session.user.image} alt="avatar" className="w-3.5 h-3.5 rounded-full" />
            )}
          </div>
          <p className="text-[12px] text-white/80 tracking-wide">
            Limit: 15 cities. <span className="text-[#2DEBC9] font-medium cursor-pointer hover:underline">Go Premium</span> for more tracking options!
          </p>
        </div>
      );
    }

    return (
      <div className="px-4 py-2.5 bg-white/5 border-t border-white/10 text-center">
        <p className="text-[12px] text-white/80 tracking-wide">
          Limit: 5 cities.{' '}
          <span onClick={() => signIn()} className="text-[#2DEBC9] hover:underline font-medium cursor-pointer">
            Log in
          </span>{' '}
          to unlock more!
        </p>
      </div>
    );
  };

  return (
    <div ref={containerRef} className="flex items-center gap-3 relative">
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
        <img 
          src={isListOpen ? "/icons/close.svg" : "/icons/menu_icon.svg"} 
          className={`cursor-pointer transition-all object-contain ${
            isListOpen ? "w-4 h-auto sm:w-5" : "w-5 h-auto sm:w-6"
          }`} 
          alt="menu" 
        />
      </button>

      <ConfirmModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onConfirm={modalMode === 'delete' ? confirmCityDelete : toggleCity}
        showCancel={modalMode !== 'limitExceeded'}
        message={
          modalMode === 'limitExceeded'
            ? `You've reached the limit of ${limit} saved cities. Please ${isLoggedIn ? 'upgrade to Premium' : 'log in'} to save more locations!`
            : modalMode === 'delete'
            ? `Do you want to remove ${cityPendingDelete} from your list?`
            : isFavorited
            ? `Do you want to remove ${currentCity} from your list?`
            : `Do you want to save ${currentCity} to your list?`
        }
      />

      {isListOpen && (
        <div className="absolute top-12 right-0 bg-gradient-to-b from-[#313D49]/85 to-[#465865]/72 backdrop-blur-[18px] backdrop-saturate-125 min-w-[300px] rounded-xl border border-white/15 shadow-[0_16px_40px_rgba(20,28,36,0.24)] z-[100] overflow-hidden flex flex-col">
          <div className="max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 flex-1">
            {savedCities.length > 0 ? (
              savedCities.map((cityObj, index) => (
                <div
                  key={`${cityObj.name}-${index}`}
                  className="px-4 py-3 cursor-pointer grid grid-cols-[minmax(0,1fr)_24px_48px_24px] items-center gap-x-3 hover:bg-white/10 transition-colors border-b border-white/10 last:border-none text-white/90"
                  onClick={() => {
                    onSelectCity(cityObj.name);
                    setIsListOpen(false);
                  }}
                >
                  <div className="contents">
                    <p className="min-w-0 text-[14px] truncate">
                      {cityObj.name}
                    </p>
                    <div className="contents">
                      <img
                        src={`/icons/${cityObj.condition?.toLowerCase() || 'clear'}.svg`}
                        className="w-5 h-5 object-contain justify-self-center"
                        alt="weather"
                      />
                      <span className="text-[14px] text-white/70 text-right tabular-nums whitespace-nowrap">{cityObj.temp}°</span>
                    </div>
                  </div>
                  
                  <button
                    type="button"
                    aria-label={`Remove ${cityObj.name} from saved cities`}
                    onClick={(e: React.MouseEvent) => {
                      e.stopPropagation();
                      requestCityDelete(cityObj.name);
                    }}
                    className="text-white/80 hover:text-[#ff4d4d] transition-colors text-xl leading-none justify-self-center"
                  >
                    <svg
                      className="w-5 h-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))
            ) : (
              <div className="p-4 text-[12px] sm:text-[14px] text-white/80 text-center italic">
                No saved cities
              </div>
            )}
          </div>
          {renderFooterSlogan()}
        </div>
      )}
    </div>
  );
};

export default SavedBox;

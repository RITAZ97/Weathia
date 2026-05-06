"use client";

import React, { useState, useRef } from 'react';
import { useJsApiLoader, Autocomplete } from '@react-google-maps/api';

interface SearchBarProps {
  setLocation: (location: string) => void;
  loading?: boolean; 
  setLoading?: (loading: boolean) => void;
  onSelect?: (city: string, coords?: { lat: number; lng: number }) => void;
  customClass?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  setLocation, 
  onSelect, 
  loading, 
  setLoading, 
  customClass = "" 
}) => {
  const [query, setQuery] = useState("");
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY || '', 
    libraries: ['places'],
  });

  const onPlaceChanged = () => {
    if (autocompleteRef.current !== null) {
      const place = autocompleteRef.current.getPlace();
      
      const cityName = place.name || (place.formatted_address ? place.formatted_address.split(',')[0] : "");
      
      if (cityName) {
        setQuery(cityName);
        setLocation(cityName);

        if (onSelect && place.geometry?.location) {
          onSelect(cityName, {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng()
          });
        }
      }
    }
  };
  
  const onLoad = (autocomplete: google.maps.places.Autocomplete) => {
    autocompleteRef.current = autocomplete;
  };

  if (!isLoaded || loading) {
    return (
      <div className={`flex items-center justify-center h-[46px] text-white/50 ${customClass}`}>
        Loading...
      </div>
    );
  }

  return (
    <div className={`relative flex w-[320px] xl:w-[400px] justify-center items-center mt-2 h-[46px]
      bg-[#F5F5F5]/25 backdrop-blur-[8px] text-[16px] z-[101] rounded-full border border-white/20 px-3 ${customClass}`}>
      
      <Autocomplete
        onLoad={onLoad}
        onPlaceChanged={onPlaceChanged}
        options={{
          types: ['(cities)'], 
          fields: ['formatted_address', 'geometry', 'name']
        }}
        className="w-full"
      >
        <input
          type="text"
          placeholder="Search City..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}
          className="w-full text-white bg-transparent focus:outline-none placeholder:text-white/60 text-[16px]"
        />
      </Autocomplete>
      
      <div className="absolute right-4 cursor-pointer">
        <img src="/icons/search_icon.svg" className="w-5 h-auto object-contain" alt="search" />
      </div>
    </div>
  );
}

export default SearchBar;
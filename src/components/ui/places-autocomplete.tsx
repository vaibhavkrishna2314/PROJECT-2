import React, { useEffect, useRef, useState } from 'react';
import { debounce } from '@/lib/utils';

interface PlacesAutocompleteProps {
  value: string;
  onChange: (value: string, latitude?: number, longitude?: number) => void;
  placeholder?: string;
  className?: string;
  error?: boolean;
  disabled?: boolean;
}

interface Suggestion {
  address: string;
  lat: number;
  lon: number;
}

export const PlacesAutocomplete = ({ 
  value = '',
  onChange, 
  placeholder = "Enter an address",
  className = "",
  error = false,
  disabled = false
}: PlacesAutocompleteProps) => {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const fetchSuggestions = async (input: string) => {
    if (!input || input.length < 3) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await fetch(
        `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(input)}&apiKey=21db5bec38e643348cb8c091771b247a`
      );
      const data = await response.json();
      
      const newSuggestions = data.results?.map((result: any) => ({
        address: result.formatted,
        lat: result.lat,
        lon: result.lon
      })) || [];
      
      setSuggestions(newSuggestions);
    } catch (error) {
      console.error('Error fetching address suggestions:', error);
      setSuggestions([]);
    }
  };

  const debouncedFetch = debounce(fetchSuggestions, 300);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    debouncedFetch(newValue);
    setShowSuggestions(true);
  };

  const handleSuggestionClick = (suggestion: Suggestion) => {
    onChange(suggestion.address, suggestion.lat, suggestion.lon);
    setShowSuggestions(false);
  };

  return (
    <div ref={wrapperRef} className="relative">
      <input
        type="text"
        value={value}
        onChange={handleInputChange}
        onFocus={() => value && value.length >= 3 && setShowSuggestions(true)}
        placeholder={placeholder}
        disabled={disabled}
        className={`mt-1 block w-full rounded-md border px-3 py-2 ${
          error 
            ? 'border-accent-coral focus:border-accent-coral focus:ring-accent-coral' 
            : 'border-neutral-light focus:border-primary-green focus:ring-primary-green'
        } focus:outline-none focus:ring-1 ${
          disabled ? 'bg-gray-50 text-neutral-charcoal/70' : ''
        } ${className}`}
      />
      {showSuggestions && suggestions.length > 0 && (
        <ul className="absolute z-10 w-full bg-white mt-1 rounded-md shadow-lg max-h-60 overflow-auto">
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {suggestion.address}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
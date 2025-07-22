import React, { useState } from "react";

interface LocationPickerProps {
  value: string;
  onChange: (location: string) => void;
}

const LocationPicker: React.FC<LocationPickerProps> = ({ value, onChange }) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const fetchSuggestions = async (q: string) => {
    if (!q) {
      setSuggestions([]);
      return;
    }
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}`
    );
    const data = await res.json();
    setSuggestions(data.map((item: any) => item.display_name));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    fetchSuggestions(val);
    setShowDropdown(true);
  };

  const handleSelect = (suggestion: string) => {
    onChange(suggestion);
    setQuery("");
    setSuggestions([]);
    setShowDropdown(false);
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={query || value}
        onChange={handleInputChange}
        onFocus={() => setShowDropdown(true)}
        placeholder="Search for a location..."
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
      {showDropdown && suggestions.length > 0 && (
        <ul className="absolute z-10 left-0 right-0 bg-white border border-gray-200 rounded shadow max-h-48 overflow-y-auto mt-1">
          {suggestions.map((s, i) => (
            <li
              key={i}
              className="px-4 py-2 hover:bg-blue-100 cursor-pointer text-sm"
              onClick={() => handleSelect(s)}
            >
              {s}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LocationPicker; 
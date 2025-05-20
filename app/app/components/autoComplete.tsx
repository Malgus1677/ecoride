'use client'

import { useState, ChangeEvent, useEffect } from "react";

type AddressSuggestion = {
  label: string;
  address: string;
  city: string;
  postalCode: string;
};

type AddressAutocompleteProps = {
  placeholder?: string;
  onSelect: (address: AddressSuggestion) => void;
  resetSignal?: boolean; // Prop pour réinitialiser le champ
};

const AddressAutocomplete: React.FC<AddressAutocompleteProps> = ({
  placeholder = "Entrez une adresse",
  onSelect,
  resetSignal,
}) => {
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);

  const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    if (value.length > 2) {
      try {
        const response = await fetch(
          `https://data.geopf.fr/geocodage/search?q=${encodeURIComponent(value)}&limit=10`
        );
        const data = await response.json();

        if (data?.features) {
          const newSuggestions = data.features.map((feature: any) => ({
            label: feature.properties.label,
            address: feature.properties.name || "",
            city: feature.properties.city || "",
            postalCode: feature.properties.postcode || "",
          }));
          setSuggestions(newSuggestions);
        }
      } catch (error) {
        console.error("Erreur lors du géocodage :", error);
        setSuggestions([]);
      }
    } else {
      setSuggestions([]);
    }
  };

  const handleSelect = (selected: AddressSuggestion) => {
    setInputValue(selected.label);
    setSuggestions([]);
    onSelect(selected); // Envoie la sélection au parent
  };

  useEffect(() => {
    if (resetSignal) {
      setInputValue("");
      setSuggestions([]);
    }
  }, [resetSignal]);

  return (
    <div className="relative w-full">
      <input
        type="text"
        placeholder={placeholder}
        value={inputValue}
        onChange={handleChange}
        className="w-full px-4 py-2 border text-black bg-white border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        autoComplete="off"
      />
      {suggestions.length > 0 && (
        <ul className="absolute z-10 w-full text-black bg-white border border-gray-300 rounded-md mt-1 shadow-lg max-h-60 overflow-y-auto">
          {suggestions.map((item, index) => (
            <li
              key={index}
              className="px-4 py-2 cursor-pointer hover:bg-gray-100"
              onClick={() => handleSelect(item)}
            >
              {item.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AddressAutocomplete;

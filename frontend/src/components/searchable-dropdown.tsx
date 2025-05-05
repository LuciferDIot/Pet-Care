import type React from "react";

import { Check, ChevronsUpDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface SearchableDropdownProps {
  id: string;
  name: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
  placeholder: string;
  error?: string;
  onAddOption?: (value: string) => void;
}

export default function SearchableDropdown({
  id,
  name,
  value,
  options,
  onChange,
  placeholder,
  error,
  onAddOption,
}: SearchableDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(value);
  const [filteredOptions, setFilteredOptions] = useState<string[]>(options);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Filter options when search term changes
  useEffect(() => {
    if (searchTerm === "") {
      setFilteredOptions(options);
    } else {
      const filtered = options.filter((option) =>
        option.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredOptions(filtered);
    }
  }, [searchTerm, options]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);

        // If the search term is not in options and not empty, add it as a new option
        if (
          searchTerm &&
          !options.some(
            (option) => option.toLowerCase() === searchTerm.toLowerCase()
          ) &&
          onAddOption
        ) {
          onAddOption(searchTerm);
          onChange(searchTerm);
        }
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [searchTerm, options, onAddOption, onChange, isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    onChange(e.target.value);
  };

  const handleOptionClick = (option: string) => {
    setSearchTerm(option);
    onChange(option);
    setIsOpen(false);
  };

  const handleInputFocus = () => {
    setIsOpen(true);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="relative">
        <input
          type="text"
          id={id}
          name={name}
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent pr-10 ${
            error ? "border-red-500" : "border-gray-300"
          }`}
          placeholder={placeholder}
        />
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="absolute inset-y-0 right-0 flex items-center px-2 text-gray-500"
        >
          <ChevronsUpDown size={16} />
        </button>
      </div>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
          {filteredOptions.length > 0 ? (
            <ul className="py-1">
              {filteredOptions.map((option, index) => (
                <li
                  key={index}
                  onClick={() => handleOptionClick(option)}
                  className="px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 cursor-pointer flex items-center justify-between"
                >
                  {option}
                  {option.toLowerCase() === searchTerm.toLowerCase() && (
                    <Check size={16} className="text-purple-600" />
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-4 py-2 text-sm text-gray-500">
              No matches found. Press Enter to add "{searchTerm}" as a new
              option.
            </div>
          )}
        </div>
      )}

      {error && <p className="text-left mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}

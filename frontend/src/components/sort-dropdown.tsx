"use client"

import { useState, useRef, useEffect } from "react"
import { ArrowUpDown, Check } from "lucide-react"

export type SortOption =
  | "newest"
  | "oldest"
  | "name-asc"
  | "name-desc"
  | "adopted-first"
  | "unadopted-first"
  | "species-asc"
  | "personality-asc"

interface SortDropdownProps {
  selectedSort: SortOption
  onSortChange: (sort: SortOption) => void
}

export default function SortDropdown({ selectedSort, onSortChange }: SortDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const sortOptions = [
    { value: "newest", label: "Newest First" },
    { value: "oldest", label: "Oldest First" },
    { value: "name-asc", label: "Name (A-Z)" },
    { value: "name-desc", label: "Name (Z-A)" },
    { value: "adopted-first", label: "Adopted Pets First" },
    { value: "unadopted-first", label: "Available Pets First" },
    { value: "species-asc", label: "Species (A-Z)" },
    { value: "personality-asc", label: "Personality (A-Z)" },
  ]

  const getSortLabel = (value: SortOption) => {
    return sortOptions.find((option) => option.value === value)?.label || "Sort By"
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
      >
        <ArrowUpDown className="h-4 w-4" />
        <span>{getSortLabel(selectedSort)}</span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-56 bg-white border border-gray-200 rounded-md shadow-lg right-0">
          <ul className="py-1">
            {sortOptions.map((option) => (
              <li key={option.value}>
                <button
                  onClick={() => {
                    onSortChange(option.value as SortOption)
                    setIsOpen(false)
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 flex items-center justify-between"
                >
                  {option.label}
                  {selectedSort === option.value && <Check size={16} className="text-purple-600" />}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

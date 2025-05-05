import { MoodEnum } from "@/types/pet";
import { Filter, Frown, Smile, Zap } from "lucide-react";
import SortDropdown, { type SortOption } from "./sort-dropdown";

interface FilterBarProps {
  selectedMood: MoodEnum | "all";
  onFilterChange: (mood: MoodEnum | "all") => void;
  selectedSort: SortOption;
  onSortChange: (sort: SortOption) => void;
}

export default function FilterBar({
  selectedMood,
  onFilterChange,
  selectedSort,
  onSortChange,
}: FilterBarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between w-full gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 text-purple-700">
          <Filter size={18} />
          <span className="font-medium">Filter by mood:</span>
        </div>

        {/* Quick filter buttons */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onFilterChange("all")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              selectedMood === "all"
                ? "bg-purple-600 text-white"
                : "bg-white text-gray-700 hover:bg-purple-100"
            }`}
          >
            All Pets
          </button>

          {/* Mood filter buttons */}
          {Object.keys(MoodEnum).map((mood) => (
            <button
              key={mood}
              onClick={() => onFilterChange(mood as MoodEnum)}
              className={`flex items-center gap-1 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedMood === mood
                  ? `${
                      selectedMood === MoodEnum.Happy
                        ? "bg-green-600"
                        : selectedMood === MoodEnum.Sad
                        ? "bg-blue-600"
                        : selectedMood === MoodEnum.Excited
                        ? "bg-yellow-600"
                        : "bg-purple-600"
                    } text-white`
                  : "bg-white text-gray-700 hover:bg-purple-100"
              }`}
            >
              <span>{mood}</span>
              {mood === MoodEnum.Happy && <Smile size={16} />}
              {mood === MoodEnum.Sad && <Frown size={16} />}
              {mood === MoodEnum.Excited && <Zap size={16} />}
            </button>
          ))}
        </div>
      </div>

      {/* Sort dropdown */}
      <SortDropdown selectedSort={selectedSort} onSortChange={onSortChange} />
    </div>
  );
}

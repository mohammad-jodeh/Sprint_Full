import React from "react";
import { Filter, Sparkles } from "lucide-react";
import BoardFilters from "./BoardFilters";

// Component for filters section following SRP
const FiltersSection = ({
  filters,
  onFiltersChange,
  activeFiltersCount,
  availableUsers,
  availableSprints,
}) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center space-x-4">
      <div className="flex items-center space-x-2 text-gray-700 dark:text-gray-300">
        <Filter className="w-5 h-5" />
        <span className="font-semibold">Filters:</span>
      </div>{" "}
      <BoardFilters
        filters={filters}
        onFiltersChange={onFiltersChange}
        availableUsers={availableUsers}
        availableSprints={availableSprints} // Now show sprint filters since we removed the main sprint selector
      />
    </div>{" "}
    <FiltersSummary
      activeFiltersCount={activeFiltersCount}
      onClearFilters={() =>
        onFiltersChange({
          selectedUsers: [],
          selectedSprints: [], // Clear all filters including sprints
          showUnassigned: false,
        })
      }
    />
  </div>
);

// Component for filter summary following SRP
const FiltersSummary = ({ activeFiltersCount, onClearFilters }) => {
  if (activeFiltersCount === 0) return null;

  return (
    <div className="flex items-center space-x-3">
      <div className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500/20 to-custom-500/20 dark:from-blue-400/20 dark:to-custom-400/20 rounded-full backdrop-blur-sm border border-blue-200/50 dark:border-blue-400/30">
        <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
        <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">
          {activeFiltersCount} filter{activeFiltersCount !== 1 ? "s" : ""}{" "}
          active
        </span>
      </div>
      <button
        onClick={onClearFilters}
        className="group flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500/10 to-orange-500/10 hover:from-red-500/20 hover:to-orange-500/20 dark:from-red-400/10 dark:to-orange-400/10 dark:hover:from-red-400/20 dark:hover:to-orange-400/20 border border-red-200/50 dark:border-red-400/30 rounded-xl transition-all duration-200 hover:shadow-lg hover:scale-105 backdrop-blur-sm"
      >
        <svg
          className="w-4 h-4 text-red-500 dark:text-red-400 group-hover:rotate-90 transition-transform duration-200"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
        <span className="text-sm font-medium text-red-600 dark:text-red-400 group-hover:text-red-700 dark:group-hover:text-red-300">
          Clear all
        </span>
      </button>
    </div>
  );
};

export default FiltersSection;

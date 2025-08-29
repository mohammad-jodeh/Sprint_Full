import React from 'react';
import { X, Zap, Calendar, Hash } from 'lucide-react';

// Component for sprint filter chip following SRP
const SprintFilterChip = ({ sprint, isSelected, onToggle }) => (
  <button
    onClick={() => onToggle(sprint.id)}
    className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105 ${
      isSelected
        ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg neon-blue'
        : 'bg-white/60 dark:bg-black/40 text-gray-700 dark:text-gray-300 border border-gray-200/50 dark:border-gray-600/30 hover:bg-gray-50 dark:hover:bg-gray-800/50 backdrop-blur-sm'
    }`}
  >
    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
      isSelected ? 'bg-white/20' : 'bg-gradient-to-br from-emerald-500 to-teal-600'
    }`}>
      <Zap size={12} className="text-white" />
    </div>
    <span>{sprint.name}</span>
    {isSelected && (
      <X size={14} className="ml-1 opacity-70 hover:opacity-100" />
    )}
  </button>
);

// Component for empty sprints state
const EmptySprintsState = () => (
  <div className="flex items-center gap-2 px-3 py-2 bg-gray-100/50 dark:bg-gray-800/50 rounded-full border border-gray-200/50 dark:border-gray-600/30">
    <Calendar size={16} className="text-gray-400" />
    <span className="text-sm text-gray-500 dark:text-gray-400">No active sprints</span>
  </div>
);

// Component for clear all filters button
const ClearFiltersButton = ({ onClear }) => (
  <button
    onClick={onClear}
    className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400 bg-red-50/50 dark:bg-red-900/20 border border-red-200/50 dark:border-red-700/30 rounded-full hover:bg-red-100 dark:hover:bg-red-900/40 transition-all duration-300 transform hover:scale-105 backdrop-blur-sm"
  >
    <X size={14} />
    <span>Clear all filters</span>
  </button>
);

// Component for filter stats display
const FilterStats = ({ activeFiltersCount }) => (
  <div className="flex items-center gap-2 px-3 py-2 bg-custom-50/50 dark:bg-custom-900/20 border border-custom-200/50 dark:border-custom-700/30 rounded-full backdrop-blur-sm">
    <Hash size={14} className="text-custom-600 dark:text-custom-400" />
    <span className="text-sm font-medium text-custom-700 dark:text-custom-300">
      {activeFiltersCount} active
    </span>
  </div>
);

// Component for divider
const FilterDivider = () => (
  <div className="w-px h-6 bg-gradient-to-b from-transparent via-gray-300 dark:via-gray-600 to-transparent"></div>
);

export { 
  SprintFilterChip, 
  EmptySprintsState, 
  ClearFiltersButton, 
  FilterStats, 
  FilterDivider 
};

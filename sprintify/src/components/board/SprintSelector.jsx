import React from "react";
import { ChevronDown, Calendar, Target } from "lucide-react";

const SprintSelector = ({
  activeSprints,
  selectedSprintId,
  onSprintSelect,
  className = "",
}) => {
  const selectedSprint = activeSprints.find(
    (sprint) => sprint.id === selectedSprintId
  );

  if (activeSprints.length === 0) {
    // Show empty state if no active sprints
    return (
      <div className={`relative ${className}`}>
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 mb-2">
          <Target size={16} />
          <span className="font-medium">Sprint:</span>
        </div>
        <div className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-500 dark:text-gray-400 text-sm">
          No active sprints
        </div>
      </div>
    );
  }

  const formatDateRange = (startDate, endDate) => {
    const start = new Date(startDate).toLocaleDateString();
    const end = new Date(endDate).toLocaleDateString();
    return `${start} - ${end}`;
  };

  return (
    <div className={`relative ${className}`}>
      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 mb-2">
        <Target size={16} />
        <span className="font-medium">Sprint:</span>
      </div>

      <div className="relative">
        <select
          value={selectedSprintId || ""}
          onChange={(e) => onSprintSelect(e.target.value)}
          className="w-full pl-4 pr-10 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 text-gray-900 dark:text-white appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          {activeSprints.map((sprint) => (
            <option key={sprint.id} value={sprint.id}>
              {sprint.name}
            </option>
          ))}
        </select>

        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <ChevronDown className="w-4 h-4 text-gray-400" />
        </div>
      </div>

      {selectedSprint && (
        <div className="mt-2 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
          <Calendar size={12} />
          <span>
            {formatDateRange(selectedSprint.startDate, selectedSprint.endDate)}
          </span>
        </div>
      )}
    </div>
  );
};

export default SprintSelector;

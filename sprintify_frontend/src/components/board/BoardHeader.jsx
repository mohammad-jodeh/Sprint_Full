import React from "react";
import { ProjectTitle, BoardStats } from "./BoardStats";
import FiltersSection from "./FiltersSection";
import { LayoutGrid, Calendar } from "lucide-react";

const BoardHeader = ({
  board,
  filters,
  setFilters,
  isAnimated,
  activeFiltersCount,
  totalIssues,
  activeSprint,
  activeSprints,
  availableUsers,
  availableSprints,
  viewMode,
  setViewMode,
}) => {
  // Get selected sprint from filters
  const selectedSprint =
    filters.selectedSprints.length > 0
      ? activeSprints?.find((s) => s.id === filters.selectedSprints[0])
      : activeSprint;

  return (
    <div
      className={`px-8 py-6 border-b border-white/20 dark:border-white/10 bg-gradient-to-r from-white/40 to-white/20 dark:bg-gradient-primary transition-all duration-1000 ${
        isAnimated ? "translate-y-0 opacity-100" : "-translate-y-10 opacity-0"
      }`}
    >
      {" "}
      <div className="flex items-center justify-between space-x-6 mb-6">
        <div className="flex items-center space-x-6">
          <ProjectTitle projectName={board.project?.name} />
          <BoardStats
            totalIssues={totalIssues}
            membersCount={board.project?.members?.length || 0}
            activeSprint={selectedSprint}
          />
        </div>
        
        {/* View Mode Toggle */}
        <div className="flex items-center gap-2 bg-white/20 dark:bg-gray-800/50 rounded-lg p-1">
          <button
            onClick={() => setViewMode("kanban")}
            className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all ${
              viewMode === "kanban"
                ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            <LayoutGrid size={16} />
            Kanban
          </button>
          <button
            onClick={() => setViewMode("sprint")}
            className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all ${
              viewMode === "sprint"
                ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            <Calendar size={16} />
            Sprints
          </button>
        </div>
      </div>{" "}
      
      {/* Only show filters in kanban mode */}
      {viewMode === "kanban" && (
        <FiltersSection
          filters={filters}
          onFiltersChange={setFilters}
          activeFiltersCount={activeFiltersCount}
          availableUsers={availableUsers}
          availableSprints={activeSprints || []}
        />
      )}
    </div>
  );
};

export default BoardHeader;

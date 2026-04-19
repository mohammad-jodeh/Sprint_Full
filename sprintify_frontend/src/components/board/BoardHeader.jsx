import React from "react";
import { ProjectTitle, BoardStats } from "./BoardStats";
import FiltersSection from "./FiltersSection";
import { LayoutGrid, Calendar, ArrowDownUp, Download } from "lucide-react";

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
  onExportPDF,
}) => {
  // Get selected sprint from filters
  const selectedSprint =
    filters.selectedSprints.length > 0
      ? activeSprints?.find((s) => s.id === filters.selectedSprints[0])
      : activeSprint;

  const sortOptions = [
    { value: 'priority', label: 'Priority (High → Low)' },
    { value: 'created', label: 'Created Date (Newest)' },
    { value: 'storyPoints', label: 'Story Points (Highest)' },
    { value: 'assignee', label: 'Assignee (A-Z)' }
  ];

  const handleSortChange = (e) => {
    setFilters({
      ...filters,
      sortBy: e.target.value
    });
  };

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
        <div className="flex items-center gap-3">
          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <ArrowDownUp size={16} className="text-gray-600 dark:text-gray-400" />
            <select
              value={filters.sortBy || 'priority'}
              onChange={handleSortChange}
              className="px-3 py-2 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm font-medium border border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
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
          {/* Export PDF Button */}
          <button
            onClick={onExportPDF}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-lg text-sm font-medium transition-all shadow-sm hover:shadow-md"
            title="Export board as PDF"
          >
            <Download size={16} />
            Export PDF
          </button>        </div>
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

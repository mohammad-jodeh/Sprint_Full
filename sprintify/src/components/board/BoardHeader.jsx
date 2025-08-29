import React from "react";
import { ProjectTitle, BoardStats } from "./BoardStats";
import FiltersSection from "./FiltersSection";

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
      <div className="flex items-center space-x-6 mb-6">
        <ProjectTitle projectName={board.project?.name} />
        <BoardStats
          totalIssues={totalIssues}
          membersCount={board.project?.members?.length || 0}
          activeSprint={selectedSprint}
        />
      </div>{" "}
      <FiltersSection
        filters={filters}
        onFiltersChange={setFilters}
        activeFiltersCount={activeFiltersCount}
        availableUsers={availableUsers}
        availableSprints={activeSprints || []}
      />
    </div>
  );
};

export default BoardHeader;

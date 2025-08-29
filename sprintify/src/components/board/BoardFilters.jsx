import React from "react";
import { useParams } from "react-router-dom";
import { UserFilterChip, UnassignedFilterChip } from "./FilterChips";
import {
  SprintFilterChip,
  EmptySprintsState,
  ClearFiltersButton,
  FilterStats,
  FilterDivider,
} from "./SprintFilterComponents";
import { useFilterData } from "../../hooks/useFilterData";
import { useFilterActions } from "../../hooks/useFilterActions";

const BoardFilters = ({
  filters,
  onFiltersChange,
  availableUsers = [],
  availableSprints = [],
}) => {
  const { projectId } = useParams();
  const {
    handleUserToggle,
    handleSprintToggle,
    handleUnassignedToggle,
    clearAllFilters,
  } = useFilterActions(filters, onFiltersChange);

  const hasActiveFilters =
    filters.selectedUsers.length > 0 ||
    filters.selectedSprints.length > 0 ||
    filters.showUnassigned;

  const activeFiltersCount =
    filters.selectedUsers.length +
    filters.selectedSprints.length +
    (filters.showUnassigned ? 1 : 0);

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {/* User Filters */}
      <UserFiltersSection
        users={availableUsers}
        selectedUsers={filters.selectedUsers}
        showUnassigned={filters.showUnassigned}
        onUserToggle={handleUserToggle}
        onUnassignedToggle={handleUnassignedToggle}
      />
      {/* Divider */}
      {availableUsers.length > 0 && availableSprints.length > 0 && (
        <FilterDivider />
      )}{" "}
      {/* Sprint Filters */}
      <SprintFiltersSection
        sprints={availableSprints}
        selectedSprints={filters.selectedSprints}
        onSprintToggle={handleSprintToggle}
      />
    </div>
  );
};

// Loading component following SRP
const LoadingState = () => (
  <div className="flex items-center gap-2 px-4 py-2 bg-white/50 dark:bg-black/30 rounded-full backdrop-blur-sm border border-gray-200/50 dark:border-gray-600/30">
    <div className="w-4 h-4 border-2 border-custom-500 border-t-transparent rounded-full animate-spin"></div>
    <span className="text-sm text-gray-600 dark:text-gray-400">
      Loading filters...
    </span>
  </div>
);

// User filters section component
const UserFiltersSection = ({
  users,
  selectedUsers,
  showUnassigned,
  onUserToggle,
  onUnassignedToggle,
}) => (
  <div className="flex items-center gap-2">
    {users.map((member) => {
      const user = member.user || member;
      const userId = user.id || member.userId;
      const isSelected = selectedUsers.includes(userId);

      return (
        <UserFilterChip
          key={userId}
          user={user}
          userId={userId}
          isSelected={isSelected}
          onToggle={onUserToggle}
        />
      );
    })}

    <UnassignedFilterChip
      isSelected={showUnassigned}
      onToggle={onUnassignedToggle}
    />
  </div>
);

// Sprint filters section component
const SprintFiltersSection = ({ sprints, selectedSprints, onSprintToggle }) => (
  <div className="flex items-center gap-2">
    {sprints.length === 0 ? (
      <EmptySprintsState />
    ) : (
      sprints.map((sprint) => {
        const isSelected = selectedSprints.includes(sprint.id);

        return (
          <SprintFilterChip
            key={sprint.id}
            sprint={sprint}
            isSelected={isSelected}
            onToggle={onSprintToggle}
          />
        );
      })
    )}
  </div>
);
export default BoardFilters;

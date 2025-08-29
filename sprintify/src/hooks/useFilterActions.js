// Custom hook for filter actions following SRP
export const useFilterActions = (filters, onFiltersChange) => {
  const handleUserToggle = (userId) => {
    const newSelectedUsers = filters.selectedUsers.includes(userId)
      ? filters.selectedUsers.filter(id => id !== userId)
      : [...filters.selectedUsers, userId];
    
    onFiltersChange({
      ...filters,
      selectedUsers: newSelectedUsers
    });
  };

  const handleSprintToggle = (sprintId) => {
    const newSelectedSprints = filters.selectedSprints.includes(sprintId)
      ? filters.selectedSprints.filter(id => id !== sprintId)
      : [...filters.selectedSprints, sprintId];
    
    onFiltersChange({
      ...filters,
      selectedSprints: newSelectedSprints
    });
  };

  const handleUnassignedToggle = () => {
    onFiltersChange({
      ...filters,
      showUnassigned: !filters.showUnassigned
    });
  };

  const clearAllFilters = () => {
    onFiltersChange({
      selectedUsers: [],
      selectedSprints: [],
      showUnassigned: false
    });
  };

  const removeUserFilter = (userId) => {
    const newSelectedUsers = filters.selectedUsers.filter(id => id !== userId);
    onFiltersChange({
      ...filters,
      selectedUsers: newSelectedUsers
    });
  };

  const removeSprintFilter = (sprintId) => {
    const newSelectedSprints = filters.selectedSprints.filter(id => id !== sprintId);
    onFiltersChange({
      ...filters,
      selectedSprints: newSelectedSprints
    });
  };

  return {
    handleUserToggle,
    handleSprintToggle,
    handleUnassignedToggle,
    clearAllFilters,
    removeUserFilter,
    removeSprintFilter
  };
};

import React, { useState, useEffect, useMemo } from "react";
import BoardHeader from "./BoardHeader";
import BoardContent from "./BoardContent";
import SprintBoard from "./SprintBoard";
import { useBoardStore } from "../../store/boardStore";
import { useProjectRole } from "../../hooks/useProjectRole";
import { can, PERMISSIONS } from "../../utils/permission";
import { updateTask } from "../../api/tasks";

const Board = ({
  boardData,
  issues,
  setIssues,
  statuses,
  setStatuses,
  columns,
  setColumns,
  activeSprint,
  activeSprints,
  epics,
  onIssueClick,
}) => {
  const storeBoard = useBoardStore((state) => state.board);
  const storeFilters = useBoardStore((state) => state.filters);
  const storeSetFilters = useBoardStore((state) => state.setFilters);

  // Add view toggle state
  const [viewMode, setViewMode] = useState("kanban"); // "kanban" or "sprint"

  // Use props if provided, otherwise fall back to store
  const board = useMemo(() => {
    if (boardData && issues && statuses && columns) {
      // Structure real API data into board format
      const statusesByColumn = statuses.reduce((acc, status) => {
        if (!acc[status.columnId]) acc[status.columnId] = [];
        acc[status.columnId].push(status);
        return acc;
      }, {});

      const structuredColumns = columns
        .sort((a, b) => (a.order || 0) - (b.order || 0))
        .map((column) => ({
          ...column,
          statuses: statusesByColumn[column.id] || [],
        }));

      return {
        project: boardData,
        columns: structuredColumns,
        issues: issues,
      };
    }
    return storeBoard;
  }, [boardData, statuses, issues, columns, storeBoard]);

  const filters = storeFilters;
  const setFilters = storeSetFilters; // Apply filters to issues (including sprint filtering via filters)
  const filteredIssues = useMemo(() => {
    if (!board.issues) return [];

    let filtered = board.issues;

    // Filter by selected sprints (main sprint filtering)
    if (filters.selectedSprints.length > 0) {
      filtered = filtered.filter((issue) =>
        filters.selectedSprints.includes(issue.sprintId)
      );
    } else if (activeSprint?.id) {
      // Fallback to active sprint if no specific sprint selected
      filtered = filtered.filter((issue) => issue.sprintId === activeSprint.id);
    } else {
      // If no active sprint and no selected sprint, show no issues
      return [];
    }

    // Filter by selected users
    if (filters.selectedUsers.length > 0) {
      filtered = filtered.filter(
        (issue) =>
          filters.selectedUsers.includes(issue.assignee) ||
          (filters.showUnassigned && !issue.assignee)
      );
    }

    // Filter by unassigned if selected and no specific users selected
    if (filters.showUnassigned && filters.selectedUsers.length === 0) {
      filtered = filtered.filter((issue) => !issue.assignee);
    }

    return filtered;
  }, [board.issues, filters, activeSprint]);
  const [isAnimated, setIsAnimated] = useState(false);

  // Get project role and permissions
  const { projectRole } = useProjectRole();
  const canCreateTask = can(projectRole, PERMISSIONS.CREATE_TASK);
  const canConfigureBoard = can(projectRole, PERMISSIONS.CONFIGURE_BOARD);
  useEffect(() => {
    setIsAnimated(true);
  }, []);
  const activeFiltersCount =
    filters.selectedUsers.length +
    filters.selectedSprints.length +
    (filters.showUnassigned ? 1 : 0);
  const totalIssues = board.issues.length;
  // Handler functions following SRP
  const handleIssueCreated = (newIssue) => {
    setIssues((prev) => [...prev, newIssue]);
  };
  const handleColumnCreated = (data) => {
    const { column, statuses: newStatuses } = data;
    setColumns((prev) => [...prev, column]);
    if (newStatuses && newStatuses.length > 0) {
      setStatuses((prev) => [...prev, ...newStatuses]);
    }
  };

  const handleColumnUpdated = (updatedColumn) => {
    setColumns((prev) =>
      prev.map((col) => (col.id === updatedColumn.id ? updatedColumn : col))
    );
  };
  const handleColumnDeleted = (columnId) => {
    setColumns((prev) => prev.filter((col) => col.id !== columnId));
    // Also remove statuses that belonged to this column
    setStatuses((prev) =>
      prev.filter((status) => status.columnId !== columnId)
    );
  };
  const handleAddIssue = () => {
    // Add issue logic here
  };

  const handleSettings = () => {
    // Settings logic here
  };

  const handleMore = () => {
    // More actions logic here
  };
  // Handle moving issues between statuses
  const handleMoveIssue = async (sourceStatusId, targetStatusId, issueId) => {
    if (sourceStatusId === targetStatusId) return;

    try {
      // Update the issue's status in the API
      await updateTask(issueId, { statusId: targetStatusId });

      // Update the local state immediately to reflect the change
      if (setIssues) {
        setIssues((prevIssues) =>
          prevIssues.map((issue) =>
            issue.id === issueId
              ? { ...issue, statusId: targetStatusId }
              : issue
          )
        );
      }
    } catch (error) {
      console.error("Failed to move issue:", error);
      // You could add a toast notification here to inform the user of the error
    }
  };

  return (
    <div className="relative overflow-y-hidden">
      {/* Animated Background Layers */}

      {/* Glass morphism container */}
      <div className="flex flex-col">
        {" "}
        {/* Board Header */}{" "}
        <BoardHeader
          board={board}
          filters={filters}
          setFilters={setFilters}
          isAnimated={isAnimated}
          activeFiltersCount={activeFiltersCount}
          totalIssues={totalIssues}
          activeSprint={activeSprint}
          activeSprints={activeSprints}
          availableUsers={boardData?.members || []}
          availableSprints={activeSprints || []}
          viewMode={viewMode}
          setViewMode={setViewMode}
        />
        
        {/* Board Content - Conditional based on view mode */}
        {viewMode === "sprint" ? (
          <SprintBoard
            issues={board.issues || []}
            setIssues={setIssues}
            activeSprints={activeSprints || []}
            onIssueClick={onIssueClick}
            projectId={boardData?.id}
          />
        ) : (
          <BoardContent
            board={board}
            isAnimated={isAnimated}
            canConfigureBoard={canConfigureBoard}
            canCreateTask={canCreateTask}
            issues={filteredIssues}
            onMoveIssue={handleMoveIssue}
            epics={epics}
            onIssueClick={onIssueClick}
            onIssueCreated={handleIssueCreated}
            onColumnCreated={handleColumnCreated}
            onColumnUpdated={handleColumnUpdated}
            onColumnDeleted={handleColumnDeleted}
            filters={filters}
            activeSprints={activeSprints}
          />
        )}
      </div>
    </div>
  );
};

export default Board;

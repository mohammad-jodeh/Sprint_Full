import React, { useState, useEffect, useMemo, useCallback } from "react";
import BoardHeader from "./BoardHeader";
import BoardContent from "./BoardContent";
import SprintBoard from "./SprintBoard";
import { useBoardStore } from "../../store/boardStore";
import { useProjectRole } from "../../hooks/useProjectRole";
import { can, PERMISSIONS } from "../../utils/permission";
import { updateTask } from "../../api/tasks";
import { fetchBoardColumns } from "../../api/boardColumns";
import socketService from "../../services/socket";

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

  // Add view toggle state - Kanban is now the default main view
  const [viewMode, setViewMode] = useState("kanban");

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
    // Ensure board.issues is an array
    if (!Array.isArray(board.issues)) return [];

    let filtered = board.issues;

    // Filter by selected sprints (main sprint filtering)
    if (filters.selectedSprints.length > 0) {
      filtered = filtered.filter((issue) =>
        filters.selectedSprints.includes(issue.sprintId)
      );
    } else if (activeSprints && activeSprints.length > 0) {
      // If multiple sprints are active, show issues from ALL active sprints
      const activeSprintIds = activeSprints.map(s => s.id);
      filtered = filtered.filter((issue) => activeSprintIds.includes(issue.sprintId));
    } else if (activeSprint?.id) {
      // Fallback to single active sprint if multiple don't exist
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
  }, [board.issues, filters, activeSprint, activeSprints]);
  const [isAnimated, setIsAnimated] = useState(false);

  // Get project role and permissions
  const { projectRole } = useProjectRole();
  const canCreateTask = can(projectRole, PERMISSIONS.CREATE_TASK);
  const canConfigureBoard = can(projectRole, PERMISSIONS.CONFIGURE_BOARD);
  useEffect(() => {
    setIsAnimated(true);
  }, []);

  // ===== SETUP REAL-TIME SOCKET.IO LISTENERS =====
  useEffect(() => {
    // Handler for issue updates
    const handleIssueUpdate = (updatedIssue) => {
      console.log("📝 Real-time issue update received:", updatedIssue);
      setIssues((prev) =>
        prev.map((issue) =>
          issue.id === updatedIssue.id ? { ...issue, ...updatedIssue } : issue
        )
      );
    };

    // Handler for new issues
    const handleNewIssue = (newIssue) => {
      console.log("➕ Real-time new issue received:", newIssue);
      setIssues((prev) => [...prev, newIssue]);
    };

    // Handler for deleted issues
    const handleIssueDelete = (deletedIssueId) => {
      console.log("🗑️ Real-time issue deleted:", deletedIssueId);
      setIssues((prev) => prev.filter((issue) => issue.id !== deletedIssueId));
    };

    // Handler for status changes
    const handleStatusChange = (issueData) => {
      console.log("🔄 Real-time status change:", issueData);
      setIssues((prev) =>
        prev.map((issue) =>
          issue.id === issueData.id
            ? { ...issue, statusId: issueData.statusId }
            : issue
        )
      );
    };

    // Handler for assignment changes
    const handleAssignmentChange = (issueData) => {
      console.log("👤 Real-time assignment change:", issueData);
      setIssues((prev) =>
        prev.map((issue) =>
          issue.id === issueData.id
            ? { ...issue, assignee: issueData.assignee }
            : issue
        )
      );
    };

    // Register all callbacks with socket service
    socketService.setOnIssueUpdated(handleIssueUpdate);
    socketService.setOnIssueCreated(handleNewIssue);
    socketService.setOnIssueDeleted(handleIssueDelete);
    socketService.setOnIssueStatusChanged(handleStatusChange);
    socketService.setOnIssueAssigned(handleAssignmentChange);

    // Cleanup function: remove callbacks when component unmounts
    return () => {
      socketService.setOnIssueUpdated(null);
      socketService.setOnIssueCreated(null);
      socketService.setOnIssueDeleted(null);
      socketService.setOnIssueStatusChanged(null);
      socketService.setOnIssueAssigned(null);
    };
  }, [setIssues]);
  // ===== END SOCKET.IO SETUP =====
  const activeFiltersCount =
    filters.selectedUsers.length +
    filters.selectedSprints.length +
    (filters.showUnassigned ? 1 : 0);
  const totalIssues = board.issues.length;
  // Handler functions following SRP - memoized to prevent child re-renders
  const handleIssueCreated = useCallback((newIssue) => {
    setIssues((prev) => [...prev, newIssue]);
  }, [setIssues]);

  const handleColumnCreated = useCallback(async (data) => {
    const { column, statuses: newStatuses } = data;
    setColumns((prev) => [...prev, column]);
    if (newStatuses && newStatuses.length > 0) {
      setStatuses((prev) => [...prev, ...newStatuses]);
    }
    
    // ⚡ Refetch columns from API to ensure they're properly loaded and ordered
    // This prevents issues with newly created columns not appearing
    try {
      if (boardData?.id) {
        const freshColumns = await fetchBoardColumns(boardData.id);
        setColumns(freshColumns);
      }
    } catch (error) {
      console.error('Failed to refresh columns after creation:', error);
      // Keep the optimistic update even if refresh fails
    }
  }, [setColumns, setStatuses, boardData?.id]);

  const handleColumnUpdated = useCallback((updatedColumn) => {
    setColumns((prev) =>
      prev.map((col) => (col.id === updatedColumn.id ? updatedColumn : col))
    );
  }, [setColumns]);

  const handleColumnDeleted = useCallback((columnId) => {
    setColumns((prev) => prev.filter((col) => col.id !== columnId));
    setStatuses((prev) =>
      prev.filter((status) => status.columnId !== columnId)
    );
  }, [setColumns, setStatuses]);

  const handleMoveIssue = useCallback(async (sourceStatusId, targetStatusId, issueId) => {
    if (sourceStatusId === targetStatusId) return;

    try {
      const projectId = board.project?.id;
      if (!projectId) {
        console.error("Project ID is not available");
        return;
      }
      
      await updateTask(projectId, issueId, { statusId: targetStatusId });

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
    }
  }, [board.project?.id, setIssues]);

  // Check if we have required data to render the board
  const hasRequiredData = board?.columns && board.columns.length > 0 && board.issues;
  
  if (!hasRequiredData) {
    return (
      <div className="flex flex-col items-center justify-center h-screen space-y-4">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No Board Data
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            This project doesn't have any board columns configured yet.
          </p>
        </div>
      </div>
    );
  }

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

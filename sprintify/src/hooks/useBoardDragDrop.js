import { useState } from "react";
import { updateTask } from "../api/tasks";

/**
 * Custom hook for managing drag and drop functionality in the board
 * @param {Array} issues - The list of issues
 * @param {Function} setIssues - Function to update issues
 * @param {Array} columns - List of columns
 * @returns {Object} - Drag and drop handlers and state
 */
export function useBoardDragDrop(issues, setIssues, columns) {
  const [activeId, setActiveId] = useState(null);
  const [activeDragData, setActiveDragData] = useState(null);

  const handleDragStart = (event) => {
    const { active } = event;
    // Store the active ID for overlay rendering
    setActiveId(active.id);

    // Find the issue data for the active item    const draggedIssue = issues.find(issue => issue.id === active.id);
    if (draggedIssue) {
      setActiveDragData(draggedIssue);
    }
  };

  const handleDragOver = (event) => {
    // Get information about what we're dragging over
    const { active, over } = event;

    if (over) {
      // Check if we're over a column
      const targetColumn = columns.find((col) => col.id === over.id);
      if (targetColumn) {
        // Column hover logic
      } // Check if we're over another issue
      else {
        const targetIssue = issues.find((issue) => issue.id === over.id);
        if (targetIssue) {
          const columnTitle =
            columns.find((col) => col.id === targetIssue.statusId)?.title ||
            "Unknown";
        }
        // Check if we're over an empty column area
        else if (over.data?.current?.node) {
          const overElement = over.data.current.node;
          const columnElement = overElement.closest("[data-column-id]");
          if (columnElement) {
            const columnId = columnElement.getAttribute("data-column-id");
            const matchingColumn = columns.find(
              (col) => col.id.toString() === columnId
            );
            if (matchingColumn) {
            }
          }
        }
      }
    }
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active && over && active.id !== over.id) {
      const issueId = active.id;
      let newStatusId;

      // Handling collision detection with columns or other issues
      const targetColumn = columns.find((col) => col.id === over.id);
      if (targetColumn) {
        // Dropped directly on a column
        newStatusId = targetColumn.id;
      } else {
        // Dropped on another issue, find which column that issue belongs to
        const targetIssue = issues.find((issue) => issue.id === over.id);
        if (targetIssue) {
          newStatusId = targetIssue.statusId;
        } else {
          // Try to determine if we dropped on an empty column's drop area
          // by checking the closest container through DOM traversal
          const overElement = over.data?.current?.node;
          if (overElement) {
            // Find the closest droppable column id
            const columnElement = overElement.closest("[data-column-id]");
            if (columnElement) {
              const columnId = columnElement.getAttribute("data-column-id");
              const matchingColumn = columns.find(
                (col) => col.id.toString() === columnId
              );
              if (matchingColumn) {
                newStatusId = matchingColumn.id;
              }
            }
          }
        }
      }

      if (newStatusId) {
        // Optimistic update for UI responsiveness
        setIssues((prevIssues) =>
          prevIssues.map((issue) =>
            issue.id === issueId ? { ...issue, statusId: newStatusId } : issue
          )
        );

        // Update the task on the server
        updateTask(issueId, { statusId: newStatusId }).catch((error) => {
          console.error("Failed to update task status:", error);
          // Revert optimistic update on failure
          setIssues((prevIssues) =>
            prevIssues.map((issue) =>
              issue.id === issueId
                ? { ...issue, statusId: issue.statusId }
                : issue
            )
          );
        });
      }
    }
    // Reset drag state
    setActiveId(null);
    setActiveDragData(null);
  };

  const handleDragCancel = () => {
    // Reset drag state
    setActiveId(null);
    setActiveDragData(null);
  };

  return {
    activeId,
    activeDragData,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    handleDragCancel,
  };
}

import React, { useMemo } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import SprintBoardSection from "./SprintBoardSection";
import { updateIssue } from "../../api/issues";
import toast from "react-hot-toast";

const SprintBoard = ({
  issues,
  setIssues,
  activeSprints,
  onIssueClick,
  projectId
}) => {
  // Group issues by sprint
  const issuesBySprintAndBacklog = useMemo(() => {
    const groups = {
      backlog: [], // Issues with no sprintId
    };

    // Initialize groups for each active sprint
    activeSprints.forEach(sprint => {
      groups[sprint.id] = [];
    });

    // Group issues
    issues.forEach(issue => {
      if (!issue.sprintId) {
        groups.backlog.push(issue);
      } else if (groups[issue.sprintId]) {
        groups[issue.sprintId].push(issue);
      } else {
        // Issue belongs to a sprint that's not active, put in backlog
        groups.backlog.push(issue);
      }
    });

    return groups;
  }, [issues, activeSprints]);

  const handleDragEnd = async (result) => {
    const { source, destination, draggableId } = result;

    // Return if dropped outside a droppable area
    if (!destination) return;

    // Return if dropped in the same place
    if (source.droppableId === destination.droppableId && source.index === destination.index) {
      return;
    }

    const newSprintId = destination.droppableId === "backlog" ? null : destination.droppableId;
    const originalSprintId = source.droppableId === "backlog" ? null : source.droppableId;

    // Optimistically update the UI
    setIssues((prev) =>
      prev.map((issue) =>
        issue.id === draggableId ? { ...issue, sprintId: newSprintId } : issue
      )
    );

    try {
      await updateIssue(projectId, draggableId, { sprintId: newSprintId });
      
      if (newSprintId) {
        const targetSprint = activeSprints.find(s => s.id === newSprintId);
        toast.success(`Issue moved to ${targetSprint?.name || 'sprint'}`);
      } else {
        toast.success("Issue moved to backlog");
      }
    } catch (error) {
      console.error("Failed to move issue:", error);
      toast.error("Failed to move issue");
      
      // Revert the optimistic update
      setIssues((prev) =>
        prev.map((issue) =>
          issue.id === draggableId
            ? { ...issue, sprintId: originalSprintId }
            : issue
        )
      );
    }
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Sprint Board
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Drag and drop issues between sprints and backlog to manage sprint assignments
          </p>
        </div>

        <div className="flex gap-6 overflow-x-auto pb-4">
          {/* Backlog Section */}
          <SprintBoardSection
            isBacklog={true}
            issues={issuesBySprintAndBacklog.backlog}
            onIssueClick={onIssueClick}
          />

          {/* Active Sprint Sections */}
          {activeSprints.map(sprint => (
            <SprintBoardSection
              key={sprint.id}
              sprint={sprint}
              issues={issuesBySprintAndBacklog[sprint.id] || []}
              onIssueClick={onIssueClick}
            />
          ))}
        </div>

        {activeSprints.length === 0 && (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <div className="mb-4 text-4xl">🚀</div>
            <h3 className="text-lg font-medium mb-2">No Active Sprints</h3>
            <p>Create and start a sprint to organize your issues</p>
          </div>
        )}
      </div>
    </DragDropContext>
  );
};

export default SprintBoard;
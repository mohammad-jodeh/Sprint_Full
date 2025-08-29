// Custom hook for drag and drop functionality following SRP
import { useBoardStore } from "../store/boardStore";

export const useDragAndDrop = (statusId) => {
  const moveIssue = useBoardStore((state) => state.moveIssue);

  const handleDragOver = (e) => {
    e.preventDefault();
    // Don't stop propagation to allow auto-scroll to work
    // Visual feedback is now handled in StatusSection component
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    // Don't stop propagation to allow auto-scroll to continue working
    // Visual feedback is now handled in StatusSection component
  };

  const handleDrop = (e) => {
    e.preventDefault();
    // Only stop propagation on successful drop to prevent duplicate handling
    
    const issueId = e.dataTransfer.getData('issueId');
    const sourceStatusId = e.dataTransfer.getData('sourceStatusId');
    
    if (issueId && sourceStatusId !== statusId) {
      e.stopPropagation(); // Only stop propagation when we actually handle the drop
      moveIssue(sourceStatusId, statusId, issueId);
    }
  };

  return {
    handleDragOver,
    handleDragLeave,
    handleDrop
  };
};

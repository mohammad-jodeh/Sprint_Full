import { useState } from "react";

/**
 * Custom hook for issue card drag and drop functionality using native HTML5 API
 */
export const useIssueCardDragDrop = (issue) => {
  const [isDragging, setIsDragging] = useState(false);

  const dragStartHandler = (e) => {
    setIsDragging(true);
    e.dataTransfer.setData("issueId", issue.id);
    e.dataTransfer.setData("sourceStatusId", issue.statusId);
    e.dataTransfer.effectAllowed = "move";
  };

  const dragEndHandler = (e) => {
    setIsDragging(false);
  };

  return {
    isDragging,
    dragStartHandler,
    dragEndHandler,
  };
};

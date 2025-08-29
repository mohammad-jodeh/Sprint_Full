import React, { useState, useEffect, useRef } from "react";
import StatusHeader from "./StatusHeader.jsx";
import IssuesList from "../IssueCard/IssuesList";
import { getStatusTypeColor, getStatusTypeText } from "../StatusTypeUtils.jsx";

const StatusSection = ({
  status,
  issues,
  isLast,
  onMoveIssue,
  epics = [],
  onIssueClick,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isDraggedOver, setIsDraggedOver] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const dragTimeoutRef = useRef(null);

  // Create drag and drop handlers that use the onMoveIssue prop
  const handleDragOver = (e) => {
    e.preventDefault();
    // Don't stop propagation to allow auto-scroll to work
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    // Don't stop propagation to allow auto-scroll to continue working
  };

  const handleDrop = (e) => {
    e.preventDefault();

    const issueId = e.dataTransfer.getData("issueId");
    const sourceStatusId = e.dataTransfer.getData("sourceStatusId");

    if (issueId && sourceStatusId !== status.id && onMoveIssue) {
      e.stopPropagation();
      onMoveIssue(sourceStatusId, status.id, issueId);
    }
  };

  const statusTypeColor = getStatusTypeColor(status.type);
  const statusTypeText = getStatusTypeText(status.type);

  // Listen for global drag events to track when dragging starts/ends
  useEffect(() => {
    const handleGlobalDragStart = () => {
      setIsDragging(true);
    };

    const handleGlobalDragEnd = () => {
      setIsDragging(false);
      setIsDraggedOver(false);
      if (dragTimeoutRef.current) {
        clearTimeout(dragTimeoutRef.current);
        dragTimeoutRef.current = null;
      }
    };

    document.addEventListener("dragstart", handleGlobalDragStart);
    document.addEventListener("dragend", handleGlobalDragEnd);
    document.addEventListener("drop", handleGlobalDragEnd);

    return () => {
      document.removeEventListener("dragstart", handleGlobalDragStart);
      document.removeEventListener("dragend", handleGlobalDragEnd);
      document.removeEventListener("drop", handleGlobalDragEnd);
      if (dragTimeoutRef.current) {
        clearTimeout(dragTimeoutRef.current);
      }
    };
  }, []);

  const handleEnhancedDragOver = (e) => {
    if (!isDragging) return;

    e.preventDefault(); // Allow drop
    setIsDraggedOver(true);

    // Clear any pending timeout
    if (dragTimeoutRef.current) {
      clearTimeout(dragTimeoutRef.current);
      dragTimeoutRef.current = null;
    }

    handleDragOver(e);
  };

  const handleEnhancedDragLeave = (e) => {
    // Use timeout to prevent flickering when moving between child elements
    if (dragTimeoutRef.current) {
      clearTimeout(dragTimeoutRef.current);
    }

    dragTimeoutRef.current = setTimeout(() => {
      setIsDraggedOver(false);
    }, 50);

    handleDragLeave(e);
  };

  const handleEnhancedDrop = (e) => {
    setIsDraggedOver(false);
    if (dragTimeoutRef.current) {
      clearTimeout(dragTimeoutRef.current);
      dragTimeoutRef.current = null;
    }
    handleDrop(e);
  };

  return (
    <div
      className={`rounded-xl transition-all duration-300 hover:shadow-lg ${
        !isLast ? "mb-4" : ""
      }`}
    >
      <div
        className={`${statusTypeColor} border-l-4 rounded-xl p-3 transition-all duration-200 backdrop-blur-sm shadow-sm hover:shadow-md
          ${
            isDraggedOver
              ? "ring-2 ring-primary ring-opacity-50 scale-[1.02] bg-primary/10 dark:bg-primary/20"
              : ""
          }
        `}
        onDragOver={handleEnhancedDragOver}
        onDragLeave={handleEnhancedDragLeave}
        onDrop={handleEnhancedDrop}
      >
        <StatusHeader
          status={status}
          issueCount={issues.length}
          isCollapsed={isCollapsed}
          onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
          statusTypeColor={statusTypeColor}
          statusTypeText={statusTypeText}
        />
        <IssuesList
          issues={issues}
          isCollapsed={isCollapsed}
          epics={epics}
          onIssueClick={onIssueClick}
        />
        {/* Drop zone indicator when dragging */}
        {isDraggedOver && isDragging && (
          <div className="mt-2 p-2 border-2 border-dashed border-primary rounded-lg bg-primary/5 dark:bg-primary/10 text-center">
            <span className="text-sm text-primary font-medium">
              Drop issue here
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatusSection;

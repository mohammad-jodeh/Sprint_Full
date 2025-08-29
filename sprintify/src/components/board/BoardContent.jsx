import React, { useRef, useCallback } from "react";
import Column from "./Column/Column";
import CreateColumn from "./Column/CreateColumn";
import { useAutoScroll } from "../../hooks/useAutoScroll";
import { useColumnReorder } from "../../hooks/useColumnReorder";
import { useBoardStore } from "../../store/boardStore";

const BoardContent = ({
  board,
  isAnimated,
  canConfigureBoard,
  canCreateTask,
  issues = [], // Add issues prop
  onMoveIssue, // Add onMoveIssue prop
  epics = [], // Add epics prop
  onIssueClick, // Add onIssueClick prop
  onIssueCreated, // Add handler functions
  onColumnCreated,
  onColumnUpdated,
  onColumnDeleted,
  filters,
  activeSprints,
}) => {
  const boardContentRef = useRef(null);
  const { reorderColumns } = useBoardStore();

  // Column reordering functionality
  const handleColumnReorder = async (newColumnOrder) => {
    if (board.project?.id) {
      try {
        await reorderColumns(board.project.id, newColumnOrder);
      } catch (error) {
        console.error('Failed to reorder columns:', error);
        // Could add toast notification here
      }
    }
  };

  const {
    handleDragStart: handleColumnDragStart,
    handleDragOver: handleColumnDragOver,
    handleDragLeave: handleColumnDragLeave,
    handleDrop: handleColumnDrop,
    handleDragEnd: handleColumnDragEnd,
    getDragStyles: getColumnDragStyles,
  } = useColumnReorder(board.columns, handleColumnReorder);

  const {
    containerRef: autoScrollRef,
    handleDragOver: autoScrollDragOver,
    handleDragLeave: autoScrollDragLeave,
    handleDrop: autoScrollDrop,
  } = useAutoScroll({
    horizontalScroll: true,
    verticalScroll: false,
    scrollSpeed: 15,
    edgeSize: 80,
  });

  // Combine refs for the scroll container
  const setRefs = useCallback((node) => {
    boardContentRef.current = node;
    autoScrollRef.current = node;
  }, []);

  return (
    <div
      onDragOver={autoScrollDragOver}
      onDragLeave={autoScrollDragLeave}
      onDrop={autoScrollDrop}
      className={`transition-all duration-1000 delay-300 ${
        isAnimated ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
      } horizontal-scroll-active overflow-x-auto overflow-visible flex-1`}
    >
      <div className="flex space-x-8 min-w-max p-8 ">
        {" "}        {board.columns.map((column, index) => (
          <div
            key={column.id}
            className={`transition-all duration-700 ${
              isAnimated
                ? "translate-y-0 opacity-100"
                : "translate-y-20 opacity-0"
            }${getColumnDragStyles(index)}`}
            style={{ transitionDelay: `${index * 150}ms` }}
            draggable={canConfigureBoard}
            onDragStart={(e) => handleColumnDragStart(e, column, index)}
            onDragOver={(e) => handleColumnDragOver(e, index)}
            onDragLeave={handleColumnDragLeave}
            onDrop={(e) => handleColumnDrop(e, index)}
            onDragEnd={handleColumnDragEnd}
          >
            {" "}            <Column
              column={column}
              index={index}
              canCreateTask={canCreateTask}
              issues={issues}
              onMoveIssue={onMoveIssue}
              epics={epics}
              onIssueClick={onIssueClick}
              onIssueCreated={onIssueCreated}
              onColumnUpdated={onColumnUpdated}
              onColumnDeleted={onColumnDeleted}
              filters={filters}
              activeSprints={activeSprints}
              projectId={board.project?.id}
            />
          </div>
        ))}
        {canConfigureBoard && (
          <CreateColumn
            projectId={board.project?.id}
            onColumnCreated={onColumnCreated}
            isAnimated={isAnimated}
            animationDelay={board.columns.length * 150}
          />
        )}
      </div>
    </div>
  );
};

export default BoardContent;

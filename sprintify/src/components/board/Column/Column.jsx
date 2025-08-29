import React, { useState } from "react";
import CreateInlineItem from "../IssueCard/CreateInlineItem";
import StatusSection from "../status/StatusSection";
import ConfirmDeleteColumnModal from "../../modals/ConfirmDeleteColumnModal";
import ColumnInfo from "./ColumnInfo";
import ColumnEditForm from "./ColumnEditForm";
import ColumnMenu from "./ColumnMenu";
import { useBoardStore } from "../../../store/boardStore";
import { useColumnEdit } from "../../../hooks/useColumnEdit";
import { useAutoScroll } from "../../../hooks/useAutoScroll";
import { updateBoardColumn, deleteBoardColumn } from "../../../api/boardColumns";

const Column = ({
  column,
  index,
  canCreateTask,
  issues = [],
  onMoveIssue,
  epics = [],
  onIssueClick,
  onIssueCreated,
  onColumnUpdated,
  onColumnDeleted,
  filters,
  activeSprints,
  projectId, // Add projectId prop
}) => {
  const { board, updateColumn, removeColumn } = useBoardStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Calculate total issues for this column for display in header
  const columnIssuesCount = React.useMemo(() => {
    if (!issues || !column.statuses) return 0;
    const statusIds = column.statuses.map((status) => status.id);
    return issues.filter((issue) => statusIds.includes(issue.statusId)).length;
  }, [issues, column.statuses]);

  // Auto-scroll for vertical scrolling within the column
  const {
    containerRef: columnScrollRef,
    handleDragOver: handleAutoScrollDragOver,
    handleDragLeave: handleAutoScrollDragLeave,
    handleDrop: handleAutoScrollDrop,
  } = useAutoScroll({
    verticalScroll: true,
    horizontalScroll: false,
    scrollSpeed: 15,
    edgeSize: 60,
  });  // Custom hooks for editing only
  const {
    isEditing,
    editedTitle,
    setEditedTitle,
    handleEditTitle,
    handleSaveTitle,
    handleCancelEdit,
    isLoading: isEditLoading,
  } = useColumnEdit(column, onColumnUpdated, projectId);

  const handleEditTitleClick = () => {
    handleEditTitle();
    setIsMenuOpen(false);
  };
  const handleDeleteColumn = () => {
    setShowDeleteConfirmModal(true);
    setIsMenuOpen(false);
  };  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteBoardColumn(projectId, column.id);
      onColumnDeleted(column.id);
      setShowDeleteConfirmModal(false);
    } catch (error) {
      console.error("Failed to delete column:", error);
      // You could add toast notification here
    } finally {
      setIsDeleting(false);
    }
  };
  return (
    <div className="w-80 flex-shrink-0 animate-fade-in group">
      <div className="relative bg-white/70 dark:bg-gradient-card backdrop-blur-xl rounded-2xl flex flex-col h-full shadow-2xl border border-white/30 dark:border-white/10 hover:shadow-3xl transition-all duration-500 transform hover:scale-[1.02] overflow-hidden">
        {/* Animated background gradients */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-custom-50/30 to-pink-50/50 dark:from-blue-900/20 dark:via-custom-900/10 dark:to-pink-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent dark:via-white/5 -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
        {/* Floating particles */}
        <div className="absolute top-4 right-4 w-2 h-2 bg-yellow-400 rounded-full animate-pulse opacity-0 group-hover:opacity-60 transition-opacity duration-500"></div>
        <div className="absolute top-8 right-8 w-1 h-1 bg-blue-400 rounded-full animate-bounce opacity-0 group-hover:opacity-80 transition-opacity duration-700"></div>
        <div className="absolute bottom-8 left-4 w-1.5 h-1.5 bg-pink-400 rounded-full animate-ping opacity-0 group-hover:opacity-70 transition-opacity duration-300"></div>{" "}
        {/* Column Header */}
        <div className="relative z-10 p-6 flex items-center justify-between border-b border-white/20 dark:border-white/10 bg-gradient-to-r from-white/60 to-white/40 dark:from-black/50 dark:to-black/30 backdrop-blur-md rounded-t-2xl">
          {" "}
          {isEditing ? (
            <ColumnEditForm
              editedTitle={editedTitle}
              setEditedTitle={setEditedTitle}
              onSave={handleSaveTitle}
              onCancel={handleCancelEdit}
              isLoading={isEditLoading}
            />
          ) : (
            <>
              {" "}
              <ColumnInfo
                column={column}
                index={index}
                issueCount={columnIssuesCount}
              />{" "}
              <ColumnMenu
                isMenuOpen={isMenuOpen}
                onToggleMenu={() => setIsMenuOpen(!isMenuOpen)}
                onEditTitle={handleEditTitleClick}
                onDeleteColumn={handleDeleteColumn}
              />
            </>
          )}
        </div>{" "}
        {/* Column Content with Status Sections */}
        <div
          ref={columnScrollRef}
          className="p-0.5 flex-1 overflow-y-auto transition-all duration-300 rounded-lg m-2"
          style={{ maxHeight: "calc(100vh - 300px)" }}
          onDragOver={handleAutoScrollDragOver}
          onDragLeave={handleAutoScrollDragLeave}
          onDrop={handleAutoScrollDrop}
        >
          {" "}
          {column.statuses.map((status, statusIndex) => {
            // Get issues for this specific status
            const statusIssues = issues.filter(
              (issue) => issue.statusId === status.id
            );
            return (
              <StatusSection
                key={status.id}
                status={status}
                issues={statusIssues}
                isLast={statusIndex === column.statuses.length - 1}
                onMoveIssue={onMoveIssue}
                epics={epics}
                onIssueClick={onIssueClick}
              />
            );
          })}{" "}
          {/* Add issue inline creation */}
          {canCreateTask ? (
            <div className="mt-3">
              {" "}
              <CreateInlineItem
                columnId={column.id}
                defaultStatusId={column.statuses[0]?.id}
                onIssueCreated={onIssueCreated}
                selectedSprintId={
                  filters?.selectedSprints?.[0] || activeSprints?.[0]?.id
                }
              />
            </div>
          ) : (
            <div className="mt-3 p-3 text-center text-sm text-gray-500 dark:text-gray-400 italic border border-dashed border-gray-300/50 dark:border-gray-600/50 rounded-xl">
              You don't have permission to create tasks
            </div>
          )}
        </div>
        {/* Delete Confirmation Modal */}
        {showDeleteConfirmModal && (
          <ConfirmDeleteColumnModal
            isOpen={showDeleteConfirmModal}
            onClose={() => setShowDeleteConfirmModal(false)}
            onConfirm={handleConfirmDelete}
            columnName={column.name}
            isLoading={isDeleting}
          />
        )}
      </div>
    </div>
  );
};

export default Column;

import { useState } from "react";
import { updateBoardColumn } from "../api/boardColumns";

/**
 * Custom hook for managing column edit state and actions
 */
export const useColumnEdit = (column, onColumnUpdated, projectId) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(column.name);
  const [isLoading, setIsLoading] = useState(false);

  const handleEditTitle = () => {
    setIsEditing(true);
  };
  const handleSaveTitle = async () => {
    if (!editedTitle.trim()) return;

    setIsLoading(true);
    try {
      const updatedColumn = await updateBoardColumn(projectId, column.id, {
        name: editedTitle.trim(),
      });

      if (onColumnUpdated) {
        onColumnUpdated(updatedColumn);
      }
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update column:", error);
      // You could add toast notification here
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditedTitle(column.name);
    setIsEditing(false);
  };

  return {
    isEditing,
    editedTitle,
    setEditedTitle,
    handleEditTitle,
    handleSaveTitle,
    handleCancelEdit,
    isLoading,
  };
};

import { useState } from 'react';

/**
 * Custom hook for handling column drag and drop reordering
 */
export const useColumnReorder = (columns, onReorder) => {
  const [draggedColumn, setDraggedColumn] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);

  const handleDragStart = (e, column, index) => {
    setDraggedColumn({ column, index });
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', ''); // Required for Firefox
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    
    if (draggedColumn && draggedColumn.index !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDragLeave = (e) => {
    // Only clear dragOverIndex if we're leaving the container entirely
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setDragOverIndex(null);
    }
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    
    if (!draggedColumn || draggedColumn.index === dropIndex) {
      setDraggedColumn(null);
      setDragOverIndex(null);
      return;
    }

    const newColumns = [...columns];
    const [draggedItem] = newColumns.splice(draggedColumn.index, 1);
    newColumns.splice(dropIndex, 0, draggedItem);

    // Call the reorder callback
    onReorder(newColumns);

    // Reset state
    setDraggedColumn(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedColumn(null);
    setDragOverIndex(null);
  };

  const getDragStyles = (index) => {
    const isDragging = draggedColumn?.index === index;
    const isDraggedOver = dragOverIndex === index;
    
    let styles = '';
    
    if (isDragging) {
      styles += ' opacity-50 transform scale-95';
    }
    
    if (isDraggedOver && !isDragging) {
      styles += ' transform scale-105 ring-2 ring-blue-400 ring-opacity-75';
    }
    
    return styles;
  };

  return {
    draggedColumn,
    dragOverIndex,
    handleDragStart,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleDragEnd,
    getDragStyles,
  };
};

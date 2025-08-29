/**
 * Custom hook for column drag and drop functionality
 */
export const useColumnDragDrop = (column, moveIssue) => {
  const handleDragOver = (e) => {
    e.preventDefault();
    e.currentTarget.classList.add('bg-blue-50', 'dark:bg-blue-900/20', 'border-blue-300', 'dark:border-blue-500');
  };

  const handleDragLeave = (e) => {
    e.currentTarget.classList.remove('bg-blue-50', 'dark:bg-blue-900/20', 'border-blue-300', 'dark:border-blue-500');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove('bg-blue-50', 'dark:bg-blue-900/20', 'border-blue-300', 'dark:border-blue-500');
    
    const issueId = e.dataTransfer.getData('issueId');
    const sourceStatusId = e.dataTransfer.getData('sourceStatusId');
    
    if (!issueId || !sourceStatusId) return;
    
    // Find the first status in this column as the default destination
    const defaultStatus = column.statuses[0];
    if (defaultStatus && sourceStatusId !== defaultStatus.id) {
      moveIssue(sourceStatusId, defaultStatus.id, issueId);
    }
  };

  return {
    handleDragOver,
    handleDragLeave,
    handleDrop,
  };
};

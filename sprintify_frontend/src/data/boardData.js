// Board data following backend entity structure
// Now uses normalized data but maintains nested structure for backward compatibility

import { 
  normalizedData, 
  getBoardData,
  getColumnsWithStatuses,
  getIssuesForColumn,
  getIssuesForStatus 
} from './normalizedData.js';

// Build nested structure from normalized data for backward compatibility
const buildNestedBoardData = () => {
  const columns = getColumnsWithStatuses();
  
  return {
    project: normalizedData.currentProject,
    columns: columns.map(column => ({
      ...column,
      statuses: column.statuses.map(status => ({
        ...status,
        issues: getIssuesForStatus(status.id).map(issue => {
          // Get the enriched issue data
          const enrichedIssues = getBoardData().issues;
          const enrichedIssue = enrichedIssues.find(e => e.id === issue.id);
          return enrichedIssue || issue;
        })
      }))
    }))
  };
};

export const boardData = buildNestedBoardData();

// Status types enum for reference (matching backend exactly)
export const StatusType = {
  BACKLOG: 0,
  IN_PROGRESS: 1,
  DONE: 2,
};

// Helper function to get all statuses from all columns
export const getAllStatuses = (columns) => {
  return columns.flatMap((column) => column.statuses);
};

// Helper function to get all issues
export const getAllIssues = (columns) => {
  return columns.flatMap((column) =>
    column.statuses.flatMap((status) => status.issues)
  );
};

// Helper function to find status by id
export const findStatusById = (columns, statusId) => {
  return getAllStatuses(columns).find((status) => status.id === statusId);
};

// Helper function to find column by status id
export const findColumnByStatusId = (columns, statusId) => {
  return columns.find((column) =>
    column.statuses.some((status) => status.id === statusId)
  );
};

// Updated initial data following backend entity structure exactly
// Now uses normalized structure matching TypeORM entities

import { 
  normalizedData, 
  getBoardData,
  getColumnsWithStatuses,
  getIssuesWithRelations 
} from './normalizedData.js';

// Export the normalized data structure
export const initialData = {
  // Keep backward compatibility while using normalized structure
  project: normalizedData.currentProject,
  users: normalizedData.currentProjectUsers,
  columns: getColumnsWithStatuses(),
  issues: getIssuesWithRelations(),
  sprints: normalizedData.sprints,
  epics: normalizedData.epics,
  
  // Additional normalized collections for direct access
  normalized: normalizedData
};

// Status types enum matching backend exactly
export const StatusType = {
  BACKLOG: 0,
  IN_PROGRESS: 1, 
  DONE: 2,
};

// Helper functions using normalized data structure
export const getIssuesForStatus = (issues, statusId) => {
  return issues.filter((issue) => issue.statusId === statusId);
};

export const getIssuesForColumn = (issues, column) => {
  const statusIds = column.statuses.map((status) => status.id);
  return issues.filter((issue) => statusIds.includes(issue.statusId));
};

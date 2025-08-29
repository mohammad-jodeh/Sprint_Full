// Enums and types matching backend entity structure

export const IssueType = {
  BUG: "Bug",
  STORY: "Story", 
  TASK: "Task",
};

export const StatusType = {
  BACKLOG: 0,
  IN_PROGRESS: 1,
  DONE: 2,
};

export const ProjectPermission = {
  MEMBER: 0,
  MODERATOR: 1,
  ADMINISTRATOR: 2,
};

export const NotificationType = {
  PROJECT_INVITATION: 1,
  ISSUE_UPDATED: 2,
  SPRINT_UPDATED: 3,
  EPIC_UPDATED: 4,
  PROJECT_UPDATED: 5
};

export const NotificationPriority = {
  LOW: "LOW",
  MEDIUM: "MEDIUM", 
  HIGH: "HIGH",
  URGENT: "URGENT",
};

export const IssuePriority = {
  LOW: "LOW",
  MEDIUM: "MEDIUM",
  HIGH: "HIGH",
};

// Helper function to generate UUID-like IDs (simplified for frontend)
export const generateId = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

// Helper function to generate timestamps
export const generateTimestamp = () => new Date().toISOString();
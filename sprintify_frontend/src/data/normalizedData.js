// Backend-structured data following TypeORM entity definitions
import { 
  IssueType, 
  StatusType, 
  ProjectPermission, 
  IssuePriority,
  NotificationType,
  NotificationPriority,
  generateTimestamp 
} from './types.js';

// Base timestamp properties (from BaseEntity)
const baseTimestamps = {
  createdAt: generateTimestamp(),
  updatedAt: generateTimestamp(),
  deletedAt: null
};

// Users (following User entity)
export const users = [
  {
    id: "user-1",
    email: "john.doe@example.com",
    isEmailVerified: true,
    password: "hashedPassword123", // In real app this would be hashed
    fullName: "John Doe",
    image: "/avatars/john.png",
    ...baseTimestamps
  },
  {
    id: "user-2", 
    email: "jane.smith@example.com",
    isEmailVerified: true,
    password: "hashedPassword456",
    fullName: "Jane Smith",
    image: "/avatars/jane.png",
    ...baseTimestamps
  },
  {
    id: "user-3",
    email: "mike.johnson@example.com", 
    isEmailVerified: true,
    password: "hashedPassword789",
    fullName: "Mike Johnson",
    image: "/avatars/mike.png",
    ...baseTimestamps
  }
];

// Projects (following Project entity)
export const projects = [
  {
    id: "project-1",
    name: "Sprint Project",
    keyPrefix: "SP",
    createdBy: "user-1",
    activeSprintId: "sprint-1",
    ...baseTimestamps
  }
];

// Project Members (following ProjectMember entity)  
export const projectMembers = [
  {
    id: "pm-1",
    permission: ProjectPermission.ADMINISTRATOR,
    userId: "user-1",
    projectId: "project-1",
    ...baseTimestamps
  },
  {
    id: "pm-2",
    permission: ProjectPermission.MODERATOR,
    userId: "user-2", 
    projectId: "project-1",
    ...baseTimestamps
  },
  {
    id: "pm-3",
    permission: ProjectPermission.MEMBER,
    userId: "user-3",
    projectId: "project-1", 
    ...baseTimestamps
  }
];

// Board Columns (following BoardColumn entity)
export const boardColumns = [
  {
    id: "column-1",
    name: "To Do",
    order: 1,
    projectId: "project-1",
    ...baseTimestamps
  },
  {
    id: "column-2", 
    name: "In Progress",
    order: 2,
    projectId: "project-1",
    ...baseTimestamps
  },
  {
    id: "column-3",
    name: "Done", 
    order: 3,
    projectId: "project-1",
    ...baseTimestamps
  }
];

// Statuses (following Status entity)
export const statuses = [
  {
    id: "status-1",
    name: "Backlog",
    type: StatusType.BACKLOG,
    columnId: "column-1",
    projectId: "project-1",
    ...baseTimestamps
  },
  {
    id: "status-2",
    name: "Ready",
    type: StatusType.BACKLOG, 
    columnId: "column-1",
    projectId: "project-1",
    ...baseTimestamps
  },
  {
    id: "status-3",
    name: "Development",
    type: StatusType.IN_PROGRESS,
    columnId: "column-2", 
    projectId: "project-1",
    ...baseTimestamps
  },
  {
    id: "status-4",
    name: "Code Review",
    type: StatusType.IN_PROGRESS,
    columnId: "column-2",
    projectId: "project-1", 
    ...baseTimestamps
  },
  {
    id: "status-5",
    name: "Completed",
    type: StatusType.DONE,
    columnId: "column-3",
    projectId: "project-1",
    ...baseTimestamps
  }
];

// Sprints (following Sprint entity)
export const sprints = [
  {
    id: "sprint-1",
    name: "Sprint 1 (Active)",
    startDate: new Date("2025-05-25").toISOString(),
    endDate: new Date("2025-06-01").toISOString(),
    projectId: "project-1",
    archived: false,
    ...baseTimestamps
  },
  {
    id: "sprint-2", 
    name: "Sprint 2 (Planned)",
    startDate: new Date("2025-06-02").toISOString(),
    endDate: new Date("2025-06-15").toISOString(),
    projectId: "project-1",
    archived: false,
    ...baseTimestamps
  }
];

// Epics (following Epic entity)
export const epics = [
  {
    id: "epic-1",
    key: "SP-EPIC-1",
    title: "User Authentication System",
    description: "Complete user authentication and authorization system with login, registration, and password reset functionality.",
    assignee: "user-1",
    projectId: "project-1",
    ...baseTimestamps
  },
  {
    id: "epic-2",
    key: "SP-EPIC-2", 
    title: "Project Management Core",
    description: "Core project management features including boards, sprints, and issue tracking.",
    assignee: "user-2",
    projectId: "project-1",
    ...baseTimestamps
  }
];

// Issues (following Issue entity)
export const issues = [
  {
    id: "issue-1",
    key: "SP-1", 
    title: "Setup project structure",
    description: "Initialize the project with proper folder structure and dependencies",
    storyPoint: 3,
    statusId: "status-1",
    assignee: "user-1",
    epicId: "epic-2",
    sprintId: "sprint-1",
    projectId: "project-1",
    issuePriority: IssuePriority.MEDIUM,
    type: IssueType.TASK,
    ...baseTimestamps
  },
  {
    id: "issue-2",
    key: "SP-2",
    title: "Create user authentication",
    description: "Implement login and registration functionality", 
    storyPoint: 5,
    statusId: "status-1",
    assignee: "user-2",
    epicId: "epic-1", 
    sprintId: "sprint-1",
    projectId: "project-1",
    issuePriority: IssuePriority.HIGH,
    type: IssueType.STORY,
    ...baseTimestamps
  },
  {
    id: "issue-3",
    key: "SP-3",
    title: "Design database schema",
    description: "Create ER diagram and database tables",
    storyPoint: 2, 
    statusId: "status-2",
    assignee: "user-1",
    epicId: "epic-2",
    sprintId: null,
    projectId: "project-1",
    issuePriority: IssuePriority.MEDIUM,
    type: IssueType.TASK,
    ...baseTimestamps
  },
  {
    id: "issue-4", 
    key: "SP-4",
    title: "Implement board component",
    description: "Create drag and drop functionality for the kanban board",
    storyPoint: 8,
    statusId: "status-3",
    assignee: "user-3",
    epicId: "epic-2",
    sprintId: "sprint-1", 
    projectId: "project-1",
    issuePriority: IssuePriority.HIGH,
    type: IssueType.STORY,
    ...baseTimestamps
  },
  {
    id: "issue-5",
    key: "SP-5",
    title: "API endpoints for projects", 
    description: "Create REST API endpoints for project management",
    storyPoint: 5,
    statusId: "status-4",
    assignee: "user-2",
    epicId: "epic-2",
    sprintId: "sprint-1",
    projectId: "project-1",
    issuePriority: IssuePriority.MEDIUM,
    type: IssueType.TASK,
    ...baseTimestamps
  },
  {
    id: "issue-6",
    key: "SP-6",
    title: "Setup development environment",
    description: "Configure development tools and environment",
    storyPoint: 2,
    statusId: "status-5",
    assignee: "user-1",
    epicId: null,
    sprintId: "sprint-1",
    projectId: "project-1", 
    issuePriority: IssuePriority.LOW,
    type: IssueType.TASK,
    ...baseTimestamps
  },
  {
    id: "issue-7",
    key: "SP-7",
    title: "Create project wireframes",
    description: "Design UI/UX wireframes for the application",
    storyPoint: 3,
    statusId: "status-5",
    assignee: "user-3",
    epicId: "epic-2",
    sprintId: null,
    projectId: "project-1",
    issuePriority: IssuePriority.LOW,
    type: IssueType.STORY,
    ...baseTimestamps
  }
];

// Comments (following backend comment structure)
export const comments = [
  {
    id: "comment-1",
    issueId: "issue-1",
    userId: "user-2",
    content: "Great work on the project structure! The organization looks solid.",
    ...baseTimestamps
  },
  {
    id: "comment-2",
    issueId: "issue-1", 
    userId: "user-1",
    content: "Thanks! I tried to follow best practices for scalability.",
    ...baseTimestamps
  },
  {
    id: "comment-3",
    issueId: "issue-4",
    userId: "user-2",
    content: "The drag and drop functionality works perfectly! Smooth animations.",
    ...baseTimestamps
  }
];

// Issue Links/Relations (following backend issue relation structure)
export const issueLinks = [
  {
    id: "link-1",
    fromIssueId: "issue-1",
    toIssueId: "issue-2", 
    linkType: "BLOCKS",
    ...baseTimestamps
  },
  {
    id: "link-2",
    fromIssueId: "issue-3",
    toIssueId: "issue-4",
    linkType: "RELATES_TO",
    ...baseTimestamps
  },
  {
    id: "link-3",
    fromIssueId: "issue-2",
    toIssueId: "issue-5",
    linkType: "DEPENDS_ON", 
    ...baseTimestamps
  }
];

// Notifications (following Notification entity)
export const notifications = [
  {
    id: "notif-1",
    title: "Issue Assignment",
    message: "You were assigned to issue SP-1: Setup project structure",
    type: NotificationType.ISSUE_UPDATED,
    priority: NotificationPriority.MEDIUM,
    recipientId: "user-1",
    senderId: "user-2",
    isRead: false,
    metadata: { issueId: "issue-1" },
    actionUrl: "/issues/issue-1",
    emailSent: false,
    ...baseTimestamps
  },
  {
    id: "notif-2",
    title: "Sprint Update",
    message: "Sprint 1 (Active) has been updated",
    type: NotificationType.SPRINT_UPDATED,
    priority: NotificationPriority.LOW,
    recipientId: "user-2", 
    senderId: "user-1",
    isRead: true,
    metadata: { sprintId: "sprint-1" },
    actionUrl: "/sprints/sprint-1",
    emailSent: true,
    ...baseTimestamps
  }
];

// Normalized data structure matching backend entities
export const normalizedData = {
  // Main entities
  users,
  projects,
  projectMembers,
  boardColumns,
  statuses,
  sprints,
  epics,
  issues,
  comments,
  issueLinks,
  notifications,
  
  // Computed/helper data for UI
  currentProject: projects[0],
  currentProjectUsers: users.filter(user => 
    projectMembers
      .filter(pm => pm.projectId === projects[0].id)
      .map(pm => pm.userId)
      .includes(user.id)
  )
};

// Helper functions for data access
export const getStatusesForColumn = (columnId) => {
  return statuses.filter(status => status.columnId === columnId);
};

export const getIssuesForStatus = (statusId) => {
  return issues.filter(issue => issue.statusId === statusId);
};

export const getIssuesForColumn = (columnId) => {
  const columnStatuses = getStatusesForColumn(columnId);
  const statusIds = columnStatuses.map(status => status.id);
  return issues.filter(issue => statusIds.includes(issue.statusId));
};

export const getUserById = (userId) => {
  return users.find(user => user.id === userId);
};

export const getSprintById = (sprintId) => {
  return sprints.find(sprint => sprint.id === sprintId);
};

export const getEpicById = (epicId) => {
  return epics.find(epic => epic.id === epicId);
};

export const getColumnById = (columnId) => {
  return boardColumns.find(column => column.id === columnId);
};

export const getStatusById = (statusId) => {
  return statuses.find(status => status.id === statusId);
};

export const getCommentsForIssue = (issueId) => {
  return comments.filter(comment => comment.issueId === issueId);
};

export const getLinksForIssue = (issueId) => {
  return issueLinks.filter(link => 
    link.fromIssueId === issueId || link.toIssueId === issueId
  );
};

export const getNotificationsForUser = (userId) => {
  return notifications.filter(notification => 
    notification.recipientId === userId
  );
};

export const getUnreadNotificationsForUser = (userId) => {
  return notifications.filter(notification => 
    notification.recipientId === userId && !notification.isRead
  );
};

// Enriched data functions (adding relations)
export const getIssuesWithRelations = () => {
  return issues.map(issue => ({
    ...issue,
    assigneeUser: issue.assignee ? getUserById(issue.assignee) : null,
    sprint: issue.sprintId ? getSprintById(issue.sprintId) : null,
    epic: issue.epicId ? getEpicById(issue.epicId) : null,
    status: getStatusById(issue.statusId),
    column: getColumnById(getStatusById(issue.statusId)?.columnId),
    comments: getCommentsForIssue(issue.id),
    links: getLinksForIssue(issue.id)
  }));
};

export const getColumnsWithStatuses = () => {
  return boardColumns.map(column => ({
    ...column,
    statuses: getStatusesForColumn(column.id)
  }));
};

export const getBoardData = () => {
  return {
    project: normalizedData.currentProject,
    users: normalizedData.currentProjectUsers,
    columns: getColumnsWithStatuses(),
    issues: getIssuesWithRelations(),
    sprints,
    epics,
    comments,
    issueLinks,
    notifications
  };
};
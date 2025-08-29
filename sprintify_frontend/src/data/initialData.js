// Initial board data following backend entity structure
// Columns -> Statuses -> Issues hierarchy

export const initialData = {
  project: {
    id: "project-1",
    name: "Sprint Project",
    keyPrefix: "SP",
  },
  sprints: [
    {
      id: "sprint-1",
      name: "Sprint 1 (Active)",
      projectId: "project-1",
      startDate: "2025-05-25",
      endDate: "2025-06-01",
      archived: false,
    },
    {
      id: "sprint-2",
      name: "Sprint 2 (Active)",
      projectId: "project-1",
      startDate: "2025-05-20",
      endDate: "2025-06-03",
      archived: false,
    },
  ],
  users: [
    {
      id: "user-1",
      fullName: "John Doe",
      email: "john@example.com",
    },
    {
      id: "user-2",
      fullName: "Jane Smith",
      email: "jane@example.com",
    },
    {
      id: "user-3",
      fullName: "Mike Johnson",
      email: "mike@example.com",
    },
  ],
  columns: [
    {
      id: "column-1",
      name: "To Do",
      order: 1,
      projectId: "project-1",
      statuses: [
        {
          id: "status-1",
          name: "Backlog",
          type: 0, // StatusType.TODO
          column_id: "column-1",
        },
        {
          id: "status-2",
          name: "Ready",
          type: 0, // StatusType.TODO
          column_id: "column-1",
        },
      ],
    },
    {
      id: "column-2",
      name: "In Progress",
      order: 2,
      projectId: "project-1",
      statuses: [
        {
          id: "status-3",
          name: "Development",
          type: 1, // StatusType.IN_PROGRESS
          column_id: "column-2",
        },
        {
          id: "status-4",
          name: "Code Review",
          type: 1, // StatusType.IN_PROGRESS
          column_id: "column-2",
        },
      ],
    },
    {
      id: "column-3",
      name: "Done",
      order: 3,
      projectId: "project-1",
      statuses: [
        {
          id: "status-5",
          name: "Completed",
          type: 2, // StatusType.DONE
          column_id: "column-3",
        },
      ],
    },
  ],
  issues: [
    {
      id: "issue-1",
      key: "SP-1",
      title: "Setup project structure",
      description:
        "Initialize the project with proper folder structure and dependencies",
      storyPoint: 3,
      statusId: "status-1",
      assignee: "user-1",
      sprintId: "sprint-1",
      projectId: "project-1",
      createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
      assigneeUser: {
        id: "user-1",
        fullName: "John Doe",
        email: "john@example.com",
      },
    },
    {
      id: "issue-2",
      key: "SP-2",
      title: "Create user authentication",
      description: "Implement login and registration functionality",
      storyPoint: 5,
      statusId: "status-1",
      assignee: "user-2",
      sprintId: "sprint-2",
      projectId: "project-1",
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      assigneeUser: {
        id: "user-2",
        fullName: "Jane Smith",
        email: "jane@example.com",
      },
    },
    {
      id: "issue-3",
      key: "SP-3",
      title: "Design database schema",
      description: "Create ER diagram and database tables",
      storyPoint: 2,
      statusId: "status-2",
      assignee: "user-1",
      sprintId: null,
      projectId: "project-1",
      createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
      assigneeUser: {
        id: "user-1",
        fullName: "John Doe",
        email: "john@example.com",
      },
    },
    {
      id: "issue-4",
      key: "SP-4",
      title: "Implement board component",
      description: "Create drag and drop functionality for the kanban board",
      storyPoint: 8,
      statusId: "status-3",
      assignee: "user-3",
      sprintId: "sprint-2",
      projectId: "project-1",
      createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
      assigneeUser: {
        id: "user-3",
        fullName: "Mike Johnson",
        email: "mike@example.com",
      },
    },
    {
      id: "issue-5",
      key: "SP-5",
      title: "API endpoints for projects",
      description: "Create REST API endpoints for project management",
      storyPoint: 5,
      statusId: "status-4",
      assignee: "user-2",
      sprintId: "sprint-1",
      projectId: "project-1",
      createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
      assigneeUser: {
        id: "user-2",
        fullName: "Jane Smith",
        email: "jane@example.com",
      },
    },
    {
      id: "issue-6",
      key: "SP-6",
      title: "Setup development environment",
      description: "Configure development tools and environment",
      storyPoint: 2,
      statusId: "status-5",
      assignee: "user-1",
      sprintId: "sprint-1",
      projectId: "project-1",
      createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
      assigneeUser: {
        id: "user-1",
        fullName: "John Doe",
        email: "john@example.com",
      },
    },
    {
      id: "issue-7",
      key: "SP-7",
      title: "Create project wireframes",
      description: "Design UI/UX wireframes for the application",
      storyPoint: 3,
      statusId: "status-5",
      assignee: "user-3",
      sprintId: null,
      projectId: "project-1",
      createdAt: new Date(Date.now() - 86400000 * 6).toISOString(),
      assigneeUser: {
        id: "user-3",
        fullName: "Mike Johnson",
        email: "mike@example.com",
      },
    },
  ],
};

// Status types enum matching backend
export const StatusType = {
  TODO: 0,
  IN_PROGRESS: 1,
  DONE: 2,
};

// Helper functions
export const getIssuesForStatus = (issues, statusId) => {
  return issues.filter((issue) => issue.statusId === statusId);
};

export const getIssuesForColumn = (issues, column) => {
  const statusIds = column.statuses.map((status) => status.id);
  return issues.filter((issue) => statusIds.includes(issue.statusId));
};

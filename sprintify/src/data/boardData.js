// Hardcoded board data following backend entity structure
export const boardData = {
  project: {
    id: "project-1",
    name: "Sprint Project",
    keyPrefix: "SP",
  },
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
          type: 0, // TODO
          columnId: "column-1",
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
              projectId: "project-1",
            },
            {
              id: "issue-2",
              key: "SP-2",
              title: "Create user authentication",
              description: "Implement login and registration functionality",
              storyPoint: 5,
              statusId: "status-1",
              assignee: "user-2",
              projectId: "project-1",
            },
          ],
        },
        {
          id: "status-2",
          name: "Ready",
          type: 0, // TODO
          columnId: "column-1",
          issues: [
            {
              id: "issue-3",
              key: "SP-3",
              title: "Design database schema",
              description: "Create ER diagram and database tables",
              storyPoint: 2,
              statusId: "status-2",
              assignee: "user-1",
              projectId: "project-1",
            },
          ],
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
          type: 1, // IN_PROGRESS
          columnId: "column-2",
          issues: [
            {
              id: "issue-4",
              key: "SP-4",
              title: "Implement board component",
              description:
                "Create drag and drop functionality for the kanban board",
              storyPoint: 8,
              statusId: "status-3",
              assignee: "user-3",
              projectId: "project-1",
            },
          ],
        },
        {
          id: "status-4",
          name: "Code Review",
          type: 1, // IN_PROGRESS
          columnId: "column-2",
          issues: [
            {
              id: "issue-5",
              key: "SP-5",
              title: "API endpoints for projects",
              description: "Create REST API endpoints for project management",
              storyPoint: 5,
              statusId: "status-4",
              assignee: "user-2",
              projectId: "project-1",
            },
          ],
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
          type: 2, // DONE
          columnId: "column-3",
          issues: [
            {
              id: "issue-6",
              key: "SP-6",
              title: "Setup development environment",
              description: "Configure development tools and environment",
              storyPoint: 2,
              statusId: "status-5",
              assignee: "user-1",
              projectId: "project-1",
            },
            {
              id: "issue-7",
              key: "SP-7",
              title: "Create project wireframes",
              description: "Design UI/UX wireframes for the application",
              storyPoint: 3,
              statusId: "status-5",
              assignee: "user-3",
              projectId: "project-1",
            },
          ],
        },
      ],
    },
  ],
};

// Status types enum for reference
export const StatusType = {
  TODO: 0,
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

import React from "react";
import { Plus, Search, LayersX } from "lucide-react";

// Generic empty state component
const EmptyState = ({
  icon: Icon = LayersX,
  title = "No items found",
  description = "Get started by creating your first item",
  action = null,
  actionLabel = "Create New",
  actionIcon: ActionIcon = Plus,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="bg-gray-100 dark:bg-gray-800 rounded-full p-6 mb-6">
        <Icon size={40} className="text-gray-400 dark:text-gray-500" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 text-center">
        {title}
      </h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 text-center max-w-xs mb-6">
        {description}
      </p>
      {action && (
        <button
          onClick={action}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition"
        >
          <ActionIcon size={16} />
          {actionLabel}
        </button>
      )}
    </div>
  );
};

// Specific empty states
export const NoProjectsEmpty = ({ onCreateProject }) => (
  <EmptyState
    icon={LayersX}
    title="No projects yet"
    description="Create your first project to get started"
    action={onCreateProject}
    actionLabel="Create Project"
  />
);

export const NoIssuesEmpty = ({ onCreateIssue }) => (
  <EmptyState
    icon={Search}
    title="No issues here"
    description="All done! Create a new issue to continue working"
    action={onCreateIssue}
    actionLabel="Create Issue"
  />
);

export const NoColumnsEmpty = ({ onCreateColumn }) => (
  <EmptyState
    icon={LayersX}
    title="No columns configured"
    description="Add your first column to organize the board"
    action={onCreateColumn}
    actionLabel="Add Column"
  />
);

export const NoSprintsEmpty = ({ onCreateSprint }) => (
  <EmptyState
    icon={LayersX}
    title="No sprints yet"
    description="Create your first sprint to start planning"
    action={onCreateSprint}
    actionLabel="Create Sprint"
  />
);

export default EmptyState;

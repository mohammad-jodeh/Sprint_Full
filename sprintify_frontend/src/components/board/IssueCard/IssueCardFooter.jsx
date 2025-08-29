import React from "react";
import { formatDistanceToNow } from "date-fns";

const IssueCardFooter = ({ issue, epics = [] }) => {
  // Find the epic for this issue
  const epic = epics.find((e) => e.id === issue.epicId) || issue.epic;
  // Handle assignee data - it might be an object or a user ID
  const assigneeData = issue.assigneeUser || issue.assignee;
  const assigneeName = assigneeData?.fullName || assigneeData?.name;

  return (
    <div className="space-y-2">
      {" "}
      {/* Epic info */}
      {epic && (
        <div className="flex items-center">
          <span className="inline-flex items-center gap-1 bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 text-indigo-700 dark:text-indigo-300 px-2 py-1 rounded-md text-xs font-medium">
            🔖 {epic.title || epic.name}
          </span>
        </div>
      )}
      {/* Assignee and date */}
      <div className="flex items-center justify-between">
        {assigneeName ? (
          <div className="flex items-center">
            <div className="w-6 h-6 rounded-full bg-primary/10 dark:bg-primary/20 border border-primary/20 flex items-center justify-center text-xs font-medium text-primary">
              {assigneeName.charAt(0).toUpperCase()}
            </div>
            <span className="ml-1.5 text-xs text-gray-600 dark:text-gray-400 truncate max-w-[100px]">
              {assigneeName}
            </span>
          </div>
        ) : (
          <span className="text-xs text-gray-500 dark:text-gray-500">
            Unassigned
          </span>
        )}

        <span className="text-xs text-gray-500 dark:text-gray-500">
          {issue.createdAt && !isNaN(new Date(issue.createdAt))
            ? formatDistanceToNow(new Date(issue.createdAt), {
                addSuffix: true,
              })
            : "-"}
        </span>
      </div>
    </div>
  );
};

export default IssueCardFooter;

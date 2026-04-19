// Issue Type Utility Functions
import {
  ArrowUpRight,
  Bug,
  CheckCircle2,
  AlertCircle as CircleAlert,
  ClipboardList,
} from "lucide-react";

/**
 * Determines the border color based on issue type and story points
 */
export const getIssueColor = (issue) => {
  if (issue.epicId) {
    return "border-accent";
  } else if (issue.storyPoint >= 5) {
    return "border-primary";
  } else if (issue.storyPoint <= 2) {
    return "border-error";
  } else {
    return "border-secondary";
  }
};

/**
 * Returns appropriate icon based on issue type
 */
export const getIssueTypeIcon = (issue) => {
  if (issue.epicId) {
    return <ArrowUpRight className="h-4 w-4 text-accent" />;
  } else if (issue.storyPoint >= 5) {
    return <ClipboardList className="h-4 w-4 text-primary" />; // Story
  } else if (issue.storyPoint <= 2) {
    return <Bug className="h-4 w-4 text-error" />; // Bug
  } else {
    return <CheckCircle2 className="h-4 w-4 text-secondary" />; // Task
  }
};

/**
 * Returns priority icon based on issue priority field
 */
export const getPriorityIcon = (issue) => {
  const priority = issue.issuePriority || "MEDIUM";

  if (priority === "HIGH") {
    return <CircleAlert className="h-4 w-4 text-red-500" title="High Priority" />; // High priority - red
  } else if (priority === "MEDIUM") {
    return <CircleAlert className="h-4 w-4 text-yellow-500" title="Medium Priority" />; // Medium priority - yellow
  } else {
    return <CircleAlert className="h-4 w-4 text-green-500" title="Low Priority" />; // Low priority - green
  }
};

/**
 * Generates issue key display text
 */
export const getIssueKey = (issue) => {
  return issue.key || `PROJ-${issue.id.substring(0, 5)}`;
};

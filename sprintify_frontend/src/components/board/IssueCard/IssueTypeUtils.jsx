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
 * Returns priority icon based on story points
 */
export const getPriorityIcon = (issue) => {
  const storyPoints = issue.storyPoint || 0;

  if (storyPoints >= 5) {
    return <CircleAlert className="h-4 w-4 text-error" />; // High priority
  } else if (storyPoints >= 3) {
    return <CircleAlert className="h-4 w-4 text-warning" />; // Medium priority
  } else {
    return <CircleAlert className="h-4 w-4 text-success" />; // Low priority
  }
};

/**
 * Generates issue key display text
 */
export const getIssueKey = (issue) => {
  return issue.key || `PROJ-${issue.id.substring(0, 5)}`;
};

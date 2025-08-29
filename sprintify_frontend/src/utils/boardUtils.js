/**
 * Maps status types to colors
 * @param {number|string} statusType - The type of status (0/"TODO": Todo, 1/"IN_PROGRESS": In Progress, 2/"DONE": Done)
 * @returns {string} - Color name for the status
 */
export const getStatusColor = (statusType) => {
  switch (statusType) {
    case 0:
    case "TODO":
      return "blue"; // To Do
    case 1:
    case "IN_PROGRESS":
      return "yellow"; // In Progress
    case 2:
    case "DONE":
      return "green"; // Done
    default:
      return "purple"; // Other
  }
};

/**
 * Maps status types to emoji icons
 * @param {number|string} statusType - The type of status
 * @returns {string} - Emoji icon representing the status
 */
export const getStatusIcon = (statusType) => {
  switch (statusType) {
    case 0:
    case "TODO":
      return "📋"; // To Do
    case 1:
    case "IN_PROGRESS":
      return "⚙️"; // In Progress
    case 2:
    case "DONE":
      return "✅"; // Done
    default:
      return "🔍"; // Other
  }
};

/**
 * Prepares columns data from statuses
 * @param {Array} statuses - Array of status objects
 * @returns {Array} - Array of column objects with id, title, type, color, and icon
 */
export const prepareColumnsFromStatuses = (statuses) => {
  // Create a map to track unique status types
  const uniqueTypes = new Map();

  // Filter statuses to keep only unique status types
  // For duplicate types, keep the one with the lowest ID (assuming these are the main statuses)
  return statuses
    .filter((status) => {
      // If this type hasn't been seen yet, or this status has a lower ID than the one we've seen
      if (
        !uniqueTypes.has(status.type) ||
        status.id < uniqueTypes.get(status.type).id
      ) {
        uniqueTypes.set(status.type, status);
        return true;
      }
      return false;
    })
    .map((status) => ({
      id: status.id,
      title: status.name,
      type: status.type,
      color: getStatusColor(status.type),
      icon: getStatusIcon(status.type),
    }));
};

/**
 * Filters issues based on search term and assignee
 * @param {Array} issues - Array of issue objects
 * @param {string} searchTerm - Search term to filter by
 * @param {string|null} filterByAssignee - Assignee ID to filter by or null
 * @returns {Array} - Filtered array of issues
 */
export const filterIssues = (issues, searchTerm, filterByAssignee) => {
  return issues.filter((issue) => {
    // Filter by search term
    const matchesSearch =
      searchTerm === "" ||
      issue.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      issue.description?.toLowerCase().includes(searchTerm.toLowerCase());

    // Filter by assignee if one is selected
    const matchesAssignee =
      filterByAssignee === null || issue.assignee === filterByAssignee;

    return matchesSearch && matchesAssignee;
  });
};

/**
 * Extracts unique assignees from issues
 * @param {Array} issues - Array of issue objects
 * @returns {Array} - Array of unique assignee objects with id and name
 */
export const extractUniqueAssignees = (issues) => {
  return [
    ...new Set(
      issues
        .filter((issue) => issue.assignee)
        .map((issue) => {
          const name = issue.assigneeUser?.fullName || "Unknown";
          return JSON.stringify({ id: issue.assignee, name: name });
        })
    ),
  ].map((str) => JSON.parse(str));
};

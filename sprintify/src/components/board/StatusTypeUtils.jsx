// Status type utility functions following SRP (Single Responsibility Principle)
export const STATUS_TYPES = {
  TODO: 0,
  IN_PROGRESS: 1,
  DONE: 2,
};

export const getStatusTypeColor = (statusType) => {
  switch (statusType) {
    case STATUS_TYPES.TODO:
    case "TODO":
      return "border-l-gray-400 bg-gradient-to-r from-gray-50/80 to-gray-100/80 dark:from-gray-800/50 dark:to-gray-700/50";
    case STATUS_TYPES.IN_PROGRESS:
    case "IN_PROGRESS":
      return "border-l-blue-500 bg-gradient-to-r from-blue-50/80 to-blue-100/80 dark:from-blue-900/30 dark:to-blue-800/30";
    case STATUS_TYPES.DONE:
    case "DONE":
      return "border-l-green-500 bg-gradient-to-r from-green-50/80 to-green-100/80 dark:from-green-900/30 dark:to-green-800/30";
    default:
      return "border-l-gray-400 bg-gradient-to-r from-gray-50/80 to-gray-100/80 dark:from-gray-800/50 dark:to-gray-700/50";
  }
};

export const getStatusTypeText = (statusType) => {
  switch (statusType) {
    case STATUS_TYPES.TODO:
    case "TODO":
      return "To Do";
    case STATUS_TYPES.IN_PROGRESS:
    case "IN_PROGRESS":
      return "In Progress";
    case STATUS_TYPES.DONE:
    case "DONE":
      return "Done";
    default:
      return "Unknown";
  }
};

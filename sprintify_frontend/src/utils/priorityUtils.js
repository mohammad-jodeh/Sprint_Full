// Priority utility functions
export const PRIORITY_TYPES = {
  LOW: "LOW",
  MEDIUM: "MEDIUM",
  HIGH: "HIGH",
};

export const priorityOptions = [
  {
    label: "Low",
    value: "LOW",
    color:
      "text-green-600 bg-green-50 border-green-200 dark:text-green-400 dark:bg-green-900/20 dark:border-green-700",
    icon: "⬇️",
    sortOrder: 1,
  },
  {
    label: "Medium",
    value: "MEDIUM",
    color:
      "text-yellow-600 bg-yellow-50 border-yellow-200 dark:text-yellow-400 dark:bg-yellow-900/20 dark:border-yellow-700",
    icon: "➡️",
    sortOrder: 2,
  },
  {
    label: "High",
    value: "HIGH",
    color:
      "text-red-600 bg-red-50 border-red-200 dark:text-red-400 dark:bg-red-900/20 dark:border-red-700",
    icon: "⬆️",
    sortOrder: 3,
  },
];

export const getPriorityConfig = (priority) => {
  const config = priorityOptions.find((p) => p.value === priority);
  return config || priorityOptions[1]; // Default to MEDIUM if not found
};

export const getPriorityColor = (priority) => {
  return getPriorityConfig(priority).color;
};

export const getPriorityIcon = (priority) => {
  return getPriorityConfig(priority).icon;
};

export const getPriorityLabel = (priority) => {
  return getPriorityConfig(priority).label;
};

export const sortByPriority = (issues, ascending = false) => {
  return [...issues].sort((a, b) => {
    const aPriority = getPriorityConfig(a.issuePriority || a.priority || "MEDIUM").sortOrder;
    const bPriority = getPriorityConfig(b.issuePriority || b.priority || "MEDIUM").sortOrder;
    return ascending ? aPriority - bPriority : bPriority - aPriority;
  });
};

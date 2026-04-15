/**
 * Parse backend errors and return user-friendly messages
 */
export const getErrorMessage = (error) => {
  // Network error
  if (error.message === "Network Error" || !error.response) {
    return "Unable to connect to the server. Please check your internet connection.";
  }

  const status = error.response?.status;
  const data = error.response?.data;

  // Validation errors with array of messages
  if (data?.errors && Array.isArray(data.errors)) {
    return data.errors.join(". ");
  }

  // Single error message from backend
  if (data?.message) {
    // Make error messages more user-friendly
    let message = data.message;
    message = message
      .replace(/^Error: /, "") // Remove "Error: " prefix
      .replace(/^error: /, "");
    // Capitalize first letter
    message = message.charAt(0).toUpperCase() + message.slice(1);
    return message;
  }

  // HTTP status specific messages
  const statusMessages = {
    400: "Invalid request. Please check your input and try again.",
    401: "Your session has expired. Please log in again.",
    403: "You don't have permission to perform this action.",
    404: "The requested item was not found.",
    409: "This action conflicts with existing data. Please refresh and try again.",
    422: data?.errors ? data.errors.join(". ") : "Validation failed. Please check your input.",
    429: "Too many requests. Please wait a moment and try again.",
    500: "Server error. Please try again later.",
    503: "Service temporarily unavailable. Please try again soon.",
  };

  return (
    statusMessages[status] ||
    `An error occurred (${status}). Please try again later.`
  );
};

/**
 * Wrap API calls with automatic error handling
 */
export const withErrorHandling = async (apiCall, errorCallback) => {
  try {
    return await apiCall();
  } catch (error) {
    const message = getErrorMessage(error);
    if (errorCallback) {
      errorCallback(message, error);
    }
    throw new Error(message);
  }
};

/**
 * Validation error messages
 */
export const validateSprintData = (sprintData) => {
  const errors = [];

  if (!sprintData.name || !sprintData.name.trim()) {
    errors.push("Sprint name is required");
  }

  if (!sprintData.startDate) {
    errors.push("Start date is required");
  }

  if (!sprintData.endDate) {
    errors.push("End date is required");
  }

  if (sprintData.startDate && sprintData.endDate) {
    const start = new Date(sprintData.startDate);
    const end = new Date(sprintData.endDate);
    if (start >= end) {
      errors.push("Start date must be before end date");
    }
  }

  if (sprintData.goal && sprintData.goal.length > 500) {
    errors.push("Sprint goal cannot exceed 500 characters");
  }

  return errors;
};

export const validateIssueData = (issueData) => {
  const errors = [];

  if (!issueData.title || !issueData.title.trim()) {
    errors.push("Issue title is required");
  } else if (issueData.title.length > 255) {
    errors.push("Issue title cannot exceed 255 characters");
  }

  if (issueData.description && issueData.description.length > 5000) {
    errors.push("Issue description cannot exceed 5000 characters");
  }

  return errors;
};

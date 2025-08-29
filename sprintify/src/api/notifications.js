import { protectedApi } from "./config";

/**
 * Fetch notifications for the authenticated user
 * @param {Object} params - Query parameters
 * @param {number} params.page - Page number for pagination
 * @param {number} params.limit - Number of notifications per page
 * @param {boolean} params.unreadOnly - Whether to fetch only unread notifications
 * @returns {Promise<Object>} Response containing notifications and pagination info
 */
export const fetchNotifications = async (params = {}) => {
  try {
    const response = await protectedApi.get("/notifications", { params });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch notifications:", error);
    throw new Error(error.response?.data?.message || "Failed to fetch notifications");
  }
};

/**
 * Get unread notification count
 * @returns {Promise<number>} Number of unread notifications
 */
export const getUnreadCount = async () => {
  try {
    const response = await protectedApi.get("/notifications/unread-count");
    return response.data.unreadCount;
  } catch (error) {
    console.error("Failed to get unread count:", error);
    throw new Error(error.response?.data?.message || "Failed to get unread count");
  }
};

/**
 * Mark a notification as read
 * @param {string} notificationId - ID of the notification to mark as read
 * @returns {Promise<Object>} Updated notification
 */
export const markAsRead = async (notificationId) => {
  try {
    const response = await protectedApi.patch(`/notifications/${notificationId}/read`);
    return response.data;
  } catch (error) {
    console.error("Failed to mark notification as read:", error);
    throw new Error(error.response?.data?.message || "Failed to mark notification as read");
  }
};

/**
 * Mark all notifications as read for the authenticated user
 * @returns {Promise<Object>} Success message
 */
export const markAllAsRead = async () => {
  try {
    const response = await protectedApi.patch("/notifications/mark-all-read");
    return response.data;
  } catch (error) {
    console.error("Failed to mark all notifications as read:", error);
    throw new Error(error.response?.data?.message || "Failed to mark all notifications as read");
  }
};

/**
 * Get a specific notification by ID
 * @param {string} notificationId - ID of the notification
 * @returns {Promise<Object>} Notification details
 */
export const getNotificationById = async (notificationId) => {
  try {
    const response = await protectedApi.get(`/notifications/${notificationId}`);
    return response.data;
  } catch (error) {
    console.error("Failed to get notification:", error);
    throw new Error(error.response?.data?.message || "Failed to get notification");
  }
};

/**
 * Delete a notification
 * @param {string} notificationId - ID of the notification to delete
 * @returns {Promise<Object>} Success message
 */
export const deleteNotification = async (notificationId) => {
  try {
    const response = await protectedApi.delete(`/notifications/${notificationId}`);
    return response.data;
  } catch (error) {
    console.error("Failed to delete notification:", error);
    throw new Error(error.response?.data?.message || "Failed to delete notification");
  }
};

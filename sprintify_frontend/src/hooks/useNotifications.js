import useNotificationStore from "../store/notificationStore";

/**
 * Custom hook to access notification store
 * @returns {Object} notification state and utilities
 */
export const useNotifications = () => {
  return useNotificationStore();
};

export default useNotifications;

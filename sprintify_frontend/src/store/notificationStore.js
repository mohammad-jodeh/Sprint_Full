import { create } from 'zustand';
import { fetchNotifications, getUnreadCount } from '../api/notifications';
import socketService from '../services/socket';
import { toast } from 'react-hot-toast';
import useAuthStore from './authstore';

const useNotificationStore = create((set, get) => ({
  // State
  notifications: [],
  unreadCount: 0,
  loading: false,
  error: null,
  notificationInterval: null,
  socketInitialized: false,

  // Actions
  setLoading: (loading) => set({ loading }),
  
  setNotifications: (notifications) => set({ notifications, loading: false }),
  
  setUnreadCount: (unreadCount) => set({ unreadCount }),
  
  setError: (error) => set({ error, loading: false }),

  // Load notifications
  loadNotifications: async (params = {}) => {
    try {
      get().setLoading(true);
      const response = await fetchNotifications(params);
      get().setNotifications(response.notifications || []);
      get().setUnreadCount(response.unreadCount || 0);
    } catch (error) {
      console.error('Failed to load notifications:', error);
      get().setError(error.message);
    }
  },

  // Load unread count only
  loadUnreadCount: async () => {
    try {
      const count = await getUnreadCount();
      get().setUnreadCount(count);
    } catch (error) {
      console.error('Failed to load unread count:', error);
    }
  },

  // Mark notification as read
  markAsRead: (notificationId) => {
    set((state) => ({
      notifications: state.notifications.map(notification =>
        notification.id === notificationId
          ? { ...notification, isRead: true }
          : notification
      ),
      unreadCount: Math.max(0, state.unreadCount - 1),
    }));
  },

  // Mark all notifications as read
  markAllAsRead: () => {
    set((state) => ({
      notifications: state.notifications.map(notification => ({
        ...notification,
        isRead: true,
      })),
      unreadCount: 0,
    }));
  },

  // Add new notification (for real-time updates)
  addNotification: (notification) => {
    set((state) => ({
      notifications: [notification, ...state.notifications],
      unreadCount: notification.isRead ? state.unreadCount : state.unreadCount + 1,
    }));
  },

  // Remove notification
  removeNotification: (notificationId) => {
    set((state) => {
      const removedNotification = state.notifications.find(n => n.id === notificationId);
      return {
        notifications: state.notifications.filter(n => n.id !== notificationId),
        unreadCount: removedNotification && !removedNotification.isRead 
          ? Math.max(0, state.unreadCount - 1) 
          : state.unreadCount,
      };
    });
  },

  // Project room management
  joinProject: (projectId) => {
    socketService.joinProject(projectId);
  },

  leaveProject: (projectId) => {
    socketService.leaveProject(projectId);
  },

  // Initialize socket connection and listeners
  initializeSocket: () => {
    const { socketInitialized } = get();
    
    if (socketInitialized) {
      console.log('🔔 Socket listeners already initialized, skipping...');
      return;
    }
    
    console.log('🔔 Setting up notification socket listeners...');
    const { user } = useAuthStore.getState();
    
    if (user?.token) {
      // Load initial unread count
      get().loadUnreadCount();
      
      // Set up periodic refresh for unread count
      const interval = setInterval(() => get().loadUnreadCount(), 30000); // Every 30 seconds
      
      // Define the callback functions
      const handleNewNotification = (data) => {
        console.log('📧 Store: New notification received via socket:', data);
        
        // Add notification to state
        get().addNotification(data.notification);
        
        // Update unread count
        if (data.unreadCount !== undefined) {
          get().setUnreadCount(data.unreadCount);
        }
        
        // Show toast notification
        toast.success(`New notification: ${data.notification.title}`, {
          duration: 4000,
          position: 'top-right',
        });
      };

      const handleNotificationRead = (data) => {
        console.log('📧 Store: Notification read update via socket:', data);
        
        // Mark notification as read in state
        get().markAsRead(data.notificationId);
        
        // Update unread count
        if (data.unreadCount !== undefined) {
          get().setUnreadCount(data.unreadCount);
        }
      };

      const handleAllNotificationsRead = (data) => {
        console.log('📧 Store: All notifications read via socket:', data);
        
        // Mark all notifications as read
        get().markAllAsRead();
        
        // Update unread count
        if (data.unreadCount !== undefined) {
          get().setUnreadCount(data.unreadCount);
        }
      };

      const handleProjectNotification = (data) => {
        console.log('📧 Store: Project notification received via socket:', data);
        
        // Show toast for project notifications
        toast.info(`Project Update: ${data.title}`, {
          duration: 4000,
          position: 'top-right',
        });
      };
      
      // Ensure the callback is set before initializing listeners
      socketService.setOnNewNotification(handleNewNotification);

      // Set up the callback functions on the socket service
      console.log('🔔 Setting callback functions on socket service...');
      socketService.setOnNotificationRead(handleNotificationRead);
      socketService.setOnAllNotificationsRead(handleAllNotificationsRead);
      socketService.setOnProjectNotification(handleProjectNotification);
      
      console.log('🔔 Notification socket listeners set up successfully');
      
      // Mark as initialized
      set({ socketInitialized: true });
      
      // Store the interval so we can clear it later
      set({ notificationInterval: interval });
      
      return () => {
        console.log('🔔 Cleaning up notification interval...');
        clearInterval(interval);
      };
    }
  },

  // Cleanup socket connection
  cleanupSocket: () => {
    // Clear interval if it exists
    const { notificationInterval } = get();
    if (notificationInterval) {
      clearInterval(notificationInterval);
      set({ notificationInterval: null });
    }
    
    // Clear socket event handlers
    socketService.setOnNewNotification(null);
    socketService.setOnNotificationRead(null);
    socketService.setOnAllNotificationsRead(null);
    socketService.setOnProjectNotification(null);
    
    // Reset initialization flag
    set({ socketInitialized: false });
  },

  // Reset store
  reset: () => {
    const { notificationInterval } = get();
    if (notificationInterval) {
      clearInterval(notificationInterval);
    }
    
    set({
      notifications: [],
      unreadCount: 0,
      loading: false,
      error: null,
      notificationInterval: null,
      socketInitialized: false,
    });
  },
}));

export default useNotificationStore;

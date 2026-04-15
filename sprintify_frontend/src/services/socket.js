import { io } from 'socket.io-client';
import useAuthStore from '../store/authstore';
import {toast} from 'react-hot-toast';

class SocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
  }

  /**
   * Initialize socket connection with authentication
   */
  connect() {
    const { user, token } = useAuthStore.getState();

    if (!token) {
      console.warn('No authentication token found, cannot connect to socket');
      return;
    }

    if (this.socket && this.socket.connected) {
      return;
    }

    if (this.socket) {
      this.disconnect();
    }

    try {
      // Use environment variable for Socket.IO URL, matching the REST API backend
      const socketUrl = import.meta.env.VITE_API_BASE_URL 
        ? import.meta.env.VITE_API_BASE_URL.replace('/api/v1', '') // Remove API path
        : 'http://localhost:8080';
      
      this.socket = io(socketUrl, {
        auth: {
          token: token
        },
        transports: ['websocket', 'polling'],
        timeout: 20000,
        retries: 5,
        autoConnect: true,
        forceNew: true,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        maxReconnectionAttempts: 5,
        randomizationFactor: 0.5
      });

      this.setupEventListeners();
    } catch (error) {
      console.error('Failed to initialize socket connection:', error);
    }
  }

  /**
   * Setup socket event listeners
   */
  setupEventListeners() {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('🔌 WebSocket connected successfully');
      this.isConnected = true;
      this.reconnectAttempts = 0;
      
      // Emit user status if needed
      const { user } = useAuthStore.getState();
      if (user) {
      }
    });

    this.socket.on('disconnect', (reason) => {
      console.warn('🔌 WebSocket disconnected:', reason);
      this.isConnected = false;
      
      // Auto-reconnect for certain disconnect reasons, but not for client-initiated disconnects
      if (reason === 'io server disconnect' || 
          reason === 'transport close' || 
          reason === 'ping timeout' ||
          reason === 'transport error') {
        this.attemptReconnect();
      }
    });

    this.socket.on('connect_error', (error) => {
      console.error('🔌 Socket connection error:', error.message);
      console.error('🔌 Error details:', error);
      
      // Check if it's an authentication error
      if (error.message && error.message.includes('Authentication')) {
        console.error('🔌 Authentication failed - token may be invalid');
        // Don't auto-reconnect for auth errors
        return;
      }
      
      this.attemptReconnect();
    });

    // Add auth error listener
    this.socket.on('error', (error) => {
      console.error('🔌 Socket error:', error);
    });

    // Ensure listeners are set up properly
    if (!this.socket) {
      console.error('🔌 WebSocket is not initialized. Cannot set up listeners.');
      return;
    }

    // Set up notification event listeners
    this.setupNotificationListeners();
  }

  /**
   * Setup notification-specific event listeners
   */
  setupNotificationListeners() {
    if (!this.socket) return;
    // Listen for new notifications
    this.socket.on('notification:new', (data) => {
      console.log('🔔 New notification received:', data);
      toast.success(`New notification: ${data.notification.title}`, {
        duration: 4000,
        position: 'top-right',
      });
      this.handleNewNotification(data);
    });

    // Listen for notification read updates
    this.socket.on('notification:read', (data) => {
      this.handleNotificationRead(data);
    });

    // Listen for all notifications marked as read
    this.socket.on('notifications:all-read', (data) => {
      this.handleAllNotificationsRead(data);
    });

    // Listen for project-wide notifications
    this.socket.on('project:notification', (data) => {
      this.handleProjectNotification(data);
    });

    // REAL-TIME ISSUE UPDATES
    // Listen for issue created
    this.socket.on('issue:created', (data) => {
      console.log('📝 New issue created (real-time):', data);
      if (this.onIssueCreated) {
        this.onIssueCreated(data);
      }
    });

    // Listen for issue updated
    this.socket.on('issue:updated', (data) => {
      console.log('📝 Issue updated (real-time):', data);
      if (this.onIssueUpdated) {
        this.onIssueUpdated(data);
      }
    });

    // Listen for issue deleted
    this.socket.on('issue:deleted', (data) => {
      console.log('📝 Issue deleted (real-time):', data);
      if (this.onIssueDeleted) {
        this.onIssueDeleted(data);
      }
    });

    // Listen for issue status changed
    this.socket.on('issue:status-changed', (data) => {
      console.log('📝 Issue status changed (real-time):', data);
      if (this.onIssueStatusChanged) {
        this.onIssueStatusChanged(data);
      }
    });

    // Listen for issue assigned
    this.socket.on('issue:assigned', (data) => {
      console.log('📝 Issue assigned (real-time):', data);
      if (this.onIssueAssigned) {
        this.onIssueAssigned(data);
      }
    });

    // Listen for sprint updates
    this.socket.on('sprint:updated', (data) => {
      console.log('🏃 Sprint updated (real-time):', data);
      if (this.onSprintUpdated) {
        this.onSprintUpdated(data);
      }
    });
  }

  /**
   * Handle new notification
   * @param {Object} data - Notification data
   */
  handleNewNotification(data) {
    console.log('🔔 Socket handleNewNotification called with:', data);
    console.log('🔔 onNewNotification callback exists:', !!this.onNewNotification);
    
    // This will be called by the notification store
    if (this.onNewNotification) {
      console.log('🔔 Calling onNewNotification callback');
      this.onNewNotification(data);
    } else {
      console.warn('🔔 No onNewNotification callback set!');
    }
  }

  /**
   * Handle notification read
   * @param {Object} data - Notification read data
   */
  handleNotificationRead(data) {
    if (this.onNotificationRead) {
      this.onNotificationRead(data);
    }
  }

  /**
   * Handle all notifications read
   * @param {Object} data - All read data
   */
  handleAllNotificationsRead(data) {
    if (this.onAllNotificationsRead) {
      this.onAllNotificationsRead(data);
    }
  }

  /**
   * Handle project notification
   * @param {Object} data - Project notification data
   */
  handleProjectNotification(data) {
    if (this.onProjectNotification) {
      this.onProjectNotification(data);
    }
  }

  /**
   * Join a project room
   * @param {string} projectId - Project ID to join
   */
  joinProject(projectId) {
    if (this.socket && this.isConnected) {
      this.socket.emit('join-project', projectId);
    }
  }

  /**
   * Leave a project room
   * @param {string} projectId - Project ID to leave
   */
  leaveProject(projectId) {
    if (this.socket && this.isConnected) {
      this.socket.emit('leave-project', projectId);
    }
  }

  /**
   * Set callback for new notifications
   * @param {Function} callback - Callback function
   */
  setOnNewNotification(callback) {
    console.log('🔔 Setting onNewNotification callback:', !!callback);
    this.onNewNotification = callback;
  }

  /**
   * Set callback for notification read
   * @param {Function} callback - Callback function
   */
  setOnNotificationRead(callback) {
    this.onNotificationRead = callback;
  }

  /**
   * Set callback for all notifications read
   * @param {Function} callback - Callback function
   */
  setOnAllNotificationsRead(callback) {
    this.onAllNotificationsRead = callback;
  }

  /**
   * Set callback for project notifications
   * @param {Function} callback - Callback function
   */
  setOnProjectNotification(callback) {
    this.onProjectNotification = callback;
  }

  // ===== REAL-TIME ISSUE UPDATE CALLBACKS =====

  /**
   * Set callback for issue created
   * @param {Function} callback - Callback function
   */
  setOnIssueCreated(callback) {
    this.onIssueCreated = callback;
  }

  /**
   * Set callback for issue updated
   * @param {Function} callback - Callback function
   */
  setOnIssueUpdated(callback) {
    this.onIssueUpdated = callback;
  }

  /**
   * Set callback for issue deleted
   * @param {Function} callback - Callback function
   */
  setOnIssueDeleted(callback) {
    this.onIssueDeleted = callback;
  }

  /**
   * Set callback for issue status changed
   * @param {Function} callback - Callback function
   */
  setOnIssueStatusChanged(callback) {
    this.onIssueStatusChanged = callback;
  }

  /**
   * Set callback for issue assigned
   * @param {Function} callback - Callback function
   */
  setOnIssueAssigned(callback) {
    this.onIssueAssigned = callback;
  }

  /**
   * Set callback for sprint updated
   * @param {Function} callback - Callback function
   */
  setOnSprintUpdated(callback) {
    this.onSprintUpdated = callback;
  }

  /**
   * Attempt to reconnect to the socket
   */
  attemptReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('🔌 Max reconnection attempts reached');
      return;
    }

    this.reconnectAttempts++;
    const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
        
    setTimeout(() => {
      const { token } = useAuthStore.getState();
      if (!this.isConnected && token) {
        this.connect();
      }
    }, delay);
  }

  /**
   * Disconnect from socket
   */
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  /**
   * Check if socket is connected
   * @returns {boolean} Connection status
   */
  isSocketConnected() {
    return this.isConnected && this.socket?.connected;
  }

  /**
   * Get socket instance
   * @returns {Socket} Socket instance
   */
  getSocket() {
    return this.socket;
  }
}

// Export singleton instance
export default new SocketService();

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BellDot, MessageCircle, CheckCircle, X, Check, Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { 
  markAsRead as apiMarkAsRead, 
  markAllAsRead as apiMarkAllAsRead, 
  deleteNotification as apiDeleteNotification 
} from "../api/notifications";
import useNotifications from "../hooks/useNotifications";

const iconMap = {
  PROJECT: <BellDot className="text-blue-400" size={20} />,
  COMMENT: <MessageCircle className="text-emerald-400" size={20} />,
  TASK: <CheckCircle className="text-lime-400" size={20} />,
  ISSUE: <CheckCircle className="text-orange-400" size={20} />,
  MENTION: <MessageCircle className="text-purple-400" size={20} />,
  ASSIGNMENT: <BellDot className="text-green-400" size={20} />,
};

const filters = ["All", "Unread", "Projects", "Tasks", "Comments"];

const Notifications = () => {
  const [activeFilter, setActiveFilter] = useState("All");
  const { 
    notifications, 
    unreadCount, 
    loading, 
    loadNotifications, 
    markAsRead: storeMarkAsRead, 
    markAllAsRead: storeMarkAllAsRead, 
    removeNotification 
  } = useNotifications();  // Handle marking notification as read
  const handleMarkAsRead = async (notificationId) => {
    try {
      await apiMarkAsRead(notificationId);
      storeMarkAsRead(notificationId);
      toast.success("Notification marked as read");
    } catch (error) {
      console.error("Failed to mark as read:", error);
      toast.error("Failed to mark notification as read");
    }
  };
  // Handle marking all notifications as read
  const handleMarkAllAsRead = async () => {
    try {
      await apiMarkAllAsRead();
      storeMarkAllAsRead();
      toast.success("All notifications marked as read");
    } catch (error) {
      console.error("Failed to mark all as read:", error);
      toast.error("Failed to mark all notifications as read");
    }
  };

  // Handle deleting notification
  const handleDeleteNotification = async (notificationId) => {
    try {
      await apiDeleteNotification(notificationId);
      removeNotification(notificationId);
      toast.success("Notification deleted");
    } catch (error) {
      console.error("Failed to delete notification:", error);
      toast.error("Failed to delete notification");
    }
  };

  // Filter notifications based on active filter
  const filtered = notifications.filter((note) => {
    if (activeFilter === "All") return true;
    if (activeFilter === "Unread") return !note.isRead;
    if (activeFilter === "Projects") return note.type === "PROJECT" || note.type === "ASSIGNMENT";
    if (activeFilter === "Tasks") return note.type === "TASK" || note.type === "ISSUE";
    if (activeFilter === "Comments") return note.type === "COMMENT" || note.type === "MENTION";
    return true;
  });  // Load notifications on component mount
  useEffect(() => {
    loadNotifications();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (loading) {
    return (
      <div className="space-y-8 p-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Notifications
          </h1>
        </div>
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6">
      <div className="flex justify-between items-center flex-wrap gap-3">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Notifications
          </h1>
          {unreadCount > 0 && (
            <span className="bg-red-500 text-white text-sm font-medium px-2 py-1 rounded-full">
              {unreadCount} unread
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Mark All as Read Button */}
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="px-3 py-2 rounded-lg bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 transition flex items-center gap-2"
            >
              <Check size={16} />
              Mark All Read
            </button>
          )}
          
          {/* Filters */}
          {filters.map((label) => (
            <button
              key={label}
              onClick={() => setActiveFilter(label)}
              className={`px-3 py-1 rounded-full text-sm font-medium border ${
                activeFilter === label
                  ? "bg-primary text-white border-primary"
                  : "bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"
              } transition`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Notification List */}
      <AnimatePresence mode="popLayout">
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2">
          {filtered.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-center text-gray-400 col-span-full py-12"
            >
              <BellDot size={48} className="mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">No notifications found</p>
              <p className="text-sm">
                {activeFilter === "All" 
                  ? "You're all caught up!" 
                  : `No ${activeFilter.toLowerCase()} notifications.`
                }
              </p>
            </motion.div>
          ) : (
            filtered.map((note) => (
              <motion.div
                key={note.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25 }}
                className={`group relative border p-5 rounded-2xl shadow-xl hover:shadow-2xl hover:ring-1 hover:ring-primary/30 transition-all ${
                  note.isRead 
                    ? "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700" 
                    : "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700"
                }`}
              >
                {/* Unread indicator */}
                {!note.isRead && (
                  <div className="absolute top-3 right-3 w-3 h-3 bg-blue-500 rounded-full"></div>
                )}

                <div className="flex items-start gap-4">
                  <div className="p-2 bg-primary/10 dark:bg-white/10 rounded-full shadow-inner group-hover:scale-105 transition">
                    {iconMap[note.type] || iconMap.PROJECT}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                      {note.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">
                      {note.message}
                    </p>
                    
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-xs font-mono text-gray-400">
                        {new Date(note.createdAt).toLocaleString()}
                      </span>
                      
                      {note.projectName && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-300 dark:bg-indigo-900/40 font-medium">
                          {note.projectName}
                        </span>
                      )}
                    </div>

                    {/* Action buttons */}
                    <div className="mt-3 flex items-center gap-2">
                      {!note.isRead && (
                        <button
                          onClick={() => handleMarkAsRead(note.id)}
                          className="flex items-center gap-1 px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-md hover:bg-blue-200 dark:hover:bg-blue-900/70 transition"
                        >
                          <Check size={12} />
                          Mark as read
                        </button>
                      )}
                      
                      <button
                        onClick={() => handleDeleteNotification(note.id)}
                        className="flex items-center gap-1 px-2 py-1 text-xs bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 rounded-md hover:bg-red-200 dark:hover:bg-red-900/70 transition"
                      >
                        <Trash2 size={12} />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </AnimatePresence>
    </div>
  );
};

export default Notifications;

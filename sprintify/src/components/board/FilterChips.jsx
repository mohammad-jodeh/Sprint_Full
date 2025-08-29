import React from "react";
import { X, UserX } from "lucide-react";

// Component for user filter chip following SRP
const UserFilterChip = ({ user, userId, isSelected, onToggle }) => (
  <button
    onClick={() => onToggle(userId)}
    className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105 ${
      isSelected
        ? "bg-gradient-to-r from-blue-500 to-custom-600 text-white shadow-lg neon-blue"
        : "bg-white/60 dark:bg-black/40 text-gray-700 dark:text-gray-300 border border-gray-200/50 dark:border-gray-600/30 hover:bg-gray-50 dark:hover:bg-gray-800/50 backdrop-blur-sm"
    }`}
  >
    {" "}
    <div
      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
        isSelected
          ? "bg-white/20"
          : "bg-gradient-to-br from-blue-500 to-custom-600 text-white"
      }`}
    >
      {(user.fullName || user.name || user.email || "U")
        .charAt(0)
        .toUpperCase()}
    </div>
    <span>{user.fullName || user.name || user.email || `User ${user.id}`}</span>
    {isSelected && (
      <X size={14} className="ml-1 opacity-70 hover:opacity-100" />
    )}
  </button>
);

// Component for unassigned filter toggle
const UnassignedFilterChip = ({ isSelected, onToggle }) => (
  <button
    onClick={onToggle}
    className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105 ${
      isSelected
        ? "bg-gradient-to-r from-gray-500 to-gray-700 text-white shadow-lg"
        : "bg-white/60 dark:bg-black/40 text-gray-700 dark:text-gray-300 border border-gray-200/50 dark:border-gray-600/30 hover:bg-gray-50 dark:hover:bg-gray-800/50 backdrop-blur-sm"
    }`}
  >
    <UserX size={16} />
    <span>Unassigned</span>
    {isSelected && (
      <X size={14} className="ml-1 opacity-70 hover:opacity-100" />
    )}
  </button>
);

export { UserFilterChip, UnassignedFilterChip };

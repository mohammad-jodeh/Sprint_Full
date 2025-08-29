import React from "react";
import { Plus, Settings, MoreHorizontal } from "lucide-react";

// Component for board action buttons following SRP
const BoardActions = ({
  onAddIssue,
  onSettings,
  onMore,
  canCreateTask = true,
  canConfigureBoard = true,
}) => (
  <div className="flex items-center space-x-3">
    {canCreateTask && (
      <button
        onClick={onAddIssue}
        className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-custom-500 to-custom-600 hover:from-custom-600 hover:to-custom-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
      >
        <Plus className="w-4 h-4" />
        <span className="font-medium">Add Issue</span>
      </button>
    )}
    {canConfigureBoard && (
      <button
        onClick={onSettings}
        className="p-2 bg-white/50 dark:bg-black/30 hover:bg-white/70 dark:hover:bg-black/50 rounded-xl backdrop-blur-sm border border-white/30 dark:border-white/10 transition-all duration-300 transform hover:scale-105"
      >
        <Settings className="w-5 h-5 text-gray-600 dark:text-gray-400" />
      </button>
    )}
    <button
      onClick={onMore}
      className="p-2 bg-white/50 dark:bg-black/30 hover:bg-white/70 dark:hover:bg-black/50 rounded-xl backdrop-blur-sm border border-white/30 dark:border-white/10 transition-all duration-300 transform hover:scale-105"
    >
      <MoreHorizontal className="w-5 h-5 text-gray-600 dark:text-gray-400" />
    </button>
  </div>
);

export default BoardActions;

import React from "react";
import { MoreHorizontal, Edit2, Trash2 } from "lucide-react";

const ColumnMenu = ({
  isMenuOpen,
  onToggleMenu,
  onEditTitle,
  onDeleteColumn,
}) => {
  return (
    <div className="relative">
      <button
        onClick={onToggleMenu}
        className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-white/50 dark:hover:bg-black/30 rounded-xl transition-all duration-300 transform hover:scale-110 backdrop-blur-sm border border-transparent hover:border-white/30 dark:hover:border-white/10"
      >
        <MoreHorizontal size={18} />
      </button>{" "}
      {isMenuOpen && (
        <div className="absolute right-0 top-full mt-2 bg-white/90 dark:bg-black/80 rounded-2xl shadow-2xl border border-white/30 dark:border-white/10 py-3 z-20 w-48 backdrop-blur-xl animate-slide-down">
          {" "}
          <button
            onClick={onEditTitle}
            className="w-full text-left px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-white/10 flex items-center transition-all duration-300 transform hover:translate-x-1"
          >
            <Edit2 size={14} className="mr-3 text-blue-500" /> Edit Title
          </button>
          <button
            onClick={onDeleteColumn}
            className="w-full text-left px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50/50 dark:hover:bg-red-900/20 flex items-center transition-all duration-300 transform hover:translate-x-1"
          >
            <Trash2 size={14} className="mr-3" /> Delete Column
          </button>
        </div>
      )}
    </div>
  );
};

export default ColumnMenu;

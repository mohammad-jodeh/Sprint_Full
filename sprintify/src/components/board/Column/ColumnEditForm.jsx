import React from "react";
import { Check, X } from "lucide-react";

const ColumnEditForm = ({
  editedTitle,
  setEditedTitle,
  onSave,
  onCancel,
  isLoading = false,
}) => {
  return (
    <div className="flex items-center w-full">
      {" "}
      <input
        type="text"
        value={editedTitle}
        onChange={(e) => setEditedTitle(e.target.value)}
        disabled={isLoading}
        className="flex-1 p-3 text-sm border-2 border-gradient-to-r from-custom-400 to-custom-400 rounded-xl focus:outline-none focus:ring-4 focus:ring-custom-500/20 focus:border-custom-500 bg-white/80 dark:bg-black/50 text-gray-900 dark:text-white transition-all backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed"
        autoFocus
      />
      <div className="flex ml-3 space-x-2">
        <button
          onClick={onSave}
          disabled={isLoading}
          className="p-2 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 rounded-xl transition-all duration-300 transform hover:scale-110 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:scale-100"
        >
          {isLoading ? (
            <svg
              className="animate-spin h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          ) : (
            <Check size={16} />
          )}
        </button>
        <button
          onClick={onCancel}
          disabled={isLoading}
          className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-xl transition-all duration-300 transform hover:scale-110 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:scale-100"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

export default ColumnEditForm;

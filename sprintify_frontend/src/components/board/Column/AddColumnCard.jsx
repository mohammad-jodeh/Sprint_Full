import React from "react";
import { Plus, Sparkles } from "lucide-react";

// Component for the add column card following SRP
const AddColumnCard = ({
  onAddColumn,
  isAnimated,
  animationDelay,
  canConfigureBoard = true,
}) => {
  if (!canConfigureBoard) {
    return (
      <div
        className={`w-80 flex-shrink-0 transition-all duration-700 ${
          isAnimated ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
        }`}
        style={{ transitionDelay: `${animationDelay}ms` }}
      >
        <div className="h-96 bg-gradient-to-br from-white/30 to-white/20 dark:from-black/20 dark:to-black/10 backdrop-blur-xl rounded-2xl border-2 border-dashed border-gray-300/30 dark:border-gray-600/20 flex items-center justify-center">
          <div className="text-center space-y-3 p-8">
            <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-2xl flex items-center justify-center mx-auto">
              <Plus className="w-8 h-8 text-gray-400 dark:text-gray-500" />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400 mb-2">
                Configure Board
              </h3>
              <p className="text-sm text-gray-400 dark:text-gray-500 italic">
                You don't have permission to add columns
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div
      className={`w-80 flex-shrink-0 transition-all duration-700 ${
        isAnimated ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
      }`}
      style={{ transitionDelay: `${animationDelay}ms` }}
    >
      <div className="group cursor-pointer h-96" onClick={onAddColumn}>
        <div className="relative h-full bg-gradient-to-br from-white/60 to-white/30 dark:from-black/40 dark:to-black/20 backdrop-blur-xl rounded-2xl border-2 border-dashed border-gray-300/50 dark:border-gray-600/30 hover:border-gradient-to-r hover:from-custom-400 hover:to-custom-400 dark:hover:from-custom-500 dark:hover:to-custom-500 transition-all duration-500 transform hover:shadow-2xl overflow-hidden">
          {/* Animated background patterns */}
          <div className="absolute inset-0 bg-gradient-to-br from-custom-50/50 to-custom-50/50 dark:from-custom-900/20 dark:to-custom-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent dark:via-white/5 -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

          {/* Content */}
          <div className="relative z-10 h-full flex flex-col items-center justify-center space-y-6 p-8">
            <AddColumnIcon />
            <AddColumnText />
            <AddColumnHint />
          </div>
          {/* Glow effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-custom-400/20 to-custom-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"></div>
        </div>
      </div>
    </div>
  );
};

// Separated icon component for better organization
const AddColumnIcon = () => (
  <div className="relative">
    <div className="w-20 h-20 bg-gradient-to-br from-custom-500 to-custom-600 rounded-2xl flex items-center justify-center shadow-xl group-hover:shadow-2xl transition-all duration-500 transform group-hover:scale-110 group-hover:rotate-3">
      <Plus className="w-10 h-10 text-white transition-transform duration-500 group-hover:rotate-90" />
    </div>

    {/* Floating particles */}
    <div className="absolute -top-2 -right-2 w-4 h-4 bg-yellow-400 rounded-full animate-bounce opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
    <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-pink-400 rounded-full animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
    <div className="absolute top-1/2 -right-4 w-2 h-2 bg-blue-400 rounded-full animate-ping opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
  </div>
);

// Separated text component
const AddColumnText = () => (
  <div className="text-center space-y-3">
    <h3 className="text-xl font-bold bg-gradient-to-r from-gray-700 to-gray-900 dark:from-gray-200 dark:to-gray-400 bg-clip-text text-transparent group-hover:from-custom-600 group-hover:to-custom-600 dark:group-hover:from-custom-400 dark:group-hover:to-custom-400 transition-all duration-500">
      Add New Column
    </h3>
    <p className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-500 max-w-xs">
      Create a new workflow stage to organize your team's tasks
    </p>
  </div>
);

// Separated hint component
const AddColumnHint = () => (
  <div className="flex items-center space-x-2 px-4 py-2 bg-white/50 dark:bg-black/30 rounded-full border border-gray-200/50 dark:border-gray-600/30 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
    <Sparkles className="w-4 h-4 text-violet-500" />
    <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
      Click to create
    </span>
  </div>
);

export default AddColumnCard;

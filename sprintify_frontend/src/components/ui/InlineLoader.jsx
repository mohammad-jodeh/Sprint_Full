import React from 'react';

const InlineLoader = ({ 
  message = "Loading...", 
  size = "default",
  className = "",
  showMessage = true 
}) => {
  const spinnerSizes = {
    small: "w-4 h-4",
    default: "w-6 h-6",
    large: "w-8 h-8"
  };

  return (
    <div className={`flex items-center justify-center space-x-3 ${className}`}>
      {/* Modern gradient spinner */}
      <div className="relative">
        <div className={`
          ${spinnerSizes[size]} 
          border-2 border-gray-200 dark:border-gray-700 rounded-full
        `}></div>
        <div className={`
          ${spinnerSizes[size]} 
          border-2 border-transparent border-t-blue-500 border-r-purple-500 rounded-full 
          animate-spin absolute top-0 left-0
        `}></div>
      </div>
      
      {/* Loading message */}
      {showMessage && (
        <span className="text-gray-700 dark:text-gray-300 text-sm font-medium">
          {message}
        </span>
      )}
    </div>
  );
};

export default InlineLoader;
import React from "react";

const LoadingScreen = ({
  message = "Loading...",
  fullScreen = true,
  size = "default",
}) => {
  const spinnerSizes = {
    small: "w-8 h-8",
    default: "w-12 h-12",
    large: "w-16 h-16",
  };

  return (
    <div
      className={`
      ${fullScreen ? "fixed inset-0" : "relative min-h-96"} 
      flex items-center justify-center
      bg-white dark:bg-gray-900
      transition-colors duration-200
    `}
    >
      {/* Modern animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-[#6366f1] via-[#8b5cf6] to-[#a855f7] rounded-full opacity-10 dark:opacity-5 animate-pulse delay-1000"></div>
      </div>

      {/* Loading content */}
      <div className="relative z-10 flex flex-col items-center space-y-6 p-8">
        {/* Modern spinner with gradient */}
        <div className="relative">
          <div
            className={`
            ${spinnerSizes[size]} 
            border-4 border-gray-200 dark:border-gray-700 rounded-full
          `}
          ></div>
          <div
            className={`
            ${spinnerSizes[size]} 
            border-4 border-transparent 
            border-t-[#6366f1] border-r-[#8b5cf6] 
            rounded-full animate-spin absolute top-0 left-0
          `}
          ></div>
        </div>

        {/* Animated dots */}
        <div className="flex space-x-2">
          <div className="w-2 h-2 bg-[#6366f1] rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-[#8b5cf6] rounded-full animate-bounce delay-100"></div>
          <div className="w-2 h-2 bg-[#a855f7] rounded-full animate-bounce delay-200"></div>
        </div>

        {/* Loading message */}
        <div className="text-center">
          <p className="text-gray-700 dark:text-gray-300 font-medium text-lg">
            {message}
          </p>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Please wait a moment...
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;


import React from "react";

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload || payload.length === 0) return null;

  const data = payload[0].payload;

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3 shadow-md text-sm space-y-1">
      {data.project && (
        <p className="font-semibold text-primary leading-none">
          {data.project}
        </p>
      )}
      {data.name && (
        <p className="font-semibold text-primary leading-none">{data.name}</p>
      )}
      {data.priority && (
        <p className="font-semibold text-primary leading-none">
          {data.priority}
        </p>
      )}
      {typeof data.value !== "undefined" && (
        <p className="text-gray-700 dark:text-gray-300">
          Issues:
          <span className="ml-1 font-medium text-gray-900 dark:text-white">
            {data.value}
          </span>
        </p>
      )}
      {typeof data.count !== "undefined" && (
        <p className="text-gray-700 dark:text-gray-300">
          Count:
          <span className="ml-1 font-medium text-gray-900 dark:text-white">
            {data.count}
          </span>
        </p>
      )}
      {typeof data.issues !== "undefined" && (
        <p className="text-gray-700 dark:text-gray-300">
          Issues:
          <span className="ml-1 font-medium text-gray-900 dark:text-white">
            {data.issues}
          </span>
        </p>
      )}
    </div>
  );
};

export default CustomTooltip;

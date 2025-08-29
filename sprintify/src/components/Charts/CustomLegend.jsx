import React from "react";

const CustomLegend = ({ payload }) => {
  if (!payload || !payload.length) return null;

  return (
    <ul className="flex flex-wrap gap-4 justify-center mt-4 text-sm">
      {payload.map((entry, index) => (
        <li key={`legend-${index}`} className="flex items-center gap-2">
          <span
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-gray-700 dark:text-gray-300">
            {entry.value || entry.name}
          </span>
        </li>
      ))}
    </ul>
  );
};

export default CustomLegend;

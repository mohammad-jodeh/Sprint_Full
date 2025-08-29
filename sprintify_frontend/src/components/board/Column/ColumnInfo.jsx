import React from 'react';
import ColumnIcon from './ColumnIcon';

const ColumnInfo = ({ column, index, issueCount }) => {
  return (
    <div className="flex items-center space-x-3">
      <ColumnIcon index={index} />
      <div>
        <h2 className="text-lg font-bold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
          {column.name}
        </h2>
        <div className="flex items-center space-x-2 mt-1">
          <span className="text-xs font-semibold text-custom-600 dark:text-custom-400 bg-custom-100/50 dark:bg-custom-900/30 rounded-full px-3 py-1 backdrop-blur-sm border border-custom-200/50 dark:border-custom-700/50">
            {issueCount} issues
          </span>
          {issueCount > 0 && (
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ColumnInfo;

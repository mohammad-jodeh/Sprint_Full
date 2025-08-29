import React from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

// Component for displaying status header following SRP
const StatusHeader = ({ 
  status, 
  issueCount, 
  isCollapsed, 
  onToggleCollapse, 
  statusTypeColor, 
  statusTypeText 
}) => {
  return (
    <div 
      className="flex items-center justify-between cursor-pointer group"
      onClick={onToggleCollapse}
    >
      <div className="flex items-center">
        <div className="p-1 rounded-lg group-hover:bg-white/50 dark:group-hover:bg-gray-800/50 transition-colors">
          {isCollapsed ? (
            <ChevronRight size={16} className="text-gray-600 dark:text-gray-400" />
          ) : (
            <ChevronDown size={16} className="text-gray-600 dark:text-gray-400" />
          )}
        </div>
        <h3 className="text-sm font-semibold text-gray-800 dark:text-white ml-2">
          {status.name}
        </h3>
        <span className="ml-3 text-xs font-medium text-gray-600 dark:text-gray-300 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-full px-2.5 py-1 shadow-sm">
          {issueCount}
        </span>
      </div>
      <span className="text-xs font-medium text-gray-600 dark:text-gray-300 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-lg px-3 py-1 shadow-sm">
        {statusTypeText}
      </span>
    </div>
  );
};

export default StatusHeader;

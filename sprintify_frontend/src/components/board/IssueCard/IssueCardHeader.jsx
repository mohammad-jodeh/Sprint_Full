import React from 'react';
import { getIssueTypeIcon, getPriorityIcon, getIssueKey } from './IssueTypeUtils';

const IssueCardHeader = ({ issue }) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center">
        <div className="w-5 h-5 flex items-center justify-center">
          {getIssueTypeIcon(issue)}
        </div>
        <span className="ml-2 text-xs font-medium text-gray-500 dark:text-gray-400">
          {getIssueKey(issue)}
        </span>
      </div>
      <div className="flex items-center">
        <span className="text-xs bg-gray-100 dark:bg-gray-700 rounded-full px-2 py-0.5 text-gray-600 dark:text-gray-300">
          {issue.storyPoint || "?"} pts
        </span>
        <div className="ml-2">{getPriorityIcon(issue)}</div>
      </div>
    </div>
  );
};

export default IssueCardHeader;

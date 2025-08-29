import React from 'react';
import IssueCard from './IssueCard';

// Component for displaying issues list following SRP
const IssuesList = ({ issues, isCollapsed, epics = [], onIssueClick }) => {
  if (isCollapsed) return null;

  return (
    <div className="mt-3 space-y-2">
      {issues.length === 0 ? (
        <EmptyDropZone />
      ) : (        issues.map((issue) => (
          <IssueCard 
            key={issue.id} 
            issue={issue}
            epics={epics}
            onIssueClick={onIssueClick}
          />
        ))
      )}
    </div>
  );
};

// Separated empty state component for better organization
const EmptyDropZone = () => (
  <div className="text-sm text-gray-500 dark:text-gray-400 text-center py-8 border-2 border-dashed border-gray-300/50 dark:border-gray-600/50 rounded-xl bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm hover:border-primary/40 dark:hover:border-primary/50 hover:bg-primary/5 dark:hover:bg-primary/10 transition-all duration-300 group">
    <div className="flex flex-col items-center space-y-2">
      <svg className="w-10 h-10 text-gray-400 dark:text-gray-500 group-hover:text-primary/60 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
      </svg>
      <span className="font-medium group-hover:text-primary transition-colors duration-200">Drop issues here</span>
      <span className="text-xs text-gray-400 dark:text-gray-500">Drag and drop issues to this status</span>
    </div>
  </div>
);

export default IssuesList;

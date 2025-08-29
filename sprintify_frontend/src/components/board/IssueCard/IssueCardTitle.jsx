import React from 'react';

const IssueCardTitle = ({ title }) => {
  return (
    <h4 className="text-sm font-medium text-gray-800 dark:text-white">
      {title}
    </h4>
  );
};

export default IssueCardTitle;

import React from 'react';
import Board from '../components/board/Board';

const BoardDemo = () => {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Project Board
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Drag and drop issues between statuses and columns. Each column contains multiple statuses that group related issues.
          </p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
          <Board />
        </div>
      </div>
    </div>
  );
};

export default BoardDemo;

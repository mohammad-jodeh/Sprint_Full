import { useState } from "react";
import IssueDetailsModal from "../modals/IssueDetailsModal";

export default function TaskCard({ task, onUpdate }) {
  const [showDetails, setShowDetails] = useState(false);

  const handleTaskUpdate = (updatedTask) => {
    if (onUpdate) {
      onUpdate(updatedTask);
    }
  };

  return (
    <>
      <li
        className="flex justify-between items-start bg-gray-50 dark:bg-gray-700/50 px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 hover:shadow transition cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600/50"
        onClick={() => setShowDetails(true)}
      >
        <div>
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {task.title}
          </p>
          <span className="text-xs inline-block mt-1 px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
            Status ID: {task.statusId}
          </span>
        </div>
        <div className="text-sm font-semibold text-primary dark:text-primary-muted">
          {task.storyPoints || 0} pts
        </div>
      </li>

      {showDetails && (
        <IssueDetailsModal
          issue={task}
          onClose={() => setShowDetails(false)}
          onUpdate={handleTaskUpdate}
        />
      )}
    </>
  );
}

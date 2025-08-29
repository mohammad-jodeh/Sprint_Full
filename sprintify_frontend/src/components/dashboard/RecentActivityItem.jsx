export default function RecentActivityItem({ issue }) {
  return (
    <li className="py-3 flex justify-between items-start">
      <div>
        <p className="text-gray-800 dark:text-gray-200 font-medium">
          #{issue.id}: {issue.title}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Priority: {issue.priority} • Points: {issue.storyPoints || 0}
        </p>
      </div>
      <span className="text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-2 py-1 rounded">
        Project {issue.projectId}
      </span>
    </li>
  );
}

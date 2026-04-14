export default function ProgressBar({ completedPoints, totalPoints }) {
  const percent = totalPoints
    ? Math.round((completedPoints / totalPoints) * 100)
    : 0;

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            <span className="font-medium text-gray-900 dark:text-white">{completedPoints}</span>
            <span className="text-gray-500 dark:text-gray-400"> / </span>
            <span className="font-medium text-gray-900 dark:text-white">{totalPoints}</span>
            <span className="text-gray-500 dark:text-gray-400"> pts</span>
          </p>
        </div>
        <span className="text-lg font-bold text-primary">{percent}%</span>
      </div>
      <div className="w-full h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden shadow-inner">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 transition-all duration-500 rounded-full"
          style={{ width: `${percent}%` }}
        ></div>
      </div>
      {totalPoints === 0 && (
        <p className="text-xs text-gray-500 dark:text-gray-400">No tasks with story points assigned</p>
      )}
    </div>
  );
}

export default function ProgressBar({ completedPoints, totalPoints }) {
  const percent = totalPoints
    ? Math.round((completedPoints / totalPoints) * 100)
    : 0;

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {completedPoints} / {totalPoints} pts
        </span>
        <span className="text-sm font-medium text-primary">{percent}%</span>
      </div>
      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-primary transition-all duration-300"
          style={{ width: `${percent}%` }}
        ></div>
      </div>
    </div>
  );
}

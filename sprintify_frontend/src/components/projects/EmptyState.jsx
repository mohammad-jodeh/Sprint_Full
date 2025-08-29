export default function EmptyState({
  title = "No items found",
  subtitle = "Try creating one to get started.",
  icon = "📁",
}) {
  return (
    <div className="text-center text-gray-500 dark:text-gray-400 py-20 space-y-2">
      <div className="text-4xl">{icon}</div>
      <p className="text-xl font-semibold">{title}</p>
      <p className="text-sm">{subtitle}</p>
    </div>
  );
}

export default function StatusBadge({ label, value, color = "gray" }) {
  const colorClass =
    {
      yellow:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100",
      blue: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100",
      green:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
      gray: "bg-gray-200 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
      primary: "bg-primary/10 text-primary",
    }[color] || colorClass.gray;

  return (
    <span
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${colorClass}`}
    >
      <span>{label}</span>
      <span className="text-xs font-bold">{value}</span>
    </span>
  );
}

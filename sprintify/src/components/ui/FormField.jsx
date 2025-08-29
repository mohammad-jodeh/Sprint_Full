export default function FormField({ label, children }) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>
      {children}
    </div>
  );
}
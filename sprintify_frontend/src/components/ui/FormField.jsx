import { AlertCircle, CheckCircle } from "lucide-react";

export default function FormField({
  label,
  children,
  error = null,
  hint = null,
  required = false,
  isValid = null,
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-1">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
        {required && <span className="text-red-500 text-xs">*</span>}
        {isValid === true && (
          <CheckCircle size={14} className="text-green-500" />
        )}
      </div>
      {children}
      {error && (
        <div className="flex items-start gap-2 text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-2 rounded border border-red-200 dark:border-red-800">
          <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}
      {hint && !error && (
        <p className="text-xs text-gray-500 dark:text-gray-400">{hint}</p>
      )}
    </div>
  );
}
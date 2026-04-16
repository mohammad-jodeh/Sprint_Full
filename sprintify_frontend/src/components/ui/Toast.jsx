import React, { useEffect } from "react";
import { X, CheckCircle, AlertCircle, InfoIcon, AlertTriangle } from "lucide-react";

const Toast = ({ id, type = "info", message, duration = 4000, onClose }) => {
  useEffect(() => {
    if (duration) {
      const timer = setTimeout(() => onClose(id), duration);
      return () => clearTimeout(timer);
    }
  }, [id, duration, onClose]);

  const typeStyles = {
    success: "bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700",
    error: "bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700",
    warning: "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-300 dark:border-yellow-700",
    info: "bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-700",
  };

  const iconStyles = {
    success: "text-green-600 dark:text-green-400",
    error: "text-red-600 dark:text-red-400",
    warning: "text-yellow-600 dark:text-yellow-400",
    info: "text-blue-600 dark:text-blue-400",
  };

  const textStyles = {
    success: "text-green-900 dark:text-green-200",
    error: "text-red-900 dark:text-red-200",
    warning: "text-yellow-900 dark:text-yellow-200",
    info: "text-blue-900 dark:text-blue-200",
  };

  const IconComponent = {
    success: CheckCircle,
    error: AlertCircle,
    warning: AlertTriangle,
    info: InfoIcon,
  }[type] || InfoIcon;

  return (
    <div
      className={`
        flex items-start gap-3 p-4 rounded-lg border shadow-lg
        backdrop-blur-sm animate-in slide-in-from-right-5 fade-in
        ${typeStyles[type]}
      `}
      role="alert"
    >
      <IconComponent className={`flex-shrink-0 w-5 h-5 mt-0.5 ${iconStyles[type]}`} />
      <div className="flex-1">
        <p className={`text-sm font-medium ${textStyles[type]}`}>{message}</p>
      </div>
      <button
        onClick={() => onClose(id)}
        className={`flex-shrink-0 p-0.5 rounded hover:bg-black/10 transition ${iconStyles[type]}`}
        aria-label="Dismiss"
      >
        <X size={16} />
      </button>
    </div>
  );
};

export default Toast;

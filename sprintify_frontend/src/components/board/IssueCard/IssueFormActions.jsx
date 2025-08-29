import React from "react";
import { Check, X } from "lucide-react";

// Component for form action buttons following SRP
const IssueFormActions = ({
  onSubmit,
  onCancel,
  isValid = true,
  isLoading = false,
  submitText = "Add Issue",
}) => (
  <div className="flex items-center mt-4 space-x-3">
    <SubmitButton
      onSubmit={onSubmit}
      isValid={isValid}
      isLoading={isLoading}
      submitText={submitText}
    />
    <CancelButton onCancel={onCancel} isLoading={isLoading} />
  </div>
);

// Submit button component
const SubmitButton = ({ onSubmit, isValid, isLoading, submitText }) => (
  <button
    type="submit"
    onClick={onSubmit}
    disabled={!isValid || isLoading}
    className={`flex items-center px-4 py-2 text-sm rounded-lg font-medium transition-all duration-200 ${
      isValid && !isLoading
        ? "bg-gradient-to-r from-primary to-primary-hover text-white hover:shadow-lg active:scale-95"
        : "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
    }`}
  >
    {isLoading ? (
      <>
        <svg
          className="animate-spin h-4 w-4 mr-2"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
        Creating...
      </>
    ) : (
      <>
        <Check size={16} className="mr-2" />
        {submitText}
      </>
    )}
  </button>
);

// Cancel button component
const CancelButton = ({ onCancel, isLoading }) => (
  <button
    type="button"
    onClick={onCancel}
    disabled={isLoading}
    className="flex items-center px-4 py-2 text-gray-600 dark:text-gray-400 text-sm hover:bg-gray-100/50 dark:hover:bg-gray-700/50 rounded-lg transition-all duration-200 backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed"
  >
    <X size={16} className="mr-2" />
    Cancel
  </button>
);

export default IssueFormActions;

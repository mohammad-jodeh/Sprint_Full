import React, { useState } from "react";
import { createStatus } from "../../../api/statuses";

const CreateStatus = ({ columnId, onStatusCreated }) => {
  const [isCreating, setIsCreating] = useState(false);
  const [name, setName] = useState("");
  const [type, setType] = useState("BACKLOG"); // Default type
  const [isLoading, setIsLoading] = useState(false);

  const statusTypes = [
    { value: "BACKLOG", label: "Backlog", color: "bg-gray-500" },
    { value: "IN_PROGRESS", label: "In Progress", color: "bg-blue-500" },
    { value: "DONE", label: "Done", color: "bg-green-500" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsLoading(true);
    try {
      const newStatus = await createStatus({
        name: name.trim(),
        type: type,
        columnId: columnId,
        order: 999, // Will be adjusted by backend
      });

      onStatusCreated(newStatus);
      setName("");
      setType("BACKLOG");
      setIsCreating(false);
    } catch (error) {
      console.error("Failed to create status:", error);
      // You could add toast notification here
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setName("");
    setType("BACKLOG");
    setIsCreating(false);
  };

  if (!isCreating) {
    return (
      <div className="mt-3">
        <button
          onClick={() => setIsCreating(true)}
          className="w-full p-3 text-left text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 border border-dashed border-gray-300/50 dark:border-gray-600/50 hover:border-blue-400/50 dark:hover:border-blue-500/50 rounded-xl transition-colors duration-200 flex items-center gap-2"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          Add status
        </button>
      </div>
    );
  }

  return (
    <div className="mt-3 p-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-xl border border-gray-200/50 dark:border-gray-700/50">
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Status name"
            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            autoFocus
            disabled={isLoading}
          />
        </div>

        <div>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            disabled={isLoading}
          >
            {statusTypes.map((statusType) => (
              <option key={statusType.value} value={statusType.value}>
                {statusType.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={!name.trim() || isLoading}
            className="flex-1 px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin h-3 w-3"
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
              "Add"
            )}
          </button>
          <button
            type="button"
            onClick={handleCancel}
            disabled={isLoading}
            className="px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateStatus;

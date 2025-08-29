import React, { useState } from "react";
import {
  Plus,
  Sparkles,
  X,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import { createBoardColumn, fetchBoardColumns } from "../../../api/boardColumns";
import { createStatus } from "../../../api/statuses";

const CreateColumn = ({
  projectId,
  onColumnCreated,
  isAnimated,
  animationDelay,
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [title, setTitle] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [statuses, setStatuses] = useState([
    { name: "", color: "#3B82F6", type: "BACKLOG" },
  ]);
  const [currentStep, setCurrentStep] = useState(1); // 1: Column details, 2: Statuses

  const statusTypes = [
    { value: "BACKLOG", label: "Backlog", color: "bg-gray-500" },
    { value: "IN_PROGRESS", label: "In Progress", color: "bg-blue-500" },
    { value: "DONE", label: "Done", color: "bg-green-500" },
  ];

  const colorOptions = [
    "#3B82F6", // Blue
    "#10B981", // Green
    "#F59E0B", // Yellow
    "#EF4444", // Red
    "#8B5CF6", // Purple
  ];  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsLoading(true);
    try {
      // Get current columns to determine the next order value
      const existingColumns = await fetchBoardColumns(projectId);
      const nextOrder =
        existingColumns.length > 0
          ? Math.max(...existingColumns.map((col) => col.order || 0)) + 1
          : 1;      // Create the column first
      const newColumn = await createBoardColumn(projectId, {
        name: title.trim(),
        order: nextOrder,
      });

      // Create statuses if any are provided
      const validStatuses = statuses.filter((status) => status.name.trim());
      const createdStatuses = [];

      if (validStatuses.length > 0) {
        for (const status of validStatuses) {
          const createdStatus = await createStatus({
            name: status.name.trim(),
            color: status.color,
            type: status.type,
            columnId: newColumn.id,
            projectId: projectId,
            order: 999,
          });
          createdStatuses.push(createdStatus);
        }
      } // Pass both column and created statuses to the callback
      onColumnCreated({ column: newColumn, statuses: createdStatuses });
      setTitle("");
      setStatuses([{ name: "", color: "#3B82F6", type: "BACKLOG" }]);
      setCurrentStep(1);
      setIsCreating(false);
    } catch (error) {
      console.error("Failed to create column:", error);
      // You could add toast notification here
    } finally {
      setIsLoading(false);
    }
  };
  const handleCancel = () => {
    setTitle("");
    setStatuses([{ name: "", color: "#3B82F6", type: "BACKLOG" }]);
    setCurrentStep(1);
    setIsCreating(false);
  };
  const addStatus = () => {
    setStatuses([...statuses, { name: "", color: "#3B82F6", type: "BACKLOG" }]);
  };

  const removeStatus = (index) => {
    if (statuses.length > 1) {
      setStatuses(statuses.filter((_, i) => i !== index));
    }
  };

  const updateStatus = (index, field, value) => {
    const newStatuses = [...statuses];
    newStatuses[index][field] = value;
    setStatuses(newStatuses);
  };
  if (!isCreating) {
    return (
      <div
        className={`w-80 flex-shrink-0 transition-all duration-700 ${
          isAnimated ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
        }`}
        style={{ transitionDelay: `${animationDelay}ms` }}
      >
        <div
          className="group cursor-pointer h-96"
          onClick={() => setIsCreating(true)}
        >
          <div className="relative h-full bg-gradient-to-br from-white/60 to-white/30 dark:from-black/40 dark:to-black/20 backdrop-blur-xl rounded-2xl border-2 border-dashed border-gray-300/50 dark:border-gray-600/30 hover:border-custom-400 dark:hover:border-custom-500 transition-all duration-500 transform hover:shadow-2xl overflow-hidden">
            {/* Animated background patterns */}
            <div className="absolute inset-0 bg-gradient-to-br from-custom-50/50 to-custom-50/50 dark:from-custom-900/20 dark:to-custom-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent dark:via-white/5 -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

            {/* Content */}
            <div className="relative z-10 h-full flex flex-col items-center justify-center space-y-6 p-8">
              <AddColumnIcon />
              <AddColumnText />
              <AddColumnHint />
            </div>

            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-custom-400/20 to-custom-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"></div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div
      className={`w-80 flex-shrink-0 transition-all duration-700 ${
        isAnimated ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
      }`}
      style={{ transitionDelay: `${animationDelay}ms` }}
    >
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg min-h-96 max-h-[580px] flex flex-col">
        <form
          onSubmit={handleSubmit}
          className="space-y-4 flex-1 overflow-hidden"
        >
          {/* Step Progress */}
          <div className="flex items-center space-x-2 mb-6">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                currentStep >= 1
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              1
            </div>

            <div
              className={`flex-1 h-2 rounded-full ${
                currentStep >= 2 ? "bg-blue-600" : "bg-gray-200"
              }`}
            ></div>

            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                currentStep >= 2
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              2
            </div>
          </div>

          {currentStep === 1 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Create New Column
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Step 1 of 2: Column details
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Column Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., In Progress, Review, Done"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  autoFocus
                  disabled={isLoading}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  disabled={!title.trim() || isLoading}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center gap-2"
                >
                  <span>Next: Add Statuses</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={isLoading}
                  className="px-4 py-2 text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4 flex-1 flex flex-col overflow-hidden">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Add Statuses
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Step 2 of 2: Define workflow states (optional)
                </p>
              </div>

              <div className="flex-1 overflow-hidden">
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {statuses.map((status, index) => (
                    <div
                      key={index}
                      className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg border border-gray-200 dark:border-gray-600"
                    >
                      <div className="space-y-3">
                        {/* Status Name */}
                        <input
                          type="text"
                          value={status.name}
                          onChange={(e) =>
                            updateStatus(index, "name", e.target.value)
                          }
                          placeholder={`Status ${index + 1} name`}
                          className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                          disabled={isLoading}
                        />

                        {/* Status Type and Color Row */}
                        <div className="flex items-center space-x-3">
                          {/* Type Selector */}
                          <div className="flex-1">
                            {" "}
                            <select
                              value={status.type}
                              onChange={(e) =>
                                updateStatus(index, "type", e.target.value)
                              }
                              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                              disabled={isLoading}
                            >
                              {statusTypes.map((type) => (
                                <option key={type.value} value={type.value}>
                                  {type.label}
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* Color Selector */}
                          <div className="flex space-x-1">
                            {colorOptions.map((color) => (
                              <button
                                key={color}
                                type="button"
                                onClick={() =>
                                  updateStatus(index, "color", color)
                                }
                                className={`w-8 h-8 rounded border-2 transition-all ${
                                  status.color === color
                                    ? "border-gray-800 dark:border-white shadow-md"
                                    : "border-gray-300 dark:border-gray-500 hover:border-gray-500"
                                }`}
                                style={{ backgroundColor: color }}
                                disabled={isLoading}
                                title={`Select color ${color}`}
                              />
                            ))}
                          </div>

                          {/* Remove Button */}
                          {statuses.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeStatus(index)}
                              className="p-1 text-gray-400 hover:text-red-500 transition-colors rounded"
                              disabled={isLoading}
                              title="Remove status"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={addStatus}
                  className="mt-3 w-full px-4 py-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-400 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all flex items-center justify-center space-x-2"
                  disabled={isLoading}
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Another Status</span>
                </button>
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  disabled={isLoading}
                  className="px-4 py-2 text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
                <button
                  type="submit"
                  disabled={!title.trim() || isLoading}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <svg
                        className="animate-spin h-4 w-4"
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
                      <CheckCircle2 className="w-4 h-4" />
                      Create Column
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

// Separated icon component for better organization
const AddColumnIcon = () => (
  <div className="relative">
    <div className="w-20 h-20 bg-gradient-to-br from-custom-500 to-custom-600 rounded-2xl flex items-center justify-center shadow-xl group-hover:shadow-2xl transition-all duration-500 transform group-hover:scale-110 group-hover:rotate-3">
      <Plus className="w-10 h-10 text-white transition-transform duration-500 group-hover:rotate-90" />
    </div>

    {/* Floating particles */}
    <div className="absolute -top-2 -right-2 w-4 h-4 bg-yellow-400 rounded-full animate-bounce opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
    <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-pink-400 rounded-full animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
    <div className="absolute top-1/2 -right-4 w-2 h-2 bg-blue-400 rounded-full animate-ping opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
  </div>
);

// Separated text component
const AddColumnText = () => (
  <div className="text-center space-y-3">
    <h3 className="text-xl font-bold bg-gradient-to-r from-gray-700 to-gray-900 dark:from-gray-200 dark:to-gray-400 bg-clip-text text-transparent group-hover:from-custom-600 group-hover:to-custom-600 dark:group-hover:from-custom-400 dark:group-hover:to-custom-400 transition-all duration-500">
      Add New Column
    </h3>
    <p className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-500 max-w-xs">
      Create a new workflow stage to organize your team's tasks
    </p>
  </div>
);

// Separated hint component
const AddColumnHint = () => (
  <div className="flex items-center space-x-2 px-4 py-2 bg-white/50 dark:bg-black/30 rounded-full border border-gray-200/50 dark:border-gray-600/30 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
    <Sparkles className="w-4 h-4 text-violet-500" />
    <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
      Click to create
    </span>
  </div>
);

export default CreateColumn;

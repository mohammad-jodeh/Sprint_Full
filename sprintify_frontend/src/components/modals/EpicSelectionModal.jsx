import React from "react";
import BaseModal from "../ui/BaseModal";
import { X, Target, Users, CheckCircle2, Clock } from "lucide-react";

export default function EpicSelectionModal({
  epics,
  issues,
  selectedEpic,
  onEpicSelect,
  onClose,
}) {
  // Calculate epic statistics
  const getEpicStats = (epic) => {
    const epicIssues = issues.filter((issue) => issue.epicId === epic.id);
    const completed = epicIssues.filter((issue) =>
      issue.status?.name?.toLowerCase().includes("done")
    ).length;
    const total = epicIssues.length;
    const progress = total > 0 ? Math.round((completed / total) * 100) : 0;
    const totalPoints = epicIssues.reduce(
      (sum, issue) => sum + (issue.storyPoints || issue.storyPoint || 0),
      0
    );

    return { total, completed, progress, totalPoints };
  };

  const getProgressColor = (progress) => {
    if (progress >= 75) return "bg-green-500";
    if (progress >= 50) return "bg-blue-500";
    if (progress >= 25) return "bg-yellow-500";
    return "bg-gray-400";
  };

  return (
    <BaseModal onClose={onClose}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Target size={20} className="text-indigo-600" />
          Select Epic
        </h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-800 dark:hover:text-white p-1 rounded transition-colors"
        >
          <X size={18} />
        </button>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {/* All Issues Option */}
        <div
          onClick={() => onEpicSelect(null)}
          className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
            selectedEpic === null
              ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20"
              : "border-gray-200 dark:border-gray-700 hover:border-indigo-300 hover:bg-gray-50 dark:hover:bg-gray-700"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                <span className="text-lg">📋</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  All Issues
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Show all issues regardless of epic
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {issues.length} issues
              </div>
            </div>
          </div>
        </div>

        {/* Issues without Epic */}
        <div
          onClick={() => onEpicSelect("no-epic")}
          className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
            selectedEpic === "no-epic"
              ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20"
              : "border-gray-200 dark:border-gray-700 hover:border-indigo-300 hover:bg-gray-50 dark:hover:bg-gray-700"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                <span className="text-lg">🔍</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Issues without Epic
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Show issues not assigned to any epic
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {issues.filter((issue) => !issue.epicId).length} issues
              </div>
            </div>
          </div>
        </div>

        {/* Epic Options */}
        {epics.map((epic) => {
          const stats = getEpicStats(epic);
          return (
            <div
              key={epic.id}
              onClick={() => onEpicSelect(epic.id)}
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                selectedEpic === epic.id
                  ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20"
                  : "border-gray-200 dark:border-gray-700 hover:border-indigo-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <Target size={18} className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {epic.title || epic.name}
                    </h3>
                    {epic.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1">
                        {epic.description}
                      </p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {stats.total} issues
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {stats.totalPoints} points
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                      <CheckCircle2 size={12} />
                      {stats.completed}/{stats.total} completed
                    </span>
                  </div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    {stats.progress}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${getProgressColor(
                      stats.progress
                    )}`}
                    style={{ width: `${stats.progress}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}

        {epics.length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <Target size={48} className="mx-auto mb-3 opacity-50" />
            <p className="text-lg font-medium">No Epics Found</p>
            <p className="text-sm">Create an epic to organize your issues</p>
          </div>
        )}
      </div>
    </BaseModal>
  );
}

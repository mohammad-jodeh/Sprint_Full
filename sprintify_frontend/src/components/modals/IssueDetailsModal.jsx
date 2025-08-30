
import React, { useState, useEffect } from "react";
import BaseModal from "../ui/BaseModal";
import EditIssueModal from "./EditIssueModal";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import { X, FileText, Trash2, Edit3, User2 } from "lucide-react";
import { fetchEpics } from "../../api/epics";
import toast from "react-hot-toast";
import { useProjectRole } from "../../hooks/useProjectRole";
import { can, PERMISSIONS } from "../../utils/permission";
import { getPriorityConfig } from "../../utils/priorityUtils";

export default function IssueDetailsModal({
  issue,
  onClose,
  onDelete,
  onUpdate,
  isPreviewMode = false,
  previewModeConfig = {},
  projectMembers = [],
  sprints = [],
  projectId = null,
  epics: providedEpics = [],
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [epics, setEpics] = useState([]);
  const [loading, setLoading] = useState(false);  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const { projectRole } = useProjectRole();
  const canUpdateTask = can(projectRole, PERMISSIONS.UPDATE_TASK);
  const canDeleteTask = can(projectRole, PERMISSIONS.DELETE_TASK);

  useEffect(() => {
    // Fetch project-specific epics for the edit modal (only if not provided)
    if (projectId && !providedEpics?.length) {
      fetchEpics(projectId)
        .then((epicsData) => setEpics(epicsData))
        .catch(() => toast.error("Failed to fetch epics"));
    } else if (providedEpics?.length) {
      setEpics(providedEpics);
    }
  }, [projectId, providedEpics]);

  if (!issue) return null;
  const handleDelete = async () => {
    setLoading(true);
    try {
      // Handle AI-generated issues differently
      if (isPreviewMode || issue.isAIGenerated) {
        // For AI-generated issues, just call onDelete without API call
        onDelete && onDelete(issue.id);
        onClose();
        return;
      }

      // For real issues, make API call
      await api.delete(`/issues/${issue.id}`);
      toast.success("Issue deleted successfully!");
      onDelete && onDelete(issue.id);
      onClose();
    } catch (error) {
      console.error("Failed to delete issue:", error);
      toast.error("Failed to delete issue");
    } finally {
      setLoading(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleSaveEdit = (updatedIssue) => {
    onUpdate && onUpdate(updatedIssue);
    setIsEditing(false);
  };

  // Helper functions to match Backlog theme
  const getStatusColor = (status) => {
    const name = (status?.name || "").toLowerCase();
    if (name.includes("done")) return "bg-green-500";
    if (name.includes("progress")) return "bg-blue-500";
    if (name.includes("backlog")) return "bg-yellow-500";
    return "bg-gray-400";
  };

  const getTypeIcon = (type) => {
    switch (type?.toLowerCase()) {
      case "bug":
        return "🐞";
      case "story":
        return "📘";
      case "task":
        return "📝";
      default:
        return "📝";
    }
  };
  // If editing, show the EditIssueModal
  if (isEditing) {
    return (
      <EditIssueModal
        issue={issue}
        epics={epics}
        projectMembers={isPreviewMode ? projectMembers : undefined}
        sprints={isPreviewMode ? sprints : undefined}
        isPreviewMode={isPreviewMode}
        onClose={() => setIsEditing(false)}
        onSave={handleSaveEdit}
      />
    );
  }

  return (
    <>
      <BaseModal onClose={onClose}>
        <div className="flex items-center justify-between mb-6">
          {" "}
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-lg ${
                isPreviewMode
                  ? "bg-gradient-to-br from-purple-500 to-blue-600"
                  : "bg-gradient-to-br from-blue-500 to-indigo-600"
              }`}
            >
              <FileText size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {isPreviewMode
                  ? previewModeConfig.title || "Issue Preview"
                  : "Issue Details"}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {isPreviewMode
                  ? previewModeConfig.subtitle ||
                    "Preview of AI-generated issue"
                  : "View and manage issue information"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        {/* Issue Header */}
        <div className="flex items-start gap-3 mb-4">
          <span className="text-xl mt-1">{getTypeIcon(issue.type)}</span>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
              {issue.key || `#${issue.id}`}: {issue.title}
            </h3>
            {issue.description && (
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                {issue.description}
              </p>
            )}
          </div>
        </div>{" "}
        {/* Issue Info Grid */}
        <div className="space-y-4">
          {/* Type */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Type:
            </span>
            <span className="inline-flex items-center gap-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 px-2 py-1 rounded-lg text-xs font-medium">
              {getTypeIcon(issue.type)} {issue.type || "Task"}
            </span>
          </div>
          {/* Status */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Status:
            </span>
            <span
              className={`px-2 py-1 rounded-lg text-white text-xs font-medium ${getStatusColor(
                issue.status
              )}`}
            >
              {issue.status?.name || issue.status || "To Do"}
            </span>
          </div>{" "}
          {/* Story Points */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Story Points:
            </span>
            <span className="inline-flex items-center px-2 py-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg text-xs font-bold">
              {issue.storyPoints || issue.storyPoint || 0} pts
            </span>
          </div>
          {/* Priority */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Priority:
            </span>
            <span
              className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium border ${
                getPriorityConfig(issue.issuePriority || issue.priority || "MEDIUM").color
              }`}
            >
              {getPriorityConfig(issue.issuePriority || issue.priority || "MEDIUM").icon}{" "}
              {getPriorityConfig(issue.issuePriority || issue.priority || "MEDIUM").label}
            </span>
          </div>
          {/* Assignee */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Assignee:
            </span>
            {issue.assigneeUser?.fullName ? (
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center justify-center w-6 h-6 bg-gradient-to-r from-blue-400 to-purple-500 text-white rounded-full text-xs font-medium">
                  {issue.assigneeUser.fullName.charAt(0).toUpperCase()}
                </span>
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {issue.assigneeUser.fullName}
                </span>
              </div>
            ) : (
              <span className="inline-flex items-center gap-1 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 px-2 py-1 rounded-lg text-xs font-medium">
                👤 Unassigned
              </span>
            )}
          </div>
          {/* Epic */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Epic:
            </span>
            {issue.epic?.name ? (
              <span className="inline-flex items-center gap-1 bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 text-indigo-700 dark:text-indigo-300 px-2 py-1 rounded-lg text-xs font-medium">
                🔖 {issue.epic.title || issue.epic.name}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 px-2 py-1 rounded-lg text-xs font-medium">
                — No Epic
              </span>
            )}
          </div>
        </div>
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-8 flex justify-between">
          {" "}
          <div>
            {canUpdateTask && (
              <button
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Edit3 className="w-4 h-4 mr-2" />
                {isPreviewMode ? "Edit Suggestion" : "Edit"}
              </button>
            )}
            {isPreviewMode && !canUpdateTask && (
              <button
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center px-3 py-2 border border-purple-300 dark:border-purple-600 shadow-sm text-sm leading-4 font-medium rounded-md text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/40 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                <Edit3 className="w-4 h-4 mr-2" />
                Edit Suggestion
              </button>
            )}
            {!isPreviewMode && !canUpdateTask && (
              <div className="text-sm text-gray-500 dark:text-gray-400 italic">
                You don't have permission to edit this issue
              </div>
            )}
          </div>
          <div className="flex space-x-2">
            {(isPreviewMode || canDeleteTask) && (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                disabled={loading}
                className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 ${
                  isPreviewMode
                    ? "bg-orange-600 hover:bg-orange-700 focus:ring-orange-500"
                    : "bg-red-600 hover:bg-red-700 focus:ring-red-500"
                }`}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                {isPreviewMode
                  ? previewModeConfig.customDeleteLabel || "Remove"
                  : "Delete"}
              </button>
            )}
            {!isPreviewMode && !canDeleteTask && (
              <div className="text-sm text-gray-500 dark:text-gray-400 italic">
                You don't have permission to delete this issue
              </div>
            )}
          </div>
        </div>
      </BaseModal>
      {/* Delete Confirmation Modal */}{" "}
      {showDeleteConfirm && (
        <ConfirmDeleteModal
          name={issue.title || `Issue #${issue.id}`}
          type={isPreviewMode ? "suggestion" : "issue"}
          customMessage={
            isPreviewMode ? previewModeConfig.customDeleteMessage : undefined
          }
          onClose={() => setShowDeleteConfirm(false)}
          onConfirm={handleDelete}
        />
      )}
    </>
  );
}

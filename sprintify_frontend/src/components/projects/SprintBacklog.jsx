import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  Pencil,
  Trash2,
  Users,
  Calendar,
  Target,
  ArrowLeft,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { fetchSprintIssues } from "../../api/sprints";
import { createIssue, updateIssue, deleteIssue } from "../../api/issues";
import CreateIssueModal from "../modals/CreateIssueModal";
import EditIssueModal from "../modals/EditIssueModal";
import IssueDetailsModal from "../modals/IssueDetailsModal";
import ConfirmDeleteModal from "../modals/ConfirmDeleteModal";
import { useProjectRole } from "../../hooks/useProjectRole";
import { can, PERMISSIONS } from "../../utils/permission";

const SprintBacklog = ({ sprint, onBack }) => {
  const { projectId } = useParams();
  const { projectRole } = useProjectRole();
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingIssue, setEditingIssue] = useState(null);
  const [viewingIssue, setViewingIssue] = useState(null);
  const [deleteIssue, setDeleteIssue] = useState(null);

  // Check permissions
  const canCreateIssue = can(projectRole, PERMISSIONS.CREATE_ISSUE);
  const canUpdateIssue = can(projectRole, PERMISSIONS.UPDATE_ISSUE);
  const canDeleteIssue = can(projectRole, PERMISSIONS.DELETE_ISSUE);

  useEffect(() => {
    loadIssues();
  }, [sprint.id]);

  const loadIssues = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchSprintIssues(projectId, sprint.id);
      const issuesList = Array.isArray(data) ? data : data?.issues || [];
      setIssues(issuesList);
    } catch (err) {
      console.error("Failed to load sprint issues:", err);
      setError(err.message);
      setIssues([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateIssue = async (issueData) => {
    try {
      const newIssue = await createIssue(projectId, {
        ...issueData,
        sprintId: sprint.id,
      });
      const createdIssue = newIssue.data || newIssue;
      setIssues((prev) => [...prev, createdIssue]);
      setShowCreateModal(false);
    } catch (err) {
      console.error("Failed to create issue:", err);
      setError(err.message);
    }
  };

  const handleUpdateIssue = async (issueId, updateData) => {
    try {
      const updatedIssue = await updateIssue(projectId, issueId, updateData);
      const issueData = updatedIssue.data || updatedIssue;
      setIssues((prev) =>
        prev.map((issue) => (issue.id === issueId ? issueData : issue))
      );
      setEditingIssue(null);
    } catch (err) {
      console.error("Failed to update issue:", err);
      setError(err.message);
    }
  };

  const handleDeleteIssue = async (issueId) => {
    try {
      await deleteIssue(projectId, issueId);
      setIssues((prev) => prev.filter((issue) => issue.id !== issueId));
      setDeleteIssue(null);
    } catch (err) {
      console.error("Failed to delete issue:", err);
      setError(err.message);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      "To Do": "bg-gray-100 text-gray-800",
      "In Progress": "bg-blue-100 text-blue-800",
      "Done": "bg-green-100 text-green-800",
      "Ready for Review": "bg-yellow-100 text-yellow-800",
    };
    return colors[status?.name] || "bg-gray-100 text-gray-800";
  };

  const getPriorityColor = (priority) => {
    const colors = {
      LOW: "text-green-600",
      MEDIUM: "text-yellow-600",
      HIGH: "text-red-600",
    };
    return colors[priority] || "text-gray-600";
  };

  const getTypeIcon = (type) => {
    const icons = {
      Task: "📝",
      Bug: "🐞",
      Story: "📘",
      // Keep old values for backward compatibility
      TASK: "📝",
      BUG: "🐞",
      STORY: "📘",
    };
    return icons[type] || "📝";
  };

  const filteredIssues = issues.filter((issue) => {
    const matchesSearch = issue.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterStatus === "all" || issue.status?.name === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const totalStoryPoints = issues.reduce(
    (sum, issue) => sum + (issue.storyPoints || issue.storyPoint || 0),
    0
  );

  const completedStoryPoints = issues
    .filter((issue) => issue.status?.name === "Done")
    .reduce((sum, issue) => sum + (issue.storyPoints || issue.storyPoint || 0), 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {sprint.name} - Backlog
            </h1>
            <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mt-1">
              <div className="flex items-center space-x-1">
                <Calendar size={16} />
                <span>
                  {new Date(sprint.startDate).toLocaleDateString()} -{" "}
                  {new Date(sprint.endDate).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <Target size={16} />
                <span>
                  {completedStoryPoints} / {totalStoryPoints} Story Points
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <Users size={16} />
                <span>{issues.length} Issues</span>
              </div>
            </div>
          </div>
        </div>

        {canCreateIssue && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center space-x-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Plus size={20} />
            <span>Add Issue</span>
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-700 dark:text-red-300">{error}</p>
        </div>
      )}

      {/* Filters */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search
            size={20}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search issues..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
        >
          <option value="all">All Statuses</option>
          <option value="To Do">To Do</option>
          <option value="In Progress">In Progress</option>
          <option value="Ready for Review">Ready for Review</option>
          <option value="Done">Done</option>
        </select>
      </div>

      {/* Issues List */}
      <div className="space-y-3">
        <AnimatePresence>
          {filteredIssues.map((issue) => (
            <motion.div
              key={issue.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="text-lg">{getTypeIcon(issue.type)}</span>
                    <span className="text-sm font-mono text-gray-500 dark:text-gray-400">
                      {issue.key}
                    </span>
                    <h3
                      className="font-medium text-gray-900 dark:text-white hover:text-primary cursor-pointer"
                      onClick={() => setViewingIssue(issue)}
                    >
                      {issue.title}
                    </h3>
                  </div>

                  <div className="flex items-center space-x-4 text-sm">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        issue.status
                      )}`}
                    >
                      {issue.status?.name || "No Status"}
                    </span>

                    <span className={`font-medium ${getPriorityColor(issue.issuePriority || issue.priority)}`}>
                      {issue.issuePriority || issue.priority || "MEDIUM"}
                    </span>

                    <span className="text-gray-500 dark:text-gray-400">
                      {issue.storyPoints || issue.storyPoint || 0} SP
                    </span>

                    {issue.assigneeUser && (
                      <div className="flex items-center space-x-1">
                        <Users size={14} />
                        <span className="text-gray-600 dark:text-gray-300">
                          {issue.assigneeUser.firstName} {issue.assigneeUser.lastName}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {(canUpdateIssue || canDeleteIssue) && (
                    <div className="relative group">
                      <button className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
                        <MoreVertical size={16} />
                      </button>
                      <div className="absolute right-0 top-8 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                        {canUpdateIssue && (
                          <button
                            onClick={() => setEditingIssue(issue)}
                            className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
                          >
                            <Pencil size={14} />
                            <span>Edit</span>
                          </button>
                        )}
                        {canDeleteIssue && (
                          <button
                            onClick={() => setDeleteIssue(issue)}
                            className="flex items-center space-x-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 w-full text-left"
                          >
                            <Trash2 size={14} />
                            <span>Delete</span>
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {!loading && filteredIssues.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 dark:text-gray-500 text-lg mb-2">
              No issues found
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              {issues.length === 0
                ? "No issues have been added to this sprint yet."
                : "No issues match your current filters."}
            </p>
          </div>
        )}
      </div>

      {/* Modals */}
      {showCreateModal && (
        <CreateIssueModal
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateIssue}
          defaultSprintId={sprint.id}
        />
      )}

      {editingIssue && (
        <EditIssueModal
          issue={editingIssue}
          onClose={() => setEditingIssue(null)}
          onSave={(updatedIssue) => handleUpdateIssue(editingIssue.id, updatedIssue)}
        />
      )}

      {viewingIssue && (
        <IssueDetailsModal
          issue={viewingIssue}
          onClose={() => setViewingIssue(null)}
          onUpdate={loadIssues}
        />
      )}

      {deleteIssue && (
        <ConfirmDeleteModal
          name={deleteIssue.title}
          type="issue"
          onClose={() => setDeleteIssue(null)}
          onConfirm={() => handleDeleteIssue(deleteIssue.id)}
        />
      )}
    </div>
  );
};

export default SprintBacklog;

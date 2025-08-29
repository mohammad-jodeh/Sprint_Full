import { useEffect, useState } from "react";
import { X, Save } from "lucide-react";
import toast from "react-hot-toast";
import BaseModal from "../ui/BaseModal";
import { useParams } from "react-router-dom";
import { getProjectMembers } from "../../api/projectMembers";
import { fetchBoardColumns } from "../../api/boardColumns";
import { fetchStatuses } from "../../api/statuses";
import { fetchEpics } from "../../api/epics";
import { fetchSprints } from "../../api/sprints";
import api from "../../api/config";

const priorityOptions = [
  {
    label: "Low",
    value: "LOW",
    color: "text-green-600 bg-green-50 border-green-200",
    icon: "⬇️",
  },
  {
    label: "Medium",
    value: "MEDIUM",
    color: "text-yellow-600 bg-yellow-50 border-yellow-200",
    icon: "➡️",
  },
  {
    label: "High",
    value: "HIGH",
    color: "text-red-600 bg-red-50 border-red-200",
    icon: "⬆️",
  },
];

export default function EditIssueModal({
  issue,
  onClose,
  onSave,
  projectMembers = null,
  sprints = null,
  epics: providedEpics = null,
  isPreviewMode = false,
}) {
  const { projectId } = useParams();
  const [form, setForm] = useState({
    title: "",
    description: "",
    storyPoints: 0,
    type: "Task",
    priority: "MEDIUM",
    statusId: "", // Changed from 'status' to 'statusId' to match CreateIssueModal
    assigneeId: "",
    epicId: "",
    sprintId: "",
  });
  const [users, setUsers] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [epics, setEpics] = useState([]);
  const [projectSprints, setProjectSprints] = useState([]);
  const [saving, setSaving] = useState(false);
  useEffect(() => {
    if (issue) {
      // Helper to resolve status ID from various formats
      const resolveStatusId = () => {
        if (issue.statusId) return String(issue.statusId);
        if (issue.status?.id) return String(issue.status.id);
        if (typeof issue.status === "string") {
          // For AI-generated issues with status names, we'll resolve later when statuses are loaded
          return issue.status;
        }
        return "";
      };

      setForm({
        title: issue.title || "",
        description: issue.description || "",
        storyPoints: issue.storyPoint || issue.storyPoints || 0,
        type: issue.type || "Task",
        priority: issue.priority || "MEDIUM",
        statusId: resolveStatusId(),
        assigneeId: String(issue.assigneeUser?.id || issue.assignee || ""),
        epicId: String(issue.epic?.id || issue.epicId || ""),
        sprintId: String(issue.sprint?.id || issue.sprintId || ""),
      });
    }
  }, [issue]);  useEffect(() => {
    const fetchData = async () => {
      try {
        // Use provided data if available (for AI-generated issues)
        if (projectMembers) {
          // Handle project members if passed as props
          const memberships = projectMembers.memberships || projectMembers.data?.memberships || projectMembers;
          const users = memberships
            .map((membership) => membership.user)
            .filter((user) => user && user.id);
          setUsers(users);
        } else {
          const members = await getProjectMembers(projectId);
          // Handle the correct response structure: { memberships: [...], success: true }
          const memberships = members.memberships || members.data?.memberships || members;
          const users = memberships
            .map((membership) => membership.user)
            .filter((user) => user && user.id);
          setUsers(users);
        }

        if (providedEpics) {
          setEpics(providedEpics);
        } else {
          const epicsData = await fetchEpics(projectId);
          const epicsArray = Array.isArray(epicsData) ? epicsData : 
                            epicsData?.data ? epicsData.data : 
                            epicsData?.epics ? epicsData.epics : [];
          setEpics(epicsArray);
        }

        if (sprints) {
          setProjectSprints(sprints);
        } else {
          const sprintsData = await fetchSprints(projectId);
          const sprintsArray = Array.isArray(sprintsData) ? sprintsData : 
                              sprintsData?.data ? sprintsData.data : 
                              sprintsData?.sprints ? sprintsData.sprints : [];
          setProjectSprints(sprintsArray);
        }

        // Always fetch statuses as they're needed for the form
        const columns = await fetchBoardColumns(projectId);
        const columnIds = columns.map((col) => col.id);
        const allStatuses = await fetchStatuses({ projectId });
        setStatuses(allStatuses.filter((s) => columnIds.includes(s.columnId)));
      } catch (error) {
        console.error("Failed to load project data:", error);
        toast.error("Failed to load project data");
      }
    };
    if (projectId || isPreviewMode) fetchData();
  }, [projectId, projectMembers, providedEpics, isPreviewMode]);

  // Resolve status name to ID when statuses are loaded (for AI-generated issues)
  useEffect(() => {
    if (statuses.length > 0 && issue && typeof form.statusId === "string") {
      // If statusId is a status name instead of ID, resolve it
      const statusByName = statuses.find(
        (s) => s.name.toLowerCase() === form.statusId.toLowerCase()
      );
      if (statusByName) {
        setForm((prev) => ({ ...prev, statusId: statusByName.id }));
      }
    }
  }, [statuses, issue, form.statusId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (isPreviewMode || issue.isAIGenerated) {
        // For AI-generated issues, just update the data locally
        const selectedStatus = statuses.find((s) => s.id === form.statusId); // Use statusId as string (not parseInt)
        const updatedIssue = {
          ...issue,
          ...form,
          storyPoints: form.storyPoints, // Keep consistent naming
          storyPoint: form.storyPoints, // Transform back to AI format
          statusId: form.statusId || null, // Use statusId directly as string
          status: selectedStatus?.name || form.status, // Use status name for display
          assigneeUser: users.find((u) => u.id === form.assigneeId) || null,
          assignee: form.assigneeId || null, // Keep assignee ID for AI format
          epic: epics.find((e) => e.id === form.epicId)?.name || form.epic, // Use epic name for AI format
          epicId: form.epicId || null,
          sprint:
            projectSprints.find((s) => s.id === form.sprintId)?.name ||
            form.sprint, // Use sprint name for AI format
          sprintId: form.sprintId || null,
        };

        toast.success("Issue suggestion updated");
        if (onSave) {
          onSave(updatedIssue);
        }
        onClose();
        return;
      } // For real issues, make API call
      const payload = {
        ...form,
        assignee: form.assigneeId || null, // Convert assigneeId to assignee for database
        epicId: form.epicId || null, // Ensure epicId is included
        sprintId: form.sprintId || null, // Include sprintId
      };
      // Remove assigneeId from payload since we're using assignee
      delete payload.assigneeId;
      const res = await api.patch(`/issues/${issue.id}`, payload);
      toast.success("Issue updated");
      if (onSave) {
        const epic = epics.find((e) => e.id === form.epicId);
        onSave({ ...res.data, epic }); // Pass epic data to parent
      }
      onClose();
    } catch (err) {
      console.error("Failed to update issue", err);
      toast.error("Failed to save changes");
    } finally {
      setSaving(false);
    }
  };
  return (
    <BaseModal onClose={onClose}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
            <Save size={20} className="text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Edit Issue
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Update issue information
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

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-800 dark:text-gray-300 mb-1">
            Title
          </label>
          <input
            name="title"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            className="w-full px-3 py-2 text-sm rounded-lg border bg-white text-gray-800 dark:bg-gray-800 dark:text-white border-gray-300 dark:border-gray-600"
            required
          />
        </div>
        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-800 dark:text-gray-300 mb-1">
            Description
          </label>
          <textarea
            value={form.description}
            onChange={(e) =>
              setForm((f) => ({ ...f, description: e.target.value }))
            }
            rows={3}
            className="w-full px-3 py-2 text-sm rounded-lg border bg-white text-gray-800 dark:bg-gray-800 dark:text-white border-gray-300 dark:border-gray-600 resize-none"
          />
        </div>{" "}
        {/* Story Points, Type, and Priority */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-800 dark:text-gray-300 mb-1">
              Story Points
            </label>{" "}
            <input
              type="number"
              min="0"
              value={form.storyPoints}
              onChange={(e) => {
                const value = Math.max(0, +e.target.value);
                setForm((prev) => ({
                  ...prev,
                  storyPoints: value,
                }));
              }}
              className="w-full px-3 py-2 text-sm rounded-lg border bg-white text-gray-800 dark:bg-gray-800 dark:text-white border-gray-300 dark:border-gray-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-800 dark:text-gray-300 mb-1">
              Type
            </label>
            <select
              name="type"
              value={form.type}
              onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
              className="w-full px-3 py-2 text-sm rounded-lg border bg-white text-gray-800 dark:bg-gray-800 dark:text-white border-gray-300 dark:border-gray-600"
            >
              <option value="Task">Task</option>
              <option value="Bug">Bug</option>
              <option value="Story">Story</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-800 dark:text-gray-300 mb-1">
              Priority
            </label>
            <select
              name="priority"
              value={form.priority}
              onChange={(e) =>
                setForm((f) => ({ ...f, priority: e.target.value }))
              }
              className="w-full px-3 py-2 text-sm rounded-lg border bg-white text-gray-800 dark:bg-gray-800 dark:text-white border-gray-300 dark:border-gray-600"
            >
              {priorityOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.icon} {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        {/* Status + Assignee */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-800 dark:text-gray-300 mb-1">
              Status
            </label>{" "}
            <select
              name="statusId"
              value={form.statusId}
              onChange={(e) =>
                setForm((f) => ({ ...f, statusId: e.target.value }))
              }
              className="w-full px-3 py-2 text-sm rounded-lg border bg-white text-gray-800 dark:bg-gray-800 dark:text-white border-gray-300 dark:border-gray-600"
            >
              <option value="">Select status</option>
              {statuses.map((status) => (
                <option key={status.id} value={status.id}>
                  {status.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-800 dark:text-gray-300 mb-1">
              Assignee
            </label>
            <select
              name="assigneeId"
              value={form.assigneeId}
              onChange={(e) =>
                setForm((f) => ({ ...f, assigneeId: e.target.value }))
              }
              className="w-full px-3 py-2 text-sm rounded-lg border bg-white text-gray-800 dark:bg-gray-800 dark:text-white border-gray-300 dark:border-gray-600"
            >
              <option value="">Unassigned</option>{" "}
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.fullName ||
                    user.name ||
                    user.email ||
                    `User ${user.id}`}
                </option>
              ))}
            </select>
          </div>
        </div>
        {/* Epic */}
        <div>
          <label className="block text-sm font-medium text-gray-800 dark:text-gray-300 mb-1">
            Epic
          </label>
          <select
            name="epicId"
            value={form.epicId}
            onChange={(e) => setForm((f) => ({ ...f, epicId: e.target.value }))}
            className="w-full px-3 py-2 text-sm rounded-lg border bg-white text-gray-800 dark:bg-gray-800 dark:text-white border-gray-300 dark:border-gray-600"
          >
            <option value="">No Epic</option>
            {epics.map((epic) => (
              <option key={epic.id} value={epic.id}>
                {epic.title || epic.name}
              </option>
            ))}{" "}
          </select>
        </div>
        {/* Sprint */}
        <div>
          <label className="block text-sm font-medium text-gray-800 dark:text-gray-300 mb-1">
            Sprint
          </label>
          <select
            name="sprintId"
            value={form.sprintId}
            onChange={(e) =>
              setForm((f) => ({ ...f, sprintId: e.target.value }))
            }
            className="w-full px-3 py-2 text-sm rounded-lg border bg-white text-gray-800 dark:bg-gray-800 dark:text-white border-gray-300 dark:border-gray-600"
          >
            <option value="">No Sprint</option>{" "}
            {projectSprints
              .filter((sprint) => {
                // Check if sprint is active by status or isActive flag
                if (sprint.status === "active" || sprint.isActive) return true;

                // Check if sprint is active by date range and not archived
                if (!sprint.archived && sprint.startDate && sprint.endDate) {
                  const now = new Date();
                  const startDate = new Date(sprint.startDate);
                  const endDate = new Date(sprint.endDate);
                  return startDate <= now && endDate >= now;
                }

                return false;
              })
              .map((sprint) => {
                const isActiveByStatus =
                  sprint.status === "active" || sprint.isActive;
                const isActiveByDate =
                  !sprint.archived &&
                  sprint.startDate &&
                  sprint.endDate &&
                  new Date(sprint.startDate) <= new Date() &&
                  new Date(sprint.endDate) >= new Date();

                return (
                  <option key={sprint.id} value={sprint.id}>
                    {sprint.name}{" "}
                    {isActiveByStatus || isActiveByDate ? "(Active)" : ""}
                  </option>
                );
              })}
          </select>
        </div>
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-8 flex justify-end gap-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition flex items-center gap-2"
          >
            <Save size={16} />
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </BaseModal>
  );
}

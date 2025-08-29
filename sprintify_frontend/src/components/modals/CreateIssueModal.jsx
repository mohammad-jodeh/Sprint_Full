import { useEffect, useState } from "react";
import { X, Plus } from "lucide-react";
import toast from "react-hot-toast";
import BaseModal from "../ui/BaseModal";
import { createIssue } from "../../api/issues";
import { useParams } from "react-router-dom";
import { getProjectMembers } from "../../api/projectMembers";
import { fetchBoardColumns } from "../../api/boardColumns";
import { fetchStatuses } from "../../api/statuses";
import { fetchEpics } from "../../api/epics";

const typeOptions = [
  { label: "TASK", icon: "📝", value: "TASK" },
  { label: "BUG", icon: "🐞", value: "BUG" },
  { label: "STORY", icon: "📘", value: "STORY" },
];

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

export default function CreateIssueModal({ onClose, onCreate, defaultSprintId }) {
  const { projectId } = useParams();  const [form, setForm] = useState({
    title: "",
    description: "",
    storyPoint: 0,
    type: "TASK",
    issuePriority: "MEDIUM",
    statusId: "",
    assignee: "",
    epicId: "",
    sprintId: defaultSprintId || "",
  });
  const [users, setUsers] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [epics, setEpics] = useState([]);
  const [saving, setSaving] = useState(false);  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch project members
        const members = await getProjectMembers(projectId);
        // Handle the correct response structure: { memberships: [...], success: true }
        const memberships = members.memberships || members.data?.memberships || members;
        const users = memberships
          .map((membership) => membership.user)
          .filter((user) => user && user.id);
        setUsers(users);

        // Fetch columns and statuses for this project
        const columns = await fetchBoardColumns(projectId);
        const columnIds = columns.map((col) => col.id);
        const allStatuses = await fetchStatuses({ projectId });
        setStatuses(allStatuses.filter((s) => columnIds.includes(s.columnId)));

        // Fetch epics for this project
        const epicsData = await fetchEpics(projectId);
        const epicsArray = Array.isArray(epicsData) ? epicsData : 
                          epicsData?.data ? epicsData.data : 
                          epicsData?.epics ? epicsData.epics : [];
        setEpics(epicsArray);
      } catch (error) {
        console.error("Failed to load project data:", error);
        toast.error("Failed to load project data");
      }
    };
    fetchData();
  }, [projectId]);const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return toast.error("Title is required");

    setSaving(true);
    try {
      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        storyPoint: form.storyPoint,
        type: form.type,
        issuePriority: form.issuePriority,
        statusId: form.statusId || null,
        assignee: form.assignee || null,
        epicId: form.epicId || null,
        sprintId: form.sprintId || null,
      };

      const res = await createIssue(projectId, payload);
      toast.success("Issue created successfully!");
      if (onCreate) {
        const epic = epics.find((e) => e.id === form.epicId);
        onCreate({ ...res, epic }); // Pass epic data to parent
      }
      onClose();
    } catch (error) {
      console.error("Failed to create issue:", error);
      // Provide better error messages based on the type of error
      let errorMessage = "Failed to create issue";
      
      if (error.response?.status === 500) {
        errorMessage = "Server error occurred. Please try again or contact support.";
      } else if (error.response?.status === 404) {
        errorMessage = "Project or required resources not found. Please refresh and try again.";
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
    } finally {
      setSaving(false);
    }
  };
  return (
    <BaseModal onClose={onClose}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
            <Plus size={20} className="text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Create Issue
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Add a new issue to your project
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
            Title <span className="text-red-500">*</span>
          </label>
          <input
            name="title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
            className="w-full px-3 py-2 text-sm rounded-lg border bg-white text-gray-800 dark:bg-gray-800 dark:text-white border-gray-300 dark:border-gray-600"
          />
        </div>
        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-800 dark:text-gray-300 mb-1">
            Description
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={3}
            className="w-full px-3 py-2 text-sm rounded-lg border bg-white text-gray-800 dark:bg-gray-800 dark:text-white border-gray-300 dark:border-gray-600 resize-none"
          />
        </div>{" "}
        {/* Story Points, Type, and Priority */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-800 dark:text-gray-300 mb-1">
              Story Points
            </label>{" "}            <input
              type="number"
              min="0"
              value={form.storyPoint}
              onChange={(e) => {
                const value = Math.max(0, +e.target.value);
                setForm((prev) => ({
                  ...prev,
                  storyPoint: value,
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
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              className="w-full px-3 py-2 text-sm rounded-lg border bg-white text-gray-800 dark:bg-gray-800 dark:text-white border-gray-300 dark:border-gray-600"
            >
              {typeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-800 dark:text-gray-300 mb-1">
              Priority
            </label>            <select
              name="issuePriority"
              value={form.issuePriority}
              onChange={(e) => setForm({ ...form, issuePriority: e.target.value })}
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
        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-800 dark:text-gray-300 mb-1">
            Status <span className="text-red-500">*</span>
          </label>
          <select
            name="statusId"
            value={form.statusId}
            onChange={(e) => setForm({ ...form, statusId: e.target.value })}
            required
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
        {/* Assignee */}
        <div>
          <label className="block text-sm font-medium text-gray-800 dark:text-gray-300 mb-1">
            Assignee
          </label>          <select
            name="assignee"
            value={form.assignee}
            onChange={(e) => setForm({ ...form, assignee: e.target.value })}
            className="w-full px-3 py-2 text-sm rounded-lg border bg-white text-gray-800 dark:bg-gray-800 dark:text-white border-gray-300 dark:border-gray-600"
          >
            <option value="">Unassigned</option>{" "}
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.fullName || user.name || user.email || `User ${user.id}`}
              </option>
            ))}
          </select>
        </div>
        {/* Epic */}
        <div>
          <label className="block text-sm font-medium text-gray-800 dark:text-gray-300 mb-1">
            Epic
          </label>
          <select
            name="epicId"
            value={form.epicId}
            onChange={(e) => setForm({ ...form, epicId: e.target.value })}
            className="w-full px-3 py-2 text-sm rounded-lg border bg-white text-gray-800 dark:bg-gray-800 dark:text-white border-gray-300 dark:border-gray-600"
          >
            <option value="">No Epic</option>
            {epics.map((epic) => (
              <option key={epic.id} value={epic.id}>
                {epic.title || epic.name}
              </option>
            ))}
          </select>
        </div>
        {/* Submit */}
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
            <Plus size={16} />
            {saving ? "Creating..." : "Create Issue"}
          </button>
        </div>
      </form>
    </BaseModal>
  );
}

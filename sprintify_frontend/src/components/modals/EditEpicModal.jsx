import React, { useState, useEffect } from "react";
import BaseModal from "../ui/BaseModal";
import { X, Save } from "lucide-react";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import { getProjectMembers } from "../../api/projectMembers";
import { updateEpic } from "../../api/epics";

export default function EditEpicModal({ epic, onClose, onSave }) {
  const { projectId } = useParams();  const [form, setForm] = useState({
    name: epic?.title || "", // Map 'title' from API to 'name' in form
    description: epic?.description || "",
    assigneeId: epic?.assignee || "",
  });
  const [users, setUsers] = useState([]);
  const [saving, setSaving] = useState(false);
  useEffect(() => {
    if (epic) {
      setForm({
        name: epic.title || "", // Map 'title' from API to 'name' in form
        description: epic.description || "",
        assigneeId: epic.assignee || "",
      });
    }
  }, [epic]);useEffect(() => {
    if (!projectId) return;
    getProjectMembers(projectId)
      .then((response) => {
        // Handle the correct response structure: { memberships: [...], success: true }
        const memberships = response.memberships || response.data?.memberships || response;
        const users = memberships
          .map((membership) => membership.user)
          .filter((user) => user && user.id);
        setUsers(users);
      })
      .catch((error) => {
        console.error("Failed to fetch project members:", error);
        toast.error("Failed to fetch project members");
      });
  }, [projectId]);

  if (!epic) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error("Epic name is required");
      return;
    }    setSaving(true);
    try {
      const payload = {
        title: form.name.trim(), // Send as 'title' to match backend DTO
        description: form.description.trim(),
        projectId: epic.projectId,
      };      // Only add assignee if one is selected
      if (form.assigneeId) {
        payload.assignee = form.assigneeId;
      }

      const res = await updateEpic(projectId, epic.id, payload);
      toast.success("Epic updated successfully!");
      onSave && onSave(res);
      onClose();
    } catch (error) {
      console.error("Failed to update epic:", error);
      toast.error("Failed to update epic");
    } finally {
      setSaving(false);
    }
  };

  return (
    <BaseModal onClose={onClose}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <Save size={20} className="text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Edit Epic
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Update epic information
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
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-800 dark:text-gray-300 mb-1">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
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
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={3}
            className="w-full px-3 py-2 text-sm rounded-lg border bg-white text-gray-800 dark:bg-gray-800 dark:text-white border-gray-300 dark:border-gray-600 resize-none"
          />
        </div>

        {/* Assignee */}
        <div>
          <label className="block text-sm font-medium text-gray-800 dark:text-gray-300 mb-1">
            Assignee
          </label>
          <select
            name="assigneeId"
            value={form.assigneeId}
            onChange={(e) => setForm({ ...form, assigneeId: e.target.value })}
            className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white text-sm"
          >
            <option value="">Unassigned</option>{" "}
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.fullName || user.name || user.email || `User ${user.id}`}
              </option>
            ))}
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

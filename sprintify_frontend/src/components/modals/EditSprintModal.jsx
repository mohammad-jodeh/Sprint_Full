import { useState } from "react";
import { X } from "lucide-react";
import Portal from "../ui/Portal";
import { updateSprint } from "../../api/sprints";

export default function EditSprintModal({ sprint, projectId, onClose, onSave, onError }) {
  const [form, setForm] = useState({
    name: sprint.name,
    startDate: sprint.startDate.split('T')[0], // Ensure date format
    endDate: sprint.endDate.split('T')[0], // Ensure date format
  });
  const [saving, setSaving] = useState(false);

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split("T")[0];

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSave = async (e) => {
    e.preventDefault();

    // Only validate future dates for sprints that haven't started yet
    const sprintStarted = new Date(sprint.startDate) <= new Date();

    if (!sprintStarted && form.startDate < today) {
      onError?.("Start date cannot be in the past");
      return;
    }

    // Validate that end date is after start date
    if (form.endDate <= form.startDate) {
      onError?.("End date must be after start date");
      return;
    }

    setSaving(true);
    try {
      const updatedSprint = await updateSprint(projectId, sprint.id, form);
      onSave(updatedSprint);
      onClose();
    } catch (err) {
      console.error("Failed to update sprint", err);
      onError?.(err.message || "Failed to update sprint");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Portal>
      <div className="fixed inset-0 z-[99999] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-6 w-full max-w-md border border-gray-300 dark:border-gray-700 relative">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition"
          >
            <X size={20} />
          </button>

          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 text-center">
            Edit Sprint
          </h2>

          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                Sprint Name
              </label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg border bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                  Start Date
                </label>{" "}
                <input
                  type="date"
                  name="startDate"
                  value={form.startDate}
                  onChange={handleChange}
                  min={
                    new Date(sprint.startDate) <= new Date()
                      ? sprint.startDate
                      : today
                  }
                  className="w-full px-3 py-2 rounded-lg border bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                  End Date
                </label>{" "}
                <input
                  type="date"
                  name="endDate"
                  value={form.endDate}
                  onChange={handleChange}
                  min={form.startDate || today}
                  className="w-full px-3 py-2 rounded-lg border bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary-hover transition disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Portal>
  );
}

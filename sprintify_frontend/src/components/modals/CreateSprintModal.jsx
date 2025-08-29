import { useState } from "react";
import { X } from "lucide-react";
import Portal from "../ui/Portal";
import { createSprint } from "../../api/sprints";

export default function CreateSprintModal({ projectId, onClose, onCreate, onError }) {
  const [form, setForm] = useState({
    name: "",
    startDate: "",
    endDate: "",
  });
  const [saving, setSaving] = useState(false);

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split("T")[0];

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate that start date is not in the past
    if (form.startDate < today) {
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
      const newSprint = await createSprint(projectId, form);
      onCreate(newSprint);
      onClose();
    } catch (err) {
      console.error("Failed to create sprint", err);
      onError?.(err.message || "Failed to create sprint");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Portal>
      <div className="fixed inset-0 z-[99999] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
        {" "}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-md p-6 border border-gray-300 dark:border-gray-700 relative">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition"
          >
            <X size={20} />
          </button>

          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 text-center">
            Create Sprint
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                Sprint Name
              </label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
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
                  min={today}
                  required
                  className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                  required
                  className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary-hover transition disabled:opacity-50"
              >
                {saving ? "Creating..." : "Create Sprint"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Portal>
  );
}

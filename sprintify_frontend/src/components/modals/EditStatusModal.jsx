import React, { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import Portal from "../ui/Portal";
import { updateStatus } from "../../api/statuses";

export default function EditStatusModal({
  status,
  projectId,
  onClose,
  onUpdated,
}) {
  const [name, setName] = useState("");
  const [type, setType] = useState("BACKLOG");
  const [loading, setLoading] = useState(false);

  const statusTypes = [
    { value: "BACKLOG", label: "Backlog" },
    { value: "IN_PROGRESS", label: "In Progress" },
    { value: "DONE", label: "Done" },
  ];

  useEffect(() => {
    if (status) {
      setName(status.name || "");
      setType(status.type || "BACKLOG");
    }
  }, [status]);

  const handleUpdate = async () => {
    if (!name.trim()) return;

    setLoading(true);
    try {
      const updatedStatus = await updateStatus(status.id, {
        id: status.id,
        name: name.trim(),
        type: type,
        columnId: status.columnId,
      }, projectId);

      if (onUpdated) {
        onUpdated(updatedStatus);
      }

      onClose();
    } catch (err) {
      console.error("Failed to update status", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Portal>
      <Dialog open onClose={onClose} className="relative z-[100000]">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm"
          aria-hidden="true"
        />

        {/* Modal content */}
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white dark:bg-gray-900 rounded-xl p-6 max-w-sm w-full space-y-4 shadow-xl border border-gray-200 dark:border-gray-700">
            <Dialog.Title className="text-lg font-bold text-gray-800 dark:text-white">
              Edit Status
            </Dialog.Title>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Status Name
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Status name"
                  className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Status Type
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {statusTypes.map((statusType) => (
                    <option key={statusType.value} value={statusType.value}>
                      {statusType.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm rounded bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                disabled={loading || !name.trim()}
                className="px-4 py-2 text-sm rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? "Updating..." : "Update Status"}
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </Portal>
  );
}

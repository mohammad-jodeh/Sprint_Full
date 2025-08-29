import React, { useState } from "react";
import { Dialog } from "@headlessui/react";
import Portal from "../ui/Portal";
import { createStatus } from "../../api/statuses";

export default function CreateStatusModal({
  onClose,
  columnId,
  projectId,
  onStatusCreated,
  onCreate,
}) {
  const [name, setName] = useState("");
  const [type, setType] = useState("BACKLOG");
  const [loading, setLoading] = useState(false);

  const statusTypes = [
    { value: "BACKLOG", label: "Backlog" },
    { value: "IN_PROGRESS", label: "In Progress" },
    { value: "DONE", label: "Done" },
  ];  const handleCreate = async () => {
    if (!name.trim()) return;

    setLoading(true);
    try {
      const newStatus = await createStatus({
        name: name.trim(),
        type: type,
        columnId: columnId,
        order: 999, // Will be adjusted by backend
      }, projectId);

      // Call both callback functions if they exist
      if (onStatusCreated) {
        onStatusCreated(newStatus);
      }

      if (onCreate) {
        onCreate(newStatus);
      }

      setName("");
      setType("BACKLOG");
      onClose();
    } catch (err) {
      console.error("Failed to create status", err);
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
              Create New Status
            </Dialog.Title>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Status name"
              className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white text-sm"
            />{" "}
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white text-sm"
            >
              {statusTypes.map((statusType) => (
                <option key={statusType.value} value={statusType.value}>
                  {statusType.label}
                </option>
              ))}
            </select>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm rounded bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                disabled={loading}
                className="px-4 py-2 text-sm rounded bg-primary text-white hover:brightness-110 disabled:opacity-60"
              >
                {loading ? "Creating..." : "Create"}
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </Portal>
  );
}

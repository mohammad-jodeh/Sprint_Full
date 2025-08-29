import React, { useState } from "react";
import { Dialog } from "@headlessui/react";
import { updateBoardColumn } from "../../api/boardColumns";
import toast from "react-hot-toast";
import Portal from "../ui/Portal";

export default function EditColumnModal({ column, onClose, onUpdated, projectId }) {
  const [name, setName] = useState(column.name);
  const [loading, setLoading] = useState(false);
  const handleUpdate = async () => {
    if (!name.trim()) return toast.error("Column name is required");
    setLoading(true);
    try {
      await updateBoardColumn(projectId, column.id, { name });
      toast.success("Column updated");
      onUpdated(); // refetch columns
      onClose();
    } catch {
      toast.error("Failed to update column");
    } finally {
      setLoading(false);
    }
  };
  return (
    <Portal>
      <Dialog open={!!column} onClose={onClose} className="relative z-[100000]">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm"
          aria-hidden="true"
        />

        {/* Modal content */}
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white dark:bg-gray-900 rounded-xl p-6 max-w-sm w-full space-y-4 shadow-xl border border-gray-200 dark:border-gray-700">
            <Dialog.Title className="text-lg font-bold text-gray-800 dark:text-white">
              Edit Column
            </Dialog.Title>

            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Column name"
              className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white text-sm"
            />

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm rounded bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                disabled={loading}
                className="px-4 py-2 text-sm rounded bg-primary text-white hover:brightness-110 disabled:opacity-60"
              >
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </Portal>
  );
}

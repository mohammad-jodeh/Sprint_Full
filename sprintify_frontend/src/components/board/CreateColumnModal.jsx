import React, { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import { createBoardColumn, fetchBoardColumns } from "../../api/boardColumns";
import { createStatus } from "../../api/statuses";
import toast from "react-hot-toast";
import Portal from "../ui/Portal";
import { X } from "lucide-react";

export default function CreateColumnModal({
  open,
  onClose,
  onColumnCreated,
  projectId,
}) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreate = async (e) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast.error("Column name is required");
      return;
    }

    setLoading(true);
    try {
      console.log("📊 Creating column with name:", name.trim());

      // Fetch existing columns to determine the next order
      const existingColumns = await fetchBoardColumns(projectId);
      const nextOrder = existingColumns.length > 0
        ? Math.max(...existingColumns.map((col) => col.order || 0)) + 1
        : 0;

      // Create the column
      const newColumn = await createBoardColumn(projectId, {
        name: name.trim(),
        order: nextOrder,
      });

      console.log("✅ Column response:", newColumn);
      const columnId = newColumn?.column?.id || newColumn?.id || newColumn?.data?.id;
      console.log("📍 Column ID extracted:", columnId);

      // Automatically create a status with the same name as the column
      if (columnId) {
        try {
          await createStatus(
            {
              name: name.trim(),
              type: 0, // BACKLOG = 0 (numeric enum value)
              columnId: columnId,
              projectId: projectId,
            },
            projectId
          );
          console.log("✅ Status created successfully for column:", columnId);
          toast.success("Column and status created! 🎉");
        } catch (statusError) {
          console.error("❌ Failed to create status for column:", statusError);
          toast.warn("Column created, but status creation had issues.");
        }
      }

      setName("");
      onColumnCreated();
      onClose();
    } catch (error) {
      console.error("❌ Failed to create column:", error);
      toast.error(error.message || "Failed to create column");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Portal>
      <Dialog open={open} onClose={onClose} className="relative z-[100000]">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm"
          aria-hidden="true"
        />

        {/* Modal content */}
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 space-y-4 w-full max-w-md overflow-hidden animate-in fade-in duration-300">
            {/* Header */}
            <div className="flex items-center justify-between bg-gradient-to-r from-blue-500 to-indigo-600 p-6">
              <Dialog.Title className="text-lg font-bold text-white">
                Create New Column
              </Dialog.Title>
              <button
                onClick={onClose}
                className="text-white/80 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Column Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., To Do, In Progress, Done"
                  autoFocus
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all"
                />
              </div>

              {/* Info message */}
              <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                <p className="text-xs text-blue-700 dark:text-blue-300">
                  ✨ A status will be automatically created with the same name.
                </p>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed transition-all"
                >
                  {loading ? "Creating..." : "Create Column"}
                </button>
              </div>
            </form>
          </Dialog.Panel>
        </div>
      </Dialog>
    </Portal>
  );
}

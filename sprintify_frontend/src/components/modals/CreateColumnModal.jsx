import React, { useState } from "react";
import { Dialog } from "@headlessui/react";
import { createBoardColumn, fetchBoardColumns } from "../../api/boardColumns";
import { createStatus } from "../../api/statuses";
import toast from "react-hot-toast";
import Portal from "../ui/Portal";

export default function CreateColumnModal({
  open,
  onClose,
  onCreated,
  projectId,
}) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const handleCreate = async () => {
    if (!name.trim()) return toast.error("Column name is required");
    setLoading(true);
    try {
      // Get current columns to determine the next order value
      const existingColumns = await fetchBoardColumns(projectId);
      const nextOrder =
        existingColumns.length > 0
          ? Math.max(...existingColumns.map((col) => col.order || 0)) + 1
          : 1;

      console.log("📊 Creating column with name:", name, "order:", nextOrder);
      
      // Create the column
      const columnResponse = await createBoardColumn(projectId, {
        name,
        order: nextOrder,
      });

      console.log("✅ Column response:", columnResponse);
      
      const columnId = columnResponse?.id || columnResponse?.data?.id;
      console.log("📍 Column ID extracted:", columnId);

      // Automatically create a status with the same name as the column
      // and link it to the newly created column
      if (columnId) {
        try {
          await createStatus(
            {
              name: name.trim(),
              type: 0, // BACKLOG = 0 (numeric enum value)
              columnId: columnId,
              projectId: projectId, // Include projectId here (was missing!)
            },
            projectId
          );
          console.log("✅ Status created successfully for column:", columnId);
        } catch (statusError) {
          console.error("❌ Failed to create status for column:", statusError);
          // Don't fail the entire operation if status creation fails
          toast.warn("Column created, but status creation failed. Please create the status manually in Settings.");
        }
      } else {
        console.warn("⚠️ Column created but no columnId returned");
      }

      toast.success("Column and status created successfully!");
      onCreated(); // reload columns outside
      onClose();
      setName("");
    } catch (error) {
      console.error("❌ Failed to create column:", error);
      toast.error("Failed to create column");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Portal>
      <Dialog open={open} onClose={onClose} className="relative z-[100000]">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm"
          aria-hidden="true"
        />

        {/* Modal content */}
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white dark:bg-gray-900 rounded-xl p-6 max-w-sm w-full shadow-xl border border-gray-300 dark:border-gray-700 space-y-4">
            <Dialog.Title className="text-lg font-bold text-gray-800 dark:text-white">
              Create New Column
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

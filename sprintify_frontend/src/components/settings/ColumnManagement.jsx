import React, { useState, useEffect } from "react";
import {
  fetchBoardColumns,
  createBoardColumn,
  deleteBoardColumn,
  updateColumnOrders,
} from "../../api/boardColumns";
import toast from "react-hot-toast";
import { GripVertical, Plus, Trash2, Edit2, X } from "lucide-react";

const ColumnManagement = ({ projectId }) => {
  const [columns, setColumns] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newColumnName, setNewColumnName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");
  const [draggedId, setDraggedId] = useState(null);

  useEffect(() => {
    loadColumns();
  }, [projectId]);

  const loadColumns = async () => {
    try {
      setIsLoading(true);
      const data = await fetchBoardColumns(projectId);
      setColumns(data.sort((a, b) => (a.order || 0) - (b.order || 0)));
    } catch (error) {
      toast.error("Failed to load columns");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateColumn = async () => {
    if (!newColumnName.trim()) {
      toast.error("Column name is required");
      return;
    }

    try {
      setIsLoading(true);
      const newOrder = columns.length;
      const newColumn = await createBoardColumn(projectId, {
        name: newColumnName.trim(),
        order: newOrder,
      });

      // Refresh columns from API to ensure sync
      const updatedColumns = await fetchBoardColumns(projectId);
      setColumns(updatedColumns.sort((a, b) => (a.order || 0) - (b.order || 0)));
      
      setNewColumnName("");
      setShowCreateForm(false);
      toast.success("Column created successfully!");
    } catch (error) {
      toast.error(error.message || "Failed to create column");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteColumn = async (columnId) => {
    if (!window.confirm("Are you sure you want to delete this column?")) return;

    try {
      await deleteBoardColumn(projectId, columnId);
      setColumns(columns.filter((col) => col.id !== columnId));
      toast.success("Column deleted successfully!");
    } catch (error) {
      toast.error(error.message || "Failed to delete column");
    }
  };

  const handleSaveEdit = async (columnId) => {
    if (!editingName.trim()) {
      toast.error("Column name is required");
      return;
    }

    try {
      const updatedColumns = columns.map((col) =>
        col.id === columnId ? { ...col, name: editingName.trim() } : col
      );

      await updateColumnOrders(projectId, updatedColumns.map(c => ({ id: c.id, order: c.order })));
      
      setColumns(updatedColumns);
      setEditingId(null);
      setEditingName("");
      toast.success("Column updated successfully!");
    } catch (error) {
      toast.error(error.message || "Failed to update column");
    }
  };

  const handleDragStart = (columnId) => {
    setDraggedId(columnId);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDropReorder = async (targetColumnId) => {
    if (!draggedId || draggedId === targetColumnId) return;

    const draggedIndex = columns.findIndex((col) => col.id === draggedId);
    const targetIndex = columns.findIndex((col) => col.id === targetColumnId);

    if (draggedIndex === -1 || targetIndex === -1) return;

    // Reorder columns array
    const newColumns = [...columns];
    const [draggedColumn] = newColumns.splice(draggedIndex, 1);
    newColumns.splice(targetIndex, 0, draggedColumn);

    // Update order numbers
    const reorderedColumns = newColumns.map((col, idx) => ({
      ...col,
      order: idx,
    }));

    setColumns(reorderedColumns);
    setDraggedId(null);

    try {
      await updateColumnOrders(
        projectId,
        reorderedColumns.map((c) => ({ id: c.id, order: c.order }))
      );
      toast.success("Columns reordered successfully!");
    } catch (error) {
      toast.error(error.message || "Failed to reorder columns");
      // Reload on error
      loadColumns();
    }
  };

  const moveColumn = async (columnId, direction) => {
    const index = columns.findIndex((col) => col.id === columnId);
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === columns.length - 1)
    ) {
      return;
    }

    const newColumns = [...columns];
    const swapIndex = direction === "up" ? index - 1 : index + 1;
    [newColumns[index], newColumns[swapIndex]] = [
      newColumns[swapIndex],
      newColumns[index],
    ];

    const reorderedColumns = newColumns.map((col, idx) => ({
      ...col,
      order: idx,
    }));

    setColumns(reorderedColumns);

    try {
      await updateColumnOrders(
        projectId,
        reorderedColumns.map((c) => ({ id: c.id, order: c.order }))
      );
      toast.success("Column moved successfully!");
    } catch (error) {
      toast.error(error.message || "Failed to move column");
      loadColumns();
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading columns...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Column Management
        </h3>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          <Plus size={18} />
          New Column
        </button>
      </div>

      {/* Create Column Form */}
      {showCreateForm && (
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Column name (e.g., Backlog, Review, Deploy)"
              value={newColumnName}
              onChange={(e) => setNewColumnName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleCreateColumn();
                if (e.key === "Escape") {
                  setShowCreateForm(false);
                  setNewColumnName("");
                }
              }}
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
              autoFocus
            />
            <button
              onClick={handleCreateColumn}
              disabled={isLoading}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Creating..." : "Create"}
            </button>
            <button
              onClick={() => {
                setShowCreateForm(false);
                setNewColumnName("");
              }}
              disabled={isLoading}
              className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-white rounded-lg hover:bg-gray-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Columns List */}
      <div className="space-y-3">
        {columns.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
            No columns yet. Create your first column to get started!
          </div>
        ) : (
          columns.map((column, index) => (
            <div
              key={column.id}
              draggable
              onDragStart={() => handleDragStart(column.id)}
              onDragOver={handleDragOver}
              onDrop={() => handleDropReorder(column.id)}
              className={`flex items-center gap-3 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg transition ${
                draggedId === column.id ? "opacity-50 bg-blue-50 dark:bg-blue-900/20" : ""
              } hover:shadow-md`}
            >
              {/* Drag Handle */}
              <GripVertical
                size={20}
                className="text-gray-400 cursor-grab active:cursor-grabbing flex-shrink-0"
              />

              {/* Column Info */}
              {editingId === column.id ? (
                <input
                  type="text"
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSaveEdit(column.id);
                    if (e.key === "Escape") {
                      setEditingId(null);
                      setEditingName("");
                    }
                  }}
                  className="flex-1 px-3 py-2 border-2 border-primary rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
                  autoFocus
                />
              ) : (
                <div className="flex-1">
                  <div className="font-medium text-gray-900 dark:text-white">
                    {column.name}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Order: {column.order} • {column.statuses?.length || 0} status
                    {(column.statuses?.length || 0) !== 1 ? "es" : ""}
                  </div>
                </div>
              )}

              {/* Status Count Badge */}
              <div className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm font-medium rounded-full">
                {column.statuses?.length || 0} status
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                {editingId === column.id ? (
                  <>
                    <button
                      onClick={() => handleSaveEdit(column.id)}
                      className="px-3 py-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setEditingId(null);
                        setEditingName("");
                      }}
                      className="px-3 py-1 bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-white text-sm rounded-lg hover:bg-gray-400 transition"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        setEditingId(column.id);
                        setEditingName(column.name);
                      }}
                      className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
                      title="Edit"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => moveColumn(column.id, "up")}
                      disabled={index === 0}
                      className="px-2 py-1 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Move up"
                    >
                      ↑
                    </button>
                    <button
                      onClick={() => moveColumn(column.id, "down")}
                      disabled={index === columns.length - 1}
                      className="px-2 py-1 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Move down"
                    >
                      ↓
                    </button>
                    <button
                      onClick={() => handleDeleteColumn(column.id)}
                      className="p-2 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Help Text */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 text-blue-900 dark:text-blue-200 text-sm p-4 rounded-lg">
        <p className="font-medium mb-2">💡 Column Management Tips:</p>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li>Drag columns to reorder them, or use the ↑↓ buttons</li>
          <li>Column names automatically create matching statuses</li>
          <li>You can have multiple statuses per column</li>
          <li>Delete a column to remove it from your board</li>
        </ul>
      </div>
    </div>
  );
};

export default ColumnManagement;

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Plus, GripVertical, Pencil, BadgePlus, Trash2, Edit } from "lucide-react";
import { fetchBoardColumns, deleteBoardColumn } from "../../api/boardColumns";
import { fetchStatuses, createStatus, deleteStatus, updateStatus } from "../../api/statuses";
import CreateColumnModal from "../../components/modals/CreateColumnModal";
import EditColumnModal from "../../components/modals/EditColumnModal";
import CreateStatusModal from "../../components/modals/CreateStatusModal";
import EditStatusModal from "../../components/modals/EditStatusModal";
import ConfirmDeleteModal from "../../components/modals/ConfirmDeleteModal";
import { useProjectRole } from "../../hooks/useProjectRole";
import { can, PERMISSIONS } from "../../utils/permission";
import toast from "react-hot-toast";

export default function BoardSettingsPage() {
  const { projectId } = useParams();
  const { projectRole } = useProjectRole();
  const [columns, setColumns] = useState([]);
  const [statusesByColumn, setStatusesByColumn] = useState({});
  const [showCreateCol, setShowCreateCol] = useState(false);
  const [editingCol, setEditingCol] = useState(null);  const [showStatusModal, setShowStatusModal] = useState(false);
  const [targetColumnId, setTargetColumnId] = useState(null);
  const [statusToDelete, setStatusToDelete] = useState(null);
  const [statusToEdit, setStatusToEdit] = useState(null);
  const [columnToDelete, setColumnToDelete] = useState(null);

  // Check permissions
  const canConfigureBoard = can(projectRole, PERMISSIONS.CONFIGURE_BOARD);
  const canConfigureStatus = can(projectRole, PERMISSIONS.CONFIGURE_STATUS);

  useEffect(() => {
    if (projectId) loadData();
  }, [projectId]);  const loadData = async () => {
    try {
      const cols = await fetchBoardColumns(projectId);
      // Sort columns by their order field to ensure proper ordering
      const sortedCols = cols.sort((a, b) => (a.order || 0) - (b.order || 0));
      setColumns(sortedCols);
      const statuses = cols.flatMap((col) => col.statuses || [], []);
      console.log("Statuses:", statuses);
      const grouped = statuses.reduce((acc, status) => {
        const colId = status.columnId;
        if (!acc[colId]) acc[colId] = [];
        acc[colId].push(status);
        return acc;
      }, {});
      setStatusesByColumn(grouped);
    } catch (err) {
      console.error("Failed to load board settings:", err);
      toast.error("Failed to load board settings");
    }
  };
  const handleCreateStatus = (newStatus) => {
    // Update the UI with the newly created status (API call already handled in modal)
    setStatusesByColumn((prev) => ({
      ...prev,
      [newStatus.columnId]: [...(prev[newStatus.columnId] || []), newStatus],
    }));
    toast.success("Status added");
    setShowStatusModal(false);
    setTargetColumnId(null);
  };  const handleDeleteStatus = async () => {
    if (!statusToDelete) return;
    try {
      await deleteStatus(statusToDelete.id, projectId);
      setStatusesByColumn((prev) => {
        const updated = { ...prev };
        Object.keys(updated).forEach((columnId) => {
          updated[columnId] = updated[columnId].filter(
            (status) => status.id !== statusToDelete.id
          );
        });
        return updated;
      });
      toast.success("Status deleted");
      setStatusToDelete(null);
    } catch {
      toast.error("Failed to delete status");
    }
  };

  const handleEditStatus = (updatedStatus) => {
    setStatusesByColumn((prev) => {
      const updated = { ...prev };
      Object.keys(updated).forEach((columnId) => {
        updated[columnId] = updated[columnId].map((status) =>
          status.id === updatedStatus.id ? updatedStatus : status
        );
      });
      return updated;
    });
    toast.success("Status updated successfully");
    setStatusToEdit(null);
  };const handleDeleteColumn = async () => {
    if (!columnToDelete) return;
    try {
      await deleteBoardColumn(projectId, columnToDelete.id);
      setColumns((prev) => prev.filter((col) => col.id !== columnToDelete.id));
      setStatusesByColumn((prev) => {
        const updated = { ...prev };
        delete updated[columnToDelete.id];
        return updated;
      });
      toast.success("Column deleted");
      setColumnToDelete(null);
    } catch (error) {
      console.error("Failed to delete column:", error);
      toast.error("Failed to delete column");
    }
  };

  return (
    <div className="space-y-8 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-custom-600 bg-clip-text text-transparent">
          🧩 Board Settings
        </h1>
        {canConfigureBoard && (
          <button
            onClick={() => setShowCreateCol(true)}
            className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl hover:from-emerald-600 hover:to-teal-700 transition-all"
            title="Add New Column"
          >
            <Plus size={16} /> Add Column
          </button>
        )}
        {!canConfigureBoard && (
          <div className="text-sm text-gray-500 dark:text-gray-400 italic">
            You don't have permission to configure the board
          </div>
        )}      </div>
      
      {/* Board Columns Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            📋 Board Columns & Statuses
          </h2>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Organize your workflow with columns and statuses
          </div>
        </div>        
      <div className="space-y-6">
        {columns.map((column) => (
          <div
            key={column.id}
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-gray-800 dark:text-white font-semibold text-xl">
                <GripVertical
                  className="text-gray-400 dark:text-gray-500"
                  size={18}
                />
                {column.name}
              </div>{" "}
              <div className="flex gap-2">
                {canConfigureStatus && (
                  <button
                    onClick={() => {
                      setTargetColumnId(column.id);
                      setShowStatusModal(true);
                    }}
                    className="flex items-center gap-1 text-sm text-primary hover:text-blue-600 transition"
                    title="Add Status"
                  >
                    <BadgePlus size={16} />
                  </button>
                )}
                {canConfigureBoard && (
                  <button
                    onClick={() => setEditingCol(column)}
                    className="flex items-center gap-1 text-sm text-primary hover:text-blue-600 transition"
                    title="Edit Column"
                  >
                    <Pencil size={16} />
                  </button>
                )}
                {canConfigureBoard && (
                  <button
                    onClick={() => setColumnToDelete(column)}
                    className="flex items-center gap-1 text-sm text-red-500 hover:text-red-700 transition"
                    title="Delete Column"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            </div>            <div className="flex flex-wrap gap-2">
              {(statusesByColumn[column.id] || []).map((status) => (
                <div
                  key={status.id}
                  className="flex items-center gap-2 px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs font-medium text-gray-800 dark:text-white shadow-sm backdrop-blur-sm"
                >
                  {" "}
                  {status.name}{" "}
                  <span className="text-[10px] opacity-50 ml-1">
                    (
                    {status.type === "TODO" || status.type === 0
                      ? "To Do"
                      : status.type === "IN_PROGRESS" || status.type === 1
                      ? "In Progress"
                      : "Done"}
                    )
                  </span>
                  <div className="flex items-center gap-1 ml-1">
                    {canConfigureStatus && (
                      <button
                        onClick={() => setStatusToEdit(status)}
                        className="p-1 rounded hover:bg-blue-100 dark:hover:bg-blue-800 text-blue-500 transition"
                        title="Edit status"
                      >
                        <Edit size={12} />
                      </button>
                    )}
                    {canConfigureStatus && (
                      <button
                        onClick={() => setStatusToDelete(status)}
                        className="p-1 rounded hover:bg-red-100 dark:hover:bg-red-800 text-red-500 transition"
                        title="Delete status"
                      >
                        <Trash2 size={12} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {(statusesByColumn[column.id] || []).length === 0 && (
                <span className="text-sm text-gray-400 italic">
                  No statuses assigned to this column.
                </span>
              )}
            </div>
          </div>
        ))}
      </div>      {columns.length === 0 && (
        <div className="text-center py-12">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-8 max-w-md mx-auto">
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
              No Board Configuration
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Start by creating columns to organize your board workflow.
            </p>
            {canConfigureBoard && (
              <button
                onClick={() => setShowCreateCol(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors"
              >
                <Plus size={16} />
                Create Your First Column
              </button>
            )}
          </div>        </div>
      )}

      {/* Modals */}
      <CreateColumnModal
        open={showCreateCol}
        onClose={() => setShowCreateCol(false)}
        onCreated={loadData}
        projectId={projectId}
      />      
      {editingCol && (
        <EditColumnModal
          column={editingCol}
          onClose={() => setEditingCol(null)}
          onUpdated={loadData}
          projectId={projectId}
        />
      )}{" "}      
      {showStatusModal && (
        <CreateStatusModal
          onClose={() => {
            setShowStatusModal(false);
            setTargetColumnId(null);
          }}
          onCreate={handleCreateStatus}
          columnId={targetColumnId}
          projectId={projectId}
        />
      )}
      {statusToEdit && (
        <EditStatusModal
          status={statusToEdit}
          projectId={projectId}
          onClose={() => setStatusToEdit(null)}
          onUpdated={handleEditStatus}
        />
      )}
      {statusToDelete && (
        <ConfirmDeleteModal
          name={statusToDelete.name}
          type="status"
          onClose={() => setStatusToDelete(null)}
          onConfirm={handleDeleteStatus}
        />
      )}
      {columnToDelete && (
        <ConfirmDeleteModal
          name={columnToDelete.name}
          type="column"
          onClose={() => setColumnToDelete(null)}
          onConfirm={handleDeleteColumn}
        />
      )}
      </div>
    </div>
  );
}
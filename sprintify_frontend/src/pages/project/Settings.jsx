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
import ColumnManagement from "../../components/settings/ColumnManagement";
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
      </div>

      {/* Quick Column Management */}
      {canConfigureBoard && projectId && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
          <ColumnManagement projectId={projectId} />
        </div>
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
  );
}
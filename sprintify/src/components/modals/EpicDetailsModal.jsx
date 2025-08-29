import React, { useState, useEffect } from "react";
import BaseModal from "../ui/BaseModal";
import EditEpicModal from "./EditEpicModal";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import { X, Target, Trash2, Edit3 } from "lucide-react";
import api from "../../api/config";
import toast from "react-hot-toast";

export default function EpicDetailsModal({
  epic,
  onClose,
  onDelete,
  onUpdate,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    api
      .get("/users")
      .then((res) => setUsers(res.data))
      .catch(() => toast.error("Failed to fetch users"));
  }, []);

  if (!epic) return null;

  const handleDelete = async () => {
    setLoading(true);
    try {
      await api.delete(`/epics/${epic.id}`);
      toast.success("Epic deleted successfully!");
      onDelete(epic.id);
      onClose();
    } catch (error) {
      console.error("Failed to delete epic:", error);
      toast.error("Failed to delete epic");
    } finally {
      setLoading(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleEditSave = (updatedEpic) => {
    onUpdate(updatedEpic);
    setIsEditing(false);
  };

  const assigneeUser = users.find((u) => u.id === epic.assignee);
  return (
    <>
      {isEditing ? (
        <EditEpicModal
          epic={epic}
          onClose={() => setIsEditing(false)}
          onSave={handleEditSave}
        />
      ) : (
        <BaseModal onClose={onClose}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Target size={20} className="text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Epic Details
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  View and manage epic information
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <X size={20} />
            </button>
          </div>{" "}
          <div className="space-y-6">
            {/* Epic Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                {epic.title || epic.name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {epic.description || "No description available"}
              </p>
            </div>

            {/* Assignee Information */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Assignee
              </h4>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                  <span className="text-sm font-medium text-blue-600 dark:text-blue-300">
                    {assigneeUser?.firstName?.[0]?.toUpperCase() || "U"}
                  </span>
                </div>
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {assigneeUser
                    ? `${assigneeUser.firstName} ${assigneeUser.lastName}`
                    : "Unassigned"}
                </span>
              </div>
            </div>
          </div>
          {/* Action Buttons */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-6 flex justify-between">
            <button
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <Edit3 className="w-4 h-4 mr-2" />
              Edit Epic
            </button>

            <button
              onClick={() => setShowDeleteConfirm(true)}
              disabled={loading}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 transition-colors"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Epic
            </button>
          </div>
        </BaseModal>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <ConfirmDeleteModal
          name={epic.title || epic.name}
          type="epic"
          onClose={() => setShowDeleteConfirm(false)}
          onConfirm={handleDelete}
        />
      )}
    </>
  );
}

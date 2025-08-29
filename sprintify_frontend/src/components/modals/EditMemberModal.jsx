import { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import { motion } from "framer-motion";
import api from "../../api/config";
import Portal from "../ui/Portal";
import { useParams } from "react-router-dom";
import { useProjectRole } from "../../hooks/useProjectRole";
import { canModifyUserRole } from "../../utils/permission";
import toast from "react-hot-toast";
import useAuthStore from "../../store/authstore";

const ROLES = ["MEMBER", "MODERATOR", "ADMINISTRATOR"];

const EditMemberModal = ({ member, onClose, onSave }) => {
  const { projectId } = useParams();
  const { projectRole } = useProjectRole();
  const { user: currentUser } = useAuthStore();
  const [permission, setPermission] = useState(member.permission);
  const [loading, setLoading] = useState(false);
  const [allMembers, setAllMembers] = useState([]);

  useEffect(() => {
    // Fetch all project members to check admin count
    const fetchMembers = async () => {
      try {
        const res = await api.get(`/project_members?projectId=${projectId}`);
        setAllMembers(res.data);
      } catch (err) {
        console.error("Failed to fetch members:", err);
      }
    };
    fetchMembers();
  }, [projectId]);

  const handleSave = async () => {
    // Validate role change permissions
    const canModify = canModifyUserRole(projectRole, member.permission);
    if (!canModify.allowed) {
      toast.error(canModify.reason);
      return;
    }

    // Check if trying to demote the only administrator
    const administrators = allMembers.filter(
      (m) => m.permission === "ADMINISTRATOR"
    );
    if (
      member.userId === currentUser?.id &&
      member.permission === "ADMINISTRATOR" &&
      permission !== "ADMINISTRATOR" &&
      administrators.length === 1
    ) {
      toast.error(
        "Cannot remove administrator role - you are the only administrator"
      );
      return;
    }

    setLoading(true);
    try {
      const updated = {
        ...member,
        permission,
      };
      const res = await api.patch(`/project_members/${member.id}`, updated);
      onSave(res.data);
      onClose();
      toast.success("Member role updated successfully");
    } catch (err) {
      console.error("Failed to update member:", err);
      toast.error("Failed to update member role");
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
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white dark:bg-gray-900 w-full max-w-md rounded-xl p-6 shadow-xl border border-gray-200 dark:border-gray-700 space-y-4"
          >
            <Dialog.Title className="text-lg font-semibold text-gray-800 dark:text-white">
              Edit Member Role
            </Dialog.Title>

            <div className="space-y-2">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                <strong>Name:</strong> {member.user?.fullName || "Unknown"}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                <strong>Email:</strong> {member.user?.email || "N/A"}
              </p>

              <div className="mt-4">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  Role
                </label>
                <select
                  value={permission}
                  onChange={(e) => setPermission(e.target.value)}
                  className="w-full mt-1 px-3 py-2 rounded-md border bg-white dark:bg-gray-800 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600 text-sm"
                >
                  {ROLES.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-md text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={loading}
                className="px-4 py-2 rounded-md text-sm bg-primary text-white hover:bg-primary-hover disabled:opacity-60"
              >
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
          </motion.div>
        </div>
      </Dialog>
    </Portal>
  );
};

export default EditMemberModal;

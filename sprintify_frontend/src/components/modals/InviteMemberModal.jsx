import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useParams } from "react-router-dom";
import api from "../../api/config";
import { getProjectMembers, addProjectMember } from "../../api/projectMembers";
import Portal from "../ui/Portal";
import SelectUsersModal from "./SelectUsersModal";
import useAuthStore from "../../store/authstore";

export default function InviteMemberModal({ onClose, onAdd }) {
  const { projectId } = useParams();
  const { user } = useAuthStore();
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserPicker, setShowUserPicker] = useState(false);  const [permission, setPermission] = useState("MEMBER");
  const [disabledIds, setDisabledIds] = useState([]);

  // Permission mapping to match API expectations
  const permissionMap = {
    "MEMBER": 0,
    "MODERATOR": 1,
    "ADMINISTRATOR": 2
  };

  useEffect(() => {
    api.get("/users").then((res) => {
      // Filter out current user and already invited users
      const filteredUsers = res.data.filter((u) => u.id !== user?.id);
      setUsers(filteredUsers);
    });
    
    // Get existing project members to disable them in selection
    getProjectMembers(projectId)
      .then((response) => {
        const memberIds = response.memberships.map(m => m.user.id);
        setDisabledIds(memberIds);
      })
      .catch((err) => {
        console.error("Failed to fetch project members:", err);
      });
  }, [projectId, user?.id]);  const handleInvite = async (e) => {
    e.preventDefault();
    if (!selectedUser) {
      console.error("No user selected");
      return;
    }

    try {
      const memberData = {
        userId: selectedUser.id,
        permission: permissionMap[permission]
      };
      
      const result = await addProjectMember(projectId, memberData);
      onAdd(result);
      onClose();
    } catch (err) {
      console.error("Invite failed:", err);
    }
  };
  return (
    <Portal>
      <div className="fixed inset-0 z-[100000] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gradient-to-br dark:from-gray-900 dark:to-gray-800 rounded-2xl shadow-2xl p-6 w-full max-w-md border border-gray-300 dark:border-gray-700 relative transition-all duration-300">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-500 hover:text-red-500 transition"
            title="Close"
          >
            <X size={20} />
          </button>

          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            Invite a Team Member
          </h2>

          <form onSubmit={handleInvite} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-800 dark:text-gray-300 mb-1">
                User
              </label>
              <button
                type="button"
                onClick={() => setShowUserPicker(true)}
                className="w-full px-3 py-2 rounded-lg border bg-white text-gray-800 dark:bg-gray-800 dark:text-white border-gray-300 dark:border-gray-600 text-left"
              >
                {selectedUser
                  ? `${selectedUser.fullName} (${selectedUser.email})`
                  : "Select a user..."}
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-800 dark:text-gray-300 mb-1">
                Role
              </label>
              <select
                value={permission}
                onChange={(e) => setPermission(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border bg-white text-gray-800 dark:bg-gray-800 dark:text-white border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="MEMBER">Member</option>
                <option value="MODERATOR">Moderator</option>
                <option value="ADMINISTRATOR">Administrator</option>
              </select>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={!selectedUser}
                className="bg-gradient-to-r from-primary to-blue-500 text-white px-5 py-2 rounded-lg text-sm font-semibold shadow-md hover:opacity-90 transition disabled:opacity-50"
              >
                Invite
              </button>
            </div>
          </form>          {showUserPicker && (
            <SelectUsersModal
              selected={selectedUser ? [selectedUser.id] : []}
              disabledIds={disabledIds}
              projectId={projectId}
              onClose={() => setShowUserPicker(false)}
              onSelect={(ids) => {
                const user = users.find((u) => u.id === ids[0]);
                setSelectedUser(user);
                setShowUserPicker(false);
              }}
            />
          )}
        </div>
      </div>
    </Portal>
  );
}

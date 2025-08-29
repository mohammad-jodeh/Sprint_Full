import { useState, useEffect } from "react";
import { X, User, CheckCircle, AlertCircle } from "lucide-react";
import { useParams } from "react-router-dom";
import { getProjectMembers, updateProjectMember } from "../../api/projectMembers";
import Portal from "../ui/Portal";
import useAuthStore from "../../store/authstore";
import { useProjectRole } from "../../hooks/useProjectRole";
import { canModifyUserRole } from "../../utils/permission";

export default function EditTeamMemberModal({ member, onClose, onSave }) {
  const { projectId } = useParams();
  const { projectRole } = useProjectRole();
  const { user: currentUser } = useAuthStore();
  const [permission, setPermission] = useState("MEMBER");
  const [loading, setLoading] = useState(false);
  const [allMembers, setAllMembers] = useState([]);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");

  // Permission mapping to match API expectations (0-1 range)
  const permissionMap = {
    "MEMBER": 0,
    "MODERATOR": 1,
  };

  // Reverse mapping for display
  const reversePermissionMap = {
    0: "MEMBER",
    1: "MODERATOR",
    2: "ADMINISTRATOR", // For display only, can't be set
  };

  const roleColors = {
    MEMBER: "bg-blue-600",
    MODERATOR: "bg-green-600", 
    ADMINISTRATOR: "bg-purple-600"
  };

  useEffect(() => {
    // Set initial permission based on member data
    if (member?.permission) {
      setPermission(member.permission);
    }

    // Fetch all project members to check admin count
    const fetchMembers = async () => {
      try {
        const response = await getProjectMembers(projectId);
        setAllMembers(response.memberships);
      } catch (err) {
        console.error("Failed to fetch members:", err);
      }
    };
    fetchMembers();
  }, [projectId, member]);

  // Custom toast function using Portal
  const showCustomToast = (message, type = "success") => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    
    // Auto hide after 3 seconds
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  const handleSave = async () => {
    // Validate role change permissions
    const canModify = canModifyUserRole(projectRole, member.permission);
    if (!canModify.allowed) {
      showCustomToast(canModify.reason, "error");
      return;
    }

    // Check if trying to demote the only administrator
    const administrators = allMembers.filter(
      (m) => reversePermissionMap[m.permission] === "ADMINISTRATOR"
    );
    if (
      member.userId === currentUser?.id &&
      member.permission === "ADMINISTRATOR" &&
      permission !== "ADMINISTRATOR" &&
      administrators.length === 1
    ) {
      showCustomToast("Cannot remove administrator role - you are the only administrator", "error");
      return;
    }

    setLoading(true);
    try {
      const memberData = {
        userId: member.userId,
        permission: permissionMap[permission]
      };
      
      const result = await updateProjectMember(projectId, memberData);
      
      // Update the member object for the parent component
      const updatedMember = {
        ...member,
        permission: permission
      };
      
      showCustomToast(`${member.user?.fullName}'s role updated to ${permission.toLowerCase()}`, "success");
      onSave(updatedMember);
      
      // Close modal after a short delay to show the toast
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      console.error("Failed to update member:", err);
      showCustomToast("Failed to update member role", "error");
    } finally {
      setLoading(false);
    }
  };

  const renderAvatar = (user) => {
    if (user?.image) {
      return (
        <img
          src={user.image}
          alt={user.fullName}
          className="h-12 w-12 rounded-full object-cover border border-gray-300 dark:border-gray-700"
        />
      );
    }
    const initials = user?.fullName
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "U";
    return (
      <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center text-base font-bold">
        {initials}
      </div>
    );
  };

  return (
    <Portal>
      <div className="fixed inset-0 z-[100000] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gradient-to-br dark:from-gray-900 dark:to-gray-800 rounded-2xl shadow-2xl p-6 w-full max-w-lg border border-gray-300 dark:border-gray-700 relative transition-all duration-300">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition"
          >
            <X size={20} />
          </button>

          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-blue-500 text-transparent bg-clip-text mb-6">
            ✏️ Edit Team Member
          </h2>

          {/* Member Info */}
          <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <label className="block text-sm font-medium text-gray-800 dark:text-gray-300 mb-3">
              Member Information
            </label>
            <div className="flex items-center gap-4">
              {renderAvatar(member.user)}
              <div>
                <p className="font-semibold text-gray-900 dark:text-white text-lg">
                  {member.user?.fullName || "Unknown"}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {member.user?.email || "N/A"}
                </p>
                <div className="mt-2">
                  <span className="text-xs px-2 py-1 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                    Current: {member.permission}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Role Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-800 dark:text-gray-300 mb-3">
              New Role
            </label>
            <div className="grid grid-cols-2 gap-3">
              {Object.keys(permissionMap).map((role) => (
                <button
                  key={role}
                  onClick={() => setPermission(role)}
                  className={`p-4 rounded-lg border-2 transition ${
                    permission === role
                      ? `${roleColors[role]} text-white border-transparent`
                      : "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-primary"
                  }`}
                >
                  <div className="text-center">
                    <div className="font-medium text-sm">{role}</div>
                    <div className="text-xs mt-1 opacity-80">
                      {role === "MEMBER" ? "Basic access" : "Can manage tasks"}
                    </div>
                  </div>
                </button>
              ))}
            </div>
            
            {/* Administrator Note */}
            {member.permission === "ADMINISTRATOR" && (
              <div className="mt-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  <strong>Note:</strong> Administrator role cannot be changed. Only project creator maintains admin privileges.
                </p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!permission || loading || member.permission === "ADMINISTRATOR"}
              className="bg-gradient-to-r from-primary to-blue-500 text-white px-6 py-2 rounded-lg font-semibold shadow-md hover:opacity-90 transition disabled:opacity-50"
            >
              {loading ? "Updating..." : "Update Role"}
            </button>
          </div>
        </div>
      </div>

      {/* Custom Toast using Portal */}
      {showToast && (
        <Portal>
          <div className="fixed top-4 right-4 z-[99999] animate-in slide-in-from-top-2 duration-300">
            <div
              className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg max-w-sm ${
                toastType === "success"
                  ? "bg-green-500 text-white"
                  : "bg-red-500 text-white"
              }`}
            >
              {toastType === "success" ? (
                <CheckCircle size={20} />
              ) : (
                <AlertCircle size={20} />
              )}
              <span className="font-medium text-sm">{toastMessage}</span>
              <button
                onClick={() => setShowToast(false)}
                className="ml-auto text-white/80 hover:text-white transition"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        </Portal>
      )}
    </Portal>
  );
}

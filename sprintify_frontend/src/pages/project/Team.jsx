import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Plus, Trash2, Pencil } from "lucide-react";
import api, { protectedApi } from "../../api/config";
import {
  getProjectMembers,
  removeProjectMember,
} from "../../api/projectMembers";
import InviteTeamMemberModal from "../../components/modals/InviteTeamMemberModal";
import EditTeamMemberModal from "../../components/modals/EditTeamMemberModal";
import ConfirmDeleteModal from "../../components/modals/ConfirmDeleteModal";
import { useProjectRole } from "../../hooks/useProjectRole";
import { can, PERMISSIONS } from "../../utils/permission";
import { AnimatePresence, motion } from "framer-motion";
import useAuthStore from "../../store/authstore";
import toast from "react-hot-toast";

const roleColors = {
  ADMINISTRATOR: "bg-custom-600",
  MODERATOR: "bg-green-600",
  MEMBER: "bg-blue-600",
};

// Permission mapping from numbers to strings
const permissionMap = {
  0: "MEMBER",
  1: "MODERATOR",
  2: "ADMINISTRATOR",
};

const Team = () => {
  const { projectId } = useParams();
  const { user: currentUser } = useAuthStore();
  const { projectRole } = useProjectRole();
  const [members, setMembers] = useState([]);
  const [showInvite, setShowInvite] = useState(false);
  const [roleFilter, setRoleFilter] = useState("");
  const [editing, setEditing] = useState(null);
  const [memberToRemove, setMemberToRemove] = useState(null);

  // Check permissions using projectRole from useProjectRole hook
  const canInviteMembers = can(projectRole, PERMISSIONS.INVITE_MEMBER);
  const canEditRoles = can(projectRole, PERMISSIONS.EDIT_ROLE);
  const canRemoveMembers = can(projectRole, PERMISSIONS.REMOVE_MEMBER);
  useEffect(() => {
    fetchTeam();
  }, [projectId]);
  const fetchTeam = async () => {
    try {
      const response = await getProjectMembers(projectId);
      // Transform the response to match the expected structure
      const transformedMembers = response.memberships.map((membership) => ({
        id: membership.id,
        userId: membership.user.id,
        permission: permissionMap[membership.permission] || "MEMBER",
        user: membership.user,
        isCreator: membership.permission === 2, // Administrator is the creator
      }));
      setMembers(transformedMembers);
    } catch (err) {
      console.error("Error fetching team members:", err);
      toast.error("Failed to load team members");
    }
  };  const handleRemove = async (memberId, userId) => {
    try {
      const memberToRemove = members.find((m) => m.id === memberId);
      if (!memberToRemove) return;

      // Prevent removing project creator (administrator)
      if (memberToRemove.isCreator) {
        toast.error("Cannot remove project creator");
        return;
      }

      // Prevent removing yourself if you're the only administrator
      const administrators = members.filter(
        (m) => m.permission === "ADMINISTRATOR"
      );
      if (userId === currentUser?.id && administrators.length === 1) {
        toast.error("Cannot remove yourself as the only administrator");
        return;
      }

      // Use membership ID instead of user ID for removal
      await removeProjectMember(projectId, memberId);
      setMembers((prev) => prev.filter((m) => m.id !== memberId));
      toast.success("Member removed successfully");
    } catch (err) {
      console.error("Error removing member:", err);
      toast.error("Failed to remove member");
    }
  };

  const filteredMembers = members.filter((m) =>
    roleFilter ? m.permission === roleFilter : true
  );

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
    const initials =
      user?.fullName
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
    <div className="space-y-10 p-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-blue-500 text-transparent bg-clip-text drop-shadow-md">
          👥 Team Members
        </h1>{" "}
        <div className="flex items-center gap-3">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-1.5 rounded-lg text-sm bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-800 dark:text-white shadow"
          >
            <option value="">All Roles</option>
            <option value="MEMBER">Member</option>
            <option value="MODERATOR">Moderator</option>
            <option value="ADMINISTRATOR">Administrator</option>
          </select>
          {canInviteMembers && (
            <button
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-gradient-to-r from-primary to-blue-500 text-white rounded-lg hover:opacity-90 transition shadow-md"
              onClick={() => setShowInvite(true)}
            >
              <Plus size={16} />
              Invite
            </button>
          )}
          {!canInviteMembers && (
            <div className="text-sm text-gray-500 dark:text-gray-400 italic">
              You don't have permission to invite members
            </div>
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredMembers.map((m) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative bg-white dark:bg-gradient-to-br dark:from-gray-900 dark:to-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-5 shadow-xl hover:shadow-2xl transition"
            >
              {" "}
              <div className="flex items-center gap-4">
                {renderAvatar(m.user)}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {m.user?.fullName || "Unknown"}
                    </p>{" "}
                    {m.isCreator && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 font-medium">
                        Creator
                      </span>
                    )}
                    {m.userId === currentUser?.id && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium">
                        You
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {m.user?.email || "N/A"}
                  </p>
                </div>
              </div>{" "}
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full text-white ${
                      roleColors[m.permission] || "bg-gray-500"
                    }`}
                  >
                    {m.permission}
                  </span>{" "}
                  {m.isCreator && (
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      (Project Creator)
                    </span>
                  )}
                </div>{" "}
                <div className="flex gap-2">
                  {" "}
                  {canEditRoles && !m.isCreator && (
                    <button
                      onClick={() => setEditing(m)}
                      className="text-blue-500 hover:text-blue-700"
                      title="Edit Role"
                    >
                      <Pencil size={16} />
                    </button>
                  )}
                  {canRemoveMembers && !m.isCreator && (
                    <button
                      onClick={() => setMemberToRemove(m)}
                      className="text-red-500 hover:text-red-700"
                      title="Remove Member"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                  {m.isCreator && (
                    <span className="text-xs text-gray-400 dark:text-gray-500 italic">
                      Cannot be removed
                    </span>
                  )}
                  {!canRemoveMembers && !m.isCreator && (
                    <span className="text-xs text-gray-400 dark:text-gray-500 italic">
                      No permission to remove
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      {filteredMembers.length === 0 && (
        <p className="text-center text-gray-500 dark:text-gray-400 text-sm py-12">
          No matching members.
        </p>
      )}{" "}
      {showInvite && (
        <InviteTeamMemberModal
          onClose={() => setShowInvite(false)}
          onAdd={(newMember) => {
            fetchTeam();
          }}
        />
      )}      {editing && (
        <EditTeamMemberModal
          member={editing}
          onClose={() => setEditing(null)}
          onSave={(updated) =>
            setMembers((prev) =>
              prev.map((m) => (m.id === updated.id ? updated : m))
            )
          }
        />
      )}
      {memberToRemove && (
        <ConfirmDeleteModal
          name={memberToRemove.user?.fullName || "this member"}
          type="team member"
          onClose={() => setMemberToRemove(null)}
          onConfirm={() => {
            handleRemove(memberToRemove.id, memberToRemove.userId);
            setMemberToRemove(null);
          }}
        />
      )}
    </div>
  );
};

export default Team;

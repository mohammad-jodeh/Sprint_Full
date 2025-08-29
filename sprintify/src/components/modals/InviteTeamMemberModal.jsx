import { useState, useEffect } from "react";
import { X, Search, User, Mail, CheckCircle, AlertCircle } from "lucide-react";
import { useParams } from "react-router-dom";
import api from "../../api/config";
import { getProjectMembers, addProjectMember } from "../../api/projectMembers";
import { getUserByEmailOrId } from "../../api/getUserByEmailOrId";
import Portal from "../ui/Portal";
import useAuthStore from "../../store/authstore";
import toast from "react-hot-toast";

export default function InviteTeamMemberModal({ onClose, onAdd }) {
  const { projectId } = useParams();
  const { user } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [permission, setPermission] = useState("MEMBER");
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [disabledIds, setDisabledIds] = useState([]);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success"); // "success" or "error"

  // Permission mapping to match API expectations
  const permissionMap = {
    "MEMBER": 0,
    "MODERATOR": 1,
    // "ADMINISTRATOR": 2
  };

  const roleColors = {
    MEMBER: "bg-blue-600",
    MODERATOR: "bg-green-600", 
    ADMINISTRATOR: "bg-purple-600"
  };

  useEffect(() => {
    // Get existing project members to prevent duplicate invites
    getProjectMembers(projectId)
      .then((response) => {
        const memberIds = response.memberships.map(m => m.user.id);
        setDisabledIds(memberIds);
      })
      .catch((err) => {      console.error("Failed to fetch project members:", err);
    });
  }, [projectId]);

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

  const handleSearch = async () => {
    if (searchTerm.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    setSearching(true);
    try {
      // Check if search looks like an email (contains @)
      const isEmail = searchTerm.includes("@");

      if (isEmail) {
        const response = await getUserByEmailOrId(null, searchTerm);
        if (response.success && response.user) {
          const user = response.user;
          // Check if user is already a member
          if (!disabledIds.includes(user.id)) {
            setSearchResults([user]);
          } else {
            setSearchResults([]);
            showCustomToast("User is already a member of this project", "error");
          }
        } else {
          setSearchResults([]);
          showCustomToast("User not found", "error");
        }
      } else {
        // Search by name through all users
        const response = await api.get("/users");
        const filtered = response.data.filter(u => 
          u.fullName.toLowerCase().includes(searchTerm.toLowerCase()) &&
          u.id !== user?.id &&
          !disabledIds.includes(u.id)
        );
        setSearchResults(filtered.slice(0, 10)); // Limit to 10 results
      }
    } catch (error) {
      console.error("Search failed:", error);
      showCustomToast("Search failed", "error");
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  };

  const handleInvite = async () => {
    if (!selectedUser) {
      showCustomToast("Please select a user to invite", "error");
      return;
    }

    setLoading(true);
    try {
      const memberData = {
        userId: selectedUser.id,
        permission: permissionMap[permission]
      };
      
      const result = await addProjectMember(projectId, memberData);
      showCustomToast(`${selectedUser.fullName} has been invited as ${permission.toLowerCase()}`, "success");
      onAdd(result);
      onClose();
    } catch (err) {
      console.error("Invite failed:", err);
      showCustomToast("Failed to invite member", "error");
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
          className="h-10 w-10 rounded-full object-cover border border-gray-300 dark:border-gray-700"
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
      <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold">
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
            👥 Invite Team Member
          </h2>

          {/* Search Section */}
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-800 dark:text-gray-300 mb-2">
                Search for User
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    placeholder="Enter name or email..."
                    className="w-full pl-10 pr-4 py-2 rounded-lg border bg-white text-gray-800 dark:bg-gray-800 dark:text-white border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <button
                  onClick={handleSearch}
                  disabled={searching || searchTerm.trim().length < 2}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/80 disabled:opacity-50 transition"
                >
                  {searching ? "..." : "Search"}
                </button>
              </div>
            </div>

            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className="max-h-40 overflow-y-auto space-y-2 border border-gray-200 dark:border-gray-700 rounded-lg p-2">
                {searchResults.map((user) => (
                  <div
                    key={user.id}
                    onClick={() => setSelectedUser(user)}
                    className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition ${
                      selectedUser?.id === user.id
                        ? "bg-primary/10 border-2 border-primary"
                        : "hover:bg-gray-100 dark:hover:bg-gray-700 border border-transparent"
                    }`}
                  >
                    {renderAvatar(user)}
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 dark:text-white">{user.fullName}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {searchTerm && searchResults.length === 0 && !searching && (
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                No users found. Try searching by email or full name.
              </p>
            )}
          </div>

          {/* Selected User */}
          {selectedUser && (
            <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <label className="block text-sm font-medium text-gray-800 dark:text-gray-300 mb-2">
                Selected User
              </label>
              <div className="flex items-center gap-3">
                {renderAvatar(selectedUser)}
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{selectedUser.fullName}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{selectedUser.email}</p>
                </div>
              </div>
            </div>
          )}

          {/* Role Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-800 dark:text-gray-300 mb-2">
              Role
            </label>
            <div className="grid grid-cols-3 gap-2">
              {Object.keys(permissionMap).map((role) => (
                <button
                  key={role}
                  onClick={() => setPermission(role)}
                  className={`p-3 rounded-lg border-2 transition ${
                    permission === role
                      ? `${roleColors[role]} text-white border-transparent`
                      : "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-primary"
                  }`}
                >
                  <div className="text-center">
                    <div className="font-medium text-sm">{role}</div>
                  </div>
                </button>
              ))}
            </div>
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
              onClick={handleInvite}
              disabled={!selectedUser || loading}
              className="bg-gradient-to-r from-primary to-blue-500 text-white px-6 py-2 rounded-lg font-semibold shadow-md hover:opacity-90 transition disabled:opacity-50"
            >
              {loading ? "Inviting..." : "Invite Member"}
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

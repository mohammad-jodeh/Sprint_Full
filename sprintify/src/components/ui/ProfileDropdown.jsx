import { useState, useEffect } from "react";
import { User2Icon, LogOut, MessageCircle, Settings } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import DropdownItem from "./DropdownItem";
import ThemeToggle from "../ThemeToggle";
import ConfirmModalLogout from "../modals/ConfirmModalLogout";
import useAuthStore from "../../store/authstore";

const ProfileDropdown = ({ isOpen, dropdownRef }) => {
  const navigate = useNavigate();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const { user, clearAuth } = useAuthStore();

  // Reset logout modal when dropdown closes
  useEffect(() => {
    if (!isOpen && showLogoutConfirm) setShowLogoutConfirm(false);
  }, [isOpen, showLogoutConfirm]);

  const handleLogout = () => {
    clearAuth(); // Use auth store's clearAuth method
    navigate("/login");
  };

  if (!isOpen) return null;

  return (
    <div
      className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700 z-[9999]"
      ref={dropdownRef}
    >
      {" "}
      {/* User info */}
      <div className="px-4 pt-4 pb-2">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
            {user?.image ? (
              <img
                src={user.image}
                alt={user?.fullName || "User"}
                className="w-full h-full object-cover"
              />
            ) : (
              <User2Icon size={20} className="text-primary" />
            )}
          </div>
          <div>
            <p className="font-medium text-gray-900 dark:text-white">
              {user?.fullName || "Unknown User"}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {user?.email || "No email"}
            </p>
          </div>
        </div>
      </div>
      {/* Menu items */}
      <div className="mt-2">
        <Link to="/profile">
          <DropdownItem icon={<User2Icon size={16} />}>
            Your Profile
          </DropdownItem>
        </Link>
        <Link to="/dashboard/notifications">
          <DropdownItem icon={<MessageCircle size={16} />}>
            Notifications
          </DropdownItem>
        </Link>
        <DropdownItem icon={<Settings size={16} />}>Settings</DropdownItem>
      </div>
      {/* Theme toggle */}
      <div className="px-4 py-3 mt-1 border-t border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-300">
            Theme Mode
          </span>
          <ThemeToggle />
        </div>
      </div>
      {/* Logout */}
      <div className="border-t border-gray-100 dark:border-gray-700">
        <button
          onClick={() => setShowLogoutConfirm(true)}
          className="w-full text-left px-4 py-2 flex items-center gap-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 text-sm"
        >
          <LogOut size={16} />
          Log Out
        </button>
      </div>
      {/* Confirm modal for logout */}
      <ConfirmModalLogout
        open={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={handleLogout}
      />
    </div>
  );
};

export default ProfileDropdown;
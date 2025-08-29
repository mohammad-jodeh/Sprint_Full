import { useState } from "react";
import {
  Home,
  Workflow,
  ListTodoIcon,
  MessageCircleIcon,
  DoorOpen,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import SideLinks from "../ui/SideLinks";
import ConfirmModalLogout from "../modals/ConfirmModalLogout";

export default function Sidebar() {
  const navigate = useNavigate();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = () => {
    localStorage.clear(); // Optional: clear token/session
    navigate("/login");
  };

  const links = [
    {
      to: "/dashboard",
      icon: <Home className="mr-3 h-6 w-6 text-gray-500 dark:text-gray-400" />,
      text: "Dashboard",
    },
    {
      to: "/dashboard/projects",
      icon: (
        <Workflow className="mr-3 h-6 w-6 text-gray-500 dark:text-gray-400" />
      ),
      text: "Projects",
    },
    {
      to: "/dashboard/tasks",
      icon: (
        <ListTodoIcon className="mr-3 h-6 w-6 text-gray-500 dark:text-gray-400" />
      ),
      text: "Tasks",
    },
    {
      to: "/dashboard/notifications",
      icon: (
        <MessageCircleIcon className="mr-3 h-6 w-6 text-gray-500 dark:text-gray-400" />
      ),
      text: "Notifications",
    },
  ];

  return (
    <nav className="px-4 py-6 space-y-1">
      {links.map((link, index) => (
        <SideLinks key={index} to={link.to} icon={link.icon} text={link.text} />
      ))}

      <button
        onClick={() => setShowLogoutConfirm(true)}
        className="flex items-center px-3 py-2 rounded-md w-full text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700/40 transition duration-150"
      >
        <DoorOpen className="mr-3 h-6 w-6 text-gray-500 dark:text-gray-400" />
        Logout
      </button>

      {/* Confirm logout modal */}
      <ConfirmModalLogout
        open={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={handleLogout}
      />
    </nav>
  );
}

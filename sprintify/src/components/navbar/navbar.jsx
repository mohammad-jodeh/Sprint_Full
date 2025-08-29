import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import SearchBar from "../ui/SearchBar";
import ProfileDropdown from "../ui/ProfileDropdown";
import { Plus, User2Icon } from "lucide-react";

const Logo = () => (
  <div className="text-xl font-bold text-primary">Sprintify</div>
);

const NewProjectButton = () => {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate("projects?new=true")}
      className="px-4 py-2 bg-primary hover:bg-primary-hover text-white font-medium rounded-lg transition-all duration-200 flex items-center gap-2"
      aria-label="Create new project"
    >
      <Plus size={18} />
      <span>New Project</span>
    </button>
  );
};

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();

  // Show search bar only on the dashboard/projects page
  const isProjectPage = location.pathname === "/dashboard/projects";

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  return (
    <header className="relative z-[9999] bg-white dark:bg-gradient-header shadow-sm border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4 py-3">
      <Logo />
      {isProjectPage && <SearchBar />}
      <div className="flex items-center space-x-4 relative" ref={dropdownRef}>
        <NewProjectButton />
        <button
          onClick={() => setOpen(!open)}
          className="h-9 w-9 rounded-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 flex items-center justify-center text-gray-600 dark:text-gray-300 transition-colors"
          aria-expanded={open}
          aria-haspopup="true"
          aria-label="User menu"
        >
          <User2Icon size={20} />
        </button>
        <ProfileDropdown isOpen={open} dropdownRef={dropdownRef} />
      </div>
    </header>
  );
}

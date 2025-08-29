import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Plus, User2Icon } from "lucide-react";
import ProfileDropdown from "../ui/ProfileDropdown";

const Logo = () => (
  <div className="text-xl font-bold text-primary">Sprintify</div>
);

export default function NavbarProject() {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { projectId } = useParams();

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
      <div className="flex items-center space-x-4 relative" ref={dropdownRef}>
        {/* Navigate to Backlog with modal param */}
        <button
          onClick={() =>
            navigate(`/projects/${projectId}/backlog?modal=create-issue`)
          }
          className="px-4 py-2 bg-primary hover:bg-primary-hover text-white font-medium rounded-lg transition-all duration-200 flex items-center gap-2"
        >
          <Plus size={18} />
          <span>New Issue</span>
        </button>

        {/* Profile Menu */}
        <button
          onClick={() => setOpen(!open)}
          className="h-9 w-9 rounded-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 flex items-center justify-center text-gray-600 dark:text-gray-300 transition-colors"
        >
          <User2Icon size={20} />
        </button>
        <ProfileDropdown isOpen={open} dropdownRef={dropdownRef} />
      </div>
    </header>
  );
}
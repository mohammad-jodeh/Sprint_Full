// DropdownItem component for dropdown menu items
const DropdownItem = ({ icon, children, onClick, className = "" }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-3 w-full px-4 py-2.5 text-sm text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${className}`}
  >
    <span className="flex-shrink-0 w-5 h-5 flex items-center justify-center text-gray-500 dark:text-gray-400">
      {icon}
    </span>
    <span className="text-gray-700 dark:text-gray-200">{children}</span>
  </button>
);
export default DropdownItem;

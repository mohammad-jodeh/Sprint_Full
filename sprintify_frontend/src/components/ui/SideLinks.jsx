import { Link  , useLocation} from "react-router-dom";

export default function SideLinks({ to, icon, text }) {
  const pathname =  useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`flex items-center px-3 py-2 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700/40 transition duration-150 ${
        isActive && "text-primary border-l-4 border-primary dark:border-primary"
      }`}
    >
      {icon}
      {text}
    </Link>
  );
}
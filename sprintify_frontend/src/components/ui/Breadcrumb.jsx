import { Link, useLocation } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";

const Breadcrumb = ({ customPaths = [] }) => {
  const location = useLocation();

  // Generate breadcrumbs from URL path
  const generateBreadcrumbs = () => {
    const paths = location.pathname.split("/").filter(Boolean);
    const breadcrumbs = [{ name: "Home", path: "/" }];

    let currentPath = "";
    paths.forEach((path, index) => {
      currentPath += `/${path}`;

      // Format the name
      let name = path
        .replace(/-/g, " ")
        .replace(/([a-z])([A-Z])/g, "$1 $2")
        .replace(/[a-z]/i, (char) => (index === 0 ? char.toUpperCase() : char));

      // Skip UUID paths, use custom instead
      if (path.match(/^[0-9a-f]{8}-/i)) {
        name = customPaths[index] || "Project";
      }

      breadcrumbs.push({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        path: currentPath,
      });
    });

    return breadcrumbs.slice(0, -1); // Remove last one (current page)
  };

  const breadcrumbs = generateBreadcrumbs();

  if (breadcrumbs.length <= 1) return null;

  return (
    <nav className="flex items-center gap-1 text-sm mb-4" aria-label="Breadcrumb">
      {breadcrumbs.map((crumb, index) => (
        <div key={index} className="flex items-center gap-1">
          {index === 0 ? (
            <Link
              to={crumb.path}
              className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition"
            >
              <Home size={16} />
            </Link>
          ) : (
            <>
              <ChevronRight size={14} className="text-gray-400 dark:text-gray-600" />
              <Link
                to={crumb.path}
                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition"
              >
                {crumb.name}
              </Link>
            </>
          )}
        </div>
      ))}
    </nav>
  );
};

export default Breadcrumb;

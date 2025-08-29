import { ArrowRight, Pencil, Trash2 } from "lucide-react";

export default function ProjectCard({
  project = {},
  onClick,
  onEdit,
  onDelete,
}) {
  const {
    name = "Untitled Project",
    keyPrefix = "---",
    creatorName = "Unknown",
    memberCount = 0,
  } = project;

  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onClick?.()}
      className="group relative bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition cursor-pointer p-5 space-y-4"
    >
      {/* Project Name & Prefix */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {name}
        </h3>
        <span className="text-xs font-medium bg-primary/10 text-primary px-2 py-1 rounded-full">
          {keyPrefix}
        </span>
      </div>

      {/* Creator & Member Info */}
      <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
        <p>
          👤 Created by: <span className="font-medium">{creatorName}</span>
        </p>
        <p>
          👥 {memberCount} member{memberCount !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Footer: Actions */}
      <div className="flex justify-between items-center pt-2 border-t border-gray-100 dark:border-gray-700 mt-2">
        <span className="text-sm text-primary font-medium group-hover:text-primary-hover">
          View Details
        </span>
        <div className="flex items-center gap-3">
          {onEdit && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              title="Edit"
              className="text-gray-500 hover:text-primary"
            >
              <Pencil size={16} />
            </button>
          )}
          {onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              title="Delete"
              className="text-red-500 hover:text-red-600"
            >
              <Trash2 size={16} />
            </button>
          )}
          <ArrowRight
            size={16}
            className="text-primary group-hover:text-primary-hover"
          />
        </div>
      </div>
    </div>
  );
}

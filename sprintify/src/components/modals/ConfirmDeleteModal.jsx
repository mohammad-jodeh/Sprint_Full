import { X } from "lucide-react";
import BaseModal from "../ui/BaseModal";

export default function ConfirmDeleteModal({
  name = "this item",
  type = "item",
  title,
  message,
  onClose,
  onConfirm,
}) {
  const defaultTitle =
    title || `Delete ${type.charAt(0).toUpperCase() + type.slice(1)}`;
  const defaultMessage =
    message ||
    `Are you sure you want to delete "${name}"? This action cannot be undone.`;

  return (
    <BaseModal onClose={onClose}>
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        aria-label="Close"
      >
        <X size={20} />
      </button>

      <h2 className="text-xl font-bold text-red-600 mb-4">{defaultTitle}</h2>

      <p className="text-sm text-gray-700 dark:text-gray-300 mb-6">
        {defaultMessage}
      </p>

      <div className="flex justify-end gap-3">
        <button
          onClick={onClose}
          className="px-4 py-2 text-sm rounded-md bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-100"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="px-4 py-2 text-sm rounded-md bg-red-600 hover:bg-red-700 text-white font-semibold"
        >
          Delete
        </button>
      </div>
    </BaseModal>
  );
}

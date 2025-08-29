import React from "react";
import { X } from "lucide-react";
import Portal from "../ui/Portal";

const ConfirmModalLogout = ({ open, onClose, onConfirm }) => {
  if (!open) return null;
  return (
    <Portal>
      <div className="fixed inset-0 z-[100000] flex items-center justify-center bg-black/40 backdrop-blur-sm">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-sm w-full shadow-xl relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 dark:hover:text-white"
          >
            <X size={18} />
          </button>

          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
            Log Out
          </h2>

          <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
            Are you sure you want to log out? You will need to log in again to
            access your projects.
          </p>

          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm rounded-md bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 text-sm rounded-md bg-red-500 hover:bg-red-600 text-white"
            >
              Log Out
            </button>
          </div>
        </div>
      </div>
    </Portal>
  );
};

export default ConfirmModalLogout;

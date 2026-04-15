import React, { useState } from "react";

export const useConfirmDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);

  const confirm = (config) => {
    return new Promise((resolve) => {
      setPendingAction({
        title: config.title,
        message: config.message,
        confirmText: config.confirmText || "Delete",
        cancelText: config.cancelText || "Cancel",
        isDangerous: config.isDangerous !== false,
        onConfirm: () => {
          setIsOpen(false);
          resolve(true);
        },
        onCancel: () => {
          setIsOpen(false);
          resolve(false);
        },
      });
      setIsOpen(true);
    });
  };

  return { isOpen, pendingAction, confirm };
};

export const ConfirmDialog = ({ isOpen, pendingAction, onClose }) => {
  if (!isOpen || !pendingAction) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 max-w-md w-full mx-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          {pendingAction.title}
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          {pendingAction.message}
        </p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={() => {
              pendingAction.onCancel();
              onClose();
            }}
            className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 transition"
          >
            {pendingAction.cancelText}
          </button>
          <button
            onClick={() => {
              pendingAction.onConfirm();
              onClose();
            }}
            className={`px-4 py-2 rounded text-white font-medium transition ${
              pendingAction.isDangerous
                ? "bg-red-600 hover:bg-red-700"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {pendingAction.confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

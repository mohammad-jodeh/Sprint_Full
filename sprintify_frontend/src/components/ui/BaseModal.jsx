import Portal from "../ui/Portal";

export default function BaseModal({ children, onClose }) {
  return (
    <Portal>
      <div className="fixed inset-0 z-[110000] flex items-center justify-center bg-black/30 dark:bg-black/50 backdrop-blur-sm">
        {/* Backdrop Click Closes Modal */}
        <div className="absolute inset-0 cursor-default" onClick={onClose} />

        {/* Modal Content */}
        <div className="relative z-10 bg-white dark:bg-gray-900 rounded-xl shadow-xl max-w-lg w-full p-6">
          {children}
        </div>
      </div>
    </Portal>
  );
}

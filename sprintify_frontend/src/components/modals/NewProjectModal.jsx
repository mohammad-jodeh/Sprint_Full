import { useEffect, useState } from "react";
import { Users2, X } from "lucide-react";
import BaseModal from "../ui/BaseModal";
import FormField from "../ui/FormField";
import SelectUsersModal from "./SelectUsersModal";
import toast from "react-hot-toast";

export default function NewProjectModal({ onClose, onCreate, project }) {
  const [form, setForm] = useState({
    id: project?.id || null,
    name: project?.name || "",
    keyPrefix: project?.keyPrefix || "",
    members: project?.members || [],
  });
  const [showMemberModal, setShowMemberModal] = useState(false);

  useEffect(() => {
    if (!form.id && form.name.trim()) {
      // Only for create mode (no ID  )
      const prefix = form.name
        .trim()
        .replace(/[^A-Za-z]/g, "") // Remove all non-letter characters
        .slice(0, 5)
        .toUpperCase();
      setForm((prev) => ({ ...prev, keyPrefix: prefix }));
    }
  }, [form.name, form.id]);

  // ESC to close
  useEffect(() => {
    const handleEsc = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);
  const handleSubmit = () => {
    if (!form.name.trim() || !form.keyPrefix.trim()) return;

    // Check if auto-generated key prefix is too short (create mode)
    if (!form.id && form.keyPrefix.length < 5) {
      toast.error(
        "Project name must contain at least 5 letters to generate a valid key prefix."
      );
      return;
    }

    // Check if manually entered key prefix is exactly 5 letters (edit mode)
    if (form.id && form.keyPrefix.length !== 5) {
      toast.error("Key prefix must be exactly 5 letters.");
      return;
    }

    const clean = { ...form };
    onCreate(clean);
    onClose();
  };

  return (
    <BaseModal onClose={onClose}>
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
      >
        <X size={20} />
      </button>
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
        {form.id ? "Edit Project" : "Create New Project"}
      </h2>
      <div className="space-y-5">
        <FormField label="Project Name">
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="e.g. Sprintify App"
          />
        </FormField>{" "}
        <FormField
          label={
            form.id
              ? "Key Prefix (Exactly 5 Letters)"
              : "Key Prefix (Auto-generated)"
          }
        >
          {" "}
          <input
            type="text"
            value={form.keyPrefix}
            onChange={(e) => {
              // Only allow letters and limit to 5 characters
              const lettersOnly = e.target.value
                .replace(/[^A-Za-z]/g, "")
                .toUpperCase()
                .slice(0, 5);
              setForm({ ...form, keyPrefix: lettersOnly });
            }}
            className={`w-full px-4 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-primary ${
               "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          
            }`}
            placeholder="e.g. SPRT (exactly 5 letters)"
            maxLength="5"
          />{" "}
          {!form.id && form.keyPrefix.length < 5 && form.name.trim() && (
            <p className="mt-1 text-xs text-red-500">
              Project name needs at least 5 letters to generate a valid key
              prefix. Current: {form.keyPrefix.length}/5
            </p>
          )}
          {form.id && form.keyPrefix.length < 5 && (
            <p className="mt-1 text-xs text-red-500">
              Key prefix must be exactly 5 letters. Current:{" "}
              {form.keyPrefix.length}/5
            </p>
          )}
        </FormField>
        <FormField label="Assign Members">
          <button
            onClick={() => setShowMemberModal(true)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-lg text-sm flex items-center justify-center gap-2 text-gray-800 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          >
            {" "}
            <Users2 size={16} />
            {form.members.length > 0
              ? `${form.members.length} member${
                  form.members.length === 1 ? "" : "s"
                } selected`
              : "Select Members"}
          </button>
        </FormField>
      </div>
      <div className="pt-6 mt-6 border-t dark:border-gray-700 flex justify-end">
        <button
          onClick={handleSubmit}
          className="px-6 py-2 rounded-lg bg-primary hover:bg-primary-hover text-white font-medium text-sm transition"
        >
          {form.id ? "Update Project" : "Create Project"}
        </button>
      </div>{" "}
      {showMemberModal && (
        <SelectUsersModal
          onClose={() => setShowMemberModal(false)}
          // onSelect={(userIds) => {}}
          members={form.members}
          projectId={form.id}
        />
      )}
    </BaseModal>
  );
}

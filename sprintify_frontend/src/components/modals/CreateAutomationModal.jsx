import React, { useState, useEffect } from "react";
import { X, Save, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";

const CreateAutomationModal = ({ projectId, isOpen, onClose, onSave, rule = null, statuses = [], users = [] }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    triggerType: "status_changed",
    triggerCondition: {},
    actionType: "auto_transition",
    actionPayload: {},
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (rule) {
      setFormData(rule);
    } else {
      resetForm();
    }
  }, [rule, isOpen]);

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      triggerType: "status_changed",
      triggerCondition: {},
      actionType: "auto_transition",
      actionPayload: {},
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTriggerConditionChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      triggerCondition: { ...prev.triggerCondition, [name]: value },
    }));
  };

  const handleActionPayloadChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      actionPayload: { ...prev.actionPayload, [name]: value },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Rule name is required");
      return;
    }

    try {
      setLoading(true);
      await onSave(formData);
      resetForm();
      onClose();
      toast.success(rule ? "Rule updated successfully!" : "Rule created successfully!");
    } catch (error) {
      toast.error("Error saving rule");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {rule ? "Edit Automation Rule" : "Create Automation Rule"}
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Rule Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Rule Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="e.g., Auto-close completed issues"
              className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Optional description of what this rule does"
              rows="2"
              className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Trigger Section */}
          <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg space-y-4">
            <h3 className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
              <AlertCircle size={16} /> When this happens:
            </h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Trigger Type
              </label>
              <select
                name="triggerType"
                value={formData.triggerType}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="status_changed">Status Changed</option>
                <option value="issue_created">Issue Created</option>
                <option value="priority_changed">Priority Changed</option>
                <option value="assignee_changed">Assignee Changed</option>
                <option value="due_date_approaching">Due Date Approaching</option>
              </select>
            </div>

            {/* Trigger Condition - Status Changed */}
            {formData.triggerType === "status_changed" && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    From Status
                  </label>
                  <select
                    name="fromStatus"
                    value={formData.triggerCondition.fromStatus || ""}
                    onChange={handleTriggerConditionChange}
                    className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    <option value="">Any Status</option>
                    {statuses.map((s) => (
                      <option key={s.id} value={s.name}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    To Status
                  </label>
                  <select
                    name="toStatus"
                    value={formData.triggerCondition.toStatus || ""}
                    onChange={handleTriggerConditionChange}
                    className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    <option value="">Select Status</option>
                    {statuses.map((s) => (
                      <option key={s.id} value={s.name}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Trigger Condition - Priority Changed */}
            {formData.triggerType === "priority_changed" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Priority Level
                </label>
                <select
                  name="priority"
                  value={formData.triggerCondition.priority || ""}
                  onChange={handleTriggerConditionChange}
                  className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="">Any Priority</option>
                  <option value="HIGH">High</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="LOW">Low</option>
                </select>
              </div>
            )}
          </div>

          {/* Action Section */}
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg space-y-4">
            <h3 className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
              <Save size={16} /> Perform this action:
            </h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Action Type
              </label>
              <select
                name="actionType"
                value={formData.actionType}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="auto_transition">Auto-Transition to Status</option>
                <option value="assign_user">Auto-Assign to User</option>
                <option value="notify_user">Send Notification</option>
                <option value="add_comment">Add Auto-Comment</option>
                <option value="send_webhook">Send Webhook</option>
              </select>
            </div>

            {/* Action Payload - Auto Transition */}
            {formData.actionType === "auto_transition" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Move to Status
                </label>
                <select
                  name="targetStatusId"
                  value={formData.actionPayload.targetStatusId || ""}
                  onChange={handleActionPayloadChange}
                  className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="">Select Status</option>
                  {statuses.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Action Payload - Assign User */}
            {formData.actionType === "assign_user" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Assign to User
                </label>
                <select
                  name="userId"
                  value={formData.actionPayload.userId || ""}
                  onChange={handleActionPayloadChange}
                  className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="">Select User</option>
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name || u.email}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Action Payload - Comment */}
            {formData.actionType === "add_comment" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Comment Message
                </label>
                <textarea
                  name="message"
                  value={formData.actionPayload.message || ""}
                  onChange={handleActionPayloadChange}
                  placeholder="Enter the comment text"
                  rows="3"
                  className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
            )}

            {/* Action Payload - Webhook */}
            {formData.actionType === "send_webhook" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Webhook URL
                </label>
                <input
                  type="url"
                  name="webhookUrl"
                  value={formData.actionPayload.webhookUrl || ""}
                  onChange={handleActionPayloadChange}
                  placeholder="https://example.com/webhook"
                  className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-3 justify-end pt-4 border-t dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover disabled:opacity-50"
            >
              {loading ? "Saving..." : rule ? "Update Rule" : "Create Rule"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateAutomationModal;

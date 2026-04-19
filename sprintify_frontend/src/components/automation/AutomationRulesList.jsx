import React, { useState, useEffect } from "react";
import { Edit2, Trash2, ToggleRight, ToggleLeft, Plus, Loader } from "lucide-react";
import toast from "react-hot-toast";
import * as automationAPI from "../../api/automation";
import CreateAutomationModal from "../modals/CreateAutomationModal";

const AutomationRulesList = ({ projectId, statuses = [], users = [] }) => {
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRule, setSelectedRule] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    loadRules();
  }, [projectId]);

  const loadRules = async () => {
    try {
      setLoading(true);
      const data = await automationAPI.getRules(projectId);
      setRules(data || []);
    } catch (error) {
      toast.error("Failed to load automation rules");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRule = () => {
    setSelectedRule(null);
    setIsModalOpen(true);
  };

  const handleEditRule = (rule) => {
    setSelectedRule(rule);
    setIsModalOpen(true);
  };

  const handleSaveRule = async (formData) => {
    try {
      if (selectedRule) {
        await automationAPI.updateRule(projectId, selectedRule.id, formData);
      } else {
        await automationAPI.createRule(projectId, formData);
      }
      await loadRules();
    } catch (error) {
      toast.error("Failed to save rule");
      throw error;
    }
  };

  const handleToggleRule = async (ruleId) => {
    try {
      await automationAPI.toggleRuleStatus(projectId, ruleId);
      await loadRules();
      toast.success("Rule status updated");
    } catch (error) {
      toast.error("Failed to toggle rule");
    }
  };

  const handleDeleteRule = async (ruleId) => {
    if (window.confirm("Are you sure you want to delete this automation rule?")) {
      try {
        await automationAPI.deleteRule(projectId, ruleId);
        await loadRules();
        toast.success("Rule deleted successfully");
      } catch (error) {
        toast.error("Failed to delete rule");
      }
    }
  };

  const getTriggerLabel = (triggerType) => {
    const labels = {
      status_changed: "Status Changed",
      issue_created: "Issue Created",
      priority_changed: "Priority Changed",
      assignee_changed: "Assignee Changed",
      due_date_approaching: "Due Date Approaching",
      issue_commented: "Issue Commented",
    };
    return labels[triggerType] || triggerType;
  };

  const getActionLabel = (actionType) => {
    const labels = {
      auto_transition: "Auto-Transition",
      assign_user: "Auto-Assign",
      notify_user: "Send Notification",
      add_comment: "Add Comment",
      create_subtask: "Create Subtask",
      send_webhook: "Send Webhook",
    };
    return labels[actionType] || actionType;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Automation Rules
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Create rules to automate repetitive tasks
          </p>
        </div>
        <button
          onClick={handleCreateRule}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition"
        >
          <Plus size={18} /> Create Rule
        </button>
      </div>

      {/* Modal */}
      <CreateAutomationModal
        projectId={projectId}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedRule(null);
        }}
        onSave={handleSaveRule}
        rule={selectedRule}
        statuses={statuses}
        users={users}
      />

      {/* Rules List */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader className="animate-spin text-primary" size={32} />
        </div>
      ) : rules.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-gray-500 dark:text-gray-400">
            No automation rules created yet. Create one to get started!
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {rules.map((rule) => (
            <div
              key={rule.id}
              className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {/* Rule Name and Status */}
                  <div className="flex items-center gap-3 mb-3">
                    <button
                      onClick={() => handleToggleRule(rule.id)}
                      className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition"
                      title={rule.isActive ? "Disable rule" : "Enable rule"}
                    >
                      {rule.isActive ? (
                        <ToggleRight size={24} className="text-green-500" />
                      ) : (
                        <ToggleLeft size={24} className="text-gray-400" />
                      )}
                    </button>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {rule.name}
                    </h3>
                    {!rule.isActive && (
                      <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded">
                        Disabled
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  {rule.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      {rule.description}
                    </p>
                  )}

                  {/* Rule Details */}
                  <div className="grid grid-cols-2 gap-4">
                    {/* Trigger */}
                    <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded">
                      <p className="text-xs font-medium text-orange-700 dark:text-orange-400 mb-1">
                        TRIGGER
                      </p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {getTriggerLabel(rule.triggerType)}
                      </p>
                      {rule.triggerCondition && Object.keys(rule.triggerCondition).length > 0 && (
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                          {Object.entries(rule.triggerCondition)
                            .map(([key, value]) => `${key}: ${value}`)
                            .join(", ")}
                        </p>
                      )}
                    </div>

                    {/* Action */}
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded">
                      <p className="text-xs font-medium text-blue-700 dark:text-blue-400 mb-1">
                        ACTION
                      </p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {getActionLabel(rule.actionType)}
                      </p>
                      {rule.actionPayload && Object.keys(rule.actionPayload).length > 0 && (
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                          {Object.entries(rule.actionPayload)
                            .slice(0, 1)
                            .map(([key, value]) => `${key}: ${String(value).slice(0, 30)}...`)
                            .join(", ")}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Metadata */}
                  <div className="mt-3 flex gap-4 text-xs text-gray-500 dark:text-gray-400">
                    <span>Created: {new Date(rule.createdAt).toLocaleDateString()}</span>
                    {rule.lastExecuted && (
                      <span>Last executed: {new Date(rule.lastExecuted).toLocaleDateString()}</span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => handleEditRule(rule)}
                    className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition"
                    title="Edit rule"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => handleDeleteRule(rule.id)}
                    className="p-2 text-gray-500 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400 rounded transition"
                    title="Delete rule"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AutomationRulesList;

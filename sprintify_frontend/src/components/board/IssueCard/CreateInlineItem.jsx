import React, { useState } from "react";
import { Plus } from "lucide-react";
import { useParams } from "react-router-dom";
import { createTask } from "../../../api/tasks";
import { useIssueForm } from "../../../hooks/useIssueForm";
import IssueFormFields from "./IssueFormFields";
import IssueFormActions from "./IssueFormActions";
import { useProjectRole } from "../../../hooks/useProjectRole";
import { can, PERMISSIONS } from "../../../utils/permission";

const CreateInlineItem = ({
  columnId,
  defaultStatusId,
  onIssueCreated,
  selectedSprintId,
}) => {
  const { projectId } = useParams();
  const { projectRole } = useProjectRole();
  const canCreateTask = can(projectRole, PERMISSIONS.CREATE_TASK);

  const [isCreating, setIsCreating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Issue form state
  const {
    title,
    description,
    storyPoint,
    setTitle,
    setDescription,
    setStoryPoint,
    resetForm,
  } = useIssueForm();
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    await handleCreateIssue();
  };
  const handleCreateIssue = async () => {
    setIsLoading(true);
    try {
      const newIssue = await createTask({
        title: title.trim(),
        description: description.trim(),
        storyPoint: parseInt(storyPoint) || 0,
        statusId: defaultStatusId,
        sprintId: selectedSprintId || null,
        assignee: null,
        projectId, // Include projectId for automatic key generation
      });

      if (onIssueCreated) {
        onIssueCreated(newIssue);
      }

      // Reset form and close creation mode
      resetForm();

      // Small delay to show success before closing
      setTimeout(() => {
        setIsCreating(false);
      }, 300);
    } catch (error) {
      console.error("Failed to create issue:", error);
      // Don't close on error, let user try again
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    resetForm();
    setIsCreating(false);
  };

  // Don't show if user has no permissions
  if (!canCreateTask) {
    return (
      <div className="w-full p-3 text-center text-sm text-gray-400 dark:text-gray-500 italic bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200/50 dark:border-gray-700/50">
        You don't have permission to create tasks
      </div>
    );
  }
  if (!isCreating) {
    return (
      <button
        onClick={() => setIsCreating(true)}
        disabled={isLoading}
        className="w-full p-3 text-left text-sm text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary hover:bg-gradient-to-r hover:from-primary/5 hover:to-primary/10 dark:hover:from-primary/10 dark:hover:to-primary/20 hover:border-primary/30 dark:hover:border-primary/40 rounded-xl border-2 border-dashed border-gray-300/50 dark:border-gray-600/50 transition-all duration-300 flex items-center group backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 group-hover:bg-primary/20 dark:group-hover:bg-primary/30 group-hover:text-primary flex items-center justify-center mr-3 transition-colors">
          <Plus size={16} className="transition-colors" />
        </div>
        Add an issue
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-3 bg-white/80 dark:bg-gradient-card backdrop-blur-sm rounded-xl border border-gray-200/50 dark:border-gray-600/50 p-4 shadow-xl animate-slide-down"
    >
      <IssueFormFields
        title={title}
        description={description}
        storyPoint={storyPoint}
        onTitleChange={setTitle}
        onDescriptionChange={setDescription}
        onStoryPointChange={setStoryPoint}
      />

      <IssueFormActions
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        submitText="Add Issue"
        isLoading={isLoading}
      />
    </form>
  );
};

export default CreateInlineItem;

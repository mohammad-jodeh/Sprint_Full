import React, { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { useParams } from "react-router-dom";
import { createTask } from "../../../api/tasks";
import { fetchStatuses } from "../../../api/statuses";
import { useIssueForm } from "../../../hooks/useIssueForm";
import IssueFormFields from "./IssueFormFields";
import IssueFormActions from "./IssueFormActions";
import { useProjectRole } from "../../../hooks/useProjectRole";
import { can, PERMISSIONS } from "../../../utils/permission";

const CreateIssue = ({
  columnId,
  defaultStatusId,
  onIssueCreated,
  activeSprint,
}) => {
  const { projectId } = useParams();
  const { projectRole } = useProjectRole();
  const canCreateTask = can(projectRole, PERMISSIONS.CREATE_TASK);
  const [isLoading, setIsLoading] = useState(false);
  const [statuses, setStatuses] = useState([]);
  const [statusesLoading, setStatusesLoading] = useState(false);

  const {
    isCreating,
    title,
    description,
    storyPoint,
    statusId,
    setIsCreating,
    setTitle,
    setDescription,
    setStoryPoint,
    setStatusId,
    resetForm,
  } = useIssueForm(null, null, defaultStatusId);

  // Fetch statuses when component mounts or when creating starts
  useEffect(() => {
    if (isCreating && projectId && statuses.length === 0) {
      fetchAvailableStatuses();
    }
  }, [isCreating, projectId, statuses.length]);

  const fetchAvailableStatuses = async () => {
    if (!projectId) return;
    
    setStatusesLoading(true);
    try {
      const fetchedStatuses = await fetchStatuses({ projectId });
      setStatuses(fetchedStatuses || []);
    } catch (error) {
      console.error("Failed to fetch statuses:", error);
      // Fallback: create a default status list if fetch fails
      setStatuses([]);
    } finally {
      setStatusesLoading(false);
    }
  };

  // Don't show the component if user doesn't have permission
  if (!canCreateTask) {
    return (
      <div className="w-full p-3 text-center text-sm text-gray-400 dark:text-gray-500 italic bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200/50 dark:border-gray-700/50">
        You don't have permission to create tasks
      </div>
    );
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsLoading(true);
    try {
      const newIssue = await createTask({
        title: title.trim(),
        description: description.trim(),
        storyPoint: parseInt(storyPoint) || 0,
        statusId: statusId || defaultStatusId,
        sprintId: activeSprint?.id || null,
        assignee: null,
        projectId, // Include projectId for key generation
      });

      // Call the handler to update parent state
      if (onIssueCreated) {
        onIssueCreated(newIssue);
      }

      resetForm();
      setIsCreating(false);
    } catch (error) {
      console.error("Failed to create issue:", error);
      // You could add toast notification here
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    resetForm();
    setIsCreating(false);
  };
  if (!isCreating) {
    return (
      <button
        onClick={() => setIsCreating(true)}
        disabled={isLoading}
        className="w-full p-3 text-left text-sm text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary hover:bg-gradient-to-r hover:from-primary/5 hover:to-primary/10 dark:hover:from-primary/10 dark:hover:to-primary/20 rounded-xl border-2 border-dashed border-gray-300/50 dark:border-gray-600/50 hover:border-primary/30 dark:hover:border-primary/40 transition-all duration-300 flex items-center group backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 group-hover:bg-primary/20 dark:group-hover:bg-primary/30 flex items-center justify-center mr-3 transition-colors">
          <Plus
            size={16}
            className="group-hover:text-primary transition-colors"
          />
        </div>
        Add an issue
      </button>
    );
  }
  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white/80 dark:bg-gradient-card backdrop-blur-sm rounded-xl border border-gray-200/50 dark:border-gray-600/50 p-4 shadow-xl animate-slide-down"
    >
      <IssueFormFields
        title={title}
        description={description}
        storyPoint={storyPoint}
        statusId={statusId}
        statuses={statuses}
        onTitleChange={setTitle}
        onDescriptionChange={setDescription}
        onStoryPointChange={setStoryPoint}
        onStatusChange={setStatusId}
      />{" "}
      <IssueFormActions
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        submitText="Add Issue"
        isLoading={isLoading}
      />
    </form>
  );
};

export default CreateIssue;

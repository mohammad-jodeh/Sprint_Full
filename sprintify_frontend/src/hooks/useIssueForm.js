// Custom hook for form state management following SRP
import { useState, useEffect } from "react";

export const useIssueForm = (onSubmit, onCancel, defaultStatusId = null) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [storyPoint, setStoryPoint] = useState(1);
  const [statusId, setStatusId] = useState(defaultStatusId || "");
  const [isCreating, setIsCreating] = useState(false);

  // Update statusId when defaultStatusId changes
  useEffect(() => {
    if (defaultStatusId && !statusId) {
      setStatusId(defaultStatusId);
    }
  }, [defaultStatusId, statusId]);

  const isValid = title.trim().length > 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isValid) return;

    const newIssue = {
      title: title.trim(),
      description: description.trim(),
      storyPoint: parseInt(storyPoint),
      statusId: statusId,
      assignee: null,
      assigneeUser: null,
    };

    onSubmit(newIssue);
    resetForm();
  };

  const handleCancel = () => {
    resetForm();
    onCancel();
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setStoryPoint(1);
    setStatusId(defaultStatusId || "");
  };
  
  return {
    title,
    description,
    storyPoint,
    statusId,
    isCreating,
    isValid,
    setTitle,
    setDescription,
    setStoryPoint,
    setStatusId,
    setIsCreating,
    handleSubmit,
    handleCancel,
    resetForm,
  };
};

// Custom hook for form state management following SRP
import { useState } from "react";

export const useIssueForm = (onSubmit, onCancel) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [storyPoint, setStoryPoint] = useState(1);

  const isValid = title.trim().length > 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isValid) return;

    const newIssue = {
      title: title.trim(),
      description: description.trim(),
      storyPoint: parseInt(storyPoint),
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
  };
  return {
    title,
    description,
    storyPoint,
    isValid,
    setTitle,
    setDescription,
    setStoryPoint,
    handleSubmit,
    handleCancel,
    resetForm,
  };
};

import React, { useState } from "react";
import IssueFormFields from "../board/IssueCard/IssueFormFields";
import IssueFormActions from "../board/IssueCard/IssueFormActions";

const StatusFieldDemo = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [storyPoint, setStoryPoint] = useState(1);
  const [statusId, setStatusId] = useState("st-1");

  // Mock statuses for demonstration
  const mockStatuses = [
    { id: "st-1", name: "Open" },
    { id: "st-2", name: "Ready" },
    { id: "st-3", name: "In Development" },
    { id: "st-4", name: "Code Review" },
    { id: "st-5", name: "Testing" },
    { id: "st-6", name: "Completed" },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Issue would be created with:
Title: ${title}
Description: ${description}
Story Points: ${storyPoint}
Status: ${mockStatuses.find(s => s.id === statusId)?.name} (${statusId})`);
  };

  const handleCancel = () => {
    setTitle("");
    setDescription("");
    setStoryPoint(1);
    setStatusId("st-1");
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
          Create Issue Form - Status Field Demo
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          This demonstrates the status selection field that has been added to the issue creation form.
          Now users can select the status when creating an issue instead of being forced to use a default.
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <IssueFormFields
            title={title}
            description={description}
            storyPoint={storyPoint}
            statusId={statusId}
            statuses={mockStatuses}
            onTitleChange={setTitle}
            onDescriptionChange={setDescription}
            onStoryPointChange={setStoryPoint}
            onStatusChange={setStatusId}
          />
          
          <IssueFormActions
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            submitText="Create Issue"
            isLoading={false}
          />
        </form>

        <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Current Form Values:</h3>
          <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
            <li><strong>Title:</strong> {title || "(empty)"}</li>
            <li><strong>Description:</strong> {description || "(empty)"}</li>
            <li><strong>Story Points:</strong> {storyPoint}</li>
            <li><strong>Status:</strong> {mockStatuses.find(s => s.id === statusId)?.name} ({statusId})</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default StatusFieldDemo;
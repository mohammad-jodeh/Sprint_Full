import { useState } from "react";
import { X } from "lucide-react";
import { useParams } from "react-router-dom";
import { createTask } from "../../api/tasks";

const NewIssueForm = ({ status, onCancel, onSubmit }) => {
  const { projectId } = useParams();
  const [issueData, setIssueData] = useState({
    title: "",
    description: "",
    storyPoint: 3,
    statusId: status,
    projectId: projectId,
    assignee: null,
    epicId: null,
    sprintId: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setIssueData({
      ...issueData,
      [name]: value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const taskData = {
        ...issueData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        deletedAt: null,
      };

      await createTask(projectId, taskData);
      onSubmit();
    } catch (error) {
      console.error("Error creating issue:", error);
    }
  };

  return (
    <div className="bg-gray-800 rounded-md p-3 shadow-lg">
      <div className="flex justify-between items-center mb-2">
        <h4 className="text-sm font-medium text-gray-200">New Issue</h4>
        <button className="text-gray-400 hover:text-white" onClick={onCancel}>
          <X className="h-4 w-4" />
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <input
            type="text"
            name="title"
            value={issueData.title}
            onChange={handleChange}
            placeholder="Issue title"
            className="w-full bg-gray-700 text-gray-200 text-sm rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
            required
          />
        </div>

        <div className="mb-3">
          <textarea
            name="description"
            value={issueData.description}
            onChange={handleChange}
            placeholder="Description"
            rows="2"
            className="w-full bg-gray-700 text-gray-200 text-sm rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
          ></textarea>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-3">
          <div>
            <select
              name="storyPoint"
              value={issueData.storyPoint}
              onChange={handleChange}
              className="w-full bg-gray-700 text-gray-200 text-sm rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="1">1 Point (Easy)</option>
              <option value="2">2 Points (Bug)</option>
              <option value="3">3 Points (Medium)</option>
              <option value="5">5 Points (Hard)</option>
              <option value="8">8 Points (Epic)</option>
            </select>
          </div>
          <div>
            <select
              name="sprintId"
              value={issueData.sprintId || ""}
              onChange={handleChange}
              className="w-full bg-gray-700 text-gray-200 text-sm rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">No Sprint</option>
              <option value="1">Sprint 1</option>
              <option value="2">Sprint 2</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium py-1 px-3 rounded"
          >
            Create Issue
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewIssueForm;

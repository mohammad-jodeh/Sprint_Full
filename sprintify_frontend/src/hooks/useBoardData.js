import { useEffect, useState } from "react";
import { fetchStatuses } from "../api/statuses";
import { fetchTasks } from "../api/tasks";
import { fetchProjectById } from "../api/project"; // project replaces board
import { getProjectMembers } from "../api/projectMembers";
import { fetchBoardColumns } from "../api/boardColumns";
import api from "../api/config";

/**
 * Helper function to determine the active sprint from a list of sprints
 * @param {Array} sprints - Array of sprint objects
 * @returns {Object|null} - Active sprint or null if none found
 */
const getActiveSprint = (sprints) => {
  const now = new Date();
  return (
    sprints.find((sprint) => {
      if (sprint.archived) return false;
      const startDate = new Date(sprint.startDate);
      const endDate = new Date(sprint.endDate);
      return startDate <= now && endDate >= now;
    }) || null
  );
};

/**
 * Helper function to get all active sprints from a list of sprints
 * @param {Array} sprints - Array of sprint objects
 * @returns {Array} - Array of active sprints
 */
const getActiveSprints = (sprints) => {
  const now = new Date();
  return sprints.filter((sprint) => {
    if (sprint.archived) return false;
    const startDate = new Date(sprint.startDate);
    const endDate = new Date(sprint.endDate);
    return startDate <= now && endDate >= now;
  });
};

/**
 * Custom hook for loading and managing board-like data for a project
 * Returns all issues for the project (sprint filtering handled by Board component)
 * @param {string} projectId - ID of the project
 * @returns {Object} - Project data, issues, statuses, loading state, active sprints info
 */
export function useBoardData(projectId) {
  const [isLoading, setIsLoading] = useState(true);
  const [issues, setIssues] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [columns, setColumns] = useState([]);
  const [project, setProject] = useState(null);
  const [activeSprint, setActiveSprint] = useState(null);
  const [activeSprints, setActiveSprints] = useState([]);
  const [epics, setEpics] = useState([]);

  useEffect(() => {
    const loadBoardData = async () => {
      setIsLoading(true);
      try {        const [
          proj,
          columnsData,
          allStatuses,
          sprintsData,
          allIssueData,
          projectMembersData,
          epicsData,
        ] = await Promise.all([
          fetchProjectById(projectId),
          fetchBoardColumns(projectId),
          api.get("/statuses"),
          api.get(`/sprints?projectId=${projectId}`),
          fetchTasks({ projectId, includeRelated: true }),
          getProjectMembers(projectId),
          api.get(`/epics?projectId=${projectId}`),
        ]);

        // Filter statuses for this project based on column relationship
        const projectColumns = columnsData;
        const columnIds = projectColumns.map((col) => col.id);
        const statusData = allStatuses.data.filter((status) =>
          columnIds.includes(status.columnId)
        );

        // Determine all active sprints and set the first one as default
        const activeSprintsData = getActiveSprints(sprintsData.data);
        const primaryActiveSprint = getActiveSprint(sprintsData.data);

        // Return all project issues (filtering will be done in Board component)
        const allIssues = allIssueData;

        // Add members to project object
        const projectWithMembers = {
          ...proj,
          members: projectMembersData || [],
        };

        setProject(projectWithMembers);
        setColumns(projectColumns);
        setStatuses(statusData);
        setIssues(allIssues);
        setActiveSprint(primaryActiveSprint);
        setActiveSprints(activeSprintsData);
        setEpics(epicsData.data || []);
      } catch (err) {
        console.error("Failed to load board data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (projectId) loadBoardData();
  }, [projectId]);

  return {
    isLoading,
    issues,
    setIssues,
    statuses,
    setStatuses,
    columns,
    setColumns,
    boardData: project, // reuse as board context
    activeSprint,
    activeSprints,
    epics,
    setEpics,
  };
}

import { useEffect, useState } from "react";
import { fetchStatuses } from "../api/statuses";
import { fetchTasks } from "../api/tasks";
import { fetchProjectById } from "../api/project"; // project replaces board
import { getProjectMembers } from "../api/projectMembers";
import { fetchBoardColumns } from "../api/boardColumns";
import { fetchSprints } from "../api/sprints";
import { fetchEpics } from "../api/epics";

/**
 * Helper function to determine the active sprint from a list of sprints and project
 * @param {Array} sprints - Array of sprint objects
 * @param {Object} project - Project object with activeSprintId
 * @returns {Object|null} - Active sprint or null if none found
 */
const getActiveSprint = (sprints, project) => {
  // First, check if project has an activeSprintId
  if (project?.activeSprintId) {
    const activeSprint = sprints.find(sprint => sprint.id === project.activeSprintId);
    if (activeSprint) return activeSprint;
  }
  
  // Then check for sprints marked as active
  const activeMarkedSprint = sprints.find(sprint => sprint.isActive === true);
  if (activeMarkedSprint) return activeMarkedSprint;
  
  // Finally, fall back to date-based logic
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
 * @param {Object} project - Project object with activeSprintId
 * @returns {Array} - Array of active sprints
 */
const getActiveSprints = (sprints, project) => {
  // Include the project's active sprint
  const activeSprints = [];
  
  if (project?.activeSprintId) {
    const activeSprint = sprints.find(sprint => sprint.id === project.activeSprintId);
    if (activeSprint) activeSprints.push(activeSprint);
  }
  
  // Include sprints marked as active
  const activeMarkedSprints = sprints.filter(sprint => sprint.isActive === true);
  activeMarkedSprints.forEach(sprint => {
    if (!activeSprints.find(s => s.id === sprint.id)) {
      activeSprints.push(sprint);
    }
  });
  
  // Include date-based active sprints
  const now = new Date();
  const dateActiveSprints = sprints.filter((sprint) => {
    if (sprint.archived) return false;
    const startDate = new Date(sprint.startDate);
    const endDate = new Date(sprint.endDate);
    return startDate <= now && endDate >= now;
  });
  
  dateActiveSprints.forEach(sprint => {
    if (!activeSprints.find(s => s.id === sprint.id)) {
      activeSprints.push(sprint);
    }
  });
  
  return activeSprints;
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
          fetchStatuses({ projectId }),
          fetchSprints(projectId),
          fetchTasks(projectId, { includeRelated: true }),
          getProjectMembers(projectId),
          fetchEpics(projectId),
        ]);

        // Filter statuses for this project based on column relationship
        const projectColumns = columnsData;
        const columnIds = projectColumns.map((col) => col.id);
        const statusData = allStatuses.filter((status) =>
          columnIds.includes(status.columnId)
        );

        // Determine all active sprints and set the first one as default
        const activeSprintsData = getActiveSprints(sprintsData, proj);
        const primaryActiveSprint = getActiveSprint(sprintsData, proj);

        // Return all project issues (filtering will be done in Board component)
        const allIssues = allIssueData;

        // Add members to project object (handle correct response format)
        const members = projectMembersData?.memberships || projectMembersData?.members || projectMembersData || [];
        const projectWithMembers = {
          ...proj,
          members: members,
        };

        setProject(projectWithMembers);
        setColumns(projectColumns);
        setStatuses(statusData);
        setIssues(allIssues);
        setActiveSprint(primaryActiveSprint);
        setActiveSprints(activeSprintsData);
        setEpics(epicsData || []);
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

// Custom hook for filter data management following SRP
import { useState, useEffect } from "react";
import { fetchSprints } from "../api/sprints";
import { getProjectMembers } from "../api/projectMembers";
import { useBoardStore } from "../store/boardStore";

export const useFilterData = (projectId) => {
  const board = useBoardStore((state) => state.board);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [availableSprints, setAvailableSprints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFilterOptions = async () => {
      try {
        setLoading(true);

        // Try to use mock data first, then fallback to API
        if (board.users && board.sprints) {
          // Use mock data from board store
          setAvailableUsers(board.users || []);

          const activeSprints = (board.sprints || []).filter((sprint) => {
            const now = new Date();
            const startDate = new Date(sprint.startDate);
            const endDate = new Date(sprint.endDate);
            return !sprint.archived && startDate <= now && endDate >= now;
          });

          setAvailableSprints(activeSprints);
        } else if (projectId) {
          // Fallback to API data
          const [membersRes, sprintsRes] = await Promise.all([
            getProjectMembers(projectId).catch(() => []),
            fetchSprints(projectId).catch(() => []),
          ]);

          setAvailableUsers(membersRes || []);

          const activeSprints = (sprintsRes || []).filter((sprint) => {
            const now = new Date();
            const startDate = new Date(sprint.startDate);
            const endDate = new Date(sprint.endDate);
            return !sprint.archived && startDate <= now && endDate >= now;
          });

          setAvailableSprints(activeSprints);
        }
      } catch (error) {
        console.error("Failed to load filter options:", error);
        setAvailableUsers([]);
        setAvailableSprints([]);
      } finally {
        setLoading(false);
      }
    };

    loadFilterOptions();
  }, [projectId, board.users, board.sprints]);

  return {
    availableUsers,
    availableSprints,
    loading,
  };
};

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  CalendarDays,
  BarChart2,
  Pencil,
  Archive,
  Plus,
  Trash,
  List,
} from "lucide-react";
import { protectedApi } from "../../api/config";
import { fetchSprints, deleteSprint as deleteSprintAPI, fetchSprintIssues } from "../../api/sprints";
import { fetchIssues } from "../../api/issues";
import EditSprintModal from "../../components/modals/EditSprintModal";
import CreateSprintModal from "../../components/modals/CreateSprintModal";
import ConfirmDeleteModal from "../../components/modals/ConfirmDeleteModal";
import SprintBacklog from "../../components/projects/SprintBacklog";
import { useProjectRole } from "../../hooks/useProjectRole";
import { can, PERMISSIONS } from "../../utils/permission";
import { motion } from "framer-motion";

const Sprintspage = () => {
  const { projectId } = useParams();
  const { projectRole } = useProjectRole();
  const [sprints, setSprints] = useState([]);
  const [issues, setIssues] = useState([]);
  const [sprintStats, setSprintStats] = useState({}); // Store sprint-specific statistics
  const [editing, setEditing] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [filter, setFilter] = useState("all");
  const [sprintToDelete, setSprintToDelete] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewingBacklog, setViewingBacklog] = useState(null);

  // Check permissions
  const canCreateSprint = can(projectRole, PERMISSIONS.CREATE_SPRINT);
  const canUpdateSprint = can(projectRole, PERMISSIONS.UPDATE_SPRINT);
  const canDeleteSprint = can(projectRole, PERMISSIONS.DELETE_SPRINT);

  useEffect(() => {
    loadData();
  }, [projectId]);
  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [sprintData, issueData] = await Promise.all([
        fetchSprints(projectId),
        fetchIssues(projectId),
      ]);
      
      // Handle sprint data
      const sprints = Array.isArray(sprintData) ? sprintData : 
                     sprintData?.data ? sprintData.data : 
                     sprintData?.sprints ? sprintData.sprints : [];
      
      // Handle issue data
      const issues = Array.isArray(issueData) ? issueData : 
                    issueData?.data ? (Array.isArray(issueData.data) ? issueData.data : issueData.data.issues || []) : 
                    issueData?.issues ? issueData.issues : [];
      
      setSprints(sprints);
      setIssues(issues);
      
      console.log("Loaded sprints:", sprints);
      console.log("Loaded issues:", issues);

      // Load sprint-specific statistics
      await loadSprintStats(sprints);
      
    } catch (err) {
      console.error("Failed to load data:", err);
      setError(err.message || "Failed to load sprint data");
      setSprints([]);
      setIssues([]);
      setSprintStats({});
    } finally {
      setLoading(false);
    }
  };

  const loadSprintStats = async (sprints) => {
    try {
      const stats = {};
      
      // Load issues for each sprint to get accurate statistics
      await Promise.all(
        sprints.map(async (sprint) => {
          try {
            const sprintIssuesData = await fetchSprintIssues(projectId, sprint.id);
            const sprintIssues = Array.isArray(sprintIssuesData) ? sprintIssuesData : sprintIssuesData?.data || [];
            
            const points = sprintIssues.reduce(
              (sum, issue) => sum + (issue.storyPoints || issue.storyPoint || 0),
              0
            );
            
            stats[sprint.id] = {
              count: sprintIssues.length,
              points: points
            };
          } catch (err) {
            console.error(`Failed to load stats for sprint ${sprint.id}:`, err);
            // Fallback to filtering issues array
            const fallbackIssues = issues.filter((i) => i.sprintId === sprint.id);
            stats[sprint.id] = {
              count: fallbackIssues.length,
              points: fallbackIssues.reduce((sum, i) => sum + (i.storyPoints || i.storyPoint || 0), 0)
            };
          }
        })
      );
      
      setSprintStats(stats);
    } catch (err) {
      console.error("Failed to load sprint statistics:", err);
      // Fallback to client-side filtering
      const fallbackStats = {};
      sprints.forEach(sprint => {
        const sprintIssues = issues.filter((i) => i.sprintId === sprint.id);
        fallbackStats[sprint.id] = {
          count: sprintIssues.length,
          points: sprintIssues.reduce((sum, i) => sum + (i.storyPoints || i.storyPoint || 0), 0)
        };
      });
      setSprintStats(fallbackStats);
    }
  };
  const getStats = (sprintId) => {
    // Use preloaded sprint statistics if available
    if (sprintStats[sprintId]) {
      return sprintStats[sprintId];
    }
    
    // Fallback to client-side filtering if stats not loaded yet
    if (!Array.isArray(issues)) {
      return { count: 0, points: 0 };
    }
    
    const sprintIssues = issues.filter((i) => i.sprintId === sprintId);
    const points = sprintIssues.reduce(
      (sum, i) => sum + (i.storyPoints || i.storyPoint || 0),
      0
    );
    return { count: sprintIssues.length, points };
  };

  const toggleArchive = async (sprint) => {
    try {
      const updated = { ...sprint, archived: !sprint.archived };
      const response = await protectedApi.patch(`/${projectId}/sprints/${sprint.id}`, updated);
      setSprints((prev) => prev.map((s) => (s.id === sprint.id ? response.data.sprint || response.data : s)));
    } catch (err) {
      console.error("Failed to toggle archive:", err);
      setError(err.response?.data?.message || "Failed to update sprint");
    }
  };

  // Function to refresh sprint statistics when issues change
  const refreshSprintStats = async (affectedSprintIds = []) => {
    try {
      const newStats = { ...sprintStats };
      
      // If no specific sprints provided, refresh all
      const sprintsToRefresh = affectedSprintIds.length > 0 
        ? sprints.filter(s => affectedSprintIds.includes(s.id))
        : sprints;
      
      await Promise.all(
        sprintsToRefresh.map(async (sprint) => {
          try {
            const sprintIssuesData = await fetchSprintIssues(projectId, sprint.id);
            const sprintIssues = Array.isArray(sprintIssuesData) ? sprintIssuesData : sprintIssuesData?.data || [];
            
            const points = sprintIssues.reduce(
              (sum, issue) => sum + (issue.storyPoints || issue.storyPoint || 0),
              0
            );
            
            newStats[sprint.id] = {
              count: sprintIssues.length,
              points: points
            };
          } catch (err) {
            console.error(`Failed to refresh stats for sprint ${sprint.id}:`, err);
          }
        })
      );
      
      setSprintStats(newStats);
    } catch (err) {
      console.error("Failed to refresh sprint statistics:", err);
    }
  };

  const handleDelete = async (sprintId) => {
    try {
      await deleteSprintAPI(projectId, sprintId);
      setSprints((prev) => prev.filter((s) => s.id !== sprintId));
    } catch (err) {
      console.error("Failed to delete sprint:", err);
      setError(err.message || "Failed to delete sprint");
    }
  };

  const filtered = sprints.filter((s) => {
    if (filter === "archived") return s.archived;
    if (filter === "active") return !s.archived;
    return true;
  });  return (
    <div className="space-y-10 p-6 relative">
      {/* Show Sprint Backlog if viewing a specific sprint */}
      {viewingBacklog ? (
        <SprintBacklog 
          sprint={viewingBacklog} 
          onBack={() => setViewingBacklog(null)} 
        />
      ) : (
        <>
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-4">
              <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
              <button 
                onClick={() => setError(null)}
                className="text-red-500 hover:text-red-700 text-xs mt-2 underline"
              >
                Dismiss
              </button>
            </div>
          )}

      {/* Header */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <h1 className="text-3xl font-bold text-gradient drop-shadow-md">
          🚀 Sprints
        </h1>{" "}
        <div className="flex items-center gap-3">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-1.5 rounded-lg text-sm bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-800 dark:text-white shadow"
          >
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="archived">Archived</option>
          </select>

          {canCreateSprint && (
            <button
              onClick={() => setShowCreate(true)}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-gradient-to-r from-primary to-blue-500 text-white rounded-lg hover:opacity-90 transition shadow-md disabled:opacity-50"
            >
              <Plus size={16} />
              Create Sprint
            </button>
          )}
          {!canCreateSprint && (
            <div className="text-sm text-gray-500 dark:text-gray-400 italic">
              You don't have permission to create sprints
            </div>
          )}
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      )}

      {/* Sprint Cards */}
      {!loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((sprint) => {
            const stats = getStats(sprint.id);
            return (
              <motion.div
                key={sprint.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="bg-white dark:bg-gradient-to-br dark:from-gray-900 dark:to-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-5 shadow-xl hover:shadow-2xl transition relative"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                      {sprint.name}
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {new Date(sprint.startDate).toLocaleDateString()} → {new Date(sprint.endDate).toLocaleDateString()}
                    </p>
                    <p className="mt-1 text-sm text-gray-700 dark:text-gray-200">
                      {stats.count} issues · {stats.points} pts
                    </p>
                  </div>{" "}                  <div className="flex flex-col gap-2 items-end">
                    <button
                      onClick={() => setViewingBacklog(sprint)}
                      className="text-gray-400 hover:text-primary"
                      title="View Backlog"
                    >
                      <List size={18} />
                    </button>
                    {canUpdateSprint && (
                      <button
                        onClick={() => setEditing(sprint)}
                        className="text-gray-400 hover:text-primary"
                        title="Edit"
                      >
                        <Pencil size={18} />
                      </button>
                    )}
                    {canUpdateSprint && (
                      <button
                        onClick={() => toggleArchive(sprint)}
                        className={
                          sprint.archived
                            ? "text-red-500 hover:text-red-600"
                            : "text-gray-400 hover:text-red-500"
                        }
                        title="Toggle Archive"
                      >
                        <Archive size={18} />
                      </button>
                    )}
                    {canDeleteSprint && (
                      <button
                        onClick={() => setSprintToDelete(sprint)}
                        className="text-gray-400 hover:text-red-600"
                        title="Delete Sprint"
                      >
                        <Trash size={18} />
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <div className="text-center text-sm text-gray-500 dark:text-gray-400 py-10">
          {sprints.length === 0 ? "No sprints created yet." : "No sprints match your filter."}
        </div>
      )}

      {editing && (
        <EditSprintModal
          sprint={editing}
          projectId={projectId}
          onClose={() => setEditing(null)}
          onSave={(updated) => {
            setSprints((prev) =>
              prev.map((s) => (s.id === updated.id ? updated : s))
            );
            setError(null);
            // Refresh statistics for the updated sprint
            refreshSprintStats([updated.id]);
          }}
          onError={setError}
        />
      )}

      {showCreate && (
        <CreateSprintModal
          projectId={projectId}
          onClose={() => setShowCreate(false)}
          onCreate={(newSprint) => {
            setSprints((prev) => [...prev, newSprint]);
            setError(null);
            // Initialize statistics for the new sprint
            setSprintStats(prev => ({
              ...prev,
              [newSprint.id]: { count: 0, points: 0 }
            }));
          }}
          onError={setError}
        />
      )}      {sprintToDelete && (
        <ConfirmDeleteModal
          name={sprintToDelete.name}
          type="sprint"
          onClose={() => setSprintToDelete(null)}
          onConfirm={() => {
            handleDelete(sprintToDelete.id);
            setSprintToDelete(null);
          }}
        />
      )}
        </>
      )}
    </div>
  );
};

export default Sprintspage;
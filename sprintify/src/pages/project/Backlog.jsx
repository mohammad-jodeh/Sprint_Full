import { useEffect, useState, useMemo } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import {
  Plus,
  Trash2,
  User2,
  BadgeCheck,
  Search,
  Pencil,
  Calendar,
  Target,
  X,
  Filter,
} from "lucide-react";
import CreateIssueModal from "../../components/modals/CreateIssueModal";
import EditIssueModal from "../../components/modals/EditIssueModal";
import ConfirmDeleteModal from "../../components/modals/ConfirmDeleteModal";
import CreateEpicModal from "../../components/modals/CreateEpicModal";
import IssueDetailsModal from "../../components/modals/IssueDetailsModal";
import EpicSelectionModal from "../../components/modals/EpicSelectionModal";
import EpicDetailsModal from "../../components/modals/EpicDetailsModal";
import { useProjectRole } from "../../hooks/useProjectRole";
import { can, PERMISSIONS } from "../../utils/permission";
import {
  priorityOptions,
  getPriorityConfig,
  sortByPriority,
} from "../../utils/priorityUtils";
import { protectedApi } from "../../api/config";
import toast from "react-hot-toast";
import { fetchIssues, updateIssue, deleteIssue } from "../../api/issues";
import { fetchSprints } from "../../api/sprints";
import { fetchEpics } from "../../api/epics";

export default function Backlog() {
  // State management
  const { projectId } = useParams();
  const { projectRole } = useProjectRole();
  const [searchParams, setSearchParams] = useSearchParams();
  const [issues, setIssues] = useState([]);
  const [sprints, setSprints] = useState([]);
  const [epics, setEpics] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedPriority, setSelectedPriority] = useState(null); // Priority filter
  const [editingIssue, setEditingIssue] = useState(null);
  const [issueToDelete, setIssueToDelete] = useState(null);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [selectedEpic, setSelectedEpic] = useState(null); // null = all, "no-epic" = no epic, epic.id = specific epic
  const [selectedEpicForDetails, setSelectedEpicForDetails] = useState(null);
  const [showEpicModal, setShowEpicModal] = useState(false);

  // Check permissions
  const canCreateTask = can(projectRole, PERMISSIONS.CREATE_TASK);
  const canUpdateTask = can(projectRole, PERMISSIONS.UPDATE_TASK);
  const canDeleteTask = can(projectRole, PERMISSIONS.DELETE_TASK);
  // Data fetching and utilities
  const attachEpicsToIssues = (issues, epics) => {
    return issues.map((issue) => {
      if (issue.epicId) {
        const epic = epics.find((e) => e.id === issue.epicId);
        if (epic) return { ...issue, epic };
        const epicByName = epics.find((e) => e.name === issue.epicId);
        if (epicByName) return { ...issue, epic: epicByName };
      }
      return issue;
    });
  };  const refreshData = async () => {
    if (!projectId) return;
    try {
      const [issuesData, sprintsData, epicsData] = await Promise.all([
        fetchIssues(projectId),
        fetchSprints(projectId),
        fetchEpics(projectId),
      ]);

      // Handle the API response structure
      const issuesArray = Array.isArray(issuesData) ? issuesData : 
                         issuesData?.data ? (Array.isArray(issuesData.data) ? issuesData.data : issuesData.data.issues || []) : 
                         issuesData?.issues ? issuesData.issues : [];

      const sprintsArray = Array.isArray(sprintsData) ? sprintsData : 
                          sprintsData?.data ? sprintsData.data : 
                          sprintsData?.sprints ? sprintsData.sprints : [];

      const epicsArray = Array.isArray(epicsData) ? epicsData : 
                        epicsData?.data ? epicsData.data : 
                        epicsData?.epics ? epicsData.epics : [];

      // Set the data without trying to fetch users/statuses separately
      // The backend should return complete issue data with populated relations
      setIssues(attachEpicsToIssues(issuesArray, epicsArray));
      setSprints(sprintsArray);
      setEpics(epicsArray);
    } catch (error) {
      console.error("Failed to fetch data:", error);
      toast.error("Failed to fetch data");
    }
  };
  // Effects
  useEffect(() => {
    refreshData();
  }, [projectId]);

  // Refresh data when window gains focus (user switches back to tab)
  useEffect(() => {
    const handleFocus = () => {
      refreshData();
    };

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [projectId]);
  // Group issues by sprint or backlog
  const groupedIssues = useMemo(() => {
    let filtered = issues.filter((i) =>
      i.title.toLowerCase().includes(search.toLowerCase())
    );

    // Apply epic filter
    if (selectedEpic === "no-epic") {
      filtered = filtered.filter((issue) => !issue.epicId);
    } else if (selectedEpic && selectedEpic !== null) {
      filtered = filtered.filter((issue) => issue.epicId === selectedEpic);
    }    // Apply priority filter
    if (selectedPriority) {
      filtered = filtered.filter(
        (issue) => (issue.issuePriority || issue.priority || "MEDIUM") === selectedPriority
      );
    }

    const groups = { backlog: [] };
    sprints.forEach((s) => (groups[s.id] = []));
    filtered.forEach((issue) => {
      const key = issue.sprintId || "backlog";
      if (groups[key]) groups[key].push(issue);
    });

    // Sort each group by priority (High -> Medium -> Low)
    Object.keys(groups).forEach((key) => {
      groups[key] = sortByPriority(groups[key], false);
    });

    return groups;
  }, [issues, sprints, search, selectedEpic, selectedPriority]);
  // Drag and drop handler
  const handleDragEnd = async ({ source, destination, draggableId }) => {
    if (
      !destination ||
      (source.droppableId === destination.droppableId &&
        source.index === destination.index)
    )
      return;
    const newSprintId =
      destination.droppableId === "backlog" ? null : destination.droppableId;
    const originalSprintId =
      source.droppableId === "backlog" ? null : source.droppableId;
    
    // Optimistically update the UI
    setIssues((prev) =>
      prev.map((issue) =>
        issue.id === draggableId ? { ...issue, sprintId: newSprintId } : issue
      )
    );
    
    try {
      await updateIssue(projectId, draggableId, { sprintId: newSprintId });
      toast.success("Issue moved successfully");
    } catch (error) {
      console.error("Failed to move issue:", error);
      toast.error("Failed to move issue");
      // Revert the optimistic update
      setIssues((prev) =>
        prev.map((issue) =>
          issue.id === draggableId
            ? { ...issue, sprintId: originalSprintId }
            : issue
        )
      );
    }
  };  // Epic handlers
  const handleDeleteEpic = async (epicId) => {
    try {
      await protectedApi.delete(`/${projectId}/epics/${epicId}`);
      setEpics((prev) => prev.filter((epic) => epic.id !== epicId));
      // Remove epic from issues
      setIssues((prev) =>
        prev.map((issue) =>
          issue.epicId === epicId
            ? { ...issue, epicId: null, epic: null }
            : issue
        )
      );
      setSelectedEpicForDetails(null);
      toast.success("Epic deleted successfully!");
    } catch (error) {
      console.error("Failed to delete epic:", error);
      toast.error("Failed to delete epic");
    }
  };

  const handleUpdateEpic = (updatedEpic) => {
    setEpics((prev) =>
      prev.map((epic) => (epic.id === updatedEpic.id ? updatedEpic : epic))
    );
    // Update epic in issues that reference it
    setIssues((prev) =>
      prev.map((issue) =>
        issue.epicId === updatedEpic.id
          ? { ...issue, epic: updatedEpic }
          : issue
      )
    );
    setSelectedEpicForDetails(updatedEpic);
  };
  // Helper functions
  const getStatusColor = (status) => {
    const name = (status?.name || "").toLowerCase();
    if (name.includes("done")) return "bg-green-500";
    if (name.includes("progress")) return "bg-blue-500";
    if (name.includes("backlog")) return "bg-yellow-500";
    return "bg-gray-400";
  };

  const typeOptions = [
    { label: "Task", icon: "📝" },
    { label: "Bug", icon: "🐞" },
    { label: "Story", icon: "📘" },
  ];
  // Component definitions
  const IssueCard = ({ issue, index }) => (
    <Draggable draggableId={issue.id} index={index}>
      {(provided, snapshot) => (
        <div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 mb-3 transition-all duration-200 ease-in-out hover:shadow-lg hover:scale-[1.02] ${
            snapshot.isDragging
              ? "scale-105 shadow-2xl rotate-2 opacity-90"
              : ""
          }`}
          onClick={(e) => {
            // Prevent opening details if clicking edit/delete
            if (e.target.closest("button")) return;
            setSelectedIssue(issue);
          }}
        >
          <div className="flex justify-between items-start mb-3">
            <div className="flex-1 mr-2">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-2">
                {issue.key || `#${issue.id}`}: {issue.title}
              </h3>
              {issue.description && (
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                  {issue.description}
                </p>
              )}
            </div>{" "}
            <div className="flex items-center gap-1 ml-2">
              {canUpdateTask && (
                <button
                  onClick={() => setEditingIssue(issue)}
                  className="text-blue-500 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 p-1 rounded"
                >
                  <Pencil size={12} />
                </button>
              )}
              {canDeleteTask && (
                <button
                  onClick={() => setIssueToDelete(issue)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 p-1 rounded"
                >
                  <Trash2 size={12} />
                </button>
              )}
            </div>
          </div>{" "}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 px-2 py-1 rounded-lg text-xs font-medium">
                {typeOptions.find((t) => t.label === issue.type)?.icon || "📝"}{" "}
                {issue.type || "Task"}
              </span>              <span
                className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium border ${
                  getPriorityConfig(issue.issuePriority || issue.priority || "MEDIUM").color
                }`}
              >
                {getPriorityConfig(issue.issuePriority || issue.priority || "MEDIUM").icon}{" "}
                {getPriorityConfig(issue.issuePriority || issue.priority || "MEDIUM").label}
              </span>
              {issue.status && (
                <span
                  className={`px-2 py-1 rounded-lg text-white text-xs font-medium ${getStatusColor(
                    issue.status
                  )}`}
                >
                  {issue.status.name || issue.status}
                </span>
              )}{" "}
              <span className="inline-flex items-center px-2 py-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg text-xs font-bold">
                {issue.storyPoints || issue.storyPoint || 0} pts
              </span>
            </div>
            <div className="flex items-center gap-2">
              {issue.epic?.name && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedEpicForDetails(issue.epic);
                  }}
                  className="inline-flex items-center gap-1 bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 text-indigo-700 dark:text-indigo-300 px-2 py-1 rounded-lg text-xs font-medium hover:from-indigo-200 hover:to-purple-200 dark:hover:from-indigo-800/50 dark:hover:to-purple-800/50 transition-all"
                >
                  <BadgeCheck size={10} />
                  {issue.epic.title || issue.epic.name}
                </button>
              )}
              {issue.assigneeUser?.fullName ? (
                <div className="flex items-center gap-1">
                  <span className="inline-flex items-center justify-center w-6 h-6 bg-gradient-to-r from-blue-400 to-purple-500 text-white rounded-full text-xs font-medium">
                    {issue.assigneeUser.fullName.charAt(0).toUpperCase()}
                  </span>
                  <span className="text-xs text-gray-700 dark:text-gray-300 max-w-16 truncate">
                    {issue.assigneeUser.fullName.split(" ")[0]}
                  </span>
                </div>
              ) : (
                <span className="inline-flex items-center justify-center w-6 h-6 bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-400 rounded-full">
                  <User2 size={12} />
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );

  const SprintSection = ({
    sprintId,
    title,
    issues,
    isSprint = false,
    sprint = null,
  }) => {
    const counts = { "To Do": 0, "In Progress": 0, Done: 0 };
    issues.forEach((issue) => {
      const name = issue.status?.name?.toLowerCase();
      if (name?.includes("progress")) counts["In Progress"]++;
      else if (name?.includes("done")) counts["Done"]++;
      else counts["To Do"]++;
    });
    // Sprint action button logic
    let sprintButton = null;
    if (isSprint && sprint) {
      const now = new Date();
      const isActive =
        !sprint.archived &&
        new Date(sprint.startDate) <= now &&
        new Date(sprint.endDate) >= now;
      const isUpcoming = !sprint.archived && new Date(sprint.startDate) > now;      if (isUpcoming) {
        sprintButton = (
          <button
            className="ml-4 px-4 py-2 rounded-lg bg-gradient-to-r from-primary to-blue-500 text-white font-semibold hover:from-primary-600 hover:to-blue-700 transition"
            onClick={async () => {
              try {
                await protectedApi.patch(`/${projectId}/sprints/${sprint.id}`, {
                  archived: false,
                  startDate: new Date().toISOString().slice(0, 10),
                });
                toast.success("Sprint started!");
                // Reload sprints
                const sprintsData = await fetchSprints(projectId);
                const sprintsArray = Array.isArray(sprintsData) ? sprintsData : 
                                   sprintsData?.data ? sprintsData.data : 
                                   sprintsData?.sprints ? sprintsData.sprints : [];
                setSprints(sprintsArray);
              } catch (error) {
                console.error("Failed to start sprint:", error);
                toast.error("Failed to start sprint");
              }
            }}
          >
            Start Sprint
          </button>
        );
      } else if (isActive) {
        sprintButton = (
          <button
            className="ml-4 px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold hover:from-emerald-600 hover:to-teal-700 transition"
            onClick={async () => {
              try {
                await protectedApi.patch(`/${projectId}/sprints/${sprint.id}`, { archived: true });
                toast.success("Sprint completed!");
                // Reload sprints
                const sprintsData = await fetchSprints(projectId);
                const sprintsArray = Array.isArray(sprintsData) ? sprintsData : 
                                   sprintsData?.data ? sprintsData.data : 
                                   sprintsData?.sprints ? sprintsData.sprints : [];
                setSprints(sprintsArray);
              } catch (error) {
                console.error("Failed to complete sprint:", error);
                toast.error("Failed to complete sprint");
              }
            }}
          >
            Complete Sprint
          </button>
        );
      }
    }
    return (
      <div
        className={`rounded-2xl border-2 border-dashed p-6 min-h-[200px] mb-8 transition-all ${
          sprintId === "backlog"
            ? "border-blue-400 bg-blue-50/50 dark:bg-blue-900/20"
            : "border-emerald-300 bg-emerald-50/30 dark:bg-emerald-900/20"
        }`}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
              {isSprint && <Calendar size={18} className="text-emerald-600" />}
              {title}
            </h2>
            <span className="bg-white dark:bg-gray-800 px-3 py-1 rounded-full text-sm font-medium text-gray-600 dark:text-gray-300 shadow-sm">
              {issues.length} issues
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <span
                className="w-3 h-3 bg-yellow-500 rounded-full"
                title={`To Do: ${counts["To Do"]}`}
              />
              <span className="text-xs text-gray-600 dark:text-gray-400">
                {counts["To Do"]}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <span
                className="w-3 h-3 bg-blue-500 rounded-full"
                title={`In Progress: ${counts["In Progress"]}`}
              />
              <span className="text-xs text-gray-600 dark:text-gray-400">
                {counts["In Progress"]}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <span
                className="w-3 h-3 bg-green-500 rounded-full"
                title={`Done: ${counts["Done"]}`}
              />
              <span className="text-xs text-gray-600 dark:text-gray-400">
                {counts["Done"]}
              </span>
            </div>
            {sprintButton}
          </div>
        </div>
        <Droppable droppableId={sprintId}>
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={`transition-all duration-200 ${
                snapshot.isDraggingOver
                  ? "bg-blue-100/50 dark:bg-blue-900/20 rounded-xl p-2"
                  : ""
              }`}
            >
              {issues.map((issue, index) => (
                <IssueCard key={issue.id} issue={issue} index={index} />
              ))}
              {provided.placeholder}
              {issues.length === 0 && (
                <div className="text-center text-gray-400 py-12 border-2 border-dashed border-gray-200 dark:border-gray-600 rounded-xl">
                  <p className="text-lg">No issues here</p>
                  <p className="text-sm">Drag issues to this area</p>
                </div>
              )}
            </div>
          )}
        </Droppable>
      </div>
    );
  };

  // Sprint sorting and rendering
  const now = new Date();
  const sortedSprints = [...sprints].sort((a, b) => {
    const isActive = (s) =>
      !s.archived && new Date(s.startDate) <= now && new Date(s.endDate) >= now;
    const isUpcoming = (s) => !s.archived && new Date(s.startDate) > now;

    if (isActive(a) && !isActive(b)) return -1;
    if (!isActive(a) && isActive(b)) return 1;
    if (isUpcoming(a) && !isUpcoming(b)) return -1;
    if (!isUpcoming(a) && isUpcoming(b)) return 1;

    return new Date(a.startDate) - new Date(b.startDate);
  });

  return (
    <div className="p-6 space-y-8 pb-24 min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 dark:from-gray-900 dark:to-blue-900/10">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-custom-600 bg-clip-text text-transparent">
          ⚡ Backlog
        </h1>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={18} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search issues..."
              className="pl-12 pr-4 py-3 w-72 text-sm rounded-xl border border-gray-300 dark:border-gray-600 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm"
            />
          </div>
          <button
            onClick={() => setShowEpicModal(true)}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all ${
              selectedEpic !== null
                ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white"
                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
            }`}
          >
            <Target size={18} />
            {selectedEpic === null
              ? "Filter by Epic"
              : selectedEpic === "no-epic"
              ? "No Epic"
              : epics.find((e) => e.id === selectedEpic)?.name ||
                "Unknown Epic"}
            {selectedEpic !== null && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedEpic(null);
                }}
                className="ml-1 hover:bg-white/20 rounded-full p-1 transition-colors"
              >
                <X size={14} />
              </button>
            )}{" "}
          </button>
          <button
            onClick={() => {
              const priorityIndex = selectedPriority
                ? priorityOptions.findIndex((p) => p.value === selectedPriority)
                : -1;
              const nextIndex =
                (priorityIndex + 1) % (priorityOptions.length + 1);
              setSelectedPriority(
                nextIndex === priorityOptions.length
                  ? null
                  : priorityOptions[nextIndex].value
              );
            }}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all ${
              selectedPriority
                ? `${getPriorityConfig(selectedPriority).color} border`
                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
            }`}
          >
            <Filter size={18} />
            {selectedPriority
              ? `${getPriorityConfig(selectedPriority).icon} ${
                  getPriorityConfig(selectedPriority).label
                } Priority`
              : "All Priorities"}
            {selectedPriority && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedPriority(null);
                }}
                className="ml-1 hover:bg-white/20 rounded-full p-1 transition-colors"
              >
                <X size={14} />
              </button>
            )}
          </button>
          <button
            onClick={() => setSearchParams({ modal: "create-epic" })}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-medium"
          >
            <Calendar size={18} />
            Create Epic
          </button>
        </div>
      </div>
      <DragDropContext onDragEnd={handleDragEnd}>
        {sortedSprints.map((sprint) => (
          <SprintSection
            key={sprint.id}
            sprintId={sprint.id}
            title={sprint.name}
            issues={groupedIssues[sprint.id] || []}
            isSprint
            sprint={sprint}
          />
        ))}
        <SprintSection
          sprintId="backlog"
          title="Backlog"
          issues={groupedIssues.backlog || []}
        />{" "}
      </DragDropContext>
      {canCreateTask && (
        <button
          onClick={() => setSearchParams({ modal: "create-issue" })}
          className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-blue-500 to-custom-600 text-white rounded-full p-4 shadow-2xl hover:shadow-3xl hover:scale-110 transition-all duration-200"
          aria-label="Create new issue"
        >
          <Plus size={24} />{" "}
        </button>
      )}
      {/* Modal renders */}
      {searchParams.get("modal") === "create-epic" && (
        <CreateEpicModal
          onClose={() => setSearchParams({})}
          onCreate={(newEpic) => {
            setEpics((prev) => [...prev, newEpic]);
            setSearchParams({});
            toast.success("Epic created successfully!");
          }}
        />
      )}
      {searchParams.get("modal") === "create-issue" && (
        <CreateIssueModal
          epics={epics}
          onClose={() => setSearchParams({})}
          onCreate={async (newIssue) => {
            try {
              const epic = epics.find((e) => e.id === newIssue.epicId);
              const newIssueWithEpic = { ...newIssue, epic: epic || null };
              setIssues((prev) => [...prev, newIssueWithEpic]);
              setSearchParams({});
              toast.success("Issue created successfully!");
              setTimeout(async () => {
                try {
                  const [refreshedResponse, usersRes, statusesRes] =
                    await Promise.all([
                      api.get(`/issues?projectId=${projectId}`),
                      api.get("/users"),
                      api.get("/statuses"),
                    ]);

                  // Manually populate related data
                  const issues = refreshedResponse.data.map((issue) => {
                    const assigneeUser = issue.assignee
                      ? usersRes.data.find((u) => u.id === issue.assignee)
                      : null;
                    const status = statusesRes.data.find(
                      (s) => s.id === issue.statusId
                    );

                    return {
                      ...issue,
                      assigneeUser,
                      status,
                    };
                  });

                  setIssues(attachEpicsToIssues(issues, epics));
                } catch {}
              }, 500);
            } catch {
              toast.error("Failed to create issue");
            }
          }}
        />
      )}
      {editingIssue && (
        <EditIssueModal
          epics={epics}
          issue={editingIssue}
          onClose={() => setEditingIssue(null)}
          onSave={async (updated) => {
            try {
              const epic = epics.find((e) => e.id === updated.epicId);
              const updatedIssueWithEpic = { ...updated, epic: epic || null };
              setIssues((prev) =>
                prev.map((i) =>
                  i.id === updated.id ? updatedIssueWithEpic : i
                )
              );
              setEditingIssue(null);
              toast.success("Issue updated successfully!");
              setTimeout(async () => {
                try {
                  const [refreshedResponse, usersRes, statusesRes] =
                    await Promise.all([
                      api.get(`/issues?projectId=${projectId}`),
                      api.get("/users"),
                      api.get("/statuses"),
                    ]);

                  // Manually populate related data
                  const issues = refreshedResponse.data.map((issue) => {
                    const assigneeUser = issue.assignee
                      ? usersRes.data.find((u) => u.id === issue.assignee)
                      : null;
                    const status = statusesRes.data.find(
                      (s) => s.id === issue.statusId
                    );

                    return {
                      ...issue,
                      assigneeUser,
                      status,
                    };
                  });

                  setIssues(attachEpicsToIssues(issues, epics));
                } catch {}
              }, 500);
            } catch {
              toast.error("Failed to update issue");
            }
          }}
        />
      )}
      {issueToDelete && (
        <ConfirmDeleteModal
          name={issueToDelete.title}
          type="issue"
          onClose={() => setIssueToDelete(null)}          onConfirm={async () => {
            try {
              await deleteIssue(projectId, issueToDelete.id);
              setIssues((prev) =>
                prev.filter((i) => i.id !== issueToDelete.id)
              );
              toast.success("Issue deleted successfully!");
            } catch (error) {
              console.error("Failed to delete issue:", error);
              toast.error("Failed to delete issue");
            }
            setIssueToDelete(null);
          }}
        />
      )}{" "}
      {selectedIssue && (
        <IssueDetailsModal
          issue={selectedIssue}
          projectId={projectId}
          epics={epics}
          onClose={() => setSelectedIssue(null)}
          onDelete={(issueId) => {
            setIssues(issues.filter((issue) => issue.id !== issueId));
            setSelectedIssue(null);
          }}
          onUpdate={(updatedIssue) => {
            setIssues(
              issues.map((issue) =>
                issue.id === updatedIssue.id ? updatedIssue : issue
              )
            );
            setSelectedIssue(updatedIssue);
          }}
        />
      )}
      {showEpicModal && (
        <EpicSelectionModal
          epics={epics}
          issues={issues}
          selectedEpic={selectedEpic}
          onEpicSelect={(epicId) => {
            setSelectedEpic(epicId);
            setShowEpicModal(false);
          }}
          onClose={() => setShowEpicModal(false)}
        />
      )}
      {selectedEpicForDetails && (
        <EpicDetailsModal
          epic={selectedEpicForDetails}
          onClose={() => setSelectedEpicForDetails(null)}
          onDelete={handleDeleteEpic}
          onUpdate={handleUpdateEpic}
        />
      )}
    </div>
  );
}
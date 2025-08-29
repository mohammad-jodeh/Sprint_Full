import { useParams, useSearchParams } from "react-router-dom";
import Board from "../../components/board/Board";
import LoadingScreen from "../../components/ui/LoadingScreen";
import CreateEpicModal from "../../components/modals/CreateEpicModal";
import EditEpicModal from "../../components/modals/EditEpicModal";
import EditIssueModal from "../../components/modals/EditIssueModal";
import IssueDetailsModal from "../../components/modals/IssueDetailsModal";
// Custom hooks
import { useBoardData } from "../../hooks/useBoardData";
import { useProjectRole } from "../../hooks/useProjectRole";
import { updateTask } from "../../api/tasks";
import toast from "react-hot-toast";
import { useState } from "react";

const BoardPage = () => {
  const { projectId } = useParams();
  const { projectRole, isLoading: roleLoading } = useProjectRole();
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    isLoading,
    issues,
    setIssues,
    statuses,
    setStatuses,
    columns,
    setColumns,
    boardData,
    activeSprint,
    activeSprints,
    epics,
    setEpics,
  } = useBoardData(projectId);

  // Modal states
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [selectedEpic, setSelectedEpic] = useState(null);
  const [isIssueDetailsOpen, setIsIssueDetailsOpen] = useState(false);

  // Epic management functions
  const handleCreateEpic = (newEpic) => {
    setEpics((prev) => [...prev, newEpic]);
    toast.success("Epic created successfully!");
  };

  const handleUpdateEpic = (updatedEpic) => {
    setEpics((prev) =>
      prev.map((epic) => (epic.id === updatedEpic.id ? updatedEpic : epic))
    );
    toast.success("Epic updated successfully!");
  }; // Issue management functions
  const handleUpdateIssue = (updatedIssue) => {
    setIssues((prev) => {
      const updated = prev.map((issue) =>
        issue.id === updatedIssue.id ? updatedIssue : issue
      );
      return updated;
    });
    if (selectedIssue?.id === updatedIssue.id) {
      setSelectedIssue(updatedIssue);
    }
    toast.success("Issue updated successfully!");
  };

  const handleIssueClick = (issue) => {
    setSelectedIssue(issue);
    setIsIssueDetailsOpen(true);
  };
  if (isLoading || roleLoading) {
    return <LoadingScreen message="Loading board..." />;
  }

  // Check if user has access to the project
  if (!projectRole) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Access Denied
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            You don't have permission to access this project's board.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative z-10 space-y-6 animate-fade-in">
      {" "}
      <Board
        boardData={boardData}
        issues={issues}
        setIssues={setIssues}
        statuses={statuses}
        setStatuses={setStatuses}
        columns={columns}
        setColumns={setColumns}
        activeSprint={activeSprint}
        activeSprints={activeSprints}
        epics={epics}
        onIssueClick={handleIssueClick}
      />
      {/* Modal Renders */}
      {searchParams.get("modal") === "create-epic" && (
        <CreateEpicModal
          onClose={() => setSearchParams({})}
          onCreate={handleCreateEpic}
        />
      )}
      {searchParams.get("modal") === "edit-epic" && selectedEpic && (
        <EditEpicModal
          epic={selectedEpic}
          onClose={() => {
            setSearchParams({});
            setSelectedEpic(null);
          }}
          onSave={handleUpdateEpic}
        />
      )}
      {searchParams.get("modal") === "edit-issue" && selectedIssue && (
        <EditIssueModal
          issue={selectedIssue}
          epics={epics}
          onClose={() => {
            setSearchParams({});
            setSelectedIssue(null);
          }}
          onSave={handleUpdateIssue}
        />
      )}{" "}
      {isIssueDetailsOpen && selectedIssue && (
        <IssueDetailsModal
          issue={selectedIssue}
          projectId={projectId}
          epics={epics}
          onClose={() => {
            setIsIssueDetailsOpen(false);
            setSelectedIssue(null);
          }}
          onUpdate={handleUpdateIssue}
          onDelete={(issueId) => {
            setIssues((prev) => prev.filter((issue) => issue.id !== issueId));
            setIsIssueDetailsOpen(false);
            setSelectedIssue(null);
            toast.success("Issue deleted successfully!");
          }}
        />
      )}
    </div>
  );
};

export default BoardPage;

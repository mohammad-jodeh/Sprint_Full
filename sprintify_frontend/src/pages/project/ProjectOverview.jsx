import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchProjectWithDetails } from "../../api/projects";
import { fetchTasks, fetchProjectTaskStatistics } from "../../api/tasks";
import { User2Icon, BarChart2, Activity, Loader2 } from "lucide-react";
import ProjectBarChart from "../../components/Charts/ProjectBarChart";
import { fetchSprints } from "../../api/sprints";
import { useProjectRole } from "../../hooks/useProjectRole";

const ProjectOverview = () => {
  const { projectId } = useParams();
  const { projectRole, isLoading: roleLoading } = useProjectRole();
  const [project, setProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [issueStats, setIssueStats] = useState({
    total: 0,
    todo: 0,
    in_progress: 0,
    done: 0,
  });
  const [issuesByAssignee, setIssuesByAssignee] = useState([]);
  const [sprintActivity, setSprintActivity] = useState([]);
  useEffect(() => {
    const loadProjectData = async () => {
      setIsLoading(true);
      try {
        const projectData = await fetchProjectWithDetails(projectId);
        if (!projectData) {
          setProject(null);
          return;
        }
        setProject(projectData);

        const stats = await fetchProjectTaskStatistics(projectId);
        setIssueStats(stats);

        const issues = await fetchTasks(projectId, { includeRelated: true });
        const countByAssignee = {};

        issues.forEach((issue) => {
          const name = issue.assigneeUser?.fullName || "Unassigned";
          if (!countByAssignee[name]) countByAssignee[name] = 0;
          countByAssignee[name]++;
        });

        const chartData = Object.entries(countByAssignee).map(
          ([name, count]) => ({
            project: name,
            issues: count,
          })
        );

        setIssuesByAssignee(chartData);

        // Fetch sprints and build activity
        const sprints = await fetchSprints({ projectId });
        const now = new Date();
        const activity = sprints
          .map((s) => {
            const start = new Date(s.startDate);
            const end = new Date(s.endDate);
            let status = "upcoming";
            if (s.archived) status = "completed";
            else if (start <= now && end >= now) status = "active";
            return {
              id: s.id,
              name: s.name,
              startDate: s.startDate,
              endDate: s.endDate,
              status,
            };
          })
          .sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
        setSprintActivity(activity);
      } catch (error) {
        console.error("Error loading project data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (projectId) loadProjectData();
  }, [projectId]);
  if (isLoading || roleLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
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
            You don't have permission to access this project's overview.
          </p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center text-gray-500 dark:text-gray-400">
          <h2 className="text-2xl font-bold">Project not found</h2>
          <p className="mt-2 text-sm">Check your access or project ID.</p>
        </div>
      </div>
    );
  }

  const completion =
    issueStats.total > 0
      ? Math.round((issueStats.done / issueStats.total) * 100)
      : 0;

  return (
    <div className="space-y-10 p-6 animate-fade-in">
      <div className="bg-gradient-to-tr from-white to-slate-100 dark:from-gray-900 dark:to-gray-800 p-6 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          {project.name}
        </h1>
        {/* <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 max-w-2xl">
          {project.description || "No description provided."}
        </p> */}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* ✅ Project Status: Progress + Summary Split */}
        <div className="md:col-span-1 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-200 dark:border-gray-700">
          <h3 className="font-semibold text-gray-700 dark:text-gray-200 flex items-center gap-2 mb-4">
            <BarChart2 size={18} /> Project Status
          </h3>

          <div className="flex flex-col gap-6">
            {/* 📊 Progress */}
            <div className="space-y-2">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Progress
              </p>
              <div className="w-full bg-gray-200 dark:bg-gray-700 h-3 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-primary to-blue-500 h-full transition-all duration-300 ease-in-out"
                  style={{ width: `${completion}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                <span>
                  {issueStats.done} of {issueStats.total} issues completed
                </span>
                <span className="font-semibold text-primary">
                  {completion}%
                </span>
              </div>
            </div>

            <hr className="border-gray-300 dark:border-gray-600 my-2" />

            {/* 📦 Status Summary */}
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="text-center bg-yellow-100/50 dark:bg-yellow-900/20 p-3 rounded-xl">
                <p className="text-yellow-600 dark:text-yellow-400 text-lg font-bold">
                  {issueStats.todo}
                </p>
                <p className="text-gray-600 dark:text-gray-300 mt-1">To Do</p>
              </div>
              <div className="text-center bg-blue-100/50 dark:bg-blue-900/20 p-3 rounded-xl">
                <p className="text-blue-600 dark:text-blue-400 text-lg font-bold">
                  {issueStats.in_progress}
                </p>
                <p className="text-gray-600 dark:text-gray-300 mt-1">
                  In Progress
                </p>
              </div>
              <div className="text-center bg-green-100/50 dark:bg-green-900/20 p-3 rounded-xl">
                <p className="text-green-600 dark:text-green-400 text-lg font-bold">
                  {issueStats.done}
                </p>
                <p className="text-gray-600 dark:text-gray-300 mt-1">Done</p>
              </div>
            </div>
          </div>
        </div>

        {/* ✅ Assignee Chart - Wide */}
        <div className="md:col-span-2 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-200 dark:border-gray-700">
          <h3 className="font-semibold text-gray-700 dark:text-gray-200 mb-4 flex items-center gap-2">
            <User2Icon size={18} /> Issues by Team Member
          </h3>
          <ProjectBarChart data={issuesByAssignee} />
        </div>
      </div>

      {/* Sprint Activity Feed */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-200 dark:border-gray-700">
        <h3 className="font-semibold text-gray-700 dark:text-gray-200 mb-2">
          Sprint Activity
        </h3>
        {sprintActivity.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            No sprint activity yet.
          </p>
        ) : (
          <ul className="divide-y divide-gray-100 dark:divide-gray-700">
            {sprintActivity.map((sprint) => (
              <li key={sprint.id} className="py-3 flex items-center gap-4">
                <span
                  className={`inline-block w-2 h-2 rounded-full mr-2 ${
                    sprint.status === "active"
                      ? "bg-green-500"
                      : sprint.status === "completed"
                      ? "bg-gray-400"
                      : "bg-blue-400"
                  }`}
                ></span>
                <div className="flex-1">
                  <div className="font-medium text-gray-900 dark:text-white">
                    {sprint.name}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {sprint.status === "active"
                      ? `Active (${sprint.startDate} to ${sprint.endDate})`
                      : sprint.status === "completed"
                      ? `Completed (${sprint.startDate} to ${sprint.endDate})`
                      : `Upcoming (${sprint.startDate} to ${sprint.endDate})`}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ProjectOverview;

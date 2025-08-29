import { useEffect, useState } from "react";
import api from "../api/config";
import { fetchIssueByUserId } from "../api/issues";
import useAuthStore from "../store/authstore";
import { fetchProjects } from "../api/projects";

export default function useMyTasks() {
  const { user } = useAuthStore();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusTypeMap, setStatusTypeMap] = useState({});
  const load = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      // Fetch statuses and user's accessible projects
      const [statusRes, projectsRes] = await Promise.all([
        api.get(`/statuses`),
        fetchProjects(),
      ]);
      const userProjects = Array.isArray(projectsRes.projects) ? projectsRes.projects : [];
      // Get project IDs that the user has access to
      const userProjectIds = userProjects.map((p) => String(p.id));
      // Fetch issues for each project assigned to this user
      const issueLists = await Promise.all(
        userProjectIds.map((projId) => fetchIssueByUserId(projId, user.id))
      );
      // Flatten arrays of issues
      const userTasks = issueLists.flat();
      setTasks(userTasks);

      const statusMap = {};
      statusRes.data.forEach((s) => {
        statusMap[s.id] = s.type;
      });
      setStatusTypeMap(statusMap);
    } catch (err) {
      console.error("Failed to load tasks or statuses:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [user?.id]);

  const statusCounts = {
    todo: 0,
    inProgress: 0,
    done: 0,
  };
  let totalPoints = 0;
  let completedPoints = 0;
  tasks.forEach((t) => {
    const type = statusTypeMap[t.statusId];
    if (type === 0) statusCounts.todo += 1;
    if (type === 1) statusCounts.inProgress += 1;
    if (type === 2) statusCounts.done += 1;

    totalPoints += t.storyPoints || 0;
    if (type === 2) completedPoints += t.storyPoints || 0;
  });

  const progressPercent = totalPoints
    ? Math.round((completedPoints / totalPoints) * 100)
    : 0;
  return {
    tasks,
    loading,
    statusCounts,
    totalPoints,
    completedPoints,
    progressPercent,
    refetch: load,
  };
}

import { useEffect, useState } from "react";
import api from "../api/config";
import { useDataRefresh } from "./useDataRefresh";
import useAuthStore from "../store/authstore";

const STATUS_TYPE_LABELS = {
  0: "To Do",
  1: "In Progress",
  2: "Done",
};

export default function useDashboardData() {
  const [statusData, setStatusData] = useState([]);
  const [projectIssueData, setProjectIssueData] = useState([]);
  const [recentIssues, setRecentIssues] = useState([]);
  const [issueCount, setIssueCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();

  const fetchData = async () => {
    if (!user?.id) return;

    setLoading(true);
    try {
      const [issuesRes, projectsRes, statusesRes, membersRes] =
        await Promise.all([
          api.get("/issues"),
          api.get("/projects"),
          api.get("/statuses"),
          api.get("/project_members"),
        ]);
      const issues = Array.isArray(issuesRes.data) ? issuesRes.data : [];
      const projects = Array.isArray(projectsRes.data) ? projectsRes.data : [];
      const statuses = Array.isArray(statusesRes.data) ? statusesRes.data : [];
      const members = Array.isArray(membersRes.data) ? membersRes.data : [];

      // Get user's accessible projects
      const userProjectIds = members
        .filter((member) => String(member.userId) === String(user.id))
        .map((member) => String(member.projectId));

      // Filter issues to only include those from projects where user is a member
      const userIssues = issues.filter((issue) =>
        userProjectIds.includes(String(issue.projectId))
      );

      // Update counts to use filtered issues
      setIssueCount(userIssues.length);
      setRecentIssues(userIssues.slice(-5).reverse());

      // Status breakdown by type
      const statusTypeMap = {};
      statuses.forEach((status) => {
        statusTypeMap[String(status.id)] = status.type;
      });

      const typeCount = {};
      userIssues.forEach((issue) => {
        const type = statusTypeMap[String(issue.statusId)];
        const label = STATUS_TYPE_LABELS[type] || "Unknown";
        typeCount[label] = (typeCount[label] || 0) + 1;
      });

      // Ensure consistent order: To Do, In Progress, Done
      const orderedStatuses = ["To Do", "In Progress", "Done"];
      const statusChartData = orderedStatuses
        .filter((status) => typeCount[status] > 0)
        .map((name) => ({ name, value: typeCount[name] }));
      setStatusData(statusChartData);

      // Project issues chart
      const accessibleProjects = projects.filter((project) =>
        userProjectIds.includes(String(project.id))
      );

      const projectMap = {};
      accessibleProjects.forEach((p) => {
        projectMap[String(p.id)] = p.name;
      });

      // Initialize all accessible projects with 0 issues
      const projectGroup = {};
      accessibleProjects.forEach((project) => {
        projectGroup[project.name] = 0;
      });

      // Count issues for each accessible project using filtered issues
      userIssues.forEach((issue) => {
        const id = String(issue.projectId);
        const name = projectMap[id];
        if (name) {
          projectGroup[name] = (projectGroup[name] || 0) + 1;
        }
      });

      const projectChartData = Object.entries(projectGroup).map(
        ([project, issues]) => ({ project, issues })
      );
      setProjectIssueData(projectChartData);
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Listen for data refresh events (e.g., when projects are deleted)
  useDataRefresh((eventType) => {
    if (eventType === "projects" || eventType === "general") {
      fetchData();
    }
  });

  return {
    statusData,
    projectIssueData,
    recentIssues,
    issueCount,
    loading,
    refetch: fetchData, // Expose refetch function for manual refresh
  };
}

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
      // Get user's projects first
      const projectsRes = await api.get("/project");
      const projects = Array.isArray(projectsRes.data) ? projectsRes.data : [];
      
      if (projects.length === 0) {
        setStatusData([]);
        setProjectIssueData([]);
        setRecentIssues([]);
        setIssueCount(0);
        setLoading(false);
        return;
      }

      // Get global issues for the user
      const issuesRes = await api.get(`/issues/${user.id}`);
      const issues = Array.isArray(issuesRes.data) ? issuesRes.data : [];

      // Update counts
      setIssueCount(issues.length);
      setRecentIssues(issues.slice(-5).reverse());

      // For status data, we need to fetch statuses from each project
      // For now, let's use a simplified approach and get status info from the issues themselves
      const statusTypeCount = {};
      
      // Since we don't have direct access to status type mapping without project-specific calls,
      // we'll use a simplified approach based on issue data
      issues.forEach((issue) => {
        // You might need to adjust this based on your issue data structure
        if (issue.status) {
          const statusName = issue.status.name || 'Unknown';
          statusTypeCount[statusName] = (statusTypeCount[statusName] || 0) + 1;
        }
      });

      const statusChartData = Object.entries(statusTypeCount).map(
        ([name, value]) => ({ name, value })
      );
      setStatusData(statusChartData);

      // Project issues chart
      const projectMap = {};
      projects.forEach((p) => {
        projectMap[String(p.id)] = p.name;
      });

      // Initialize all projects with 0 issues
      const projectGroup = {};
      projects.forEach((project) => {
        projectGroup[project.name] = 0;
      });

      // Count issues for each project
      issues.forEach((issue) => {
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

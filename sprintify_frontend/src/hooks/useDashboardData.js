import { useEffect, useState } from "react";
import { fetchProjects } from "../api/projects";
import { fetchTasks } from "../api/tasks";
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
      // Fetch all accessible projects
      const projectsRes = await fetchProjects();
      const projects = Array.isArray(projectsRes.projects) ? projectsRes.projects : [];
      
      if (projects.length === 0) {
        setStatusData([]);
        setProjectIssueData([]);
        setRecentIssues([]);
        setIssueCount(0);
        setLoading(false);
        return;
      }

      // Fetch issues from each project
      const allIssues = [];
      const projectStats = {};

      for (const project of projects) {
        try {
          const issues = await fetchTasks(project.id);
          const issueArray = Array.isArray(issues) ? issues : (issues?.data || []);
          allIssues.push(...issueArray);
          projectStats[project.name] = issueArray.length;
        } catch (error) {
          console.error(`Failed to fetch issues for project ${project.id}:`, error);
          projectStats[project.name] = 0;
        }
      }

      // Calculate total issues
      setIssueCount(allIssues.length);
      setRecentIssues(allIssues.slice(-5).reverse());

      // Build status distribution
      const statusCount = {};
      allIssues.forEach((issue) => {
        if (issue.status) {
          const statusName = issue.status.name || (STATUS_TYPE_LABELS[issue.status.type] || "Unknown");
          statusCount[statusName] = (statusCount[statusName] || 0) + 1;
        }
      });

      // Format status data
      const statusChartData = Object.entries(statusCount)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => {
          const order = ["To Do", "In Progress", "Done"];
          return order.indexOf(a.name) - order.indexOf(b.name);
        });
      
      setStatusData(statusChartData);

      // Format project data
      const projectChartData = projects
        .map((project) => ({
          project: project.name,
          issues: projectStats[project.name] || 0,
        }))
        .filter(p => p.issues > 0) // Only show projects with issues
        .sort((a, b) => b.issues - a.issues); // Sort by issue count descending
      
      setProjectIssueData(projectChartData);
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
      // Gracefully handle failure
      setStatusData([]);
      setProjectIssueData([]);
      setRecentIssues([]);
      setIssueCount(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user?.id]);

  return {
    statusData,
    projectIssueData,
    recentIssues,
    issueCount,
    loading,
    refetch: fetchData, // Expose refetch function for manual refresh
  };
}

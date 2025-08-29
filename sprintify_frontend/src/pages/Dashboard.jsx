import React from "react";
import CustomPieChart from "../components/Charts/CustomPieChart";
import CustomBarChart from "../components/Charts/CustomBarChart";
import useDashboardData from "../hooks/useDashboardData";

import StatusBadge from "../components/dashboard/StatusBadge";
import ChartCard from "../components/dashboard/ChartCard";
import RecentActivityItem from "../components/dashboard/RecentActivityItem";

export default function Dashboard() {
  const { statusData, projectIssueData, recentIssues, issueCount, loading } =
    useDashboardData();

  return (
    <div className="space-y-10">
      {/* Overview Header */}
      <div className="bg-white dark:bg-gradient-card rounded-xl shadow p-6 border border-gray-200 dark:border-gray-700">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
          Dashboard Overview
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Quick insight into projects activity and issue distribution.
        </p>

        <div className="flex flex-wrap gap-4 mt-4">
          <StatusBadge
            label="Total Issues"
            value={issueCount}
            color="primary"
          />
          {statusData.map((s, i) => (
            <StatusBadge
              key={i}
              label={s.name}
              value={s.value}
              color={getColorFromStatus(s.name)}
            />
          ))}
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ChartCard title="Issue Status Distribution">
          {statusData.length === 0 ? (
            <div className="text-sm text-gray-500 p-4">
              No status data available
            </div>
          ) : (
            <CustomPieChart data={statusData} />
          )}
        </ChartCard>

        <ChartCard title="Issues per Project">
          {projectIssueData.length === 0 ? (
            <div className="text-sm text-gray-500 p-4">
              No project data available
            </div>
          ) : (
            <CustomBarChart data={projectIssueData} />
          )}
        </ChartCard>
      </div>
    </div>
  );
}

function getColorFromStatus(name) {
  const lower = name.toLowerCase();
  if (lower.includes("to do")) return "yellow";
  if (lower.includes("in progress")) return "blue";
  if (lower.includes("done")) return "green";
  return "gray";
}

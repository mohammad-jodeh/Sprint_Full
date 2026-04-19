import React, { useMemo } from "react";
import { Users, AlertCircle, TrendingUp } from "lucide-react";

const TeamCapacity = ({ issues = [], projectMembers = [] }) => {
  // Calculate workload for each team member
  const teamCapacity = useMemo(() => {
    if (!Array.isArray(issues) || !Array.isArray(projectMembers)) {
      return [];
    }

    // Get all assigned issues grouped by assignee
    const issuesByAssignee = {};
    issues.forEach((issue) => {
      if (issue.assignee) {
        if (!issuesByAssignee[issue.assignee]) {
          issuesByAssignee[issue.assignee] = [];
        }
        issuesByAssignee[issue.assignee].push(issue);
      }
    });

    // Create capacity data for each member
    const capacity = projectMembers.map((member) => {
      const assignedIssues = issuesByAssignee[member.id] || [];
      const totalPoints = assignedIssues.reduce(
        (sum, issue) => sum + (issue.storyPoint || 0),
        0
      );

      return {
        id: member.id,
        name: member.name || "Unknown",
        issueCount: assignedIssues.length,
        totalStoryPoints: totalPoints,
        isOverloaded: assignedIssues.length > 5 || totalPoints > 20, // Thresholds for overload
      };
    });

    // Sort by issue count (descending)
    return capacity.sort((a, b) => b.issueCount - a.issueCount);
  }, [issues, projectMembers]);

  if (teamCapacity.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2 mb-4">
          <Users size={20} className="text-blue-500" />
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            Team Capacity
          </h3>
        </div>
        <p className="text-gray-500 dark:text-gray-400">
          No team members found
        </p>
      </div>
    );
  }

  const maxIssues = Math.max(...teamCapacity.map((m) => m.issueCount), 1);

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Users size={20} className="text-blue-500" />
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            Team Capacity
          </h3>
        </div>
        <span className="text-xs bg-gray-100 dark:bg-gray-800 rounded-full px-2 py-1 text-gray-600 dark:text-gray-400">
          {teamCapacity.length} members
        </span>
      </div>

      {/* Team Members List */}
      <div className="space-y-4">
        {teamCapacity.map((member) => {
          const percentage = (member.issueCount / maxIssues) * 100;
          const capacityColor = member.isOverloaded
            ? "bg-red-500"
            : member.issueCount === 0
            ? "bg-green-500"
            : "bg-blue-500";

          return (
            <div key={member.id} className="space-y-2">
              {/* Member Info */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xs font-bold">
                    {member.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {member.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {member.issueCount} issue{member.issueCount !== 1 ? "s" : ""} • {member.totalStoryPoints} pts
                    </p>
                  </div>
                </div>
                {member.isOverloaded && (
                  <AlertCircle size={16} className="text-red-500" title="Overloaded" />
                )}
              </div>

              {/* Workload Bar */}
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${capacityColor}`}
                  style={{ width: `${Math.min(percentage, 100)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary Stats */}
      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Total Issues</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white">
              {teamCapacity.reduce((sum, m) => sum + m.issueCount, 0)}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Overloaded</p>
            <p className="text-lg font-bold text-red-500">
              {teamCapacity.filter((m) => m.isOverloaded).length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamCapacity;

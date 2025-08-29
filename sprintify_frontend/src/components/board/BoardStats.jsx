import React from "react";
import { Target, Zap, Users, Calendar } from "lucide-react";

// Component for displaying board header stats following SRP
const BoardStats = ({
  totalIssues,
  membersCount,
  activeSprint,
  selectedSprint,
}) => (
  <div className="flex items-center space-x-4 ml-8">
    <div className="flex items-center space-x-2 px-4 py-2 bg-white/50 dark:bg-black/30 rounded-full backdrop-blur-sm border border-white/30 dark:border-white/10">
      <Zap className="w-4 h-4 text-amber-500" />
      <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
        {totalIssues} Issues
      </span>
    </div>
    <div className="flex items-center space-x-2 px-4 py-2 bg-white/50 dark:bg-black/30 rounded-full backdrop-blur-sm border border-white/30 dark:border-white/10">
      <Users className="w-4 h-4 text-blue-500" />
      <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
        {membersCount} Members
      </span>
    </div>
    {selectedSprint && (
      <div className="flex items-center space-x-2 px-4 py-2 bg-emerald-50/80 dark:bg-emerald-900/30 rounded-full backdrop-blur-sm border border-emerald-200/50 dark:border-emerald-700/50">
        <Calendar className="w-4 h-4 text-emerald-500" />
        <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
          {selectedSprint.name}
        </span>
      </div>
    )}
    {!selectedSprint && activeSprint && (
      <div className="flex items-center space-x-2 px-4 py-2 bg-emerald-50/80 dark:bg-emerald-900/30 rounded-full backdrop-blur-sm border border-emerald-200/50 dark:border-emerald-700/50">
        <Calendar className="w-4 h-4 text-emerald-500" />
        <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
          {activeSprint.name}
        </span>
      </div>
    )}
    {!selectedSprint && !activeSprint && (
      <div className="flex items-center space-x-2 px-4 py-2 bg-gray-50/80 dark:bg-gray-800/30 rounded-full backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50">
        <Calendar className="w-4 h-4 text-gray-400" />
        <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">
          No Active Sprint
        </span>
      </div>
    )}
  </div>
);

// Component for displaying project title following SRP
const ProjectTitle = ({ projectName }) => (
  <div className="flex items-center space-x-3">
    <div className="relative">
      <div className="w-12 h-12 bg-gradient-to-br from-custom-500 to-custom-600 rounded-xl flex items-center justify-center shadow-lg">
        <Target className="w-6 h-6 text-white" />
      </div>
      <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full animate-ping"></div>
      <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full"></div>
    </div>
    <div>
      <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
        {projectName || "Project Board"}
      </h1>
      <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
        Sprint Management Dashboard
      </p>
    </div>
  </div>
);

export { BoardStats, ProjectTitle };

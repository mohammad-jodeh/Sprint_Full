import React from "react";
import { useParams } from "react-router-dom";
import {
  ArrowLeft,
  Home,
  Kanban,
  Calendar,
  Settings,
  Users,
  BarChart2,
} from "lucide-react";

import SideLinks from "../ui/SideLinks";

export default function ProjectSidebar() {
  const { projectId } = useParams();
  // Project sidebar links
  const links = [
    {
      to: `/projects/${projectId}`,
      icon: <Home className="mr-3 h-6 w-6 text-gray-500 dark:text-gray-400" />,
      text: "Overview",
    },
    {
      to: `/projects/${projectId}/board`,
      icon: (
        <Kanban className="mr-3 h-6 w-6 text-gray-500 dark:text-gray-400" />
      ),
      text: "Board",
    },
    {
      to: `/projects/${projectId}/backlog`,
      icon: (
        <Calendar className="mr-3 h-6 w-6 text-gray-500 dark:text-gray-400" />
      ),
      text: "BackLog",
    },
    {
      to: `/projects/${projectId}/sprint`,
      icon: (
        <BarChart2 className="mr-3 h-6 w-6 text-gray-500 dark:text-gray-400" />
      ),
      text: "Sprints",
    },
    {
      to: `/projects/${projectId}/team`,
      icon: <Users className="mr-3 h-6 w-6 text-gray-500 dark:text-gray-400" />,
      text: "Team",
    },
    {
      to: `/projects/${projectId}/settings`,
      icon: (
        <Settings className="mr-3 h-6 w-6 text-gray-500 dark:text-gray-400" />
      ),
      text: "Settings",
    },
  ];

  return (
    <nav className="px-4 py-6 space-y-1">
      <SideLinks
        to="/dashboard/projects"
        icon={
          <ArrowLeft className="mr-3 h-6 w-6 text-gray-500 dark:text-gray-400" />
        }
        text="Back to Projects"
      />

      <div className="py-3 px-2 border-b border-gray-200 dark:border-gray-700 mb-3">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          {/* Project Navigation */}
        </h2>
      </div>

      {links.map((link, index) => {
        return (
          <SideLinks
            key={index}
            to={link.to}
            icon={link.icon}
            text={link.text}
          />
        );
      })}
    </nav>
  );
}

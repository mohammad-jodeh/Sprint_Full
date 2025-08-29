import React from "react";
import { Outlet } from "react-router-dom";
import useThemeStore from "../../store/themeStore";
import Sidebar from "../sidebars/Sidebar";
import Navbar from "../navbar/navbar";

export default function DashboardLayout() {
  const { theme } = useThemeStore();
  return (
    <div className="h-screen flex flex-col overflow-hidden bg-gray-50 dark:bg-background-dark">
      {/* Background overlay elements */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary opacity-10 dark:opacity-10 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-600 opacity-10 dark:opacity-10 rounded-full blur-3xl transform -translate-x-1/3 translate-y-1/3"></div>
        <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-custom-600 opacity-10 dark:opacity-10 rounded-full blur-3xl"></div>
        <div className="hidden md:block absolute top-1/4 right-1/3 w-32 h-32 bg-teal-400 opacity-10 dark:opacity-10 rounded-full blur-2xl"></div>
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      </div>

      {/* Navbar stays fixed at top */}
      <Navbar />

      {/* Sidebar + Main Content */}
      <div className="flex flex-1 overflow-hidden relative z-10">
        {/* Sidebar */}
        <aside className="w-64 bg-white dark:bg-gradient-primary shadow-lg border-r border-gray-200 dark:border-gray-700">
          <Sidebar />
        </aside>
        {/* Page content area scrolls independently */}{" "}
        <main className="flex-1 overflow-y-auto p-6 text-gray-800 dark:text-gray-200">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

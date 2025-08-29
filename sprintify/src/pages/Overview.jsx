import React from "react";
import { useNavigate } from "react-router-dom";
import ThemeToggle from "../components/ThemeToggle";
import useThemeStore from "../store/themeStore";

const Overview = () => {
  const navigate = useNavigate();
  const { theme } = useThemeStore();

  const handleCreateProject = () => {
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-background-dark relative overflow-hidden">
      {/* Background overlay elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary opacity-10 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-600 opacity-10 rounded-full blur-3xl transform -translate-x-1/3 translate-y-1/3"></div>
        <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-custom-600 opacity-10 rounded-full blur-3xl"></div>
        <div className="hidden md:block absolute top-1/4 right-1/3 w-32 h-32 bg-teal-400 opacity-10 rounded-full blur-2xl"></div>

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      </div>

      {/* Theme toggle button */}
      <div className="absolute top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      {/* Centered Hero Content */}
      <div className="relative z-10 container mx-auto px-4 py-16 md:py-24 flex flex-col items-center justify-center min-h-screen">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-block mb-6 px-4 py-1 bg-primary/10 backdrop-blur-sm rounded-full">
            <span className="text-primary text-sm font-medium">
              Project Management Simplified
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-8 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300">
            Accelerate Your <br className="hidden sm:block" />
            Team's Delivery
          </h1>
          <p className="text-gray-700 dark:text-gray-300 text-lg mb-10 max-w-2xl mx-auto">
            Sprintify helps teams plan, track, and manage projects with an
            intuitive interface designed for modern development workflows.
          </p>

          <div className="flex flex-col sm:flex-row gap-5 justify-center mb-8">
            <button
              onClick={handleCreateProject}
              className="px-8 py-4 bg-primary hover:bg-primary-hover text-white font-medium rounded-lg transition-all duration-300 flex items-center justify-center mx-auto sm:mx-0 gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              Get Started
            </button>
          </div>

          <div className="mt-14 max-w-4xl mx-auto">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary to-indigo-600 rounded-lg blur opacity-30"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;

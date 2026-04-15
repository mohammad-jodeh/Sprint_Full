import React, { useState, useCallback } from "react";

export const SearchAndFilter = ({
  onSearch,
  onFilterChange,
  statuses = [],
  assignees = [],
  placeholder = "Search issues...",
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedAssignee, setSelectedAssignee] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = useCallback(
    (e) => {
      const term = e.target.value;
      setSearchTerm(term);
      onSearch(term);
    },
    [onSearch]
  );

  const handleFilterChange = useCallback(() => {
    onFilterChange({
      status: selectedStatus,
      assignee: selectedAssignee,
    });
  }, [onFilterChange, selectedStatus, selectedAssignee]);

  const handleStatusChange = (e) => {
    setSelectedStatus(e.target.value);
  };

  const handleAssigneeChange = (e) => {
    setSelectedAssignee(e.target.value);
  };

  const handleApplyFilters = () => {
    handleFilterChange();
    setShowFilters(false);
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedStatus("");
    setSelectedAssignee("");
    onSearch("");
    onFilterChange({ status: "", assignee: "" });
  };

  const activeFilterCount = [searchTerm, selectedStatus, selectedAssignee].filter(
    (v) => v
  ).length;

  return (
    <div className="space-y-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
      {/* Search Input */}
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          placeholder={placeholder}
          className="w-full px-4 py-2 rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <svg
          className="absolute right-3 top-3 w-5 h-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      {/* Filter Toggle Button */}
      <button
        onClick={() => setShowFilters(!showFilters)}
        className={`w-full px-4 py-2 rounded font-medium transition flex items-center justify-between ${
          activeFilterCount > 0
            ? "bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100"
            : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600"
        }`}
      >
        <span className="flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
          </svg>
          Filters
        </span>
        {activeFilterCount > 0 && (
          <span className="bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-bold">
            {activeFilterCount}
          </span>
        )}
      </button>

      {/* Filter Panel */}
      {showFilters && (
        <div className="space-y-3 p-4 bg-white dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600">
          {/* Status Filter */}
          {statuses.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Status
              </label>
              <select
                value={selectedStatus}
                onChange={handleStatusChange}
                className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Statuses</option>
                {statuses.map((status) => (
                  <option key={status.id} value={status.id}>
                    {status.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Assignee Filter */}
          {assignees.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Assigned To
              </label>
              <select
                value={selectedAssignee}
                onChange={handleAssigneeChange}
                className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Unassigned</option>
                {assignees.map((assignee) => (
                  <option key={assignee.id} value={assignee.id}>
                    {assignee.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <button
              onClick={handleApplyFilters}
              className="flex-1 px-3 py-2 rounded bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
            >
              Apply Filters
            </button>
            <button
              onClick={handleClearFilters}
              className="flex-1 px-3 py-2 rounded bg-gray-200 dark:bg-gray-600 text-gray-900 dark:text-white font-medium hover:bg-gray-300 dark:hover:bg-gray-500 transition"
            >
              Clear
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

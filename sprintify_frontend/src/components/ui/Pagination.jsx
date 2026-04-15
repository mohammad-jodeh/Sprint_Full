import React from "react";

export const Pagination = ({ currentPage, totalPages, onPageChange, isLoading }) => {
  if (totalPages <= 1) return null;

  const pages = [];
  const maxPagesToShow = 5;

  if (totalPages <= maxPagesToShow) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
  } else {
    // Show first page, current page range, and last page
    pages.push(1);
    if (currentPage > 3) pages.push("...");

    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) {
      if (!pages.includes(i)) pages.push(i);
    }

    if (currentPage < totalPages - 2) pages.push("...");
    pages.push(totalPages);
  }

  return (
    <div className="flex items-center justify-center gap-2 mt-6 p-4">
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1 || isLoading}
        className={`px-3 py-2 rounded border transition ${
          currentPage === 1 || isLoading
            ? "bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed"
            : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600"
        }`}
      >
        ← Previous
      </button>

      {/* Page Numbers */}
      <div className="flex gap-1">
        {pages.map((page, idx) => (
          <React.Fragment key={idx}>
            {page === "..." ? (
              <span className="px-3 py-2 text-gray-500 dark:text-gray-400">
                {page}
              </span>
            ) : (
              <button
                onClick={() => onPageChange(page)}
                disabled={isLoading}
                className={`px-3 py-2 rounded border transition ${
                  page === currentPage
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600"
                }`}
              >
                {page}
              </button>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages || isLoading}
        className={`px-3 py-2 rounded border transition ${
          currentPage === totalPages || isLoading
            ? "bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed"
            : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600"
        }`}
      >
        Next →
      </button>

      {/* Page Info */}
      <span className="text-gray-600 dark:text-gray-400 text-sm ml-4">
        Page {currentPage} of {totalPages}
      </span>
    </div>
  );
};

export const usePagination = (initialPage = 1, itemsPerPage = 20) => {
  const [currentPage, setCurrentPage] = React.useState(initialPage);
  const [totalItems, setTotalItems] = React.useState(0);

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const offset = (currentPage - 1) * itemsPerPage;

  return {
    currentPage,
    totalPages,
    offset,
    itemsPerPage,
    totalItems,
    setTotalItems,
    handlePageChange,
    setCurrentPage,
  };
};

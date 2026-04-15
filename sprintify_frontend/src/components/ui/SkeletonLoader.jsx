import React from "react";

export const SkeletonLoader = ({ width = "w-full", height = "h-4", count = 1 }) => {
  return (
    <div className="space-y-2">
      {Array(count)
        .fill(0)
        .map((_, i) => (
          <div
            key={i}
            className={`${width} ${height} bg-gradient-to-r from-gray-300 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded animate-pulse`}
          />
        ))}
    </div>
  );
};

export const BoardSkeleton = () => (
  <div className="p-6 space-y-4">
    <div className="flex gap-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="flex-1">
          <SkeletonLoader width="w-full" height="h-8" count={1} />
          <div className="mt-4 space-y-3">
            {[1, 2, 3].map((j) => (
              <div key={j} className="bg-gray-100 dark:bg-gray-800 rounded p-4">
                <SkeletonLoader width="w-3/4" height="h-4" />
                <SkeletonLoader width="w-1/2" height="h-3" count={1} />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

export const IssueListSkeleton = () => (
  <div className="space-y-3">
    {[1, 2, 3, 4, 5].map((i) => (
      <div key={i} className="bg-gray-100 dark:bg-gray-800 rounded p-4">
        <SkeletonLoader width="w-2/3" height="h-4" />
        <SkeletonLoader width="w-1/2" height="h-3" count={1} />
      </div>
    ))}
  </div>
);

export const SprintSkeleton = () => (
  <div className="space-y-4">
    {[1, 2, 3].map((i) => (
      <div key={i} className="bg-gray-100 dark:bg-gray-800 rounded p-4">
        <SkeletonLoader width="w-1/3" height="h-5" />
        <div className="mt-2">
          <SkeletonLoader width="w-full" height="h-4" count={2} />
        </div>
      </div>
    ))}
  </div>
);

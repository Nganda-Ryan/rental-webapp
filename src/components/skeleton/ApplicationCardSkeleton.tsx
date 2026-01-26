import React from 'react';

export const ApplicationCardSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4 shadow-sm animate-pulse">
      {/* Avatar and Status */}
      <div className="flex items-start justify-between mb-4">
        <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700" />
        <div className="h-6 w-20 rounded-full bg-gray-200 dark:bg-gray-700" />
      </div>

      {/* Name */}
      <div className="mb-3">
        <div className="h-5 w-3/4 rounded bg-gray-200 dark:bg-gray-700" />
      </div>

      {/* Contact Info */}
      <div className="space-y-2 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-gray-200 dark:bg-gray-700" />
          <div className="h-4 w-2/3 rounded bg-gray-200 dark:bg-gray-700" />
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-gray-200 dark:bg-gray-700" />
          <div className="h-4 w-1/2 rounded bg-gray-200 dark:bg-gray-700" />
        </div>
      </div>

      {/* Type Badge */}
      <div className="mt-auto pt-3 border-t border-gray-200 dark:border-gray-700">
        <div className="h-3 w-16 rounded bg-gray-200 dark:bg-gray-700" />
      </div>
    </div>
  );
};

export default ApplicationCardSkeleton;


import React from "react";

const RenderMobileCardSkeleton = () => {
  return (
    <div>
      <div className="w-full bg-white dark:bg-gray-800 shadow-sm rounded-lg p-4 border border-gray-200 dark:border-gray-700 animate-pulse">
        {/* Header with asset name and status icon */}
        <div className="font-medium text-gray-900 dark:text-gray-100 flex items-center justify-between flex-nowrap mb-4">
          <div className="h-5 bg-gray-200 dark:bg-gray-600 rounded w-1/3"></div>
          <div className="h-5 w-15 bg-gray-200 dark:bg-gray-600 rounded-full"></div>
        </div>
        
        {/* Creator details */}
        <div className="space-y-2 mb-4">
          {/* Name */}
          <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-1/2"></div>
          
          {/* Email */}
          <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-3/4"></div>
          
          {/* Phone */}
          <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-1/3"></div>
          
          {/* Submission date */}
          <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-2/5"></div>
        </div>
        
        {/* Action buttons */}
        <div className="flex space-x-3 mt-4">
          {/* Reject button skeleton */}
          <div className="flex-1 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-700"></div>
          
          {/* Approve button skeleton */}
          <div className="flex-1 px-3 py-2 rounded-lg bg-gray-200 dark:bg-gray-600"></div>
        </div>
      </div>

      <br />

      <div className="w-full bg-white dark:bg-gray-800 shadow-sm rounded-lg p-4 border border-gray-200 dark:border-gray-700 animate-pulse">
        {/* Header with asset name and status icon */}
        <div className="font-medium text-gray-900 dark:text-gray-100 flex items-center justify-between flex-nowrap mb-4">
          <div className="h-5 bg-gray-200 dark:bg-gray-600 rounded w-1/3"></div>
          <div className="h-5 w-15 bg-gray-200 dark:bg-gray-600 rounded-full"></div>
        </div>
        
        {/* Creator details */}
        <div className="space-y-2 mb-4">
          {/* Name */}
          <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-1/2"></div>
          
          {/* Email */}
          <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-3/4"></div>
          
          {/* Phone */}
          <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-1/3"></div>
          
          {/* Submission date */}
          <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-2/5"></div>
        </div>
        
        {/* Action buttons */}
        <div className="flex space-x-3 mt-4">
          {/* Reject button skeleton */}
          <div className="flex-1 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-700"></div>
          
          {/* Approve button skeleton */}
          <div className="flex-1 px-3 py-2 rounded-lg bg-gray-200 dark:bg-gray-600"></div>
        </div>
      </div>

      <br />

      <div className="w-full bg-white dark:bg-gray-800 shadow-sm rounded-lg p-4 border border-gray-200 dark:border-gray-700 animate-pulse">
        {/* Header with asset name and status icon */}
        <div className="font-medium text-gray-900 dark:text-gray-100 flex items-center justify-between flex-nowrap mb-4">
          <div className="h-5 bg-gray-200 dark:bg-gray-600 rounded w-1/3"></div>
          <div className="h-5 w-15 bg-gray-200 dark:bg-gray-600 rounded-full"></div>
        </div>
        
        {/* Creator details */}
        <div className="space-y-2 mb-4">
          {/* Name */}
          <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-1/2"></div>
          
          {/* Email */}
          <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-3/4"></div>
          
          {/* Phone */}
          <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-1/3"></div>
          
          {/* Submission date */}
          <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-2/5"></div>
        </div>
        
        {/* Action buttons */}
        <div className="flex space-x-3 mt-4">
          {/* Reject button skeleton */}
          <div className="flex-1 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-700"></div>
          
          {/* Approve button skeleton */}
          <div className="flex-1 px-3 py-2 rounded-lg bg-gray-200 dark:bg-gray-600"></div>
        </div>
      </div>
    </div>
  );
};

export default RenderMobileCardSkeleton;
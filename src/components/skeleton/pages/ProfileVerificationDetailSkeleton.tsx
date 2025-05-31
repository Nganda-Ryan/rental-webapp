import React from 'react';

const Skeleton = ({ className = '', circle = false }: { className?: string; circle?: boolean }) => {
  return (
    <div
      className={`animate-pulse bg-gray-300 dark:bg-gray-700 ${
        circle ? 'rounded-full' : 'rounded-md'
      } ${className}`}
    />
  );
};

const ProfileVerificationDetailSkeleton = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main Content */}
      <div className="lg:col-span-2 space-y-6">
        {/* Basic Info Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-gray-900/30 p-6 space-y-6">
          <div className="flex flex-col sm:flex-row items-start gap-6">
            <Skeleton circle={true} className="h-20 w-20" />
            <div className="flex-1 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <Skeleton className="h-8 w-52" />
              </div>
            </div>
          </div>
        </div>

        {/* Documents Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-gray-900/30 p-6 space-y-6">
          <Skeleton className="h-8 w-52" />
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div className="flex items-center gap-2">
                  <Skeleton circle={true} className="h-5 w-10" />
                  <div className="space-y-2">
                    <Skeleton className="h-1 w-36" />
                    <Skeleton className="h-1 w-24" />
                  </div>
                </div>
                <Skeleton className="h-5 w-20" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-gray-900/30 p-6 space-y-6">
          <Skeleton className="h-8 w-52" />
          <div className="space-y-4">
            {Array.from({ length: 2 }).map((_, index) => (
              <div key={index} className="space-y-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-5 w-40" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileVerificationDetailSkeleton;

import React from 'react'

const ManagerCardSkeleton = () => {
  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-2 bg-white dark:bg-gray-800 animate-pulse space-y-4">
        <div className="flex items-center gap-4 mb-6.5">
            <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700" />
            <div className="flex-1 space-y-2">
            <div className="h-4 w-3/4 rounded bg-gray-200 dark:bg-gray-700" />
            <div className="h-4 w-1/2 rounded bg-gray-200 dark:bg-gray-700" />
            </div>
        </div>
        <div className="space-y-2 pl-2.5">
            <div className="h-4 w-2/3 rounded bg-gray-200 dark:bg-gray-700" />
            <div className="h-4 w-1/2 rounded bg-gray-200 dark:bg-gray-700" />
        </div>
    </div>
  )
}

export default ManagerCardSkeleton
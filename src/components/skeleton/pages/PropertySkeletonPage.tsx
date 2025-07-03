import React from 'react'

export const PropertySkeletonPageSection1 = () => {
  return (
    <div className="lg:col-span-2 space-y-6 h-fit animate-pulse">
        {/* Skeleton image */}
        <div className="rounded-lg overflow-hidden h-100 bg-gray-200 dark:bg-gray-700" />

        {/* Skeleton details */}
        <div className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow-sm space-y-4">
            <div className="flex justify-between">
            <div className="space-y-2">
                <div className="h-5 w-40 bg-gray-300 dark:bg-gray-700 rounded" />
                <div className="h-4 w-32 bg-gray-200 dark:bg-gray-600 rounded" />
            </div>
            <div className="h-6 w-6 bg-gray-300 dark:bg-gray-700 rounded-full" />
            </div>
            <div className="grid grid-cols-4 gap-4 border-t border-gray-100 dark:border-gray-800 pt-4">
            {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-6 bg-gray-200 dark:bg-gray-700 rounded" />
            ))}
            </div>
        </div>
    </div>

  )
}

export const PropertySkeletonPageSection2 = () => {
  return (
    <div>
        <div className="space-y-6">
            {/* Skeleton actions */}
            <div className="bg-white dark:bg-gray-900 rounded-lg p-4 shadow-sm space-y-3">
                <div className="font-medium mb-4">
                    Quick Actions
                </div>
                {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-8 bg-gray-200 dark:bg-gray-700 rounded" />
                ))}
            </div>

            {/* TENANT REQUESTS SKELETON */}
            <div className="bg-white dark:bg-gray-900 rounded-lg p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-3.5">
                <div className="h-5 w-5 bg-gray-300 dark:bg-gray-600 rounded-full animate-pulse" />
                <div className="h-5 w-40 bg-gray-300 dark:bg-gray-600 rounded animate-pulse" />
                </div>
                <div className="space-y-4">
                    {[...Array(2)].map((_, i) => (
                        <div key={i} className="border border-gray-100 dark:border-gray-700 rounded-lg p-4 animate-pulse">
                        <div className="flex justify-between items-start">
                            <div className="space-y-1">
                            <div className="h-4 w-32 bg-gray-300 dark:bg-gray-600 rounded" />
                            <div className="h-3 w-48 bg-gray-200 dark:bg-gray-700 rounded" />
                            <div className="h-3 w-40 bg-gray-200 dark:bg-gray-700 rounded" />
                            </div>
                            <div className="flex flex-col items-end space-y-1">
                            <div className="h-3 w-16 bg-gray-300 dark:bg-gray-600 rounded" />
                            <div className="h-3 w-16 bg-gray-300 dark:bg-gray-600 rounded" />
                            </div>
                        </div>
                        <div className="flex gap-2 mt-3">
                            <div className="h-7.5 w-16.5 bg-gray-200 dark:bg-gray-700 rounded-lg" />
                            <div className="h-7.5 w-16.5 bg-gray-200 dark:bg-gray-700 rounded-lg" />
                        </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
  )
}
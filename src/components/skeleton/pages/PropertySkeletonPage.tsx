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

        {/* Skeleton actions */}
        <div className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow-sm space-y-3">
            <div className="font-medium mb-4">
                Quick Actions
            </div>
            {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-10 bg-gray-200 dark:bg-gray-700 rounded" />
            ))}
        </div>
    </div>

  )
}

export const PropertySkeletonPageSection2 = () => {
  return (
    <div>
        <div className="space-y-6">
            {/* BILLING STATEMENT SKELETON */}
            <div className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold flex items-center gap-2 text-gray-800 dark:text-gray-100">
                    <div className="h-5 w-5 bg-gray-300 dark:bg-gray-600 rounded-full animate-pulse" />
                    <div className="h-5 w-40 bg-gray-300 dark:bg-gray-600 rounded animate-pulse" />
                </h2>
                </div>

                <div className="space-y-4">
                <div className="flex justify-between items-center mb-4">
                    <div className="h-4 w-32 bg-gray-300 dark:bg-gray-600 rounded animate-pulse" />
                    <div className="h-8 w-32 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                        <tr>
                        {["Invoice ID", "Tenant", "Date", "Period", "Amount", "Status", "Actions"].map((_, i) => (
                            <th key={i} className="px-4 py-2">
                            <div className="h-3 w-16 bg-gray-300 dark:bg-gray-600 rounded animate-pulse" />
                            </th>
                        ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {[...Array(5)].map((_, rowIdx) => (
                        <tr key={rowIdx} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                            {Array(7).fill(0).map((_, colIdx) => (
                            <td key={colIdx} className="px-4 py-3">
                                <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                            </td>
                            ))}
                        </tr>
                        ))}
                    </tbody>
                    </table>
                </div>
                </div>
            </div>

            {/* TENANT REQUESTS SKELETON */}
            <div className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                <div className="h-5 w-5 bg-gray-300 dark:bg-gray-600 rounded-full animate-pulse" />
                <div className="h-5 w-40 bg-gray-300 dark:bg-gray-600 rounded animate-pulse" />
                </div>
                <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="border border-gray-100 dark:border-gray-700 rounded-lg p-4 animate-pulse">
                    <div className="flex justify-between items-start mb-2">
                        <div className="space-y-1">
                        <div className="h-4 w-32 bg-gray-300 dark:bg-gray-600 rounded" />
                        <div className="h-3 w-48 bg-gray-200 dark:bg-gray-700 rounded" />
                        <div className="h-3 w-40 bg-gray-200 dark:bg-gray-700 rounded" />
                        </div>
                        <div className="flex flex-col items-end space-y-1">
                        <div className="h-5 w-20 bg-blue-200 dark:bg-blue-200/20 rounded-full" />
                        <div className="h-3 w-16 bg-gray-300 dark:bg-gray-600 rounded" />
                        </div>
                    </div>
                    <div className="flex gap-2 mt-3">
                        <div className="h-8 w-20 bg-[#2A4365] rounded-lg" />
                        <div className="h-8 w-20 bg-gray-200 dark:bg-gray-700 rounded-lg" />
                    </div>
                    </div>
                ))}
                </div>
            </div>
        </div>
    </div>
  )
}
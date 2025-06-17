import React from 'react';
import RenderMobileCardSkeleton from './RenderMobileCardSkeleton';
import RenderDesktopTableSkeleton from './RenderDesktopTableSkeleton';

interface SkeletonTableProps {
  rows?: number;
  columns?: number;
}

export const SkeletonTable = ({ rows, columns = 4 }: SkeletonTableProps) => {
  // console.log(rows)
  return (
    <>
        <div className="lg:hidden space-y-4">
            <RenderMobileCardSkeleton />
        </div>
        <div className="hidden lg:block bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700">
            <RenderDesktopTableSkeleton columnsCount={columns} rowsCount={rows}/>
        </div>
    </>
  );
};

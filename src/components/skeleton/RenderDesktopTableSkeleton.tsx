type Props = {
  columnsCount: number;
  rowsCount?: number;
};

const Skeleton = ({ className = '' }: { className?: string }) => (
  <div className={`h-4 bg-gray-300 dark:bg-gray-600 rounded ${className} animate-pulse`} />
);

const RenderDesktopTableSkeleton = ({ columnsCount, rowsCount = 6 }: Props) => {
  return (
    <div className="hidden lg:block bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700">
      <table className="w-full">
        <thead className="bg-gray-50 dark:bg-gray-800/50">
          <tr>
            {Array.from({ length: columnsCount }).map((_, index) => (
              <th
                key={index}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                <div className="h-3 w-20 bg-gray-300 dark:bg-gray-600 rounded animate-pulse" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {Array.from({ length: rowsCount }).map((_, rowIdx) => (
            <tr key={rowIdx} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
              {Array.from({ length: columnsCount }).map((_, colIdx) => (
                <td key={colIdx} className="px-6 py-4 space-y-2">
                  <Skeleton />
                  <Skeleton className="w-3/4" />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RenderDesktopTableSkeleton;

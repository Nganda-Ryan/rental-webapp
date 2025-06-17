import React, { useState, useEffect, useRef } from 'react';
import autoAnimate from '@formkit/auto-animate'



interface Column {
  key: string
  label: string
  render?: (value: any, row: any) => React.ReactNode
  priority?: 'high' | 'medium' | 'low'
}

interface ShowMoreOption {
  label?: string
  url: string
}

interface ResponsiveTableProps {
  columns: Column[]
  data: any[]
  onRowClick?: (row: any) => void
  keyField: string
  showMore?: ShowMoreOption
  paginate?: number // nombre d'éléments par page
}

export const ResponsiveTable = ({
  columns,
  data,
  onRowClick,
  keyField,
  showMore,
  paginate,
}: ResponsiveTableProps) => {
  const [page, setPage] = useState(1)
  const highPriorityColumns = columns.filter((col) => col.priority === 'high')
  const mediumPriorityColumns = columns.filter((col) => col.priority === 'medium')
  const lowPriorityColumns = columns.filter((col) => col.priority === 'low')

  const tableBodyRef = useRef(null);
  useEffect(() => {
    tableBodyRef.current && autoAnimate(tableBodyRef.current, { duration: 300 });
  }, []);
  const startIndex = paginate ? (page - 1) * paginate : 0
  const endIndex = paginate ? startIndex + paginate : data.length
  const paginatedData = paginate ? data.slice(startIndex, endIndex) : data
  const totalPages = paginate ? Math.ceil(data.length / paginate) : 1

  
  return (
    <div className="w-full">
      {/* Mobile View */}
      <div className="md:hidden space-y-4">
        {paginatedData.map((row) => (
          <div
            key={row[keyField]}
            onClick={() => onRowClick?.(row)}
            className="bg-white dark:bg-gray-800 rounded p-5 shadow-sm border dark:border-gray-600 my-2 space-y-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-500 ease-in-out"
          >
            <div className="space-y-2">
              {highPriorityColumns.map((col) => (
                <div key={col.key} className="flex justify-between items-start mb-4">
                  <span className="text-sm font-bold text-gray-700 dark:text-gray-200">
                    {col.label} :
                  </span>
                  <span className="text-sm text-right text-gray-900 dark:text-white">
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </span>
                </div>
              ))}
            </div>
            {mediumPriorityColumns.length > 0 && <hr className="border-t border-gray-200 dark:border-gray-700" />}
            <div className="space-y-2">
              {mediumPriorityColumns.map((col) => (
                <div key={col.key} className="flex justify-between items-start">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    {col.label} :
                  </span>
                  <span className="text-sm text-right text-gray-800 dark:text-gray-200">
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </span>
                </div>
              ))}
            </div>
            {lowPriorityColumns.length > 0 && <hr className="border-t border-gray-200 dark:border-gray-700" />}
            {lowPriorityColumns.length > 0 && (
              <div className="space-y-2">
                {lowPriorityColumns.map((col) => (
                  <div key={col.key} className="flex justify-between items-start">
                    <span className="text-sm text-gray-500 dark:text-gray-300">
                      {col.label} :
                    </span>
                    <span className="text-sm text-right text-gray-700 dark:text-gray-200">
                      {col.render ? col.render(row[col.key], row) : row[col.key]}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Desktop View */}
      <div className="hidden md:block bg-white dark:bg-gray-800 rounded shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider"
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700" ref={tableBodyRef}>
            {paginatedData.map((row) => (
              <tr
                key={row[keyField]}
                onClick={() => onRowClick?.(row)}
                className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
              >
                {columns.map((column) => (
                  <td key={column.key} className="px-6 py-2.5 text-gray-900 dark:text-gray-100">
                    {column.render ? column.render(row[column.key], row) : row[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {paginate && totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 my-4">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
            className="text-sm px-3 py-1.5 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-sm text-gray-700 dark:text-gray-200">
            Page {page} / {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            disabled={page === totalPages}
            className="text-sm px-3 py-1.5 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {showMore && !paginate && (
        <>
          <div className="hidden md:block bg-blue-50 dark:bg-blue-900/30 rounded-b-lg border-t border-blue-100 dark:border-blue-800 text-center py-1.5">
            <ShowMoreLink showMore={showMore} />
          </div>
          <div className="md:hidden bg-blue-50 dark:bg-blue-900/30 shadow p-2 mx-1 text-center border-t border-blue-100 dark:border-blue-800">
            <ShowMoreLink showMore={showMore} />
          </div>
        </>
      )}
    </div>
  )
}

const ShowMoreLink = ({ showMore }: { showMore: ShowMoreOption }) => (
  <a href={showMore.url} className="text-sm font-medium text-blue-700 dark:text-blue-300 hover:underline transition">
    {showMore.label || 'Voir plus'}
  </a>
)

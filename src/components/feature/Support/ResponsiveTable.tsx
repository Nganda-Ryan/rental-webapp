import React from 'react'
interface Column {
  key: string
  label: string
  render?: (value: any, row: any) => React.ReactNode
  priority?: 'high' | 'medium' | 'low'
}
interface ResponsiveTableProps {
  columns: Column[]
  data: any[]
  onRowClick?: (row: any) => void
  keyField: string
}
export const ResponsiveTable = ({
  columns,
  data,
  onRowClick,
  keyField,
}: ResponsiveTableProps) => {
  const highPriorityColumns = columns.filter((col) => col.priority === 'high')
  const mediumPriorityColumns = columns.filter((col) => col.priority === 'medium')
  const lowPriorityColumns = columns.filter((col) => col.priority === 'low')
  return (
    <div className="w-full">
      {/* Mobile View */}
      <div className="lg:hidden space-y-4">
        {data.map((row) => (
          <div
            key={row[keyField]}
            onClick={() => onRowClick?.(row)}
            className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-md space-y-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          >
            {/* High Priority Content avec labels visibles */}
            <div className="space-y-2">
              {highPriorityColumns.map((col) => (
                <div key={col.key} className="flex justify-between items-start">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {col.label} :
                  </span>
                  <span className="text-sm text-right text-gray-900 dark:text-white">
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </span>
                </div>
              ))}
            </div>

            {/* Séparateur visuel */}
            {mediumPriorityColumns.length > 0 && <hr className="border-t border-gray-200 dark:border-gray-700" />}

            {/* Medium Priority Content */}
            <div className="space-y-2">
              {mediumPriorityColumns.map((col) => (
                <div key={col.key} className="flex justify-between items-start">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {col.label} :
                  </span>
                  <span className="text-sm text-right text-gray-800 dark:text-gray-200">
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>



      {/* Desktop View */}
      <div className="hidden lg:block bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {data.map((row) => (
              <tr
                key={row[keyField]}
                onClick={() => onRowClick?.(row)}
                className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
              >
                {columns.map((column) => (
                  <td key={column.key} className="px-6 py-4 text-gray-900 dark:text-gray-100">
                    {column.render ? column.render(row[column.key], row) : row[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

  )
}
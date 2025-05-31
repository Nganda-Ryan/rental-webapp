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
            className="bg-white rounded-lg p-4 shadow-sm cursor-pointer hover:bg-gray-50"
          >
            {/* High Priority Content - Always Visible */}
            <div className="flex justify-between items-start mb-2">
              {highPriorityColumns.map((col) => (
                <div key={col.key}>
                  {col.render ? col.render(row[col.key], row) : row[col.key]}
                </div>
              ))}
            </div>
            {/* Medium Priority Content */}
            <div className="mt-2 space-y-2">
              {mediumPriorityColumns.map((col) => (
                <div key={col.key} className="text-sm text-gray-600">
                  <span className="font-medium mr-2">{col.label}:</span>
                  {col.render ? col.render(row[col.key], row) : row[col.key]}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      {/* Desktop View */}
      <div className="hidden lg:block bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th key={column.key} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data.map((row) => (
              <tr
                key={row[keyField]}
                onClick={() => onRowClick?.(row)}
                className="hover:bg-gray-50 cursor-pointer"
              >
                {columns.map((column) => (
                  <td key={column.key} className="px-6 py-4">
                    {column.render ? column.render(row[column.key], row): row[column.key]}
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
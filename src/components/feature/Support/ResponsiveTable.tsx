'use client';
import React, { useState, useEffect, useRef } from 'react';
import autoAnimate from '@formkit/auto-animate'
import { ListCollapse, Search } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { v4 as uuidv4 } from 'uuid';

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
  searchKey?: string // clé de recherche pour activer la barre de recherche
}

export const ResponsiveTable = ({
  columns,
  data,
  onRowClick,
  keyField,
  showMore,
  paginate,
  searchKey,
}: ResponsiveTableProps) => {
  const [page, setPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const t = useTranslations('Table');

  const highPriorityColumns = columns.filter((col) => col.priority === 'high')
  const mediumPriorityColumns = columns.filter((col) => col.priority === 'medium')
  const lowPriorityColumns = columns.filter((col) => col.priority === 'low')

  const tableBodyRef = useRef(null);
  useEffect(() => {
    tableBodyRef.current && autoAnimate(tableBodyRef.current, { duration: 300 });
  }, []);

  // Fonction de filtrage des données
  const filteredData = searchKey && searchTerm 
    ? data.filter(row => {
        const searchValue = row[searchKey];
        if (searchValue === null || searchValue === undefined) return false;
        return searchValue.toString().toLowerCase().includes(searchTerm.toLowerCase());
      })
    : data;

  // Réinitialiser la page lors d'une recherche
  useEffect(() => {
    setPage(1);
  }, [searchTerm]);

  const startIndex = paginate ? (page - 1) * paginate : 0
  const endIndex = paginate ? startIndex + paginate : filteredData.length
  const paginatedData = paginate ? filteredData.slice(startIndex, endIndex) : filteredData
  const totalPages = paginate ? Math.ceil(filteredData.length / paginate) : 1

  return (
    <div className="w-full">
      {/* Barre de recherche - uniquement si searchKey est fournie */}
      {searchKey && (
        <div className="mb-4 relative">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={20} />
            <input
              type="text"
              placeholder={t('searchPlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 outline-none transition-all duration-200"
            />
          </div>
          {searchTerm && (
            <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              {t('results', { count: filteredData.length })}
            </div>
          )}
        </div>
      )}

      {/* Mobile View */}
      <div className="md:hidden space-y-2">
        {paginatedData.map((row) => (
          <div
            key={uuidv4()}
            onClick={() => onRowClick?.(row)}
            className="bg-white dark:bg-gray-800 rounded p-5 shadow-sm border dark:border-gray-600 my-2 space-y-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-500 ease-in-out"
          >
            <div className="space-y-2">
              {highPriorityColumns.map((col) => (
                <div key={uuidv4()} className="flex justify-between items-start">
                  <span className=" font-medium text-gray-600 dark:text-gray-200">
                    {col.label} :
                  </span>
                  <span className=" text-right text-gray-600 dark:text-white">
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </span>
                </div>
              ))}
            </div>
            {mediumPriorityColumns.length > 0 && <hr className="border-t border-gray-200 dark:border-gray-700" />}
            <div className="space-y-2">
              {mediumPriorityColumns.map((col) => (
                <div key={uuidv4()} className="flex justify-between items-start">
                  <span className=" font-medium text-gray-600 dark:text-gray-300">
                    {col.label} :
                  </span>
                  <span className=" text-right text-gray-600 dark:text-gray-200">
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </span>
                </div>
              ))}
            </div>
            {lowPriorityColumns.length > 0 && <hr className="border-t border-gray-200 dark:border-gray-700" />}
            {lowPriorityColumns.length > 0 && (
              <div className="space-y-2">
                {lowPriorityColumns.map((col) => (
                  <div key={uuidv4()} className="flex justify-between items-start">
                    <span className=" text-gray-500 dark:text-gray-300">
                      {col.label} :
                    </span>
                    <span className=" text-right text-gray-600 dark:text-gray-200">
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
                  key={uuidv4()}
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
                key={uuidv4()}
                onClick={() => onRowClick?.(row)}
                className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
              >
                {columns.map((column) => (
                  <td key={uuidv4()} className="px-6 py-2.5 text-gray-900 dark:text-gray-100">
                    {column.render ? column.render(row[column.key], row) : row[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Message si aucun résultat */}
      {paginatedData.length === 0 && searchTerm && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <Search className="mx-auto mb-2" size={48} />
          <p>{t('noResults', { searchTerm })}</p>
        </div>
      )}

      {paginate && totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 my-4">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
            className=" px-3 py-1.5 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 disabled:opacity-50"
          >
            {t('previous')}
          </button>
          <span className=" text-gray-700 dark:text-gray-200">
            {t('page', { page, totalPages })}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            disabled={page === totalPages}
            className=" px-3 py-1.5 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 disabled:opacity-50"
          >
            {t('next')}
          </button>
        </div>
      )}

      {showMore && !paginate && (
        <>
          <div className="hidden md:block bg-blue-100 dark:bg-blue-900/60 rounded-b-lg border-t border-blue-100 dark:border-blue-800 text-center py-1.5">
            <ShowMoreLink showMore={showMore} />
          </div>
          <div className="md:hidden bg-blue-100 dark:bg-blue-900/60 shadow p-2 mt-2 text-center border-t border-blue-100 dark:border-blue-800">
            <ShowMoreLink showMore={showMore} />
          </div>
        </>
      )}
    </div>
  )
}

const ShowMoreLink = ({ showMore }: { showMore: ShowMoreOption }) => {
  const commonT = useTranslations('Common');
  return (
    <a href={showMore.url} className=" font-medium text-blue-700 dark:text-blue-300 hover:underline transition flex gap-2 justify-center items-center">
      <span>{showMore.label || commonT('seeMore')}</span> <span><ListCollapse size={20} className="text-blue-700 dark:text-blue-300" /></span>
    </a>
  );
}
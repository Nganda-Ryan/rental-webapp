'use client';

import React, { useEffect, useRef } from 'react';
import autoAnimate from '@formkit/auto-animate';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Search } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { ResponsiveTablePaginatedProps } from '@/types/ResponsiveTablePaginated';

function rawCell<T>(row: T, key: string): React.ReactNode {
  const v = (row as Record<string, unknown>)[key];
  return v as React.ReactNode;
}

const DEFAULT_PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

const selectClass =
  'rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100 py-1.5 pl-2.5 pr-7 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-colors';

const navBtnClass =
  'h-9 w-9 inline-flex items-center justify-center rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 hover:border-gray-400 dark:hover:border-gray-500 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white dark:disabled:hover:bg-gray-700 disabled:hover:border-gray-300 dark:disabled:hover:border-gray-600 transition-colors';

export function ResponsiveTablePaginated<T>({
  columns,
  data,
  onRowClick,
  keyField,
  totalCount,
  page,
  pageSize,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS,
  searchEnabled,
  searchTerm = '',
  onSearchTermChange,
  isLoading,
}: ResponsiveTablePaginatedProps<T>) {
  const t = useTranslations('Table');

  const highPriorityColumns = columns.filter((col) => col.priority === 'high');
  const mediumPriorityColumns = columns.filter((col) => col.priority === 'medium');
  const lowPriorityColumns = columns.filter((col) => col.priority === 'low');

  const tableBodyRef = useRef<HTMLTableSectionElement>(null);
  useEffect(() => {
    if (tableBodyRef.current) {
      autoAnimate(tableBodyRef.current, { duration: 300 });
    }
  }, []);

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  const rangeStart = totalCount === 0 ? 0 : (page - 1) * pageSize + 1;
  const rangeEnd = totalCount === 0 ? 0 : Math.min(page * pageSize, totalCount);

  const sizeOptions = [...new Set([...pageSizeOptions, pageSize])].sort((a, b) => a - b);

  const pageSelectOptions =
    totalPages > 0 ? Array.from({ length: totalPages }, (_, i) => i + 1) : [];

  const getRowKey = (row: T, index: number) => {
    const v = (row as Record<string, unknown>)[keyField as string];
    if (v !== null && v !== undefined) return String(v);
    return `row-${index}`;
  };

  return (
    <div className="w-full">
      {searchEnabled && onSearchTermChange && (
        <div className="mb-4 relative">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500"
              size={20}
            />
            <input
              type="text"
              placeholder={t('searchPlaceholder')}
              value={searchTerm}
              onChange={(e) => onSearchTermChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 outline-none transition-all duration-200"
            />
          </div>
          {searchTerm && (
            <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              {t('results', { count: totalCount })}
            </div>
          )}
        </div>
      )}

      <div className="md:hidden space-y-2">
        {data.map((row, rowIndex) => (
          <div
            key={getRowKey(row, rowIndex)}
            onClick={() => onRowClick?.(row)}
            className="bg-white dark:bg-gray-800 rounded p-5 shadow-sm border dark:border-gray-600 my-2 space-y-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-500 ease-in-out"
          >
            <div className="space-y-2">
              {highPriorityColumns.map((col) => (
                <div key={col.key} className="flex justify-between items-start">
                  <span className=" font-medium text-gray-600 dark:text-gray-200">{col.label} :</span>
                  <span className=" text-right text-gray-600 dark:text-white">
                    {col.render
                      ? col.render((row as Record<string, unknown>)[col.key], row)
                      : rawCell(row, col.key)}
                  </span>
                </div>
              ))}
            </div>
            {mediumPriorityColumns.length > 0 && <hr className="border-t border-gray-200 dark:border-gray-700" />}
            <div className="space-y-2">
              {mediumPriorityColumns.map((col) => (
                <div key={col.key} className="flex justify-between items-start">
                  <span className=" font-medium text-gray-600 dark:text-gray-300">{col.label} :</span>
                  <span className=" text-right text-gray-600 dark:text-gray-200">
                    {col.render
                      ? col.render((row as Record<string, unknown>)[col.key], row)
                      : rawCell(row, col.key)}
                  </span>
                </div>
              ))}
            </div>
            {lowPriorityColumns.length > 0 && <hr className="border-t border-gray-200 dark:border-gray-700" />}
            {lowPriorityColumns.length > 0 && (
              <div className="space-y-2">
                {lowPriorityColumns.map((col) => (
                  <div key={col.key} className="flex justify-between items-start">
                    <span className=" text-gray-500 dark:text-gray-300">{col.label} :</span>
                    <span className=" text-right text-gray-600 dark:text-gray-200">
                      {col.render
                        ? col.render((row as Record<string, unknown>)[col.key], row)
                        : rawCell(row, col.key)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

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
            {data.map((row, rowIndex) => (
              <tr
                key={getRowKey(row, rowIndex)}
                onClick={() => onRowClick?.(row)}
                className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
              >
                {columns.map((column) => (
                  <td key={column.key} className="px-6 py-2.5 text-gray-900 dark:text-gray-100">
                    {column.render
                      ? column.render((row as Record<string, unknown>)[column.key], row)
                      : rawCell(row, column.key)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {data.length === 0 && searchTerm && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <Search className="mx-auto mb-2" size={48} />
          <p>{t('noResults', { searchTerm })}</p>
        </div>
      )}

      {totalCount > 0 && (
        <div className="my-4 px-3 py-3 sm:px-4 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50/80 dark:bg-gray-900/40">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="order-1 text-center text-sm text-gray-600 dark:text-gray-400 sm:text-left">
              {t('showingRange', { start: rangeStart, end: rangeEnd, total: totalCount })}
            </p>

            <div
              className="order-3 flex items-center justify-center gap-1 sm:order-2 sm:gap-1.5"
              role="navigation"
              aria-label="Pagination"
            >
              <button
                type="button"
                onClick={() => onPageChange(1)}
                disabled={page <= 1 || isLoading}
                className={navBtnClass}
                aria-label="First page"
                title="First page"
              >
                <ChevronsLeft size={16} aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => onPageChange(Math.max(page - 1, 1))}
                disabled={page <= 1 || isLoading}
                className={navBtnClass}
                aria-label={t('previous')}
                title={t('previous')}
              >
                <ChevronLeft size={16} aria-hidden="true" />
              </button>

              <div className="mx-1 flex items-center gap-1.5 text-sm text-gray-700 dark:text-gray-200 whitespace-nowrap">
                <select
                  className={selectClass}
                  value={Math.min(page, totalPages)}
                  disabled={isLoading || totalPages <= 1}
                  onChange={(e) => onPageChange(Number(e.target.value))}
                  aria-label={t('goToPage')}
                  title={t('goToPage')}
                >
                  {pageSelectOptions.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
                <span className="text-gray-500 dark:text-gray-400">/ {totalPages}</span>
              </div>

              <button
                type="button"
                onClick={() => onPageChange(Math.min(page + 1, totalPages))}
                disabled={page >= totalPages || isLoading}
                className={navBtnClass}
                aria-label={t('next')}
                title={t('next')}
              >
                <ChevronRight size={16} aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => onPageChange(totalPages)}
                disabled={page >= totalPages || isLoading}
                className={navBtnClass}
                aria-label="Last page"
                title="Last page"
              >
                <ChevronsRight size={16} aria-hidden="true" />
              </button>
            </div>

            {onPageSizeChange ? (
              <label className="order-2 flex items-center justify-center gap-2 text-sm text-gray-700 dark:text-gray-200 sm:order-3 sm:justify-end">
                <span className="whitespace-nowrap">{t('rowsPerPage')}</span>
                <select
                  className={selectClass}
                  value={pageSize}
                  disabled={isLoading}
                  onChange={(e) => onPageSizeChange(Number(e.target.value))}
                  aria-label={t('rowsPerPage')}
                >
                  {sizeOptions.map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </label>
            ) : (
              <span className="hidden sm:order-3 sm:block sm:w-[1px]" aria-hidden="true" />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

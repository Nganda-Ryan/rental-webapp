'use client';

import React from 'react';
import { X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { getStatusBadge } from '@/lib/utils-component';
import { formatDateToText, capitalizeEachWord } from '@/lib/utils';
import type { PropertyRequestItem } from '@/config/propertyTableColumns';

export interface RequestDetailModalProps {
  request: PropertyRequestItem | null;
  onClose: () => void;
}

/**
 * Modal to display request details. Rendered at page level (e.g. with Overlay) to avoid layout shift.
 */
export const RequestDetailModal: React.FC<RequestDetailModalProps> = ({ request, onClose }) => {
  const t = useTranslations('Common');

  if (!request) return null;

  const submittedBy = request.creator?.user
    ? capitalizeEachWord(
        [request.creator.user.Lastname, request.creator.user.Firstname].filter(Boolean).join(' ')
      )
    : '—';

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-lg max-h-[85vh] overflow-y-auto p-6 mx-auto shadow-xl">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
          {t('viewDetails')}
        </h3>
        <button
          type="button"
          onClick={onClose}
          className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-400"
          aria-label="Close"
        >
          <X size={20} />
        </button>
      </div>
      <div className="space-y-3 text-sm">
        <div>
          <span className="text-gray-500 dark:text-gray-400">{t('status')}: </span>
          {getStatusBadge(request.StatusCode, t)}
        </div>
        <div>
          <span className="text-gray-500 dark:text-gray-400">{t('submittedDate')}: </span>
          <span className="text-gray-800 dark:text-gray-100">
            {formatDateToText(request.SubmittedDate || request.CreatedAt || '')}
          </span>
        </div>
        <div>
          <span className="text-gray-500 dark:text-gray-400">{t('object')}: </span>
          <span className="text-gray-800 dark:text-gray-100">
            {request.Object || request.Description || '—'}
          </span>
        </div>
        <div>
          <span className="text-gray-500 dark:text-gray-400">{t('submittedBy')}: </span>
          <span className="text-gray-800 dark:text-gray-100">{submittedBy}</span>
        </div>
        {request.Description && request.Description !== request.Object && (
          <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
            <span className="text-gray-500 dark:text-gray-400 block mb-1">{t('description')}: </span>
            <p className="text-gray-800 dark:text-gray-100">{request.Description}</p>
          </div>
        )}
      </div>
    </div>
  );
};

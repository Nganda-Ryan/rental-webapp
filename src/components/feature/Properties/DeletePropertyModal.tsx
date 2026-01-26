"use client";
import React from "react";
import { AlertTriangle } from "lucide-react";
import { useTranslations } from "next-intl";

interface DeletePropertyModalProps {
  onClose: () => void;
  onConfirm: () => void;
  propertyAddress: string;
  isUnit?: boolean;
  isLoading?: boolean;
}

export const DeletePropertyModal = ({
  onClose,
  onConfirm,
  propertyAddress,
  isUnit = false,
  isLoading = false,
}: DeletePropertyModalProps) => {
  const commonT = useTranslations('Common');
  
  return (
    <div className="bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md w-full p-6">
        <div className="flex items-center gap-3 mb-4">
          <AlertTriangle className="h-6 w-6 text-red-500" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            {isUnit ? commonT('deleteUnit') : commonT('deleteProperty')}
          </h2>
        </div>
        
        <div className="mb-6">
          <p className="text-gray-700 dark:text-gray-300">
            {commonT('confirmDeleteAsset') || 'Are you sure you want to delete'} {isUnit ? commonT('unit') : commonT('property')}{" "}
            <span className="font-bold">{propertyAddress}</span>? {commonT('actionCannotBeUndone') || 'This action cannot be undone.'}
          </p>
        </div>
        
        <div className="flex justify-between gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {commonT('cancel')}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isLoading && (
              <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            {isUnit ? commonT('deleteUnit') : commonT('deleteProperty')}
          </button>
        </div>
      </div>
    </div>
  );
};
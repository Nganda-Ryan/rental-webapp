'use client';

import React from 'react';
import { X, Loader2 } from 'lucide-react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { ContractPdf } from '@/components/pdf/ContractPdf';
import { IContractDetail, AssetDataDetailed } from '@/types/Property';
import { ProfileDetail } from '@/types/authTypes';

export interface ContractPdfViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  contract: IContractDetail;
  asset: AssetDataDetailed;
  contractor: ProfileDetail;
}

/**
 * Modal that displays the contract PDF in an iframe (viewer) instead of direct print/download.
 */
export const ContractPdfViewerModal: React.FC<ContractPdfViewerModalProps> = ({
  isOpen,
  onClose,
  contract,
  asset,
  contractor,
}) => {
  if (!isOpen) return null;

  const document = (
    <ContractPdf contract={contract} asset={asset} contractor={contractor} />
  );
  const fileName = `contrat-${contract.id}.pdf`;

  const handleClose = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Contract PDF viewer"
      onClick={handleClose}
    >
      <div
        className="bg-white dark:bg-gray-900 rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <PDFDownloadLink document={document} fileName={fileName}>
          {({ loading, url }) => (
            <>
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 shrink-0">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                  Contract #{contract.id}
                </h2>
                <button
                  type="button"
                  onClick={handleClose}
                  className="p-2 rounded-lg text-gray-500 hover:text-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-400"
                  aria-label="Close"
                >
                  <X size={24} />
                </button>
              </div>
              <div className="flex-1 min-h-0 p-4 overflow-hidden">
                {loading ? (
                  <div className="flex items-center justify-center h-full min-h-[400px]">
                    <Loader2 size={32} className="animate-spin text-primary-500" />
                    <span className="ml-2 text-gray-600 dark:text-gray-400">Generating PDF...</span>
                  </div>
                ) : url ? (
                  <iframe
                    title={`Contract ${contract.id}`}
                    src={url}
                    className="w-full h-full min-h-[500px] rounded-lg border border-gray-200 dark:border-gray-700"
                  />
                ) : null}
              </div>
            </>
          )}
        </PDFDownloadLink>
      </div>
    </div>
  );
};

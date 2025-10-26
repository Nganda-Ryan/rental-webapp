"use client"
import React from 'react';
import {
  Building2,
  Share2,
  UserPlus,
  FileText,
  DollarSign,
  Zap,
} from "lucide-react";
import Button from "@/components/ui/Button";
import { AssetDataDetailed, IContractDetail } from "@/types/Property";
import { ASSET_TYPE_COMPLEXE } from "@/constant";

interface PropertyQuickActionsProps {
  asset: AssetDataDetailed | null;
  activeContract: IContractDetail | undefined;
  isTerminatingContract: boolean;
  showShareLink: boolean;
  clicked: boolean;
  canCreateContract: boolean;
  canAttachManager: boolean;
  onShareLink: () => void;
  onVerifyProperty: () => void;
  onAttachProperties: () => void;
  onEditProperty: () => void;
  onAttachManager: () => void;
  onCreateContract: () => void;
  onTerminateLease: () => void;
  onCopyToClipboard: (text: string) => void;
  isUnit?: boolean;
}

export const PropertyQuickActions: React.FC<PropertyQuickActionsProps> = ({
  asset,
  activeContract,
  isTerminatingContract,
  showShareLink,
  clicked,
  canCreateContract,
  canAttachManager,
  onShareLink,
  onVerifyProperty,
  onAttachProperties,
  onEditProperty,
  onAttachManager,
  onCreateContract,
  onTerminateLease,
  onCopyToClipboard,
  isUnit = false,
}) => {
  return (
    <>
      {asset?.whoIs === "OWNER" && (
        <>
          {(asset?.IsVerified === 1 && asset.TypeCode !== ASSET_TYPE_COMPLEXE) && (
            <Button onClick={onShareLink} variant='neutral' isSubmitBtn={false}>
              <Share2 size={16} /> Invite Tenant
            </Button>
          )}

          {!isUnit && (asset?.StatusCode === "DRAFT" || asset?.StatusCode === "INACTIVE") && (
            <Button onClick={onVerifyProperty} variant="neutral" disable={false} isSubmitBtn={false}>
              <FileText size={16} /> Verify Property
            </Button>
          )}

          {!isUnit && asset?.TypeCode === "CPLXMOD" && asset?.IsVerified === 1 && (
            <Button onClick={onAttachProperties} variant='neutral' isSubmitBtn={false}>
              <Building2 size={16} /> Attach Properties
            </Button>
          )}

          <Button
            variant='neutral'
            disable={asset?.StatusCode === "PENDING"}
            isSubmitBtn={false}
            onClick={onEditProperty}
          >
            <Building2 size={16} /> Edit Property
          </Button>

          {!isUnit && asset?.IsVerified === 1 && (
            <Button
              onClick={onAttachManager}
              variant='neutral'
              disable={canAttachManager}
              isSubmitBtn={false}
            >
              <UserPlus size={16} /> Attach Manager
            </Button>
          )}
        </>
      )}

      {canCreateContract && (
        <Button onClick={onCreateContract} variant='neutral' disable={false} isSubmitBtn={false}>
          <FileText size={16} /> Create a contract
        </Button>
      )}

      {asset?.whoIs === "OWNER" && activeContract?.status === "ACTIVE" && (
        <div className="space-y-3">
          <Button
            onClick={onTerminateLease}
            variant='danger'
            disable={false}
            isSubmitBtn={false}
            loading={isTerminatingContract}
          >
            <DollarSign size={16} /> Terminate Lease
          </Button>
        </div>
      )}

      {showShareLink && (
        <div className={`mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg transform ${showShareLink ? "block" : "hidden"}`}>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
            Share this link with potential renter:
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              value={`https://applink.rentalafrique.com/share/property/${asset?.Code}`}
              readOnly
              className="flex-1 text-sm p-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 dark:text-gray-100"
            />
            <button
              onClick={() => onCopyToClipboard(`https://applink.rentalafrique.com/share/property/${asset?.Code}`)}
              className={`px-3 py-2 rounded-lg text-sm transition-all duration-300 ease-out transform hover:scale-105 active:scale-95
                ${clicked
                  ? "bg-green-500 text-white"
                  : "bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500"
                }
              `}
            >
              <span className="inline-flex items-center gap-1">
                {clicked ? "Copied!" : "Copy"}
              </span>
            </button>
          </div>
        </div>
      )}
    </>
  );
};

interface MobileActionsDrawerProps {
  showMobileActions: boolean;
  children: React.ReactNode;
  onClose: () => void;
}

export const MobileActionsDrawer: React.FC<MobileActionsDrawerProps> = ({
  showMobileActions,
  children,
  onClose,
}) => {
  return (
    <div
      className={`
        fixed inset-0 z-50 lg:hidden
        ${showMobileActions ? "pointer-events-auto" : "pointer-events-none"}
      `}
      role="dialog"
      aria-modal="true"
    >
      {/* Overlay */}
      <div
        className={`
          absolute inset-0 bg-black bg-opacity-40 backdrop-blur-sm
          transition-opacity duration-300 ease-linear
          ${showMobileActions ? "opacity-100" : "opacity-0"}
        `}
        onClick={onClose}
      />

      {/* Drawer - slide up/down */}
      <div
        className={`
          absolute bottom-0 left-0 right-0 bg-white dark:bg-gray-900 rounded-t-2xl p-4 shadow-lg
          transform transition-transform duration-300 ease-linear
          ${showMobileActions ? "translate-y-0" : "translate-y-full"}
        `}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Quick Actions</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 dark:hover:text-white"
            aria-label="Close drawer"
          >
            <span className="text-2xl">&times;</span>
          </button>
        </div>

        <div className="space-y-3 mb-20">
          {children}
        </div>
      </div>
    </div>
  );
};

interface MobileActionFABProps {
  onClick: () => void;
  show: boolean;
}

export const MobileActionFAB: React.FC<MobileActionFABProps> = ({ onClick, show }) => {
  if (!show) return null;

  return (
    <button
      onClick={onClick}
      aria-label="Show quick actions"
      className={`fixed bottom-9 right-6 z-50 bg-[#2A4365] text-white p-2 rounded-full shadow-lg hover:bg-blue-700 active:scale-95 duration-300 ease-linear lg:hidden`}
    >
      <Zap size={24} />
    </button>
  );
};

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import {
  Share2,
  FileText,
  Building2,
  UserPlus,
  DollarSign,
  Power,
  PowerOff,
  Trash2,
} from 'lucide-react';
import { QuickActionItem } from '@/components/ui/QuickAction';
import { AssetType, AssetPermissions } from '@/types/AssetHooks';
import { AssetDataDetailed } from '@/types/AssetHooks';

/**
 * Parameters for useQuickActions hook
 */
export interface UseQuickActionsParams {
  /** Asset data (property or unit) */
  asset: AssetDataDetailed | null;
  /** Asset type (property or unit) */
  assetType: AssetType;
  /** Permissions for the current asset */
  permissions: AssetPermissions;
  /** Whether lease termination is in progress */
  isTerminatingLease?: boolean;
  /** Handler for share link action */
  onShareLink: () => void;
  /** Handler for verification form open */
  onVerificationFormOpen?: () => void;
  /** Handler for attach properties action */
  onAttachProperties?: () => void;
  /** Handler for edit property action */
  onEditProperty: () => void;
  /** Handler for attach manager action */
  onAttachManager?: () => void;
  /** Handler for create contract action */
  onCreateContract: () => void;
  /** Handler for terminate lease action */
  onTerminateLease: () => void;
  /** Handler for deactivate asset action */
  onDeactivateAsset?: () => void;
  /** Handler for activate asset action */
  onActivateAsset?: () => void;
  /** Handler for delete asset action */
  onDeleteAsset?: () => void;
  /** Whether asset is active */
  isAssetActive?: boolean;
}

/**
 * Custom hook to build quick actions array based on asset type and permissions
 * Uses useMemo to prevent recreation on every render
 * 
 * @example
 * ```tsx
 * const quickActions = useQuickActions({
 *   asset,
 *   assetType: AssetType.PROPERTY,
 *   permissions,
 *   isTerminatingLease,
 *   onShareLink: handleShareLink,
 *   onEditProperty: handleEditProperty,
 *   onCreateContract: handleCreateContract,
 *   onTerminateLease: handleTerminateLease,
 * });
 * ```
 */
export function useQuickActions({
  asset,
  assetType,
  permissions,
  isTerminatingLease = false,
  onShareLink,
  onVerificationFormOpen,
  onAttachProperties,
  onEditProperty,
  onAttachManager,
  onCreateContract,
  onTerminateLease,
  onDeactivateAsset,
  onActivateAsset,
  onDeleteAsset,
  isAssetActive,
}: UseQuickActionsParams): QuickActionItem[] {
  const router = useRouter();
  const commonT = useTranslations('Common');

  return useMemo(() => {
    const actions: QuickActionItem[] = [];

    // Invite Tenant (Share Link) - Available for both property and unit
    if (permissions.canShareLink) {
      actions.push({
        id: 'invite-tenant',
        label: commonT('inviteTenant') || 'Invite Tenant',
        icon: Share2,
        onClick: onShareLink,
        variant: 'neutral',
        show: true,
      });
    }

    // Verify Property - Only for properties
    if (assetType === AssetType.PROPERTY && permissions.canVerifyProperty && onVerificationFormOpen) {
      actions.push({
        id: 'verify-property',
        label: commonT('verifyProperty') || 'Verify Property',
        icon: FileText,
        onClick: onVerificationFormOpen,
        variant: 'neutral',
        show: true,
      });
    }

    // Attach Properties - Only for complex properties
    if (assetType === AssetType.PROPERTY && permissions.canAttachProperties && onAttachProperties) {
      actions.push({
        id: 'attach-properties',
        label: commonT('attachProperties') || 'Attach Properties',
        icon: Building2,
        onClick: onAttachProperties,
        variant: 'neutral',
        show: true,
      });
    }

    // Edit Property/Unit
    if (permissions.canEditProperty) {
      actions.push({
        id: assetType === AssetType.PROPERTY ? 'edit-property' : 'edit-unit',
        label: assetType === AssetType.PROPERTY
          ? commonT('editProperty') || 'Edit Property'
          : commonT('editUnit') || 'Edit Unit',
        icon: Building2,
        onClick: onEditProperty,
        variant: 'neutral',
        show: true,
        disabled: asset?.Status === 'PENDING',
      });
    }

    // Attach Manager - Only for properties
    if (assetType === AssetType.PROPERTY && permissions.canAttachManager && onAttachManager) {
      actions.push({
        id: 'attach-manager',
        label: commonT('attachManager') || 'Attach Manager',
        icon: UserPlus,
        onClick: onAttachManager,
        variant: 'neutral',
        show: true,
      });
    }

    // Create Contract
    if (permissions.canCreateContract) {
      actions.push({
        id: 'create-contract',
        label: commonT('createContract') || 'Create a contract',
        icon: FileText,
        onClick: onCreateContract,
        variant: 'neutral',
        show: true,
      });
    }

    // Terminate Lease
    if (permissions.canTerminateLease) {
      actions.push({
        id: 'terminate-lease',
        label: commonT('terminateLease') || 'Terminate Lease',
        icon: DollarSign,
        onClick: onTerminateLease,
        variant: 'danger',
        show: true,
        loading: isTerminatingLease,
      });
    }

    if (onDeleteAsset && permissions.canDeleteAsset) {
      actions.push({
        id: 'delete-asset',
        label: assetType === AssetType.PROPERTY
          ? (commonT('deleteProperty') || 'Delete Property')
          : (commonT('deleteUnit') || 'Delete Unit'),
        icon: Trash2,
        onClick: onDeleteAsset,
        variant: 'danger',
        show: true,
      });
    }

    if (onDeactivateAsset && asset && isAssetActive === true && permissions.canDeactivateAsset) {
      actions.push({
        id: 'deactivate-asset',
        label: assetType === AssetType.PROPERTY
          ? (commonT('deactivateProperty') || 'Deactivate Property')
          : (commonT('deactivateUnit') || 'Deactivate Unit'),
        icon: PowerOff,
        onClick: onDeactivateAsset,
        variant: 'warning',
        show: true,
      });
    }

    if (onActivateAsset && asset && isAssetActive === false && permissions.canActivateAsset) {
      actions.push({
        id: 'activate-asset',
        label: assetType === AssetType.PROPERTY
          ? (commonT('activateProperty') || 'Activate Property')
          : (commonT('activateUnit') || 'Activate Unit'),
        icon: Power,
        onClick: onActivateAsset,
        variant: 'success',
        show: true,
      });
    }

    return actions;
  }, [
    asset,
    assetType,
    permissions,
    isTerminatingLease,
    onShareLink,
    onVerificationFormOpen,
    onAttachProperties,
    onEditProperty,
    onAttachManager,
    onCreateContract,
    onTerminateLease,
    onDeactivateAsset,
    onActivateAsset,
    onDeleteAsset,
    isAssetActive,
    commonT,
  ]);
}


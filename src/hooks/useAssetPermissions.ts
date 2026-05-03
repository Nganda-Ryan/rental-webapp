import { useMemo } from 'react';
import {
  AssetType,
  AssetPermissions,
  UseAssetPermissionsParams,
} from '@/types/AssetHooks';
import { ASSET_TYPE_COMPLEXE } from '@/constant';
import {
  ASSET_USER_PERMISSION_CODE,
  getActiveAssetUserPermissionCodes,
} from '@/constant/assetUserPermissions';

/**
 * Calculates UI/action permissions for the current asset from business rules.
 * When `grantedPermissions` is passed (manager asset views), ConfigPermissionList
 * from getAsset further restricts the UI for non-owners. Omit it on landlord pages.
 * Owners (whoIs → OwnerCode === 'OWNER') always pass API permission checks.
 */
export function useAssetPermissions({
  asset,
  assetType,
  activeContract,
  userRole: _userRole,
  grantedPermissions,
}: UseAssetPermissionsParams): AssetPermissions {
  return useMemo(() => {
    if (!asset) {
      return {
        canCreateContract: false,
        canTerminateLease: false,
        canAttachManager: false,
        canVerifyProperty: false,
        canEditProperty: false,
        canViewInvoices: false,
        canViewContracts: false,
        canViewUnits: false,
        canAttachProperties: false,
        canShareLink: false,
        canViewAssetDashboard: false,
        canViewTenantInfo: false,
        canDeleteAsset: false,
        canDeactivateAsset: false,
        canActivateAsset: false,
      };
    }

    const isOwner = asset.OwnerCode === 'OWNER';
    const isVerified = asset.IsVerified;
    const isComplex = asset.Type === ASSET_TYPE_COMPLEXE;
    const isUnit = assetType === AssetType.UNIT;
    const isDraft = asset.Status === 'DRAFT';
    const isInactive = asset.Status === 'INACTIVE';
    const isPending = asset.Status === 'PENDING';
    const hasActiveContract = activeContract?.status === 'ACTIVE';
    const isExplicitlyActive = asset.IsActive === 1;
    const isExplicitlyInactive = asset.IsActive === 0;

    const useApiPermissionGating = grantedPermissions !== undefined;
    const activeCodes = useApiPermissionGating
      ? getActiveAssetUserPermissionCodes(grantedPermissions)
      : new Set<string>();

    const has = (code: string) => {
      if (!useApiPermissionGating || isOwner) return true;
      return activeCodes.has(code);
    };
    const hasAny = (codes: readonly string[]) => {
      if (!useApiPermissionGating || isOwner) return true;
      return codes.some((c) => activeCodes.has(c));
    };

    const hasGenerateContract = has(ASSET_USER_PERMISSION_CODE.GenerateContract);
    const hasManageBilling = has(ASSET_USER_PERMISSION_CODE.ManageBilling);
    const hasRentCollector =
      useApiPermissionGating &&
      !isOwner &&
      activeCodes.has(ASSET_USER_PERMISSION_CODE.RentCollector);
    const hasDashboardViewer = has(ASSET_USER_PERMISSION_CODE.DashBoardViewer);
    const hasTenantView =
      hasAny([
        ASSET_USER_PERMISSION_CODE.TenantsViewer,
        ASSET_USER_PERMISSION_CODE.TenantsSuperViewer,
      ]);

    const canViewContractsBase = !isComplex;
    /**
     * Invoices section:
     * - Landlord (no API gating): keep legacy rule — need a contract context.
     * - Manager (API gating): non-complex is enough; managers often have no
     *   contracts in getAsset while still having ManageBilling + invoice API data.
     */
    const canViewInvoicesBase =
      !isComplex && (useApiPermissionGating || activeContract !== null);

    return {
      canCreateContract:
        isVerified &&
        !isComplex &&
        !hasActiveContract &&
        hasGenerateContract,

      canTerminateLease:
        hasActiveContract && (isOwner || hasRentCollector),

      canAttachManager: isOwner && isVerified && !isUnit,

      canVerifyProperty: isOwner && (isDraft || isInactive) && !isUnit,

      canEditProperty: isOwner && !isPending,

      canViewInvoices: canViewInvoicesBase && (isOwner || hasManageBilling),

      canViewContracts:
        canViewContractsBase &&
        (isOwner ||
          hasAny([
            ASSET_USER_PERMISSION_CODE.TenantsViewer,
            ASSET_USER_PERMISSION_CODE.TenantsSuperViewer,
            ASSET_USER_PERMISSION_CODE.GenerateContract,
          ])),

      canViewUnits: isComplex && !isUnit,

      canAttachProperties: isOwner && isComplex && isVerified,

      canShareLink: isOwner && isVerified && !isComplex && hasGenerateContract,

      canViewAssetDashboard: isOwner || hasDashboardViewer,

      canViewTenantInfo: isOwner || hasTenantView,

      canDeleteAsset: isOwner,

      canDeactivateAsset: isOwner && isExplicitlyActive,

      canActivateAsset: isOwner && isExplicitlyInactive,
    };
  }, [asset, assetType, activeContract, grantedPermissions]);
}

import { useMemo } from 'react';
import {
  AssetType,
  AssetPermissions,
  UseAssetPermissionsParams,
} from '@/types/AssetHooks';
import { ASSET_TYPE_COMPLEXE } from '@/constant';

/**
 * Custom hook to calculate permissions for the current asset
 * Determines what actions the user can perform based on:
 * - Asset type (property vs unit)
 * - Asset status and verification
 * - User role and asset ownership
 * - Active contract status
 */
export function useAssetPermissions({
  asset,
  assetType,
  activeContract,
  userRole,
}: UseAssetPermissionsParams): AssetPermissions {

  const permissions = useMemo(() => {
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
      };
    }

    const isOwner = asset.OwnerCode === 'OWNER'; // Using whoIs field
    const isVerified = asset.IsVerified;
    const isComplex = asset.Type === ASSET_TYPE_COMPLEXE;
    const isUnit = assetType === AssetType.UNIT;
    const isDraft = asset.Status === 'DRAFT';
    const isInactive = asset.Status === 'INACTIVE';
    const isPending = asset.Status === 'PENDING';
    const hasActiveContract = activeContract?.status === 'ACTIVE';

    // Determine if user has specific permissions from asset
    // Note: asset.Permission would come from the API if available
    // For now, we'll use basic ownership logic
    const hasGenerateContractPermission = true; // This should come from asset.Permission

    return {
      /**
       * Can create a contract if:
       * - Asset is verified
       * - Asset is not a complex (units can have contracts, not complexes)
       * - No active contract exists
       * - User has permission to generate contracts
       */
      canCreateContract:
        isVerified &&
        !isComplex &&
        !hasActiveContract &&
        hasGenerateContractPermission,

      /**
       * Can terminate lease if:
       * - User is the owner
       * - There is an active contract
       */
      canTerminateLease: isOwner && hasActiveContract,

      /**
       * Can attach manager if:
       * - User is the owner
       * - Asset is verified
       * - Asset is not a unit (only properties have managers)
       */
      canAttachManager: isOwner && isVerified && !isUnit,

      /**
       * Can verify property if:
       * - User is the owner
       * - Asset is in draft or inactive status
       * - Asset is not a unit (units are verified through parent property)
       */
      canVerifyProperty: isOwner && (isDraft || isInactive) && !isUnit,

      /**
       * Can edit property if:
       * - User is the owner or has permission
       * - Asset is not pending verification
       */
      canEditProperty: isOwner && !isPending,

      /**
       * Can view invoices if:
       * - Asset is not a complex
       * - There are contracts
       */
      canViewInvoices: !isComplex && (activeContract !== null),

      /**
       * Can view contracts if:
       * - Asset is not a complex
       */
      canViewContracts: !isComplex,

      /**
       * Can view units if:
       * - Asset is a complex
       * - Asset is a property (not a unit)
       */
      canViewUnits: isComplex && !isUnit,

      /**
       * Can attach properties if:
       * - User is the owner
       * - Asset is a complex
       * - Asset is verified
       */
      canAttachProperties: isOwner && isComplex && isVerified,

      /**
       * Can share link (invite tenant) if:
       * - User is the owner
       * - Asset is verified
       * - Asset is not a complex
       */
      canShareLink: isOwner && isVerified && !isComplex,
    };
  }, [asset, assetType, activeContract, userRole]);

  return permissions;
}

/**
 * Exhaustive catalog of user-level permissions on an asset (from getAsset ConfigPermissionList).
 * API may return a subset depending on what is granted to the current user.
 *
 * Manager UI mapping (see useAssetPermissions when grantedPermissions is set):
 * - ManageBilling → invoices section + billing-related visibility
 * - GenerateContract → create contract, share link (owner-only for share)
 * - RentCollector → terminate lease (non-owner)
 * - DashBoardViewer → property dashboard
 * - TenantsViewer / TenantsSuperViewer → contracts list + tenant card
 */
export const ASSET_USER_PERMISSION_CODE = {
  ManageBilling: 'ManageBilling',
  GenerateContract: 'GenerateContract',
  RentCollector: 'RentCollector',
  DashBoardViewer: 'DashBoardViewer',
  TenantsViewer: 'TenantsViewer',
  TenantsSuperViewer: 'TenantsSuperViewer',
} as const;

export type AssetUserPermissionCode =
  (typeof ASSET_USER_PERMISSION_CODE)[keyof typeof ASSET_USER_PERMISSION_CODE];

export interface AssetUserPermissionDefinition {
  Code: AssetUserPermissionCode;
  Title: string;
  Description: string;
  IsActive: 0 | 1;
}

export const CONFIG_PERMISSION_CATALOG: ReadonlyArray<AssetUserPermissionDefinition> = [
  {
    Code: ASSET_USER_PERMISSION_CODE.ManageBilling,
    Title: 'Manage Billing',
    Description: 'ManageBilling',
    IsActive: 1,
  },
  {
    Code: ASSET_USER_PERMISSION_CODE.GenerateContract,
    Title: 'Tenant Onboarding',
    Description: 'Tenant Onboarding',
    IsActive: 1,
  },
  {
    Code: ASSET_USER_PERMISSION_CODE.RentCollector,
    Title: 'Rent collector',
    Description: 'Collect Rent',
    IsActive: 1,
  },
  {
    Code: ASSET_USER_PERMISSION_CODE.DashBoardViewer,
    Title: 'Dashboard viewer',
    Description: 'View Property Dashboard',
    IsActive: 1,
  },
  {
    Code: ASSET_USER_PERMISSION_CODE.TenantsViewer,
    Title: 'Tenants viewer',
    Description: 'View Tenant Basic informations',
    IsActive: 1,
  },
  {
    Code: ASSET_USER_PERMISSION_CODE.TenantsSuperViewer,
    Title: 'Tenants super viewer',
    Description: 'Can request Tenant rental score and histories',
    IsActive: 1,
  },
];

/** Codes from API list that are currently active (IsActive === 1). */
export function getActiveAssetUserPermissionCodes(
  list: ReadonlyArray<{ Code: string; IsActive: number }>,
): Set<string> {
  return new Set(
    list
      .filter((p) => Number(p.IsActive) === 1)
      .map((p) => p.Code),
  );
}

/** Owner (whoIs === OWNER) is treated as having all catalog rights for UI gating. */
export function hasAssetUserPermission(
  activeCodes: Set<string>,
  code: string,
  isOwner: boolean,
): boolean {
  return isOwner || activeCodes.has(code);
}

export function hasAnyAssetUserPermission(
  activeCodes: Set<string>,
  codes: readonly string[],
  isOwner: boolean,
): boolean {
  if (isOwner) return true;
  return codes.some((c) => activeCodes.has(c));
}

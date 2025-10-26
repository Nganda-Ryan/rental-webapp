/**
 * Types and interfaces for asset-related custom hooks
 * Used for both property and unit details pages
 */

export enum AssetType {
  PROPERTY = 'property',
  UNIT = 'unit',
}

/**
 * Tenant information structure
 */
export interface TenantInfo {
  tenantName: string;
  tenantPhone: string;
  tenantEmail: string;
  contractStartDate: string;
  contractEndDate: string;
  rent: number;
  deposit: number;
}

/**
 * Contract data structure
 * Using existing IContractDetail from Property types
 */
import { IContractDetail } from './Property';
export type ContractData = IContractDetail;

/**
 * Invoice data structure
 */
export interface InvoiceData {
  Code: string;
  DueDate: string;
  Amount: number;
  Status: string;
  Description: string;
  actions?: any;
}

/**
 * Unit data structure
 */
export interface UnitData {
  Code: string;
  Name: string;
  Type: string;
  Status: string;
  Rent: number;
  actions?: any;
}

/**
 * Manager data structure
 */
export interface ManagerData {
  Code: string;
  Name: string;
  Email: string;
  Phone: string;
  Status: string;
  Permissions: string[];
  InvitationDate?: string;
}

/**
 * Asset data structure (property or unit)
 */
export interface AssetDataDetailed {
  Code: string;
  Name: string;
  Type: string;
  Status: string;
  Address: string;
  City: string;
  Country: string;
  PostalCode: string;
  Description: string;
  Image: string;
  Rent: number;
  Deposit: number;
  Surface: number;
  Rooms: number;
  Bathrooms: number;
  Floor: number;
  Furnished: boolean;
  PetAllowed: boolean;
  SmokingAllowed: boolean;
  AccessibilityFeatures: string[];
  Amenities: string[];
  BillingItems: Array<{ label: string; value: string | number }>;
  OwnerCode: string;
  OwnerName: string;
  ParentCode?: string; // For units only
  IsVerified: boolean;
  VerificationDate?: string;
  CreatedAt: string;
  UpdatedAt: string;
}

/**
 * State returned by useAssetDetails hook
 */
export interface AssetDetailsState {
  asset: AssetDataDetailed | null;
  activeContract: ContractData | null;
  contracts: ContractData[];
  invoices: InvoiceData[];
  units: UnitData[];
  managerList: ManagerData[];
  tenantInfo: TenantInfo | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Permissions calculated for the current asset
 */
export interface AssetPermissions {
  canCreateContract: boolean;
  canTerminateLease: boolean;
  canAttachManager: boolean;
  canVerifyProperty: boolean;
  canEditProperty: boolean;
  canViewInvoices: boolean;
  canViewContracts: boolean;
  canViewUnits: boolean;
  canAttachProperties: boolean;
  canShareLink: boolean;
}

/**
 * Action handlers returned by useAssetActions hook
 */
export interface AssetActionsHandlers {
  handleShareLink: () => void;
  handleVerificationFormOpen: () => void;
  handleAttachProperties: () => void;
  handleEditProperty: () => void;
  handleAttachManager: () => void;
  handleCreateContract: () => void;
  handleTerminateLease: () => void;
  handleCancelManagerInvitation: (managerCode: string) => Promise<void>;
  copyToClipboard: (text: string) => void;
}

/**
 * Parameters for useAssetDetails hook
 */
export interface UseAssetDetailsParams {
  assetId: string;
  assetType: AssetType;
  profileCode: string;
}

/**
 * Parameters for useAssetActions hook
 */
export interface UseAssetActionsParams {
  asset: AssetDataDetailed | null;
  assetType: AssetType;
  activeContract: ContractData | null;
  managerList: ManagerData[];
  onRefetch: () => Promise<void>;
}

/**
 * Parameters for useAssetPermissions hook
 */
export interface UseAssetPermissionsParams {
  asset: AssetDataDetailed | null;
  assetType: AssetType;
  activeContract: ContractData | null;
  userRole: string;
}

import { useState, useCallback, useEffect } from 'react';
import { getAsset, searchInvoice } from '@/actions/assetAction';
import { useRouter } from '@bprogress/next/app';
import { useTranslations } from 'next-intl';
import toast from 'react-hot-toast';
import {
  AssetType,
  AssetDetailsState,
  UseAssetDetailsParams,
  AssetDataDetailed,
  ContractData,
  InvoiceData,
  UnitData,
  ManagerData,
  TenantInfo,
} from '@/types/AssetHooks';
export function useAssetDetails({
  assetId,
  assetType,
  profileCode,
}: UseAssetDetailsParams): AssetDetailsState {
  const router = useRouter();
  const commonT = useTranslations('Common');
  const today = new Date().toISOString().split('T')[0];

  // State
  const [asset, setAsset] = useState<AssetDataDetailed | null>(null);
  const [activeContract, setActiveContract] = useState<ContractData | null>(null);
  const [contracts, setContracts] = useState<ContractData[]>([]);
  const [invoices, setInvoices] = useState<InvoiceData[]>([]);
  const [units, setUnits] = useState<UnitData[]>([]);
  const [managerList, setManagerList] = useState<ManagerData[]>([]);
  const [tenantInfo, setTenantInfo] = useState<TenantInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Transform raw API units data to UnitData structure
   */
  const transformUnits = (items: any[]): UnitData[] => {
    return items.map((item: any, index: number) => ({
      Code: item.Code,
      Name: item.Title || `Unit ${index + 1}`,
      Type: item.TypeCode,
      Status: item.StatusCode,
      Rent: item.Price,
      actions: undefined,
    }));
  };

  /**
   * Transform raw API managers data to ManagerData structure
   */
  const transformManagers = (managers: any[], configPermissions: any[]): ManagerData[] => {
    return managers.map((mng: any) => ({
      Code: mng.Code,
      Name: `${mng.manager.user.Lastname} ${mng.manager.user.Firstname}`,
      Email: mng.manager.user.Email,
      Phone: mng.manager.user.Phone,
      Status: mng.StatusCode,
      Permissions: Object.entries(mng.permission)
        .filter(([_, value]) => value === 1)
        .map(([key]) => {
          const perm = configPermissions.find((p: any) => p.Code === key);
          return perm?.Title ?? key;
        }),
      InvitationDate: mng.CreatedAt,
    }));
  };

  /**
   * Transform raw API contracts data to ContractData structure
   */
  const transformContracts = (contracts: any[], rawActiveContract: any): any[] => {
      return contracts.map((contract: any) => {
          const assetData: any | undefined = contract.asset ? {
              Code: contract.asset.Code,
              Title: contract.asset.Title,
          } : undefined;

          const tenant = contract.renter.user;
          const tenantDetail = {
              firstName: tenant.Firstname,
              lastName: tenant.Lastname,
              email: tenant.Email,
              phone: tenant.Phone,
              userCode: tenant.Code,
          };

          const owner = contract.contractor.user;
          const ownerDetail = {
              firstName: owner.Firstname,
              lastname: owner.Lastname,
              email: owner.Email,
              phone: owner.Phone,
          };

          return {
              id: contract.Code,

              tenant: tenantDetail,
              tenantName: `${contract.renter.user.Lastname} ${rawActiveContract.renter.user.Firstname}`,

              startDate: contract.StartDate,
              endDate: contract.EndDate,
              monthlyRent: contract.asset?.Price ?? 0,
              currency: contract.Currency,

              status: contract.StatusCode,
              notes: contract.Notes,

              billingElements: [],

              owner: ownerDetail,
              asset: assetData,
          };
      });
  };

  /**
   * Transform raw API invoices data to InvoiceData structure
   */
  const transformInvoices = (invoices: any[]): InvoiceData[] => {
    return invoices.map((inv: any, index: number) => ({
      Code: inv.Code,
      DueDate: inv.EndDate?.split('T')[0] || '',
      Amount: inv.items?.reduce((sum: number, item: any) => sum + (item.Amount || 0), 0) || 0,
      Status: inv.StatusCode,
      Description: inv.notes || '',
      actions: undefined,
    }));
  };

  /**
   * Fetch asset details from API
   */
  const fetchAssetDetails = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const result = await getAsset(assetId);

      if (!result?.data?.body?.assetData) {
        if (result.error) {
          if (result.code === 'SESSION_EXPIRED') {
            router.push('/signin');
            return;
          }
          throw new Error(result.error);
        }
        throw new Error('Asset not found');
      }

      const item = result.data.body.assetData;
      const body = result.data.body;

      // Transform asset data
      const assetData: AssetDataDetailed = {
        Code: item.Code,
        Name: item.Title,
        Type: item.TypeCode,
        Status: item.StatusCode,
        Address: item.Address.Street,
        City: item.Address.City,
        Country: item.Address.Country,
        PostalCode: item.Address.PostalCode || '',
        Description: item.Notes || '',
        Image: item.CoverUrl || '',
        Rent: item.Price,
        Deposit: 0, // Not provided in API response
        Surface: 0, // Not provided in API response
        Rooms: 0, // Not provided in API response
        Bathrooms: 0, // Not provided in API response
        Floor: 0, // Not provided in API response
        Furnished: false, // Not provided in API response
        PetAllowed: false, // Not provided in API response
        SmokingAllowed: false, // Not provided in API response
        AccessibilityFeatures: [], // Not provided in API response
        Amenities: item.Tag ? [item.Tag] : [],
        BillingItems: body.billingItems.map((bi: any) => ({
          label: bi.ItemCode,
          value: bi.ItemCode,
        })),
        OwnerCode: body.whoIs || '',
        OwnerName: '', // Not provided in API response
        ParentCode: assetType === AssetType.UNIT ? item.ParentCode : undefined,
        IsVerified: item.IsVerified === 1,
        VerificationDate: undefined, // Not provided in API response
        CreatedAt: item.CreatedAt || '',
        UpdatedAt: item.UpdatedAt || '',
      };

      // Transform units (for properties only)
      const unitsData = assetType === AssetType.PROPERTY && item.assets
        ? transformUnits(item.assets ?? [])
        : [];

        console.log('unitsData', unitsData)

      // Transform managers
      const managersData = item.managers
        ? transformManagers(item.managers ?? [], body.ConfigPermissionList)
        : [];

      // Transform contracts
      let contractsData: ContractData[] = [];
      let activeContractData: ContractData | null = null;
      let tenantInfoData: TenantInfo | null = null;

      if (item.contracts && item.contracts.length > 0) {
        console.log('item.contracts', item.contracts)
        const rawActiveContract =
          item.contracts.find((c: any) => c.StatusCode === 'ACTIVE') || item.contracts[0];

        contractsData = transformContracts(item.contracts, rawActiveContract);

        // Set active contract
        activeContractData = contractsData.find((c) => c.status === 'ACTIVE') || contractsData[0];

        // Extract tenant info from active contract
        if (rawActiveContract) {
          tenantInfoData = {
            tenantName: `${rawActiveContract.renter.user.Lastname} ${rawActiveContract.renter.user.Firstname}`,
            tenantPhone: rawActiveContract.renter.user.Phone,
            tenantEmail: rawActiveContract.renter.user.Email,
            contractStartDate: rawActiveContract.StartDate,
            contractEndDate: rawActiveContract.EndDate,
            rent: rawActiveContract.asset.Price,
            deposit: 0, // Not provided in API response
          };
        }
      }

      // Fetch invoices if contracts exist
      let invoicesData: InvoiceData[] = [];
      if (contractsData.length > 0) {
        const invoiceResult = await searchInvoice({
          orderBy: 'Item.CreatedAt',
          orderMode: 'desc',
          assetCodes: [assetData.Code],
        });

        if (invoiceResult.data) {
          invoicesData = transformInvoices(invoiceResult.data.body.items);
        } else if (invoiceResult.error && invoiceResult.code !== 'SESSION_EXPIRED') {
          console.warn('Failed to fetch invoices:', invoiceResult.error);
        }
      }

      // Update state
      console.log('assetData', assetData)
      setAsset(assetData);
      setActiveContract(activeContractData);
      setContracts(contractsData.reverse()); // Reverse to show most recent first
      setInvoices(invoicesData);
      setUnits(unitsData);
      setManagerList(managersData);
      setTenantInfo(tenantInfoData);

    } catch (err: any) {
      const errorMessage = err.message || commonT('unexpectedError');
      setError(errorMessage);
      toast.error(errorMessage, { position: 'bottom-right' });
      console.error('useAssetDetails error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [assetId, assetType, commonT, router]);

  /**
   * Refetch asset details
   */
  const refetch = useCallback(async () => {
    await fetchAssetDetails();
  }, [fetchAssetDetails]);

  // Initial fetch
  useEffect(() => {
    if (assetId) {
      fetchAssetDetails();
    }
  }, [assetId, fetchAssetDetails]);

  return {
    asset,
    activeContract,
    contracts,
    invoices,
    units,
    managerList,
    tenantInfo,
    isLoading,
    error,
    refetch,
  };
}

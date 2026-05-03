import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { House, FileText, MessageSquare } from 'lucide-react';
import { useRouter } from '@bprogress/next/app';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import SectionWrapper from '@/components/Cards/SectionWrapper';
import { ResponsiveTable } from '@/components/feature/Support/ResponsiveTable';
import {
  getContractColumns,
  getInvoiceColumns,
  getInvoiceSummaryColumns,
  getUnitColumns,
  getRequestColumns,
  type PropertyRequestItem,
} from '@/config/propertyTableColumns';
import { AssetDataDetailed, ContractData, InvoiceData, UnitData } from '@/types/AssetHooks';
import { IUser } from '@/types/user';
import { searchRequest } from '@/actions/requestAction';

export interface AssetSectionsProps {
  /** Asset data */
  asset: AssetDataDetailed | null;
  /** Contract data */
  contracts: ContractData[];
  /** Invoice data */
  invoices: InvoiceData[];
  /** Unit data (for complex properties) */
  units: UnitData[];
  /** Current user */
  user: any;
  /** Whether to show units section */
  showUnits?: boolean;
  /** Whether to show invoices section */
  showInvoices?: boolean;
  /** Whether to show contracts section */
  showContracts?: boolean;
  /** Handler for contract click (navigate to detail) */
  onContractClick?: (contractId: string) => void;
  /** Handler to open PDF viewer for a contract */
  onViewContractPdf?: (contract: import('@/types/Property').IContractDetail) => void;
  /** Handler for invoice click */
  onInvoiceClick?: (invoiceId: string) => void;
  /** Handler for unit click */
  onUnitClick?: (unitId: string) => void;
  /** Handler for invoice update */
  onInvoiceUpdate?: (invoice: any) => void;
  /** Handler to open request detail (modal at page level) */
  onViewRequestDetail?: (item: PropertyRequestItem) => void;
}

/**
 * AssetSections - Displays sections for contracts, invoices, and units
 * Adapts based on asset type and provided data
 */
export const AssetSections: React.FC<AssetSectionsProps> = ({
  asset,
  contracts,
  invoices,
  units,
  user,
  showUnits = false,
  showInvoices = true,
  showContracts = true,
  onContractClick,
  onViewContractPdf,
  onInvoiceClick,
  onUnitClick,
  onInvoiceUpdate,
  onViewRequestDetail,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations('Common');
  const propertyBase = pathname?.includes('/manager/properties/')
    ? `/manager/properties/${asset?.Code ?? ''}`
    : `/landlord/properties/${asset?.Code ?? ''}`;
  const [requests, setRequests] = useState<PropertyRequestItem[]>([]);
  const [isLoadingRequests, setIsLoadingRequests] = useState(false);

  const fetchRequests = useCallback(async () => {
    if (!asset?.Code) return;
    setIsLoadingRequests(true);
    try {
      const result = await searchRequest({
        parentCodes: asset.Code,
        orderBy: 'SubmittedDate',
        orderMode: 'desc',
        limit: '20',
      });
      if (result.data?.body?.items) {
        setRequests(
          result.data.body.items.map((item: any) => ({
            Code: item.Code,
            StatusCode: item.StatusCode,
            SubmittedDate: item.SubmittedDate,
            CreatedAt: item.CreatedAt,
            Object: item.Object,
            Description: item.Description,
            creator: item.creator,
          }))
        );
      }
    } catch {
      setRequests([]);
    } finally {
      setIsLoadingRequests(false);
    }
  }, [asset?.Code]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  // Get column configurations (Detail + View PDF actions)
  const contractColumns = user
    ? getContractColumns(asset as any, user, {
        onViewDetail: onContractClick,
        onViewPdf: onViewContractPdf,
      })
    : [];
  const invoiceColumns = useMemo(
    () =>
      onInvoiceUpdate ? getInvoiceColumns(onInvoiceUpdate) : getInvoiceSummaryColumns(),
    [onInvoiceUpdate],
  );
  const unitColumns = getUnitColumns(asset as any, (unitCode) => {
    if (onUnitClick) {
      onUnitClick(unitCode);
    }
  }, t);

  const handleViewRequestDetail = useCallback(
    (item: PropertyRequestItem) => {
      onViewRequestDetail?.(item);
    },
    [onViewRequestDetail]
  );
  const requestColumns = useMemo(
    () => getRequestColumns(handleViewRequestDetail, t),
    [handleViewRequestDetail, t]
  );

  if (!asset) {
    return null;
  }

  return (
    <>
      {/* UNITS SECTION - For complex properties */}
      {showUnits && (
        <SectionWrapper title={t('units')} Icon={House}>
          {units.length > 0 ? (
            <ResponsiveTable
              columns={unitColumns}
              data={units.slice(0, 3)}
              onRowClick={(unit) => onUnitClick && onUnitClick(unit.Code)}
              keyField="Code"
              searchKey="Name"
              showMore={
                units.length > 3
                  ? {
                      url: `${propertyBase}/units`,
                      label: t('showMoreUnits'),
                    }
                  : undefined
              }
            />
          ) : (
            <>
              <p className="text-gray-500 dark:text-gray-400 text-sm p-3">
                {t('noUnitsAvailable')}
              </p>
              <a
                href={`${propertyBase}/units`}
                className="text-sm text-primary-600 dark:text-primary-400 hover:underline px-3 pb-2 block"
                onClick={(e) => {
                  e.preventDefault();
                  router.push(`${propertyBase}/units`);
                }}
              >
                {t('viewOrAddUnits')}
              </a>
            </>
          )}
        </SectionWrapper>
      )}

      {/* REQUESTS SECTION */}
      <SectionWrapper title={t('requests')} Icon={MessageSquare}>
        {isLoadingRequests ? (
          <p className="text-gray-500 dark:text-gray-400 text-sm p-3">{t('loadingData')}</p>
        ) : requests.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-sm p-3">{t('noRequestsAvailable')}</p>
        ) : (
          <ResponsiveTable
            columns={requestColumns}
            data={requests.slice(0, 5)}
            onRowClick={(row) => onViewRequestDetail?.(row)}
            keyField="Code"
          />
        )}
      </SectionWrapper>

      {/* CONTRACTS SECTION */}
      {showContracts && (
        <SectionWrapper title={t('leaseContracts')} Icon={FileText}>
          {contracts.length > 0 ? (
            <ResponsiveTable
              columns={contractColumns}
              data={contracts.slice(0, 5)}
              onRowClick={(contract) => onContractClick?.(contract.id)}
              keyField="Code"
              showMore={
                contracts.length > 5
                  ? {
                      url: `${propertyBase}/contracts`,
                      label: 'Show more contracts',
                    }
                  : undefined
              }
            />
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-sm p-3">
              No lease contracts available
            </p>
          )}
        </SectionWrapper>
      )}

      {/* INVOICES SECTION */}
      {showInvoices && (
        <SectionWrapper title={t('invoiceHistory')} Icon={FileText}>
          {invoices.length > 0 ? (
            <ResponsiveTable
              columns={invoiceColumns}
              data={invoices.slice(0, 5)}
              onRowClick={(inv) => onInvoiceClick?.(inv.Code)}
              keyField="Code"
            />
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-sm p-3">
              {t('noInvoicesAvailable')}
            </p>
          )}
        </SectionWrapper>
      )}
    </>
  );
};

import React from 'react';
import { House, FileText } from 'lucide-react';
import { useRouter } from '@bprogress/next/app';
import { useTranslations } from 'next-intl';
import SectionWrapper from '@/components/Cards/SectionWrapper';
import { ResponsiveTable } from '@/components/feature/Support/ResponsiveTable';
import { getContractColumns, getInvoiceColumns, getUnitColumns } from '@/config/propertyTableColumns';
import { AssetDataDetailed, ContractData, InvoiceData, UnitData } from '@/types/AssetHooks';
import { IUser } from '@/types/user';

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
  /** Handler for contract click */
  onContractClick?: (contractId: string) => void;
  /** Handler for invoice click */
  onInvoiceClick?: (invoiceId: string) => void;
  /** Handler for unit click */
  onUnitClick?: (unitId: string) => void;
  /** Handler for invoice update */
  onInvoiceUpdate?: (invoice: any) => void;
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
  onInvoiceClick,
  onUnitClick,
  onInvoiceUpdate,
}) => {
  const router = useRouter();
  const t = useTranslations('Common');
  console.log('contracts', contracts)

  // Get column configurations
  const contractColumns = user ? getContractColumns(asset as any, user) : [];
  const invoiceColumns = onInvoiceUpdate ? getInvoiceColumns(onInvoiceUpdate) : [];
  console.log('-->asset', asset);
  const unitColumns = getUnitColumns(asset as any, (unitCode) => {
    if (onUnitClick) {
      onUnitClick(unitCode);
    }
  }, t);

  if (!asset) {
    return null;
  }

  return (
    <>
      {/* UNITS SECTION - For complex properties */}
      {showUnits && units.length > 0 && (
        <SectionWrapper title={t('units')} Icon={House}>
          <ResponsiveTable
            columns={unitColumns}
            data={units.slice(0, 3)}
            onRowClick={(unit) => onUnitClick && onUnitClick(unit.Code)}
            keyField="Code"
            searchKey="Name"
            showMore={
              units.length > 3
                ? {
                    url: `/landlord/properties/${asset.Code}/units`,
                    label: t('showMoreUnits'),
                  }
                : undefined
            }
          />
        </SectionWrapper>
      )}

      {/* INVOICES SECTION */}
      {showInvoices && invoices.length > 0 && (
        <SectionWrapper title={t('invoiceHistory')} Icon={FileText}>
          {invoices.length > 0 ? (
            <ResponsiveTable
              columns={invoiceColumns}
              data={invoices.slice(0, 3)}
              onRowClick={(inv) => onInvoiceClick && onInvoiceClick(inv.Code)}
              keyField="Code"
              showMore={
                invoices.length > 3
                  ? {
                      url: `/landlord/properties/${asset.Code}/invoices`,
                      label: t('showMoreInvoices'),
                    }
                  : undefined
              }
            />
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-sm p-3">
              {t('noInvoicesAvailable')}
            </p>
          )}
        </SectionWrapper>
      )}

      {/* CONTRACTS SECTION */}
      {showContracts && (
        <SectionWrapper title={t('leaseContracts')} Icon={FileText}>
          {contracts.length > 0 ? (
            <ResponsiveTable
              columns={contractColumns}
              data={contracts.slice(0, 5)}
              onRowClick={(contract) => {
                console.log('-->contract', contract)
                onContractClick && onContractClick(contract.id)
              }}
              keyField="Code"
              showMore={
                contracts.length > 5
                  ? {
                      url: `/landlord/properties/${asset.Code}/contracts`,
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
    </>
  );
};

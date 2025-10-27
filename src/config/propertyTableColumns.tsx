import { AssetData, IContractDetail, IInvoiceForm } from "@/types/Property";
import { IContractColumn } from "@/types/TableTypes";
import { capitalize, capitalizeEachWord, formatDateToText, formatNumberWithSpaces } from "@/lib/utils";
import { getStatusBadge } from "@/lib/utils-component";
import Button from "@/components/ui/Button";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { ContractPdf } from "@/components/pdf/ContractPdf";
// import { IUserData } from "@/types/user";
import { ProfileDetail } from "@/types/authTypes";
import { UnitData } from "@/types/AssetHooks";

export const getContractColumns = (asset: any, user: ProfileDetail | null) => [
  {
    key: 'tenant',
    label: 'Tenant',
    priority: 'medium' as const,
    render: (_: any, contract: IContractDetail) => (
      <div className="font-medium text-gray-800 dark:text-gray-100">
        {capitalizeEachWord(contract.tenantName)}
      </div>
    ),
  },
  {
    key: 'period',
    label: 'Period',
    priority: 'medium' as const,
    render: (_: any, contract: IContractDetail) => (
      <div className="text-sm text-gray-800 dark:text-gray-100">
        <div><span className="font-bold">From</span> {formatDateToText(contract.startDate)}</div>
        <div className="text-gray-600 dark:text-gray-300"><span className="font-bold">to</span> {formatDateToText(contract.endDate)}</div>
      </div>
    ),
  },
  {
    key: 'monthlyRent',
    label: 'Monthly Rent',
    priority: 'medium' as const,
    render: (_: any, contract: IContractDetail) => (
      <div className="text-sm text-gray-800 dark:text-gray-100">
        {`${formatNumberWithSpaces(contract.monthlyRent)} ${asset?.Currency ?? ''}`}
      </div>
    ),
  },
  {
    key: 'status',
    label: 'Status',
    priority: 'low' as const,
    render: (_: any, contract: IContractDetail) => (
      <>
        {getStatusBadge(contract.status)}
      </>
    ),
  },
  {
    key: 'action',
    label: 'Action',
    priority: 'high' as const,
    render: (_: any, contract: IContractDetail) => (
      <>
        {(asset && user) &&
          <PDFDownloadLink document={<ContractPdf contract={contract} asset={asset} contractor={user} />} fileName={`contrat-${contract.id}.pdf`}>
            {({ loading, url }) => (
              <Button
                variant="info"
                isSubmitBtn={false}
                fullWidth={false}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (url) {
                    const link = document.createElement("a");
                    link.href = url;
                    link.download = `contrat-${contract.id}.pdf`;
                    link.click();
                  }
                }}
              >
                Print
              </Button>
            )}
          </PDFDownloadLink>
        }
      </>
    ),
  }
];

export const getContractColumnsSimple = () => [
  {
    key: 'tenant',
    label: 'Tenant',
    priority: 'high' as const,
    render: (_: any, contract: IContractColumn) => (
      <div className="font-medium text-gray-800 dark:text-gray-100">
        {capitalizeEachWord(contract.tenant)}
      </div>
    ),
  },
  {
    key: 'period',
    label: 'Period',
    priority: 'medium' as const,
    render: (_: any, contract: IContractColumn) => (
      <div className="text-sm text-gray-800 dark:text-gray-100">
        <div><span className="font-bold">From</span> {formatDateToText(contract.startDate)}</div>
        <div className="text-gray-600 dark:text-gray-300"><span className="font-bold">to</span> {formatDateToText(contract.endDate)}</div>
      </div>
    ),
  },
  {
    key: 'monthlyRent',
    label: 'Monthly Rent',
    priority: 'high' as const,
    render: (_: any, contract: IContractColumn) => (
      <div className="text-sm text-gray-800 dark:text-gray-100">
        {contract.monthlyRent}
      </div>
    ),
  },
  {
    key: 'status',
    label: 'Status',
    priority: 'high' as const,
    render: (_: any, contract: IContractColumn) => (
      <>
        {getStatusBadge(contract.status)}
      </>
    ),
  }
];

export const getInvoiceColumns = (handleClickUpdateInvoice: (invoice: IInvoiceForm) => void) => [
  {
    key: 'tableId',
    label: 'ID',
    priority: "medium" as "medium",
    render: (_: any, invoice: IInvoiceForm) => (
      <div className="text-gray-800 text-sm dark:text-gray-100">
        {invoice.tableId}
      </div>
    ),
  },
  {
    key: 'period',
    label: 'Period',
    priority: "medium" as "medium",
    render: (_: any, invoice: IInvoiceForm) => (
      <div className="text-sm text-gray-800 dark:text-gray-100">
        <div><span className='font-bold'>From</span> {formatDateToText(invoice.startDate)}</div>
        <div className="text-gray-600 dark:text-gray-300">to {formatDateToText(invoice.endDate)}</div>
      </div>
    ),
  },
  {
    key: 'status',
    label: 'Status',
    priority: "medium" as "medium",
    render: (_: any, invoice: IInvoiceForm) => (
      <>
        {getStatusBadge(invoice.status == "DRAFT" ? "UNPAID" : invoice.status)}
      </>
    ),
  },
  {
    key: 'actions',
    label: 'Actions',
    priority: "high" as "high",
    render: (_: any, invoice: IInvoiceForm) => (
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleClickUpdateInvoice(invoice);
        }}
        className="px-2 py-1.5 rounded-lg font-medium text-sm transition-colors duration-200
                    bg-blue-100 text-blue-800 hover:bg-blue-200 active:bg-blue-300
                    dark:bg-blue-900 dark:text-blue-100 dark:hover:bg-blue-800 dark:active:bg-blue-700"
      >
        {invoice.contractStatus == "INACTIVE" ? "Details" : "Update"}
      </button>
    ),
  },
];

export const getUnitColumns = (
  asset: AssetData,
  onEdit: (unitCode: string) => void,
  t?: (key: string) => string
) => [
  {
    key: 'unit',
    label: t ? t('unitName') : 'Unit Name',
    priority: "medium" as "medium",
    render: (_: any, unit: UnitData) => (
      <div className="flex flex-col text-gray-800 dark:text-gray-100">
        <span className="font-medium">{capitalize(unit.Name)}</span>
        {/* <span className="text-xs text-gray-600 dark:text-gray-100 ml-1">{capitalize(unit.TypeCode)}</span> */}
      </div>
    ),
  },
  {
    key: 'status',
    label: t ? t('status') : 'Status',
    priority: "low" as "low",
    render: (_: any, unit: UnitData) => (
      <div className=" text-gray-800 dark:text-gray-100">
        {getStatusBadge(unit.Status)}
      </div>
    ),
  },
  {
    key: 'price',
    label: t ? t('rent') : 'Rent',
    priority: "medium" as "medium",
    render: (_: any, unit: UnitData) => (
      <span className="">
        {formatNumberWithSpaces(unit.Rent)} {asset.Currency}
      </span>
    ),
  },
  {
    key: 'actions',
    label: t ? t('actions') : 'Actions',
    priority: "high" as "high",
    render: (_: any, unit: UnitData) => (
      <div className="flex gap-2 ">
        <Button
          variant="neutral"
          isSubmitBtn={false}
          fullWidth={false}
          onClick={(e) => {
            e.stopPropagation();
            onEdit(unit.Code);
          }}
        >
          {t ? t('viewDetails') : 'viewDetails'}
        </Button>
      </div>
    ),
  },
];

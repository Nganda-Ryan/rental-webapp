import { IContractDetail, AssetData, IInvoiceForm } from "@/types/Property";
import { capitalize, capitalizeEachWord, formatDateToText, formatNumberWithSpaces } from "@/lib/utils";
import { getStatusBadge } from "@/lib/utils-component";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { ContractPdf } from "@/components/pdf/ContractPdf";
import Button from "@/components/ui/Button";

// Fonctions utilitaires
const getContractDownloadButton = (contract: IContractDetail, asset: any, user: any) => {
  if (!asset || !user) {
    return null;
  }
  return (
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
          {loading ? "Loading..." : "Print"}
        </Button>
      )}
    </PDFDownloadLink>
  );
};

// Définition des colonnes
export const contractColumns = (asset: any, user: any) => [
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
      getStatusBadge(contract.status)
    ),
  },
  {
    key: 'action',
    label: 'Action',
    priority: 'high' as const,
    render: (_: any, contract: IContractDetail) => getContractDownloadButton(contract, asset, user),
  },
];

export const invoiceColumns = [
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
      getStatusBadge(invoice.status === "DRAFT" ? "UNPAID" : invoice.status)
    ),
  },
  {
    key: 'actions',
    label: 'Actions',
    priority: "high" as "high",
    render: (_: any, invoice: IInvoiceForm) => (
      <button
        onClick={(e) => { e.stopPropagation(); /* TODO: handle update invoice */ }}
        className="px-2 py-1.5 rounded-lg font-medium text-sm transition-colors duration-200 bg-blue-100 text-blue-800 hover:bg-blue-200 active:bg-blue-300 dark:bg-blue-900 dark:text-blue-100 dark:hover:bg-blue-800 dark:active:bg-blue-700"
      >
        {invoice.contractStatus === "INACTIVE" ? "Details" : "Update"}
      </button>
    ),
  },
];

export const unitColumns = (router: any, params: any) => [
  {
    key: 'unit',
    label: 'Unit Name',
    priority: "medium" as "medium",
    render: (_: any, unit: AssetData) => (
      <div className="flex flex-col text-gray-800 dark:text-gray-100">
        <span className="font-medium">{capitalize(unit.Title)}</span>
        <span className="text-xs text-gray-600 dark:text-gray-100 ml-1">{capitalize(unit.TypeCode)}</span>
      </div>
    ),
  },
  {
    key: 'status',
    label: 'Status',
    priority: "low" as "low",
    render: (_: any, unit: AssetData) => getStatusBadge(unit.StatusCode),
  },
  {
    key: 'price',
    label: 'Rent',
    priority: "medium" as "medium",
    render: (_: any, unit: AssetData) => (
      <span className="">
        {formatNumberWithSpaces(unit.Price)} {unit.Currency}
      </span>
    ),
  },
  {
    key: 'actions',
    label: 'Actions',
    priority: "high" as "high",
    render: (_: any, unit: AssetData) => (
      <div className="flex gap-2">
        <Button
          variant="neutral"
          isSubmitBtn={false}
          fullWidth={false}
          onClick={(e) => {
            e.stopPropagation();
            router.push(`/landlord/properties/${params.id}/edit-unit?unitId=${unit.Code}`);
          }}
        >
          Edit
        </Button>
      </div>
    ),
  },
];
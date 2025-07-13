"use client"

import React, { useEffect, useState } from 'react'
import {
  User,
  Calendar,
  DollarSign,
  FileText,
  Mail,
  Phone,
  Zap,
  X,
} from 'lucide-react'
import DefaultLayout from '@/components/Layouts/DefaultLayout';
import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb';
import { useParams } from 'next/navigation';
import { createInvoice, getContract, searchInvoice, terminateLease, updateInvoice } from '@/actions/assetAction';
import { IContractDetail, IInvoice, IInvoiceForm, IInvoiceTableData, IUpdateInvoiceParam, SeachInvoiceParams } from '@/types/Property';
import { getStatusBadge } from '@/lib/utils-component';
import Button from '@/components/ui/Button';
import Overlay from '@/components/Overlay';
import InvoiceGenerator from '@/components/feature/Properties/InvoiceGenerator';
import { SuccessModal } from '@/components/Modal/SucessModal';
import toast from 'react-hot-toast';
import ContractDetailSkeleton from '@/components/skeleton/ContractDetailSkeleton';
import { ResponsiveTable } from '@/components/feature/Support/ResponsiveTable';
import { useRouter } from '@bprogress/next/app';
import { formatDateToText, formatNumberWithSpaces } from '@/lib/utils';
import { ActionConfirmationModal } from '@/components/Modal/ActionConfirmationModal';
import Nodata from '@/components/error/Nodata';
import { useAuth } from "@/context/AuthContext";
import { PROFILE_LANDLORD_LIST } from "@/constant";
import SectionWrapper from '@/components/Cards/SectionWrapper';
import { roleStore } from '@/store/roleStore';

const ContractDetail = () => {
    const [contract, setContract] = useState<IContractDetail>();
    const [formDefaultInvoice, setFormDefaultInvoice] = useState<IInvoiceForm>();
    const [tempFormDefaultInvoice, setTempFormDefaultInvoice] = useState<IInvoiceForm>();
    const [isTerminatingContract, setIsTerminatingContract] = useState(false);
    const [invoiceTableData, setInvoiceTableData] = useState<IInvoiceForm[]>([]);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showActionModal, setShowActionModal] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [showInvoiceGenerator, setShowInvoiceGenerator] = useState(false);
    const [showMobileActions, setShowMobileActions] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [action, setAction] = useState<"CREATE" | "UPDATE">("CREATE");
    const params = useParams();
    const router = useRouter();
    const { isAuthorized } = roleStore();

    useEffect(() => {
        const fetchContractData = async () => {
            try {
                const result = await getContract(params.contractId as string);
                console.log('-->result', result)
                if(result.data){
                    const _contract: IContractDetail = {
                        id: result.data.body.contractData.Code,
                        billingElements: result.data.body.contractData.billingItems ? result.data.body.contractData.billingItems.map((item:any) => ({
                            code: item.Code,
                            label: item.ItemCode
                        })) : [],
                        endDate: result.data.body.contractData.EndDate,
                        monthlyRent: result.data.body.contractData.asset.Price,
                        currency: result.data.body.contractData.Currency,
                        notes: "",
                        startDate: result.data.body.contractData.StartDate,
                        status: result.data.body.contractData.StatusCode,
                        tenantName: result.data.body.contractData.renter.user.Firstname + " " + result.data.body.contractData.renter.user.Lastname,
                        tenant: {
                            email: result.data.body.contractData.renter.user.Email,
                            phone: result.data.body.contractData.renter.user.Phone,
                            userCode: result.data.body.contractData.renter.user.Code,
                            firstName: result.data.body.contractData.renter.user.Firstname,
                            lastName: result.data.body.contractData.renter.user.Lastname
                        }
                    }
                    const getInvoiceParam: SeachInvoiceParams = {
                        orderBy: "Item.CreatedAt",
                        orderMode: "desc",
                        contractCodes: [_contract.id]
                    };
                    const _formDefaultInvoice: IInvoiceForm = {
                        id: _contract.id,
                        tenant: _contract.tenant.firstName + " " + _contract.tenant.lastName,
                        tableId: "",
                        startDate: _contract.startDate,
                        endDate: "",
                        monthlyRent: _contract.monthlyRent,
                        status: _contract.status,
                        notes: _contract.notes,
                        currency: _contract.currency,
                        billingElements: _contract.billingElements.map(item => ({
                            id: "",
                            code: item.label,
                            label: item.label,
                            amount: 0,
                            paidDate: today,
                            status: false,
                        }))
                    }
                    
                    
                    const getInvoiceResult = await searchInvoice(getInvoiceParam);
                    if(getInvoiceResult.data){
                        console.log('-->getInvoiceResult', getInvoiceResult.data.body.items)
                        const _invoiceTableData: IInvoiceForm[] = getInvoiceResult.data.body.items.map((inv: any, index: number) => {
                            return {
                                id: inv.Code,
                                tableId: "INV"+(index+1),
                                status: inv.StatusCode,
                                startDate: inv.StartDate.split("T")[0],
                                endDate: inv.EndDate.split("T")[0],
                                tenant: _contract.tenant.firstName + " " + _contract.tenant.lastName,
                                monthlyRent: _contract.monthlyRent,
                                notes: inv.Notes,
                                currency: _contract.currency,
                                billingElements: inv.items.map((item: any) => ({
                                    id: item.Code,
                                    code: item.ItemCode,
                                    label: item.ItemCode,
                                    amount: item.Amount,
                                    paidDate: item.PaidDate ? item.PaidDate.split("T")[0] : "",
                                    status: item.IsPaid == 1 ? true : false,
                                }))
                            }
                        });

                        const recentInvoice = _invoiceTableData.length > 0 && _invoiceTableData[0];
                        
                        if(recentInvoice){
                            _formDefaultInvoice.startDate = recentInvoice.endDate;
                        }
                        setFormDefaultInvoice(_formDefaultInvoice);
                        setTempFormDefaultInvoice(_formDefaultInvoice);
                        setContract(_contract);
                        setInvoiceTableData(_invoiceTableData);

                        // console.log('-->_formDefaultInvoice', _formDefaultInvoice);
                        // console.log('-->_invoiceTableData', _invoiceTableData);
                    }
                } else {
                    console.log('ContractDetail.useEffect.catch.error', result);
                    if(result.code == 'SESSION_EXPIRED'){
                        router.push('/signin');
                        return;
                    }
                }
            } catch (error) {
                console.log('ContractDetail.useEffect.getContract.error', error)
            } finally {
                setIsLoading(false);
            }
        }
        fetchContractData();
    }, []);

    useEffect(() => {
        if(showInvoiceGenerator == false){
            setFormDefaultInvoice(tempFormDefaultInvoice);
            setAction("CREATE");
        }
    }, [showInvoiceGenerator, tempFormDefaultInvoice]);

    useEffect(() => {
        if (showMobileActions) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
        };
    }, [showMobileActions]);

    const today = new Date().toISOString().split("T")[0];
    const invoiceColumns = [
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
                    {contract?.status && contract.status == "INACTIVE" ? "Details" : "Update"}
                </button>

            ),
        },
    ]
    const handleUpsertInvoice = async (data: IInvoiceForm) => {
        try {
            if(action == "CREATE"){
                const invoicePayload: IInvoice = {
                    contractCode: contract?.id ?? "",
                    endDate: data.endDate,
                    startDate: data.startDate,
                    notes: data.notes,
                    profilCode: "", //lessor profile
                    userId: contract?.tenant.userCode ?? "", //renter
                    items: data.billingElements.map(item => ({
                        amount: String(item.amount),
                        isPaid: item.status,
                        itemCode: item.label,
                        notes: "",
                        paidDate: item.paidDate
                    })),
                }
                const result = await createInvoice(invoicePayload);
                console.log('-->result', result)
                if(result.data){
                    setSuccessMessage("Invoice created successfully");
                    setShowSuccessModal(true)
                } else if(result.error){
                    toast.error(result.error ?? "An unexpected error occurred", { position: 'bottom-right' });
                }
            } else {
                const payload: IUpdateInvoiceParam = {
                    code: data.id,
                    contractCode: contract?.id ?? "",
                    notes: data.notes,
                    profilCode: "",
                    userId: contract?.tenant.userCode ?? "",
                    items: data.billingElements.map(item => ({
                        "itemCode": item.code,
                        "code": item.id,
                        "isPaid": item.status,
                        "paidDate": item.paidDate
                    })),
                }
                const result = await updateInvoice(payload);
                if(result.data){
                    setSuccessMessage("Invoice updated successfully");
                    setShowSuccessModal(true)
                } else if(result.error){
                    toast.error(result.error ?? "An unexpected error occurred", { position: 'bottom-right' });
                }
            }
        } catch (error) {
            toast.error("Something went wrong during the process. Try again or contact the administrator", { position: 'bottom-right' });
            console.log('-->ContractDetailPage.handleUpsertInvoice.error', error);
        } finally {
            if(contract){
                fetchInvoice(contract);
            }
            setShowInvoiceGenerator(false)
        }
        
        
    }
    const   handleClickUpdateInvoice = (data: IInvoiceTableData) => {
        // console.log('-->data', data);
        if(invoiceTableData && invoiceTableData.length > 0){
            const foundInvoice = invoiceTableData.find(inv => inv.id == data.id);
            if (!foundInvoice) {
                toast.error("Invoice not found", { position: 'bottom-right' });
                return;
            }
            const _invoice: IInvoiceForm = {
                ...foundInvoice,
                id: foundInvoice.id ?? "",
                billingElements: invoiceTableData[0].billingElements
            }
            console.log('-->_invoice', _invoice);

            setFormDefaultInvoice(_invoice);
            setAction("UPDATE");
            setShowInvoiceGenerator(true);
        }
    }
    const handleSelectInvoice = (id: string) => {
        console.log('handleSelectInvoice', handleSelectInvoice)
    }
    const handleClickTerminateLease = async () => {
        setShowActionModal(true)
    }

    const handleConfirmTerminateLease = async () => {
        try {
            setIsTerminatingContract(true);
            if(contract){
                const result  = await terminateLease(contract.id);
                if(result.data) {
                    toast.success("Lease terminated", { position: 'bottom-right' });
                    contract.status = "INACTIVE"
                } else if(result.error){
                    if(result.code == 'SESSION_EXPIRED'){
                        router.push('/signin');
                        return;
                    }
                    toast.error(result.error ?? "An unexpected error occurred", { position: 'bottom-right' });
                }
            }
        } catch (error) {
            
        } finally {
            setIsTerminatingContract(false);
            setShowActionModal(false);
        }
    }


    const fetchInvoice = async (_contract: IContractDetail) => {
        try {
            const getInvoiceParam: SeachInvoiceParams = {
                orderBy: "Item.CreatedAt",
                orderMode: "desc",
                contractCodes: [_contract.id]
            };
            const _formDefaultInvoice: IInvoiceForm = {
                id: _contract.id,
                tenant: _contract.tenant.firstName + " " + _contract.tenant.lastName,
                tableId: "",
                startDate: _contract.startDate,
                endDate: "",
                monthlyRent: _contract.monthlyRent,
                status: _contract.status,
                notes: _contract.notes,
                currency: _contract.currency,
                billingElements: _contract.billingElements.map(item => ({
                    id: "",
                    code: item.label,
                    label: item.label,
                    amount: 0,
                    paidDate: today,
                    status: false,
                }))
            }
            
            
            const getInvoiceResult = await searchInvoice(getInvoiceParam);
            if(getInvoiceResult.data){
                const _invoiceTableData: IInvoiceForm[] = getInvoiceResult.data.body.items.map((inv: any, index: number) => {
                    return {
                        id: inv.Code,
                        tableId: "INV"+(index+1),
                        status: inv.StatusCode,
                        startDate: inv.StartDate.split("T")[0],
                        endDate: inv.EndDate.split("T")[0],
                        tenant: _contract.tenant.firstName + " " + _contract.tenant.lastName,
                        monthlyRent: _contract.monthlyRent,
                        notes: inv.Notes,
                        currency: _contract.currency,
                        billingElements: inv.items.map((item: any) => ({
                            id: item.Code,
                            code: item.ItemCode,
                            label: item.ItemCode,
                            amount: item.Amount,
                            paidDate: item.PaidDate ? item.PaidDate.split("T")[0] : "",
                            status: item.IsPaid == 1 ? true : false,
                        }))
                    }
                });

                const recentInvoice = _invoiceTableData.length > 0 && _invoiceTableData[0];
                
                if(recentInvoice){
                    _formDefaultInvoice.startDate = recentInvoice.endDate;
                }
                setFormDefaultInvoice(_formDefaultInvoice);
                setTempFormDefaultInvoice(_formDefaultInvoice);
                setInvoiceTableData(_invoiceTableData);
            } else if(getInvoiceResult.error){
                toast.error(getInvoiceResult.error ?? "An unexpected error occurred", { position: 'bottom-right' });
            }
        } catch (error) {
            console.log('ContractDetailPage.fetchInvoice.error', error);
        }
    }


    if (!isAuthorized(PROFILE_LANDLORD_LIST)) {
        return <div>Unauthorized</div>;
    }
    return (
        <DefaultLayout>
            <Breadcrumb previousPage pageName="Locatif" />
            {
                isLoading ? 
                <ContractDetailSkeleton />
                :
                <div className="w-full mt-10">
                    {
                        contract ? 
                        <>
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                <div className="lg:col-span-2 space-y-6">
                                    {/* Contract Overview */}
                                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 sm:p-6">
                                        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
                                            <div>
                                                <h2 className="text-xl font-semibold mb-2 dark:text-white">
                                                    Contract #{contract?.id}
                                                </h2>
                                                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                                    <Calendar size={16} />
                                                    <span>
                                                        {formatDateToText(contract?.startDate)} - {formatDateToText(contract?.endDate)}
                                                    </span>
                                                </div>
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-sm`}>
                                                {getStatusBadge(contract?.status ?? "DRAFT")}
                                            </span>
                                        </div>
                                        {/* Financial Information */}
                                        <div className="border-t border-gray-100 dark:border-gray-700 pt-4 mt-4">
                                            <h3 className="font-medium mb-4 flex items-center gap-2 dark:text-white">
                                                <DollarSign size={16} />
                                                Financial Information
                                            </h3>
                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                                                <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                                                        Monthly Rent
                                                    </p>
                                                    <p className="text-xl font-bold dark:text-white">
                                                        {formatNumberWithSpaces(contract?.monthlyRent)} {contract?.currency}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="space-y-4">
                                                <div className="flex justify-between items-center">
                                                    <h4 className="font-medium text-sm text-gray-500 dark:text-gray-400">
                                                        Ameneties
                                                    </h4>
                                                </div>
                                                <div className="flex justify-start ite gap-3">
                                                    {contract?.billingElements.map((element, index) => (
                                                        <div key={index} className="flex justify-between items-center px-2 bg-gray-50 dark:bg-gray-700/50 rounded">
                                                            <p className="dark:text-white">
                                                                {element.label}
                                                            </p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        {/* Tenant Information */}
                                        <div className="border-t border-gray-100 dark:border-gray-700 pt-4 mt-4">
                                            <h3 className="font-medium mb-4 flex items-center gap-2 dark:text-white">
                                                <User size={16} />
                                                Tenant Information
                                            </h3>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                                                        Name
                                                    </p>
                                                    <p className="font-medium dark:text-white">
                                                        {contract?.tenant.firstName} {contract?.tenant.lastName}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                                                        Phone
                                                    </p>
                                                    <div className="flex items-center gap-2">
                                                        <Phone size={16} className="text-gray-400" />
                                                        <p className="dark:text-gray-300">
                                                        {contract?.tenant.phone}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div>
                                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                                                    Email
                                                </p>
                                                <div className="flex items-center gap-2">
                                                    <Mail size={16} className="text-gray-400" />
                                                    <p className="dark:text-gray-300">
                                                        {contract?.tenant.email}
                                                    </p>
                                                </div>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                                                        Move-in Date
                                                    </p>
                                                    <div className="flex items-center gap-2">
                                                        <Calendar size={16} className="text-gray-400" />
                                                        <p className="dark:text-gray-300">
                                                            {formatDateToText(contract?.startDate)}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* BILLING STATEMENT */}
                                    <div className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm">
                                        <div className="flex items-center justify-between mb-6">
                                            <h2 className="text-xl font-semibold flex items-center gap-2 text-gray-800 dark:text-white">
                                            <FileText size={20} className="text-gray-400 dark:text-gray-300" />
                                            Billing Management
                                            </h2>
                                        </div>

                                        <div className="space-y-4">
                                            {invoiceTableData.length > 0 ? (
                                                <ResponsiveTable
                                                    columns={invoiceColumns}
                                                    data={invoiceTableData}
                                                    onRowClick={(inv) => handleSelectInvoice(inv.id)}
                                                    keyField="id"
                                                    paginate={7}
                                                />
                                                ) : (
                                                <p className="text-gray-500 dark:text-gray-400 text-sm p-3">No invoices available</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                {/* ACTIONS */}
                                <div className="hidden lg:block">
                                    <SectionWrapper title="Quick Actions">
                                        <div className="space-y-3 mb-3">
                                            <Button onClick={() => {setShowInvoiceGenerator(true); setAction("CREATE")}} variant='neutral' disable={contract.status == "INACTIVE"} isSubmitBtn={false}>
                                                <DollarSign size={16} /> Create Invoice
                                            </Button>
                                        </div>
                                        {
                                            contract?.status == "ACTIVE" && 
                                            (<div className="space-y-3">
                                                <Button onClick={handleClickTerminateLease} variant='danger' disable={false} isSubmitBtn={false} loading={isTerminatingContract}>
                                                    <DollarSign size={16} /> Terminate Lease
                                                </Button>
                                            </div>)
                                        }
                                    </SectionWrapper>
                                </div>
                            </div>

                            
                            {/* Drawer d’actions pour mobile */}
                            <div
                                className={`
                                    fixed inset-0 z-50 lg:hidden
                                    ${showMobileActions ? "pointer-events-auto" : "pointer-events-none"}
                                `}
                                role="dialog"
                                aria-modal="true"
                                >
                                {/* Overlay */}
                                <div
                                    className={`
                                    absolute inset-0 bg-black bg-opacity-40 backdrop-blur-sm
                                    transition-opacity duration-300 ease-linear
                                    ${showMobileActions ? "opacity-100" : "opacity-0"}
                                    `}
                                    onClick={() => setShowMobileActions(false)}
                                />

                                {/* Drawer - slide up/down */}
                                <div
                                    className={`
                                        absolute bottom-0 left-0 right-0 bg-white dark:bg-gray-900 rounded-t-2xl p-4 shadow-lg
                                        transform transition-transform duration-300 ease-linear
                                        ${showMobileActions ? "translate-y-0" : "translate-y-full"}
                                    `}
                                >
                                    <div className="flex justify-between items-center mb-4">
                                        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Quick Actions</h2>
                                        <button onClick={() => setShowMobileActions(false)} className="text-gray-500 hover:text-gray-800 dark:hover:text-white" aria-label="Close drawer">
                                            <X size={24} />
                                        </button>
                                    </div>

                                    {/* MOBILE ACTIONS */}
                                    <div className="space-y-3 mb-20">
                                        <div className="space-y-3 mb-3">
                                            <Button onClick={() => {setShowInvoiceGenerator(true); setAction("CREATE")}} variant='neutral' disable={contract.status == "INACTIVE"} isSubmitBtn={false}>
                                                <DollarSign size={16} /> Create Invoice
                                            </Button>
                                        </div>
                                        {
                                            contract?.status == "ACTIVE" && 
                                            (<div className="space-y-3">
                                                <Button onClick={handleClickTerminateLease} variant='danger' disable={false} isSubmitBtn={false} loading={isTerminatingContract}>
                                                    <DollarSign size={16} /> Terminate Lease
                                                </Button>
                                            </div>)
                                        }
                                    </div>
                                </div>
                            </div>

                            {/* FAB pour mobile */}
                            {!showMobileActions && (
                                <button onClick={() => setShowMobileActions(true)} aria-label="Show quick actions" className={`fixed bottom-9 right-6 z-50 bg-[#2A4365] text-white p-2 rounded-full shadow-lg hover:bg-blue-700 active:scale-95 duration-300 ease-linear lg:hidden`}  >
                                    <Zap size={24} />
                                </button>
                            )}

                                        

                            <Overlay isOpen={showInvoiceGenerator} onClose={() => setShowInvoiceGenerator(false)}>
                                <InvoiceGenerator
                                    onClose={() => setShowInvoiceGenerator(false)}
                                    onCreate={(data: IInvoiceForm) => {handleUpsertInvoice(data)}}
                                    defaultValue={formDefaultInvoice}
                                    action={action}
                                />
                            </Overlay>
                            <Overlay isOpen={showSuccessModal} onClose={() => setShowSuccessModal(false)}>
                                <SuccessModal
                                    onClose={() => setShowSuccessModal(false)}
                                    message={successMessage}
                                />
                            </Overlay>
                            <Overlay isOpen={showActionModal} onClose={() => setShowActionModal(false)}>
                                <ActionConfirmationModal
                                    onClose={() => setShowActionModal(false)}
                                    onConfirm={handleConfirmTerminateLease}
                                    title="Terminate the contract"
                                    type='APPROVED'
                                    showCommentInput={false}
                                    message={`Are you sure you want to terminate lease #${contract.id} ?`}
                                />
                            </Overlay>
                        </>
                        : 
                        <div>
                            <Nodata />
                        </div>
                    }
                </div> 
            }
        </DefaultLayout>
    )
}

export default ContractDetail;
"use client"
import React, { useEffect, useState } from "react";
import {
  Building2,
  MapPin,
  Share2,
  UserPlus,
  FileText,
  DollarSign,
  UserCog,
  Zap,
  X,
} from "lucide-react";
import { useRouter } from '@bprogress/next/app';
import { VerificationForm } from "@/components/feature/Properties/VerificationForm";
import { DeletePropertyModal } from "@/components/feature/Properties/DeletePropertyModal";
import { AttachPropertiesModal } from "@/components/feature/Properties/AttachPropertiesModal";
import { TenantContractForm } from "@/components/feature/Properties/TenantContractForm";
import { SuccessModal } from "@/components/Modal/SucessModal";
import Image from "next/image";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Overlay from "@/components/Overlay";
import InvoiceGenerator from "@/components/feature/Properties/InvoiceGenerator";
import { useParams } from 'next/navigation';
import { createContract, createInvoice, getAsset, searchInvoice, terminateLease } from "@/actions/assetAction";
import { AssetData, AssetDataDetailed, IContractDetail, IInvoice, IInvoiceForm, IInvoiceTableData, SeachInvoiceParams } from "@/types/Property";
import { getStatusBadge } from "@/lib/utils-component";
import { PropertySkeletonPageSection1, PropertySkeletonPageSection2 } from "@/components/skeleton/pages/PropertySkeletonPage";
import Button from "@/components/ui/Button";
import toast from 'react-hot-toast';
import { ResponsiveTable } from "@/components/feature/Support/ResponsiveTable";
import { capitalize, formatDateToText } from "@/lib/utils";
import { ActionConfirmationModal } from "@/components/Modal/ActionConfirmationModal";
import { useAuth } from "@/context/AuthContext";
import { ASSET_TYPE_COMPLEXE, PROFILE_LANDLORD_LIST } from "@/constant";
import ImageLoading from "@/components/ImageLoading";
import { IUser, IUserPermission } from "@/types/user";
import SectionWrapper from "@/components/Cards/SectionWrapper";
import { IContractColumn } from "@/types/TableTypes";



const PropertyDetail = () => {
    const today = new Date().toISOString().split("T")[0];
    const [asset, setAsset] = useState<AssetDataDetailed | null>(null);
    const [contractTableData, setContractTableData] = useState<IContractColumn[]>([]);
    const [invoiceFormDefaultValue, setInvoiceFormDefaultValue] = useState<IInvoiceForm>();
    const [tempInvoiceFormDefaultValue, setTempInvoiceFormDefaultValue] = useState<IInvoiceForm>();
    const [managerList, setManagerList] = useState<IUser[]>([]);
    const [invoiceTableData, setInvoiceTableData] = useState<IInvoiceForm[]>([]);
    const [activeContract, setActiveContract] = useState<IContractDetail>();
    const [action, setAction] = useState<"CREATE" | "UPDATE">("CREATE");
    const [successMessage, setSuccessMessage] = useState("");

    const [isReady, setIsReady] = useState(false);
    const [isImageLoading, setIsImageLoading] = useState(true);
    const [isContractFormOpen, setContractFormOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isAttachPropertiesModalOpen, setIsAttachPropertiesModalOpen] = useState(false);
    const [isTerminatingContract, setIsTerminatingContract] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showInvoiceGenerator, setShowInvoiceGenerator] = useState(false);
    const [showShareLink, setShowShareLink] = useState(false);
    const [showMobileActions, setShowMobileActions] = useState(false);
        const [clicked, setClicked] = useState(false);
    const [showActionModal, setShowActionModal] = useState(false);

    const params = useParams();
    const router = useRouter();
    const { isAuthorized, loadingProfile } = useAuth();

    useEffect(() => {
        init();
    }, [params.unitId, today]);

    useEffect(() => {
        if(showInvoiceGenerator == false){
            setInvoiceFormDefaultValue(tempInvoiceFormDefaultValue);
            setAction("CREATE");
        }
    }, [showInvoiceGenerator, tempInvoiceFormDefaultValue]);
    

    useEffect(() => {
        let timer: NodeJS.Timeout;
        console.log(showShareLink)
        if (showShareLink) {
            timer = setTimeout(() => {
                setShowShareLink(false);
                setClicked(false);
            }, 7000);
        }

        return () => {
            if (timer) clearTimeout(timer);
        };
    }, [showShareLink]);

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
    

    const contractColumns = [
        {
            key: 'tenant',
            label: 'Tenant',
            priority: 'high' as const,
            render: (_:any, contract: IContractColumn) => (
            <div className="font-medium text-gray-800 dark:text-gray-100">
                {contract.tenant}
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
                {`${contract.monthlyRent} ${asset?.Currency ?? ''}`}
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
                    {invoice.contractStatus == "INACTIVE" ? "Details" : "Update"}
                </button>

            ),
        },
    ];
 
    const handleShareLink = () => {
        const shareLink = `https://rentila.com/properties/ASkswDWMB1748465484436/apply`;
        setShowShareLink(true);
    };
    const handleCreateContract = () => {
        
        setContractFormOpen(true);
        setShowMobileActions(false);
        
    };
    const handleVerificationSubmit = (data: any) => {
        setIsModalOpen(false);
    };
    const handleVerificationFormOpen = () => {
        setIsModalOpen(true);
    }
    const handleDeleteProperty = async () => {
        setIsDeleteModalOpen(false);
        setSuccessMessage("Property deleted successfully");
        setShowSuccessModal(true);
        setTimeout(() => {
        }, 2000);
    };
    const handleAttachProperties = (selectedProperties: string[]) => {
        console.log("Attaching properties:", selectedProperties);
        setSuccessMessage("Properties attached successfully");
        setShowSuccessModal(true);
    };
    const handleContractSubmit = async (contractData: any) => {
        try {
            const result = await createContract({
                ...contractData,
                assetCode: asset?.Code ?? "",
            });
            if(result.contract){
                setSuccessMessage("Contract created successfully");
                setShowSuccessModal(true);
            } else if(result.error){
                toast.error(result.error ?? "An unexpected error occurred", { position: 'bottom-right' });
            }
        } catch (error) {
            
        } finally {
            await fetchAssetDetail();
            setContractFormOpen(false);
        }
        
        
    };
    const handleSelectedContract = (contractId: string) => {
        router.push(`/landlord/properties/${asset?.ParentCode}/units/${asset?.Code}/contracts/${contractId}`)
    }
    const handleCreateInvoice = async (data: IInvoiceForm) => {
        try {
            const invoicePayload: IInvoice = {
                contractCode: activeContract?.id ?? "",
                endDate: data.endDate,
                startDate: data.startDate,
                notes: data.notes,
                profilCode: "", //lessor profile
                userId: activeContract?.tenant.userCode ?? "", //renter
                items: data.billingElements.map(item => ({
                    amount: String(item.amount),
                    isPaid: item.status,
                    itemCode: item.label,
                    notes: "",
                    paidDate: item.paidDate
                })),
            }
            const result = await createInvoice(invoicePayload);
            if(result.data){
                setShowSuccessModal(true)
            } else if(result.error){
                toast.error(result.error ?? "An unexpected error occurred", { position: 'bottom-right' });
            }
        } catch (error) {
            toast.error("Something went wrong during the process. Try again or contact the administrator", { position: 'bottom-right' });
        } finally {
            setShowInvoiceGenerator(false)
        }
        
        
    }
    const handleClickUpdateInvoice = (data: IInvoiceTableData) => {
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
            if(activeContract){
                const result  = await terminateLease(activeContract.id);
                if(result.error){
                    if(result.code == 'SESSION_EXPIRED'){
                        router.push('/signin');
                        return;
                    }
                    toast.error(result.error ?? "An unexpected error occurred", { position: 'bottom-right' });
                }
            }
        } catch (error) {
            
        } finally {
            await init();
            setIsTerminatingContract(false);
            setShowActionModal(false);
            toast.success("Lease terminated", { position: 'bottom-right' });
        }
    }


    
    const getUnits = (items:any[]): AssetData [] => {
        return items.map((item: any, index: number) => {
            return {
                Code: item.Code,
                Id: "UNIT-" + (index + 1),
                Title: item.Title,
                Price: item.Price,
                Currency: item.Currency,
                CoverUrl: item.CoverUrl,
                StatusCode: item.StatusCode,
                IsActive: item.IsActive, // 1 ou 0
                TypeCode: item.TypeCode,
                IsVerified: item.IsVerified, // 1 ou 0
                Address: {
                    Code: item.Address.Code,
                    City: item.Address.City,
                    Country: item.Address.Country,
                    Street: item.Address.Street,
                },
            }
        });
    }
    const fetchAssetDetail = async () => {
        try {
            const result = await getAsset(params.id as string);
            if(result?.data?.body?.assetData) {
                const item = result.data.body.assetData;
                const assetData: AssetDataDetailed  = {
                    Code: item.Code,
                    Title: item.Title,
                    Price: item.Price,
                    Currency: item.Currency,
                    CoverUrl: item.CoverUrl,
                    StatusCode: item.StatusCode,
                    IsActive: item.IsActive, // 1 ou 0
                    TypeCode: item.TypeCode,
                    IsVerified: item.IsVerified, // 1 ou 0
                    Permission: result.data.body.ConfigPermissionList.map((item:any) => (item.Code)),
                    whoIs: result.data.body.whoIs,
                    BillingItems: result.data.body.billingItems.map((item: any) => (item.ItemCode)),
                    Units: getUnits(item.assets),
                    Address: {
                        Code: item.Address.Code,
                        City: item.Address.City,
                        Country: item.Address.Country,
                        Street: item.Address.Street,
                    },
                }

                if(item.contracts && item.contracts.length > 0){
                    const _rawActiveContract = item.contracts.find((contract: any) => (contract.status == 'ACTIVE')) ?? item.contracts[0];
                    const _activeContract: IContractDetail = {
                        id: _rawActiveContract.Code,
                        billingElements: [],
                        endDate: _rawActiveContract.EndDate,
                        monthlyRent: _rawActiveContract.asset.Price,
                        currency: _rawActiveContract.Currency,
                        notes: "",
                        startDate: _rawActiveContract.StartDate,
                        status: _rawActiveContract.StatusCode,
                        tenant: {
                            name: _rawActiveContract.renter.user.Lastname + ' ' + _rawActiveContract.renter.user.Firstname,
                            email: _rawActiveContract.renter.user.Email,
                            phone: _rawActiveContract.renter.user.Phone,
                            userCode: _rawActiveContract.renter.user.Code,
                        }
                    };
                    const _contractTableData = item.contracts.map((contract: any) => ({
                        id: contract.Code,
                        tenant: contract.renter.user.Lastname + ' ' + contract.renter.user.Firstname,
                        startDate: contract.StartDate,
                        endDate: contract.EndDate,
                        status: contract.StatusCode,
                        monthlyRent: assetData.Price,// + ' ' + assetData.Currency,
                    })) as IContractColumn[];

                    setActiveContract(_activeContract);
                    setContractTableData([..._contractTableData].reverse());
                }
                setAsset(assetData)
            } else if(result.error){
                if(result.code == 'SESSION_EXPIRED'){
                    router.push('/signin');
                    return;
                }
                toast.error(result.error ?? "An unexpected error occurred", { position: 'bottom-right' });
            }
        } catch (error) {
            console.log('PropertyDetail.fetchAssetDetail.error' ,error)
        } finally {
            setIsReady(true);
        }
    }

    const canCreateInvoice = (): boolean => {
        if(asset){
            const hasPermission = asset.Permission.includes("ManageBilling");
            if(hasPermission){
                if(asset.IsVerified == 0){
                    return false;
                } else {
                    if(contractTableData.some(contract => (contract.status == 'ACTIVE'))){
                        return true;
                    }
                }
            }
        }

        return false;
    }
    const canCreateContract = (): boolean => {
        if(asset) {
            const hasPermission = asset.Permission.includes("GenerateContract");
            if(hasPermission){
               return asset?.IsVerified == 1 && !contractTableData.some(contract => (contract.status == 'ACTIVE'));
            }
        }
        return false;
    }

    const copyToClipboard = (text: string) => {
        if (typeof navigator !== "undefined" && navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).catch((err) => {
            console.error("Clipboard write failed:", err);
            });
        } else {
            const textArea = document.createElement("textarea");
            textArea.value = text;

            textArea.style.position = "fixed";
            textArea.style.top = "0";
            textArea.style.left = "0";
            textArea.style.width = "1px";
            textArea.style.height = "1px";
            textArea.style.padding = "0";
            textArea.style.border = "none";
            textArea.style.outline = "none";
            textArea.style.boxShadow = "none";
            textArea.style.background = "transparent";

            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();

            try {
            document.execCommand("copy");
            } catch (err) {
            console.error("Fallback: copy failed", err);
            }

            document.body.removeChild(textArea);
        }
        console.log('Clicked')
        setClicked(true);
    };

    const init = async () => {
        try {
            const result = await getAsset(params.unitId as string);
            console.log('-->result', result);
            if(result?.data?.body?.assetData) {
                const item = result.data.body.assetData;
                const assetData: AssetDataDetailed  = {
                    Code: item.Code,
                    Title: item.Title,
                    Price: item.Price,
                    Currency: item.Currency,
                    CoverUrl: item.CoverUrl,
                    StatusCode: item.StatusCode,
                    IsActive: item.IsActive, // 1 ou 0
                    TypeCode: item.TypeCode,
                    IsVerified: item.IsVerified, // 1 ou 0
                    Permission: result.data.body.ConfigPermissionList.map((item:any) => (item.Code)),
                    whoIs: result.data.body.whoIs,
                    BillingItems: result.data.body.billingItems.map((item: any) => (item.ItemCode)),
                    Units: getUnits(item.assets),
                    ParentCode: item.ParentCode,
                    Address: {
                        Code: item.Address.Code,
                        City: item.Address.City,
                        Country: item.Address.Country,
                        Street: item.Address.Street,
                    },
                }

                const _managerList: IUser[] = item.managers.map((mng: any) => {
                    return {
                        id: mng.Code,
                        profileId: mng.manager.Code,
                        firstName: mng.manager.user.Firstname,
                        lastName: mng.manager.user.Lastname,
                        email: mng.manager.user.Email,
                        phone: mng.manager.user.Phone,
                        profile: mng.manager.userProfiles,
                        gender: mng.manager.user.Gender,
                        city: mng.manager.user.Address.City,
                        street: mng.manager.user.Address.Street,
                        country: mng.manager.user.Address.Country,
                        avatarUrl: mng.manager.user.AvatarUrl,
                        status: mng.StatusCode,
                        NIU: mng.manager.user.NIU,
                        createdAt: mng.CreatedAt,
                        permissions: Object.entries(mng.permission)
                            .filter(([key, value]) => value === 1)
                            .map(([key]) => result.data.body.ConfigPermissionList.find((perm: any) => perm.Code == key).Title ?? key)
                    }
                })

                console.log('-->managerList', _managerList);
                console.log('-->assetData', assetData);


                if(item.contracts && item.contracts.length > 0){
                    const _rawActiveContract = item.contracts.find((contract: any) => (contract.StatusCode == 'ACTIVE')) ?? item.contracts[0];
                    const _activeContract: IContractDetail = {
                        id: _rawActiveContract.Code,
                        billingElements: [],
                        endDate: _rawActiveContract.EndDate,
                        monthlyRent: _rawActiveContract.asset.Price,
                        currency: _rawActiveContract.Currency,
                        notes: "",
                        startDate: _rawActiveContract.StartDate,
                        status: _rawActiveContract.StatusCode,
                        tenant: {
                            name: _rawActiveContract.renter.user.Lastname + ' ' + _rawActiveContract.renter.user.Firstname,
                            email: _rawActiveContract.renter.user.Email,
                            phone: _rawActiveContract.renter.user.Phone,
                            userCode: _rawActiveContract.renter.user.Code,
                        }
                    };
                    const _invoiceformDefaultValue: IInvoiceForm = {
                        id: _activeContract.id,
                        tenant: _activeContract.tenant.name,
                        tableId: "",
                        startDate: _activeContract.startDate,
                        endDate: "",
                        monthlyRent: _activeContract.monthlyRent,
                        status: _activeContract.status,
                        notes: _activeContract.notes,
                        currency: _activeContract.currency,
                        billingElements: _activeContract.billingElements.map((item: any) => ({
                            id: "",
                            code: item.label,
                            label: item.label,
                            amount: 0,
                            paidDate: today,
                            status: false,
                        }))
                    };
                    const _contractTableData = item.contracts.map((contract: any) => ({
                        id: contract.Code,
                        tenant: contract.renter.user.Lastname + ' ' + contract.renter.user.Firstname,
                        startDate: contract.StartDate,
                        endDate: contract.EndDate,
                        status: contract.StatusCode,
                        monthlyRent: assetData.Price,
                    })) as IContractColumn[];


                    const getInvoiceParam: SeachInvoiceParams = {
                        orderBy: "Item.CreatedAt",
                        orderMode: "desc",
                        assetCodes: [assetData.Code]
                    };
                
                    const getInvoiceResult = await searchInvoice(getInvoiceParam);
                    if(getInvoiceResult.data){
                        const _invoiceTableData: IInvoiceForm[] = getInvoiceResult.data.body.items.map((inv: any, index: number) => {
                            return {
                                id: inv.Code,
                                tableId: "INV"+(index+1),
                                status: inv.StatusCode,
                                startDate: inv.StartDate.split("T")[0],
                                endDate: inv.EndDate.split("T")[0],
                                tenant: "",
                                monthlyRent: assetData.Price,
                                notes: inv.notes,
                                contractStatus: inv.contract.StatusCode,
                                currency: assetData.Currency,
                                billingElements: inv.items.map((item: any) => ({
                                    code: item.ItemCode,
                                    label: item.ItemCode,
                                    amount: item.Amount,
                                    paidDate: item.PaidDate ? item.PaidDate.split("T")[0] : "",
                                    status: item.IsPaid == 1 ? true : false,
                                }))
                            }
                        });
                        setInvoiceTableData(_invoiceTableData);

                        const recentInvoice = _invoiceTableData.length > 0 && _invoiceTableData[0];
                        
                        if(recentInvoice){
                            _invoiceformDefaultValue.startDate = recentInvoice.endDate;
                        }
                    } else if(getInvoiceResult.error){
                        if(getInvoiceResult.code == 'SESSION_EXPIRED'){
                            router.push('/signin');
                            return;
                        }
                        toast.error(getInvoiceResult.error ?? "An unexpected error occurred", { position: 'bottom-right' });
                    }

                    setActiveContract(_activeContract);
                    setInvoiceFormDefaultValue(_invoiceformDefaultValue);
                    setTempInvoiceFormDefaultValue(_invoiceformDefaultValue);
                    setContractTableData([..._contractTableData].reverse());
                }
                
                setManagerList(_managerList);
                setAsset(assetData)
            } else if(result.error){
                if(result.code == 'SESSION_EXPIRED'){
                    router.push('/signin');
                    return;
                }
                toast.error(result.error ?? "An unexpected error occurred", { position: 'bottom-right' });
            }
        } catch (error) {
            console.log(error)
        } finally {
            setIsReady(true);
        }
    }


    if (!loadingProfile && !isAuthorized(PROFILE_LANDLORD_LIST)) {
        return <div>Unauthorized</div>;
    }
    return (
        <DefaultLayout>
            <Breadcrumb previousPage pageName={`Unit ${asset?.Title ? "- " + capitalize(asset.Title) : ""}`} />
            
            <div className="w-full mt-7">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {
                        isReady ?
                            <div className="lg:col-span-2 space-y-6 h-fit">
                                {/* Property image */}
                                <div className="rounded-lg overflow-hidden h-100">
                                    {asset?.CoverUrl == "" || asset?.CoverUrl == null ?
                                        <div className="relative h-full w-full overflow-hidden">
                                            <ImageLoading />
                                        </div>
                                        :
                                        <Image
                                            src={asset.CoverUrl}
                                            alt={asset.Title}
                                            className={`h-full w-full object-cover transition-transform duration-500 group-hover:scale-110 ${
                                                isImageLoading ? 'opacity-0' : 'opacity-100'
                                            }`}
                                            width={1280}
                                            height={600}
                                            onLoad={() => setIsImageLoading(false)}
                                            priority
                                            onError={() => <ImageLoading />}
                                        />
                                    }
                                </div>

                                {/* Property detail */}
                                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-100">
                                                {asset?.Title} {
                                                    asset?.TypeCode !== "CPLXMOD" && `(${asset?.Price}/${asset?.Currency})`
                                                }
                                            </h2>
                                            <div className="flex items-center text-gray-800 dark:text-gray-100">
                                                <MapPin size={16} className="mr-1" />
                                                <span>{`${asset?.Address.City}, ${asset?.Address.Street}`}</span>
                                            </div>
                                        </div>
                                        <span>
                                            {getStatusBadge(asset?.StatusCode ?? 'DRAFT')}
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-4 gap-4 py-4 border-t border-gray-100 dark:border-gray-700">
                                        {asset?.BillingItems.map((item) => (
                                        <div
                                            key={item}
                                            className="px-4 py-2 bg-gray-50 dark:bg-gray-700 rounded-lg text-sm text-gray-800 dark:text-gray-100"
                                        >
                                            {item}
                                        </div>
                                        ))}
                                    </div>
                                </div>

                                {
                                    asset?.TypeCode != ASSET_TYPE_COMPLEXE && <>
                                        {/* INVOICE HISTORY */}
                                        {/* <SectionWrapper title="Invoice history" Icon={FileText}>
                                            {invoiceTableData.length > 0 ? (
                                                <ResponsiveTable
                                                    columns={invoiceColumns}
                                                    data={invoiceTableData.slice(0, 3)}
                                                    onRowClick={(inv) => handleSelectInvoice(inv.id)}
                                                    keyField="id"
                                                    showMore={asset && invoiceTableData.length > 3 ? {
                                                        url: `/landlord/properties/${asset?.ParentCode}/units/${asset?.Code}/invoices`,
                                                        label: 'Show more invoices'
                                                    } : undefined}
                                                />
                                                ) : (
                                                <p className="text-gray-500 dark:text-gray-400 text-sm p-3">No invoices available</p>
                                            )}
                                        </SectionWrapper> */}
                                        
                                        {/* CONTRACT */}
                                        <SectionWrapper title="Lease Contracts" Icon={FileText}>
                                            {contractTableData.length > 0 ? (
                                                <ResponsiveTable
                                                    columns={contractColumns}
                                                    data={contractTableData.slice(0, 3)}
                                                    onRowClick={(contract) => handleSelectedContract(contract.id)}
                                                    keyField="id"
                                                    showMore={asset && contractTableData.length > 3 ? {
                                                        url: `/landlord/properties/${asset?.ParentCode}/units/${asset?.Code}/contracts`,
                                                        label: 'Show more contracts'
                                                    } : undefined}
                                                />
                                                ) : (<p className="text-gray-500 dark:text-gray-400 text-sm p-3">No lease contracts available</p>)
                                            }
                                        </SectionWrapper>
                                    </>
                                }
                            </div>
                        :
                        <PropertySkeletonPageSection1 />
                    }
                        
                    {/* SIDE SECTION */}
                    <div className="space-y-6">
                        { isReady ? 
                            <div>
                                {/* ACTIONS */}
                                <div className="hidden lg:block">
                                    <SectionWrapper title="Quick Actions">
                                        {
                                            asset?.whoIs == "OWNER" && <>
                                                {asset?.IsVerified == 1 && <Button onClick={handleShareLink} variant='neutral' isSubmitBtn={false}>
                                                    <Share2 size={16} /> Invite Tenant
                                                </Button>}

                                                { asset?.StatusCode == "DRAFT" && <Button onClick={handleVerificationFormOpen} variant='neutral' disable={false} isSubmitBtn={false}>
                                                    <FileText size={16} /> Verify Property
                                                </Button>}

                                                {asset?.TypeCode === "CPLXMOD" && asset?.IsVerified == 1 && (
                                                    <Button onClick={() => setIsAttachPropertiesModalOpen(true)} variant='neutral' isSubmitBtn={false}>
                                                        <Building2 size={16} /> Attach Properties
                                                    </Button>
                                                )}
                                                <Button variant='neutral' disable={asset?.StatusCode == "PENDING"} isSubmitBtn={false} onClick={() => router.push(`/landlord/properties/edit?propertyId=${params.id}`)}>
                                                    <Building2 size={16} /> Edit Property
                                                </Button>
                                            </>
                                        }
                                        {
                                            canCreateContract() && <Button onClick={handleCreateContract} variant='neutral' disable={false} isSubmitBtn={false}>
                                                <FileText size={16} /> Create a contract
                                            </Button>
                                        }
                                        
                                        {
                                            // canCreateInvoice() &&
                                            // <Button onClick={() => {setShowInvoiceGenerator(true); setAction("CREATE")}} variant='neutral' disable={false} isSubmitBtn={false}>
                                            //     <DollarSign size={16} /> Create Invoice
                                            // </Button>
                                        }
                                        {
                                            asset?.whoIs == "OWNER" && activeContract?.status == "ACTIVE" && 
                                            (<div className="space-y-3">
                                                <Button onClick={handleClickTerminateLease} variant='danger' disable={false} isSubmitBtn={false} loading={isTerminatingContract}>
                                                    <DollarSign size={16} /> Terminate Lease
                                                </Button>
                                            </div>)
                                        }
                                        {showShareLink && (
                                            <div className={`mt-4 p-3 bg-gray-50 rounded-lg transform ${showShareLink ? "block" : "hidden"}`}>
                                                <p className="text-sm text-gray-600 mb-2">
                                                    Share this link with potential tenants:
                                                </p>
                                                <div className="flex gap-2">
                                                    <input
                                                        type="text"
                                                        value={`https://applink.rentalafrique.com/share/property/${asset?.Code}`}
                                                        readOnly
                                                        className="flex-1 text-sm p-2 border border-gray-200 rounded-lg bg-white"
                                                    />
                                                    <button 
                                                        onClick={() => copyToClipboard(`https://applink.rentalafrique.com/share/property/${asset?.Code}`)}
                                                        className={`px-3 py-2 rounded-lg text-sm transition-all duration-300 ease-out transform hover:scale-105 active:scale-95
                                                            ${
                                                                clicked 
                                                                ? "bg-green-500 text-white" 
                                                                : "bg-gray-200 hover:bg-gray-300"
                                                            }
                                                        `}
                                                        >
                                                        <span className="inline-flex items-center gap-1">
                                                            {clicked ? "Copied!" : "Copy"}
                                                        </span>
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </SectionWrapper>
                                </div>

                                {/* MANAGER INVITATION REQUESTS */}
                                {
                                    managerList.length > 0 && 
                                    <SectionWrapper title="Manager" Icon={UserCog}>
                                        {managerList.map((manager) => (
                                            <div
                                                key={manager.id}
                                                className="border border-gray-100 rounded-lg p-4"
                                            >
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <h4 className="font-medium dark:text-gray-300">{manager.lastName} {manager.firstName}</h4>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">{manager.email}</p>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">{manager.phone}</p>
                                                </div>
                                                <div className="flex flex-col items-end">
                                                    <span className="flex flex-col items-center">
                                                        {getStatusBadge(manager.status)}
                                                        {
                                                            manager.createdAt && <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                                {formatDateToText(manager.createdAt)}
                                                            </span>
                                                        }
                                                    </span>
                                                </div>
                                            </div>
                                            {
                                                (manager.permissions && manager.permissions.length > 0) && <div className="flex flex-wrap gap-4 py-4 border-t border-gray-100 dark:border-gray-700">
                                                    {
                                                        manager.permissions.map((item) => (
                                                        <span key={item} className="px-1.5 py-1.5 w-fit text-xs bg-gray-50 dark:bg-gray-700 rounded text-gray-800 dark:text-gray-100">
                                                            {item}
                                                        </span>))
                                                    }
                                                </div>
                                            }
                                            </div>
                                        ))}
                                    </SectionWrapper>
                                }
                            </div> : 
                            <PropertySkeletonPageSection2 />
                        }
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
                            {
                                asset?.whoIs == "OWNER" && <>
                                    {asset?.IsVerified == 1 && <Button onClick={handleShareLink} variant='neutral' isSubmitBtn={false}>
                                        <Share2 size={16} /> Invite Tenant
                                    </Button>}

                                    { asset?.StatusCode == "DRAFT" && <Button onClick={handleVerificationFormOpen} variant='neutral' disable={false} isSubmitBtn={false}>
                                        <FileText size={16} /> Verify Property
                                    </Button>}

                                    {asset?.TypeCode === "CPLXMOD" && asset?.IsVerified == 1 && (
                                        <Button onClick={() => setIsAttachPropertiesModalOpen(true)} variant='neutral' isSubmitBtn={false}>
                                            <Building2 size={16} /> Attach Properties
                                        </Button>
                                    )}
                                    <Button variant='neutral' disable={asset?.StatusCode == "PENDING"} isSubmitBtn={false} onClick={() => router.push(`/landlord/properties/edit?propertyId=${params.id}`)}>
                                        <Building2 size={16} /> Edit Property
                                    </Button>
                                </>
                            }
                            {
                                canCreateContract() && <Button onClick={handleCreateContract} variant='neutral' disable={false} isSubmitBtn={false}>
                                    <FileText size={16} /> Create a contract
                                </Button>
                            }
                            
                            {
                                // canCreateInvoice() &&
                                // <Button onClick={() => {setShowInvoiceGenerator(true); setAction("CREATE")}} variant='neutral' disable={false} isSubmitBtn={false}>
                                //     <DollarSign size={16} /> Create Invoice
                                // </Button>
                            }
                            {
                                asset?.whoIs == "OWNER" && activeContract?.status == "ACTIVE" && 
                                (<div className="space-y-3">
                                    <Button onClick={handleClickTerminateLease} variant='danger' disable={false} isSubmitBtn={false} loading={isTerminatingContract}>
                                        <DollarSign size={16} /> Terminate Lease
                                    </Button>
                                </div>)
                            }
                            {showShareLink && (
                                <div className={`mt-4 p-3 bg-gray-50 rounded-lg transform ${showShareLink ? "block" : "hidden"}`}>
                                    <p className="text-sm text-gray-600 mb-2">
                                        Share this link with potential tenants:
                                    </p>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={`https://applink.rentalafrique.com/share/property/${asset?.Code}`}
                                            readOnly
                                            className="flex-1 text-sm p-2 border border-gray-200 rounded-lg bg-white"
                                        />
                                        <button 
                                            onClick={() => copyToClipboard(`https://applink.rentalafrique.com/share/property/${asset?.Code}`)}
                                            className={`px-3 py-2 rounded-lg text-sm transition-all duration-300 ease-out transform hover:scale-105 active:scale-95
                                                ${
                                                    clicked 
                                                    ? "bg-green-500 text-white" 
                                                    : "bg-gray-200 hover:bg-gray-300"
                                                }
                                            `}
                                            >
                                            <span className="inline-flex items-center gap-1">
                                                {clicked ? "Copied!" : "Copy"}
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* FAB pour mobile */}
                {!showMobileActions && (
                    <button onClick={() => setShowMobileActions(true)} aria-label="Show quick actions" className={`fixed bottom-9 right-6 z-50 bg-[#2A4365] text-white p-2 rounded-full shadow-lg hover:bg-blue-700 active:scale-95 duration-300 ease-linear lg:hidden`}  >
                        <Zap size={24} />
                    </button>
                )}



                {/* Modal Actions */}
                <Overlay isOpen={showInvoiceGenerator} onClose={() => setShowInvoiceGenerator(false)}>
                    <InvoiceGenerator
                        onClose={() => setShowInvoiceGenerator(false)}
                        onCreate={(data: IInvoiceForm) => {handleCreateInvoice(data)}}
                        defaultValue={invoiceFormDefaultValue}
                        action={action}
                    />
                </Overlay>
                <Overlay isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                    <VerificationForm
                        propertyId={asset?.Code ?? ""}
                        propertyTitle={asset?.Title ?? ""}
                        onClose={() => setIsModalOpen(false)}
                        onSubmit={handleVerificationSubmit}
                    />
                </Overlay>
                <Overlay isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)}>
                    <DeletePropertyModal
                        onClose={() => setIsDeleteModalOpen(false)}
                        onConfirm={handleDeleteProperty}
                        propertyAddress={asset?.Title ?? ""}
                    />
                </Overlay>
                <Overlay isOpen={isAttachPropertiesModalOpen} onClose={() => setIsAttachPropertiesModalOpen(false)}>
                    <AttachPropertiesModal
                        onClose={() => setIsAttachPropertiesModalOpen(false)}
                        onAttach={handleAttachProperties}
                        availableProperties={[]}
                    />
                </Overlay>
                <Overlay isOpen={isContractFormOpen} onClose={() => setContractFormOpen(false)}>
                    <TenantContractForm
                        onClose={() => setContractFormOpen(false)}
                        onSubmit={handleContractSubmit}
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
                        message={`Are you sure you want to terminate lease #${activeContract?.id} ?`}
                    />
                </Overlay>
            </div>
        </DefaultLayout>
    );
};

export default PropertyDetail;


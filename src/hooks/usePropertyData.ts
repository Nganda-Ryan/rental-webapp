// hooks/usePropertyData.ts
import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from 'next/navigation';
import { getAsset, createContract, createInvoice, terminateLease, inviteManager, searchInvoice } from "@/actions/assetAction";
import { IInvoiceForm, AssetDataDetailed, IContractDetail, IPropertyVerificationDoc, IPropertyVerification, SeachInvoiceParams } from "@/types/Property";
import toast from 'react-hot-toast';
import { AssetData, IInvoiceTableData } from "@/types/Property";
import { ASSET_TYPE_COMPLEXE } from "@/constant";
import { requestPropertyVerification } from "@/actions/requestAction";
import { IInviteManagerRequest, IUser } from "@/types/user";

const mapPermissionsToObject = (permissions: string[]) => {
    return permissions.reduce((obj, perm) => {
        obj[perm] = 1;
        return obj;
    }, {} as Record<string, number>);
};

const getUnits = (items: any[]): AssetData[] => {
    return items.map((item: any, index: number) => ({
        Code: item.Code,
        Id: `UNIT-${index + 1}`,
        Title: item.Title,
        Price: item.Price,
        Currency: item.Currency,
        CoverUrl: item.CoverUrl,
        StatusCode: item.StatusCode,
        IsActive: item.IsActive,
        TypeCode: item.TypeCode,
        IsVerified: item.IsVerified,
        Address: {
            Code: item.Address.Code,
            City: item.Address.City,
            Country: item.Address.Country,
            Street: item.Address.Street,
        },
    }));
};

export const usePropertyData = () => {
    const params = useParams();
    const router = useRouter();
    const [asset, setAsset] = useState<AssetDataDetailed | null>(null);
    const [contractTableData, setContractTableData] = useState<IContractDetail[]>([]);
    const [invoiceTableData, setInvoiceTableData] = useState<IInvoiceForm[]>([]);
    const [managerList, setManagerList] = useState<IUser[]>([]);
    const [activeContract, setActiveContract] = useState<IContractDetail | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [processingMessage, setProcessingMessage] = useState("Processing...");

    const fetchPropertyData = useCallback(async () => {
        try {
            setIsLoading(true);
            const result = await getAsset(params.id as string);
            if (result?.data?.body?.assetData) {
                const item = result.data.body.assetData;
                const assetData: AssetDataDetailed = {
                    Code: item.Code,
                    Title: item.Title,
                    Price: item.Price,
                    Currency: item.Currency,
                    CoverUrl: item.CoverUrl,
                    StatusCode: item.StatusCode,
                    IsActive: item.IsActive,
                    TypeCode: item.TypeCode,
                    Notes: item.Notes,
                    Tag: item.Tag,
                    IsVerified: item.IsVerified,
                    Permission: result.data.body.ConfigPermissionList.map((perm: any) => perm.Code),
                    whoIs: result.data.body.whoIs,
                    BillingItems: result.data.body.billingItems.map((item: any) => item.ItemCode),
                    Units: getUnits(item.assets),
                    Address: {
                        Code: item.Address.Code,
                        City: item.Address.City,
                        Country: item.Address.Country,
                        Street: item.Address.Street,
                    },
                };
                setAsset(assetData);

                if (item.contracts && item.contracts.length > 0) {
                    const _rawActiveContract = item.contracts.find((contract: any) => contract.StatusCode === 'ACTIVE') ?? item.contracts[0];
                    const _activeContract: IContractDetail = {
                        id: _rawActiveContract.Code,
                        billingElements: [],
                        endDate: _rawActiveContract.EndDate,
                        monthlyRent: _rawActiveContract.asset.Price,
                        currency: _rawActiveContract.Currency,
                        notes: "",
                        tenantName: `${_rawActiveContract.renter.user.Lastname} ${_rawActiveContract.renter.user.Firstname}`,
                        startDate: _rawActiveContract.StartDate,
                        status: _rawActiveContract.StatusCode,
                        tenant: {
                            firstName: _rawActiveContract.renter.user.Firstname,
                            lastName: _rawActiveContract.renter.user.Lastname,
                            email: _rawActiveContract.renter.user.Email,
                            phone: _rawActiveContract.renter.user.Phone,
                            userCode: _rawActiveContract.renter.user.Code,
                        },
                    };
                    setActiveContract(_activeContract);
                    const _contractTableData = item.contracts.map((contract: any) => ({
                        id: contract.Code,
                        billingElements: [],
                        tenantName: `${contract.renter.user.Lastname} ${contract.renter.user.Firstname}`,
                        endDate: contract.EndDate,
                        monthlyRent: contract.asset.Price,
                        currency: contract.Currency,
                        notes: "",
                        startDate: contract.StartDate,
                        status: contract.StatusCode,
                        tenant: {
                            firstName: contract.renter.user.Firstname,
                            lastName: contract.renter.user.Lastname,
                            email: contract.renter.user.Email,
                            phone: contract.renter.user.Phone,
                            userCode: contract.renter.user.Code,
                        },
                    }));
                    setContractTableData([..._contractTableData].reverse());
                }

                const _managerList: IUser[] = item.managers.map((mng: any) => ({
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
                        .map(([key]) => result.data.body.ConfigPermissionList.find((perm: any) => perm.Code === key)?.Title ?? key),
                }));
                setManagerList(_managerList);
                
                if (activeContract) {
                    const searchParams : SeachInvoiceParams = {
                                            orderBy: "Item.CreatedAt",
                                            orderMode: "desc",
                                            assetCodes: [assetData.Code]
                                        };
                    const invoiceResult = await searchInvoice(searchParams);
                    if (invoiceResult.data?.body) {
                        setInvoiceTableData(invoiceResult.data.body);
                    }
                }
            } else if (result.error) {
                if (result.code === 'SESSION_EXPIRED') {
                    router.push('/signin');
                    return;
                }
                setError(result.error);
                toast.error(result.error ?? "An unexpected error occurred", { position: 'bottom-right' });
            }
        } catch (err) {
            console.error('Failed to fetch property data:', err);
            setError("Failed to load property data.");
            toast.error("Failed to load property data. Try again or contact the administrator.", { position: 'bottom-right' });
        } finally {
            setIsLoading(false);
        }
    }, [params.id, router, activeContract]);

    useEffect(() => {
        if (params.id) {
            fetchPropertyData();
        }
    }, [params.id, fetchPropertyData]);

    const handleCreateContract = useCallback(async (contractData: any) => {
        if (!asset) return;
        setIsProcessing(true);
        setProcessingMessage("Creating contract...");
        try {
            const result = await createContract({ ...contractData, assetCode: asset.Code });
            if (result.contract) {
                toast.success("Contract created successfully", { position: 'bottom-right' });
                await fetchPropertyData();
            } else if (result.error) {
                toast.error(result.error ?? "An unexpected error occurred", { position: 'bottom-right' });
            }
        } catch (error) {
            toast.error("Something went wrong during the process.", { position: 'bottom-right' });
        } finally {
            setIsProcessing(false);
        }
    }, [asset, fetchPropertyData]);

    const handleCreateInvoice = useCallback(async (invoiceData: IInvoiceForm) => {
        if (!activeContract) return;
        setIsProcessing(true);
        setProcessingMessage("Creating invoice...");
        try {
            const result = await createInvoice({
                contractCode: activeContract.id,
                endDate: invoiceData.endDate,
                startDate: invoiceData.startDate,
                notes: invoiceData.notes,
                profilCode: "",
                userId: activeContract.tenant.userCode,
                items: invoiceData.billingElements.map(item => ({
                    amount: String(item.amount),
                    isPaid: item.status,
                    itemCode: item.label,
                    notes: "",
                    paidDate: item.paidDate,
                })),
            });
            if (result.data) {
                toast.success("Invoice created successfully", { position: 'bottom-right' });
                await fetchPropertyData();
            } else if (result.error) {
                toast.error(result.error ?? "An unexpected error occurred", { position: 'bottom-right' });
            }
        } catch (error) {
            toast.error("Something went wrong during the process.", { position: 'bottom-right' });
        } finally {
            setIsProcessing(false);
        }
    }, [activeContract, fetchPropertyData]);

    const handleTerminateLease = useCallback(async () => {
        if (!activeContract) return;
        setIsProcessing(true);
        setProcessingMessage("Terminating lease...");
        try {
            const result = await terminateLease(activeContract.id);
            if (result.error) {
                toast.error(result.error ?? "An unexpected error occurred", { position: 'bottom-right' });
            } else {
                toast.success("Lease terminated", { position: 'bottom-right' });
                await fetchPropertyData();
            }
        } catch (error) {
            toast.error("Something went wrong during the process.", { position: 'bottom-right' });
        } finally {
            setIsProcessing(false);
        }
    }, [activeContract, fetchPropertyData]);

    const handleInviteManager = useCallback(async (manager: { userInfo: IUser, permissions: string[] }) => {
        if (!asset) return;
        setIsProcessing(true);
        setProcessingMessage("Inviting manager...");
        try {
            const payload: IInviteManagerRequest = {
                assetCode: asset.Code,
                managerCode: manager.userInfo.id,
                profilCode: "", // Add profile code logic here
                notes: "",
                title: asset.Title,
                body: mapPermissionsToObject(manager.permissions),
            };
            const result = await inviteManager(payload);
            if (result.data) {
                toast.success("Manager invited successfully", { position: 'bottom-right' });
                await fetchPropertyData();
            } else if (result.error) {
                toast.error(result.error ?? "An unexpected error occurred", { position: 'bottom-right' });
            }
        } catch (error) {
            toast.error("An error occurred while inviting the manager.", { position: 'bottom-right' });
        } finally {
            setIsProcessing(false);
        }
    }, [asset, fetchPropertyData]);

    const handleVerificationSubmit = useCallback(async (body: IPropertyVerificationDoc[], note: string, user: any) => {
        if (!asset || !user) return;
        setIsProcessing(true);
        setProcessingMessage("Sending verification request...");
        try {
            const payload: IPropertyVerification = {
                assetCode: asset.Code,
                body: body,
                notes: note,
                title: `Verification of ${asset.Title}`,
                userId: user.Code,
            };
            const result = await requestPropertyVerification(payload);
            if (result.data) {
                toast.success("Verification request sent successfully", { position: 'bottom-right' });
                await fetchPropertyData();
            } else if (result.error) {
                toast.error(result.error ?? "An unexpected error occurred", { position: 'bottom-right' });
            }
        } catch (error) {
            toast.error("Something went wrong during the process.", { position: 'bottom-right' });
        } finally {
            setIsProcessing(false);
        }
    }, [asset, fetchPropertyData]);

    const mapPermissionsToObject = (permissions: string[]): Record<string, boolean> => {
        return permissions.reduce((acc, permission) => {
            acc[permission] = true;
            return acc;
        }, {} as Record<string, boolean>);
    }
    const canCreateContract = asset?.IsVerified === 1 && !contractTableData.some(c => c.status === 'ACTIVE') && asset.TypeCode !== ASSET_TYPE_COMPLEXE;
    const canAttachManager = asset?.whoIs === 'OWNER' && asset.IsVerified === 1;

    return {
        asset,
        contractTableData,
        invoiceTableData,
        managerList,
        activeContract,
        isLoading,
        error,
        isProcessing,
        processingMessage,
        canCreateContract,
        canAttachManager,
        fetchPropertyData,
        handleCreateContract,
        handleCreateInvoice,
        handleTerminateLease,
        handleInviteManager,
        handleVerificationSubmit,
    };
};
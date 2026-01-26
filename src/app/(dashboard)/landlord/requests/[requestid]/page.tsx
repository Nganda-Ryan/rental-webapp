"use client"
import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb'
import DefaultLayout from '@/components/Layouts/DefaultLayout'
import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation';
import { useRouter } from '@bprogress/next/app';
import Image from 'next/image';
import { geRequestDetail, getInvoiceList, approveApplicationRequest } from '@/actions/requestAction';
import { getScore } from '@/actions/userAction';
import {
  MapPin,
  Home,
  Mail,
  Phone,
  Briefcase,
  DollarSign,
  TrendingUp,
  CheckCircle,
  XCircle,
  Clock,
  Zap,
  FileText,
  Download,
  CheckCircle2,
  X,
} from 'lucide-react'
import { IGetRentalRequestDetail, IGetRentalScore, IApproveApplicationRequest } from '@/types/rentalRequest';
import SectionWrapper from '@/components/Cards/SectionWrapper';
import { QuickAction, QuickActionItem, MobileActionsDrawer, MobileActionFAB } from '@/components/ui/QuickAction';
import toast from 'react-hot-toast';
import { useTranslations } from 'next-intl';
import Overlay from '@/components/Overlay';
import { ActionConfirmationModal } from '@/components/Modal/ActionConfirmationModal';
import { IGetInvoiceList, IPaymentHistory } from '@/types/Property';
import { assetDashboard } from '@/actions/assetAction';
import Nodata from '@/components/error/Nodata';

interface RequestDataItem {
    Code: string;
    isSelected?: number;
    isSelect?: number; // Support both isSelected and isSelect properties
}

const Page = () => {
    const t = useTranslations('Common');
    const tRequests = useTranslations('Landlord.requests');
    const router = useRouter();
    const [requestDetails, setRequestDetails] = useState<IGetRentalRequestDetail | undefined>(undefined);
    const [rentalScore, setRentalScore] = useState<IGetRentalScore | undefined>(undefined);
    const [paymentHistory, setPaymentHistory] = useState<IPaymentHistory[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingScore, setIsLoadingScore] = useState(false);
    const [isLoadingHistory, setIsLoadingHistory] = useState(false);
    const [hasFetchedRentalScore, setHasFetchedRentalScore] = useState(false);
    const [hasFetchedPaymentHistory, setHasFetchedPaymentHistory] = useState(false);
    const [isApproving, setIsApproving] = useState(false);
    const [isDeclining, setIsDeclining] = useState(false);
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const [confirmationActionType, setConfirmationActionType] = useState<'APPROVED' | 'DECLINED' | null>(null);
    const [showMobileActions, setShowMobileActions] = useState(false);
    const params = useParams();

    // Parse RequestData to determine which actions to show
    const parseRequestData = (requestDataString: string | null | undefined): RequestDataItem[] => {
        if (!requestDataString) return [];
        try {
            return JSON.parse(requestDataString);
        } catch (error) {
            console.error('Error parsing RequestData:', error);
            return [];
        }
    };

    const requestDataItems = requestDetails?.reqData?.RequestData 
        ? parseRequestData(requestDetails.reqData.RequestData) 
        : [];

    const canShowRentalScore = requestDataItems.some(item => item.Code === 'RENTALSCORE' && (item.isSelected === 1 || item.isSelect === 1));
    const canShowPaymentHistory = requestDataItems.some(item => item.Code === 'HISTORY' && (item.isSelected === 1 || item.isSelect === 1));
    
    // Hide approve/decline actions if request is already approved or declined
    const requestStatus = requestDetails?.reqData?.StatusCode;
    const canShowApproveDeclineActions = requestStatus !== 'APPROVED' && requestStatus !== 'DECLINED';

    useEffect(() => {
        const init = async () => {
            setIsLoading(true);
            try {
                const result = await geRequestDetail(params.requestid as string);
                if(result.data?.body){
                    setRequestDetails(result.data.body);
                }
                console.log('-->result', result)
            } catch (error) {
                console.error('Error loading request details:', error);
            } finally {
                setIsLoading(false);
            }
        }
        init();
    }, [params.requestid])

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

    // Action handlers
    const handleGetRentalScore = async () => {
        if (!requestDetails?.reqData?.creator?.UserCode) {
            toast.error(tRequests('userInfoNotAvailable'), { position: 'bottom-right' });
            return;
        }
        try {
            setIsLoadingScore(true);
            const result = await getScore(requestDetails.reqData.creator.UserCode, params.requestid as string);
            setHasFetchedRentalScore(true); // Set flag after fetch attempt
            if (result.data?.body) {
                setRentalScore(result.data.body);
                toast.success(tRequests('rentalScoreLoaded'), { position: 'bottom-right' });
            } else if (result.error) {
                setRentalScore(undefined); // Clear score if error
                toast.error(result.error ?? tRequests('failedToLoadRentalScore'), { position: 'bottom-right' });
            } else {
                setRentalScore(undefined); // Clear score if no data
            }
        } catch (error) {
            toast.error(tRequests('errorLoadingRentalScore'), { position: 'bottom-right' });
            setHasFetchedRentalScore(true); // Set flag even on error
            setRentalScore(undefined); // Clear score on error
        } finally {
            setIsLoadingScore(false);
        }
    };

    const handleGetPaymentHistory = async () => {
        if (!requestDetails?.reqData?.creator?.UserCode) {
            toast.error(tRequests('userInfoNotAvailable'), { position: 'bottom-right' });
            return;
        }
        try {
            setIsLoadingHistory(true);
            const payload: IGetInvoiceList = {
                orderBy: "CreatedAt",
                orderMode: "desc",
                profileCode: requestDetails.reqData.CreatorCode ?? "",
            };
            const result = await getInvoiceList(payload);
            setHasFetchedPaymentHistory(true);
            if (result.data?.body?.items) {
                setPaymentHistory(result.data.body.items as IPaymentHistory[]);
                toast.success(tRequests('paymentHistoryLoaded') ?? 'Payment history loaded successfully', { position: 'bottom-right' });
            } else if (result.error) {
                if (result.code === 'SESSION_EXPIRED') {
                    // Session expired handling would be done by middleware
                    return;
                }
                setPaymentHistory([]);
                toast.error(result.error ?? (tRequests('failedToLoadPaymentHistory') || 'Failed to load payment history'), { position: 'bottom-right' });
            } else {
                setPaymentHistory([]);
            }
        } catch (error) {
            console.error('Error loading payment history:', error);
            setHasFetchedPaymentHistory(true);
            setPaymentHistory([]);
            toast.error(tRequests('errorLoadingPaymentHistory') ?? 'An error occurred while loading payment history', { position: 'bottom-right' });
        } finally {
            setIsLoadingHistory(false);
        }
    };

    const handleApproveApplication = () => {
        setConfirmationActionType('APPROVED');
        setShowConfirmationModal(true);
    };

    const handleDeclineApplication = () => {
        setConfirmationActionType('DECLINED');
        setShowConfirmationModal(true);
    };

    const handleConfirmAction = async (notes: string) => {
        if (!requestDetails?.reqData?.Code || !confirmationActionType) {
            toast.error(tRequests('userInfoNotAvailable'), { position: 'bottom-right' });
            return;
        }
        
        const isApprovingAction = confirmationActionType === 'APPROVED';
        
        try {
            if (isApprovingAction) {
                setIsApproving(true);
            } else {
                setIsDeclining(true);
            }
            
            const payload: IApproveApplicationRequest = {
                code: requestDetails.reqData.Code,
                status: confirmationActionType,
                body: {
                    notes: notes || ''
                }
            };
            
            const result = await approveApplicationRequest(payload);
            
            if (result.data) {
                toast.success(t('requestSubmittedSuccessfully') || `Application ${isApprovingAction ? 'approved' : 'declined'} successfully`, { position: 'bottom-right' });
                setShowConfirmationModal(false);
                setConfirmationActionType(null);
                // Refresh the page data
                const refreshResult = await geRequestDetail(params.requestid as string);
                if (refreshResult.data?.body) {
                    setRequestDetails(refreshResult.data.body);
                }
            } else if (result.error) {
                if (result.code === 'SESSION_EXPIRED') {
                    router.push('/signin');
                    return;
                }
                toast.error(result.error, { position: 'bottom-right' });
            }
        } catch (error) {
            console.error(`Error ${isApprovingAction ? 'approving' : 'declining'} application:`, error);
            toast.error(t('unexpectedError') || 'An error occurred', { position: 'bottom-right' });
        } finally {
            if (isApprovingAction) {
                setIsApproving(false);
            } else {
                setIsDeclining(false);
            }
        }
    };

    const handleCloseConfirmationModal = () => {
        if (!isApproving && !isDeclining) {
            setShowConfirmationModal(false);
            setConfirmationActionType(null);
        }
    };

    const handleDownloadContent = (contentUrl: string, title: string) => {
        const link = document.createElement('a');
        link.href = contentUrl;
        link.download = title || 'document';
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success('Download started', { position: 'bottom-right' });
    };

    const getRatingColor = (scoreLevel: string) => {
        const level = scoreLevel?.toLowerCase() || '';
        switch (level) {
        case 'excellent':
        case 'high':
            return 'text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
        case 'good':
        case 'medium':
            return 'text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
        case 'fair':
        case 'low':
            return 'text-yellow-700 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'
        default:
            return 'text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700'
        }
    }
    const getScoreColor = (score: number) => {
        if (score >= 750) return 'text-green-600 dark:text-green-400'
        if (score >= 650) return 'text-blue-600 dark:text-blue-400'
        return 'text-yellow-600 dark:text-yellow-400'
    }
    const PaymentStatusBadge = ({ status }: { status: string }) => {
        if (status === 'paid') {
        return (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
            <CheckCircle size={14} />
            Paid
            </span>
        )
        }
        if (status === 'late') {
        return (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
            <Clock size={14} />
            Late
            </span>
        )
        }
        return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
            <XCircle size={14} />
            Missed
        </span>
        )
    }

    // Build QuickAction items
    const quickActions: QuickActionItem[] = [
        {
            id: 'get-rental-score',
            label: tRequests('getRentalScore'),
            icon: TrendingUp,
            onClick: handleGetRentalScore,
            variant: 'neutral',
            show: canShowRentalScore,
            loading: isLoadingScore,
        },
        {
            id: 'get-payment-history',
            label: tRequests('getPaymentHistory'),
            icon: DollarSign,
            onClick: handleGetPaymentHistory,
            variant: 'neutral',
            show: canShowPaymentHistory,
            loading: isLoadingHistory,
        },
        {
            id: 'approve-application',
            label: tRequests('approveApplication'),
            icon: CheckCircle2,
            onClick: handleApproveApplication,
            variant: 'success',
            show: canShowApproveDeclineActions,
            loading: isApproving,
        },
        {
            id: 'decline-application',
            label: tRequests('declineApplication'),
            icon: X,
            onClick: handleDeclineApplication,
            variant: 'danger',
            show: canShowApproveDeclineActions,
            loading: isDeclining,
        },
    ];

    // Loading skeleton component
    const RequestDetailSkeleton = () => (
        <div className="lg:col-span-2 space-y-4 animate-pulse">
            {/* Property Image Skeleton */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                <div className="h-6 w-40 bg-gray-200 dark:bg-gray-700 rounded mb-4" />
                <div className="relative w-full h-64 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700" />
            </div>

            {/* Property and Tenant Info Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 space-y-4">
                    <div className="h-6 w-40 bg-gray-200 dark:bg-gray-700 rounded" />
                    <div className="space-y-3">
                        <div>
                            <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
                            <div className="h-5 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
                        </div>
                        <div>
                            <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
                            <div className="h-5 w-48 bg-gray-200 dark:bg-gray-700 rounded" />
                        </div>
                        <div className="grid grid-cols-2 gap-4 pt-2">
                            <div>
                                <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
                                <div className="h-5 w-20 bg-gray-200 dark:bg-gray-700 rounded" />
                            </div>
                            <div>
                                <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
                                <div className="h-5 w-28 bg-gray-200 dark:bg-gray-700 rounded" />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 space-y-4">
                    <div className="h-6 w-40 bg-gray-200 dark:bg-gray-700 rounded" />
                    <div className="space-y-3">
                        <div>
                            <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
                            <div className="h-5 w-36 bg-gray-200 dark:bg-gray-700 rounded" />
                        </div>
                        <div>
                            <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
                            <div className="h-5 w-40 bg-gray-200 dark:bg-gray-700 rounded" />
                        </div>
                        <div>
                            <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
                            <div className="h-5 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    if (isLoading) {
        return (
            <DefaultLayout>
                <Breadcrumb previousPage pageName={tRequests('applicationDetail')} />
                <div className="w-full mt-7">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                        <RequestDetailSkeleton />
                        <div className="space-y-6">
                            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm space-y-3 animate-pulse">
                                <div className="h-5 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
                                {Array.from({ length: 4 }).map((_, i) => (
                                    <div key={i} className="h-10 bg-gray-200 dark:bg-gray-700 rounded" />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </DefaultLayout>
        );
    }

    return (
        <DefaultLayout>
            <Breadcrumb previousPage pageName={tRequests('applicationDetail')} />
            
            <div className="w-full mt-7">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-4">
                        {/* Property Image */}
                        {requestDetails?.asset?.CoverUrl && (
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                                <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
                                    {t('propertyImage')}
                                </h2>
                                <div className="relative w-full h-64 rounded-lg overflow-hidden">
                                    <Image
                                        src={requestDetails.asset.CoverUrl}
                                        alt={requestDetails.asset.Title || t('property')}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Property Information */}
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <Home size={20} className="text-gray-600 dark:text-gray-400" />
                                    <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                        {t('propertyInformation')}
                                    </h2>
                                </div>
                                <div className="space-y-3">
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">{t('propertyName')}</p>
                                        <p className="font-medium text-gray-900 dark:text-gray-100">{requestDetails?.asset.Title}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">{t('address')}</p>
                                        <div className="flex items-start gap-2">
                                            <MapPin
                                                size={16}
                                                className="text-gray-400 dark:text-gray-500 mt-1 flex-shrink-0"
                                            />
                                            <p className="text-gray-900 dark:text-gray-100">{requestDetails?.asset.Address.City}, {requestDetails?.asset.Address.Street}</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 pt-2">
                                        <div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">{t('type')}</p>
                                            <p className="font-medium text-gray-900 dark:text-gray-100">
                                                {requestDetails?.asset.aType.Type}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">{t('monthlyRent')}</p>
                                            <p className="font-medium text-gray-900 dark:text-gray-100">
                                                {requestDetails?.asset.Price} {requestDetails?.asset.Currency}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
            
                            {/* Tenant Information */}
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <Briefcase size={20} className="text-gray-600 dark:text-gray-400" />
                                    <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                        {t('tenantInformation')}
                                    </h2>
                                </div>
                                <div className="space-y-3">
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">{tRequests('fullName')}</p>
                                        <p className="font-medium text-gray-900 dark:text-gray-100">{requestDetails?.reqData.creator.user.Firstname} {requestDetails?.reqData.creator.user.Lastname}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">{t('email')}</p>
                                        <div className="flex items-center gap-2">
                                            <Mail size={16} className="text-gray-400 dark:text-gray-500" />
                                            <p className="text-gray-900 dark:text-gray-100">{requestDetails?.reqData.creator.user.Email}</p>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">{t('phone')}</p>
                                        <div className="flex items-center gap-2">
                                            <Phone size={16} className="text-gray-400 dark:text-gray-500" />
                                            <p className="text-gray-900 dark:text-gray-100">{requestDetails?.reqData.creator.user.Phone}</p>
                                        </div>
                                    </div>  
                                </div>
                            </div>
                        </div>
        
                        {/* Rental Score - Show if data is loaded or if fetch was attempted */}
                        {canShowRentalScore && hasFetchedRentalScore && (
                            <>
                                {isLoadingScore ? (
                                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 animate-pulse">
                                        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-6"></div>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                                            <div className="md:col-span-2 h-48 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                                        </div>
                                    </div>
                                ) : rentalScore ? (
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 animate-in fade-in duration-500 transition-all">
                                <div className="flex items-center gap-2 mb-6">
                                    <TrendingUp size={20} className="text-gray-600 dark:text-gray-400" />
                                    <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                        {tRequests('rentalScore')}
                                    </h2>
                                </div>
                                
                                {/* Main Score Display */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                                    <div className="text-center p-6 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                                            {tRequests('creditScore')}
                                        </p>
                                        <p className={`text-5xl font-bold ${getScoreColor(rentalScore.score || 0)}`}>
                                            {rentalScore.score || 'N/A'}
                                        </p>
                                        {rentalScore.scoreLevel && (
                                            <span className={`inline-block mt-3 px-4 py-1.5 rounded-full text-sm font-medium border ${getRatingColor(rentalScore.scoreLevel)}`}>
                                                {rentalScore.scoreLevel}
                                            </span>
                                        )}
                                        <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
                                            {tRequests('scoreRange')}: {rentalScore.minScore} - {rentalScore.maxScore}
                                        </div>
                                    </div>
                                    
                                    <div className="md:col-span-2 p-6 bg-gray-50 dark:bg-gray-700/50 rounded-lg space-y-4">
                                        <div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                                                {tRequests('scoreText')}
                                            </p>
                                            <p className="text-base text-gray-900 dark:text-gray-100">
                                                {rentalScore.scoreText || tRequests('noScoreText')}
                                            </p>
                                        </div>
                                        
                                        {rentalScore.checkCredit && (
                                            <div className="pt-4 border-t border-gray-200 dark:border-gray-600">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                        {tRequests('creditCheck')}
                                                    </span>
                                                    <span className={`text-sm font-semibold ${rentalScore.checkCredit.isEnough ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                                        {rentalScore.checkCredit.credit}
                                                    </span>
                                                </div>
                                                <div className="mt-2">
                                                    <span className={`text-xs px-2 py-1 rounded ${rentalScore.checkCredit.isEnough ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300' : 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300'}`}>
                                                        {rentalScore.checkCredit.isEnough ? tRequests('creditSufficient') : tRequests('creditInsufficient')}
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Score Breakdown */}
                                {rentalScore.calculate?.breakdown && (
                                    <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                                        <h3 className="text-md font-semibold text-gray-900 dark:text-gray-100 mb-4">
                                            {tRequests('scoreBreakdown')}
                                        </h3>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            {/* Payment History */}
                                            {rentalScore.calculate.breakdown.paymentHistory && (
                                                <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                            {tRequests('paymentHistory')}
                                                        </span>
                                                        <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
                                                            {rentalScore.calculate.breakdown.paymentHistory.points}
                                                        </span>
                                                    </div>
                                                    {rentalScore.calculate.breakdown.paymentHistory.details && (
                                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                                                            {rentalScore.calculate.breakdown.paymentHistory.details}
                                                        </p>
                                                    )}
                                                    {rentalScore.calculate.breakdown.paymentHistory.pointsDetails && (
                                                        <div className="mt-3 space-y-1 text-xs">
                                                            <div className="flex justify-between text-gray-600 dark:text-gray-400">
                                                                <span>{tRequests('rentPoints')}:</span>
                                                                <span className="font-medium">{rentalScore.calculate.breakdown.paymentHistory.pointsDetails.rentPoints}</span>
                                                            </div>
                                                            <div className="flex justify-between text-gray-600 dark:text-gray-400">
                                                                <span>{tRequests('utilityPoints')}:</span>
                                                                <span className="font-medium">{rentalScore.calculate.breakdown.paymentHistory.pointsDetails.utilityPoints}</span>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            {/* Length of History */}
                                            {rentalScore.calculate.breakdown.lengthOfHistory && (
                                                <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                            {tRequests('historyLength')}
                                                        </span>
                                                        <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
                                                            {rentalScore.calculate.breakdown.lengthOfHistory.points}
                                                        </span>
                                                    </div>
                                                    {rentalScore.calculate.breakdown.lengthOfHistory.details && (
                                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                                                            {rentalScore.calculate.breakdown.lengthOfHistory.details}
                                                        </p>
                                                    )}
                                                </div>
                                            )}

                                            {/* Rental History */}
                                            {rentalScore.calculate.breakdown.rentalHistory && (
                                                <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                            {tRequests('rentalHistory')}
                                                        </span>
                                                        <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
                                                            {rentalScore.calculate.breakdown.rentalHistory.points}
                                                        </span>
                                                    </div>
                                                    {rentalScore.calculate.breakdown.rentalHistory.details && (
                                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                                                            {rentalScore.calculate.breakdown.rentalHistory.details}
                                                        </p>
                                                    )}
                                                    {rentalScore.calculate.breakdown.rentalHistory.counts && (
                                                        <div className="mt-3 space-y-1 text-xs">
                                                            <div className="flex justify-between text-gray-600 dark:text-gray-400">
                                                                <span>{tRequests('collections')}:</span>
                                                                <span className="font-medium">{rentalScore.calculate.breakdown.rentalHistory.counts.collectionCount}</span>
                                                            </div>
                                                            <div className="flex justify-between text-gray-600 dark:text-gray-400">
                                                                <span>{tRequests('chargedOff')}:</span>
                                                                <span className="font-medium">{rentalScore.calculate.breakdown.rentalHistory.counts.chargedOffCount}</span>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                                ) : (
                                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                                        <Nodata message={tRequests('noRentalScoreAvailable')} />
                                    </div>
                                )}
                            </>
                        )}
        
                        {/* Payment History - Show if data is loaded or if fetch was attempted */}
                        {canShowPaymentHistory && hasFetchedPaymentHistory && (
                            <>
                                {isLoadingHistory ? (
                                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 animate-pulse">
                                        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-6"></div>
                                        <div className="space-y-4">
                                            <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                                            <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                                        </div>
                                    </div>
                                ) : paymentHistory.length > 0 ? (
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 animate-in fade-in duration-500">
                                <div className="flex items-center gap-2 mb-6">
                                    <DollarSign size={20} className="text-gray-600 dark:text-gray-400" />
                                    <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                        {tRequests('paymentHistory')}
                                    </h2>
                                </div>
                                <div className="space-y-4">
                                    {paymentHistory.map((invoice) => {
                                        const totalAmount = invoice.items?.reduce((sum, item) => sum + (item.Amount || 0), 0) || 0;
                                        const allPaid = invoice.items?.every(item => item.IsPaid === 1) || false;
                                        const hasPaidItems = invoice.items?.some(item => item.IsPaid === 1) || false;
                                        const latestPaidDate = invoice.items
                                            ?.filter(item => item.PaidDate)
                                            .sort((a, b) => new Date(b.PaidDate || '').getTime() - new Date(a.PaidDate || '').getTime())[0]?.PaidDate;

                                        return (
                                            <div key={invoice.Code} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                                {/* Invoice Header */}
                                                <div className="flex items-start justify-between mb-4">
                                                    <div>
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                                                                {invoice.asset?.Title || t('invoice')} #{invoice.Code}
                                                            </h3>
                                                            <PaymentStatusBadge status={allPaid ? 'paid' : hasPaidItems ? 'late' : 'missed'} />
                                                        </div>
                                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                                            {new Date(invoice.StartDate).toLocaleDateString()} - {new Date(invoice.EndDate).toLocaleDateString()}
                                                        </p>
                                                        {invoice.InvoicedDate && (
                                                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                                                                {t('invoiced')}: {new Date(invoice.InvoicedDate).toLocaleDateString()}
                                                            </p>
                                                        )}
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                                                            {totalAmount.toLocaleString()} {invoice.contract?.Currency || invoice.asset?.Currency || ''}
                                                        </p>
                                                        {latestPaidDate && (
                                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                                {tRequests('paymentDate')}: {new Date(latestPaidDate).toLocaleDateString()}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Invoice Items */}
                                                {invoice.items && invoice.items.length > 0 && (
                                                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                                                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                                                            {t('items')}
                                                        </h4>
                                                        <div className="space-y-2">
                                                            {invoice.items.map((item) => (
                                                                <div key={item.Code} className="flex items-center justify-between py-2 px-3 bg-gray-50 dark:bg-gray-700/50 rounded">
                                                                    <div className="flex-1">
                                                                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                                            {item.ItemCode}
                                                                        </p>
                                                                        {item.Notes && (
                                                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                                                {item.Notes}
                                                                            </p>
                                                                        )}
                                                                    </div>
                                                                    <div className="text-right ml-4">
                                                                        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                                                                            {item.Amount.toLocaleString()} {item.Currency}
                                                                        </p>
                                                                        <div className="flex items-center gap-2 mt-1">
                                                                            {item.IsPaid === 1 ? (
                                                                                <span className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                                                                                    <CheckCircle size={12} />
                                                                                    {item.PaidDate ? new Date(item.PaidDate).toLocaleDateString() : t('paid')}
                                                                                </span>
                                                                            ) : (
                                                                                <span className="text-xs text-red-600 dark:text-red-400 flex items-center gap-1">
                                                                                    <XCircle size={12} />
                                                                                    {t('unpaid')}
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Contract Info */}
                                                {invoice.contract && (
                                                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                                            {t('contract')}: {invoice.contract.Code} | {t('status')}: {invoice.contract.StatusCode}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                                ) : (
                                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                                        <Nodata message={tRequests('noPaymentHistoryAvailable')} />
                                    </div>
                                )}
                            </>
                        )}

                        {/* Download Contents */}
                        {requestDetails?.contents && requestDetails.contents.length > 0 && (
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                                <div className="flex items-center gap-2 mb-6">
                                    <Download size={20} className="text-gray-600 dark:text-gray-400" />
                                    <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                        {tRequests('documents')}
                                    </h2>
                                </div>
                                <div className="space-y-3">
                                    {requestDetails.contents.map((content) => (
                                        <div
                                            key={content.Code}
                                            className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                                        >
                                            <div className="flex items-center gap-3">
                                                <FileText size={20} className="text-gray-400 dark:text-gray-500" />
                                                <div>
                                                    <p className="font-medium text-gray-900 dark:text-gray-100">{content.Title}</p>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">{content.TypeCode}</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleDownloadContent(content.ContentUrl, content.Title)}
                                                className="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors flex items-center gap-2"
                                            >
                                                <Download size={16} />
                                                {tRequests('download')}
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Sidebar - Actions */}
                    <div className="space-y-6">
                        <div>
                            {/* DESKTOP ACTIONS */}
                            <div className="hidden lg:block">
                                <SectionWrapper title={t('quickActions')} Icon={Zap}>
                                    <QuickAction
                                        actions={quickActions}
                                    />
                                </SectionWrapper>
                            </div>
                        </div>
                    </div>
                </div>

                {/* MOBILE DRAWER */}
                <MobileActionsDrawer
                    showMobileActions={showMobileActions}
                    onClose={() => setShowMobileActions(false)}
                >
                    <QuickAction
                        actions={quickActions}
                        isMobile={true}
                    />
                </MobileActionsDrawer>

                {/* MOBILE FAB */}
                <MobileActionFAB
                    onClick={() => setShowMobileActions(true)}
                    show={!showMobileActions}
                    icon={Zap}
                />

                {/* Confirmation Modal */}
                <Overlay isOpen={showConfirmationModal} onClose={handleCloseConfirmationModal}>
                    <ActionConfirmationModal
                        onClose={handleCloseConfirmationModal}
                        onConfirm={handleConfirmAction}
                        title={confirmationActionType === 'APPROVED' ? tRequests('approveApplication') : tRequests('declineApplication')}
                        type={confirmationActionType || ''}
                        showCommentInput={true}
                        message={confirmationActionType === 'APPROVED' 
                            ? tRequests('confirmApproveApplication')
                            : tRequests('confirmDeclineApplication')
                        }
                        confirmLabel={confirmationActionType === 'APPROVED' ? tRequests('approveApplication') : tRequests('declineApplication')}
                        cancelLabel={t('Cancel')}
                        isLoading={isApproving || isDeclining}
                    />
                </Overlay>
            </div>
        </DefaultLayout>
    )
}

export default Page
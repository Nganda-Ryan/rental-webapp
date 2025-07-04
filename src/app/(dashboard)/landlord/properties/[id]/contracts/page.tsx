"use client"
import React, { useEffect, useState } from 'react'
import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb'
import Nodata from '@/components/error/Nodata'
import DefaultLayout from '@/components/Layouts/DefaultLayout'
import { useAuth } from "@/context/AuthContext";
import { PROFILE_LANDLORD_LIST } from "@/constant";
import { useParams } from 'next/navigation'
import { IContractColumn } from '@/types/TableTypes'
import { getAsset, terminateLease } from '@/actions/assetAction'
import { useRouter } from '@bprogress/next/app'
import toast from 'react-hot-toast'
import { getStatusBadge } from '@/lib/utils-component'
import { capitalize, formatDateToText } from '@/lib/utils'
import SectionWrapper from '@/components/Cards/SectionWrapper'
import { FileText, X, Zap } from 'lucide-react'
import { ResponsiveTable } from '@/components/feature/Support/ResponsiveTable'
import { SkeletonTable } from '@/components/skeleton/SkeletonTable'
import Overlay from '@/components/Overlay'
import { ActionConfirmationModal } from '@/components/Modal/ActionConfirmationModal'
import Button from '@/components/ui/Button'
import { ProcessingModal } from '@/components/Modal/ProcessingModal'
import { RightSideAction2 } from '@/components/skeleton/pages/PropertySkeletonPage'
import { AssetDataDetailed } from '@/types/Property'

const Page = () => {
  const [contractTableData, setContractTableData] = useState<IContractColumn[]>([]);
  const [isReady, setIsReady] = useState(false);
  const [showActionModal, setShowActionModal] = useState(false);
  const [isTerminatingContract, setIsTerminatingContract] = useState(false);
  const [currentLease, setCurrentLease] = useState("");
  const [showMobileActions, setShowMobileActions] = useState(false);
  const [asset, setAsset] = useState<AssetDataDetailed | null>(null);
  const [currency, setCurrency] = useState("");
  const router = useRouter();
  const params = useParams();
  const { isAuthorized, loadingProfile } = useAuth();


  useEffect(() => {
    init();
  }, [])

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
        priority: 'medium' as const,
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
        priority: 'medium' as const,
        render: (_: any, contract: IContractColumn) => (
        <div className="text-sm text-gray-800 dark:text-gray-100">
            {`${contract.monthlyRent} ${currency ?? ''}`}
        </div>
        ),
    },
    {
        key: 'status',
        label: 'Status',
        priority: 'low' as const,
        render: (_: any, contract: IContractColumn) => (
            <>
                {getStatusBadge(contract.status)}
            </>
        ),
    },
    {
      key: 'actions',
      label: 'Actions',
      priority: "high" as "high",
      render: (_: any, contract: IContractColumn) => (
        <div className="flex gap-2 items-center justify-end md:justify-start ">
          <Button variant="info" isSubmitBtn={false} fullWidth={true} onClick={(e) => {e.stopPropagation(); console.log("Print")}}>
            Print
          </Button>
        </div>
      ),
    },
  ];

  const getActiveContract = () => {
    return contractTableData.find(contract => contract.status == 'ACTIVE');
  }

  const contract = getActiveContract();

  const init = async () => {
      try {
        console.log('-->params.id', params.id);
        const result = await getAsset(params.id as string);
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
            Units: [],
            Address: {
              Code: item.Address.Code,
              City: item.Address.City,
              Country: item.Address.Country,
              Street: item.Address.Street,
            },
          }
          if(item.contracts && item.contracts.length > 0){
            const _contractTableData = item.contracts.map((contract: any) => ({
              id: contract.Code,
              tenant: contract.renter.user.Lastname + ' ' + contract.renter.user.Firstname,
              startDate: contract.StartDate,
              endDate: contract.EndDate,
              status: contract.StatusCode,
              monthlyRent: item.Price,
            })) as IContractColumn[];
            console.log("-->_contractTableData", _contractTableData);
  
            setCurrency(item.Currency);
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
        console.log(error)
      } finally {
        setIsReady(true);
      }
    }

  const handleSelectedContract = (contractId: string) => {
    router.push(`/landlord/properties/${params.id}/contracts/${contractId}`)
  }

  const handleConfirmTerminateLease = async (contractId: string) => {
    try {
      setShowActionModal(false)
      setIsTerminatingContract(true);
      const result  = await terminateLease(contractId);
      if(result.error){
        if(result.code == 'SESSION_EXPIRED'){
            router.push('/signin');
            return;
        }
        setIsTerminatingContract(false);
        toast.error(result.error ?? "An unexpected error occurred", { position: 'bottom-right' });
        return
      }
      await init();
      setIsTerminatingContract(false);
      setIsTerminatingContract(false);
      setShowActionModal(false);
      toast.success("Lease terminated", { position: 'bottom-right' });
    } catch (error) {
      toast.error("Something went wrong during the process. Try again or contact the support", { position: 'bottom-right' });
    } finally {
        setCurrentLease("");
    }
  }
  
  if (!loadingProfile && !isAuthorized(PROFILE_LANDLORD_LIST)) {
    return <div>Unauthorized</div>;
  }
  return (
    <DefaultLayout>
      <Breadcrumb previousPage pageName={`Property ${asset ? ("- " + capitalize(asset.Title)) : ""}`} />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6 h-fit">
            {isReady ?
              <>
                {contractTableData.length > 0 ?
                  <SectionWrapper title="Lease Contracts" Icon={FileText}>
                    {contractTableData.length > 0 ? (
                        <ResponsiveTable
                          columns={contractColumns}
                          data={contractTableData}
                          onRowClick={(contract) => handleSelectedContract(contract.id)}
                          keyField="id"
                          searchKey='tenant'
                          paginate={10}
                        />
                      ) : (<p className="text-gray-500 dark:text-gray-400 text-sm p-3">No lease contracts available</p>)
                    }
                  </SectionWrapper>
                  :
                  <Nodata />
                }
                
              </>
              :
              <div className="w-full">
                <SkeletonTable />
              </div>
            }
          </div>

          <div className="space-y-6">
            { isReady ?
              <div>
                <div className="hidden lg:block">
                    <SectionWrapper title="Quick Actions">
                      {
                        contract ?
                          <Button variant={'danger'} disable={contract.status !== 'ACTIVE'} isSubmitBtn={false} fullWidth={true} 
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowActionModal(true);
                              setCurrentLease(contract.id)}
                            }
                          >
                            Terminate
                          </Button>
                          :
                          <div>No action</div>
                      }
                    </SectionWrapper>
                </div>
              </div>
              :
              <RightSideAction2 />
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
                <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Quick Actions</h2>
                    <button onClick={() => setShowMobileActions(false)} className="text-gray-500 hover:text-gray-800 dark:hover:text-white" aria-label="Close drawer">
                        <X size={24} />
                    </button>
                </div>

                {/* MOBILE ACTIONS */}
                {
                  contract ?
                    <Button variant={'danger'} disable={contract.status !== 'ACTIVE'} isSubmitBtn={false} fullWidth={true} 
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowActionModal(true);
                        setCurrentLease(contract.id)}
                      }
                    >
                      Terminate
                    </Button>
                    :
                    <div className='mb-15 mt-2'>All leases are terminated, nothing to do</div>
                }
            </div>
        </div>

        {/* FAB pour mobile */}
        {!showMobileActions && (
            <button onClick={() => setShowMobileActions(true)} aria-label="Show quick actions" className={`fixed bottom-9 right-6 z-50 bg-[#2A4365] text-white p-2 rounded-full shadow-lg hover:bg-blue-700 active:scale-95 duration-300 ease-linear lg:hidden`}  >
                <Zap size={24} />
            </button>
        )}
        
        <Overlay isOpen={showActionModal} onClose={() => setShowActionModal(false)}>
          <ActionConfirmationModal
            onClose={() => setShowActionModal(false)}
            onConfirm={() => handleConfirmTerminateLease(currentLease)}
            title="Terminate the contract"
            type='APPROVED'
            showCommentInput={false}
            message={`Are you sure you want to terminate lease #${currentLease} ?`}
          />
        </Overlay>

        <Overlay isOpen={isTerminatingContract} onClose={() => {}}>
          <ProcessingModal message="Terminating the lease" />
        </Overlay>
    </DefaultLayout>
  )
}

export default Page
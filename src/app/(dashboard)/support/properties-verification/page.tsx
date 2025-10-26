"use client"
import React, { useState, useEffect } from 'react'
import { useRouter } from '@bprogress/next/app'
import {
  Calendar,
  Mail,
  Phone,
  Building2,
  Search,
} from 'lucide-react'
import { ActionConfirmationModal } from '@/components/Modal/ActionConfirmationModal'
import DefaultLayout from '@/components/Layouts/DefaultLayout'
import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb'
import Overlay from '@/components/Overlay'
import { GetRequestsParams } from '@/types/requestTypes'
import { getRequests, verifyRequest } from '@/actions/requestAction'
import toast from 'react-hot-toast'
import { ProcessingModal } from '@/components/Modal/ProcessingModal';
import { getStatusBadge } from "@/lib/utils-component";
import { SkeletonTable } from '@/components/skeleton/SkeletonTable'
import Nodata from '@/components/error/Nodata'
import { ResponsiveTable } from '@/components/feature/Support/ResponsiveTable'
import Button from '@/components/ui/Button'
import { formatDateToText } from '@/lib/utils'
import { MANAGER_PROFILE_LIST } from '@/constant'
import { roleStore } from '@/store/roleStore'
import { useTranslations } from 'next-intl'

interface VerificationRequest {
  id: string
  creator: {
    id: string
    name: string
    email: string
    phone: string
    NIU: string
  }
  asset: string
  submissionDate: string
  status: string
}

const Page = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [requestList, setRequestList] = useState<VerificationRequest[]>([])
  const [actionModal, setActionModal] = useState<{
    type: 'APPROVED' | 'DECLINED'
    isOpen: boolean
    lessorId: string | null
  }>({
    type: 'APPROVED',
    isOpen: false,
    lessorId: null,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState('')
  const [isReady, setIsReady] = useState(false);
  const { isAuthorized } = roleStore();
  const t = useTranslations('Support.propertiesVerification');
  const commonT = useTranslations('Common');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const params: GetRequestsParams = {
          // term: 'ste',
          orderBy: 'CreatedAt',
          orderMode: 'desc',
          limit: 1000,
          offset: 0,
          type: 'VASSET',
        };

        const result = await getRequests(params);
        if(result.data && result.data.body.items.length > 0) {
          const datas = result.data.body.items.map((item: any) => {
            return {
              id: item.Code,
              creator: {
                id: item.creator.user.Code,
                name: item.creator.user.Firstname + ' ' + item.creator.user.Lastname,
                email: item.creator.user.Email,
                phone: item.creator.user.Phone,
                NIU: item.creator.user.NIU
              },
              asset: item.Object as string,
              submissionDate: item.SubmittedDate,
              status: item.StatusCode,
            }
          })
          setRequestList(datas)
        }
        console.log('API result:', result);
      } catch (err) {
        console.log('Error fetching data:', err);
      } finally {
        setIsReady(true);
      }
    };

    fetchData();
  }, [])


  const router = useRouter()
  


  const handleAction = (type: 'APPROVED' | 'DECLINED', lessorId: string) => {
    setActionModal({
      type,
      isOpen: true,
      lessorId,
    })
  }

  const handleActionConfirm = async (comment: string) => {
    try {
      if(actionModal.lessorId){
        setLoadingMessage(t('processingRequest'));
        setIsLoading(true);
        const payload = {
          code: actionModal.lessorId,
          status: actionModal.type,
          body: {
            notes: comment,
          },
        }

        setActionModal((prev) => ({ ...prev, isOpen: false }))
        const result  = await verifyRequest(payload, "Asset");
        if (result.code) {
          console.log('Error approving request:', result.error);
          toast.error(t('processError'), { position: 'bottom-right' });
          return;
        }
        setRequestList((prev) => {
          return prev.map((request) => {
            if (request.id === actionModal.lessorId) {
              return { ...request, status: actionModal.type };
            }
            return request;
          });
        })

        const message = actionModal.type === 'APPROVED' ? t('approveSuccess') : t('rejectSuccess');
        toast.success(message, { position: 'bottom-right' });
      }
      setActionModal({
        type: 'APPROVED',
        isOpen: false,
        lessorId: null,
      })
      return;
    } catch (error) {
      console.error('Error during action confirmation:', error);
      toast.error(t('processError'), { position: 'bottom-right' });
    } finally {
      setIsLoading(false);
    }
  }
  

  const columns = [
    {
      key: 'asset',
      label: t('propertyInfo'),
      priority: 'medium' as const,
      render: (_: any, row: VerificationRequest) => (
        <div className="text-sm text-gray-700 dark:text-gray-300">
          <div className="text-sm text-gray-500 dark:text-gray-300 flex items-center justify-end md:justify-start gap-1">
            <Building2 size={14} />
            {row.asset.replace('Verification of ', "").replace(t('verificationOf') + ' ', "")}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-300 flex items-center justify-end md:justify-start gap-1">
            <Calendar size={14} />
            {formatDateToText(row.submissionDate)}
          </div>
        </div>
      ),
    },
    {
      key: 'creator',
      label: t('propertyOwner'),
      priority: 'low' as const,
      render: (_: any, row: VerificationRequest) => (
        <div className="space-y-1">
          <div className="text-sm text-gray-500 dark:text-gray-300 flex items-center justify-end md:justify-start gap-1">
            {row.creator.name}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-300 flex items-center justify-end md:justify-start gap-1">
            <Mail size={14} />
            {row.creator.email}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-300 flex items-center justify-end md:justify-start gap-1">
            <Phone size={14} />
            {row.creator.phone}
          </div>
        </div>
      ),
    },
    {
      key: 'status',
      label: t('requestStatus'),
      priority: 'medium' as const,
      render: (_: any, row: VerificationRequest) => (
        <div className="space-y-1">
          {getStatusBadge(row.status)}
        </div>
      ),
    },
    {
      key: 'actions',
      label: t('actions'),
      priority: 'high' as const,
      render: (_: any, row: VerificationRequest) => (
        <div className="flex gap-2">
          <Button variant={row.status === 'PENDING' ? 'danger' : 'outline-danger'} disable={row.status !== 'PENDING'} isSubmitBtn={false} fullWidth={true} onClick={(e) => {e.stopPropagation(); handleAction('DECLINED', row.id); }}>
            {t('reject')}
          </Button>
          <Button variant={row.status === 'PENDING' ? 'neutral' : 'outline-neutral'} disable={row.status !== 'PENDING'} isSubmitBtn={false} fullWidth={true} onClick={(e) => {e.stopPropagation();handleAction('APPROVED', row.id)}}>
            {t('approve')}
          </Button>
        </div>
      ),
    },
  ]

  const handleLandLordDetail = (id: any) => {
    console.log('ID', id)
    router.push(`/support/properties-verification/${id}`)
  }

  if (!isAuthorized(MANAGER_PROFILE_LIST)) {
    return router.push("/unauthorized");
  }
  
  
  return (
    <DefaultLayout>
      <Breadcrumb previousPage={false} pageName={t('title')} />

      {
        isReady ?
        <>
          {requestList.length > 0 ?
            <div className="w-full">
              
              <ResponsiveTable
                columns={columns}
                data={requestList}
                onRowClick={(request: VerificationRequest) => handleLandLordDetail(request.id)}
                keyField="id"
                paginate={10}
                searchKey='asset'
              />

              <Overlay isOpen={actionModal.isOpen} onClose={() =>
                setActionModal({
                  type: 'APPROVED',
                  isOpen: true,
                  lessorId: "abcdd",
                })}
              >
                <ActionConfirmationModal
                  onClose={() =>
                    setActionModal({
                      type: 'APPROVED',
                      isOpen: false,
                      lessorId: null,
                    })
                  }
                  onConfirm={handleActionConfirm}
                  title={
                    actionModal.type === 'APPROVED'
                      ? t('approveAssetVerification')
                      : t('rejectAssetVerification')
                  }
                  type={actionModal.type}
                />
              </Overlay>
              <Overlay isOpen={isLoading} onClose={() => setIsLoading(false)}>
                <ProcessingModal message={loadingMessage} />
              </Overlay>
            </div>
          :
            <div className="w-full">
              <Nodata message={t('noRequests')}/>
            </div>
          }
        </>
        :
        <div className="w-full">
          <SkeletonTable />
        </div>
      }
      
      
    </DefaultLayout>
  )
}


export default Page 
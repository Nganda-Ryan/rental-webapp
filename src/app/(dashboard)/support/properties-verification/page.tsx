"use client"
import React, { useState, Fragment, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  ExternalLink,
  Mail,
  Phone,
  ChevronLeft,
  ChevronRight,
  Fingerprint,
  User,
  MapPin,
  Building2,
  Building,
  Search,
} from 'lucide-react'
import { ActionConfirmationModal } from '@/components/Modal/ActionConfirmationModal'
import DefaultLayout from '@/components/Layouts/DefaultLayout'
import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb'
import Overlay from '@/components/Overlay'
import { GetRequestsParams } from '@/types/requestTypes'
import { getRequests, verifyRequest } from '@/actions/requestAction'
import { v4 as uuidv4 } from 'uuid';
import toast from 'react-hot-toast'
import { ProcessingModal } from '@/components/Modal/ProcessingModal'
import RenderMobileCardSkeleton from '@/components/skeleton/RenderMobileCardSkeleton'
import RenderDesktopTableSkeleton from '@/components/skeleton/RenderDesktopTableSkeleton'
import Image from 'next/image'
import { getStatusIcon } from "@/lib/utils-component";
import { SkeletonTable } from '@/components/skeleton/SkeletonTable'
import Nodata from '@/components/error/Nodata'
import { ResponsiveTable } from '@/components/feature/Support/ResponsiveTable'
import Button from '@/components/ui/Button'
import { formatDateToText } from '@/lib/utils'

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
  const [currentPage, setCurrentPage] = useState(1)
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
  const [offSet, setOffSet] = useState(0);
  const [term, setTerme] = useState<string>('');
  const [orderMode, setOrderMode] = useState<string>('asc');
  const [isLoading, setIsLoading] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState('')
    const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const params: GetRequestsParams = {
          // term: 'ste',
          orderBy: 'CreatedAt',
          orderMode: 'desc',
          limit: 1000,
          offset: offSet,
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
  }, [offSet])


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
        setLoadingMessage('Processing request...');
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
          toast.error("Someting wend wrong during the process, please try again", { position: 'bottom-right' });
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
        
        const message = actionModal.type === 'APPROVED' ? 'asset approved successfully!' : 'asset rejected successfully!';
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
      toast.error("Someting wend wrong during the process, please try again", { position: 'bottom-right' });
    } finally {
      setIsLoading(false);
    }
  }
  

  const columns = [
    {
      key: 'asset',
      label: 'Property Information',
      priority: 'high' as const,
      render: (_: any, row: VerificationRequest) => (
        <div className="space-y-1">
          <div className="font-medium text-gray-900 dark:text-gray-100 flex items-center gap-1">
            <Building2 size={14} />
            {row.asset}
          </div>
          <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
            <Calendar size={14} />
            {formatDateToText(row.submissionDate)}
          </div>
        </div>
      ),
    },
    {
      key: 'creator',
      label: 'Property Owner',
      priority: 'high' as const,
      render: (_: any, row: VerificationRequest) => (
        <div className="space-y-1">
          <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
            {row.creator.name}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
            <Mail size={14} />
            {row.creator.email}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
            <Phone size={14} />
            {row.creator.phone}
          </div>
        </div>
      ),
    },
    {
      key: 'status',
      label: 'REQUEST STATUS',
      priority: 'high' as const,
      render: (_: any, row: VerificationRequest) => (
        <div className="space-y-1">
          {getStatusIcon(row.status)}
        </div>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      priority: 'high' as const,
      render: (_: any, row: VerificationRequest) => (
        <div className="flex gap-2">
          <Button variant={row.status === 'PENDING' ? 'danger' : 'outline-danger'} disable={row.status !== 'PENDING'} isSubmitBtn={false} fullWidth={true} onClick={(e) => {e.stopPropagation(); handleAction('DECLINED', row.id); }}>
            Reject
          </Button>
          <Button variant={row.status === 'PENDING' ? 'neutral' : 'outline-neutral'} disable={row.status !== 'PENDING'} isSubmitBtn={false} fullWidth={true} onClick={(e) => {e.stopPropagation();handleAction('APPROVED', row.id)}}>
            Approve
          </Button>
        </div>
      ),
    },
  ]

  const handleLandLordDetail = (id: any) => {
    console.log('ID', id)
    router.push(`/support/properties-verification/${id}`)
  }

  
  
  return (
    <DefaultLayout>
      <Breadcrumb previousPage={false} pageName="Property Verification Requests" />

      {
        isReady ?
        <>
          {requestList.length > 0 ?
            <div className="w-full">
              <div className="mb-6">
                <div className="relative w-full md:w-96">
                  <Search
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500"
                    size={20}
                  />
                  <input
                    type="text"
                    placeholder="Search lessors..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
              
              <ResponsiveTable
                columns={columns}
                data={requestList}
                onRowClick={(request: VerificationRequest) => handleLandLordDetail(request.id)}
                keyField="id"
                paginate={10}
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
                      ? 'Approve asset Verification'
                      : 'Reject asset Verification'
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
              <Nodata message='No request to display'/>
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
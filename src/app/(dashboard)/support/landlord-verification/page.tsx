"use client"
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  Calendar,
  Mail,
  Phone,
  Fingerprint,
  User,
} from 'lucide-react'
import { ActionConfirmationModal } from '@/components/Modal/ActionConfirmationModal'
import DefaultLayout from '@/components/Layouts/DefaultLayout'
import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb'
import Overlay from '@/components/Overlay'
import { GetRequestsParams } from '@/types/requestTypes'
import { getRequests, verifyRequest } from '@/actions/requestAction';
import toast from 'react-hot-toast';
import { ProcessingModal } from '@/components/Modal/ProcessingModal'
import { getStatusIcon } from "@/lib/utils-component";
import { ResponsiveTable } from '@/components/feature/Support/ResponsiveTable'
import Nodata from '@/components/error/Nodata'
import { SkeletonTable } from '@/components/skeleton/SkeletonTable'
import { formatDateToText } from '@/lib/utils'
import Button from '@/components/ui/Button'

interface VerificationRequest {
  id: string
  NUI: string
  lessor: {
    name: string
    email: string
    phone: string
  }
  submissionDate: string
  status: string
}

type actionType = 'APPROVED' | 'DECLINED' | ""

const LessorVerification = () => {
  const [requestList, setRequestList] = useState<VerificationRequest[]>([])
  const [actionModal, setActionModal] = useState<{
    type: actionType
    isOpen: boolean
    lessorId: string | null
  }>({
    type: 'APPROVED',
    isOpen: false,
    lessorId: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [isReady, setIsReady] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const params: GetRequestsParams = {
          orderBy: 'CreatedAt',
          orderMode: 'desc',
          limit: 1000,
          offset: 0,
          type: 'VPROFILE',
        };

        // Call the API helper
        const result = await getRequests(params);
        if(result.data && result.data.body.items.length > 0) {
          console.log('-->result.data.body.items', result.data.body.items);
          const datas = result.data.body.items.map((item: any) => {
            return {
              id: item.Code,
              NUI: item.creator.user.NIU,
              lessor: {
                name: item.creator.user.Firstname + ' ' + item.creator.user.Lastname,
                email: item.creator.user.Email,
                phone: item.creator.user.Phone,
              },
              submissionDate: item.SubmittedDate,
              status: item.StatusCode,
            }
          })
          setRequestList(datas);
        } else if(result.error){
          if(result.code == 'SESSION_EXPIRED'){
              router.push('/signin');
              return;
          }
          toast.error(result.error ?? "An unexpected error occurred", { position: 'bottom-right' });
        }
      } catch (err) {
        console.log('Error fetching data:', err);
      } finally {
        setIsReady(true);
      }
    };

    fetchData();
  }, [])



  
  const handleAction = (type: actionType, lessorId: string) => {
    console.log('-->lessorId', lessorId);
    setActionModal({
      type,
      isOpen: true,
      lessorId,
    })
  };

  const handleActionConfirm = async (comment: string) => {
    try {
      if(actionModal.lessorId){
        setIsLoading(true);
        setLoadingMessage('Processing request...')
        const payload = {
          code: actionModal.lessorId,
          status: actionModal.type,
          body: {
            notes: comment,
          },
        }

        console.log('-->payload', payload);

        setActionModal((prev) => ({ ...prev, isOpen: false }))
        const result  = await verifyRequest(payload, "User/Profile");
        if (result.code) {
          if(result.code == 'SESSION_EXPIRED'){
            router.push('/signin');
            return;
          }
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
        
        const message = actionModal.type === 'APPROVED' ? 'Lessor approved successfully!' : 'Lessor rejected successfully!';
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
  };
  
  const columns = [
    {
      key: 'lessor',
      label: 'Lessor Information',
      priority: 'high' as const,
      render: (_: any, row: VerificationRequest) => (
        <div className="space-y-1">
          <div className="font-medium text-gray-900 dark:text-gray-100 flex items-center gap-1">
            <User size={14} />
            {row.lessor.name}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
            <Fingerprint size={14} />
            {row.NUI}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
            <Mail size={14} />
            {row.lessor.email}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
            <Phone size={14} />
            {row.lessor.phone}
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
      key: 'submissionDate',
      label: 'Submitted',
      priority: 'medium' as const,
      render: (_: any, row: VerificationRequest) => (
        <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
          <Calendar size={14} />
          {formatDateToText(row.submissionDate)}
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
  ];

  const handleLandLordDetail = (id: any) => {
    console.log('ID', id)
    router.push(`/support/landlord-verification/${id}`)
  }

  

  
  return (
    <DefaultLayout>
      <Breadcrumb previousPage={false} pageName="Lessor Verification Requests" />
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
              />

              <Overlay isOpen={actionModal.isOpen} onClose={() =>
                setActionModal({
                  type: '',
                  isOpen: false,
                  lessorId: "",
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
                  title={ actionModal.type === 'APPROVED' ? 'Approve Lessor Verification' : 'Reject Lessor Verification'}
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


export default LessorVerification 
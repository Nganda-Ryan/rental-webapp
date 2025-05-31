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

interface Document {
  name: string
  type: string
  status: 'valid' | 'invalid' | 'pending'
}
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

const LessorVerification = () => {
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
  const  [offSet, setOffSet] = useState(0);
  const [term, setTerme] = useState<string>('');
  const [orderMode, setOrderMode] = useState<string>('asc');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
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
          type: 'VPROFILE',
        };

        // Call the API helper
        const result = await getRequests(params);
        if(result.data && result.data.body.items.length > 0) {
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
  
  const verificationRequests: VerificationRequest[] = [
    {
      id: 'LSR001',
      NUI: '123456789',
      lessor: {
        name: 'John Smith',
        email: 'john.smith@example.com',
        phone: '(555) 123-4567',
      },
      submissionDate: '2023-07-01',
      status: 'pending',
    },
    {
      id: 'LSR002',
      NUI: '987654321',
      lessor: {
        name: 'Sarah Johnson',
        email: 'sarah.j@example.com',
        phone: '(555) 234-5678',
      },
      submissionDate: '2023-06-28',
      status: 'pending',
    },
    {
      id: 'LSR003',
      NUI: '456789123',
      lessor: {
        name: 'Michael Brown',
        email: 'michael.b@example.com',
        phone: '(555) 345-6789',
      },
      submissionDate: '2023-06-25',
      status: 'pending',
    },
  ]
  
  const ITEMS_PER_PAGE = 10
  const filteredRequests = verificationRequests.filter(
    (request) =>
      request.lessor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.lessor.email.toLowerCase().includes(searchTerm.toLowerCase())
  )
  const totalPages = Math.ceil(filteredRequests.length / ITEMS_PER_PAGE)
  
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
        setIsLoading(true);
        setLoadingMessage('Processing request...')
        const payload = {
          code: actionModal.lessorId,
          status: actionModal.type,
          body: {
            notes: comment,
          },
        }

        setActionModal((prev) => ({ ...prev, isOpen: false }))
        const result  = await verifyRequest(payload, "User/Profile");
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
  }
  

  const renderMobileCard = (request: VerificationRequest) => {
    return (
      <div key={uuidv4()} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 space-y-4">
        <div className="space-y-2">
          <div onClick={() => handleLandLordDetail(request.id)} className="font-medium text-gray-900 dark:text-gray-100 flex items-center justify-between flex-nowrap cursor-pointer">
            <div>{request.lessor.name}</div>
            {getStatusIcon(request.status)}
          </div>
          <div className="flex flex-col gap-1 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <Fingerprint size={14} />
              {request.NUI}
            </div>
            <div className="flex items-center gap-1">
              <Mail size={14} />
              {request.lessor.email}
            </div>
            <div className="flex items-center gap-1">
              <Phone size={14} />
              {request.lessor.phone}
            </div>
            <div className="flex items-center gap-1">
              <Calendar size={14} />
              {request.submissionDate}
            </div>
          </div>
        </div>
        <div className="flex gap-2 pt-2">
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleAction('DECLINED', request.id)
            }}
            disabled={request.status !== 'PENDING'}
            className={request.status === 'PENDING' 
              ? "flex-1 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800"
              : "flex-1 px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-100 dark:bg-gray-900/60 text-gray-400 dark:text-gray-600 cursor-not-allowed opacity-80"
            }
          >
            Reject
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleAction('APPROVED', request.id)
            }}
            disabled={request.status !== 'PENDING'}
            className={request.status === 'PENDING'
              ? "flex-1 px-3 py-2 text-sm bg-[#2A4365] dark:bg-blue-600 text-white rounded-lg hover:bg-blue-800 dark:hover:bg-blue-700"
              : "flex-1 px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-100 dark:bg-gray-900/60 text-gray-400 dark:text-gray-600 cursor-not-allowed opacity-80"
            }
          >
            Approve
          </button>
        </div>
      </div>
    )
  }
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
          {row.submissionDate}
        </div>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      priority: 'high' as const,
      render: (_: any, row: VerificationRequest) => (
        <div className="flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleAction('DECLINED', row.NUI)
            }}
            disabled={row.status !== 'PENDING'}
            className={row.status === 'PENDING' 
              ? "flex-1 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800"
              : "flex-1 px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-100 dark:bg-gray-900/60 text-gray-400 dark:text-gray-600 cursor-not-allowed opacity-80"
            }
          >
            Reject
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleAction('APPROVED', row.NUI)
            }}
            disabled={row.status !== 'PENDING'}
            className={row.status === 'PENDING'
              ? "flex-1 px-3 py-2 text-sm bg-[#2A4365] dark:bg-blue-600 text-white rounded-lg hover:bg-blue-800 dark:hover:bg-blue-700"
              : "flex-1 px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-100 dark:bg-gray-900/60 text-gray-400 dark:text-gray-600 cursor-not-allowed opacity-80"
            }
          >
            Approve
          </button>
        </div>
      ),
    },
  ]

  const handleLandLordDetail = (id: any) => {
    console.log('ID', id)
    router.push(`/support/landlord-verification/${id}`)
  }

  

  const handleNextPage = () => {
    setOffSet((prevOffSet) => prevOffSet + 1);
  }

  const handlePreviousPage = () => {
    if(offSet === 0) return;
    setOffSet((prevOffSet) => prevOffSet - 1);
  }
  
  return (
    <DefaultLayout>
      <Breadcrumb previousPage={false} pageName="Lessor Verification Requests" />
      {
        isReady ?
        <>
          {requestList.length > 0 ?
            <div className="w-full">
              {/* <div className="mb-6">
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
              </div> */}
              <div className="md:hidden space-y-4">
                {requestList.map((request) => renderMobileCard(request))}
              </div>

              <div className="hidden md:block bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-800/50">
                    <tr>
                      {columns.map((column) => (
                        <th
                          key={uuidv4()}
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                        >
                          {column.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {requestList.map((row) => (
                      <Fragment key={uuidv4()}>
                        <tr
                          onClick={() => handleLandLordDetail(row.id)}
                          className="hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer"
                        >
                          {columns.map((column) => (
                            <td key={uuidv4()} className="px-6 py-4">
                              {column.render
                                ? column.render(column.key === 'actions' ? undefined : (row as any)[column.key], row)
                                : column.key === 'actions' ? null : (row as any)[column.key]}
                            </td>
                          ))}
                        </tr>
                      </Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="px-4 py-3 flex items-center justify-between">
                  <div className="flex-1 text-sm text-gray-700 dark:text-gray-300 sm:hidden">
                    Page {currentPage} of {totalPages}
                  </div>
                  <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        Showing{' '}
                        <span className="font-medium">
                          {(currentPage - 1) * ITEMS_PER_PAGE + 1}
                        </span>{' '}
                        to{' '}
                        <span className="font-medium">
                          {Math.min(
                            currentPage * ITEMS_PER_PAGE,
                            filteredRequests.length,
                          )}
                        </span>{' '}
                        of{' '}
                        <span className="font-medium">{filteredRequests.length}</span>{' '}
                        results
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronLeft size={20} />
                      </button>
                      <span className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                        Page {currentPage} of {totalPages}
                      </span>
                      <button
                        onClick={() =>
                          setCurrentPage((p) => Math.min(totalPages, p + 1))
                        }
                        disabled={currentPage === totalPages}
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronRight size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

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
                      ? 'Approve Lessor Verification'
                      : 'Reject Lessor Verification'
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
              <div className="lg:hidden space-y-4">
                <Image
                  src="/images/user/no-data-mobile.svg"
                  height={800}
                  width={800}
                  className='h-auto mx-auto w-40 mt-20'
                  alt='No data mobile'
                />
                <div className='text-center mt-10 text-xl font-bold'>
                  No Data Found
                </div>
              </div>
              <div className="hidden lg:block overflow-hidden">
                <Image
                  src="/images/user/no-data-desktop.svg"
                  height={800}
                  width={800}
                  className='h-auto mx-auto w-70 mt-20'
                  alt='No data desktop'
                />
                <div className='text-center mt-10 text-xl font-bold'>
                  No Data Found
                </div>
              </div>
            </div>
          }
        </>
        :
        <div className="w-full">
          <div className="lg:hidden space-y-4">
            <RenderMobileCardSkeleton />
          </div>
          <div className="hidden lg:block bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700">
            <RenderDesktopTableSkeleton columnsCount={4!}/>
          </div>
        </div>
      }
      
      
    </DefaultLayout>
  )
}


export default LessorVerification 
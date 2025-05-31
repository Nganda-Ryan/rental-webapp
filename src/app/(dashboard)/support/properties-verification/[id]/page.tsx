"use client"
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Calendar,
  FileText,
  User,
  Briefcase,
  CheckCircle,
  ExternalLink,
  Clock,
  XCircle,
  BadgeCheck,
  Trash,
  Building2,
} from 'lucide-react'
import DefaultLayout from '@/components/Layouts/DefaultLayout'
import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb'
import { geRequestDetail, verifyRequest } from '@/actions/requestAction';
import { RequestData } from '@/types/requestTypes';
import Overlay from '@/components/Overlay';
import { ActionConfirmationModal } from '@/components/Modal/ActionConfirmationModal';
import toast from 'react-hot-toast';
import { ProcessingModal } from '@/components/Modal/ProcessingModal';
import Link from 'next/link';
import ProfileVerificationDetailSkeleton from '@/components/skeleton/pages/ProfileVerificationDetailSkeleton';
import { getStatusIcon } from '@/lib/utils';

interface ModalAction {
  type: 'APPROVED' | 'DECLINED'
  isOpen: boolean
}


const PropertyDetailView = () => {
  const [actionModal, setActionModal] = useState<ModalAction>({
    type: 'APPROVED',
    isOpen: false,
  });
  const [isLoading, setIsLoading] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState('')
  const params = useParams();
  const [requestDetails, setRequestDetails] = React.useState<RequestData | undefined>(undefined);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setLoadingMessage('Loading request details...')
        if(!params.id) {
          console.log('No ID provided in the URL parameters.');
          return;
        }

        const result = await geRequestDetail(params.id as string);
        if (result.code) {
          console.log('Error fetching data:', result.error);
          return;
        }
        setRequestDetails({
          id: result.data.body.reqData.Code,
          userId: result.data.body.reqData.creator.user.Code,
          name: result.data.body.reqData.creator.user.Firstname + ' ' + result.data.body.reqData.creator.user.Lastname,
          email: result.data.body.reqData.creator.user.Email,
          phone: result.data.body.reqData.creator.user.Phone,
          NIU: result.data.body.reqData.creator.user.NIU,
          joinDate: result.data.body.reqData.creator.user.joinDate,
          submittedDate: result.data.body.reqData.SubmittedDate,
          closedDate: result.data.body.reqData.ClosedDate,
          status: result.data.body.reqData.StatusCode,
          documents: result.data.body.contents.length == 0 ? [] : result.data.body.contents.map((doc: any) => ({
            id: doc.Code,
            name: doc.Title,
            type: doc.TypeCode,
            status: doc.StatusCode,
            date: doc.date,
            contentUrl: doc.ContentUrl
          })),
        });
      } catch (err) {
        console.log('Error fetching data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [])
  

  const handleAction = (type: 'APPROVED' | 'DECLINED', propertyId: string) => {
    setActionModal({
      type,
      isOpen: true,
    })
  }
  
  const handleActionConfirm = async (comment: string) => {
    try {
      if(requestDetails){
        setLoadingMessage('Processing request...')
        setIsLoading(true);
        const payload = {
          code: requestDetails.id,
          status: actionModal.type,
          body: {
            notes: comment,
          },
        }
        console.log('-->payload', payload)
        setActionModal((prev) => ({ ...prev, isOpen: false }));
        const result  = await verifyRequest(payload, "Asset");
        if (result.code) {
          console.log('Error approving request:', result.error);
          toast.error("Someting wend wrong during the process, please try again", { position: 'bottom-right' });
          return;
        }
        setRequestDetails((prev) => prev ? { ...prev, status: actionModal.type } : undefined);
        const message = actionModal.type === 'APPROVED' ? 'Property approved successfully!' : 'Property rejected successfully!';
        toast.success(message, { position: 'bottom-right' });
      }
      setActionModal({
        type: 'APPROVED',
        isOpen: false,
      })
      return;
    } catch (error) {
      console.error('Error during action confirmation:', error);
      toast.error("Someting wend wrong during the process, please try again", { position: 'bottom-right' });
    } finally {
      console.log(`${actionModal.type}ing property:`, comment)
      setActionModal({
        type: 'APPROVED',
        isOpen: false,
      })
      setIsLoading(false);
    }
    
  }

  return (
    <DefaultLayout>
      <Breadcrumb previousPage={true} pageName="Property Verification Requests" />
      {requestDetails ? (
        <div className="mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Info Card */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-gray-900/30 p-6">
                <div className="flex flex-col sm:flex-row items-start gap-6">
                  <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0">
                    <User size={40} className="text-gray-400 dark:text-gray-500" />
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                      <h2 className="text-2xl font-semibold dark:text-white">{requestDetails.name}</h2>
                      {getStatusIcon(requestDetails.status)}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                          <Mail size={16} />
                          <span>{requestDetails.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                          <Phone size={16} />
                          <span>{requestDetails.phone}</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                          <Calendar size={16} />
                          <span>Subminted {requestDetails.submittedDate}</span>
                        </div>
                        {requestDetails.closedDate && (
                          <div className="flex items-center gap-2 font-bold dark:text-white">
                            <BadgeCheck size={16} />
                            <span>Processed on {requestDetails.closedDate}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Documents Section */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-gray-900/30 p-6">
                <h3 className="font-medium mb-4 dark:text-white">Verification Documents</h3>
                <div className="space-y-4">
                  {requestDetails.documents.map((doc, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                    >
                      <div className="flex items-center gap-2">
                        <FileText size={16} className="text-gray-400 dark:text-gray-500" />
                        <div>
                          <div className="text-sm font-medium">
                            <Link 
                              href={doc.contentUrl}
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-600 dark:text-blue-400 hover:underline"
                            >
                              {doc.name}
                            </Link>
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">{doc.date}</div>
                        </div>
                      </div>
                      <span className="hidden sm:flex justify-end items-center text-sm capitalize gap-1">
                        {getStatusIcon(doc.status)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
        
        
            {/* Sidebar */}
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-gray-900/30 p-6">
                <h3 className="font-medium mb-4 dark:text-white">Actions</h3>
                <div className="space-y-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAction('APPROVED', requestDetails.id);
                    }}
                    disabled={requestDetails.status !== 'PENDING'}
                    className={requestDetails.status === 'PENDING'
                      ? "w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-white"
                      : "w-full px-4 py-2 border rounded-lg flex items-center justify-center gap-2 border-gray-200 dark:border-gray-800 bg-gray-100 dark:bg-gray-900/60 text-gray-400 dark:text-gray-600 cursor-not-allowed opacity-80"
                    }
                  >
                    <Building2 size={16} />
                    Approve the request
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAction('DECLINED', requestDetails.id);
                    }}
                    disabled={requestDetails.status !== 'PENDING'}
                    className={requestDetails.status === 'PENDING'
                      ? "w-full px-4 py-2 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-400 rounded-lg flex items-center justify-center gap-2 hover:bg-red-50 dark:hover:bg-red-900/20"
                      : "w-full px-4 py-2 border rounded-lg flex items-center justify-center gap-2 border-gray-200 dark:border-gray-800 bg-gray-100 dark:bg-gray-900/60 text-gray-400 dark:text-gray-600 cursor-not-allowed opacity-80"
                    }
                  >
                    <Trash size={16} />
                    Reject the request
                  </button>
                </div>
              </div>
            </div>
          </div>
        
        
          <Overlay isOpen={actionModal.isOpen} onClose={() =>
            setActionModal({
              type: 'APPROVED',
              isOpen: false,
            })}
          >
            <ActionConfirmationModal
              onClose={() =>
                setActionModal({
                  type: 'APPROVED',
                  isOpen: false,
                })
              }
              onConfirm={handleActionConfirm}
              title={
                actionModal.type === 'APPROVED'
                  ? 'Approve Property Verification'
                  : 'Reject Property Verification'
              }
              type={actionModal.type}
            />
          </Overlay>
          <Overlay isOpen={isLoading} onClose={() => setIsLoading(false)}>
            <ProcessingModal message={loadingMessage} />
          </Overlay>
        </div>
      )
       : 
      (<div className="mx-auto">
        <ProfileVerificationDetailSkeleton />
      </div>)
      }
    </DefaultLayout>
  )
}

export default PropertyDetailView
"use client"
import React, { useEffect, useState } from 'react'
import { ArrowUpRight, Star, Home, Clock } from 'lucide-react'
import { LessorRequestForm } from '@/components/feature/tenants/LessorRequestForm'
import DefaultLayout from '@/components/Layouts/DefaultLayout'
import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb'
import Overlay from '@/components/Overlay'
import { ProfileApplication_T } from '@/types/requestTypes'
import { requestLessorProfile } from '@/actions/requestAction'
import useLocalStorage from '@/hooks/useLocalStorage';
import toast from 'react-hot-toast';
import { ProcessingModal } from '@/components/Modal/ProcessingModal'

const TenantDashboard = () => {
  const [showLessorRequestForm, setShowLessorRequestForm] = useState(false);
  const [profileList, setProfileList] = useLocalStorage("selectedProfile", [] as string []);
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);


  
  const handleSubmitRequest = (async (data: any) => {
    try {
        setShowLessorRequestForm(false);
        setIsLoading(true);
        const application = data as ProfileApplication_T;
        const result =  await requestLessorProfile(application);
        if(result.data){
            setIsLoading(false)
            toast.success("Request submitted successfully", { position: 'bottom-right' });
        } else if(result.error){
            setIsLoading(false)
            console.log('TenantDashBoard.handleSubmitRequest.result.error', result.error);
            toast.error(result.error ?? "An unexpected error occurred", { position: 'bottom-right' });
        }
        console.log('-->result', result)
    } catch (error) {
        console.log("TenantDashBoard.handleSubmitRequest.error", error);
        toast.error("Something went wrong during the process. Try again or contact the administrator")
    } finally {
        setIsLoading(false)
    }
    
  });
  if (!isClient) return null;
  const loadingMessage = 'Submitting request...';


  return (
    <DefaultLayout>
        <Breadcrumb pageName='Dashboard' previousPage={false}/>
        <div className="w-full">
            {
                profileList && !profileList.includes("LANDLORD")
                
                && 

                <div className="flex justify-between items-center mb-6">
                    <button
                        onClick={() => setShowLessorRequestForm(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-[#2A4365] text-white rounded-lg hover:bg-blue-800"
                    >
                        <ArrowUpRight size={20} />
                        Become a Lessor
                    </button>
                </div>
            }
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-blue-50 rounded-lg">
                    <Home className="text-blue-600" size={24} />
                    </div>
                    <div>
                    <h3 className="font-medium">Current Rentals</h3>
                    <p className="text-2xl font-bold">2</p>
                    </div>
                </div>
                </div>
                <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-green-50 rounded-lg">
                    <Star className="text-green-600" size={24} />
                    </div>
                    <div>
                    <h3 className="font-medium">Rental Score</h3>
                    <p className="text-2xl font-bold">4.8</p>
                    </div>
                </div>
                </div>
                <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-purple-50 rounded-lg">
                    <Clock className="text-purple-600" size={24} />
                    </div>
                    <div>
                    <h3 className="font-medium">Pending Applications</h3>
                    <p className="text-2xl font-bold">1</p>
                    </div>
                </div>
                </div>
            </div>

            <Overlay isOpen={showLessorRequestForm} onClose={() => setShowLessorRequestForm(false)}>
                <LessorRequestForm
                    onClose={() => setShowLessorRequestForm(false)}
                    onSubmit={(data) => {handleSubmitRequest(data)}}
                />
            </Overlay>
            <Overlay isOpen={isLoading} onClose={() => {}}>
                <ProcessingModal message={loadingMessage} />
            </Overlay>
            
        </div>
    </DefaultLayout>
  )
}


export default TenantDashboard;
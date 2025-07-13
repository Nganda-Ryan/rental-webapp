"use client"
import React, { useEffect, useState } from 'react'
import { ArrowUpRight, Star, Home, Clock } from 'lucide-react'
import DefaultLayout from '@/components/Layouts/DefaultLayout'
import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb'
import Overlay from '@/components/Overlay'
import { ProfileApplication_T } from '@/types/requestTypes'
import { requestLessorProfile } from '@/actions/requestAction'
import useLocalStorage from '@/hooks/useLocalStorage';
import toast from 'react-hot-toast';
import { ProcessingModal } from '@/components/Modal/ProcessingModal'
import { useRouter } from '@bprogress/next/app'
import { useAuth } from '@/context/AuthContext'
import { IDashBoardParams } from '@/types/Property'
import { dashboard } from '@/actions/assetAction'
import { PROFILE_RENTER_LIST } from '@/constant'
import Link from 'next/link'
import { LessorRequestForm } from '@/components/feature/tenants/LessorRequestForm'
import { roleStore } from '@/store/roleStore'

const TenantDashboard = () => {
    const [showLessorRequestForm, setShowLessorRequestForm] = useState(false);
    const [isClient, setIsClient] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [counts, setCounts] = useState({
        "properties": 0,
        "pendingInvoices": 0,
        "pendingRequests": 0
    })
    const loadingMessage = 'Loading data...';
    const { isAuthorized, user, getProfileCode} = roleStore();
    const router = useRouter();

    useEffect(() => {
        setIsClient(true);
        init();
    }, []);
    useEffect(() => {
        if (!isAuthorized(PROFILE_RENTER_LIST)) {
            router.push("/not-authorized"); // ou page de fallback
        }
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

    const init = async () => {
        const profileCode = getProfileCode("RENTER");
        if(profileCode){
            try {
                setIsLoading(true);
                console.log('-->user', user);
                const params: IDashBoardParams = {
                    offset: 0,
                    page: 1,
                    limit: 1000,
                    profileCode: profileCode,
                    endDate: "",
                    startDate: "",
                    term: "",
                    type: ""
                };
                const result = await dashboard(params);
                console.log('-->result', result);
                if (result.data) {
                    const dashboardData = result.data?.body?.dashboard;
                    if(dashboardData){
                        setCounts({
                            "properties": dashboardData.Counts.properties,
                            "pendingInvoices": dashboardData.Counts.pendingInvoices,
                            "pendingRequests": dashboardData.Counts.pendingRequests
                        });
                    }      
                } else if (result.error) {
                    if (result.code === 'SESSION_EXPIRED') {
                    router.push('/signin');
                    return;
                    }
                    toast.error(result.error ?? "An unexpected error occurred", { position: 'bottom-right' });
                }
            } catch (error) {
                console.log('-->error', error);
            } finally {
                setIsLoading(false);
            }
        }
    }

    if (!isClient) return null;


  return (
    <DefaultLayout>
        <Breadcrumb pageName='Dashboard' previousPage={false}/>
        <div className="w-full">
            {
                
                user?.roles && !user.roles.includes("LANDLORD")
                
                && 

                <div className="flex justify-between items-center mb-6">
                    <button
                        onClick={() => setShowLessorRequestForm(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-[#2A4365] text-white rounded-lg hover:bg-blue-800"
                    >
                        <ArrowUpRight size={20} />
                        Become a Landlord
                    </button>
                </div>
            }
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-6">
                {/* Card 1 */}
                <Link
                    href="/renter/mylisting"
                    className="rounded-lg bg-white dark:bg-gray-800 border border-neutral-300 dark:border-neutral-700 p-6 shadow hover:shadow-md transition-shadow"
                >
                    <div className="flex items-center gap-4">
                    <div className="p-2.5 bg-blue-200 dark:bg-blue-600/30 rounded-md">
                        <Home className="text-blue-700 dark:text-blue-300" size={24} />
                    </div>
                    <div>
                        <h3 className="text-sm text-neutral-600 dark:text-neutral-400 font-medium">Current Rentals</h3>
                        <p className="text-xl font-semibold text-neutral-900 dark:text-white">{counts.properties}</p>
                    </div>
                    </div>
                </Link>

                {/* Card 2 */}
                <div className="rounded-lg bg-white dark:bg-gray-800 border border-neutral-300 dark:border-neutral-700 p-6 shadow hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-4">
                    <div className="p-2.5 bg-green-200 dark:bg-green-600/30 rounded-md">
                        <Star className="text-green-700 dark:text-green-300" size={24} />
                    </div>
                    <div>
                        <h3 className="text-sm text-neutral-600 dark:text-neutral-400 font-medium">Rental Score</h3>
                        <p className="text-xl font-semibold text-neutral-900 dark:text-white">4.8</p>
                    </div>
                    </div>
                </div>

                {/* Card 3 */}
                <Link
                    href="/renter/housing-application"
                    className="rounded-lg bg-white dark:bg-gray-800 border border-neutral-300 dark:border-neutral-700 p-6 shadow hover:shadow-md transition-shadow"  
                
                >
                    <div className="flex items-center gap-4">
                    <div className="p-2.5 bg-purple-200 dark:bg-purple-600/30 rounded-md">
                        <Clock className="text-purple-700 dark:text-purple-300" size={24} />
                    </div>
                    <div>
                        <h3 className="text-sm text-neutral-600 dark:text-neutral-400 font-medium">Pending Applications</h3>
                        <p className="text-xl font-semibold text-neutral-900 dark:text-white">{counts.pendingRequests}</p>
                    </div>
                    </div>
                </Link>
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
"use client"
import React, { useEffect, useState } from 'react'
import { ArrowUpRight, Star, Home, Clock } from 'lucide-react'
import DefaultLayout from '@/components/Layouts/DefaultLayout'
import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb'
import Overlay from '@/components/Overlay'
import { ProfileApplication_T } from '@/types/requestTypes'
import { requestLessorProfile } from '@/actions/requestAction'
import toast from 'react-hot-toast';
import { ProcessingModal } from '@/components/Modal/ProcessingModal'
import { useRouter } from '@bprogress/next/app'
import { IDashBoardParams, ILoan } from '@/types/Property'
import { dashboard } from '@/actions/assetAction'
import { LessorRequestForm } from '@/components/feature/tenants/LessorRequestForm'
import { roleStore } from '@/store/roleStore'
import TenantAssetCard from '@/components/Cards/TenantAssetCard'
import Nodata from '@/components/error/Nodata'
import PropertySkeletonCard from '@/components/skeleton/PropertySkeletonCard'
import PaymentLinkButton from '@/components/PaymentLinkButton'

const TenantDashboard = () => {
    const [showLessorRequestForm, setShowLessorRequestForm] = useState(false);
    const [isClient, setIsClient] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [loanList, setLoanList] = useState<ILoan[]>([]);
    const [isLoading2, setIsLoading2] = useState(false);
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
        console.log('-->user', user)
        setIsClient(true);
        init2();
    }, []);


  
    const handleSubmitRequest = (async (data: any) => {
        try {
            setShowLessorRequestForm(false);
            setIsLoading(true);
            const application = data as ProfileApplication_T;
            const result =  await requestLessorProfile(application);
            if(result.data){
                await init();
                setIsLoading(false);
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

    const handleNavigateToDetail = (_contract: ILoan) => {
        console.log('-->_contract', _contract);
        router.push(`/renter/${_contract.Code}`);
    }

    const handleClickBecomeLessor = async () => {
        setShowLessorRequestForm(true);
    }

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

    const init2 = async () => {
        const profileCode = getProfileCode("RENTER");
        if(profileCode){
        try {
            setIsLoading2(true);
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
            const dashboardData = await dashboard(params);
            console.log('-->result2', dashboardData);
            if (dashboardData.data && dashboardData.data.body.dashboard.Counts.properties > 0) {
                setLoanList(dashboardData.data.body.dashboard.CurrentLoans);
            } else if (dashboardData.error) {
            if (dashboardData.code === 'SESSION_EXPIRED') {
                router.push('/signin');
                return;
            }
            toast.error(dashboardData.error ?? "An unexpected error occurred", { position: 'bottom-right' });
            }
        } catch (error) {
            console.log('-->error', error);
        } finally {
            setIsLoading2(false)
        }
        }
    }
    // Gestionnaires d'événements
    const handlePaymentSuccess = (orderId: string) => {
        console.log('Paiement initié avec succès:', orderId);
        // Ici vous pouvez ajouter de la logique supplémentaire
        // comme envoyer des analytics, logs, etc.
    };

    const handlePaymentError = (error: string) => {
        console.error('Erreur de paiement:', error);
        // Ici vous pouvez afficher une notification d'erreur
        // ou rediriger vers une page d'erreur
    };

    if (!isClient) return null;

    // if (!isAuthorized(PROFILE_RENTER_LIST)) {
    //     router.push("/unauthorized"); // ou page de fallback
    // }

  return (
    <DefaultLayout>
        <Breadcrumb pageName='Dashboard' previousPage={false}/>
        <div className="w-full">
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-8">Exemple d&apos;utilisation PayPal</h1>
                
                {/* Exemple 1: Bouton simple */}
                <div className="mb-8 p-6 border rounded-lg">
                    <h2 className="text-xl font-semibold mb-4">Bouton simple</h2>
                    <PaymentLinkButton 
                    amount="29.99"
                    description="Produit exemple - 29.99€"
                    />
                </div>

                {/* Exemple 2: Avec gestionnaires d'événements */}
                <div className="mb-8 p-6 border rounded-lg">
                    <h2 className="text-xl font-semibold mb-4">Avec gestionnaires d&apos;événements</h2>
                    <PaymentLinkButton 
                    amount="49.99"
                    description="Produit premium"
                    onSuccess={handlePaymentSuccess}
                    onError={handlePaymentError}
                    className="w-full bg-green-600 hover:bg-green-700"
                    />
                </div>

                {/* Exemple 3: Différentes devises */}
                <div className="mb-8 p-6 border rounded-lg">
                    <h2 className="text-xl font-semibold mb-4">Différentes devises</h2>
                    <div className="space-y-4">
                    <PaymentLinkButton 
                        amount="99.99"
                        currency="EUR"
                        description="Produit en Euros"
                    />
                    <PaymentLinkButton 
                        amount="119.99"
                        currency="USD"
                        description="Produit en Dollars"
                    />
                    </div>
                </div>
            </div>
            {
                user?.roles && !user.roles.includes("LANDLORD")
                
                && 

                <div className="flex justify-between items-center mb-6">
                    <button
                        onClick={handleClickBecomeLessor}
                        className="flex items-center gap-2 px-4 py-2 bg-[#2A4365] text-white rounded-lg hover:bg-blue-800"
                    >
                        <ArrowUpRight size={20} />
                        Become a Landlord
                    </button>
                </div>
            }
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                {/* Card 1 */}
                <span
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
                </span>


                {/* Card 2 */}
                <span
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
                </span>
            </div>

            {
                isLoading2 == false ?
                (
                    loanList.length > 0 ? <div className="justify-items-center grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 mt-5">
                    {loanList.map((loan, index) => (loan && <TenantAssetCard loan={loan} key={index} handleClick={handleNavigateToDetail} />))}
                    </div>
                    :
                    (<Nodata />)
                )
                : <div className="justify-items-center grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 mt-5">
                    {Array.from({ length: 4 }).map((_, index) => (<PropertySkeletonCard key={index} />))}
                </div>
            }




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
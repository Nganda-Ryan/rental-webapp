"use client"
import { pricingConfigs } from "@/actions/configsAction";
import { describeMyself, generatePaymentLink, subscribeToPlan, updateUser } from "@/actions/userAction";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import PricingCard from "@/components/Cards/PricingCard";
import LegalInformationSection from "@/components/feature/settings/LegalInformationSection";
import PlanConsumption from "@/components/feature/settings/PlanConsumption";
import SecuritySection from "@/components/feature/settings/SecuritySection";
import LanguageSelector from "@/components/LanguageSelector";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { ProcessingModal } from "@/components/Modal/ProcessingModal";
import Overlay from "@/components/Overlay";
import PrincingCardSkeleton from "@/components/skeleton/PrincingCardSkeleton";
import UserInfoForm from "@/components/UserInfoForm";
import useColorMode from "@/hooks/useColorMode";
import { useConfigStore } from "@/lib/store/configStore";
import { roleStore } from "@/store/roleStore";
import { ProfileDetail } from "@/types/authTypes";
import { PricingResponse } from "@/types/configType";
import { IPlanSubscription } from "@/types/PaymentTypes";
import { IMe } from "@/types/user";
import { useRouter } from "@bprogress/next/app";
import {
  Moon,
  Sun,
  User,
  Globe,
  Mail,
  Phone,
  MapPin,
  Building2,
  Edit2,
  CreditCard,
  ChevronUp,
  ChevronDown,
  Check,
  Cross,
  X,
} from 'lucide-react'
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const Settings = () => {
  const [editingUserInfo, setEditingUserInfo] = useState(false);
  const [colorMode, setColorMode] = useColorMode();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingPrincingInfo, setIsLoadingPrincingInfo] = useState(false);
  const [princingInfo, setPricingInfo] = useState<PricingResponse | null>(null);
  const [me, setMe] = useState<IMe | null>(null);
  const configStore = useConfigStore();

  const [loadingMessage, setLoadingMessage] = useState('Updating profile...');


  const { user, setUser } = roleStore();
  const [userInfo, setUserInfo] = useState<ProfileDetail | undefined>(user)
  const router = useRouter();

  useEffect(() => {
    init();
  }, [])

  const init = async () => {
    try {
      setIsLoadingPrincingInfo(true);

      // Exécuter les deux promesses en parallèle
      const [result, meResult] = await Promise.all([
        pricingConfigs(),
        describeMyself()
      ]);

      console.log('-->meResult', meResult);
      console.log('-->result', result);

      // Gestion des erreurs pour result
      if (result.error) {
        if (result.code === 'SESSION_EXPIRED') {
          router.push('/signin');
          return;
        }
        toast.error(result.error ?? "An unexpected error occurred", { position: 'bottom-right' });
      } else {
        setPricingInfo(result.data);
      }

      // Gestion des erreurs pour meResult
      if (meResult.error) {
        if (meResult.code === 'SESSION_EXPIRED') {
          router.push('/signin');
          return;
        }
        toast.error(meResult.error ?? "An unexpected error occurred", { position: 'bottom-right' });
      } else {
        setMe(meResult.data.body);
      }
    } catch (err) {
      console.error("Erreur dans init:", err);
      toast.error("Une erreur inattendue est survenue", { position: 'bottom-right' });
    } finally {
      setIsLoadingPrincingInfo(false);
    }
  };

  const handleSaveUpdateUserInfo = async (updatedInfo: ProfileDetail) => {
    console.log('-->updatedInfo', {
      avatarUrl: updatedInfo.AvatarUrl,
      firstname: updatedInfo.Firstname,
      lastname: updatedInfo.Lastname,
      phone: updatedInfo.Phone,
      userId: updatedInfo.userId,
    })
    setIsLoading(true)
    const result = await updateUser({
      avatarUrl: updatedInfo.AvatarUrl,
      firstname: updatedInfo.Firstname,
      lastname: updatedInfo.Lastname,
      phone: updatedInfo.Phone,
      userId: updatedInfo.userId,
    });

    console.log('reslt', result)

    if (result.data) {
      setEditingUserInfo(false);
      setUserInfo(updatedInfo);
      setIsLoading(false);
      if(user){
        setUser({
          ...user
        })
      }
      toast.success("Profile updated successfully");
    } else if (result.error) {
      if (result.code === 'SESSION_EXPIRED') {
        router.push('/signin');
        return;
      }
      setIsLoading(false);
      toast.error(result.error ?? "An unexpected error occurred", {
        position: 'bottom-right',
      });
    }
  }

  const buyPlan = async (planId: string, price: number, currency: string) => {
  if (!user) return;

  let endDate = new Date();
  endDate.setDate(endDate.getDate() + 30);

  const payload: IPlanSubscription = {
    referenceCode: "REF-002",
    notes: `User ${user.Firstname} ${user.Lastname} subscribed to plan ${planId}`,
    userId: user.userId,
    planCode: planId,
    startDate: new Date().toISOString().split('T')[0],
    endDate: endDate.toISOString().split('T')[0],
    price,
    currency,
    method: "PAYPAL",
    phoneNumber: user.Phone,
    countryCode: user.Address.Country,
    phoneCode: "+237"
  };

  setIsLoading(true);
  const result = await generatePaymentLink(payload);
  console.log('-->buyPlan.result', result)
  if (result.code === "success") {
    localStorage.setItem('paypal_execute_url', result.data.body.record.executeUrl);
    setIsLoading(false);

    const approvalUrl = result.data.body.record.approvalUrl;
    const popup = window.open(approvalUrl, 'paypalPopup', 'width=600,height=700');

    // Vérifie toutes les 500ms si la popup est fermée
    const timer = setInterval(async () => {
      if (popup && popup.closed) {
        clearInterval(timer);
        const executeUrl = localStorage.getItem('paypal_execute_url');
        if (executeUrl) {
          await fetch(executeUrl, { method: 'POST' });
          alert('Paiement effectué avec succès !');
          localStorage.removeItem('paypal_execute_url');
        }
      }
    }, 500);

  } else {
    setIsLoading(false);
    toast.error("Erreur lors de la création du paiement");
  }
};




  return (
    <DefaultLayout>
      <div className="mx-auto max-w-270">
        <Breadcrumb pageName="Settings" />
        {/* User Information */}
        <div className="bg-white dark:bg-gray-700 rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold flex items-center gap-2 text-gray-900 dark:text-white">
              <User size={20} />
              User Information
            </h2>
            <button
              onClick={() => setEditingUserInfo(!editingUserInfo)}
              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 flex items-center gap-1"
            >
              
              {editingUserInfo ? <X size={16} />: <Edit2 size={16} />}
              {editingUserInfo ? 'Cancel' : 'Edit'}
            </button>
          </div>

          <div className="space-y-4">
            {editingUserInfo && userInfo ? (
              <UserInfoForm
                defaultValues={userInfo}
                onCancel={() => setEditingUserInfo(false)}
                onSubmit={handleSaveUpdateUserInfo}
              />
            ) : (
              (userInfo && <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <User size={16} className="mt-0.5 text-gray-500 dark:text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Full Name</p>
                      <p className="font-medium text-gray-900 dark:text-white">{`${userInfo.Firstname} ${userInfo.Lastname}`}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Mail size={16} className="mt-0.5 text-gray-500 dark:text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                      <p className="font-medium text-gray-900 dark:text-white">{userInfo.Email}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <Phone size={16} className="mt-0.5 text-gray-500 dark:text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
                      <p className="font-medium text-gray-900 dark:text-white">{userInfo.Phone}</p>
                    </div>
                  </div>
                </div>
              </div>)
            )}
          </div>
        </div>

        {/* Consumption */}
        <PlanConsumption />
        {/* Appearance Section  & Preferences */}
        <div className="bg-white dark:bg-gray-700 rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
            <Sun size={20} />
            Appearance & Preferences
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Theme</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Choose your preferred theme</p>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => {
                    if (typeof setColorMode === "function") {
                      setColorMode("light");
                    }
                  }}
                  className={`px-4 py-2 border rounded-lg flex items-center gap-2 
                    ${colorMode === "light" 
                      ? "bg-gray-200 dark:bg-gray-300 text-black" 
                      : "bg-white dark:bg-gray-800 text-gray-800 dark:text-white border-gray-200 dark:border-gray-600"}
                  `}
                >
                  <Sun size={16} />
                  Light
                </button>

                <button 
                  onClick={() => {
                    if (typeof setColorMode === "function") {
                      setColorMode("dark");
                    }
                  }}
                  className={`px-4 py-2 border rounded-lg flex items-center gap-2 
                    ${colorMode === "dark" 
                      ? "bg-gray-600 text-white" 
                      : "bg-gray-800 dark:bg-gray-700 text-white border-gray-700"}
                  `}
                >
                  <Moon size={16} />
                  Dark
                </button>

              </div>
            </div>

            <LanguageSelector />
          </div>
        </div>
        
        {/* Security */}
        <SecuritySection />

        
        {/* Subscription Plans - Redesigned */}
        <div className="bg-white dark:bg-gray-700 rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <CreditCard size={20} />
            Subscription Plans
          </h2>
          <div className="space-y-4">
            {
              isLoadingPrincingInfo ?
                (Array.from({ length: 4 }).map((_, index) => (<PrincingCardSkeleton key={index} />))) 
                : 
                princingInfo && princingInfo?.plans.map(plan => (<PricingCard pricingInfo={plan} currency={princingInfo.default_currency_symbol} currentPlanId="FREE" onBuyClick={buyPlan} key={plan.id} />))
            }

          </div>
        </div>

        {/* Legal & Information */}
        <LegalInformationSection />


        <Overlay isOpen={isLoading} onClose={() => {}}>
          <ProcessingModal message={loadingMessage} />
        </Overlay>
      </div>
    </DefaultLayout>
  );
};

export default Settings;

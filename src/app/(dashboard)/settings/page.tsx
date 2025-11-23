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
    Mail,
    Phone,
    Edit2,
    CreditCard,
    X,
} from 'lucide-react'
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const Settings = () => {
    const [editingUserInfo, setEditingUserInfo] = useState(false);
    const [colorMode, setColorMode] = useColorMode();
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingPrincingInfo, setIsLoadingPrincingInfo] = useState(false);
    const [princingInfo, setPricingInfo] = useState<PricingResponse | null>(null);
    const [me, setMe] = useState<IMe | null>(null);
    const t = useTranslations('Settings');
    const commonT = useTranslations('Common');
    const configStore = useConfigStore();

    const [loadingMessage, setLoadingMessage] = useState(commonT('updatingProfile'));


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

            console.log('-->meResult COMPLET', JSON.stringify(meResult, null, 2));
            console.log('-->result', result);

            // Gestion des erreurs pour result
            if (result.error) {
                if (result.code === 'SESSION_EXPIRED') {
                    router.push('/signin');
                    return;
                }
                toast.error(result.error ?? commonT('unexpectedError'), { position: 'bottom-right' });
            } else {
                setPricingInfo(result.data);
            }

            // Gestion des erreurs pour meResult
            if (meResult.error) {
                if (meResult.code === 'SESSION_EXPIRED') {
                    router.push('/signin');
                    return;
                }
                toast.error(meResult.error ?? commonT('unexpectedError'), { position: 'bottom-right' });
            } else {
                setMe(meResult.data.body.userData);
            }
        } catch (err) {
            console.error("Erreur dans init:", err);
            toast.error(commonT('unexpectedError'), { position: 'bottom-right' });
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
            toast.success(commonT('profileUpdatedSuccessfully'));
        } else if (result.error) {
            if (result.code === 'SESSION_EXPIRED') {
                router.push('/signin');
                return;
            }
            setIsLoading(false);
            toast.error(result.error ?? commonT('unexpectedError'), {
                position: 'bottom-right',
            });
        }
    }

    const buyPlan = async (planId: string, price: number, currency: string) => {
        if (!user) return;

        let endDate = new Date();
        endDate.setDate(endDate.getDate() + 30);

        // Générer un referenceCode unique pour chaque transaction
        const uniqueRef = `REF-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

        const payload: IPlanSubscription = {
            referenceCode: uniqueRef,
            notes: `L'utilisateur ${user.Firstname} ${user.Lastname} a souscrit au plan ${planId}`,
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
        setLoadingMessage(commonT('creatingPaymentLink'));
        const result = await generatePaymentLink(payload);
        console.log('-->buyPlan.result', result);

        if (result.code === "success") {
            const executeUrl = result.data.body.record.executeUrl;
            const approvalUrl = result.data.body.record.approvalUrl;
            const token = result.data.body.record.token;

            // Stocker dans sessionStorage (partagé entre onglets du même domaine)
            sessionStorage.setItem('paypal_execute_url', executeUrl);
            sessionStorage.setItem('paypal_token', token);

            setIsLoading(false);

            const popup = window.open(approvalUrl, 'paypalPopup', 'width=600,height=700');

            // Variable pour stocker le timeout et l'interval
            let checkPopupClosed: NodeJS.Timeout | null = null;
            let initialTimeout: NodeJS.Timeout | null = null;

            // Fonction pour nettoyer tous les listeners et timers
            const cleanupPopup = () => {
                window.removeEventListener('message', handleMessage);
                if (checkPopupClosed) clearInterval(checkPopupClosed);
                if (initialTimeout) clearTimeout(initialTimeout);
            };

            // Écouter les messages de la popup
            const handleMessage = (event: MessageEvent) => {
                // Vérifier l'origine pour la sécurité
                if (event.origin !== window.location.origin) return;

                // La popup demande l'executeUrl
                if (event.data.type === 'REQUEST_EXECUTE_URL') {
                    popup?.postMessage({
                        type: 'EXECUTE_URL',
                        executeUrl: executeUrl
                    }, window.location.origin);
                }

                // La popup a terminé le paiement
                if (event.data.type === 'PAYMENT_COMPLETE') {
                    console.log('Payment completed:', event.data.result);
                    cleanupPopup();

                    // Rafraîchir les données de l'utilisateur ou rediriger
                    toast.success(commonT('paymentSuccess'));
                    // Optionnel : rafraîchir la page ou mettre à jour l'état
                }

                // La popup a rencontré une erreur
                if (event.data.type === 'PAYMENT_ERROR') {
                    console.error('Payment error:', event.data.error);
                    cleanupPopup();
                    toast.error(commonT('paymentError'));
                }
            };

            window.addEventListener('message', handleMessage);

            // Nettoyer l'événement si la popup est fermée manuellement
            // Attendre 5 secondes avant de commencer à vérifier (pour laisser le temps à PayPal de charger)
            initialTimeout = setTimeout(() => {
                checkPopupClosed = setInterval(() => {
                    // Vérifier que la popup existe et qu'elle est fermée
                    if (popup && popup.closed) {
                        cleanupPopup();
                        console.log('Popup closed by user');
                        // toast.info(commonT('paymentCancelled'));
                    }
                }, 2500); // Vérifier toutes les 2.5 secondes au lieu d'1 seconde
            }, 5000); // Attendre 5 secondes avant de commencer la vérification

        } else {
            setIsLoading(false);
            toast.error(commonT('paymentCreationError'));
        }
    };

    // Récupérer le plan le plus récent basé sur StartDate
    const currentPlanId = (() => {
        console.log('-->me?.Subscriptions', me?.Subscriptions);

        if (!me?.Subscriptions || me.Subscriptions.length === 0) {
            console.log('-->Aucune subscription trouvée, retour à FREE');
            return "FREE";
        }

        // Trier les subscriptions par StartDate (plus récent en premier)
        const sortedSubscriptions = [...me.Subscriptions].sort((a, b) => {
            return new Date(b.StartDate).getTime() - new Date(a.StartDate).getTime();
        });

        // Retourner le PlanCode de la subscription la plus récente
        console.log('-->sortedSubscriptions', sortedSubscriptions);
        console.log('-->currentPlanId détecté:', sortedSubscriptions[0].PlanCode);
        return sortedSubscriptions[0].PlanCode;
    })();

    return (
        <DefaultLayout>
            <div className="mx-auto">
                <Breadcrumb pageName={commonT('settings')} />
                {/* User Information */}
                <div className="bg-white dark:bg-gray-700 rounded-lg shadow-sm p-6 mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold flex items-center gap-2 text-gray-900 dark:text-white">
                            <User size={20} />
                            {commonT('userInfo')}
                        </h2>
                        <button
                            onClick={() => setEditingUserInfo(!editingUserInfo)}
                            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 flex items-center gap-1"
                        >
                            
                            {editingUserInfo ? <X size={16} />: <Edit2 size={16} />}
                            {editingUserInfo ? commonT('cancel') : commonT('edit')}
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
                                            <p className="text-sm text-gray-500 dark:text-gray-400">{commonT('fullName')}</p>
                                            <p className="font-medium text-gray-900 dark:text-white">{`${userInfo.Firstname} ${userInfo.Lastname}`}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <Mail size={16} className="mt-0.5 text-gray-500 dark:text-gray-400" />
                                        <div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">{commonT('email')}</p>
                                            <p className="font-medium text-gray-900 dark:text-white">{userInfo.Email}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex items-start gap-2">
                                        <Phone size={16} className="mt-0.5 text-gray-500 dark:text-gray-400" />
                                        <div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">{commonT('phone')}</p>
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
                        {commonT('appearanceAndPreferences')}
                    </h2>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium text-gray-900 dark:text-white">{commonT('theme')}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{t('chooseYourPreferredTheme')}</p>
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
                                    {commonT('light')}
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
                                    {commonT('dark')}
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
                        {commonT('subscriptionPlans')}
                    </h2>
                    <div className="space-y-4">
                        {
                            isLoadingPrincingInfo ?
                                (Array.from({ length: 4 }).map((_, index) => (<PrincingCardSkeleton key={index} />))) 
                                : 
                                princingInfo && princingInfo?.plans.map(plan => (<PricingCard pricingInfo={plan} currency={princingInfo.default_currency_symbol} currentPlanId={currentPlanId} onBuyClick={buyPlan} key={plan.id} />))
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

/*
-->meResult COMPLET {
  "code": null,
  "error": null,
  "data": {
    "code": "200",
    "message": "retrieved successfully",
    "exit": "OK",
    "body": {
      "userData": {
        "Code": "RKEWZb8CLWVPjHezeOTmZKlXH7t2",
        "AddressCode": "ADVYDMAMB386856",
        "Email": "steveloicnganda@gmail.com",
        "Firstname": "Steve Ryan",
        "Gender": "MALE",
        "Lastname": "NGANDA ",
        "NIU": "NIUVYDMAMB38685",
        "OtherEmail": null,
        "OtherPhone": null,
        "Phone": "+237672954087",
        "Status": "ACTIVE",
        "AvatarUrl": "",
        "Profiles": [
          {
            "Code": "RKEWZb8CLWVPjHezeOTmZKlXH7t2@RENTER",
            "Status": "ACTIVE",
            "RoleCode": "RENTER",
            "CreatedAt": "2025-05-02",
            "IsActive": 1,
            "UserCode": "RKEWZb8CLWVPjHezeOTmZKlXH7t2"
          },
          {
            "Code": "RKEWZb8CLWVPjHezeOTmZKlXH7t2@LANDLORD",
            "Status": "ACTIVE",
            "RoleCode": "LANDLORD",
            "CreatedAt": "2025-07-05",
            "IsActive": 1,
            "UserCode": "RKEWZb8CLWVPjHezeOTmZKlXH7t2"
          },
          {
            "Code": "RKEWZb8CLWVPjHezeOTmZKlXH7t2@MANAGER",
            "Status": "ACTIVE",
            "RoleCode": "MANAGER",
            "CreatedAt": "2025-09-03",
            "IsActive": 1,
            "UserCode": "RKEWZb8CLWVPjHezeOTmZKlXH7t2"
          }
        ],
        "Address": {
          "Code": "ADVYDMAMB386856",
          "City": "Yaounde",
          "Country": "CM",
          "Street": "Rue Lamido rey boude",
          "Details": null
        },
        "Subscriptions": [
          {
            "Code": "COOL@RKEWZb8CLWVPjHezeOTmZKlXH7t2",
            "Quantity": "0",
            "StartDate": "2025-08-11",
            "EndDate": "2025-12-15",
            "StatusCode": "ACTIVE",
            "Notes": " ---- Auto created on transaction completed",
            "IsActive": 1,
            "UserCode": "RKEWZb8CLWVPjHezeOTmZKlXH7t2",
            "PlanCode": "COOL",
            "Consumptions": [],
            "Plan": {
              "Code": "COOL",
              "Title": "Cool",
              "Price": 8000,
              "Currency": "XAF",
              "CreatedAt": "2025-06-16 15:03:28",
              "Description": "Pour les investisseurs avec un portefeuille en croissance et des besoins de communication avancés.",
              "IsActive": 1
            }
          },
          {
            "Code": "FREE@RKEWZb8CLWVPjHezeOTmZKlXH7t2",
            "Quantity": "0",
            "StartDate": "2025-05-04T14:09:21.541Z",
            "EndDate": "2025-08-04T07:15:50.400Z",
            "StatusCode": "ACTIVE",
            "Notes": "Basic default free subscription",
            "IsActive": 1,
            "UserCode": "RKEWZb8CLWVPjHezeOTmZKlXH7t2",
            "PlanCode": "FREE",
            "Consumptions": [],
            "Plan": {
              "Code": "FREE",
              "Title": "Gratuit",
              "Price": 0,
              "Currency": "XAF",
              "CreatedAt": "2025-06-16 15:03:28",
              "Description": "Parfait pour démarrer et gérer votre premier bien locatif.",
              "IsActive": 1
            }
          },
          {
            "Code": "RELAX@RKEWZb8CLWVPjHezeOTmZKlXH7t2",
            "Quantity": "0",
            "StartDate": "2025-08-09",
            "EndDate": "2026-09-08",
            "StatusCode": "ACTIVE",
            "Notes": "User Steve Ryan NGANDA  ONANA subscribed to RELAX",
            "IsActive": 1,
            "UserCode": "RKEWZb8CLWVPjHezeOTmZKlXH7t2",
            "PlanCode": "RELAX",
            "Consumptions": [],
            "Plan": {
              "Code": "RELAX",
              "Title": "Relax",
              "Price": 5000,
              "Currency": "XAF",
              "CreatedAt": "2025-06-16 15:03:28",
              "Description": "Idéal pour les propriétaires gérant quelques biens avec un co-utilisateur.",
              "IsActive": 1
            }
          }
        ],
        "Consumptions": [
          {
            "Code": "RKEWZb8CLWVPjHezeOTmZKlXH7t2@PROPERTY_LIMIT",
            "Quantity": 5,
            "CreatedAt": "2025-08-16 16:24:49",
            "ItemCode": "PROPERTY_LIMIT",
            "IsActive": 1,
            "Remaining": 5,
            "UserCode": "RKEWZb8CLWVPjHezeOTmZKlXH7t2",
            "item": {
              "Code": "PROPERTY_LIMIT",
              "Title": "Limite de biens locatifs",
              "IsMesurable": 1,
              "Description": "Le nombre maximum de biens locatifs actifs qu'un utilisateur peut gérer.",
              "IsActive": 1
            }
          },
          {
            "Code": "RKEWZb8CLWVPjHezeOTmZKlXH7t2@TENANT_LIMIT",
            "Quantity": 10,
            "CreatedAt": "2025-08-16 16:24:49",
            "ItemCode": "TENANT_LIMIT",
            "IsActive": 1,
            "Remaining": 10,
            "UserCode": "RKEWZb8CLWVPjHezeOTmZKlXH7t2",
            "item": {
              "Code": "TENANT_LIMIT",
              "Title": "Limite de locataires",
              "IsMesurable": 1,
              "Description": "Le nombre maximum de locataires qu'un utilisateur peut gérer par bien.",
              "IsActive": 1
            }
          },
          {
            "Code": "RKEWZb8CLWVPjHezeOTmZKlXH7t2@USER_LIMIT",
            "Quantity": 9999,
            "CreatedAt": "2025-08-16 16:24:49",
            "ItemCode": "USER_LIMIT",
            "IsActive": 1,
            "Remaining": 9999,
            "UserCode": "RKEWZb8CLWVPjHezeOTmZKlXH7t2",
            "item": {
              "Code": "USER_LIMIT",
              "Title": "Limite d'utilisateurs",
              "IsMesurable": 1,
              "Description": "Le nombre maximum de comptes utilisateurs pouvant accéder à l'espace de travail.",
              "IsActive": 1
            }
          },
          {
            "Code": "RKEWZb8CLWVPjHezeOTmZKlXH7t2@EMAIL_REMINDERS",
            "Quantity": 1,
            "CreatedAt": "2025-08-16 16:24:49",
            "ItemCode": "EMAIL_REMINDERS",
            "IsActive": 1,
            "Remaining": 1,
            "UserCode": "RKEWZb8CLWVPjHezeOTmZKlXH7t2",
            "item": {
              "Code": "EMAIL_REMINDERS",
              "Title": "Rappels par Email",
              "IsMesurable": 0,
              "Description": "Active l'envoi automatique de rappels de paiement par email.",
              "IsActive": 1
            }
          },
          {
            "Code": "RKEWZb8CLWVPjHezeOTmZKlXH7t2@PRO_LEASE_CONTRACT",
            "Quantity": 1,
            "CreatedAt": "2025-08-16 16:24:49",
            "ItemCode": "PRO_LEASE_CONTRACT",
            "IsActive": 1,
            "Remaining": 1,
            "UserCode": "RKEWZb8CLWVPjHezeOTmZKlXH7t2",
            "item": {
              "Code": "PRO_LEASE_CONTRACT",
              "Title": "Contrat de Bail Professionnel",
              "IsMesurable": 0,
              "Description": "Permet de générer des contrats de bail en utilisant des modèles professionnels.",
              "IsActive": 1
            }
          },
          {
            "Code": "RKEWZb8CLWVPjHezeOTmZKlXH7t2@RENTALSCORE_CREDITS",
            "Quantity": 5,
            "CreatedAt": "2025-08-16 16:24:49",
            "ItemCode": "RENTALSCORE_CREDITS",
            "IsActive": 1,
            "Remaining": 5,
            "UserCode": "RKEWZb8CLWVPjHezeOTmZKlXH7t2",
            "item": {
              "Code": "RENTALSCORE_CREDITS",
              "Title": "Crédits RentalScore",
              "IsMesurable": 1,
              "Description": "Le nombre de consultations de RentalScore gratuites par mois.",
              "IsActive": 1
            }
          },
          {
            "Code": "RKEWZb8CLWVPjHezeOTmZKlXH7t2@RENTALHISTORY_CREDITS",
            "Quantity": 5,
            "CreatedAt": "2025-08-16 16:24:49",
            "ItemCode": "RENTALHISTORY_CREDITS",
            "IsActive": 1,
            "Remaining": 5,
            "UserCode": "RKEWZb8CLWVPjHezeOTmZKlXH7t2",
            "item": {
              "Code": "RENTALHISTORY_CREDITS",
              "Title": "Crédits Historique Location",
              "IsMesurable": 1,
              "Description": "Le nombre de consultations d'historiques de location gratuites par mois.",
              "IsActive": 1
            }
          },
          {
            "Code": "RKEWZb8CLWVPjHezeOTmZKlXH7t2@EMAIL_RECEIPTS",
            "Quantity": 1,
            "CreatedAt": "2025-08-16 16:24:49",
            "ItemCode": "EMAIL_RECEIPTS",
            "IsActive": 1,
            "Remaining": 1,
            "UserCode": "RKEWZb8CLWVPjHezeOTmZKlXH7t2",
            "item": {
              "Code": "EMAIL_RECEIPTS",
              "Title": "Reçus par Email",
              "IsMesurable": 0,
              "Description": "Active l'envoi automatique de reçus par email après un paiement.",
              "IsActive": 1
            }
          },
          {
            "Code": "RKEWZb8CLWVPjHezeOTmZKlXH7t2@PRIORITY_SUPPORT",
            "Quantity": 1,
            "CreatedAt": "2025-08-16 16:24:49",
            "ItemCode": "PRIORITY_SUPPORT",
            "IsActive": 1,
            "Remaining": 1,
            "UserCode": "RKEWZb8CLWVPjHezeOTmZKlXH7t2",
            "item": {
              "Code": "PRIORITY_SUPPORT",
              "Title": "Support Prioritaire",
              "IsMesurable": 0,
              "Description": "Accès prioritaire au support client par email ou chat.",
              "IsActive": 1
            }
          },
          {
            "Code": "RKEWZb8CLWVPjHezeOTmZKlXH7t2@SMS_REMINDERS",
            "Quantity": 1,
            "CreatedAt": "2025-11-15 12:33:06",
            "ItemCode": "SMS_REMINDERS",
            "IsActive": 1,
            "Remaining": 1,
            "UserCode": "RKEWZb8CLWVPjHezeOTmZKlXH7t2",
            "item": {
              "Code": "SMS_REMINDERS",
              "Title": "Rappels par SMS",
              "IsMesurable": 0,
              "Description": "Active l'envoi automatique de rappels de paiement par SMS.",
              "IsActive": 1
            }
          },
          {
            "Code": "RKEWZb8CLWVPjHezeOTmZKlXH7t2@ASSISTANCE_TRAINING",
            "Quantity": 1,
            "CreatedAt": "2025-11-15 12:33:06",
            "ItemCode": "ASSISTANCE_TRAINING",
            "IsActive": 1,
            "Remaining": 1,
            "UserCode": "RKEWZb8CLWVPjHezeOTmZKlXH7t2",
            "item": {
              "Code": "ASSISTANCE_TRAINING",
              "Title": "Assistance & Formation",
              "IsMesurable": 0,
              "Description": "Fournit une assistance personnalisée et des sessions de formation sur l'outil.",
              "IsActive": 1
            }
          }
        ]
      },
      "requests": []
    }
  }
}
*/
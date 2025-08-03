"use client"
import React, { useEffect, useState } from "react";
import { MapPin, Zap, X, Send } from "lucide-react";
import { useRouter } from '@bprogress/next/app';
import Image from "next/image";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Overlay from "@/components/Overlay";
import { useParams } from 'next/navigation';
import { applyHouse, getAsset } from "@/actions/assetAction";
import { ApplicationSelectableItem, AssetDataDetailed, IAssetApplication, IPropertyApplication } from "@/types/Property";
import { getStatusBadge } from "@/lib/utils-component";
import { PropertySkeletonPageSection1, RightSideAction } from "@/components/skeleton/pages/PropertySkeletonPage";
import toast from 'react-hot-toast';
import { capitalize, formatNumberWithSpaces } from "@/lib/utils";
import { IMAGE_LOADING_SHIMMER, PROFILE_LANDLORD_LIST } from "@/constant";
import ImageLoading from "@/components/ImageLoading";
import { ProcessingModal } from "@/components/Modal/ProcessingModal";
import SectionWrapper from "@/components/Cards/SectionWrapper";
import Nodata from "@/components/error/Nodata";
import Button from "@/components/ui/Button";
import { SuccessModal } from "@/components/Modal/SucessModal";
import { roleStore } from "@/store/roleStore";
import HousingApplicationModal from "@/components/feature/Properties/HousingApplicationModal";




const PropertyDetail = () => {
  const [asset, setAsset] = useState<AssetDataDetailed | null>(null);

  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showMobileActions, setShowMobileActions] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("Loading...");
  const [showApplyModal, setShowApplyModal] = useState(false);
  const successMessage = "Application sent successfully";

  const params = useParams();
  const router = useRouter();
  const { user, getProfileCode } = roleStore();
  
  
  useEffect(() => {
      init();
  }, []);

  useEffect(() => {
      if (showMobileActions) {
          document.body.style.overflow = 'hidden';
      } else {
          document.body.style.overflow = '';
      }

      return () => {
          document.body.style.overflow = '';
      };
  }, [showMobileActions]);


  const handleApply = async (data: { selected: ApplicationSelectableItem[]; comment: string }) => {
    console.log(data)
    const profileCode = getProfileCode("RENTER");
    if(profileCode){
        if(asset){
            setIsLoading(true);
            setLoadingMessage("Sending application...");
            const payload: IPropertyApplication = {
                assetCode: asset.Code,
                profilCode: profileCode,
                title: asset.Title,
                notes: `Application ${asset.Title}  of ${user?.Lastname} ${user?.Firstname} : ${data.comment}`,
                body: data.selected
            }
            const result = await applyHouse(payload);
            console.log('-->result', result)
            setIsLoading(false);
            if(result.data){
                toast.success("Application sent successfully", { position: 'bottom-right' });
                return;
            } else if (result.error) {
                if (result.code === 'SESSION_EXPIRED') {
                    router.push('/signin');
                    return;
                }
                toast.error(result.error ?? "An unexpected error occurred", { position: 'bottom-right' });
            }
        }
    }
  }
  

  const init = async () => {
    try {
      const result = await getAsset(params.id as string);
      console.log('-->result', result);
      if(result?.data?.body?.assetData) {
        const item = result.data.body.assetData;
        const assetData: AssetDataDetailed  = {
          Code: item.Code,
          Title: item.Title,
          Price: item.Price,
          Currency: item.Currency,
          CoverUrl: item.CoverUrl,
          StatusCode: item.StatusCode,
          IsActive: item.IsActive, // 1 ou 0
          TypeCode: item.TypeCode,
          IsVerified: item.IsVerified, // 1 ou 0
          Permission: result.data.body.ConfigPermissionList.map((item:any) => (item.Code)),
          whoIs: result.data.body.whoIs,
          BillingItems: result.data.body.billingItems.map((item: any) => (item.ItemCode)),
          Units: [],
          Address: {
              Code: item.Address.Code,
              City: item.Address.City,
              Country: item.Address.Country,
              Street: item.Address.Street,
          },
        }
        
        setAsset(assetData)
      } else if(result.error){
        if(result.code == 'SESSION_EXPIRED'){
            router.push('/signin');
            return;
        }
        toast.error(result.error ?? "An unexpected error occurred", { position: 'bottom-right' });
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong during the process. Try again or contact the administrator", { position: 'bottom-right' });
    } finally {
      setIsReady(true);
    }
  }

  return (
      <DefaultLayout>
          <Breadcrumb previousPage pageName={`Property ${asset ? ("- " + capitalize(asset.Title)) : ""}`} />

          <div className="w-full mt-7">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  {
                      isReady ?
                          <>
                              { asset ?
                                  <div className="lg:col-span-2 space-y-4 h-fit">
                                    {/* Property image */}
                                    
                                    <div className="rounded-lg overflow-hidden h-100">
                                        {asset && (!(asset?.CoverUrl == "") || !asset?.CoverUrl) ?
                                            <Image
                                                src={asset!.CoverUrl}
                                                alt={asset!.Title}
                                                className={`h-full w-full object-cover transition-transform duration-500 group-hover:scale-110`}
                                                width={1920}
                                                height={1080}
                                                priority
                                                onError={(e) => console.log('ERROR WHILE LOADING THE IMAGE')}
                                                placeholder={IMAGE_LOADING_SHIMMER}
                                            /> :
                                            <ImageLoading />
                                        }
                                    </div>

                                    {/* Property detail */}
                                    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-100">
                                                    {asset?.Title} {
                                                        asset?.TypeCode !== "CPLXMOD" && `(${formatNumberWithSpaces(asset?.Price)}/${asset?.Currency})`
                                                    }
                                                </h2>
                                                <div className="flex items-center text-gray-800 dark:text-gray-100">
                                                    <MapPin size={16} className="mr-1" />
                                                    <span>{`${asset?.Address.City}, ${asset?.Address.Street}`}</span>
                                                </div>
                                            </div>
                                            <span>
                                                {getStatusBadge(asset?.StatusCode ?? 'DRAFT')}
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-4 gap-4 py-4 border-t border-gray-100 dark:border-gray-700">
                                            {asset?.BillingItems.map((item) => (
                                            <div
                                                key={item}
                                                className="px-4 py-2 bg-gray-50 dark:bg-gray-700 rounded-lg text-sm text-gray-800 dark:text-gray-100"
                                            >
                                                {item}
                                            </div>
                                            ))}
                                        </div>
                                    </div>
                                  </div>
                                  :  
                                  <div className="lg:col-span-2 space-y-6 h-fit">
                                      <Nodata />
                                  </div>
                              }
                          </>
                      :
                      <PropertySkeletonPageSection1 />
                  }
                      
                  {/* SIDE SECTION */}
                  <div className="space-y-6">
                      { isReady ? 
                          <div>
                              {/* ACTIONS */}
                              <div className="hidden lg:block">
                                  <SectionWrapper title="Quick Actions" Icon={Zap}>
                                      <Button onClick={() => {setShowApplyModal(true)}} variant='neutral' disable={false} isSubmitBtn={false}>
                                        <Send size={16} /> Apply
                                      </Button>
                                  </SectionWrapper>
                              </div>
                          </div> : 
                          <RightSideAction />
                      }

                      
                  </div>
              </div>

              {/* Drawer d’actions pour mobile */}
              <div className={`fixed inset-0 z-50 lg:hidden ${showMobileActions ? "pointer-events-auto" : "pointer-events-none"}`}
                role="dialog"
                aria-modal="true"
              >
                {/* Overlay */}
                <div
                    className={`
                    absolute inset-0 bg-black bg-opacity-40 backdrop-blur-sm
                    transition-opacity duration-300 ease-linear
                    ${showMobileActions ? "opacity-100" : "opacity-0"}
                    `}
                    onClick={() => setShowMobileActions(false)}
                />

                {/* Drawer - slide up/down */}
                <div
                    className={`
                    absolute bottom-0 left-0 right-0 bg-white dark:bg-gray-900 rounded-t-2xl p-4 shadow-lg
                    transform transition-transform duration-300 ease-linear
                    ${showMobileActions ? "translate-y-0" : "translate-y-full"}
                    `}
                >
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Quick Actions</h2>
                        <button onClick={() => setShowMobileActions(false)} className="text-gray-500 hover:text-gray-800 dark:hover:text-white" aria-label="Close drawer">
                            <X size={24} />
                        </button>
                    </div>

                    {/* MOBILE ACTIONS */}
                    <div className="space-y-3 mb-20">
                        <Button onClick={() => {setShowApplyModal(true)}} variant='neutral' disable={false} isSubmitBtn={false}>
                          <Send size={16} /> Apply
                        </Button>
                    </div>
                </div>
              </div>

              {/* FAB pour mobile */}
              {!showMobileActions && (
                  <button onClick={() => setShowMobileActions(true)} aria-label="Show quick actions" className={`fixed bottom-9 right-6 z-50 bg-[#2A4365] text-white p-2 rounded-full shadow-lg hover:bg-blue-700 active:scale-95 duration-300 ease-linear lg:hidden`}  >
                      <Zap size={24} />
                  </button>
              )}
              
              <Overlay isOpen={isLoading} onClose={() => { }}>
                  <ProcessingModal message={loadingMessage} />
              </Overlay>
              <Overlay isOpen={showApplyModal} onClose={() => { setShowApplyModal(false) }}>
                  <HousingApplicationModal onClose={() => { setShowMobileActions(false); setShowApplyModal(false) }} onSubmit={handleApply}/>
              </Overlay>
              <Overlay isOpen={showSuccessModal} onClose={() => setShowSuccessModal(false)}>
                  <SuccessModal
                      onClose={() => setShowSuccessModal(false)}
                      message={successMessage}
                  />
              </Overlay>
          </div>
      </DefaultLayout>
  );
};

export default PropertyDetail;


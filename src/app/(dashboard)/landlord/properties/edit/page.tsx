"use client"
import React, { useEffect, useState } from "react";
import { Building2 } from "lucide-react";
import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb'
import DefaultLayout from '@/components/Layouts/DefaultLayout';
import { getNames, getCode } from 'country-list';
import { Select } from '@/components/ui/Select'; 
import { Controller, useForm  } from "react-hook-form";
import { AssetDataDetailed, IUpdateAssetRequest } from "@/types/Property";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react';
import Button from '@/components/ui/Button';
import Overlay from '@/components/Overlay';
import { SuccessModal } from '@/components/Modal/SucessModal';
import { getAsset, updateAsset } from '@/actions/assetAction';
import toast from 'react-hot-toast';
import { useRouter } from '@bprogress/next/app';
import { ProcessingModal } from '@/components/Modal/ProcessingModal';
import { useAuth } from '@/context/AuthContext';
import { PROFILE_LANDLORD_LIST, PROPERTY_TYPE_OBJ_CODE } from '@/constant';
import { useSearchParams } from 'next/navigation';
import { set } from "zod";


const countryOptions = getNames()
.map((name) => ({
  label: name,
  value: getCode(name),
}))
.filter((option) => option.value !== undefined) as { label: string; value: string }[]


const Page = () => {
  const [imagePreview, setImagePreview] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<{ label: string; value: string } | null>(null);
  const [loadingMessage, setLoadingMessage] = useState("Loading property datas...");
  const [asset, setAsset] = useState<AssetDataDetailed | null>(null);
  const [tabIndex, setTabIndex] = useState(0);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthorized, loadingProfile } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const propertyId = searchParams.get('propertyId');

  const {
    control,
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<IUpdateAssetRequest>();

  const typeCode = watch('typeCode');

  useEffect(() => {
    console.log('-->propertyId', propertyId);
    init();
  }, [])

  useEffect(() => {
    if (asset) {
      reset({
        code: asset.Code,
        typeCode: asset.TypeCode,
        title: asset.Title,
        notes: asset.Notes,
        price: asset.Price,
        currency: asset.Currency,
        coverUrl: asset.CoverUrl,
        tag: [],
        addressData: {
          city: asset.Address.City,
          country: asset.Address.Country,
          street: asset.Address.Street,
        },
      });
      if (asset?.CoverUrl) {setImagePreview(asset.CoverUrl);}
    }
  }, [asset, reset]);

  useEffect(() => {
    if (selectedFile) {
      setImagePreview(URL.createObjectURL(selectedFile));
    }
  }, [selectedFile]);

  const init = async () => {
    try {
      setIsLoading(true);
      const result = await getAsset(propertyId as string);
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
          Tag: item.Tag,
          Notes: item.Notes,
          Address: {
              Code: item.Address.Code,
              City: item.Address.City,
              Country: item.Address.Country,
              Street: item.Address.Street,
          },
        }
        console.log('-->assetData', assetData);
        
        setAsset(assetData)
        reset({
          code: assetData.Code,
          typeCode: assetData.TypeCode,
          title: assetData.Title,
          notes: assetData.Notes,
          price: assetData.Price,
          currency: assetData.Currency,
          coverUrl: assetData.CoverUrl,
          tag: item.Tag,
          addressData: {
            city: assetData.Address.City,
            country: assetData.Address.Country,
            street: assetData.Address.Street,
          },
        });
        if (assetData.CoverUrl) {setImagePreview(assetData.CoverUrl);}
      } else if(result.error){
        if(result.code == 'SESSION_EXPIRED'){
            router.push('/signin');
            return;
        }
        toast.error(result.error ?? "An unexpected error occurred", { position: 'bottom-right' });
      }
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false);
    }
  }

  const successMessage = "Property updated successfully";

  const handleFormValidSubmit = async (data: IUpdateAssetRequest) => {
    setIsLoading(true);
    setLoadingMessage("Updating property...");
    console.log("Form data:", data);
    try {
      const result =  await updateAsset(data);
      console.log('-->Result', result);
      if(result.data){
        setShowSuccessModal(true);
        router.push(`/landlord/properties/${propertyId}`);
      } else if(result.error){
        if(result.code == 'SESSION_EXPIRED'){
            router.push('/signin');
            return;
        }
        toast.error(result.error ?? "An unexpected error occurred", { position: 'bottom-right' });
      } else {
      }
    } catch (error) {
      toast.error("Something went wrong during the process. Try again or contact the administrator", { position: 'bottom-right' });
      console.log('-->ContractDetailPage.handleUpsertInvoice.error', error);
    } finally {
      setIsLoading(false);
      setLoadingMessage("Loading property datas...");
    }
  };
  

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };


  if (!loadingProfile && !isAuthorized(PROFILE_LANDLORD_LIST)) {
      return <div>Unauthorized</div>;
  }


  return (
    <DefaultLayout>
      <Breadcrumb pageName="Locatif / Edit" previousPage />
      <div className="border border-stroke dark:border-strokedark min-h-150 bg-white dark:bg-boxdark shadow-default rounded-md max-w-7xl">
        <div className="w-full max-w-6xl p-4 mx-auto relative min-h-96">
          <form onSubmit={handleSubmit(handleFormValidSubmit)}>
            <TabGroup selectedIndex={tabIndex} onChange={setTabIndex} className="mx-auto">
              
              {/* Header personnalisé des tabs */}
              <TabList className="flex gap-4 border-b border-gray-200 dark:border-gray-700 pb-2 mb-4">
                <Tab
                  key="Basic Information"
                  className="rounded-t-lg px-4 py-2 text-sm font-semibold transition bg-primary text-white dark:bg-primaryDark dark:text-white shadow"
                >
                  Basic Information
                </Tab>
              </TabList>

              <TabPanels className="mt-3 mb-20">
                <TabPanel unmount={false}>
                  {/* Basic Information */}
                  <div className="space-y-4">

                    <div className="flex flex-col sm:flex-row gap-4">
                      {/* Image Preview */}
                      <div className="flex flex-col w-full">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Property Image
                        </label>
                        <div className="w-full h-40 flex bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden flex-shrink-0">
                          {imagePreview ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={imagePreview}
                              alt="Property"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500">
                              <Building2 size={40} />
                            </div>
                          )}
                        </div>
                        <div>
                          <label className="block mx-auto mt-2">
                            <input
                              type="file"
                              className={`
                                block text-sm text-gray-500
                                file:mr-4 file:py-1.5 file:px-4
                                border rounded
                                file:rounded file:border-0
                                file:text-sm file:font-medium
                                file:bg-blue-50 file:text-blue-700
                                hover:file:bg-blue-100 ${errors.coverUrl && "border border- border-red-600"}
                                dark:file:bg-blue-900 dark:file:text-white
                                dark:hover:file:bg-blue-800  
                              `}
                              accept="image/*"
                              {...register("coverUrl")}
                              onChange={handleFileChange}
                            />
                            <span className="sr-only">Choose photo</span>
                          </label>
                        </div>
                      </div>

                      {/* Location Info */}
                      <div className="flex flex-col justify-between w-full">
                        <div className="flex flex-col">
                          <label className="mb-1 text-sm text-gray-700 dark:text-gray-300">Country</label>
                          <Controller
                            name="addressData.country"
                            control={control}
                            render={({ field }) => (
                              <Select
                                options={countryOptions}
                                value={countryOptions.find(option => option.value === field.value) ?? null}
                                onChange={(selectedOption) => {
                                  field.onChange(selectedOption?.value);
                                  setSelectedCountry(selectedOption || null);
                                }}
                                placeholder="Select a country"
                              />
                            )}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">City</label>
                          <input
                            {...register("addressData.city", { required: "The city is required" })}
                            type="text"
                            className="w-full px-3 py-1.5 border border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          {errors.addressData?.city && (
                            <p className="text-sm text-red-500">{errors.addressData?.city.message}</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Street</label>
                          <input
                            {...register("addressData.street", { required: "The street is required" })}
                            type="text"
                            className="w-full px-3 py-1.5 border border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          {errors.addressData?.street && (
                            <p className="text-sm text-red-500">{errors.addressData.street.message}</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* SECTION 2 */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Property Name
                        </label>
                        <input
                          type="text"
                          {...register("title", { required: "The name is required" })}
                          className="w-full px-3 py-1.5 h-10 border border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="123 Main Street"
                        />
                        {errors.title && (
                          <p className="text-sm text-red-500">{errors.title.message}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Property type
                        </label>
                        <select
                          {...register("typeCode", { required: "Please select the property type" })}
                          id="propertyType"
                          className="w-full px-3 py-1.5 h-10 border border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Select a Property Type</option>
                          {
                            PROPERTY_TYPE_OBJ_CODE.map((propType, index) =>(
                              <option key={index} value={propType.value}>{propType.label}</option>
                            ))
                          }
                        </select>
                        {errors.typeCode && (
                          <p className="text-sm text-red-500">{errors.typeCode.message}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          {!(typeCode == "CPLXMOD") ? "Price" : "Default Unit Price"}
                        </label>
                        <input
                          {...register("price", { required: "example : 10" })}
                          type="number"
                          id='price'
                          className="w-full px-3 py-1.5 border border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.price && (
                          <p className="text-sm text-red-500">{errors.price.message}</p>
                        )}
                      </div>
                      
                      {!(typeCode == "CPLXMOD") && <div></div>}
                      <div className="space-y-4 ">
                        <h3 className="font-medium text-gray-800 dark:text-gray-200">Description</h3>
                        <textarea
                          className="w-full px-3 py-1.5 border border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          rows={4}
                          {...register("notes")}
                          placeholder="Describe the property..."
                          defaultValue={""}
                        />
                      </div>

                      <div className="space-y-4 ">
                        <h3 className="font-medium text-gray-800 dark:text-gray-200">Tag</h3>
                        <textarea
                          className="w-full px-3 py-1.5 border border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          rows={4}
                          {...register("tag")}
                          placeholder="Tags..."
                          defaultValue={""}
                        />
                      </div>
                    </div>
                  </div>
                </TabPanel>
              </TabPanels>
            </TabGroup>
            <div className='mt-5 flex gap-5 justify-center absolute mb-10 bottom-0 left-0 right-0'>
              <div className='flex gap-2 justify-start'>
              </div>
              <Button variant='info' disable={false} isSubmitBtn fullWidth={false}>
                Finished
              </Button>
            </div>
          </form>

          <Overlay isOpen={showSuccessModal} onClose={() => setShowSuccessModal(false)}>
            <SuccessModal
                onClose={() => setShowSuccessModal(false)}
                message={successMessage}
            />
          </Overlay>

          <Overlay isOpen={isLoading} onClose={() => {}}>
            <ProcessingModal message={loadingMessage} />
          </Overlay>
        </div>
      </div>

      
    </DefaultLayout>
  );
};

export default Page;
"use client"
import React, { useEffect, useState } from "react";
import { Building2 } from "lucide-react";
import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb'
import DefaultLayout from '@/components/Layouts/DefaultLayout';
import { useForm, useFieldArray, Controller  } from "react-hook-form";
import { AssetFormValue, CreatePropertyType, SubProperty2 } from "@/types/Property";
import { Dropdown } from "@/components/ui/Dropdown";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react';
import Button from '@/components/ui/Button';
import Overlay from '@/components/Overlay';
import { SuccessModal } from '@/components/Modal/SucessModal';
import { createAsset } from '@/actions/assetAction';
import toast from 'react-hot-toast';
import { useRouter } from '@bprogress/next/app';
import { ProcessingModal } from '@/components/Modal/ProcessingModal';
import { useConfigStore } from "@/lib/store/configStore";
import { ICity, IState, IStreet } from "@/types/configType";
import { Select } from "@/components/ui/Select";
import { useTranslations } from "next-intl";
import { useTranslatedConstants } from '@/hooks/useTranslatedConstants';





const Page = () => {
  const [imagePreview, setImagePreview] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isCplxAsset, setIsCplxAsset] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);
  const [manualRemoval, setManualRemoval] = useState(false);
  const [filteredStates, setFilteredStates] = useState<IState[]>([]);
  const [filteredCities, setFilteredCities] = useState<ICity[]>([]);
  const [filteredStreets, setFilteredStreet] = useState<IStreet[]>([]);
  const [dropdownOpenList, setDropdownOpenList] = useState<boolean[]>([]);
  const [selectedPropertyType, setSelectedPropertyType] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const router = useRouter();
  const configStore = useConfigStore();
  const landlordT = useTranslations('Landlord.assets');
  const commonT = useTranslations('Common');
  const { BILLING_ITEM_TYPE_OBJ_LIST, PROPERTY_TYPE_OBJ_LIST } = useTranslatedConstants();
  
  const {
    control,
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      country: "",
      state: "",
      propertyName: "",
      propertyType: "", 
      city: "",
      street: "",
      description: "",
      billingItem: [],
      rent: 0, 
      test:"",
      UnitsType: PROPERTY_TYPE_OBJ_LIST[1]?.value,
      UnitsKey: "Unit",
      numberOfUnit: 1,
      UnitsDefaultPrice: 0,
      currency: "FCFA",
      price: 0,
      cover: null as unknown as File,
      tag: "",
      UnitList: [] as SubProperty2[]
    },
  });

  const fieldToTab: { [key: string]: number } = {
    country: 0,
    propertyName: 0,
    propertyType: 0,
    city: 0,
    cover: 0,
    street: 0,
    description: 0,
    UnitsType: 0,
    billingItem: 1,
    rent: 1,
    numberOfUnit: 2,
    UnitList: 2,
  };

  const { fields, append, remove } = useFieldArray({
    control,
    name: "UnitList"
  });

  const numberOfSubAsset = watch('numberOfUnit');
  const unitList = watch("UnitList");

  useEffect(() => {
    // Skip this effect if we're manually removing a subProperty
    if (manualRemoval) {
      setManualRemoval(false);
      return;
    }

    const currentLength = fields.length;
    const desiredLength = Number(numberOfSubAsset) || 0;
    setDropdownOpenList(Array(desiredLength).fill(false));
    if (desiredLength > currentLength) {
      for (let i = currentLength; i < desiredLength; i++) {
        append({
          "typeCode": "",
          "title": "",
          "notes": "",
          "price": 0,
          "currency": "",
          "coverUrl": "",
          "tag": "",
          "description": []
        });
      }
    } else if (desiredLength < currentLength) {
      for (let i = currentLength; i > desiredLength; i--) {
        remove(i - 1);
      }
      setValue("numberOfUnit", desiredLength);
    }
  }, [numberOfSubAsset, append, remove, fields.length, manualRemoval, setValue]);

  useEffect(() => {
    const currentFields = watch("UnitList");
    console.log('-->Unit Key', watch("UnitsKey"));
    console.log('-->currentFields', currentFields);
    const newFields = currentFields.map((field, index) => ({
      ...field,
      typeCode: watch("UnitsType") || "",
      price: Number(watch("UnitsDefaultPrice")) || 0,
      title: `${watch("UnitsKey") || "Unit"} - ${index + 1}`,
      currency: `${watch("currency") || "FCFA"}`
    }));
  
    newFields.forEach((updatedField, index) => {
      setValue(`UnitList.${index}`, updatedField);
    });
  }, [setValue, watch]);

  useEffect(() => {
    // Ce useEffect pourrait vérifier la valeur de l'input et l'appliquer lors de l'onglet actif
    if (selectedFile) {
      setImagePreview(URL.createObjectURL(selectedFile));
    }
  }, [selectedFile]);


  const selectedCountry = watch('country')
  const selectedState = watch('state')
  const selectedCity = watch('city')

  // Filtrage dynamique
  useEffect(
    () => {
      console.log('country changed', selectedCountry)
      const filteredStates = configStore.state.filter((s) => (s. country_id == configStore.country.find((c) => c.sortname === selectedCountry)?.id))
      console.log('--->filteredStates', filteredStates);
      setFilteredStates(filteredStates);
    },
    [configStore.country, configStore.state, selectedCountry]
  )

  useEffect(
    () => {
      console.log('-->selectedState', selectedState)
      setFilteredCities(configStore.city.filter((c) => c.state_id === selectedState))
    },
    [configStore.city, selectedState]
  )

  useEffect(
    () => {
      console.log('-->selectedState', selectedCity)
      setFilteredStreet(configStore.street.filter((s) => s.city_id === selectedCity))
    },
    [configStore.street, selectedCity]
  )
  


  const handleFormValidSubmit = async (data: AssetFormValue) => {
    try {
      const payload: CreatePropertyType = {
        addressData: {
          city: configStore.city.find((c) => c.id === data.city)?.name ?? "",
          country: configStore.country.find((c) => c.sortname === data.country)?.name ?? "",
          street: configStore.street.find((s) => s.id === data.street)?.name ?? "",
        },
        billingItems: data.billingItem,
        coverUrl: "",
        currency: data.currency,
        items: data.propertyType == "STUDMOD" ? [] : data.UnitList.map((i) => {
          const tag = i.tag;
          return {
            ...i,
            tag: i.tag.length > 0 ? i.tag.split(';') : []
          }
        }),
        notes: data.description,
        price: data.price,
        tag: data.tag.length > 0 ? data.tag.split(';') : [],
        title: data.propertyName,
        typeCode: data.propertyType
      }
      console.log("Données valides :", payload);
      console.log("data :", data);
      setSuccessMessage(`Votre propriété ${payload.title} a été crée avec succès`);
      setLoadingMessage(`${payload.title} is creating ...`);
      setIsLoading(true);
      const result = await createAsset(payload, data.cover);
      if(result.asset){
        setShowSuccessModal(true);
        toast.success(`Votre propriété ${payload.title} a été crée avec succès`, { position: 'bottom-right' });
        const asset = result.asset.body.asset;
        router.push(`/landlord/properties/${asset.Code}`)
      } else {
        toast.error(result.error, { position: 'bottom-right' });
        console.log('-->Result error', result)
      }
      console.log("-->result :", result);
    } catch (error) {
      console.log('-->NewAsset.handleFormValidSubmit', error)
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleFormInvalidSubmit = (errors: any) => {
    console.log("Erreurs du formulaire :", errors);
  
    const firstFieldWithError = Object.keys(errors)[0];
    const tabOfField = fieldToTab[firstFieldWithError];
    console.log('firstFieldWithError', firstFieldWithError);
    console.log('tabOfField', tabOfField);
    if (tabOfField !== undefined) {
      setTabIndex(tabOfField);
    }
  
    // Ouvre le dropdown correspondant si erreur dans UnitList
    if (errors.UnitList) {
      const openStates = [...dropdownOpenList];
      errors.UnitList.forEach((item: any, index: number) => {
        if (item) {
          openStates[index] = true;
        }
      });
      setDropdownOpenList(openStates);
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

  const handlePropertyTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPropertyType(e.target.value);
    if(e.target.value == "CPLXMOD"){
      setIsCplxAsset(true);
    } else {
      setIsCplxAsset(false);
    }
    setValue("propertyType", e.target.value, { shouldValidate: true });
  }

  const categories = [
    landlordT('basicInformationTab'),
    landlordT('billingItemsTab'),
    ...(isCplxAsset ? [landlordT('unitsTab')] : [])
  ];

  const handleRemoveSubProperty = (index: number) => {
    setManualRemoval(true);
    remove(index);
    setValue("numberOfUnit", fields.length - 1);
  }



  return (
    <DefaultLayout>
      <Breadcrumb pageName="Locatif / nouveau" />
      <div className="border border-stroke dark:border-strokedark min-h-150 bg-white dark:bg-boxdark shadow-default rounded-md max-w-7xl">
        <div className="w-full max-w-6xl p-4 mx-auto relative min-h-96">
          <form onSubmit={handleSubmit(handleFormValidSubmit, handleFormInvalidSubmit)}>
            <TabGroup selectedIndex={tabIndex} onChange={setTabIndex} className="mx-auto">
              
              {/* Header personnalisé des tabs */}
              <TabList className="flex gap-4 border-b border-gray-200 dark:border-gray-700 pb-2 mb-4">
                {categories.map((name) => (
                  <Tab
                    key={name}
                    className={({ selected }) =>
                      `rounded-t-lg px-4 py-2 text-sm font-semibold transition
                      ${
                        selected
                          ? 'bg-primary text-white dark:bg-primaryDark dark:text-white shadow'
                          : 'text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-white'
                      }`
                    }
                  >
                    {name}
                  </Tab>
                ))}
              </TabList>

              <TabPanels className="mt-3 mb-20">
                  <TabPanel unmount={false}>
                    {/* Basic Information */}
                    <div className="space-y-4">

                      <div className="flex flex-col sm:flex-row gap-4">
                        {/* Image Preview */}
                        <div className="flex flex-col w-full">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            {landlordT('image')}
                          </label>
                          <div className="w-full h-49 flex bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden flex-shrink-0">
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
                                  hover:file:bg-blue-100 ${errors.cover && "border border- border-red-600"}
                                  dark:file:bg-blue-900 dark:file:text-white
                                  dark:hover:file:bg-blue-800  
                                `}
                                accept="image/*"
                                {...register("cover", { required: "Please select a Cover" })}
                                onChange={handleFileChange}
                              />
                              <span className="sr-only">{landlordT('choosePhoto')}</span>
                            </label>
                          </div>
                        </div>

                        {/* Location Info */}
                        <div className="flex flex-col justify-between w-full">
                          <div className="flex flex-col">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{landlordT('country')}</label>
                            <Controller
                              name="country"
                              control={control}
                              render={({ field }) => (
                                <Select
                                  options={configStore.country.map(c => ({ label: c.name, value: c.sortname }))}
                                  value={configStore.country.map(c => ({ label: c.name, value: c.sortname })).find(c => c.value === field.value) ?? null}
                                  onChange={(selectedOption) => {
                                    field.onChange(selectedOption?.value);
                                  }}
                                  placeholder={landlordT('selectCountry')}
                                />
                              )}
                              rules={{ required: landlordT('theCountryIsRequired') }}
                            />
                            {errors.country && (
                              <p className="text-sm text-red-500">{errors.country.message}</p>
                            )}
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{landlordT('state')}</label>
                            <Controller
                              name="state"
                              control={control}
                              rules={{ required: landlordT('theStateIsRequired') }}
                              render={({ field }) => (
                                <Select
                                  options={filteredStates.map(c => ({ label: c.name, value: c.id }))}
                                  value={filteredStates.map(c => ({ label: c.name, value: c.id })).find(c => c.value === field.value) ?? null}
                                  onChange={(selectedOption) => {
                                    field.onChange(selectedOption?.value);
                                  }}
                                  placeholder={landlordT('selectState')}
                                />
                              )}
                            />
                            {errors.state && (
                              <p className="text-sm text-red-500">{errors.state.message}</p>
                            )}
                          </div>
                          <div className="flex flex-col">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{landlordT('city')}</label>
                            <Controller
                              name="city"
                              control={control}
                              rules={{ required: landlordT('theCityIsRequired') }}
                              render={({ field }) => (
                                <Select
                                  options={filteredCities.map(c => ({ label: c.name, value: c.id }))}
                                  value={filteredCities.map(c => ({ label: c.name, value: c.id })).find(c => c.value === field.value) ?? null}
                                  onChange={(selectedOption) => {
                                    field.onChange(selectedOption?.value);
                                  }}
                                  placeholder={landlordT('selectCity')}
                                />
                              )}
                            />
                            {errors.city && (
                              <p className="text-sm text-red-500">{errors.city.message}</p>
                            )}
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{landlordT('street')}</label>
                            <Controller
                              name="street"
                              rules={{ required: landlordT('theStreetIsRequired') }}
                              control={control}
                              render={({ field }) => (
                                <Select
                                  options={filteredStreets.map(c => ({ label: c.name, value: c.id }))}
                                  value={filteredStreets.map(c => ({ label: c.name, value: c.id })).find(c => c.value === field.value) ?? null}
                                  onChange={(selectedOption) => {
                                    field.onChange(selectedOption?.value);
                                  }}
                                  placeholder={landlordT('selectStreet')}
                                />
                              )}
                            />
                            {errors.street && (
                              <p className="text-sm text-red-500">{errors.street.message}</p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* SECTION 2 */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            {landlordT('propertyName')}
                          </label>
                          <input
                            type="text"
                            {...register("propertyName", { required: landlordT('theNameIsRequired') })}
                            className="w-full px-3 py-1.5 h-10 border border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="123 Main Street"
                          />
                          {errors.propertyName && (
                            <p className="text-sm text-red-500">{errors.propertyName.message}</p>
                          )}
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            {landlordT('propertyType')}
                          </label>
                          <select
                            {...register("propertyType", { required: landlordT('pleaseSelectThePropertyType') })}
                            id="propertyType"
                            onChange={(e) => {
                              handlePropertyTypeChange(e);
                            }}
                            className="w-full px-3 py-1.5 h-10 border border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="">{landlordT('selectPropertyType')}</option>
                            {
                              PROPERTY_TYPE_OBJ_LIST.map((propType, index) =>(
                                <option key={index} value={propType.value}>{propType.label}</option>
                              ))
                            }
                          </select>
                          {errors.propertyType && (
                            <p className="text-sm text-red-500">{errors.propertyType.message}</p>
                          )}
                        </div>
                        {
                          !isCplxAsset 
                          &&
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              {landlordT('price')}
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
                        }
                        {/* Sub properties config */}
                        {
                          isCplxAsset 
                          &&
                          (<div className='rounded p-2 shadow-inner bg-indigo-50 dark:bg-black col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-2'>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{landlordT('numberOfUnits')}</label>
                              <input
                                {...register("numberOfUnit", { required: landlordT('example10') })}
                                type="number"
                                className="w-full px-3 py-1.5 border border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                              {errors.numberOfUnit && (
                                <p className="text-sm text-red-500">{errors.numberOfUnit.message}</p>
                              )}
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{landlordT('prefixKey')}</label>
                              <input
                                {...register("UnitsKey", { required: landlordT('theCityIsRequired') })}
                                type="text"
                                placeholder={landlordT('exampleStu')}
                                className="w-full px-3 py-1.5 border border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                              {errors.UnitsKey && (
                                <p className="text-sm text-red-500">{errors.UnitsKey.message}</p>
                              )}
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                {landlordT('subPropertyType')}
                              </label>
                              <select
                                {...register("UnitsType", { required: landlordT('selectUnitType') })}
                                id="UnitsType"
                                defaultValue={PROPERTY_TYPE_OBJ_LIST[1]?.value}
                                className="w-full px-3 py-1.5 h-10 border border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                              >
                                {
                                  PROPERTY_TYPE_OBJ_LIST.slice(1).map((propType, index) =>(
                                    <option key={index} value={propType.value}>{propType.label}</option>
                                  ))
                                }
                              </select>
                              {errors.UnitsType && (
                                <p className="text-sm text-red-500">{errors.UnitsType.message}</p>
                              )}
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                {landlordT('subPropertyDefaultPrice')}
                              </label>
                              <div className='flex flex-row gap-1'>
                                <select
                                  className="px-3 py-1.5 w-30 border border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  {...register(`currency`, { required: landlordT('selectCurrency') })}
                                >
                                  <option value="FCFA">FCFA</option>
                                  <option value="USD">USD</option>
                                  <option value="EURO">EURO</option>
                                </select>
                                <input
                                  {...register("UnitsDefaultPrice", { required: landlordT('example10') })}
                                  type="number"
                                  id='UnitsDefaultPrice'
                                  className="w-full px-3 py-1.5 border border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                              </div>
                              {errors.UnitsDefaultPrice && (
                                <p className="text-sm text-red-500">{errors.UnitsDefaultPrice.message}</p>
                              )}
                            </div>
                          </div>)
                        }
                        {!isCplxAsset && <div></div>}
                        <div className="space-y-4 ">
                          <h3 className="font-medium text-gray-800 dark:text-gray-200">{landlordT('description')}</h3>
                          <textarea
                            className="w-full px-3 py-1.5 border border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows={4}
                            {...register("description")}
                            placeholder={landlordT('describeTheProperty')}
                            defaultValue={""}
                          />
                        </div>

                        <div className="space-y-4 ">
                          <h3 className="font-medium text-gray-800 dark:text-gray-200">{landlordT('tag')}</h3>
                          <textarea
                            className="w-full px-3 py-1.5 border border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows={4}
                            {...register("tag")}
                            placeholder={landlordT('tags')}
                            defaultValue={""}
                          />
                        </div>
                      </div>
                    </div>
                  </TabPanel>

                  <TabPanel>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {BILLING_ITEM_TYPE_OBJ_LIST.map((bi) => (
                        <label key={bi.value} className="flex items-center space-x-2" id="rent">
                          <input
                            value={bi.value}
                            type="checkbox"
                            {...register("billingItem", { required: landlordT('selectAtLeastOneBillingItem') })}
                            className="rounded border-gray-300 dark:border-gray-600 text-blue-600 dark:text-blue-400 focus:ring-blue-500"
                            defaultChecked={false}
                          />
                          <span className="text-sm text-gray-700 dark:text-gray-300">{bi.label}</span>
                        </label>
                      ))}
                    </div>
                    {errors && (
                      <p className="text-sm text-red-500 mt-5">{errors.billingItem?.message}</p>
                    )}
                  </TabPanel>

                  <TabPanel>
                    <div className=" dark:bg-black">
                      <div className="flex justify-between items-end"></div>
                      <div className="grid grid-cols-1 gap-1">
                        {fields.map((item, index) => {
                          const currentTitle = unitList?.[index]?.title?.trim();
                          return (<div key={item.id}>
                            <Dropdown
                              key={index}
                              title={currentTitle?.length ? currentTitle : `Unit - ${index + 1}`}
                              index={index}
                              handleDelete={() => handleRemoveSubProperty(index)}
                              open={dropdownOpenList[index]}
                              onToggle={() => {
                                const updated = [...dropdownOpenList];
                                updated[index] = !updated[index];
                                setDropdownOpenList(updated);
                              }}
                            >
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    {landlordT('propertyType')}
                                  </label>
                                  <select
                                    {...register(`UnitList.${index}.typeCode`, {
                                      validate: (value) =>
                                        selectedPropertyType !== "CPLXMOD" || value !== "" || landlordT('pleaseSelectThePropertyType'),
                                    })}
                                    id="propertyType"
                                    className="w-full px-3 py-1.5 h-10 border border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  >
                                    <option value=""></option>
                                    {PROPERTY_TYPE_OBJ_LIST.slice(1).map((propType, index) => (
                                      <option key={index} value={propType.value}>
                                        {propType.label}
                                      </option>
                                    ))}
                                  </select>
                                  {errors.UnitList?.[index]?.typeCode && (
                                    <p className="text-sm text-red-500 mt-1">
                                      {errors.UnitList[index].typeCode.message}
                                    </p>
                                  )}
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    {commonT('propertyName')}
                                  </label>
                                  <input
                                    type="text"
                                    className="w-full px-3 py-1.5 h-10 border border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="123 Main Street"
                                    {...register(`UnitList.${index}.title`, {
                                      validate: (value) =>
                                        selectedPropertyType !== "CPLXMOD" || value !== "" || landlordT('enterPropertyTitle'),
                                    })}
                                  />
                                  {errors.UnitList?.[index]?.title && (
                                    <p className="text-sm text-red-500 mt-1">
                                      {errors.UnitList[index].title.message}
                                    </p>
                                  )}
                                </div>
                              </div>

                              <div className="grid grid-cols-1 mt-2">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    {landlordT('monthlyRent')}
                                  </label>
                                  <div className="relative flex flex-nowrap gap-2">
                                    <select
                                      className="px-3 py-1.5 w-30 border border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                      {...register(`UnitList.${index}.currency`, {
                                        validate: (value) =>
                                          selectedPropertyType !== "CPLXMOD" || value !== "" || landlordT('selectCurrency'),
                                      })}
                                    >
                                      <option value="FCFA">FCFA</option>
                                      <option value="USD">USD</option>
                                      <option value="EURO">EURO</option>
                                    </select>
                                    <input
                                      type="number"
                                      className="w-full pl-8 pr-4 py-1.5 border border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                      min="0"
                                      {...register(`UnitList.${index}.price`, {
                                        required: landlordT('enterPropertyPrice'),
                                      })}
                                    />
                                    {errors.UnitList?.[index]?.price && (
                                      <p className="text-sm text-red-500 mt-1">
                                        {errors.UnitList[index].price.message}
                                      </p>
                                    )}
                                    {errors.UnitList?.[index]?.currency && (
                                      <p className="text-sm text-red-500 mt-1">
                                        {errors.UnitList[index].currency.message}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                <div className="mt-3">
                                  <h3 className="font-medium text-gray-700 dark:text-gray-300">{landlordT('description')}</h3>
                                  <textarea
                                    className="w-full px-3 py-1.5 border border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    rows={4}
                                    placeholder={landlordT('describeTheProperty')}
                                    {...register(`UnitList.${index}.description`)}
                                  />
                                </div>
                                <div className="mt-3">
                                  <h3 className="font-medium text-gray-700 dark:text-gray-300">{landlordT('tag')}</h3>
                                  <textarea
                                    className="w-full px-3 py-1.5 border border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    rows={4}
                                    placeholder={landlordT('tags')}
                                    {...register(`UnitList.${index}.tag`)}
                                  />
                                </div>
                              </div>
                            </Dropdown>
                          </div>)
                        })}
                      </div>
                    </div>
                  </TabPanel>
              </TabPanels>
            </TabGroup>
            <div className='mt-5 flex gap-5 justify-center absolute mb-10 bottom-0 left-0 right-0'>
              <Button variant='info' disable={false} isSubmitBtn fullWidth={false}>
                {landlordT('finished')}
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
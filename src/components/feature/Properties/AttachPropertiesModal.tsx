"use client";

import React, { useState, useCallback, useEffect, useRef } from "react";
import { Search, Check, Building2, MapPin, DollarSign, X } from "lucide-react";
import Image from "next/image";
import { searchAsset } from "@/actions/assetAction";
import { AssetData, SeachPropertyParams } from "@/types/Property";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import autoAnimate from "@formkit/auto-animate";
import { useTranslations } from "next-intl";
import { ASSET_TYPE_COMPLEXE } from "@/constant";
import Button from "@/components/ui/Button";
import { roleStore } from "@/store/roleStore";

interface Property {
  Code: string;
  Name: string;
  Type: string;
  Price: number;
  Currency: string;
  CoverUrl: string;
  AddressData: {
    City: string;
    Street: string;
    Country: string;
  };
  Tag: string[];
  Notes: string;
  BillingItems: string[];
}

interface AttachPropertiesModalProps {
  onClose: () => void;
  onAttach: (selectedProperty: AssetData) => void;
  profileCode: string;
}

export const AttachPropertiesModal = ({
  onClose,
  onAttach,
  profileCode,
}: AttachPropertiesModalProps) => {
  const [selectedProperty, setSelectedProperty] = useState<AssetData | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  // const [propertyList, setPropertyList] = useState<Property[]>([]);
  const [isFetchingProperties, setIsFetchingProperties] = useState(false);
  const [isAttaching, setIsAttaching] = useState(false);
  const commonT = useTranslations('Common');
  const listRef = useRef(null);
  const { isAuthorized, activeRole } = roleStore();
  const router = useRouter();
  const [assetList, setAssetList] = useState<AssetData[]>([]);
  const [filteredAssets, setFilteredAssets] = useState<AssetData[]>([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    listRef.current && autoAnimate(listRef.current, { duration: 300 });
  }, []);

  const filteredProperties = assetList.filter(
    (property) =>
      property.Title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.Address.City.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.Address.Street.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectProperty = (property: AssetData) => {
    setSelectedProperty(property);
  };

  const handleAttach = async () => {
    if (selectedProperty) {
    console.log('handleAttach.clicked')
      setIsAttaching(true);
      onAttach(selectedProperty);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const params: SeachPropertyParams = {
          orderBy: 'CreatedAt',
          orderMode: 'desc',
          limit: 1000,
          offset: 0,
        };
        const result = await searchAsset(params, activeRole);
        console.log('-->result', result);
        if (result.data && result.data.body.items.length > 0) {
          const datas: AssetData[] = result.data.body.items.map((item: any) => ({
            Code: item.Code,
            Title: item.Title,
            Price: item.Price,
            Currency: item.Currency,
            CoverUrl: item.CoverUrl,
            StatusCode: item.StatusCode,
            IsActive: item.IsActive,
            TypeCode: item.TypeCode,
            IsVerified: item.IsVerified,
            Address: {
              Code: item.Address.Code,
              City: item.Address.City,
              Country: item.Address.Country,
              Street: item.Address.Street,
            },
          }));
          setAssetList(datas);
          setFilteredAssets(datas);
        } else if (result.error) {
          if (result.code === 'SESSION_EXPIRED') {
            router.push('/signin');
            return;
          }
          toast.error(result.error ?? commonT('unexpectedError'), { position: 'bottom-right' });
        }
      } catch (error) {
        console.log('-->error', error);
        toast.error("Something went wrong during the process. Try again or contact the administrator", { position: 'bottom-right' });
      } finally {
        setIsReady(true);
      }
    };

    fetchData();
    listRef.current && autoAnimate(listRef.current, { duration: 300 });
  }, [activeRole, commonT, router]);

  return (
    <div className="rounded-lg w-full max-h-[75vh] min-h-[75vh] max-w-2xl mx-auto bg-white dark:bg-gray-800 flex flex-col">
      <div className="bg-white dark:bg-gray-800 px-4 py-2 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <h2 className="text-lg font-semibold dark:text-white">
          {selectedProperty ? "Confirm Property Attachment" : "Select Property to Attach"}
        </h2>
        <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
          <X size={20} className="dark:text-gray-400" />
        </button>
      </div>

      {!selectedProperty ? (
        <>
          <div className="p-4 border-b">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search properties by name, city or street..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="p-4 h-full flex-1 flex flex-col overflow-y-auto">
            <div className="space-y-4" ref={listRef}>
              {!isFetchingProperties ? (
                filteredProperties.length > 0 ? (
                  filteredProperties.slice(0, 10).map((property) => (
                    <PropertyCard
                      key={property.Code}
                      property={property}
                      handleSelectProperty={handleSelectProperty}
                    />
                  ))
                ) : (
                  <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                    No properties found
                  </div>
                )
              ) : (
                <div className="space-y-4">
                  <PropertyCardSkeleton />
                  <PropertyCardSkeleton />
                  <PropertyCardSkeleton />
                </div>
              )}
            </div>
          </div>
        </>
      ) : (
        <div className="p-4 h-full flex-1 flex flex-col">
          <div className="mb-4">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              You are about to attach the following property as a unit to this building:
            </p>
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-900">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-24 h-24">
                  <Image
                    height={200}
                    width={200}
                    src={`${selectedProperty.CoverUrl}` || '#'}
                    alt={selectedProperty.Title}
                    className="w-full h-full object-cover rounded"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg dark:text-white mb-2">
                    {selectedProperty.Title}
                  </h3>
                  <div className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
                    <p className="flex items-center gap-2">
                      <MapPin size={14} className="text-blue-500" />
                      {selectedProperty.Address.Street}, {selectedProperty.Address.City}
                    </p>
                    <p className="flex items-center gap-2">
                      <DollarSign size={14} className="text-green-500" />
                      {selectedProperty.Price} {selectedProperty.Currency}
                    </p>
                    <p className="flex items-center gap-2">
                      <Building2 size={14} className="text-purple-500" />
                      Type: {selectedProperty.TypeCode}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-auto space-x-3 flex justify-end">
            <Button
              onClick={() => setSelectedProperty(null)}
              isSubmitBtn={false}
              variant="outline-neutral"
              fullWidth={false}
            >
              Back
            </Button>
            <Button
              onClick={handleAttach}
              isSubmitBtn={false}
              variant="info"
              fullWidth={false}
              loading={isAttaching}
            >
              Attach Property
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

const PropertyCard = ({
  property,
  handleSelectProperty,
}: {
  property: AssetData;
  handleSelectProperty: (property: AssetData) => void;
}) => {
  return (
    <div
      onClick={() => handleSelectProperty(property)}
      className="group border border-gray-200 dark:border-gray-700 rounded-lg p-3 bg-white dark:bg-gray-800 hover:shadow-sm transition-all cursor-pointer hover:border-blue-500"
    >
      <div className="flex items-center gap-4">
        <div className="flex-shrink-0 w-16 h-16">
          <Image
            height={200}
            width={200}
            src={`${property.CoverUrl}` || '#'}
            alt={property.Title}
            className="w-full h-full object-cover rounded"
          />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-base text-gray-800 dark:text-white leading-snug mb-1">
            {property.Title}
          </h3>
          <div className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
            <p className="flex items-center gap-2">
              <MapPin size={14} className="text-blue-500" />
              {property.Address.City}
            </p>
            <p className="flex items-center gap-2">
              <DollarSign size={14} className="text-green-500" />
              {property.Price} {property.Currency}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const PropertyCardSkeleton = () => {
  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 bg-white dark:bg-gray-800">
      <div className="flex items-center gap-4">
        <div className="flex-shrink-0 w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4" />
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/2" />
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/3" />
        </div>
      </div>
    </div>
  );
};

"use client";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { SeachPropertyParams } from "@/types/Property";
import { useEffect, useRef, useState } from "react";
import { Button } from "@headlessui/react";
import { useRouter } from '@bprogress/next/app';
import PropertyCard from "@/components/Cards/PropertyCard";
import { Search } from "lucide-react";
import { AssetData } from "@/types/Property";
import { searchAsset } from "@/actions/assetAction";
import PropertySkeletonCard from "@/components/skeleton/PropertySkeletonCard";
import { PROFILE_LANDLORD_LIST } from "@/constant";
import toast from "react-hot-toast";
import autoAnimate from "@formkit/auto-animate";
import Nodata from "@/components/error/Nodata";
import { roleStore } from "@/store/roleStore";
import { useTranslations } from "next-intl";

const PropertiesPage = () => {
  const [assetList, setAssetList] = useState<AssetData[]>([]);
  const [filteredAssets, setFilteredAssets] = useState<AssetData[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isReady, setIsReady] = useState(false);
  const [filterActive, setFilterActive] = useState(""); // "1" ou "0"
  const [filterType, setFilterType] = useState("");
  const { isAuthorized, activeRole } = roleStore();
  const router = useRouter();
  const t = useTranslations("Common");
  const landlordT = useTranslations('Landlord.assets');
  const commonT = useTranslations('Common');
  const listRef = useRef(null);

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

  useEffect(() => {
    let filtered = assetList;

    if (searchQuery.trim()) {
      filtered = filtered.filter((item) =>
        item.Title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filterActive) {
      filtered = filtered.filter((item) => item.IsActive.toString() === filterActive);
    }

    if (filterType) {
      filtered = filtered.filter((item) => item.TypeCode === filterType);
    }

    setFilteredAssets(filtered);
  }, [searchQuery, filterActive, filterType, assetList]);

  const handleCardClick = (code: string) => {
    router.push(`properties/${code}`);
  };

  const handleNewAsset = () => {
    router.push('/landlord/properties/new');
  };

  // if (!isAuthorized(PROFILE_LANDLORD_LIST)) {
  //   return router.push("/unauthorized");
  // }

  return (
    <DefaultLayout>
      <Breadcrumb pageName={t('rental')} />

      <div className="">
        <div className="w-full space-y-4">
          {/* Barre de recherche */}
          <div className="relative w-full flex items-center gap-2">
            <div className="relative w-full">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500"
                size={20}
              />
              <input
                type="text"
                placeholder={t('searchAProperty')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>
            {/* Bouton création */}
            <Button
              onClick={handleNewAsset}
              className="flex items-center whitespace-nowrap gap-2 px-4 py-2 rounded bg-blue-700 hover:bg-blue-800 text-white font-semibold transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <span>{t('newRental')}</span>
            </Button>
          </div>

          {/* Filtres */}
          <div className="flex flex-row md:items-center gap-4">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="flex-1 min-w-[150px] px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            >
              <option value="">{t('allTypes')}</option>
              {[...new Set(assetList.map(a => a.TypeCode))].map((type, index) => (
                <option key={index} value={type}>{t(type)}</option>
              ))}
            </select>
            <select
              value={filterActive}
              onChange={(e) => setFilterActive(e.target.value)}
              className="flex-1 min-w-[130px] px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            >
              <option value="">{t('allStatus')}</option>
              <option value="1">{t('active')}</option>
              <option value="0">{t('inactive')}</option>
            </select>
          </div>
        </div>

      </div>

      <div >
        {isReady ? (
          filteredAssets.length > 0 ? (
            
              <div className="justify-items-center grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 mt-5" ref={listRef}>
                {
                  filteredAssets.map((property, index) => (
                    <PropertyCard
                      key={property.Code || index}
                      property={property}
                      className="h-full"
                    />
                  ))
                }
              </div>
          ) : (
            <div className="col-span-full text-center text-gray-500 mt-5">
              <Nodata />
            </div>
          )
        ) : (
          <div className="justify-items-center grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 mt-5" ref={listRef}>
            {
              Array.from({ length: 4 }).map((_, index) => (
                <PropertySkeletonCard key={index} />
              ))
            }
          </div>
        )}
      </div>
    </DefaultLayout>
  );
};

export default PropertiesPage;

"use client"
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community'; 
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { CreatePropertyType, Property, SeachPropertyParams } from "@/types/Property";
import { useEffect, useState } from "react";
import { Button } from "@headlessui/react";
import { useRouter } from '@bprogress/next/app';
import PropertyCard from "@/components/Cards/PropertyCard";
import { Search, SlidersHorizontal } from "lucide-react";
import { AssetData } from "@/types/Property";
import { searchAsset } from "@/actions/assetAction";
import PropertySkeletonCard from "@/components/skeleton/PropertySkeletonCard";
import { useAuth } from "@/context/AuthContext";
import { PROFILE_LANDLORD_LIST } from "@/constant";
import toast from "react-hot-toast";


ModuleRegistry.registerModules([AllCommunityModule]);


const PropertiesPage = () => {
  const [assetList,setAssetList] = useState<AssetData[]>([]);
  const [isReady, setIsReady] = useState(false);
  const [offSet, setOffSet] = useState(0);
  const { isAuthorized, loadingProfile, activeProfile } = useAuth();

  const router = useRouter();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const params: SeachPropertyParams = {
          orderBy: 'CreatedAt',
          orderMode: 'desc',
          limit: 1000,
          offset: offSet,
        };
        const result = await searchAsset(params, activeProfile);
        console.log('API result:', result);
        if(result.data && result.data.body.items.length > 0) {
          const datas = result.data.body.items.map((item: any) => {
            return {
              Code: item.Code,
              Title: item.Title,
              Price: item.Price,
              Currency: item.Currency,
              CoverUrl: item.CoverUrl,
              StatusCode: item.StatusCode,
              IsActive: item.IsActive, // 1 ou 0
              TypeCode: item.TypeCode,
              IsVerified: item.IsVerified, // 1 ou 0
              Address: {
                Code: item.Address.Code,
                City: item.Address.City,
                Country: item.Address.Country,
                Street: item.Address.Street,
              },
            }
          });
          console.log('-->datas', datas);
          setAssetList(datas)
        }  else if(result.error){
        if(result.code == 'SESSION_EXPIRED'){
            router.push('/signin');
            return;
        }
        toast.error(result.error ?? "An unexpected error occurred", { position: 'bottom-right' });
      }
      } catch (error) {
        console.log('-->error', error)
      } finally {
        setIsReady(true);
      }
    }

    fetchData();
  }, [])
  


  const hancleCardClick = (e: any) => {
    console.log('ID', e);
    router.push('properties/'+e)
  }

  const handleCreateAsset = async (data: CreatePropertyType) => {
    try {
      const payload: CreatePropertyType = { ... data }
      const formData = new FormData();
      if (data.coverUrl) {
        formData.append("file", data.coverUrl);
      }

      console.log('-->data', data);
    } catch (error) {
      console.log("-->error", error);
    }
  }

  const handleNewAsset = () => {
    // setPropertyFormOpen(true);
    router.push('/landlord/properties/new')
  }

  if (!loadingProfile && !isAuthorized(PROFILE_LANDLORD_LIST)) {
    return <div>Unauthorized</div>;
  }
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Locatif" />
      
      <div className="">
        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search properties..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-gray-200">
            <SlidersHorizontal size={20} />
            Filters
          </button>
          <Button
            onClick={handleNewAsset} 
            className="inline-flex items-center gap-2 rounded-md bg-[#2A4365] py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-600 data-[open]:bg-gray-700 data-[focus]:outline-1 data-[focus]:outline-white">
            Nouveau Locatif
          </Button>
        </div>
      </div>

      <div className="justify-items-center grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 mt-5">
        {
          isReady ?
            assetList.map((property, index) => (
              <PropertyCard 
                key={property.Code || index} 
                property={property} 
                className="h-full"
                onClick={hancleCardClick}
              />
            ))
          :
          Array.from({ length: 4 }).map((i, index)=>(<PropertySkeletonCard key={index} />))
        }
      </div>

    </DefaultLayout>
  );
};

export default PropertiesPage;

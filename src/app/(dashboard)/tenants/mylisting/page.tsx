"use client"
import React, { useEffect, useRef, useState } from 'react'
import DefaultLayout from '@/components/Layouts/DefaultLayout'
import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb'
import { useRouter } from '@bprogress/next/app'
import { dashboard, searchAsset } from '@/actions/assetAction'
import { IContract, IDashBoardParams, SeachPropertyParams } from '@/types/Property'
import { useAuth } from '@/context/AuthContext'
import toast from 'react-hot-toast'
import { PROFILE_LANDLORD_LIST } from '@/constant'
import TenantAssetCard from '@/components/Cards/TenantAssetCard' 
import Overlay from '@/components/Overlay'
import { ProcessingModal } from '@/components/Modal/ProcessingModal'
import PropertySkeletonCard from '@/components/skeleton/PropertySkeletonCard'
import Nodata from '@/components/error/Nodata'
const Listings = () => {
  const [contractList, setContractList] = useState<IContract[]>([]);;
  const [isLoading, setIsLoading] = useState(false);
  const [offSet, setOffSet] = useState(0);
  const { isAuthorized, loadingProfile, getProfileCode} = useAuth();
    const loadingMessage = 'Loading data...';
  const router = useRouter();
  useEffect(() => {
    init();
  }, []);


  const handleNavigateToDetail = (_contract: IContract) => {
    console.log('-->_contract', _contract);
    router.push(`/tenants/mylisting/${_contract.code}`);
  }

  if (!loadingProfile && !isAuthorized(PROFILE_LANDLORD_LIST)) {
    return <div>Unauthorized</div>;
  }
  


  const init = async () => {
    try {
      const user = getProfileCode('RENTER');
      setIsLoading(true);
      const params: IDashBoardParams = {
        offset: 0,
        page: 1,
        limit: 1000,
        profileCode: user.Code,
        endDate: "",
        startDate: "",
        term: "",
        type: ""
      };
      const dashboardData = await dashboard(params);
      console.log('-->dashboardData', dashboardData);
      if (dashboardData.data && dashboardData.data.body.dashboard.Counts.properties > 0) {
        const params: SeachPropertyParams = {
          orderBy: 'CreatedAt',
          orderMode: 'desc',
          limit: 1000,
          offset: offSet,
        };
        const role = getProfileCode('RENTER');
        const _assetData = await searchAsset(params, role);
        console.log('-->_assetData', _assetData);
        
        if (_assetData.data && _assetData.data.body.items.length > 0) {
          const datas: IContract[] = dashboardData.data.body.dashboard.CurrentLoans.map((ct: any) => {
            let value: any;
            
            Array.from(_assetData.data.body.items).forEach((ast: any) => {
              if(ast.Code == ct.AssetCode){
                value = {
                  "code": ct.Code,
                  "profilCode": "",
                  "renterUserId": "",
                  "assetCode": ast.Code,
                  "initialDuration": 0,
                  "startDate": ct.StartDate,
                  "endDate": ct.EndDate,
                  "notes": "",
                  "billingItems": [],
                  "status": ast.StatusCode,
                  "owner": {
                    "firstName": ast.owner.user.Firstname,
                    "lastname": ast.owner.user.Lastname,
                    "email": ast.owner.user.Email,
                    "phone": ast.owner.user.Phone,
                  },
                  Address: {
                    Code: ast.Address.Code,
                    City: ast.Address.City,
                    Country: ast.Address.Country,
                    Street: ast.Address.Street,
                  },
                  asset: {
                    Price: ast.Price,
                    Currency: ast.Currency,
                    Title: ast.Title,
                    CoverUrl: ast.CoverUrl
                  }
                }
              }
            });

            return value;
          });

          console.log('-->datas', datas);

          
          setContractList(datas);
        } else if (_assetData.error) {
          if (_assetData.code === 'SESSION_EXPIRED') {
            router.push('/signin');
            return;
          }
          toast.error(_assetData.error ?? "An unexpected error occurred", { position: 'bottom-right' });
        }
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
      setIsLoading(false)
    }
  }

  return (
    <DefaultLayout>
        <Breadcrumb pageName='My listing' previousPage={false}/>
        {
          isLoading == false ?
          (
            contractList.length > 0 ? <div className="justify-items-center grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 mt-5">
              {contractList.map((contract, index) => (<TenantAssetCard contract={contract} key={index} handleClick={handleNavigateToDetail} />))}
            </div>
            :
            (<Nodata />)
          )
          : <div className="justify-items-center grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 mt-5">
            {Array.from({ length: 4 }).map((_, index) => (<PropertySkeletonCard key={index} />))}
          </div>
        }
    </DefaultLayout>
  )
}

export default Listings;
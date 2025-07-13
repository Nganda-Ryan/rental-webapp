"use client"
import React, { useEffect, useRef, useState } from 'react'
import DefaultLayout from '@/components/Layouts/DefaultLayout'
import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb'
import { useRouter } from '@bprogress/next/app'
import { dashboard, searchAsset } from '@/actions/assetAction'
import { IContract, IDashBoardParams, ILoan, SeachPropertyParams } from '@/types/Property'
import { useAuth } from '@/context/AuthContext'
import toast from 'react-hot-toast'
import { PROFILE_LANDLORD_LIST } from '@/constant'
import TenantAssetCard from '@/components/Cards/TenantAssetCard' 
import Overlay from '@/components/Overlay'
import { ProcessingModal } from '@/components/Modal/ProcessingModal'
import PropertySkeletonCard from '@/components/skeleton/PropertySkeletonCard'
import Nodata from '@/components/error/Nodata'
import { roleStore } from '@/store/roleStore'
const Listings = () => {
  const [contractList, setContractList] = useState<IContract[]>([]);
  const [loanList, setLoanList] = useState<ILoan[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [offSet, setOffSet] = useState(0);
  const { isAuthorized, user, getProfileCode} = roleStore();
    const loadingMessage = 'Loading data...';
  const router = useRouter();
  useEffect(() => {
    init();
  }, []);


  const handleNavigateToDetail = (_contract: ILoan) => {
    console.log('-->_contract', _contract);
    router.push(`/renter/mylisting/${_contract.Code}`);
  }

  if (!isAuthorized(PROFILE_LANDLORD_LIST)) {
    return <div>Unauthorized</div>;
  }
  


  const init = async () => {
    const profileCode = getProfileCode("RENTER");
    if(profileCode){
      try {
        setIsLoading(true);
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
        console.log('-->dashboardData', dashboardData);
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
        setIsLoading(false)
      }
    }
  }

  return (
    <DefaultLayout>
        <Breadcrumb pageName='My listing' previousPage={false}/>
        {
          isLoading == false ?
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
    </DefaultLayout>
  )
}

export default Listings;
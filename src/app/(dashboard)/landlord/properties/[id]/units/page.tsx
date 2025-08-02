"use client"
import React, { useEffect, useState } from 'react'
import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb'
import Nodata from '@/components/error/Nodata'
import DefaultLayout from '@/components/Layouts/DefaultLayout'
import { PROFILE_LANDLORD_LIST } from "@/constant";
import { ResponsiveTable } from '@/components/feature/Support/ResponsiveTable'
import { AssetData, AssetDataDetailed, IContractDetail, IInvoiceForm, SeachInvoiceParams } from '@/types/Property'
import { capitalize, formatNumberWithSpaces } from '@/lib/utils'
import { getStatusBadge } from '@/lib/utils-component'
import { useParams } from 'next/navigation'
import { useRouter } from '@bprogress/next/app'
import Button from '@/components/ui/Button'
import toast from 'react-hot-toast'
import { getAsset } from '@/actions/assetAction'
import { SkeletonTable } from '@/components/skeleton/SkeletonTable'
import { roleStore } from '@/store/roleStore'

const Page = () => {
  const [isReady, setIsReady] = useState(false);
  const [asset, setAsset] = useState<AssetDataDetailed | null>(null);
  const { isAuthorized} = roleStore();
  const params = useParams();
  const router = useRouter();
  
  useEffect(() => {
    init();
  }, []);

  const unitColumns = [
    {
        key: 'unit',
        label: 'Unit Name',
        priority: "medium" as "medium",
        render: (_: any, unit: AssetData) => (
            <div className="flex flex-col text-gray-800 dark:text-gray-100">
                <span className="font-medium">{capitalize(unit.Title)}</span>
                <span className="text-xs text-gray-600 dark:text-gray-100 ml-1">{capitalize(unit.TypeCode)}</span>
            </div>
        ),
    },
    {
        key: 'status',
        label: 'Status',
        priority: "low" as "low",
        render: (_: any, unit: AssetData) => (
            <div className=" text-gray-800 dark:text-gray-100">
                {getStatusBadge(unit.StatusCode)}
            </div>
        ),
    },
    {
        key: 'price',
        label: 'Rent',
        priority: "medium" as "medium",
        render: (_: any, unit: AssetData) => (
            <span className="">
                {formatNumberWithSpaces(unit.Price)} {unit.Currency}
            </span>
        ),
    },
    {
        key: 'actions',
        label: 'Actions',
        priority: "high" as "high",
        render: (_: any, unit: AssetData) => (
            <div className="flex gap-2 ">
                <Button
                    variant="neutral"
                    isSubmitBtn={false}
                    fullWidth={false}
                    onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/landlord/properties/${params.id}/edit-unit?unitId=${unit.Code}`);
                    }}
                >
                    Edit
                </Button>
            </div>

        ),
    },
  ]

  const handleSelectUnit = (unitId: string) => {
    console.log('handleSelectUnit.unitId', unitId)
    router.push(`/landlord/properties/${params.id}/units/${unitId}`)
  }

  const getUnits = (items:any[]): AssetData [] => {
    return items.map((item: any, index: number) => {
      return {
        Code: item.Code,
        Id: "UNIT-" + (index + 1),
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
          Units: getUnits(item.assets),
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

  // if (!isAuthorized(PROFILE_LANDLORD_LIST)) {
  //   return router.push("/unauthorized");
  // }
  return (
    <DefaultLayout>
      <Breadcrumb previousPage pageName="Locatif/Units" />
      {
        isReady ? <>
          {
            (asset && asset.Units && asset.Units.length > 0) ? <ResponsiveTable
              columns={unitColumns}
              data={asset.Units}
              onRowClick={(unit) => handleSelectUnit(unit.Code)}
              keyField="Id"
              searchKey='Title'
              paginate={10}
            /> : <Nodata />
          }
        </>
          : <SkeletonTable rows={6} />
      }

    </DefaultLayout>
  )
}

export default Page
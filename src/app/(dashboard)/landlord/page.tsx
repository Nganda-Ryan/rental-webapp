'use client';

import React, { useEffect, useState } from "react";
import {
  DollarSign,
  Home,
  Users,
  AlertTriangle
} from "lucide-react";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { useAuth } from "@/context/AuthContext";
import { PROFILE_LANDLORD_LIST } from "@/constant";
import { useRouter } from "@bprogress/next/app";
import { roleStore } from "@/store/roleStore";
import { IDashBoardParams } from "@/types/Property";
import { dashboard } from "@/actions/assetAction";
import toast from "react-hot-toast";
import { IDashboardResponse } from "@/types/dashboard";
import { capitalize, formatDateToText, formatNumberWithSpaces } from "@/lib/utils";
import { getCurrencyIcon } from "@/lib/utils-component";
import { StatusDot } from "@/components/StatusDot";
import Overlay from "@/components/Overlay";
import { ProcessingModal } from "@/components/Modal/ProcessingModal";

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(false);
  const [dashboardData, setDashboardData] = useState<IDashboardResponse | null>(null);
  const router = useRouter();
  const { isAuthorized, user, getProfileCode} = roleStore();



  useEffect(() => {
    if (!isAuthorized(PROFILE_LANDLORD_LIST)) {
      router.push("/not-authorized");
    }
    init();
  }, []);

  const loadingMessage = 'Loading data...';
  
  const init = async () => {
    const profileCode = getProfileCode("LANDLORD");
    if(profileCode){
        try {
          setIsLoading(true);
          console.log('-->user', user);
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
          const result = await dashboard(params);
          if (result.data) {
              const data = result.data?.body?.dashboard;
              console.log('-->data', data)
              const _dashboardData: IDashboardResponse = {
                Counts: data.Counts,
                PropertiesByStatus: data.PropertiesByStatus,
                RentPaymentsStatus: data.RentPaymentsStatus,
                AllPendingRequests: data.AllPendingRequests,
                allApplications: data.allApplications.map((item: any) => ({
                  Code: item.Code,
                  TypeCode: item.TypeCode,
                  CreatedAt: item.CreatedAt,
                  SubmittedDate: item.SubmittedDate,
                  ClosedDate: item.ClosedDate,
                  IsClosed: item.IsClosed,
                  StatusCode: item.StatusCode,
                  Description: item.Description,
                  LevelCode: item.LevelCode,
                  renter: {
                    Code: item.creator.user.Code,
                    Status: item.creator.user.Status,
                    RoleCode: item.creator.RoleCode,
                    CreatedAt: item.creator.CreatedAt,
                    IsActive: item.creator.IsActive,
                    UserCode: item.creator.UserCode,
                    Email: item.creator.user.Email,
                    Firstname: item.creator.user.Firstname,
                    Gender: item.creator.user.Gender,
                    Lastname: item.creator.user.Lastname,
                    NIU: item.creator.user.NIU,
                    Phone: item.creator.user.Phone,
                    AvatarUrl: item.creator.user.AvatarUrl,
                  }
                }))
              }
              console.log('-->_dashboardData', _dashboardData);
              setDashboardData(_dashboardData);
          } else if (result.error) {
              if (result.code === 'SESSION_EXPIRED') {
              router.push('/signin');
              return;
              }
              toast.error(result.error ?? "An unexpected error occurred", { position: 'bottom-right' });
          }
        } catch (error) {
            console.log('-->error', error);
        } finally {
            setIsLoading(false);
        }
    }
  }
  
  return (
    <DefaultLayout>
      <Breadcrumb previousPage={false} pageName="Dashboard Overview" />

      <div className="w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 mb-1">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {
                    dashboardData && formatNumberWithSpaces(dashboardData.RentPaymentsStatus.reduce((acc, curr) => acc + curr.Amount, 0))
                  } 
                  {/* {dashboardData?.RentPaymentsStatus[0].Currency} */}
                </p>
              </div>
              <div className="bg-[#48BB78] p-3 rounded-full">
                {/* {dashboardData?.RentPaymentsStatus[0].Currency && getCurrencyIcon(dashboardData?.RentPaymentsStatus[0].Currency, 24, "text-white")} */}
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 mb-1">
                  Properties
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {dashboardData && dashboardData.Counts.properties} {" "}
                  <span className="italic text-gray-600 dark:text-gray-400 font-medium text-xl">
                    ({dashboardData && dashboardData.PropertiesByStatus.map((item) => (`${capitalize(item.StatusCode)} - ${item.Total}`)).join(", ")})
                  </span>
                </p>
              </div>
              <div className="bg-blue-500 p-3 rounded-full">
                <Home className="text-white" size={24} />
              </div>
            </div>
          </div>

        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Pending request</h2>
            <div className="space-y-4">
              {dashboardData && dashboardData.allApplications.map((item) => (
                <div
                  key={item.Code}
                  className="flex items-center py-2 border-b border-gray-100 dark:border-gray-700"
                >
                  <StatusDot status={item.StatusCode} />
                  <div>
                    <p className="text-sm text-gray-800 dark:text-gray-200">
                      {item.Description}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{formatDateToText(item.SubmittedDate)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>


      <Overlay isOpen={isLoading} onClose={() => {}}>
        <ProcessingModal message={loadingMessage} />
      </Overlay>
    </DefaultLayout>
  );
}
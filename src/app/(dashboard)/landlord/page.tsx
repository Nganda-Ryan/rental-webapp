'use client';

import React, { useEffect } from "react";
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

export default function Dashboard() {
  const router = useRouter();
  const { isAuthorized } = roleStore();
  useEffect(() => {
    if (!isAuthorized(PROFILE_LANDLORD_LIST)) {
      router.push("/not-authorized");
    }
  }, []);
  
  return (
    <DefaultLayout>
      <Breadcrumb previousPage={false} pageName="Dashboard Overview" />

      <div className="w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 mb-1">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">$24,500</p>
              </div>
              <div className="bg-[#48BB78] p-3 rounded-full">
                <DollarSign className="text-white" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 mb-1">Properties</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">12</p>
              </div>
              <div className="bg-blue-500 p-3 rounded-full">
                <Home className="text-white" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 mb-1">Total Tenants</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">48</p>
              </div>
              <div className="bg-purple-500 p-3 rounded-full">
                <Users className="text-white" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 mb-1">Pending Issues</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">5</p>
              </div>
              <div className="bg-orange-500 p-3 rounded-full">
                <AlertTriangle className="text-white" size={24} />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Recent Activities</h2>
            <div className="space-y-4">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="flex items-center py-2 border-b border-gray-100 dark:border-gray-700"
                >
                  <div className="w-2 h-2 bg-[#48BB78] rounded-full mr-3"></div>
                  <div>
                    <p className="text-sm text-gray-800 dark:text-gray-200">
                      New maintenance request from Unit 3B
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">2 hours ago</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Upcoming Lease Renewals</h2>
            <div className="space-y-4">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">Unit 5A - John Smith</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Expires in 30 days</p>
                  </div>
                  <button className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
                    Review
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
}
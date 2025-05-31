import React from "react";
import { DollarSign, Home, Users, AlertTriangle } from "lucide-react";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
export default function Dashboard () {
  return (
    <DefaultLayout>
      <Breadcrumb previousPage={false} pageName="Dashboard Overview" />
      <div className="w-full">
        {/* <h1 className="text-2xl font-bold mb-6">Dashboard Overview</h1> */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 mb-1">Total Revenue</p>
                <p className="text-2xl font-bold">$24,500</p>
              </div>
              <div className="bg-[#48BB78] p-3 rounded-full">
                <DollarSign className="text-white" size={24} />
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 mb-1">Properties</p>
                <p className="text-2xl font-bold">12</p>
              </div>
              <div className="bg-blue-500 p-3 rounded-full">
                <Home className="text-white" size={24} />
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 mb-1">Total Tenants</p>
                <p className="text-2xl font-bold">48</p>
              </div>
              <div className="bg-purple-500 p-3 rounded-full">
                <Users className="text-white" size={24} />
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 mb-1">Pending Issues</p>
                <p className="text-2xl font-bold">5</p>
              </div>
              <div className="bg-orange-500 p-3 rounded-full">
                <AlertTriangle className="text-white" size={24} />
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Recent Activities</h2>
            <div className="space-y-4">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="flex items-center py-2 border-b border-gray-100"
                >
                  <div className="w-2 h-2 bg-[#48BB78] rounded-full mr-3"></div>
                  <div>
                    <p className="text-sm">
                      New maintenance request from Unit 3B
                    </p>
                    <p className="text-xs text-gray-500">2 hours ago</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold mb-4">
              Upcoming Lease Renewals
            </h2>
            <div className="space-y-4">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="flex items-center justify-between py-2 border-b border-gray-100"
                >
                  <div>
                    <p className="text-sm font-medium">Unit 5A - John Smith</p>
                    <p className="text-xs text-gray-500">Expires in 30 days</p>
                  </div>
                  <button className="text-sm text-blue-600 hover:text-blue-800">
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
};

"use client";
import React, { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { locationConfigs } from "@/actions/configsAction";
import { useRouter } from "@bprogress/next/app";
import toast from "react-hot-toast";
import { useConfigStore } from "@/lib/store/configStore";
import { roleStore } from "@/store/roleStore";
import { useTranslations } from "next-intl";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const configStore = useConfigStore();
  const router = useRouter();
  const { activeRole } = roleStore();
    const landlordT = useTranslations('Landlord.assets');
    const commonT = useTranslations('Common');
  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    try {
      const result = await locationConfigs();
      if(result.data){
        configStore.setConfig(result.data);
      } else if (result.error) {
        if (result.code === 'SESSION_EXPIRED') {
          router.push('/signin');
          return;
        }
        toast.error(result.error ?? commonT('unexpectedError'), { position: 'bottom-right' });
      }
    } catch (error) {
      console.error('Erreur lors du chargement des adresses :', error)
    }
  }
  return (
    <>
      {/* <AuthProvider> */}
        {/* <!-- ===== Page Wrapper Start ===== --> */}
        <div className="flex">
          {/* <!-- ===== Sidebar Start ===== --> */}
          <Sidebar key={activeRole} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          {/* <!-- ===== Sidebar End ===== --> */}

          {/* <!-- ===== Content Area Start ===== --> */}
          <div className="relative flex flex-1 flex-col xl:ml-72.5">
            {/* <!-- ===== Header Start ===== --> */}
            <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
            {/* <!-- ===== Header End ===== --> */}

            {/* <!-- ===== Main Content Start ===== --> */}
            <main>
              <div className="mx-auto max-w-screen-2xl p-2 md:p-6 lg:p-8 lg:py-4">
                {children}
              </div>
            </main>
            {/* <!-- ===== Main Content End ===== --> */}
          </div>
          {/* <!-- ===== Content Area End ===== --> */}
        </div>
        {/* <!-- ===== Page Wrapper End ===== --> */}
      {/* </AuthProvider> */}
    </>
  );
}

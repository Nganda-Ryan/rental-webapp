"use client";
import React, { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import {
  fetchLocationCities,
  fetchLocationCountries,
  fetchLocationStates,
  fetchLocationStreets,
} from "@/actions/configsAction";
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
  const mergeConfig = useConfigStore((s) => s.mergeConfig);
  const setLocationLoading = useConfigStore((s) => s.setLocationLoading);
  const router = useRouter();
  const { activeRole } = roleStore();
  const commonT = useTranslations('Common');

  useEffect(() => {
    void init();
  // eslint-disable-next-line react-hooks/exhaustive-deps -- load location config once on mount
  }, []);

  const handleLocationError = (code: string | undefined, error: string | null) => {
    if (code === 'SESSION_EXPIRED') {
      router.push('/signin');
      return true;
    }
    if (error) {
      toast.error(error ?? commonT('unexpectedError'), { position: 'bottom-right' });
    }
    return false;
  };

  const init = async () => {
    const { country, state, city, street } = useConfigStore.getState();
    const needsInitialLoad =
      country.length === 0 || state.length === 0 || city.length === 0 || street.length === 0;

    if (needsInitialLoad) {
      setLocationLoading(true);
    }

    try {
      const [countryResult, stateResult] = await Promise.all([
        fetchLocationCountries(),
        fetchLocationStates(),
      ]);

      if (handleLocationError(countryResult.code, countryResult.error)) return;
      if (handleLocationError(stateResult.code, stateResult.error)) return;

      mergeConfig({
        ...(countryResult.data ? { country: countryResult.data } : {}),
        ...(stateResult.data ? { state: stateResult.data } : {}),
      });

      const [cityResult, streetResult] = await Promise.all([
        fetchLocationCities(),
        fetchLocationStreets(),
      ]);

      if (handleLocationError(cityResult.code, cityResult.error)) return;
      if (handleLocationError(streetResult.code, streetResult.error)) return;

      mergeConfig({
        ...(cityResult.data ? { city: cityResult.data } : {}),
        ...(streetResult.data ? { street: streetResult.data } : {}),
      });
    } catch (error) {
      console.error('Erreur lors du chargement des adresses :', error);
    } finally {
      setLocationLoading(false);
    }
  };
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

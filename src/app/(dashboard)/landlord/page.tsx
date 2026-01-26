'use client';

import React, { useEffect, useState, useMemo, useCallback } from "react";
import {
  Coins,
  FileText,
  Home,
  AlertCircle,
  TrendingUp,
  DollarSign,
  Calendar,
  FileCheck,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { useRouter } from "@bprogress/next/app";
import { roleStore } from "@/store/roleStore";
import { IDashBoardParams } from "@/types/Property";
import { dashboard } from "@/actions/assetAction";
import toast from "react-hot-toast";
import { IDashboardResponse } from "@/types/dashboard";
import { capitalize, formatNumberWithSpaces } from "@/lib/utils";
import Overlay from "@/components/Overlay";
import { ProcessingModal } from "@/components/Modal/ProcessingModal";
import RentalRequestCard from "@/components/Cards/RentalRequestCard";
import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(false);
  const [dashboardData, setDashboardData] = useState<IDashboardResponse | null>(null);
  const router = useRouter();
  const { user, getProfileCode } = roleStore();
  const t = useTranslations("Common");
  const landlordT = useTranslations('Landlord.assets');
  const commonT = useTranslations('Common');

  const loadingMessage = t('loadingData');
  
  const init = useCallback(async () => {
    const profileCode = getProfileCode("LANDLORD");
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
        const result = await dashboard(params);
        console.log('-->Dashboard result', result);
        if (result.data) {
          const data = result.data?.body?.dashboard;
          const _dashboardData: IDashboardResponse = {
            Counts: data.Counts,
            PropertiesByStatus: data.PropertiesByStatus,
            RentPaymentsStatus: data.RentPaymentsStatus,
            AllPendingRequests: data.AllPendingRequests,
            allApplications: data.allApplications?.map((item: any) => ({
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
            })) || [],
            CurrentLoans: data.CurrentLoans || [],
            InvoicesByStatus: data.InvoicesByStatus || [],
            UnpaidInvoices: data.UnpaidInvoices || [],
            MonthlyFinanceByAsset: data.MonthlyFinanceByAsset || [],
            ArrearsByAsset: data.ArrearsByAsset || [],
            TotalFinance: data.TotalFinance || 0,
            TotalArrears: data.TotalArrears || 0,
          }
          setDashboardData(_dashboardData);
        } else if (result.error) {
            if (result.code === 'SESSION_EXPIRED') {
            router.push('/signin');
            return;
            }
            toast.error(result.error ?? commonT('unexpectedError'), { position: 'bottom-right' });
        }
      } catch (error) {
          console.log('-->error', error);
      } finally {
          setIsLoading(false);
      }
    }
  }, [getProfileCode, router, commonT]);

  useEffect(() => {
    init();
  }, [init]);

  // Calculate metrics
  const metrics = useMemo(() => {
    if (!dashboardData) return null;

    const totalRevenue = dashboardData.RentPaymentsStatus.reduce((acc, curr) => acc + curr.Amount, 0);
    const paidAmount = dashboardData.RentPaymentsStatus
      .filter(p => p.IsPaid === 1)
      .reduce((acc, curr) => acc + curr.Amount, 0);
    const unpaidAmount = dashboardData.RentPaymentsStatus
      .filter(p => p.IsPaid === 0)
      .reduce((acc, curr) => acc + curr.Amount, 0);
    const collectionRate = totalRevenue > 0 ? ((paidAmount / totalRevenue) * 100).toFixed(1) : '0';

    return {
      totalRevenue,
      paidAmount,
      unpaidAmount,
      collectionRate,
      currency: dashboardData.RentPaymentsStatus[0]?.Currency || 'FCFA',
    };
  }, [dashboardData]);

  // Properties by Status Chart Data
  const propertiesChartData = useMemo(() => {
    if (!dashboardData) return { series: [], labels: [], colors: [] };

    const statusColors: Record<string, string> = {
      'RENTED': '#10B981',
      'AVAILABLE': '#3C50E0',
      'PENDING': '#FFA70B',
      'DRAFT': '#64748B',
    };

    const series = dashboardData.PropertiesByStatus.map(item => item.Total);
    const labels = dashboardData.PropertiesByStatus.map(item => capitalize(item.StatusCode));
    const colors = dashboardData.PropertiesByStatus.map(item => 
      statusColors[item.StatusCode] || '#3C50E0'
    );

    return { series, labels, colors };
  }, [dashboardData]);

  // Payment Status Chart Data
  const paymentChartData = useMemo(() => {
    if (!dashboardData) return { series: [], labels: [], colors: [] };

    const paidAmount = dashboardData.RentPaymentsStatus
      .filter(p => p.IsPaid === 1)
      .reduce((acc, curr) => acc + curr.Amount, 0);
    const unpaidAmount = dashboardData.RentPaymentsStatus
      .filter(p => p.IsPaid === 0)
      .reduce((acc, curr) => acc + curr.Amount, 0);

    return {
      series: [paidAmount, unpaidAmount],
      labels: [landlordT('paid'), landlordT('outstanding')],
      colors: ['#10B981', '#FB5454'],
    };
  }, [dashboardData, landlordT]);

  // Pending Requests Chart Data
  const requestsChartData = useMemo(() => {
    if (!dashboardData) return { categories: [], series: [] };

    const categories = dashboardData.AllPendingRequests.map(req => 
      capitalize(req.StatusCode)
    );
    const series = dashboardData.AllPendingRequests.map(req => req.Total);

    return { categories, series };
  }, [dashboardData]);

  // Invoices by Status Chart Data
  const invoicesChartData = useMemo(() => {
    if (!dashboardData?.InvoicesByStatus) return { series: [], labels: [], colors: [] };

    const statusColors: Record<string, string> = {
      'PAID': '#10B981',
      'DRAFT': '#64748B',
      'UNPAID': '#FB5454',
      'PENDING': '#FFA70B',
    };

    const series = dashboardData.InvoicesByStatus.map(item => item.Total);
    const labels = dashboardData.InvoicesByStatus.map(item => capitalize(item.StatusCode));
    const colors = dashboardData.InvoicesByStatus.map(item => 
      statusColors[item.StatusCode] || '#3C50E0'
    );

    return { series, labels, colors };
  }, [dashboardData]);

  // Monthly Finance Chart Data
  const monthlyFinanceChartData = useMemo(() => {
    if (!dashboardData?.MonthlyFinanceByAsset) return { categories: [], series: [] };

    // Group by month and sum totals
    const monthlyTotals: Record<string, number> = {};
    dashboardData.MonthlyFinanceByAsset.forEach(item => {
      if (!monthlyTotals[item.Month]) {
        monthlyTotals[item.Month] = 0;
      }
      monthlyTotals[item.Month] += item.Total;
    });

    const categories = Object.keys(monthlyTotals).sort();
    const series = categories.map(month => monthlyTotals[month]);

    return { categories, series };
  }, [dashboardData]);

  // Arrears Chart Data
  const arrearsChartData = useMemo(() => {
    if (!dashboardData?.ArrearsByAsset) return { categories: [], series: [] };

    const categories = dashboardData.ArrearsByAsset.map(item => item.AssetTitle);
    const unpaidSeries = dashboardData.ArrearsByAsset.map(item => item.UnpaidTotal);
    const paidSeries = dashboardData.ArrearsByAsset.map(item => item.PaidTotal);

    return { categories, unpaidSeries, paidSeries };
  }, [dashboardData]);

  // Invoice Chart Options
  const invoiceChartOptions: ApexOptions = {
    chart: {
      fontFamily: "Satoshi, sans-serif",
      type: "donut",
      height: 350,
    },
    colors: invoicesChartData.colors,
    labels: invoicesChartData.labels,
    legend: {
      show: true,
      position: "bottom",
      fontFamily: "Satoshi",
      fontSize: "14px",
      labels: {
        colors: undefined,
        useSeriesColors: true,
      },
    },
    plotOptions: {
      pie: {
        donut: {
          size: "65%",
          background: "transparent",
        },
      },
    },
    dataLabels: {
      enabled: true,
      formatter: function (val: number) {
        return val.toFixed(1) + "%";
      },
    },
    responsive: [
      {
        breakpoint: 640,
        options: {
          chart: {
            height: 300,
          },
        },
      },
    ],
    tooltip: {
      theme: 'dark',
    },
  };

  // Chart Options
  const propertiesChartOptions: ApexOptions = {
    chart: {
      fontFamily: "Satoshi, sans-serif",
      type: "donut",
      height: 350,
    },
    colors: propertiesChartData.colors,
    labels: propertiesChartData.labels,
    legend: {
      show: true,
      position: "bottom",
      fontFamily: "Satoshi",
      fontSize: "14px",
      labels: {
        colors: undefined,
        useSeriesColors: true,
      },
    },
    plotOptions: {
      pie: {
        donut: {
          size: "65%",
          background: "transparent",
        },
      },
    },
    dataLabels: {
      enabled: true,
      formatter: function (val: number) {
        return val.toFixed(1) + "%";
      },
    },
    responsive: [
      {
        breakpoint: 640,
        options: {
          chart: {
            height: 300,
          },
        },
      },
    ],
    tooltip: {
      theme: 'dark',
    },
  };

  const paymentChartOptions: ApexOptions = {
    chart: {
      fontFamily: "Satoshi, sans-serif",
      type: "donut",
      height: 350,
    },
    colors: paymentChartData.colors,
    labels: paymentChartData.labels,
    legend: {
      show: true,
      position: "bottom",
      fontFamily: "Satoshi",
      fontSize: "14px",
    },
    plotOptions: {
      pie: {
        donut: {
          size: "65%",
          background: "transparent",
        },
      },
    },
    dataLabels: {
      enabled: true,
      formatter: function (val: number) {
        return val.toFixed(1) + "%";
      },
    },
    responsive: [
      {
        breakpoint: 640,
        options: {
          chart: {
            height: 300,
          },
        },
      },
    ],
    tooltip: {
      theme: 'dark',
    },
  };

  const requestsChartOptions: ApexOptions = {
    chart: {
      fontFamily: "Satoshi, sans-serif",
      type: "bar",
      height: 350,
      toolbar: {
        show: false,
      },
    },
    colors: ["#3C50E0"],
    plotOptions: {
      bar: {
        borderRadius: 4,
        horizontal: false,
        columnWidth: "55%",
      },
    },
    dataLabels: {
      enabled: true,
    },
    xaxis: {
      categories: requestsChartData.categories,
      labels: {
        style: {
          fontSize: "12px",
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          fontSize: "12px",
        },
      },
    },
    responsive: [
      {
        breakpoint: 640,
        options: {
          chart: {
            height: 300,
          },
        },
      },
    ],
    tooltip: {
      theme: 'dark',
    },
  };
  
  return (
    <DefaultLayout>
      <Breadcrumb previousPage={false} pageName={t('dashboardOverview')} />

      <div className="w-full space-y-6">
        {/* Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {/* Total Revenue */}
          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm border border-stroke dark:border-strokedark">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  {t('totalRevenue')}
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {metrics ? formatNumberWithSpaces(metrics.totalRevenue) : '0'} {metrics?.currency}
                </p>
                {metrics && metrics.collectionRate !== '0' && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {landlordT('collectionRate')}: {metrics.collectionRate}%
                  </p>
                )}
              </div>
              <div className="bg-[#48BB78] p-3 rounded-full">
                <Coins className="text-white" size={24} />
              </div>
            </div>
          </div>

          {/* Properties */}
          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm border border-stroke dark:border-strokedark">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  {t('properties')}
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {dashboardData?.Counts.properties || 0}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {dashboardData?.PropertiesByStatus.length || 0} {t('status')}
                </p>
              </div>
              <div className="bg-blue-500 p-3 rounded-full">
                <Home className="text-white" size={24} />
              </div>
            </div>
          </div>

          {/* Pending Invoices */}
          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm border border-stroke dark:border-strokedark">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  {landlordT('pendingInvoices')}
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {dashboardData?.Counts.pendingInvoices || 0}
                </p>
                {metrics && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {landlordT('totalUnpaid')}: {formatNumberWithSpaces(metrics.unpaidAmount)} {metrics.currency}
                  </p>
                )}
              </div>
              <div className="bg-orange-500 p-3 rounded-full">
                <FileText className="text-white" size={24} />
              </div>
            </div>
          </div>

          {/* Pending Requests */}
          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm border border-stroke dark:border-strokedark">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  {landlordT('pendingRequests')}
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {dashboardData?.Counts.pendingRequests || 0}
                </p>
                {dashboardData?.Counts.unreadMessages !== undefined && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {landlordT('unreadMessages')}: {dashboardData.Counts.unreadMessages}
                  </p>
                )}
              </div>
              <div className="bg-purple-500 p-3 rounded-full">
                <AlertCircle className="text-white" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Financial Summary Cards */}
        {metrics && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm border border-stroke dark:border-strokedark">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    {landlordT('totalPaid')}
                  </p>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {formatNumberWithSpaces(metrics.paidAmount)} {metrics.currency}
                  </p>
                </div>
                <TrendingUp className="text-green-600 dark:text-green-400" size={24} />
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm border border-stroke dark:border-strokedark">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    {landlordT('totalUnpaid')}
                  </p>
                  <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                    {formatNumberWithSpaces(metrics.unpaidAmount)} {metrics.currency}
                  </p>
                </div>
                <DollarSign className="text-red-600 dark:text-red-400" size={24} />
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm border border-stroke dark:border-strokedark">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    {landlordT('collectionRate')}
                  </p>
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {metrics.collectionRate}%
                  </p>
                </div>
                <TrendingUp className="text-blue-600 dark:text-blue-400" size={24} />
              </div>
            </div>
          </div>
        )}

        {/* Total Finance and Arrears Cards */}
        {(dashboardData?.TotalFinance !== undefined || dashboardData?.TotalArrears !== undefined) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {dashboardData.TotalFinance !== undefined && (
              <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm border border-stroke dark:border-strokedark">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                      {landlordT('totalFinance')}
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {formatNumberWithSpaces(dashboardData.TotalFinance)} {metrics?.currency || 'FCFA'}
                    </p>
                  </div>
                  <div className="bg-blue-500 p-3 rounded-full">
                    <FileCheck className="text-white" size={24} />
                  </div>
                </div>
              </div>
            )}

            {dashboardData.TotalArrears !== undefined && (
              <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm border border-stroke dark:border-strokedark">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                      {landlordT('totalArrears')}
                    </p>
                    <p className={`text-2xl font-bold ${dashboardData.TotalArrears > 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                      {formatNumberWithSpaces(dashboardData.TotalArrears)} {metrics?.currency || 'FCFA'}
                    </p>
                  </div>
                  <div className={`p-3 rounded-full ${dashboardData.TotalArrears > 0 ? 'bg-red-500' : 'bg-green-500'}`}>
                    <AlertCircle className="text-white" size={24} />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          {/* Properties by Status Chart */}
          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm border border-stroke dark:border-strokedark">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {landlordT('propertiesByStatus')}
            </h3>
            {dashboardData && propertiesChartData.series.length > 0 ? (
              <ReactApexChart
                options={propertiesChartOptions}
                series={propertiesChartData.series}
                type="donut"
                height={350}
              />
            ) : (
              <div className="flex items-center justify-center h-[350px] text-gray-500 dark:text-gray-400">
                {t('nothingToDisplay')}
              </div>
            )}
          </div>

          {/* Payment Status Chart */}
          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm border border-stroke dark:border-strokedark">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {landlordT('paymentStatus')}
            </h3>
            {dashboardData && paymentChartData.series.length > 0 && paymentChartData.series.some(s => s > 0) ? (
              <ReactApexChart
                options={paymentChartOptions}
                series={paymentChartData.series}
                type="donut"
                height={350}
              />
            ) : (
              <div className="flex items-center justify-center h-[350px] text-gray-500 dark:text-gray-400">
                {t('nothingToDisplay')}
              </div>
            )}
          </div>
        </div>

        {/* Pending Requests Chart */}
        {dashboardData && dashboardData.AllPendingRequests.length > 0 && (
          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm border border-stroke dark:border-strokedark">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {landlordT('pendingRequests')}
            </h3>
            <ReactApexChart
              options={requestsChartOptions}
              series={[{ name: landlordT('pendingRequests'), data: requestsChartData.series }]}
              type="bar"
              height={350}
            />
          </div>
        )}

        {/* Invoices by Status Chart */}
        {dashboardData && dashboardData.InvoicesByStatus && dashboardData.InvoicesByStatus.length > 0 && (
          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm border border-stroke dark:border-strokedark">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {landlordT('invoicesByStatus')}
            </h3>
            <ReactApexChart
              options={invoiceChartOptions}
              series={invoicesChartData.series}
              type="donut"
              height={350}
            />
          </div>
        )}

        {/* Monthly Finance Chart */}
        {dashboardData && monthlyFinanceChartData.categories.length > 0 && (
          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm border border-stroke dark:border-strokedark">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {landlordT('monthlyFinance')}
            </h3>
            <ReactApexChart
              options={{
                ...requestsChartOptions,
                colors: ["#3C50E0", "#10B981"],
                xaxis: {
                  categories: monthlyFinanceChartData.categories,
                  labels: {
                    style: { fontSize: "12px" },
                  },
                },
              }}
              series={[{ name: landlordT('monthlyFinance'), data: monthlyFinanceChartData.series }]}
              type="bar"
              height={350}
            />
          </div>
        )}

        {/* Arrears by Asset */}
        {dashboardData && dashboardData.ArrearsByAsset && dashboardData.ArrearsByAsset.length > 0 && (
          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm border border-stroke dark:border-strokedark">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {landlordT('arrearsByAsset')}
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th className="px-4 py-3">{t('property')}</th>
                    <th className="px-4 py-3">{landlordT('totalPaid')}</th>
                    <th className="px-4 py-3">{landlordT('totalUnpaid')}</th>
                    <th className="px-4 py-3">{t('status')}</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboardData.ArrearsByAsset.map((asset, index) => (
                    <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                        {asset.AssetTitle}
                      </td>
                      <td className="px-4 py-3 text-green-600 dark:text-green-400">
                        {formatNumberWithSpaces(asset.PaidTotal)} {asset.Currency}
                      </td>
                      <td className={`px-4 py-3 ${asset.UnpaidTotal > 0 ? 'text-red-600 dark:text-red-400' : 'text-gray-600 dark:text-gray-400'}`}>
                        {formatNumberWithSpaces(asset.UnpaidTotal)} {asset.Currency}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          asset.UnpaidTotal > 0 
                            ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                            : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        }`}>
                          {asset.UnpaidTotal > 0 ? landlordT('outstanding') : landlordT('paid')}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Current Loans */}
        {dashboardData && dashboardData.CurrentLoans && dashboardData.CurrentLoans.length > 0 && (
          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm border border-stroke dark:border-strokedark">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
              <Calendar size={20} />
              {landlordT('currentLoans')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {dashboardData.CurrentLoans.map((loan) => (
                <Link
                  key={loan.Code}
                  href={`/landlord/properties/${loan.AssetCode}`}
                  className="group relative overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-all"
                >
                  <div className="relative h-48 w-full overflow-hidden bg-gray-200 dark:bg-gray-700">
                    {loan.CoverUrl ? (
                      <Image
                        src={loan.CoverUrl}
                        alt={loan.Title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <Home size={48} />
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-1">
                      {loan.Title}
                    </h3>
                    <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                      <p className="flex items-center gap-2">
                        <Calendar size={14} />
                        {new Date(loan.StartDate).toLocaleDateString()} - {new Date(loan.EndDate).toLocaleDateString()}
                      </p>
                      <p className="flex items-center gap-2">
                        <DollarSign size={14} />
                        {formatNumberWithSpaces(loan.Amount)} {loan.Currency}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Pending Applications */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm border border-stroke dark:border-strokedark">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
            <FileText size={20} />
            {t('pendingApplications')}
          </h2>
          <div className="flex flex-col gap-3">
            {dashboardData && dashboardData.allApplications.length > 0 ? (
              dashboardData.allApplications.map(item => (
                <RentalRequestCard data={item} key={item.Code} />
              ))
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                {landlordT('noApplications')}
              </div>
            )}
          </div>
        </div>
      </div>

      <Overlay isOpen={isLoading} onClose={() => {}}>
        <ProcessingModal message={loadingMessage} />
      </Overlay>
    </DefaultLayout>
  );
}

"use client";

import React from 'react';
import { useTranslations, useLocale } from 'next-intl';
import {
  Building2,
  Users,
  FileText,
  DollarSign,
  TrendingUp,
  Calendar,
  AlertCircle,
} from 'lucide-react';
import SectionWrapper from '@/components/Cards/SectionWrapper';
import { IGetAssetDashboard } from '@/types/Property';
import { formatNumberWithSpaces } from '@/lib/utils';

/**
 * Props for AssetDashboard component
 */
export interface AssetDashboardProps {
  /** Dashboard data */
  dashboardData: IGetAssetDashboard | null;
  /** Whether data is loading */
  isLoading?: boolean;
}

/**
 * AssetDashboard - Displays property dashboard statistics and financial data
 * 
 * @example
 * ```tsx
 * <AssetDashboard
 *   dashboardData={dashboardData}
 *   isLoading={isLoadingDashboard}
 * />
 * ```
 */
/**
 * Formats a month string (e.g. "2025-01") to a localized display string
 */
function formatMonthLabel(monthStr: string, locale: string): string {
  const parts = monthStr.split('-');
  if (parts.length >= 2) {
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    if (!isNaN(year) && !isNaN(month)) {
      return new Date(year, month).toLocaleDateString(locale, {
        month: 'long',
        year: 'numeric',
      });
    }
  }
  return monthStr;
}

export function AssetDashboard({ dashboardData, isLoading }: AssetDashboardProps) {
  const commonT = useTranslations('Common');
  const landlordT = useTranslations('Landlord.assets');
  const locale = useLocale();

  if (isLoading) {
    return (
      <SectionWrapper title={landlordT('dashboard') || 'Dashboard'} Icon={TrendingUp}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 animate-pulse">
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/2 mb-2" />
              <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-3/4" />
            </div>
          ))}
        </div>
      </SectionWrapper>
    );
  }

  if (!dashboardData) {
    return null;
  }

  const { counts, financials } = dashboardData;

  return (
    <div className="space-y-4">
      {/* Counts Section */}
      <SectionWrapper title={landlordT('dashboardCounts') || 'Overview'} Icon={Building2}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Units */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Building2 size={18} className="text-gray-600 dark:text-gray-400" />
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {commonT('units')}
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {counts.units}
            </p>
          </div>

          {/* Managers */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Users size={18} className="text-gray-600 dark:text-gray-400" />
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {commonT('manager')}
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {counts.managers}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {counts.managersActive} {landlordT('active') || 'Active'} / {counts.managersPending} {commonT('pending')}
            </p>
          </div>

          {/* Contracts */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <FileText size={18} className="text-gray-600 dark:text-gray-400" />
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {commonT('contract')}
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {counts.contracts}
            </p>
          </div>

          {/* Tenants */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Users size={18} className="text-gray-600 dark:text-gray-400" />
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {commonT('tenant')}
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {counts.tenants}
            </p>
          </div>

          {/* Open Requests */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle size={18} className="text-gray-600 dark:text-gray-400" />
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {landlordT('openRequests')}
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {counts.openRequests}
            </p>
          </div>

          {/* Billing Configs */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <FileText size={18} className="text-gray-600 dark:text-gray-400" />
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {landlordT('billingConfigs')}
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {counts.billingConfigs}
            </p>
          </div>
        </div>
      </SectionWrapper>

      {/* Financials Section */}
      <SectionWrapper title={landlordT('financialOverview') || 'Financial Overview'} Icon={DollarSign}>
        <div className="space-y-6">
          {/* Current Month */}
          <div>
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
              {landlordT('currentMonth')} ({new Date().toLocaleDateString(locale, { month: 'long', year: 'numeric' })})
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                  {landlordT('billed') || 'Billed'}
                </p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">
                  {formatNumberWithSpaces(financials.currentMonth.billed)} {financials.currency}
                </p>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                  {landlordT('paid') || 'Paid'}
                </p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">
                  {formatNumberWithSpaces(financials.currentMonth.paid)} {financials.currency}
                </p>
              </div>
              <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                  {landlordT('outstanding') || 'Outstanding'}
                </p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">
                  {formatNumberWithSpaces(financials.currentMonth.outstanding)} {financials.currency}
                </p>
              </div>
              <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-1">
                  <AlertCircle size={14} className="text-gray-600 dark:text-gray-400" />
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {landlordT('unpaidInvoices') || 'Unpaid Invoices'}
                  </p>
                </div>
                <p className="text-xl font-bold text-gray-900 dark:text-white">
                  {financials.currentMonth.unpaidInvoiceCount}
                </p>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                  {landlordT('collectionRate') || 'Collection Rate'}
                </p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {financials.currentMonth.collectionRate.toFixed(1)}%
                </p>
              </div>
              {financials.currentMonth.nextDueDate && (
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Calendar size={14} className="text-gray-600 dark:text-gray-400" />
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {landlordT('nextDueDate') || 'Next Due Date'}
                    </p>
                  </div>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {new Date(financials.currentMonth.nextDueDate).toLocaleDateString(locale, { day: '2-digit', month: 'short', year: 'numeric' })}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Monthly Revenue */}
          {financials.monthlyRevenue && financials.monthlyRevenue.length > 0 ? (
            <div>
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
                {landlordT('monthlyRevenue')}
              </h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                {landlordT('revenueByMonth')}
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {financials.monthlyRevenue.map((item, index) => (
                  <div
                    key={`${item.month}-${index}`}
                    className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3"
                  >
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                      {formatMonthLabel(item.month, locale)}
                    </p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {formatNumberWithSpaces(item.total)} {financials.currency}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            financials.monthlyRevenue && (
              <div className="rounded-lg p-4 bg-gray-50 dark:bg-gray-700/50 text-center text-sm text-gray-500 dark:text-gray-400">
                {landlordT('noMonthlyRevenueData')}
              </div>
            )
          )}

          {/* Year to Date */}
          <div>
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
              {landlordT('yearToDate')}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                  {landlordT('revenueYTD') || 'Revenue YTD'}
                </p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">
                  {formatNumberWithSpaces(financials.revenueYTD)} {financials.currency}
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                  {landlordT('billedYTD') || 'Billed YTD'}
                </p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">
                  {formatNumberWithSpaces(financials.billedYTD)} {financials.currency}
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                  {landlordT('collectionRateYTD') || 'Collection Rate YTD'}
                </p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">
                  {financials.collectionRateYTD.toFixed(1)}%
                </p>
              </div>
            </div>
          </div>

          {/* Average Rent */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
              {landlordT('averageRentActive') || 'Average Rent (Active Contracts)'}
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatNumberWithSpaces(financials.avgRentActive)} {financials.currency}
            </p>
          </div>

          {/* Aging Analysis */}
          {financials.aging && (
            <div>
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
                {landlordT('agingAnalysis') || 'Aging Analysis'}
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">0-30 days</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {formatNumberWithSpaces(financials.aging.bucket_0_30)} {financials.currency}
                  </p>
                </div>
                <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-3">
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">31-60 days</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {formatNumberWithSpaces(financials.aging.bucket_31_60)} {financials.currency}
                  </p>
                </div>
                <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-3">
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">61-90 days</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {formatNumberWithSpaces(financials.aging.bucket_61_90)} {financials.currency}
                  </p>
                </div>
                <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-3">
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">90+ days</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {formatNumberWithSpaces(financials.aging.bucket_90_plus)} {financials.currency}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </SectionWrapper>
    </div>
  );
}


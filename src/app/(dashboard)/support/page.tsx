"use client"
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import {
  Users,
  Building2,
  CheckCircle,
  Clock,
  Activity,
  TrendingUp,
  UserPlus,
  Home,
} from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import toast from 'react-hot-toast'
import { useTranslations } from 'next-intl'
import { useRouter } from '@bprogress/next/app'

import DefaultLayout from '@/components/Layouts/DefaultLayout'
import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb'
import Overlay from '@/components/Overlay'
import { ProcessingModal } from '@/components/Modal/ProcessingModal'

import { MANAGER_PROFILE_LIST } from '@/constant'
import { roleStore } from '@/store/roleStore'
import { dashboard } from '@/actions/assetAction'
import { IDashBoardParams } from '@/types/Property'
import {
  ISupportDashboardResponse,
  ISupportRecentActivityItem,
  ISupportUserDistributionItem,
} from '@/types/dashboard'

interface StatCardProps {
  title: string
  value: string | number
  changePctThisMonth?: number
  icon: React.ReactNode
  color: string
}

const StatCard = ({ title, value, changePctThisMonth, icon, color }: StatCardProps) => {
  const t = useTranslations('Support.systemOverview')
  const showChange =
    typeof changePctThisMonth === 'number' && changePctThisMonth !== 0

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
          {showChange && (
            <p className={`text-sm mt-1 ${color}`}>
              <TrendingUp className="inline mr-1" size={14} />
              {t('thisMonthIncrease', { percent: changePctThisMonth })}
            </p>
          )}
        </div>
        <div
          className={`p-3 rounded-full ${color.replace('text', 'bg')} bg-opacity-10`}
        >
          {icon}
        </div>
      </div>
    </div>
  )
}

const ROLE_COLORS: Record<string, string> = {
  RENTER: '#4299E1',
  LANDLORD: '#48BB78',
  MANAGER: '#ED8936',
  SUPPORT: '#9F7AEA',
}

const PROGRESS_BAR_COLORS = ['bg-blue-500', 'bg-green-500', 'bg-purple-500']

const RECENT_ACTIVITY_MAP: Record<string, { i18nKey: string; icon: React.ReactNode }> = {
  New_Lessor_Registration: {
    i18nKey: 'newLessorRegistration',
    icon: <UserPlus size={16} className="text-blue-500" />,
  },
  Property_Verification_Approved: {
    i18nKey: 'propertyVerificationApproved',
    icon: <CheckCircle size={16} className="text-green-500" />,
  },
  New_Property_Listed: {
    i18nKey: 'newPropertyListed',
    icon: <Home size={16} className="text-purple-500" />,
  },
}

const formatMonthLabel = (month: string, locale: string): string => {
  const [yearStr, monthStr] = month.split('-')
  const year = Number(yearStr)
  const monthIndex = Number(monthStr) - 1
  if (Number.isNaN(year) || Number.isNaN(monthIndex)) return month
  const date = new Date(year, monthIndex, 1)
  return new Intl.DateTimeFormat(locale, { month: 'short' }).format(date)
}

const SystemOverview = () => {
  const router = useRouter()
  const { isAuthorized, getProfileCode } = roleStore()
  const t = useTranslations('Support.systemOverview')
  const commonT = useTranslations('Common')

  const [isLoading, setIsLoading] = useState(false)
  const [dashboardData, setDashboardData] = useState<ISupportDashboardResponse | null>(null)

  const loadingMessage = commonT('loadingData')

  const init = useCallback(async () => {
    const profileCode = getProfileCode('ADMIN')
    if (!profileCode) return
    try {
      setIsLoading(true)
      const params: IDashBoardParams = {
        offset: 0,
        page: 1,
        limit: 1000,
        profileCode,
        endDate: '',
        startDate: '',
        term: '',
        type: '',
      }
      const result = await dashboard(params);
      console.log('-->result', result);

      if (result.data) {
        const payload = result.data?.body?.dashboard as ISupportDashboardResponse | undefined
        if (payload) setDashboardData(payload)
      } else if (result.error) {
        if (result.code === 'SESSION_EXPIRED') {
          router.push('/signin')
          return
        }
        toast.error(result.error ?? commonT('unexpectedError'), { position: 'bottom-right' })
      }
    } catch (error) {
      console.error('Support dashboard error:', error)
      toast.error(commonT('unexpectedError'), { position: 'bottom-right' })
    } finally {
      setIsLoading(false)
    }
  }, [getProfileCode, router, commonT])

  useEffect(() => {
    if (!isAuthorized(MANAGER_PROFILE_LIST)) {
      router.push('/unauthorized')
      return
    }
    init()
  }, [init, isAuthorized, router])

  const statCards = useMemo(() => {
    if (!dashboardData) return []
    const { cards } = dashboardData
    return [
      {
        title: t('activeUsers'),
        value: cards.activeUsers?.value ?? 0,
        changePctThisMonth: cards.activeUsers?.changePctThisMonth,
        icon: <Users size={24} className="text-blue-600" />,
        color: 'text-blue-600',
      },
      {
        title: t('propertiesListed'),
        value: cards.propertiesListed?.value ?? 0,
        changePctThisMonth: cards.propertiesListed?.changePctThisMonth,
        icon: <Building2 size={24} className="text-green-600" />,
        color: 'text-green-600',
      },
      {
        title: t('pendingVerifications'),
        value: cards.pendingVerifications?.value ?? 0,
        icon: <Clock size={24} className="text-orange-600" />,
        color: 'text-orange-600',
      },
      {
        title: t('monthlyActivity'),
        value: `${cards.monthlyActivity?.valuePct ?? 0}%`,
        changePctThisMonth: cards.monthlyActivity?.changePctThisMonth,
        icon: <Activity size={24} className="text-purple-600" />,
        color: 'text-purple-600',
      },
    ]
  }, [dashboardData, t])

  const userGrowthData = useMemo(() => {
    if (!dashboardData) return []
    return dashboardData.userGrowth.map((point) => ({
      month: formatMonthLabel(point.month, 'en'),
      users: point.value,
    }))
  }, [dashboardData])

  const userDistributionData = useMemo(() => {
    if (!dashboardData) return []
    return dashboardData.userDistribution.map((item: ISupportUserDistributionItem) => {
      const role = (item.role || '').toUpperCase()
      const i18nKey = role === 'RENTER'
        ? 'renters'
        : role === 'LANDLORD'
          ? 'lessors'
          : role === 'MANAGER'
            ? 'managers'
            : role === 'SUPPORT'
              ? 'support'
              : null
      return {
        name: i18nKey ? t(i18nKey) : item.label,
        value: item.count,
        // Do not use key "percent": Recharts reserves it (0–1 slice ratio) for Pie labels.
        reportedPct: item.percent,
        color: ROLE_COLORS[role] ?? '#A0AEC0',
      }
    })
  }, [dashboardData, t])

  const recentActivityItems = useMemo(() => {
    if (!dashboardData) return []
    return dashboardData.recentActivity.map((item: ISupportRecentActivityItem, index) => {
      const mapping = RECENT_ACTIVITY_MAP[item.title]
      const action = mapping ? t(mapping.i18nKey) : item.title.replace(/_/g, ' ')
      const icon = mapping?.icon ?? <Activity size={16} className="text-gray-500" />
      const unitKey = `unit_${item.unit}`
      let unitLabel: string
      try {
        unitLabel = t(unitKey)
      } catch {
        unitLabel = item.unit
      }
      const time = t('agoFormat', { count: item.ago, unit: unitLabel })
      return { key: `${item.title}-${index}`, action, time, icon }
    })
  }, [dashboardData, t])

  const verificationItems = useMemo(() => {
    if (!dashboardData) return []
    const { verificationStatus } = dashboardData
    return [
      { label: t('lessorVerifications'), value: verificationStatus.lessorVerificationsPct ?? 0 },
      { label: t('propertyVerifications'), value: verificationStatus.propertyVerificationsPct ?? 0 },
      { label: t('supportResponseRate'), value: verificationStatus.supportResponseRatePct ?? 0 },
    ]
  }, [dashboardData, t])

  const hasUserGrowth = userGrowthData.some((p) => p.users > 0)
  const hasUserDistribution = userDistributionData.some((d) => d.value > 0)

  return (
    <DefaultLayout>
      <Breadcrumb previousPage={false} pageName={t('title')} />
      <div className="w-full min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {statCards.map((stat, index) => (
              <StatCard key={index} {...stat} />
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm">
              <h2 className="text-lg font-semibold mb-4">{t('userGrowth')}</h2>
              <div className="h-[300px] w-full">
                {hasUserGrowth ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={userGrowthData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="month"
                        tick={{ fontSize: 12 }}
                        interval="preserveStartEnd"
                      />
                      <YAxis tick={{ fontSize: 12 }} width={40} />
                      <Tooltip />
                      <Bar dataKey="users" fill="#4299E1" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    {commonT('nothingToDisplay')}
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm">
              <h2 className="text-lg font-semibold mb-4">{t('userDistribution')}</h2>
              <div className="h-[300px] w-full">
                {hasUserDistribution ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={userDistributionData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label={({ name, percent }) =>
                          `${name} ${(percent * 100).toFixed(0)}%`
                        }
                        labelLine={false}
                      >
                        {userDistributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value: number, name: string, item) => {
                          const pct = (item as { payload?: { reportedPct?: number } })
                            .payload?.reportedPct
                          const suffix =
                            typeof pct === 'number' ? ` (${pct.toFixed(1)}%)` : ''
                          return [`${value}${suffix}`, name]
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    {commonT('nothingToDisplay')}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm">
              <h2 className="text-lg font-semibold mb-4">{t('recentActivity')}</h2>
              <div className="space-y-4">
                {recentActivityItems.length > 0 ? (
                  recentActivityItems.map((activity) => (
                    <div
                      key={activity.key}
                      className="flex items-start gap-4 pb-4 border-b border-gray-100 last:border-0"
                    >
                      <div className="mt-1 flex-shrink-0">{activity.icon}</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-gray-900 truncate">{activity.action}</p>
                        <p className="text-sm text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    {commonT('nothingToDisplay')}
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm">
              <h2 className="text-lg font-semibold mb-4">{t('verificationStatus')}</h2>
              <div className="space-y-6">
                {verificationItems.map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">{item.label}</span>
                      <span className="text-sm font-medium">
                        {Number(item.value).toFixed(1)}%
                      </span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${PROGRESS_BAR_COLORS[index % PROGRESS_BAR_COLORS.length]} rounded-full`}
                        style={{ width: `${Math.min(100, Math.max(0, Number(item.value)))}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Overlay isOpen={isLoading} onClose={() => {}}>
        <ProcessingModal message={loadingMessage} />
      </Overlay>
    </DefaultLayout>
  )
}

export default SystemOverview

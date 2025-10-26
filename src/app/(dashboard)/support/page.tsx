"use client"
import React, { useEffect } from 'react'
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
import DefaultLayout from '@/components/Layouts/DefaultLayout'
import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb'
import { MANAGER_PROFILE_LIST } from '@/constant'
import { useRouter } from '@bprogress/next/app'
import { roleStore } from '@/store/roleStore'
import { useTranslations } from 'next-intl'
interface StatCardProps {
  title: string
  value: string | number
  change?: string
  icon: React.ReactNode
  color: string
}
const StatCard = ({ title, value, change, icon, color }: StatCardProps) => {
  const t = useTranslations('Support.systemOverview')

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
          {change && (
            <p className={`text-sm mt-1 ${color}`}>
              <TrendingUp className="inline mr-1" size={14} />
              {t('thisMonthIncrease', { percent: change })}
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
const SystemOverview = () => {
  const { isAuthorized } = roleStore();
  const router = useRouter();
  const t = useTranslations('Support.systemOverview')

  const userGrowthData = [
    {
      month: 'Jan',
      users: 120,
    },
    {
      month: 'Feb',
      users: 180,
    },
    {
      month: 'Mar',
      users: 250,
    },
    {
      month: 'Apr',
      users: 310,
    },
    {
      month: 'May',
      users: 420,
    },
    {
      month: 'Jun',
      users: 480,
    },
  ]
  const userDistributionData = [
    {
      name: t('renters'),
      value: 450,
      color: '#4299E1',
    },
    {
      name: t('lessors'),
      value: 230,
      color: '#48BB78',
    },
    {
      name: t('managers'),
      value: 85,
      color: '#ED8936',
    },
    {
      name: t('support'),
      value: 15,
      color: '#9F7AEA',
    },
  ]
  const verificationStats = [
    {
      title: t('activeUsers'),
      value: '780',
      change: '12.5',
      icon: <Users size={24} className="text-blue-600" />,
      color: 'text-blue-600',
    },
    {
      title: t('propertiesListed'),
      value: '324',
      change: '8.2',
      icon: <Building2 size={24} className="text-green-600" />,
      color: 'text-green-600',
    },
    {
      title: t('pendingVerifications'),
      value: '45',
      icon: <Clock size={24} className="text-orange-600" />,
      color: 'text-orange-600',
    },
    {
      title: t('monthlyActivity'),
      value: '92%',
      change: '5.4',
      icon: <Activity size={24} className="text-purple-600" />,
      color: 'text-purple-600',
    },
  ]
  const recentActivity = [
    {
      action: t('newLessorRegistration'),
      time: t('minutesAgo', { count: 5 }),
      icon: <UserPlus size={16} className="text-blue-500" />,
    },
    {
      action: t('propertyVerificationApproved'),
      time: t('minutesAgo', { count: 12 }),
      icon: <CheckCircle size={16} className="text-green-500" />,
    },
    {
      action: t('newPropertyListed'),
      time: t('minutesAgo', { count: 45 }),
      icon: <Home size={16} className="text-purple-500" />,
    },
  ]

  useEffect(() => {
    if (!isAuthorized(MANAGER_PROFILE_LIST)) {
      router.push("/unauthorized");
    }
  }, []);
  return (
    <DefaultLayout>
      <Breadcrumb previousPage={false} pageName={t('title')} />
      <div className="w-full min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {verificationStats.map((stat, index) => (
              <StatCard key={index} {...stat} />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm">
              <h2 className="text-lg font-semibold mb-4">{t('userGrowth')}</h2>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={userGrowthData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="month"
                      tick={{
                        fontSize: 12,
                      }}
                      interval="preserveStartEnd"
                    />
                    <YAxis
                      tick={{
                        fontSize: 12,
                      }}
                      width={40}
                    />
                    <Tooltip />
                    <Bar dataKey="users" fill="#4299E1" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm">
              <h2 className="text-lg font-semibold mb-4">{t('userDistribution')}</h2>
              <div className="h-[300px] w-full">
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
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm">
              <h2 className="text-lg font-semibold mb-4">{t('recentActivity')}</h2>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-4 pb-4 border-b border-gray-100 last:border-0"
                  >
                    <div className="mt-1 flex-shrink-0">{activity.icon}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-900 truncate">{activity.action}</p>
                      <p className="text-sm text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm">
              <h2 className="text-lg font-semibold mb-4">{t('verificationStatus')}</h2>
              <div className="space-y-6">
                {[
                  {
                    label: t('lessorVerifications'),
                    value: 75,
                    color: 'blue',
                  },
                  {
                    label: t('propertyVerifications'),
                    value: 60,
                    color: 'green',
                  },
                  {
                    label: t('supportResponseRate'),
                    value: 90,
                    color: 'purple',
                  },
                ].map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">{item.label}</span>
                      <span className="text-sm font-medium">{item.value}%</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full bg-${item.color}-500 rounded-full`}
                        style={{
                          width: `${item.value}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DefaultLayout>
  )
}


export default SystemOverview;


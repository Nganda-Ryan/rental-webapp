"use client"
import React from 'react'
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
import { useAuth } from '@/context/AuthContext'
import { MANAGER_PROFILE_LIST } from '@/constant'
interface StatCardProps {
  title: string
  value: string | number
  change?: string
  icon: React.ReactNode
  color: string
}
const StatCard = ({ title, value, change, icon, color }: StatCardProps) => (
  <div className="bg-white p-6 rounded-lg shadow-sm">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-gray-600 mb-1">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
        {change && (
          <p className={`text-sm mt-1 ${color}`}>
            <TrendingUp className="inline mr-1" size={14} />
            {change} this month
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
const SystemOverview = () => {
  const { isAuthorized, loadingProfile } = useAuth();
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
      name: 'Tenants',
      value: 450,
      color: '#4299E1',
    },
    {
      name: 'Lessors',
      value: 230,
      color: '#48BB78',
    },
    {
      name: 'Managers',
      value: 85,
      color: '#ED8936',
    },
    {
      name: 'Support',
      value: 15,
      color: '#9F7AEA',
    },
  ]
  const verificationStats = [
    {
      title: 'Active Users',
      value: '780',
      change: '+12.5%',
      icon: <Users size={24} className="text-blue-600" />,
      color: 'text-blue-600',
    },
    {
      title: 'Properties Listed',
      value: '324',
      change: '+8.2%',
      icon: <Building2 size={24} className="text-green-600" />,
      color: 'text-green-600',
    },
    {
      title: 'Pending Verifications',
      value: '45',
      icon: <Clock size={24} className="text-orange-600" />,
      color: 'text-orange-600',
    },
    {
      title: 'Monthly Activity',
      value: '92%',
      change: '+5.4%',
      icon: <Activity size={24} className="text-purple-600" />,
      color: 'text-purple-600',
    },
  ]
  const recentActivity = [
    {
      action: 'New Lessor Registration',
      time: '5 minutes ago',
      icon: <UserPlus size={16} className="text-blue-500" />,
    },
    {
      action: 'Property Verification Approved',
      time: '12 minutes ago',
      icon: <CheckCircle size={16} className="text-green-500" />,
    },
    {
      action: 'New Property Listed',
      time: '45 minutes ago',
      icon: <Home size={16} className="text-purple-500" />,
    },
  ]
  if (!loadingProfile && !isAuthorized(MANAGER_PROFILE_LIST)) {
    return <div>Unauthorized</div>;
  }
  return (
    <DefaultLayout>
      <Breadcrumb previousPage={false} pageName="System Overview" />
      <div className="w-full min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {verificationStats.map((stat, index) => (
              <StatCard key={index} {...stat} />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm">
              <h2 className="text-lg font-semibold mb-4">User Growth</h2>
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
              <h2 className="text-lg font-semibold mb-4">User Distribution</h2>
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
              <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
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
              <h2 className="text-lg font-semibold mb-4">Verification Status</h2>
              <div className="space-y-6">
                {[
                  {
                    label: 'Lessor Verifications',
                    value: 75,
                    color: 'blue',
                  },
                  {
                    label: 'Property Verifications',
                    value: 60,
                    color: 'green',
                  },
                  {
                    label: 'Support Response Rate',
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


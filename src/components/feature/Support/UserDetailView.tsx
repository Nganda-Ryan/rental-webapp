"use client"
import React from 'react'
import {
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  Building2,
  MapPin,
  Clock,
  CheckCircle,
  UserCircle2,
  Shield,
  Key,
} from 'lucide-react'
interface UserDetailViewProps {
  onBack: () => void
  onPropertyClick?: (propertyId: string) => void
  data: {
    id: string
    name: string
    email: string
    phone: string
    role: string
    status: string
    joinDate: string
    verifiedDate?: string
    permissions?: string[]
    properties?: Array<{
      id: string
      name: string
      address: string
      image: string
      status: string
    }>
    recentActivity?: Array<{
      action: string
      time: string
      icon: React.ReactNode
    }>
  }
}
export const UserDetailView = ({
  onBack,
  onPropertyClick,
  data,
}: UserDetailViewProps) => {
  const getRoleBadge = (role: string) => {
    const colors = {
      lessor: 'bg-blue-100 text-blue-800',
      tenant: 'bg-purple-100 text-purple-800',
      manager: 'bg-orange-100 text-orange-800',
      admin: 'bg-red-100 text-red-800',
      moderator: 'bg-green-100 text-green-800',
      support: 'bg-gray-100 text-gray-800',
    }
    return colors[role.toLowerCase() as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }
  const getStatusBadge = (status: string) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      inactive: 'bg-red-100 text-red-800',
    }
    return colors[status.toLowerCase() as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }
  return (
    <div className="w-full min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-2xl font-bold">User Details</h1>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* User Info Card */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex flex-col sm:flex-row items-start gap-6 mb-6">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <UserCircle2 size={40} className="text-gray-400" />
                </div>
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
                    <h2 className="text-2xl font-semibold">{data.name}</h2>
                    <div className="flex flex-wrap gap-2">
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${getRoleBadge(data.role)}`}
                      >
                        {data.role}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${getStatusBadge(data.status)}`}
                      >
                        {data.status}
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Mail size={16} />
                        <span>{data.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Phone size={16} />
                        <span>{data.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar size={16} />
                        <span>Joined {data.joinDate}</span>
                      </div>
                    </div>
                    {data.permissions && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Shield size={16} />
                          <span>Permissions</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {data.permissions.map((permission, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-sm"
                            >
                              {permission}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            {/* Properties Section */}
            {data.properties && data.properties.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold mb-4">
                  {data.role === 'lessor'
                    ? 'Properties Owned'
                    : data.role === 'manager'
                      ? 'Properties Managed'
                      : 'Current Residence'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {data.properties.map((property) => (
                    <div
                      key={property.id}
                      onClick={() => onPropertyClick?.(property.id)}
                      className="border rounded-lg overflow-hidden hover:border-blue-500 cursor-pointer transition-colors"
                    >
                      <div className="aspect-video relative">
                        <img
                          src={property.image}
                          alt={property.name}
                          className="w-full h-full object-cover"
                        />
                        <div
                          className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs
                          ${property.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}
                        >
                          {property.status}
                        </div>
                      </div>
                      <div className="p-4">
                        <h4 className="font-medium mb-1">{property.name}</h4>
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <MapPin size={14} />
                          <span>{property.address}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Activity Feed */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-medium mb-4">Recent Activity</h3>
              <div className="space-y-4">
                {data.recentActivity?.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 pb-4 border-b border-gray-100 last:border-0"
                  >
                    <div className="mt-1">{activity.icon}</div>
                    <div>
                      <p className="text-gray-900">{activity.action}</p>
                      <p className="text-sm text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-medium mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 flex items-center justify-center gap-2">
                  <Key size={16} />
                  Reset Password
                </button>
                <button className="w-full px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 flex items-center justify-center gap-2">
                  {data.status === 'active'
                    ? 'Deactivate Account'
                    : 'Activate Account'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
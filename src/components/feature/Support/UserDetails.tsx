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
} from 'lucide-react'
import Image from 'next/image'
import DefaultLayout from '@/components/Layouts/DefaultLayout'
import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb'
interface UserDetailProps {
  onBack: () => void
  onPropertyClick: (propertyId: string) => void
}
export const UserDetail = ({ onBack, onPropertyClick }: UserDetailProps) => {
  // This would come from your API/state management in a real app
  const user = {
    id: 'USR001',
    name: 'John Smith',
    email: 'john.smith@example.com',
    phone: '(555) 123-4567',
    role: 'lessor',
    status: 'active' as 'active' | 'pending' | 'inactive',
    joinDate: '2023-01-15',
    verifiedDate: '2023-01-20',
    properties: [
      {
        id: 'PROP001',
        name: 'Marina Heights Complex',
        address: '123 Marina Avenue, San Francisco, CA 94107',
        image: 'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6',
        status: 'active',
      },
      {
        id: 'PROP002',
        name: 'Park View Residences',
        address: '456 Park Road, San Francisco, CA 94108',
        image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994',
        status: 'pending',
      },
    ],
  }
  const getRoleBadge = (role: string) => {
    const colors = {
      lessor: 'bg-blue-100 text-blue-800',
      tenant: 'bg-purple-100 text-purple-800',
      manager: 'bg-orange-100 text-orange-800',
    }
    return colors[role as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }
  const getStatusBadge = (status: 'active' | 'pending' | 'inactive') => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      inactive: 'bg-red-100 text-red-800',
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }
  return (
    <DefaultLayout>
        <Breadcrumb previousPage pageName="User Detail" />
        <div className="w-full">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* User Info Section */}
            <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                    <UserCircle2 size={40} className="text-gray-400" />
                    </div>
                    <div>
                    <h2 className="text-xl font-semibold">{user.name}</h2>
                    <div className="flex items-center gap-2 mt-1">
                        <span
                        className={`px-2 py-1 text-xs rounded-full ${getRoleBadge(user.role)}`}
                        >
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                        </span>
                        <span
                        className={`px-2 py-1 text-xs rounded-full ${getStatusBadge(user.status)}`}
                        >
                        {user.status.charAt(0).toUpperCase() +
                            user.status.slice(1)}
                        </span>
                    </div>
                    </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar size={16} />
                    <span>Joined {user.joinDate}</span>
                </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-gray-600">
                    <Mail size={16} />
                    <span>{user.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                    <Phone size={16} />
                    <span>{user.phone}</span>
                    </div>
                </div>
                {user.verifiedDate && (
                    <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle size={16} />
                    <span>Verified on {user.verifiedDate}</span>
                    </div>
                )}
                </div>
            </div>
            {/* Properties Section */}
            {user.properties && user.properties.length > 0 && (
                <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold mb-4">
                    {user.role === 'lessor'
                    ? 'Properties Owned'
                    : user.role === 'manager'
                        ? 'Properties Managed'
                        : 'Current Residence'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {user.properties.map((property) => (
                    <div
                        key={property.id}
                        onClick={() => onPropertyClick(property.id)}
                        className="border rounded-lg overflow-hidden hover:border-blue-500 cursor-pointer transition-colors"
                    >
                        <div className="h-48 relative">
                        <Image
                            src={property.image}
                            alt={property.name}
                            className="w-full h-full object-cover"
                            width={800}
                            height={800}
                        />
                        <div
                            className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs
                            ${property.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}
                        >
                            {property.status.charAt(0).toUpperCase() +
                            property.status.slice(1)}
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
            {/* Activity Section */}
            <div className="space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="font-medium mb-4">Recent Activity</h3>
                <div className="space-y-4">
                {[
                    {
                    action: 'Profile updated',
                    time: '2 hours ago',
                    icon: <UserCircle2 size={16} className="text-blue-500" />,
                    },
                    {
                    action: 'Property verification submitted',
                    time: '1 day ago',
                    icon: <Building2 size={16} className="text-green-500" />,
                    },
                    {
                    action: 'Document uploaded',
                    time: '3 days ago',
                    icon: <Clock size={16} className="text-orange-500" />,
                    },
                ].map((activity, index) => (
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
            </div>
        </div>
        </div>
    </DefaultLayout>
  )
}

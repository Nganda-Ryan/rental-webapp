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
  Plus,
  FilePenLine,
  FilePlus2,
  FileCheck2,
} from 'lucide-react'
import DefaultLayout from '@/components/Layouts/DefaultLayout'
import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb'
import Image from 'next/image'

interface UserData {
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


const UserDetailView = () => {
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
    
    const handleOpenPropertiy = (propertyId: string) => {
        console.log('Navigate to property:', propertyId)
    }
    const data: UserData = {
        id: "usr-5839",
        name: "Sophie Martin",
        email: "sophie.martin@example.com",
        phone: "+33 6 12 34 56 78",
        role: "Property Manager",
        status: "active",
        joinDate: "2023-09-15T14:30:00Z",
        verifiedDate: "2023-09-16T09:45:00Z",
        permissions: [
        "view_properties",
        "edit_properties",
        "manage_tenants",
        "view_reports"
        ],
        properties: [
        {
            id: "prop-452",
            name: "Résidence Les Oliviers",
            address: "24 Avenue des Mimosas, 06400 Cannes",
            image: "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
            status: "available"
        },
        {
            id: "prop-581",
            name: "Villa Méditerranée",
            address: "8 Rue des Pins, 13008 Marseille",
            image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            status: "occupied"
        },
        {
            id: "prop-723",
            name: "Appartement Haussmann",
            address: "42 Boulevard Saint-Germain, 75006 Paris",
            image: "https://images.unsplash.com/photo-1448630360428-65456885c650?q=80&w=2067&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            status: "maintenance"
        }
        ],
        recentActivity: [
        {
            action: "A ajouté une nouvelle propriété: Villa Méditerranée",
            time: "2024-04-15T10:23:00Z",
            icon: <FilePlus2 />
        },
        {
            action: "A mis à jour les informations de Résidence Les Oliviers",
            time: "2024-04-12T14:17:00Z",
            icon: <FilePenLine />
        },
        {
            action: "A approuvé une demande de maintenance pour Appartement Haussmann",
            time: "2024-04-08T09:05:00Z",
            icon: <FileCheck2 />
        }
        ]
    }

    return (
        <DefaultLayout>
            <Breadcrumb previousPage={true} pageName="Account detail" />
            <div className="w-full min-h-screen">
                <div className="max-w-7xl mx-auto px-4 py-6">
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
                                    onClick={() => handleOpenPropertiy(property.id)}
                                    className="border rounded-lg overflow-hidden hover:border-blue-500 cursor-pointer transition-colors"
                                    >
                                    <div className="aspect-video relative">
                                        <Image
                                            src={property.image}
                                            alt={property.name}
                                            className="w-full h-full object-cover"
                                            height={800}
                                            width={800}
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
        </DefaultLayout>
    )
}

export default UserDetailView;
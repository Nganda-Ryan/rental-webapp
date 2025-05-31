"use client"
import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb'
import { TenantCard } from '@/components/Cards/TenantCard';
import { TenantFilters } from '@/components/Filters/TenantFilters';
import DefaultLayout from '@/components/Layouts/DefaultLayout'
import { FileText, History, Mail, MessageSquare, MoreHorizontal, MoreVertical, Phone, Plus, Search, SlidersHorizontal } from 'lucide-react';
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

const Page = () => {
    const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
    const [isFiltersOpen, setIsFiltersOpen] = useState(false);
    const router = useRouter();
    const tenants = [
        {
        name: "NGANDA Ryan",
        email: "ryan.nganda@email.com",
        phone: "(555) 123-4567",
        unit: "Apt 4B",
        moveIn: "01/15/2023",
        status: "Active",
        rent: "$2,500",
        },
        {
        name: "WANKO Marc",
        email: "mark.wanko@email.com",
        phone: "(555) 234-5678",
        unit: "Apt 2A",
        moveIn: "03/01/2023",
        status: "Active",
        rent: "$1,800",
        },
        {
        name: "MAKO Ely",
        email: "mako.eli@email.com",
        phone: "(555) 345-6789",
        unit: "Apt 7C",
        moveIn: "11/01/2022",
        status: "Late Payment",
        rent: "$2,200",
        },
    ];
    const toggleDropdown = (index: number) => {
        setActiveDropdown(activeDropdown === index ? null : index);
    };
    const handleAction = (action: string) => {
        console.log("Action:", action);
        setActiveDropdown(null);
    };
    const handleGoToDetail = (e: any) => {
        console.log('ID', e)
        router.push('tenants/detail')
    }

    
    return (
        <DefaultLayout>
            <Breadcrumb pageName="Tenant" />
            
            <div className="w-full">
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                <Search
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={20}
                />
                <input
                    type="text"
                    placeholder="Search tenants..."
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                </div>
                <div className="relative">
                    <div className='flex flex-nowrap gap-4'>
                        <button
                            onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                            className={`w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 rounded-lg border ${isFiltersOpen ? "bg-blue-50 border-blue-500 text-blue-600" : "bg-white border-gray-200 hover:bg-gray-50"}`}
                        >
                            <SlidersHorizontal size={20} />
                            <span>Filters</span>
                        </button>
                        <TenantFilters
                            isOpen={isFiltersOpen}
                            onClose={() => setIsFiltersOpen(false)}
                        />
                        <button className="w-full sm:w-auto bg-[#2A4365] text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2">
                            <Plus size={20} />
                            Add Tenant
                        </button>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:hidden">
                {tenants.map((tenant, index) => (
                <TenantCard
                    key={index}
                    tenant={tenant}
                    onAction={handleAction}
                    isDropdownOpen={activeDropdown === index}
                    onToggleDropdown={() => toggleDropdown(index)}
                />
                ))}
            </div>
            <div className="hidden sm:block bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50">
                    <tr>
                        <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tenant
                        </th>
                        <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden xl:table-cell">
                        Contact
                        </th>
                        <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Unit
                        </th>
                        <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                        Move-in
                        </th>
                        <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                        </th>
                        <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                        Rent
                        </th>
                        <th className="px-3 md:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                        </th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                    {tenants.map((tenant, index) => (
                        <tr key={index}>
                            <td className="px-3 md:px-6 py-4" onClick={() =>(handleGoToDetail(tenant))}>
                                <div className="font-medium text-gray-900 truncate max-w-[150px]">
                                {tenant.name}
                                </div>
                                <div className="text-sm text-gray-500 xl:hidden truncate">
                                {tenant.email}
                                </div>
                                <div className="text-sm text-gray-500 lg:hidden">
                                {tenant.moveIn} • {tenant.rent}
                                </div>
                            </td>
                            <td className="px-3 md:px-6 py-4 hidden xl:table-cell">
                                <div className="flex flex-col text-sm text-gray-500">
                                <div className="flex items-center gap-1 truncate">
                                    <Mail size={14} />
                                    <span className="truncate max-w-[200px]">
                                    {tenant.email}
                                    </span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Phone size={14} />
                                    {tenant.phone}
                                </div>
                                </div>
                            </td>
                            <td className="px-3 md:px-6 py-4 text-sm text-gray-500">
                                {tenant.unit}
                            </td>
                            <td className="px-3 md:px-6 py-4 text-sm text-gray-500 hidden lg:table-cell">
                                {tenant.moveIn}
                            </td>
                            <td className="px-3 md:px-6 py-4">
                                <span
                                className={`inline-flex px-2 py-1 text-xs rounded-full ${tenant.status === "Active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                                >
                                {tenant.status}
                                </span>
                            </td>
                            <td className="px-3 md:px-6 py-4 text-sm text-gray-500 hidden lg:table-cell">
                                {tenant.rent}
                            </td>
                            <td className="px-3 md:px-6 py-4 text-right">
                                <div className="relative">
                                <button
                                    onClick={() => toggleDropdown(index)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <MoreVertical size={20} />
                                </button>
                                {activeDropdown === index && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                                    <button
                                        onClick={() => handleAction("rental")}
                                        className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                    >
                                        <FileText size={16} />
                                        Create Rental
                                    </button>
                                    <button
                                        onClick={() => handleAction("message")}
                                        className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                    >
                                        <MessageSquare size={16} />
                                        Send Message
                                    </button>
                                    <button
                                        onClick={() => handleAction("history")}
                                        className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                    >
                                        <History size={16} />
                                        Payment History
                                    </button>
                                    </div>
                                )}
                                </div>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                </div>
            </div>
            </div>
        </DefaultLayout>
    )
}

export default Page
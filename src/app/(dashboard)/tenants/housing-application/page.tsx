"use client"
import React, { useState } from 'react'
import { Search, Plus, Clock, CheckCircle, XCircle } from 'lucide-react';
import DefaultLayout from '@/components/Layouts/DefaultLayout';
import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb';
import { useRouter } from '@bprogress/next/app';
const Applications = () => {
  const [selectedApplication, setSelectedApplication] = useState<string | null>(
    null,
  )
  const router = useRouter();
  const applications = [
    {
      id: 'APP001',
      property: {
        name: '123 Marina Avenue',
        image: 'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6',
        address: 'San Francisco, CA 94107',
        rent: '$2,500',
        beds: 2,
        baths: 2,
      },
      submitted: '2023-07-01',
      status: 'Pending',
      rent: '$2,500',
      moveInDate: '2023-08-01',
      documents: [
        {
          name: 'Proof of Income',
          status: 'Verified',
        },
        {
          name: 'Credit Report',
          status: 'Pending',
        },
        {
          name: 'References',
          status: 'Verified',
        },
      ],
      timeline: [
        {
          date: '2023-07-01',
          event: 'Application Submitted',
        },
        {
          date: '2023-07-02',
          event: 'Documents Received',
        },
        {
          date: '2023-07-03',
          event: 'Background Check Initiated',
        },
      ],
    },
    {
      id: 'APP002',
      property: {
        name: '456 Park Road',
        image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994',
        address: 'San Francisco, CA 94108',
        rent: '$3,200',
        beds: 3,
        baths: 2,
      },
      submitted: '2023-06-15',
      status: 'Approved',
      rent: '$3,200',
      moveInDate: '2023-07-15',
      documents: [
        {
          name: 'Proof of Income',
          status: 'Verified',
        },
        {
          name: 'Credit Report',
          status: 'Verified',
        },
        {
          name: 'References',
          status: 'Verified',
        },
      ],
      timeline: [
        {
          date: '2023-06-15',
          event: 'Application Submitted',
        },
        {
          date: '2023-06-16',
          event: 'Documents Verified',
        },
        {
          date: '2023-06-18',
          event: 'Application Approved',
        },
      ],
    },
    {
      id: 'APP003',
      property: {
        name: '789 Lake View',
        image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914',
        address: 'San Francisco, CA 94109',
        rent: '$1,800',
        beds: 1,
        baths: 1,
      },
      submitted: '2023-06-10',
      status: 'Rejected',
      rent: '$1,800',
      moveInDate: '2023-07-01',
      documents: [
        {
          name: 'Proof of Income',
          status: 'Invalid',
        },
        {
          name: 'Credit Report',
          status: 'Verified',
        },
        {
          name: 'References',
          status: 'Verified',
        },
      ],
      timeline: [
        {
          date: '2023-06-10',
          event: 'Application Submitted',
        },
        {
          date: '2023-06-11',
          event: 'Documents Received',
        },
        {
          date: '2023-06-12',
          event: 'Application Rejected - Insufficient Income',
        },
      ],
    },
  ]
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Pending':
        return <Clock size={16} className="text-orange-500" />
      case 'Approved':
        return <CheckCircle size={16} className="text-green-500" />
      case 'Rejected':
        return <XCircle size={16} className="text-red-500" />
      default:
        return null
    }
  }
  const getStatusClass =
   (status: string) => {
    switch (status) {
      case 'Pending':
        return 'bg-orange-100 text-orange-800'
      case 'Approved':
        return 'bg-green-100 text-green-800'
      case 'Rejected':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const handleGotoDetail = (applicationId: string) => {
    router.push(`/tenants/housing-application/${applicationId}`)
    // console.log('id', applicationId);
  }
  return (
    <DefaultLayout>
        <Breadcrumb pageName='Housing Applications' previousPage={false} />
        <div className="w-full">
            <div className="mb-6">
                <div className="relative w-full md:w-96">
                <Search
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={20}
                />
                <input
                    type="text"
                    placeholder="Search applications..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                </div>
            </div>
            {/* Mobile View */}
            <div className="lg:hidden space-y-4">
                {applications.map((application) => (
                    <div
                        key={application.id}
                        onClick={() => setSelectedApplication(application.id)}
                        className="bg-white rounded-lg shadow-sm p-4 cursor-pointer hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div onClick={() => {handleGotoDetail(application.id)}}>
                                <h3 className="font-medium text-lg">
                                    {application.property.name}
                                </h3>
                                <p className="text-sm text-gray-500">{application.submitted}</p>
                            </div>
                            <span
                                className={`px-2 py-1 rounded-full text-xs flex items-center gap-1 ${getStatusClass(application.status)}`}
                            >
                                {getStatusBadge(application.status)}
                                {application.status}
                            </span>
                        </div>
                        <div className="space-y-2 text-sm text-gray-600">
                            <p>Monthly Rent: {application.rent}</p>
                            <p>Move-in Date: {application.moveInDate}</p>
                        </div>
                    </div>
                ))}
            </div>
            {/* Desktop View */}
            <div className="hidden lg:block bg-white rounded-lg shadow-sm overflow-hidden">
                <table className="w-full">
                <thead className="bg-gray-50">
                    <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Property
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Submitted
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Monthly Rent
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Move-in Date
                    </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {applications.map((application) => (
                    <tr
                        key={application.id}
                        onClick={() => {handleGotoDetail(application.id)}}
                        className="hover:bg-gray-50 cursor-pointer"
                    >
                        <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">
                            {application.property.name}
                        </div>
                        <div className="text-sm text-gray-500">
                            ID: {application.id}
                        </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                        {application.submitted}
                        </td>
                        <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                            {getStatusBadge(application.status)}
                            <span
                            className={`px-2 py-1 text-xs rounded-full ${getStatusClass(application.status)}`}
                            >
                            {application.status}
                            </span>
                        </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                        {application.rent}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                        {application.moveInDate}
                        </td>
                    </tr>
                    ))}
                </tbody>
                </table>
            </div>
        </div>
    </DefaultLayout>
  )
}

export default Applications;
import React from 'react'
import {
  ArrowLeft,
  MapPin,
  BedDouble,
  Bath,
  Clock,
  FileText,
  CheckCircle,
  XCircle,
} from 'lucide-react'
import Image from 'next/image'
import DefaultLayout from '@/components/Layouts/DefaultLayout'
import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb'
interface ApplicationDetailProps {
  application: any
  onBack: () => void
}
const ApplicationDetail = () => {
    const application = {
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
    };
  const getDocumentStatusIcon = (status: string) => {
    switch (status) {
      case 'Verified':
        return <CheckCircle size={16} className="text-green-500" />
      case 'Invalid':
        return <XCircle size={16} className="text-red-500" />
      case 'Pending':
        return <Clock size={16} className="text-orange-500" />
      default:
        return null
    }
  }
  return (
    <DefaultLayout>
        <Breadcrumb pageName='Application detail' previousPage/>
        <div className="w-full">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                {/* Property Details */}
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div className="h-[300px]">
                    <Image
                        height={800}
                        width={800}
                        src={application.property.image}
                        alt={application.property.name}
                        className="w-full h-full object-cover"
                    />
                    </div>
                    <div className="p-6">
                    <h2 className="text-xl font-semibold mb-2">
                        {application.property.name}
                    </h2>
                    <div className="flex items-center text-gray-600 mb-4">
                        <MapPin size={16} className="mr-1" />
                        <span>{application.property.address}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        <div className="flex items-center gap-2">
                        <BedDouble size={20} className="text-gray-400" />
                        <div>
                            <p className="text-sm text-gray-500">Beds</p>
                            <p className="font-medium">{application.property.beds}</p>
                        </div>
                        </div>
                        <div className="flex items-center gap-2">
                        <Bath size={20} className="text-gray-400" />
                        <div>
                            <p className="text-sm text-gray-500">Baths</p>
                            <p className="font-medium">{application.property.baths}</p>
                        </div>
                        </div>
                        <div className="flex items-center gap-2">
                        <FileText size={20} className="text-gray-400" />
                        <div>
                            <p className="text-sm text-gray-500">Rent</p>
                            <p className="font-medium">{application.property.rent}</p>
                        </div>
                        </div>
                    </div>
                    </div>
                </div>
                {/* Documents */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-lg font-semibold mb-4">Required Documents</h3>
                    <div className="space-y-4">
                    {application.documents.map((doc: any, index: number) => (
                        <div
                        key={index}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                        >
                        <div className="flex items-center gap-3">
                            <FileText size={20} className="text-gray-400" />
                            <span className="font-medium">{doc.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            {getDocumentStatusIcon(doc.status)}
                            <span
                            className={`text-sm ${doc.status === 'Verified' ? 'text-green-600' : doc.status === 'Invalid' ? 'text-red-600' : 'text-orange-600'}`}
                            >
                            {doc.status}
                            </span>
                        </div>
                        </div>
                    ))}
                    </div>
                </div>
                </div>
                {/* Sidebar */}
                <div className="space-y-6">
                {/* Application Status */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="font-medium mb-4">Application Status</h3>
                    <div className="space-y-4">
                    <div>
                        <p className="text-sm text-gray-500">Status</p>
                        <p
                        className={`inline-block mt-1 px-3 py-1 rounded-full text-sm ${application.status === 'Approved' ? 'bg-green-100 text-green-800' : application.status === 'Rejected' ? 'bg-red-100 text-red-800' : 'bg-orange-100 text-orange-800'}`}
                        >
                        {application.status}
                        </p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Submitted Date</p>
                        <p className="font-medium">{application.submitted}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Move-in Date</p>
                        <p className="font-medium">{application.moveInDate}</p>
                    </div>
                    </div>
                </div>
                {/* Timeline */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="font-medium mb-4">Application Timeline</h3>
                    <div className="space-y-4">
                    {application.timeline.map((event: any, index: number) => (
                        <div key={index} className="flex gap-3">
                        <div className="flex flex-col items-center">
                            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                            {index !== application.timeline.length - 1 && (
                            <div className="w-0.5 h-full bg-gray-200"></div>
                            )}
                        </div>
                        <div className="pb-4">
                            <p className="text-sm font-medium">{event.event}</p>
                            <p className="text-xs text-gray-500">{event.date}</p>
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


export default ApplicationDetail;
export const runtime = 'edge';
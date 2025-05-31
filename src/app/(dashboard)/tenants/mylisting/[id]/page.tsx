import React from 'react'
import {
  Download,
} from 'lucide-react'
import Image from 'next/image'
import DefaultLayout from '@/components/Layouts/DefaultLayout'
import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb'

const ListingDetail = () => {
    const listing = {
        id: 'CTR001',
        property: {
          name: '123 Marina Avenue, Apt 4B',
          image: 'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6',
          address: 'San Francisco, CA 94107',
        },
        landlord: 'ABC Properties',
        startDate: '2023-01-15',
        endDate: '2024-01-14',
        monthlyRent: '$2,500',
        status: 'Current',
        billingElements: ['Lease', 'Utilities', 'Parking'],
        invoices: [
          {
            id: 'INV001',
            date: '2023-07-01',
            period: 'July 2023',
            amount: '$2,500',
            status: 'Paid',
            breakdown: [
              {
                item: 'Lease',
                amount: '$2,000',
              },
              {
                item: 'Utilities',
                amount: '$300',
              },
              {
                item: 'Parking',
                amount: '$200',
              },
            ],
          },
          {
            id: 'INV002',
            date: '2023-06-01',
            period: 'June 2023',
            amount: '$2,500',
            status: 'Paid',
            breakdown: [
              {
                item: 'Lease',
                amount: '$2,000',
              },
              {
                item: 'Utilities',
                amount: '$300',
              },
              {
                item: 'Parking',
                amount: '$200',
              },
            ],
          },
        ],
    }
    return (
        <DefaultLayout>
            <Breadcrumb pageName='Listing Details' previousPage />
            <div className="w-full">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                    {/* Property Details */}
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                        <div className="h-[300px]">
                        <Image
                            height={800}
                            width={800}
                            src={listing.property.image}
                            alt={listing.property.name}
                            className="w-full h-full object-cover"
                        />
                        </div>
                        <div className="p-6">
                        <h2 className="text-xl font-semibold mb-2">
                            {listing.property.name}
                        </h2>
                        <p className="text-gray-600">{listing.property.address}</p>
                        </div>
                    </div>
                    {/* Invoice History */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h3 className="text-lg font-semibold mb-4">Invoice History</h3>
                        <div className="space-y-4">
                        {listing.invoices.map((invoice: any) => (
                            <div
                            key={invoice.id}
                            className="border border-gray-200 rounded-lg p-4"
                            >
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <p className="font-medium">Invoice #{invoice.id}</p>
                                    <p className="text-sm text-gray-600">{invoice.period}</p>
                                </div>
                                <span className={`px-2 py-1 text-xs rounded-full ${invoice.status === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                    {invoice.status}
                                </span>
                            </div>
                            <div className="space-y-2">
                                {invoice.breakdown.map((item: any, index: number) => (
                                <div
                                    key={index}
                                    className="flex justify-between text-sm text-gray-600"
                                >
                                    <span>{item.item}</span>
                                    <span>{item.amount}</span>
                                </div>
                                ))}
                                <div className="flex justify-between font-medium pt-2 border-t border-gray-200">
                                <span>Total</span>
                                <span>{invoice.amount}</span>
                                </div>
                            </div>
                            <div className="mt-4 flex justify-end">
                                <button className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                                <Download size={16} />
                                Download PDF
                                </button>
                            </div>
                            </div>
                        ))}
                        </div>
                    </div>
                    </div>
                    {/* Sidebar */}
                    <div className="space-y-6">
                    {/* Lease Information */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h3 className="font-medium mb-4">Lease Information</h3>
                        <div className="space-y-4">
                        <div>
                            <p className="text-sm text-gray-500">Status</p>
                            <p
                            className={`inline-block mt-1 px-3 py-1 rounded-full text-sm ${listing.status === 'Current' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}
                            >
                            {listing.status}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Start Date</p>
                            <p className="font-medium">{listing.startDate}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">End Date</p>
                            <p className="font-medium">{listing.endDate}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Monthly Rent</p>
                            <p className="font-medium">{listing.monthlyRent}</p>
                        </div>
                        </div>
                    </div>
                    {/* Billing Elements */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h3 className="font-medium mb-4">Billing Elements</h3>
                        <div className="space-y-2">
                        {listing.billingElements.map((element: string) => (
                            <div
                            key={element}
                            className="px-3 py-2 bg-gray-50 rounded-lg text-sm"
                            >
                            {element}
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

export default ListingDetail;
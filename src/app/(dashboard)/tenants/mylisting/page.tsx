"use client"
import React, { useState } from 'react'
import { DollarSign, Calendar, ChevronDown } from 'lucide-react'
import DefaultLayout from '@/components/Layouts/DefaultLayout'
import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb'
import { useRouter } from 'next/navigation'
const Listings = () => {
  const [expandedContract, setExpandedContract] = useState<string | null>(null);
  const router = useRouter()
  const contracts = [
    {
      id: 'CTR001',
      property: '123 Marina Avenue, Apt 4B',
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
    },
  ]
  const handleNavigateToDetail = (contractId: string) => {
    router.push(`/tenants/mylisting/${contractId}`)
  }
  return (
    <DefaultLayout>
        <Breadcrumb pageName='My listing' previousPage={false}/>
        <div className="flex-1 bg-[#EDF2F7] min-h-screen">
          <div className="space-y-6">
              {contracts.map((contract) => (
              <div key={contract.id} className="bg-white rounded-lg shadow-sm">
                  {/* Contract Header */}
                  <div className="p-6 border-b border-gray-200">
                  <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-semibold text-lg" onClick={() => {handleNavigateToDetail(contract.id)}}>{contract.property}</h3>
                        <p className="text-sm text-gray-600">
                            Managed by {contract.landlord}
                        </p>
                      </div>
                      <span
                      className={`px-2 py-1 text-xs rounded-full ${contract.status === 'Current' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}
                      >
                      {contract.status}
                      </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                      <Calendar size={16} />
                      <span>
                          {contract.startDate} to {contract.endDate}
                      </span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                      <DollarSign size={16} />
                      <span>Monthly Rent: {contract.monthlyRent}</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                      {contract.billingElements.map((element) => (
                          <span
                          key={element}
                          className="px-2 py-1 text-xs bg-gray-100 rounded-full"
                          >
                          {element}
                          </span>
                      ))}
                      </div>
                  </div>
                  <button
                      onClick={() =>
                      setExpandedContract(
                          expandedContract === contract.id ? null : contract.id,
                      )
                      }
                      className="mt-4 flex items-center gap-2 text-blue-600 text-sm hover:text-blue-800"
                  >
                      {expandedContract === contract.id
                      ? 'Hide Invoice History'
                      : 'Show Invoice History'}
                      <ChevronDown
                      size={16}
                      className={`transform transition-transform ${expandedContract === contract.id ? 'rotate-180' : ''}`}
                      />
                  </button>
                  </div>
                  {/* Invoice History */}
                  {expandedContract === contract.id && (
                  <div className="p-6">
                      <h4 className="font-medium mb-4">Invoice History</h4>
                      <div className="space-y-4">
                      {contract.invoices.map((invoice) => (
                          <div
                          key={invoice.id}
                          className="border border-gray-200 rounded-lg p-4"
                          >
                          <div className="flex justify-between items-start mb-3">
                              <div>
                              <p className="font-medium">Invoice #{invoice.id}</p>
                              <p className="text-sm text-gray-600">
                                  {invoice.period}
                              </p>
                              </div>
                              <span
                              className={`px-2 py-1 text-xs rounded-full ${invoice.status === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}
                              >
                              {invoice.status}
                              </span>
                          </div>
                          <div className="space-y-2">
                              {invoice.breakdown.map((item, index) => (
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
                          {invoice.status !== 'Paid' && (
                              <button className="mt-3 w-full px-4 py-2 bg-[#2A4365] text-white rounded-lg text-sm hover:bg-blue-800">
                              Make Payment
                              </button>
                          )}
                          </div>
                      ))}
                      </div>
                  </div>
                  )}
              </div>
              ))}
          </div>
        </div>
    </DefaultLayout>
  )
}

export default Listings;
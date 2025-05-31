"use client"

import React, { useState } from 'react'
import { Calendar, DollarSign, X } from 'lucide-react'

interface InvoiceGeneratorProps {
  onClose: () => void
  onGenerate: (data: any) => void
  contract: {
    id: string
    tenant: string
    unit: string
    startDate: string
    endDate: string
    monthlyRent: string
    status: string
    nextInvoiceDate: string
    billingElements: Array<{
      name: string
      amount: number
      frequency: string
    }>
  }
}

export const InvoiceGenerator = ({
  onClose,
  onGenerate,
  contract,
}: InvoiceGeneratorProps) => {
  const [invoiceDate, setInvoiceDate] = useState(
    new Date().toISOString().split('T')[0],
  )
  const [periodStart, setPeriodStart] = useState('')
  const [periodEnd, setPeriodEnd] = useState('')
  const [selectedElements, setSelectedElements] = useState(
    contract.billingElements.map((element) => ({
      ...element,
      included: true,
      currentAmount: element.amount,
    })),
  )
  
  const totalAmount = selectedElements
    .filter((element) => element.included)
    .reduce((sum, element) => sum + Number(element.currentAmount), 0)
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const invoiceData = {
      contractId: contract.id,
      invoiceDate,
      periodStart,
      periodEnd,
      billingElements: selectedElements.filter((element) => element.included),
      totalAmount,
    }
    onGenerate(invoiceData)
  }
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-2xl max-h-[75vh] overflow-y-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-2xl">
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 sm:px-6 py-4 z-10">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg sm:text-xl font-semibold dark:text-white">
                Generate Invoice
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Create a new invoice for {contract.tenant}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              aria-label="Close"
            >
              <X size={20} className="text-gray-500 dark:text-gray-400" />
            </button>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-3 sm:p-4 rounded-lg space-y-4">
            <h3 className="font-medium text-blue-800 dark:text-blue-300 border-b border-blue-100 dark:border-blue-800 pb-2">
              Required Information
            </h3>
            <div className="grid gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Tenant
                </label>
                <input
                  type="text"
                  value={contract.tenant}
                  readOnly
                  className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Invoice Provider
                </label>
                <input
                  type="text"
                  value="Rentila Property Management"
                  readOnly
                  className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Invoice Date
                </label>
                <div className="relative">
                  <Calendar
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <input
                    type="date"
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                    value={invoiceDate}
                    onChange={(e) => setInvoiceDate(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Period Start
                  </label>
                  <div className="relative">
                    <Calendar
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={20}
                    />
                    <input
                      type="date"
                      className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                      value={periodStart}
                      onChange={(e) => setPeriodStart(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Period End
                  </label>
                  <div className="relative">
                    <Calendar
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={20}
                    />
                    <input
                      type="date"
                      className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                      value={periodEnd}
                      onChange={(e) => setPeriodEnd(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-medium text-lg border-b border-gray-200 dark:border-gray-700 pb-2 dark:text-white">
              Billing Elements
            </h3>
            <div className="space-y-3">
              {selectedElements.map((element, index) => (
                <div
                  key={index}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 border border-gray-200 dark:border-gray-700 rounded-lg gap-3 sm:gap-4"
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={element.included}
                      onChange={() =>
                        setSelectedElements(
                          selectedElements.map((e, i) =>
                            i === index
                              ? {
                                  ...e,
                                  included: !e.included,
                                }
                              : e,
                          ),
                        )
                      }
                      className="rounded border-gray-300 dark:border-gray-600"
                    />
                    <div>
                      <p className="font-medium dark:text-white">{element.name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {element.frequency} payment
                      </p>
                    </div>
                  </div>
                  <div className="relative w-full sm:w-auto mt-2 sm:mt-0">
                    <DollarSign
                      size={16}
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    />
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      className="w-full sm:w-32 pl-8 pr-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                      value={element.currentAmount}
                      onChange={(e) =>
                        setSelectedElements(
                          selectedElements.map((el, i) =>
                            i === index
                              ? {
                                  ...el,
                                  currentAmount: parseFloat(e.target.value),
                                }
                              : el,
                          ),
                        )
                      }
                      disabled={!element.included}
                      required={element.included}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <div className="flex justify-between items-center">
              <span className="font-medium dark:text-white">Total Amount</span>
              <span className="text-xl font-bold dark:text-white">
                ${totalAmount.toFixed(2)}
              </span>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg w-full sm:w-auto"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-900 dark:bg-blue-800 text-white rounded-lg hover:bg-blue-800 dark:hover:bg-blue-700 w-full sm:w-auto"
            >
              Generate Invoice
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default InvoiceGenerator
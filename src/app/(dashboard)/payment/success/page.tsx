'use client'

import React, { useEffect } from 'react'
import { CheckCircle, ArrowRight, Download, Home } from 'lucide-react'
import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb'
import DefaultLayout from '@/components/Layouts/DefaultLayout'
import { confirmPayment } from '@/actions/userAction'
import { useRouter } from '@bprogress/next/app'
interface PlanDetails {
  name: string
  price: string
  billingCycle: string
  purchaseDate: string
  transactionId: string
  features: string[]
}
const SuccessPayment = () => {
    const router = useRouter();
    useEffect(() => {
        init()
    }, [])

    const init = async  () => {
        const executeUrl = localStorage.getItem('paypal_execute_url');
        if (executeUrl) {
            console.log('-->executeUrl', executeUrl)
            const result = await confirmPayment(executeUrl);
            console.log('-->result', result)
        } else {
            console.log('-->executeUrl not found')
        }
    }
    const planDetails: PlanDetails = {
        name: 'Premium Lessor Plan',
        price: '$29.99',
        billingCycle: 'Monthly',
        purchaseDate: new Date().toLocaleDateString(),
        transactionId: 'TRX-' + Math.floor(Math.random() * 1000000),
        features: [
        'Unlimited property listings',
        'Advanced analytics dashboard',
        'Priority customer support',
        'Automated tenant screening',
        'Document e-signing',
        ],
    }
    return (
        <DefaultLayout>
            <Breadcrumb previousPage pageName={`Application detail`} />
            <div className="w-full mx-auto">
            <div className="bg-white rounded-lg shadow-sm p-8">
                {/* Success Header */}
                <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                    <CheckCircle size={32} className="text-green-600" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900">
                    Payment Successful!
                </h1>
                <p className="text-gray-600 mt-2">
                    Thank you for your purchase. Your plan is now active.
                </p>
                </div>
                {/* Order Summary */}
                <div className="bg-gray-50 rounded-lg p-6 mb-8">
                <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                    <span className="text-gray-600">Plan:</span>
                    <span className="font-medium">{planDetails.name}</span>
                    </div>
                    <div className="flex justify-between items-center">
                    <span className="text-gray-600">Amount:</span>
                    <span className="font-medium">{planDetails.price}</span>
                    </div>
                    <div className="flex justify-between items-center">
                    <span className="text-gray-600">Billing Cycle:</span>
                    <span className="font-medium">{planDetails.billingCycle}</span>
                    </div>
                    <div className="flex justify-between items-center">
                    <span className="text-gray-600">Purchase Date:</span>
                    <span className="font-medium">{planDetails.purchaseDate}</span>
                    </div>
                    <div className="flex justify-between items-center border-t pt-3 mt-3">
                    <span className="text-gray-600">Transaction ID:</span>
                    <span className="font-medium text-gray-800">
                        {planDetails.transactionId}
                    </span>
                    </div>
                </div>
                </div>
                {/* Plan Features */}
                <div className="mb-8">
                <h2 className="text-lg font-semibold mb-4">
                    What&apos;s Included in Your Plan
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {planDetails.features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-2">
                        <CheckCircle
                        size={16}
                        className="text-green-600 mt-1 flex-shrink-0"
                        />
                        <span className="text-gray-700">{feature}</span>
                    </div>
                    ))}
                </div>
                </div>
                {/* Next Steps */}
                <div className="bg-blue-50 rounded-lg p-6 mb-8">
                <h2 className="text-lg font-semibold mb-3 text-blue-800">
                    Next Steps
                </h2>
                <p className="text-blue-700 mb-4">
                    Your account has been upgraded. You can now access all premium
                    features.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                    <button className="flex items-center justify-center gap-2 px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50">
                    <Download size={16} />
                    Download Receipt
                    </button>
                </div>
                </div>
                {/* Navigation Options */}
                <div className="flex flex-col sm:flex-row items-center justify-between pt-4 border-t border-gray-200">
                <p className="text-gray-600 mb-4 sm:mb-0">
                    Need help? Contact our{' '}
                    <span className="text-blue-600">support team</span>
                </p>
                <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                    onClick={() => router.push('/signin')}
                >
                    <Home size={16} />
                    Return to Dashboard
                </button>
                </div>
            </div>
            </div>
        </DefaultLayout>
    )
}

export default SuccessPayment
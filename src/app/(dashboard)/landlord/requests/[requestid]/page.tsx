"use client"
import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb'
import DefaultLayout from '@/components/Layouts/DefaultLayout'
import React, { useEffect } from 'react'
import { useParams } from 'next/navigation';
import { geRequestDetail } from '@/actions/requestAction';
import { getScore } from '@/actions/userAction';
import {
  ArrowLeft,
  MapPin,
  Home,
  Mail,
  Phone,
  Briefcase,
  DollarSign,
  TrendingUp,
  CheckCircle,
  XCircle,
  Clock,
} from 'lucide-react'
interface ApplicationRequestDetailProps {
  applicationId: string
  onBack: () => void
}

const mockApplicationData = {
  '1': {
    tenant: {
      name: 'Sarah Johnson',
      email: 'sarah.johnson@email.com',
      phone: '(555) 123-4567',
      employer: 'Tech Solutions Inc.',
      monthlyIncome: '$6,500',
    },
    property: {
      name: 'Sunset Apartments Unit 204',
      address: '123 Sunset Blvd, Los Angeles, CA 90028',
      rent: '$2,200/month',
      type: 'Apartment',
    },
    rentalScore: {
      score: 785,
      rating: 'Excellent',
      onTimePayments: 96,
    },
    paymentHistory: [
      {
        month: 'Dec 2024',
        amount: '$2,200',
        status: 'paid',
        date: 'Dec 1, 2024',
      },
      {
        month: 'Nov 2024',
        amount: '$2,200',
        status: 'paid',
        date: 'Nov 1, 2024',
      },
      {
        month: 'Oct 2024',
        amount: '$2,200',
        status: 'paid',
        date: 'Oct 1, 2024',
      },
      {
        month: 'Sep 2024',
        amount: '$2,200',
        status: 'paid',
        date: 'Sep 1, 2024',
      },
      {
        month: 'Aug 2024',
        amount: '$2,200',
        status: 'late',
        date: 'Aug 5, 2024',
      },
      {
        month: 'Jul 2024',
        amount: '$2,200',
        status: 'paid',
        date: 'Jul 1, 2024',
      },
    ],
  },
  '2': {
    tenant: {
      name: 'Michael Chen',
      email: 'michael.chen@email.com',
      phone: '(555) 234-5678',
      employer: 'Design Studio Co.',
      monthlyIncome: '$7,200',
    },
    property: {
      name: 'Downtown Loft 5B',
      address: '456 Main Street, San Francisco, CA 94102',
      rent: '$2,800/month',
      type: 'Loft',
    },
    rentalScore: {
      score: 820,
      rating: 'Excellent',
      onTimePayments: 100,
    },
    paymentHistory: [
      {
        month: 'Dec 2024',
        amount: '$2,800',
        status: 'paid',
        date: 'Dec 1, 2024',
      },
      {
        month: 'Nov 2024',
        amount: '$2,800',
        status: 'paid',
        date: 'Nov 1, 2024',
      },
      {
        month: 'Oct 2024',
        amount: '$2,800',
        status: 'paid',
        date: 'Oct 1, 2024',
      },
      {
        month: 'Sep 2024',
        amount: '$2,800',
        status: 'paid',
        date: 'Sep 1, 2024',
      },
      {
        month: 'Aug 2024',
        amount: '$2,800',
        status: 'paid',
        date: 'Aug 1, 2024',
      },
      {
        month: 'Jul 2024',
        amount: '$2,800',
        status: 'paid',
        date: 'Jul 1, 2024',
      },
    ],
  },
  '3': {
    tenant: {
      name: 'Emily Rodriguez',
      email: 'emily.rodriguez@email.com',
      phone: '(555) 345-6789',
      employer: 'Marketing Agency LLC',
      monthlyIncome: '$5,800',
    },
    property: {
      name: 'Garden View Townhouse',
      address: '789 Garden Way, Austin, TX 78701',
      rent: '$1,950/month',
      type: 'Townhouse',
    },
    rentalScore: {
      score: 720,
      rating: 'Good',
      onTimePayments: 89,
    },
    paymentHistory: [
      {
        month: 'Dec 2024',
        amount: '$1,950',
        status: 'paid',
        date: 'Dec 1, 2024',
      },
      {
        month: 'Nov 2024',
        amount: '$1,950',
        status: 'late',
        date: 'Nov 8, 2024',
      },
      {
        month: 'Oct 2024',
        amount: '$1,950',
        status: 'paid',
        date: 'Oct 1, 2024',
      },
      {
        month: 'Sep 2024',
        amount: '$1,950',
        status: 'paid',
        date: 'Sep 1, 2024',
      },
      {
        month: 'Aug 2024',
        amount: '$1,950',
        status: 'late',
        date: 'Aug 6, 2024',
      },
      {
        month: 'Jul 2024',
        amount: '$1,950',
        status: 'paid',
        date: 'Jul 1, 2024',
      },
    ],
  },
}

const Page = () => {
    const data = mockApplicationData['1' as keyof typeof mockApplicationData]
    const params = useParams();
    useEffect(() => {
        init();
    }, [])

    const init = async () => {
        const result = await geRequestDetail(params.requestid as string);
        // const result2 = await getScore(result.data.body.reqData.creator.UserCode as string, params.requestid as string);
        // const result3 = await geRequestDetail(params.requestid as string);
        console.log('-->result', result)
        // console.log('-->result2', result2)
    }

    const getRatingColor = (rating: string) => {
        switch (rating) {
        case 'Excellent':
            return 'text-green-700 bg-green-50 border-green-200'
        case 'Good':
            return 'text-blue-700 bg-blue-50 border-blue-200'
        case 'Fair':
            return 'text-yellow-700 bg-yellow-50 border-yellow-200'
        default:
            return 'text-gray-700 bg-gray-50 border-gray-200'
        }
    }
    const getScoreColor = (score: number) => {
        if (score >= 750) return 'text-green-600'
        if (score >= 650) return 'text-blue-600'
        return 'text-yellow-600'
    }
    const PaymentStatusBadge = ({ status }: { status: string }) => {
        if (status === 'paid') {
        return (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
            <CheckCircle size={14} />
            Paid
            </span>
        )
        }
        if (status === 'late') {
        return (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
            <Clock size={14} />
            Late
            </span>
        )
        }
        return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
            <XCircle size={14} />
            Missed
        </span>
        )
    }

    return (
        <DefaultLayout>
            <Breadcrumb previousPage pageName={`Application detail`} />
            
            <div className="w-full max-w-7xl mx-auto">
        
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    {/* Property Information */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <Home size={20} className="text-gray-600" />
                            <h2 className="text-lg font-semibold">Property Information</h2>
                        </div>
                        <div className="space-y-3">
                            <div>
                                <p className="text-sm text-gray-500">Property Name</p>
                                <p className="font-medium text-gray-900">{data.property.name}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Address</p>
                                <div className="flex items-start gap-2">
                                    <MapPin
                                        size={16}
                                        className="text-gray-400 mt-1 flex-shrink-0"
                                    />
                                    <p className="text-gray-900">{data.property.address}</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 pt-2">
                                <div>
                                    <p className="text-sm text-gray-500">Type</p>
                                    <p className="font-medium text-gray-900">
                                        {data.property.type}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Monthly Rent</p>
                                    <p className="font-medium text-gray-900">
                                        {data.property.rent}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
            
                    {/* Tenant Information */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <Briefcase size={20} className="text-gray-600" />
                            <h2 className="text-lg font-semibold">Tenant Information</h2>
                        </div>
                        <div className="space-y-3">
                        <div>
                            <p className="text-sm text-gray-500">Full Name</p>
                            <p className="font-medium text-gray-900">{data.tenant.name}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Email</p>
                            <div className="flex items-center gap-2">
                                <Mail size={16} className="text-gray-400" />
                                <p className="text-gray-900">{data.tenant.email}</p>
                            </div>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Phone</p>
                            <div className="flex items-center gap-2">
                                <Phone size={16} className="text-gray-400" />
                                <p className="text-gray-900">{data.tenant.phone}</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 pt-2">
                            <div>
                                <p className="text-sm text-gray-500">Employer</p>
                                <p className="font-medium text-gray-900">
                                    {data.tenant.employer}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Monthly Income</p>
                                <p className="font-medium text-gray-900">
                                    {data.tenant.monthlyIncome}
                                </p>
                            </div>
                        </div>
                        </div>
                    </div>
                </div>
        
                {/* Rental Score */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                        <div className="flex items-center gap-2 mb-6">
                            <TrendingUp size={20} className="text-gray-600" />
                            <h2 className="text-lg font-semibold">Rental Score</h2>
                        </div>
                
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Score Display */}
                            <div className="text-center p-6 bg-gray-50 rounded-lg">
                                <p className="text-sm text-gray-500 mb-2">Credit Score</p>
                                <p className={`text-5xl font-bold ${getScoreColor(data.rentalScore.score)}`}>
                                    {data.rentalScore.score}
                                </p>
                                <span className={`inline-block mt-3 px-4 py-1.5 rounded-full text-sm font-medium border ${getRatingColor(data.rentalScore.rating)}`}>
                                    {data.rentalScore.rating}
                                </span>
                            </div>
                
                            {/* Payment Performance */}
                            <div className="md:col-span-2 p-6 bg-gray-50 rounded-lg">
                                <p className="text-sm text-gray-500 mb-4">Payment Performance</p>
                                <div className="space-y-4">
                                    <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-sm font-medium text-gray-700">
                                            On-Time Payments
                                        </span>
                                        <span className="text-lg font-bold text-gray-900">
                                            {data.rentalScore.onTimePayments}%
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-3">
                                        <div
                                            className="bg-green-500 h-3 rounded-full transition-all"
                                            style={{
                                                width: `${data.rentalScore.onTimePayments}%`,
                                            }}
                                        ></div>
                                    </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 pt-2">
                                        <div className="flex items-center gap-2">
                                            <CheckCircle size={20} className="text-green-600" />
                                            <div>
                                                <p className="text-xs text-gray-500">Total Payments</p>
                                                <p className="font-semibold text-gray-900">
                                                    {data.paymentHistory.length}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Clock size={20} className="text-yellow-600" />
                                            <div>
                                                <p className="text-xs text-gray-500">Late Payments</p>
                                                <p className="font-semibold text-gray-900">
                                                    {
                                                    data.paymentHistory.filter((p) => p.status === 'late')
                                                        .length
                                                    }
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                        <div className="flex items-center gap-2 mb-6">
                            <TrendingUp size={20} className="text-gray-600" />
                            <h2 className="text-lg font-semibold">Actions</h2>
                        </div>
                        <div className="flex justify-between gap-4">
                            <button className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium whitespace-nowrap">
                                Approve Application
                            </button>
                            <button className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium whitespace-nowrap">
                                Decline Application
                            </button>
                        </div>
                    </div>
                </div>
        
                {/* Payment History */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center gap-2 mb-6">
                    <DollarSign size={20} className="text-gray-600" />
                    <h2 className="text-lg font-semibold">Payment History</h2>
                </div>
        
                <div className="overflow-x-auto">
                    <table className="w-full">
                    <thead className="border-b border-gray-200">
                        <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                            Period
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                            Amount
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                            Payment Date
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                            Status
                        </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {data.paymentHistory.map((payment, index) => (
                        <tr key={index} className="hover:bg-gray-50 transition-colors">
                            <td className="px-4 py-4 text-gray-900 font-medium">
                            {payment.month}
                            </td>
                            <td className="px-4 py-4 text-gray-900">{payment.amount}</td>
                            <td className="px-4 py-4 text-gray-600">{payment.date}</td>
                            <td className="px-4 py-4">
                            <PaymentStatusBadge status={payment.status} />
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
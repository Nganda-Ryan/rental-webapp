import React from "react";
import {
  ArrowLeft,
  Mail,
  Phone,
  Building2,
  Calendar,
  DollarSign,
  FileText,
  WrenchIcon,
  CheckCircle2,
  Clock,
  AlertCircle,
} from "lucide-react";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

const Page = () => {
  // This would normally come from an API or prop
  const tenant = {
    id: "1",
    name: "John Smith",
    email: "john.smith@email.com",
    phone: "(555) 123-4567",
    unit: "Apt 4B",
    moveIn: "01/15/2023",
    status: "Active",
    rent: "$2,500",
    leaseEnd: "01/14/2024",
    securityDeposit: "$2,500",
    documents: ["Lease Agreement", "Pet Addendum", "Parking Permit"],
    paymentHistory: [
      {
        date: "07/01/2023",
        amount: "$2,500",
        status: "Paid",
        type: "Rent",
      },
      {
        date: "06/01/2023",
        amount: "$2,500",
        status: "Paid",
        type: "Rent",
      },
      {
        date: "05/01/2023",
        amount: "$2,500",
        status: "Paid",
        type: "Rent",
      },
    ],
    maintenanceRequests: [
      {
        date: "06/15/2023",
        issue: "AC Repair",
        status: "Completed",
        priority: "High",
      },
      {
        date: "05/20/2023",
        issue: "Leaking Faucet",
        status: "Pending",
        priority: "Medium",
      },
    ],
  };
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Completed":
        return <CheckCircle2 size={16} className="text-green-500" />;
      case "In Progress":
        return <Clock size={16} className="text-blue-500" />;
      case "Pending":
        return <AlertCircle size={16} className="text-orange-500" />;
      default:
        return null;
    }
  };
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Locatif" />
        <div className="w-full">
        {/* Header */}
        {/* <div className="flex items-center gap-4 mb-6">
            <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
            <ArrowLeft size={24} />
            </button>
            <h1 className="text-2xl font-bold">Tenant Details</h1>
        </div> */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
            {/* Tenant Info */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                <div>
                    <h2 className="text-xl font-semibold mb-2">{tenant.name}</h2>
                    <div className="flex flex-col gap-2">
                    <div className="flex items-center text-gray-600">
                        <Mail size={16} className="mr-2" />
                        <span>{tenant.email}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                        <Phone size={16} className="mr-2" />
                        <span>{tenant.phone}</span>
                    </div>
                    </div>
                </div>
                <span
                    className={`px-3 py-1 rounded-full text-sm ${tenant.status === "Active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                >
                    {tenant.status}
                </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4 border-y border-gray-100">
                <div className="flex items-center gap-2">
                    <Building2 size={20} className="text-gray-400" />
                    <div>
                    <p className="text-sm text-gray-500">Unit</p>
                    <p className="font-medium">{tenant.unit}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Calendar size={20} className="text-gray-400" />
                    <div>
                    <p className="text-sm text-gray-500">Move-in Date</p>
                    <p className="font-medium">{tenant.moveIn}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <DollarSign size={20} className="text-gray-400" />
                    <div>
                    <p className="text-sm text-gray-500">Monthly Rent</p>
                    <p className="font-medium">{tenant.rent}</p>
                    </div>
                </div>
                </div>
            </div>
            {/* Documents */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="font-medium mb-4">Documents</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {tenant.documents.map((doc) => (
                    <button
                    key={doc}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg text-sm hover:bg-gray-100"
                    >
                    <FileText size={16} className="text-gray-400" />
                    {doc}
                    </button>
                ))}
                </div>
            </div>
            {/* Payment History */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="font-medium mb-4">Payment History</h3>
                <div className="space-y-4">
                {tenant.paymentHistory.map((payment, index) => (
                    <div
                    key={index}
                    className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
                    >
                    <div>
                        <p className="font-medium">{payment.type}</p>
                        <p className="text-sm text-gray-500">{payment.date}</p>
                    </div>
                    <div className="text-right">
                        <p className="font-medium">{payment.amount}</p>
                        <p className="text-sm text-green-600">{payment.status}</p>
                    </div>
                    </div>
                ))}
                </div>
            </div>
            </div>
            {/* Sidebar */}
            <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="font-medium mb-4">Quick Actions</h3>
                <div className="space-y-3">
                <button className="w-full px-4 py-2 bg-[#2A4365] text-white rounded-lg hover:bg-blue-800">
                    Send Message
                </button>
                <button className="w-full px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">
                    Edit Details
                </button>
                <button className="w-full px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">
                    Create Maintenance Request
                </button>
                </div>
            </div>
            {/* Maintenance Requests */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                <WrenchIcon size={20} className="text-gray-400" />
                <h3 className="font-medium">Maintenance Requests</h3>
                </div>
                <div className="space-y-4">
                {tenant.maintenanceRequests.map((request, index) => (
                    <div
                    key={index}
                    className="flex justify-between items-start py-2 border-b border-gray-100 last:border-0"
                    >
                    <div>
                        <p className="font-medium">{request.issue}</p>
                        <p className="text-sm text-gray-500">{request.date}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        {getStatusBadge(request.status)}
                        <span
                        className={`text-sm ${request.status === "Completed" ? "text-green-600" : "text-orange-600"}`}
                        >
                        {request.status}
                        </span>
                    </div>
                    </div>
                ))}
                </div>
            </div>
            </div>
        </div>
        </div>
    </DefaultLayout>
  );
};

export default Page;

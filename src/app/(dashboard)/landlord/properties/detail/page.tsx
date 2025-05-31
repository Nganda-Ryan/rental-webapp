"use client"
import React, { useState } from "react";
import {
  Building2,
  Users,
  WrenchIcon,
  MapPin,
  Share2,
  UserPlus,
  FileText,
  Trash,
  DollarSign,
} from "lucide-react";
import { ManagerSearch } from "@/components/feature/Properties/ManagerSearch";
import { VerificationForm } from "@/components/feature/Properties/VerificationForm";
import { DeletePropertyModal } from "@/components/feature/Properties/DeletePropertyModal";
import { AttachPropertiesModal } from "@/components/feature/Properties/AttachPropertiesModal";
import { TenantContractForm } from "@/components/feature/Properties/TenantContractForm";
import { SuccessModal } from "@/components/Modal/SucessModal";
import Image from "next/image";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Overlay from "@/components/Overlay";
import InvoiceGenerator from "@/components/feature/Properties/InvoiceGenerator";

const PropertyDetail = () => {
    const [isManagerSearchOpen, setIsManagerSearchOpen] = useState(false);
    const [showShareLink, setShowShareLink] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isAttachPropertiesModalOpen, setIsAttachPropertiesModalOpen] =
        useState(false);
    const [isContractFormOpen, setIsContractFormOpen] = useState(false);
    const [selectedTenant, setSelectedTenant] = useState<any>(null);
    const [successMessage, setSuccessMessage] = useState("");
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [showContractSection, setShowContractSection] = useState(false)
    const [showInvoiceGenerator, setShowInvoiceGenerator] = useState(false)
    const [selectedInvoice, setSelectedInvoice] = useState<string | null>(null)
    
    const closeModal = () => setIsModalOpen(false);

    const property = {
        id: "1",
        image:
        "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
        address: "123 Marina Avenue",
        location: "San Francisco, CA 94107",
        units: 4,
        price: "$2,500",
        beds: 2,
        baths: 2,
        sqft: 1200,
        status: "Pending Verification",
        yearBuilt: "2015",
        lastRenovated: "2021",
        description:
        "Modern apartment complex featuring contemporary design and premium amenities. Located in a prime location with easy access to public transportation and local attractions.",
        type: "complex",
        amenities: [
        "Parking",
        "Swimming Pool",
        "Gym",
        "Pet Friendly",
        "Security System",
        ],
        currentTenants: [
        {
            name: "John Smith",
            unit: "4B",
            since: "Jan 2023",
        },
        {
            name: "Sarah Johnson",
            unit: "2A",
            since: "Mar 2023",
        },
        ],
        recentMaintenance: [
        {
            date: "Jul 1, 2023",
            issue: "HVAC Maintenance",
            status: "Completed",
        },
        {
            date: "Jun 15, 2023",
            issue: "Plumbing Repair",
            status: "Completed",
        },
        ],
    };

    const invoices = [
        {
          id: 'INV001',
          contractId: 'CTR001',
          tenant: 'John Smith',
          date: '2023-07-01',
          period: 'July 2023',
          amount: '$2,500',
          status: 'Paid',
          elements: ['Lease', 'Utilities', 'Parking'],
        },
        {
          id: 'INV002',
          contractId: 'CTR002',
          tenant: 'Sarah Johnson',
          date: '2023-07-01',
          period: 'July 2023',
          amount: '$1,800',
          status: 'Pending',
          elements: ['Lease', 'Utilities'],
        },
    ]
    const contracts = [
        {
          id: 'CTR001',
          tenant: 'John Smith',
          unit: '4B',
          startDate: '2023-01-15',
          endDate: '2024-01-14',
          monthlyRent: '$2,500',
          billingElements: [
            {
                name: 'Lease',
                amount: 1800,
                frequency: 'Monthly',
            }, 
            {
                name: 'Utilities',
                amount: 150,
                frequency: 'Monthly',
            },
            {
                name: 'Parking',
                amount: 100,
                frequency: 'Monthly',
            }
        ],
          status: 'Active',
          nextInvoiceDate: '2023-08-01',
        },
        {
            id: 'CTR002',
            tenant: 'Sarah Johnson',
            unit: '2A',
            startDate: '2023-03-01',
            endDate: '2024-02-29',
            monthlyRent: '$1,800',
            billingElements: [
                {
                    name: 'Lease',
                    amount: 1800,
                    frequency: 'Monthly',
                }, 
                {
                    name: 'Utilities',
                    amount: 150,
                    frequency: 'Monthly',
                },
                {
                    name: 'Parking',
                    amount: 100,
                    frequency: 'Monthly',
                }
            ],
            status: 'Active',
            nextInvoiceDate: '2023-08-01',
        },
    ]

 
    const tenantRequests = [
        {
        id: "REQ001",
        name: "Alice Brown",
        email: "alice.b@email.com",
        phone: "(555) 123-4567",
        status: "Pending",
        submitted: "2 days ago",
        },
        {
        id: "REQ002",
        name: "James Wilson",
        email: "james.w@email.com",
        phone: "(555) 234-5678",
        status: "Reviewing",
        submitted: "5 days ago",
        },
    ];
    const handleShareLink = () => {
        const shareLink = `https://rentila.com/properties/${property.id}/apply`;
        setShowShareLink(true);
    };
    const handleVerificationSubmit = (data: any) => {
        console.log("Verification submitted:", data);
        setIsModalOpen(false);
    };
    const handleVerificationFormOpen = () => {
        setIsModalOpen(true);
    }
    const handleDeleteProperty = async () => {
        console.log("Deleting property:", property.id);
        setIsDeleteModalOpen(false);
        setSuccessMessage("Property deleted successfully");
        setShowSuccessModal(true);
        setTimeout(() => {
        // onBack();
        }, 2000);
    };
    const handleAttachProperties = (selectedProperties: string[]) => {
        console.log("Attaching properties:", selectedProperties);
        setSuccessMessage("Properties attached successfully");
        setShowSuccessModal(true);
    };
    const handleContractSubmit = (contractData: any) => {
        console.log("Contract data:", contractData);
        setIsContractFormOpen(false);
        setSuccessMessage("Contract created successfully");
        setShowSuccessModal(true);
    };
    const onMarkAsPaid = (invoiceId: string) => {
        console.log('Mark as paid:', invoiceId)
        setSelectedInvoice(null)
        setSuccessMessage('Invoice marked as paid')
        setShowSuccessModal(true)
    }
    return (
        <DefaultLayout>
            <Breadcrumb previousPage pageName="Locatif" />

            <div className="w-full mt-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    <div className="lg:col-span-2 space-y-6">
                        {/* Property image */}
                        <div className="rounded-lg overflow-hidden h-[400px]">
                            <Image
                                src="/images/apartment/img-1.jpg"
                                alt={property.address}
                                className="w-full h-full object-cover"
                                width={800}
                                height={600}
                            />
                        </div>

                        {/* Property detail */}
                        <div className="bg-white rounded-lg p-6 shadow-sm">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h2 className="text-xl font-semibold mb-2">
                                        {property.address}
                                    </h2>
                                    <div className="flex items-center text-gray-600">
                                        <MapPin size={16} className="mr-1" />
                                        <span>{property.location}</span>
                                    </div>
                                </div>
                                <span
                                    className={`px-3 py-1 rounded-full text-sm ${property.status === "Occupied" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                                >
                                    {property.status}
                                </span>
                            </div>
                            <div className="grid grid-cols-4 gap-4 py-4 border-y border-gray-100">
                                {property.amenities.map((amenity) => (
                                    <div
                                    key={amenity}
                                    className="px-4 py-2 bg-gray-50 rounded-lg text-sm"
                                    >
                                    {amenity}
                                    </div>
                                ))}
                            </div>
                            <div className="mt-4">
                                <h3 className="font-medium mb-2">Description</h3>
                                <p className="text-gray-600">{property.description}</p>
                            </div>
                        </div>
                        
                        
                        {/* ACTIONS */}
                        <div className="bg-white rounded-lg p-6 shadow-sm">
                            <h3 className="font-medium mb-4">Quick Actions</h3>
                            <div className="space-y-3">
                            <button
                                onClick={handleShareLink}
                                className="w-full px-4 py-2 bg-[#2A4365] text-white rounded-lg hover:bg-blue-800 flex items-center justify-center gap-2"
                            >
                                <Share2 size={16} />
                                Invite Tenant
                            </button>
                            <button
                                onClick={() => handleVerificationFormOpen()}
                                className="w-full px-4 py-2 bg-[#2A4365] text-white rounded-lg hover:bg-blue-800 flex items-center justify-center gap-2"
                            >
                                <FileText size={16} />
                                Verify Property
                            </button>   
                            <button
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2"
                            >
                                <Building2 size={16} />
                                Edit Property
                            </button>
                            <button
                                onClick={() => setIsManagerSearchOpen(true)}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2"
                            >
                                <UserPlus size={16} />
                                Attach Manager
                            </button>
                            <button
                                onClick={() => setShowInvoiceGenerator(true)}
                                className="w-full px-4 py-2 bg-[#2A4365] text-white rounded-lg hover:bg-blue-800 flex items-center justify-center gap-2"
                            >
                                <DollarSign size={16} />
                                Create Invoice
                            </button>
                            {property.type === "complex" && (
                                <button
                                    onClick={() => setIsAttachPropertiesModalOpen(true)}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2"
                                >
                                    <Building2 size={16} />
                                    Attach Properties
                                </button>
                            )}
                            <button
                                onClick={() => setIsDeleteModalOpen(true)}
                                className="w-full px-4 py-2 border border-red-200 text-red-700 rounded-lg hover:bg-red-50 flex items-center justify-center gap-2"
                            >
                                <Trash size={16} />
                                Delete Property
                            </button>
                            </div>
                            {showShareLink && (
                            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                                <p className="text-sm text-gray-600 mb-2">
                                    Share this link with potential tenants:
                                </p>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value="https://rentila.com/properties/123/apply"
                                        readOnly
                                        className="flex-1 text-sm p-2 border border-gray-200 rounded-lg bg-white"
                                    />
                                    <button
                                        onClick={() =>
                                            navigator.clipboard.writeText(
                                                "https://rentila.com/properties/123/apply",
                                            )
                                        }
                                        className="px-3 py-2 bg-gray-200 rounded-lg text-sm hover:bg-gray-300"
                                    >
                                        Copy
                                    </button>
                                </div>
                            </div>
                            )}
                        </div>
                    </div>
                    
                    <div className="space-y-6">
                        {/* BILLING STATEMENT */}
                        <div className="bg-white rounded-lg p-6 shadow-sm">
                            <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-semibold flex items-center gap-2">
                                <FileText size={20} className="text-gray-400" />
                                Billing Management
                            </h2>
                            
                            </div>
                            <div className="space-y-4">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-medium">Invoice History</h3>
                                <select className="px-3 py-1 text-sm border border-gray-200 rounded-lg">
                                <option value="all">All Time</option>
                                <option value="month">This Month</option>
                                <option value="quarter">This Quarter</option>
                                <option value="year">This Year</option>
                                </select>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                                                Invoice ID
                                            </th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                                                Tenant
                                            </th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                                                Date
                                            </th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                                                Period
                                            </th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                                                Amount
                                            </th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                                                Status
                                            </th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {invoices.map((invoice) => (
                                        <tr key={invoice.id} className="hover:bg-gray-50">
                                            <td className="px-4 py-2 text-sm">{invoice.id}</td>
                                            <td className="px-4 py-2 text-sm">{invoice.tenant}</td>
                                            <td className="px-4 py-2 text-sm">{invoice.date}</td>
                                            <td className="px-4 py-2 text-sm">{invoice.period}</td>
                                            <td className="px-4 py-2 text-sm">{invoice.amount}</td>
                                            <td className="px-4 py-2">
                                            <span
                                                className={`px-2 py-1 text-xs rounded-full ${invoice.status === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}
                                            >
                                                {invoice.status}
                                            </span>
                                            </td>
                                            <td className="px-4 py-2">
                                            <div className="flex gap-2">
                                                <button
                                                onClick={() => setSelectedInvoice(invoice.id)}
                                                className="text-sm text-blue-600 hover:text-blue-800"
                                                >
                                                View
                                                </button>
                                                {invoice.status !== 'Paid' && (
                                                <button
                                                    onClick={() => {
                                                    onMarkAsPaid(invoice.id)
                                                    setSuccessMessage('Invoice marked as paid')
                                                    setShowSuccessModal(true)
                                                    }}
                                                    className="text-sm text-green-600 hover:text-green-800"
                                                >
                                                    Mark as Paid
                                                </button>
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
                        {/* TENANT REQUESTS */}
                        <div className="bg-white rounded-lg p-6 shadow-sm">
                            <div className="flex items-center gap-2 mb-4">
                            <Users size={20} className="text-gray-400" />
                            <h3 className="font-medium">Tenant Requests</h3>
                            </div>
                            <div className="space-y-4">
                            {tenantRequests.map((request) => (
                                <div
                                key={request.id}
                                className="border border-gray-100 rounded-lg p-4"
                                >
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                    <h4 className="font-medium">{request.name}</h4>
                                    <p className="text-sm text-gray-500">{request.email}</p>
                                    <p className="text-sm text-gray-500">{request.phone}</p>
                                    </div>
                                    <div className="flex flex-col items-end">
                                    <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                                        {request.status}
                                    </span>
                                    <span className="text-xs text-gray-500 mt-1">
                                        {request.submitted}
                                    </span>
                                    </div>
                                </div>
                                <div className="flex gap-2 mt-3">
                                    <button
                                    className="px-3 py-1 text-sm bg-[#2A4365] text-white rounded-lg hover:bg-blue-800"
                                    onClick={() => {
                                        setSelectedTenant(request);
                                        setIsContractFormOpen(true);
                                    }}
                                    >
                                    Accept
                                    </button>
                                    <button className="px-3 py-1 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">
                                    Decline
                                    </button>
                                </div>
                                </div>
                            ))}
                            </div>
                        </div>
                        {/* RECENT MAINTENANCE */}
                        <div className="bg-white rounded-lg p-6 shadow-sm">
                            <div className="flex items-center gap-2 mb-4">
                            <WrenchIcon size={20} className="text-gray-400" />
                            <h3 className="font-medium">Recent Maintenance</h3>
                            </div>
                            <div className="space-y-3">
                            {property.recentMaintenance.map((item, index) => (
                                <div
                                key={index}
                                className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0"
                                >
                                <div>
                                    <p className="font-medium">{item.issue}</p>
                                    <p className="text-sm text-gray-500">{item.date}</p>
                                </div>
                                <span className="text-sm text-green-600">{item.status}</span>
                                </div>
                            ))}
                            </div>
                        </div>
                    </div>
                </div>
                
                
                
                
                
                

                {/* Modal Actions */}
                <Overlay isOpen={isManagerSearchOpen} onClose={() => setIsManagerSearchOpen(false)}>
                    <ManagerSearch
                        onClose={() => setIsManagerSearchOpen(false)}
                        onSelect={(manager) => {
                        console.log("Selected manager:", manager);
                        setIsManagerSearchOpen(false);
                        }}
                    />
                </Overlay>
                <Overlay isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                    <VerificationForm
                        propertyId={property.id}
                        onClose={() => setIsModalOpen(false)}
                        onSubmit={handleVerificationSubmit}
                    />
                </Overlay>
                <Overlay isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                    <VerificationForm
                        propertyId={property.id}
                        onClose={() => setIsModalOpen(false)}
                        onSubmit={handleVerificationSubmit}
                    />
                </Overlay>
                <Overlay isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)}>
                    <DeletePropertyModal
                        onClose={() => setIsDeleteModalOpen(false)}
                        onConfirm={handleDeleteProperty}
                        propertyAddress={property.address}
                    />
                </Overlay>
                <Overlay isOpen={isAttachPropertiesModalOpen} onClose={() => setIsAttachPropertiesModalOpen(false)}>
                    <AttachPropertiesModal
                        onClose={() => setIsAttachPropertiesModalOpen(false)}
                        onAttach={handleAttachProperties}
                        availableProperties={[]}
                    />
                </Overlay>
                <Overlay isOpen={isContractFormOpen} onClose={() => setIsContractFormOpen(false)}>
                    <TenantContractForm
                        onClose={() => setIsContractFormOpen(false)}
                        onSubmit={handleContractSubmit}
                        tenant={selectedTenant}
                    />
                </Overlay>
                <Overlay isOpen={showInvoiceGenerator} onClose={() => setShowInvoiceGenerator(false)}>
                    <InvoiceGenerator
                        onClose={() => setShowInvoiceGenerator(false)}
                        onGenerate={(data: any) => {
                            console.log('Generate invoice:', data)
                            setShowInvoiceGenerator(false)
                            setSuccessMessage('Invoice generated successfully')
                            setShowSuccessModal(true)
                        }}
                        contract={contracts[0]}
                    />
                </Overlay>
                <Overlay isOpen={showSuccessModal} onClose={() => setShowSuccessModal(false)}>
                    <SuccessModal
                        onClose={() => setShowSuccessModal(false)}
                        message={successMessage}
                    />
                </Overlay>
            </div>
        </DefaultLayout>
    );
};

export default PropertyDetail;

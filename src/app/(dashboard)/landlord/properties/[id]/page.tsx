"use client"
import React, { useEffect, useState } from "react";
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
import { useParams } from 'next/navigation';
import { getAsset } from "@/actions/assetAction";
import { AssetData, AssetDataDetailed } from "@/types/Property";
import { getStatusIcon } from "@/lib/utils";
import { PropertySkeletonPageSection1, PropertySkeletonPageSection2 } from "@/components/skeleton/pages/PropertySkeletonPage";
import Button from "@/components/ui/Button";
import { ContractForm } from "@/components/feature/Properties/ContractForm";


interface PropertyDetailProps {
  onBack: () => void;
  onEdit?: (property: any) => void;
}
const PropertyDetail = ({ onBack, onEdit }: PropertyDetailProps) => {
    const [asset, setAsset] = useState<AssetDataDetailed | null>(null);
    const [isReady, setIsReady] = useState(false);

    const [isImageLoading, setIsImageLoading] = useState(true);
    
    const [isManagerSearchOpen, setIsManagerSearchOpen] = useState(false);
    const [isContractFormOpen, setContractFormOpen] = useState(false);
    const [showShareLink, setShowShareLink] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isAttachPropertiesModalOpen, setIsAttachPropertiesModalOpen] = useState(false);
    const [selectedTenant, setSelectedTenant] = useState<any>(null);
    const [successMessage, setSuccessMessage] = useState("");
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [showInvoiceGenerator, setShowInvoiceGenerator] = useState(false)
    const [selectedInvoice, setSelectedInvoice] = useState<string | null>(null);
    const params = useParams();

    
    useEffect(() => {
        const getUnits = (items:any[]): AssetData [] => {
            return items.map(item => {
                return {
                    Code: item.Code,
                    Title: item.Title,
                    Price: item.Price,
                    Currency: item.Currency,
                    CoverUrl: item.CoverUrl,
                    StatusCode: item.StatusCode,
                    IsActive: item.IsActive, // 1 ou 0
                    TypeCode: item.TypeCode,
                    IsVerified: item.IsVerified, // 1 ou 0
                    Address: {
                        Code: item.Address.Code,
                        City: item.Address.City,
                        Country: item.Address.Country,
                        Street: item.Address.Street,
                    },
                }
            });
        }
        const fetchData = async () => {
            try {
                const result = await getAsset(params.id as string);
                console.log('-->Result', result);
                if(result?.data?.body?.assetData) {
                    const item = result.data.body.assetData;
                    const assetData = {
                        Code: item.Code,
                        Title: item.Title,
                        Price: item.Price,
                        Currency: item.Currency,
                        CoverUrl: item.CoverUrl,
                        StatusCode: item.StatusCode,
                        IsActive: item.IsActive, // 1 ou 0
                        TypeCode: item.TypeCode,
                        IsVerified: item.IsVerified, // 1 ou 0
                        Permission: result.data.body.ConfigPermissionList.map((item:any) => (item.Title)),
                        whoIs: result.data.body.whoIs,
                        BillingItems: result.data.body.billingItems.map((item: any) => (item.ItemCode)),
                        Units: getUnits(item.assets),
                        Address: {
                            Code: item.Address.Code,
                            City: item.Address.City,
                            Country: item.Address.Country,
                            Street: item.Address.Street,
                        },
                    }

                    console.log('-->assetData', assetData);
                    
                    setAsset(assetData)
                }
            } catch (error) {
                console.log(error)
            } finally {
                setIsReady(true);
            }
        }

        fetchData();
    }, []);

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
    const handleCreateContract = () => {
        setContractFormOpen(true);
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
        onBack();
        }, 2000);
    };
    const handleAttachProperties = (selectedProperties: string[]) => {
        console.log("Attaching properties:", selectedProperties);
        setSuccessMessage("Properties attached successfully");
        setShowSuccessModal(true);
    };
    const handleContractSubmit = (contractData: any) => {
        console.log("Contract data:", contractData);
        setContractFormOpen(false);
        setSuccessMessage("Contract created successfully");
        setShowSuccessModal(true);
    };
    const onMarkAsPaid = (invoiceId: string) => {
        console.log('Mark as paid:', invoiceId)
        setSelectedInvoice(null)
        setSuccessMessage('Invoice marked as paid')
        setShowSuccessModal(true)
    }
    const canCreateInvoice = (): boolean => {
        let can = asset?.whoIs == 'OWNER' ? true : asset?.Permission.includes("ManageBilling");
        if(asset?.IsVerified == 0){
            can = false;
        }
        console.log("-->can", can);
        return can == undefined ? true : !can;
    }

    const canAttachManager = (): boolean => {
        let can = asset?.whoIs == 'OWNER' && asset.IsVerified == 1 ? true : false;
        return can == undefined ? true : !can;
    }
    return (
        <DefaultLayout>
            <Breadcrumb previousPage pageName="Locatif" />

            <div className="w-full mt-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {
                        isReady ?
                            <div className="lg:col-span-2 space-y-6 h-fit">
                                {/* Property image */}
                                <div className="rounded-lg overflow-hidden h-100">
                                    {asset?.CoverUrl == "" || asset?.CoverUrl == null ?
                                        <div className="relative h-full w-full overflow-hidden">
                                            <div role="status" className="h-full w-full rounded-sm shadow-sm animate-pulse">
                                                <div className="h-full flex items-center justify-center bg-gray-300 rounded-sm dark:bg-gray-700">
                                                    <svg className="w-20 h-20 text-gray-200 dark:text-gray-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 20">
                                                        <path d="M14.066 0H7v5a2 2 0 0 1-2 2H0v11a1.97 1.97 0 0 0 1.934 2h12.132A1.97 1.97 0 0 0 16 18V2a1.97 1.97 0 0 0-1.934-2ZM10.5 6a1.5 1.5 0 1 1 0 2.999A1.5 1.5 0 0 1 10.5 6Zm2.221 10.515a1 1 0 0 1-.858.485h-8a1 1 0 0 1-.9-1.43L5.6 10.039a.978.978 0 0 1 .936-.57 1 1 0 0 1 .9.632l1.181 2.981.541-1a.945.945 0 0 1 .883-.522 1 1 0 0 1 .879.529l1.832 3.438a1 1 0 0 1-.031.988Z"></path>
                                                        <path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.98 2.98 0 0 0 .13 5H5Z"></path>
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                        :
                                        <Image
                                            src={asset.CoverUrl}
                                            alt={asset.Title}
                                            className={`h-full w-full object-cover transition-transform duration-500 group-hover:scale-110 ${
                                                isImageLoading ? 'opacity-0' : 'opacity-100'
                                            }`}
                                            width={800}
                                            height={600}
                                            onLoad={() => setIsImageLoading(false)}
                                            priority
                                        />
                                    }
                                </div>

                                {/* Property detail */}
                                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                        <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-100">
                                            {asset?.Title} {
                                                asset?.TypeCode !== "CPLXMOD" && `(${asset?.Price}/${asset?.Currency})`
                                            }
                                        </h2>
                                        <div className="flex items-center text-gray-600 dark:text-gray-400">
                                            <MapPin size={16} className="mr-1" />
                                            <span>{`${asset?.Address.City}, ${asset?.Address.Street}`}</span>
                                        </div>
                                        </div>
                                        <span>
                                        {getStatusIcon(asset?.StatusCode ?? 'DRAFT')}
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-4 gap-4 py-4 border-t border-gray-100 dark:border-gray-700">
                                        {asset?.BillingItems.map((item) => (
                                        <div
                                            key={item}
                                            className="px-4 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg text-sm text-gray-800 dark:text-gray-100"
                                        >
                                            {item}
                                        </div>
                                        ))}
                                    </div>
                                </div>

                                
                                {/* BILLING STATEMENT */}
                                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
                                    <div className="flex items-center justify-between mb-6">
                                        <h2 className="text-xl font-semibold flex items-center gap-2 text-gray-800 dark:text-white">
                                        <FileText size={20} className="text-gray-400 dark:text-gray-300" />
                                        Billing Management
                                        </h2>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center mb-4">
                                        <h3 className="font-medium text-gray-700 dark:text-gray-200">Invoice History</h3>
                                        <select className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-lg">
                                            <option value="all">All Time</option>
                                            <option value="month">This Month</option>
                                            <option value="quarter">This Quarter</option>
                                            <option value="year">This Year</option>
                                        </select>
                                        </div>

                                        <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead className="bg-gray-50 dark:bg-gray-700">
                                            <tr>
                                                {[
                                                "Invoice ID",
                                                "Tenant",
                                                "Date",
                                                "Period",
                                                "Amount",
                                                "Status",
                                                "Actions"
                                                ].map((heading) => (
                                                <th
                                                    key={heading}
                                                    className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 text-nowrap"
                                                >
                                                    {heading}
                                                </th>
                                                ))}
                                            </tr>
                                            </thead>

                                            <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                                            {invoices.map((invoice) => (
                                                <tr key={invoice.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                                <td className="px-4 py-2 text-sm text-gray-800 dark:text-gray-100">{invoice.id}</td>
                                                <td className="px-4 py-2 text-sm text-gray-800 dark:text-gray-100">{invoice.tenant}</td>
                                                <td className="px-4 py-2 text-sm text-gray-800 dark:text-gray-100">{invoice.date}</td>
                                                <td className="px-4 py-2 text-sm text-gray-800 dark:text-gray-100">{invoice.period}</td>
                                                <td className="px-4 py-2 text-sm text-gray-800 dark:text-gray-100">{invoice.amount}</td>
                                                <td className="px-4 py-2">
                                                    <span
                                                    className={`px-2 py-1 text-xs rounded-full ${
                                                        invoice.status === "Paid"
                                                        ? "bg-green-100 text-green-800 dark:bg-green-200 dark:text-green-900"
                                                        : "bg-yellow-100 text-yellow-800 dark:bg-yellow-200 dark:text-yellow-900"
                                                    }`}
                                                    >
                                                    {invoice.status}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-2">
                                                    <div className="flex gap-2">
                                                    <button
                                                        onClick={() => setSelectedInvoice(invoice.id)}
                                                        className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                                                    >
                                                        View
                                                    </button>
                                                    </div>
                                                </td>
                                                </tr>
                                            ))}
                                            </tbody>
                                        </table>
                                        </div>
                                    </div>
                                </div>

                                
                                
                            </div>
                        :
                        <PropertySkeletonPageSection1 />
                    }
                        
                    
                    <div className="space-y-6">
                        {/* ACTIONS */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
                            <h3 className="font-medium mb-4 text-gray-800 dark:text-gray-100 ">Quick Actions</h3>
                            <div className="space-y-3">
                                {
                                    asset?.whoIs == "OWNER" && <>
                                        <Button onClick={handleShareLink} variant='neutral' disable={asset?.IsVerified == 0} isSubmitBtn={false}>
                                            <Share2 size={16} /> Invite Tenant
                                        </Button>
                                        <Button onClick={handleCreateContract} variant='neutral' disable={asset?.IsVerified == 0} isSubmitBtn={false}>
                                            <FileText size={16} /> Create a contract
                                        </Button>
                                        { asset?.StatusCode == "DRAFT" && <Button onClick={handleVerificationFormOpen} variant='neutral' disable={false} isSubmitBtn={false}>
                                            <FileText size={16} /> Verify Property
                                        </Button>}
                                        <Button onClick={() => onEdit?.(property)} variant='neutral' disable={asset?.StatusCode == "PENDING"} isSubmitBtn={false}>
                                            <Building2 size={16} /> Edit Property
                                        </Button>
                                        <Button onClick={() => setIsManagerSearchOpen(true)} variant='neutral' disable={canAttachManager()} isSubmitBtn={false}>
                                            <UserPlus size={16} /> Attach Manager
                                        </Button>
                                    </>
                                }
                                <Button onClick={() => setShowInvoiceGenerator(true)} variant='neutral' disable={canCreateInvoice()} isSubmitBtn={false}>
                                    <DollarSign size={16} /> Create Invoice
                                </Button>
                                
                                
                                {
                                    asset?.whoIs == "OWNER" && 
                                    (
                                        <>
                                            {asset?.TypeCode === "CPLXMOD" && (
                                                <Button onClick={() => setIsAttachPropertiesModalOpen(true)} variant='neutral' disable={!(asset?.whoIs == "OWNER" && asset?.IsVerified == 1)} isSubmitBtn={false}>
                                                    <Building2 size={16} /> Attach Properties
                                                </Button>
                                            )}
                                        </>
                                    )
                                }
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
                        {/* TENANT REQUESTS */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
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
                                        setContractFormOpen(true);
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
                {/* <Overlay isOpen={isManagerSearchOpen} onClose={() => setIsManagerSearchOpen(false)}>
                    <ContractForm
                        onClose={() => setIsManagerSearchOpen(false)}
                        onSelect={(manager) => {
                        console.log("Selected manager:", manager);
                        setIsManagerSearchOpen(false);
                        }}
                    />
                </Overlay> */}
                <Overlay isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                    <VerificationForm
                        propertyId={asset?.Code ?? ""}
                        propertyTitle={asset?.Title ?? ""}
                        onClose={() => setIsModalOpen(false)}
                        onSubmit={handleVerificationSubmit}
                    />
                </Overlay>
                <Overlay isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)}>
                    <DeletePropertyModal
                        onClose={() => setIsDeleteModalOpen(false)}
                        onConfirm={handleDeleteProperty}
                        propertyAddress={asset?.Title ?? ""}
                    />
                </Overlay>
                <Overlay isOpen={isAttachPropertiesModalOpen} onClose={() => setIsAttachPropertiesModalOpen(false)}>
                    <AttachPropertiesModal
                        onClose={() => setIsAttachPropertiesModalOpen(false)}
                        onAttach={handleAttachProperties}
                        availableProperties={[]}
                    />
                </Overlay>
                <Overlay isOpen={isContractFormOpen} onClose={() => setContractFormOpen(false)}>
                    <TenantContractForm
                        onClose={() => setContractFormOpen(false)}
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

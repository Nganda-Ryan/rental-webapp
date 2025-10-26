"use client"
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from 'next/navigation';
import { useTranslations } from "next-intl";
import {
  Share2,
  FileText,
  Building2,
  DollarSign,
  Zap,
} from "lucide-react";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import SectionWrapper from "@/components/Cards/SectionWrapper";
import toast from 'react-hot-toast';
import { capitalize } from "@/lib/utils";
import { roleStore } from "@/store/roleStore";

// Custom hooks
import { useAssetDetails } from "@/hooks/useAssetDetails";
import { useAssetPermissions } from "@/hooks/useAssetPermissions";
import { AssetType } from "@/types/AssetHooks";

// New components
import { AssetDetailsCard } from "@/components/feature/Properties/AssetDetailsCard";
import { AssetSections } from "@/components/feature/Properties/AssetSections";
import { AssetModals } from "@/components/feature/Properties/AssetModals";
import { QuickAction, QuickActionItem, MobileActionsDrawer, MobileActionFAB } from "@/components/ui/QuickAction";
import { PropertyManagerSection } from "@/components/feature/Properties/PropertyManagerSection";
import { PropertySkeletonPageSection1, RightSideAction } from "@/components/skeleton/pages/PropertySkeletonPage";

// Actions
import { createContract, terminateLease } from "@/actions/assetAction";
import { IInvoiceForm } from "@/types/Property";
import { IUser } from "@/types/user";

const UnitDetail = () => {
  const params = useParams();
  const router = useRouter();
  const { user } = roleStore();
  const commonT = useTranslations('Common');
  const today = new Date().toISOString().split("T")[0];

  // Use custom hooks
  const {
    asset,
    activeContract,
    contracts,
    invoices,
    units,
    managerList,
    tenantInfo,
    isLoading: isLoadingAsset,
    error,
    refetch,
  } = useAssetDetails({
    assetId: params.unitId as string,
    assetType: AssetType.UNIT,
    profileCode: user?.Profiles.find(p => p.RoleCode === "LANDLORD")?.Code ?? "",
  });

  const permissions = useAssetPermissions({
    asset,
    assetType: AssetType.UNIT,
    activeContract: activeContract as any,
    userRole: "LANDLORD",
  });

  // UI State
  const [showShareLink, setShowShareLink] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [showMobileActions, setShowMobileActions] = useState(false);

  // Modal states
  const [isContractFormOpen, setContractFormOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAttachPropertiesModalOpen, setIsAttachPropertiesModalOpen] = useState(false);
  const [isTerminatingContract, setIsTerminatingContract] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showInvoiceGenerator, setShowInvoiceGenerator] = useState(false);
  const [showActionModal, setShowActionModal] = useState(false);

  const [successMessage, setSuccessMessage] = useState("");
  const [invoiceFormDefaultValue, setInvoiceFormDefaultValue] = useState<IInvoiceForm>();
  const [tempInvoiceFormDefaultValue, setTempInvoiceFormDefaultValue] = useState<IInvoiceForm>();
  const [action, setAction] = useState<"CREATE" | "UPDATE">("CREATE");

  // Effects
  useEffect(() => {
    if (showShareLink) {
      const timer = setTimeout(() => {
        setShowShareLink(false);
        setClicked(false);
      }, 7000);
      return () => clearTimeout(timer);
    }
  }, [showShareLink]);

  useEffect(() => {
    if (showMobileActions) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [showMobileActions]);

  useEffect(() => {
    if (showInvoiceGenerator === false) {
      setInvoiceFormDefaultValue(tempInvoiceFormDefaultValue);
      setAction("CREATE");
    }
  }, [showInvoiceGenerator, tempInvoiceFormDefaultValue]);

  // Action handlers
  const handleShareLink = () => {
    setShowShareLink(true);
  };

  const handleCreateContract = () => {
    setContractFormOpen(true);
    setShowMobileActions(false);
  };

  const handleClickTerminateLease = () => {
    setShowActionModal(true);
  };

  const handleConfirmTerminateLease = async () => {
    try {
      setIsTerminatingContract(true);
      if (activeContract) {
        const result = await terminateLease(activeContract.id);
        if (result.error) {
          if (result.code === 'SESSION_EXPIRED') {
            router.push('/signin');
            return;
          }
          toast.error(result.error ?? commonT('unexpectedError'), { position: 'bottom-right' });
        }
      }
    } catch (error) {
      toast.error("Failed to terminate lease", { position: 'bottom-right' });
    } finally {
      await refetch();
      setIsTerminatingContract(false);
      setShowActionModal(false);
      toast.success("Lease terminated", { position: 'bottom-right' });
    }
  };

  const handleContractSubmit = async (contractData: any) => {
    try {
      const result = await createContract({
        ...contractData,
        assetCode: asset?.Code ?? "",
      });
      if (result.contract) {
        setSuccessMessage("Contract created successfully");
        setShowSuccessModal(true);
      } else if (result.error) {
        toast.error(result.error ?? commonT('unexpectedError'), { position: 'bottom-right' });
      }
    } catch (error) {
      toast.error("Failed to create contract", { position: 'bottom-right' });
    } finally {
      await refetch();
      setContractFormOpen(false);
    }
  };

  const copyToClipboard = (text: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).catch((err) => {
        console.error("Clipboard write failed:", err);
      });
    } else {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      textArea.style.top = "0";
      textArea.style.left = "0";
      textArea.style.width = "1px";
      textArea.style.height = "1px";
      textArea.style.padding = "0";
      textArea.style.border = "none";
      textArea.style.outline = "none";
      textArea.style.boxShadow = "none";
      textArea.style.background = "transparent";

      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      try {
        document.execCommand("copy");
      } catch (err) {
        console.error("Fallback: copy failed", err);
      }

      document.body.removeChild(textArea);
    }
    setClicked(true);
  };

  const handleSelectedContract = (contractId: string) => {
    router.push(`/landlord/properties/${asset?.ParentCode}/units/${asset?.Code}/contracts/${contractId}`);
  };

  // Build QuickAction items
  const quickActions: QuickActionItem[] = [
    {
      id: 'invite-tenant',
      label: 'Invite Tenant',
      icon: Share2,
      onClick: handleShareLink,
      variant: 'neutral',
      show: permissions.canShareLink,
    },
    {
      id: 'attach-properties',
      label: 'Attach Properties',
      icon: Building2,
      onClick: () => setIsAttachPropertiesModalOpen(true),
      variant: 'neutral',
      show: permissions.canAttachProperties,
    },
    {
      id: 'edit-unit',
      label: 'Edit Property',
      icon: Building2,
      onClick: () => router.push(`/landlord/properties/${asset?.ParentCode}/edit-unit?unitId=${asset?.Code}`),
      variant: 'neutral',
      show: permissions.canEditProperty,
      disabled: asset?.Status === "PENDING",
    },
    {
      id: 'create-contract',
      label: 'Create a contract',
      icon: FileText,
      onClick: handleCreateContract,
      variant: 'neutral',
      show: permissions.canCreateContract,
    },
    {
      id: 'terminate-lease',
      label: 'Terminate Lease',
      icon: DollarSign,
      onClick: handleClickTerminateLease,
      variant: 'danger',
      show: permissions.canTerminateLease,
      loading: isTerminatingContract,
    },
  ];

  const shareLinkContent = showShareLink && asset ? (
    <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
        Share this link with potential renter:
      </p>
      <div className="flex gap-2">
        <input
          type="text"
          value={`https://applink.rentalafrique.com/share/property/${asset.Code}`}
          readOnly
          className="flex-1 text-sm p-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200"
        />
        <button
          onClick={() => copyToClipboard(`https://applink.rentalafrique.com/share/property/${asset.Code}`)}
          className={`px-3 py-2 rounded-lg text-sm transition-all duration-300 ease-out transform hover:scale-105 active:scale-95 ${
            clicked ? "bg-green-500 text-white" : "bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
          }`}
        >
          <span className="inline-flex items-center gap-1">
            {clicked ? "Copied!" : "Copy"}
          </span>
        </button>
      </div>
    </div>
  ) : null;

  return (
    <DefaultLayout>
      <Breadcrumb previousPage pageName={`Unit ${asset?.Name ? "- " + capitalize(asset.Name) : ""}`} />

      <div className="w-full mt-7">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {!isLoadingAsset ? (
            <div className="lg:col-span-2 space-y-6 h-fit">
              {/* Asset Details Card */}
              <AssetDetailsCard
                asset={asset}
                tenantInfo={tenantInfo}
                showImage={true}
              />

              {/* Asset Sections - Units don't show invoices (commented out in original) */}
              <AssetSections
                asset={asset}
                contracts={contracts}
                invoices={[]}
                units={[]}
                user={user}
                showUnits={false}
                showInvoices={false}
                showContracts={true}
                onContractClick={handleSelectedContract}
              />
            </div>
          ) : (
            <PropertySkeletonPageSection1 />
          )}

          {/* SIDE SECTION */}
          <div className="space-y-6">
            {!isLoadingAsset ? (
              <div>
                {/* DESKTOP ACTIONS */}
                <div className="hidden lg:block">
                  <SectionWrapper title="Quick Actions">
                    <QuickAction
                      actions={quickActions}
                      additionalContent={{
                        content: shareLinkContent,
                        show: showShareLink,
                      }}
                    />
                  </SectionWrapper>
                </div>

                {/* MANAGER SECTION */}
                {managerList.length > 0 && (
                  <PropertyManagerSection
                    managerList={managerList as any}
                    onCancelInvitation={() => {}}
                  />
                )}
              </div>
            ) : (
              <RightSideAction />
            )}
          </div>
        </div>

        {/* MOBILE DRAWER */}
        <MobileActionsDrawer
          showMobileActions={showMobileActions}
          onClose={() => setShowMobileActions(false)}
        >
          <QuickAction
            actions={quickActions}
            additionalContent={{
              content: shareLinkContent,
              show: showShareLink,
            }}
            isMobile={true}
          />
        </MobileActionsDrawer>

        {/* MOBILE FAB */}
        <MobileActionFAB
          onClick={() => setShowMobileActions(true)}
          show={!showMobileActions}
          icon={Zap}
        />

        {/* MODALS */}
        <AssetModals
          showInvoiceGenerator={showInvoiceGenerator}
          showManagerSearch={false}
          showVerificationForm={isModalOpen}
          showDeleteModal={isDeleteModalOpen}
          showAttachPropertiesModal={isAttachPropertiesModalOpen}
          showContractForm={isContractFormOpen}
          showSuccessModal={showSuccessModal}
          showActionModal={showActionModal}
          showProcessingModal={false}
          invoiceFormDefaultValue={invoiceFormDefaultValue}
          invoiceAction={action}
          permissionList={[]}
          successMessage={successMessage}
          processingMessage="Loading..."
          assetTitle={asset?.Name}
          activeContractId={activeContract?.id}
          onCloseInvoiceGenerator={() => setShowInvoiceGenerator(false)}
          onCreateInvoice={() => {}}
          onCloseManagerSearch={() => {}}
          onSelectManager={() => {}}
          onCloseVerificationForm={() => setIsModalOpen(false)}
          onSubmitVerification={() => {}}
          onCloseDeleteModal={() => setIsDeleteModalOpen(false)}
          onConfirmDelete={() => {}}
          onCloseAttachPropertiesModal={() => setIsAttachPropertiesModalOpen(false)}
          onAttachProperties={() => {}}
          onCloseContractForm={() => setContractFormOpen(false)}
          onSubmitContract={handleContractSubmit}
          onCloseSuccessModal={() => setShowSuccessModal(false)}
          onCloseActionModal={() => setShowActionModal(false)}
          onConfirmAction={handleConfirmTerminateLease}
        />
      </div>
    </DefaultLayout>
  );
};

export default UnitDetail;

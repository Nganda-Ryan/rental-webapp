"use client"
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from 'next/navigation';
import { useTranslations } from "next-intl";
import {
  Share2,
  FileText,
  Building2,
  UserPlus,
  DollarSign,
  Zap,
} from "lucide-react";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import SectionWrapper from "@/components/Cards/SectionWrapper";
import toast from 'react-hot-toast';
import { capitalize } from "@/lib/utils";
import { roleStore } from "@/store/roleStore";
import { ASSET_TYPE_COMPLEXE } from "@/constant";

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
import Nodata from "@/components/error/Nodata";

// Actions
import { createContract, createInvoice, inviteManager, terminateLease } from "@/actions/assetAction";
import { requestPropertyVerification } from "@/actions/requestAction";
import { IInvoiceForm, IInvoice, IPropertyVerification, IPropertyVerificationDoc } from "@/types/Property";
import { IInviteManagerRequest, IUser } from "@/types/user";

const PropertyDetail = () => {
  const params = useParams();
  const router = useRouter();
  const { user } = roleStore();
  const commonT = useTranslations('Common');

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
    refetch,
    permissionList
  } = useAssetDetails({
    assetId: params.id as string,
    assetType: AssetType.PROPERTY,
    profileCode: user?.Profiles.find(p => p.RoleCode === "LANDLORD")?.Code ?? "",
  });

  const permissions = useAssetPermissions({
    asset,
    assetType: AssetType.PROPERTY,
    activeContract: activeContract as any,
    userRole: "LANDLORD",
  });

  // UI State
  const [showShareLink, setShowShareLink] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [showMobileActions, setShowMobileActions] = useState(false);

  // Modal states
  const [isManagerSearchOpen, setIsManagerSearchOpen] = useState(false);
  const [isContractFormOpen, setContractFormOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAttachPropertiesModalOpen, setIsAttachPropertiesModalOpen] = useState(false);
  const [isTerminatingContract, setIsTerminatingContract] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showInvoiceGenerator, setShowInvoiceGenerator] = useState(false);
  const [showActionModal, setShowActionModal] = useState(false);

  const [loadingMessage, setLoadingMessage] = useState("Loading...");
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

  const handleVerificationFormOpen = () => {
    setIsModalOpen(true);
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

  const handleInviteManager = async (manager: { userInfo: IUser; permissions: string[] }) => {
    if (asset) {
      try {
        const payload: IInviteManagerRequest = {
          assetCode: asset.Code,
          managerCode: manager.userInfo.id,
          profilCode: user?.Profiles.find(profile => profile.RoleCode === "LANDLORD")?.Code ?? "",
          notes: "",
          title: asset.Name,
          body: mapPermissionsToObject(manager.permissions),
        };

        setIsLoading(true);
        setLoadingMessage("Inviting manager...");
        const result = await inviteManager(payload);

        if (result.data) {
          setIsLoading(false);
          setLoadingMessage("Loading...");
          setSuccessMessage("Manager invited successfully");
          setShowSuccessModal(true);
          await refetch();
        } else if (result.error) {
          setIsLoading(false);
          setLoadingMessage("Loading...");
          if (result.code === 'SESSION_EXPIRED') {
            router.push('/signin');
            return;
          }
          toast.error(result.error ?? commonT('unexpectedError'), { position: 'bottom-right' });
        }
      } catch (error) {
        toast.error("An error occurred while inviting the manager", { position: 'bottom-right' });
      }
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

  const handleVerificationSubmit = async (body: IPropertyVerificationDoc[], note: string) => {
    if (asset && user) {
      try {
        const payload: IPropertyVerification = {
          assetCode: asset.Code,
          body: body,
          notes: note,
          title: `Verification of ${asset.Name}`,
          userId: user.Code
        };

        setLoadingMessage("Processing...");
        setIsLoading(true);
        setIsModalOpen(false);

        const result = await requestPropertyVerification(payload);

        if (result.data) {
          setIsModalOpen(false);
          setIsLoading(false);
          setSuccessMessage("Request sent successfully");
          setShowSuccessModal(true);
          setLoadingMessage("Loading...");
          toast.success(`Request for ${payload.title} property sent successfully`, { position: 'bottom-right' });
        } else if (result.error) {
          if (result.code === 'SESSION_EXPIRED') {
            router.push('/signin');
            return;
          }
          setLoadingMessage("Loading...");
          setIsLoading(false);
          toast.error(result.error ?? commonT('unexpectedError'), { position: 'bottom-right' });
        }
      } catch (error) {
        toast.error("Something went wrong during the process", { position: 'bottom-right' });
      } finally {
        await refetch();
        setIsLoading(false);
      }
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

  const mapPermissionsToObject = (permissions: string[]): Record<string, boolean> => {
    return permissions.reduce((acc, permission) => {
      acc[permission] = true;
      return acc;
    }, {} as Record<string, boolean>);
  };

  const handleSelectedContract = (contractId: string) => {
    router.push(`/landlord/properties/${params.id}/contracts/${contractId}`);
  };

  const handleSelectUnit = (unitId: string) => {
    router.push(`/landlord/properties/${params.id}/units/${unitId}`);
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
      id: 'verify-property',
      label: 'Verify Property',
      icon: FileText,
      onClick: handleVerificationFormOpen,
      variant: 'neutral',
      show: permissions.canVerifyProperty,
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
      id: 'edit-property',
      label: 'Edit Property',
      icon: Building2,
      onClick: () => router.push(`/landlord/properties/edit?propertyId=${params.id}`),
      variant: 'neutral',
      show: permissions.canEditProperty,
      disabled: asset?.Status === "PENDING",
    },
    {
      id: 'attach-manager',
      label: 'Attach Manager',
      icon: UserPlus,
      onClick: () => { setIsManagerSearchOpen(true); setShowMobileActions(false); },
      variant: 'neutral',
      show: permissions.canAttachManager,
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
      <Breadcrumb previousPage pageName={`Property ${asset ? ("- " + capitalize(asset.Name)) : ""}`} />

      <div className="w-full mt-7">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {!isLoadingAsset ? (
            <>
              {asset ? (
                <div className="lg:col-span-2 space-y-4 h-fit">
                  {/* Asset Details Card */}
                  <AssetDetailsCard
                    asset={asset}
                    tenantInfo={tenantInfo}
                    showImage={true}
                  />

                  {/* Asset Sections */}
                  <AssetSections
                    asset={asset}
                    contracts={contracts}
                    invoices={invoices}
                    units={units}
                    user={user}
                    showUnits={asset.Type === ASSET_TYPE_COMPLEXE}
                    showInvoices={asset.Type !== ASSET_TYPE_COMPLEXE}
                    showContracts={asset.Type !== ASSET_TYPE_COMPLEXE}
                    onContractClick={handleSelectedContract}
                    onUnitClick={handleSelectUnit}
                  />
                </div>
              ) : (
                <div className="lg:col-span-2 space-y-6 h-fit">
                  <Nodata />
                </div>
              )}
            </>
          ) : (
            <PropertySkeletonPageSection1 />
          )}

          {/* SIDE SECTION */}
          <div className="space-y-6">
            {!isLoadingAsset ? (
              <div>
                {/* DESKTOP ACTIONS */}
                <div className="hidden lg:block">
                  <SectionWrapper title="Quick Actions" Icon={Zap}>
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
          showManagerSearch={isManagerSearchOpen}
          showVerificationForm={isModalOpen}
          showDeleteModal={isDeleteModalOpen}
          showAttachPropertiesModal={isAttachPropertiesModalOpen}
          showContractForm={isContractFormOpen}
          showSuccessModal={showSuccessModal}
          showActionModal={showActionModal}
          showProcessingModal={isLoading}
          invoiceFormDefaultValue={invoiceFormDefaultValue}
          invoiceAction={action}
          permissionList={permissionList}
          successMessage={successMessage}
          processingMessage={loadingMessage}
          assetTitle={asset?.Name}
          activeContractId={activeContract?.id}
          onCloseInvoiceGenerator={() => setShowInvoiceGenerator(false)}
          onCreateInvoice={() => {}}
          onCloseManagerSearch={() => setIsManagerSearchOpen(false)}
          onSelectManager={handleInviteManager}
          onCloseVerificationForm={() => setIsModalOpen(false)}
          onSubmitVerification={handleVerificationSubmit}
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

export default PropertyDetail;

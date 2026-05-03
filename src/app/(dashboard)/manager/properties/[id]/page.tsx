"use client"
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useParams, useRouter } from 'next/navigation';
import { useTranslations } from "next-intl";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import toast from 'react-hot-toast';
import { capitalize, mapPermissionsToObject } from "@/lib/utils";
import { roleStore } from "@/store/roleStore";
import { ASSET_TYPE_COMPLEXE } from "@/constant";

// Custom hooks
import { useAssetDetails } from "@/hooks/useAssetDetails";
import { useAssetPermissions } from "@/hooks/useAssetPermissions";
import { useModalState } from "@/hooks/useModalState";
import { useAssetOperations } from "@/hooks/useAssetOperations";
import { useQuickActions } from "@/hooks/useQuickActions";
import { AssetType } from "@/types/AssetHooks";

// Components
import { AssetDetailsCard } from "@/components/feature/Properties/AssetDetailsCard";
import { AssetSections } from "@/components/feature/Properties/AssetSections";
import { AssetModals } from "@/components/feature/Properties/AssetModals";
import { AssetDetailLayout } from "@/components/feature/Properties/AssetDetailLayout";
import { ShareLinkCard } from "@/components/feature/Properties/ShareLinkCard";
import { AssetDashboard } from "@/components/feature/Properties/AssetDashboard";
import { PropertyManagerSection } from "@/components/feature/Properties/PropertyManagerSection";
import Nodata from "@/components/error/Nodata";

// Actions
import { inviteManager, attachAsset, assetDashboard, deactivateAsset, activateAsset, deleteAsset } from "@/actions/assetAction";
import { requestPropertyVerification } from "@/actions/requestAction";
import { IInvoiceForm, IPropertyVerification, IPropertyVerificationDoc, IAttachSimpleAssetToCplx, AssetData, IGetAssetDashboard, IContractDetail, AssetDataDetailed as PropertyAssetDataDetailed } from "@/types/Property";
import type { PropertyRequestItem } from "@/config/propertyTableColumns";
import { IInviteManagerRequest, IUser } from "@/types/user";
import { QuickActionItem } from "@/components/ui/QuickAction";
import { ContractPdfViewerModal } from "@/components/feature/Properties/ContractPdfViewerModal";
import { RequestDetailModal } from "@/components/feature/Properties/RequestDetailModal";
import Overlay from "@/components/Overlay";

const PropertyDetail = () => {
  const params = useParams();
  const router = useRouter();
  const { user } = roleStore();
  const commonT = useTranslations('Common');

  // Memoize profile code
  const profileCode = useMemo(
    () => user?.Profiles.find(p => p.RoleCode === "LANDLORD")?.Code ?? "",
    [user]
  );

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
    profileCode,
  });

  const permissions = useAssetPermissions({
    asset,
    assetType: AssetType.PROPERTY,
    activeContract: activeContract as any,
    userRole: "LANDLORD",
    grantedPermissions: permissionList,
  });

  // Modal state management
  const { modals, openModal, closeModal } = useModalState();

  // Asset operations
  const {
    handleCreateContract: handleCreateContractOperation,
    handleTerminateLease: handleTerminateLeaseOperation,
    isTerminatingLease,
    isCreatingContract,
  } = useAssetOperations({
    assetCode: asset?.Code,
    activeContractId: activeContract?.id,
    onRefetch: refetch,
  });

  // UI State
  const [showShareLink, setShowShareLink] = useState(false);
  const [showMobileActions, setShowMobileActions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState(commonT('loadingData') || "Loading...");
  const [successMessage, setSuccessMessage] = useState("");
  const [invoiceFormDefaultValue, setInvoiceFormDefaultValue] = useState<IInvoiceForm>();
  const [tempInvoiceFormDefaultValue, setTempInvoiceFormDefaultValue] = useState<IInvoiceForm>();
  const [action, setAction] = useState<"CREATE" | "UPDATE">("CREATE");
  const [dashboardData, setDashboardData] = useState<IGetAssetDashboard | null>(null);
  const [isLoadingDashboard, setIsLoadingDashboard] = useState(false);
  const [isDeactivating, setIsDeactivating] = useState(false);
  const [isActivating, setIsActivating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [actionType, setActionType] = useState<'deactivate' | 'activate' | 'delete' | null>(null);
  const [pdfViewerContract, setPdfViewerContract] = useState<IContractDetail | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<PropertyRequestItem | null>(null);

  // Effects
  useEffect(() => {
    if (modals.invoiceGenerator === false) {
      setInvoiceFormDefaultValue(tempInvoiceFormDefaultValue);
      setAction("CREATE");
    }
  }, [modals.invoiceGenerator, tempInvoiceFormDefaultValue]);

  // Fetch dashboard when user may view it (DashBoardViewer or owner)
  useEffect(() => {
    const fetchDashboard = async () => {
      if (!asset?.Code || !permissions.canViewAssetDashboard) {
        if (!permissions.canViewAssetDashboard) {
          setDashboardData(null);
          setIsLoadingDashboard(false);
        }
        return;
      }
      setIsLoadingDashboard(true);
      try {
        const result = await assetDashboard(asset.Code);
        if (result.data?.body) {
          setDashboardData(result.data.body as IGetAssetDashboard);
        } else if (result.error) {
          console.error('Failed to load dashboard:', result.error);
        }
      } catch (error) {
        console.error('Error loading dashboard:', error);
      } finally {
        setIsLoadingDashboard(false);
      }
    };

    fetchDashboard();
  }, [asset?.Code, permissions.canViewAssetDashboard]);


  // Action handlers
  const handleShareLink = useCallback(() => {
    setShowShareLink(true);
  }, []);

  const handleCreateContract = useCallback(() => {
    openModal('contractForm');
    setShowMobileActions(false);
  }, [openModal]);

  const handleVerificationFormOpen = useCallback(() => {
    openModal('verificationForm');
  }, [openModal]);

  const handleClickTerminateLease = useCallback(() => {
    openModal('actionModal');
  }, [openModal]);

  const handleConfirmTerminateLease = useCallback(async () => {
    await handleTerminateLeaseOperation();
    closeModal('actionModal');
  }, [handleTerminateLeaseOperation, closeModal]);

  const handleEditProperty = useCallback(() => {
    router.push(`/manager/properties/edit?propertyId=${params.id}`);
  }, [router, params.id]);

  const handleAttachProperties = useCallback(() => {
    openModal('attachProperties');
  }, [openModal]);

  const handleAttachManager = useCallback(() => {
    openModal('managerSearch');
    setShowMobileActions(false);
  }, [openModal]);

  const handleInviteManager = useCallback(async (manager: { userInfo: IUser; permissions: string[] }) => {
    if (asset) {
      try {
        const payload: IInviteManagerRequest = {
          assetCode: asset.Code,
          managerCode: manager.userInfo.id,
          profilCode: profileCode,
          notes: "",
          title: asset.Name,
          body: mapPermissionsToObject(manager.permissions),
        };

        setIsLoading(true);
        setLoadingMessage(commonT('invitingManager') || "Inviting manager...");
        const result = await inviteManager(payload);

        if (result.data) {
          setIsLoading(false);
          setLoadingMessage(commonT('loadingData') || "Loading...");
          setSuccessMessage(commonT('managerInvited') || "Manager invited successfully");
          openModal('successModal');
          await refetch();
        } else if (result.error) {
          setIsLoading(false);
          setLoadingMessage(commonT('loadingData') || "Loading...");
          if (result.code === 'SESSION_EXPIRED') {
            router.push('/signin');
            return;
          }
          toast.error(result.error ?? commonT('unexpectedError'), { position: 'bottom-right' });
        }
      } catch (error) {
        toast.error(commonT('unexpectedError'), { position: 'bottom-right' });
      }
    }
  }, [asset, profileCode, commonT, openModal, refetch, router]);

  const handleAttachProperty = useCallback(async (selectedProperty: AssetData) => {
    if (asset) {
      try {
        const payload: IAttachSimpleAssetToCplx = {
          parentCode: asset.Code,
          typeCode: selectedProperty.TypeCode,
          title: selectedProperty.Title,
          notes: '',
          price: selectedProperty.Price,
          currency: selectedProperty.Currency,
          coverUrl: selectedProperty.CoverUrl,
          tag: [],
          addressData: {
            city: selectedProperty.Address.City,
            street: selectedProperty.Address.Street,
            country: selectedProperty.Address.Country,
          },
          billingItems: [],
        };

        setIsLoading(true);
        setLoadingMessage(commonT('attachingProperty') || "Attaching property...");
        closeModal('attachProperties');

        const result = await attachAsset(payload);

        if (result.data) {
          setIsLoading(false);
          setLoadingMessage(commonT('loadingData') || "Loading...");
          setSuccessMessage(commonT('propertyAttached') || "Property attached successfully");
          openModal('successModal');
          await refetch();
        } else if (result.error) {
          setIsLoading(false);
          setLoadingMessage(commonT('loadingData') || "Loading...");
          if (result.code === 'SESSION_EXPIRED') {
            router.push('/signin');
            return;
          }
          toast.error(result.error ?? commonT('unexpectedError'), { position: 'bottom-right' });
        }
      } catch (error) {
        setIsLoading(false);
        setLoadingMessage(commonT('loadingData') || "Loading...");
        toast.error(commonT('unexpectedError'), { position: 'bottom-right' });
      }
    }
  }, [asset, commonT, closeModal, openModal, refetch, router]);

  const handleVerificationSubmit = useCallback(async (body: IPropertyVerificationDoc[], note: string) => {
    if (asset && user) {
      try {
        const payload: IPropertyVerification = {
          assetCode: asset.Code,
          body: body,
          notes: note,
          title: `${commonT('verificationOf') || 'Verification of'} ${asset.Name}`,
          userId: user.Code
        };

        setLoadingMessage(commonT('processing') || "Processing...");
        setIsLoading(true);
        closeModal('verificationForm');

        const result = await requestPropertyVerification(payload);

        if (result.data) {
          setIsLoading(false);
          setSuccessMessage(commonT('requestSent') || "Request sent successfully");
          openModal('successModal');
          setLoadingMessage(commonT('loadingData') || "Loading...");
          toast.success(`${commonT('requestFor') || 'Request for'} ${payload.title} ${commonT('sentSuccessfully') || 'sent successfully'}`, { position: 'bottom-right' });
        } else if (result.error) {
          if (result.code === 'SESSION_EXPIRED') {
            router.push('/signin');
            return;
          }
          setLoadingMessage(commonT('loadingData') || "Loading...");
          setIsLoading(false);
          toast.error(result.error ?? commonT('unexpectedError'), { position: 'bottom-right' });
        }
      } catch (error) {
        toast.error(commonT('unexpectedError'), { position: 'bottom-right' });
      } finally {
        await refetch();
        setIsLoading(false);
      }
    }
  }, [asset, user, commonT, closeModal, openModal, refetch, router]);

  const handleContractSubmit = useCallback(async (contractData: any) => {
    await handleCreateContractOperation(contractData);
    closeModal('contractForm');
    setSuccessMessage(commonT('contractCreated') || "Contract created successfully");
    openModal('successModal');
  }, [handleCreateContractOperation, closeModal, openModal, commonT]);

  const handleSelectedContract = useCallback((contractId: string) => {
    router.push(`/manager/properties/${params.id}/contracts/${contractId}`);
  }, [router, params.id]);

  const handleSelectUnit = useCallback((unitId: string) => {
    router.push(`/manager/properties/${params.id}/units/${unitId}`);
  }, [router, params.id]);

  const handleDeactivateAsset = useCallback(() => {
    setActionType('deactivate');
    openModal('actionModal');
  }, [openModal]);

  const handleActivateAsset = useCallback(() => {
    setActionType('activate');
    openModal('actionModal');
  }, [openModal]);

  const handleDeleteAsset = useCallback(() => {
    setActionType('delete');
    openModal('deleteModal');
  }, [openModal]);

  const handleConfirmDeactivate = useCallback(async () => {
    if (!asset?.Code) return;
    setIsDeactivating(true);
    try {
      const result = await deactivateAsset([asset.Code]);
      if (result.code === 200) {
        toast.success(commonT('assetDeactivated') || 'Asset deactivated successfully', { position: 'bottom-right' });
        closeModal('actionModal');
        await refetch();
        // router.push('/manager/properties');
      } else if (result.error) {
        if (result.code === 'SESSION_EXPIRED') {
          router.push('/signin');
          return;
        }
        toast.error(result.error ?? commonT('unexpectedError'), { position: 'bottom-right' });
      }
    } catch (error) {
      toast.error(commonT('failedToDeactivateAsset') || 'Failed to deactivate asset', { position: 'bottom-right' });
    } finally {
      setIsDeactivating(false);
      setActionType(null);
    }
  }, [asset, commonT, closeModal, refetch, router]);

  const handleConfirmActivate = useCallback(async () => {
    if (!asset?.Code) return;
    setIsActivating(true);
    try {
      const result = await activateAsset([asset.Code]);
      if (result.code === 200) {
        toast.success(commonT('assetActivated') || 'Asset activated successfully', { position: 'bottom-right' });
        closeModal('actionModal');
        await refetch();
      } else if (result.error) {
        if (result.code === 'SESSION_EXPIRED') {
          router.push('/signin');
          return;
        }
        toast.error(result.error ?? commonT('unexpectedError'), { position: 'bottom-right' });
      }
    } catch (error) {
      toast.error(commonT('failedToActivateAsset') || 'Failed to activate asset', { position: 'bottom-right' });
    } finally {
      setIsActivating(false);
      setActionType(null);
    }
  }, [asset, commonT, closeModal, refetch, router]);

  const handleConfirmDelete = useCallback(async () => {
    if (!asset?.Code) return;
    setIsDeleting(true);
    try {
      const result = await deleteAsset([asset.Code]);
      if (result.code === 200) {
        toast.success(commonT('assetDeleted') || 'Asset deleted successfully', { position: 'bottom-right' });
        closeModal('deleteModal');
        router.push('/manager/properties');
      } else if (result.error) {
        if (result.code === 'SESSION_EXPIRED') {
          router.push('/signin');
          return;
        }
        toast.error(result.error ?? commonT('unexpectedError'), { position: 'bottom-right' });
      }
    } catch (error) {
      toast.error(commonT('failedToDeleteAsset') || 'Failed to delete asset', { position: 'bottom-right' });
    } finally {
      setIsDeleting(false);
      setActionType(null);
    }
  }, [asset, commonT, closeModal, router]);

  // Build QuickAction items using hook
  const quickActions: QuickActionItem[] = useQuickActions({
    asset,
    assetType: AssetType.PROPERTY,
    permissions,
    isTerminatingLease,
    onShareLink: handleShareLink,
    onVerificationFormOpen: handleVerificationFormOpen,
    onAttachProperties: handleAttachProperties,
    onEditProperty: handleEditProperty,
    onAttachManager: handleAttachManager,
    onCreateContract: handleCreateContract,
    onTerminateLease: handleClickTerminateLease,
    onDeactivateAsset: handleDeactivateAsset,
    onActivateAsset: handleActivateAsset,
    onDeleteAsset: handleDeleteAsset,
    isAssetActive: asset?.IsActive === 1,
  });

  // Main content
  const mainContent = asset ? (
    <>
      <AssetDetailsCard
        asset={asset}
        tenantInfo={tenantInfo}
        showTenantInfo={permissions.canViewTenantInfo}
        showImage={true}
      />
      <AssetSections
        asset={asset}
        contracts={contracts}
        invoices={invoices}
        units={units}
        user={user}
        showUnits={asset.Type === ASSET_TYPE_COMPLEXE}
        showInvoices={asset.Type !== ASSET_TYPE_COMPLEXE && permissions.canViewInvoices}
        showContracts={asset.Type !== ASSET_TYPE_COMPLEXE && permissions.canViewContracts}
        onContractClick={handleSelectedContract}
        onViewContractPdf={(c) => setPdfViewerContract(c)}
        onViewRequestDetail={(item) => setSelectedRequest(item)}
        onUnitClick={handleSelectUnit}
      />
      {permissions.canViewAssetDashboard && (
        <AssetDashboard
          dashboardData={dashboardData}
          isLoading={isLoadingDashboard}
        />
      )}
    </>
  ) : (
    <Nodata />
  );

  // Manager section
  const managerSection = managerList.length > 0 ? (
    <PropertyManagerSection
      managerList={managerList as any}
      onCancelInvitation={() => {}}
    />
  ) : undefined;

  return (
    <DefaultLayout>
      <Breadcrumb previousPage pageName={`${commonT('property')} ${asset ? ("- " + capitalize(asset.Name)) : ""}`} />

      <AssetDetailLayout
        mainContent={mainContent}
        quickActions={quickActions}
        shareLinkContent={
          <ShareLinkCard
            asset={asset}
            show={showShareLink}
          />
        }
        managerSection={managerSection}
        isLoading={isLoadingAsset}
        showMobileActions={showMobileActions}
        onToggleMobileActions={() => setShowMobileActions(!showMobileActions)}
      />

      {/* MODALS */}
      <AssetModals
        showInvoiceGenerator={modals.invoiceGenerator}
        showManagerSearch={modals.managerSearch}
        showVerificationForm={modals.verificationForm}
        showDeleteModal={modals.deleteModal}
        showAttachPropertiesModal={modals.attachProperties}
        showContractForm={modals.contractForm}
        showSuccessModal={modals.successModal}
        showActionModal={modals.actionModal}
        showProcessingModal={isLoading}
        invoiceFormDefaultValue={invoiceFormDefaultValue}
        invoiceAction={action}
        permissionList={permissionList}
        successMessage={successMessage}
        processingMessage={loadingMessage}
        assetTitle={asset?.Name}
        activeContractId={activeContract?.id}
        profileCode={profileCode}
        onCloseInvoiceGenerator={() => closeModal('invoiceGenerator')}
        onCreateInvoice={() => {}}
        onCloseManagerSearch={() => closeModal('managerSearch')}
        onSelectManager={handleInviteManager}
        onCloseVerificationForm={() => closeModal('verificationForm')}
        onSubmitVerification={handleVerificationSubmit}
        onCloseDeleteModal={() => {
          closeModal('deleteModal');
          setActionType(null);
        }}
        onConfirmDelete={handleConfirmDelete}
        isUnit={false}
        isDeactivating={isDeactivating}
        isActivating={isActivating}
        isDeleting={isDeleting}
        onCloseAttachPropertiesModal={() => closeModal('attachProperties')}
        onAttachProperties={handleAttachProperty}
        onCloseContractForm={() => closeModal('contractForm')}
        onSubmitContract={handleContractSubmit}
        onCloseSuccessModal={() => closeModal('successModal')}
        onCloseActionModal={() => {
          closeModal('actionModal');
          setActionType(null);
        }}
        onConfirmAction={actionType === 'deactivate' ? handleConfirmDeactivate : actionType === 'activate' ? handleConfirmActivate : handleConfirmTerminateLease}
        actionType={actionType === 'deactivate' ? 'deactivate' : actionType === 'activate' ? 'activate' : 'terminate'}
        actionTitle={actionType === 'deactivate' ? commonT('deactivateProperty') : actionType === 'activate' ? commonT('activateProperty') : undefined}
        actionMessage={actionType === 'deactivate' ? `${commonT('confirmDeactivateProperty')} ${asset?.Name || ''}?` : actionType === 'activate' ? `${commonT('confirmActivateProperty')} ${asset?.Name || ''}?` : undefined}
      />

      {/* Request detail modal - at page level to avoid layout shift */}
      <Overlay isOpen={!!selectedRequest} onClose={() => setSelectedRequest(null)}>
        <RequestDetailModal request={selectedRequest} onClose={() => setSelectedRequest(null)} />
      </Overlay>

      {/* Contract PDF viewer modal */}
      {pdfViewerContract && asset && user && (
        <ContractPdfViewerModal
          isOpen={!!pdfViewerContract}
          onClose={() => setPdfViewerContract(null)}
          contract={pdfViewerContract}
          asset={{
            Code: asset.Code,
            Title: asset.Name,
            Price: asset.Rent,
            Currency: 'XOF',
            Permission: [],
            CoverUrl: asset.Image ?? '',
            StatusCode: asset.Status,
            IsActive: asset.IsActive ?? 1,
            TypeCode: asset.Type,
            IsVerified: asset.IsVerified ? 1 : 0,
            whoIs: asset.OwnerCode ?? '',
            BillingItems: asset.BillingItems?.map((b) => (typeof b === 'string' ? b : b.label)) ?? [],
            Address: {
              Code: '',
              City: asset.City,
              Country: asset.Country,
              Street: asset.Address,
            },
          } as PropertyAssetDataDetailed}
          contractor={user}
        />
      )}
    </DefaultLayout>
  );
};

export default PropertyDetail;

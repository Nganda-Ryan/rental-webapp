"use client"
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useParams, useRouter } from 'next/navigation';
import { useTranslations } from "next-intl";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import toast from 'react-hot-toast';
import { capitalize } from "@/lib/utils";
import { roleStore } from "@/store/roleStore";

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
import { PropertyManagerSection } from "@/components/feature/Properties/PropertyManagerSection";
import { IInvoiceForm } from "@/types/Property";
import { deactivateAsset, activateAsset, deleteAsset } from "@/actions/assetAction";

const UnitDetail = () => {
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
    permissionList,
  } = useAssetDetails({
    assetId: params.unitId as string,
    assetType: AssetType.UNIT,
    profileCode,
  });

  const permissions = useAssetPermissions({
    asset,
    assetType: AssetType.UNIT,
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
  } = useAssetOperations({
    assetCode: asset?.Code,
    activeContractId: activeContract?.id,
    onRefetch: refetch,
  });

  // UI State
  const [showShareLink, setShowShareLink] = useState(false);
  const [showMobileActions, setShowMobileActions] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [invoiceFormDefaultValue, setInvoiceFormDefaultValue] = useState<IInvoiceForm>();
  const [tempInvoiceFormDefaultValue, setTempInvoiceFormDefaultValue] = useState<IInvoiceForm>();
  const [action, setAction] = useState<"CREATE" | "UPDATE">("CREATE");
  const [isDeactivating, setIsDeactivating] = useState(false);
  const [isActivating, setIsActivating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [actionType, setActionType] = useState<'deactivate' | 'activate' | 'delete' | null>(null);

  // Effects
  useEffect(() => {
    if (modals.invoiceGenerator === false) {
      setInvoiceFormDefaultValue(tempInvoiceFormDefaultValue);
      setAction("CREATE");
    }
  }, [modals.invoiceGenerator, tempInvoiceFormDefaultValue]);

  // Action handlers
  const handleShareLink = useCallback(() => {
    setShowShareLink(true);
  }, []);

  const handleCreateContract = useCallback(() => {
    openModal('contractForm');
    setShowMobileActions(false);
  }, [openModal]);

  const handleClickTerminateLease = useCallback(() => {
    openModal('actionModal');
  }, [openModal]);

  const handleConfirmTerminateLease = useCallback(async () => {
    await handleTerminateLeaseOperation();
    closeModal('actionModal');
  }, [handleTerminateLeaseOperation, closeModal]);

  const handleEditProperty = useCallback(() => {
    if (asset?.ParentCode) {
      router.push(`/manager/properties/${asset.ParentCode}/edit-unit?unitId=${asset.Code}`);
    }
  }, [router, asset]);

  const handleAttachProperties = useCallback(() => {
    openModal('attachProperties');
  }, [openModal]);

  const handleContractSubmit = useCallback(async (contractData: any) => {
    await handleCreateContractOperation(contractData);
    closeModal('contractForm');
    setSuccessMessage(commonT('contractCreated') || "Contract created successfully");
    openModal('successModal');
  }, [handleCreateContractOperation, closeModal, openModal, commonT]);

  const handleSelectedContract = useCallback((contractId: string) => {
    if (asset?.ParentCode) {
      router.push(`/manager/properties/${asset.ParentCode}/units/${asset.Code}/contracts/${contractId}`);
    }
  }, [router, asset]);

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
        if (asset.ParentCode) {
          router.push(`/manager/properties/${asset.ParentCode}`);
        } else {
          router.push('/manager/properties');
        }
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
        if (asset.ParentCode) {
          router.push(`/manager/properties/${asset.ParentCode}`);
        } else {
          router.push('/manager/properties');
        }
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
  const quickActions = useQuickActions({
    asset,
    assetType: AssetType.UNIT,
    permissions,
    isTerminatingLease,
    onShareLink: handleShareLink,
    onAttachProperties: handleAttachProperties,
    onEditProperty: handleEditProperty,
    onCreateContract: handleCreateContract,
    onTerminateLease: handleClickTerminateLease,
    onDeactivateAsset: handleDeactivateAsset,
    onActivateAsset: handleActivateAsset,
    onDeleteAsset: handleDeleteAsset,
    isAssetActive: asset?.IsActive === 1,
  });

  // Main content
  const mainContent = (
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
        units={[]}
        user={user}
        showUnits={false}
        showInvoices={permissions.canViewInvoices}
        showContracts={permissions.canViewContracts}
        onContractClick={handleSelectedContract}
      />
    </>
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
      <Breadcrumb previousPage pageName={`${commonT('unit') || 'Unit'} ${asset?.Name ? "- " + capitalize(asset.Name) : ""}`} />

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
        showManagerSearch={false}
        showVerificationForm={false}
        showDeleteModal={modals.deleteModal}
        showAttachPropertiesModal={modals.attachProperties}
        showContractForm={modals.contractForm}
        showSuccessModal={modals.successModal}
        showActionModal={modals.actionModal}
        showProcessingModal={false}
        invoiceFormDefaultValue={invoiceFormDefaultValue}
        invoiceAction={action}
        permissionList={permissionList}
        successMessage={successMessage}
        processingMessage={commonT('loadingData') || "Loading..."}
        assetTitle={asset?.Name}
        activeContractId={activeContract?.id}
        profileCode={profileCode}
        onCloseInvoiceGenerator={() => closeModal('invoiceGenerator')}
        onCreateInvoice={() => {}}
        onCloseManagerSearch={() => {}}
        onSelectManager={() => {}}
        onCloseVerificationForm={() => {}}
        onSubmitVerification={() => {}}
        onCloseDeleteModal={() => {
          closeModal('deleteModal');
          setActionType(null);
        }}
        onConfirmDelete={handleConfirmDelete}
        isUnit={true}
        isDeactivating={isDeactivating}
        isActivating={isActivating}
        isDeleting={isDeleting}
        onCloseAttachPropertiesModal={() => closeModal('attachProperties')}
        onAttachProperties={() => {}}
        onCloseContractForm={() => closeModal('contractForm')}
        onSubmitContract={handleContractSubmit}
        onCloseSuccessModal={() => closeModal('successModal')}
        onCloseActionModal={() => {
          closeModal('actionModal');
          setActionType(null);
        }}
        onConfirmAction={actionType === 'deactivate' ? handleConfirmDeactivate : actionType === 'activate' ? handleConfirmActivate : handleConfirmTerminateLease}
        actionType={actionType === 'deactivate' ? 'deactivate' : actionType === 'activate' ? 'activate' : 'terminate'}
        actionTitle={actionType === 'deactivate' ? commonT('deactivateUnit') : actionType === 'activate' ? commonT('activateUnit') : undefined}
        actionMessage={actionType === 'deactivate' ? `${commonT('confirmDeactivateUnit')} ${asset?.Name || ''}?` : actionType === 'activate' ? `${commonT('confirmActivateUnit')} ${asset?.Name || ''}?` : undefined}
      />
    </DefaultLayout>
  );
};

export default UnitDetail;

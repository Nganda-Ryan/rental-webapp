import React from 'react';
import Overlay from '@/components/Overlay';
import InvoiceGenerator from '@/components/feature/Properties/InvoiceGenerator';
import { ManagerSearch } from '@/components/feature/Properties/ManagerSearch';
import { VerificationForm } from '@/components/feature/Properties/VerificationForm';
import { DeletePropertyModal } from '@/components/feature/Properties/DeletePropertyModal';
import { AttachPropertiesModal } from '@/components/feature/Properties/AttachPropertiesModal';
import { TenantContractForm } from '@/components/feature/Properties/TenantContractForm';
import { SuccessModal } from '@/components/Modal/SucessModal';
import { ActionConfirmationModal } from '@/components/Modal/ActionConfirmationModal';
import { ProcessingModal } from '@/components/Modal/ProcessingModal';
import { IInvoiceForm } from '@/types/Property';
import { IUser, IUserPermission } from '@/types/user';

export interface AssetModalsProps {
  /* Modal visibility states */
  showInvoiceGenerator: boolean;
  showManagerSearch: boolean;
  showVerificationForm: boolean;
  showDeleteModal: boolean;
  showAttachPropertiesModal: boolean;
  showContractForm: boolean;
  showSuccessModal: boolean;
  showActionModal: boolean;
  showProcessingModal: boolean;

  /* Data for modals */
  invoiceFormDefaultValue?: IInvoiceForm;
  invoiceAction: 'CREATE' | 'UPDATE';
  permissionList: IUserPermission[];
  successMessage: string;
  processingMessage: string;
  assetTitle?: string;
  activeContractId?: string;

  /* Handlers */
  onCloseInvoiceGenerator: () => void;
  onCreateInvoice: (data: IInvoiceForm) => void;
  onCloseManagerSearch: () => void;
  onSelectManager: (manager: { userInfo: IUser; permissions: string[] }) => void;
  onCloseVerificationForm: () => void;
  onSubmitVerification: (body: any[], note: string) => void;
  onCloseDeleteModal: () => void;
  onConfirmDelete: () => void;
  onCloseAttachPropertiesModal: () => void;
  onAttachProperties: (selectedProperties: string[]) => void;
  onCloseContractForm: () => void;
  onSubmitContract: (contractData: any) => void;
  onCloseSuccessModal: () => void;
  onCloseActionModal: () => void;
  onConfirmAction: () => void;
}

/**
 * AssetModals - Consolidates all modals used in asset detail pages
 * Reduces duplication and centralizes modal management
 */
export const AssetModals: React.FC<AssetModalsProps> = ({
  showInvoiceGenerator,
  showManagerSearch,
  showVerificationForm,
  showDeleteModal,
  showAttachPropertiesModal,
  showContractForm,
  showSuccessModal,
  showActionModal,
  showProcessingModal,
  invoiceFormDefaultValue,
  invoiceAction,
  permissionList,
  successMessage,
  processingMessage,
  assetTitle,
  activeContractId,
  onCloseInvoiceGenerator,
  onCreateInvoice,
  onCloseManagerSearch,
  onSelectManager,
  onCloseVerificationForm,
  onSubmitVerification,
  onCloseDeleteModal,
  onConfirmDelete,
  onCloseAttachPropertiesModal,
  onAttachProperties,
  onCloseContractForm,
  onSubmitContract,
  onCloseSuccessModal,
  onCloseActionModal,
  onConfirmAction,
}) => {
  return (
    <>
      {/* Invoice Generator Modal */}
      <Overlay isOpen={showInvoiceGenerator} onClose={onCloseInvoiceGenerator}>
        <InvoiceGenerator
          onClose={onCloseInvoiceGenerator}
          onCreate={onCreateInvoice}
          defaultValue={invoiceFormDefaultValue}
          action={invoiceAction}
        />
      </Overlay>

      {/* Manager Search Modal */}
      <Overlay isOpen={showManagerSearch} onClose={onCloseManagerSearch}>
        <ManagerSearch
          permissionList={permissionList}
          onClose={onCloseManagerSearch}
          onSelect={onSelectManager}
        />
      </Overlay>

      {/* Verification Form Modal */}
      <Overlay isOpen={showVerificationForm} onClose={onCloseVerificationForm}>
        <VerificationForm
          onClose={onCloseVerificationForm}
          onSubmit={onSubmitVerification}
        />
      </Overlay>

      {/* Delete Property Modal */}
      <Overlay isOpen={showDeleteModal} onClose={onCloseDeleteModal}>
        <DeletePropertyModal
          onClose={onCloseDeleteModal}
          onConfirm={onConfirmDelete}
          propertyAddress={assetTitle ?? ''}
        />
      </Overlay>

      {/* Attach Properties Modal */}
      <Overlay isOpen={showAttachPropertiesModal} onClose={onCloseAttachPropertiesModal}>
        <AttachPropertiesModal
          onClose={onCloseAttachPropertiesModal}
          onAttach={onAttachProperties}
          availableProperties={[]}
        />
      </Overlay>

      {/* Contract Form Modal */}
      <Overlay isOpen={showContractForm} onClose={onCloseContractForm}>
        <TenantContractForm onClose={onCloseContractForm} onSubmit={onSubmitContract} />
      </Overlay>

      {/* Success Modal */}
      <Overlay isOpen={showSuccessModal} onClose={onCloseSuccessModal}>
        <SuccessModal onClose={onCloseSuccessModal} message={successMessage} />
      </Overlay>

      {/* Action Confirmation Modal (e.g., terminate lease) */}
      <Overlay isOpen={showActionModal} onClose={onCloseActionModal}>
        <ActionConfirmationModal
          onClose={onCloseActionModal}
          onConfirm={onConfirmAction}
          title="Terminate the contract"
          type="APPROVED"
          showCommentInput={false}
          message={`Are you sure you want to terminate lease #${activeContractId} ?`}
        />
      </Overlay>

      {/* Processing Modal */}
      <Overlay isOpen={showProcessingModal} onClose={() => {}}>
        <ProcessingModal message={processingMessage} />
      </Overlay>
    </>
  );
};

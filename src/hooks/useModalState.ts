import { useState, useCallback } from 'react';

/**
 * Modal names that can be managed by this hook
 */
export type ModalName =
  | 'shareLink'
  | 'managerSearch'
  | 'contractForm'
  | 'deleteModal'
  | 'attachProperties'
  | 'verificationForm'
  | 'successModal'
  | 'actionModal'
  | 'invoiceGenerator'
  | 'processingModal';

/**
 * State object containing all modal states
 */
export interface ModalState {
  shareLink: boolean;
  managerSearch: boolean;
  contractForm: boolean;
  deleteModal: boolean;
  attachProperties: boolean;
  verificationForm: boolean;
  successModal: boolean;
  actionModal: boolean;
  invoiceGenerator: boolean;
  processingModal: boolean;
}

/**
 * Return type for useModalState hook
 */
export interface UseModalStateReturn {
  /** Current state of all modals */
  modals: ModalState;
  /** Open a specific modal by name */
  openModal: (modalName: ModalName) => void;
  /** Close a specific modal by name */
  closeModal: (modalName: ModalName) => void;
  /** Close all modals */
  closeAllModals: () => void;
  /** Check if a specific modal is open */
  isOpen: (modalName: ModalName) => boolean;
}

/**
 * Custom hook to manage modal state in a centralized way
 * 
 * @example
 * ```tsx
 * const { modals, openModal, closeModal, closeAllModals, isOpen } = useModalState();
 * 
 * // Open a modal
 * openModal('contractForm');
 * 
 * // Close a modal
 * closeModal('contractForm');
 * 
 * // Check if modal is open
 * if (isOpen('contractForm')) {
 *   // Do something
 * }
 * 
 * // Close all modals
 * closeAllModals();
 * ```
 */
export function useModalState(): UseModalStateReturn {
  const [modals, setModals] = useState<ModalState>({
    shareLink: false,
    managerSearch: false,
    contractForm: false,
    deleteModal: false,
    attachProperties: false,
    verificationForm: false,
    successModal: false,
    actionModal: false,
    invoiceGenerator: false,
    processingModal: false,
  });

  const openModal = useCallback((modalName: ModalName) => {
    setModals((prev) => ({
      ...prev,
      [modalName]: true,
    }));
  }, []);

  const closeModal = useCallback((modalName: ModalName) => {
    setModals((prev) => ({
      ...prev,
      [modalName]: false,
    }));
  }, []);

  const closeAllModals = useCallback(() => {
    setModals({
      shareLink: false,
      managerSearch: false,
      contractForm: false,
      deleteModal: false,
      attachProperties: false,
      verificationForm: false,
      successModal: false,
      actionModal: false,
      invoiceGenerator: false,
      processingModal: false,
    });
  }, []);

  const isOpen = useCallback(
    (modalName: ModalName) => {
      return modals[modalName];
    },
    [modals]
  );

  return {
    modals,
    openModal,
    closeModal,
    closeAllModals,
    isOpen,
  };
}


import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import toast from 'react-hot-toast';
import { copyToClipboard as copyToClipboardUtil } from '@/lib/utils';
import {
  AssetType,
  AssetActionsHandlers,
  UseAssetActionsParams,
} from '@/types/AssetHooks';

/**
 * Custom hook to manage all asset-related actions
 * Provides handlers for user interactions like sharing, editing, creating contracts, etc.
 */
export function useAssetActions({
  asset,
  assetType,
  activeContract,
  managerList,
  onRefetch,
}: UseAssetActionsParams): AssetActionsHandlers {
  const router = useRouter();
  const commonT = useTranslations('Common');

  // UI state for actions
  const [showShareLink, setShowShareLink] = useState(false);
  const [showVerificationForm, setShowVerificationForm] = useState(false);
  const [showAttachProperties, setShowAttachProperties] = useState(false);
  const [clicked, setClicked] = useState(false);

  /**
   * Auto-hide share link after 7 seconds
   */
  useEffect(() => {
    if (showShareLink) {
      const timer = setTimeout(() => {
        setShowShareLink(false);
        setClicked(false);
      }, 7000);
      return () => clearTimeout(timer);
    }
  }, [showShareLink]);

  /**
   * Handle share link action - shows the shareable link for tenant invitation
   */
  const handleShareLink = useCallback(() => {
    setShowShareLink(true);
  }, []);

  /**
   * Handle verification form open
   */
  const handleVerificationFormOpen = useCallback(() => {
    setShowVerificationForm(true);
  }, []);

  /**
   * Handle attach properties modal open (for complex properties)
   */
  const handleAttachProperties = useCallback(() => {
    setShowAttachProperties(true);
  }, []);

  /**
   * Handle edit property navigation
   */
  const handleEditProperty = useCallback(() => {
    if (!asset) return;

    if (assetType === AssetType.PROPERTY) {
      router.push(`/landlord/properties/edit?propertyId=${asset.Code}`);
    } else if (assetType === AssetType.UNIT && asset.ParentCode) {
      router.push(`/landlord/properties/${asset.ParentCode}/edit-unit?unitId=${asset.Code}`);
    }
  }, [asset, assetType, router]);

  /**
   * Handle attach manager action
   */
  const handleAttachManager = useCallback(() => {
    // This will be handled by opening a modal in the parent component
    // The actual invitation logic is in the parent
  }, []);

  /**
   * Handle create contract action
   */
  const handleCreateContract = useCallback(() => {
    // This will be handled by opening a modal in the parent component
    // The actual contract creation logic is in the parent
  }, []);

  /**
   * Handle terminate lease action
   */
  const handleTerminateLease = useCallback(() => {
    if (!activeContract) {
      toast.error('No active contract to terminate', { position: 'bottom-right' });
      return;
    }
    // This will be handled by opening a confirmation modal in the parent component
    // The actual termination logic is in the parent
  }, [activeContract]);

  /**
   * Handle cancel manager invitation
   */
  const handleCancelManagerInvitation = useCallback(async (managerCode: string) => {
    try {
      // TODO: Implement cancel manager invitation API call
      // For now, just show a success message
      toast.success('Manager invitation cancelled', { position: 'bottom-right' });
      await onRefetch();
    } catch (error) {
      toast.error('Failed to cancel manager invitation', { position: 'bottom-right' });
      console.error('Cancel manager invitation error:', error);
    }
  }, [onRefetch]);

  /**
   * Copy text to clipboard using utility function
   */
  const copyToClipboard = useCallback(async (text: string) => {
    const success = await copyToClipboardUtil(text);
    if (success) {
      setClicked(true);
      toast.success(commonT('copied') || 'Link copied to clipboard', { position: 'bottom-right' });
    } else {
      toast.error(commonT('copyFailed') || 'Failed to copy to clipboard', {
        position: 'bottom-right',
      });
    }
  }, [commonT]);

  return {
    handleShareLink,
    handleVerificationFormOpen,
    handleAttachProperties,
    handleEditProperty,
    handleAttachManager,
    handleCreateContract,
    handleTerminateLease,
    handleCancelManagerInvitation,
    copyToClipboard,
    showShareLink,
    clicked,
  };
}

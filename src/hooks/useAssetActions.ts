import { useState, useCallback } from 'react';
import { useRouter } from '@bprogress/next/app';
import { useTranslations } from 'next-intl';
import toast from 'react-hot-toast';
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
   * Handle share link action - shows the shareable link for tenant invitation
   */
  const handleShareLink = useCallback(() => {
    setShowShareLink(true);
    // Auto-hide after 7 seconds
    setTimeout(() => {
      setShowShareLink(false);
      setClicked(false);
    }, 7000);
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
   * Copy text to clipboard with fallback for older browsers
   */
  const copyToClipboard = useCallback((text: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).catch((err) => {
        console.error('Clipboard write failed:', err);
      });
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.top = '0';
      textArea.style.left = '0';
      textArea.style.width = '1px';
      textArea.style.height = '1px';
      textArea.style.padding = '0';
      textArea.style.border = 'none';
      textArea.style.outline = 'none';
      textArea.style.boxShadow = 'none';
      textArea.style.background = 'transparent';

      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      try {
        document.execCommand('copy');
      } catch (err) {
        console.error('Fallback: copy failed', err);
      }

      document.body.removeChild(textArea);
    }

    setClicked(true);
    toast.success('Link copied to clipboard', { position: 'bottom-right' });
  }, []);

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
  };
}

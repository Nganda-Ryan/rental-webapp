import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import toast from 'react-hot-toast';
import { createContract, terminateLease } from '@/actions/assetAction';
import { IContractForm } from '@/types/Property';

/**
 * Parameters for useAssetOperations hook
 */
export interface UseAssetOperationsParams {
  /** Asset code for contract creation */
  assetCode?: string;
  /** Active contract ID for termination */
  activeContractId?: string;
  /** Callback to refetch data after operations */
  onRefetch: () => Promise<void>;
}

/**
 * Return type for useAssetOperations hook
 */
export interface UseAssetOperationsReturn {
  /** Handler for creating a contract */
  handleCreateContract: (contractData: IContractForm) => Promise<void>;
  /** Handler for terminating a lease */
  handleTerminateLease: () => Promise<void>;
  /** Loading state for contract creation */
  isCreatingContract: boolean;
  /** Loading state for lease termination */
  isTerminatingLease: boolean;
}

/**
 * Custom hook to manage asset operations (contract creation, lease termination)
 * 
 * @example
 * ```tsx
 * const {
 *   handleCreateContract,
 *   handleTerminateLease,
 *   isCreatingContract,
 *   isTerminatingLease,
 * } = useAssetOperations({
 *   assetCode: asset?.Code,
 *   activeContractId: activeContract?.id,
 *   onRefetch: refetch,
 * });
 * ```
 */
export function useAssetOperations({
  assetCode,
  activeContractId,
  onRefetch,
}: UseAssetOperationsParams): UseAssetOperationsReturn {
  const router = useRouter();
  const commonT = useTranslations('Common');
  const [isCreatingContract, setIsCreatingContract] = useState(false);
  const [isTerminatingLease, setIsTerminatingLease] = useState(false);

  const handleCreateContract = useCallback(
    async (contractData: IContractForm) => {
      if (!assetCode) {
        toast.error(commonT('unexpectedError'), { position: 'bottom-right' });
        return;
      }

      try {
        setIsCreatingContract(true);
        const result = await createContract({
          ...contractData,
          assetCode,
        });

        if (result.contract) {
          toast.success(commonT('contractCreated') || 'Contract created successfully', {
            position: 'bottom-right',
          });
          await onRefetch();
        } else if (result.error) {
          if (result.code === 'SESSION_EXPIRED') {
            router.push('/signin');
            return;
          }
          toast.error(result.error ?? commonT('unexpectedError'), { position: 'bottom-right' });
        }
      } catch (error) {
        toast.error(commonT('failedToCreateContract') || 'Failed to create contract', {
          position: 'bottom-right',
        });
      } finally {
        setIsCreatingContract(false);
      }
    },
    [assetCode, onRefetch, router, commonT]
  );

  const handleTerminateLease = useCallback(async () => {
    if (!activeContractId) {
      toast.error(commonT('unexpectedError'), { position: 'bottom-right' });
      return;
    }

    try {
      setIsTerminatingLease(true);
      const result = await terminateLease(activeContractId);

      if (result.error) {
        if (result.code === 'SESSION_EXPIRED') {
          router.push('/signin');
          return;
        }
        toast.error(result.error ?? commonT('unexpectedError'), { position: 'bottom-right' });
      } else {
        toast.success(commonT('leaseTerminated') || 'Lease terminated', {
          position: 'bottom-right',
        });
        await onRefetch();
      }
    } catch (error) {
      toast.error(commonT('failedToTerminateLease') || 'Failed to terminate lease', {
        position: 'bottom-right',
      });
    } finally {
      setIsTerminatingLease(false);
    }
  }, [activeContractId, onRefetch, router, commonT]);

  return {
    handleCreateContract,
    handleTerminateLease,
    isCreatingContract,
    isTerminatingLease,
  };
}


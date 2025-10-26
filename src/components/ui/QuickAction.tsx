import React, { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';
import Button from '@/components/ui/Button';

/**
 * Action item configuration
 */
export interface QuickActionItem {
  /** Unique identifier for the action */
  id: string;
  /** Display label */
  label: string;
  /** Icon component from lucide-react */
  icon: LucideIcon;
  /** Click handler */
  onClick: () => void;
  /** Button variant (neutral, danger, info, success, warning, etc.) */
  variant?: 'neutral' | 'danger' | 'info' | 'success' | 'warning' | 'outline-neutral' | 'outline-danger' | 'outline-info' | 'outline-success' | 'outline-warning';
  /** Whether the action is disabled */
  disabled?: boolean;
  /** Whether the action is loading */
  loading?: boolean;
  /** Whether to show this action (conditional rendering) */
  show?: boolean;
}

/**
 * Optional content to display after actions
 */
export interface QuickActionContent {
  /** Content to render */
  content: ReactNode;
  /** Whether to show this content */
  show: boolean;
}

/**
 * Props for QuickAction component
 */
export interface QuickActionProps {
  /** List of action items to display */
  actions: QuickActionItem[];
  /** Optional additional content to display after actions */
  additionalContent?: QuickActionContent;
  /** Custom class name for container */
  className?: string;
  /** Whether to show in mobile mode (affects layout) */
  isMobile?: boolean;
}

/**
 * QuickAction - Generic, reusable component for displaying action buttons
 *
 * This component is fully independent and can be used anywhere in the application.
 * It accepts a list of actions and renders them as buttons with consistent styling.
 *
 * @example
 * ```tsx
 * const actions: QuickActionItem[] = [
 *   {
 *     id: 'edit',
 *     label: 'Edit Item',
 *     icon: Edit,
 *     onClick: () => handleEdit(),
 *     variant: 'neutral',
 *     show: canEdit,
 *   },
 *   {
 *     id: 'delete',
 *     label: 'Delete Item',
 *     icon: Trash,
 *     onClick: () => handleDelete(),
 *     variant: 'danger',
 *     show: canDelete,
 *   },
 * ];
 *
 * <QuickAction actions={actions} />
 * ```
 */
export const QuickAction: React.FC<QuickActionProps> = ({
  actions,
  additionalContent,
  className = '',
  isMobile = true,
}) => {
  // Filter actions to only show those with show=true (or show=undefined, meaning always show)
  const visibleActions = actions.filter((action) => action.show !== false);

  if (visibleActions.length === 0 && !additionalContent?.show) {
    return null;
  }

  return (
    <div className={`flex flex-col space-y-3 ${className}`}>
      {/* Render action buttons */}
      {visibleActions.map((action) => {
        const Icon = action.icon;

        return (
          <Button
            key={action.id}
            onClick={action.onClick}
            variant={action.variant || 'neutral'}
            disable={action.disabled}
            loading={action.loading}
            isSubmitBtn={false}
            fullWidth={isMobile}
          >
            <Icon size={16} /> {action.label}
          </Button>
        );
      })}

      {/* Render additional content if provided and show is true */}
      {additionalContent?.show && (
        <div className="mt-4">
          {additionalContent.content}
        </div>
      )}
    </div>
  );
};

/**
 * Mobile Drawer wrapper for QuickAction
 * Provides a slide-up drawer with overlay for mobile devices
 */
export interface MobileActionsDrawerProps {
  /** Whether the drawer is visible */
  showMobileActions: boolean;
  /** Close handler */
  onClose: () => void;
  /** Title for the drawer */
  title?: string;
  /** Children to render inside the drawer */
  children: ReactNode;
}

export const MobileActionsDrawer: React.FC<MobileActionsDrawerProps> = ({
  showMobileActions,
  onClose,
  title = 'Quick Actions',
  children,
}) => {
  return (
    <div
      className={`
        fixed inset-0 z-50 lg:hidden
        ${showMobileActions ? 'pointer-events-auto' : 'pointer-events-none'}
      `}
      role="dialog"
      aria-modal="true"
    >
      {/* Overlay */}
      <div
        className={`
          absolute inset-0 bg-black bg-opacity-40 backdrop-blur-sm
          transition-opacity duration-300 ease-linear
          ${showMobileActions ? 'opacity-100' : 'opacity-0'}
        `}
        onClick={onClose}
      />

      {/* Drawer - slide up/down */}
      <div
        className={`
          absolute bottom-0 left-0 right-0 bg-white dark:bg-gray-900 rounded-t-2xl p-4 shadow-lg
          transform transition-transform duration-300 ease-linear
          ${showMobileActions ? 'translate-y-0' : 'translate-y-full'}
        `}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 dark:hover:text-white"
            aria-label="Close drawer"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="mb-20">
          {children}
        </div>
      </div>
    </div>
  );
};

/**
 * Floating Action Button (FAB) for mobile
 * Shows a circular button that opens the mobile actions drawer
 */
export interface MobileActionFABProps {
  /** Click handler */
  onClick: () => void;
  /** Whether to show the FAB */
  show: boolean;
  /** Icon to display (defaults to Zap/lightning) */
  icon?: LucideIcon;
  /** Aria label for accessibility */
  ariaLabel?: string;
}

export const MobileActionFAB: React.FC<MobileActionFABProps> = ({
  onClick,
  show,
  icon: Icon,
  ariaLabel = 'Show quick actions',
}) => {
  if (!show) return null;

  return (
    <button
      onClick={onClick}
      aria-label={ariaLabel}
      className={`
        fixed bottom-9 right-6 z-50
        bg-[#2A4365] text-white p-4 rounded-full shadow-lg
        hover:bg-blue-700 active:scale-95
        duration-300 ease-linear
        lg:hidden
      `}
    >
      {Icon ? (
        <Icon size={24} />
      ) : (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      )}
    </button>
  );
};

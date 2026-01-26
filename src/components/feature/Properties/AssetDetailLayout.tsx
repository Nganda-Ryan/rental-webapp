"use client";

import { ReactNode, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Zap } from 'lucide-react';
import SectionWrapper from '@/components/Cards/SectionWrapper';
import { QuickAction, QuickActionItem, MobileActionsDrawer, MobileActionFAB } from '@/components/ui/QuickAction';
import { PropertySkeletonPageSection1, RightSideAction } from '@/components/skeleton/pages/PropertySkeletonPage';

/**
 * Props for AssetDetailLayout component
 */
export interface AssetDetailLayoutProps {
  /** Main content to display (asset details, sections, etc.) */
  mainContent: ReactNode;
  /** Quick actions array */
  quickActions: QuickActionItem[];
  /** Share link content (optional) */
  shareLinkContent?: ReactNode;
  /** Manager section (optional) */
  managerSection?: ReactNode;
  /** Whether the page is loading */
  isLoading: boolean;
  /** Whether mobile actions drawer is open */
  showMobileActions: boolean;
  /** Handler to toggle mobile actions drawer */
  onToggleMobileActions: () => void;
}

/**
 * AssetDetailLayout - Shared layout component for property and unit detail pages
 * Handles responsive grid layout, loading states, mobile drawer, and FAB
 * 
 * @example
 * ```tsx
 * <AssetDetailLayout
 *   mainContent={<AssetDetailsCard asset={asset} />}
 *   quickActions={quickActions}
 *   shareLinkContent={<ShareLinkCard asset={asset} show={showShareLink} />}
 *   managerSection={<PropertyManagerSection managers={managers} />}
 *   isLoading={isLoadingAsset}
 *   showMobileActions={showMobileActions}
 *   onToggleMobileActions={() => setShowMobileActions(!showMobileActions)}
 * />
 * ```
 */
export function AssetDetailLayout({
  mainContent,
  quickActions,
  shareLinkContent,
  managerSection,
  isLoading,
  showMobileActions,
  onToggleMobileActions,
}: AssetDetailLayoutProps) {
  const commonT = useTranslations('Common');
  // Handle body overflow when mobile drawer is open
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

  return (
    <div className="w-full mt-7">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Main Content */}
        {isLoading ? (
          <PropertySkeletonPageSection1 />
        ) : (
          <div className="lg:col-span-2 space-y-4 h-fit">
            {mainContent}
          </div>
        )}

        {/* Side Section */}
        <div className="space-y-6">
          {isLoading ? (
            <RightSideAction />
          ) : (
            <div>
              {/* Desktop Actions */}
              <div className="hidden lg:block">
                <SectionWrapper title={commonT('quickActions') || 'Quick Actions'} Icon={Zap}>
                  <QuickAction
                    actions={quickActions}
                    additionalContent={{
                      content: shareLinkContent,
                      show: !!shareLinkContent,
                    }}
                  />
                </SectionWrapper>
              </div>

              {/* Manager Section */}
              {managerSection}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Drawer */}
      <MobileActionsDrawer
        showMobileActions={showMobileActions}
        onClose={() => onToggleMobileActions()}
      >
        <QuickAction
          actions={quickActions}
          additionalContent={{
            content: shareLinkContent,
            show: !!shareLinkContent,
          }}
          isMobile={true}
        />
      </MobileActionsDrawer>

      {/* Mobile FAB */}
      <MobileActionFAB
        onClick={() => onToggleMobileActions()}
        show={!showMobileActions}
        icon={Zap}
      />
    </div>
  );
}


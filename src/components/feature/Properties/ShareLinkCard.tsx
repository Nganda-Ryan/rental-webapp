"use client";

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { AssetDataDetailed } from '@/types/AssetHooks';
import { copyToClipboard } from '@/lib/utils';

/**
 * Props for ShareLinkCard component
 */
export interface ShareLinkCardProps {
  /** Asset data (property or unit) */
  asset: AssetDataDetailed | null;
  /** Whether to show the card */
  show: boolean;
  /** Optional callback when copy is clicked */
  onCopy?: () => void;
}

/**
 * ShareLinkCard - Reusable component for displaying shareable property/unit links
 * 
 * @example
 * ```tsx
 * <ShareLinkCard
 *   asset={asset}
 *   show={showShareLink}
 *   onCopy={() => console.log('Copied!')}
 * />
 * ```
 */
export function ShareLinkCard({ asset, show, onCopy }: ShareLinkCardProps) {
  const commonT = useTranslations('Common');
  const [clicked, setClicked] = useState(false);

  // Auto-hide clicked state after 2 seconds
  useEffect(() => {
    if (clicked) {
      const timer = setTimeout(() => {
        setClicked(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [clicked]);

  if (!show || !asset) {
    return null;
  }

  const shareUrl = `https://applink.rentalafrique.com/share/property/${asset.Code}`;

  const handleCopy = async () => {
    const success = await copyToClipboard(shareUrl);
    if (success) {
      setClicked(true);
      onCopy?.();
    }
  };

  return (
    <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
        {commonT('shareLinkWithRenter') || 'Share this link with potential renter:'}
      </p>
      <div className="flex gap-2">
        <input
          type="text"
          value={shareUrl}
          readOnly
          className="flex-1 text-sm p-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200"
        />
        <button
          onClick={handleCopy}
          className={`px-3 py-2 rounded-lg text-sm transition-all duration-300 ease-out transform hover:scale-105 active:scale-95 ${
            clicked
              ? 'bg-green-500 text-white'
              : 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600'
          }`}
        >
          <span className="inline-flex items-center gap-1">
            {clicked ? commonT('copied') || 'Copied!' : commonT('copy') || 'Copy'}
          </span>
        </button>
      </div>
    </div>
  );
}


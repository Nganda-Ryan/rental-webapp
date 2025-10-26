import React from 'react';
import Image from 'next/image';
import { MapPin, Phone, Mail } from 'lucide-react';
import Link from 'next/link';
import ImageLoading from '@/components/ImageLoading';
import { getStatusBadge } from '@/lib/utils-component';
import { formatNumberWithSpaces, capitalizeEachWord } from '@/lib/utils';
import { IMAGE_LOADING_SHIMMER, ASSET_TYPE_COMPLEXE } from '@/constant';
import { AssetDataDetailed, TenantInfo } from '@/types/AssetHooks';
import { useTranslations } from 'next-intl';

export interface AssetDetailsCardProps {
  /** Asset data to display */
  asset: AssetDataDetailed | null;
  /** Optional tenant information */
  tenantInfo?: TenantInfo | null;
  /** Whether to show image */
  showImage?: boolean;
  /** Whether asset is loading */
  isLoading?: boolean;
}

/**
 * AssetDetailsCard - Displays detailed information about an asset (property or unit)
 * Shows image, address, status, billing items, and optional tenant information
 */
export const AssetDetailsCard: React.FC<AssetDetailsCardProps> = ({
  asset,
  tenantInfo,
  showImage = true,
  isLoading = false,
}) => {
  const tStatus = useTranslations('Status');
  const tBilling = useTranslations('Common');

  if (isLoading || !asset) {
    return (
      <div className="space-y-4">
        {showImage && (
          <div className="rounded-lg overflow-hidden h-100">
            <ImageLoading />
          </div>
        )}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-4" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
        </div>
      </div>
    );
  }

  const isComplex = asset.Type === ASSET_TYPE_COMPLEXE;
  const showPrice = !isComplex;

  return (
    <div className="space-y-4">
      {/* Asset Image */}
      {showImage && (
        <div className="rounded-lg overflow-hidden h-100">
          {asset.Image && asset.Image !== '' ? (
            <Image
              src={asset.Image}
              alt={asset.Name}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              width={1920}
              height={1080}
              priority
              onError={(e) => console.log('ERROR WHILE LOADING THE IMAGE')}
              placeholder={IMAGE_LOADING_SHIMMER}
            />
          ) : (
            <ImageLoading />
          )}
        </div>
      )}

      {/* Asset Details */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
        {/* Title and Status */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-100">
              {asset.Name}
              {showPrice && ` (${formatNumberWithSpaces(asset.Rent)}/${asset.Type})`}
            </h2>
            <div className="flex items-center text-gray-800 dark:text-gray-100">
              <MapPin size={16} className="mr-1" />
              <span>{`${asset.City}, ${asset.Address}`}</span>
            </div>
          </div>
          <span>{getStatusBadge(asset.Status, tStatus)}</span>
        </div>

        {/* Description */}
        {asset.Description && (
          <div className="flex justify-between items-start mb-4">
            <p className="text-gray-700 dark:text-gray-300 text-sm">
              {asset.Description}
            </p>
          </div>
        )}

        {/* Amenities/Tags */}
        {asset.Amenities && asset.Amenities.length > 0 && (
          <div className="flex justify-between items-start mb-4">
            <div className="flex flex-wrap gap-2">
              {asset.Amenities.map((amenity, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-50 dark:bg-blue-900 rounded-full text-sm text-blue-800 dark:text-blue-100"
                >
                  {capitalizeEachWord(amenity)}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Billing Items */}
        {asset.BillingItems && asset.BillingItems.length > 0 && (
          <div className="grid grid-cols-4 gap-4 py-4 border-t border-gray-100 dark:border-gray-700">
            {asset.BillingItems.map((item, index) => {
              const itemLabel = typeof item === 'string' ? item : item.label;
              const translatedLabel = tBilling(itemLabel as any) || itemLabel;

              return (
                <div
                  key={index}
                  className="px-4 py-2 bg-gray-50 dark:bg-gray-700 rounded-lg text-sm text-gray-800 dark:text-gray-100"
                >
                  {translatedLabel}
                </div>
              );
            })}
          </div>
        )}

        {/* Tenant Information */}
        {tenantInfo && (
          <div className="grid grid-cols-1 sm:grid-cols-2 py-4 gap-4 border-t border-gray-100 dark:border-gray-700">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Name</p>
              <Link
                href={''}
                className="font-medium dark:text-white italic hover:underline"
              >
                {tenantInfo.tenantName}
              </Link>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Phone</p>
              <div className="flex items-center gap-2">
                <Phone size={16} className="text-gray-400" />
                <p className="dark:text-gray-300">{tenantInfo.tenantPhone}</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Email</p>
              <div className="flex items-center gap-2">
                <Mail size={16} className="text-gray-400" />
                <p className="dark:text-gray-300">{tenantInfo.tenantEmail}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

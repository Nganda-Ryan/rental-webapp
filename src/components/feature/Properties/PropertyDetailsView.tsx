"use client"
import React, { useState } from 'react';
import Image from "next/image";
import Link from "next/link";
import { MapPin, Phone, Mail } from "lucide-react";
import { AssetDataDetailed } from "@/types/Property";
import { IGetTenant } from "@/types/user";
import { capitalize, capitalizeEachWord, formatNumberWithSpaces } from "@/lib/utils";
import { getStatusBadge } from "@/lib/utils-component";
import { IMAGE_LOADING_SHIMMER } from "@/constant";
import ImageLoading from "@/components/ImageLoading";

interface PropertyDetailsViewProps {
  asset: AssetDataDetailed;
  tenantInfo?: IGetTenant | null;
}

export const PropertyDetailsView: React.FC<PropertyDetailsViewProps> = ({
  asset,
  tenantInfo,
}) => {
  const [isImageLoading, setIsImageLoading] = useState(true);

  return (
    <>
      {/* Property Image */}
      <div className="rounded-lg overflow-hidden h-100">
        {asset && asset.CoverUrl && asset.CoverUrl !== "" ? (
          <Image
            src={asset.CoverUrl}
            alt={asset.Title}
            className={`h-full w-full object-cover transition-transform duration-500 group-hover:scale-110 ${
              isImageLoading ? 'opacity-0' : 'opacity-100'
            }`}
            width={1920}
            height={1080}
            priority
            onLoad={() => setIsImageLoading(false)}
            onError={(e) => console.log('ERROR WHILE LOADING THE IMAGE')}
            placeholder={IMAGE_LOADING_SHIMMER}
          />
        ) : (
          <ImageLoading />
        )}
      </div>

      {/* Property Details */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-100">
              {asset.Title}{' '}
              {asset.TypeCode !== "CPLXMOD" &&
                `(${formatNumberWithSpaces(asset.Price)}/${asset.Currency})`}
            </h2>
            <div className="flex items-center text-gray-800 dark:text-gray-100">
              <MapPin size={16} className="mr-1" />
              <span>{`${asset.Address.City}, ${asset.Address.Street}`}</span>
            </div>
          </div>
          <span>{getStatusBadge(asset.StatusCode ?? 'DRAFT')}</span>
        </div>

        {asset.Notes && (
          <div className="flex justify-between items-start mb-4 text-gray-800 dark:text-gray-100">
            {asset.Notes}
          </div>
        )}

        {asset.Tag && (
          <div className="flex justify-between items-start mb-4 text-gray-800 dark:text-gray-100">
            {capitalizeEachWord(asset.Tag)}
          </div>
        )}

        <div className="grid grid-cols-4 gap-4 py-4 border-t border-gray-100 dark:border-gray-700">
          {asset.BillingItems.map((item) => (
            <div
              key={item}
              className="px-4 py-2 bg-gray-50 dark:bg-gray-700 rounded-lg text-sm text-gray-800 dark:text-gray-100"
            >
              {item}
            </div>
          ))}
        </div>

        {tenantInfo && (
          <div className="grid grid-cols-1 sm:grid-cols-2 py-4 gap-4 border-t border-gray-100 dark:border-gray-700">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Name</p>
              <Link href={''} className="font-medium dark:text-white italic">
                {tenantInfo.user.Firstname} {tenantInfo.user.Lastname}
              </Link>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Phone</p>
              <div className="flex items-center gap-2">
                <Phone size={16} className="text-gray-400" />
                <p className="dark:text-gray-300">{tenantInfo.user.Phone}</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Email</p>
              <div className="flex items-center gap-2">
                <Mail size={16} className="text-gray-400" />
                <p className="dark:text-gray-300">{tenantInfo.user.Email}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

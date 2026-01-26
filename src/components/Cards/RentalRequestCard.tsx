import React from 'react'
import Image from "next/image";
import { IApplication } from '@/types/requestTypes';
import Link from 'next/link';
import { Mail, Phone } from 'lucide-react';
import { getStatusBadge } from '@/lib/utils-component';
import { useTranslations } from 'next-intl';

interface MyProps {
  data: IApplication;
}

const RentalRequestCard = ({ data }: MyProps) => {
  const t = useTranslations('Common');

  return (
    <Link 
      href={`/landlord/requests/${data.Code}`}
      className="flex flex-col rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4 shadow-sm hover:shadow-md transition-shadow duration-300 group"
    >
      {/* Avatar and Status */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-shrink-0">
          <Image
            src={data.renter.AvatarUrl.trim().length > 0 ? data.renter.AvatarUrl : "/images/user/blank-profile-picture.webp"}
            alt={`${data.renter.Firstname} ${data.renter.Lastname}`}
            className="h-16 w-16 rounded-full object-cover border-2 border-gray-200 dark:border-gray-700 group-hover:border-blue-500 transition-colors"
            width={64}
            height={64}
          />
        </div>
        <div className="flex-shrink-0">
          {getStatusBadge(data.StatusCode, t)}
        </div>
      </div>

      {/* Name */}
      <div className="mb-3">
        <h3 className="text-base font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {data.renter.Firstname} {data.renter.Lastname}
        </h3>
      </div>

      {/* Contact Info */}
      <div className="space-y-2 mb-3">
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <Mail size={14} className="shrink-0 text-gray-400 dark:text-gray-500" />
          <span className="truncate">{data.renter.Email}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <Phone size={14} className="shrink-0 text-gray-400 dark:text-gray-500" />
          <span className="truncate">{data.renter.Phone}</span>
        </div>
      </div>

      {/* Type Badge (optional - can be removed if not needed) */}
      {data.TypeCode && (
        <div className="mt-auto pt-3 border-t border-gray-200 dark:border-gray-700">
          <span className="inline-block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
            {data.TypeCode}
          </span>
        </div>
      )}
    </Link>
  )
}

export default RentalRequestCard

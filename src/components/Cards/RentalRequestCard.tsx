import React from 'react'
import Image from "next/image";
import { IApplication } from '@/types/requestTypes';
import Link from 'next/link';
import { Mail, Phone } from 'lucide-react';

interface MyProps {
  data: IApplication;
}

const RentalRequestCard = ({ data }: MyProps) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4 shadow-sm hover:shadow-md transition-shadow duration-300">
      {/* Avatar */}
      <div className="flex-shrink-0 self-center sm:self-start">
        <Image
          src={data.renter.AvatarUrl.trim().length > 0 ? data.renter.AvatarUrl : "/images/user/user-02.png"}
          alt="tenant avatar"
          className="h-16 w-16 sm:h-14 sm:w-14 rounded-full object-cover"
          width={64}
          height={64}
        />
      </div>

      {/* Infos */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Code / lien */}
        <Link 
          href={`/landlord/requests/${data.Code}`} 
          className="block text-base sm:text-sm font-semibold uppercase text-gray-800 dark:text-gray-100 hover:underline truncate"
        >
          {data.Code}
        </Link>

        {/* Email & Phone */}
        <div className="mt-2 sm:mt-1 space-y-1">
          <div className="flex items-center gap-1 text-sm italic text-gray-600 dark:text-gray-400 truncate">
            <Mail size={14} className="shrink-0" /> 
            <span className="truncate">{data.renter.Email}</span>
          </div>
          <div className="flex items-center gap-1 text-sm italic text-gray-600 dark:text-gray-400 truncate">
            <Phone size={14} className="shrink-0" /> 
            <span className="truncate">{data.renter.Phone}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RentalRequestCard
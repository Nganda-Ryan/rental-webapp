import React, { useState } from 'react';
import { MapPin, BadgeCheck, CheckCircle, AlertCircle, Lock } from 'lucide-react';
import Image from 'next/image';
import { PropertyCardProps } from '@/types/Property';
import { formatPrice } from '@/lib/utils';
import { getStatusBadge } from '@/lib/utils-component';



export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  onClick,
  className = ''
}) => {
  const [isImageLoading, setIsImageLoading] = useState(true);
  const { Address, CoverUrl, Title, Price, Currency, Code, IsActive, IsVerified, TypeCode, StatusCode } = property;

  const handleClick = () => {
    if (onClick) onClick(Code);
  };

  return (
    <div
      className={`group relative overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm hover:shadow-lg dark:border-gray-700 dark:bg-boxdark transition-all max-w-lg w-full cursor-pointer ${className}`}
      onClick={handleClick}
    >
      {/* Badge Actif/Inactif */}
      {StatusCode === 'AVAILABLE' && (
        <div className="absolute top-2 left-2 z-10 flex items-center gap-1 rounded-full bg-blue-100 text-blue-800 px-2 py-0.5 text-xs font-semibold shadow-sm dark:bg-blue-900/30 dark:text-blue-300">
          <CheckCircle size={14} /> Disponible
        </div>
      )}

      {StatusCode === 'RENTED' && (
        <div className="absolute top-2 left-2 z-10 flex items-center gap-1 rounded-full bg-yellow-100 text-yellow-800 px-2 py-0.5 text-xs font-semibold shadow-sm dark:bg-yellow-900/30 dark:text-yellow-300">
          <Lock size={14} /> Loué
        </div>
      )}

      {StatusCode === "DRAFT" && (
        <div className="absolute top-2 left-2 z-10 flex items-center gap-1 rounded-full bg-gray-200 text-gray-800 px-3 py-0.5 text-xs font-semibold shadow-sm dark:bg-gray-700 dark:text-gray-200">
          <AlertCircle size={14} /> Brouillon
        </div>
      )}

      {/* Badge Vérifié */}
      {IsVerified == 1 ? (
        <div className="absolute top-2 right-2 z-10 flex items-center gap-1 rounded-full bg-green-100 text-green-800 px-2 py-0.5 text-xs font-semibold shadow-sm dark:bg-green-900/30 dark:text-green-300">
          <BadgeCheck size={14} /> Vérifié
        </div>
      ) : null}

      {/* Image */}
      <div className="relative h-56 w-full overflow-hidden bg-gray-200 dark:bg-gray-700">
        {CoverUrl ? (
          <Image
            src={CoverUrl}
            alt={Title}
            width={800}
            height={600}
            className={`h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 ${
              isImageLoading ? 'opacity-0' : 'opacity-100'
            }`}
            onLoad={() => setIsImageLoading(false)}
            priority
          />
        ) : (
          <div className="h-full flex items-center justify-center animate-pulse">
            <div className="text-gray-400 dark:text-gray-500">Image indisponible</div>
          </div>
        )}
      </div>

      {/* Contenu */}
      <div className="py-4 px-3">
        {/* Titre */}
        <h3 className="mb-1 text-md font-semibold text-gray-900 truncate dark:text-white">
          {Title}
        </h3>

        {/* Adresse */}
        <div className="mb-2 flex items-center text-sm text-gray-500 dark:text-gray-400">
          <MapPin className="mr-1.5 h-4 w-4" strokeWidth={1.5} />
          <span className="truncate">{`${Address.City}, ${Address.Street}`}</span>
        </div>

        {/* Type */}
        <div className="mb-3 inline-block rounded-full bg-blue-100 px-3 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-200">
          {TypeCode}
        </div>

        {/* Bas de la carte */}
        <div className="flex items-center justify-between mt-2">
          <div className="font-bold text-gray-900 dark:text-white">
            {formatPrice(Price)} {Currency}
            <span className="ml-1 text-xs font-normal text-gray-500 dark:text-gray-400">/mois</span>
          </div>
          <div className="rounded-lg bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-800 dark:bg-gray-800 dark:text-gray-300 transition-colors group-hover:bg-blue-600 group-hover:text-white dark:group-hover:bg-blue-700">
            Voir détails
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;

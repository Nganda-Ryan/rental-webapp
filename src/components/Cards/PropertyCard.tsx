import React, { useState } from 'react';
import { MapPin, Bed, Bath, Coffee, Check, Clock, Bolt } from 'lucide-react';
import Image from 'next/image';
import { PropertyCardProps } from '@/types/Property';
import { AssetData } from '@/types/Property';

const statusConfig = {
  available: {
    color: 'bg-emerald-500/90 dark:bg-emerald-600/90',
    icon: Check,
    label: 'Libre'
  },
  occupied: {
    color: 'bg-blue-500/90 dark:bg-blue-600/90',
    icon: Clock,
    label: 'Occupé'
  },
  maintenance: {
    color: 'bg-amber-500/90 dark:bg-amber-600/90',
    icon: Bolt,
    label: 'Maintenance'
  }
};

const formatPrice = (price: number): string => {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
};

export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  onClick,
  className = ''
}) => {
  const [isImageLoading, setIsImageLoading] = useState(true);
  const { Address, CoverUrl, Title, Price, Currency, Code } = property;

  const handleClick = () => {
    if (onClick) onClick(Code);
  };

  return (
    <div
      className={`mx-2 group overflow-hidden rounded-md border border-gray-100 bg-white shadow-sm transition-all hover:shadow-md dark:border-gray-800 dark:bg-boxdark max-w-lg w-full cursor-pointer ${className}`}
      onClick={handleClick}
    >
        
      <div className="relative h-54 w-full overflow-hidden">
        {/* Skeleton animé */}
        {isImageLoading && (
            <div role="status" className="h-full w-full rounded-sm shadow-sm animate-pulse">
                <div className="h-full flex items-center justify-center bg-gray-300 rounded-sm dark:bg-gray-700">
                    <svg className="w-10 h-10 text-gray-200 dark:text-gray-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 20">
                        <path d="M14.066 0H7v5a2 2 0 0 1-2 2H0v11a1.97 1.97 0 0 0 1.934 2h12.132A1.97 1.97 0 0 0 16 18V2a1.97 1.97 0 0 0-1.934-2ZM10.5 6a1.5 1.5 0 1 1 0 2.999A1.5 1.5 0 0 1 10.5 6Zm2.221 10.515a1 1 0 0 1-.858.485h-8a1 1 0 0 1-.9-1.43L5.6 10.039a.978.978 0 0 1 .936-.57 1 1 0 0 1 .9.632l1.181 2.981.541-1a.945.945 0 0 1 .883-.522 1 1 0 0 1 .879.529l1.832 3.438a1 1 0 0 1-.031.988Z"/>
                        <path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.98 2.98 0 0 0 .13 5H5Z"/>
                    </svg>
                </div>
            </div>
        )}

        {/* Image */}
        {CoverUrl == "" ?
          <div className="relative h-54 w-full overflow-hidden">
            <div role="status" className="h-full w-full rounded-sm shadow-sm animate-pulse">
                <div className="h-full flex items-center justify-center bg-gray-300 rounded-sm dark:bg-gray-700">
                    <svg className="w-10 h-10 text-gray-200 dark:text-gray-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 20">
                        <path d="M14.066 0H7v5a2 2 0 0 1-2 2H0v11a1.97 1.97 0 0 0 1.934 2h12.132A1.97 1.97 0 0 0 16 18V2a1.97 1.97 0 0 0-1.934-2ZM10.5 6a1.5 1.5 0 1 1 0 2.999A1.5 1.5 0 0 1 10.5 6Zm2.221 10.515a1 1 0 0 1-.858.485h-8a1 1 0 0 1-.9-1.43L5.6 10.039a.978.978 0 0 1 .936-.57 1 1 0 0 1 .9.632l1.181 2.981.541-1a.945.945 0 0 1 .883-.522 1 1 0 0 1 .879.529l1.832 3.438a1 1 0 0 1-.031.988Z"></path>
                        <path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.98 2.98 0 0 0 .13 5H5Z"></path>
                    </svg>
                </div>
            </div>
          </div>
          :
          <Image
            src={CoverUrl}
            alt={Title}
            className={`h-full w-full object-cover transition-transform duration-500 group-hover:scale-110 ${
              isImageLoading ? 'opacity-0' : 'opacity-100'
            }`}
            width={800}
            height={600}
            onLoad={() => setIsImageLoading(false)}
            priority
          />
        }

        {/* Badge de statut */}
        {/* <div className={`absolute right-3 top-3 flex items-center gap-1 rounded-full ${statusConfig[status].color} backdrop-blur-sm px-3 py-1 text-xs font-medium text-white shadow-sm`}>
          <StatusIcon className="h-3.5 w-3.5" />
          {statusConfig[status].label}
        </div> */}
      </div>

      {/* Contenu de la card */}
      <div className="p-4">
        <h3 className="mb-1 text-lg font-semibold text-gray-900 truncate dark:text-white">{Title}</h3>
        
        <div className="mb-3 flex items-center text-sm text-gray-500 dark:text-gray-400">
          <MapPin className="mr-1.5 h-4 w-4" strokeWidth={1.5} />
          <span className="truncate">{`${Address.City}, ${Address.Street}`}</span>
        </div>



        {/* Prix */}
        <div className="flex items-center justify-between">
          <div className="text-lg font-bold text-gray-900 dark:text-white">
            {formatPrice(Price)} {Currency}
            <span className="ml-1 text-xs font-normal text-gray-500 dark:text-gray-400">/mois</span>
          </div>
          <div className="rounded-lg bg-gray-100 px-3 py-1 text-xs font-medium text-gray-800 dark:bg-gray-800 dark:text-gray-300 transition-colors group-hover:bg-blue-50 group-hover:text-blue-700 dark:group-hover:bg-blue-900/30 dark:group-hover:text-blue-400">
            Voir détails
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
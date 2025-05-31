import React from 'react';

export const PropertySkeletonCard: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div
      className={`mx-2 w-full max-w-lg overflow-hidden rounded-md border border-gray-100 bg-white shadow-sm dark:border-gray-800 dark:bg-boxdark animate-pulse ${className}`}
    >
      {/* Image Placeholder */}
      <div className="relative h-54 w-full bg-gray-300 dark:bg-gray-700" />

      {/* Contenu */}
      <div className="p-4 space-y-3">
        {/* Titre */}
        <div className="h-4 w-3/4 rounded bg-gray-300 dark:bg-gray-700" />

        {/* Adresse */}
        <div className="flex items-center space-x-2">
          <div className="h-4 w-4 bg-gray-300 dark:bg-gray-700 rounded" />
          <div className="h-4 w-1/2 rounded bg-gray-300 dark:bg-gray-700" />
        </div>

        {/* Prix + Bouton */}
        <div className="flex items-center justify-between pt-2">
          <div className="h-5 w-1/3 rounded bg-gray-300 dark:bg-gray-700" />
          <div className="h-6 w-20 rounded-lg bg-gray-200 dark:bg-gray-800" />
        </div>
      </div>
    </div>
  );
};

export default PropertySkeletonCard;

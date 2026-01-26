"use client";

import React from "react";
import Image from "next/image";
import { MapPin, DollarSign } from "lucide-react";
import { AssetData } from "@/types/Property";

interface PropertyCardProps {
  property: AssetData;
  handleSelectProperty: (property: AssetData) => void;
}

export const PropertyCard = ({
  property,
  handleSelectProperty,
}: PropertyCardProps) => {
  return (
    <div
      onClick={() => handleSelectProperty(property)}
      className="group border border-gray-200 dark:border-gray-700 rounded-lg p-3 bg-white dark:bg-gray-800 hover:shadow-sm transition-all cursor-pointer hover:border-blue-500"
    >
      <div className="flex items-center gap-4">
        <div className="flex-shrink-0 w-16 h-16">
          <Image
            height={200}
            width={200}
            src={`${property.CoverUrl}` || '#'}
            alt={property.Title}
            className="w-full h-full object-cover rounded"
          />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-base text-gray-800 dark:text-white leading-snug mb-1">
            {property.Title}
          </h3>
          <div className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
            <p className="flex items-center gap-2">
              <MapPin size={14} className="text-blue-500" />
              {property.Address.City}
            </p>
            <p className="flex items-center gap-2">
              <DollarSign size={14} className="text-green-500" />
              {property.Price} {property.Currency}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};


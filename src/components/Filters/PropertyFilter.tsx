import React from "react";
import { X } from "lucide-react";
interface PropertyFiltersProps {
  isOpen: boolean;
  onClose: () => void;
}
export const PropertyFilters = ({ isOpen, onClose }: PropertyFiltersProps) => {
  if (!isOpen) return null;
  return (
    <div className="absolute right-0 top-12 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold">Filters</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>
        {/* Price Range */}
        <div className="mb-6">
          <h4 className="text-sm font-medium mb-2">Price Range</h4>
          <div className="flex gap-4">
            <div>
              <label className="text-xs text-gray-500">Min</label>
              <input
                type="number"
                placeholder="$0"
                className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-md"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500">Max</label>
              <input
                type="number"
                placeholder="$10000"
                className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-md"
              />
            </div>
          </div>
        </div>
        {/* Property Type */}
        <div className="mb-6">
          <h4 className="text-sm font-medium mb-2">Property Type</h4>
          <div className="space-y-2">
            {["Apartment", "House", "Condo", "Townhouse"].map((type) => (
              <label key={type} className="flex items-center">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-blue-600"
                />
                <span className="ml-2 text-sm">{type}</span>
              </label>
            ))}
          </div>
        </div>
        {/* Bedrooms & Bathrooms */}
        <div className="mb-6">
          <h4 className="text-sm font-medium mb-2">Bedrooms & Bathrooms</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-500">Beds</label>
              <select className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-md">
                <option>Any</option>
                <option>1+</option>
                <option>2+</option>
                <option>3+</option>
                <option>4+</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500">Baths</label>
              <select className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-md">
                <option>Any</option>
                <option>1+</option>
                <option>2+</option>
                <option>3+</option>
              </select>
            </div>
          </div>
        </div>
        {/* Status */}
        <div className="mb-6">
          <h4 className="text-sm font-medium mb-2">Status</h4>
          <div className="flex gap-2">
            {["Occupied", "Vacant", "Maintenance"].map((status) => (
              <button
                key={status}
                className="px-3 py-1 rounded-full text-sm border border-gray-200 hover:border-blue-500 hover:text-blue-500"
              >
                {status}
              </button>
            ))}
          </div>
        </div>
        {/* Square Footage */}
        <div className="mb-6">
          <h4 className="text-sm font-medium mb-2">Square Footage</h4>
          <div className="flex gap-4">
            <div>
              <label className="text-xs text-gray-500">Min</label>
              <input
                type="number"
                placeholder="0"
                className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-md"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500">Max</label>
              <input
                type="number"
                placeholder="5000"
                className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-md"
              />
            </div>
          </div>
        </div>
        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            className="flex-1 px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200"
            onClick={onClose}
          >
            Clear All
          </button>
          <button
            className="flex-1 px-4 py-2 bg-[#2A4365] text-white rounded-lg hover:bg-blue-800"
            onClick={onClose}
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};

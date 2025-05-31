"use client"
import React from "react";
import { X, Calendar } from "lucide-react";
interface TenantFiltersProps {
  isOpen: boolean;
  onClose: () => void;
}
export const TenantFilters = ({ isOpen, onClose }: TenantFiltersProps) => {
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
        {/* Status */}
        <div className="mb-6">
          <h4 className="text-sm font-medium mb-2">Status</h4>
          <div className="space-y-2">
            {["Active", "Late Payment", "Pending Renewal"].map((status) => (
              <label key={status} className="flex items-center">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-blue-600"
                />
                <span className="ml-2 text-sm">{status}</span>
              </label>
            ))}
          </div>
        </div>
        {/* Move-in Date Range */}
        <div className="mb-6">
          <h4 className="text-sm font-medium mb-2">Move-in Date</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-500">From</label>
              <div className="relative">
                <input
                  type="date"
                  className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-md"
                />
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-500">To</label>
              <div className="relative">
                <input
                  type="date"
                  className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-md"
                />
              </div>
            </div>
          </div>
        </div>
        {/* Rent Range */}
        <div className="mb-6">
          <h4 className="text-sm font-medium mb-2">Monthly Rent</h4>
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
                placeholder="$5000"
                className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-md"
              />
            </div>
          </div>
        </div>
        {/* Unit Type */}
        <div className="mb-6">
          <h4 className="text-sm font-medium mb-2">Unit Type</h4>
          <select className="w-full px-3 py-2 border border-gray-200 rounded-md">
            <option value="">All Units</option>
            <option value="studio">Studio</option>
            <option value="1bed">1 Bedroom</option>
            <option value="2bed">2 Bedrooms</option>
            <option value="3bed">3+ Bedrooms</option>
          </select>
        </div>
        {/* Sort By */}
        <div className="mb-6">
          <h4 className="text-sm font-medium mb-2">Sort By</h4>
          <select className="w-full px-3 py-2 border border-gray-200 rounded-md">
            <option value="name">Name</option>
            <option value="moveIn">Move-in Date</option>
            <option value="rent">Rent: Low to High</option>
            <option value="rentDesc">Rent: High to Low</option>
          </select>
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

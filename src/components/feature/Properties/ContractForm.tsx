"use client"
import React, { ReactNode, useState } from "react";
import { X, Building2, Trash, Trash2 } from "lucide-react";
import { getNames, getCode } from 'country-list';
import Select from 'react-select';
import { useForm } from "react-hook-form";
import { CreatePropertyType, SubProperty } from "@/types/Property";
import Image from "next/image";
import { Dropdown } from "@/components/ui/Dropdown";

interface PropertyFormProps {
  onClose: () => void;
  onSubmit: (data: CreatePropertyType) => void;
  initialData?: any; // For edit mode
}

const countryOptions = getNames()
.map((name) => ({
  label: name,
  value: getCode(name),
}))
.filter((option) => option.value !== undefined) as { label: string; value: string }[]

const billingItemsList = [
  {label: "Eau", value: "WATER"},
  {label: "Electricité", value: "ELEC"},
  {label: "Service Internet", value: "INET01"},
  {label: "Gaze", value: "GAS"},
  {label: "Loyé mensuel", value: "RENT"},
  {label: "Ancien Service", value: "SVC-OLD"},
];


export const ContractForm = ({
  onClose,
  onSubmit,
  initialData,
}: PropertyFormProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<{ label: string; value: string } | null>(null);

  const {
    control,
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      "profilCode": "",
      "renterUserId": "",
      "assetCode": "",
      "initialDuration": 1,
      "startDate": "",
      "endDate": "",
      "notes": "",
      "billingItems": []
    },
  });

  const handleFormSubmission = (data: any) => {
    
    
  };




  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-2xl max-h-[80vh] overflow-y-auto sm:min-w-171.5">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-2xl">
        <div className="sticky top-0 bg-white dark:bg-gray-800 z-10 p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            {initialData ? "Edit Property" : "Add New Property"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>
        
        <form  onSubmit={handleSubmit(handleFormSubmission)} className="p-4 md:p-6 space-y-6">
          


          {/* Financial Details */}
          <div className="space-y-4">
            <h3 className="font-medium">Contractt Duration</h3>
            <div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Initial duration (in months)
                </label>
                <input
                  {...register("initialDuration", { required: "example : 10" })}
                  type="number"
                  id='price'
                  className="w-full px-3 py-1.5 border border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.initialDuration && (
                  <p className="text-sm text-red-500">{errors.initialDuration.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  {...register("startDate", { required: "The start date is required" })}
                  className="w-full px-3 py-1.5 h-10 border border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.startDate && (
                  <p className="text-sm text-red-500">{errors.startDate.message}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  {...register("endDate", { required: "The end date is required" })}
                  className="w-full px-3 py-1.5 h-10 border border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  readOnly
                />
                {errors.endDate && (
                  <p className="text-sm text-red-500">{errors.endDate.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Billing Items */}
          <div className="space-y-4">
            <h3 className="font-medium">Billing Items</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {billingItemsList.map((bi) => (
                <label key={bi.value} className="flex items-center space-x-2" id="rent">
                  <input
                    value={bi.value}
                    type="checkbox"
                    {...register("billingItems", { required: "Select at least one billing Item" })}
                    className="rounded border-gray-300 dark:border-gray-600 text-blue-600 dark:text-blue-400 focus:ring-blue-500"
                    defaultChecked={initialData?.amenities?.includes(bi)}
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{bi.label}</span>
                </label>
              ))}
            </div>
            {errors && (
              <p className="text-sm text-red-500 mt-5">{errors.billingItems?.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-4">
            <h3 className="font-medium">Description</h3>
            <textarea
              className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
              {...register("notes")}
              placeholder="Some notes about the contract..."
              defaultValue={initialData?.description}
              required
            />
          </div>

        </form>
      </div>
    </div>
  );
};


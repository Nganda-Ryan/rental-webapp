"use client"
import React, { useEffect, useState } from "react";
import { Calendar } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { Select } from '@/components/ui/Select'; 
import { SeachUserParams } from "@/types/user";
import { searchUser } from "@/actions/userAction";

interface TenantContractFormProps {
  onClose: () => void;
  onSubmit: (data: any) => void;
}
interface UserOption {
  label: string;
  value: string;
  role: string;
}

const billingItemsList = [
  {label: "Eau", value: "WATER"},
  {label: "Electricité", value: "ELEC"},
  {label: "Service Internet", value: "INET01"},
  {label: "Gaze", value: "GAS"},
  {label: "Loyé mensuel", value: "RENT"},
  {label: "Ancien Service", value: "SVC-OLD"},
];


export const TenantContractForm = ({
  onClose,
  onSubmit,
}: TenantContractFormProps) => {
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

  const [tenantList, setTenantList] = useState<UserOption []>([
    { label: "Fred", value: "#003", role: "RENTER" },
    { label: "Emma", value: "#004", role: "RENTER" },
    { label: "John", value: "#005", role: "RENTER" },
  ]);
  
  const [searchTerm, setChearchTerm] = useState("");
  const [selectedTenant, setSelectedTenant] = useState<{ label: string; value: string } | null>(null);

  const startDate = watch("startDate");
  const today = new Date().toISOString().split("T")[0]; // format YYYY-MM-DD
  const [isLoading, setIsLoading] = useState(false);
  
  
  useEffect(() => {
    console.log(1)
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const params: SeachUserParams = {
          orderBy: 'U.Email',
          orderMode: 'desc',
          limit: 1000,
          offset: 0,
        };
        const result = await searchUser(params);
        console.log('API result:', result);
        if (result.data && result.data.body.items.length > 0) {
          const datas = result.data.body.items.map((item: any) => {
            return {
              label: item.user.Email,
              value: item.UserCode,
              role: item.RoleCode,
            };
          }).filter((item: any) => {
            return item.role.toUpperCase().includes("RENTER");
          }).sort((a:any, b:any) => a.label.localeCompare(b.label));
          console.log('-->datas', datas);
          setTenantList(datas);
        }
      } catch (error) {
        console.log('-->error', error)
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);
  




  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-2xl max-h-[80vh] overflow-y-auto sm:min-w-171.5">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-2xl">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold dark:text-white">
            Create Tenant Contract
          </h2>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          <div>
            <div className="flex flex-col">
              <label className="mb-1 text-sm text-gray-700 dark:text-gray-300">Tenant</label>
              
              <Controller
                name="renterUserId"
                control={control}
                rules={{ required: "please select a tenant" }}
                render={({ field, fieldState: { error } }) => (
                  <>
                    <Select
                      options={tenantList}
                      value={tenantList.find(option => option.value === field.value) ?? null}
                      onChange={(selectedOption) => {
                        field.onChange(selectedOption?.value);
                        setChearchTerm(selectedOption?.value || "");
                        setSelectedTenant(selectedOption || null);
                      }}
                      placeholder="Select a tenant"
                    />
                    {error && (
                      <p className="mt-1 text-sm text-red-500">{error.message}</p>
                    )}
                  </>
                )}
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Contract Start Date
            </label>
            <div className="relative">
              <Calendar
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="date"
                className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                {...register("startDate", {
                  required: "The start date is required",
                  validate: (value) =>
                    value >= today || "Start date cannot be in the past",
                })}
                min={today}
              />
              {errors.startDate && (
                <p className="text-sm text-red-500">{errors.startDate.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Contract End Date
            </label>
            <div className="relative">
              <Calendar
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="date"
                className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                {...register("endDate", {
                  required: "The end date is required",
                  validate: (value) =>
                    !startDate || value >= startDate || "End date cannot be before start date",
                })}
                min={startDate || today}
              />
              {errors.endDate && (
                <p className="text-sm text-red-500">{errors.endDate.message}</p>
              )}
            </div>
          </div>

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
                    defaultChecked={bi.value === "RENT" ? true : false} // Default to checked for rent
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{bi.label}</span>
                </label>
              ))}
            </div>
            {errors && (
              <p className="text-sm text-red-500 mt-5">{errors.billingItems?.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description
            </label>
            <textarea
              className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
              {...register("notes")}
              placeholder="Some notes about the contract..."
            />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Create Contract
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

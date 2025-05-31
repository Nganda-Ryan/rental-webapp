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
  tenant: {
    name: string;
    email: string;
    phone: string;
  };
}
interface UserOption {
  label: string;
  value: string;
  role: string;
}

export const TenantContractForm = ({
  onClose,
  onSubmit,
  tenant={
    name: "",
    email: "",
    phone: "",
  },
}: TenantContractFormProps) => {
  const [startDate, setStartDate] = useState("");
  const [description, setDescription] = useState("");
  const [paymentDay, setPaymentDay] = useState("1");
  const [tenantList, setTenantList] = useState<UserOption []>([
    { label: "Fred", value: "#003", role: "RENTER" },
    { label: "Emma", value: "#004", role: "RENTER" },
    { label: "John", value: "#005", role: "RENTER" },
  ]);
  const [offSet, setOffSet] = useState(0);
  const [searchTerm, setChearchTerm] = useState("");
  const [selectedTenant, setSelectedTenant] = useState<{ label: string; value: string } | null>(null);
  const [utilities, setUtilities] = useState({
    energy: false,
    water: false,
    wifi: false,
    parking: false,
    maintenance: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  
  // useEffect(() => {
  //   const fetchData = async () => {
  //     if(searchTerm.trim() != ""){
  //     console.log(2)
  //       try {
  //         setIsLoading(true);
  //         const params: SeachUserParams = {
  //           orderBy: 'U.Email',
  //           orderMode: 'desc',
  //           limit: 1000,
  //           offset: offSet,
  //           term: searchTerm,
  //         };
  //         const result = await searchUser(params);
  //         console.log('API result:', result);
  //         if (result.data && result.data.body.items.length > 0) {
  //           const datas = result.data.body.items.map((item: any) => {
  //             return {
  //               label: item.user.Email,
  //               value: item.Code,
  //               role: item.RoleCode,
  //             };
  //           }).filter((item: any) => {
  //             return item.role.toUpperCase().includes("RENTER");
  //           }).sort((a:any, b:any) => a.label.localeCompare(b.label));
  //           console.log('-->datas', datas);
  //           setTenantList(datas);
  //         }
  //       } catch (error) {
  //         console.log('-->error', error)
  //       } finally {
  //         setIsLoading(false);
  //       }
  //     }
  //   };

  //   fetchData();
  // }, [searchTerm]);

  useEffect(() => {
    console.log(1)
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const params: SeachUserParams = {
          orderBy: 'U.Email',
          orderMode: 'desc',
          limit: 1000,
          offset: offSet,
        };
        const result = await searchUser(params);
        console.log('API result:', result);
        if (result.data && result.data.body.items.length > 0) {
          const datas = result.data.body.items.map((item: any) => {
            return {
              label: item.user.Email,
              value: item.Code,
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

  
  const handleContractCreation = (data: any) => {
    console.log(data);
  };


  const handleFindTenant = (email: string) => {
    setTenantList([
      { label: "Ryan", value: "#001", role: "RENTER" },
      { label: "Erwin", value: "#002", role: "RENTER" },
    ])
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-2xl max-h-[80vh] overflow-y-auto sm:min-w-171.5">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-2xl">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold dark:text-white">
            Create Tenant Contract
          </h2>
        </div>
        <form onSubmit={handleSubmit(handleContractCreation)} className="p-6 space-y-6">
          <div>
            <div className="flex flex-col">
              <label className="mb-1 text-sm text-gray-700 dark:text-gray-300">Tenant</label>
              <Controller
                name="renterUserId"
                control={control}
                render={({ field }) => (
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
                required
                className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Payment Day
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={paymentDay}
              onChange={(e) => setPaymentDay(e.target.value)}
            >
              {Array.from(
                {
                  length: 28,
                },
                (_, i) => i + 1,
              ).map((day) => (
                <option key={day} value={day}>
                  {day}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Utilities Included
            </label>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(utilities).map(([key, value]) => (
                <label key={key} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={() =>
                      setUtilities((prev) => ({
                        ...prev,
                        [key as keyof typeof utilities]: !prev[key as keyof typeof utilities],
                      }))
                    }
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">
                    {key}
                  </span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description
            </label>
            <textarea
              className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Additional contract details..."
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

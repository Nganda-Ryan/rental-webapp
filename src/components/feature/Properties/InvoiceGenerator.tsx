"use client"

import React, { useEffect, useState } from 'react'
import { Calendar, X } from 'lucide-react'
import { IInvoiceForm } from '@/types/Property';
import Button from "@/components/ui/Button";
import { useWatch, useFieldArray, useForm } from "react-hook-form";

interface InvoiceGeneratorProps {
  onClose: () => void
  onCreate: (data: IInvoiceForm) => void
  action: "CREATE" | "UPDATE"
  defaultValue: IInvoiceForm | undefined
}

export const InvoiceGenerator = ({
  onClose,
  onCreate,
  defaultValue,
  action
}: InvoiceGeneratorProps) => {
  const [loading, setLoading] = useState(false);
  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<IInvoiceForm>({
    defaultValues: {
      id: defaultValue?.id,
      tenant: defaultValue?.tenant,
      startDate: defaultValue?.startDate,
      endDate: defaultValue?.endDate,
      currency: defaultValue?.currency,
      monthlyRent: defaultValue?.monthlyRent,
      status: "",
      billingElements: defaultValue?.billingElements ?? [],
      notes: action == "UPDATE" ? defaultValue?.notes : "",
    },
  });
  const startDate = useWatch({ name: "startDate", control });
  const endDate = useWatch({ name: "endDate", control });
  const { fields } = useFieldArray({
    control,
    name: "billingElements"
  });
  const getMinEndDate = () => {
    if (!startDate) return "";
    const date = new Date(startDate);
    date.setDate(date.getDate() + 1);
    return date.toISOString().split("T")[0];
  };

  useEffect(() => {
    if (startDate && endDate && new Date(startDate) >= new Date(endDate)) {
      setValue("endDate", ""); // Réinitialise Period End
    }
  }, [startDate, endDate, setValue, defaultValue]);
  
  const canNotGenerateInvoice = () => {
    if(loading){
      return true;
    }
    if(action == 'UPDATE'){
      return defaultValue?.billingElements.every(item => item.status == true) ? true : false;
    }
    return false
  }

  
  const handleSubmit2 = (data: IInvoiceForm) => {
    setLoading(true);
    onCreate(data)
  }
  
  return (
    <div className="rounded-lg w-full max-h-[75vh] overflow-y-auto max-w-3xl mx-auto bg-white dark:bg-gray-800">
      <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-4 z-10">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg sm:text-xl font-semibold dark:text-white">
              
              {
                action == "CREATE" ? "Generate Invoice" : "Update Invoice"
              }
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {
                action == "CREATE" ? `Create a new invoice for ${defaultValue?.tenant}` : `Update an invoice for ${defaultValue?.tenant}`
              }
              
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            aria-label="Close"
          >
            <X size={20} className="text-gray-500 dark:text-gray-400" />
          </button>
        </div>
      </div>
      
      <form onSubmit={handleSubmit(handleSubmit2)} className="p-4 space-y-6">
        <div className="grid gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Tenant
            </label>
            <input
              type="text"
              {...register("tenant")}
              readOnly
              disabled
              className="w-full px-3 py-2 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg dark:text-white"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Period Start
              </label>
              <div className="relative">
                <Calendar
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="date"
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                  {...register("startDate", { required: "The start date is required" })}
                  disabled={action == "UPDATE"}
                  readOnly={action == "UPDATE"}
                  min={defaultValue?.startDate}
                />
              </div>
              {errors.startDate && (
                <p className="text-sm text-red-500">{errors.startDate.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Period End
              </label>
              <div className="relative">
                <Calendar
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="date"
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                  {...register("endDate", { required: "The end date is required" })}
                  min={getMinEndDate()}
                  disabled={action == "UPDATE"}
                  readOnly={action == "UPDATE"}
                />
              </div>
              {errors.endDate && (
                <p className="text-sm text-red-500">{errors.endDate.message}</p>
              )}
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <h3 className="font-medium text-lg border-b border-gray-200 dark:border-gray-700 pb-2 dark:text-white">
            Billing Elements
          </h3>
          <div className="space-y-3">
            {
              fields.map((item, index) => (
                <BillingElementField
                  key={item.id}
                  index={index}
                  item={item}
                  register={register}
                  errors={errors}
                  defaultValue={defaultValue}
                  control={control}
                  action={action}
                />
              ))
            }
          </div>
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
        
        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg w-full sm:w-auto"
          >
            Cancel
          </button>
          <Button variant='neutral' disable={canNotGenerateInvoice()} isSubmitBtn={true} fullWidth={false} loading={loading}>
            {
              action == "CREATE" ? "Generate Invoice" : "Update Invoice"
            }
          </Button>
        </div>
      </form>
    </div>
  )
}




const BillingElementField = ({ index, item, register, errors, defaultValue, control, action }: { index: number, item: any, register: any, errors: any, defaultValue: any, control: any, action: "CREATE" | "UPDATE" }) => {
  const status = useWatch({ name: `billingElements.${index}.status`, control });
  const isChecked = status === true;
  // console.log('Checkable ?', action == 'UPDATE' && defaultValue.status == true)
  console.log('-->BillingElementField', item)
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-x">
      {/* Checkbox + Label + Paid */}
      <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0 mr-8">
        <input
          type="checkbox"
          disabled={action == 'UPDATE' && item.status == true}
          readOnly={action == 'UPDATE' && item.status == true}
          className="rounded border-gray-300 dark:border-gray-600"
          {...register(`billingElements.${index}.status`)}
        />
        <p className="font-medium dark:text-white">{item.label}</p>
        <span
          className={`px-2 py-1 text-xs rounded-full 
            ${isChecked 
              ? "bg-green-100 text-green-800 dark:bg-green-200 dark:text-green-900" 
              : "bg-red-100 text-red-800 dark:bg-red-200 dark:text-red-900"
            }`}
        >
          {isChecked ? "Paid" : "Unpaid"}
        </span>
      </div>

      {/* Montant + Date */}
      <div className="flex flex-col sm:flex-row gap-4 sm:items-center w-full sm:w-auto flex-1">
        {/* Montant */}
        <div className="relative w-full sm:w-32 flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-300">
            {defaultValue?.currency}
          </span>
          <input
            type="number"
            min="0"
            step="0.01"
            placeholder="0.00"
            disabled={action == "UPDATE"}
            readOnly={action == "UPDATE"}
            className={`w-full pl-14 pr-4 py-2 border rounded-lg dark:text-white "bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 ${errors.billingElements?.[index]?.amount ? "border-red-500" : ""}
              ${action == "UPDATE" ? "dark:text-white bg-gray-200 dark:bg-gray-600 cursor-not-allowed border-gray-200 dark:border-gray-600" : ""}  
            `}
            {...register(`billingElements.${index}.amount`, {
              required: isChecked ? "Please enter the paid amount" : false,
            })}
          />
        </div>

        {/* Date */}
        {
          isChecked 
          &&
          <input
            type="date"
            max={today}
            // min={defaultValue?.startDate}
            disabled={action == "UPDATE" && item.status == true}
            readOnly={action == "UPDATE" && item.status == true}
            className={`w-full sm:w-44 px-4 py-2 border rounded-lg ${errors.billingElements?.[index]?.paidDate ? "border-red-500" : ""} ${item.status == true ? "dark:text-white bg-gray-200 dark:bg-gray-600 cursor-not-allowed border-gray-200 dark:border-gray-600" : ""}`}
            {...register(`billingElements.${index}.paidDate`, {
              required: isChecked ? "Please enter the paid date" : false,
            })}
          />
        }
      </div>
    </div>
  );
};



export default InvoiceGenerator
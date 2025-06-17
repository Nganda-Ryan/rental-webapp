"use client"
import React, { useState } from 'react'
import {
  X,
  Shield,
  Mail,
  Key,
  Eye,
  EyeOff,
  AlertCircle,
  Phone,
} from 'lucide-react'
import PhoneInput from 'react-phone-input-2';
import { getNames, getCode } from 'country-list';
import { Controller, useForm } from 'react-hook-form';
import Button from '@/components/ui/Button';
import { MANAGER_PROFILE_OBJ_LIST } from '@/constant';
import { FormValues, ManagerRole } from '@/types/user';
interface NewSupportUserFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: FormValues) => void
}


const countryOptions = getNames()
.map((name) => ({
  label: name,
  value: getCode(name),
}))
.filter((option) => option.value !== undefined) as { label: string; value: string }[]



export const NewSupportUserForm = ({
  isOpen,
  onClose,
  onSubmit,
}: NewSupportUserFormProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<ManagerRole>('SUPPORT');
  const [isCreatingUser, setIsCreatingUser] = useState(false);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      country: "",
    },
  });

  const processSubmission = (data: FormValues) => {
    setIsCreatingUser(true);
    onSubmit({...data, role: selectedRole});
  };
  if (!isOpen) return null
  return (
    <div className="rounded-lg w-full max-h-[75vh] sm:max-h-[85vh] overflow-y-auto max-w-xl mx-auto bg-white dark:bg-gray-800">
      <div className="sticky top-0 z-50 bg-white dark:bg-gray-800 border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Add Support Team Member</h2>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X size={20} />
        </button>
      </div>
      <form onSubmit={handleSubmit(processSubmission)} className="p-6 space-y-6">
        {/* Role Selection */}
        <div className="space-y-4">
          <h3 className="font-medium flex items-center gap-2">
            <Shield size={20} className="text-gray-400" />
            Role Assignment
          </h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {MANAGER_PROFILE_OBJ_LIST.map((role) => (
              <button
                key={role.value}
                type="button"
                onClick={() => setSelectedRole(role.value as ManagerRole)}
                className={`p-2 rounded-lg border text-left transition-colors
                  ${
                    selectedRole === role.value
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                      : "border-gray-200 hover:border-blue-500 dark:border-gray-700 dark:hover:border-blue-400"
                  }`}
              >
                <div className="font-medium capitalize text-gray-900 dark:text-gray-100">
                  {role.label}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {role.value === "ADMIN"
                    ? "Full system access"
                    : "Basic support access"}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* User Information */}
        <div className="space-y-4">
          <h3 className="font-medium">User Information</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">First Name</label>
              <input
                type="text"
                {...register("firstName", { required: "The first name is required" })}
                className="input-base"
              />
              {errors.firstName && (
                <p className="text-sm text-red-500">{errors.firstName.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">Last Name</label>
              <input
                type="text"
                {...register("lastName", { required: "The last name is required" })}
                className="input-base"
              />
              {errors.lastName && (
                <p className="text-sm text-red-500">{errors.lastName.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">Email</label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  {...register("email", {
                    required: "The email is required", pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Invalid email address",
                    }
                  })}
                  className="pl-10 pr-3 input-base"
                />
              </div>
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">Primary Phone</label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <Controller
                  name="phone"
                  control={control}
                  rules={{ required: "The phone is required",
                    validate: (value) => {
                      const digitsOnly = value.replace(/\D/g, '');
                      return digitsOnly.length > 5 || "Please enter a valid phone number"; 
                    }
                   }}
                  render={({ field }) => (
                    <PhoneInput
                      country={"cm"}
                      inputClass="pl-10 input-base"
                      inputStyle={{ width: "100%" }}
                      specialLabel=""
                      enableSearch
                      {...field}
                    />
                  )}
                />
              </div>
              {errors.phone && (
                <p className="text-sm text-red-500">{errors.phone.message}</p>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">Gender</label>
              <select
                {...register("gender", { required: "Please select a gender" })}
                className="input-base"
              >
                <option value="">Select gender</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
              </select>
              {errors.gender && (
                <p className="text-sm text-red-500">{errors.gender.message}</p>
              )}
            </div>
          </div>          
        </div>
        
        {/* Location */}
        <div className="space-y-4">
          <h3 className="font-medium">Location Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-400">Country</label>
              <select
                {...register("country", { required: "Please select a country" })}
                className="input-base"
              >
                <option value="">Select the country</option>
                {
                  countryOptions.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))
                }
              </select>
              {errors.country && (
                <p className="text-sm text-red-500">{errors.country.message}</p>
              )}
            </div>
          
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">City</label>
              <input
                type="text"
                {...register("city", { required: "Please select the city" })}
                className="mt-1 input-base"
              />
              {errors.city && (
                <p className="text-sm text-red-500">{errors.city.message}</p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">Street</label>
              <input
                type="text"
                {...register("street", { required: "Please select the street" })}
                className="input-base"
              />
              {errors.street && (
                <p className="text-sm text-red-500">{errors.street.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Initial Password */}
        <div className="space-y-4">
          <h3 className="font-medium">Security</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-400">
              Initial Password
            </label>
            <div className="relative">
              <Key
                size={16}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              <input
                type={showPassword ? "text" : "password"}
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters",
                  },
                })}
                className="pl-10 pr-12 input-base"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                <AlertCircle size={14} />
                {errors.password.message}
              </p>
            )}
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 dark:hover:text-gray-600 rounded dark:text-gray-400"
          >
            Cancel
          </button>
          
          <Button variant='neutral' disable={isCreatingUser} isSubmitBtn={true} fullWidth={false} loading={isCreatingUser}>
            {isCreatingUser === true ? 'Creating User...' : 'Create Account'}
          </Button>
        </div>
      </form>
    </div>
  )
}
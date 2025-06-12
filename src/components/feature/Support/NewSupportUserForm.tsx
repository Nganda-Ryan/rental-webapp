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
  Check,
} from 'lucide-react'
import PhoneInput from 'react-phone-input-2';
import { getNames, getCode } from 'country-list';
import Select from 'react-select';
interface NewSupportUserFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: any) => void
}
interface Permission {
  id: string
  name: string
  description: string
  roles: string[]
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
  const [showPassword, setShowPassword] = useState(false)
  const [selectedRole, setSelectedRole] = useState('support')
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([])
  const [selectedCountry, setSelectedCountry] = useState<{ label: string; value: string } | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
  })
  const permissions: Permission[] = [
    {
      id: 'user_management',
      name: 'User Management',
      description: 'Can manage user accounts and access',
      roles: ['admin'],
    },
    {
      id: 'property_verification',
      name: 'Property Verification',
      description: 'Can verify and approve property listings',
      roles: ['admin', 'moderator'],
    },
    {
      id: 'lessor_verification',
      name: 'Lessor Verification',
      description: 'Can verify and approve lessor accounts',
      roles: ['admin', 'moderator'],
    },
    {
      id: 'support_management',
      name: 'Support Team Management',
      description: 'Can manage support team members',
      roles: ['admin'],
    },
    {
      id: 'basic_support',
      name: 'Basic Support',
      description: 'Can handle basic support tickets and inquiries',
      roles: ['support', 'moderator', 'admin'],
    },
    {
      id: 'system_settings',
      name: 'System Settings',
      description: 'Can modify system configurations',
      roles: ['admin'],
    },
  ]
  const handleRoleChange = (role: string) => {
    setSelectedRole(role)
    // Auto-select role-based permissions
    const defaultPermissions = permissions
      .filter((p) => p.roles.includes(role))
      .map((p) => p.id)
    setSelectedPermissions(defaultPermissions)
  }
  const handlePermissionToggle = (permissionId: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(permissionId)
        ? prev.filter((id) => id !== permissionId)
        : [...prev, permissionId],
    )
  }
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      ...formData,
      role: selectedRole,
      permissions: selectedPermissions,
    })
  }
  if (!isOpen) return null
  return (
    <div className="rounded-lg w-full max-h-[75vh] sm:max-h-[85vh] overflow-y-auto max-w-xl mx-auto bg-white dark:bg-gray-800">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Add Support Team Member</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Role Selection */}
          <div className="space-y-4">
            <h3 className="font-medium flex items-center gap-2">
              <Shield size={20} className="text-gray-400" />
              Role Assignment
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {['admin', 'support'].map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => handleRoleChange(role)}
                  className={`p-2 rounded-lg border text-left transition-colors
                    ${selectedRole === role ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-500'}`}
                >
                  <div className="font-medium capitalize">{role}</div>
                  <div className="text-sm text-gray-500">
                    {role === 'admin' ? 'Full system access' : 'Basic support access' }
                  </div>
                </button>
              ))}
            </div>
          </div>
          {/* User Information */}
          <div className="space-y-4">
            <h3 className="font-medium">User Information</h3>
            
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">First Name</label>
                <input
                  type="text"
                  required
                  name="firstName"
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                />
                {/* {formError.firstname && <p className="text-red-500">{formError.firstname}</p>} */}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Last Name</label>
                <input
                  type="text"
                  required
                  name="lastName"
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                />
                {/* {formError.lastname && <p className="text-red-500">{formError.lastname}</p>} */}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                required
                name="password"
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              />
              {/* {formError.password && <p className="text-red-500">{formError.password}</p>} */}
            </div>
            

            <div>
              <label className="block text-sm font-medium text-gray-700">Gender</label>
              <select
                name="gender"
                required
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="">Select gender</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
              </select>
              {/* {formError.gender && <p className="text-red-500">{formError.gender}</p>} */}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  name="email"
                  required
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md"
                />
                {/* {formError.email && <p className="text-red-500">{formError.email}</p>} */}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Primary Phone</label>
              <div className="mt-1 relative">
                <PhoneInput
                  country={'cm'}
                  inputClass="w-full pl-10 !py-2 !text-sm"
                  inputStyle={{ width: '100%' }}
                  specialLabel=""
                  enableSearch
                />
                {/* {formError.phone && <p className="text-red-500">{formError.phone}</p>} */}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Country</label>
              <Select
                options={countryOptions}
                instanceId="country-select"
                placeholder="Select country"
                value={selectedCountry}
                onChange={(option) => setSelectedCountry(option)}
              />
              {/* {formError.country && <p className="text-red-500">{formError.country}</p>} */}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">City</label>
              <input
                type="text"
                required
                name="city"
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              />
              {/* {formError.city && <p className="text-red-500">{formError.city}</p>} */}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Street</label>
              <input
                type="text"
                required
                name="street"
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              />
              {/* {formError.street && <p className="text-red-500">{formError.street}</p>} */}
            </div>            
          </div>
          
          {/* Initial Password */}
          <div className="space-y-4">
            <h3 className="font-medium">Security</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Initial Password
              </label>
              <div className="relative">
                <Key
                  size={16}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={8}
                  className="w-full pl-10 pr-12 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      password: e.target.value,
                    })
                  }
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <p className="mt-2 text-sm text-gray-500 flex items-center gap-1">
                <AlertCircle size={14} />
                User will be prompted to change password on first login
              </p>
            </div>
          </div>
          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#2A4365] text-white rounded-lg hover:bg-blue-800 flex items-center gap-2"
            >
              <Check size={16} />
              Create Account
            </button>
          </div>
        </form>
    </div>
  )
}
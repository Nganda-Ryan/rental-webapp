"use client"
import React, { useState } from 'react'
import {
  X,
  Shield,
  Mail,
  Phone,
  Key,
  Eye,
  EyeOff,
  AlertCircle,
  Check,
} from 'lucide-react'
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
export const NewSupportUserForm = ({
  isOpen,
  onClose,
  onSubmit,
}: NewSupportUserFormProps) => {
  const [showPassword, setShowPassword] = useState(false)
  const [selectedRole, setSelectedRole] = useState('support')
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([])
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
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
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
            <div className="grid grid-cols-3 gap-4">
              {['admin', 'moderator', 'support'].map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => handleRoleChange(role)}
                  className={`p-4 rounded-lg border text-left transition-colors
                    ${selectedRole === role ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-500'}`}
                >
                  <div className="font-medium capitalize">{role}</div>
                  <div className="text-sm text-gray-500">
                    {role === 'admin'
                      ? 'Full system access'
                      : role === 'moderator'
                        ? 'Verification & support'
                        : 'Basic support access'}
                  </div>
                </button>
              ))}
            </div>
          </div>
          {/* User Information */}
          <div className="space-y-4">
            <h3 className="font-medium">User Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      name: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone
                    size={16}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="tel"
                    required
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        phone: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail
                    size={16}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="email"
                    required
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        email: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            </div>
          </div>
          {/* Permissions */}
          <div className="space-y-4">
            <h3 className="font-medium">Permissions</h3>
            <div className="space-y-3">
              {permissions.map((permission) => (
                <div
                  key={permission.id}
                  className={`p-4 border rounded-lg transition-colors
                    ${selectedPermissions.includes(permission.id) ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}
                    ${permission.roles.includes(selectedRole) ? 'opacity-100' : 'opacity-50'}
                  `}
                >
                  <label className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={selectedPermissions.includes(permission.id)}
                      onChange={() => handlePermissionToggle(permission.id)}
                      disabled={!permission.roles.includes(selectedRole)}
                      className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <div>
                      <div className="font-medium">{permission.name}</div>
                      <div className="text-sm text-gray-500">
                        {permission.description}
                      </div>
                    </div>
                  </label>
                </div>
              ))}
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
    </div>
  )
}
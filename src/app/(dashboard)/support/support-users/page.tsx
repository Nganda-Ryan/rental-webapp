"use client"
import React, { useState } from 'react'
import {
  Search,
  Shield,
  Mail,
  Phone,
  UserPlus,
  Key,
  UserX,
  UserCheck,
  AlertTriangle,
} from 'lucide-react'
import { NewSupportUserForm } from '@/components/feature/Support/NewSupportUserForm' 
import DefaultLayout from '@/components/Layouts/DefaultLayout'
import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb'
interface SupportUser {
  id: string
  name: string
  email: string
  phone: string
  role: 'admin' | 'moderator' | 'support'
  status: 'active' | 'inactive'
  permissions: string[]
  lastActive: string
}
const SupportUsers = () => {
  const [showNewUserForm, setShowNewUserForm] = useState(false)
  const handleNewUserSubmit = (data: any) => {
    console.log('New support user data:', data)
    // Handle form submission here
    setShowNewUserForm(false)
  }
  const [selectedRole, setSelectedRole] = useState<
    'all' | 'admin' | 'moderator' | 'support'
  >('all')
  const users: SupportUser[] = [
    {
      id: 'SUP001',
      name: 'Emma Davis',
      email: 'emma.d@support.rentila.com',
      phone: '(555) 123-4567',
      role: 'admin',
      status: 'active',
      permissions: [
        'User Management',
        'Property Verification',
        'Lessor Verification',
        'System Settings',
      ],
      lastActive: '2023-07-01 14:30',
    },
    {
      id: 'SUP002',
      name: 'Michael Wilson',
      email: 'michael.w@support.rentila.com',
      phone: '(555) 234-5678',
      role: 'support',
      status: 'active',
      permissions: ['Property Verification', 'Lessor Verification'],
      lastActive: '2023-07-01 12:15',
    },
    {
      id: 'SUP003',
      name: 'Sophie Brown',
      email: 'sophie.b@support.rentila.com',
      phone: '(555) 345-6789',
      role: 'support',
      status: 'inactive',
      permissions: ['Basic Support'],
      lastActive: '2023-06-30 16:45',
    },
  ]
  const getRoleBadge = (role: 'admin' | 'moderator' | 'support') => {
    const colors = {
      admin: 'bg-purple-100 text-purple-800',
      moderator: 'bg-blue-100 text-blue-800',
      support: 'bg-green-100 text-green-800',
    }
    return colors[role]
  }
  const filteredUsers = users.filter(
    (user) => selectedRole === 'all' || user.role === selectedRole,
  )
  return (
    <DefaultLayout>
      <Breadcrumb previousPage={false} pageName="Support User" />
      <div className="w-full">
        <div className="flex justify-end items-center mb-6">
          <button
            onClick={() => setShowNewUserForm(true)}
            className="bg-[#2A4365] text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <UserPlus size={20} />
            Add Support User
          </button>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search users..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            className="px-4 py-2 border border-gray-200 rounded-lg"
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value as any)}
          >
            <option value="all">All Roles</option>
            <option value="admin">Admins</option>
            <option value="moderator">Moderators</option>
            <option value="support">Support Staff</option>
          </select>
        </div>
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Permissions
                </th> */}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Active
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{user.name}</div>
                    <div className="text-sm text-gray-500">ID: {user.id}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm space-y-1">
                      <div className="flex items-center gap-1 text-gray-500">
                        <Mail size={14} />
                        {user.email}
                      </div>
                      <div className="flex items-center gap-1 text-gray-500">
                        <Phone size={14} />
                        {user.phone}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${getRoleBadge(user.role)}`}
                    >
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </span>
                  </td>
                  {/* <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {user.permissions.map((permission, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full"
                        >
                          {permission}
                        </span>
                      ))}
                    </div>
                  </td> */}
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {user.lastActive}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button className="text-blue-600 hover:text-blue-800">
                        <Key size={16} />
                      </button>
                      {user.status === 'active' ? (
                        <button className="text-red-600 hover:text-red-800">
                          <UserX size={16} />
                        </button>
                      ) : (
                        <button className="text-green-600 hover:text-green-800">
                          <UserCheck size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Warning Banner for Inactive Users */}
        {users.some((user) => user.status === 'inactive') && (
          <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center gap-3">
            <AlertTriangle className="text-yellow-500" size={20} />
            <p className="text-sm text-yellow-700">
              There are inactive support team members. Please review their access
              status.
            </p>
          </div>
        )}
        <NewSupportUserForm
          isOpen={showNewUserForm}
          onClose={() => setShowNewUserForm(false)}
          onSubmit={handleNewUserSubmit}
        />
      </div>
    </DefaultLayout>
  )
}

export default SupportUsers;

"use client"
import React, { useState } from 'react'
import { Search, Mail, Phone, UserX, UserCheck } from 'lucide-react'
import { ResponsiveTable } from '@/components/feature/Support/ResponsiveTable' 
import { UserDetailView } from '@/components/feature/Support/UserDetailView' 
import { RejectionModal } from '@/components/feature/Support/RejectionModal' 
import DefaultLayout from '@/components/Layouts/DefaultLayout'
import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb'
type UserRole = 'lessor' | 'tenant' | 'manager' | 'support'
type UserStatus = 'active' | 'pending' | 'inactive'
import { useRouter } from 'next/navigation'

interface User {
  id: string
  name: string
  email: string
  phone: string
  role: UserRole
  status: UserStatus
  joinDate: string
  verifiedDate?: string
}
const AccountManagement = () => {
  const [selectedRole, setSelectedRole] = useState<UserRole | 'all'>('all')
  const [selectedStatus, setSelectedStatus] = useState<UserStatus | 'all'>('all',)
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  const [showRejectionModal, setShowRejectionModal] = useState(false)
  const [selectedUserForAction, setSelectedUserForAction] = useState<string | null>(null)
  const router = useRouter();

  const users: User[] = [
    {
      id: 'USR001',
      name: 'John Smith',
      email: 'john.smith@example.com',
      phone: '(555) 123-4567',
      role: 'lessor',
      status: 'active',
      joinDate: '2023-01-15',
      verifiedDate: '2023-01-20',
    },
    {
      id: 'USR002',
      name: 'Sarah Johnson',
      email: 'sarah.j@example.com',
      phone: '(555) 234-5678',
      role: 'tenant',
      status: 'active',
      joinDate: '2023-02-01',
    },
    {
      id: 'USR003',
      name: 'Mike Wilson',
      email: 'mike.w@example.com',
      phone: '(555) 345-6789',
      role: 'lessor',
      status: 'pending',
      joinDate: '2023-07-01',
    },
    {
      id: 'USR004',
      name: 'Emma Davis',
      email: 'emma.d@example.com',
      phone: '(555) 456-7890',
      role: 'support',
      status: 'active',
      joinDate: '2023-03-15',
      verifiedDate: '2023-03-15',
    },
  ]
  const getRoleBadge = (role: UserRole) => {
    const colors = {
      lessor: 'bg-blue-100 text-blue-800',
      tenant: 'bg-purple-100 text-purple-800',
      manager: 'bg-orange-100 text-orange-800',
      support: 'bg-gray-100 text-gray-800',
    }
    return colors[role]
  }
  const getStatusBadge = (status: UserStatus) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      inactive: 'bg-red-100 text-red-800',
    }
    return colors[status]
  }
  const columns = [
    {
      key: 'name',
      label: 'User',
      priority: 'high' as const,
      render: (value: string, row: User) => (
        <div>
          <div className="font-medium text-gray-900">{value}</div>
          <div className="text-sm text-gray-500">ID: {row.id}</div>
        </div>
      ),
    },
    {
      key: 'contact',
      label: 'Contact',
      priority: 'medium' as const,
      render: (_: any, row: User) => (
        <div className="space-y-1">
          <div className="flex items-center gap-1 text-gray-500">
            <Mail size={14} />
            {row.email}
          </div>
          <div className="flex items-center gap-1 text-gray-500">
            <Phone size={14} />
            {row.phone}
          </div>
        </div>
      ),
    },
    {
      key: 'role',
      label: 'Role',
      priority: 'high' as const,
      render: (value: UserRole) => (
        <span className={`px-2 py-1 text-xs rounded-full ${getRoleBadge(value)}`}>
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      priority: 'medium' as const,
      render: (value: UserStatus) => (
        <span
          className={`px-2 py-1 text-xs rounded-full ${getStatusBadge(value)}`}
        >
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </span>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      priority: 'low' as const,
      render: (_: any, row: User) => (
        <div className="flex gap-2">
          {row.status === 'active' ? (
            <button
              onClick={(e) => {
                e.stopPropagation()
                setSelectedUserForAction(row.id)
                setShowRejectionModal(true)
              }}
              className="text-sm text-red-600 hover:text-red-800 flex items-center gap-1 flex-nowrap"
            >
              <UserX size={16} />
              Deactivate
            </button>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation()
                // Handle activation
              }}
              className="text-sm text-green-600 hover:text-green-800 flex items-center gap-1"
            >
              <UserCheck size={16} />
              Activate
            </button>
          )}
        </div>
      ),
    },
  ]
  const filteredUsers = users.filter((user) => {
    if (user.role === 'support') return false
    if (selectedRole !== 'all' && user.role !== selectedRole) return false
    if (selectedStatus !== 'all' && user.status !== selectedStatus) return false
    return true
  })


  const handleAccountSelected = (id: string) => {
    setSelectedUserId(id);
    router.push('/support/account-management/detail')
  }

  return (
    <DefaultLayout>
      <Breadcrumb previousPage={false} pageName="Account Management" />
      <div className="w-full">
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
            onChange={(e) => setSelectedRole(e.target.value as UserRole | 'all')}
          >
            <option value="all">All Roles</option>
            <option value="lessor">Lessors</option>
            <option value="tenant">Tenants</option>
            <option value="manager">Managers</option>
          </select>
          <select
            className="px-4 py-2 border border-gray-200 rounded-lg"
            value={selectedStatus}
            onChange={(e) =>
              setSelectedStatus(e.target.value as UserStatus | 'all')
            }
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        <ResponsiveTable
          columns={columns}
          data={filteredUsers}
          keyField="id"
          onRowClick={(row) => handleAccountSelected(row.id)}
        />
        <RejectionModal
          isOpen={showRejectionModal}
          onClose={() => {
            setShowRejectionModal(false)
            setSelectedUserForAction(null)
          }}
          onConfirm={(reason) => {
            console.log('Deactivating user with reason:', reason)
            setShowRejectionModal(false)
            setSelectedUserForAction(null)
          }}
          title="Deactivate User Account"
          message="Are you sure you want to deactivate this user account? Please provide a reason for deactivation."
        />
      </div>
    </DefaultLayout>
  )
}

export default AccountManagement;

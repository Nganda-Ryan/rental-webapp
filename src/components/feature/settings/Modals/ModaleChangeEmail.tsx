'use client'
import { changeEmail } from '@/actions/authAction'
import { X } from 'lucide-react'
import React, { useState } from 'react'
import toast from 'react-hot-toast'

interface ChangeEmailModalProps {
  currentEmail: string
  onClose: () => void
}

const ChangeEmailModal = ({ currentEmail, onClose }: ChangeEmailModalProps) => {
  const [emailForm, setEmailForm] = useState({
    currentEmail: currentEmail,
    newEmail: '',
    password: '',
  })
  const [isSaving, setIsSaving] = useState(false)

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setEmailForm({
      ...emailForm,
      [name]: value,
    })
  }

  const handleSaveEmail = async () => {
    if (!emailForm.newEmail) {
      alert('Please enter a new email address!')
      return
    }
    if (!emailForm.password) {
      alert('Please enter your password to confirm!')
      return
    }

    setIsSaving(true);
    
    
    const result = await changeEmail(emailForm.newEmail);
    console.log('-->result', result);
    if(result.code == 'success') {
      toast.success("Email Updated successfully", { position: 'bottom-right' });
      setEmailForm({
        currentEmail: currentEmail,
        newEmail: '',
        password: '',
      })
      onClose();
    } else {
        toast.error(result.error, { position: 'bottom-right' });
    }


    setIsSaving(false)
  }

  return (
    <div className="rounded-lg w-full max-h-[75vh] max-w-2xl mx-auto bg-white dark:bg-gray-800 flex flex-col">
      <div className="bg-white rounded-lg w-full">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold">Change Email Address</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>
        <div className="p-4">
          <div className="space-y-4">
            {/* Current Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Current Email
              </label>
              <input
                type="email"
                name="currentEmail"
                value={emailForm.currentEmail}
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100"
              />
            </div>

            {/* New Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                New Email
              </label>
              <input
                type="email"
                name="newEmail"
                value={emailForm.newEmail}
                onChange={handleEmailChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="Enter your new email address"
                disabled={isSaving}
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={emailForm.password}
                onChange={handleEmailChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="Enter your password to confirm"
                disabled={isSaving}
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              disabled={isSaving}
            >
              Cancel
            </button>
            <button
              onClick={handleSaveEmail}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              disabled={!emailForm.newEmail || !emailForm.password || isSaving}
            >
              {isSaving ? 'Updating...' : 'Update Email'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChangeEmailModal

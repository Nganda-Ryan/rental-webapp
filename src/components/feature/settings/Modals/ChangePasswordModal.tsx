import { changePassword } from '@/actions/authAction';
import { Eye, EyeOff, X } from 'lucide-react'
import React, { useState } from 'react'
import toast from 'react-hot-toast';

interface MyProps {
  onClose: () => void;
}


const ChangePasswordModal = ({ onClose }: MyProps) => {
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    })
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);

    const handlePasswordChange = (e: any) => {
        const { name, value } = e.target
        setPasswordForm({
            ...passwordForm,
            [name]: value,
        })
    }

    const handleSavePassword = async () => {
        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            toast.error("New passwords do not match!", { position: 'bottom-right' });
            return
        }
        if (passwordForm.newPassword.length < 8) {
            toast.error("Password must be at least 8 characters long!", { position: 'bottom-right' });
            return
        }
        const result = await changePassword(passwordForm.currentPassword, passwordForm.newPassword);
        console.log('-->result', result);
        if(result.code == 'success') {
            toast.success("Password Updated successfully", { position: 'bottom-right' });
            setPasswordForm({
                currentPassword: '',
                newPassword: '',
                confirmPassword: '',
            })
            onClose();
        } else {
            toast.error(result.error, { position: 'bottom-right' });
        }
    }

    return (
        <div className="rounded-lg w-full max-h-[75vh] max-w-2xl mx-auto bg-white dark:bg-gray-800 flex flex-col">
            <div className="bg-white rounded-lg w-full">
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold">Change Password</h3>
                    <button
                        onClick={() => {onClose()}}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <X size={20} />
                    </button>
                </div>
                <div className="p-4">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Current Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showCurrentPassword ? 'text' : 'password'}
                                    name="currentPassword"
                                    value={passwordForm.currentPassword}
                                    onChange={handlePasswordChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg pr-10"
                                    placeholder="Enter your current password"
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    onClick={() =>
                                        setShowCurrentPassword(!showCurrentPassword)
                                    }
                                >
                                    {showCurrentPassword ? (
                                        <EyeOff size={16} />
                                    ) : (
                                        <Eye size={16} />
                                    )}
                                </button>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                New Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showNewPassword ? 'text' : 'password'}
                                    name="newPassword"
                                    value={passwordForm.newPassword}
                                    onChange={handlePasswordChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg pr-10"
                                    placeholder="Enter your new password"
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                >
                                    {showNewPassword ? (
                                        <EyeOff size={16} />
                                    ) : (
                                        <Eye size={16} />
                                    )}
                                </button>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                                Password must be at least 8 characters long
                            </p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Confirm New Password
                            </label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={passwordForm.confirmPassword}
                                onChange={handlePasswordChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                placeholder="Confirm your new password"
                            />
                        </div>
                    </div>
                    <div className="mt-6 flex justify-end space-x-3">
                        <button
                            onClick={() => {onClose()}}
                            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSavePassword}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            disabled={
                                !passwordForm.currentPassword ||
                                !passwordForm.newPassword ||
                                !passwordForm.confirmPassword
                            }
                        >
                            Update Password
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ChangePasswordModal
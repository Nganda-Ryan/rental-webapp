'use client'
import Overlay from '@/components/Overlay';
import { ChevronDown, Lock, Shield } from 'lucide-react'
import React, { useState } from 'react'
import ChangePasswordModal from './Modals/ChangePasswordModal';
import ChangeEmailModal from './Modals/ModaleChangeEmail';
import { roleStore } from '@/store/roleStore';
import { useTranslations } from 'next-intl';

const SecuritySection = () => {
    const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
    const [isChangeEmailModalOpen, setIsChangeEmailModalOpen] = useState(false);
    const [isSecurityQuestionsModalOpen, setIsSecurityQuestionsModalOpen] = useState(false);
    const [isTwoFactorEnabled, setIsTwoFactorEnabled] = useState(false);
    const { user } = roleStore();
    const t = useTranslations('Common');

    const toggleTwoFactor = () => {
        setIsTwoFactorEnabled(!isTwoFactorEnabled)
        alert(t('twoFactorStatus', { status: !isTwoFactorEnabled ? t('twoFactorEnabled') : t('twoFactorDisabled') }));
    }

    return (
      <div className="bg-white dark:bg-gray-700 rounded-lg shadow-sm p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100">
          <Shield size={20} />
          {t('security')}
        </h2>

        <div className="space-y-4">
          {/* Password & Email Management */}
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-sm">
            <h3 className="font-medium mb-3 flex items-center gap-2 text-gray-800 dark:text-gray-200">
              <Lock size={16} />
              {t('accountManagement')}
            </h3>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setIsChangePasswordModalOpen(true)}
                className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-600 transition"
              >
                {t('changePassword')}
              </button>
            </div>
          </div>

          {/* Security Questions */}
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-sm">
            <h3 className="font-medium mb-3 text-gray-800 dark:text-gray-200">{t('securityQuestions')}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              {t('securityQuestionsDescription')}
            </p>
            <button
              onClick={() => setIsSecurityQuestionsModalOpen(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-500 text-sm transition"
            >
              {t('setSecurityQuestions')}
            </button>
          </div>

          {/* Two-Factor Authentication */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-sm space-y-3 sm:space-y-0">
            <div>
              <h3 className="font-medium text-gray-800 dark:text-gray-200">{t('twoFactorAuthentication')}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t('twoFactorDescription')}
              </p>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={isTwoFactorEnabled}
                onChange={toggleTwoFactor}
              />
              <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer-checked:bg-green-500 relative after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
            </label>
          </div>
        </div>

        <Overlay isOpen={isChangePasswordModalOpen} onClose={() => setIsChangePasswordModalOpen(false)}>
          <ChangePasswordModal
            onClose={() => setIsChangePasswordModalOpen(false)}
          />
        </Overlay>
      </div>
    )
}

export default SecuritySection
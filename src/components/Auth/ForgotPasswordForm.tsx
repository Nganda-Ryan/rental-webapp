"use client"
import React, { useState } from 'react';
import { Mail, ArrowLeft } from 'lucide-react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import toast from 'react-hot-toast';
import Overlay from '../Overlay';
import { ProcessingModal } from '../Modal/ProcessingModal';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

export const ForgotPasswordForm = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const authT = useTranslations('Auth');
  const commonT = useTranslations('Common');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await sendPasswordResetEmail(auth, email);
      setEmailSent(true);
      toast.success(authT('resetLinkSent'), { position: 'bottom-right' });
    } catch (error: any) {
      console.error('Error sending reset email:', error);

      let message = authT('resetLinkError');
      switch (error.code) {
        case "auth/user-not-found":
          message = "No account found with this email address";
          break;
        case "auth/invalid-email":
          message = "Invalid email address";
          break;
        case "auth/too-many-requests":
          message = "Too many requests. Please try again later";
          break;
        default:
          message = error.message || authT('resetLinkError');
      }

      toast.error(message, { position: 'bottom-right' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-8">
      <Overlay isOpen={isLoading} onClose={() => {}}>
        <ProcessingModal message={authT('sendResetLink')} />
      </Overlay>

      <div className="text-center">
        <div className="flex justify-center mb-4">
          <Image
            width={200}
            height={200}
            src={"/images/logo-blue.svg"}
            alt="Logo"
            className="h-13 w-auto relative left-2"
          />
        </div>
        <h1 className="text-2xl font-bold text-[#083959]">{authT('forgotPasswordTitle')}</h1>
        <p className="mt-2 text-gray-600">{authT('forgotPasswordPrompt')}</p>
      </div>

      {emailSent ? (
        <div className="text-center space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-800">{authT('resetLinkSent')}</p>
          </div>
          <Link
            href="/signin"
            className="inline-flex items-center text-sm font-medium text-blue-900 hover:text-blue-800"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {authT('backToSignIn')}
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="sm:mt-8 space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              {authT('emailAddress')}
            </label>
            <div className="mt-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent"
                placeholder={authT('enterEmail')}
              />
            </div>
          </div>

          <div className="space-y-4">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-900 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-900 disabled:opacity-50"
            >
              {authT('sendResetLink')}
            </button>

            <div className="text-center">
              <Link
                href="/signin"
                className="inline-flex items-center text-sm font-medium text-blue-900 hover:text-blue-800"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                {authT('backToSignIn')}
              </Link>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

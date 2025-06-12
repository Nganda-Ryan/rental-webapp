"use client"
import React, { useActionState, useState } from 'react';
import { Building2, Lock, Mail} from 'lucide-react';
import { login } from '@/actions/authAction';
import { useFormStatus } from 'react-dom';
import toast from 'react-hot-toast';
import Overlay from '../Overlay';
import { ProcessingModal } from '../Modal/ProcessingModal';
import { useRouter } from 'next/navigation';

interface FormError {
  username: string | null;
  password: string | null;
  message: string | null;
}
const INITIAL_STATE : FormError= {
  username: "",
  password: "",
  message: ""
}

function isValidationError(error: unknown): error is Record<string, string[]> {
  return typeof error !== null && error === 'object';
}

export const LoginForm = () => {
  // const [state, loginAction] = useActionState(login, undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState(INITIAL_STATE);
  const router = useRouter();


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setFormError(INITIAL_STATE);
  
    try {
      const formData = new FormData(e.currentTarget);
      const result = await login(formData);
      console.log('result', result);
      if (result?.error) {
        if (result.code == "validation") {
          if (isValidationError(result.error)) {
            setFormError({
              message: "",
              username: result.error.username?.[0] ?? "",
              password: result.error.password?.[0] ?? ""
            });
          }
        } else {
          if (result.error !== null && typeof result.error !== 'object') {
            toast.error(result.error ?? "An unexpected error occurred", { position: 'bottom-right' });
            setFormError({
              message: result.error,
              username: "",
              password: null
            })
          }
        }      
      } else {
        setIsLoading(false);
        if (result.redirectTo) {
          router.push(result.redirectTo);
          toast.success("Connexion réussie", { position: 'bottom-right' });
        } else {
          toast.error("Erreur interne du système", { position: 'bottom-right' });
        }
      }
      return;
    } catch (error: any) {
      console.error('Erreur inattendue :', error);
      toast.error("Erreur interne du système", { position: 'bottom-right' });
    } finally {
      setIsLoading(false);
    }
  };
  

  return (
    <div className="w-full max-w-md space-y-8">
      <Overlay isOpen={isLoading} onClose={() => {}}>
        <ProcessingModal
         message="Loading you account ..." />
      </Overlay>
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <Building2 className="h-12 w-12 text-blue-900" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Welcome back</h1>
        <p className="mt-2 text-gray-600">Please sign in to your account</p>
      </div>
      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <div className="space-y-4">
          <div>
            <div className="mt-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent"
                placeholder="Enter your email, NUI or Phone"
              />
            </div>
            {formError.username && <p className="text-red-500">{formError.username}</p>}
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <div className="mt-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent"
                placeholder="Enter your password"
              />
            </div>
            {formError.password && <p className="text-red-500">{formError.password}</p>}
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 text-blue-900 focus:ring-blue-900 border-gray-300 rounded"
            />
            <label
              htmlFor="remember-me"
              className="ml-2 block text-sm text-gray-700"
            >
              Remember me
            </label>
          </div>
          <div className="text-sm">
            <a
              href="#"
              className="font-medium text-blue-900 hover:text-blue-800"
            >
              Forgot password?
            </a>
          </div>
        </div>
        <div className="space-y-4">
          <SubmitButton />
          <div className="text-center">
            <span className="text-sm text-gray-600">
              Don&apos;t have an account?{' '}
            </span>
            <a
              href="/signup"
              className="text-sm font-medium text-blue-900 hover:text-blue-800"
            >
              Create account
            </a>
          </div>
        </div>
      </form>
    </div>
  )
}


const SubmitButton = () => {
  const { pending } = useFormStatus();

  return (
    <button type="submit" disabled={pending} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-900 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-900">
        Sign in
    </button>
  )
}
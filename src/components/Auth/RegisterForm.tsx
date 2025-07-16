'use client'
import React, { useState } from 'react';
import { Building2, Eye, EyeOff, Key, Mail } from 'lucide-react';
import PhoneInput from 'react-phone-input-2';
import Select from 'react-select';
import { getNames, getCode } from 'country-list';
import { signUpAction } from '@/actions/authAction';
import toast from 'react-hot-toast';
import 'react-phone-input-2/lib/style.css';
import Overlay from '../Overlay';
import { ProcessingModal } from '../Modal/ProcessingModal';
import { useRouter } from '@bprogress/next/app';

const countryOptions = getNames()
.map((name) => ({
  label: name,
  value: getCode(name),
}))
.filter((option) => option.value !== undefined) as { label: string; value: string }[]

function isValidationError(error: unknown): error is Record<string, string[]> {
  return typeof error !== null && error === 'object';
}

export const RegisterForm = () => {
  const [phone, setPhone] = useState('')
  const [selectedCountry, setSelectedCountry] = useState<{ label: string; value: string } | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState({
    isError: false,
    message: "",
    email: "",
    firstname: "",
    lastname: "",
    gender: "",
    phone: "",
    password: "",
    userId: "",
    street: "",
    city: "",
    country: "",
    code: "",
  });
  const router = useRouter();

  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsLoading(true);
    try {
      e.preventDefault()
      const formData = new FormData(e.currentTarget)
      const data = Object.fromEntries(formData.entries())
      const payload = {
        email: data.email,
        firstname: data.firstName,
        lastname: data.lastName,
        gender: data.gender,
        phone: `+${phone}`,
        password: data.password,
        userId: "",
        street: data.street,
        city: data.city,
        country: selectedCountry?.value || '',
      }
      const result = await signUpAction(payload);
      console.log('-->result', result);
      if(result){
        if(result?.error){
          if(result.code == "validation"){
            if (isValidationError(result.error)) {
              setFormError({
                isError: true,
                message: "",
                email: result.error.email?.[0] ?? "",
                firstname: result.error.firstname?.[0] ?? "",
                lastname: result.error.lastname?.[0] ?? "",
                gender: result.error.gender?.[0] ?? "",
                phone: result.error.phone?.[0] ?? "",
                password: result.error.password?.[0] ?? "",
                street: result.error.street?.[0] ?? "",
                city: result.error.city?.[0] ?? "",
                country: result.error.country?.[0] ?? "",
                userId: "",
                code: result.code,
              });
            }
          } else {
            if (result.error !== null && typeof result.error !== 'object') {
              toast.error(result.error ?? "An unexpected error occurred", { position: 'bottom-right' });
            }
          }
        } else {
          setIsLoading(false);
          toast.success("Connexion réussie", { position: 'bottom-right' });
          if (result.redirectTo) {
            router.push(result.redirectTo);
          } else {
            toast.error("Erreur interne du système", { position: 'bottom-right' });
          }
        }
      }
      return;
    } catch (error:any) {
      console.error('@@@@', error);
      if (error.message === 'WEAK_PASSWORD') {
        setIsLoading(false);
        toast.error('Le mot de passe est trop faible.', {position: 'top-center'});
      } else {
        console.error('@@@@', JSON.parse(error.response));
        setIsLoading(false);
        toast.error('Erreur inconnue lors de la création.', {position: 'bottom-right'});
      }
      
    } finally {
      setIsLoading(false);
    }
  }

  const handlePhoneChange = (phone: any) => {
    console.log(phone)
    setPhone(phone)
  }
  
  return (
    <div className="w-full max-w-md space-y-8">
      <Overlay isOpen={isLoading} onClose={() => {}}>
        <ProcessingModal message="Creating your account..." />
      </Overlay>
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <Building2 className="h-12 w-12 text-blue-900" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Create Account</h1>
        <p className="mt-2 text-gray-600">Please fill in your information</p>
      </div>
      <form onSubmit={handleSubmit} className="mt-8 space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">First Name</label>
            <input
              type="text"
              required
              name="firstName"
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
            />
          {formError.firstname && <p className="text-red-500">{formError.firstname}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Last Name</label>
            <input
              type="text"
              required
              name="lastName"
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
            />
          {formError.lastname && <p className="text-red-500">{formError.lastname}</p>}
          </div>
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
          {formError.gender && <p className="text-red-500">{formError.gender}</p>}
        </div>
        
        <div className="grid grid-cols-2 gap-2">
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
            {formError.email && <p className="text-red-500">{formError.email}</p>}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Primary Phone</label>
            <div className="mt-1 relative">
              <PhoneInput
                country={'cm'}
                value={phone}
                onChange={(phone) => handlePhoneChange(phone)}
                inputStyle={{ width: '100%', height: "41px", borderRadius: "6px" }}
                specialLabel=""
                enableSearch
              />
            {formError.phone && <p className="text-red-500">{formError.phone}</p>}
            </div>
          </div>
        </div>

        
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">Country</label>
            <select
              name="country"
              required
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
            >
              {countryOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {formError.country && <p className="text-red-500">{formError.country}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">City</label>
            <input
              type="text"
              required
              name="city"
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-[7px]"
            />
            {formError.city && <p className="text-red-500">{formError.city}</p>}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Street</label>
          <input
            type="text"
            required
            name="street"
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
          />
          {formError.street && <p className="text-red-500">{formError.street}</p>}
        </div>


        <div>
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <div className="relative">
            <Key
              size={16}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <input
              type={showPassword ? "text" : "password"}
              required
              name="password"
              className="mt-1 block w-full border border-gray-300 rounded-md px-9 py-2"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {formError.password && <p className="text-red-500">{formError.password}</p>}
        </div>
        

        <div className="space-y-4">
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-900 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-900"
          >
            Create Account
            {isLoading && (
              <div role="status" className='pl-3'>
                <svg aria-hidden="true" className="inline w-5 h-5 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                </svg>
                <span className="sr-only">Loading...</span>
              </div>
            )}
            
          </button>
          <div className="text-center">
            <span className="text-sm text-gray-600">Already have an account? </span>
            <a
              href="/signin"
              className="text-sm font-medium text-blue-900 hover:text-blue-800"
            >
              Sign in
            </a>
          </div>
        </div>
      </form>
    </div>
  )
}

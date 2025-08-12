'use client';
import { useForm } from 'react-hook-form';
import { ProfileDetail  } from "@/types/authTypes";
import { PhoneInput } from "@/components/ui/PhoneInput";
import { useEffect } from 'react';

type Props = {
  defaultValues: ProfileDetail ;
  onCancel: () => void;
  onSubmit: (data: ProfileDetail ) => void;
};

const UserInfoForm = ({ defaultValues, onCancel, onSubmit }: Props) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProfileDetail>({
    defaultValues,
  });

  const phone = watch('Phone');

  useEffect(() => {
    // si besoin de mettre à jour `defaultValues` dynamiquement
    setValue('Phone', defaultValues.Phone);
  }, [defaultValues, setValue]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          First Name
        </label>
        <input
          type="text"
          {...register('Firstname', { required: true })}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg"
        />
        {errors && errors.Firstname && <p className="text-red-500 text-sm">Required</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Last Name
        </label>
        <input
          type="text"
          {...register('Lastname', { required: true })}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg"
        />
        {errors && errors.Lastname && <p className="text-red-500 text-sm">Required</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Phone
        </label>
        <PhoneInput
          value={phone}
          onChange={(value) => setValue('Phone', value ?? '')}
        />
      </div>

      <div className="md:col-span-2 flex justify-end gap-2 mt-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-400 dark:border-gray-600 text-gray-600 dark:text-gray-300 rounded-lg"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
        >
          Save Changes
        </button>
      </div>
    </form>
  );
};

export default UserInfoForm;

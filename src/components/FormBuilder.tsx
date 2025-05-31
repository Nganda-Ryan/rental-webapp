"use client"
import React, { forwardRef, useImperativeHandle, useState, useCallback, memo, useEffect } from 'react';
import { useForm, FieldValues, RegisterOptions, Controller, ControllerRenderProps, ControllerFieldState, UseFormStateReturn } from 'react-hook-form';
import { Field, Label, Description, Input, Checkbox, Select, Switch, Textarea } from '@headlessui/react';
import { Button } from '@headlessui/react';
import { CheckIcon, ChevronDownIcon } from '@heroicons/react/24/solid';
import { FieldDefinition, FieldOption, FormBuilderProps, FormBuilderRef } from '@/types/FormBuilderTypes';







const CheckboxField = memo(({ field, register, setValue, errors, className }: any) => (
  <div className="flex items-center">
    <Checkbox
      {...register(field.api, { ...field.validation })}
      defaultChecked={field.checked || field.defaultValue}
      onChange={(value) => setValue(field.api, value)}
      className={`group size-6 rounded-md bg-white/10 p-1 ring-1 ring-slate-200 ring-inset data-[checked]:bg-white dark:bg-gray-700 dark:ring-gray-600 ${className}`}
    >
      <CheckIcon className="hidden size-4 fill-black group-data-[checked]:block dark:fill-slate-100" strokeWidth={30} />
    </Checkbox>
    <Label className="ml-2 text-sm text-gray-900 dark:text-white">
      {field.label}
    </Label>
  </div>
));
CheckboxField.displayName = 'CheckboxField';

const SelectField = memo(({ field, register, errors, className }: any) => (
  <div className="relative">
    <Select
      {...register(field.api, { required: field.required, ...field.validation })}
      defaultValue={field.defaultValue || ""}
      multiple={field.multiple || false}
      className={`mt-3 block w-full appearance-none rounded-sm border-none  py-1.5 px-3 text-sm/6 text-gray-900 dark:text-white ring-gray-300 focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-indigo-500 dark:data-[focus]:outline-indigo-400 *:text-black ${className}`}
    >
      <option value="" disabled>Sélectionnez une option</option>
      {field.options?.map((option: FieldOption, index: number) => (
        <option key={index} value={option.value}>
          {option.label}
        </option>
      ))}
    </Select>
    <ChevronDownIcon className="pointer-events-none absolute top-2.5 right-2.5 size-4 fill-gray-500 dark:fill-gray-400" aria-hidden="true" />
  </div>
));
SelectField.displayName = 'SelectField';

const SwitchField = memo(({ field, register, setValue, className }: any) => (
  <Switch
    {...register(field.api, { required: field.required, ...field.validation })}
    defaultChecked={field.checked || field.defaultValue}
    onChange={(value) => setValue(field.api, value)}
    className={`group relative flex h-7 w-14 cursor-pointer rounded-full bg-white/10 p-1 transition-colors duration-200 ease-in-out focus:outline-none data-[focus]:outline-1 data-[focus]:outline-white data-[checked]:bg-white/10 dark:bg-gray-700 dark:data-[checked]:bg-white/10 ${className}`}
  >
    <span
      aria-hidden="true"
      className="pointer-events-none inline-block size-5 translate-x-0 rounded-full bg-white ring-0 shadow-lg transition duration-200 ease-in-out group-data-[checked]:translate-x-7 dark:bg-gray-200"
    />
  </Switch>
));
SwitchField.displayName = 'SwitchField';

const TextareaField = memo(({ field, register, errors, className }: any) => (
  <Textarea
    {...register(field.api, { required: field.required, ...field.validation })}
    placeholder={field.placeholder}
    rows={field.rows || 3}
    defaultValue={field.defaultValue || ""}
    className={`bg-slate-100 mt-3 dark:bg-slate-700 block w-full resize-none rounded-sm border-none  py-1.5 px-3 text-sm/6 text-gray-900 dark:text-white focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-indigo-500 dark:data-[focus]:outline-indigo-400 ${className}`}
    style={{ resize: field.autoResize ? 'vertical' : 'none' }}
  />
));
TextareaField.displayName = 'TextareaField';

const InputField = memo(({ field, register, errors, className }: any) => (
  <Input
    type={field.type}
    {...register(field.api, { required: field.required, ...field.validation })}
    placeholder={field.placeholder}
    defaultValue={field.defaultValue || ""}
    className={`bg-slate-100 dark:bg-slate-700 mt-3 block w-full rounded-sm border-none py-1.5 px-3 text-sm/6 text-gray-900 dark:text-white focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-indigo-500 dark:data-[focus]:outline-indigo-400 ${className}`}
  />
));
InputField.displayName = 'InputField';

const FormBuilder = forwardRef<FormBuilderRef, FormBuilderProps>(
  (
    {
      fields,
      onSubmit,
      onCancel,
      showSubmitButton = true,
      showCancelButton = true,
      submitButtonText = 'Submit',
      cancelButtonText = 'Cancel',
      className = 'space-y-6',
      fieldClassName = 'space-y-2',
      gridClassName = 'grid grid-cols-1 sm:grid-cols-2 gap-6',
    },
    ref
  ) => {
    const defaultValues = React.useMemo(() => {
      return fields.reduce((acc, field) => {
        if (typeof field.defaultValue === 'function') {
          acc[field.api] = field.defaultValue();
        } else if (field.defaultValue !== undefined) {
          acc[field.api] = field.defaultValue;
        } else if (field.type === 'checkbox' || field.type === 'switch') {
          acc[field.api] = field.checked || false;
        } else {
          acc[field.api] = '';
        }
        return acc;
      }, {} as Record<string, any>);
    }, [fields]);

    const { 
      register, 
      handleSubmit, 
      formState: { errors }, 
      reset, 
      setValue, 
      trigger, 
      getValues,
      watch,
      control
    } = useForm<FieldValues>({
      defaultValues,
    });

    // Observer les valeurs pour les champs conditionnels
    const formValues = watch();
    
    // Exposer les méthodes avec useImperativeHandle
    useImperativeHandle(ref, () => ({
      reset,
      setValue,
      trigger,
      getValues,
      watch
    }), [reset, setValue, trigger, getValues, watch]);

    // Optimiser les fonctions de rappel avec useCallback
    const resetForm = useCallback(() => {
      if (onCancel) {
        onCancel();
      }
      reset();
    }, [onCancel, reset]);

    const processSubmit = useCallback((data: FieldValues) => {
      onSubmit(data);
    }, [onSubmit]);

    // Fonction pour déterminer si un champ est visible
    const isFieldVisible = useCallback((field: FieldDefinition) => {
      if (field.hidden === undefined) return true;
      if (typeof field.hidden === 'function') {
        return !field.hidden(formValues);
      }
      return !field.hidden;
    }, [formValues]);

    // Fonction pour rendre un champ en fonction de son type
    const renderField = useCallback((field: FieldDefinition) => {
      // Si le champ a une fonction de rendu personnalisée, l'utiliser
      if (field.render) {
        return (
          <Controller
            name={field.api}
            control={control}
            rules={{ required: field.required, ...field.validation }}
            render={({ field: controllerField, fieldState, formState }) => {
              // S'assurer que render retourne toujours un ReactElement valide
              const renderedElement = field.render!(controllerField, fieldState, formState);
              // Si la fonction de rendu retourne null ou undefined, afficher un div vide
              return renderedElement || <div />;
            }}
          />
        );
      }

      // Sinon, utiliser le rendu par défaut basé sur le type
      switch (field.type) {
        case 'checkbox':
          return <CheckboxField field={field} register={register} setValue={setValue} errors={errors} className={field.className} />;
        case 'select':
          return <SelectField field={field} register={register} errors={errors} className={field.className} />;
        case 'switch':
          return <SwitchField field={field} register={register} setValue={setValue} className={field.className} />;
        case 'textarea':
          return <TextareaField field={field} register={register} errors={errors} className={field.className} />;
        default:
          return <InputField field={field} register={register} errors={errors} className={field.className} />;
      }
    }, [register, setValue, errors, control]);

    return (
      <form onSubmit={handleSubmit(processSubmit)} className={className}>
        <div className={gridClassName}>
          {fields.map((field, index) => (
            isFieldVisible(field) && (
              <Field 
                key={field.api || index} 
                className={`${fieldClassName} ${field.width === 'full' ? 'sm:col-span-2' : ''}`}
              >
                {field.type !== 'checkbox' && (
                  <Label className="text-sm/6 font-medium text-gray-900 dark:text-white">
                    {field.label}
                    {field.required && <span className="text-red-500">*</span>}
                  </Label>
                )}
                {field.description && (
                  <Description className="text-sm/6 text-gray-500 dark:text-gray-400">
                    {field.description}
                  </Description>
                )}
                {renderField(field)}
                {errors[field.api] && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                    {(errors[field.api]?.message as string) || field.errorMessage || 'Ce champ est requis'}
                  </p>
                )}
              </Field>
            )
          ))}
        </div>

        <div className="flex justify-end space-x-4 mt-6">
          {showCancelButton && (
            <Button
              type="button"
              onClick={resetForm}
              className="inline-flex items-center gap-2 rounded-md bg-gray-500 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-600 data-[focus]:outline-1 data-[focus]:outline-white"
            >
              {cancelButtonText}
            </Button>
          )}
          {showSubmitButton && (
            <Button
              type="submit"
              className="inline-flex items-center gap-2 rounded-md bg-indigo-600 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-indigo-700 data-[focus]:outline-1 data-[focus]:outline-white"
            >
              {submitButtonText}
            </Button>
          )}
        </div>
      </form>
    );
  }
);


FormBuilder.displayName = 'FormBuilder';

export default memo(FormBuilder);
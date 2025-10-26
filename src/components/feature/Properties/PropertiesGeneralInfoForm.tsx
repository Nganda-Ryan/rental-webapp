"use client"
import FormBuilder from '@/components/FormBuilder';
import React, { forwardRef, useRef, useImperativeHandle } from 'react';
import { FieldDefinition, FormBuilderRef } from '@/types/FormBuilderTypes';
import { PropertiesGeneralInfoFormRef } from '@/types/FormTypes';
import { useTranslations } from 'next-intl';


const PropertiesGeneralInfoForm = forwardRef<PropertiesGeneralInfoFormRef, {}>(
    (props, ref) => {
        const t = useTranslations('Property');
        const commonT = useTranslations('Common');

        const formRef = useRef<FormBuilderRef>(null);
        useImperativeHandle(ref, () => ({
            reset: () => formRef.current?.reset(),
            setValue: (name: string, value: any) => formRef.current?.setValue(name, value),
            trigger: () => formRef.current?.trigger() ?? Promise.resolve(false),
            getValues: () => formRef.current?.getValues() ?? {},
        }));

        const handleSubmit = (data: any) => {
            console.log('Form data:', data);
        };

        const handleCancel = () => {
            console.log('Form cancelled');
        };

        const fields: FieldDefinition[] = [
            {
              label: t('identifier'),
              api: 'name',
              type: 'text',
              required: true,
              errorMessage: t('nameRequired'),
              placeholder: t('namePlaceholder'),
            },
            {
              label: commonT('country'),
              api: 'country',
              type: 'text',
              required: true,
              errorMessage: t('countryRequired'),
              placeholder: t('countryPlaceholder'),
            },
            {
              label: t('region'),
              api: 'region',
              type: 'text',
              required: true,
              errorMessage: t('regionRequired'),
              placeholder: t('regionPlaceholder'),
            },
            {
              label: commonT('city'),
              api: 'city',
              type: 'text',
              required: true,
              errorMessage: t('cityRequired'),
              placeholder: t('cityPlaceholder'),
            },
            {
              label: t('quarter'),
              api: 'quater',
              type: 'text',
              required: true,
              errorMessage: t('quarterRequired'),
              placeholder: t('quarterPlaceholder'),
            },
            {
              label: t('area'),
              api: 'area',
              type: 'number',
              required: false,
              errorMessage: t('emailRequired'),
              placeholder: t('emailPlaceholder'),
            },
            {
              label: commonT('Description'),
              api: 'description',
              type: 'textarea',
              required: false,
              errorMessage: t('descriptionRequired'),
              placeholder: t('descriptionPlaceholder'),
            },
        ];
          
        return (
            <div>
                <FormBuilder
                    ref={formRef}
                    fields={fields}
                    onSubmit={handleSubmit}
                    onCancel={handleCancel}
                    showCancelButton={false}
                    showSubmitButton={false}
                />
            </div>
        )
    }
)

PropertiesGeneralInfoForm.displayName = 'PropertiesGeneralInfoForm';
export default PropertiesGeneralInfoForm;
"use client"
import FormBuilder from '@/components/FormBuilder';
import React, { forwardRef, useRef, useImperativeHandle } from 'react';
import { FieldDefinition, FormBuilderRef } from '@/types/FormBuilderTypes';
import { PropertiesGeneralInfoFormRef } from '@/types/FormTypes';


const PropertiesGeneralInfoForm = forwardRef<PropertiesGeneralInfoFormRef, {}>(
    (props, ref) => {
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
              label: 'Identifiant',
              api: 'name',
              type: 'text',
              required: true,
              errorMessage: 'Name is required',
              placeholder: 'Enter your name',
            },
            {
              label: 'Country',
              api: 'country',
              type: 'text',
              required: true,
              errorMessage: 'The country is required',
              placeholder: 'Enter your country',
            },
            {
              label: 'Region',
              api: 'region',
              type: 'text',
              required: true,
              errorMessage: 'Region is required',
              placeholder: 'Enter your Region',
            },
            {
              label: 'City',
              api: 'city',
              type: 'text',
              required: true,
              errorMessage: 'The city is required',
              placeholder: 'Enter your city',
            },
            {
              label: 'Quater',
              api: 'quater',
              type: 'text',
              required: true,
              errorMessage: 'Quater is required',
              placeholder: 'Quater your email',
            },
            {
              label: 'Area',
              api: 'area',
              type: 'number',
              required: false,
              errorMessage: 'Email is required',
              placeholder: 'Enter your email',
            },
            {
              label: 'Description',
              api: 'description',
              type: 'textarea',
              required: false,
              errorMessage: 'Description is required',
              placeholder: 'Enter your Description',
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
"use client"
import FormBuilder from '@/components/FormBuilder';
import React, { forwardRef, useRef, useImperativeHandle } from 'react';
import { FieldDefinition, FormBuilderRef } from '@/types/FormBuilderTypes';
import { ComplementaryInfoFormRef } from '@/types/FormTypes';
import { Checkbox, Field, Label } from '@headlessui/react';
import { CheckIcon } from '@heroicons/react/20/solid';


const ComplementaryInfoForm = forwardRef<ComplementaryInfoFormRef, {}>(
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
            { label: 'Accès handicapé', api: 'handicap_access', type: 'checkbox' },
            { label: 'Aire de jeux', api: 'playground', type: 'checkbox' },
            { label: 'Alarme incendie', api: 'fire_alarm', type: 'checkbox' },
            { label: 'Arrosage', api: 'watering_system', type: 'checkbox' },
            { label: 'Balcon', api: 'balcony', type: 'checkbox' },
            { label: 'Cave', api: 'cellar', type: 'checkbox' },
            { label: 'Cheminée', api: 'fireplace', type: 'checkbox' },
            { label: 'Coffre-fort', api: 'safe', type: 'checkbox' },
            { label: 'Détecteur de fumée', api: 'smoke_detector', type: 'checkbox' },
            { label: 'Domotique', api: 'home_automation', type: 'checkbox' },
            { label: 'Eau chaude collective', api: 'shared_hot_water', type: 'checkbox' },
            { label: 'Fibre optique', api: 'fiber_optic', type: 'checkbox' },
            { label: 'Garage', api: 'garage', type: 'checkbox' },
            { label: 'Gardien', api: 'caretaker', type: 'checkbox' },
            { label: 'Maison de gardien', api: 'caretaker_house', type: 'checkbox' },
            { label: 'Panneaux solaires', api: 'solar_panels', type: 'checkbox' },
            { label: 'Piscine', api: 'swimming_pool', type: 'checkbox' },
            { label: 'Télésurveillance', api: 'video_surveillance', type: 'checkbox' },
            { label: 'VMC', api: 'ventilation_system', type: 'checkbox' },
            { label: 'Accès Internet', api: 'internet_access', type: 'checkbox' },
            // { label: 'Alarme', api: 'alarm_system', type: 'checkbox' },
            // { label: 'Antenne TV collective', api: 'shared_tv_antenna', type: 'checkbox' },
            // { label: 'Ascenseur', api: 'elevator', type: 'checkbox' },
            // { label: 'Câble/Fibre', api: 'cable_fiber', type: 'checkbox' },
            // { label: 'Chauffage collectif', api: 'shared_heating', type: 'checkbox' },
            // { label: 'Concierge', api: 'concierge', type: 'checkbox' },
            // { label: 'Double vitrage', api: 'double_glazing', type: 'checkbox' },
            // { label: 'Espace vert', api: 'green_space', type: 'checkbox' },
            // { label: 'Jardin', api: 'garden', type: 'checkbox' },
            // { label: 'Parking', api: 'parking', type: 'checkbox' },
            // { label: 'Portail électrique', api: 'electric_gate', type: 'checkbox' },
            // { label: 'Salle de sport', api: 'gym', type: 'checkbox' },
            // { label: 'Stores', api: 'shutters', type: 'checkbox' },
            // { label: 'Terrasse', api: 'terrace', type: 'checkbox' },
            // { label: 'Ventilation', api: 'ventilation', type: 'checkbox' },
        ];
        return (
            <div>
                {/* {
                    fields.map(({ label, api, type }) => (
                        <Field key={api}>
                            <Checkbox
                                defaultChecked={false}
                                className={`group size-6 rounded-md bg-white/10 p-1 ring-1 ring-white/15 ring-inset data-[checked]:bg-white dark:bg-gray-700 ring-gray-300 dark:ring-gray-600`}
                            >
                                <CheckIcon className="hidden size-4 fill-black group-data-[checked]:block dark:fill-slate-100" strokeWidth={30} />
                            </Checkbox>
                            <Label className="ml-2 text-sm text-gray-900 dark:text-white">
                                {label}
                            </Label>
                        </Field>
                    ))
                } */}
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

ComplementaryInfoForm.displayName = 'ComplementaryInfoForm';
export default ComplementaryInfoForm;
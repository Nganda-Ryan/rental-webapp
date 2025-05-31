"use client";
import { Combobox, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions, Description, Field, Label } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import { useState } from 'react';

interface DropdownFilterProps {
    dataList: { id: string; value: string }[];
    handleSelected: (selected: { id: string; value: string } | null) => void;
    placeholder?: string;
    label?: string;
    size?: string;
}

export default function DropdownFilter({ dataList, handleSelected, placeholder = "Veuillez entrer une valeur", label = "", size = "w-96" }: DropdownFilterProps) {
    const [query, setQuery] = useState('');
    const [selected, setSelected] = useState<{ id: string; value: string } | null>(null);

    const filteredData = query === '' ? dataList :
        dataList.filter((item) => {
            return item.value.toLowerCase().includes(query.toLowerCase());
        });

    const handleComboboxChanges = (value: { id: string; value: string } | null) => {
        setSelected(value);
        handleSelected(value);
    };

    return (
        <Field className={`${size} dark:text-slate-50 inline`}>
            <Label>
                {label}
            </Label>
            {/* <Description>This person will have full access to this project.</Description> */}
            <Combobox 
                value={selected}
                onChange={handleComboboxChanges} 
                onClose={() => setQuery('')}
                // virtual={{ options: filteredData }}
                >
                <div className="relative rounded-sm border dark:border-strokedark dark:bg-boxdark border-slate-200 p-1 w-full flex justify-between flex-nowrap">
                    <ComboboxInput
                        className="px-1 py-1 focus:outline-none focus:ring-0 w-full dark:bg-inherit"
                        displayValue={(item: { id: string; value: string } | null) => item?.value || ''}
                        onChange={(event) => setQuery(event.target.value)}
                        placeholder={placeholder}
                    />
                    <ComboboxButton className="">
                        <ChevronUpDownIcon className="size-4 fill-slate/60 group-data-[hover]:fill-slate" />
                    </ComboboxButton>
                </div>
                
                <ComboboxOptions
                    anchor="bottom"
                    transition
                    className={`ml-2 origin-top transition duration-200 ease-out empty:invisible data-[closed]:opacity-0 dark:text-slate-50 z-[100000000000] rounded-sm bg-white border dark:border-strokedark dark:bg-boxdark overflow-hidden`}
                    style={{ width: 'calc(var(--input-width) + var(--button-width) + 10px)' }}
                >
                    {filteredData.length > 0 ? (
                        filteredData.map((item) => (
                            <ComboboxOption
                                key={item.id}
                                value={item}
                                className="group flex cursor-default items-center gap-2 py-1.5 px-2 select-none data-[focus]:bg-slate-300"
                            >
                                <CheckIcon className="invisible size-4 fill-slate group-data-[selected]:visible" />
                                <div className="">{item.value}</div>
                            </ComboboxOption>
                        ))
                    ) : (
                        <div className="px-2 py-1.5 text-slate-500">Aucun résultat trouvé</div> // Message si la liste est vide
                    )}
                </ComboboxOptions>
            </Combobox>
        </Field>
    );
}
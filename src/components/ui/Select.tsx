"use client"

import {
    Combobox,
    ComboboxButton,
    ComboboxInput,
    ComboboxOption,
    ComboboxOptions,
} from '@headlessui/react';
import { CheckIcon, ChevronDownIcon } from '@heroicons/react/20/solid';
import clsx from 'clsx';
import { useState } from 'react';

export interface SelectOption {
    label: string;
    value: string;
}

interface SelectProps {
    options: SelectOption[];
    value: SelectOption | null;
    onChange: (value: SelectOption | null) => void;
    placeholder?: string;
    className?: string;
}

export function Select({
    options,
    value,
    onChange,
    placeholder = 'Select...',
    className,
}: SelectProps) {
    const [query, setQuery] = useState('');
  
    const filteredOptions =
        query === ''
            ? options
            : options.filter((option) =>
                option.label.toLowerCase().includes(query.toLowerCase())
            );
  
    return (
        <div className={clsx('relative', className)}>
            <Combobox value={value} onChange={(v) => { onChange(v); setQuery(''); }}>
                <div className="relative">
                    <ComboboxInput
                        className="w-full rounded border border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        displayValue={(option: SelectOption | null) => option?.label ?? ''}
                        onChange={(event) => setQuery(event.target.value)}
                        placeholder={placeholder}
                    />
                    <ComboboxButton className="absolute inset-y-0 right-0 flex items-center px-2">
                        <ChevronDownIcon className="h-4 w-4 text-gray-400" />
                    </ComboboxButton>
                </div>
                
                <ComboboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 shadow-lg scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800">
                        {filteredOptions.length === 0 && query !== '' ? (
                            <div className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                                Aucun résultat trouvé.
                            </div>
                        ) : (
                            filteredOptions.map((option) => (
                                <ComboboxOption
                                    key={option.value}
                                    value={option}
                                    className={({ active, selected }) =>
                                        clsx(
                                            'cursor-default select-none px-4 py-2',
                                            active ? 'bg-blue-100 dark:bg-blue-600 text-black dark:text-white' : '',
                                            selected ? 'font-semibold' : ''
                                        )
                                    }
                                >
                                    {({ selected, active }) => (
                                        <div className="flex items-center gap-2">
                                            {selected && <CheckIcon className="h-4 w-4 text-blue-600 dark:text-white" />}
                                            <span className={clsx(
                                                active ? 'text-black dark:text-white' : 'text-gray-900 dark:text-gray-200'
                                            )}>
                                                {option.label}
                                            </span>
                                        </div>
                                    )}
                                </ComboboxOption>
                            ))
                        )}
                    </ComboboxOptions>
            </Combobox>
        </div>
    );
}
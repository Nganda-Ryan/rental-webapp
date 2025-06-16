'use client';

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

type Option = {
  value: string | number;
  label: string;
};

type SearchableSelectProps = {
  options: Option[];
  value: Option | null;
  onChange: (value: Option) => void;
  placeholder?: string;
};

export default function SearchableSelect({
  options,
  value,
  onChange,
  placeholder = 'Select...',
}: SearchableSelectProps) {
  const [query, setQuery] = useState('');

  const filteredOptions = query === '' ? options : options.filter((option) => option.label.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="relative">
        <Combobox value={value ?? null} onChange={(val) => { if (val) { onChange(val); } setQuery(''); }}>
        <div className="relative">
            <ComboboxInput
            className={clsx("input-base")}
            displayValue={(opt: Option) => opt?.label ?? ''}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            />
            <ComboboxButton className="absolute inset-y-0 right-0 px-2.5 flex items-center">
            <ChevronDownIcon className="h-4 w-4 text-gray-400 dark:text-gray-300" />
            </ComboboxButton>
        </div>

        <ComboboxOptions
            transition
            className={clsx(
            'z-10 max-h-60 w-full overflow-auto rounded bg-white dark:bg-gray-800 shadow-lg',
            'border border-gray-200 dark:border-gray-700 py-1 text-sm'
            )}
        >
            {filteredOptions.length === 0 && (
            <div className="px-3 py-2 text-gray-500 dark:text-gray-400">No results</div>
            )}
            {filteredOptions.map((option) => (
            <ComboboxOption
                key={option.value}
                value={option}
                className={({ active }) =>
                clsx(
                    'flex items-center px-3 py-2 cursor-pointer select-none',
                    active ? 'bg-blue-100 dark:bg-gray-700' : '',
                    'text-gray-900 dark:text-white'
                )
                }
            >
                {({ selected }) => (
                <>
                    <CheckIcon
                    className={clsx(
                        'mr-2 h-4 w-4',
                        selected ? 'visible' : 'invisible',
                        'text-blue-500'
                    )}
                    />
                    <span>{option.label}</span>
                </>
                )}
            </ComboboxOption>
            ))}
        </ComboboxOptions>
        </Combobox>
    </div>
  );
}
